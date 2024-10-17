<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
require_once APPPATH."third_party/PHPExcel/PHPExcel.php";
require_once APPPATH."third_party/PHPExcel/PHPExcel/IOFactory.php";

class Llavero_model extends CI_Model
{

	public function __construct()
	{
		parent::__construct();
		//$this->load->library('excel');

	}


	public function get()
	{
		$quuery = null;
		$rs = null;
		$fields_selected="tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly, tb_user.fullNameUser,tb_profiles.name AS RoleName,tb_profile.nameProfile,tb_status.idStatusTenant,tb_status.statusTenantName AS statusUser,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_keychain_status', 'tb_keychain_status.idKeychainStatus = tb_keychain.idKeychainStatusKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->join('tb_user', 'tb_user.idUser = tb_keychain.idUserKf', 'left');
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		$this->db->group_start()
         ->where_in('tb_keychain.idKeychainStatusKf', [1])  // Matches 1
         ->or_where('tb_keychain.idKeychainStatusKf', null)  // Matches NULL
         ->group_end();
		$quuery = $this->db->order_by("tb_keychain.idKeychain", "ASC")->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}

	public function getByBuilding($idClientKf = null)
	{
		$quuery = null;
		$rs = null;
		$fields_selected="tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->where('a.idClient', $idClientKf);
		$this->db->or_where('b.idClient', $idClientKf);
		$this->db->group_start()
		->where_in('tb_keychain.idKeychainStatusKf', [1])  // Matches 1
		->or_where('tb_keychain.idKeychainStatusKf', null)  // Matches NULL
		->group_end();
		$quuery = $this->db->order_by("tb_keychain.idKeychain", "ASC")->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}

	public function find_by_code($code,$idClientKf)
	{
		$quuery = null;
		$rs = null;
		$fields_selected="tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->group_start()
		->where('a.idClient', $idClientKf)
		->or_where('b.idClient', $idClientKf)
		->group_end();
		$quuery = $this->db->where('tb_keychain.codigo', $code)->get();
		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array()[0];
			return $rs;
		}
		return null;
	}

	public function find_by_idDepartment($id)
	{
		$quuery = null;
		$rs = null;
		$this->db->select("tb_clients.idClient")->from("tb_client_departament");
		$this->db->join('tb_clients', 'tb_clients.idClient = tb_client_departament.idClientFk', 'left');
		$quuery = $this->db->where('idClientFk', $id)->get();
		if ($quuery->num_rows() > 0) {
			return $quuery->row()->idClient;  // Accessing idClient directly
		}
		return null;
	}
	public function getByDeparment($idDepartmenKf = null)
	{
		if (is_null($idDepartmenKf)) {
			$this->response(null, 404);
		}
		$quuery = null;
		$rs = null;
		$fields_selected="tb_user.*, tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model, tb_products.brand";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->join('tb_clients as c', 'c.idClient = tb_keychain.idClientAdminKf', 'left');
		$this->db->join('tb_user', 'tb_user.idUser = tb_keychain.idUserKf', 'left');
		$quuery = $this->db->where('idDepartmenKf', $idDepartmenKf)->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}

	public function getLlaveroSinDepartameto()
	{
		$quuery = null;
		$rs = null;

		$quuery = $this->db->select("*")->from("tb_keychain")->where('idDepartmenKf is NULL')->get();

		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;
	}

	public function add($items, $is_multiple = true)
	{
		$errors_multiple = null;
		$idClientKf = null;
		if ($is_multiple) {
			for ($i = 0; $i < count($items['departamento']); $i++) {
				$idClientKf = null;
				if (!is_null($items['departamento'][$i])){
					$idClientKf=$items['departamento'][$i];
				}else{
					$idClientKf = $this->find_by_idDepartment($items['departamento'][$i]);
				}
				if (!is_null($this->find_by_code($items['codigo'][$i],$idClientKf))) {
					$errors_multiple[] = $items['codigo'][$i];
				} else {
					$this->db->insert('tb_keychain', [
							"idProductKf" 			=> $items['producto'][$i],
							"codExt" 				=> $items['codigoExt'][$i],
							"codigo" 				=> $items['codigo'][$i],
							"idDepartmenKf" 		=> $items['departamento'][$i],
							"idClientKf" 			=> $items['cliente'][$i],
							"idCategoryKf" 			=> $items['categoria'][$i],
							"idKeychainStatusKf" 	=> 1,
							//"idUserKf" 	=> $items['idUserKf'][$i],
							//"isKeyTenantOnly" => $items['isKeyTenantOnly'][$i],
						]
					);
				}
			}
			if (!is_null($errors_multiple) > 0) {
				return $errors_multiple;
			}
		} else {
			if (!is_null($items['idClientKf'])){
				$idClientKf=$items['idClientKf'];
			}else{
				$idClientKf = $this->find_by_idDepartment($items['idDepartmenKf']);
			}
			if (!is_null($this->find_by_code($items['codigo'], $idClientKf))) {
				return 2;
			} else {
				$this->db->insert('tb_keychain', [
						"idProductKf" 			=> $items['idProductKf'],
						"codExt" 				=> $items['codExt'],
						"codigo" 				=> $items['codigo'],
						"idDepartmenKf" 		=> $items['idDepartmenKf'],
						"idClientKf" 			=> $items['idClientKf'],
						"idUserKf" 				=> $items['idUserKf'],
						"idCategoryKf"			=> $items['idCategoryKf'],
						"isKeyTenantOnly"		=> $items['isKeyTenantOnly'],
						"idKeychainStatusKf" 	=> 1,
					]
				);
				$response['idKeychainKf'] = $this->db->insert_id();
			}

		}

		if ($this->db->affected_rows() === 1) {
			return $response;
		} else {
			return 0;
		}

	}

	public function edit($item)
	{
		$quuery = $this->db->select("*")->from("tb_keychain")->where("idKeychain", $item['idKeychain'])->get();
		if ($quuery->num_rows() > 0) {
			$this->db->set(
				[
					"idProductKf" 			=> $item['idProductKf'],
					"codExt" 	 			=> $item['codExt'],
					"codigo" 	  			=> $item['codigo'],
					"idDepartmenKf" 		=> $item['idDepartmenKf'],
					"idClientKf" 			=> $item['idClientKf'],
					"idUserKf" 				=> $item['idUserKf'],
					"idCategoryKf" 			=> $item['idCategoryKf'],
					"isKeyTenantOnly" 		=> $item['isKeyTenantOnly'],
					"idKeychainStatusKf" 	=> @$item['idKeychainStatusKf'],
				]
			)->where("idKeychain", $item['idKeychain'])->update("tb_keychain");

			if ($this->db->affected_rows() >= 0) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return 3;
		}
	}


