<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Zonas_model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }

    public function addZona($item) {
        $this->db->insert('tb_zonas', [
                'n_zona'      => $item['n_zona'],
                'descripcion' => $item['descripcion'],
                'costo_envio' => $item['costo_envio'],
                'valor_envio' => $item['valor_envio'],
            ]
        );
        $id = $this->db->insert_id();
        if (count($item['locations']) > 0) {
            $this->insertLocations($item['locations'], $id);
        }
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function editZona($item) {

        $this->db->set(
            [ 'n_zona'      => $item['n_zona'],
              'descripcion' => $item['descripcion'],
              'costo_envio' => $item['costo_envio'],
              'valor_envio' => $item['valor_envio'],
            ]
        )->where("idZona", $item['idZona'])->update("tb_zonas");

        if (count($item['locations']) > 0) {
            $this->insertLocations($item['locations'], $item['idZona'], true);
        }
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function deletZona($id) {
        $locations = [];
        $this->db->set([ 'idStatusKf' => -1 ])->where("idZona", $id)->update("tb_zonas");
        $this->insertLocations($locations, $id, true);
        return true;
    }

    public function checkZonaByLocationAndCustomerId($idClient, $idLocation) {
        $location = null;
        $this->db->select("tb_zonas.*, tb_zona_location.*, tb_location.*, tb_province.*")->from("tb_clients");
        $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
        $this->db->join('tb_zona_location', 'tb_zona_location.idZoneKf = tb_zonas.idZona', 'left');
        $this->db->join('tb_location', 'tb_location.idLocation = tb_zona_location.idLocationKf', 'left');
        $this->db->join('tb_province', 'tb_province.idProvince = tb_location.idProvinceFK', 'left');
        $this->db->where('tb_clients.idClient', $idClient);
        $query = $this->db->where('tb_zona_location.idLocationKf', $idLocation)->get();
        $location = $query->result_array();
        if ($query->num_rows() === 1) {
            return $location;
        }else{
            $query2=null;
            $this->db->select("tb_zonas.*, tb_zona_location.*, tb_location.*, tb_province.*")->from("tb_zona_location");
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_zona_location.idZoneKf', 'left');
            $this->db->join('tb_location', 'tb_location.idLocation = tb_zona_location.idLocationKf', 'left');
            $this->db->join('tb_province', 'tb_province.idProvince = tb_location.idProvinceFK', 'left');
            $query2 = $this->db->where('tb_zona_location.idLocationKf', $idLocation)->get();
            $location = $query2->result_array();
            if ($query2->num_rows() === 1) {
                return $location;
            }
        }

        return null;
    }

    public function listarZona() {
        $zones = [];
        $this->db->select("tb_zonas.*, tb_status.statusTenantName as status_zona");
        $query = $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_zonas.idStatusKf', 'left')->from("tb_zonas")
            ->where('tb_zonas.idStatusKf', 1)
            ->get();
        $zones = $query->result_array();
         if ($query->num_rows() > 0) {
            foreach ($zones as $key => $item) {
                $idZona = $item['idZona'];
				$query2    = null;
				$this->db->select("*")->from("tb_zona_location");
                $this->db->join('tb_location', 'tb_location.idLocation = tb_zona_location.idLocationKf', 'left');
                $this->db->join('tb_province', 'tb_province.idProvince = tb_location.idProvinceFK', 'left');
				$this->db->where('idZoneKf', $idZona);
				$query2 = $this->db->get();
				if ($query2->num_rows() > 0) {
					$zones[$key]['locations'] = $query2->result_array();
				}
            }
            return $zones;
        }

        return null;
    }
    public function insertLocations($locations, $id, $borrar = false) {
        if ($borrar) {
            $this->db->delete('tb_zona_location', [ 'idZoneKf' => $id ]);
        }
        if (count($locations) > 0) {
            foreach ($locations as $item) {
                $this->db->insert('tb_zona_location', [
                        "idZoneKf"      => $id,
                        "idLocationKf"  => $item['idLocation'],
                    ]
                );
            }
        }

        return true;
    }
}

?>