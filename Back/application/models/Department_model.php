<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Department_model extends CI_Model
{
	
	public function __construct()
	{
        parent::__construct();
         /*MAIL*/ $this->load->model('mail_model');
	}

	public function get_the_current_url ()
	{

		$protocol     = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "https" : "http");
		$base_url     = $protocol . "://" . $_SERVER['HTTP_HOST'];
		$complete_url = $base_url . $_SERVER["REQUEST_URI"];

		return $complete_url;

	}


	// GET DE LISTADO BUSQUEDA DE INQUIILINO //
	public function get ($id = null, $searchFilter = null)
	{
		$quuery = null;
		$rs     = null;

		// SI RECIBIMOS EL ID DE EL USUARIO //
		if (!is_null($id)) {

			$this->db->select("*,UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
			$this->db->where("tb_client_departament.idStatusfk !=", -1);
			$quuery = $this->db->where("tb_client_departament.idClientDepartament = ", $id)->get();


			if ($quuery->num_rows() === 1) {
				$rs = $quuery->row_array();
                $rs['building'] = $this->db->select("*")->from("tb_clients")->where('idClient', $rs['idClientFk'])->get()->row_array();
                $rs['administration'] = $this->db->select("*")->from("tb_clients")->where('idClient', $rs['building']['idClientAdminFk'])->get()->row_array();
				$this->db->select("*")->from("tb_user");
                $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
                $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
                $rs['tenants_departament'] = $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = tb_user.idTyepeAttendantKf', 'left')->where('idDepartmentKf', $rs['idClientDepartament'])->get()->row_array();
                $this->db->select("*")->from("tb_user");
                $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
                $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                $rs['owner_departament']   = $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left')->where('idUser', $rs['idUserKf'])->get()->row_array();
				return $rs;
			}
		} /*else {

			$this->db->select("*")->from("tb_client_departament");
			$this->db->where("tb_client_departament.idStatusKf !=", -1);


			/* Busqueda por filtro */
            //	if (!is_null($searchFilter['searchFilter'])) {
            //		$this->db->like('tb_department.departmentAddress', $searchFilter['searchFilter']);
            //		$this->db->or_like('tb_department.departmentFloor', $searchFilter['searchFilter']);
            //		$this->db->or_like('tb_department.deparmentNumber', $searchFilter['searchFilter']);
            //		$this->db->or_like('tb_department.deparmentDescription', $searchFilter['searchFilter']);
            //           //	}
		/*
		// Si recibimos un limite //
		if ($searchFilter['topFilter'] > 0) {
			$this->db->limit($searchFilter['topFilter']);
		}

		$quuery = $this->db->order_by("tb_department.idDepartment", "DESC")->get();

		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;
	}*/
	}
	 // GET DE LISTADO BUSQUEDA DE INQUIILINO //
    public function get_old($id = null, $searchFilter = null) {
        $quuery = null;
        $rs = null;

        // SI RECIBIMOS EL ID DE EL USUARIO //
        if (!is_null($id)) 
        {

            $this->db->select("*")->from("tb_department");
            $this->db->join('tb_addres', 'tb_addres.idAdress = tb_department.idAdressKf', 'left');            
            $this->db->where("tb_department.idStatusKf !=", -1);
            $quuery = $this->db->where("tb_department.idDepartment = ", $id)->get();


            if ($quuery->num_rows() === 1) {
                $rs =  $quuery->row_array();
                return $rs;
            }
        } 
        else
         { 

            $this->db->select("*")->from("tb_department");
            $this->db->where("tb_department.idStatusKf !=", -1);



            /* Busqueda por filtro */
            if (!is_null($searchFilter['searchFilter'])) 
            {
            	$this->db->like('tb_department.departmentAddress', $searchFilter['searchFilter']);
                $this->db->or_like('tb_department.departmentFloor', $searchFilter['searchFilter']);
                $this->db->or_like('tb_department.deparmentNumber', $searchFilter['searchFilter']);
                $this->db->or_like('tb_department.deparmentDescription', $searchFilter['searchFilter']);
                
            }


            // Si recibimos un limite //
            if ($searchFilter['topFilter'] > 0) {
                $this->db->limit($searchFilter['topFilter']);
            } 

            $quuery = $this->db->order_by("tb_department.idDepartment", "DESC")->get();


            if ($quuery->num_rows() > 0) {
                return $quuery->result_array();
            }
            return null;
        }
    }


	// GET DE LISTADO BUSQUEDA DE INQUIILINO //
	public function byIdDireccion ($id, $idStatus)
	{
		$quuery = null;
		$rs     = null;


        //$this->db->select("*")->from("tb_department");
        //$this->db->join('tb_addres', 'tb_addres.idAdress = tb_department.idAdressKf', 'left');
        //$this->db->where("tb_addres.idAdress =", $id);
        //
        //if($idStatus == 1){ // si le mandas 1 te retorna los APROBADOS
        //    $this->db->where("tb_department.isAprobatedAdmin =", 1);
        //}else if($idStatus == 0){// SI LE MANDAS 0 LOS NO APROBADOS
        //    $this->db->where("tb_department.isAprobatedAdmin =", 0);
        //}

		$this->db->select("*, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients', 'tb_clients.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->where("tb_clients.idClient =", $id);

		if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
			$this->db->where("tb_client_departament.isAprobatedAdmin =", 1);
            $this->db->where("tb_client_departament.idUserKf =", NULL);
            $this->db->or_where("tb_client_departament.idUserKf !=", NULL);
		} else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
            $this->db->where("tb_client_departament.idUserKf =", NULL);
            $this->db->group_start();
            $this->db->where("tb_client_departament.isAprobatedAdmin =", 0);
            $this->db->or_where("tb_client_departament.isAprobatedAdmin =", null);
            $this->db->group_end();
		}else{
            $this->db->where("tb_client_departament.idStatusFk !=", -1);
        }
		$quuery = $this->db->order_by("tb_clients.address", "asc")->get();


		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;

	}
    //type_keychains
    public function keyChainsByIdAddress($id) {
        $quuery = null;
        $rs = null;

        
            $this->db->select("*")->from("tb_company_type_keychains");
            $this->db->where("tb_company_type_keychains.idAddressKf =", $id);
            $quuery = $this->db->order_by("tb_company_type_keychains.idKey", "asc")->get();

            if ($quuery->num_rows() > 0) {
                return $quuery->result_array();
            }
            return null;
        
    }
    public function getAllDepartment ()
	{
		$quuery = null;
		$rs     = null;

		$quuery = $this->db->select("*")->from("tb_client_departament")->order_by("tb_client_departament.idClientDepartament", "asc")->get();

		if ($quuery->num_rows() > 0) {
			return $quuery->result_array();
		}
		return null;

	}

	// GET DE LISTADO DE DEPARTAMENTO POR ID DE DIRECCION, ID DE INQUILINO Y SI ESTA APROBADO //
	public function byIdTenantYDireccion ($id = null, $idT = null, $idStatus = -1, $typeTenant)
	{
		$quuery = null;
		$rs     = null;

        if (!is_null($typeTenant) && $typeTenant==1){
            $this->db->select("*, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
            //$this->db->join('tb_addres', 'tb_addres.idAdress = tb_department.idAdressKf', 'left');
            $this->db->join('tb_clients', 'tb_clients.idClient = tb_client_departament.idClientFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
            if (is_null($id)){
                $this->db->where("tb_clients.idClient =", $id);
            }

            if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
                $this->db->where("tb_client_departament.isAprobatedAdmin =", 1);
            } else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
                $this->db->where("tb_client_departament.isAprobatedAdmin =", 0);
            }
            //$this->db->where("tb_department.idUserKf =", $idT);
            $this->db->where("tb_client_departament.idUserKf =", $idT);
            $quuery = $this->db->order_by("tb_clients.address", "asc")->get();
        }else if (!is_null($typeTenant) && $typeTenant==2){
            $this->db->select("*, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_user");
            $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
            $this->db->join('tb_clients', 'tb_clients.idClient = tb_client_departament.idClientFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');

            if ($idStatus == 1) { // si le mandas 1 te retorna los APROBADOS
                $this->db->where("tb_user.isDepartmentApproved =", 1);
            } else if ($idStatus == 0) {// SI LE MANDAS 0 LOS NO APROBADOS
                $this->db->where("tb_user.isDepartmentApproved =", 0);
            }

            $this->db->where("tb_user.idDepartmentKf =", $id);
            $quuery = $this->db->where("tb_user.idUser =", $idT)->get();

        }
		if ($quuery->num_rows() > 0) {
            
			return $quuery->result_array();
		}
		return null;

	}


	// VERIFICADOS SI EL DEPARTAMENTO POSEE UN PROPIETARIO //
	public function chekDepartamenteOwner ($id)
	{
		$quuery = null;
		$rs     = null;


		$this->db->select("*")->from("tb_client_departament");
		$this->db->where("tb_client_departament.idClientDepartament", $id);
		$this->db->where("tb_client_departament.isAprobatedAdmin =", 1);
        $quuery = $this->db->where("tb_client_departament.idUserKf !=", NULL)->get();

		if ($quuery->num_rows() > 0) {
			return true;
		}
		return false;

	}

    /*APPROVE DEPTO TO OWNER*/
	public function aprobated ($id)
	{
		$this->db->set(
			array(
				'isAprobatedAdmin' => 1
			)
		)->where("idClientDepartament", $id)->update("tb_client_departament");


		if ($this->db->affected_rows() === 1) {
            $user = null;
            $building = null;
            $title = null;
            $subject = null;
            $body = null;
            $to = null;
            //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
            $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
            $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
            $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $id)->get();
            if ($queryBuilding->num_rows() > 0) {
                $building = $queryBuilding->row_array();
                if ($building['idUserKf'] != null) {
                    //GET USER
                    $this->db->select("*")->from("tb_user");
                    $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                    $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                    $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                    $queryUser = $this->db->where("idUser =", $building['idUserKf'])->get();
                    if ($queryUser->num_rows() > 0) {
                        $user = $queryUser->row_array();
                        #MAIL
                        $to = $user['emailUser'];
                        $title = "Alta Departamento";
                        $subject="Alta Departamento ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Alta de Usuario en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b>, ha sido <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffff !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span> satisfactoriamente.</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%">Ya puede utilizar nuestros servicios de Alta de llaves. &nbsp;</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffff;">Entrar</a></span></td>';
                        $body.='</tr>';	
                        //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffff;">Entrar</a></span>
                        $this->mail_model->sendMail($title, $to, $body, $subject);
                    }
                }
            }
			return true;
		} else {
			return false;
		}
	}
	/* AUTORIZAR DEPTO A UN INQUILINO */
	public function approveTenantDepartment ($user)
	{
		$this->db->set(
			array(
				'isDepartmentApproved' => 1
			)
		)->where("idUser", $user['idUser'])->update("tb_user");

		if ($this->db->affected_rows() === 1) {
            $userRs = null;
            $building = null;
            $title = null;
            $subject = null;
            $body = null;
            $to = null;
             //GET USER
             $this->db->select("*")->from("tb_user");
             $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
             $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
             $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
             $queryUser = $this->db->where("idUser =", $user['idUser'])->get();
             if ($queryUser->num_rows() > 0) {
                 $userRs = $queryUser->row_array();
                 
                if ($userRs['isDepartmentApproved'] == 1) {
                    //print_r($user);
                    #$currentURL = $this->get_the_current_url(); //for simple URL
                    //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
                    $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
                    $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                    $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
                    $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
                    $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $userRs['idDepartmentKf'])->get();
                    if ($queryBuilding->num_rows() > 0) {
                        $building = $queryBuilding->row_array();
                        //print_r($building);
                        #MAIL
                        $to = $userRs['emailUser'];
                        $title = "Departamento Asociado";
                        $subject="Alta Departamento ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$userRs['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Alta de Usuario en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b>, ha sido <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffff !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span> satisfactoriamente.</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%">Ya puede utilizar nuestros servicios de Alta de llaves. &nbsp;</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
                        $body.='</tr>';	
                        //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                        //print_r($subject);
                        $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                        if ($rs == "Enviado" && $user['registerBy']['idProfileKf']!=1 && $user['registerBy']['idProfileKf']!=4){
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
                                $to = $buildingAdminMail['mailContact'];
                                $title = "Alta de Departamento";
                                $subject="Alta de Departamento :: ".$building['Depto'];
                                $body='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El Usuario, <b>'.$userRs['fullNameUser'].'</b> <span style="font-size:0.6vw;background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$user['registerBy']['nameProfile'].'</span>, ha realizado el Alta,</td>';
                                $body.='</tr>';
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:0.5%;padding-bottom:4%;">'.$building['ClientType'].':<b> '.$building['name'].'</b>, Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span></td>';
                                $body.='</tr>';
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" bgcolor="#ffffff">';
                                $body.='<table cellpadding="5" cellspacing="1" border="0" width="100%" align="center" style="min-width: 1024px; font-size:0.7vw; font-family: sans-serif; color: #555555; padding:1%">';
                                $body.='<thead style=" background: #427A9D; color: white;">
                                        <tr width="100%" style="text-align: center;">
                                            <th style="font-size:0.9vw; font-family: sans-serif;" width="20%">Nombre</th>
                                            <th style="font-size:0.9vw; font-family: sans-serif;" width="10%">Perfil</th>
                                            <th style="font-size:0.9vw; font-family: sans-serif;" width="30%">Correo</th>
                                            <th style="font-size:0.9vw; font-family: sans-serif;" width="30%">Telefono</th>
                                            <th style="font-size:0.9vw; font-family: sans-serif;" width="10%"> Estatus</th>
                                        </tr>
                                        </thead>';
                                $body.='<tbody>';
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td align="middle" valign="middle" style="font-size:0.7vw; font-family: sans-serif;">'.$userRs['fullNameUser'].'</td>';
                                $body.='<td align="middle" valign="middle" style="font-size:0.7vw; font-family: sans-serif;"><span style="font-size:0.7vw;background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$userRs['nameProfile'].'</span></td>';
                                $body.='<td align="middle" valign="middle" style="font-size:0.7vw; font-family: sans-serif;">'.$userRs['emailUser'].'</td>';
                                $body.='<td align="middle" valign="middle" style="font-size:0.7vw; font-family: sans-serif;">'.$userRs['phoneNumberUser'].'</td>';
                                $body.='<td align="middle" valign="middle" style="font-size:0.7vw; font-family: sans-serif;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span></td>';
                                $body.='</tr>';
                                $body.='</tbody>';
                                $body.='</table>';
                                $body.='</td>';
                                $body.='</tr>';	
                                //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                $this->mail_model->sendMail($title, $to, $body, $subject);
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

	/* AUTORIZAR DEPTO A UN INQUILINO */
	public function deptoTenantStatus ($id, $idStatus)
	{
		$this->db->set(
			array(
				'isDepartmentApproved' => $idStatus
			)
		)->where("idUser", $id)->update("tb_user");

		if ($this->db->affected_rows() === 1) {
            $user = null;
            $building = null;
            $title = null;
            $subject = null;
            $body = null;
            $to = null;
             //GET USER
             $this->db->select("*")->from("tb_user");
             $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
             $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
             $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
             $queryUser = $this->db->where("idUser =", $id)->get();
             if ($queryUser->num_rows() > 0) {
                 $user = $queryUser->row_array();
                 
                if ($user['isDepartmentApproved'] == 1) {
                    //print_r($user);
                    #$currentURL = $this->get_the_current_url(); //for simple URL
                    //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
                    $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
                    $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                    $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
                    $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
                    $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $user['idDepartmentKf'])->get();
                    if ($queryBuilding->num_rows() > 0) {
                        $building = $queryBuilding->row_array();
                        //print_r($building);
                        #MAIL
                        $to = $user['emailUser'];
                        $title = "Departamento Asociado";
                        $subject="Alta Departamento ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Alta de Usuario en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b>, ha sido <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffff !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span> satisfactoriamente.</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%">Ya puede utilizar nuestros servicios de Alta de llaves. &nbsp;</td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span></td>';
                        $body.='</tr>';	
                        //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                        //print_r($subject);
                        $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                        if ($rs == "Enviado"){
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
                                $to = $buildingAdminMail['mailContact'];
                                $title = "Alta de Departamento";
                                $subject="Alta de Departamento :: ".$building['Depto'];
                                $body='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha sido dado de Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:3%;">Estado: <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">Aprobado</span></td>';
                                $body.='</tr>';	
                                //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                $this->mail_model->sendMail($title, $to, $body, $subject);
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

	public function desaprobated ($id)
	{
		$this->db->set(
			array(
				'isAprobatedAdmin' => 0
			)
		)->where("idClientDepartament", $id)->update("tb_client_departament");


		if ($this->db->affected_rows() === 1) {
			return true;
		} else {
			return false;
		}
	}


	public function requesLowByProp ($id)
	{
		$this->db->set(
			array(
				'isRequesLowByProp' => 1
			)
		)->where("idClientDepartament", $id)->update("tb_client_departament");


		if ($this->db->affected_rows() === 1) {
            $user = null;
            $building = null;
            $title = null;
            $subject = null;
            $body = null;
            $to = null;
            $currentURL = $this->get_the_current_url(); //for simple URL
            //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
            $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
            $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
            $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $id)->get();
            if ($queryBuilding->num_rows() > 0) {
                $building = $queryBuilding->row_array();
                
                if ($building['idUserKf'] != null) {
                    //GET USER
                    $this->db->select("*")->from("tb_user");
                    $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                    $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                    $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                    $queryUser = $this->db->where("idUser =", $building['idUserKf'])->get();
                    if ($queryUser->num_rows() > 0) {
                        $user = $queryUser->row_array();
                        #MAIL TO USER
                        $rs = null;
                        $to = $user['emailUser'];
                        $title = "Baja de Departamento";
                        $subject="Baja Departamento :: ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado la Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                        $body.='</tr>';
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffffff;">Entrar</a></span></td>';
                        $body.='</tr>';	
                        //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                        $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                        if ($rs == "Enviado"){
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
                                $approval_url="https://".BSS_HOST."/login/approve/depto/down/depto/".$building['idClientDepartament']."/user/".$user['idUser'];
                                $to = $buildingAdminMail['mailContact'];
                                $title = "Baja de Departamento";
                                $subject="Baja de Departamento :: ".$building['Depto'];
                                $body='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado la Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#d9534f;border-color: #d43f3a !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px; cursor:pointer;"><a href="'.$approval_url.'" target="_blank" title="Aprobar" style="text-decoration: none; color: #ffffff;">Confirmar</a></span></td>';
                                $body.='</tr>';	
                                //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                $this->mail_model->sendMail($title, $to, $body, $subject);
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

	public function requesLowByTenant ($id)
	{
		$this->db->set(
			array(
				'isRequesLowByTenant' => 1
			)
		)->where("idUser", $id)->update("tb_user");


		if ($this->db->affected_rows() === 1) {
            $user = null;
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
            $queryUser = $this->db->where("idUser =", $id)->get();
            if ($queryUser->num_rows() > 0) {
                $user = $queryUser->row_array();
                if ($user['isRequesLowByTenant'] != null) {
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
                        $to = $user['emailUser'];
                        $title = "Baja de Departamento";
                        $subject="Baja Departamento :: ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado la Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                        $body.='</tr>';
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffffff;">Entrar</a></span></td>';
                        $body.='</tr>';	
                        //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                        $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                        if ($rs == "Enviado"){
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
                                $approval_url="https://".BSS_HOST."/login/approve/depto/down/depto/".$building['idClientDepartament']."/user/".$user['idUser'];
                                $to = $buildingAdminMail['mailContact'];
                                $title = "Baja de Departamento";
                                $subject="Baja de Departamento :: ".$building['Depto'];
                                $body='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado la Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
                                $body.='</tr>';	
                                $body.='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#d9534f;border-color: #d43f3a !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px; cursor:pointer;"><a href="'.$approval_url.'" target="_blank" title="Aprobar" style="text-decoration: none; color: #ffffff;">Confirmar</a></span></td>';
                                $body.='</tr>';	
                                //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                $this->mail_model->sendMail($title, $to, $body, $subject);
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
	
    /* AGREGRA NUEVO USUARIO EMPRESA */
    public function add($department) {

        /* CREAMOS UN USUARIO PARA ESE CLIENE */
        $this->db->insert('tb_department', array(
        	'departmentAddress' => $department['departmentAddress'],
			'departmentFloor' => $department['departmentFloor'],
			'deparmentNumber' => $department['deparmentNumber'],
			'departmentLat' => $department['departmentLat'],
			'departmentLon' => $department['departmentLon'],
			'deparmentDescription' => $department['deparmentDescription'],
            'idStatusKf' => 1
                )
        );

        if ($this->db->affected_rows() === 1) {
            $id = $this->db->insert_id();
            return $id;
        } else {
            return null;
        }
    }

    /* ASSIGN OWNER TO DEPARTMENT */
    public function update ($department)
    {

        $this->db->set(
            array(
                'idUserKf' => $department['idUserKf']
                //'idDepartment'=>$department['idDepartment']
            )
        )->where("idClientDepartament", $department['idDepartment'])->update("tb_client_departament");


        if ($this->db->affected_rows() === 1) {
            $user = null;
            $building = null;
            $title = null;
            $subject = null;
            $body = null;
            $to = null;
            $currentURL = $this->get_the_current_url(); //for simple URL
            //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
            $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
            $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
            $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
            $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $department['idDepartment'])->get();
            if ($queryBuilding->num_rows() > 0) {
                $building = $queryBuilding->row_array();
                
                if ($building['idUserKf'] != null) {
                    //GET USER
                    $this->db->select("*")->from("tb_user");
                    $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                    $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                    $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                    $queryUser = $this->db->where("idUser =", $department['idUserKf'])->get();
                    if ($queryUser->num_rows() > 0) {
                        $user = $queryUser->row_array();
                        #MAIL TO USER
                        $rs = null;
                        $to = $user['emailUser'];
                        $title = "Alta de Departamento";
                        $subject="Alta Departamento :: ".$building['Depto'];
                        $body='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado el Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                        $body.='</tr>';
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
                        $body.='</tr>';	
                        $body.='<tr width="100%" bgcolor="#ffffff">';
                        $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffffff;">Entrar</a></span></td>';
                        $body.='</tr>';
                        $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                        if ($rs == "Enviado" && $department['isApprovalRequired']){
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
                                $approval_url="https://".BSS_HOST."/login/approve/depto/up/depto/".$department['idDepartment']."/user/".$department['idUserKf'];
                                $to = $buildingAdminMail['mailContact'];
                                $title = "Alta de Departamento";
                                $subject="Alta de Departamento :: ".$building['Depto'];
                                $body='<tr width="100%" bgcolor="#ffffff">';
                                $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
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
            return true;
        } else {
            return false;
        }
    }

    /* REMOVE TENANT */
    public function removeTenant ($data)
    {

        $idAddress_tmp=null;
        if ($data['idTypeTenant'] == 1) //USUARIO DE TIPO PROPIETARO
        {
            $this->db->set(
                array(
                    'idUserKf'         => null,
                    'isAprobatedAdmin' => null,
                    'isRequesLowByProp' => null
                )
            )
                ->where("idUserKf", $data['idUser'])
                ->where("idClientDepartament", $data['idDepartmentKf'])
                ->update("tb_client_departament");


            if ($this->db->affected_rows() === 1) {
                $user = null;
                $building = null;
                $title = null;
                $subject = null;
                $body = null;
                $to = null;
                 //GET USER
                 $this->db->select("*")->from("tb_user");
                 $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                 $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                 $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                 $queryUser = $this->db->where("idUser =", $data['idUser'])->get();
                 if ($queryUser->num_rows() > 0) {
                     $user = $queryUser->row_array();
                        //print_r($user);
                        #$currentURL = $this->get_the_current_url(); //for simple URL
                        //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
                        $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
                        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                        $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
                        $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
                        $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $data['idDepartmentKf'])->get();
                        if ($queryBuilding->num_rows() > 0) {
                            $building = $queryBuilding->row_array();
                            //print_r($building);
                            #MAIL
                            $to = $user['emailUser'];
                            $title = "Baja de Departamento";
                            $subject="Baja Departamento ".$building['Depto'];
                            $body='<tr width="100%" bgcolor="#ffffff">';
                            $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                            $body.='</tr>';	
                            $body.='<tr width="100%" bgcolor="#ffffff">';
                            $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">La Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                            $body.='</tr>';	
                            $body.='<tr width="100%" bgcolor="#ffffff">';
                            $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:3%;">Ha sido procesada satisfactoriamente, contacte a la Administración ante cualquier duda. &nbsp;</td>';
                            $body.='</tr>';	
                            $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                            if ($rs == "Enviado"){
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
                                    $to = $buildingAdminMail['mailContact'];
                                    $title = "Baja de Departamento";
                                    $subject="Baja de Departamento :: ".$building['Depto'];
                                    $body='<tr width="100%" bgcolor="#ffffff">';
                                    $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                                    $body.='</tr>';	
                                    $body.='<tr width="100%" bgcolor="#ffffff">';
                                    $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:3%;">Se ha dado de Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                                    $body.='</tr>';	
                                    //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                    $this->mail_model->sendMail($title, $to, $body, $subject);
                                }
                            }
                        }
                }
                return true;
            } else {
                return false;
            }

        } else { // USUARIO DE TIPO HABITANTE
            if ($data['idProfileKf'] == 4 || $data['idProfileKf'] == 6){
                if ($data['idProfileKf'] == 4){
                    $this->db->set(
                        array(
                            'idDepartmentKf'       => null,
                            'idAddresKf'           => null,
                            'isDepartmentApproved' => 0,
                            'isRequesLowByTenant'  => 0
                        )
                    )
                    ->where("idUser", $data['idUser'])
                    ->where("idDepartmentKf", $data['idDepartmentKf'])
                    ->update("tb_user");
                }else{
                    $this->db->set(
                        array(
                            'idDepartmentKf'       => null,
                            'isDepartmentApproved' => 0,
                            'isRequesLowByTenant'  => 0
                        )
                    )
                    ->where("idUser", $data['idUser'])
                    ->where("idDepartmentKf", $data['idDepartmentKf'])
                    ->update("tb_user");
                }
            }else{
                $this->db->set(
                    array(
                        'idDepartmentKf'       => null,
                        'isDepartmentApproved' => 0,
                        'idAddresKf'           => null,
                        'isRequesLowByTenant'  => 0
                    )
                )
                    ->where("idUser", $data['idUser'])
                    ->where("idDepartmentKf", $data['idDepartmentKf'])
                    ->update("tb_user");
            }
            if ($this->db->affected_rows() === 1) {
                $user = null;
                $building = null;
                $title = null;
                $subject = null;
                $body = null;
                $to = null;
                 //GET USER
                 $this->db->select("*")->from("tb_user");
                 $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                 $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                 $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                 $queryUser = $this->db->where("idUser =", $data['idUser'])->get();
                 if ($queryUser->num_rows() > 0) {
                     $user = $queryUser->row_array();
                    if ($user['idDepartmentKf'] == null && $user['isDepartmentApproved'] == 0) {
                        //print_r($user);
                        #$currentURL = $this->get_the_current_url(); //for simple URL
                        //DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
                        $this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
                        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                        $this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
                        $this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
                        $queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $data['idDepartmentKf'])->get();
                        if ($queryBuilding->num_rows() > 0) {
                            $building = $queryBuilding->row_array();
                            //print_r($building);
                            #MAIL
                            $to = $user['emailUser'];
                            $title = "Baja de Departamento";
                            $subject="Baja Departamento ".$building['Depto'];
                            $body='<tr width="100%" bgcolor="#ffffff">';
                            $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                            $body.='</tr>';	
                            $body.='<tr width="100%" bgcolor="#ffffff">';
                            $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">La Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                            $body.='</tr>';	
                            $body.='<tr width="100%" bgcolor="#ffffff">';
                            $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:3%;">Ha sido procesada satisfactoriamente, contacte a la Administración ante cualquier duda. &nbsp;</td>';
                            $body.='</tr>';	
                            $rs = $this->mail_model->sendMail($title, $to, $body, $subject);
                            if ($rs == "Enviado"){
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
                                    $to = $buildingAdminMail['mailContact'];
                                    $title = "Baja de Departamento";
                                    $subject="Baja de Departamento :: ".$building['Depto'];
                                    $body='<tr width="100%" bgcolor="#ffffff">';
                                    $body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
                                    $body.='</tr>';	
                                    $body.='<tr width="100%" bgcolor="#ffffff">';
                                    $body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:3%;">Se ha dado de Baja del Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
                                    $body.='</tr>';	
                                    //<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
                                    $this->mail_model->sendMail($title, $to, $body, $subject);
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

    }

    public function changueStatus ($id, $idStatus)
    {
        $this->db->set(
            array(
                'idStatusFk' => $idStatus
            )
        )->where("idClientDepartament", $id)->update("tb_client_departament");

        if ($this->db->affected_rows() === 1) {
            return true;
        } else {
            return false;
        }
    }


}
?>