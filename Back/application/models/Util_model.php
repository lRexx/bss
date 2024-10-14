<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Util_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->helper(array('form', 'url'));
    }

    public function getClientType() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_client_type")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getAgent() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_agents")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getCostCenter() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_client_cost_center")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getLocalidad($idProvinceFk) {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_location")
            ->where("tb_location.idProvinceFk =", $idProvinceFk)
            ->order_by("tb_location.location")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getLocationsZone($idProvinceFk) {

        $query = null;
        $rs    = null;
        $where = null;
        $where = "tb_location.idLocation NOT IN (select tb_zona_location.idLocationKf from tb_zona_location) AND tb_location.idProvinceFK =$idProvinceFk";
        $query = $this->db->select("*")->from("tb_location")
            ->where($where)
            ->order_by("tb_location.location")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getAllLocalidades() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_location")
        ->order_by("tb_location.location")
        ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getProvincia() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_province")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getTaxtype() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_tax")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getCategoryDepartament() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_category_departament")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getDetinationLicense() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_detination_of_license")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getDepartmentByCustomerId($id) {

        $query = null;
        $rs    = null;
        $select="tb_client_departament.idClientDepartament AS idDepto, 
                    UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto,
                    tb_clients.idClient AS idBuilding,
                    tb_clients.name AS Building,
                    tb_client_departament.idCategoryDepartamentFk";
        $where="tb_client_departament.idClientFk=".$id." AND tb_client_departament.idStatusFk<>0";
        $this->db->select($select)->from("tb_client_departament");
        $query = $this->db->join('tb_clients', 'tb_client_departament.idClientFk = tb_clients.idClient', 'left')
            ->where($where)->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function getCustomerIdByDepartmentsId($id) {

        $query = null;
        $rs    = null;
        $query = $this->db->select("*")->from("tb_client_departament")
            ->where("tb_client_departament.idClientDepartament =", $id)
            ->get();
 
        $rs = $query->result_array();
        if ($query->num_rows() > 0) {
            $rs = $query->row();
            $rs= $this->getDepartmentByCustomerId($rs->idClientFk);
            return $rs;
        }          

    }    
    public function getTipoInmueble() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_tipo_inmueble")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function getTypeOfMails() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_tipo_mails")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function getAdressClientEdificio() {

        $query = null;
        $rs    = null;
        $query = $this->db->select("tb_clients.`idClient`, tb_clients.`address`,
              tb_clients.`isNotCliente`,
              tb_clients.`addressLon`,
              tb_clients.`addressLat`,
              tb_clients.`idLocationFk`,
              tb_clients.`idProvinceFk`,
              tb_location.`location`,
              tb_province.`province`")
            ->from("tb_clients,tb_location,tb_province")
            ->where("tb_clients.idLocationFk = `tb_location`.`idLocation`
              AND tb_clients.idProvinceFk = tb_province.`idProvince`
              AND tb_clients.`idClientTypeFk` = 2")
            ->get();

        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getTypeServicesInternet() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_tipos_servicios_internet")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function getTypeOperatingSystem() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_sistemas_operativos")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getTipeConetionRemote() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_tipo_conexion_remoto")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getTypeAlarmClient() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_alarm_type_client")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getAlarmServicesAditionals() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_alarm_services_aditionals")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function getFormatoTransmision() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_formato_transmision")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function upload_post() {

        $rs = $this->util_model->upload($this->post('image_file'));
        if (!is_null($rs)) {
            $this->response("Uploaded", 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function typeTechnicianServices() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_technician_services_type")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
    public function typeReasonDownServices() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_client_service_reason_down")
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }
}

?>