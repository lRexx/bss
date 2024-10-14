<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Rates extends REST_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('rates_model');
    }

    public function add_post() {

        $rs = null;
        $rs = $this->rates_model->add($this->post('rate'));

        if ($rs == 1) {
            $this->response([ 'response' => "Registro exitoso" ], 200);
        } else {
            if ($rs == 0) {
                $this->response([ 'error' => "ERROR INESPERADO" ], 500);
            } else {
                if ($rs == 2) {
                    $this->response([ 'response' => "Elemento ya se encuentra registrado" ], 203);
                }
            }
        }
    }

    public function edit_post() {

        $rs = null;
        $rs = $this->rates_model->edit($this->post('rate'));

        if ($rs == 1) {
            $this->response([ 'response' => "Actualización exitosa" ], 200);
        } else {
            if ($rs == 0) {
                $this->response([ 'error' => "ERROR INESPERADO" ], 500);
            }
        }
    }

    public function delete_delete($id) {
        $zona = null;
        $zona = $this->rates_model->delete($id);

        if ($zona == 1) {
            $this->response([ 'response' => "Eliminación exitosa" ], 200);
        } else {
            if ($zona == 0) {
                $this->response([ 'error' => "ERROR INESPERADO" ], 500);
            }
        }
    }

    public function listar_get() {

        $rs = null;
        $rs = $this->rates_model->listar();

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function listarByServiceType_get($id = null) {
        $rs = null;
        if ($id == null) {
            $this->response([ 'error' => 'DEBE PASAR UN ARGUMENTO' ], 404);
        }
        $rs = $this->rates_model->listarByServiceTypeId($id);

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function getServiceCostByCustomer_post() {

        $rs = null;
        $rs = $this->rates_model->getServiceCostByCustomer($this->post('rate'));

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

}

?>