<?php if (!defined('BASEPATH'))
	exit('No direct script access allowed');

class Mercadolibre_model extends CI_Model
{

	public function __construct()
	{
		parent::__construct();
		/*TICKET*/ $this->load->model('Ticket_model');
	}
	public function notifyMail($data){
		//MAIL
		$user = null;
		$building = null;
		$title = null;
		$subject = null;
		$body = null;
		$to = null;
		//DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
		$this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
		$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
		$this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
		$this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
		$queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $data['idDepartment'])->get();
		if ($queryBuilding->num_rows() > 0) {
			$building = $queryBuilding->row_array();
			
			if ($building['idUserKf'] != null) {
				//GET USER
				$this->db->select("*")->from("tb_user");
				$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
				$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
				$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
				$queryUser = $this->db->where("idUser =", $data['idUserKf'])->get();
				if ($queryUser->num_rows() > 0) {
					$user = $queryUser->row_array();
					#MAIL TO USER
					$rs = null;
					$to = $user['emailUser'];
					$title = "Alta de Departamento";
					$subject="Alta Departamento :: ".$building['Depto'];
					$body='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Estimado/a, <b>'.$user['fullNameUser'].'</b>,</td>'; 
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado el Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
					$body.='</tr>';
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
					$body.='</tr>';	
					$body.='<tr width="100%" bgcolor="#ffffff">';
					$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://'.BSS_HOST.'/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #ffffff;">Entrar</a></span></td>';
					$body.='</tr>';
					$rs = $this->mail_model->sendMail($title, $to, $body, $subject);
					if ($rs == "Enviado" && $data['isApprovalRequired']){
						$this->db->select("tb_client_mails.mailContact")->from("tb_client_mails");
						$this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
						$where="tb_client_mails.idTipoDeMailFk = 1 AND tb_client_mails.idClientFk = ".$building['idBuilding'];
						$quuery = $this->db->where($where)->get();
						if ($queryUser->num_rows() > 0) {
							$buildingAdminMail = $quuery->row_array();
							$title = null;
							$subject = null;
							$body = null;
							$to = null;
							#MAIL TO THE BUILDING OR ADMINISTRATION
							$approval_url="https://".BSS_HOST."/login/approve/depto/up/depto/".$data['idDepartment']."/user/".$data['idUserKf'];
							$to = $buildingAdminMail['mailContact'];
							$title = "Alta de Departamento";
							$subject="Alta de Departamento :: ".$building['Depto'];
							$body='<tr width="100%" bgcolor="#ffffff">';
							$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">El usuario, <b>'.$user['fullNameUser'].'</b>,</td>'; 
							$body.='</tr>';	
							$body.='<tr width="100%" bgcolor="#ffffff">';
							$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Ha solicitado el Alta en el Departamento: <span style="background-color:#777777;border-color: #777777 !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">'.$building['Depto'].'</span> del '.$building['ClientType'].'<b> '.$building['name'].'</b></td>';
							$body.='</tr>';	
							$body.='<tr width="100%" bgcolor="#ffffff">';
							$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Estado: <span style="background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;">Pendiente de aprobación</span></td>';
							$body.='</tr>';	
							$body.='<tr width="100%" bgcolor="#ffffff">';
							$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif;padding-left:4%;padding-right:4%;padding-bottom:3%;"><span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px; cursor:pointer;"><a href="'.$approval_url.'" target="_blank" title="Aprobar" style="text-decoration: none; color: #ffffff;">Aprobar</a></span></td>';
							$body.='</tr>';	
							//<span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;">' .$user['statusTenantName']. '</span><br><br> Ya Puede Disfrutar de Nuestros servicios! &nbsp; <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #ffffff !important; border-radius: 10px; padding: 3px 7px;"><a href="https://dev.bss.com.ar/login" target="_blank" title="Ingresar al sistema" style="text-decoration: none; color: #fff;">Entrar</a></span>
							$this->mail_model->sendMail($title, $to, $body, $subject);
						}
					}
				}
			}
		}

	}
	//https://dev.bss.com.ar/Back/index.php/MercadoLibre/getNotificationOfMP
	public function createMPLink($data)
	{	

		$data               = json_decode(json_encode($data));
		$external_reference = $data->idTicket."_".(rand() * 8) . "_" . (time() * 4);
		$paymentFor = $data->metadata->paymentFor;
		try {
			//$uri = 'https://dev.bss.com.ar/mpago/index.php';
			$uri   = 'https://'.BSS_HOST.'/mpago/index.php'; //solo server
			$param = [
				"clienteid" 		 => '8877359900700578' ,
				"clientesecret" 	 => 'al5TAYSIdZPx2lzzU64DFgSX67SDrhsr' ,
				#"Authorization" 	 => "Bearer TEST-8877359900700578-012401-cc12a648254efb51f0c30f4b394955f6-1177407195",
				"currency_id" 		 => "ARG",
				"unit_price" 		 => $data->monto ,
				"id" 				 => $data->idTicket ,
				"title" 			 => $data->ticket_number ,
				//"uri"         	 => "http://localhost:8000/api/v1/addInfoPagoMercadoLibre",
				"notification_url" 	 => $data->linkDeNotificacion ,
				//"uri"           	 => "http://bioonix.com/libreando/libreando/backend/public/api/v1/addInfoPagoMercadoLibre",  //solo server
				"description" 		 => $data->description,
				"quantity" 			 => $data->quantity,
				"external_reference" => $external_reference ,
				//"back_url" 			 => $data->back_url ,
			];
			
			//print_r($param);
			$certificates_dir=realpath(APPPATH . '../certificate');
			$curl = curl_init();
			curl_setopt_array($curl , [
				CURLOPT_URL 			=> $uri ,
				CURLOPT_RETURNTRANSFER 	=> TRUE ,
				CURLOPT_ENCODING 		=> "" ,
				CURLOPT_MAXREDIRS 		=> 10 ,
				CURLOPT_TIMEOUT 		=> 30 ,
				CURLOPT_CUSTOMREQUEST 	=> "POST" ,
				CURLOPT_POSTFIELDS 		=> json_encode($param) ,
				CURLOPT_POST 			=> TRUE,
				CURLOPT_VERBOSE 		=> TRUE,
				CURLOPT_CAINFO 			=> $certificates_dir."/curl-ca-bundle.crt",
				CURLOPT_STDERR 			=> fopen('curl_mp.log', 'a+'),
				CURLOPT_HTTPHEADER 		=> [
					"Accept: application/json" ,
					"Content-Type: application/x-www-form-urlencoded"
				] ,
			]);
			//print_r($curl);
			$response = curl_exec($curl);
			$err      = curl_error($curl);
			curl_close($curl);
			//print_r(json_decode($response, true, JSON_UNESCAPED_SLASHES));
			//print_r($response);
			if ($err){
				return json_encode([
					'message' => 'Ha ocurrido un error al registrar el pago, cod err 404' ,
					'status' => 404 ,
					'data' => $err
				]);
			} else if ($response!=null){
					$ticketObj = null;
					$ticketObj['history']['idUserKf'] 			= "1";
					$ticketObj['history']['idTicketKf']  		= $data->idTicket;
					$ticketObj['history']['descripcion'] 		= "";
					$ticketObj['history']['idCambiosTicketKf'] 	= $paymentFor==1?"5":"18";
					//print_r($ticketObj);
					$this->Ticket_model->addTicketTimeline($ticketObj);

				return json_encode([
					'message' => 'Datos registrados exitosamente' ,
					'status' => 200 ,
					'data' => json_decode($response, true, JSON_UNESCAPED_SLASHES)
				]);
			}else if(json_decode($response, true, JSON_UNESCAPED_SLASHES)==null){
				$ticketObj = null;
				$ticketObj['history']['idUserKf'] 			= "1";
				$ticketObj['history']['idTicketKf']  		= $data->idTicket;
				$ticketObj['history']['descripcion'] 		= "";
				$ticketObj['history']['idCambiosTicketKf'] 	= "25";
				//print_r($ticketObj);
				$this->Ticket_model->addTicketTimeline($ticketObj);
				return json_encode([
					'message' => 'Ocurrio un error con la Api de MercadoLibre' ,
					'status' => 500 ,
					'data' => json_decode($response, true, JSON_UNESCAPED_SLASHES)
				]);
			}
		} catch (\Exception $e) {
			return json_encode([
				'message' => 'Ha ocurrido un error al registrar el pago' ,
				'status' => 404 ,
				'data' => $e
			]);
		}
	}

	public function getPaymentMPDetails($id)
	{	
		$ticket2Update = null;
		$MP_TOKEN="APP_USR-8877359900700578-012401-353b1bedff98a4ab78a54ff57802f64a-1177407195";
		if (!$id) {
           return null;
        }
		try {
			$paymentUpdated = null;
			$uri = "https://api.mercadopago.com/v1/payments/".$id;
			//print_r($id." ");
			//print_r($MP_TOKEN);
			//print($uri.'/'.$id."\n");
			$authorization 	= "Authorization: Bearer " . $MP_TOKEN;
			//print($authorization."\n");
			$headers 		= array("Content-Type: application/json", "Accept: application/json" , $authorization );
			//print_r($headers);
			$curl = curl_init();
			curl_setopt_array($curl , [
				CURLOPT_URL 			=> $uri,
				CURLOPT_RETURNTRANSFER 	=> true ,
				CURLOPT_ENCODING 		=> "charset=utf-8" ,
				CURLOPT_MAXREDIRS 		=> 10 ,
				CURLOPT_TIMEOUT 		=> 30 ,
				CURLOPT_CUSTOMREQUEST 	=> 'GET',
				CURLOPT_SSL_VERIFYPEER 	=> false,
				CURLOPT_SSL_VERIFYHOST 	=> false,
				CURLOPT_HTTPAUTH 		=> 1,
				CURLOPT_VERBOSE 		=> true,
				CURLOPT_STDERR 			=> fopen('curl_mp.log', 'a+'),
				CURLOPT_HTTPHEADER 		=> $headers,
			]);
			//print_r($curl);
			$response  		 = curl_exec($curl);
			$err       		 = curl_error($curl);
			$httpcode  		 = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			$rs_decode 		 = json_decode($response, true, JSON_UNESCAPED_SLASHES);
			$response_decode = json_decode(json_encode($rs_decode));
			curl_close($curl);
			if($httpcode == 200 && $response_decode->status == "approved" && $response_decode->status_detail == "accredited") {
				$lastPaymentAddedQuery = null;
				$lastPaymentAddedQuery = $this->paymentById($response_decode->external_reference);
				$lastPaymentAddedQuery_decode=json_decode(json_encode($lastPaymentAddedQuery[0]));
				//print_r($lastPaymentAddedQuery_decode);
				if (is_null($lastPaymentAddedQuery_decode->mp_payment_id) || $lastPaymentAddedQuery_decode->mp_payment_id == 0){
					//print("El pago no se encuentra registado");
					$dataObj = null;
					$dataObj['data']['collection_status'] 	 = $response_decode->status;
					$dataObj['data']['status_detail'] 	 	 = $response_decode->status_detail;
					$dataObj['data']['payment_id'] 		 	 = $response_decode->id;
					$dataObj['data']['payment_type'] 		 = $response_decode->payment_type_id;
					$dataObj['data']['merchant_order_id'] 	 = $response_decode->order->id;
					$dataObj['data']['site_id'] 			 = "MLA";
					$dataObj['data']['processing_mode'] 	 = $response_decode->processing_mode;
					$dataObj['data']['merchant_account_id']  = $response_decode->merchant_account_id;
					$dataObj['data']['external_reference']   = $response_decode->external_reference;
					$idTicketKf = $lastPaymentAddedQuery_decode->idTicketKf;
					$rsPaymentUpdated = $this->updatePayment($dataObj['data']);
					$ticketObj = null;
					$changeStatusRs=null;
					$ticketObj['history']['idUserKf'] 	 		= "1";
					$ticketObj['history']['idTicketKf']  		= $idTicketKf;
					$ticketObj['history']['descripcion'] 		= "Pago del pedido has sido aprobado y acreditado";
					$ticketObj['history']['idCambiosTicketKf'] 	= "4";
					$this->Ticket_model->addTicketTimeline($ticketObj);
					$ticket2Update = $this->Ticket_model->ticketById($idTicketKf);
					if ($ticket2Update[0]['idStatusTicketKf']=="9"){
						$changeStatusRs = $this->Ticket_model->quickChangueStatus($idTicketKf,"11");
						if ($changeStatusRs){
							$ticketObj = null;
							$ticketObj['history']['idUserKf'] 			= "1";
							$ticketObj['history']['idTicketKf']  		= $idTicketKf;
							$ticketObj['history']['descripcion'] 		= "";
							$ticketObj['history']['idCambiosTicketKf'] 	= "3";
						}
						$this->Ticket_model->addTicketTimeline($ticketObj);
					}else{
						$changeStatusRs = $this->Ticket_model->quickChangueStatus($idTicketKf,"8");
						if ($changeStatusRs){
							$ticketObj = null;
							$ticketObj['history']['idUserKf'] 			= "1";
							$ticketObj['history']['idTicketKf']  		= $idTicketKf;
							$ticketObj['history']['descripcion'] 		= "";
							$ticketObj['history']['idCambiosTicketKf'] 	= "13";
						}
						$this->Ticket_model->addTicketTimeline($ticketObj);
						
					}

					if($rsPaymentUpdated){
						$lastPaymentUpdated = null;
						$lastPaymentUpdated = $this->paymentById($response_decode->external_reference);
						$paymentUpdated 	= json_decode(json_encode($lastPaymentUpdated[0]));
					}
				}else{
					$paymentUpdated = "El pago ya se encuentra registrado en el sistema.";
				}
				return json_encode([
					'message' 	=> 'Conexion con la API de Mercado Pago Exitosa' ,
					'status' 	=> $httpcode ,
					'data' 		=> $paymentUpdated
				]);
			}else if($httpcode == 200 && ($response_decode->status != "approved" || $response_decode->status_detail != "accredited")) {
				return json_encode([
					'message' 	=> 'Pago no se encuentra aprobado o acreditado, verificar en Mercado Pago.' ,
					'status' 	=> $httpcode ,
					'data' 		=> $response_decode->message,
				]);
			}else if($httpcode == 401) {
				return json_encode([
					'message' 	=> 'Token invalido para autenticar en la API de Mercado Pago' ,
					'status' 	=> $httpcode ,
					'data' 		=> $response_decode->message,
				]);
			}else if($httpcode == 404) {
				return json_encode([
					'message' 	=> $response_decode->message ,
					'status' 	=> $httpcode,
					'data' 		=> $response_decode->error,
				]);
			}
		} catch (\Exception $e) {
			return json_encode([
				'message' 	=> 'Ha ocurrido un error con la API de Mercado Pago' ,
				'status' 	=> $httpcode ,
				'data' 		=> $e
			]);
		}
	}

	public function getNotificationFromMP($response)
	{
		$MP_TOKEN="APP_USR-8877359900700578-012401-353b1bedff98a4ab78a54ff57802f64a-1177407195";
		//var_dump($response['api_version']);
		// ENVIAMOS EL MAIL DE CONFIRMAR REGISTRO //
		/*MAIL*/
		if($response['type'] != "test"){
			$title = "MercadoPago Webhook Notification ";
			$subject = "Webhook Payment Notification from MercadoPago to BSS - [". $response['type']."] - ID:".$response['data']['id'];
			$body='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Api version: <b>'.$response['api_version'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Action: <b>'.$response['action'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Type: <b>'.$response['type'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">App ID: <b>'.$response['application_id'].'</b></td>'; 
			$body.='</tr>';
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Date: <b>'.$response['date_created'].'</b></td>'; 
			$body.='</tr>';
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Mode: <b>'.$response['live_mode'].'</b></td>'; 
			$body.='</tr>';
			$this->mail_model->sendMail($title, "rexx84@gmail.com", $body, $subject);
		}else{
			$title = "MercadoPago Webhook Notification ";
			$subject = "Webhook Payment Notification from MercadoPago to BSS [TEST] - ID: ".$response['data']['id'];
			$body='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-top:4%;">Api version: <b>'.$response['api_version'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Action: <b>'.$response['action'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Type: <b>'.$response['type'].'</b></td>'; 
			$body.='</tr>';	
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">App ID: <b>'.$response['application_id'].'</b></td>'; 
			$body.='</tr>';
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Date: <b>'.$response['date_created'].'</b></td>'; 
			$body.='</tr>';
			$body.='<tr width="100%" bgcolor="#ffffff">';
			$body.= '<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Mode: <b>'.$response['live_mode'].'</b></td>'; 
			$body.='</tr>';
			$this->mail_model->sendMail($title, "rexx84@gmail.com", $body, $subject);
		}

		
		if ($response['type'] == "test"){
			return true;
		}else{
			$paymentDetails  		= $this->getPaymentMPDetails($response['data']['id']);
			$paymentDetails_final   = json_decode($paymentDetails, true, JSON_UNESCAPED_SLASHES);
			if ($paymentDetails_final['status'] == 200){
				return true;
			}else{
				return null;
			}
			//$lastPaymentAddedQuery = null;
			//$lastPaymentAddedQuery = $this->paymentById($response_decode->external_reference);
			//$lastPaymentAddedQuery_decode=json_decode(json_encode($lastPaymentAddedQuery[0]));
			//if (!is_null($lastPaymentAddedQuery_decode->mp_payment_id)){
			//	print($lastPaymentAddedQuery_decode->mp_payment_id);
			//}
			//$currentURL = $this->get_the_current_url(); //for simple URL

			//return $paymentDetails_final;
		}	
	}

    public function addPayment($data) {
		$idPaymentKf = null;
		if (@$data['idPayment']){
			$this->db->delete('tb_mp_payments' , ['idPayment' => $data['idPayment']]);
		}
        $this->db->insert('tb_mp_payments', [
                'mp_preference_id'        => $data['id'],
                'mp_client_id'   		  => $data['client_id'],
                'mp_collector_id'         => $data['collector_id'],
                'mp_date_created'         => $data['date_created'],
                'mp_expires'              => $data['expires'],
                'mp_external_reference'   => $data['external_reference'],
                'mp_prod_init_point'      => $data['init_point'],
                'mp_dev_init_point'       => $data['sandbox_init_point'],
                'mp_operation_type'       => $data['operation_type'],
                'idTicketKf'              => $data['idTicketKf'],

        ]);

		if ($this->db->affected_rows() === 1) {
			$idPaymentKf = $this->db->insert_id();
			if (! $data['paymentForDelivery']){
				$this->db->set(
					array(
						'idPaymentKf' => $idPaymentKf
					)
				)->where("idTicket", $data['idTicketKf'])->update("tb_tickets_2");
			}else{
				$this->db->set(
					array(
						'idPaymentDeliveryKf' => $idPaymentKf
					)
				)->where("idTicket", $data['idTicketKf'])->update("tb_tickets_2");
			}
			$lastTicketUpdatedQuery = null;
			$lastTicketUpdatedQuery = $this->Ticket_model->ticketById($data['idTicketKf']);
				//MAIL
				$user = null;
				$building = null;
				$title = null;
				$subject = null;
				$body = null;
				$to = null;
				$title = "Link de Pago Generado";
				if ($lastTicketUpdatedQuery[0]['idTypeRequestFor']==1 && ($lastTicketUpdatedQuery[0]['sendNotify']==1 || $lastTicketUpdatedQuery[0]['sendNotify']==null)){
					//DEPARTMENT, BUILDING & ADMINISTRATION DETAILS
					$this->db->select("*,b.idClient as idBuilding, b.name, tb_client_type.ClientType, UPPER(CONCAT(tb_client_departament.floor,\"-\",tb_client_departament.departament)) AS Depto")->from("tb_client_departament");
					$this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
					$this->db->join('tb_clients AS b', 'b.idClient = tb_client_departament.idClientFk', 'left');
					$this->db->join('tb_client_type', 'tb_client_type.idClientType = b.idClientTypeFk', 'left');
					$queryBuilding = $this->db->where("tb_client_departament.idClientDepartament = ", $lastTicketUpdatedQuery[0]['idDepartmentKf'])->get();
					if ($queryBuilding->num_rows() > 0) {
						$building = $queryBuilding->row_array();
					}
					$subject="Pedido Llavero :: ".$building['Depto']." :: Link de Pago";
					//GET USER
					$this->db->select("*")->from("tb_user");
					$this->db->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'left');
					$this->db->join('tb_profiles', 'tb_profiles.idProfiles = tb_user.idSysProfileFk', 'left');
					$this->db->join('tb_status', 'tb_status.idStatusTenant = tb_user.idStatusKf', 'left');
					$queryUser = $this->db->where("idUser =", $lastTicketUpdatedQuery[0]['idUserRequestBy'])->get();
					if ($queryUser->num_rows() > 0) {
						$user = $queryUser->row_array();
						#MAIL TO USER
						$rs = null;
						$to = $user['emailUser'];
						$body.='<tr width="100%" bgcolor="#ffffff">';
						$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Hola <b>'.$user['fullNameUser'].'</b>,</td>';
						$body.='</tr>';
						$body.='<tr width="100%" bgcolor="#ffffff">';
						$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;">Se ha generado el siguiente link de MercadoPago para pagar el Pedido N°: <b>'.$lastTicketUpdatedQuery[0]['codTicket'].'</b></td>';
						$body.='</tr>';
						$body.='<tr width="100%" bgcolor="#ffffff">';
						$body.='<td width="100%" align="left" valign="middle" style="font-size:1vw; font-family: sans-serif; padding-left:4%;padding-right:4%;padding-bottom:4%;">Puede efectuar el pago haciendo click en <span style="background-color:#5cb85c;border-color: #4cae4c !important;color: #fff !important; border-radius: 10px; padding: 3px 7px;"><a href="'.$lastTicketUpdatedQuery[0]['paymentDetails']['mp_prod_init_point'].'" target="_blank" style="text-decoration: none; color: #ffffff;">PAGAR</a></span> </td>';
						$body.='</tr>';
						$this->mail_model->sendMail($title, $to, $body, $subject);
					}
				}
			$lastPaymentAddedQuery = null;
			$lastPaymentAddedQuery = $this->paymentById($idPaymentKf);
			return $lastPaymentAddedQuery;
		}else{
			return null;
		}

    }

	public function updatePayment($data) {
		$idPaymentKf = null;
		$lastPaymentUpdatedQuery = null;
		$now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set(
            [
                'mp_collection_status'      => $data['collection_status'],
				'mp_status_detail'      	=> $data['status_detail'],
				'mp_payment_id'				=> $data['payment_id'],
				'mp_payment_type' 			=> $data['payment_type'],
                'mp_merchant_order_id'   	=> $data['merchant_order_id'],
                'mp_site_id'         		=> $data['site_id'],
                'mp_processing_mode'        => $data['processing_mode'],
                'mp_merchant_account_id'    => $data['merchant_account_id'],
				'sys_date_updated'			=> $now->format('Y-m-d H:i:s') ,
			]
		)->where("mp_external_reference", $data['external_reference'])->update("tb_mp_payments");
		if ($this->db->affected_rows() == 1) {
			//$lastPaymentUpdatedQuery = $this->paymentById($data['payment_id']);
			return true;
		}else{
			return null;
		}

    }

	/* GET PAYMENT BY ID */
	public function paymentById($id)
	{
		$query = null;
		$rs     = null;

		$this->db->select("*")->from("tb_mp_payments");
		$this->db->where("idPayment = " , $id);
		$this->db->or_where("mp_preference_id", $id);
		$this->db->or_where("mp_external_reference", $id);
		$query = $this->db->get();

		if ($query->num_rows() > 0){
			$rs = $query->result_array();
			return $rs;
		}else{
			return null;
		}
		
	}

}

?>