//ya no se usa
	public function addVarios($file)
	{ //recibe excel y lo decodifica

		$uploaddir = realpath(APPPATH . '../../uploads');
		$path = $_FILES['excel']['name'];
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$user_img = time() . rand() . '.' . $ext;
		$uploadfile = $uploaddir . time() . '_' . str_replace(" ", "", $path);
		//$this->response($uploadfile, 200);
		if ($file["excel"]["name"]) {
			move_uploaded_file($file["excel"]["tmp_name"], "$uploadfile");
		}

		$archivo_plantilla = null;
		$ruta = $uploadfile;
		if (!file_exists($ruta)) {
			return "No existe el archivo";
		}
		$objReader = new PHPExcel_Reader_Excel2007();
		$objPHPExcel = new PHPExcel();
		$archivo_valido = false;
		try {
			$inputFileType = PHPExcel_IOFactory::identify($ruta);
			if ($inputFileType == "Excel2007") {
				$archivo_valido = true;
				$objPHPExcel = PHPExcel_IOFactory::load($ruta);
			}
		} catch (Exception $e) {
			echo "Error! no es una plantilla de excel valida<br>";
			$archivo_valido = false;
		}
		if ($archivo_valido) {
			$locale = 'es_es';
			$validLocale = PHPExcel_Settings::setLocale($locale);
			if (!$validLocale) {
				echo "Unable to set locale to " . $locale . " - reverting to en_us";
			}
			$dptoContact = null;
			$cantKeyChain = null;
			$tipo = null;
			$modelo = null;
			$codigo = null;
			$a = null;
			$fila = 6; //ajuste de inicio
			$pivote = null;
			$salida = true;
			for ($fila; $salida; $fila++) {
				if (
					$objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue() != "" ||
					$objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue() != "" ||
					$objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue() != "" ||
					$objPHPExcel->getActiveSheet()->getCell('D' . $fila)->getValue() != "" ||
					$objPHPExcel->getActiveSheet()->getCell('E' . $fila)->getValue() != ""
				) {
					if ($objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue() != "") {
						$pivote['departamento'] = (string)$objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue();
						$pivote['cantidad'] = (string)$objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue();
					}
					$a['departamento'][] = $pivote['departamento'];
					$a['cantidad'][] = $pivote['cantidad'];
					$a['tipo'][] = (string)$objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue();
					$a['modelo'][] = (string)$objPHPExcel->getActiveSheet()->getCell('D' . $fila)->getValue();
					$a['codigo'][] = (string)$objPHPExcel->getActiveSheet()->getCell('E' . $fila)->getValue();
			//$a['llena'][] = $fila;
				} else {
					if ($objPHPExcel->getActiveSheet()->getCell('A' . ($fila + 1))->getValue() == "" ||
						$objPHPExcel->getActiveSheet()->getCell('B' . ($fila + 1))->getValue() == "" ||
						$objPHPExcel->getActiveSheet()->getCell('C' . ($fila + 1))->getValue() == "" ||
						$objPHPExcel->getActiveSheet()->getCell('D' . ($fila + 1))->getValue() == "" ||
						$objPHPExcel->getActiveSheet()->getCell('E' . ($fila + 1))->getValue() == "") {
						//si hay mas de una fila vacia entonces salgo
						$salida = false;
					}
				}
			}
			return $this->add($a);

		} else {
			echo "Error! no es una plantilla de excel valida<br>";
		}

	}

	public function asignar($obj)
	{
		$quuery = $this->db->select("*")->from("tb_keychain")->where("idKeychain", $obj['idKeychain'])->get();
		if ($quuery->num_rows() > 0) {
			$this->db->set(
				[
					"idUserKf" => $obj['idUserKf'],
				]
			)->where("idKeychain", $obj['idKeychain'])->update("tb_keychain");

			if ($this->db->affected_rows() === 1) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return 3;
		}

	}

	public function asignareliminar($obj)
	{
		$quuery = $this->db->select("*")->from("tb_keychain")->where("idKeychain", $obj['idKeychain'])->get();
		if ($quuery->num_rows() > 0) {
			$this->db->set(
				[
					"idUserKf" => null,
				]
			)->where("idKeychain", $obj['idKeychain'])->update("tb_keychain");

			if ($this->db->affected_rows() === 1) {
				return 1;
			} else {
				return 0;
			}
		} else {
			return 3;
		}

	}

	public function listarasignar()
	{
		$quuery = $this->db->select("*")
			->from("tb_keychain")
			->where("idUserKf is not NULL")
			->get();
		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			foreach ($quuery->result_array() as $key => $keyChain) {
				$quuery2 = $this->db->select("*")
					->from("tb_user")
					->where("idUser", $keyChain['idUserKf'])
					->get();
				if ($quuery2->num_rows() > 0) {
					$rs[$key]['user'] = $quuery2->result_array()[0];
				}
			}
			return $rs;
		} else {
			return 0;
		}

	}

	public function findKeychainOnlineAssociate($obj)
	{
		/*
		   [
			   {
				 "idTypeTenant":"1",
				"typeTenantName":"Propietario"
			  },
			  {
				 "idTypeTenant":"2",
				"typeTenantName":"Inquilino"
			  }
			]
		*/

		$this->db->select("*")->from("tb_keychain");
		if ($obj['idTypeTenant'] == 1) {
			$this->db->group_start();
			$this->db->where("isKeyTenantOnly", 1);
			$this->db->or_where("isKeyTenantOnly", 0);
			$this->db->or_where("isKeyTenantOnly is null");
			$this->db->group_end();
		} elseif ($obj['idTypeTenant'] == 2) {
			$this->db->where("isKeyTenantOnly", 1);
		}
		$this->db->where("idDepartmenKf", $obj['idDepartmenKf']); //solo por el departamento del usuario

		$result = $this->db->get();
		if ($result->num_rows() > 0) {
			$rs = $result->result_array();
			foreach ($result->result_array() as $key => $keyChain) {
				$quuery2 = $this->db->select("*")
					->from("tb_user")
					->where("idUser", $keyChain['idUserKf'])
					->get();
				if ($quuery2->num_rows() > 0) {
					$rs[$key]['user'] = $quuery2->result_array()[0];
				}
			}
			return $rs;
		} else {
			return null;
		}

	}

	public function addVarios2($file)
	{ //recibe excel y lo decodifica
		//print_r($_FILES['excel']);
		//return null;
		//echo 'Current PHP version: ' . phpversion();
		$uploaddir = realpath(APPPATH . '../../uploads');
		$path = $_FILES['excel']['name'];
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$user_img = time() . rand() . '.' . $ext;
		$uploadfile = $uploaddir . time() . '_' . str_replace(" ", "", $path);
		//$this->response($uploadfile, 200);
		if ($file["excel"]["name"]) {
			move_uploaded_file($file["excel"]["tmp_name"], "$uploadfile");
		}

		$archivo_plantilla = null;
		$ruta = $uploadfile;
		if (!file_exists($ruta)) {
			return "No existe el archivo";
		}
		$objReader = new PHPExcel_Reader_Excel2007();
		$objPHPExcel = new PHPExcel();
		$archivo_valido = false;
		try {
			$inputFileType = PHPExcel_IOFactory::identify($ruta);
			if ($inputFileType == "Excel2007") {
				$archivo_valido = true;
				$objPHPExcel = PHPExcel_IOFactory::load($ruta);
			}
		} catch (Exception $e) {
			echo "Error! no es una plantilla de excel valida<br>";
			$archivo_valido = false;
		}
		if ($archivo_valido) {
			$locale = 'es_es';
			$validLocale = PHPExcel_Settings::setLocale($locale);
			if (!$validLocale) {
				echo "Unable to set locale to " . $locale . " - reverting to en_us";
			}
			$fila = 2; //ajuste de inicio
			$salida = true;
			for ($fila; $salida; $fila++) {
				if ($objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('E' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('G' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue()
				) {
					$a['departamento'][] = $objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue();
					$a['cliente'][] = $objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue();
					$a['producto'][] = $objPHPExcel->getActiveSheet()->getCell('E' . $fila)->getValue();
					$a['codigo'][] = (string)$objPHPExcel->getActiveSheet()->getCell('G' . $fila)->getValue();
					$a['codigoExt'][] = (string)$objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue();
					$a['categoria'][] = (string)$objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue();

				} else {
					$salida = false;
				}
			}
			return $this->add($a);

		} else {
			echo "Error! no es una plantilla de excel valida<br>";
		}

	}
    public function verifyKeysByidUser($idDepto, $idUser) {

        $query = null;

		$this->db->select("*")->from("tb_keychain");
		$this->db->where("idDepartmenKf", $idDepto);
		$this->db->where("idUserKf", $idUser);
        $query = $this->db->get();

		if ($query->num_rows() > 0) {
			return 1;
		} else {
			return null;
		}
    }

    public function checkKeysAssigned2DepartmentByService ($idService)
	{
		$quuery = null;
		$rs     = null;
		$this->db->select('DISTINCT tc.idContrato, 
		tc.numeroContrato,
		tc.fechaFirmaVigencia,
		CASE 
			WHEN tc.fechaFirmaVigencia < CURDATE() THEN "EXPIRED"
			ELSE "ACTIVE"
		END AS contract_status,
		tk.idKeychain,
		tk.codExt,
		tk.codigo,
		tpc.classification,
		tp.descriptionProduct,
		tp.model,
		tk.idUserKf,
		tk.idDepartmenKf, 
		CONCAT(d.floor, "-", UPPER(d.departament)) AS department,
		u.fullNameUser AS user,
		pro.nameProfile AS profile,
	    ty.typeTenantName AS type', false);
		$this->db->from('tb_ticket_keychain_doors td');
		$this->db->join('tb_client_services_access_control tac', 'tac.idClientServicesAccessControl = td.idServiceKf', 'left');
		$this->db->join('tb_access_control_door acd', 'acd.idAccessControlDoor = td.idAccessControlDoorKf', 'left');
		$this->db->join('tb_contratos tc', 'tc.idContrato = td.idContractKf', 'left');
		$this->db->join('tb_status tst', 'tst.idStatusTenant = tc.idStatusFk', 'left');
		$this->db->join('tb_ticket_keychain tkc', 'tkc.id = td.idTicketKeychainKf', 'left');
		$this->db->join('tb_keychain tk', 'tk.idKeychain = tkc.idKeychainKf', 'left');
		$this->db->join('tb_client_departament d', 'd.idClientDepartament = tk.idDepartmenKf', 'left');
		$this->db->join('tb_user u', 'u.idUser = tk.idUserKf', 'left');
		$this->db->join('tb_profile pro', 'pro.idProfile = u.idProfileKf', 'left');
		$this->db->join('tb_typetenant ty', 'ty.idTypeTenant = u.idTypeTenantKf', 'left');
		$this->db->join('tb_products tp', 'tp.idProduct = tkc.idProductKf', 'left');
		$this->db->join('tb_products_classification tpc', 'tpc.idProductClassification = tp.idProductClassificationFk', 'left');
		$this->db->where('td.idServiceKf', $idService);
		$this->db->where('tk.idDepartmenKf IS NOT NULL');
		$quuery = $this->db->get();
        
		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array();
			return $rs;
		}
		return null;

	}


	public function getProcess_event_by_idKeychai($idKeychainKf, $idTypeTicketKf)
	{
		$quuery = null;
		$rs = null;

		$this->db->select("*")->from("tb_keychain_process_events");
		$this->db->where('idKeychainKf', $idKeychainKf);
		$quuery = $this->db->where("idTypeTicketKf", $idTypeTicketKf)->get();
		if ($quuery->num_rows() > 0) {
			$rs = $quuery->result_array()[0];
			return $rs;
		}
		return null;
	}
    // CREATE
    public function addProcess_event($data) {
		$now = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
		if (!is_null($this->getProcess_event_by_idKeychai($data['idKeychainKf'], $data['idTypeTicketKf']))) {
			return 2;
		} else {
			$this->db->insert('tb_keychain_process_events', [
				"idKeychainKf" 		=> $data['idKeychainKf'],
				"idClientKf" 		=> $data['idClientKf'],
				"idTicketKf" 		=> @$data['idTicketKf'],
				"idTypeTicketKf" 	=> $data['idTypeTicketKf'],
				"idReasonKf" 		=> @$data['idReasonKf'],
				"description" 		=> @$data['description'],
				"created_at" 		=> $now->format('Y-m-d'),
				"createdBy" 		=> $data['createdBy'],

				]
			);
		}
		if ($this->db->affected_rows() === 1) {
			return 1;
		} else {
			return 0;
		}
    }

    // READ (Get all events) ($idTypeTicketKf,$idClientKf,$limit,$create_at,$start)
    public function get_all_events($idTypeTicketKf, $idClientKf, $create_at, $idCategoryKf, $limit = '', $start = '', $strict = null, $totalCount) {

		$this->db->select("tb_keychain_process_events.*,tb_keychain_process_events.created_at,tb_typeticket.TypeTicketName,tb_user.fullNameUser,tb_profiles.name AS RoleName,tb_profile.nameProfile,tb_status.idStatusTenant,tb_status.statusTenantName AS statusUser,tb_clients.name,tb_products.descriptionProduct,tb_products.model,tb_products.brand,tb_keychain.codigo,tb_keychain.codExt,tb_category_keychain.idCategory, tb_category_keychain.name AS categoryKeychain")->from("tb_keychain_process_events");
		$this->db->join('tb_keychain', 'tb_keychain.idKeychain = tb_keychain_process_events.idKeychainKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_clients', 'tb_clients.idClient = tb_keychain_process_events.idClientKf', 'left');
		$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
		$this->db->join('tb_tickets_2', 'tb_tickets_2.idTicket = tb_keychain_process_events.idTicketKf', 'left');
		$this->db->join('tb_typeticket', 'tb_typeticket.idTypeTicket = tb_keychain_process_events.idTypeTicketKf', 'left');
		$this->db->join('tb_user', 'tb_user.idUser = tb_keychain_process_events.createdBy', 'left');
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
		if (isset($limit) && isset($start)) {
			$this->db->limit($limit, $start);
		}
		if (! is_null($idCategoryKf)) {
			$this->db->where('tb_keychain.idCategoryKf', $idCategoryKf);
		}
		if (! is_null($idTypeTicketKf)) {
			$this->db->where('tb_keychain_process_events.idTypeTicketKf', $idTypeTicketKf);
		}
		if (! is_null($idClientKf)) {
			$this->db->where('tb_keychain_process_events.idClientKf', $idClientKf);
		}

		$quuery = $this->db->order_by("tb_keychain_process_events.created_at", "ASC")->get();
		if ($quuery->num_rows() > 0) {
			$rs['tb_keychain_process_events'] = $quuery->result_array();
			if (! is_null($idClientKf)) {
				$this->db->where('tb_keychain_process_events.idClientKf', $idClientKf);
			}
			$query_total =  $this->db->select("*")->from("tb_keychain_process_events")->get();
			if ($query_total->num_rows() > 0 && ! is_null($totalCount)) {
				$rs['totalCount'] = $query_total->num_rows();

			}
			
			return $rs;
		}
		return null;
    }


}
