<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class System extends CI_Controller {

    public function __construct() {
        parent::__construct();
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
}