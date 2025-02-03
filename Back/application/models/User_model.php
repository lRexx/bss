<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class User_model extends CI_Model
{

	public function __construct ()
	{
		parent::__construct();
	}
	function encode($x) { 
		return strtr(base64_encode(substr($_SESSION['Cksum'],rand(0,28),4) . $x), '+/=', '-_~');
	} 
	
	function decode($x) { 
		$y = base64_decode(strtr($x, '-_~', '+/='));
		if (strpos($_SESSION['Cksum'],substr($y,0,4)) === false) return false; 
		return substr($y,4-strlen($y)); 
	}
	public function auth ($user)
	{
		//se inicia sesion por mail o por dni
		//echo(sha1(md5($user['passwordUser'])));

		//return sha1(md5($user['']));

		/* verificamos el usuario  */
		$this->db->select("*")->from("tb_user");
		//$this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
		//$this->db->join('tb_company', 'tb_company.idCompany = tb_user.idCompanyKf', 'left');
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
		$this->db->where("passwordUser =", sha1(md5($user['passwordUser'])));
		$this->db->group_start();
		$this->db->where("emailUser", $user['fullNameUser']);
		$this->db->or_where("dni", $user['fullNameUser']);
		$this->db->group_end();
		$query = $this->db->get();


		if ($query->num_rows() == 1) {

			$user = $query->row_array();
				$idProfile = null;
				$idProfile = $user['idProfileKf'];
				$idProfiles = $user['idSysProfileFk'];
				$query2    = null;
				if (isset($idProfiles) && !is_null($idProfiles) && $idProfiles > 0) {
					// Buscamos los perfiles de sistema //
					$this->db->select("*")->from("tb_profiles");
					$quuery = $this->db->where("tb_profiles.idProfiles =", $idProfiles)->get();
					if ($quuery->num_rows() === 1) {
						$rs = $quuery->row_array();
	
						$this->db->select("*")->from("tb_profiles_modules");
						$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
						$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $idProfiles)->get();
	
						$rs2 = $quuery->result_array();
	
						$user['modules'] = $rs2;
					}
					if (($idProfile == 2) && ($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] == '') || ($idProfile == 4) && (($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] == '') || ($user['idTypeTenantKf'] != null && $user['idTypeTenantKf'] != ''))) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $user['idCompanyKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['company'] = $query2->result_array();
						}
					}
					if ($idProfile == 5 || ($idProfile == 4 && $user['idTypeTenantKf'] == 2) || ($idProfile == 6 && $user['idTyepeAttendantKf'] != 1 && $user['idTypeTenantKf'] == 2)) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $user['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['building'] = $query2->result_array();
						}
					}
					if ($idProfile == 6 && $user['idTyepeAttendantKf'] != null && ($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] != null)) {
						$query2    = null;
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $user['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['building'] = $query2->result_array();
						}
					}
					if (($idProfile == 4 || $idProfile == 6) && $user['idTypeTenantKf'] == 1) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $user['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['building'] = $query2->result_array();
						}
					}
					if ($idProfile == 3 || ($idProfile == 4 && $user['idTypeTenantKf'] == 1) || ($idProfile == 6 && $user['idTypeTenantKf'] == 1)) {
						$query2 = $this->db->select("*")->from("tb_client_departament");
						$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
						$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
						$query2 = $this->db->where('idUserKf', $user['idUser']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['deptos'] = $query2->result_array();
						}
					}
					if ($idProfile == 5 || ($idProfile == 4 && $user['idTypeTenantKf'] == 2) || ($idProfile == 6 && $user['idTyepeAttendantKf'] != 1 && $user['idTypeTenantKf'] == 2)) {
						$query2 = $this->db->select("*")->from("tb_client_departament");
						$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
						$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
						$query2 = $this->db->where('idClientDepartament', $user['idDepartmentKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user['deptos'] = $query2->result_array();
						}
					}
				}
			return $user;
		} else {
			return null;
		}
	}


	// GET DE USUARIO NO ASOCIADOS A NINGUN DEPARTAMENTO//
	public function usernoregister ($id)
	{
		$query = null;
		$rs    = [];
		$arrList1 = null;
		$arrList2 = null;

		$sqlOwner = "
			SELECT DISTINCT * from tb_user as t1
			LEFT JOIN tb_profile ON tb_profile.idProfile = t1.idProfileKf
			LEFT JOIN tb_profiles ON tb_profiles.idProfiles = t1.idSysProfileFk 
			LEFT JOIN tb_typetenant ON tb_typetenant.idTypeTenant = t1.idTypeTenantKf 
			LEFT JOIN tb_status ON tb_status.idStatusTenant = t1.idStatusKf 
			LEFT JOIN tb_type_attendant ON tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf 
			where idUser NOT in
			(SELECT distinct idUserKf as id from tb_client_departament as tbaux1 where tbaux1.idClientDepartament=$id AND
			tbaux1.idUserKf != '' )
			AND t1.idStatusKf != -1 AND t1.idTypeTenantKf in (1);";
		$sqlTenant = "
			SELECT DISTINCT * from tb_user as t1
			LEFT JOIN tb_profile ON tb_profile.idProfile = t1.idProfileKf
			LEFT JOIN tb_profiles ON tb_profiles.idProfiles = t1.idSysProfileFk 
			LEFT JOIN tb_typetenant ON tb_typetenant.idTypeTenant = t1.idTypeTenantKf 
			LEFT JOIN tb_status ON tb_status.idStatusTenant = t1.idStatusKf
			LEFT JOIN tb_type_attendant ON tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf 
			WHERE ISNULL(t1.idDepartmentKf) AND t1.idStatusKf != -1 AND t1.idTypeTenantKf in (2);";

			$query1 = $this->db->query($sqlOwner);
			$query2 = $this->db->query($sqlTenant);
		if ($query1->num_rows() > 0 || $query2->num_rows() > 0) {
			 $arrList1 = $query1->result_array();
			 
			 $arrList2 = $query2->result_array();
			 
			 $rs = array_merge($arrList1,$arrList2);
			return $rs;
		}

		return null;


	}
	public function attendantsNotBuildingAssigned(){
		$query = null;
		$rs    = [];
        /* LISTADO DE ENCARGADOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $where = "tb_user.idProfileKf = 6 AND ISNULL(tb_user.idAddresKf)";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "ASC")->get();
		if ($query->num_rows() > 0) {
			$rs = $query->result_array();
			return $rs;
		}
		return null;
	}

	// GET DE LISTADO BUSQUEDA DE USUARIO //
	public function get ($id = null, $searchFilter = null)
	{
		$quuery = null;
		$rs     = null;
		// SI RECIBIMOS EL ID DE EL USUARIO //
		if (!is_null($id)) {
			$this->db->select("*")->from("tb_user");
			$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
			$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
			$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
			$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
			$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
			$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
			$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
			$this->db->where("tb_user.idStatusKf !=", -1);
			$quuery = $this->db->where("tb_user.idUser = ", $id)->get();

			if ($quuery->num_rows() == 1) {

				$user = $quuery->row_array();
					$idProfile = null;
					$idProfile = $user['idProfileKf'];
					$idProfiles = $user['idSysProfileFk'];
					$query2    = null;
					if (isset($idProfiles) && !is_null($idProfiles) && $idProfiles > 0) {
						// Buscamos los perfiles de sistema //
						$this->db->select("*")->from("tb_profiles");
						$quuery = $this->db->where("tb_profiles.idProfiles =", $idProfiles)->get();
						if ($quuery->num_rows() === 1) {
							$rs = $quuery->row_array();
		
							$this->db->select("*")->from("tb_profiles_modules");
							$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
							$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $idProfiles)->get();
		
							$rs2 = $quuery->result_array();
		
							$user['modules'] = $rs2;
						}
						if (($idProfile == 2) && ($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] == '') || ($idProfile == 4) && (($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] == '') || ($user['idTypeTenantKf'] != null && $user['idTypeTenantKf'] != ''))) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $user['idCompanyKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['company'] = $query2->result_array();
							}
						}
						if ($idProfile == 5 || ($idProfile == 4 && $user['idTypeTenantKf'] == 2) || ($idProfile == 6 && $user['idTyepeAttendantKf'] != 1 && $user['idTypeTenantKf'] == 2)) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $user['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['building'] = $query2->result_array();
							}
						}
						if ($idProfile == 6 && $user['idTyepeAttendantKf'] != null && ($user['idTypeTenantKf'] == null || $user['idTypeTenantKf'] != null)) {
							$query2    = null;
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $user['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['building'] = $query2->result_array();
							}
						}
						if (($idProfile == 4 || $idProfile == 6) && $user['idTypeTenantKf'] == 1) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $user['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['building'] = $query2->result_array();
							}
						}
						if ($idProfile == 3 || ($idProfile == 4 && $user['idTypeTenantKf'] == 1) || ($idProfile == 6 && $user['idTypeTenantKf'] == 1)) {
							$query2 = $this->db->select("*")->from("tb_client_departament");
							$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
							$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
							$query2 = $this->db->where('idUserKf', $user['idUser']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['deptos'] = $query2->result_array();
							}
						}
						if ($idProfile == 5 || ($idProfile == 4 && $user['idTypeTenantKf'] == 2) || ($idProfile == 6 && $user['idTyepeAttendantKf'] != 1 && $user['idTypeTenantKf'] == 2)) {
							$query2 = $this->db->select("*")->from("tb_client_departament");
							$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
							$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
							$query2 = $this->db->where('idClientDepartament', $user['idDepartmentKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user['deptos'] = $query2->result_array();
							}
						}
					}
				return $user;
			}
		} else {
			$this->db->select("*")->from("tb_user");
			$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
			$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
			$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
			$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
			$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
			$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
			$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
			$this->db->where("tb_user.idStatusKf !=", -1);


			/* Busqueda por filtro */
			if (!is_null($searchFilter['searchFilter'])) {
				$this->db->like('tb_user.fullNameUser', $searchFilter['searchFilter']);
				$this->db->or_like('tb_user.emailUser', $searchFilter['searchFilter']);
				$this->db->or_like('tb_user.phoneNumberUser', $searchFilter['searchFilter']);
				$this->db->or_like('tb_user.phoneLocalNumberUser', $searchFilter['searchFilter']);
			}


			// Si recibimos un limite //
			if ($searchFilter['topFilter'] > 0) {
				$this->db->limit($searchFilter['topFilter']);
			}
			$quuery = $this->db->order_by("tb_user.idUser", "ASC")->get();
			if ($quuery->num_rows() > 0) {
				$user = $quuery->result_array();
				foreach ($user as $key => $item) {
					$idProfile = null;
					$idProfile = $item['idProfileKf'];
					$idProfiles = $item['idSysProfileFk'];
					$query2    = null;
					if (isset($idProfiles) && !is_null($idProfiles) && $idProfiles > 0) {
						// Buscamos los perfiles de sistema //
						$this->db->select("*")->from("tb_profiles");
						$quuery = $this->db->where("tb_profiles.idProfiles =", $idProfiles)->get();
						if ($quuery->num_rows() === 1) {
							$rs = $quuery->row_array();
		
							$this->db->select("*")->from("tb_profiles_modules");
							$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
							$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $idProfiles)->get();
		
							$rs2 = $quuery->result_array();
		
							$user[$key]['modules'] = $rs2;
						}
						if (($idProfile == 2) && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($idProfile == 4) && (($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($item['idTypeTenantKf'] != null && $item['idTypeTenantKf'] != ''))) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $item['idCompanyKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['company'] = $query2->result_array();
							}
						}
						if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $item['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['building'] = $query2->result_array();
							}
						}
						if ($idProfile == 6 && $item['idTyepeAttendantKf'] != null && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] != null)) {
							$query2    = null;
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $item['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['building'] = $query2->result_array();
							}
						}
						if (($idProfile == 4 || $idProfile == 6) && $item['idTypeTenantKf'] == 1) {
							$query2 = $this->db->select("*")->from("tb_clients");
							$query2 = $this->db->where('idClient', $item['idAddresKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['building'] = $query2->result_array();
							}
						}
						if ($idProfile == 3 || ($idProfile == 4 && $item['idTypeTenantKf'] == 1) || ($idProfile == 6 && $item['idTypeTenantKf'] == 1)) {
							$query2 = $this->db->select("*")->from("tb_client_departament");
							$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
							$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
							$query2 = $this->db->where('idUserKf', $item['idUser']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['deptos'] = $query2->result_array();
							}
						}
						if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
							$query2 = $this->db->select("*")->from("tb_client_departament");
							$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
							$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
							$query2 = $this->db->where('idClientDepartament', $item['idDepartmentKf']);
							$query2 = $this->db->get();
							if ($query2->num_rows() > 0) {
								$user[$key]['deptos'] = $query2->result_array();
							}
						}
					}
				}
				return $user;
			}
			return null;
		}
	}


	/* AGRAGR NUEVO USUARIO DE CUALQUIER TIPO */
	public function add ($user)
	{

		if ($this->findUserByEmail($user['dni']) == null) {
			$tokenMail            = $this->generateRandomString();
			$ramdonPwd            = $this->get_random_password($chars_min=12);
			$isDepartmentApproved = null;
			$idStatusKfByAdmin    = null;
			/*if (@$user['idTypeTenantKf'] != 1 && @$user['idDepartmentKf'] && (@$user['isCreateByAdmin'] || @$user['isCreateByOwner'])) {
				$isDepartmentApproved = 1;
			} else {
				$isDepartmentApproved = null;
			}*/
			if (@$user['idTyepeAttendantKf'] != 0 && @$user['isCreateByAdmin']) {
				$idStatusKfByAdmin = 1;
			} else {
				$idStatusKfByAdmin = 0;
			}
			/* CREAMOS UN USUARIO */
			$this->db->insert('tb_user', array(
					'fullNameUser'          => $user['fullNameUser'],
					'emailUser'             => $user['emailUser'],
					'phoneNumberUser'       => $user['phoneNumberUser'],
					'phoneLocalNumberUser'  => @$user['phoneLocalNumberUser'],
					'idAddresKf'            => @$user['idAddresKf'],
					'passwordUser'          => sha1(md5($ramdonPwd)),
					'idProfileKf'           => $user['idProfileKf'],
					'idTypeTenantKf'        => $user['idTypeTenantKf'],
					'idStatusKf'            => 0,
					'idCompanyKf'           => @$user['idCompanyKf'],
					'idTyepeAttendantKf'    => @$user['idTyepeAttendantKf'],
					'descOther'             => @$user['descOther'],
					'idDepartmentKf'        => @$user['idDepartmentKf'],
					'isDepartmentApproved'  => $isDepartmentApproved,
					'isEdit'                => @$user['isEdit'],
					'requireAuthentication' => @$user['requireAuthentication'],
					'resetPasword'          => 1,
					'tokenMail'             => $tokenMail,
					'dni'                   => $user['dni'],
					'idSysProfileFk'        => @$user['idSysProfileFk']
				)
			);


			if ($this->db->affected_rows() === 1) {
				$idUser = $this->db->insert_id();
				// VALIDAMOS SI EL USER ESTA SIENDO CREADO POR UN ADMIN //
				if (@$user['isCreateByAdmin']) {

					$this->db->set(
						array(
							'isConfirmatedMail' => 1,
							'idStatusKf'        => 1
						)
					)->where("idUser", $idUser)->update("tb_user");
				}
				$userRs = null;
                $building = null;
                $title = null;
                $subject = null;
                $body = null;
				$to = null;
				$currentURL = "https://".BSS_HOST; //for simple URL
				$this->db->select("*")->from("tb_user");
				$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
				$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
				$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
				$query = $this->db->where("tb_user.idUser = ", $idUser)->get();

				if ($query->num_rows() > 0) {
					$userRs = $query->row_array();
					#MAIL
					$to = $userRs['emailUser'];
					$title = "Nuevo Usuario";
					$subject="Registro de usuario";
					$body='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$userRs['fullNameUser'].'</b>,</td>'; 
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Su cuenta ha sido creada satisfactoriamente.</td>';
					$body.='</tr>';
					if ($userRs['isConfirmatedMail'] == null || $userRs['isConfirmatedMail'] == 0){
						$body.='<tr width="100%" bgcolor="#ffffff">';
						$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:2%;padding-bottom:2%;">Antes de ingresar debe confirmar su dirección de correo a través del siguiente link: <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/validate/token/'. $tokenMail . '" target="_blank" title="Confirmar correo" style="text-decoration: none; color: #fff;">Confirmar</a></span></td>';
						$body.='</tr>';	
					}else if ($userRs['isConfirmatedMail'] == 1 && $userRs['idStatusKf'] == 1){
						$body.='<tr width="100%" bgcolor="#ffffff">';
						$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:2%;padding-bottom:2%;">Su cuenta de usuario se encuentra <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$userRs['statusTenantName']. '</span></td>';
						$body.='</tr>';	
					}
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:2%;padding-bottom:2%;">Contraseña: <b>' . $ramdonPwd .'</b></td>';
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%">En el proximo inicio de sesión el sistema solicitara el cambio de su contraseña &nbsp;</td>';
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
					$body.='</tr>';	
					//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
					$this->mail_model->sendMail($title, $to, $body, $subject);

				}
				// Validamos que es de tipo coferba //
				if ($user['idProfileKf'] == 1) {


				}

				return $idUser;
			} else {
				return null;
			}
		} else {
			return -1;
		}
	}

	public function get_random_password ($chars_min = 6, $chars_max = 15, $use_upper_case = false, $include_numbers = 'yes', $include_special_chars = false)
	{
		$length    = rand($chars_min, $chars_max);
		$selection = 'aeuoyibcdfghjklmnpqrstvwxz';
		if ($include_numbers) {
			$selection .= "1234567890";
		}
		if ($include_special_chars) {
			$selection .= "!@\"#$%&[]{}?|";
		}

		$password = "";
		for ($i = 0; $i < $length; $i++) {
			$current_letter = $use_upper_case ? (rand(0, 1) ? strtoupper($selection[(rand() % strlen($selection))]) : $selection[(rand() % strlen($selection))]) : $selection[(rand() % strlen($selection))];
			$password       .= $current_letter;
		}

		return $password;
	}


	/* EDITAR CLAVES  */
	public function updatePass ($user)
	{
		$recoverRamdonPwd = null;
		$recoverRamdonPwd = $this->get_random_password($chars_min=12);
		$base_url = $this->get_the_current_url();
		$this->db->set(
			array(
				'passwordUser' => sha1(md5($recoverRamdonPwd)),
				'resetPasword' => 1
			)
		)->where("emailUser", $user['emailUser'])
		->where("dni", $user['dni'])
		->update("tb_user");
		if ($this->db->affected_rows() === 0 || $this->db->affected_rows() === 1) {
			$this->db->select("*")->from("tb_user");
			$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
			$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
			$query = $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left')->where("emailUser", $user['emailUser'])
			->where("dni", $user['dni'])
			->get();
			if ($query->num_rows() > 0) {
				$title = null;
				$subject = null;
				$body = null;
				$to = null;
				$user = $query->row_array();
				#MAIL
				$to = $user['emailUser'];
				$title = "Cuenta de Usuario";
				$subject="Constraseña de acceso restablecida";
				$body='<tr width="100%" bgcolor="#ffffff">';
				$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
				$body.='</tr>';	
				$body.='<tr width="100%" bgcolor="#ffffff">';
				$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Su contraseña de acceso ha sido restablecida satisfactoriamente.</td>';
				$body.='</tr>';	
				$body.='<tr width="100%" bgcolor="#ffffff">';
				$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:2%;padding-bottom:2%;">Contraseña: <b>' . $recoverRamdonPwd .'</b></td>';
				$body.='</tr>';	
				$body.='<tr width="100%" bgcolor="#ffffff">';
				$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%">En el proximo inicio de sesión el sistema solicitara el cambio de su contraseña &nbsp;</td>';
				$body.='</tr>';	
				$body.='<tr width="100%" bgcolor="#ffffff">';
				$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
				$body.='</tr>';	
				//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
				$this->mail_model->sendMail($title, $to, $body, $subject);
			}
			return $recoverRamdonPwd;
		} else {
			return false;
		}
	}

	function generateRandomString ($length = 128)
	{
		$characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString     = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	public function get_the_current_url ()
	{

		$protocol     = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "https" : "http");
		$base_url     = $protocol . "://" . $_SERVER['HTTP_HOST'];
		$complete_url = $base_url;

		return $complete_url;

	}


	public function updatecompany ($user)
	{

		$this->db->set(
			array(
				'nameCompany'   => $user['nameCompany'],
				'mail_services' => $user['mail_services'],
				'mail_request'  => $user['mail_request'],
				'mail_admin'    => $user['mail_admin'],
				'isEdit'        => $user['isEdit']
			)
		)->where("idCompany", $user['idCompany'])->update("tb_company");


		if ($this->db->affected_rows() === 1) {

			return true;
		} else {
			return false;
		}
	}


	/* EDITAR DATOS DE UN USUARIO */
	public function update ($user)
	{

		$this->db->set(
			array(
				'fullNameUser'          => $user['fullNameUser'],
				'emailUser'             => $user['emailUser'],
				'phoneNumberUser'       => $user['phoneNumberUser'],
				'phoneLocalNumberUser'  => $user['phoneLocalNumberUser'],
				'idAddresKf'            => $user['idAddresKf'],
				'idProfileKf'           => $user['idProfileKf'],
				'idCompanyKf'           => $user['idCompanyKf'],
				'idTyepeAttendantKf'    => @$user['idTyepeAttendantKf'],
				'descOther'             => @$user['descOther'],
				'idDepartmentKf'        => @$user['idDepartmentKf'],
				'idTypeTenantKf'        => $user['idTypeTenantKf'],
				'requireAuthentication' => @$user['requireAuthentication'],
				'isDepartmentApproved'  => @$user['isDepartmentApproved'],
				'isEdit'                => @$user['isEdit'],
				'idSysProfileFk'        => @$user['idSysProfileFk'],
				'dni'                   => $user['dni'],
			)
		)->where("idUser", $user['idUser'])->update("tb_user");


		if ($this->db->affected_rows() >= 0) {

			if (@$user['isPwdChange']) {

				$this->db->set(
					array(
						'passwordUser' => sha1(md5($user['passwordUser'])),
						'resetPasword' => 0
					)
				)->where("idUser", $user['idUser'])->update("tb_user");
				if ($this->db->affected_rows() === 1) {
					$title = null;
					$subject = null;
					$body = null;
					$to = null;
					#MAIL
					$to = $user['emailUser'];
					$title = "Cuenta de Usuario";
					$subject="Nueva Constraseña de acceso establecida";
					$body='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha asignado una nueva contraseña de acceso satisfactoriamente.</td>';
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
					$body.='</tr>';	
					//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
					$this->mail_model->sendMail($title, $to, $body, $subject);
				}
			}
			if (@$user['isEmailChange']) {

				$this->db->set(
					array(
						'isConfirmatedMail' => 0
					)
				)->where("idUser", $user['idUser'])->update("tb_user");
				if ($this->db->affected_rows() === 1) {
					$title = null;
					$subject = null;
					$body = null;
					$to = null;
					$tokenMail = $user['tokenMail'];
					#MAIL
					$to = $user['emailUser'];
					$title = "Correo Electronico Actualizado";
					$subject="Cuenta de Usuario :: Cambio de correo";
					$body='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>, ha realizado el cambio de su dirección de correo electronico de tal forma que es necesario,</td>'; 
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:2%;padding-bottom:2%;">antes de ingresar debe confirmar su dirección de correo a través del siguiente link: <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/validate/token/'. $tokenMail . '" target="_blank" title="Confirmar correo" style="text-decoration: none; color: #fff;">Confirmar</a></span></td>';
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
					$body.='</tr>';
					$this->mail_model->sendMail($title, $to, $body, $subject);
				}
			}
			if (@$user['isDepartmentAssigment']) {
				$userRs = null;
				$building = null;
				$title = null;
				$subject = null;
				$body = null;
				$to = null;
				$currentURL = $this->get_the_current_url(); //for simple URL
				//GET USER
				$this->db->select("*")->from("tb_user");
				$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
				$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
				$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
				$queryUser = $this->db->where("idUser =", $user['idUser'])->get();
				if ($queryUser->num_rows() > 0) {
					$userRs = $queryUser->row_array();
						if ($userRs['isDepartmentApproved']==null || $user['isDepartmentApproved']!=null ) {
							//DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
							$this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
							$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
							$this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
							$this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
							$queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $user['idDepartmentKf'])->get();
							if ($queryBuilding->num_rows() > 0) {
								$building = $queryBuilding->row_array();
									#MAIL TO USER
									$rs = null;
									$to = $userRs['emailUser'];
									$title = "Alta de Departamento";
									$subject="Alta Departamento :: ".$building['Depto'];
									$body='<tr width="100%" bgcolor="#ffffff">';
									$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$userRs['fullNameUser'].'</b>,</td>'; 
									$body.='</tr>';	
									$body.='<tr width="100%" bgcolor="#ffffff">';
									$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado el Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
									$body.='</tr>';
									if ($userRs['isDepartmentApproved'] == null || $user['isApprovalRequired']){
										$body.='<tr width="100%" bgcolor="#ffffff">';
										$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
										$body.='</tr>';	
									}else if ($userRs['isDepartmentApproved'] != null && !$user['isApprovalRequired']){
										$body.='<tr width="100%" bgcolor="#ffffff">';
										$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span></td>';
										$body.='</tr>';	
									}
									$body.='<tr width="100%" bgcolor="#ffffff">';
									$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffffff;">Entrar</a></span></td>';
									$body.='</tr>';	
									//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
									$rs = $this->mail_model->sendMail($title, $to, $body, $subject);
								if ($rs == "Enviado" && $user['isApprovalRequired']){
									$this->db->select("tb_client_mails.mailContact")->from("tb_client_mails");
									$this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
									$where="tb_client_mails.idTipoDeMailFk = 1 AND tb_client_mails.idClientFk = ".$building['idBuilding'];
									$quuery = $this->db->where($where)->get();
									if ($queryUser->num_rows() > 0) {
										$buildingAdminMail = $quuery->row_array();
										$title = null;
										$subject = null;
										$body = null;
										$to = null;
										#MAIL TO THE BUILDING OR ADMINISTRATION
										$approval_url="https://".BSS_HOST."/login/approve/depto/up/depto/".$building['idClientDepartament']."/user/".$userRs['idUser'];
										$to = $buildingAdminMail['mailContact'];
										$title = "Alta de Departamento";
										$subject="Alta de Departamento :: ".$building['Depto'];
										$body='<tr width="100%" bgcolor="#ffffff">';
										$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$userRs['fullNameUser'].'</b>,</td>'; 
										$body.='</tr>';	
										$body.='<tr width="100%" bgcolor="#ffffff">';
										$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado el Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
										$body.='</tr>';	
										$body.='<tr width="100%" bgcolor="#ffffff">';
										$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
										$body.='</tr>';	
										$body.='<tr width="100%" bgcolor="#ffffff">';
										$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px; cursor:pointer;"><a href="'.$approval_url.'" target="_blank" title="Aprobar" style="text-decoration: none; color: #ffffff;">Aprobar</a></span></td>';
										$body.='</tr>';	
										//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
										$this->mail_model->sendMail($title, $to, $body, $subject);
									}
								}
							}
					}
					
				}
			}

			return true;
		} else {
			return false;
		}
	}


	/*BUSCAR USUARIO POR EL EMAIL*/
	public function findUserByEmail ($mail)
	{

		$user = null;
		//
		$this->db->select("tb_user.*,tb_profile.nameProfile,tb_profiles.name,tb_typetenant.typeTenantName,tb_status.statusTenantName,tb_client_departament.departament,tb_client_departament.floor,tb_type_attendant.nameTypeAttendant")->from("tb_user");
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
		//$this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
		//$this->db->join('tb_company', 'tb_company.idCompany = tb_user.idCompanyKf', 'left');
		$this->db->where("tb_user.emailUser", $mail);
		$this->db->or_where("tb_user.dni", $mail);

		$query = $this->db->order_by("tb_user.idUser", "ASC")->get();

		if ($query->num_rows() > 0) {
			$user = $query->result_array();
			foreach ($user as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$idProfiles = $item['idSysProfileFk'];
				$query2    = null;
				if (isset($idProfiles) && !is_null($idProfiles) && $idProfiles > 0) {
					// Buscamos los perfiles de sistema //
					$this->db->select("*")->from("tb_profiles");
					$quuery = $this->db->where("tb_profiles.idProfiles =", $idProfiles)->get();
					if ($quuery->num_rows() === 1) {
						$rs = $quuery->row_array();
	
						$this->db->select("*")->from("tb_profiles_modules");
						$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
						$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $idProfiles)->get();
	
						$rs2 = $quuery->result_array();
	
						$user[$key]['modules'] = $rs2;
					}
					if (($idProfile == 2) && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($idProfile == 4) && (($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($item['idTypeTenantKf'] != null && $item['idTypeTenantKf'] != ''))) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $item['idCompanyKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['company'] = $query2->result_array();
						}
					}
					if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $item['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['building'] = $query2->result_array();
						}
					}
					if ($idProfile == 6 && $item['idTyepeAttendantKf'] != null && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] != null)) {
						$query2    = null;
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $item['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['building'] = $query2->result_array();
						}
					}
					if (($idProfile == 4 || $idProfile == 6) && $item['idTypeTenantKf'] == 1) {
						$query2 = $this->db->select("*")->from("tb_clients");
						$query2 = $this->db->where('idClient', $item['idAddresKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['building'] = $query2->result_array();
						}
					}
					if ($idProfile == 3 || ($idProfile == 4 && $item['idTypeTenantKf'] == 1) || ($idProfile == 6 && $item['idTypeTenantKf'] == 1)) {
						$query2 = $this->db->select("*")->from("tb_client_departament");
						$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
						$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
						$query2 = $this->db->where('idUserKf', $item['idUser']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['deptos'] = $query2->result_array();
						}
					}
					if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
						$query2 = $this->db->select("*")->from("tb_client_departament");
						$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
						$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
						$query2 = $this->db->where('idClientDepartament', $item['idDepartmentKf']);
						$query2 = $this->db->get();
						if ($query2->num_rows() > 0) {
							$user[$key]['deptos'] = $query2->result_array();
						}
					}
				}
			}
			return $user;
		} else {
			return null;
		}
	}


	/* LISTADO DE FILTROS */
	public function getFilterForm ()
	{

		$query            = null;
		$profile          = null;
		$profiles         = null;
		$status           = null;
		$type             = null;
		$typeattendant    = null;
		$companykeychains = null;

		/* LISTADO DE TIPOS DE PERFIL */
		$query = $this->db->select("*")->from("tb_profile")->get();
		if ($query->num_rows() > 0) {
			$profile = $query->result_array();
		}
		/* LISTADO DE TIPOS DE PERFILES & ROLES */
		$query = $this->db->select("*")->from("tb_profiles")->get();
		if ($query->num_rows() > 0) {
			$profiles = $query->result_array();
		}
		/* LISTADO DE TIPOS DE STATUS */
		$query = $this->db->select("*")->from("tb_status")->get();
		if ($query->num_rows() > 0) {
			$status = $query->result_array();
		}
		/* LISTADO DE TIPOS DE HABITANTES */
		$query = $this->db->select("*")->from("tb_typetenant")->get();
		if ($query->num_rows() > 0) {
			$typeTenant = $query->result_array();
		}
		/* LISTADO DE TIPOS DE ENCARGADOS */
		$query = $this->db->select("*")->from("tb_type_attendant")->get();
		if ($query->num_rows() > 0) {
			$typeattendant = $query->result_array();
		}


		$filter = array(
			'status'  		=> $status,
			'profile' 		=> $profile,
			'profiles' 		=> $profiles,
			'typeTenant'	=> $typeTenant,
			'typeattendant' => $typeattendant
		);

		return $filter;
	}


	/* LISTADO DE PARAMETROS */
	public function getCompany ()
	{

		$query   = null;
		$company = null;

		$query = $this->db->select("*")->from("tb_company")->get();
		if ($query->num_rows() > 0) {
			$company = $query->result_array();
		}

		return $company;
	}


	/* LISTADO DE PARAMETROS */
	public function getParam ()
	{

		$query = null;
		$param = null;

		$query = $this->db->select("*")->from("tb_sys_param")->get();
		if ($query->num_rows() > 0) {
			$param = $query->result_array();
		}


		return $param;
	}


	/* LISTADO DE PARAMETROS */
	public function getdeliveryType ()
	{

		$query = null;
		$param = null;

		$query = $this->db->select("*")->from("tb_type_delivery")->get();
		if ($query->num_rows() > 0) {
			$param = $query->result_array();
		}

		return $param;
	}


	/* LISTADO DE FILTROS */
	public function mailsmtp ()
	{

		$param = null;


		$query = $this->db->select("*")->from("tb_sys_param")->get();
		if ($query->num_rows() > 0) {
			$param = $query->result_array();
		}


		return $param;
	}


	/* EDITAR DATOS DE UN EMPRESA */
	public function updateMailSmtp ($mail)
	{

		$this->db->set(
			array(
				'value' => $mail['email']
			)
		)->where("idParam", 1)->update("tb_sys_param");

		$this->db->set(
			array(
				'value' => $mail['pass']
			)
		)->where("idParam", 2)->update("tb_sys_param");

		if ($this->db->affected_rows() === 1) {
			return true;
		} else {
			return false;
		}
	}

	/* UPDATE PARAM */
	public function updateParam ($param)
	{

		$this->db->set(
			array(
				'value' => $param['value']
			)
		)->where("idParam", $param['idParam'])->update("tb_sys_param");


		if ($this->db->affected_rows() === 1) {
			return true;
		} else {
			return false;
		}
	}


	public function validate ($tokenMail)
	{
		//printf($tokenMail);
		$this->db->set(
			array(
				'isConfirmatedMail' => 1,
				'idStatusKf'        => 1
			)
		)->where("tokenMail", $tokenMail)->update("tb_user");
				
		
		if ($this->db->affected_rows() === 1) {
			$this->db->select("*")->from("tb_user");
			$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
			$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
			$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
			$query = $this->db->where("tokenMail", $tokenMail)->get();
			if ($query->num_rows() > 0) {
				$user = null;
				$building = null;
				$title = null;
				$subject = null;
				$body = null;
				$to = null;
				$user = $query->row_array();
				#MAIL
				$to    = $user['emailUser'];
				$title = "Cuenta de Usuario";
				if ($user['isConfirmatedMail'] == 1 && $user['idStatusKf'] == 1){
					$subject="Correo confirmado";
					$body='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>, <br><br> Su cuenta de usuario se encuentra <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
					$body.='</tr>';	
				}
				$this->mail_model->sendMail($title, $to, $body, $subject);
			}
			return true;
		} else {
			//print_r($this->db->affected_rows());
			return null;
		}
	}


	public function changueStatus ($id, $idStatus)
	{
		$this->db->set(
			array(
				'idStatusKf' => $idStatus
			)
		)->where("idUser", $id)->update("tb_user");
		if ($this->db->affected_rows() === 1) {
			 
			$this->db->select("*")->from("tb_user");
			$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
			$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
			$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
			$query = $this->db->where("tb_user.idUser = ", $id)->get();
			//if ($query->num_rows() > 0) {
			//	$user = null;
			//	$building = null;
			//	$title = null;
			//	$subject = null;
			//	$body = null;
			//	$to = null;
			//	$user = $query->row_array();
			//	#MAIL
			//	$to    = $user['emailUser'];
			//	$title = "Estado de Usuario";
			//	if ($user['idStatusKf'] == 1){
			//		$subject="Usuario Activo";
			//		$body='<tr width="100%" bgcolor="#ffffff">';
			//		$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>, <br><br> Su cuenta de usuario se encuentra <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
			//		$body.='</tr>';	
			//	}else{
			//		$subject="Usuario Inactivo";
			//		$body='<tr width="100%" bgcolor="#ffffff">';
			//		$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>, <br><br> Su cuenta de usuario se encuentra <span style="background-color:#d9534f;border-color: #d9534f !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"> '.$user['statusTenantName']. '</span><br><br> Comuniquese con nuestro equipo de atención al cliente! </td>';
			//		$body.='</tr>';
			//	}
			//	
			//	$this->mail_model->sendMail($title, $to, $body, $subject);
			//}
			return true;
		} else {
			return false;
		}
	}


	/* ESTATUS DE UN USUARIO */
	public function changueStatusUser ($id, $idStatus)
	{
		$this->db->set(
			array(
				'idStatusKf' => $idStatus
			)
		)->where("idUser", $id)->update("tb_user");

		if ($this->db->affected_rows() === 1) {
			return true;
		} else {
			return false;
		}
	}


	// GET DE LISTADO ENCARGADOS POR ID DIRECCION //
	public function attendantByIdDirecction ($id)
	{
		$quuery = null;
		$rs     = null;


		$this->db->select("*")->from("tb_user");
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');	
		$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
		$this->db->where("tb_user.idAddresKf =", $id);
		$this->db->where("tb_user.idProfileKf =", 6);


		$quuery = $this->db->order_by("tb_user.fullNameUser", "asc")->get();


		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;
	}

	
	// GET DE LISTADO DE TODO LOS USUARIOS ASOCIADOS A UN CLIENTE //
	public function listUsersByClient ($id)
	{
		$quuery = null;
		$rs     = null;
		$extrawhere = null;

		$this->db->select("*")->from("tb_user as t1");
		$this->db->join('tb_profile', 'tb_profile.idProfile = t1.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = t1.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = t1.idStatusKf', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = t1.idTypeTenantKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = t1.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');	
		$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf', 'left');
		$extrawhere = " t1.idUser in (select tb_client_departament.idUserKf from tb_client_departament where idClientFk = ".$id.")  or t1.idDepartmentKf in (select tb_client_departament.idClientDepartament from tb_client_departament where idClientFk = ".$id." ) or (t1.idAddresKf = ".$id.")";
		$this->db->where($extrawhere);
		$quuery = $this->db->order_by("t1.fullNameUser", "asc")->get();


		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;
	}

	// GET DE LISTADO ENCARGADOS POR ID DIRECCION QUE NO SON PROPIETARIO O INQUILINO. //
	public function attendantsOnlyByIdDirection ($id)
	{
		$quuery = null;
		$rs     = null;
		$extrawhere  = null;
		$atten = [];
		
		$this->db->select('*');
		$this->db->from('tb_user');
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
		$this->db->where('tb_user.idAddresKf', $id);
		$this->db->where('tb_user.idProfileKf', '6');
		$this->db->group_start() // Start grouping conditions for idTypeTenantKf
				 ->where('tb_user.idTypeTenantKf IS NULL')
				 ->or_where('tb_user.idTypeTenantKf IS NOT NULL')
			 ->group_end(); // End grouping
			 $quuery = $this->db->order_by('tb_user.fullNameUser', 'ASC')->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			foreach ($rs as $key => $item) {
				$idUser = $item['idUser'];
				$query2    = null;
				$query2 = $this->db->select("*")->from("tb_keychain");
				$query2 = $this->db->where('idUserKf', $idUser);
				$query2 = $this->db->get();
				if ($query2->num_rows() >= 0) {
					array_push($atten, $item);
				}
			}
			return $atten;
		}
		return null;
	}

	// VERIFICAMOS SI EL EDIFICIO TIENE UN ENCARGADO TITULAR ASOCIADO //
	public function chekBuildingTitularAttendant ($id)
	{
		$quuery = null;
		$rs     = null;


		$this->db->select("*")->from("tb_user");
		$this->db->where("tb_user.idTyepeAttendantKf =", 2);
		$this->db->where("tb_user.idProfileKf =", 6);
        $quuery = $this->db->where("tb_user.idAddresKf =", $id)->get();

		if ($quuery->num_rows() > 0) {
			return true;
		}
		return null;

	}

    /* LISTADO DE FILTROS */
    public function getListOfUsers ()
    {
        $where       	= null;
        $users  		= null;
        $owners     	= null;
        $tenants     	= null;
        $owners_tenants = null;
        $attendants  	= null;
        $companyUser 	= null;
        $sysUser     	= null;
        /* LISTADO DE USUARIOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $query = $this->db->order_by("tb_user.dateCreated", "DESC")->get();
		if ($query->num_rows() > 0) {
			$users = $query->result_array();
			foreach ($users as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if (($idProfile == 2) && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($idProfile == 4) && (($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] == '') || ($item['idTypeTenantKf'] != null && $item['idTypeTenantKf'] != ''))) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['building'] = $query2->result_array();
					}
				}
				if ($idProfile == 6 && $item['idTyepeAttendantKf'] != null && ($item['idTypeTenantKf'] == null || $item['idTypeTenantKf'] != null)) {
					$query2    = null;
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['building'] = $query2->result_array();
					}
				}
				if (($idProfile == 4 || $idProfile == 6) && $item['idTypeTenantKf'] == 1) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['building'] = $query2->result_array();
					}
				}
				if ($idProfile == 3 || ($idProfile == 4 && $item['idTypeTenantKf'] == 1) || ($idProfile == 6 && $item['idTypeTenantKf'] == 1)) {
					$query2 = $this->db->select("*")->from("tb_client_departament");
					$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
					$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
					$query2 = $this->db->where('idUserKf', $item['idUser']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['deptos'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || ($idProfile == 4 && $item['idTypeTenantKf'] == 2) || ($idProfile == 6 && $item['idTyepeAttendantKf'] != 1 && $item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_client_departament");
					$query2 = $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
					$query2 = $this->db->join('tb_clients', ' tb_clients.idClient= tb_client_departament.idClientFk', 'left');
					$query2 = $this->db->where('idClientDepartament', $item['idDepartmentKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$users[$key]['deptos'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE HABITANTES */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $where="idProfileKf = 3 OR idProfileKf = 4 OR  idProfileKf = 5 OR idProfileKf = 6 AND (idTypeTenantKf IN (1,2))";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "DESC")->get();
		if ($query->num_rows() > 0) {
			$owners_tenants = $query->result_array();
			foreach ($owners_tenants as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$owners_tenants[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || ($idProfile == 6 && $item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$owners_tenants[$key]['building'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE PROPIETARIOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $where = "idProfileKf = 3 OR idProfileKf = 4 OR idProfileKf = 6 AND (idTypeTenantKf IN (1))";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "DESC")->get();
		if ($query->num_rows() > 0) {
			$owners = $query->result_array();
			foreach ($owners as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$owners[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || $idProfile == 4 || $idProfile == 6 && ($item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$owners[$key]['building'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE INQUILINOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $where = "idProfileKf = 5 OR idProfileKf = 4 OR idProfileKf = 6 AND (idTypeTenantKf IN (2))";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "DESC")->get();
		if ($query->num_rows() > 0) {
			$tenants = $query->result_array();
			foreach ($tenants as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$tenants[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || $idProfile == 4 || $idProfile == 6 && ($item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$tenants[$key]['building'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE ENCARGADOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idAddresKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $where = "idProfileKf = 6";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "ASC")->get();
		if ($query->num_rows() > 0) {
			$attendants = $query->result_array();
			foreach ($attendants as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$attendants[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || $idProfile == 4 || $idProfile == 6 && ($item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$attendants[$key]['building'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE ADMIN DE CONSORCIOS Y USUARIOS DE EMPRESAS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $this->db->join('tb_clients', 'tb_clients.idClient = tb_user.idCompanyKf', 'left');
        $this->db->where("idProfileKf", 2);
        $this->db->or_where("idProfileKf", 4);
        $query = $this->db->order_by("tb_user.idUser", "DESC")->get();
		if ($query->num_rows() > 0) {
			$companyUser = $query->result_array();
			foreach ($companyUser as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$companyUser[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || $idProfile == 4 || $idProfile == 6 && ($item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$companyUser[$key]['building'] = $query2->result_array();
					}
				}
			}
		}
        /* LISTADO DE USUARIOS DE SISTEMA */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
        $where = "idProfileKf = 1";
        $this->db->where($where);
        $query = $this->db->order_by("tb_user.idUser", "ASC")->get();
		if ($query->num_rows() > 0) {
			$sysUser = $query->result_array();
			foreach ($sysUser as $key => $item) {
				$idProfile = null;
				$idProfile = $item['idProfileKf'];
				$query2    = null;
				if ($idProfile == 2 || $idProfile == 4) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idCompanyKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$sysUser[$key]['company'] = $query2->result_array();
					}
				}
				if ($idProfile == 5 || $idProfile == 4 || $idProfile == 6 && ($item['idTypeTenantKf'] == 2)) {
					$query2 = $this->db->select("*")->from("tb_clients");
					$query2 = $this->db->where('idClient', $item['idAddresKf']);
					$query2 = $this->db->get();
					if ($query2->num_rows() > 0) {
						$sysUser[$key]['building'] = $query2->result_array();
					}
				}
			}
		}

        $lists = array(
            'clientUser'      	=> $users,
            'users'  	  		=> $users,
            'owners'      		=> $owners,
            'tenants'     		=> $tenants,
            'owners_tenants'	=> $owners_tenants,
            'attendants'  		=> $attendants,
            'companyUser' 		=> $companyUser,
            'sysUser'     		=> $sysUser

        );

        return $lists;
    }
	public function getUsersByCompanyClientId ($id){
        $users 	= null;
        /* LISTADO DE USUARIOS */
        $this->db->select("*")->from("tb_user");
        $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left');
		$this->db->where("tb_user.idCompanyKf =", $id);
        $query = $this->db->order_by("tb_user.dateCreated", "DESC")->get();
		if ($query->num_rows() > 0) {
			$users = $query->result_array();
		}else{
			$users 	= null;
		}

        return $users;
	}

	// GET USERS AUTHORIZED TO APPROVE SERVICE OR CONTRACT TERMINATION //
	public function getAuthorizedUsers ()
	{
		$quuery = null;
		$rs     = null;
		$extrawhere = null;

		$this->db->select("*")->from("tb_user as t1");
		$this->db->join('tb_profile', 'tb_profile.idProfile = t1.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = t1.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = t1.idStatusKf', 'left');
		$this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = t1.idTypeTenantKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = t1.idDepartmentKf', 'left');
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');	
		$this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf', 'left');
		$this->db->where('t1.idProfileKf', '1');
		$this->db->where('t1.idSysProfileFk', '1');
		$this->db->where('t1.isSuperAdmin', '1');
		$this->db->where('t1.idStatusKf', '1');
		$quuery = $this->db->order_by("t1.fullNameUser", "asc")->get();


		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;
	}

	public function sendGeneratedToken ($user)
	{
		$rs=null;
		$tokenMail  = $this->generateRandomString(5);
		#MAIL TO USER
		$to = $user['emailUser'];
		$title = "Token de Seguridad";
		$subject="Baja de servicio/Contrato";
		$body='<tr width="100%" bgcolor="#ffffff">';
		$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:3%;">Hola, <b>'.$user['fullNameUser'].'</b>,</td>'; 
		$body.='</tr>';	
		$body.='<tr width="100%" bgcolor="#ffffff">';
		$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Se Ha solicitado la Baja de un Servicio/Contrato en el Cliente: <b>'.$user['clientName'].'</b>, debido a ello se ha generado el siguiente codigo de seguridad.</td>';
		$body.='</tr>';
		$body.='<tr width="100%" bgcolor="#ffffff">';
		$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;"><b>Codigo de Seguridad:</b> <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">'.$tokenMail.'</span></td>';
		$body.='</tr>';	
		$body.='<tr width="100%" bgcolor="#ffffff">';
		$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding:4%;"> Importante: indicar el codigo recibido al operador que esta realizando la actividad para que esta pueda ser finalizada con exito.</td>';
		$body.='</tr>';
		$rs = $this->mail_model->sendMail($title, $to, $body, $subject);
		if ($rs == "Enviado"){
			return $tokenMail;
		}
	}

// Función para generar un token único
	private function generateUniqueToken($length) {
		do {
			$token = $this->generateRandomString($length);
			// Verificar si el token ya existe en la tabla
			$this->db->where('token', $token);
			$query = $this->db->get('tb_authorization_token');
		} while ($query->num_rows() > 0); // Repetir si el token ya existe

		return $token;
	}
    public function addAuthorizationToken($user) {
		$now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
		// Generar un token único
		$token = $this->generateUniqueToken(5);
        $this->db->insert('tb_authorization_token', [
                'token' 				=> $token,
                'idUserApproverKf' 		=> $user['idUserApproverKf'],
                'idUserRequestorKf' 	=> $user['idUserRequestorKf'],
				'idClientKf' 			=> $user['idClientKf'],
				'created_at' 			=> $now->format('Y-m-d H:i:s'),
				'expirationTime'  		=> 24,
				'idTokenStatusKf' 		=> 1
            ]
        );
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function setTokenCompleted($id) {
        $now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set(
            [
				'idTokenStatusKf' 	=> 0,
				'updated_at' 		=> $now->format('Y-m-d H:i:s'),
            ]
        )->where("token", $id)->update("tb_authorization_token");

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }
    public function setTokenExpired($token) {
        $now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set(
            [
				'idTokenStatusKf' 	=> -1,
				'updated_at' 		=> $now->format('Y-m-d H:i:s'),
            ]
        )->where("idToken", $token)->update("tb_authorization_token");

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }
	public function listAuthorizationTokenByUserId($idUser) {
		$rs = [];
		$this->db->select("*")->from("tb_authorization_token");
		$this->db->join('tb_token_status', 'tb_token_status.idTokenStatus = tb_authorization_token.idTokenStatusKf', 'left');
		$this->db->where('tb_authorization_token.idUserApproverKf', $idUser);
		$query = $this->db->order_by('tb_authorization_token.created_at DESC')->limit(10)->get();
		$rs = $query->result_array();
		
		$updated = false;  // Bandera para determinar si se actualizó algún registro
		
		if ($query->num_rows() > 0) {
			$i = 0;
			// Recorrer la lista y verificar si cada token ha expirado
			foreach ($rs as $item) {
				$createdAt = new DateTime($item['created_at']);
				$now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));
				$interval = $now->diff($createdAt);
				
				// Verificar si han pasado más de 24 horas
				if ($interval->h + ($interval->days * 24) >= 24 && $item['idTokenStatusKf']!="-1" && $item['idTokenStatusKf']!="0") {
					// Invocar la función para marcar el token como expirado
					$this->setTokenExpired($item['idToken']);
					$updated = true;  // Marcar que un registro fue actualizado
				}
				//idUserApproverKf
				$this->db->select("*")->from("tb_user Approver");
				$qry1 = $this->db->where("Approver.idUser =", $item['idUserApproverKf'])->get();
				//idUserRequestorKf
				$rs1 = $qry1->result_array();
				$rs[$i]['userApproverKf'] = $rs1;

				$this->db->select("*")->from("tb_user Requestor");
				$qry2 = $this->db->where("Requestor.idUser =", $item['idUserRequestorKf'])->get();

				$rs2 = $qry2->result_array();
				$rs[$i]['userRequestorKf'] = $rs2;
				
				$this->db->select("tb_clients.idClient,tb_clients.name,tb_clients.address,tb_clients.idStatusFk")->from("tb_clients");
				$qry3 = $this->db->where('tb_clients.idClient', $item['idClientKf'])->get();
				$rs3 = $qry3->result_array();
				$rs[$i]['client_details'] = $rs3;

				$i++;

			}
	
			// Si se actualizó algún registro, realizar la consulta nuevamente
			if ($updated) {
				$i = 0;
				$this->db->select("*")->from("tb_authorization_token");
				$this->db->join('tb_token_status', 'tb_token_status.idTokenStatus = tb_authorization_token.idTokenStatusKf', 'left');
				$this->db->where('tb_authorization_token.idUserApproverKf', $idUser);
				$query = $this->db->order_by('tb_authorization_token.created_at ASC')->limit(10)->get();
				$rs = $query->result_array();
				if ($query->num_rows() > 0) {
					foreach ($rs as $item) {
						//idUserApproverKf
						$this->db->select("*")->from("tb_user Approver");
						$qry1 = $this->db->where("Approver.idUser =", $item['idUserApproverKf'])->get();
						//idUserRequestorKf
						$rs1 = $qry1->result_array();
						$rs[$i]['userApproverKf'] = $rs1;

						$this->db->select("*")->from("tb_user Requestor");
						$qry2 = $this->db->where("Requestor.idUser =", $item['idUserRequestorKf'])->get();

						$rs2 = $qry2->result_array();
						$rs[$i]['userRequestorKf'] = $rs2;
						$i++;
					}
				}
			}
	
			return $rs;
		}
	
		return null;
	}
	public function validateAuthorizationToken($item) {
		$rs = [];
		$this->db->select("*")->from("tb_authorization_token");
		$this->db->join('tb_token_status', 'tb_token_status.idTokenStatus = tb_authorization_token.idTokenStatusKf', 'left');
		$this->db->where('tb_authorization_token.token', $item['tokenCode']);
		$this->db->where('tb_authorization_token.idTokenStatusKf', 1);
		$query = $this->db->where('tb_authorization_token.idUserRequestorKf', $item['idUserRequestorKf'])->limit(1)->get();
		$rs = $query->row_array();  // Usar row_array para un solo registro
		if ($query->num_rows() > 0) {
			// Verificar si han pasado más de 24 horas desde created_at
			$createdAt = new DateTime($rs['created_at']);
			$now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));
			$interval = $now->diff($createdAt);
	
			// Si han pasado más de 24 horas, marcar como expirado y actualizar la consulta
			if ($interval->h + ($interval->days * 24) >= 24 && $item['idTokenStatusKf']!="-1" && $item['idTokenStatusKf']!="0") {
				$this->setTokenExpired($rs['idToken']);
	
				// Realizar una nueva consulta para obtener el registro actualizado
				$this->db->select("*")->from("tb_authorization_token");
				$this->db->join('tb_token_status', 'tb_token_status.idTokenStatus = tb_authorization_token.idTokenStatusKf', 'left');
				$this->db->where('tb_authorization_token.token', $item['tokenCode']);
				$this->db->where('tb_authorization_token.idTokenStatusKf', 1);
				$this->db->where('tb_authorization_token.idUserRequestorKf', $item['idUserRequestorKf']);
				$query = $this->db->order_by('tb_authorization_token.created_at ASC')->limit(1)->get();
				$rs = $query->row_array();  // Obtener el registro actualizado
				if ($query->num_rows() > 0) {
					//print_r($rs);
					return $rs;
				}
			}else{
				return $rs;
			}
		}
	
		return null;
	}


	/*BUSCAR USUARIO POR EL DNI*/
	public function findGuest ($guest)
	{

		$rs = null;
		//
		$this->db->select("*")->from("tb_user_guest");
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user_guest.idDepartmentKf', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user_guest.idStatusKf', 'left');
		if (! is_null(@$guest['idStatusKf'])) {
			$this->db->where('tb_user_guest.idStatusKf', @$guest['idStatusKf']);
		}else{
			$this->db->where("tb_user_guest.idStatusKf !=", -1);
		}

		$this->db->group_start();
		$this->db->where("tb_user_guest.dni", $guest['dni']);
		$this->db->or_where("tb_user_guest.idGuest", @$guest['idGuest']);
		$this->db->group_end();
		$query = $this->db->order_by("tb_user_guest.idGuest", "ASC")->get();

		if ($query->num_rows() > 0) {
			$rs = $query->result_array();
			return $rs;
		} else {
			return null;
		}
	}


    public function addGuest($guest) {
		$now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
        $user = null;
		if ($this->findGuest($guest) == null) {
            $this->db->insert('tb_user_guest', [
					'names'        			=> $guest['fullname'],
					'dni'              		=> $guest['dni'],
					'emailAddress'          => @$guest['emailAddress'],
					'phoneNumber' 			=> @$guest['phoneNumber'],
					'idDepartmentKf'       	=> $guest['idDepartmentKf'],
					"created_at" 			=> $now->format('Y-m-d H:i:s'),
					'idStatusKf'			=> 1,
                ]
            );

            if ($this->db->affected_rows() === 1) {
				return true;
			} else {
				return null;
			}
		}else{
			return -1;
		}

    }

    public function updateGuest($guest) {
		if ($this->findGuest($guest) != null) {
			$this->db->set(
				[
					'names'        			=> $guest['fullname'],
					'dni'              		=> $guest['dni'],
					'emailAddress'          => @$guest['emailAddress'],
					'phoneNumber' 			=> @$guest['phoneNumber'],
					'idDepartmentKf'       	=> $guest['idDepartmentKf']
				]
			)->where("idGuest", $guest['idGuest'])->update("tb_user_guest");
			if ($this->db->affected_rows() === 1) {
				return true;
			} else {
				return false;
			}
		}else{
			return -1;
		}
    }

    public function deleteGuest($idGuest) {

        $this->db->set(
            [ 	'idStatusKf'		 => -1,
				'idDepartmentKf'     => null
			]
			)->where("idGuest", $idGuest)->update("tb_user_guest");

        return true;


    }

    public function getGuestByIdDepartment($id) {
        $quuery = null;
        $rs     = null;
		$guest  = [];
        if (! is_null($id)) {
			$this->db->select("*")->from("tb_user_guest");
			$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user_guest.idDepartmentKf', 'left');
			$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user_guest.idStatusKf', 'left');
			$this->db->where("tb_user_guest.idStatusKf !=", -1);
			$this->db->where("tb_user_guest.idDepartmentKf =", $id);
			$quuery = $this->db->order_by("tb_user_guest.idGuest", "ASC")->get();
			if($quuery->num_rows() > 0){
				$guest = $quuery->result_array();
				
				foreach ($guest as $key => $item) {
					$idGuest 		= $item['idGuest'];
					$idDepartmentKf	= $item['idDepartmentKf'];
					$query2    = null;
					if (isset($idGuest) && isset($idDepartmentKf)) {
						$extrawherekey = "tb_keychain.idUserKf=$idGuest AND tb_keychain.idDepartmenKf=$idDepartmentKf";
						
						$this->db->select("*")->from("tb_keychain");
						$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
						$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
						$query2 = $this->db->where($extrawherekey)->get();
						if ($query2->num_rows() === 1) {
							$keyfound = $query2->row_array();
							$guest[$key]['myKeys'] = $keyfound;
						}else{
							$guest[$key]['myKeys']=null;
						}
					}
					
				}
				$rs = array(
					'guest' => $guest
				);
			}else{
				$rs = null;
			}
				return $rs;
        }
    }


}

?>
