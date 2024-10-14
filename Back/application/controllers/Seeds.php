<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Seeds extends REST_Controller {

	public  function __construct()
 	{
 		parent::__construct();
 		$this->load->model('seeds_model');
	 }
	 
	     /* SERVICIO GET QUE OBTIENE TODO LOS MODELOS REGISTRADOS */
		 public function Modules_get() {

			$user = $this->seeds_model->getModules();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function ProductClassification_get() {

			$user = $this->seeds_model->getProductClassification();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function DiviceOpening_get() {

			$user = $this->seeds_model->getDiviceOpening();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function TypeServices_get() {

			$user = $this->seeds_model->getTypeServices();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function ClientType_get() {

			$user = $this->seeds_model->getClientType();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function CategoryDepartament_get() {

			$user = $this->seeds_model->getCategoryDepartament();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function CategoryKeyChains_get() {

			$user = $this->seeds_model->getCategoryKeyChains();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function TypeGps_get() {

			$user = $this->seeds_model->getTypeGps();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function TypeMaintenance_get() {

			$user = $this->seeds_model->getTypeMaintenance();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function InternetCompany_get() {

			$user = $this->seeds_model->getInternetCompany();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function AlarmServicesAditionals_get() {

			$user = $this->seeds_model->getAlarmServicesAditionals();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function TypeInternet_get() {

			$user = $this->seeds_model->getTypeInternet();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function Services_get() {

			$user = $this->seeds_model->getServices();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function RouterInternet_get() {

			$user = $this->seeds_model->getRouterInternet();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function typeContrato_get() {

			$user = $this->seeds_model->getTypeContratos();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function monitorCompany_get() {

			$user = $this->seeds_model->getMonitorCompany();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}

		public function monitorApplication_get() {

			$user = $this->seeds_model->getMonitorApplication();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}
		public function totemModel_get() {

			$user = $this->seeds_model->getTotemModel();
			if (!is_null($user)) {
				$this->response($user, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}
		public function reasonDisabledKey_get() {

			$response = $this->seeds_model->getReasonDisabledKey();
			if (!is_null($response)) {
				$this->response($response, 200);
			} else {
				$this->response(array('error' => 'NO HAY RESULTADOS'), 404);
			}
		}
	
	}
?>
