<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH.'/libraries/REST_Controller.php';

class Contrato extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('contrato_model');
    }

    public function add_post() {

        $res = $this->contrato_model->add($this->post('contrato'));

        if ($res == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($res == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($res == 2) {
            $this->response([ 'response' => "Contrato ya se encuentra registrado" ], 203);
        }
    }

    public function update_put() {

        $res = $this->contrato_model->update($this->put('contrato'));

        if ($res == 1) {
            $this->response([ 'response' => "Actualizacion exitosa" ], 200);
        } elseif ($res == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($res == 2) {
            $this->response([ 'response' => "Contrato ya se encuentra registrado" ], 203);
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

    public function get_get() {

        $user = $this->contrato_model->get();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function getIdClient_get($ididClientFk) {
        if (!$ididClientFk) {
            $this->response(NULL, 404);
        }
        $user = $this->contrato_model->getIdClient($ididClientFk);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }   
    public function getIdContrato_get($idContrato,$idServicesType) {
        //$this->response([$idContrato,$idServicesType], 200);
        if (!$idContrato) {
            $this->response(NULL, 404);
        }
        $user = $this->contrato_model->getDisponibilidadPorContrato($idContrato,$idServicesType);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }   
    public function fechaActivacionContrato_post() {
        $res = $this->contrato_model->fechaActivacionContrato($this->post('contrato'));

        if ($res == 1) {
            $this->response([ 'response' => "Actualización exitosa" ], 200);
        } elseif ($res == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($res == 2) {
            $this->response([ 'response' => "Contrato ya se encuentra aprobado" ], 203);
        }
    }       
    public function changeStatusContrato_get($id, $idStatus) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $contrato = null;
        $contrato = $this->contrato_model->changeStatusContrato($id, $idStatus);

        if (!is_null($contrato) && $idStatus==1) {
            $this->response([ 'response' => "Contrato Activado" ], 200);
        } else if (!is_null($contrato) && $idStatus==0) {
            $this->response([ 'response' => "Contrato Desactivado" ], 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function addSystemUnderLock_post() {

        $res = $this->contrato_model->addSystemUnderLock($this->post('contrato'));

        if ($res == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } elseif ($res == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($res == 2) {
            $this->response([ 'response' => "Contrato ya se encuentra registrado" ], 203);
        }
    }

    public function updateSystemUnderLock_put() {

        $res = $this->contrato_model->updateSystemUnderLock($this->put('contrato'));

        if ($res == 1) {
            $this->response([ 'response' => "Actualizacion exitosa" ], 200);
        } elseif ($res == 0) {
            $this->response([ 'error' => "ERROR INESPERADO" ], 500);
        } elseif ($res == 2) {
            $this->response([ 'response' => "Contrato ya se encuentra registrado" ], 203);
        }
    }    

}