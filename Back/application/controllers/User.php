<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class User extends REST_Controller {

	public  function __construct(){
 		
        #header('Access-Control-Allow-Origin: *');
        #header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        parent::__construct();     
 		$this->load->model('user_model');
        /*MAIL*/
		$this->load->model('mail_model');
 	}
 	/* SERVICIO QUE AUTENTIFICA  */
	public function auth_post()
	{

        $user = $this->user_model->auth($this->post('user'));   
             
        if(!is_null($user))
        {
        	$this->response(array('response' => $user),200);
        }
        else
        {
        	$this->response(array('error' => "Usuario Invalido"),203);
        }
               
	}

	public function index_post() {
       $user = null;
        if (!$this->post('user')) {
            $this->response(NULL, 404);
        }

        $user = $this->user_model->add($this->post('user'));

        if (!is_null($user)) {
            if($user == -1){
                $this->response(array('error' => "DNI ya se encuentra registrado"),203);
            }else{
                $this->response(array('response' => "USUARIO SISTEMA AGREGADO "), 200);
            }
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }

    /* SERVICIO GET QUE OBTIENE TODO LOS USUARIOS REGISTRADOS */
    public function index_get($id) {

        $user = $this->user_model->get($id);
        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO GET QUE OBTIENE TODO LOS USUARIOS QUE NO POSEEN DEPARTAMENTOS ASOCIADOS  */
    public function usernoregister_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }
        $user = $this->user_model->usernoregister($id);
        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function attendantWithNobuildingAssigned_get() {
        $attendants = $this->user_model->attendantsNotBuildingAssigned();
        if (!is_null($attendants)) {
            $this->response($attendants, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
     public function filterForm_get() {
        $filters = $this->user_model->getFilterForm();

        if (!is_null($filters)) {
            $this->response($filters, 200);
        } else {
            $this->response(array('response' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function find_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->get($id);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function validate_get($token) {
        if (!$token) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->validate($token);

        if (!is_null($user)) {
            $this->response("Usuario validado!", 200);
        } else {
            $this->response(array('error' => 'Token invalido o ya ha sido confirmado'), 404);
        }
    }

    /* get param*/
    public function param_get() {
      
        $PARAM = null;
        $PARAM = $this->user_model->getParam();

        if (!is_null($PARAM)) {
            $this->response($PARAM, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* get param*/
    public function deliveryType_get() {
        
          $rs = null;
          $rs = $this->user_model->getdeliveryType();
  
          if (!is_null($rs)) {
              $this->response($rs, 200);
          } else {
              $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
          }
      }

    public function attendantByIdDirecction_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->user_model->attendantByIdDirecction($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function listUsersByClient_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->user_model->listUsersByClient($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function attendantsOnlyByIdDirecction_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->user_model->attendantsOnlyByIdDirection($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function chekBuildingTitularAttendant_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->user_model->chekBuildingTitularAttendant($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO GET QUE OBTIENE LOS USUARIOS POR FILTRO */
    public function search_post() {

        $searchFilter = $this->post('filter');

        $user = $this->user_model->get(null, $searchFilter);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO EDITA UN USUARIOS  */
    public function update_post() {

        if (!$this->post('user')) {
            $this->response(array('error' => "PARAMETROS NO RECIBIDOS"), 404);
        }

        $rs = $this->user_model->update($this->post('user'));

        if (!is_null($rs)) {
            $this->response(array('response' => "USUARIO SISTEMA EDITADO"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }

    /*  CAMBIO DE CLAVE */
    public function updatePass_post() {
        
        if (!$this->post('user')) {
            $this->response(array('error' => "Post Data is Missing"), 404);
        }

        $rs = $this->user_model->updatePass($this->post('user'));

        if (!is_null($rs)) {

            //$this->response(array('response' => $rs), 200);
            //$this->response(array('response' => "Su Nueva Clave fue enviada a su direccion de correo!"), 200);
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }
             /*  CAMBIO DE CLAVE */
    public function updateParam_post() {
        
                if (!$this->post('param')) {
                    $this->response(NULL, 404);
                }
        
                $rs = $this->user_model->updateParam($this->post('param'));
        
                if (!is_null($rs)) {

                    //$this->response(array('response' => $rs), 200);
                    $this->response(array('response' => "Parametro actualizado!"), 200);
                } else {
                    $this->response(array('error' => "ERROR INESPERADO"), 500);
                }
    }

    /* SERVICIO EDITA UN USUARIOS  */
    public function updateMailSmtp_post() {
        
        if (!$this->post('mail')) {
            $this->response(NULL, 404);
        }

        $rs = $this->user_model->updateMailSmtp($this->post('mail'));

        if (!is_null($rs)) {
            $this->response(array('response' => "Mail De envio Configurado"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }

    public function inactive_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->changueStatus($id, 0);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function mailsmtp_get() {
      

        $user = null;
        $user = $this->user_model->mailsmtp();

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO ACTIVAR  UN USUARIOS POR ID */
    public function active_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->changueStatus($id, 1);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function get_the_current_url_get() {

        $user = null;
        $user = $this->user_model->get_the_current_url();

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO SENDMAIL TEST */
    public function sednmail_post() {
        //print_r($this->post('mail'));
        $to = array("emailUser"=>null);
        $to['emailUser']=$this->post('mail')['to'];
        $title=$this->post('mail')['title'];
        $subject=$this->post('mail')['subject'];
        $body=$this->post('mail')['body'];
        //print_r($to['emailUser']);
        $user = null;
        $user = $this->mail_model->sendMail($title, $to, $body, $subject);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function delete_delete($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->changueStatus($id, -1);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO INACTIVA  UN ENCARGADO POR ID */
     public function antendant_delete($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->changueStatusAntendant($id, -1);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO INACTIVA  UN ENCARGADO POR ID */
     public function antendantActive_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->changueStatusAntendant($id, 1);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function attendant_post()
	{

        $user = $this->user_model->addAttendant($this->post('attendant'));   
             
        if(!is_null($user))
        {
        	$this->response(array('response' => $user),200);
        }
        else
        {
        	$this->response(array('error' => "Usuario Invalido"),203);
        }
               
	}
    public function updateAtt_post() {

        if (!$this->post('attendant')) {
            $this->response(NULL, 404);
        }

        $rs = $this->user_model->updateAttendant($this->post('attendant'));

        if (!is_null($rs)) {
            $this->response(array('response' => "ENCARGADO EDITADO"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }
    public function findUserByEmail_post() {
	   
		if (!$this->post('mail')) {
            $this->response(NULL, 404);
        }

        $user = null;
        $user = $this->user_model->findUserByEmail($this->post('mail')['email']);

        if (!is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function findUserByEmail_options() {
        return $this->response(NULL, REST_Controller::HTTP_OK);
    }
    /*empresa*/
    public function updatecompany_post() {

        if (!$this->post('company')) {
            $this->response(NULL, 404);
        }

        $rs = $this->user_model->updatecompany($this->post('company'));

        if (!is_null($rs)) {
            $this->response(array('response' => "EMPRESA EDITADA"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }
    public function getCompany_get() {
        $filters = $this->user_model->getCompany();

        if (!is_null($filters)) {
            $this->response($filters, 200);
        } else {
            $this->response(array('response' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO GET QUE OBTIENE TODO LOS USUARIOS REGISTRADOS */
    public function getListOfUsers_get() {

        $lists = $this->user_model->getListOfUsers();
        if (!is_null($lists)) {
            $this->response($lists, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    
    /* SERVICIO GET QUE OBTIENE TODO LOS USUARIOS ASOCIADOS A UNA ADMINISTRACION/COMPAÑIA*/
    public function getUsersByCompanyClientId_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }
        $lists = $this->user_model->getUsersByCompanyClientId($id);
        if (!is_null($lists)) {
            $this->response($lists, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function listAuthorizedUsers_get() {
        $lists=null;
        $lists = $this->user_model->getAuthorizedUsers();
        if (!is_null($lists)) {
            $this->response($lists, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function addAuthorizationToken_post() {
        
        if (!$this->post('user')) {
            $this->response(array('error' => "Post Data is Missing"), 404);
        }

        $rs = $this->user_model->addAuthorizationToken($this->post('user'));

        if (!is_null($rs)) {

            //$this->response(array('response' => $rs), 200);
            //$this->response(array('response' => "Su Nueva Clave fue enviada a su direccion de correo!"), 200);
            $this->response(array('response' => "Token generated successfully"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }
    public function listAuthorizationTokenByUserId_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }
        $lists = $this->user_model->listAuthorizationTokenByUserId($id);
        if (!is_null($lists)) {
            $this->response($lists, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function setTokenCompleted_get($token) {
        if (!$token) {
            $this->response(NULL, 404);
        }
        $rs = $this->user_model->setTokenCompleted($token);
        if (!is_null($rs)) {
            $this->response(array('response' => "Token is completed"), 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function validateAuthorizationToken_post() {

        if (!$this->post('token')) {
            $this->response(array('error' => "Post Data is Missing"), 404);
        }

        $rs = $this->user_model->validateAuthorizationToken($this->post('token'));
        if (!is_null($rs)) {
            //$this->response(array('response' => $rs), 200);
            //$this->response(array('response' => "Su Nueva Clave fue enviada a su direccion de correo!"), 200);
            $this->response(array('response' => "Token is valid"), 200);
        } else {
            $this->response(array('response' => "Token invalid, used or expired"), 404);
        }
    }
}
?>
