<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tenant_model extends CI_Model
{
	
	public function __construct()
	{
        parent::__construct();
	}


	 // GET DE LISTADO BUSQUEDA DE INQUIILINO //
    public function get($id = null, $searchFilter = null) {
        $quuery = null;
        $rs = null;

        // SI RECIBIMOS EL ID DE EL USUARIO //
        if (!is_null($id)) 
        {

            $this->db->select("*")->from("tb_user");
            $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
            $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTyepeAttendantKf', 'left');
			$this->db->where("tb_user.idStatusKf !=", -1);
            $quuery = $this->db->where("tb_user.idUser = ", $id)->get();


            if ($quuery->num_rows() === 1) {
                $rs =  $quuery->row_array();
                return $rs;
            }
        } 
        else
         { 

            $this->db->select("*")->from("tb_user");
            $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_user.idDepartmentKf', 'left');
            $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTyepeAttendantKf', 'left');
			$this->db->where("tb_user.idStatusKf !=", -1);

            // Si recibimos id de administrador de cnosorcio  //
            if (@$searchFilter['idAdminR'] > 0) {
                $this->db->where('idDepartmentKf in (
                SELECT  idDepartment  FROM tb_client_departament WHERE idUserAdminRKf = '.$searchFilter['idAdminR'].' )',NULL, FALSE);
            } 

            if(@$searchFilter['idTypeTenantKf'] > 0)
            {
                 $this->db->where('tb_user.idTyepeAttendantKf', $searchFilter['idTypeTenantKf']);
            } 

            /* Busqueda por filtro */
            if (!is_null(@$searchFilter['searchFilter']) && @$searchFilter['searchFilter'] != "") 
            {
            	$this->db->like('tb_user.fullNameUser', $searchFilter['searchFilter']);
                $this->db->or_like('tb_user.phoneNumberUser', $searchFilter['searchFilter']);
                $this->db->or_like('tb_user.emailTenant', $searchFilter['searchFilter']);

				
				
				if(@$searchFilter['idDepartmentKf'] > 0)
				{
					 $this->db->or_where('tb_user.idDepartmentKf', $searchFilter['idDepartmentKf']);
                }
                
                
            }

            


            // Si recibimos un limite //
            if ($searchFilter['topFilter'] > 0) {
                $this->db->limit($searchFilter['topFilter']);
            } 

            $quuery = $this->db->order_by("tb_user.idUser", "DESC")->get();


            if ($quuery->num_rows() > 0) {
                return $quuery->result_array();
            }
            return null;
        }
    }
	
    /* AGREGRA NUEVO USUARIO EMPRESA */
    public function add($tenant) {

        /* CREAMOS UN USUARIO PARA ESE CLIENE */
        $this->db->insert('tb_user', array(
            'fullNameUser' => $tenant['fullNameUser'],
            'idTypeTenantKf' => $tenant['idTypeTenantKf'],
            'phoneNumberUser' => $tenant['phoneNumberUser'],
            'idDepartmentKf' => $tenant['idDepartmentKf'],
            'emailTenant' => $tenant['emailTenant'],
            'phoneLocalNumberUser' => $tenant['phoneLocalNumberUser'],
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

    /* LISTADO DE FILTROS */
    public function getFilterForm() {

        $department = null;
        $profile = null;
        $typetenant = null;


        $query =  $this->db->select("*")->from("tb_client_departament")->get();
        if ($query->num_rows() > 0) {
            $department = $query->result_array();
        }

        $query =  $this->db->select("*")->from("tb_typetenant")->get();
        if ($query->num_rows() > 0) {
            $typetenant = $query->result_array();
        }



        $filter = array(
            'department'  => $department,
            'typetenant' => $typetenant
        );

        return $filter;
    }

    /* LISTADO DE FILTROS */
    public function getTenanatByIdDepartament($id, $idType) {
        
        $tenant = null;

        if (@$idType > 0){
            $this->db->select("*")->from("tb_user");
            $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
            $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
            $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
            $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
            
            if (@$id > 0){
                $this->db->where("tb_user.idTypeTenantKf =", $idType);
                $query = $this->db->where("tb_user.idDepartmentKf =", $id)->get();
                
            }else{
                $query = $this->db->where("tb_user.idTyepeAttendantKf =", $idType)->get();
            }
            
            }

            if (@$idType < 1){
            
            if (@$id > 0){
                $this->db->select("*")->from("tb_user");
                $this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
                $this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
                $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = tb_user.idTypeTenantKf', 'left');
                $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
                $query = $this->db->where("tb_user.idDepartmentKf =", $id)->get();
                
            }
            }
            
        
        
    
        if ($query->num_rows() > 0) {
            $tenant = $query->result_array();
        }

        $rs = array(
            'tenant' => $tenant
        );

        return $rs;
    }
    
    public function allByIdDepartament($id) {
        
        $tenant = null;
        $extrawhere = "";
        $extrawherekey = "";
        $keyfound = null;

        if($id > 0){
            $extrawhere = " t1.idDepartmentKf in (select tb_client_departament.idClientDepartament from tb_client_departament where idClientDepartament = ".$id.")  or t1.idUser in (select tb_client_departament.idUserKf from  tb_client_departament where idClientDepartament = ".$id." ) ";
        }else{
            return null;
        }
        $this->db->select("*")->from("tb_user as t1");
        $this->db->join('tb_profile', 'tb_profile.idProfile = t1.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = t1.idSysProfileFk', 'left');
        $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = t1.idDepartmentKf', 'left');
        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = t1.idTypeTenantKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = t1.idStatusKf', 'left');
        $query = $this->db->where($extrawhere)->get();



    if($query->num_rows() > 0){
        $tenant = $query->result_array();
        
        foreach ($tenant as $key => $item) {
            $idTypeTenantKf = $item['idTypeTenantKf'];
            $idUserKf = $item['idUser'];
            $query2    = null;
            if (isset($idTypeTenantKf)) {
                
                $extrawherekey = "tb_keychain.idUserKf=$idUserKf AND tb_keychain.idDepartmenKf=$id";
                
                $this->db->select("*")->from("tb_keychain");
                $this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
                $this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
                $query2 = $this->db->where($extrawherekey)->get();
                if ($query2->num_rows() === 1) {
                    $keyfound = $query2->row_array();
                    $tenant[$key]['myKeys'] = $keyfound;
                }else{
                    $tenant[$key]['myKeys']=null;
                }
            }
            
        }
        $rs = array(
            'tenant' => $tenant
        );
    }else{
        $rs = null;
    }
        return $rs;
    }

    public function allWithoutKeyAssignedByIdDepartament($id) {
        
        $tenant = [];
        $extrawhere = "";
        $keyfound = null;

        if($id > 0){
            $extrawhere = " t1.idDepartmentKf in (select tb_client_departament.idClientDepartament from tb_client_departament where idClientDepartament = ".$id.")  or t1.idUser in (select tb_client_departament.idUserKf from  tb_client_departament where idClientDepartament = ".$id." ) ";
        }else{
            return null;
        }
        $this->db->select("*")->from("tb_user as t1");
        $this->db->join('tb_profile', 'tb_profile.idProfile = t1.idProfileKf', 'left');
        $this->db->join('tb_profiles', 'tb_profiles.idProfiles = t1.idSysProfileFk', 'left');
        $this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = t1.idDepartmentKf', 'left');
        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
        $this->db->join('tb_typetenant', 'tb_typetenant.idTypeTenant = t1.idTypeTenantKf', 'left');
        $this->db->join('tb_type_attendant', 'tb_type_attendant.idTyepeAttendant = t1.idTyepeAttendantKf', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = t1.idStatusKf', 'left');
        $quuery = $this->db->where($extrawhere)->get();

        if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			foreach ($rs as $key => $item) {
				$idUser = $item['idUser'];
				$query2    = null;
				$query2 = $this->db->select("*")->from("tb_keychain");
				$query2 = $this->db->where('idUserKf', $idUser);
				$query2 = $this->db->get();
				if ($query2->num_rows() === 0) {
					array_push($tenant, $item);
				}
			}
			return $tenant;
		}
		return null;
    }

     /* LISTADO DE FILTROS */
     public function findByEmail($mail) {
        
        $tenant = null;

        $this->db->select("*")->from("tb_user");
        $query = $this->db->where("tb_user.emailUser =", $mail)->get();
        if ($query->num_rows() > 0) {
            $tenant = $query->row_array();
        }

        return $tenant;
    }

     /* LISTADO DE FILTROS */
     public function getDepartamentByIdAdminR($id) {
        
        $tenant = null;

        $this->db->select("*")->from("tb_client_departament");
        $query = $this->db->where("tb_client_departament.idUserAdminRKf =", $id)->get();
        if ($query->num_rows() > 0) {
            $tenant = $query->result_array();
        }

        $rs = array(
            'tenant' => $tenant
        );

        return $rs;
    }

     /* EDITAR DATOS DE UN inquilino */
    public function update($tenant) {

        $this->db->set(
                array(
                    'fullNameUser' => $tenant['fullNameUser'],
		            'idTypeTenantKf' => $tenant['idTypeTenantKf'],
		            'phoneNumberUser' => $tenant['phoneNumberUser'],
		            'idDepartmentKf' => $tenant['idDepartmentKf'],
		            'emailTenant' => $tenant['emailTenant'],
                    'phoneLocalNumberUser' => $tenant['phoneLocalNumberUser']
                )
        )->where("idUser", $tenant['idUser'])->update("tb_user");

        
        if ($this->db->affected_rows() === 1) {
            return true;
        } else {
            return false;
        }
    }

     public function changueStatus($id, $idStatus) {
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


}
?>
