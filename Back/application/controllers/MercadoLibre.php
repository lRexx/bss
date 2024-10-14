<?php if (!defined('BASEPATH'))
	exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class MercadoLibre extends REST_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->model('Mercadolibre_model');
		/*MAIL*/
		$this->load->model('mail_model');
	}

	public function crearEnlaceMercadoPago_post()
	{

		$rr = null;
		if (!$this->post('data')){
			$this->response(null , 404);
		}

		$rr = json_decode($this->Mercadolibre_model->createMPLink($this->post('data')));

		if ($rr->status==200){
			$this->response([
				$rr
			] , 200);
		}else{
			$this->response([
				$rr
			] , 404);
		}

		if ($rr==1){
			$this->response([
				'response' => "Registro exitoso" ,
				'url' => $rr->url
			] , 200);
		} elseif ($rr==0) {
			$this->response(['error' => "ERROR INESPERADO"] , 500);
		} elseif ($rr==2) {
			$this->response(['response' => ""] , 203);
		}
	}

	public function getPaymentMPDetails_get($id) {

        if (is_null($id)) {
            $this->response(NULL, 404);
        }
		//print_r($id);
		//print_r($mp_token);
		$rr = null;

		$rr = json_decode($this->Mercadolibre_model->getPaymentMPDetails($id));
		if (!is_null($rr)){
			if ($rr->status==200){
				$this->response([
					$rr
				] , 200);
			}else{
				$this->response([
					$rr
				] , 404);
			}
		}else{
			$this->response(NULL, 404);
		}
	}
	public function paymentById_get($id) {

        if (is_null($id)) {
            $this->response(NULL, 404);
        }

		$rs = null;

		$rs = $this->Mercadolibre_model->paymentById($id);
        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
	}
	public function getNotificationOfMP_post()
	{
		if (!$this->post()){
			$this->response(array('error' => "Paratameters not received") , 404);
		}
		$rs = $this->Mercadolibre_model->getNotificationFromMP($this->post());
		if (!is_null($rs)){
			$this->response(array('response' => $rs) , 200);
			#return $this->response(array('response' => $rs), REST_Controller::HTTP_OK);
		} else {
			$this->response(array('error' => "ERROR INESPERADO") , 500);
		}

	}
	public function addPayment_post()
	{
		if (!$this->post('data')){
			$this->response(null , 404);
		}
		$rs = $this->Mercadolibre_model->addPayment($this->post('data'));
		if (!is_null($rs)){
			$this->response(array('response' => $rs) , 200);
		} else {
			$this->response(array('error' => "ERROR INESPERADO") , 500);
		}

	}
	public function updatePayment_post()
	{

		$rs = $this->Mercadolibre_model->updatePayment($this->post('data'));
		if (!is_null($rs)){
			$this->response(array('response' => $rs) , 200);
		} else {
			$this->response(array('error' => "ERROR INESPERADO") , 500);
		}

	}

}
