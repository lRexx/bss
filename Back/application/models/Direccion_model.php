<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Direccion_model extends CI_Model
{

	public function __construct ()
	{
		parent::__construct();
	}


	public function get ()
	{
		$quuery = null;
		$rs     = null;

		$quuery = $this->db->select("*")->from("tb_clients")->get();


		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}


	// GET DE LISTADO BUSQUEDA DE sucursales de una empresa //
//	public function companyByid ($id)
//	{
//		$quuery = null;
//		$rs     = null;


//		$this->db->select("*")->from("tb_clients");
////		$this->db->join('tb_addres', 'tb_addres.idCompanyKf = tb_company.idCompany', 'left');
////		$this->db->join('tb_clients', 'tb_clients.idClientCompaniFk = tb_company.idCompany', 'left');
//		$this->db->where("tb_clients.idClient =", $id);


//		$quuery = $this->db->order_by("tb_clients.address", "asc")->get();


//		if ($quuery->num_rows() > 0) {
//			$query1 = $this->db->select("*")->from("tb_company_type_keychains")->where("idCompanyKf", $id)->get();

//			$rs = $quuery->result_array();
//			if ($query1->num_rows() > 0) {
//				$companykeychains       = $query1->result_array();
//				$rs["companykeychains"] = $companykeychains;
//			}
//			return $rs;
//		}
//		return null;

//	}

	// GET listado de direcciones por el ID de la Empresa //
//	public function addressListByCompanyid ($id)
//	{
//		$quuery = null;
//		$rs     = null;
//
//
////		$this->db->select("*")->from("tb_addres");
////		$this->db->join('tb_company', 'tb_company.idCompany = tb_addres.idCompanyKf', 'left');
////		$this->db->where("tb_company.idCompany =", $id);
////
////
////		$quuery = $this->db->order_by("tb_addres.nameAdress", "asc")->get();
//
//		$this->db->select("*")->from("tb_clients");
////		$this->db->join('tb_company', 'tb_company.idCompany = tb_clients.idClientCompaniFk', 'left');
//		$quuery=$this->db->where("tb_clients.idClient =", $id)->get();
//
//		if ($quuery->num_rows() > 0) {
//			return $quuery->result_array();
//		}
//		return null;
//
//	}

	// Obtener Direccion  por el Codigo de Seguridad //
	public function getTheAddressBySecurityCode ($id)
	{
		$quuery = null;
		$rs     = null;


//            $this->db->select("*")->from("tb_addres");
//            $this->db->where("tb_addres.IdSecurityCode =", $id);

		$this->db->select("*")->from("tb_clients");
		$quuery = $this->db->where("tb_clients.IdSecurityCode =", $id)->get();

//            $quuery = $this->db->order_by("tb_clients.address", "asc")->get();


		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;

	}

	public function byidTenant ($id, $idDpto, $idStatus)
	{
		$quuery = null;
		$rs     = null;
		$this->db->select("*")->from("tb_clients");
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_clients.idClient', 'inner');
		if ($idDpto) {
			$this->db->join('tb_user', 'tb_user.idDepartmentKf = tb_client_departament.idClientDepartament', 'left'); //falta
		}
		$this->db->group_by('tb_clients.idClient'); //falta

		if (!$idDpto) {
			if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
				$this->db->where("tb_client_departament.isAprobatedAdmin =", 1);  //falta
			} else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
				$this->db->where("tb_client_departament.isAprobatedAdmin =", 0);  //falta
			}
			$quuery = $this->db->where("tb_client_departament.idUserKf =", $id)->get();
		} else if ($idDpto) {
			if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
				$this->db->where("tb_user.isDepartmentApproved =", 1);  //falta
			} else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
				$this->db->where("tb_user.isDepartmentApproved =", 0);  //falta
			}
			$quuery = $this->db->where("tb_user.idUser=" . $id . " and tb_user.idDepartmentKf=" . $idDpto)->get();  //falta
		}

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}
	public function addressByidTenant ($id, $idTypeTenant, $idStatus)
	{
		$quuery = null;
		$rs     = null;
		$this->db->select("B.*")->from("tb_clients AS B");
		$this->db->join('tb_clients AS A', 'A.idClient = B.idClientAdminFk', 'left');
		$this->db->join('tb_client_type', 'tb_client_type.idClientType = B.idClientTypeFk', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientFk = B.idClient', 'left');
		if ($idTypeTenant == 1){
			if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
				$this->db->where("tb_client_departament.isAprobatedAdmin =", 1);
			} else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
				$this->db->where("tb_client_departament.isAprobatedAdmin =", 0);
			}
			$this->db->group_by('B.idClient');
			$quuery = $this->db->where("tb_client_departament.idUserKf =", $id)->get();
		}else{
			$this->db->join('tb_user', 'tb_user.idDepartmentKf = tb_client_departament.idClientDepartament', 'left');
			if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
				$this->db->where("tb_user.isDepartmentApproved =", 1);
			} else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
				$this->db->where("tb_user.isDepartmentApproved =", 0);
			}
			$this->db->group_by('B.idClient');
			$quuery = $this->db->where("tb_user.idUser=" . $id)->get();
		}
		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			$i = 0;
			foreach ($quuery->result() as &$row) {

				$this->db->select("*")->from("tb_clients");
				$quuery = $this->db->where("tb_clients.idClient =", $row->idClientAdminFk)->get();

				$rs1                              = $quuery->result_array();
				$rs[$i]['administration'] = $rs1[0];
				
				$i++;
			}

			return $rs;
		}
		return null;
	}

	public function checkIfAddressIsInDebt ($id)
	{
		$quuery = null;
		$rs     = null;

		$this->db->select("*")->from("tb_clients");

		$quuery = $this->db->where("tb_clients.IsInDebt=1 AND tb_clients.idClient=" . $id)->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->num_rows();
		} else {
			$rs = 0;
		}
		return $rs;

	}


}

?>
