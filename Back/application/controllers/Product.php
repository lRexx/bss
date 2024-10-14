<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Product extends REST_Controller {

	public  function __construct()
 	{
 		parent::__construct();
 		$this->load->model('product_model');
	 }
	 
	 public function index_post(){
		
		$product = null;
        if (!$this->post('product')) {
            $this->response(NULL, 404);
        }

        $product = $this->product_model->add($this->post('product'));

        if ($product == 1) {
			$this->response(array('response' => "Registro exitoso"), 200);
        } else if ($product == 0) { 
            $this->response(array('error' => "ERROR INESPERADO"), 500);
		} else if ($product == 2) { 
			$this->response(array('response' => "Producto ya se encuentra registrado"), 203);
		}
	}

	public function update_post() {

		$rs = $this->product_model->update($this->post('product'));
		
		if (!is_null($rs)) {
			$this->response("Actualizado", 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}

	public function delete_delete($id) {

		$rs = $this->product_model->delete($id);
		if (!is_null($rs)) {
			$this->response("Eliminado", 200);
		} else {
			$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
		}
	}

	public function find_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->product_model->get($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
	}

	public function search_post() {

		$searchFilter = $this->post('filter');
		

        $rs = $this->product_model->get(null, $searchFilter);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
	public function getProducts4Service_get() {
        $rs = null;
        $rs = $this->product_model->getProducts4Service();

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
	}    
	
	}
?>
