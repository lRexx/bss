<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profiles_model extends CI_Model
{
	
	public function __construct()
	{
		parent::__construct();
    }
	 
		

		public function add($profile) {

			$user = null;
    
			$this->db->select("*")->from("tb_profiles");
			$query = $this->db->where("tb_profiles.name =", $profile['name'])->get();
            if($query->num_rows() < 1){ 
               

				$this->db->insert('tb_profiles', array(
					'name' => $profile['name'])
				);

				if ($this->db->affected_rows() === 1) {
					$idProfilesFk = $this->db->insert_id();

					if(count(@$profile['list_id_modules']) > 0)
					{
						foreach ($profile['list_id_modules'] as $valor) {
							
							$this->db->insert('tb_profiles_modules', array(
								'idProfilesFk' => $idProfilesFk,
								'idModuleFk' => $valor['idModuleFk'])
							);
						}
					}
					return 1;
				} else {
					return 0;
				}
				
			} else{
				return 2;
			}
		
		   
		}

		public function update($profile) {
			$this->db->set(
					array('name' =>  $profile['name'])
			)->where("idProfiles", $profile['idProfiles'])->update("tb_profiles");

				if(count(@$profile['list_id_modules']) > 0)
					{
						$this->db->delete('tb_profiles_modules', array('idProfilesFk' => $profile['idProfiles']));  

						foreach ($profile['list_id_modules'] as $valor) {
							
							$this->db->insert('tb_profiles_modules', array(
								'idProfilesFk' => $profile['idProfiles'],
								'idModuleFk' => $valor['idModuleFk'])
							);
						}
						return true;
					}
			
		}

		public function delete($idProfiles) {
			$this->db->set(
				array('idStatus' =>  -1))->where("idProfiles", $idProfiles)->update("tb_profiles"); 
			return true;
		}

		public function get($id = null, $searchFilter = null) {
			$quuery = null;
			$rs = null;
	
			if (!is_null($id)) 
			{
	
				$this->db->select("*")->from("tb_profiles");
				$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_profiles.idStatus', 'left');
				$this->db->order_by("tb_profiles.idProfiles asc");
				$quuery = $this->db->where("tb_profiles.idProfiles =", $id)->get();
	
	
				if ($quuery->num_rows() === 1) {
					$rs =  $quuery->row_array();


					$this->db->select("*")->from("tb_profiles_modules");
					$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
					$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $id)->get();

					$rs2 =  $quuery->result_array();

					$rs['modules'] =  $rs2;

					return $rs;
				}
				return null;
			}else
			{ 
   
				$this->db->select("*")->from("tb_profiles");
				$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_profiles.idStatus', 'left');
				$this->db->where("tb_profiles.idStatus !=", -1);
   
		  
					/* Busqueda por filtro */
					if (isset($searchFilter['searchFilter'])) 
					{
						$this->db->like('tb_profiles.name', $searchFilter['searchFilter']);
					}
   
   
			   $quuery = $this->db->order_by("tb_profiles.idProfiles", "ASC")->get();
   
   
			   if ($quuery->num_rows() > 0) {

					$rs =  $quuery->result_array();

					$list =  array();

					$i = 0;
					foreach ($quuery->result() as &$row){
						//USERS
						$this->db->select("*")->from("tb_user");
						$quuery = $this->db->where("tb_user.idSysProfileFk =", $row->idProfiles)->get();

						$rs3 =  $quuery->result_array();
						$rs[$i]['users'] =  $rs3;
						//MODULES						
						$this->db->select("*")->from("tb_profiles_modules");
						$this->db->join('tb_modules', 'tb_modules.idModule = tb_profiles_modules.idModuleFk', 'inner');
						$quuery = $this->db->where("tb_profiles_modules.idProfilesFk =", $row->idProfiles)->get();

						$rs2 =  $quuery->result_array();
						$rs[$i]['modules'] =  $rs2;
						$i++;
					}
					

				   return $rs;
			   }
			   return null;
		   }
		}

		public function deleteModules($idProfileModule) {

			$this->db->delete('tb_profiles_modules', array('idProfileModule' => $idProfileModule));  
			return true;
					
			
		}


		public function getModules() {
			$query = $this->db->select("*")->from("tb_modules")->get();
			if ($query->num_rows() > 0) {
				$rs = $query->result_array();
				return $rs;
			}
			return null;
				
		}
	
	
	}
?>