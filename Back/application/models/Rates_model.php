<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Rates_model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }

    public function add($item) {

        $this->db->insert('tb_technician_service_cost', [
                'idServiceTechnicianKf' => $item['idServiceTechnicianKf'],
                'idTipoMantenimientoKf' => $item['idTipoMantenimientoKf'],
                'cost' => $item['cost'],
            ]
        );
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function edit($item) {
        $now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set(
            [
                'idServiceTechnicianKf' => $item['idServiceTechnicianKf'],
                'idTipoMantenimientoKf' => $item['idTipoMantenimientoKf'],
                'cost' => $item['cost'],
                'costUpdateDate' => $now->format('Y-m-d H:i:s'),
            ]
        )->where("idServiceTechnicianCost", $item['idServiceTechnicianCost'])->update("tb_technician_service_cost");

        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function delete($id) {
        $this->db->set([ 'idStatusKf' => -1 ])->where("idServiceTechnicianCost", $id)->update("tb_technician_service_cost");
        return true;
    }

    public function listar() {
        $rs = [];
        $this->db->select("tb_technician_service_cost.*, tb_status.statusTenantName AS status_cost, tb_technician_services.description, tb_type_maintenance.typeMaintenance")->from("tb_technician_service_cost");
        $this->db->join('tb_technician_services', 'tb_technician_services.idServiceTechnician = tb_technician_service_cost.idServiceTechnicianKf', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_technician_service_cost.idStatusKf', 'left');
        $this->db->join('tb_type_maintenance', 'tb_type_maintenance.idTypeMaintenance = tb_technician_service_cost.idTipoMantenimientoKf', 'left');
        $query = $this->db->order_by('tb_technician_service_cost.idServiceTechnicianCost ASC')->get();
        $rs = $query->result_array();
         if ($query->num_rows() > 0) {
            return $rs;
        }

        return null;
    }

    public function listarByServiceTypeId($id) {
        $rs = [];
        $this->db->select("tb_technician_service_cost.*, tb_status.statusTenantName AS status_cost, tb_technician_services.description, tb_type_maintenance.typeMaintenance")->from("tb_technician_service_cost");
        $this->db->join('tb_technician_services', 'tb_technician_services.idServiceTechnician = tb_technician_service_cost.idServiceTechnicianKf', 'left');
        $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_technician_service_cost.idStatusKf', 'left');
        $this->db->join('tb_type_maintenance', 'tb_type_maintenance.idTypeMaintenance = tb_technician_service_cost.idTipoMantenimientoKf', 'left');
        $this->db->where('tb_technician_service_cost.idServiceTechnicianKf', $id);
        $query = $this->db->order_by('tb_technician_service_cost.idServiceTechnicianCost ASC')->get();
        $rs = $query->result_array();
         if ($query->num_rows() > 0) {
            return $rs;
        }

        return null;
    }

    public function getServiceCostByCustomer($item) {
        $rs = [];
        $where = null;
        $todo = null;
        // First query
        $this->db->select("*");
        $this->db->from("tb_technician_services");
        $this->db->join('tb_technician_services_type', 'tb_technician_services_type.idServiceType = tb_technician_services.idServiceTypeFk', 'left');
        $this->db->join('tb_technician_services_mode', 'tb_technician_services_mode.idServiceMode = tb_technician_services.idServiceModeFk', 'left');
        $this->db->where('tb_technician_services.idServiceTypeFk', $item['idServiceTechnician']);
        $this->db->where('tb_technician_services.idServiceModeFk', $item['deviceIsOnline']);
        if ($item['hasStock']=='0'){
            $this->db->like('tb_technician_services.description', "ALTA-SIN-STOCK", 'both', false);
        }

        $query = $this->db->get();
        //print_r($query->result_array());
        $todo['technician_services']=$query->result_array();
        $tb_technician_services = $query->row();
        if ($query->num_rows() === 1) {
            // First, fetch the minimum cost for the given idServiceTechnicianKf
            if ($item['hasStock']=='0'){
                $this->db->select('MAX(cost) as min_cost');
            }else{
                $this->db->select('MIN(cost) as min_cost');
            }
            $this->db->from('tb_technician_service_cost');
            $this->db->where('idServiceTechnicianKf', $tb_technician_services->idServiceTechnician);
            $subquery = $this->db->get()->row();
            //print_r($subquery);
            // Ensure that the subquery has returned a result
            if ($subquery && $subquery->min_cost !== null) {
                $min_cost = (float) $subquery->min_cost;
                $this->db->select("*");
                $this->db->from("tb_contratos");
                $this->db->join('tb_servicios_del_contrato_cabecera', 'tb_servicios_del_contrato_cabecera.idContratoFk = tb_contratos.idContrato', 'left');
                $this->db->join('tb_servicios_del_contrato_cuerpo', 'tb_servicios_del_contrato_cuerpo.idServiceTypeFk = tb_servicios_del_contrato_cabecera.idServiceType', 'left');
                $this->db->where('tb_contratos.idClientFk', $item['idCustomer']);
                $this->db->group_by('tb_contratos.idContrato');  // Grouping by idContrato
                $query2 = $this->db->get();
                //print_r($query2->result_array());
                foreach ($query2->result_array() as $key => $contract) {
                    $todo['contract']=$contract;
                    //print_r($contract['numeroContrato']);
                    // Second query
                    $this->db->select("*");
                    $this->db->from("tb_technician_service_cost");
                    $this->db->join('tb_technician_services', 'tb_technician_services.idServiceTechnician = tb_technician_service_cost.idServiceTechnicianKf', 'left');
                    $this->db->join('tb_technician_services_type', 'tb_technician_services_type.idServiceType = tb_technician_services.idServiceTypeFk', 'left');
                    $this->db->join('tb_technician_services_mode', 'tb_technician_services_mode.idServiceMode = tb_technician_services.idServiceModeFk', 'left');
                    //$this->db->join('tb_type_maintenance', 'tb_type_maintenance.idTypeMaintenance = tb_technician_service_cost.idTipoMantenimientoKf', 'left');
                    //$this->db->join('tb_contratos', 'tb_contratos.maintenanceType = tb_type_maintenance.idTypeMaintenance', 'left');
                    //$this->db->join('tb_servicios_del_contrato_cabecera', 'tb_servicios_del_contrato_cabecera.idContratoFk = tb_contratos.idContrato', 'left');
                    //$this->db->join('tb_servicios_del_contrato_cuerpo', 'tb_servicios_del_contrato_cuerpo.idServiceTypeFk = tb_servicios_del_contrato_cabecera.idServiceType', 'left');

                    // Where clause using proper chaining
                    //$this->db->where('tb_contratos.idContrato', $contract['idContrato']);
                    //$this->db->where('tb_servicios_del_contrato_cabecera.idServiceType', $item['idServiceType']);
                    $this->db->where('tb_technician_services.idServiceTypeFk', $item['idServiceType']);
                    $this->db->where('tb_technician_service_cost.idServiceTechnicianKf', $tb_technician_services->idServiceTechnician);
                    if ($query2->num_rows()==1){
                        //print($query2->num_rows());
                        $this->db->where('tb_technician_service_cost.idTipoMantenimientoKf', $contract['maintenanceType']);
                    }else{
                        $this->db->where('tb_technician_service_cost.cost', $min_cost); // Compare with the minimum cost
                    }
                    // Subquery for minimum cost
                    
                    
                    //$this->db->where('tb_technician_service_cost.cost = (SELECT MIN(cost + 0) AS min FROM tb_technician_service_cost WHERE tb_technician_service_cost.idTipoMantenimientoKf = "' . $contract['maintenanceType']. '" AND tb_technician_service_cost.idServiceTechnicianKf = "' . $tech_service['idServiceTechnician'] . '")', NULL, FALSE);

                    $query3 = $this->db->limit(1)->get();
                    $todo['technician_service_cost']=$query3->result_array();
                    $rs = $todo;

                    if ($query3->num_rows() === 1) {
                        return $rs;
                    }
                }
            }
        }
        return null;
    }


}

?>