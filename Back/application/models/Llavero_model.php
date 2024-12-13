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
		$fields_selected="tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly, tb_keychain.idKeychainStatusKf, tb_keychain_status.idKeychainStatus, tb_keychain_status.keychainStatusName AS statusKey, tb_user.fullNameUser,tb_profiles.name AS RoleName,tb_profile.nameProfile,tb_status.idStatusTenant,tb_status.statusTenantName AS statusUser,
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
		//$this->db->group_start()
        // ->where_in('tb_keychain.idKeychainStatusKf', [1])  // Matches 1
        // ->or_where('tb_keychain.idKeychainStatusKf', null)  // Matches NULL
        // ->group_end();
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
		$rs = [];
		$fields_selected="tb_keychain_process_events.*,tb_reason_disabled_item.*,tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly, tb_keychain.idKeychainStatusKf, tb_keychain_status.idKeychainStatus, tb_keychain_status.keychainStatusName AS statusKey,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_keychain_process_events', 'tb_keychain_process_events.idKeychainKf = tb_keychain.idKeychain', 'left');
		$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
		$this->db->join('tb_keychain_status', 'tb_keychain_status.idKeychainStatus = tb_keychain.idKeychainStatusKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->where('idCategory', 1);
		$this->db->where('a.idClient', $idClientKf);
		$this->db->or_where('b.idClient', $idClientKf);
		//$this->db->group_start()
		//->where_in('tb_keychain.idKeychainStatusKf', [1])  // Matches 1
		//->or_where('tb_keychain.idKeychainStatusKf', null)  // Matches NULL
		//->group_end();
		$quuery = $this->db->order_by("tb_keychain.idKeychain", "ASC")->get();

		if ($quuery->num_rows() > 0) {
			foreach ($quuery->result_array() as $key => $item) {
				if ($item['idReasonKf']!="4"){
					array_push($rs, $item);
				}
			}
			//$rs = $quuery->result_array();
			//print_r($rs);
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
		$this->db->where('tb_keychain.idKeychainStatusKf', 1);
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
		$fields_selected="tb_keychain_process_events.*,tb_reason_disabled_item.*,tb_user.*, tb_keychain.idKeychain, tb_keychain.idProductKf, tb_keychain.codExt, tb_keychain.codigo, tb_keychain.idDepartmenKf, tb_keychain.idClientKf, tb_keychain.idUserKf, tb_keychain.isKeyTenantOnly, tb_keychain.idKeychainStatusKf, tb_keychain_status.idKeychainStatus, tb_keychain_status.keychainStatusName AS statusKey,
		UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, a.idClient as idClientKfDepto, a.address as addressA, b.idClient as idClientKfKeychain, b.address as addressB,
		tb_products.descriptionProduct, tb_products.model, tb_products.brand";
		$this->db->select($fields_selected)->from("tb_keychain");
		$this->db->join('tb_keychain_process_events', 'tb_keychain_process_events.idKeychainKf = tb_keychain.idKeychain', 'left');
		$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
		$this->db->join('tb_keychain_status', 'tb_keychain_status.idKeychainStatus = tb_keychain.idKeychainStatusKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		//$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients as a', 'a.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_clients as b', 'b.idClient = tb_keychain.idClientKf', 'left');
		$this->db->join('tb_clients as c', 'c.idClient = tb_keychain.idClientAdminKf', 'left');
		$this->db->join('tb_user', 'tb_user.idUser = tb_keychain.idUserKf', 'left');
		$this->db->where('idDepartmenKf', $idDepartmenKf);
		$quuery = $this->db->order_by("tb_keychain.idKeychain", "ASC")->get();

		if ($quuery->num_rows() > 0) {
			foreach ($quuery->result_array() as $key => $item) {
				if ($item['idReasonKf']!="4"){
					$rs[$key]=$item;
				}
			}
			//$rs = $quuery->result_array();
			
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
		//print_r($items);
		$errors_multiple = null;
		$idClientKf = null;
		$now = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
		if ($is_multiple) {
			for ($i = 0; $i < count($items['departamento']); $i++) {
				$idClientKf = null;
				if (!is_null($items['departamento'][$i])){
					$idClientKf=$items['cliente'][$i];
				}else{
					$idClientKf = $this->find_by_idDepartment($items['departamento'][$i]);
				}
				if (!is_null($this->find_by_code($items['codigo'][$i],$idClientKf))) {
					$errors_multiple[] = $items['codigo'][$i];
				} else {
					//print_r($items['codigo'][$i]);
					$this->db->insert('tb_keychain', [
							"idProductKf" 			=> $items['producto'][$i],
							"codExt" 				=> $items['codigoExt'][$i],
							"codigo" 				=> $items['codigo'][$i],
							"idDepartmenKf" 		=> $items['departamento'][$i],
							"idClientKf" 			=> $items['cliente'][$i],
							"idCategoryKf" 			=> $items['categoria'][$i],
							"idClientAdminKf"       => @$items['admin'][$i],
							"created_at" 			=> $now->format('Y-m-d H:i:s'),
							"idKeychainStatusKf" 	=> 1,
							//"idUserKf" 	=> $items['idUserKf'][$i],
							//"isKeyTenantOnly" => $items['isKeyTenantOnly'][$i],
						]
					);
				}
			}
			//print_r($errors_multiple);
			if (!is_null($errors_multiple) > 0) {
				return $errors_multiple;
			}else{
				if ($this->db->affected_rows() === 1) {
					return 1;
				} else {
					return 0;
				}
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
						"idClientAdminKf" 		=> @$items['idClientAdminKf'],
						"created_at" 			=> $now->format('Y-m-d H:i:s'),
						"idKeychainStatusKf" 	=> 1,
					]
				);
				$response['idKeychainKf'] = $this->db->insert_id();
			}

			if ($this->db->affected_rows() === 1) {
				return $response;
			} else {
				return 0;
			}
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

	public function addVarios22($file)
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
		//$objReader = new PHPExcel_Reader_Excel2007();
		$objPHPExcel = new PHPExcel();
		$archivo_valido = false;
		
		try {
			$inputFileType = PHPExcel_IOFactory::identify($ruta);
			//print($inputFileType);
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
				//print($objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue());
				if ($objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('F' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue() ||
					$objPHPExcel->getActiveSheet()->getCell('J' . $fila)->getValue()
				) {
					$a['departamento'][] 	= $objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue();
					$a['cliente'][] 		= $objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue();
					$a['admin'][] 			= $objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue();
					$a['producto'][] 		= $objPHPExcel->getActiveSheet()->getCell('F' . $fila)->getValue();
					$a['codigo'][] 			= (string)$objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue();
					$a['codigoExt'][] 		= (string)$objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue();
					$a['categoria'][] 		= (string)$objPHPExcel->getActiveSheet()->getCell('J' . $fila)->getValue();
					

				} else {
					$salida = false;
				}
			}
			return $this->add($a, true);

		} else {
			echo "Error! no es una plantilla de excel valida<br>";
		}

	}

	public function addVarios23($file)
	{
    // Set upload directory
    $uploaddir = realpath(APPPATH . '../../uploads');
    $path = $_FILES['excel']['name'];
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    $user_img = time() . rand() . '.' . $ext;
    $uploadfile = $uploaddir . '/' . time() . '_' . str_replace(" ", "", $path);

    // Upload the file
    if (isset($file["excel"]["name"]) && $file["excel"]["tmp_name"]) {
        move_uploaded_file($file["excel"]["tmp_name"], $uploadfile);
    }

    // Check if file exists
    if (!file_exists($uploadfile)) {
        return "No existe el archivo";
    }

    $archivo_valido = false;

    try {
        // Identify the file type
        $inputFileType = PHPExcel_IOFactory::identify($uploadfile);
        if ($inputFileType == "Excel2007") {
            $archivo_valido = true;
            $objPHPExcel = PHPExcel_IOFactory::load($uploadfile);
        }
    } catch (Exception $e) {
        echo "Error! no es una plantilla de Excel válida<br>";
        $archivo_valido = false;
    }

    if ($archivo_valido) {
        $locale = 'es_es';
        $validLocale = PHPExcel_Settings::setLocale($locale);
        if (!$validLocale) {
            echo "Unable to set locale to " . $locale . " - reverting to en_us";
        }

        $fila = 2; // Starting row
        $salida = true;
        $a = []; // Initialize the array to store data

        while ($salida) {
            // Validate cell values before accessing
            $cellA = $objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue();
            $cellB = $objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue();
            $cellC = $objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue();
            $cellF = $objPHPExcel->getActiveSheet()->getCell('F' . $fila)->getValue();
            $cellH = $objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue();
            $cellI = $objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue();
            $cellJ = $objPHPExcel->getActiveSheet()->getCell('J' . $fila)->getValue();

            // Check if any cell in the row has a value
			print("cellA: ".$cellA);
			print("cellB: ".$cellB);
			print("cellC: ".$cellC);
			print("cellF: ".$cellF);
			print("cellH: ".$cellH);
			print("cellI: ".$cellI);
			print("cellJ: ".$cellJ);
            if ($cellA || $cellB || $cellC || $cellF || $cellH || $cellI || $cellJ) {
                $a['departamento'][] 	= $cellA ?: null;
                $a['cliente'][] 		= $cellB ?: null;
                $a['admin'][] 			= $cellC ?: null;
                $a['producto'][] 		= $cellF ?: null;
                $a['codigo'][] 			= (string)($cellH ?: null);
                $a['codigoExt'][] 		= (string)($cellI ?: null);
                $a['categoria'][] 		= (string)($cellJ ?: null);
            } else {
                $salida = false; // Exit the loop when no data is found
            }

            $fila++;
        }

        return $this->add($a, true);
    } else {
        echo "Error! no es una plantilla de Excel válida<br>";
    }
	}

	public function addVarios2($file)
	{
		// Set upload directory
		$uploaddir = realpath(APPPATH . '../../uploads');
		$path = $_FILES['excel']['name'];
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$user_img = time() . rand() . '.' . $ext;
		$uploadfile = $uploaddir . '/' . time() . '_' . str_replace(" ", "", $path);
	
		// Validate the uploaded file
		if (isset($file["excel"]["name"]) && $file["excel"]["tmp_name"]) {
			if (move_uploaded_file($file["excel"]["tmp_name"], $uploadfile)) {
				//echo "File uploaded successfully.";
			} else {
				return "Error moving the uploaded file.";
			}
		}
	
		// Check if file exists
		if (!file_exists($uploadfile)) {
			return "No existe el archivo";
		}
	
		$archivo_valido = false;
		try {
			// Identify the file type
			$inputFileType = PHPExcel_IOFactory::identify($uploadfile);
			if ($inputFileType == "Excel2007") {
				$archivo_valido = true;
				$objPHPExcel = PHPExcel_IOFactory::load($uploadfile);
			}
		} catch (Exception $e) {
			return "Error! no es una plantilla de Excel válida: " . $e->getMessage();
		}
	
		if ($archivo_valido) {
			// Set locale to Spanish
			$locale = 'es_es';
			$validLocale = PHPExcel_Settings::setLocale($locale);
			if (!$validLocale) {
				return "Unable to set locale to " . $locale . " - reverting to en_us";
			}
	
			$fila = 2; // Starting row
			$salida = true;
			$a = []; // Initialize the array to store data
	
			while ($salida) {
				// Get cell values and handle potential nulls
				$cellA = $objPHPExcel->getActiveSheet()->getCell('A' . $fila)->getValue();
				$cellB = $objPHPExcel->getActiveSheet()->getCell('B' . $fila)->getValue();
				$cellC = $objPHPExcel->getActiveSheet()->getCell('C' . $fila)->getValue();
				$cellF = $objPHPExcel->getActiveSheet()->getCell('F' . $fila)->getValue();
				$cellH = $objPHPExcel->getActiveSheet()->getCell('H' . $fila)->getValue();
				$cellI = $objPHPExcel->getActiveSheet()->getCell('I' . $fila)->getValue();
				$cellJ = $objPHPExcel->getActiveSheet()->getCell('J' . $fila)->getValue();
	
				// Check if any cell in the row has a value
				if ($cellA || $cellB || $cellC || $cellF || $cellH || $cellI || $cellJ) {
					#print("cellA: ".$cellA);
					#print("cellB: ".$cellB);
					#print("cellC: ".$cellC);
					#print("cellF: ".$cellF);
					#print("cellH: ".$cellH);
					#print("cellI: ".$cellI);
					#print("cellJ: ".$cellJ);
					$a['departamento'][] 	= $cellA;
					$a['cliente'][] 		= $cellB;
					$a['admin'][] 			= $cellC;
					$a['producto'][] 		= $cellF;
					$a['codigo'][] 			= (string)($cellH);
					$a['codigoExt'][] 		= (string)($cellI);
					$a['categoria'][] 		= (string)($cellJ);
					//print_r($a);
				} else {
					$salida = false; // Exit the loop when no data is found
				}
	
				$fila++;
			}
			//print_r($a);
			// Return the processed data to another method or to be inserted
			return $this->add($a, true);
		} else {
			return "Error! no es una plantilla de Excel válida";
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


	public function getProcess_event_by_idKeychain($idKeychainKf, $idTypeTicketKf)
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
		if (!is_null($this->getProcess_event_by_idKeychain($data['idKeychainKf'], $data['idTypeTicketKf']))) {
			return 2;
		} else {
			$this->db->insert('tb_keychain_process_events', [
				"idKeychainKf" 			=> $data['idKeychainKf'],
				"idTicketKf" 			=> @$data['idTicketKf'],
				"idTypeTicketKf" 		=> $data['idTypeTicketKf'],
				"idReasonKf" 			=> @$data['idReasonKf'],
				"description" 			=> @$data['description'],
				"created_at" 			=> $now->format('Y-m-d'),
				"createdBy" 			=> $data['createdBy'],
				"idKeychainUserLast" 	=> @$data['idKeychainUserLast'],
				"idClientAdminLast"		=> @$data['idClientAdminLast'],
				]
			);
		}
		if ($this->db->affected_rows() === 1) {
			return 1;
		} else {
			return 0;
		}
    }


	public function get_new($idClientKf, $create_at, $idCategoryKf, $idKeychainStatusKf, $idDepartmenKf, $idReasonKf, $sysLoggedUserProfile, $codeSearch, $limit = '', $start = '', $strict = null, $totalCount) {

		$this->db->select("tb_keychain.*,tb_keychain_process_events.idKeychainKf,idKeychainKf,tb_keychain_process_events.idReasonKf,tb_reason_disabled_item.idReasonDisabledItem,tb_reason_disabled_item.reasonDisabledItem,
		a.fullNameUser AS keychainUserFullName,
		pa.nameProfile AS keychainUserProfile,
		sa.name AS keychainUserRoleName,
		sta.idStatusTenant AS keychainUserStatusID,
		sta.statusTenantName AS keychainUserStatusName,
		tb_products.descriptionProduct,tb_products.model,tb_products.brand,tb_category_keychain.idCategory, 
		tb_category_keychain.name AS categoryKeychain, tb_keychain_status.idKeychainStatus,
		tb_keychain_status.keychainStatusName AS statusKey,UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto, 
		tb_category_keychain.idCategory as idCategoryKf, tb_category_keychain.name as categoryKeychain, tb_clients.idClient, tb_clients.name, tb_clients.address,
		tb_products.descriptionProduct, tb_products.model")->from("tb_keychain");
		$this->db->join('tb_keychain_process_events', 'tb_keychain_process_events.idKeychainKf = tb_keychain.idKeychain', 'left');
		$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_keychain_status', 'tb_keychain_status.idKeychainStatus = tb_keychain.idKeychainStatusKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_client_departament', 'tb_client_departament.idClientDepartament = tb_keychain.idDepartmenKf', 'left');
		$this->db->join('tb_clients', 'tb_clients.idClient = tb_keychain.idClientKf', 'left');
		// Joins for User A
		$this->db->join('tb_user a', 'a.idUser = tb_keychain.idUserKf', 'left');
		$this->db->join('tb_profile pa', 'pa.idProfile = a.idProfileKf', 'left');
		$this->db->join('tb_profiles sa', 'sa.idProfiles = a.idSysProfileFk', 'left');
		$this->db->join('tb_status sta', 'sta.idStatusTenant = a.idStatusKf', 'left');
		if (! is_null($idCategoryKf)) {
			    // Convert the comma-separated string to an array
				$idCategoryKfArray = explode(',', $idCategoryKf);

				// Ensure the array values are trimmed and sanitized if necessary
				$idCategoryKfArray = array_map('trim', $idCategoryKfArray);
			
				// Use where_in with the array of ids
				$this->db->where_in('tb_keychain.idCategoryKf', $idCategoryKfArray);
		}
		if (! is_null($idDepartmenKf)) {
			$this->db->where('tb_keychain.idDepartmenKf', $idDepartmenKf);
		}
		if (! is_null($idClientKf)) {
			$this->db->where('tb_keychain.idClientKf', $idClientKf);
		}
		if (! is_null($idKeychainStatusKf) && $idKeychainStatusKf=="1") {
			$this->db->group_start()
			->where_in('tb_keychain.idKeychainStatusKf', [1])  // Matches 1
			->or_where('tb_keychain.idKeychainStatusKf', null)  // Matches NULL
			->group_end();
		}else if (!is_null($idKeychainStatusKf)) { 
			$this->db->group_start()
			->where('tb_keychain.idKeychainStatusKf', $idKeychainStatusKf)  // Matches the value
			//->where_not_in('tb_keychain.idKeychainStatusKf', [null])         // Excludes NULL values
			->group_end();
		}
		if (! is_null($sysLoggedUserProfile) && $sysLoggedUserProfile!="4" && ! is_null($idReasonKf)) {
			$this->db->where('tb_keychain_process_events.idReasonKf', $idReasonKf);
		}else if(! is_null($sysLoggedUserProfile) && $sysLoggedUserProfile=="4" && (! is_null($idKeychainStatusKf) || is_null($idKeychainStatusKf))){
			//$this->db->where('tb_keychain_process_events.idReasonKf!=', '4');
			$this->db->group_start()
			->where('tb_keychain_process_events.idReasonKf!=', '4')  // Matches 1
			->or_where('tb_keychain_process_events.idReasonKf', null)  // Matches NULL
			->group_end();
		}
		
		if (! is_null($codeSearch)) {
			$this->db->group_start()
			->like('tb_keychain.codigo', $codeSearch)
			->or_like('tb_keychain.codExt', $codeSearch)
			->group_end();
		}
		// Clone query for counting rows
		$query_for_count = clone $this->db;
		$query_total = $query_for_count->count_all_results(); // Counts the total rows
		if ($query_total > 0 && ! is_null($totalCount)) {
			$rs['totalCount'] = $query_total;
		}
		if (isset($limit) && isset($start)) {
			$this->db->limit($limit, $start);
		}
		$this->db->group_by('tb_keychain.idKeychain');
		$quuery = $this->db->order_by("tb_keychain.idKeychain", "ASC")->get();
		if ($quuery->num_rows() > 0) {
			$query_total = null;
			$rs['tb_keychain'] = $quuery->result_array();
			if (! is_null($idCategoryKf)) {
			    // Convert the comma-separated string to an array
				$idCategoryKfArray = explode(',', $idCategoryKf);

				// Ensure the array values are trimmed and sanitized if necessary
				$idCategoryKfArray = array_map('trim', $idCategoryKfArray);
			
				// Use where_in with the array of ids
				$this->db->where_in('tb_keychain.idCategoryKf', $idCategoryKfArray);
			}
			if (! is_null($idClientKf)) {
				$this->db->where('tb_keychain.idClientKf', $idClientKf);
			}
			if (! is_null($idDepartmenKf)) {
				$this->db->where('tb_keychain.idDepartmenKf', $idDepartmenKf);
			}
			if (! is_null($idKeychainStatusKf)) {
				$this->db->where('tb_keychain.idKeychainStatusKf', $idKeychainStatusKf);
			}
			foreach ($quuery->result_array() as $key => $item) {
				
				$this->db->select("tb_keychain_process_events.*, tb_reason_disabled_item.*,
				b.fullNameUser AS createdByUserFullName,
				pb.nameProfile AS createdByUserProfile,
				sb.name AS createdByUserRoleName,
				stb.idStatusTenant AS createdByUserStatusID,
				stb.statusTenantName AS createdByUserStatusName,
				tb_typeticket.TypeTicketName,")->from("tb_keychain_process_events");
				$this->db->join('tb_keychain', 'tb_keychain.idKeychain = tb_keychain_process_events.idKeychainKf', 'left');
				$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
				$this->db->join('tb_tickets_2', 'tb_tickets_2.idTicket = tb_keychain_process_events.idTicketKf', 'left');
				$this->db->join('tb_typeticket', 'tb_typeticket.idTypeTicket = tb_keychain_process_events.idTypeTicketKf', 'left');				
				// Joins for User B
				$this->db->join('tb_user b', 'b.idUser = tb_keychain_process_events.createdBy', 'left');
				$this->db->join('tb_profile pb', 'pb.idProfile = b.idProfileKf', 'left');
				$this->db->join('tb_profiles sb', 'sb.idProfiles = b.idSysProfileFk', 'left');
				$this->db->join('tb_status stb', 'stb.idStatusTenant = b.idStatusKf', 'left');
				$this->db->where('tb_keychain_process_events.idKeychainKf', $item['idKeychain']);
				$quuery_events = $this->db->order_by("tb_keychain_process_events.idTypeTicketKf", "ASC")->get();
				if ($quuery_events->num_rows() > 0) {
					$rs['tb_keychain'][$key]['tb_keychain_process_events']=$quuery_events->result_array();
					foreach ($quuery_events->result_array() as $k => $event) {
						//print_r($event['idKeychainUserLast']);
						//print_r($quuery_events->result_array()[0]);
						if (! is_null($event['idKeychainUserLast'])){
							// Joins for keychainUserLast_array
							$this->db->select("
							a.fullNameUser AS keychainUserFullName,
							pa.nameProfile AS keychainUserProfile,
							sa.name AS keychainUserRoleName,
							sta.idStatusTenant AS keychainUserStatusID,
							sta.statusTenantName AS keychainUserStatusName")->from("tb_user a");
							$this->db->join('tb_profile pa', 'pa.idProfile = a.idProfileKf', 'left');
							$this->db->join('tb_profiles sa', 'sa.idProfiles = a.idSysProfileFk', 'left');
							$this->db->join('tb_status sta', 'sta.idStatusTenant = a.idStatusKf', 'left');
							$quuery_user = $this->db->where('a.idUser', $event['idKeychainUserLast'])->get();
							//print_r($quuery_user->result_array()[0]);
							$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['keychainUserLast_array']=$quuery_user->result_array()[0];
						}else{
							$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['keychainUserLast_array']=null;
						}
						if (! is_null($event['idClientAdminLast'])){
							// Joins for clientAdminLast_array
							$this->db->select("tb_clients.*,tb_client_type.*")->from("tb_clients");
							$this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
							$quuery_client = $this->db->where('tb_clients.idClient', $event['idClientAdminLast'])->get();
							if ($quuery_client->num_rows() > 0) {
								$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['clientAdminLast_array']=$quuery_client->result_array()[0];
								$this->db->select("*")->from("tb_client_phone_contact");
								$quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $event['idClientAdminLast'])->get();
				
								$rs2                      = $quuery->result_array();
								$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['clientAdminLast_array']['list_phone_contact'] = $rs2;
				
								$this->db->select("*")->from("tb_client_mails");
								$this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
								$quuery = $this->db->where("tb_client_mails.idClientFk =", $event['idClientAdminLast'])->get();
				
								$rs6               = $quuery->result_array();
								$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['clientAdminLast_array']['list_emails'] = $rs6;
							}
						}else{
							$rs['tb_keychain'][$key]['tb_keychain_process_events'][$k]['keychainClientAdminLast_array']=null;
						}

					}
				}
			}
			
			return $rs;
		}
		return null;
    }
    // READ (Get all events) ($idTypeTicketKf,$idClientKf,$limit,$create_at,$start)
    public function get_all_events($idTypeTicketKf, $idClientKf, $create_at, $idCategoryKf, $limit = '', $start = '', $strict = null, $totalCount) {

		$this->db->select("tb_keychain_process_events.*,tb_keychain.idKeychain,tb_keychain.codigo,tb_typeticket.TypeTicketName,tb_user.fullNameUser,tb_profiles.name AS RoleName,tb_profile.nameProfile,tb_status.idStatusTenant,tb_status.statusTenantName AS statusUser,tb_clients.name, tb_clients.address,tb_products.descriptionProduct,tb_products.model,tb_products.brand,tb_category_keychain.idCategory, tb_category_keychain.name AS categoryKeychain, tb_keychain_status.idKeychainStatus, tb_keychain_status.keychainStatusName AS statusKey")->from("tb_keychain_process_events");
		$this->db->join('tb_keychain', 'tb_keychain.idKeychain = tb_keychain_process_events.idKeychainKf', 'left');
		$this->db->join('tb_keychain_status', 'tb_keychain_status.idKeychainStatus = tb_keychain.idKeychainStatusKf', 'left');
		$this->db->join('tb_category_keychain', 'tb_category_keychain.idCategory = tb_keychain.idCategoryKf', 'left');
		$this->db->join('tb_products', 'tb_products.idProduct = tb_keychain.idProductKf', 'left');
		$this->db->join('tb_clients', 'tb_clients.idClient = tb_keychain.idClientKf', 'left');
		$this->db->join('tb_reason_disabled_item', 'tb_reason_disabled_item.idReasonDisabledItem = tb_keychain_process_events.idReasonKf', 'left');
		$this->db->join('tb_tickets_2', 'tb_tickets_2.idTicket = tb_keychain_process_events.idTicketKf', 'left');
		$this->db->join('tb_typeticket', 'tb_typeticket.idTypeTicket = tb_keychain_process_events.idTypeTicketKf', 'left');
		$this->db->join('tb_user', 'tb_user.idUser = tb_keychain_process_events.createdBy', 'left');
		$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
		$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
		$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');

		if (! is_null($idCategoryKf)) {
			// Convert the comma-separated string to an array
			$idCategoryKfArray = explode(',', $idCategoryKf);

			// Ensure the array values are trimmed and sanitized if necessary
			$idCategoryKfArray = array_map('trim', $idCategoryKfArray);
		
			// Use where_in with the array of ids
			$this->db->where_in('tb_keychain.idCategoryKf', $idCategoryKfArray);
		}
		if (! is_null($idTypeTicketKf)) {
			$this->db->where('tb_keychain_process_events.idTypeTicketKf', $idTypeTicketKf);
		}
		if (! is_null($idClientKf)) {
			$this->db->where('tb_keychain.idClientKf', $idClientKf);
		}
		// Clone query for counting rows
		$query_for_count = clone $this->db;
		$query_total = $query_for_count->count_all_results(); // Counts the total rows
		if ($query_total > 0 && ! is_null($totalCount)) {
			$rs['totalCount'] = $query_total;
		}
		if (isset($limit) && isset($start)) {
			$this->db->limit($limit, $start);
		}
		$quuery = $this->db->order_by("tb_keychain_process_events.idKeyProcess", "DESC")->get();
		if ($quuery->num_rows() > 0) {
			$rs['tb_keychain_process_events'] = $quuery->result_array();
			foreach ($quuery->result_array() as $key => $item) {
				//print_r($quuery_events->result_array()[0]);
				if (! is_null($item['idKeychainUserLast'])){
					// Joins for keychainUserLast_array
					$this->db->select("
					a.fullNameUser AS keychainUserFullName,
					pa.nameProfile AS keychainUserProfile,
					sa.name AS keychainUserRoleName,
					sta.idStatusTenant AS keychainUserStatusID,
					sta.statusTenantName AS keychainUserStatusName,")->from("tb_user a");
					$this->db->join('tb_profile pa', 'pa.idProfile = a.idProfileKf', 'left');
					$this->db->join('tb_profiles sa', 'sa.idProfiles = a.idSysProfileFk', 'left');
					$this->db->join('tb_status sta', 'sta.idStatusTenant = a.idStatusKf', 'left');
					$quuery_user = $this->db->where('a.idUser', $item['idKeychainUserLast'])->get();
					$rs['tb_keychain_process_events'][$key]['keychainUserLast_array']=$quuery_user->result_array()[0];
				}else{
					$rs['tb_keychain_process_events'][$key]['keychainUserLast_array']=null;
				}
				if (! is_null($item['idClientAdminLast'])){
					// Joins for clientAdminLast_array
					$this->db->select("tb_clients.*,tb_client_type.*")->from("tb_clients");
					$this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
					$quuery_client = $this->db->where('tb_clients.idClient', $item['idClientAdminLast'])->get();
					if ($quuery_client->num_rows() > 0) {
						$rs['tb_keychain_process_events'][$key]['clientAdminLast_array']=$quuery_client->result_array()[0];
						$this->db->select("*")->from("tb_client_phone_contact");
						$quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $item['idClientAdminLast'])->get();

						$rs2                      = $quuery->result_array();
						$rs['tb_keychain_process_events'][$key]['clientAdminLast_array']['list_phone_contact'] = $rs2;

						$this->db->select("*")->from("tb_client_mails");
						$this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
						$quuery = $this->db->where("tb_client_mails.idClientFk =", $item['idClientAdminLast'])->get();

						$rs6               = $quuery->result_array();
						$rs['tb_keychain_process_events'][$key]['clientAdminLast_array']['list_emails'] = $rs6;
						
					}

				}else{
					$rs['tb_keychain_process_events'][$key]['keychainUserLast_array']=null;
				}
			}
			return $rs;
		}
		return null;
    }
    public function statusKeychain() {

        $query = null;
        $rs    = null;

        $query = $this->db->select("*")->from("tb_keychain_status");
        $query = $this->db->order_by("tb_keychain_status.idKeychainStatus", "DESC")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

}
