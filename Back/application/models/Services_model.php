<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Services_model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }

    public function addinternet($item) {
        $idClientServicesFk = 0;
        $idClientServicesFk = $this->insertService($item, 'tb_client_services_internet', 'idClientServicesInternet');  // CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_internet', [
                'idClientServicesFk'     => $idClientServicesFk,
                'idTypeInternetFk'       => $item['idTypeInternetFk'],
                'idTypeMaintenanceFk'    => $item['idTypeMaintenanceFk'], //
                'idServiceAsociateFk'    => json_encode($item['idServiceAsociateFk']),
                'idRouterInternetFk'     => $item['idRouterInternetFk'],
                //'numberSeria'            => $item['numberSeria'],
                'userAdmin'              => $item['userAdmin'],
                'idContracAssociated_SE' => $item['idContracAssociated_SE'],
                'idInternetCompanyFk'    => $item['idInternetCompanyFk'],
                'idModemInternetFk'      => $item['idModemInternetFk'],
                'dateDown'               => $item['dateDown'],
                'dateUp'                 => $item['dateUp'],
                'isDown'                 => $item['isDown'],
                'port'                   => $item['port'],
                'passAdmin'              => $item['passAdmin'],
                "userWifi"               => $item['userWifi'],
                "passWifi"               => $item['passWifi'],
                "macAddress"             => $item['macAddress'],
                "numberLine"             => $item['numberLine'],
                "numberChip"             => $item['numberChip'],
                //'addressVpn'             => $item['addressVpn'],
                //'nroSerieInternal'       => $item['nroSerieInternal'],
                //'nroSerieManufacturer'   => $item['nroSerieManufacturer'],
            ]
        );


        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editInternet($item) {

        $this->db->set(
            [
                'idTypeInternetFk'                  => $item['idTypeInternetFk'],
                'idTypeMaintenanceFk'               => $item['idTypeMaintenanceFk'],
                'idServiceFk'                       => $item['idServiceFk'],
                'idServiceAsociateFk'               => json_encode($item['idServiceAsociateFk']),
                'idRouterInternetFk'                => $item['idRouterInternetFk'],
                'userAdmin'                         => $item['userAdmin'],
                'idContracAssociated_SE'            => $item['idContracAssociated_SE'],
                'idInternetCompanyFk'               => $item['idInternetCompanyFk'],
                'idModemInternetFk'                 => $item['idModemInternetFk'],
                'dateDown'                          => $item['dateDown'],
                'dateUp'                            => $item['dateUp'],
                'isDown'                            => $item['isDown'],
                'port'                              => $item['port'],
                'passAdmin'                         => $item['passAdmin'],
                "userWifi"                          => $item['userWifi'],
                "passWifi"                          => $item['passWifi'],
                "macAddress"                        => $item['macAddress'],
                "ipAddress"                         => @$item['ipAddress'],
                "numberLine"                        => $item['numberLine'],
                "numberChip"                        => $item['numberChip'],
                //'addressVpn'                      => $item['addressVpn'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],
            ]
        )->where("idClientServicesInternet", $item['idClientServicesInternet'])->update("tb_client_services_internet");

        $data               = $this->db->select(" idClientServicesFk ")
            ->from('tb_client_services_internet')
            ->where("idClientServicesInternet", $item['idClientServicesInternet'])
            ->get();
        $idClientServicesFk = 0;
        if ($data->num_rows() > 0) {
            $idClientServicesFk = $data->result_array()[0]['idClientServicesFk'];
        }

        if (count($item['adicional']) > 0) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $idClientServicesFk ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }


        return true;

    }

    public function addgps($item) {
        $idClientServicesFk = $this->insertService($item, 'tb_client_services_gps', 'idClientServicesGps');// CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_gps', [
                'idClientServicesFk'     => $idClientServicesFk,
                'idTypeGpsFk'            => $item['idTypeGpsFk'],
                'typeMaintenance'        => $item['typeMaintenance'],
                'dateUp'                 => $item['dateUp'],
                'dateDown'               => $item['dateDown'],
                'modem'                  => $item['modem'],
                'idInternetCompanyFk'    => $item['idInternetCompanyFk'], //empresa
                'idContracAssociated_SE' => $item['idContracAssociated_SE'],
                'nroLine'                => $item['nroLine'],
                'nroChip'                => $item['nroChip'],
                'idServiceAsociateFk'    => $item['idServiceAsociateFk'],
                'nroSerieInternal'       => $item['nroSerieInternal'],
                'nroSerieManufacturer'   => $item['nroSerieManufacturer'],
            ]
        );
        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }


        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function addaccescontrol($item) {

        $idClientServicesFk = $this->insertService($item, 'tb_client_services_access_control', 'idClientServicesAccessControl'); // CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_access_control', [
                'idClientServicesFk'      => $idClientServicesFk,
                'idDoorFk'                => $item['idDoorFk'],
                'idContracAssociated_SE'  => $item['idContracAssociated_SE'],
                'dateUp'                  => $item['dateUp'],
                'dateDown'                => $item['dateDown'],
                'idAccessControlFk'       => $item['idAccessControlFk'],
                'idInputReaderFk'         => $item['idInputReaderFk'],
                'locationGabinet'         => $item['locationGabinet'],
                'idFontFk'                => $item['idFontFk'],
                'aclaration'              => $item['aclaration'],
                'idTypeMaintenanceFk'     => $item['idTypeMaintenanceFk'],
                'lock'                    => $item['lock'],
                'lock2'                   => @$item['lock2'],
                'ouputReader'             => $item['ouputReader'],
                'ouputButom'              => $item['ouputButom'],
                'isOuputReader'           => $item['isOuputReader'],
                'isOuputButom'            => $item['isOuputButom'],
                'isBlocklingScrew'        => $item['isBlocklingScrew'],
                'idEmergencyButtonFk'     => $item['idEmergencyButtonFk'],
                'idShutdownKeyFk'         => $item['idShutdownKeyFk'],
                'acaration2'              => $item['acaration2'],
                //'address'                => $item['address'],
                //'addressLat'             => $item['addressLat'],
                //'addressLon'             => $item['addressLon'],
                'portNumberRouter'        => $item['portNumberRouter'],
                'addressClient'           => $item['addressClient'],
                'addressVpn'              => $item['addressVpn'],
                'portVpn'                 => $item['portVpn'],
                //'addressClientLat'       => $item['addressClientLat'],
                //'addressClientLon'       => $item['addressClientLon'],
                'user'                    => @$item['user'],
                'useVpn'                  => $item['useVpn'],
                'passVpn'                 => $item['passVpn'],
                'pass'                    => @$item['pass'],
                'portHttp'                => $item['portHttp'],
                'observation'             => $item['observation'],
                'locationEmergencyButton' => $item['locationEmergencyButton'],
                'locationOffKey'          => $item['locationOffKey'],

            ]
        );


        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (count($item['battery_install']) > 0) {
            $this->insertServiceBatteryAccessControl($item['battery_install'], $id);  //se crean las baterias
        }

        if (count($item['open_devices']) > 0) {
            $this->insertServiceOpenDevicesAccessControl($item['open_devices'], $id);  //se crean los dispositivos de apertura
        }

        //$id = $this->db->insert_id();
        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editAccescontrol($item) {

        //$idClientServicesFk = $this->insertService($item, 'tb_client_services_access_control', 'idClientServicesAccessControl'); // CREAMOS EL SERVICIO

        $this->db->set(
            [
                'idDoorFk'                          => $item['idDoorFk'],
                'idContracAssociated_SE'            => $item['idContracAssociated_SE'],
                'dateUp'                            => $item['dateUp'],
                'dateDown'                          => $item['dateDown'],
                'idAccessControlFk'                 => $item['idAccessControlFk'],
                'idInputReaderFk'                   => $item['idInputReaderFk'],
                'locationGabinet'                   => $item['locationGabinet'],
                'idFontFk'                          => $item['idFontFk'],
                'aclaration'                        => $item['aclaration'],
                'idTypeMaintenanceFk'               => $item['idTypeMaintenanceFk'],
                'lock'                              => $item['lock'],
                'lock2'                             => @$item['lock2'],
                'ouputReader'                       => $item['ouputReader'],
                'ouputButom'                        => $item['ouputButom'],
                'isOuputReader'                     => $item['isOuputReader'],
                'isOuputButom'                      => $item['isOuputButom'],
                'isBlocklingScrew'                  => $item['isBlocklingScrew'],
                'idEmergencyButtonFk'               => $item['idEmergencyButtonFk'],
                'idShutdownKeyFk'                   => $item['idShutdownKeyFk'],
                'acaration2'                        => $item['acaration2'],
                'portNumberRouter'                  => $item['portNumberRouter'],
                'addressClient'                     => $item['addressClient'],
                'addressVpn'                        => $item['addressVpn'],
                'portVpn'                           => @$item['portVpn'],
                'user'                              => @$item['user'],
                'useVpn'                            => @$item['useVpn'],
                'passVpn'                           => $item['passVpn'],
                'pass'                              => $item['pass'],
                'portHttp'                          => $item['portHttp'],
                'locationEmergencyButton'           => $item['locationEmergencyButton'],
                'locationOffKey'                    => $item['locationOffKey'],
                'observation'                       => @$item['observation'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],
            ]
        )->where("idClientServicesAccessControl", $item['idClientServicesAccessControl'])->update("tb_client_services_access_control");

        $data = $this->db->select("idClientServicesFk")
            ->from('tb_client_services_access_control')
            ->where("idClientServicesAccessControl", $item['idClientServicesAccessControl'])
            ->get();

        $id = 0;
        if ($data->num_rows() > 0) {
            $id = $data->result_array()[0]['idClientServicesFk'];
        }
        if ($id == 0) {
            return 0;
        }     
        if (count($item['battery_install']) > 0) {
            $this->insertServiceBatteryAccessControl($item['battery_install'], $item['idClientServicesAccessControl'], true);  //se actualizan las baterias
        }
        if (count($item['open_devices']) > 0) {
            $this->insertServiceOpenDevicesAccessControl($item['open_devices'], $item['idClientServicesAccessControl'], true);  //se actualizan los dispositivos de apertura.
        }
        if (isset($item['adicional'])) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $id ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $id,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }
        return true;
    }

    public function addsmartpanic($item) {

        $idClientServicesFk = $this->insertService($item, 'tb_client_services_smart_panic', 'idClientServicesSmartPanic'); // CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_smart_panic', [
                'idClientServicesFk'      => $idClientServicesFk,
                'name'                    => $item['name'],
                'idContracAssociated_SE'  => $item['idContracAssociated_SE'],
                'dateUp'                  => $item['dateUp'],
                'dateDown'                => $item['dateDown'],
                'idTypeMaintenanceFk'     => $item['idTypeMaintenanceFk'],
                'idCompanyMonitorFK'      => $item['idCompanyMonitorFK'],
                'sucribeNumber'           => $item['sucribeNumber'],
                'idApplicationFk'         => $item['idApplicationFk'],
                'passwdApp'               => $item['passwordApp'],
                'countNewLicense'         => $item['countNewLicense'],
                'observation'             => $item['observation'],
            ]
        );
        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        $this->insertLicence($item['licenses'], $id);

        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editSmartpanic($item) {

        //$idClientServicesFk = $this->insertService($item, 'tb_client_services_smart_panic', 'idClientServicesSmartPanic'); // CREAMOS EL SERVICIO


        $this->db->set(
            [
                'name'                              => $item['name'],
                'idContracAssociated_SE'            => $item['idContracAssociated_SE'],
                'dateUp'                            => $item['dateUp'],
                'dateDown'                          => $item['dateDown'],
                'idTypeMaintenanceFk'               => $item['idTypeMaintenanceFk'],
                'idCompanyMonitorFK'                => $item['idCompanyMonitorFK'],
                'sucribeNumber'                     => $item['sucribeNumber'],
                'idApplicationFk'                   => $item['idApplicationFk'],
                'passwdApp'                         => $item['passwordApp'],
                'countNewLicense'                   => $item['countNewLicense'],
                'observation'                       => $item['observation'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],                               
            ]
        )->where("idClientServicesSmartPanic", $item['idClientServicesSmartPanic'])->update("tb_client_services_smart_panic");
        $data = $this->db->select("idClientServicesFk")
            ->from('tb_client_services_smart_panic')
            ->where("idClientServicesSmartPanic", $item['idClientServicesSmartPanic'])
            ->get();

        //return $data;

        $id = 0;
        if ($data->num_rows() > 0) {
            //return $data->result_array();
            $id = $data->result_array()[0]['idClientServicesFk'];
        }
        if ($id == 0) {
            return 0;
        }

        //$id = $this->db->insert_id();
        //$this->updatedService($idClientServicesFk, $id);
        $this->insertLicence($item['licenses'], $item['idClientServicesSmartPanic'], true);

        if (isset($item['adicional']) && count($item['adicional']) > 0) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $id ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $id,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }
        return true;
    }

    public function addcamera($item) {
        $idClientServicesFk = $this->insertService($item, 'tb_client_services_camera', 'idClientServicesCamera'); //CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_camera', [
                'name'                   => $item['name'],
                'idContracAssociated_SE' => $item['idContracAssociated_SE'],
                'idTypeMaintenanceFk'    => $item['idTypeMaintenanceFk'],
                'dateUp'                 => $item['dateUp'],
                'dateDown'               => $item['dateDown'],
                'idDvr_nvrFk'            => $item['idDvr_nvrFk'],
                'location'               => $item['location'],
                'maxCamera'              => $item['maxCamera'],
                'numberPortRouter'       => $item['numberPortRouter'],
                'addressVpn'             => $item['addressVpn'],
                'nroPort1'               => $item['nroPort1'],
                'nroPort2'               => $item['nroPort2'],
                'namePort1'              => $item['namePort1'],
                'namePort2'              => $item['namePort2'],
                'observation'            => $item['observation'],
                'addessClient'           => $item['addessClient'],
                'portHttp'               => $item['portHttp'],
                'namePort'               => $item['namePort'],
                'port'                   => $item['port'],
                'idClientServicesFk'     => $idClientServicesFk,
            ]
        );

        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (count($item['clients']) > 0) {
            $this->insertServiceUser($item['clients'], $id);  //se crean los usuarios dvr
        }
        if (count($item['cameras']) > 0) {
            $this->insertServiceCamera($item['cameras'], $id); //CREAMOS las camaras
        }
        if (count($item['backup_energy']) > 0) {
            $this->insertServiceEnergy($item['backup_energy'], $id); //CREAMOS las opciones de energia
        }
        $id = $this->db->insert_id();
        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editCamera($item) {
        //$idClientServicesFk = $this->insertService($item, 'tb_client_services_camera', 'idClientServicesCamera'); //CREAMOS EL SERVICIO

        $this->db->set(
            [
                'name'                              => $item['name'],
                'idContracAssociated_SE'            => $item['idContracAssociated_SE'],
                'idTypeMaintenanceFk'               => $item['idTypeMaintenanceFk'],
                'dateUp'                            => $item['dateUp'],
                'dateDown'                          => $item['dateDown'],
                'idDvr_nvrFk'                       => $item['idDvr_nvrFk'],
                'location'                          => $item['location'],
                'maxCamera'                         => $item['maxCamera'],
                'numberPortRouter'                  => $item['numberPortRouter'],
                'addressVpn'                        => $item['addressVpn'],
                'nroPort1'                          => $item['nroPort1'],
                'nroPort2'                          => $item['nroPort2'],
                'namePort1'                         => $item['namePort1'],
                'namePort2'                         => $item['namePort2'],
                'observation'                       => $item['observation'],
                'addessClient'                      => $item['addessClient'],
                'portHttp'                          => $item['portHttp'],
                'namePort'                          => $item['namePort'],
                'port'                              => $item['port'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],
            ]
        )->where("idClientServicesCamera", $item['idClientServicesCamera'])->update("tb_client_services_camera");

        $data = $this->db->select("idClientServicesFk")
            ->from('tb_client_services_camera')
            ->where("idClientServicesCamera", $item['idClientServicesCamera'])
            ->get();

        //return $data;

        $id = 0;
        if ($data->num_rows() > 0) {
            //return $data->result_array();
            $id = $data->result_array()[0]['idClientServicesFk'];
        }
        if ($id == 0) {
            return 0;
        }

        if (count($item['clients']) > 0) {
            $this->insertServiceUser($item['clients'], $item['idClientServicesCamera'], true);  //se crean los usuarios dvr
        }
        if (count($item['cameras']) > 0) {
            $this->insertServiceCamera($item['cameras'], $item['idClientServicesCamera'], true); //CREAMOS las camaras
        }
        if (count($item['backup_energy']) > 0) {
            $this->insertServiceEnergy($item['backup_energy'], $item['idClientServicesCamera'], true); //CREAMOS las opciones de energia
        }

        if (count($item['adicional']) > 0) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $id ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $id,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function addTotem($item) {

        //$this->insertServiceUser($item);
        $idClientServicesFk = $this->insertService($item, 'tb_client_services_totem', 'idClientServicesTotem'); // CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_totem', [
                'name'                   => $item['name'],
                'idContracAssociated_SE' => $item['idContracAssociated_SE'],
                'dateUp'                 => $item['dateUp'],
                'idCompanyFk'            => $item['idCompanyFk'],
                'idDvr_nvrFk'            => $item['idDvr_nvrFk'],
                'location'               => $item['location'],
                'maxCamera'              => $item['maxCamera'],
                'idTotenModelFk'         => $item['idTotenModelFk'],
                'idTypeMaintenanceFk'     => $item['idTypeMaintenanceFk'],
                'dateDown'               => $item['dateDown'],
                'numberPortRouter'       => $item['numberPortRouter'],
                'addreesVpn'             => $item['addressVpn'],
                'namePort1'              => $item['namePort1'],
                'numberPort1'            => $item['nroPort1'],
                'namePort2'              => $item['namePort2'],
                'numberPort2'            => $item['nroPort2'],
                'addressClientInter'     => $item['addressClientInter'],
                'portHttpInter'          => $item['portHttp'],
                'namePortInter'          => $item['namePort'],
                'numberPortInter'        => $item['port'],
                'observation'            => $item['observation'],
                'numberAbonado'          => $item['numberAbonado'],
                'idClientServicesFk'     => $idClientServicesFk,
            ]
        );

        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (count($item['clients']) > 0) {
            $this->insertServiceUserTotem($item['clients'], $id);  //se crean los usuarios
        }
        if (count($item['cameras']) > 0) {
            $this->insertServiceCameraTotem($item['cameras'], $id); //CREAMOS las camaras
        }
        if (count($item['backup_energy']) > 0) {
            $this->insertServiceEnergyTotem($item['backup_energy'], $id); //CREAMOS las opciones de energia
        }

        if (isset($item['adicional'])) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editTotem($item) {

        $this->db->set(
            [
                'name'                              => $item['name'],
                'idContracAssociated_SE'            => $item['idContracAssociated_SE'],
                'dateUp'                            => $item['dateUp'],
                'idCompanyFk'                       => $item['idCompanyFk'],
                'idDvr_nvrFk'                       => $item['idDvr_nvrFk'],
                'location'                          => $item['location'],
                'maxCamera'                         => $item['maxCamera'],
                'idTotenModelFk'                    => $item['idTotenModelFk'],
                'idTypeMaintenanceFk'               => $item['idTypeMaintenanceFk'],
                'dateDown'                          => $item['dateDown'],
                'numberPortRouter'                  => $item['numberPortRouter'],
                'addreesVpn'                        => $item['addreesVpn'],
                'namePort1'                         => $item['namePort1'],
                'numberPort1'                       => $item['nroPort1'],
                'namePort2'                         => $item['namePort2'],
                'numberPort2'                       => $item['nroPort2'],
                'addressClientInter'                => $item['addressClientInter'],
                'portHttpInter'                     => $item['portHttpInter'],
                'namePortInter'                     => $item['namePort'],
                'numberPortInter'                   => $item['port'],
                'observation'                       => $item['observation'],
                'numberAbonado'                     => $item['numberAbonado'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],
            ]
        )->where("idClientServicesTotem", $item['idClientServicesTotem'])->update("tb_client_services_totem");


        //$id = $this->db->insert_id();
        //$this->updatedService($idClientServicesFk, $id);

        $data = $this->db->select("idClientServicesFk")
            ->from('tb_client_services_totem')
            ->where("idClientServicesTotem", $item['idClientServicesTotem'])
            ->get();

        //return $data;

        $id = 0;
        if ($data->num_rows() > 0) {
            //return $data->result_array();
            $id = $data->result_array()[0]['idClientServicesFk'];
        }
        if ($id == 0) {
            return 0;
        }


        if (count($item['clients']) > 0) {
            $this->insertServiceUserTotem($item['clients'], $item['idClientServicesTotem'], true);  //se crean los usuarios
        }
        if (count($item['cameras']) > 0) {
            $this->insertServiceCameraTotem($item['cameras'], $item['idClientServicesTotem'], true); //CREAMOS las camaras
        }
        if (count($item['backup_energy']) > 0) {
            $this->insertServiceEnergyTotem($item['backup_energy'], $item['idClientServicesTotem'], true); //CREAMOS las opciones de energia
        }

        if (count($item['adicional']) > 0) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $id ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $id,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function insertServiceUser($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_client_camera', [ 'idClientServicesCameraFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_client_camera', [
                    'idClientFk'               => isset($item['idClientFk']) ? $item['idClientFk'] : null,
                    "idClientServicesCameraFk" => $id,
                    'name'                     => $item['name'],
                    'user'                     => $item['user'],
                    'pass'                     => $item['pass'],
                    'userProfile'              => @$item['userProfile'],
                    'qrBase64'                 => @$item['qrBase64'],
                ]
            );
        }

        return true;
    }

    public function insertServiceUserTotem($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_client_totem', [ 'idClientServicesTotemFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_client_totem', [
                    'idClientFk'              => isset($item['idClientFk']) ? $item['idClientFk'] : null,
                    "idClientServicesTotemFk" => $id,
                    'name'                    => $item['name'],
                    'user'                    => $item['user'],
                    'pass'                    => $item['pass'],
                    'userProfile'             => @$item['userProfile'],
                    'qrBase64'                => @$item['qrBase64'],
                ]
            );
        }

        return true;
    }

    public function insertServiceBatteryAccessControl($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_battery_install_access_control', [ 'idClientServicesAccessControlFk' => $id ]);
        }
        foreach ($product as $battery) {
            $this->db->insert('tb_battery_install_access_control', [
                    "idClientServicesAccessControlFk" => $id,
                    "numberSerieInternal"             => $battery['numberSerieInternal'],
                    "numberSerieFabric"               => $battery['numberSerieFabric'],
                    "dateExpiration"                  => $battery['dateExpiration'],
                    "idBatteryFk"                     => $battery['idBatteryFk'],
                ]
            );
        }

        return true;
    }
    public function insertServiceOpenDevicesAccessControl($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_open_devices_access_control', [ 'idOPClientServicesAccessControlFk' => $id ]);
        }

        foreach ($product as $device) {
            $this->db->insert('tb_open_devices_access_control', [
                    "idOPClientServicesAccessControlFk" => $id,
                    "numberSerieInternal"               => $device['numberSerieInternal'],
                    "numberSerieFabric"                 => $device['numberSerieFabric'],
                    "dateExpiration"                    => $device['dateExpiration'],
                    "idOpenDevice"                      => $device["idOpenDevice"],
                ]
            );
        }

        return true;
    }

    public function insertService($product, $nameDataBase, $nameId) {
        $this->db->insert('tb_client_services', [
                'idClientFk'      => $product['idClientFk'],
                'idTipeServiceFk' => $product['idTipeServiceFk'],
                'nameDataBase'    => $nameDataBase,
                'nameId'          => $nameId,
            ]
        );

        return $this->db->insert_id();
    }

    public function updatedService($idClientServices, $idServicesFk) {
        $this->db->set(
            [
                'idServicesFk' => $idServicesFk,
            ]
        )->where("idClientServices", $idClientServices)->update("tb_client_services");

        return $this->db->insert_id();
    }

    public function insertServiceCamera($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_cameras', [ 'idClientServicesCameraFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_cameras', [
                    "idClientServicesCameraFk" => $id,
                    "portCamera"               => $item['portCamera'],
                    "coveredArea"              => $item['coveredArea'],
                    "locationCamera"           => $item['locationCamera'],
                    "nroSerieCamera"           => $item['nroSerieCamera'],
                    "nroFabricCamera"          => $item['nroFabricCamera'],
                    "dateExpireCamera"         => $item['dateExpireCamera'],
                    "idProductFk"              => $item['idProductFk'],
                ]
            );
        }

        return true;
    }

    public function insertServiceCameraTotem($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_cameras_totem', [ 'idClientServicesCameraTotemFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_cameras_totem', [
                    "idClientServicesCameraTotemFk" => $id,
                    "portCamera"                    => $item['portCamera'],
                    "coveredArea"                   => $item['coveredArea'],
                    "locationCamera"                => $item['locationCamera'],
                    "nroSerieCamera"                => $item['nroSerieCamera'],
                    "nroFabricCamera"               => $item['nroFabricCamera'],
                    "dateExpireCamera"              => $item['dateExpireCamera'],
                    "idProductFk"                   => $item['idProductFk'],
                ]
            );
        }

        return true;
    }

    public function insertServiceEnergy($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_backup_energy', [ 'idClientServicesFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_backup_energy', [
                    "idClientServicesFk" => $id,
                    "description"        => $item['description'],
                    "idBatteryFk"        => $item['idBatteryFk'],
                ]
            );
        }

        return true;
    }

    public function insertServiceEnergyTotem($product, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_backup_energy_totem', [ 'idClientServicesTotemFk' => $id ]);
        }
        foreach ($product as $item) {
            $this->db->insert('tb_backup_energy_totem', [
                    "idClientServicesTotemFk" => $id,
                    "description"             => $item['description'],
                    "idBatteryFk"             => $item['idBatteryFk'],
                ]
            );
        }

        return true;
    }

    public function insertLicence($items, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_user_license', [ 'idClientServicesSmartPanicFk' => $id ]);
        }
        foreach ($items as $item) {
            $this->db->insert('tb_user_license', [
                    "idUserFk"                     => $item['idUserFk'],
                    "fullName"                     => $item['fullName'],
                    "email"                        => $item['email'],
                    "phone"                        => $item['phone'],
                    "keyword"                      => $item['keyword'],
                    "numberUserPassword"           => $item['userNumbPasswd'],
                    "idOS"                         => $item['idOS'],
                    "profileUser"                  => $item['profileUser'],
                    "idDetinationOfLicenseFk"      => $item['idDetinationOfLicenseFk'],
                    "idDepartmentFk"               => $item['idDepartmentFk'],
                    "idParticularAddressFk"        => $item['idParticularAddressFk'],                    
                    "idClientServicesSmartPanicFk" => $id,
                ]
            );
        }


        $id  = $this->db->insert_id();
        $res = null;

        if ($this->db->affected_rows() === 1) {
            $res = 1;
        } else {
            $res = 0;
        }

        return json_encode([ 'id' => $id, 'res' => $res ]);
    }

    public function getServicesPorIdContrato($idContrato) {

        /*se definen todas las tablas de los servicios*/
        $tablas     = [
            "access_control" => "tb_client_services_access_control",
            "internet"       => "tb_client_services_internet",
            "totem"          => "tb_client_services_totem",
            "camera"         => "tb_client_services_camera",
            "alarms"         => "tb_client_services_alarms",
            "smart_panic"    => "tb_client_services_smart_panic",
        ];
        $relaciones = [
            'tb_client_services_access_control' => [
                'idDoorFk'               => [ 'tb_access_control_door', 'idAccessControlDoor' ],
                'idAccessControlFk'      => [ 'tb_products', 'idProduct' ],
                'idContracAssociated_SE' => [ 'tb_contratos', 'idContrato' ],
                'idInputReaderFk'        => [ 'tb_products', 'idProduct' ],
                //'idTypeMaintenanceFk'    => [ 'tb_products', 'idProduct' ],
                'idEmergencyButtonFk'    => [ 'tb_products', 'idProduct' ],
                'idShutdownKeyFk'        => [ 'tb_products', 'idProduct' ],
                'idFontFk'               => [ 'tb_products', 'idProduct' ],
                //'idClientServicesFk'  => [ 'tb_clients', 'idClient' ],
                'ouputReader'            => [ 'tb_products', 'idProduct' ],
                'ouputButom'             => [ 'tb_products', 'idProduct' ],
                'lock'                   => [ 'tb_products', 'idProduct' ],
                'lock2'                   => [ 'tb_products', 'idProduct' ],
                //'idBatteryFk'            => [ 'tb_products', 'idProduct' ],
                //'idOpenDevice'           => [ 'tb_products', 'idProduct' ],
                'idTypeMaintenanceFk'    => [ 'tb_type_maintenance', 'idTypeMaintenance'],
                'fk'                     => [
                    [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                    [ 'tb_battery_install_access_control', 'idClientServicesAccessControlFk' ],
                    [ 'tb_open_devices_access_control', 'idOPClientServicesAccessControlFk' ],
                ],

            ],
            'tb_client_services_internet'       => [
                'idClientServicesFk'     => [ 'tb_clients', 'idClient' ],
                'idTypeInternetFk'       => [ 'tb_tipos_servicios_internet', 'idTipoServicioInternet' ],
                'idServiceFk'            => [ 'tb_type_internet', 'idTypeInternet' ],
                'idServiceAsociateFk'    => [ 'tb_client_services', 'idClientServices' ],
                'idRouterInternetFk'     => [ 'tb_products', 'idProduct' ],
                'idModemInternetFk'      => [ 'tb_products', 'idProduct' ],
                'idContracAssociated_SE' => [ 'tb_contratos', 'idContrato' ],
                'idTypeMaintenanceFk'    => [ 'tb_type_maintenance', 'idTypeMaintenance'],
                'idInternetCompanyFk'    => [ 'tb_internet_company', 'idInternetCompany' ],

                'fk'                     => [
                    [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                ],
            ],
            'tb_client_services_totem'          => [
                'idClientServicesFk'     => [ 'tb_clients', 'idClient' ],
                'idContracAssociated_SE' => [ 'tb_contratos', 'idContrato' ],
                'idCompanyFk'            => [ 'tb_monitor_company', 'idMonitorCompany' ],
                'idTotenModelFk'         => [ 'tb_totem_model', 'idTotenModel' ],
                'idDvr_nvrFk'            => [ 'tb_products', 'idProduct' ],
                'idTypeMaintenanceFk'    => [ 'tb_type_maintenance', 'idTypeMaintenance'],
                'fk'                     => [
                    [ 'tb_cameras_totem', 'idClientServicesCameraTotemFk' ],
                    [ 'tb_client_totem', 'idClientServicesTotemFk' ],
                    [ 'tb_backup_energy_totem', 'idClientServicesTotemFk' ],
                    [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                ],
            ],
            'tb_client_services_camera'         => [
                'idContracAssociated_SE' => [ 'tb_contratos', 'idContrato' ],
                'idTypeMaintenanceFk'    => [ 'tb_type_maintenance', 'idTypeMaintenance' ],
                'idDvr_nvrFk'            => [ 'tb_products', 'idProduct' ],
                'fk'                     => [
                    [ 'tb_cameras', 'idClientServicesCameraFk' ],
                    [ 'tb_client_camera', 'idClientServicesCameraFk' ],
                    [ 'tb_backup_energy', 'idClientServicesFk' ],
                    [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                ],
            ],
            'tb_client_services_alarms'         => [
                'idContracAssociated_SE' => [ 'tb_contratos', 'idContrato' ],
                'companyMonitor'         => [ 'tb_monitor_company', 'idMonitorCompany' ],
                'idTypeMaintenanceFk'    => [ 'tb_type_maintenance', 'idTypeMaintenance' ],
                'panelAlarm'             => [ 'tb_products', 'idProduct' ],
                'keyboardAlarm'          => [ 'tb_products', 'idProduct' ],
                'fk'                     => [
                    [
                        [ 'tb_sensors_alarm', 'fkidClientServicesAlarms' ],
                        [ 'tb_tipo_conexion_remoto', 'fk_idDatoAdicionalAlarma' ],
                        [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                        [ 'tb_alarm_batery', 'fkidClientServicesAlarms' ],
                        [ 'tb_datos_adicionales_alarmas', 'fkidClientServicesAlarms' ],
                        'fk' => [
                            [ 'tb_franja_horaria_alarmas', 'fk_idDatoAdicionalAlarma' ],
                            [ 'tb_personas_para_dar_aviso_alarmas', 'fk_idDatoAdicionalAlarma' ],
                            [ 'tb_personas_para_verificar_en_lugar', 'fk_idDatoAdicionalAlarma' ],

                        ],

                    ],

                ],

            ],
            'tb_client_services_smart_panic'    => [
                'idClientServicesFk'      => [ 'tb_clients', 'idClient' ],
                'idContracAssociated_SE'  => [ 'tb_contratos', 'idContrato' ],
                'idTypeMaintenanceFk'     => [ 'tb_type_maintenance', 'idTypeMaintenance' ],
                'idCompanyMonitorFK'      => [ 'tb_monitor_company', 'idMonitorCompany' ],
                'idApplicationFk'         => [ 'tb_app_monitor_application', 'idApplication' ],
                'fk'                      => [
                    [ 'tb_user_license', 'idClientServicesSmartPanicFk' ],                  
                    [ 'tb_detalles_control_acceso', 'idServicesFk' ],
                ],
            ],

        ];

        $servicios = null;
        $array_axu = [];
        $serviceAsociate_arr = [];
        /*se recorre el arreglo de las tablas*/
        foreach ($tablas as $key => $tabla) {
            //return [$key,$tabla];

            $servicios = $this->db->select(" * ")
                ->from($tabla)
                ->join('tb_client_services', 'tb_client_services.idClientServices = '.$tabla.'.idClientServicesFk', 'LEFT')
                ->join('tb_client_type_services', 'tb_client_type_services.idClientTypeServices = tb_client_services.idTipeServiceFk', 'LEFT')
                ->join('tb_client_service_reason_down', 'tb_client_service_reason_down.idReason = '.$tabla.'.idReasonTypeKf', 'left');

            if ($tabla == 'tb_client_services_access_control') {
                $servicios = $this->db->join('tb_access_control_door', 'tb_access_control_door.idAccessControlDoor = tb_client_services_access_control.idDoorFk', 'LEFT');
            }
            if ($tabla == 'tb_client_services_internet') {
                $servicios = $this->db->join('tb_tipos_servicios_internet', 'tb_tipos_servicios_internet.idTipoServicioInternet = tb_client_services_internet.idTypeInternetFk', 'LEFT');
            }
            if ($tabla == 'tb_client_services_alarms') {
                $servicios = $this->db->join('tb_datos_adicionales_alarmas', 'tb_datos_adicionales_alarmas.fkidClientServicesAlarms = tb_client_services_alarms.idClientServicesAlarms', 'LEFT');
                //$servicios = $this->db->join('tb_tipo_conexion_remoto', 'tb_tipo_conexion_remoto.idTipoConexionRemoto = tb_client_services_alarms.idTypeConectionRemote', 'LEFT');
            }
            $servicios = $this->db->where('idContracAssociated_SE', $idContrato);
            $servicios = $this->db->get();

            if ($servicios->num_rows() > 0) {
                 //print_r($servicios->result_array());
                foreach ($servicios->result_array() as $key => $item) {
                    foreach ($relaciones as $tabla1 => $data) {                        
                        foreach ($data as $id => $item3) {
                            // if ($tabla1=="tb_client_services_access_control") {
                            //     return $item3;
                            // }

                            if ($tabla == $tabla1) {
                                if ($tabla == "tb_client_services_camera" && $id == 'fk') {
                                    foreach ($data[$id] as $idFk => $item3Fk) {
                                        $dataG = $this->db->select(" * ")
                                            ->from($item3Fk[0])
                                            ->where($item3Fk[1], $item['idClientServicesCamera'])
                                            ->get();
                                        $aux   = [];
                                        if ($dataG->num_rows() >= 0) {
                                            foreach ($dataG->result_array() as $ite2) {
                                                array_push($aux, $ite2);
                                            }
                                            if ($item3Fk[0] == 'tb_detalles_control_acceso') {
                                                $dataG2 = $this->db->select(" * ")
                                                    ->from($item3Fk[0])
                                                    ->where($item3Fk[1], $item['idClientServices'])
                                                    ->get();
                                                $aux    = [];
                                                foreach ($dataG2->result_array() as $ite22) {
                                                    array_push($aux, $ite22);
                                                }
                                                $item['adicional'] = $aux;
                                            } else {
                                                $item[$item3Fk[0].'_array'] = $aux;
                                            }
                                        }
                                    }

                                } else {
                                    if ($tabla == "tb_client_services_totem" && $id == 'fk') {
                                        foreach ($data[$id] as $idFk => $item3Fk) {
                                            $dataG = $this->db->select(" * ")
                                                ->from($item3Fk[0])
                                                ->where($item3Fk[1], $item['idClientServicesTotem'])
                                                ->get();
                                            $aux   = [];
                                            if ($dataG->num_rows() >= 0) {
                                                foreach ($dataG->result_array() as $ite2) {
                                                    array_push($aux, $ite2);
                                                }
                                                if ($item3Fk[0] == 'tb_detalles_control_acceso') {
                                                    $dataG2 = $this->db->select(" * ")
                                                        ->from($item3Fk[0])
                                                        ->where($item3Fk[1], $item['idClientServices'])
                                                        ->get();
                                                    $aux    = [];
                                                    foreach ($dataG2->result_array() as $ite22) {
                                                        array_push($aux, $ite22);
                                                    }
                                                    $item['adicional'] = $aux;
                                                } else {
                                                    $item[$item3Fk[0].'_array'] = $aux;
                                                }
                                            }
                                        }

                                    } elseif ($tabla == "tb_client_services_smart_panic" && $id == 'fk') {
                                        $rsSQL = null;
                                        //return 'a';
                                        //return $servicios->result_array();                                       
                                        foreach ($data[$id] as $idFk => $item3Fk) {
                                            if ($item3Fk[0]=='tb_user_license'){
                                                //echo $item3Fk[0]." - ".$item3Fk[1]."\n";
                                                $dataG = $this->db->select(" idClientServicesSmartPanicFk, idClientTypeFk, idDetinationOfLicenseFk, detinationOfLicense, idDepartmentFk, tb_client_departament.idClientDepartament AS idDepto, CONCAT(floor,'-',departament) AS Depto, idClient AS idBuilding, address AS Building, idParticularAddressFk, idUserFk, fullName, nameProfile, email, phone, keyword, idOS, numberUserPassword, profileUser, tb_sistemas_operativos.descripcion as osName")
                                                ->from($item3Fk[0]) 
                                                ->join('tb_detination_of_license', 'tb_detination_of_license.idDetinationOfLicense = '.$item3Fk[0].'.idDetinationOfLicenseFk', 'LEFT')
                                                ->join('tb_sistemas_operativos', 'tb_sistemas_operativos.idSistemaOperativo = '.$item3Fk[0].'.idOS', 'LEFT')
                                                ->join('tb_user', 'tb_user.idUser = '.$item3Fk[0].'.idUserFk', 'LEFT')
                                                ->join('tb_profile', 'tb_profile.idProfile = tb_user.idProfileKf', 'LEFT')
                                                ->join('tb_client_departament', 'tb_client_departament.idClientDepartament = '.$item3Fk[0].'.idDepartmentFk', 'LEFT')
                                                ->join('tb_clients', 'tb_clients.idClient = tb_client_departament.idClientFk', 'LEFT')
                                                ->where($item3Fk[0].'.'.$item3Fk[1], $item['idClientServicesSmartPanic'])
                                                ->get();
                                            }else{
                                                $dataG = $this->db->select(" * ")
                                                    ->from($item3Fk[0])                                                
                                                    ->where($item3Fk[1], $item['idClientServicesSmartPanic'])
                                                    ->get();
                                                //return $this->db->last_query();
                                                //return $dataG->result_array();
                                            }
                                            $aux   = [];
                                            if ($dataG->num_rows() >= 0) {
                                                foreach ($dataG->result_array() as $ite2) {
                                                    array_push($aux, $ite2);
                                                }
                                                if ($item3Fk[0] == 'tb_detalles_control_acceso') {
                                                    $dataG2 = $this->db->select(" * ")
                                                        ->from($item3Fk[0])
                                                        ->where($item3Fk[1], $item['idClientServices'])
                                                        ->get();
                                                    $aux    = [];
                                                    foreach ($dataG2->result_array() as $ite22) {
                                                        array_push($aux, $ite22);
                                                    }
                                                    $item['adicional'] = $aux;
                                                } else {
                                                    $item[$item3Fk[0].'_array'] = $aux;
                                                }
                                            }
                                        }

                                    } else {                                        
                                        if ($tabla == "tb_client_services_alarms" && $id == 'fk') {
                                            foreach ($data[$id] as $idFk => $item3Fk) {

                                                foreach ($item3Fk as $idFk2 => $item3Fk2) {
                                                    //print_r($item3Fk[1]);
                                                    if ($idFk2 === "fk") {
                                                        foreach ($item3Fk[$idFk2] as $idFk3 => $item3Fk3) {
                                                            //echo $item3Fk3[0]."  =>  ".$item3Fk3[1]." :: ";
                                                            $dataG = $this->db->select(" * ")
                                                                ->from($item3Fk3[0])
                                                                ->where($item3Fk3[1], $item['idDatoAdicionalAlarma'])
                                                                ->get();
                                                            $aux   = [];
                                                            if ($dataG->num_rows() > 0) {
                                                                //return $dataG->result_array();
                                                                foreach ($dataG->result_array() as $ite2) {
                                                                    array_push($aux, $ite2);
                                                                }
                                                                $item['tb_datos_adicionales_alarmas_array'][0][$item3Fk3[0].'_array'] = $aux;                                                                
                                                            }
                                                        }
                                                    } else {
                                                        if ($item3Fk2[0] == 'tb_datos_adicionales_alarmas') {
                                                            //return $item3Fk2;
                                                            $dataG1 = $this->db->select(" * ")
                                                                ->from($item3Fk2[0])
                                                                ->where($item3Fk2[1], $item['idClientServicesAlarms'])
                                                                ->get();
                                                            $aux    = [];
                                                            foreach ($dataG1->result_array() as $ite1) {
                                                                array_push($aux, $ite1);
                                                            }
                                                            $item['tb_datos_adicionales_alarmas_array']= $aux;
                                                        } elseif ($item3Fk2[0] == 'tb_detalles_control_acceso') {
                                                            $dataG2 = $this->db->select(" * ")
                                                                ->from($item3Fk2[0])
                                                                ->where($item3Fk2[1], $item['idClientServices'])
                                                                ->get();
                                                            //return $dataG2->result_array();
                                                            $aux = [];
                                                            foreach ($dataG2->result_array() as $ite2) {
                                                                array_push($aux, $ite2);
                                                            }
                                                            $item['adicional'] = $aux;
                                                        } elseif ($item3Fk2[0] == 'tb_tipo_conexion_remoto'){
                                                            //echo $item3Fk2[0]."  =>  ".$item3Fk2[1];
                                                            $result = $this->db->select("*")
                                                                ->from('tb_tipo_conexion_remoto')
                                                                //->where('idTipoConexionRemoto', $item['idTypeConectionRemote'])
                                                                ->get();
                                                            $aux = [];
                                                            if ($result->num_rows() > 0) {
                                                                //echo $item3Fk2[1]." - ";
                                                                foreach ($result->result_array() as $rs) {
                                                                    //print_r($rs);
                                                                    //echo $rs[0]['tabla'];
                                                                    $dataG3 = $this->db->select(" * ")
                                                                        ->from($rs['tabla'])
                                                                        ->where($item3Fk2[1], $item['idClientServicesAlarms'])
                                                                        ->get();
                                                                    if ($dataG3->num_rows() > 0) {
                                                                        foreach ($dataG3->result_array() as $ite3) {
                                                                            $ite3['descripcion']=$rs['descripcion'];
                                                                            array_push($aux, $ite3);
                                                                        }
                                                                    $item[$item3Fk2[0].'_array'] = $aux;
                                                                    }
                                                                }    
                                                            }
                                                        } else {
                                                            $dataG4 = $this->db->select(" * ")
                                                                ->from($item3Fk2[0])
                                                                ->where($item3Fk2[1], $item['idClientServicesAlarms'])
                                                                ->get();

                                                            $aux = [];
                                                            if ($dataG4->num_rows() > 0) {
                                                                foreach ($dataG4->result_array() as $ite4) {
                                                                    array_push($aux, $ite4);
                                                                }
                                                                $item[$item3Fk2[0].'_array'] = $aux;
                                                            }
                                                        }

                                                    }
                                                }

                                            }

                                        } else {
                                            if ($tabla == "tb_client_services_internet" && $id == 'fk') {
                                                //echo $tabla."\n";
                                                //echo $id."\n";
                                                foreach ($data[$id] as $idFk => $item3Fk) {
                                                    //echo $idFk."\n";
                                                    $dataG = $this->db->select(" * ")
                                                        ->from($item3Fk[0])
                                                        ->where($item3Fk[1], $item['idClientServicesInternet'])
                                                        ->get();
                                                    $aux   = [];

                                                    if ($dataG->num_rows() >= 0) {
                                                        foreach ($dataG->result_array() as $ite2) {
                                                            array_push($aux, $ite2);
                                                        }
                                                        if ($item3Fk[0] == 'tb_detalles_control_acceso') {
                                                            $dataG2 = $this->db->select(" * ")
                                                                ->from($item3Fk[0])
                                                                ->where($item3Fk[1], $item['idClientServices'])
                                                                ->get();
                                                            $aux    = [];
                                                            foreach ($dataG2->result_array() as $ite22) {
                                                                array_push($aux, $ite22);
                                                            }
                                                            $item['adicional'] = $aux;
                                                        } else {
                                                            $item[$item3Fk[0].'_array'] = $aux;
                                                        }
                                                    }
                                                }

                                            } else {
                                                if ($tabla == "tb_client_services_access_control" && $id == 'fk') {
                                                    //return $item['idClientServicesAccessControl'];
                                                    //return $item3[0];
                                                    foreach ($data[$id] as $idFk => $item3Fk) {
                                                        //return $item['idClientServices'];

                                                        $dataG = $this->db->select(" * ")
                                                            ->from($item3Fk[0])
                                                            ->where($item3Fk[1], $item['idClientServicesAccessControl'])
                                                            ->get();
                                                        $aux   = [];
                                                        //return $dataG->num_rows();
                                                        if ($item3Fk[0] == 'tb_detalles_control_acceso') {
                                                            $dataG2 = $this->db->select(" * ")
                                                                ->from($item3Fk[0])
                                                                ->where($item3Fk[1], $item['idClientServices'])
                                                                ->get();
                                                            //return $dataG2->result_array();
                                                            $aux = [];
                                                            foreach ($dataG2->result_array() as $ite212) {
                                                                array_push($aux, $ite212);
                                                            }
                                                            $item['adicional'] = $aux;
                                                        } else {
                                                            if ($dataG->num_rows() > 0) {
                                                                $aux = [];
                                                                foreach ($dataG->result_array() as $ite2) {
                                                                    array_push($aux, $ite2);
                                                                }

                                                                $item[$item3Fk[0].'_array'] = $aux;

                                                            }
                                                        }


                                                    }

                                                } else {
                                                    //echo $data[$id][0]."\n";
                                                    //return $item[$id];['idServiceAsociateFk']
                                                    if ($data[$id][0]=='tb_client_services'){
                                                        $servicesAssociated=[];
                                                        $serviceAsociate_arr=[];
                                                        //echo "exist";
                                                        //$data['idServiceAsociateFk']
                                                        $servicesAssociated=json_decode($item['idServiceAsociateFk']);
                                                        //print_r($servicesAssociated);
                                                        //echo $item3[0]."\n";
                                                        //echo $item3[1]."\n";
                                                        //echo $data['idServiceAsociateFk'][0]."\n";
                                                        $i=0;
                                                        if (is_array($servicesAssociated) || $servicesAssociated instanceof Countable) {
                                                            if (count($servicesAssociated)>0){
                                                                foreach ($servicesAssociated as $idServiceAssociated) {
                                                                    $dataG = $this->db->select(" * ")
                                                                        ->from($data['idServiceAsociateFk'][0])
                                                                        ->where($data['idServiceAsociateFk'][1], $idServiceAssociated)
                                                                        ->get();
                                                                    //return $dataG->result_array();
                                                                        //var_dump($dataG->result_array());
                                                                    $aux = null;
                                                                    if ($dataG->num_rows() > 0) {
                                                                        foreach ($dataG->result_array() as $ite2) {
                                                                            //print_r($ite2);
                                                                            $aux=$ite2;
                                                                        }
                                                                    }
                                                                    //$item[$id.'_array_'.$i]=$serviceAsociate_arr;
                                                                    array_push($serviceAsociate_arr,$aux);
                                                                    $i++;
                                                                }
                                                            //print_r($serviceAsociate_arr);
                                                            }else{
                                                                $serviceAsociate_arr=[];
                                                            }
                                                        } else {
                                                            $serviceAsociate_arr=[];
                                                        }
                                                        $item[$id.'_array']=$serviceAsociate_arr;
                                                    }else{
                                                        $dataG = $this->db->select(" * ")
                                                            ->from($item3[0])
                                                            ->where($item3[1], $item[$id])
                                                            ->get();
                                                        //return $dataG->result_array();
                                                        $aux = [];
                                                        if ($dataG->num_rows() > 0) {
                                                            foreach ($dataG->result_array() as $ite2) {
                                                                //print_r($ite2);
                                                                array_push($aux, $ite2);
                                                            }
                                                            $item[$id.'_array'] = $aux;
                                                            //print_r($item[$id.'_arrayaaaaaaaaaaaaaaaaaa']);
                                                        }
                                                    }
                                                }

                                            }

                                        }

                                    }
                                }
                            }
                        }
                    }
                    array_push($array_axu, $item);
                }
            }
        }

        return $array_axu;

    }

    public function getServicesPorIdCliente($idClientFk) {

        /*se definen todas las tablas de los servicios*/
        $tablas    = [
            "access_control" => "tb_client_services_access_control",
            "internet"       => "tb_client_services_internet",
            "totem"          => "tb_client_services_totem",
            "camera"         => "tb_client_services_camera",
            "alarms"         => "tb_client_services_alarms",
            "smart_panic"    => "tb_client_services_smart_panic",
        ];
        $pivotes   = null;
        $array_axu = [];
        /*se recorre el arreglo de las tablas*/

        $pivotes = $this->db->select(" * ")
            ->from('tb_client_services')
            ->where('idClientFk', $idClientFk)
            ->join('tb_client_type_services', 'tb_client_type_services.idClientTypeServices = tb_client_services.idTipeServiceFk', 'LEFT')
            ->get();

        $r = null;
        if ($pivotes->num_rows() > 0) {
            $r = $pivotes->result_array();
            foreach ($r as $key => $pivote) {
                //buscando el servicio
                if (! is_null($pivote['nameDataBase']) && ! is_null($pivote['nameId']) && ! is_null($pivote['idServicesFk'])) {
                    //return $pivote;
                    $servicios = $this->db->select(" * ")
                        ->from($pivote['nameDataBase'])
                        ->where($pivote['nameId'], $pivote['idServicesFk']);


                    if ($pivote['nameDataBase'] == 'tb_client_services_access_control') {
                        $servicios = $this->db->join('tb_access_control_door', 'tb_access_control_door.idAccessControlDoor = tb_client_services_access_control.idDoorFk', 'LEFT');
                    }

                    if ($pivote['nameDataBase'] == 'tb_client_services_internet') {
                        $servicios = $this->db->join('tb_tipos_servicios_internet', 'tb_tipos_servicios_internet.idTipoServicioInternet = tb_client_services_internet.idTypeInternetFk', 'LEFT');
                    }
                    $servicios = $this->db->get();

                    // $clientes = $this->db->select(" * ")
                    //     ->from('tb_clients')
                    //     ->where('idClient', $pivote['idClientFk'])
                    //     ->get();
                    // return $servicios;

                    if ($servicios->num_rows() > 0) {
                        $r[$key]['service'] = $servicios->result_array();
                    }
                    // if ($clientes->num_rows() > 0) {
                    //     $r[$key]['client'] = $clientes->result_array();
                    // }
                }

            }
        }

        return $r;

    }


    /*
    public function update($product) {

        $this->db->set(
                array(
                    'descriptionProduct' => $product['descriptionProduct'] ,
                    'codigoFabric' => $product['codigoFabric'] ,
                    'brand' => $product['brand'] ,
                    'model' => $product['model'] ,
                    'idProductClassificationFk' => $product['idProductClassificationFk'],
                    'isNumberSerieFabric' => $product['isNumberSerieFabric'] ,
                    'isNumberSerieInternal' => $product['isNumberSerieInternal'] ,
                    'isDateExpiration' => $product['isDateExpiration'] ,
                    'isControlSchedule' => $product['isControlSchedule'] ,
                    'priceFabric' => $product['priceFabric']
                )
        )->where("idProduct", $product['idProduct'])->update("tb_products");

            if($product['idProductClassificationFk']==3){
                if(count(@$product['list_id_divice']) > 0)
                    {
                        $this->db->delete('tb_products_divice_opening', array('idProductFk' => $product['idProduct']));

                        foreach ($product['list_id_divice'] as $valor) {

                            $this->db->insert('tb_products_divice_opening', array(
                                'idProductFk' => $product['idProduct'],
                                'idDiviceOpeningFk' => $valor['idDiviceOpeningFk'])
                            );
                        }
                        return true;
                    }
            }else{
                return true;
            }

    }

    public function delete($idProduct) {

        $this->db->set(
            array('idStatusFk' =>  -1))->where("idProduct", $idProduct)->update("tb_products");
        return true;


    }

    public function get($id = null, $searchFilter = null) {
        $quuery = null;
        $rs = null;

        if (!is_null($id))
        {

            $this->db->select(" * ")->from("tb_products");
            $this->db->join('tb_products_classification', 'tb_products_classification.idProductClassification = tb_products.idProductClassificationFk', 'inner');
            $quuery = $this->db->where("tb_products.idProduct = ", $id)->get();


            if ($quuery->num_rows() === 1) {
                $rs =  $quuery->row_array();


                $this->db->select(" * ")->from("tb_products_divice_opening");
                $this->db->join('tb_products', 'tb_products.idProduct = tb_products_divice_opening.idProductFk', 'inner');
                $this->db->join('tb_divice_opening', 'tb_divice_opening.idDiviceOpening = tb_products_divice_opening.idDiviceOpeningFk', 'inner');
                $quuery = $this->db->where("tb_products_divice_opening.idProductFk = ", $id)->get();

                $rs2 =  $quuery->result_array();

                $rs['diviceOpening'] =  $rs2;

                return $rs;
            }
            return null;
        }else
        {

            $this->db->select(" * ")->from("tb_products");
            $this->db->join('tb_products_classification', 'tb_products_classification.idProductClassification = tb_products.idProductClassificationFk', 'inner');
            $this->db->where("tb_products.idStatusFk != ", -1);


                /* Busqueda por filtro */
    /*  if (!is_null($searchFilter['searchFilter']))
        {
            $this->db->like('tb_products.descriptionProduct', $searchFilter['searchFilter']);
        }


    $quuery = $this->db->order_by("tb_products.idProduct", "ASC")->get();


    if ($quuery->num_rows() > 0) {

        $rs =  $quuery->result_array();

        $list =  array();

        $i = 0;
        foreach ($quuery->result() as &$row){

            $this->db->select(" * ")->from("tb_products_divice_opening");
            $this->db->join('tb_products', 'tb_products.idProduct = tb_products_divice_opening.idProductFk', 'inner');
            $this->db->join('tb_divice_opening', 'tb_divice_opening.idDiviceOpening = tb_products_divice_opening.idDiviceOpeningFk', 'inner');
            $quuery = $this->db->where("tb_products_divice_opening.idProductFk = ", $row->idProduct)->get();

            $rs2 =  $quuery->result_array();
            $rs[$i]['diviceOpening'] =  $rs2;
            $i++;
        }


       return $rs;
    }
    return null;
    }
    }*/
    /*GET LIST OF TYPE OF SERVICES*/
    public function getTypeOfServices() {

        $query = null;
        $rs    = null;

        $query = $this->db->select(" * ")->from("tb_client_type_services")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    /*GET LIST OF ACCESS CONTROL DOORS */
    public function accessCtrlDoors() {

        $query = null;
        $rs    = null;

        $query = $this->db->select(" * ")->from("tb_access_control_door")->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }

    public function getPorIdContrato($idContrato) {

        $query         = null;
        $controlAcceso = null;
        $camaras       = null;
        $smartPanic    = null;
        $internet      = null;
        $toten         = null;
        $alarmas       = null;

        $query = $this->db->select(" * ")
            ->from("tb_client_services_access_control")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();
        if ($query->num_rows() > 0) {
            $controlAcceso = $query->result_array();
        }

        $query = $this->db->select(" * ")
            ->from("tb_client_services_internet")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();
        if ($query->num_rows() > 0) {
            $internet = $query->result_array();
        }

        $query = $this->db->select(" * ")
            ->from("tb_client_services_totem")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();
        if ($query->num_rows() > 0) {
            $toten = $query->result_array();
        }

        $query = $this->db->select(" * ")
            ->from("tb_client_services_smart_panic")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();
        if ($query->num_rows() > 0) {
            $smartPanic = $query->result_array();
        }

        $query = $this->db->select(" * ")
            ->from("tb_client_services_camera")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();
        if ($query->num_rows() > 0) {
            $camaras = $query->result_array();
        }

        $query = $this->db->select(" * ")
            ->from("tb_client_services_alarms")
            ->where('idContracAssociated_SE', $idContrato)
            ->get();

        if ($query->num_rows() > 0) {
            $alarmas = $query->result_array();
        }

        $todo = [
            'controlAcceso' => $controlAcceso,
            'camaras'       => $camaras,
            'smartPanic'    => $smartPanic,
            'internet'      => $internet,
            'toten'         => $toten,
            'alarmas'       => $alarmas,
        ];

        return $todo;
    }

    public function getAditionalIdCliente($idServicesFk) {
        $query = null;
        $rs    = null;

        $query = $this->db->select(" * ")
            ->from("tb_detalles_control_acceso")
            ->where('idServicesFk', $idServicesFk)
            ->get();
        if ($query->num_rows() > 0) {
            $rs = $query->result_array();
        }

        return $rs;
    }


    public function addalarm($item) {
        $idClientServicesFk = $this->insertService($item, 'tb_client_services_alarms', 'idClientServicesAlarms'); //CREAMOS EL SERVICIO

        $this->db->insert('tb_client_services_alarms', [
                "name"                   => $item['name'],
                "idContracAssociated_SE" => $item['idContracAssociatedFk'],
                "idTypeMaintenanceFk"    => $item['idTypeMaintenanceFk'],
                "dateUp"                 => $item['dateUp'],
                "dateDown"               => $item['dateDown'],
                "companyMonitor"         => $item['companyMonitor'],
                "numberPay"              => $item['numberPay'],
                "installationPassword"   => $item['installationPassword'],
                "panelAlarm"             => $item['panelAlarm'],  //producto
                "keyboardAlarm"          => $item['keyboardAlarm'], //producto
                "countZoneIntaled"       => $item['countZoneIntaled'],
                "idTypeConectionRemote"  => $item['idTypeConectionRemote'], // 1, 2, 3
                "observation"            => $item['observation'],
                'idClientServicesFk'     => $idClientServicesFk,
            ]
        );


        $id = $this->db->insert_id();
        $this->updatedService($idClientServicesFk, $id);

        if (count($item['adicional_alarmar']) > 0) {
            $this->insertDatosAdicionalesAlarmas($item['adicional_alarmar'], $id, null, false);
        }

        if (count($item['adicional']) > 0) {
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $idClientServicesFk,
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }
        if (count($item['sensores_de_alarmas']) > 0) {
            $this->insertSensoresDeAlarmas($item['sensores_de_alarmas'], $id);
        }
        if (count($item['baterias_instaladas']) > 0) {
            $this->insertBateriasInstaladasAlarmas($item['baterias_instaladas'], $id);
        }
        if (count($item['tipo_conexion_remoto']) > 0) {
            $this->insertTipoConexionRemotoAlarmas($item['tipo_conexion_remoto'], $id);
        }


        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editAlarm($item) {
        //$idClientServicesFk = $this->insertService($item, 'tb_client_services_alarms', 'idClientServicesAlarms'); //CREAMOS EL SERVICIO

        $this->db->set(
            [
                "name"                              => $item['name'],
                "idContracAssociated_SE"            => $item['idContracAssociatedFk'],
                "idTypeMaintenanceFk"               => $item['idTypeMaintenanceFk'],
                "dateUp"                            => $item['dateUp'],
                "dateDown"                          => $item['dateDown'],
                "companyMonitor"                    => $item['companyMonitor'],
                "numberPay"                         => $item['numberPay'],
                "installationPassword"              => $item['installationPassword'],
                "panelAlarm"                        => $item['panelAlarm'],     //producto
                "keyboardAlarm"                     => $item['keyboardAlarm'],  //producto
                "countZoneIntaled"                  => $item['countZoneIntaled'],
                "idTypeConectionRemote"             => $item['idTypeConectionRemote'], // 1, 2, 3
                "observation"                       => $item['observation'],
                'terminationReason'                 => @$item['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$item['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$item['reasonType'],
            ]
        )->where("idClientServicesAlarms", $item['idClientServicesAlarms'])->update("tb_client_services_alarms");

        // $data = $this->db->select("idClientServicesFk")
        //     ->from('tb_client_services_alarms')
        //     ->where("idClientServicesAlarms", $item['idClientServicesAlarms'])
        //     ->get();
        //
        // $id = 0;
        // if ($data->num_rows() > 0) {
        //     $id = $data->result_array()[0]['idClientServicesFk'];
        // }
        // if ($id == 0) {
        //     return 0;
        // }

        //return $data;

        // $id = $this->db->insert_id();
        // $this->updatedService($idClientServicesFk, $id);
        if (count($item['adicional_alarmar']) > 0) {
            $this->insertDatosAdicionalesAlarmas($item['adicional_alarmar'], $item['idClientServicesAlarms'], $item['idDatoAdicionalAlarma'], true);
        }

        if (count($item['adicional']) > 0) {
            $this->db->delete('tb_detalles_control_acceso', [ 'idServicesFk' => $item['idClientServicesFk'] ]);
            foreach ($item['adicional'] as $item1) {
                $this->db->insert('tb_detalles_control_acceso', [
                        "numberSerieFabric"   => $item1['numberSerieFabric'],
                        "numberSerieInternal" => $item1['numberSerieInternal'],
                        "dateExpiration"      => $item1['dateExpiration'],
                        "idProductoFk"        => $item1['idProductoFk'],
                        "idServicesFk"        => $item['idClientServicesFk'],
                        "optAux"              => @$item1['optAux'],
                    ]
                );
            }
        }
        if (count($item['sensores_de_alarmas']) > 0) {
            $this->insertSensoresDeAlarmas($item['sensores_de_alarmas'], $item['idClientServicesAlarms'], true);
        }
        if (count($item['tipo_conexion_remoto']) > 0) {
            $this->insertTipoConexionRemotoAlarmas($item['tipo_conexion_remoto'], $item['idClientServicesAlarms'], true);
        }else{
            $this->removeTipoConexionRemotoAlarmas($item['idClientServicesAlarms']);
        }        
        if (count($item['baterias_instaladas']) > 0) {
            $this->insertBateriasInstaladasAlarmas($item['baterias_instaladas'], $item['idClientServicesAlarms'], true);
        }        

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }

    }

    public function insertDatosAdicionalesAlarmas($data, $id, $idDatoAdicionalAlarma, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_datos_adicionales_alarmas', [ 'fkidClientServicesAlarms' => $id ]);
        }

        foreach ($data as $item) {
            $this->db->insert('tb_datos_adicionales_alarmas', [
                    "fk_idTipoCliente"           => $item['fk_idTipoCliente'],
                    "typeOfClient_others"        => $item['typeOfClient_others'],
                    "fk_idEncargado"             => $item['fk_idEncargado'],
                    "nombresEncargadoManual"     => $item['nombresEncargadoManual'],
                    "telefono"                   => $item['telefono'],
                    "calles_laterales"           => $item['calles_laterales'],
                    "calle_trasera"              => $item['calle_trasera'],
                    "fk_idServiciosAdicionales"  => json_encode($item['fk_idServiciosAdicionales']),
                    "mail_reporte"               => $item['mail_reporte'],
                    "fk_idFormatoTransmision"    => $item['fk_idFormatoTransmision'],
                    "fk_idAutomarcado"           => $item['fk_idAutomarcado'],
                    "n_usuario_asalto"           => $item['n_usuario_asalto'],
                    "contrasena_asalto"          => $item['contrasena_asalto'],
                    "comisaria"                  => $item['comisaria'],
                    "tlf_comisaria"              => $item['tlf_comisaria'],
                    "servicio_emergencia_medica" => $item['servicio_emergencia_medica'],
                    "n_de_socio"                 => $item['n_de_socio'],
                    "plan"                       => $item['plan'],
                    "observacion_general"        => $item['observacion_general'],
                    "horario_automarcado"        => $item['horario_automarcado'],
                    "fkidClientServicesAlarms"   => $id,
                ]

            );
            $id1 = $this->db->insert_id();
            // return [$id1,$id];
            if (count($item['franjas_horarias']) > 0) {
                $this->insertFranjasHorariasAlarmas($item['franjas_horarias'], $id1, $idDatoAdicionalAlarma, true);
            }

            if (count($item['personas_para_dar_aviso']) > 0) {
                $this->insertPersonasParaDarAvisoAlarmas($item['personas_para_dar_aviso'], $id1, $idDatoAdicionalAlarma, true);
            }

            if (count($item['personas_para_verificar_en_el_lugar']) > 0) {
                $this->insertPersonasParaVerificarEnElLugarAlarmas($item['personas_para_verificar_en_el_lugar'], $id1, $idDatoAdicionalAlarma, true);
            }
        }

        return true;
    }

    public function insertFranjasHorariasAlarmas($data, $id, $idOriginal, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_franja_horaria_alarmas', [ 'fk_idDatoAdicionalAlarma' => $idOriginal ]);
        }
        foreach ($data as $item) {
            $this->db->insert('tb_franja_horaria_alarmas', [
                    // 'idClientFk'               => isset($item['idClientFk']) ? $item['idClientFk'] : null,
                    // "dia"                      => $item['dia'],
                    // "desde1"                   => $item['desde1'],
                    // "hasta1"                   => $item['hasta1'],
                    // "desde2"                   => $item['desde2'],
                    // "hasta2"                   => $item['hasta2'],
                    // "fk_idDatoAdicionalAlarma" => $id,

                    'day'                      => $item['day'],
                    'fronAm'                   => $item['fronAm'],
                    'toAm'                     => $item['toAm'],
                    'fronPm'                   => $item['fronPm'],
                    'toPm'                     => $item['toPm'],
                    "fk_idDatoAdicionalAlarma" => $id,
                ]
            );
        }

        return true;
    }

    public function insertSensoresDeAlarmas($data, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_sensors_alarm', [ 'fkidClientServicesAlarms' => $id ]);
        }
        foreach ($data as $item) {
            $this->db->insert('tb_sensors_alarm', [
                    "idSensorProduct"          => $item["idSensor"],
                    "numberZoneSensor"         => $item["numberZoneSensor"],
                    "isWirelessSensor"         => $item["isWirelessSensor"],
                    "area"                     => $item["area"],
                    "nroZoneTamper"            => $item["nroZoneTamper"],
                    "locationLon"              => $item["locationLon"],
                    "idDvr"                    => $item["idDvr"],
                    "idCameraFk"               => $item["idCameraFk"],
                    "nroInterno"               => $item["nroInterno"],
                    "nroFrabric"               => $item["nroFrabric"],
                    "fkidClientServicesAlarms" => $id,
                ]
            );
        }

        return true;
    }

    public function insertBateriasInstaladasAlarmas($data, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_alarm_batery', [ 'fkidClientServicesAlarms' => $id ]);
        }
        foreach ($data as $item) {
            $this->db->insert('tb_alarm_batery', [
                    "idProductoFk"             => $item['idProductoFk'],
                    "nroInternal"              => $item['nroInternal'],
                    "nroFabric"                => $item['nroFabric'],
                    "dateExpired"              => $item['dateExpired'],                    
                    "fkidClientServicesAlarms" => $id,
                ]
            );
        }


        return true;
    }

    public function insertTipoConexionRemotoAlarmas($data, $id, $borrar = false) {
        foreach ($data as $item) {
            if ($item['idTipoConexionRemoto'] >= 1 && $item['idTipoConexionRemoto'] <= 3) {
                $result = $this->db->select("*")
                    ->from('tb_tipo_conexion_remoto')
                    ->where('idTipoConexionRemoto', $item['idTipoConexionRemoto'])
                    ->get();

                if ($result->num_rows() > 0) {
                    $rs = $result->result_array();
                    if ($borrar) {
                        $this->db->delete($rs[0]['tabla'], [ 'fk_idDatoAdicionalAlarma' => $id ]);
                    }
                    if ($item['idTipoConexionRemoto'] == 1) {
                        $this->db->insert($rs[0]['tabla'], [
                                "company"                  => $item['data']['company'],
                                "line"                     => $item['data']['line'],
                                //"idClientServicesAlarmsFk" => $item['idClientServicesAlarmsFk'],
                                "fk_idDatoAdicionalAlarma" => $id,

                            ]
                        );
                    }

                    if ($item['idTipoConexionRemoto'] == 2) {
                        $this->db->insert($rs[0]['tabla'], [
                                "moduleIp"                 => $item['data']['moduleIp'],
                                "nroSerieFrabric"          => $item['data']['nroSerieFrabric'],
                                "nroSerieInternal"         => $item['data']['nroSerieInternal'],
                                "ip"                       => $item['data']['ip'],
                                "codeProgrm"               => $item['data']['codeProgram'],
                                "portProgrm"               => $item['data']['portProgram'],
                                "passwordAcces"            => $item['data']['passwordAcces'],
                                "codePart1"                => $item['data']['codePart1'],
                                "codePart2"                => $item['data']['codePart2'],
                                //"idClientServicesAlarmsFk" => $item['idClientServicesAlarmsFk'],
                                "fk_idDatoAdicionalAlarma" => $id,

                            ]
                        );
                    }

                    if ($item['idTipoConexionRemoto'] == 3) {
                        $this->db->insert($rs[0]['tabla'], [
                                //"idClientServicesAlarmsFk" => $item['idClientServicesAlarmsFk'],
                                "moduleGprs"               => $item['data']['moduleGprs'],
                                "nroSerieFrabric"          => $item['data']['nroSerieFrabric'],
                                "nroSerieInternal"         => $item['data']['nroSerieInternal'],
                                "codeProgram"              => $item['data']['codeProgram'],
                                "portProgram"              => $item['data']['portProgram'],
                                "passwordAcces"            => $item['data']['passwordAcces'],
                                "codePart1"                => $item['data']['codePart1'],
                                "codePart2"                => $item['data']['codePart2'],
                                "fk_idDatoAdicionalAlarma" => $id,

                            ]
                        );
                    }
                }
            }


        }

        return true;
    }
    public function removeTipoConexionRemotoAlarmas($id)
    {
        $result = $this->db->select("*")
                ->from('tb_tipo_conexion_remoto')
                ->get();

            if ($result->num_rows() > 0) {
                foreach ($result->result_array() as $item) {
                    $this->db->delete($item['tabla'], [ 'fk_idDatoAdicionalAlarma' => $id ]);
                }
            }
        return true;
    }
    public function insertPersonasParaDarAvisoAlarmas($data, $id, $idOriginal, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_personas_para_dar_aviso_alarmas', [ 'fk_idDatoAdicionalAlarma' => $idOriginal ]);
        }
        foreach ($data as $item) {
            $this->db->insert('tb_personas_para_dar_aviso_alarmas', [
                    "fk_idUserSystema"         => @$item["fk_idUserSystema"],
                    "nombre_apellido"          => @$item["nombre_apellido"],
                    "vinculo"                  => $item["vinculo"],
                    "palabra_clave"            => $item["palabra_clave"],
                    "telefono"                 => $item["telefono"],
                    "numero_del_usuario"       => $item["numero_del_usuario"],
                    "fk_idDatoAdicionalAlarma" => $id,
                ]
            );
        }

        return true;
    }

    public function insertPersonasParaVerificarEnElLugarAlarmas($data, $id, $idOriginal, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_personas_para_verificar_en_lugar', [ 'fk_idDatoAdicionalAlarma' => $idOriginal ]);
        }
        foreach ($data as $item) {
            $this->db->insert('tb_personas_para_verificar_en_lugar', [
                    "fk_idUserSystema"         => @$item["fk_idUserSystema"],
                    "nombre_apellido"          => @$item["nombre_apellido"],
                    "vinculo"                  => $item["vinculo"],
                    "telefono"                 => $item["telefono"],
                    "numero_del_usuario"       => $item["numero_del_usuario"],
                    "fk_idDatoAdicionalAlarma" => $id,
                ]
            );
        }

        return true;
    }

    public function addTechService($item) {
        $this->db->insert('tb_technician_services', [
                'description'       => $item['description'],
                'isProtected'       => $item['isProtected'],
                'idServiceTypeFk'   => $item['idServiceTypeFk'],
                'idServiceModeFk'   => $item['idServiceModeFk'],
                'hasStock'          => $item['hasStock']
            ]
        );
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editTechService($item) {
        $this->db->set(
            [
            'description'       => $item['description'],
            'isProtected'       => $item['isProtected'],
            'idServiceTypeFk'   => $item['idServiceTypeFk'],
            'idServiceModeFk'   => $item['idServiceModeFk'],
            'hasStock'          => $item['hasStock']
            ]
        )->where("idServiceTechnician", $item['idServiceTechnician'])->update("tb_technician_services");

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function deleteTechService($id) {
        $this->db->set([ 'idStatusKf' => -1 ])->where("idServiceTechnician", $id)->update("tb_technician_services");
        return true;
    }

    public function listarTechServices() {
        $rs = null;
        $this->db->select("*")->from("tb_technician_services");
        $this->db->join('tb_technician_services_mode', 'tb_technician_services_mode.idServiceMode = tb_technician_services.idServiceModeFk', 'left');
        $this->db->join('tb_technician_services_type', 'tb_technician_services_type.IdServiceType = tb_technician_services.idServiceTypeFk', 'left');
        $query = $this->db->get();
        $rs = $query->result_array();
         if ($query->num_rows() > 0) {
            return $rs;
        }
        return null;
    }

    public function getMaintenanceTypeByTechServiceId($id) {
        $rs = [];
        $where = null;
        $where = "t1.idTypeMaintenance NOT IN (select tb_technician_service_cost.idTipoMantenimientoKf from tb_technician_service_cost WHERE tb_technician_service_cost.idServiceTechnicianKf = $id)";
        $this->db->select("*")->from("tb_type_maintenance AS t1");
        $this->db->where($where);
        $query = $this->db->order_by('t1.idTypeMaintenance ASC')->get();
        $rs = $query->result_array();
         if ($query->num_rows() > 0) {
            return $rs;
        }

        return null;
    }

    public function checkTechServiceName ($name)
	{
		$quuery = null;
		$rs     = null;

		$this->db->select("*")->from("tb_technician_services");
		$quuery = $this->db->where("tb_technician_services.description", $name)->get();

		if ($quuery->num_rows() > 0) {
			return true;
		}
		return null;

	}
    public function checkTicketsActiveByService ($idService)
	{
		$quuery = null;
		$rs     = null;

		//$this->db->select('COUNT(t2.idTicket) as ticket_count');
        $this->db->select('*');
        $this->db->from('tb_ticket_keychain_doors td');
        $this->db->join('tb_access_control_door acd', 'acd.idAccessControlDoor = td.idAccessControlDoorKf', 'left');
        $this->db->join('tb_contratos tc', 'tc.idContrato = td.idContractKf', 'left');
        $this->db->join('tb_status tst', 'tst.idStatusTenant = tc.idStatusFk', 'left');
        $this->db->join('tb_ticket_keychain tkc', 'tkc.id = td.idTicketKeychainKf', 'left');
        $this->db->join('tb_products tp', 'tp.idProduct = tkc.idProductKf', 'left');
        $this->db->join('tb_products_classification tpc', 'tpc.idProductClassification = tp.idProductClassificationFk', 'left');
        $this->db->join('tb_tickets_2 t2', 't2.idTicket = tkc.idTicketKf', 'left');
        $this->db->join('tb_statusticket st', 'st.idStatus = t2.idStatusTicketKf', 'left');
        $this->db->where('td.idServiceKf', $idService);
        $this->db->where_not_in('t2.idStatusTicketKf', [1,6]);
        $this->db->group_by('t2.idTicket');
        $this->db->order_by('t2.created_at', 'DESC');
		$quuery = $this->db->get();
        //$rs = $quuery->row()->ticket_count;
        $rs = $quuery->result_array();
        
		if ($quuery->num_rows() > 0) {
			return $rs;
		}
		return null;
	}
    public function checkServicesAssociatedByService ($idService)
	{
		$quuery = null;
		$rs     = null;

        $this->db->select('*');
        $this->db->from('tb_client_services_internet csi');
        $this->db->join('tb_contratos c ', 'c.idContrato = csi.idContracAssociated_SE', 'left');
        $this->db->join('tb_tipos_servicios_internet ti', 'ti.idTipoServicioInternet = csi.idTypeInternetFk', 'left');
        $this->db->join('tb_type_internet tyi', 'tyi.idTypeInternet = csi.idServiceFk', 'left');
        $this->db->join('tb_internet_company ic', 'ic.idInternetCompany = csi.idInternetCompanyFk', 'left');
        $this->db->join('tb_products tp1', 'tp1.idProduct = csi.idModemInternetFk', 'left');
        $this->db->join('tb_products tp2', 'tp2.idProduct = csi.idRouterInternetFk', 'left');
        $this->db->where('JSON_CONTAINS(csi.idServiceAsociateFk,  \'\"' . $idService . '\"\')', NULL, FALSE);
        $quuery =  $this->db->where('csi.dateDown', NULL, FALSE)->get();
        $rs = $quuery->result_array();
		if ($quuery->num_rows() > 0) {
            return $rs;
		}
		return null;

	}
    public function checkInternetServicesAssociatedByService ($idService)
	{
		$quuery = null;
		$rs     = null;

        $this->db->select('JSON_LENGTH(csi.idServiceAsociateFk) AS json_length', FALSE);
        $this->db->from('tb_client_services_internet csi');
        $this->db->where('csi.idClientServicesFk', $idService);
        $this->db->where('JSON_LENGTH(csi.idServiceAsociateFk) >=', 1, FALSE);
        $quuery =  $this->db->where('csi.dateDown', NULL, FALSE)->get();
        $rs = $quuery->row_array();
		if ($quuery->num_rows() > 0) {
            return $rs['json_length'];
		}
		return null;

	}
}

?>