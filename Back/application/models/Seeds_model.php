<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Seeds_model extends CI_Model
{
	
	public function __construct()
	{
		parent::__construct();
    }
    

     public function getModules() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_modules")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
	 }
	 
	 public function getProductClassification() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_products_classification")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
	 }
	 
	 public function getDiviceOpening() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_divice_opening")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getTypeServices() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_client_type_services")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getClientType() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_client_type")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getCategoryDepartament() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_category_departament")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getCategoryKeyChains() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_category_keychain")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getTypeGps() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_type_gps")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getTypeMaintenance() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_type_maintenance")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getInternetCompany() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_internet_company")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getAlarmServicesAditionals() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_alarm_services_aditionals")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getTypeInternet() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_type_internet")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getServices() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_services")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getRouterInternet() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_router_internet")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }

     public function getTypeContratos() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_type_contrato")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }
     public function getMonitorCompany() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_monitor_company")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }
     public function getMonitorApplication() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_app_monitor_application")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }     
     public function getTotemModel() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_totem_model")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
     }
     public function getReasonDisabledKey() {
        $quuery = null;
        $rs = null;

        $quuery =  $this->db->select("*")->from("tb_reason_disabled_item")->get();
        if ($quuery->num_rows() > 0) {
            $rs = $quuery->result_array();
            return $rs;
        }
            return null;
	 }
	 

    

}
?>
