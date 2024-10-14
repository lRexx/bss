<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Tenant extends REST_Controller {

	public  function __construct()
 	{
 		parent::__construct();
 		$this->load->model('tenant_model');
 	}


 	public function index_post() {
       
        if (!$this->post('tenant')) {
            $this->response(NULL, 404);
        }

        $tenant = $this->tenant_model->add($this->post('tenant'));

        if (!is_null($tenant)) {
            $this->response(array('response' => "INQUILINO AGREGADO "), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }

     public function filterForm_get() {
        $filters = $this->tenant_model->getFilterForm();

        if (!is_null($filters)) {
            $this->response($filters, 200);
        } else {
            $this->response(array('response' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO EDITA UN USUARIOS  */
    public function update_post() {

        if (!$this->post('tenant')) {
            $this->response(NULL, 404);
        }

        $rs = $this->tenant_model->update($this->post('tenant'));

        if (!is_null($rs)) {
            $this->response(array('response' => "INQUILINO  EDITADO"), 200);
        } else {
            $this->response(array('error' => "ERROR INESPERADO"), 500);
        }
    }


     /* SERVICIO RETORNA EL LISTADO DE INQUILINOS SEGUN UN id DEPARTAMENTO   */
     public function tenanatByIdDepartament_get($id, $idType) {
        
        
                $rs = $this->tenant_model->getTenanatByIdDepartament($id, $idType);
        
                if (!is_null($rs)) {
                    $this->response($rs, 200);
                } else {
                    $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
                }
     }

     public function allByIdDepartament_get($id) {
        
        
                $rs = $this->tenant_model->allByIdDepartament($id);
        
                if (!is_null($rs)) {
                    $this->response($rs, 200);
                } else {
                    $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
                }
     }

     public function allWithoutKeyAssignedByIdDepartament_get($id) {
        
        
        $rs = $this->tenant_model->allWithoutKeyAssignedByIdDepartament($id);

        if (!is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
}


    /* SERVICIO RETORNA EL LISTADO DE DEPARTA,ENTOS DE UN ADMINISTRADOR  */
     public function departamentByIdAdminR_get($id) {
        
        
                $rs = $this->tenant_model->getDepartamentByIdAdminR($id);
        
                if (!is_null($rs)) {
                    $this->response($rs, 200);
                } else {
                    $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
                }
            }


      /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function inactive_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $tenant = null;
        $tenant = $this->tenant_model->changueStatus($id, 0);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

     /* SERVICIO ACTIVAR  UN USUARIOS POR ID */
    public function active_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $tenant = null;
        $tenant = $this->tenant_model->changueStatus($id, 1);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO INACTIVA  UN USUARIOS POR ID */
    public function delete_delete($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $tenant = null;
        $tenant = $this->tenant_model->changueStatus($id, -1);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }


     public function find_get($id) {
        if (!$id) {
            $this->response(NULL, 404);
        }

        $tenant = null;
        $tenant = $this->tenant_model->get($id);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    public function findByEmail_get($mail) {
        if (!$mail) {
            $this->response(NULL, 404);
        }

        $tenant = null;
        $tenant = $this->tenant_model->findByEmail($mail);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }

    /* SERVICIO GET QUE OBTIENE LOS USUARIOS POR FILTRO */
    public function search_post() {

        $searchFilter = $this->post('filter');

        $tenant = $this->tenant_model->get(null, $searchFilter);

        if (!is_null($tenant)) {
            $this->response($tenant, 200);
        } else {
            $this->response(array('error' => 'NO HAY RESULTADOS'), 404);
        }
    }
 }
 ?>