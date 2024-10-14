<?php if (!defined('BASEPATH'))
	exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Llavero extends REST_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->model('llavero_model');
	}

	public function add_post()
	{
		$obj = null;
		if (!$this->post('llavero')) {
			$this->response(null, 404);
		}

		$obj = $this->llavero_model->add($this->post('llavero'), false);


		if ($obj == 1) {
			$this->response(['response' => "Registro exitoso"], 200);
		} else {
			if ($obj == 0) {
				$this->response(['error' => "ERROR INESPERADO"], 500);
			} else {
				if ($obj == 2) {
					$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
				}
			}
		}


	}

	public function asignar_post()
	{
		$obj = null;
		if (!$this->post('asignar')) {
			$this->response(null, 404);
		}
		$obj = $this->llavero_model->asignar($this->post('asignar'));
		if ($obj == 1) {
			$this->response(['response' => "Asignación exitosa"], 200);
		} else {
			if ($obj == 0) {
				$this->response(['error' => "Ya está asignado el usuario a la llave"], 500);
			} else {
				if ($obj == 2) {
					$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
				}
			}
		}
	}

	public function asignareliminar_post()
	{
		$obj = null;
		if (!$this->post('eliminar')) {
			$this->response(null, 404);
		}
		$obj = $this->llavero_model->asignareliminar($this->post('eliminar'));
		if ($obj == 1) {
			$this->response(['response' => "Eliminación exitosa"], 200);
		} else {
			if ($obj == 0) {
				$this->response(['error' => "El llavero no tiene usuario asignado"], 500);
			} else {
				if ($obj == 2) {
					$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
				}
			}
		}
	}

	public function listarasignar_get()
	{
		$obj = null;

		$obj = $this->llavero_model->listarasignar();
		if (!is_null($obj)) {
			$this->response($obj, 200);
		} else {
			$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
		}
	}

	public function varios_post()
	{
//		$this->response( $_FILES['excel'], 200);
//
		$obj = null;
		if (!$_FILES) {
			$this->response(null, 404);
		}
		$obj = $this->llavero_model->addVarios2($_FILES);
		if (is_array($obj)) {
			$this->response(['response' => "Codigos repetidos, se encuentran registrados", "codigos" => $obj], 203);
		} else {
			if ($obj == 1) {
				$this->response(['response' => "Registro exitoso"], 200);
			} else {
				if ($obj == 0) {
					$this->response(['error' => "ERROR INESPERADO"], 500);
				} else {
					if ($obj == 2) {
						$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
					}
				}
			}
		}
	}

	public function edit_post()
	{
		$obj = null;
		if (!$this->post('llavero')) {
			$this->response(null, 404);
		}
		$obj = $this->llavero_model->edit($this->post('llavero'));

		if ($obj == 1) {
			$this->response(['response' => "Registro exitoso"], 200);
		} else {
			if ($obj == 0) {
				$this->response(['error' => "ERROR INESPERADO"], 500);
			} else {
				if ($obj == 2) {
					$this->response(['response' => "Elemento ya se encuentra registrado"], 203);
				} else {
					if ($obj == 3) {
						$this->response(['response' => "El elemento no existe"], 404);
					}
				}
			}
		}
	}

	public function index_get()
	{

		$user = $this->llavero_model->get();
		if (!is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}

	public function findByBuldingId_get($idClientKf)
	{

		$user = $this->llavero_model->getByBuilding($idClientKf);
		if (!is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}

	public function findIdDeparment_get($idDepartmenKf)
	{

		$user = $this->llavero_model->getByDeparment($idDepartmenKf);
		if (!is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}
	public function findKeychainOnlineAssociate_post()
	{
		if (!$this->post('search')) {
			$this->response(null, 404);
		}
		$obj = $this->llavero_model->findKeychainOnlineAssociate($this->post('search'));
		if (!is_null($obj)) {
			$this->response($obj, 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}

	public function findLlaveroSinDepartamento_get()
	{

		$user = $this->llavero_model->getLlaveroSinDepartameto();
		if (!is_null($user)) {
			$this->response($user, 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}
    public function verifyKeysByIdUser_get($idDepto, $idUser) {
        if (!$idDepto || !$idUser) {
            $this->response(NULL, 500);
        }

        $rs = null;
        $rs = $this->llavero_model->verifyKeysByidUser($idDepto, $idUser);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function checkKeysAssigned2DepartmentByService_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->llavero_model->checkKeysAssigned2DepartmentByService($id);

        if (!is_null($rs)) {
            $this->response([ 'keys_assigned' => $rs ], 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

}
