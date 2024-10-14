<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Modules_model extends CI_Model
{
	
	public function __construct()
	{
		parent::__construct();
    }
    

     public function get() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_modules")->get();


        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }


    

}
?>
