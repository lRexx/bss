<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class System extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function clean_old_logs($days = 30)
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
        $allowed_ips = array('127.0.0.1', '10.84.5.2', '::1'); // add your admin IPs

        $client_ip = $this->input->ip_address();

        if (!in_array($client_ip, $allowed_ips)) {
            show_error('Unauthorized IP: '.$client_ip, 403);
            return;
        }
        $data = array(
        'timestamp' => date('c'),
        'app' => $this->getAppInfo(),
        'php' => $this->getPhpInfo(),
        'mysql' => $this->getMysqlInfo(),
        'linux' => $this->getLinuxInfo()
        );

        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    private function getAppInfo()
    {
        return array(
            'codeigniter_version' => CI_VERSION,
            'environment' => ENVIRONMENT,
            'base_url' => base_url()
        );
    }

    private function getPhpInfo()
    {
        return array(
            'version' => phpversion(),
            'sapi' => php_sapi_name(),
            'ini_file' => php_ini_loaded_file(),
            'timezone' => date_default_timezone_get(),
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'extensions' => get_loaded_extensions(),
            'limits' => array(
                'memory_limit' => ini_get('memory_limit'),
                'max_execution_time' => ini_get('max_execution_time'),
                'upload_max_filesize' => ini_get('upload_max_filesize'),
                'post_max_size' => ini_get('post_max_size')
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

        return array(
            'hostname' => gethostname(),
            'kernel' => php_uname(),
            'load_average' => function_exists('sys_getloadavg') ? sys_getloadavg() : null,
            'uptime' => $uptime,
            'cpu_cores' => $cores,
            'memory' => file_exists('/proc/meminfo') ? $this->parseMemInfo() : null,
            'disk_free' => disk_free_space('/'),
            'disk_total' => disk_total_space('/'),
            'user' => get_current_user()
        );
    }

    private function parseMemInfo()
    {
        $meminfo = file('/proc/meminfo');
        $result = array();

        foreach ($meminfo as $line) {
            list($key, $val) = explode(':', $line);
            $result[$key] = trim($val);
        }

        return array(
            'total' => $result['MemTotal'],
            'free' => $result['MemFree'],
            'available' => $result['MemAvailable']
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
}
