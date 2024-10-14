<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Clientes extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('client_model');
    }

    public function admin_post() {

        $pofile = null;
        if (! $this->post('client')) {
            $this->response(null, 404);
        }

        $pofile = $this->client_model->addAdmin($this->post('client'));

        if ($pofile == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($pofile == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($pofile == 2) {
            $this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
        }
    }

	public function aprobarPedidoClient_post() {

		$pofile = null;
		if (! $this->post('client')) {
			$this->response(null, 404);
		}

		$pofile = $this->client_model->aprobarPedidoClient($this->post('client'));
//		$this->response($pofile);
		if ($pofile == 1) {
			$this->response([ 'response' => "Registro exitoso" ], 200);
		} elseif ($pofile == 0) {
			$this->response([ 'error' => "Sin Resultados" ], 500);
		} elseif ($pofile == 2) {
			$this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
		}
	}

    public function autoAprobarPedidosOwners_post() {

		$pofile = null;
		if (! $this->post('client')) {
			$this->response(null, 404);
		}

		$pofile = $this->client_model->autoAprobarPedidoPropietarios($this->post('client'));
//		$this->response($pofile);
		if ($pofile == 1) {
			$this->response([ 'response' => "Registro exitoso" ], 200);
		} elseif ($pofile == 0) {
			$this->response([ 'error' => "Sin Resultados" ], 500);
		} elseif ($pofile == 2) {
			$this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
		}
	}

	public function aprobarPedidoClientDepartment_post() {

		$pofile = null;
		if (! $this->post('client')) {
			$this->response(null, 404);
		}

		$pofile = $this->client_model->aprobarPedidoClientDepartment($this->post('client'));
//		$this->response($pofile);
		if ($pofile == 1) {
			$this->response([ 'response' => "Registro exitoso" ], 200);
		} elseif ($pofile == 0) {
			$this->response([ 'error' => "Sin Resultados" ], 500);
		} elseif ($pofile == 2) {
			$this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
		}
	}


    public function mpPaymentMethod_post()
	{

		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}

		$rs = $this->client_model->mpPaymentMethod($this->post('client'));
		if ($rs == 1) {
			$this->response(['response' => "Registro exitoso"], 200);
		} elseif ($rs == 0) {
			$this->response(['error' => "Sin Resultados"], 500);
		} elseif ($rs == 2) {
			$this->response(['response' => "Cliente ya se encuentra registrado"], 203);
		}
	}
    public function chargeForExpenses_post()
	{

		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}

		$rs = $this->client_model->chargeForExpenses($this->post('client'));
		if ($rs == 1) {
			$this->response(['response' => "Registro exitoso"], 200);
		} elseif ($rs == 0) {
			$this->response(['error' => "Sin Resultados"], 500);
		} elseif ($rs == 2) {
			$this->response(['response' => "Cliente ya se encuentra registrado"], 203);
		}
	}

	public function IsInDebt_post()
	{

		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}

		$rs = $this->client_model->IsInDebt($this->post('client'));
        //$this->response($pofile);
		if ($rs == 1) {
            $this->response("Registro exitoso", 200);
		} elseif ($rs == 0) {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 500);
		}
	}

	public function isStockInBuilding_post()
	{

		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}

		$rs = $this->client_model->isStockInBuilding($this->post('client'));
        //$this->response($pofile);
		if ($rs == 1) {
            $this->response("Registro exitoso", 200);
		} elseif ($rs == 0) {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 500);
		}
	}    

	public function isStockInOffice_post()
	{

		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}

		$rs = $this->client_model->isStockInOffice($this->post('client'));
        //$this->response($pofile);
		if ($rs == 1) {
            $this->response("Registro exitoso", 200);
		} elseif ($rs == 0) {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 500);
		}
	}  
    public function building_post() {

        $pofile = null;
        if (! $this->post('client')) {
            $this->response(null, 404);
        }

        $pofile = $this->client_model->addBuilding($this->post('client'));

        if ($pofile == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($pofile == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($pofile == 2) {
            $this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
        }
    }

    public function company_post() {

        $pofile = null;
        if (! $this->post('client')) {
            $this->response(null, 404);
        }

        $pofile = $this->client_model->addCompany($this->post('client'));

        if ($pofile == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($pofile == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($pofile == 2) {
            $this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
        }
    }

    public function branch_post() {

        $pofile = null;
        if (! $this->post('client')) {
            $this->response(null, 404);
        }

        $pofile = $this->client_model->addBranch($this->post('client'));

        if ($pofile == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($pofile == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($pofile == 2) {
            $this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
        }
    }

    public function particular_post() {

        $pofile = null;
        if (! $this->post('client')) {
            $this->response(null, 404);
        }

        $pofile = $this->client_model->addParticular($this->post('client'));

        if ($pofile == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($pofile == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($pofile == 2) {
            $this->response([ 'response' => "Cliente ya se encuentra registrado" ], 203);
        }
    }


    public function updateadmin_post() {

        $rs = $this->client_model->updateAdmin($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Actualizado" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function updatebuilding_post() {

        $rs = $this->client_model->updatebuilding($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Actualizado" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function addNotCustomerDepto_post() {

        $res = $this->client_model->addNotCustomerDepto($this->post('client'));

        if(!is_null($res)){
            $this->response($res, 200);
        } else {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        }
    }

    public function updatecompany_post() {

        $rs = $this->client_model->updateCompany($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Actualizado" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function updatebranch_post() {

        $rs = $this->client_model->updateBranch($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Actualizado" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function updateparticular_post() {

        $rs = $this->client_model->updateParticular($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Actualizado" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function delete_delete($id) {

        $rs = $this->client_model->delete($id);
        if (! is_null($rs)) {
            $this->response("Eliminado", 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }


    public function findadmin_get($idClient=null) {

        if (!isset($idClient) || is_null($idClient)) {
            $this->response([ 'info' => 'Client ID not received' ], 404);
        }

        $user = null;
        $user = $this->client_model->getadmin($idClient, null, null, null, null, null, null, null, null, null);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
	/*Solicitud para generar código de seguridad para cliente*/
	public function listAdminCompanies_get(){
        $rs = null;
		$rs = $this->client_model->list_admin_companies();
		if (! is_null($rs)) {
			$this->response($rs, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}

	/*Solicitud para generar código de seguridad para cliente*/
	public function segurityCodeCliente_get($idClient){

		$user = $this->client_model->getSegurityCodeClient($idClient);
		if (! is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}
	/*Solicitud para saber si el cliente se encuentra en mora*/
	public function customerIsInDebt_get($idClient){
        $rs = null;
		$rs = $this->client_model->customerIsInDebt($idClient);
		if (! is_null($rs)) {
			$this->response($rs, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}
	/*Solicitud para saber si el cliente tiene stock en el edificio*/
    public function search_post() {
        $searchFilter           = $this->post('searchFilter');
        $idClientTypeFk         = $this->post('idClientTypeFk');
        $isNotCliente           = $this->post('isNotCliente');
        $IsInDebt               = $this->post('isInDebt');
        $isStockInBuilding      = $this->post('isStockInBuilding');
        $isStockInOffice        = $this->post('isStockInOffice');
        $limit                  = $this->post('limit');
        $start                  = $this->post('start');
        $strict                 = $this->post('strict');
        $totalCount             = $this->post('totalCount');

        $client_rs = $this->client_model->getadmin(null, $searchFilter, $idClientTypeFk, $IsInDebt, $isStockInBuilding, $isStockInOffice, $isNotCliente, $limit, $start, $strict, $totalCount);

        if (! is_null($client_rs)) {
            $this->response($client_rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function searchAddress_post() {

        $address    = $this->post('address');
        $idProvince = $this->post('idProvinceFk');
        $idLocation = $this->post('idLocationFk');
        //$idClientTypeFk = $this->post('idClientTypeFk');
        $client = $this->client_model->searchAddress($address, $idProvince, $idLocation);

        if (! is_null($client) && $client!='0') {
            $this->response($client, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function getDepartmentId_post() {

        $clientId   = $this->post('clientId');
        $floor      = $this->post('floor');
        $department = $this->post('department');

        //$idClientTypeFk = $this->post('idClientTypeFk');
        $deptoId = $this->client_model->getDepartmentId($clientId, $floor, $department);

        if (! is_null($deptoId)) {
            $this->response($deptoId, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function listCustomersById_get($idClient) {
        if (!isset($idClient) || is_null($idClient)) {
            $this->response(null, 404);
        }

        $user = null;
        $user = $this->client_model->getListCustomersById($idClient);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function uploadFile_post() {
        if ( !empty( $_FILES ) ) {
            $customerId  = $this->post('customerId');
            $fileName  = $this->post('fileName');
            $file      = $_FILES;
        }else{
            $upload=null;
        }
        $upload = $this->client_model->postUploadFiles($customerId, $fileName, $file);
        if (! is_null($upload)) {
            $this->response($upload, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }                

    }

    public function addCustomerUploadedFile_post() {

        $rs = $this->client_model->addCustomerUploadedFile($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Registro Exitoso" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function deleteFile_post() {
        $urlFile  = $this->post('fileName');

        if (! $urlFile) {
            $this->response(array('warning' => 'url of file is missing'), 404);
        }

        $rs = $this->client_model->postDeleteFiles($urlFile);
        if (!is_null($rs)) {
            $this->response("Eliminado", 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    } 

    public function deleteCustomerUploadedFile_delete($idClientFile) {

        $rs = $this->client_model->deleteCustomerUploadedFile($idClientFile);
        if (!is_null($rs)) {
            $this->response("Eliminado", 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }    

	/**/
	public function keysAssociatedToACustomerService_get($idClient){

		$user = $this->client_model->getKeysAssociatedToACustomerService($idClient);
		if (! is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}

	/**/
	public function controlAccessDoorsAssociatedToACustomerServices_get($idClient){

		$user = $this->client_model->getControlAccessDoorsAssociatedToACustomerServices($idClient);
		if (! is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}
	public function internetServiceAssociatedToCustomer_get($idClient){

		$user = $this->client_model->getInternetServiceAssociatedToCustomer($idClient);
		if (! is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
		}
	}
    public function initialDelivery_post() {
		$rs = null;
		if (!$this->post('client')) {
			$this->response(null, 404);
		}
        $rs = $this->client_model->initialDelivery($this->post('client'));
        if (! is_null($rs)) {
            $this->response([ 'response' => "Entrega inicial cargada satisfactoriamente" ], 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

}