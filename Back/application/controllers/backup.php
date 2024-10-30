<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Backup extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->dbutil();
    }

    public function database_backup() {
        $bkp_path 	= realpath(APPPATH . '../../backups');
        $prefs = array(
            'format' => 'zip',
            'filename' => 'my_db_backup.sql'
        );

        $backup = $this->dbutil->backup($prefs);

        $this->load->helper('file');
        write_file('/path/to/backup/my_db_backup.zip', $backup);

        $this->load->helper('download');
        force_download('my_db_backup.zip', $backup);
    }
}