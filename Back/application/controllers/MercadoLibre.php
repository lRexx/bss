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
		$this->load->helper('url');
	}

	public function crearEnlaceMercadoPago_post()
	{

		$headers = $this->input->request_headers();
		log_message('info', 'Host               :' . @$headers['Host']);
		log_message('info', 'User-Agent         :' . @$headers['User-Agent']);
		log_message('info', 'Accept             :' . @$headers['Accept']);
		log_message('info', 'Content-Typ        :' . @$headers['Content-Type']);
		log_message('info', 'X-Forwarded-For    :' . @$headers['X-Forwarded-For']);
		log_message('info', 'X-Forwarded-Host   :' . @$headers['X-Forwarded-Host']);
		log_message('info', 'X-Forwarded-Server :' . @$headers['X-Forwarded-Server']);
		log_message('info', 'Content-Length     :' . @$headers['Content-Length']);
		log_message('info', 'Connection         :' . @$headers['Connection']);		
		//log_message('info', 'x-signature        :' . @$headers['x-signature']);
		//log_message('info', 'x-request-id       :' . @$headers['x-request-id']);
		$body = file_get_contents('php://input');
		log_message('info', 'Cuerpo de la notificación: ' . $body);
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
		$rs = null;
		$headers = $this->input->request_headers();
		log_message('info', 'Host                :' . @$headers['Host']);
		log_message('info', 'User-Agent          :' . @$headers['User-Agent']);
		log_message('info', 'Accept              :' . @$headers['Accept']);
		log_message('info', 'Content-Typ         :' . @$headers['Content-Type']);
		log_message('info', 'X-Forwarded-For     :' . @$headers['X-Forwarded-For']);
		log_message('info', 'X-Forwarded-Host    :' . @$headers['X-Forwarded-Host']);
		log_message('info', 'X-Forwarded-Server  :' . @$headers['X-Forwarded-Server']);
		log_message('info', 'Content-Length      :' . @$headers['Content-Length']);
		log_message('info', 'Connection          :' . @$headers['Connection']);		
		//log_message('info', 'x-signature 		  :' . @$headers['x-signature']);
		//log_message('info', 'x-request-id 	  :' . @$headers['x-request-id']);
		$body = file_get_contents('php://input');
		log_message('info', 'Cuerpo de la notificación: ' . $body);
		$post_req = $this->post();
		if (!$post_req && !$this->notification_get($post_req, $headers)){
			$this->response(array('error' => "Paratameters not received") , 404);
		}else{
			log_message('info', 'Signature validation has been done successfully');
			$rs = $this->Mercadolibre_model->getNotificationFromMP($this->post());
		}
		if (!is_null($rs)){
			$this->response(array('response' => $rs) , 200);
			#return $this->response(array('response' => $rs), REST_Controller::HTTP_OK);
		} else {
			$this->response(array('error' => "ERROR INESPERADO") , 500);
		}
	}
	public function notification_get($post_req, $headers) {
		//print_r($this->input->request_headers());
		//print_r($post_req);
        // Obtener headers de la solicitud
        $headers = $headers;

        // Verificar que los headers requeridos existan
        if (!isset($headers['x-signature']) || !isset($headers['x-request-id'])) {
            log_message('error', 'Headers requeridos no presentes en la solicitud.');
            show_error('Headers requeridos no presentes.', 400);
            return;
        }

        // Capturar los headers x-signature y x-request-id
        $x_signature = $headers['x-signature'];
        $x_request_id = $headers['x-request-id'];

        // Dividir el header x-signature para obtener ts y v1
        $parts = explode(',', $x_signature);
        $ts = '';
        $v1 = '';
        foreach ($parts as $part) {
            list($key, $value) = explode('=', $part);
            if ($key === 'ts') {
                $ts = $value;
            } elseif ($key === 'v1') {
                $v1 = $value;
            }
        }

        if (!$ts || !$v1) {
            log_message('error', 'x-signature no contiene ts o v1 válidos.');
            show_error('x-signature mal formado.', 400);
            return;
        }

        // Obtener el cuerpo de la solicitud
        $body = file_get_contents('php://input');
        $data = $post_req;

        if (json_last_error() !== JSON_ERROR_NONE) {
            log_message('error', 'Cuerpo de la notificación no es un JSON válido.');
            show_error('Notificación mal formada.', 400);
            return;
        }
		//print_r("ts: ".$ts."\n");
		//print_r("V1: ".$v1."\n");
        // Crear el template requerido para validar
        $id_url = isset($data['data']['id']) ? $data['data']['id'] : '';
        $template = "id:{$id_url};request-id:{$x_request_id};ts:{$ts};";
		//print_r("id_url: ".$id_url."\n");
		//print_r("template: ".$template."\n");
        // Clave secreta de tu aplicación
        $secret_key = BSS_MP_WEBHOOK_SECRET;

        // Generar el HMAC SHA256
        $generated_signature = hash_hmac('sha256', $template, $secret_key);
		//print_r("generated_signature: ".$generated_signature."\n");
        // Validar que el HMAC generado coincida con v1
        if (!hash_equals($generated_signature, $v1)) {
            log_message('error', 'La firma HMAC no coincide. Notificación no confiable.');
            show_error('Firma inválida.', 403);
            return;
        }

        // Proceso exitoso, manejar la notificación
        log_message('info', 'Notificación recibida y validada correctamente.');
        log_message('info', 'Cuerpo de la notificación: ' . $body);
		log_message('info', 'Signature validation has been done successfully');
		//$this->response(array('response' => TRUE) , 200);
		return true;

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
