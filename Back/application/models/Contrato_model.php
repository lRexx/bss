<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Contrato_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }


    public function add($client) {

        $this->db->insert('tb_contratos', [
                "idClientFk"           => $client['idClientFk'],
                "fechaFirmaVigencia"   => $client['fechaFirmaVigencia'],
                "fechaFirma"           => $client['fechaFirma'],
                "fechaActivacion"      => $client['fechaActivacion'],
                "numeroContrato"       => $client['numeroContrato'],
                "contratoType"         => $client['contratoType'],
                "maintenanceType"      => $client['maintenanceType'],
                "idStatusFk"           => $client['idStatusFk'],
            ]
        );
        $idContratoFk = $this->db->insert_id();
        foreach ($client['services'] as $service) {
            $this->db->insert('tb_servicios_del_contrato_cabecera', [
                    "idServiceType" => $service['idServiceType'],
                    "serviceName"   => $service['serviceName'],
                    "idContratoFk"  => $idContratoFk,
                ]
            );
            $idCabecera = $this->db->insert_id();
            if (count($service['serviceItems']) > 0) {
                foreach ($service['serviceItems'] as $serviceItem) {
                    $this->db->insert('tb_servicios_del_contrato_cuerpo', [
                            "qtty"                     => $serviceItem['qtty'],
                            "idAccCrtlDoor"            => $serviceItem['idAccCrtlDoor'],
                            "itemName"                 => $serviceItem['itemName'],
                            "itemAclaracion"           => $serviceItem['itemAclaracion'],
                            "idServiceTypeFk"          => $serviceItem['idServiceTypeFk'],
                            "idServiciosDelContratoFk" => $idCabecera,
                        ]
                    );
                }

            }

        }

        return true;
    }


    public function update($client) {

        $this->db->set([
                "idClientFk"                        => $client['idClientFk'],
                "fechaFirmaVigencia"                => $client['fechaFirmaVigencia'],
                "fechaFirma"                        => $client['fechaFirma'],
                "fechaActivacion"                   => $client['fechaActivacion'],
                "numeroContrato"                    => $client['numeroContrato'],
                "contratoType"                      => $client['contratoType'],
                "maintenanceType"                   => $client['maintenanceType'],
                "idStatusFk"                        => $client['idStatusFk'],
                'dateDown'                          => $client['dateDown'],
                'terminationReason'                 => @$client['terminationReason'],
                'terminationApprovedByIdUserKf'     => @$client['terminationApprovedByIdUserKf'],
                'idReasonTypeKf'                    => @$client['reasonType'],
            ]
        )->where("idContrato", $client['idContrato'])->update("tb_contratos");

        foreach ($client['services'] as $service) {
            $this->db->set([
                    "idServiceType" => $service['idServiceType'],
                    "serviceName"   => $service['serviceName'],
                ]
            )->where("idServiciosDelContrato", $service['idServiciosDelContrato'])->update("tb_servicios_del_contrato_cabecera");
            $id=0;
            $id=$service['idServiciosDelContrato'];
            $this->db->delete('tb_servicios_del_contrato_cuerpo', [ 'idServiciosDelContratoFk' =>  $id ]);
            if (count($service['serviceItems']) > 0) {                
                foreach ($service['serviceItems'] as $serviceItem) {
                    $this->db->insert('tb_servicios_del_contrato_cuerpo', [
                        "qtty"                     => $serviceItem['qtty'],
                        "idAccCrtlDoor"            => $serviceItem['idAccCrtlDoor'],
                        "itemName"                 => $serviceItem['itemName'],
                        "itemAclaracion"           => $serviceItem['itemAclaracion'],
                        "idServiceTypeFk"          => $serviceItem['idServiceTypeFk'],
                        "idServiciosDelContratoFk" => $id,
                        ]
                    );
                }
            }
        }

        return true;

    }


    public function get() {
        $contratos  = $this->db->select("*")->from("tb_contratos")->get();
        $contratos1 = null;
        if ($contratos->num_rows() > 0) {
            $contratos1 = $contratos->result_array();
            foreach ($contratos->result_array() as $key => $contrato) {
                $cabecera = $this->db->select("*")
                    ->from("tb_servicios_del_contrato_cabecera")
                    ->where('idContratoFk', $contrato['idContrato'])->get();
                if ($cabecera->num_rows() > 0) {
                    //return $contratos;
                    $contratos1[$key]['services'] = $cabecera->result_array();

                    //return $contratos1;
                    foreach ($cabecera->result_array() as $key2 => $cabecera1) {

                        $cuerpo = $this->db->select("*")
                            ->from("tb_servicios_del_contrato_cuerpo")
                            ->where('idServiciosDelContratoFk', $cabecera1['idServiciosDelContrato'])->get();
                        if ($cuerpo->num_rows() > 0) {
                            $contratos1[$key]['services'][$key2]['serviceItems'] = $cuerpo->result_array();
                        }

                    }


                }
            }
        }

        return $contratos1;

    }

 
    public function getDisponibilidadPorContrato($idContrato, $idServicesType) {

        $rsContract  = $this->db->select("*")
            ->from("tb_contratos")
            ->join('tb_systemunderlock', 'tb_systemunderlock.idContratoFk = tb_contratos.idContrato', 'left')
            ->where('idContrato', $idContrato)
            ->get();
        $c=0;
        $contract = null;
        //print_r($contract_item['idContrato']);
        if ($rsContract->num_rows() > 0) {
            foreach ($rsContract->result_array() as $item => $contract_item) {
                $s=0;
                //print "Contract: ".$item."\n";
                $contract[$c] = $contract_item;
                $rsContractHeader = $this->db->select("*")
                    ->from("tb_servicios_del_contrato_cabecera")
                    ->where('idContratoFk', $idContrato)
                    ->where('idServiceType', $idServicesType)
                    ->get();
                if ($rsContractHeader->num_rows() > 0) {                    
                    $contract[$c]['services'] = $rsContractHeader->result_array();
                    //print_r($contract[$c]['services']);
                    foreach ($rsContractHeader->result_array() as $service => $header_item) {
                        //print "Service: ".$service."\n";
                        $rsContractBody = $this->db->select("*")
                            ->from("tb_servicios_del_contrato_cuerpo")
                            ->where('idServiciosDelContratoFk', $header_item['idServiciosDelContrato'])
                            ->get();
                        if ($rsContractBody->num_rows() > 0){
                            $si=0;
                            $qtty_door_used = 0;
                            $doors_controlaccess_contract = 0;
                            $total_doors_availables = 0;
                            $total_doors_used = 0;
                            $qtty_totem_contract = 0;
                            $qtty_cameras_contract = 0;
                            $qtty_totem_used = 0;        
                            $qtty_cameras_used = 0;
                            $items_contracted = 0;
                            $item_used = 0;
                            $item_available = 0;
                            $item_remains = 0;
                            $isUsed = 0;
                            $isNotUsed = 0;
                            $total_cameras_availables=0;
                            $total_cameras_used = 0;
                            $itemc = 0;
                            foreach ($rsContractBody->result_array() as $srv_item => $service_items) {
                                switch ($header_item['idServiceType']){
                                    case "1":
                                        $doors_controlaccess_contract += $service_items['qtty']!=null&&$service_items['qtty']!=''?$service_items['qtty']:1;
                                        $contract[$c]['services'][$s]['items_contracted']=$doors_controlaccess_contract;                                    
                                        
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAccessDoors = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_access_control AS ACS')
                                        ->where('ACS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->where('ACS.idDoorFk', $service_items['idAccCrtlDoor'])
                                        ->group_by('ACS.idDoorFk')
                                        ->get();
                                        if ($rsAccessDoors->num_rows() == 1){
                                            //print "contrato: ".$contract_item['idContrato']."\n";
                                            //print "Door Type: ".$service_items['idAccCrtlDoor']."\n";
                                            //print "Encontrado: ".$rsAccessDoors->num_rows()."\n";                                            
                                            /*foreach ($rsAccessDoors->result_array() as $door_item => $door_items) {
                                                //print 'door_'.$service_items['itemName'].'_used: '.$door_items['QTTY']."\n";
                                                //VALIDATE IF THERE IS A DOOR OF EACH TYPE USED IN A SERVICE OF CONTROL ACCESS
                                                $item_used=$door_items['USED_QTTY'];
                                                if($service_items['qtty']==null && $door_items['USED_QTTY']==1){                                                    
                                                    $item_available = 0;
                                                    $isUsed++;
                                                    if($service_items['qtty'] == $door_items['USED_QTTY']){
                                                        $isUsed++;
                                                    }
                                                }else{
                                                    $item_available=$service_items['qtty'] - $door_items['USED_QTTY'];
                                                    if($service_items['qtty'] == $door_items['USED_QTTY']){
                                                        $isUsed++;   
                                                    }else{
                                                        $isNotUsed++;
                                                    }
                                                }
                                            }*/
                                            foreach ($rsAccessDoors->result_array() as $door_item => $door_items) {
                                                //VALIDATIONS
                                                if($door_items['USED_QTTY']>0){
                                                    if ($door_items['USED_QTTY']<$service_items['qtty']){
                                                        $qtty_door_used=$door_items['USED_QTTY'];
                                                        $item_used=$qtty_door_used;
                                                        $item_available=$service_items['qtty'] - $door_items['USED_QTTY'];
                                                        $isNotUsed++;
                                                    }else if ($door_items['USED_QTTY']==$service_items['qtty']){
                                                        $qtty_door_used=$service_items['qtty'];
                                                        $item_used=$service_items['qtty'];
                                                        $item_available=0;
                                                        $isUsed++;
                                                    }
                                                }else{
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty']!=null&&$service_items['qtty']!=''?(int)$service_items['qtty']:1;
                                                    $qtty_door_used=0;
                                                    $isNotUsed++;
                                                }
                                            }                                            
                                        }else{
                                            $item_used="0";
                                            $item_available=$service_items['qtty']!=null&&$service_items['qtty']!=''?(int)$service_items['qtty']:1;
                                            $qtty_door_used=0;
                                            $isNotUsed++;
                                        }
                                        $total_doors_availables=$doors_controlaccess_contract;
                                        //print "qtty_door_used: ".$qtty_door_used."\n";
                                        $total_doors_used+=$qtty_door_used;
                                        $contract[$c]['services'][$s]["items_available"]=$total_doors_availables-$total_doors_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;                                      
                                    break;
                                    case "2":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsInterServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_internet as INTS')
                                        ->where('INTS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->where('INTS.idTypeInternetFk', $service_items['idAccCrtlDoor'])
                                        ->group_by('INTS.idTypeInternetFk')
                                        ->get();

                                        if ($rsInterServices->num_rows() == 1){                                       
                                            foreach ($rsInterServices->result_array() as $internet_item => $internet_items) {
                                                if( $internet_items['USED_QTTY']==1){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                    break;
                                    case "3":
                                        $qtty_totem_contract += $service_items['qtty'];
                                        $contract[$c]['services'][$s]['items_contracted']=$qtty_totem_contract;
                                        $sqlServiceSelect =   array(
                                                        'COUNT(TBCT.idCameraTotem) AS USED_QTTY'
                                                    );
                                        $rsCameraTotem = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_totem AS TS')
                                        ->join('tb_cameras_totem AS TBCT', 'TBCT.idClientServicesCameraTotemFk = TS.idClientServicesTotem', 'left')
                                        ->where('TS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();
                                        if ($rsCameraTotem->num_rows() == 1){
                                            foreach ($rsCameraTotem->result_array() as $totem_item => $totem_items) {
                                                //VALIDATION
                                                if($totem_items['USED_QTTY']>0){
                                                    if ($totem_items['USED_QTTY']<$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO";
                                                        if ($qtty_totem_used<$totem_items['USED_QTTY']){
                                                            $qtty_totem_used=$totem_items['USED_QTTY'];
                                                            $item_used=$qtty_totem_used;
                                                            $item_available=$service_items['qtty'] - $totem_items['USED_QTTY'];
                                                            $isNotUsed++;
                                                        }
                                                    }else if ($totem_items['USED_QTTY']>$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO-1\n";
                                                        if ($qtty_totem_used<$totem_items['USED_QTTY']){
                                                            //echo "ENTRO-2\n";
                                                            //echo "USED_QTTY: "; print_r($totem_items['USED_QTTY']);
                                                            //echo "\n";
                                                            $item_remains=$totem_items['USED_QTTY'] - $service_items['qtty'];
                                                            $qtty_totem_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                            //echo "item_remains: $item_remains\n";
                                                        }
                                                    }else if ($totem_items['USED_QTTY']==$service_items['qtty'] && $itemc == 0){
                                                            $qtty_totem_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                    }else if ($totem_items['USED_QTTY']>$service_items['qtty'] && $itemc >= 1){
                                                        //echo "ENTRO-1-1\n";
                                                        //echo "item_remains: $item_remains\n";
                                                            if ($item_remains > 0 && $item_remains < $service_items['qtty']){
                                                                //echo "ENTRO-1-1-1\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=$service_items['qtty'] - $item_remains;
                                                                $item_used=$item_remains;
                                                                $qtty_totem_used=$item_remains;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }else if ($item_remains > 0 && $item_remains > $service_items['qtty']){
                                                                //echo "ENTRO-1-1-2\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_totem_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains > 0 && $item_remains == $service_items['qtty']){
                                                                //echo "ENTRO-1-1-3\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_totem_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains == 0 && $item_remains < $service_items['qtty']){
                                                                $item_available=$service_items['qtty'];
                                                                $item_used=0;
                                                                $qtty_totem_used=0;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }
                                                    }else if ($totem_items['USED_QTTY']<=$service_items['qtty'] && $itemc >= 1){
                                                        if ($item_remains == 0){
                                                            $item_available=$service_items['qtty'];
                                                            $item_used=0;
                                                            $qtty_totem_used=0;
                                                            $isNotUsed++;
                                                        }
                                                    }
                                                }else{
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty'];
                                                    $isNotUsed++;
                                                }                                                
                                            }                                            
                                        }else{
                                            $item_used="0";
                                            $item_available=$service_items['qtty'] - 0;
                                            $isNotUsed++;
                                        }
                                        $total_cameras_availables=$qtty_totem_contract;
                                        $total_cameras_used+=$qtty_totem_used;
                                        //echo "item n°: ".$itemc." Camaras used: ".$qtty_totem_used." Total Cameras available: ".$total_cameras_availables."\n";
                                        $contract[$c]['services'][$s]["items_available"]=$total_cameras_availables-$total_cameras_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;
                                        $itemc++;
                                    break;
                                    case "4":
                                        $qtty_cameras_contract += $service_items['qtty'];
                                        $contract[$c]['services'][$s]['items_contracted']= $qtty_cameras_contract;
                                        $sqlServiceSelect =   array(
                                                        'COUNT(TBC.idCamera) AS USED_QTTY'
                                                    );
                                        $rsCameraService = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_camera AS CS')
                                        ->join('tb_cameras AS TBC', 'TBC.idClientServicesCameraFk = CS.idClientServicesCamera', 'left')
                                        ->where('CS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();
                                        if ($rsCameraService->num_rows() == 1){                                          
                                            foreach ($rsCameraService->result_array() as $camera_item => $camera_items) {
                                                //VALIDATION
                                                if($camera_items['USED_QTTY']>0){
                                                    if ($camera_items['USED_QTTY']<$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO";
                                                        if ($qtty_cameras_used<$camera_items['USED_QTTY']){
                                                            $qtty_cameras_used=$camera_items['USED_QTTY'];
                                                            $item_used=$qtty_cameras_used;
                                                            $item_available=$service_items['qtty'] - $camera_items['USED_QTTY'];
                                                            $isNotUsed++;
                                                        }
                                                    }else if ($camera_items['USED_QTTY']>$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO-1\n";
                                                        if ($qtty_cameras_used<$camera_items['USED_QTTY']){
                                                            //echo "ENTRO-2\n";
                                                            //echo "USED_QTTY: "; print_r($camera_items['USED_QTTY']);
                                                            //echo "\n";
                                                            $item_remains=$camera_items['USED_QTTY'] - $service_items['qtty'];
                                                            $qtty_cameras_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                            //echo "item_remains: $item_remains\n";
                                                        }
                                                    }else if ($camera_items['USED_QTTY']==$service_items['qtty'] && $itemc == 0){
                                                            $qtty_cameras_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                    }else if ($camera_items['USED_QTTY']>$service_items['qtty'] && $itemc >= 1){
                                                        //echo "ENTRO-1-1\n";
                                                        //echo "item_remains: $item_remains\n";
                                                            if ($item_remains > 0 && $item_remains < $service_items['qtty']){
                                                                //echo "ENTRO-1-1-1\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=$service_items['qtty'] - $item_remains;
                                                                $item_used=$item_remains;
                                                                $qtty_cameras_used=$item_remains;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }else if ($item_remains > 0 && $item_remains > $service_items['qtty']){
                                                                //echo "ENTRO-1-1-2\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_cameras_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains > 0 && $item_remains == $service_items['qtty']){
                                                                //echo "ENTRO-1-1-3\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_cameras_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains == 0 && $item_remains < $service_items['qtty']){
                                                                $item_available=$service_items['qtty'];
                                                                $item_used=0;
                                                                $qtty_cameras_used=0;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }
                                                    }else if ($camera_items['USED_QTTY']<=$service_items['qtty'] && $itemc >= 1){
                                                        if ($item_remains == 0){
                                                            $item_available=$service_items['qtty'];
                                                            $item_used=0;
                                                            $qtty_cameras_used=0;
                                                            $isNotUsed++;
                                                        }
                                                    }
                                                }else{
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty'];
                                                    $isNotUsed++;
                                                }                                                
                                            }
                                        }else{
                                            $item_used="0";
                                            $item_available=$service_items['qtty'] - 0;
                                            $isNotUsed++;
                                        }
                                        $total_cameras_availables=$qtty_cameras_contract;
                                        $total_cameras_used+=$qtty_cameras_used;
                                        //echo "item n°: ".$itemc." Camaras used: ".$qtty_cameras_used." Total Cameras available: ".$total_cameras_availables."\n";
                                        $contract[$c]['services'][$s]["items_available"]=$total_cameras_availables-$total_cameras_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;
                                        $itemc++;                                       
                                    break;
                                    case "5":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAlarmServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_alarms as ALS')
                                        ->where('ALS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();

                                        if ($rsAlarmServices->num_rows() == 1){                                       
                                            foreach ($rsAlarmServices->result_array() as $alarm_item => $alarm_items) {
                                                if( $alarm_items['USED_QTTY']==1){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;                                        
                                    break;
                                    case "6":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAppMonitorServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_smart_panic as SPS')
                                        ->where('SPS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();

                                        if ($rsAppMonitorServices->num_rows() == 1){                                       
                                            foreach ($rsAppMonitorServices->result_array() as $appmonitor_item => $appmonitor_items) {
                                                if( $appmonitor_items['USED_QTTY']==1){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;                                           
                                    break;
                                }
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiciosDelContratoCuerpo'] = $service_items['idServiciosDelContratoCuerpo'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiciosDelContratoFk']     = $service_items['idServiciosDelContratoFk'];
                                $contract[$c]['services'][$s]["service_items"][$si]['qtty']                         = $service_items['qtty'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idAccCrtlDoor']                = $service_items['idAccCrtlDoor'];
                                $contract[$c]['services'][$s]["service_items"][$si]['itemName']                     = $service_items['itemName'];
                                $contract[$c]['services'][$s]["service_items"][$si]['itemAclaracion']               = $service_items['itemAclaracion'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiceTypeFk']              = $service_items['idServiceTypeFk'];
                                $si++;
                            }
                        }
                    $s++;
                    }
                }
             $c++;
            }
        }

        return $contract;

    } 
    public function getIdClient($idClientFk) {

            $this->db->select("*")->from("tb_contratos");
            $this->db->join('tb_type_contrato', 'tb_type_contrato.idTypeContrato = tb_contratos.contratoType', 'left');
            $this->db->join('tb_type_maintenance', 'tb_type_maintenance.idTypeMaintenance = tb_contratos.maintenanceType', 'left');
            $this->db->join('tb_systemunderlock', 'tb_systemunderlock.idContratoFk = tb_contratos.idContrato', 'left');
            $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_contratos.idStatusFk', 'left');
            $this->db->join('tb_client_service_reason_down', 'tb_client_service_reason_down.idReason = tb_contratos.idReasonTypeKf', 'left');
            $this->db->where('idClientFk', $idClientFk);
            $rsContract  = $this->db->where("tb_contratos.idStatusFk !=", null)->get();
        $c=0;
        $contract = null;
        //print_r($contract_item['idContrato']);
        if ($rsContract->num_rows() > 0) {
            foreach ($rsContract->result_array() as $item => $contract_item) {
                $s=0;
                //print "Contract: ".$item."\n";
                $contract[$c] = $contract_item;
                $rsContractHeader = $this->db->select("*")
                    ->from("tb_servicios_del_contrato_cabecera")
                    ->where('idContratoFk', $contract_item['idContrato'])
                    ->get();
                if ($rsContractHeader->num_rows() > 0) {                    
                    $contract[$c]['services'] = $rsContractHeader->result_array();
                    //print_r($contract[$c]['services']);
                    foreach ($rsContractHeader->result_array() as $service => $header_item) {
                        //print "Service: ".$service."\n";
                        $rsContractBody = $this->db->select("*")
                            ->from("tb_servicios_del_contrato_cuerpo")
                            ->where('idServiciosDelContratoFk', $header_item['idServiciosDelContrato'])
                            ->get();
                        if ($rsContractBody->num_rows() > 0){
                            $si=0;
                            $qtty_door_used = 0;
                            $doors_controlaccess_contract = 0;
                            $total_doors_availables = 0;
                            $total_doors_used = 0;
                            $qtty_totem_contract = 0;
                            $qtty_cameras_contract = 0;
                            $qtty_totem_used = 0;        
                            $qtty_cameras_used = 0;
                            $items_contracted = 0;
                            $item_used = 0;
                            $item_available = 0;
                            $item_remains = 0;
                            $isUsed = 0;
                            $isNotUsed = 0;
                            $total_cameras_availables=0;
                            $total_cameras_used = 0;
                            $itemc = 0;
                            foreach ($rsContractBody->result_array() as $srv_item => $service_items) {
                                switch ($header_item['idServiceType']){
                                    case "1":
                                        $doors_controlaccess_contract += $service_items['qtty']!=null&&$service_items['qtty']!=''?$service_items['qtty']:1;
                                        $contract[$c]['services'][$s]['items_contracted']=$doors_controlaccess_contract;                                    
                                        
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAccessDoors = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_access_control AS ACS')
                                        ->where('ACS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->where('ACS.idDoorFk', $service_items['idAccCrtlDoor'])
                                        ->group_by('ACS.idDoorFk')
                                        ->get();
                                        if ($rsAccessDoors->num_rows() >= 1){
                                            //print "contrato: ".$contract_item['idContrato']."\n";
                                            //print "Door Type: ".$service_items['idAccCrtlDoor']."\n";
                                            //print "Encontrado: ".$rsAccessDoors->num_rows()."\n";                                            
                                            /*foreach ($rsAccessDoors->result_array() as $door_item => $door_items) {
                                                //print 'door_'.$service_items['itemName'].'_used: '.$door_items['QTTY']."\n";
                                                //VALIDATE IF THERE IS A DOOR OF EACH TYPE USED IN A SERVICE OF CONTROL ACCESS
                                                $item_used=$door_items['USED_QTTY'];
                                                if($service_items['qtty']==null && $door_items['USED_QTTY']==1){                                                    
                                                    $item_available = 0;
                                                    $isUsed++;
                                                    if($service_items['qtty'] == $door_items['USED_QTTY']){
                                                        $isUsed++;
                                                    }
                                                }else{
                                                    $item_available=$service_items['qtty'] - $door_items['USED_QTTY'];
                                                    if($service_items['qtty'] == $door_items['USED_QTTY']){
                                                        $isUsed++;   
                                                    }else{
                                                        $isNotUsed++;
                                                    }
                                                }
                                            }*/
                                            foreach ($rsAccessDoors->result_array() as &$door_items) {
                                                //VALIDATIONS
                                                //print_r($door_items);
                                                if($door_items['USED_QTTY']>0){
                                                    if ($door_items['USED_QTTY']<$service_items['qtty']){
                                                        //print_r("hola mundo 1");
                                                        $qtty_door_used=$door_items['USED_QTTY'];
                                                        $item_used=$qtty_door_used;
                                                        $item_available=$service_items['qtty'] - $door_items['USED_QTTY'];
                                                        $isNotUsed++;
                                                    }else if ($door_items['USED_QTTY']==$service_items['qtty']){
                                                        //print_r("hola mundo 2");
                                                        $qtty_door_used=$service_items['qtty'];
                                                        $item_used=$service_items['qtty'];
                                                        $item_available=0;
                                                        $isUsed++;
                                                    }
                                                }else{
                                                    //print_r("hola mundo 3");
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty']!=null&&$service_items['qtty']!=''?(int)$service_items['qtty']:1;
                                                    $qtty_door_used=0;
                                                    $isNotUsed++;
                                                }
                                            }                                            
                                        }else{
                                            //print_r("hola mundo 3");
                                            $item_used="0";
                                            $item_available=$service_items['qtty']!=null&&$service_items['qtty']!=''?(int)$service_items['qtty']:1;
                                            $qtty_door_used=0;
                                            $isNotUsed++;
                                        }
                                        $total_doors_availables=$doors_controlaccess_contract;
                                        //print "qtty_door_used: ".$qtty_door_used."\n";
                                        $total_doors_used+=$qtty_door_used;
                                        $contract[$c]['services'][$s]["items_available"]=$total_doors_availables-$total_doors_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;                                      
                                    break;
                                    case "2":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsInterServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_internet as INTS')
                                        ->where('INTS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->where('INTS.idTypeInternetFk', $service_items['idAccCrtlDoor'])
                                        ->group_by('INTS.idTypeInternetFk')
                                        ->get();
                                        if ($rsInterServices->num_rows() >= 1){                                       
                                            foreach ($rsInterServices->result_array() as $internet_item => $internet_items) {
                                                if( $internet_items['USED_QTTY']>0){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                    break;
                                    case "3":
                                        $qtty_totem_contract += $service_items['qtty'];
                                        $contract[$c]['services'][$s]['items_contracted']=$qtty_totem_contract;
                                        $sqlServiceSelect =   array(
                                                        'COUNT(TBCT.idCameraTotem) AS USED_QTTY'
                                                    );
                                        $rsCameraTotem = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_totem AS TS')
                                        ->join('tb_cameras_totem AS TBCT', 'TBCT.idClientServicesCameraTotemFk = TS.idClientServicesTotem', 'left')
                                        ->where('TS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();
                                        if ($rsCameraTotem->num_rows() >= 1){
                                            foreach ($rsCameraTotem->result_array() as $totem_item => $totem_items) {
                                                //VALIDATION
                                                if($totem_items['USED_QTTY']>0){
                                                    if ($totem_items['USED_QTTY']<$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO";
                                                        if ($qtty_totem_used<$totem_items['USED_QTTY']){
                                                            $qtty_totem_used=$totem_items['USED_QTTY'];
                                                            $item_used=$qtty_totem_used;
                                                            $item_available=$service_items['qtty'] - $totem_items['USED_QTTY'];
                                                            $isNotUsed++;
                                                        }
                                                    }else if ($totem_items['USED_QTTY']>$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO-1\n";
                                                        if ($qtty_totem_used<$totem_items['USED_QTTY']){
                                                            //echo "ENTRO-2\n";
                                                            //echo "USED_QTTY: "; print_r($totem_items['USED_QTTY']);
                                                            //echo "\n";
                                                            $item_remains=$totem_items['USED_QTTY'] - $service_items['qtty'];
                                                            $qtty_totem_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                            //echo "item_remains: $item_remains\n";
                                                        }
                                                    }else if ($totem_items['USED_QTTY']==$service_items['qtty'] && $itemc == 0){
                                                            $qtty_totem_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                    }else if ($totem_items['USED_QTTY']>$service_items['qtty'] && $itemc >= 1){
                                                        //echo "ENTRO-1-1\n";
                                                        //echo "item_remains: $item_remains\n";
                                                            if ($item_remains > 0 && $item_remains < $service_items['qtty']){
                                                                //echo "ENTRO-1-1-1\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=$service_items['qtty'] - $item_remains;
                                                                $item_used=$item_remains;
                                                                $qtty_totem_used=$item_remains;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }else if ($item_remains > 0 && $item_remains > $service_items['qtty']){
                                                                //echo "ENTRO-1-1-2\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_totem_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains > 0 && $item_remains == $service_items['qtty']){
                                                                //echo "ENTRO-1-1-3\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_totem_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains == 0 && $item_remains < $service_items['qtty']){
                                                                $item_available=$service_items['qtty'];
                                                                $item_used=0;
                                                                $qtty_totem_used=0;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }
                                                    }else if ($totem_items['USED_QTTY']<=$service_items['qtty'] && $itemc >= 1){
                                                        if ($item_remains == 0){
                                                            $item_available=$service_items['qtty'];
                                                            $item_used=0;
                                                            $qtty_totem_used=0;
                                                            $isNotUsed++;
                                                        }
                                                    }
                                                }else{
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty'];
                                                    $isNotUsed++;
                                                }                                                
                                            }                                            
                                        }else{
                                            $item_used="0";
                                            $item_available=$service_items['qtty'] - 0;
                                            $isNotUsed++;
                                        }
                                        $total_cameras_availables=$qtty_totem_contract;
                                        $total_cameras_used+=$qtty_totem_used;
                                        //echo "item n°: ".$itemc." Camaras used: ".$qtty_totem_used." Total Cameras available: ".$total_cameras_availables."\n";
                                        $contract[$c]['services'][$s]["items_available"]=$total_cameras_availables-$total_cameras_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;
                                        $itemc++;
                                    break;
                                    case "4":
                                        $qtty_cameras_contract += $service_items['qtty'];
                                        $contract[$c]['services'][$s]['items_contracted']= $qtty_cameras_contract;
                                        $sqlServiceSelect =   array(
                                                        'COUNT(TBC.idCamera) AS USED_QTTY'
                                                    );
                                        $rsCameraService = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_camera AS CS')
                                        ->join('tb_cameras AS TBC', 'TBC.idClientServicesCameraFk = CS.idClientServicesCamera', 'left')
                                        ->where('CS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();
                                        if ($rsCameraService->num_rows() >= 1){                                          
                                            foreach ($rsCameraService->result_array() as $camera_item => $camera_items) {
                                                //VALIDATION
                                                if($camera_items['USED_QTTY']>0){
                                                    if ($camera_items['USED_QTTY']<$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO";
                                                        if ($qtty_cameras_used<$camera_items['USED_QTTY']){
                                                            $qtty_cameras_used=$camera_items['USED_QTTY'];
                                                            $item_used=$qtty_cameras_used;
                                                            $item_available=$service_items['qtty'] - $camera_items['USED_QTTY'];
                                                            $isNotUsed++;
                                                        }
                                                    }else if ($camera_items['USED_QTTY']>$service_items['qtty'] && $itemc == 0){
                                                        //echo "ENTRO-1\n";
                                                        if ($qtty_cameras_used<$camera_items['USED_QTTY']){
                                                            //echo "ENTRO-2\n";
                                                            //echo "USED_QTTY: "; print_r($camera_items['USED_QTTY']);
                                                            //echo "\n";
                                                            $item_remains=$camera_items['USED_QTTY'] - $service_items['qtty'];
                                                            $qtty_cameras_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                            //echo "item_remains: $item_remains\n";
                                                        }
                                                    }else if ($camera_items['USED_QTTY']==$service_items['qtty'] && $itemc == 0){
                                                            $qtty_cameras_used=$service_items['qtty'];
                                                            $item_used=$service_items['qtty'];
                                                            $item_available=0;
                                                            $isUsed++;
                                                    }else if ($camera_items['USED_QTTY']>$service_items['qtty'] && $itemc >= 1){
                                                        //echo "ENTRO-1-1\n";
                                                        //echo "item_remains: $item_remains\n";
                                                            if ($item_remains > 0 && $item_remains < $service_items['qtty']){
                                                                //echo "ENTRO-1-1-1\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=$service_items['qtty'] - $item_remains;
                                                                $item_used=$item_remains;
                                                                $qtty_cameras_used=$item_remains;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }else if ($item_remains > 0 && $item_remains > $service_items['qtty']){
                                                                //echo "ENTRO-1-1-2\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_cameras_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains > 0 && $item_remains == $service_items['qtty']){
                                                                //echo "ENTRO-1-1-3\n";
                                                                //echo "item_remains: $item_remains\n";
                                                                $item_available=0;
                                                                $item_remains=$item_remains - $service_items['qtty'];
                                                                $item_used=$service_items['qtty'];
                                                                $qtty_cameras_used=$service_items['qtty'];
                                                                $isUsed++;
                                                            }else if ($item_remains == 0 && $item_remains < $service_items['qtty']){
                                                                $item_available=$service_items['qtty'];
                                                                $item_used=0;
                                                                $qtty_cameras_used=0;
                                                                $isNotUsed++;
                                                                $item_remains=0;
                                                            }
                                                    }else if ($camera_items['USED_QTTY']<=$service_items['qtty'] && $itemc >= 1){
                                                        if ($item_remains == 0){
                                                            $item_available=$service_items['qtty'];
                                                            $item_used=0;
                                                            $qtty_cameras_used=0;
                                                            $isNotUsed++;
                                                        }
                                                    }
                                                }else{
                                                    $item_used="0";
                                                    $item_available=$service_items['qtty'];
                                                    $isNotUsed++;
                                                }                                                
                                            }
                                        }else{
                                            $item_used="0";
                                            $item_available=$service_items['qtty'] - 0;
                                            $isNotUsed++;
                                        }
                                        $total_cameras_availables=$qtty_cameras_contract;
                                        $total_cameras_used+=$qtty_cameras_used;
                                        //echo "item n°: ".$itemc." Camaras used: ".$qtty_cameras_used." Total Cameras available: ".$total_cameras_availables."\n";
                                        $contract[$c]['services'][$s]["items_available"]=$total_cameras_availables-$total_cameras_used;
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;
                                        $contract[$c]['services'][$s]["service_items"][$si]['available']=$item_available;
                                        $itemc++;                                       
                                    break;
                                    case "5":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAlarmServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_alarms as ALS')
                                        ->where('ALS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();

                                        if ($rsAlarmServices->num_rows() >= 1){                                       
                                            foreach ($rsAlarmServices->result_array() as $alarm_item => $alarm_items) {
                                                if( $alarm_items['USED_QTTY']>0){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;                                        
                                    break;
                                    case "6":
                                        $contract[$c]['services'][$s]['item_contracted']=count($rsContractBody->result_array());
                                        $sqlServiceSelect =   array(
                                                        'COUNT(*) AS USED_QTTY'
                                                    );
                                        $rsAppMonitorServices = $this->db->select($sqlServiceSelect)
                                        ->from('tb_client_services_smart_panic as SPS')
                                        ->where('SPS.idContracAssociated_SE', $contract_item['idContrato'])
                                        ->get();

                                        if ($rsAppMonitorServices->num_rows() >= 1){                                       
                                            foreach ($rsAppMonitorServices->result_array() as $appmonitor_item => $appmonitor_items) {
                                                if( $appmonitor_items['USED_QTTY']>0){                                                    
                                                    $isUsed++;
                                                    $item_used=1;
                                                }else{
                                                    $isNotUsed++;
                                                    $item_used=0;
                                                }
                                            }
                                        }else{
                                            $item_used=0;
                                            $isNotUsed++;
                                        }
                                        $contract[$c]['services'][$s]['item_used']=$isUsed;
                                        $contract[$c]['services'][$s]['item_available']=$isNotUsed;
                                        $contract[$c]['services'][$s]["service_items"][$si]['used']=$item_used;                                           
                                    break;
                                }
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiciosDelContratoCuerpo'] = $service_items['idServiciosDelContratoCuerpo'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiciosDelContratoFk']     = $service_items['idServiciosDelContratoFk'];
                                $contract[$c]['services'][$s]["service_items"][$si]['qtty']                         = $service_items['qtty'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idAccCrtlDoor']                = $service_items['idAccCrtlDoor'];
                                $contract[$c]['services'][$s]["service_items"][$si]['itemName']                     = $service_items['itemName'];
                                $contract[$c]['services'][$s]["service_items"][$si]['itemAclaracion']               = $service_items['itemAclaracion'];
                                $contract[$c]['services'][$s]["service_items"][$si]['idServiceTypeFk']              = $service_items['idServiceTypeFk'];
                                $si++;
                            }
                        }
                    $s++;
                    }
                }
             $c++;
            }
        }

        return $contract;

    }
    public function fechaFirmaContrato($contrato) {
        $now = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set([
                "idClientFk"           => $contrato['idClientFk'],
                "fechaFirmaVigencia"   => $contrato['fechaFirmaVigencia'],
                "fechaActivacion"      => $now->format('Y-m-d') ,
                "numeroContrato"       => $contrato['numeroContrato'],
                "contratoType"         => $contrato['contratoType'],
                "maintenanceType"      => $contrato['maintenanceType'],
                "idStatusFk"           => $contrato['idStatusFk'],
            ]
        )->where("idContrato", $contrato['idContrato'])->update("tb_contratos");

        if ($this->db->affected_rows() >= 0) {
            return true;
        } else {
            return false;
        }
    } 
    public function fechaActivacionContrato($contrato) {
        $this->db->set([
                "idClientFk"           => $contrato['idClientFk'],
                "fechaFirmaVigencia"   => $contrato['fechaFirmaVigencia'],
                "fechaFirma"           => $contrato['fechaFirma'],
                "numeroContrato"       => $contrato['numeroContrato'],
                "contratoType"         => $contrato['contratoType'],
                "maintenanceType"      => $contrato['maintenanceType'],
                "idStatusFk"           => $contrato['idStatusFk'],
            ]
        )->where("idContrato", $contrato['idContrato'])->update("tb_contratos");

        if ($this->db->affected_rows() >= 0) {
            return true;
        } else {
            return false;
        }
    }     
    /*HABILITAR / DESHABILITAR CONTRATO*/    
    public function changeStatusContrato($id, $idStatus) {
        $this->db->set([
                "idStatusFk"           => $idStatus,
            ]
        )->where("idContrato", $id)->update("tb_contratos");

        if ($this->db->affected_rows() >= 0) {
            return true;
        } else {
            return false;
        }
    }   
    public function delete($idClient) {

        $this->db->set([ 'idStatusFk' => -1 ])
            ->where("idClient", $idClient)
            ->update("tb_clients");

        return true;

    }

    public function addSystemUnderLock($client) {

        $this->db->insert('tb_systemunderlock', [
                "idContratoFk"              => $client['idContrato'],
                "isSystemUnderLock"         => $client['isSystemUnderLock'],
                "customerHasKeys"           => $client['customerHasKeys'],
                "companyHasKeys"            => $client['companyHasKeys'],
                "comment_systemUnderLock"   => $client['comment_systemUnderLock'],
            ]
        );
        return true;
    }


    public function updateSystemUnderLock($client) {

        $this->db->set([
                "idSystemUnderLock"         => $client['idSystemUnderLock'],
                "idContratoFk"              => $client['idContrato'],
                "isSystemUnderLock"         => $client['isSystemUnderLock'],
                "customerHasKeys"           => $client['customerHasKeys'],
                "companyHasKeys"            => $client['companyHasKeys'],
                "comment_systemUnderLock"   => $client['comment_systemUnderLock'],
            ]
        )->where("idSystemUnderLock", $client['idSystemUnderLock'])->update("tb_systemunderlock");

        return true;

    }

}

?>