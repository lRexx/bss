<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Direccion extends REST_Controller {

	public  function __construct(){
 		parent::__construct();
 		$this->load->model('direccion_model');
     }
     

     public function index_get() {
      

        $dr = null;
        $dr = $this->direccion_model->get();

        if (!is_null($dr)) {
            $this->response($dr, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function byidTenant_get($id, $idDpto, $idStatus) {
        
  
          $rs = null;
          $rs = $this->direccion_model->byidTenant($id, $idDpto, $idStatus);
  
          if (!is_null($rs)) {
              $this->response($rs, 200);
          } else {
              $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
          }
      }

      public function addressByidTenant_get($id, $idTypeTenant, $idStatus) {
        
  
        $rs = null;
        $rs = $this->direccion_model->addressByidTenant($id, $idTypeTenant, $idStatus);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

      public function addressListByCompanyid_get($id) {
        
  
          $rs = null;
          $rs = $this->direccion_model->addressListByCompanyid($id);
  
          if (!is_null($rs)) {
              $this->response($rs, 200);
          } else {
              $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
          }
      }
      public function getTheAddressBySecurityCode_get($id) {
        
  
          $rs = null;
          $rs = $this->direccion_model->getTheAddressBySecurityCode($id);
  
          if (!is_null($rs)) {
              $this->response($rs, 200);
          } else {
              $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
          }
      }
      public function checkIfAddressIsInDebt_get($id) {
        
  
          $rs = null;
          $rs = $this->direccion_model->checkIfAddressIsInDebt($id);
  
          if (!is_null($rs)) {
              $this->response($rs, 200);
          } else {
              $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
          }
      }
}
?>