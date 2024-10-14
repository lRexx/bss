<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Modules extends REST_Controller {

	public  function __construct()
 	{
 		parent::__construct();
 		$this->load->model('modules_model');
	 }
	 
	     /* SERVICIO GET QUE OBTIENE TODO LOS MODELOS REGISTRADOS */
		 public function index_get() {

			$user = $this->modules_model->get();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}
	
	}
?>
