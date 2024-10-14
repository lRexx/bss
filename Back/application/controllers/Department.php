<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Department extends REST_Controller {

	public  function __construct()
 	{
 		parent::__construct();
 		$this->load->model('department_model');
        /*MAIL*/
		$this->load->model('mail_model');
 	}


 	public function index_post() {
       
        if (!$this->post('department')) {
            $this->response(NULL, 404);
        }

        $department = $this->department_model->add($this->post('department'));

        if (!is_null($department)) {
            $this->response(array('response' => "DEPARTAMENTO AGREGADO "), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }

 
    

     /* SERVICIO EDITA UN USUARIOS  */
    public function update_post() {

        if (!$this->post('department')) {
            $this->response(NULL, 404);
        }

        $rs = $this->department_model->update($this->post('department'));

        if (!is_null($rs)) {
            $this->response(array('response' => "DEPARTAMENTO  EDITADO"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }


      /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function inactive_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->changueStatus($id, 0);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO ACTIVAR  UN USUARIOS POR ID */
    public function active_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->changueStatus($id, 1);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function delete_delete($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->changueStatus($id, -1);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }


     public function find_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->get($id);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function chekDepartamenteOwner_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->chekDepartamenteOwner($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function byIdDireccion_get($id,$idStatus) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->byIdDireccion($id,$idStatus);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function keyChainsByIdAddress_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $keyChainAddress = null;
        $keyChainAddress = $this->department_model->keyChainsByIdAddress($id);

        if (!is_null($keyChainAddress)) {
            $this->response($keyChainAddress, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function allDepartment_get() {

                $deparments = $this->department_model->getAllDepartment();
                if (!is_null($deparments)) {
                    $this->response($deparments, 200);
                } else {
                    $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
                }
            }
    /* SERVICIO GET QUE RETORNA LOS DEPARTAMENTO SEGUN EL ID DE DIRECION Y ID DEL INQUILINO */
    public function byIdTenantYDireccion_get($id, $idT, $idStatus, $typeTenant) {
        if (!$id || !$idT) {
            $this->response(NULL, 404);
        }

        $department = null;
        $department = $this->department_model->byIdTenantYDireccion($id, $idT, $idStatus, $typeTenant);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO GET QUE OBTIENE LOS USUARIOS POR FILTRO */
    public function search_post() {

        $searchFilter = $this->post('filter');

        $department = $this->department_model->get(null, $searchFilter);

        if (!is_null($department)) {
            $this->response($department, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    public function approveTenantDepartment_post() {

        if (!$this->post('user')) {
            $this->response(NULL, 404);
        }

        $rs = $this->department_model->approveTenantDepartment($this->post('user'));

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }
    /* SERVICIO APRUEBA INQUILINO A UN DEPARTAMENTO */
    public function deptoTenantStatus_get($id, $idStatus) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->deptoTenantStatus($id, $idStatus);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function aprobated_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->aprobated($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function desaprobated_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->desaprobated($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }



    //*** SOCILITAR BAJA DE DEPARTAMENTO POR PROPIETARIO */

    public function requesLowByProp_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->requesLowByProp($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    //*** SOCILITAR BAJA DE DEPARTAMENTO POR INQUILINO */

    public function requesLowByTenant_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $rs = null;
        $rs = $this->department_model->requesLowByTenant($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* EDITAR DATOS DE UN inquilino */
    public function removeTenant_post() {

        $data = $this->post('info');

        $rs = $this->department_model->removeTenant($data);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
    
 }
 ?>