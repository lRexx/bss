<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

class Util extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('util_model');
    }

    public function clientType_get() {

        $user = null;
        $user = $this->util_model->getClientType();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function agent_get() {

        $user = null;
        $user = $this->util_model->getAgent();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function costcenter_get() {

        $rs = null;
        $rs = $this->util_model->getCostCenter();

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function localidad_get($idProvinceFk) {

        if (! $idProvinceFk) {
            $this->response(null, 404);
        }
        $user = null;
        $user = $this->util_model->getLocalidad($idProvinceFk);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function locationsZone_get($idProvinceFk) {

        if (! $idProvinceFk) {
            $this->response(null, 404);
        }
        $user = null;
        $user = $this->util_model->getLocationsZone($idProvinceFk);

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function localidades_get() {

        $user = null;
        $user = $this->util_model->getAllLocalidades();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function provincia_get() {
        $user = null;
        $user = $this->util_model->getProvincia();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function taxtype_get() {
        $user = null;
        $user = $this->util_model->getTaxtype();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function categoryDepartament_get() {
        $user = null;
        $user = $this->util_model->getCategoryDepartament();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function detinationLicense_get() {
        $user = null;
        $user = $this->util_model->getDetinationLicense();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function getDepartmentsByCustomerId_get($id) {
         if (!$id) {
            $this->response(NULL, 404);
        }
        $rs = null;
        $rs = $this->util_model->getDepartmentByCustomerId($id);

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function getCustomerIdByDepartmentsId_get($id) {
         if (!$id) {
            $this->response(NULL, 404);
        }
        $rs = null;
        $rs = $this->util_model->getCustomerIdByDepartmentsId($id);

        if (! is_null($rs)) {
            $this->response($rs, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function tipoInmueble_get() {
        $user = null;
        $user = $this->util_model->getTipoInmueble();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function typeOfMails_get() {
        $user = null;
        $user = $this->util_model->getTypeOfMails();

        if (! is_null($user)) {
            $this->response($user, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function adress_get() {
        $adressEdi = null;
        $adressEdi = $this->util_model->getAdressClientEdificio();

        if (! is_null($adressEdi)) {
            $this->response($adressEdi, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function tipoServiciosInternet_get() {

        $result = $this->util_model->getTypeServicesInternet();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function getTipeConetionRemote_get() {

        $result = $this->util_model->getTipeConetionRemote();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function getTypeAlarmClient_get() {

        $result = $this->util_model->getTypeAlarmClient();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }

    public function getAlarmServicesAditionals_get() {

        $result = $this->util_model->getAlarmServicesAditionals();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function getFormatoTransmision_get() {

        $result = $this->util_model->getFormatoTransmision();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function typeOperatingSystem_get() {

        $result = $this->util_model->getTypeOperatingSystem();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }    
    public function uploadFile_post() {

                $config['upload_path']          = './uploads/';
                $config['allowed_types']        = 'gif|jpg|png';
                $config['max_size']             = 2048;
                $config['max_width']            = 1024;
                $config['max_height']           = 768;

        $this->load->library('upload', $config);

        if (!$this->upload->do_upload('profile_image')) {
            $error = array('error' => $this->upload->display_errors());
            return $error;
        } else {
            //$data = array('image_metadata' => $this->upload->data());
            return true;            
        }
    }
    public function typeTechnicianServices_get() {

        $result = $this->util_model->typeTechnicianServices();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
    public function typeReasonDownServices_get() {

        $result = $this->util_model->typeReasonDownServices();

        if (! is_null($result)) {
            $this->response($result, 200);
        } else {
            $this->response([ 'error' => 'NO HAY RESULTADOS' ], 404);
        }
    }
}

?>