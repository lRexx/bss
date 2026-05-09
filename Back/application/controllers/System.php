<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class System extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('url');
        $this->load->model('mail_model');
        require_once APPPATH . "third_party/PHPExcel/PHPExcel.php";
        require_once APPPATH . "third_party/PHPExcel/PHPExcel/IOFactory.php";
    }

    public function clean_old_logs($days = 60)
    {
        log_message('info', ':::::::::::::::::LogsRotation');
        $log_path = APPPATH . 'logs/';
        $files = scandir($log_path);
        $now = time();
        $deleted_any = false;

        log_message('info', 'Limpieza de logs mayores a ' . $days . ' días');

        foreach ($files as $file) {
            $full_path = $log_path . $file;

            if (is_file($full_path) && strpos($file, 'log-') === 0) {
                $file_time = filemtime($full_path);
                if ($now - $file_time > ($days * 86400)) {
                    if (unlink($full_path)) {
                        log_message('info', "Archivo eliminado: $file");
                        $deleted_any = true;
                    } else {
                        log_message('error', "ERROR al eliminar: $file");
                    }
                }
            }
        }

        if (!$deleted_any) {
            log_message('info', 'No hay archivos logs que requieran rotación.');
        }

        log_message('info', ':::::::::::::::::LogsRotation ::: SUCCEEDED');
    }

    public function index()
    {
        $allowed_ips = array('127.0.0.1', '0.0.0.0', '10.84.5.2', '::1'); // add your admin IPs

        $client_ip = $this->input->ip_address();

        if (!in_array($client_ip, $allowed_ips)) {
            show_error('Unauthorized IP: '.$client_ip, 403);
            return;
        }
        $data = array(
        'timestamp' => date('c'),
        'apache' => $this->getApacheInfo(),
        'app' => $this->getAppInfo(),
        'php' => $this->getPhpInfo(),
        'mysql' => $this->getMysqlInfo(),
        'linux' => $this->getLinuxInfo()
        );

        if (is_cli()) {
            echo json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL;
        } else {
            header('Content-Type: application/json');
            echo json_encode($data, JSON_PRETTY_PRINT);
        }
    }

    private function getAppInfo()
    {
        $base = function_exists('base_url') ? base_url() : null;

        return array(
            'codeigniter_version' => CI_VERSION,
            'environment' => ENVIRONMENT,
            'base_url' => $base
        );
    }

    private function getPhpInfo()
    {
        // helper to convert shorthand sizes (e.g. 20M) to bytes
        $toBytes = function ($val) {
            $val = trim($val);
            $last = strtolower($val[strlen($val)-1]);
            $num = (int)$val;

            switch ($last) {
                case 'g': $num *= 1024;
                case 'm': $num *= 1024;
                case 'k': $num *= 1024;
            }

            return $num;
        };

        $extensions = get_loaded_extensions();
        sort($extensions);

        $uploadMax = ini_get('upload_max_filesize');
        $postMax   = ini_get('post_max_size');
        $memoryMax = ini_get('memory_limit');

        return array(
            'version' => phpversion(),
            'sapi' => php_sapi_name(),
            'execution_context' => (php_sapi_name() === 'cli') ? 'CLI' : 'WEB',

            'config' => array(
                'ini_loaded_file' => php_ini_loaded_file(),
                'ini_scanned_files' => php_ini_scanned_files()
            ),

            'environment' => array(
                'timezone' => date_default_timezone_get(),
                'current_user' => get_current_user(),
                'temp_dir' => sys_get_temp_dir()
            ),

            'memory' => array(
                'usage_bytes' => memory_get_usage(true),
                'peak_bytes' => memory_get_peak_usage(true),
                'limit_raw' => $memoryMax,
                'limit_bytes' => $toBytes($memoryMax)
            ),

            'limits' => array(
                'max_execution_time' => ini_get('max_execution_time'),
                'upload_max_filesize_raw' => $uploadMax,
                'upload_max_filesize_bytes' => $toBytes($uploadMax),
                'post_max_size_raw' => $postMax,
                'post_max_size_bytes' => $toBytes($postMax)
            ),

            'opcache' => function_exists('opcache_get_status')
                ? @opcache_get_status(false)
                : 'not_available',

            'extensions' => array(
                'count' => count($extensions),
                'list' => $extensions
            )
        );
    }


    private function getMysqlInfo()
    {
        $db = $this->db;

        $vars = $db->query("SHOW VARIABLES")->result_array();
        $status = $db->query("SHOW STATUS")->result_array();

        return array(
            'version' => $db->query("SELECT VERSION() as v")->row()->v,
            'uptime' => $this->findValue($status, 'Uptime'),
            'threads_connected' => $this->findValue($status, 'Threads_connected'),
            'max_connections' => $this->findValue($vars, 'max_connections'),
            'innodb_buffer_pool_size' => $this->findValue($vars, 'innodb_buffer_pool_size')
        );
    }

    private function getLinuxInfo()
    {
        $uptime = function_exists('shell_exec') ? trim(@shell_exec('uptime -p')) : null;
        $cores  = function_exists('shell_exec') ? (int) @shell_exec('nproc') : null;

        $diskFreeBytes = disk_free_space('/');
        $diskTotalBytes = disk_total_space('/');

        $bytesToMB = function ($bytes) {
            return round($bytes / 1024 / 1024, 2);
        };

        $bytesToGB = function ($bytes) {
            return round($bytes / 1024 / 1024 / 1024, 2);
        };

        $diskUsedBytes = $diskTotalBytes - $diskFreeBytes;
        $diskUsagePct = $diskTotalBytes > 0
            ? round(($diskUsedBytes / $diskTotalBytes) * 100, 2)
            : null;

        return array(
            'hostname' => gethostname(),
            'kernel' => php_uname(),
            'load_average' => function_exists('sys_getloadavg') ? sys_getloadavg() : null,
            'uptime' => $uptime,
            'cpu_cores' => $cores,
            'memory' => file_exists('/proc/meminfo') ? $this->parseMemInfo() : null,

            'disk' => array(
                'free_mb' => $bytesToMB($diskFreeBytes),
                'total_mb' => $bytesToMB($diskTotalBytes),
                'used_mb' => $bytesToMB($diskUsedBytes),

                'free_gb' => $bytesToGB($diskFreeBytes),
                'total_gb' => $bytesToGB($diskTotalBytes),
                'used_gb' => $bytesToGB($diskUsedBytes),

                'usage_percent' => $diskUsagePct,

                // raw values for debugging
                'raw_bytes' => array(
                    'free' => $diskFreeBytes,
                    'total' => $diskTotalBytes,
                    'used' => $diskUsedBytes
                )
            ),

            'user' => get_current_user()
        );
    }

    private function getApacheInfo()
    {
        $apachectl = '/usr/sbin/apache2ctl';
        if (!file_exists($apachectl)) {
            $apachectl = trim(shell_exec('which apache2ctl'));
        }

        $result = array(
            'php_sapi' => php_sapi_name(),
            'binary_exists' => file_exists($apachectl),
            'binary_path' => $apachectl,
            'version' => null,
            'mpm' => null,
            'modules' => null
        );

        if (!function_exists('shell_exec') || !$result['binary_exists']) {
            return $result;
        }

        // Get version/build info
        $build = @shell_exec("$apachectl -V 2>/dev/null");
        if ($build) {
            $result['version'] = trim(preg_match('/Server version:.*/', $build, $m) ? $m[0] : null);
            $result['mpm'] = trim(preg_match('/Server MPM:\s*(.*)/', $build, $m) ? $m[1] : null);
        }

        // Get loaded modules
        $modules = @shell_exec("$apachectl -M 2>/dev/null");
        if ($modules) {
            $lines = array_filter(array_map('trim', explode("\n", $modules)));
            $result['modules'] = $lines;
        }

        return $result;
    }


    private function parseMemInfo()
    {
        if (!is_readable('/proc/meminfo')) {
            return array('error' => '/proc/meminfo not readable');
        }

        $meminfo = file('/proc/meminfo');
        $result = array();

        foreach ($meminfo as $line) {
            list($key, $val) = explode(':', $line);

            // extract numeric value in kB
            $kb = (int) filter_var($val, FILTER_SANITIZE_NUMBER_INT);

            $result[$key] = array(
                'kb' => $kb,
                'mb' => round($kb / 1024, 2)
            );
        }

        return array(
            'total_mb'     => $result['MemTotal']['mb'],
            'free_mb'      => $result['MemFree']['mb'],
            'available_mb' => $result['MemAvailable']['mb'],

            // optional: keep raw values for diagnostics
            'raw_kb' => array(
                'total'     => $result['MemTotal']['kb'],
                'free'      => $result['MemFree']['kb'],
                'available' => $result['MemAvailable']['kb']
            )
        );
    }


    private function findValue($array, $name)
    {
        foreach ($array as $row) {
            if ($row['Variable_name'] === $name) {
                return $row['Value'];
            }
        }
        return null;
    }

    public function send_pending_billing_report()
    {
        log_message('info', ':::::::::::::::::PendingBillingReport');

        try {

            ini_set('memory_limit', '1024M');
            set_time_limit(0);

            /*
            |--------------------------------------------------------------------------
            | QUERY VIEW
            |--------------------------------------------------------------------------
            */
            $query = $this->db->query("
                SELECT *
                FROM verPedidosPendientesPorFacturar
            ");

            $rows = $query->result_array();

            if (empty($rows)) {

                log_message(
                    'info',
                    'No hay pedidos pendientes por facturar.'
                );

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | CREATE EXCEL
            |--------------------------------------------------------------------------
            */
            $objPHPExcel = new PHPExcel();

            $objPHPExcel->setActiveSheetIndex(0);

            $sheet = $objPHPExcel->getActiveSheet();

            $sheet->setTitle('Pendientes Facturar');

            /*
            |--------------------------------------------------------------------------
            | HEADERS
            |--------------------------------------------------------------------------
            */
            $headers = array_keys($rows[0]);

            $col = 0;

            foreach ($headers as $header) {

                $sheet->setCellValueByColumnAndRow(
                    $col,
                    1,
                    $header
                );

                $col++;
            }

            /*
            |--------------------------------------------------------------------------
            | HEADER STYLE
            |--------------------------------------------------------------------------
            */
            $highestColumn = $sheet->getHighestColumn();

            $sheet->getStyle('A1:' . $highestColumn . '1')
                ->getFont()
                ->setBold(true);

            /*
            |--------------------------------------------------------------------------
            | DATA
            |--------------------------------------------------------------------------
            */
            $rowNumber = 2;

            foreach ($rows as $row) {

                $col = 0;

                foreach ($headers as $header) {

                    $sheet->setCellValueByColumnAndRow(
                        $col,
                        $rowNumber,
                        $row[$header]
                    );

                    $col++;
                }

                $rowNumber++;
            }

            /*
            |--------------------------------------------------------------------------
            | AUTOSIZE COLUMNS
            |--------------------------------------------------------------------------
            */
            for ($col = 0; $col < count($headers); $col++) {

                $columnID = PHPExcel_Cell::stringFromColumnIndex($col);

                $sheet->getColumnDimension($columnID)
                    ->setAutoSize(true);
            }

            /*
            |--------------------------------------------------------------------------
            | FREEZE HEADER
            |--------------------------------------------------------------------------
            */
            $sheet->freezePane('A2');

            /*
            |--------------------------------------------------------------------------
            | SAVE FILE
            |--------------------------------------------------------------------------
            */
            $filename = 'PedidosPendientesFacturar_' .
                        date('Ymd') .
                        '.xlsx';

            $filepath = APPPATH . 'cache/' . $filename;

            $objWriter = PHPExcel_IOFactory::createWriter(
                $objPHPExcel,
                'Excel2007'
            );

            $objWriter->save($filepath);

            /*
            |--------------------------------------------------------------------------
            | VALIDATE FILE
            |--------------------------------------------------------------------------
            */
            if (!file_exists($filepath)) {

                throw new Exception(
                    'Excel file was not generated.'
                );
            }

            $fileSize = filesize($filepath);

            log_message(
                'info',
                'Excel SIZE: ' . $fileSize . ' bytes'
            );

            if ($fileSize <= 0) {

                throw new Exception(
                    'Excel file generated with invalid size.'
                );
            }

            log_message(
                'info',
                'Excel generado correctamente: ' . $filepath
            );

            /*
            |--------------------------------------------------------------------------
            | EMAIL DATA
            |--------------------------------------------------------------------------
            */
            $title = 'Pedidos Pendientes por Facturar';

            $to = [
                'leandro@bss.com.ar'
            ];
            $cc = [
                'contacto@bss.com.ar'
            ];

            $subject = 'Pedidos Pendientes por Facturar';

            $body = '<tr width="100%" bgcolor="#ffffff">';
            $body .= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">';
            $body .= '
                <h2>Reporte Automatizado</h2>

                <p>
                    Se adjunta el reporte de pedidos pendientes por facturar.
                </p>

                <p>
                    <b>Cantidad registros:</b> ' . count($rows) . '
                </p>

                <p>
                    <b>Fecha generación:</b>
                    ' . date('Y-m-d H:i:s') . '
                </p>
            ';
            $body .= '</td>';
            $body .= '</tr>';
            $body .= '<tr width="100%" bgcolor="#ffffff">';
            $body .= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">';
            $body .= '
                <p>
                    <i>Este es un correo automático, por favor no responder.</i>
                </p>';
            $body .= '</td>';
            $body .= '</tr>';
            /*
            |--------------------------------------------------------------------------
            | SEND EMAIL
            |--------------------------------------------------------------------------
            */
            $mailSent = $this->mail_model->sendMailAttachment(
                $title,
                $to,
                $cc,
                $body,
                $subject,
                [$filepath]
            );

            if ($mailSent) {

                log_message(
                    'info',
                    'Correo enviado correctamente a ' . implode(', ', $to)
                );

            } else {

                log_message(
                    'error',
                    'ERROR enviando correo.'
                );

            }

            /*
            |--------------------------------------------------------------------------
            | DELETE TEMP FILE
            |--------------------------------------------------------------------------
            */
            if (file_exists($filepath)) {

                unlink($filepath);

                log_message(
                    'info',
                    'Archivo ' . $filepath . ' temporal eliminado.'
                );
            }

            log_message(
                'info',
                ':::::::::::::::::PendingBillingReport ::: SUCCEEDED'
            );

        } catch (Exception $e) {

            log_message(
                'error',
                'PendingBillingReport ERROR: ' .
                $e->getMessage()
            );
        }
    }

}
