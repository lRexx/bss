<?php if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Client_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }


    // ADMINISTRADORES //
    public function addAdmin($client) {
        $idClientDepartamentFk = null;
        $idDepartmentKf        = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idDepartmentFk'] == null || $client['idDepartmentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idDepartmentKf = $this->db->insert_id();
            } else {
                $idDepartmentKf = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idDepartmentKf = $client['idDepartmentFk'];
        }
        $user = null;
        $this->db->select("*")->from("tb_clients");
        $this->db->where("tb_clients.name =", $client['name']);
        $query = $this->db->where("tb_clients.idClientTypeFk =", $client['idClientTypeFk'])->get();
        if ($query->num_rows() < 1) {

            $this->db->insert('tb_clients', [
                    'idClientTypeFk'          => $client['idClientTypeFk'],
                    'name'                    => $client['name'],
                    'address'                 => $client['address'],
                    'addressLat'              => $client['addressLat'],
                    'addressLon'              => $client['addressLon'],
                    'idAgentFk'               => $client['idAgentFk'],
                    'businessName'            => $client['businessName'],
                    'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                    'CUIT'                    => $client['CUIT'],
                    'idLocationFk'            => $client['idLocationFk'],
                    'idProvinceFk'            => $client['idProvinceFk'],
                    'observation'             => $client['observation'],
                    'pageWeb'                 => $client['pageWeb'],
                    'idStatusFk'              => 1,
                    'observationOrderKey'     => $client['observationOrderKey'],
                    'isNotCliente'            => $client['isNotCliente'],
                    'idClientAdminFk'         => $client['idClientAdminFk'],
                    'observationSericeTecnic' => $client['observationSericeTecnic'],
                    'observationCollection'   => $client['observationCollection'],
                    'idClientCompaniFk'       => $client['idClientCompaniFk'],
                    'idZonaFk'                => @$client['idZonaFk'],
                    'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],
                    'idClientDepartamentFk'   => @$idDepartmentKf,
                    'clientPhotosURL'         => @$client['clientPhotosURL'],

                ]
            );

            if ($this->db->affected_rows() === 1) {
                $idClientFk = $this->db->insert_id();

                // DATOS DE FACTURCION
                $this->db->insert('tb_client_billing_information', [
                        'idClientFk'          => $idClientFk,
                        'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                        'businessAddress'     => $client['billing_information']['nameAddress'],
                        'cuitBilling'         => $client['billing_information']['cuitBilling'],
                        'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                        'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                        'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                        'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                    ]
                );

                if (count(@$client['list_schedule_atention']) > 0
                    && count(@$client['list_phone_contact']) > 0
                    && count(@$client['list_emails']) > 0
                    || count(@$client['list_client_user']) > 0
                ) {

                    // HORARIOS
                    foreach ($client['list_schedule_atention'] as $valor) {

                        $this->db->insert('tb_client_schedule_atention', [
                                'idClienteFk' => $idClientFk,
                                'day'         => $valor['day'],
                                'fronAm'      => $valor['fronAm'],
                                'toAm'        => $valor['toAm'],
                                'fronPm'      => $valor['fronPm'],
                                'toPm'        => $valor['toPm'],
                            ]
                        );
                    }
                    //  TELEFONOS DE CONTACTO
                    foreach (@$client['list_phone_contact'] as $valor) {

                        $this->db->insert('tb_client_phone_contact', [
                                'idClientFk'   => $idClientFk,
                                'phoneTag'     => $valor['phoneTag'],
                                'phoneContact' => $valor['phoneContact'],
                            ]
                        );
                    }

                    //  USUARIOS DE LA EMPRESA
                    foreach ($client['list_client_user'] as $valor) {

                        $this->db->insert('tb_client_users', [
                                'idClientFk' => $idClientFk,
                                'idUserFk'   => $valor['idUserFk'],
                            ]
                        );
                    }
                    // MAILS
                    foreach ($client['list_emails'] as $valor) {
                        $this->db->insert('tb_client_mails', [
                                'idClientFk'     => $idClientFk,
                                'mailTag'        => $valor['mailTag'],
                                'mailContact'    => $valor['mailContact'],
                                'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                                'status'         => 1,
                            ]
                        );
                    }
                }

                return 1;
            } else {
                return 0;
            }
        } else {
            return 2;
        }

    }

    public function aprobarPedidoClient($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['autoApproveAll'])) {
				if ($client['autoApproveAll'] == 1) {
					$val = true;
				}
				if ($client['autoApproveAll'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'autoApproveAll' => $client['autoApproveAll'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}

	}
    public function autoAprobarPedidoPropietarios($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['autoApproveOwners'])) {
				if ($client['autoApproveOwners'] == 1) {
					$val = true;
				}
				if ($client['autoApproveOwners'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'autoApproveOwners' => $client['autoApproveOwners'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}

	}

	public function aprobarPedidoClientDepartment($client)
	{
		$val = false;
		$val2 = false;
		$query = $this->db->select("*")->from("tb_client_departament")->where('idClientDepartament', $client['idClientDepartament'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['autoApproveFloor'])) {
				if ($client['autoApproveFloor'] == 1) {
					$val = true;
				}
				if ($client['autoApproveFloor'] == 0) {
					$val = true;
				}
			}
			if (!is_null($client['autoApproveDepto'])) {
				if ($client['autoApproveDepto'] == 1) {
					$val2 = true;
				}
				if ($client['autoApproveDepto'] == 0) {
					$val2 = true;
				}
			}
		} else {
			return 0;
		}
		if ($val && $val2) {
			$this->db->set(
				[
					'autoApproveFloor' => $client['autoApproveFloor'],
					'autoApproveDepto' => $client['autoApproveDepto'],
				]
			)->where("idClientDepartament", $client['idClientDepartament'])->update("tb_client_departament");
			return 1;
		} else {
			return 0;
		}

	}

    public function mpPaymentMethod($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['mpPaymentMethod'])) {
				if ($client['mpPaymentMethod'] == 1) {
					$val = true;
				}
				if ($client['mpPaymentMethod'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'mpPaymentMethod' => $client['mpPaymentMethod'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}
	}
	public function chargeForExpenses($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['chargeForExpenses'])) {
				if ($client['chargeForExpenses'] == 1) {
					$val = true;
				}
				if ($client['chargeForExpenses'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'chargeForExpenses' => $client['chargeForExpenses'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}
	}

	public function IsInDebt($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['IsInDebt'])) {
				if ($client['IsInDebt'] == 1) {
					$val = true;
				}
				if ($client['IsInDebt'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'IsInDebt' => $client['IsInDebt'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}
	}

    public function isStockInBuilding($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['isStockInBuilding'])) {
				if ($client['isStockInBuilding'] == 1) {
					$val = true;
				}
				if ($client['isStockInBuilding'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'isStockInBuilding' => $client['isStockInBuilding'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}
	}

    public function isStockInOffice($client)
	{
		$val = false;
		$query = $this->db->select("*")->from("tb_clients")->where('idClient', $client['idClient'])->get();
		if ($query->num_rows() > 0) { //si existe el cliente
			if (!is_null($client['isStockInOffice'])) {
				if ($client['isStockInOffice'] == 1) {
					$val = true;
				}
				if ($client['isStockInOffice'] == 0) {
					$val = true;
				}
			}
		} else {
			return 0;
		}
		if ($val) {
			$this->db->set(
				[
					'isStockInOffice' => $client['isStockInOffice'],
				]
			)->where("idClient", $client['idClient'])->update("tb_clients");
			return 1;
		} else {
			return 0;
		}
	}
    public function updateAdmin($client) {

        $idClientDepartamentFk = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idClientDepartamentFk'] == null || $client['idClientDepartamentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
            } else {
                $idClientDepartamentFk = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idClientDepartamentFk = $client['idClientDepartamentFk'];
        }

        $this->db->set(
            [
                'idClientTypeFk'          => $client['idClientTypeFk'],
                'name'                    => $client['name'],
                'address'                 => $client['address'],
                'addressLat'              => $client['addressLat'],
                'addressLon'              => $client['addressLon'],
                'idAgentFk'               => $client['idAgentFk'],
                'businessName'            => $client['businessName'],
                'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                'CUIT'                    => $client['CUIT'],
                'idLocationFk'            => $client['idLocationFk'],
                'idProvinceFk'            => $client['idProvinceFk'],
                'observation'             => $client['observation'],
                'pageWeb'                 => $client['pageWeb'],
                'idStatusFk'              => 1,
                'observationOrderKey'     => $client['observationOrderKey'],
                'isNotCliente'            => $client['isNotCliente'],
                'idClientAdminFk'         => $client['idClientAdminFk'],
                'observationSericeTecnic' => $client['observationSericeTecnic'],
                'observationCollection'   => $client['observationCollection'],
                'idClientCompaniFk'       => $client['idClientCompaniFk'],
                'idZonaFk'                => @$client['idZonaFk'],
                'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],
                'idClientDepartamentFk'   => @$idClientDepartamentFk,
                'clientPhotosURL'         => @$client['clientPhotosURL'],
            ]
        )->where("idClient", $client['idClient'])->update("tb_clients");


        $this->db->set(
            [
                'idClientFk'          => $client['idClient'],
                'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                'businessAddress'     => $client['billing_information']['nameAddress'],
                'cuitBilling'         => $client['billing_information']['cuitBilling'],
                'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'] ]
        )->where("idClientFk", $client['idClient'])->update("tb_client_billing_information");


        if (count(@$client['list_schedule_atention']) > 0
            && count(@$client['list_phone_contact']) > 0
            || count(@$client['list_client_user']) > 0
            || count(@$client['list_emails']) > 0
        ) {
            // HORARIOS
            $this->db->delete('tb_client_schedule_atention', [ 'idClienteFk' => $client['idClient'] ]);

            foreach ($client['list_schedule_atention'] as $valor) {

                $this->db->insert('tb_client_schedule_atention', [
                    'idClienteFk' => $client['idClient'],
                    'day'         => $valor['day'],
                    'fronAm'      => $valor['fronAm'],
                    'toAm'        => $valor['toAm'],
                    'fronPm'      => $valor['fronPm'],
                    'toPm'        => $valor['toPm'],
                ]);
            }
            // TELEFONOS
            $this->db->delete('tb_client_phone_contact', [ 'idClientFk' => $client['idClient'] ]);

            foreach ($client['list_phone_contact'] as $valor) {

                $this->db->insert('tb_client_phone_contact', [
                    'idClientFk'   => $client['idClient'],
                    'phoneTag'     => $valor['phoneTag'],
                    'phoneContact' => $valor['phoneContact'],
                ]);
            }
            // USERS
            $this->db->delete('tb_client_users', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_client_user'] as $valor) {
                $this->db->insert('tb_client_users', [
                        'idClientFk' => $client['idClient'],
                        'idUserFk'   => $valor['idUserFk'],
                    ]
                );
            }
            // MAILS
            $this->db->delete('tb_client_mails', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_emails'] as $valor) {
                $this->db->insert('tb_client_mails', [
                        'idClientFk'     => $client['idClient'],
                        'mailTag'        => $valor['mailTag'],
                        'mailContact'    => $valor['mailContact'],
                        'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                        'status'         => $valor['status'],
                    ]
                );
            }

        }
        return true;

    }

    // ****************  //

    //  EDIFICIO //
    public function addBuilding($client) {
        $user = null;

        $this->db->select("*")->from("tb_clients");
        $this->db->where("tb_clients.name =", $client['name']);
        $query = $this->db->where("tb_clients.idClientTypeFk =", $client['idClientTypeFk'])->get();

        if ($query->num_rows() < 1) {


            $this->db->insert('tb_clients', [
                    'idClientTypeFk'          => $client['idClientTypeFk'],
                    'name'                    => $client['name'],
                    'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                    'address'                 => $client['address'],
                    'addressLat'              => $client['addressLat'],
                    'addressLon'              => $client['addressLon'],
                    'idLocationFk'            => $client['idLocationFk'],
                    'idProvinceFk'            => $client['idProvinceFk'],
                    'idAgentFk'               => $client['idAgentFk'],
                    'isNotCliente'            => $client['isNotCliente'],
                    'idClientAdminFk'         => $client['idClientAdminFk'],
                    'observationOrderKey'     => $client['observationOrderKey'],
                    'observationSericeTecnic' => $client['observationSericeTecnic'],
                    'observationCollection'   => $client['observationCollection'],
                    'observation'             => $client['observation'],
                    'idStatusFk'              => 1,
                    'departmentUnit'          => $client['departmentUnit'],
                    'departmentCorrelation'   => $client['departmentCorrelation'],
                    'idZonaFk'                => @$client['idZonaFk'],
                    'clientPhotosURL'         => @$client['clientPhotosURL'],
                ]
            );

            if ($this->db->affected_rows() === 1) {
                $idClientFk = $this->db->insert_id();

                // DATOS DE FACTURCION
                $this->db->insert('tb_client_billing_information', [
                        'idClientFk'          => $idClientFk,
                        'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                        'businessAddress'     => $client['billing_information']['nameAddress'],
                        'cuitBilling'         => $client['billing_information']['cuitBilling'],
                        'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                        'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                        'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                        'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                    ]
                );

                if (count(@$client['list_schedule_atention']) > 0
                    && count(@$client['list_departament']) > 0
                    && count(@$client['list_emails']) > 0
                    || count(@$client['list_phone_contact']) > 0
                    || count(@$client['list_client_user']) > 0
                ) {

                    // HORARIOS
                    foreach ($client['list_schedule_atention'] as $valor) {

                        $this->db->insert('tb_client_schedule_atention', [
                                'idClienteFk' => $idClientFk,
                                'day'         => $valor['day'],
                                'fronAm'      => $valor['fronAm'],
                                'toAm'        => $valor['toAm'],
                                'fronPm'      => $valor['fronPm'],
                                'toPm'        => $valor['toPm'],
                            ]
                        );
                    }


                    //  DEPARTAMENTO
                    foreach ($client['list_departament'] as $valor) {

                        $this->db->insert('tb_client_departament', [
                                'idClientFk'              => $idClientFk,
                                'floor'                   => $valor['floor'],
                                'departament'             => $valor['departament'],
                                'idCategoryDepartamentFk' => $valor['idCategoryDepartamentFk'],
                                'idStatusFk'              => 1,
                                'numberUNF'               => $valor['numberUNF'],
                            ]
                        );
                    }

                    //  TELEFONOS DE CONTACTO
                    if (isset($client['list_phone_contact']) && count($client['list_phone_contact']) > 0) {
                        foreach ($client['list_phone_contact'] as $valor) {

                            $this->db->insert('tb_client_phone_contact', [
                                    'idClientFk'   => $idClientFk,
                                    'phoneTag'     => $valor['phoneTag'],
                                    'phoneContact' => $valor['phoneContact'],
                                ]
                            );
                        }
                    }
                    //  USUARIOS DEL CONSORCIO
                     if (isset($client['list_client_user']) && count($client['list_client_user']) > 0) {
                        foreach ($client['list_client_user'] as $valor) {

                            $this->db->insert('tb_client_users', [
                                    'idClientFk' => $idClientFk,
                                    'idUserFk'   => $valor['idUserFk'],
                                ]
                            );
                        }
                    }
                    //  CONTACTOS DEL CONSORCIO
                    if (isset($client['list_client_contact_users']) && count($client['list_client_contact_users']) > 0) {
                        foreach ($client['list_client_contact_users'] as $valor) {

                            $this->db->insert('tb_client_contact_users', [
                                    'idClientFk' => $idClientFk,
                                    'idUserFk'   => $valor['idUserFk'],
                                ]
                            );
                        }
                    }
                    foreach ($client['list_emails'] as $valor) {
                        $this->db->insert('tb_client_mails', [
                                'idClientFk'     => $idClientFk,
                                'mailTag'        => $valor['mailTag'],
                                'mailContact'    => $valor['mailContact'],
                                'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                                'status'         => 1,
                            ]
                        );
                    }                    

                }
                return 1;
            } else {
                return 0;
            }

        } else {
            return 2;
        }


    }

    public function addNotCustomerDepto($client) {
        $this->db->insert('tb_client_departament', [
                'idClientFk'              => $client['idClient'],
                'floor'                   => $client['floor'],
                'departament'             => $client['department'],
                'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                'idStatusFk'              => 1,
                'numberUNF'               => 0,
            ]
        );
        if ($this->db->affected_rows() === 1) {
            $idDepto = $this->db->insert_id(); 
        }else{
            $idDepto = null;
        }      
        return $idDepto;
    }

    public function updateBuilding($client) {

        $this->db->set(
            [
                'name'                    => $client['name'],
                'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                'address'                 => $client['address'],
                'addressLat'              => $client['addressLat'],
                'addressLon'              => $client['addressLon'],
                'idAgentFk'               => $client['idAgentFk'],
                'isNotCliente'            => $client['isNotCliente'],
                'idClientAdminFk'         => $client['idClientAdminFk'],
                'observationOrderKey'     => $client['observationOrderKey'],
                'observationSericeTecnic' => $client['observationSericeTecnic'],
                'observationCollection'   => $client['observationCollection'],
                'observation'             => $client['observation'],
                'idStatusFk'              => $client['idStatusFk'],
                'idZonaFk'                => @$client['idZonaFk'],
                'departmentUnit'          => $client['departmentUnit'],
                'departmentCorrelation'   => $client['departmentCorrelation'],
                'clientPhotosURL'         => @$client['clientPhotosURL'],
            ]
        )->where("idClient", $client['idClient'])->update("tb_clients");

        // DATOS DE FACTURACION
        if ($client['isNotCliente'] == 1 || $client['isBillingInformationEmpty'] == 1){

            $this->db->insert('tb_client_billing_information', [
                    'idClientFk'          => $client['idClient'],
                    'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                    'businessAddress'     => $client['billing_information']['nameAddress'],
                    'cuitBilling'         => $client['billing_information']['cuitBilling'],
                    'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                    'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                    'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                    'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                ]
            );
        }else{
            $this->db->set(
                [
                    'idClientFk'          => $client['idClient'],
                    'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                    'businessAddress'     => $client['billing_information']['nameAddress'],
                    'cuitBilling'         => $client['billing_information']['cuitBilling'],
                    'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                    'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                    'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                    'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'] ]
            )->where("idClientFk", $client['idClient'])->update("tb_client_billing_information");            
        }

        if (count(@$client['list_schedule_atention']) > 0
            && count(@$client['list_departament']) > 0
            || count(@$client['list_emails']) > 0
            || count(@$client['list_phone_contact']) > 0
            || count(@$client['list_client_user']) > 0
        ) {
            $this->db->delete('tb_client_schedule_atention', [ 'idClienteFk' => $client['idClient'] ]);
            foreach ($client['list_schedule_atention'] as $valor) {

                $this->db->insert('tb_client_schedule_atention', [
                    'idClienteFk' => $client['idClient'],
                    'day'         => $valor['day'],
                    'fronAm'      => $valor['fronAm'],
                    'toAm'        => $valor['toAm'],
                    'fronPm'      => $valor['fronPm'],
                    'toPm'        => $valor['toPm'],
                ]);
            }

            //$this->db->delete('tb_client_departament', [ 'idClientFk' => $client['idClient'] ]);

            // DEPARTAMENTO
            foreach ($client['list_departament'] as $valor) {
                if ($valor['idClientDepartament'] == 0) { //si el valor es 0 entonces se crea un nuevo registro
                    $this->db->insert('tb_client_departament', [
                            'idClientFk'              => $client['idClient'],
                            'floor'                   => $valor['floor'],
                            'departament'             => $valor['departament'],
                            'idCategoryDepartamentFk' => $valor['idCategoryDepartamentFk'],
                            'idStatusFk'              => 1,
                            'numberUNF'               => $valor['numberUNF'],
                            //'idStatusFk'              => $valor['idStatusFk'],
                        ]
                    );
                } else { //si no pues edito
                    $this->db->set(
                        [
                            //'idClientFk'              => $client['idClient'],
                            'floor'                   => $valor['floor'],
                            'departament'             => $valor['departament'],
                            'idCategoryDepartamentFk' => $valor['idCategoryDepartamentFk'],
                            'numberUNF'               => $valor['numberUNF'],
                            'idStatusFk'              => $valor['idStatusFk'],

                        ]
                    )->where("idClientDepartament", $valor['idClientDepartament'])->update("tb_client_departament");
                }
            }
            // TELEFONOS
            $this->db->delete('tb_client_phone_contact', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_phone_contact'] as $valor) {

                $this->db->insert('tb_client_phone_contact', [
                    'idClientFk'   => $client['idClient'],
                    'phoneTag'     => $valor['phoneTag'],
                    'phoneContact' => $valor['phoneContact'],
                ]);
            }
            // USUARIOS DEL CONSORCIO
            $this->db->delete('tb_client_users', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_client_user'] as $valor) {
                $this->db->insert('tb_client_users', [
                        'idClientFk' => $client['idClient'],
                        'idUserFk'   => $valor['idUserFk'],
                    ]
                );
            }
            // CONTACTOS DEL CONSORCIO
            $this->db->delete('tb_client_contact_users', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_client_contact_users'] as $valor) {
                $this->db->insert('tb_client_contact_users', [
                        'idClientFk' => $client['idClient'],
                        'idUserFk'   => $valor['idUserFk'],
                    ]
                );
            }
            // MAILS
            $this->db->delete('tb_client_mails', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_emails'] as $valor) {
                $this->db->insert('tb_client_mails', [
                        'idClientFk'     => $client['idClient'],
                        'mailTag'        => $valor['mailTag'],
                        'mailContact'    => $valor['mailContact'],
                        'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                        'status'         => $valor['status'],
                    ]
                );
            }


        }
         return true;

    }
	// ****************  //
	//PARA GENERAR EL IdSecurityCode DEL CLIENTE
	function generateRandomString ($length = 5)
	{
        //$characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$characters       = '0123456789abcdefghijklmnopqrstuvwxyz';
		$charactersLength = strlen($characters);
		$randomString     = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}

	public function getSegurityCodeClient ($idClient)
	{
		$code = null;
		do {
			$code  = $this->generateRandomString();
			$query = $this->db->select("*")->from("tb_clients")->where('IdSecurityCode', $code)->get();
		} while ($query->num_rows() > 0);

		$this->db->set(
			[
				'idSecurityCode' => $code,
			]
		)->where("idClient", $idClient)->update("tb_clients");

		return $code;

	}

    public function customerIsInDebt ($idClient)
	{
		$this->db->select("tb_clients.idClient, tb_clients.name,tb_clients.address,tb_clients.idClientTypeFk, tb_clients.idStatusFk,tb_clients.IsInDebt,tb_clients.clientPhotosURL,tb_client_type.ClientType,tb_location.location,tb_province.province")->from("tb_clients");
        $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
        $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
        $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
        $query = $this->db->where('idClient', $idClient)->get();
		if ($query->num_rows() == 1) {
			$client = $query->row_array();
            return $client;
		} else {
			return null;
		}

	}
    // ****************  //


    // EMPRESA //
    public function addCompany($client) {
        $idClientDepartamentFk = null;
        $idDepartmentKf        = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idDepartmentFk'] == null || $client['idDepartmentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idDepartmentKf = $this->db->insert_id();
            } else {
                $idDepartmentKf = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idDepartmentKf = $client['idDepartmentFk'];
        }
        $user = null;
        $this->db->select("*")->from("tb_clients");
        $this->db->where("tb_clients.name =", $client['name']);
        $query = $this->db->where("tb_clients.idClientTypeFk =", $client['idClientTypeFk'])->get();

        if ($query->num_rows() < 1) {
            $this->db->insert('tb_clients', [
                    'idClientTypeFk'          => $client['idClientTypeFk'],
                    'name'                    => $client['name'],
                    'address'                 => $client['address'],
                    'addressLat'              => $client['addressLat'],
                    'addressLon'              => $client['addressLon'],
                    'idAgentFk'               => $client['idAgentFk'],
                    'businessName'            => $client['businessName'],
                    'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                    'CUIT'                    => $client['CUIT'],
                    'idStatusFk'              => 1,
                    'idLocationFk'            => $client['idLocationFk'],
                    'idProvinceFk'            => $client['idProvinceFk'],
                    'observationSericeTecnic' => $client['observationSericeTecnic'],
                    'observationCollection'   => $client['observationCollection'],
                    'pageWeb'                 => $client['pageWeb'],
                    'observation'             => $client['observation'],
                    'idZonaFk'                => @$client['idZonaFk'],
                    'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],
                    'idClientDepartamentFk'   => @$idDepartmentKf,
                    'clientPhotosURL'         => @$client['clientPhotosURL'],
                ]
            );
            if ($this->db->affected_rows() === 1) {
                $idClientFk = $this->db->insert_id();

                // DATOS DE FACTURCION
                $this->db->insert('tb_client_billing_information', [
                        'idClientFk'          => $idClientFk,
                        'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                        'businessAddress'     => $client['billing_information']['nameAddress'],                        
                        'cuitBilling'         => $client['billing_information']['cuitBilling'],
                        'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                        'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                        'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                        'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                    ]
                );

                if (count(@$client['list_schedule_atention']) > 0
                    && count(@$client['list_phone_contact']) > 0
                    && count(@$client['list_emails']) > 0
                    || count(@$client['list_client_user']) > 0
                ) {

                    // HORARIOS
                    foreach ($client['list_schedule_atention'] as $valor) {

                        $this->db->insert('tb_client_schedule_atention', [
                                'idClienteFk' => $idClientFk,
                                'day'         => $valor['day'],
                                'fronAm'      => $valor['fronAm'],
                                'toAm'        => $valor['toAm'],
                                'fronPm'      => $valor['fronPm'],
                                'toPm'        => $valor['toPm'],
                            ]
                        );
                    }
                    //  TELEFONOS DE CONTACTO
                    foreach (@$client['list_phone_contact'] as $valor) {

                        $this->db->insert('tb_client_phone_contact', [
                                'idClientFk'   => $idClientFk,
                                'phoneTag'     => $valor['phoneTag'],
                                'phoneContact' => $valor['phoneContact'],
                            ]
                        );
                    }

                    //  USUARIOS DE LA EMPRESA
                    foreach ($client['list_client_user'] as $valor) {

                        $this->db->insert('tb_client_users', [
                                'idClientFk' => $idClientFk,
                                'idUserFk'   => $valor['idUserFk'],
                            ]
                        );
                    }
                    // MAILS
                    foreach ($client['list_emails'] as $valor) {
                        $this->db->insert('tb_client_mails', [
                                'idClientFk'     => $idClientFk,
                                'mailTag'        => $valor['mailTag'],
                                'mailContact'    => $valor['mailContact'],
                                'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                                'status'         => 1,
                            ]
                        );
                    }                    
                }

                return 1;
            } else {
                return 0;
            }

        } else {
            return 2;
        }


    }

    public function updateCompany($client) {

        $idClientDepartamentFk = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idClientDepartamentFk'] == null || $client['idClientDepartamentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
            } else {
                $idClientDepartamentFk = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idClientDepartamentFk = $client['idClientDepartamentFk'];
        }
        $this->db->set(
            [
                'name'                    => $client['name'],
                'address'                 => $client['address'],
                'addressLat'              => $client['addressLat'],
                'addressLon'              => $client['addressLon'],
                'idAgentFk'               => $client['idAgentFk'],
                'businessName'            => $client['businessName'],
                'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                'CUIT'                    => $client['CUIT'],
                'idLocationFk'            => $client['idLocationFk'],
                'idProvinceFk'            => $client['idProvinceFk'],
                'observationSericeTecnic' => $client['observationSericeTecnic'],
                'observationCollection'   => $client['observationCollection'],
                'pageWeb'                 => $client['pageWeb'],
                'observation'             => $client['observation'],
                'idZonaFk'                => @$client['idZonaFk'],
                'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],
                'idClientDepartamentFk'   => @$idClientDepartamentFk,
                'clientPhotosURL'         => @$client['clientPhotosURL'],
            ]
        )->where("idClient", $client['idClient'])->update("tb_clients");


        $this->db->set(
            [
                'idClientFk'          => $client['idClient'],
                'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                'businessAddress'     => $client['billing_information']['nameAddress'],
                'cuitBilling'         => $client['billing_information']['cuitBilling'],
                'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'] ]
        )->where("idClientFk", $client['idClient'])->update("tb_client_billing_information");


        if (count(@$client['list_schedule_atention']) > 0
            && count(@$client['list_phone_contact']) > 0
            && count(@$client['list_emails']) > 0
            || count(@$client['list_client_user']) > 0
        ) {
            $this->db->delete('tb_client_schedule_atention', [ 'idClienteFk' => $client['idClient'] ]);

            foreach ($client['list_schedule_atention'] as $valor) {

                $this->db->insert('tb_client_schedule_atention', [
                    'idClienteFk' => $client['idClient'],
                    'day'         => $valor['day'],
                    'fronAm'      => $valor['fronAm'],
                    'toAm'        => $valor['toAm'],
                    'fronPm'      => $valor['fronPm'],
                    'toPm'        => $valor['toPm'],
                ]);
            }
            // TELEFONOS
            $this->db->delete('tb_client_phone_contact', [ 'idClientFk' => $client['idClient'] ]);

            foreach ($client['list_phone_contact'] as $valor) {

                $this->db->insert('tb_client_phone_contact', [
                    'idClientFk'   => $client['idClient'],
                    'phoneTag'     => $valor['phoneTag'],
                    'phoneContact' => $valor['phoneContact'],
                ]);
            }
            // USERS
            $this->db->delete('tb_client_users', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_client_user'] as $valor) {

                $this->db->insert('tb_client_users', [
                        'idClientFk' => $client['idClient'],
                        'idUserFk'   => $valor['idUserFk'],
                    ]
                );
            }
            // MAILS
            $this->db->delete('tb_client_mails', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_emails'] as $valor) {
                $this->db->insert('tb_client_mails', [
                        'idClientFk'     => $client['idClient'],
                        'mailTag'        => $valor['mailTag'],
                        'mailContact'    => $valor['mailContact'],
                        'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                        'status'         => $valor['status'],
                    ]
                );
            }


            return true;
        }

    }

    // ****************  //

    // SUCURSAL //
    public function addBranch($client) {
        $idClientDepartamentFk = null;
        $idDepartmentKf        = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idDepartmentFk'] == null || $client['idDepartmentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idDepartmentKf = $this->db->insert_id();
            } else {
                $idDepartmentKf = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idDepartmentKf = $client['idDepartmentFk'];
        }
        $user = null;

        $this->db->select("*")->from("tb_clients");
        $this->db->where("tb_clients.name =", $client['name']);
        $query = $this->db->where("tb_clients.idClientTypeFk =", $client['idClientTypeFk'])->get();

        if ($query->num_rows() < 1) {


            $this->db->insert('tb_clients', [
                    'idClientTypeFk'          => $client['idClientTypeFk'],
                    'address'                 => $client['address'],
                    'name'                    => $client['name'],
                    'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                    'addressLat'              => $client['addressLat'],
                    'addressLon'              => $client['addressLon'],
                    'idLocationFk'            => $client['idLocationFk'],
                    'idProvinceFk'            => $client['idProvinceFk'],
                    'isNotCliente'            => $client['isNotCliente'],
                    'idStatusFk'              => 1,
                    'idClientCompaniFk'       => $client['idClientCompaniFk'],
                    'observationSericeTecnic' => $client['observationSericeTecnic'],
                    'observationCollection'   => $client['observationCollection'],
                    'observation'             => $client['observation'],
                    'idZonaFk'                => @$client['idZonaFk'],
                    'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],                    
                    'idClientDepartamentFk'   => @$idDepartmentKf,
                    'clientPhotosURL'         => @$client['clientPhotosURL'],
                ]
            );

            if ($this->db->affected_rows() === 1) {
                $idClientFk = $this->db->insert_id();

                // DATOS DE FACTURCION
                $this->db->insert('tb_client_billing_information', [
                        'idClientFk'          => $idClientFk,
                        'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                        'businessAddress'     => $client['billing_information']['nameAddress'],
                        'cuitBilling'         => $client['billing_information']['cuitBilling'],
                        'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                        'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                        'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                        'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                    ]
                );

                if (count(@$client['list_schedule_atention']) > 0
                    || count(@$client['list_phone_contact']) > 0
                    || count(@$client['list_emails']) > 0
                ) {

                    // HORARIOS
                    foreach ($client['list_schedule_atention'] as $valor) {

                        $this->db->insert('tb_client_schedule_atention', [
                                'idClienteFk' => $idClientFk,
                                'day'         => $valor['day'],
                                'fronAm'      => $valor['fronAm'],
                                'toAm'        => $valor['toAm'],
                                'fronPm'      => $valor['fronPm'],
                                'toPm'        => $valor['toPm'],
                            ]
                        );
                    }
                    // USERS
                    foreach ($client['list_phone_contact'] as $valor) {

                        $this->db->insert('tb_client_phone_contact', [
                                'idClientFk'   => $idClientFk,
                                'phoneTag'     => $valor['phoneTag'],
                                'phoneContact' => $valor['phoneContact'],
                            ]
                        );
                    }
                    // MAILS
                    foreach ($client['list_emails'] as $valor) {
                        $this->db->insert('tb_client_mails', [
                                'idClientFk'     => $idClientFk,
                                'mailTag'        => $valor['mailTag'],
                                'mailContact'    => $valor['mailContact'],
                                'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                                'status'         => 1,
                            ]
                        );
                    }                    
                }
                return 1;
            } else {
                return 0;
            }

        } else {
            return 2;
        }


    }

    public function updateBranch($client) {
        $idClientDepartamentFk = null;
        if ($client['idTipoInmuebleFk'] == '1' && ($client['idClientDepartamentFk'] == null || $client['idClientDepartamentFk'] == "")) { //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
            $idClientDepartamentFk = $this->searchAddress($client['address'], $client['idProvinceFk'], $client['idLocationFk']);
            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                $this->db->insert('tb_clients', [
                        'idClientTypeFk'    => 2,
                        'name'              => $client['address'],
                        'address'           => $client['address'],
                        'isNotCliente'      => 1,
                        'idStatusFk'        => 0,
                        'addressLat'        => $client['addressLat'],
                        'addressLon'        => $client['addressLon'],
                        'idLocationFk'      => $client['idLocationFk'],
                        'idProvinceFk'      => $client['idProvinceFk'],
                        'clientPhotosURL'   => @$client['clientPhotosURL'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
                //  DEPARTAMENTO
                $this->db->insert('tb_client_departament', [
                        'idClientFk'              => $idClientDepartamentFk,
                        'floor'                   => $client['floor'],
                        'departament'             => $client['department'],
                        'idCategoryDepartamentFk' => $client['idCategoryDepartamentFk'],
                        'idStatusFk'              => 1,
                        'numberUNF'               => $client['numberUNF'],
                    ]
                );
                $idClientDepartamentFk = $this->db->insert_id();
            } else {
                $idClientDepartamentFk = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
            }
        } else {
            $idClientDepartamentFk = $client['idClientDepartamentFk'];
        }

        $this->db->set(
            [
                'name'                    => $client['name'],
                'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                'address'                 => $client['address'],
                'addressLat'              => $client['addressLat'],
                'addressLon'              => $client['addressLon'],
                'idLocationFk'            => $client['idLocationFk'],
                'idProvinceFk'            => $client['idProvinceFk'],
                'isNotCliente'            => $client['isNotCliente'],
                'idClientCompaniFk'       => $client['idClientCompaniFk'],
                'observationSericeTecnic' => $client['observationSericeTecnic'],
                'observationCollection'   => $client['observationCollection'],
                'observation'             => $client['observation'],
                'idZonaFk'                => @$client['idZonaFk'],
                'idTipoInmuebleFk'        => @$client['idTipoInmuebleFk'],                
                'idClientDepartamentFk'   => @$idClientDepartamentFk,
                'clientPhotosURL'         => @$client['clientPhotosURL'],
            ]
        )->where("idClient", $client['idClient'])->update("tb_clients");


        $this->db->set(
            [
                'idClientFk'          => $client['idClient'],
                'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                'businessAddress'     => $client['billing_information']['nameAddress'],
                'cuitBilling'         => $client['billing_information']['cuitBilling'],
                'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'] ]
        )->where("idClientFk", $client['idClient'])->update("tb_client_billing_information");

        if (count(@$client['list_schedule_atention']) > 0
            && count(@$client['list_phone_contact']) > 0
            || count(@$client['list_emails']) > 0
            || count(@$client['list_client_user']) > 0
        ) {
            $this->db->delete('tb_client_schedule_atention', [ 'idClienteFk' => $client['idClient'] ]);

            foreach ($client['list_schedule_atention'] as $valor) {

                $this->db->insert('tb_client_schedule_atention', [
                    'idClienteFk' => $client['idClient'],
                    'day'         => $valor['day'],
                    'fronAm'      => $valor['fronAm'],
                    'toAm'        => $valor['toAm'],
                    'fronPm'      => $valor['fronPm'],
                    'toPm'        => $valor['toPm'],
                ]);
            }

            // TELEFONOS
            $this->db->delete('tb_client_phone_contact', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_phone_contact'] as $valor) {

                $this->db->insert('tb_client_phone_contact', [
                    'idClientFk'   => $client['idClient'],
                    'phoneTag'     => $valor['phoneTag'],
                    'phoneContact' => $valor['phoneContact'],
                ]);
            }
            // USERS
            $this->db->delete('tb_client_users', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_client_user'] as $valor) {

                $this->db->insert('tb_client_users', [
                        'idClientFk' => $client['idClient'],
                        'idUserFk'   => $valor['idUserFk'],
                    ]
                );
            }
            // MAILS
            $this->db->delete('tb_client_mails', [ 'idClientFk' => $client['idClient'] ]);
            foreach ($client['list_emails'] as $valor) {
                $this->db->insert('tb_client_mails', [
                        'idClientFk'     => $client['idClient'],
                        'mailTag'        => $valor['mailTag'],
                        'mailContact'    => $valor['mailContact'],
                        'idTipoDeMailFk' => $valor['idTipoDeMailFk'],
                        'status'         => $valor['status'],
                    ]
                );
            }
            
        }
        return true;

    }

    // ****************  //


    // PARTICULAR //
    public function addParticular($client) {
        $idClientDepartamentFk = null;
        $idDepartmentKf        = null;
        $user                  = null;

        $this->db->select("*")->from("tb_clients");
        $this->db->where("tb_clients.name =", $client['name']);
        $query = $this->db->where("tb_clients.idClientTypeFk =", $client['idClientTypeFk'])->get();

        if ($query->num_rows() < 1) {
            $this->db->insert('tb_clients', [
                    'idClientTypeFk'          => $client['idClientTypeFk'],
                    'name'                    => $client['name'],
                    'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                    'address'                 => $client['address'],
                    'addressLat'              => $client['addressLat'],
                    'addressLon'              => $client['addressLon'],
                    'idAgentFk'               => $client['idAgentFk'],
                    'isNotCliente'            => $client['isNotCliente'],
                    'idStatusFk'              => 1,
                    'idLocationFk'            => $client['idLocationFk'],
                    'idProvinceFk'            => $client['idProvinceFk'],
                    'observation'             => $client['observation'],
                    'phoneMobile'             => $client['mobile'],
                    'phoneLocal'              => $client['local'],
                    'mail'                    => $client['mail'],
                    'clientPhotosURL'         => @$client['clientPhotosURL'],
                ]
            );
            if ($this->db->affected_rows() === 1) {
                $idClientFk = $this->db->insert_id();

                // DATOS DE FACTURCION
                $this->db->insert('tb_client_billing_information', [
                        'idClientFk'          => $idClientFk,
                        'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                        'businessAddress'     => $client['billing_information']['nameAddress'],
                        'cuitBilling'         => $client['billing_information']['cuitBilling'],
                        'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                        'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                        'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                        'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'],
                    ]
                );

                if (count(@$client['list_address_particular']) > 0
                    && count(@$client['list_phone_contact']) > 0 
                ) {

                    //  TELEFONOS DE CONTACTO
                    foreach (@$client['list_phone_contact'] as $valor) {
                        $this->db->insert('tb_client_phone_contact', [
                                'idClientFk'   => $idClientFk,
                                'phoneTag'     => $valor['phoneTag'],
                                'phoneContact' => $valor['phoneContact'],
                            ]
                        );
                    }
                    //  DIRECCIONES DE UN PARTICULAR
                    foreach ($client['list_address_particular'] as $valor) {
                        $idClientDepartamentFk = null;
                        $idDepartmentKf        = null;
                        //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
                        if ($valor['idTipoInmuebleFk'] == '1' && ($client['idDepartmentFk'] == null || $client['idDepartmentFk'] == "")) {
                            $idClientDepartamentFk = $this->searchAddress($valor['address'], $valor['idProvinceFk'], $valor['idLocationFk']);
                            if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                                $this->db->insert('tb_clients', [
                                        'idClientTypeFk' => 2,
                                        'name'           => $valor['address'],
                                        'address'        => $valor['address'],
                                        'isNotCliente'   => 1,
                                        'idStatusFk'     => 0,
                                        'addressLat'     => $valor['addressLat'],
                                        'addressLon'     => $valor['addressLon'],
                                        'idLocationFk'   => $valor['idLocationFk'],
                                        'idProvinceFk'   => $valor['idProvinceFk'],
                                    ]
                                );
                                $idClientDepartamentFk = $this->db->insert_id();
                                //  DEPARTAMENTO
                                $this->db->insert('tb_client_departament', [
                                        'idClientFk'              => $idClientDepartamentFk,
                                        'floor'                   => $valor['floor'],
                                        'departament'             => $valor['department'],
                                        'idCategoryDepartamentFk' => $valor['idCategoryDepartamentFk'],
                                        'idStatusFk'              => 1,
                                        'numberUNF'               => $valor['numberUNF'],
                                    ]
                                );
                                $idDepartmentKf = $this->db->insert_id();
                            } else {
                                $idDepartmentKf = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $client['floor'], $client['department']);
                            }
                        } else {

                            $idDepartmentKf = $client['idDepartmentFk'];
                        }
                        $this->db->insert('tb_client_address_particular', [
                                'idClientFk'                => $idClientFk,
                                'address'                   => $valor['address'],
                                'depto'                     => $valor['depto'],
                                //'isBuilding'                => $valor['isBuilding'],
                                'idProvinceFk'              => $valor['idProvinceFk'],
                                'idLocationFk'              => $valor['idLocationFk'],
                                'clarification'             => $valor['clarification'],
                                'addressLat'                => $valor['addressLat'],
                                'addressLon'                => $valor['addressLon'],
                                'idTipoInmuebleFk'          => $valor['idTipoInmuebleFk'],
                                'idParticularDepartamentKf' => @$idDepartmentKf,
                                'idZonaFk'                  => $valor['idZonaFk'],
                            ]
                        );
                    }
                }

                return 1;
            } else {
                return 0;
            }

        } else {
            return 2;
        }


    }

    public function updateParticular($client) {
        $this->db->set(
            [
                'name'                    => $client['name'],
                'idClientAssociated_SE'   => $client['idClientAssociated_SE'],
                'address'                 => $client['address'],
                'addressLat'              => $client['addressLat'],
                'addressLon'              => $client['addressLon'],
                'idAgentFk'               => $client['idAgentFk'],
                'isNotCliente'            => $client['isNotCliente'],
                'idStatusFk'              => $client['idStatusFk'],
                'idLocationFk'            => $client['idLocationFk'],
                'idProvinceFk'            => $client['idProvinceFk'],
                'observation'             => $client['observation'],
                'phoneMobile'             => $client['mobile'],
                'phoneLocal'              => $client['local'],
                'mail'                    => $client['mail'],
                'clientPhotosURL'         => @$client['clientPhotosURL'],

            ]
        )->where("idClient", $client['idClient'])->update("tb_clients");


        $this->db->set(
            [
                'idClientFk'          => $client['idClient'],
                'businessNameBilling' => $client['billing_information']['businessNameBilling'],
                'businessAddress'     => $client['billing_information']['nameAddress'],
                'cuitBilling'         => $client['billing_information']['cuitBilling'],
                'idLocationBillingFk' => $client['billing_information']['idLocationBillingFk'],
                'idProvinceBillingFk' => $client['billing_information']['idProvinceBillingFk'],
                'idTypeTaxFk'         => $client['billing_information']['idTypeTaxFk'],
                'idCostCenterFk'      => $client['billing_information']['idCostCenterFk'] ]
        )->where("idClientFk", $client['idClient'])->update("tb_client_billing_information");


        if (count(@$client['list_address_particular']) > 0
            && count(@$client['list_phone_contact']) > 0 
        ){

            //TELEFONOS DE CONTACTO
            $this->db->delete('tb_client_phone_contact', [ 'idClientFk' => $client['idClient'] ]);

            foreach ($client['list_phone_contact'] as $valor) {

                $this->db->insert('tb_client_phone_contact', [
                    'idClientFk'   => $client['idClient'],
                    'phoneTag'     => $valor['phoneTag'],
                    'phoneContact' => $valor['phoneContact'],
                ]);
            }
            $this->db->delete('tb_client_address_particular', [ 'idClientFk' => $client['idClient'] ]);

            //DIRECCIONES DE UN PARTICULAR
            foreach ($client['list_address_particular'] as $valor) {
                $idClientDepartamentFk = null;
                $idDepartmentKf        = null;
                //SI EL TIPO DE INMUEBLE ES DEPARTAMENTO
                if ($valor['idTipoInmuebleFk'] == '1' && ($client['idClientDepartamentFk'] == null || $client['idClientDepartamentFk'] == "")) {
                    $idClientDepartamentFk = $this->searchAddress($valor['address'], $valor['idProvinceFk'], $valor['idLocationFk']);
                    if ($idClientDepartamentFk == '0') { //SI NO EXISTE LA DIRECCION
                        $this->db->insert('tb_clients', [
                                'idClientTypeFk' => 2,
                                'name'           => $valor['address'],
                                'address'        => $valor['address'],
                                'isNotCliente'   => 1,
                                'idStatusFk'     => 0,
                                'addressLat'     => $valor['addressLat'],
                                'addressLon'     => $valor['addressLon'],
                                'idLocationFk'   => $valor['idLocationFk'],
                                'idProvinceFk'   => $valor['idProvinceFk'],
                            ]
                        );
                        $idClientDepartamentFk = $this->db->insert_id();
                        //  DEPARTAMENTO
                        $this->db->insert('tb_client_departament', [
                                'idClientFk'              => $idClientDepartamentFk,
                                'floor'                   => $valor['floor'],
                                'departament'             => $valor['department'],
                                'idCategoryDepartamentFk' => 1,
                                'idStatusFk'              => 1,
                                'numberUNF'               => null,
                            ]
                        );
                        $idDepartmentKf = $this->db->insert_id();
                    } else {
                        $floor = explode("-",$valor['depto'])[0];
                        $department = explode("-",$valor['depto'])[1];
                        $idDepartmentKf = $this->getDepartmentId($idClientDepartamentFk[0]['idClient'], $floor, $department);
                    }
                } else {

                    $idDepartmentKf = @$client['idDepartmentFk'];
                }
                $this->db->insert('tb_client_address_particular', [
                        'idClientFk'                => $client['idClient'],
                        'address'                   => $valor['address'],
                        'depto'                     => @$valor['depto'],
                        //'isBuilding'                => $valor['isBuilding'],
                        'idProvinceFk'              => $valor['idProvinceFk'],
                        'idLocationFk'              => $valor['idLocationFk'],
                        'clarification'             => $valor['clarification'],
                        'addressLat'                => $valor['addressLat'],
                        'addressLon'                => $valor['addressLon'],
                        'idTipoInmuebleFk'          => $valor['idTipoInmuebleFk'],
                        'idParticularDepartamentKf' => @$idDepartmentKf,
                        'idZonaFk'                  => $valor['idZonaFk'],
                    ]
                );
            }

        }
        return true;

    }

    public function getListCustomersById($idClient = null) {
        $quuery      = null;
        $rs          = null;
        if (! is_null($idClient)) {

            $this->db->select("*")->from("tb_clients");
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
            $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
            $quuery = $this->db->where("tb_clients.idClient =", $idClient)->get();


            if ($quuery->num_rows() === 1) {
                //$rs["client"] = $quuery->row_array();
                //SEARCH BUILDING AND BRANCH
                $where="tb_clients.idClientAdminFk=".$idClient." OR tb_clients.idClientCompaniFk=".$idClient;
                $this->db->select("*")->from("tb_clients");
                $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
                $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
                $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
                $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
                
                $quuery = $this->db->where($where)->get();
                if ($quuery->num_rows() > 0) {
                    $rs = $quuery->result_array();
                    $i = 0;
                    foreach ($quuery->result() as &$row) {

                        $this->db->select("*")->from("tb_client_schedule_atention");
                        $quuery = $this->db->where("tb_client_schedule_atention.idClienteFk =", $row->idClient)->get();

                        $rs1 = $quuery->result_array();
                        $rs[$i]['list_schedule_atention'] = $rs1;


                        $this->db->select("*")->from("tb_client_phone_contact");
                        $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $row->idClient)->get();

                        $rs2 = $quuery->result_array();
                        $rs[$i]['list_phone_contact'] = $rs2;


                        $this->db->select("*")->from("tb_client_users");
                        $this->db->join('tb_user', 'tb_user.idUser = tb_client_users.idUserFk', 'inner');
                        $quuery = $this->db->where("tb_client_users.idClientFk =", $row->idClient)->get();

                        $rs3 = $quuery->result_array();
                        $rs[$i]['list_client_user'] = $rs3;

                        $this->db->select("*")->from("tb_client_contact_users");
                        $this->db->join('tb_user', 'tb_user.idUser = tb_client_contact_users.idUserFk', 'inner');
                        $quuery = $this->db->where("tb_client_contact_users.idClientFk =", $row->idClient)->get();

                        $rs3 = $quuery->result_array();
                        $rs[$i]['list_client_contact_users'] = $rs3;

                        $this->db->select("*")->from("tb_client_mails");
                        $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                        $quuery = $this->db->where("tb_client_mails.idClientFk =", $row->idClient)->get();

                        $rs4 = $quuery->result_array();
                        $rs[$i]['list_emails'] = $rs4;


                        // DATOS DE FACTURCION
                        $this->db->select("*")->from("tb_client_billing_information");
                        $this->db->join('tb_tax', 'tb_tax.idTypeTax = tb_client_billing_information.idTypeTaxFk', 'inner');
                        $this->db->join('tb_location', 'tb_location.idLocation = tb_client_billing_information.idLocationBillingFk', 'inner');
                        $this->db->join('tb_province', 'tb_province.idProvince = tb_client_billing_information.idProvinceBillingFk', 'inner');
                        $quuery = $this->db->where("tb_client_billing_information.idClientFk =", $row->idClient)->get();

                        $rs5 = $quuery->result_array();
                        $rs[$i]['billing_information'] = $rs5;

                        //DEPARTAMENTOS
                        $this->db->select("*")->from("tb_client_departament");
                        $this->db->join('tb_category_departament', 'tb_category_departament.idCategoryDepartament = tb_client_departament.idCategoryDepartamentFk', 'left');
                        $quuery = $this->db->where("tb_client_departament.idClientFk =", $row->idClient)->get();

                        $rs6 = $quuery->result_array();
                        $rs[$i]['list_departament'] = $rs6;

                        // INITIAL DELIVERY DATA
                        $this->db->select("*")->from("tb_client_initial_delivery");
                        $quuery = $this->db->where("tb_client_initial_delivery.idClientKf =", $row->idClient)->get();

                        $rs7                       = $quuery->result_array();
                        $rs[$i]['initial_delivery']    = $rs7;
                        if($quuery->num_rows()>0){
                            //print_r($rs['customers'][$i]['initial_delivery'][0]['expirationDate']);
                            $dateString = $rs[$i]['initial_delivery'][0]['expirationDate']; 
                            // Date string to compare
                            // Convert date string to a DateTime object
                            $dateToCompare = new DateTime($dateString);
                            
                            // Get the current date as a DateTime object
                            $now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));

                            $dateToCompareFormatted = $dateToCompare->format('Y-m-d');
                            $currentDateFormatted = $now->format('Y-m-d');
                            //print_r("currentDate   : ".$currentDateFormatted);
                            //print("dateString    : ".$dateString);
                            //print("dateToCompare : ".$dateToCompareFormatted);
                            //print("currentDate   : ".$currentDate);
                            if ($currentDateFormatted > $dateToCompareFormatted) {
                                $rs[$i]['initial_delivery'][0]['expiration_state'] = true;
                            }else{
                                $rs[$i]['initial_delivery'][0]['expiration_state'] = false;
                            }
                        }

                        $i++;
                    }
                    return $rs;
                }
                return null;
            }

            return null;
        }else{
            return null;
        }


    }

    public function searchAddress($address, $idProvince, $idLocation) {
        $user = null;
        $this->db->select("*")->from("tb_clients");
        if ($idProvince != null && $idLocation != null) {
            $where = "address=\"$address\" AND idProvinceFk=\"$idProvince\" AND idLocationFk=\"$idLocation\"";
        } else {
            $where = "address=\"$address\"";
        }
        $this->db->where($where);
        $query = $this->db->where("tb_clients.idClientTypeFk =", 2)->get();

        if ($query->num_rows() > 0) {
            $rs = $query->result_array();

            return $rs;
        } else {
            return 0;
        }
    }

    //SEARCH DEPARTMENT BY CLIENTID | FLOOR | DEPARTMENT
    public function getDepartmentId($clientId, $floor, $department) {

        $where = "idClientFk=\"$clientId\" AND floor=\"$floor\" AND departament=\"$department\"";
        $this->db->select("idClientDepartament")->from("tb_client_departament");
        $query = $this->db->where($where)->get();

        if ($query->num_rows() > 0) {
            $rs = $query->row();

            return $rs->idClientDepartament;
        } else {
            return 0;
        }
    }

    public function delete($idClient) {

        $this->db->set(
            [ 'idStatusFk' => -1 ])->where("idClient", $idClient)->update("tb_clients");

        return true;


    }

    public function getadmin($id, $searchFilter, $idClientTypeFk, $isInDebt, $isStockInBuilding, $isStockInOffice,  $isNotCliente, $limit = '', $start = '', $strict = null, $totalCount = null){
        $quuery         = null;
        $query_total    = null;
        $rs             = null;
        $where          = null;

        //echo isset($limit)."\n";
        //echo isset($start);
        
        if (! is_null($id)) {

            $this->db->select("*")->from("tb_clients");
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
            $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
            $quuery = $this->db->where("tb_clients.idClient =", $id)->get();

            if ($quuery->num_rows() === 1) {
                $rs = $quuery->row_array();


                $this->db->select("*")->from("tb_client_schedule_atention");
                $quuery = $this->db->where("tb_client_schedule_atention.idClienteFk =", $id)->get();

                $rs1                          = $quuery->result_array();
                $rs['list_schedule_atention'] = $rs1;


                $this->db->select("*")->from("tb_client_phone_contact");
                $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $id)->get();

                $rs2                      = $quuery->result_array();
                $rs['list_phone_contact'] = $rs2;

                $this->db->select("*")->from("tb_client_mails");
                $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                $quuery = $this->db->where("tb_client_mails.idClientFk =", $id)->get();

                $rs6               = $quuery->result_array();
                $rs['list_emails'] = $rs6;


                $this->db->select("*")->from("tb_client_users");
                $this->db->join('tb_user', 'tb_user.idUser = tb_client_users.idUserFk', 'inner');
                $quuery = $this->db->where("tb_client_users.idClientFk =", $id)->get();

                $rs3                    = $quuery->result_array();
                $rs['list_client_user'] = $rs3;


                // DATOS DE FACTURCION
                $this->db->select("*")->from("tb_client_billing_information");
                $this->db->join('tb_tax', 'tb_tax.idTypeTax = tb_client_billing_information.idTypeTaxFk', 'inner');
                $this->db->join('tb_location', 'tb_location.idLocation = tb_client_billing_information.idLocationBillingFk', 'inner');
                $this->db->join('tb_province', 'tb_province.idProvince = tb_client_billing_information.idProvinceBillingFk', 'inner');
                $this->db->join('tb_client_cost_center', 'tb_client_cost_center.idCostCenter = tb_client_billing_information.idCostCenterFk', 'left');
                $quuery = $this->db->where("tb_client_billing_information.idClientFk =", $id)->get();

                $rs4                       = $quuery->result_array();
                $rs['billing_information'] = $rs4;

                //DEPARTAMENTOS
                $this->db->select("*")->from("tb_client_departament");
                $where_department="tb_client_departament.idClientFk=$id AND tb_client_departament.idStatusFk=1";
                $quuery = $this->db->where($where_department)->get();

                $rs5                    = $quuery->result_array();
                $rs['list_departament'] = $rs5;

                // ARCHIVOS SUBIDOS
                $this->db->select("*")->from("tb_client_files_list");
                $quuery = $this->db->where("tb_client_files_list.idClientfK =", $id)->get();

                $rs6                       = $quuery->result_array();
                $rs['files_uploaded']      = $rs6;

                // INITIAL DELIVERY DATA
                $this->db->select("*")->from("tb_client_initial_delivery");
                $quuery = $this->db->where("tb_client_initial_delivery.idClientKf =", $id)->get();

                $rs7                       = $quuery->result_array();
                $rs['initial_delivery']    = $rs7;
                if($quuery->num_rows()>0){
                    //print_r($rs['customers'][$i]['initial_delivery'][0]['expirationDate']);
                    $dateString = $rs['initial_delivery'][0]['expirationDate']; 
                    // Date string to compare
                    // Convert date string to a DateTime object
                    $dateToCompare = new DateTime($dateString);
                    
                    // Get the current date as a DateTime object
                    $now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));

                    $dateToCompareFormatted = $dateToCompare->format('Y-m-d');
                    $currentDateFormatted = $now->format('Y-m-d');
                    //print_r("currentDate   : ".$currentDateFormatted);
                    //print("dateString    : ".$dateString);
                    //print("dateToCompare : ".$dateToCompareFormatted);
                    //print("currentDate   : ".$currentDate);
                    if ($currentDateFormatted > $dateToCompareFormatted) {
                        $rs['initial_delivery'][0]['expiration_state'] = true;
                        $rs['isInitialDeliveryActive'] = false;
                        
                    }else{
                        $rs['initial_delivery'][0]['expiration_state'] = false;
                        $rs['isInitialDeliveryActive'] = true;
                        
                    }
                }else{
                    $rs['isInitialDeliveryActive'] = false;
                }

                if (! is_null($rs['idClientAdminFk'])){
                    $this->db->select("*")->from("tb_clients");
                    $quuery = $this->db->where("tb_clients.idClient =", $rs['idClientAdminFk'])->get();

                    if ($quuery->num_rows() > 0) {
                        $rs8                       = $quuery->result_array();
                        $rs['administration_details']      = $rs8;

                        $this->db->select("*")->from("tb_client_phone_contact");
                        $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $rs['idClientAdminFk'])->get();
        
                        $rsTmp1                      = $quuery->result_array();
                        $rs['administration_details'][0]['list_phone_contact'] = $rsTmp1;
        
                        $this->db->select("*")->from("tb_client_mails");
                        $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                        $quuery = $this->db->where("tb_client_mails.idClientFk =", $rs['idClientAdminFk'])->get();
        
                        $rsTmp2               = $quuery->result_array();
                        $rs['administration_details'][0]['list_emails'] = $rsTmp2;
                    }
                }
                if (! is_null($rs['idClientCompaniFk'])){
                    $this->db->select("*")->from("tb_clients");
                    $quuery = $this->db->where("tb_clients.idClient =", $rs['idClientCompaniFk'])->get();
                    if ($quuery->num_rows() > 0) {
                        $rs8                       = $quuery->result_array();
                        $rs['company_details']      = $rs8;

                        $this->db->select("*")->from("tb_client_phone_contact");
                        $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $rs['idClientCompaniFk'])->get();
        
                        $rsTmp1                      = $quuery->result_array();
                        $rs['company_details'][0]['list_phone_contact'] = $rsTmp1;
        
                        $this->db->select("*")->from("tb_client_mails");
                        $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                        $quuery = $this->db->where("tb_client_mails.idClientFk =", $rs['idClientCompaniFk'])->get();
        
                        $rsTmp2               = $quuery->result_array();
                        $rs['company_details'][0]['list_emails'] = $rsTmp2;
                    }
                }
                return $rs;
            }

            return null;
        } else {

            $this->db->select("*")->from("tb_clients");
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
            $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
            $this->db->where("tb_clients.idStatusFk !=", -1);


            /* Busqueda por filtro */
            if (is_null($searchFilter)){
                if (! is_null($idClientTypeFk)) {
                    $this->db->where('tb_clients.idClientTypeFk', $idClientTypeFk);
                }
                if (isset($limit) && isset($start)) {
                    $this->db->limit($limit, $start);
                }
                if (! is_null($isNotCliente)) {
                    $this->db->where('tb_clients.isNotCliente', $isNotCliente);
                }
                if (! is_null($isInDebt) && $isInDebt!="") {
                    $this->db->where('tb_clients.IsInDebt', $isInDebt);
                }
                if (! is_null($isStockInBuilding) && (is_null($isStockInOffice) || $isStockInOffice=="")) {
                    $this->db->where('tb_clients.isStockInBuilding', $isStockInBuilding);
                }
                if (! is_null($isStockInOffice) && $isStockInOffice!="" && is_null($isStockInBuilding)) {
                    $this->db->where('tb_clients.isStockInOffice', $isStockInOffice);
                }
                if (! is_null($isStockInBuilding) && ! is_null($isStockInOffice)) {
                    $where="(tb_clients.isStockInBuilding = '".$isStockInBuilding."' OR tb_clients.isStockInOffice = '".$isStockInOffice."')";
                    $this->db->where($where);
                }
            }else{
                if (isset($limit) && isset($start)) {
                    $this->db->limit($limit, $start);
                }
                if (! is_null($idClientTypeFk)) {
                    $this->db->where('tb_clients.idClientTypeFk', $idClientTypeFk);
                }
                if (! is_null($isNotCliente)) {
                    $this->db->where('tb_clients.isNotCliente', $isNotCliente);
                }
                if (! is_null($isInDebt) && $isInDebt!="") {
                    $this->db->where('tb_clients.IsInDebt', $isInDebt);
                }
                if (! is_null($isStockInBuilding)) {
                    $this->db->where('tb_clients.isStockInBuilding', $isStockInBuilding);
                }
                if (! is_null($isStockInOffice) && $isStockInOffice!="") {
                    $this->db->where('tb_clients.isStockInOffice', $isStockInOffice);
                }
                if (is_null($strict)){
                    $where="(tb_clients.name LIKE '%".$searchFilter."%' OR tb_clients.idClient LIKE '%".$searchFilter."%')";
                    $this->db->where($where);
                }else{
                    $where="(tb_clients.name = '".$searchFilter."' OR tb_clients.idClient = '".$searchFilter."')";
                    $this->db->where($where);
                }
                

            }

            $quuery = $this->db->order_by("tb_clients.idClient", "ASC")->get();


            if ($quuery->num_rows() > 0) {
                
                if (is_null($searchFilter)){
                    if (! is_null($idClientTypeFk)) {
                        $this->db->where('tb_clients.idClientTypeFk', $idClientTypeFk);
                    }
                    if (! is_null($isNotCliente)) {
                        $this->db->where('tb_clients.isNotCliente', $isNotCliente);
                    }
                    if (! is_null($isStockInBuilding)) {
                        $this->db->where('tb_clients.isStockInBuilding', $isStockInBuilding);
                    }
                    if (! is_null($isStockInOffice) && $isStockInOffice!="") {
                        $this->db->where('tb_clients.isStockInOffice', $isStockInOffice);
                    }
                }else{
                    if (! is_null($idClientTypeFk)) {
                        $this->db->where('tb_clients.idClientTypeFk', $idClientTypeFk);
                    }
                    if (! is_null($isNotCliente)) {
                        $this->db->where('tb_clients.isNotCliente', $isNotCliente);
                    }
                    if (! is_null($isStockInBuilding)) {
                        $this->db->where('tb_clients.isStockInBuilding', $isStockInBuilding);
                    }
                    if (! is_null($isStockInOffice) && $isStockInOffice!="") {
                        $this->db->where('tb_clients.isStockInOffice', $isStockInOffice);
                    }
                    if (is_null($strict) || !$strict){
                        $where="(tb_clients.name LIKE '%".$searchFilter."%' OR tb_clients.idClient LIKE '%".$searchFilter."%')";
                        $this->db->where($where);
                    }else{
                        $where="(tb_clients.name = '".$searchFilter."' OR tb_clients.idClient = '".$searchFilter."')";
                        $this->db->where($where);
                    }
                }
                $query_total =  $this->db->select("*")->from("tb_clients")->get();
                if ($query_total->num_rows() > 0 && ! is_null($totalCount)) {
                    $rs['totalCount'] = $query_total->num_rows();

                }
                $rs['customers'] = $quuery->result_array();
                $i = 0;
                foreach ($quuery->result() as &$row) {


                    $this->db->select("*")->from("tb_client_schedule_atention");
                    $quuery = $this->db->where("tb_client_schedule_atention.idClienteFk =", $row->idClient)->get();

                    $rs1                              = $quuery->result_array();
                    $rs['customers'][$i]['list_schedule_atention'] = $rs1;


                    $this->db->select("*")->from("tb_client_phone_contact");
                    $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $row->idClient)->get();

                    $rs2                          = $quuery->result_array();
                    $rs['customers'][$i]['list_phone_contact'] = $rs2;


                    $this->db->select("*")->from("tb_client_users");
                    $this->db->join('tb_user', 'tb_user.idUser = tb_client_users.idUserFk', 'inner');
                    $quuery = $this->db->where("tb_client_users.idClientFk =", $row->idClient)->get();

                    $rs3                        = $quuery->result_array();
                    $rs['customers'][$i]['list_client_user'] = $rs3;

                    $this->db->select("*")->from("tb_client_contact_users");
                    $this->db->join('tb_user', 'tb_user.idUser = tb_client_contact_users.idUserFk', 'inner');
                    $quuery = $this->db->where("tb_client_contact_users.idClientFk =", $row->idClient)->get();

                    $rs3                        = $quuery->result_array();
                    $rs['customers'][$i]['list_client_contact_users'] = $rs3;

                    $this->db->select("*")->from("tb_client_mails");
                    $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                    $quuery = $this->db->where("tb_client_mails.idClientFk =", $row->idClient)->get();

                    $rs4                   = $quuery->result_array();
                    $rs['customers'][$i]['list_emails'] = $rs4;


                    // DATOS DE FACTURCION
                    $this->db->select("*")->from("tb_client_billing_information");
                    $this->db->join('tb_tax', 'tb_tax.idTypeTax = tb_client_billing_information.idTypeTaxFk', 'inner');
                    $this->db->join('tb_location', 'tb_location.idLocation = tb_client_billing_information.idLocationBillingFk', 'inner');
                    $this->db->join('tb_province', 'tb_province.idProvince = tb_client_billing_information.idProvinceBillingFk', 'inner');
                    $this->db->join('tb_client_cost_center', 'tb_client_cost_center.idCostCenter = tb_client_billing_information.idCostCenterFk', 'left');
                    $quuery = $this->db->where("tb_client_billing_information.idClientFk =", $row->idClient)->get();

                    $rs5                          = $quuery->result_array();
                    $rs['customers'][$i]['billing_information'] = $rs5;

                    //DEPARTAMENTOS
                    $this->db->select("*")->from("tb_client_departament");
                    $this->db->where("tb_client_departament.idClientFk =", $row->idClient);
                    $quuery = $this->db->where("tb_client_departament.idStatusFk =", 1)->get();
                    $rs6                        = $quuery->result_array();
                    $rs['customers'][$i]['list_departament'] = $rs6;

                    //DIRECCIONES PARTICULAR
                    $this->db->select("*")->from("tb_client_address_particular");
                    $quuery = $this->db->where("tb_client_address_particular.idClientFk =", $row->idClient)->get();

                    $rs7                        = $quuery->result_array();
                    $rs['customers'][$i]['list_address_particular'] = $rs7;

                    // ARCHIVOS SUBIDOS
                    $this->db->select("*")->from("tb_client_files_list");
                    $quuery = $this->db->where("tb_client_files_list.idClientfK =", $row->idClient)->get();

                    $rs8                       = $quuery->result_array();
                    $rs['customers'][$i]['files_uploaded']      = $rs8;

                    //INITIAL DELIVERY DATA
                    $this->db->select("*")->from("tb_client_initial_delivery");
                    $quuery = $this->db->where("tb_client_initial_delivery.idClientKf =", $row->idClient)->get();

                    $rs9                       = $quuery->result_array();
                    $rs['customers'][$i]['initial_delivery']    = $rs9;
                    if($quuery->num_rows()>0){
                        //print_r($rs['customers'][$i]['initial_delivery'][0]['expirationDate']);
                        $dateString = $rs['customers'][$i]['initial_delivery'][0]['expirationDate']; 
                        // Date string to compare
                        // Convert date string to a DateTime object
                        $dateToCompare = new DateTime($dateString);
                        
                        // Get the current date as a DateTime object
                        $now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));

                        $dateToCompareFormatted = $dateToCompare->format('Y-m-d');
                        $currentDateFormatted = $now->format('Y-m-d');
                        //print_r("currentDate   : ".$currentDateFormatted);
                        //print("dateString    : ".$dateString);
                        //print("dateToCompare : ".$dateToCompareFormatted);
                        //print("currentDate   : ".$currentDate);
                        if ($currentDateFormatted > $dateToCompareFormatted) {
                            $rs['customers'][$i]['initial_delivery'][0]['expiration_state'] = true;
                            $rs['customers'][$i]['isInitialDeliveryActive'] = false;
                            
                        }else{
                            $rs['customers'][$i]['initial_delivery'][0]['expiration_state'] = false;
                            $rs['customers'][$i]['isInitialDeliveryActive'] = true;
                        }
                    }
                    
                    if (! is_null($row->idClientAdminFk)){
                        $this->db->select("*")->from("tb_clients");
                        $quuery = $this->db->where("tb_clients.idClient =", $row->idClientAdminFk)->get();

                        if ($quuery->num_rows() > 0) {
                            $rs10                       = $quuery->result_array();
                            $rs['customers'][$i]['administration_details']      = $rs10;
    
                            $this->db->select("*")->from("tb_client_phone_contact");
                            $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $row->idClientAdminFk)->get();
            
                            $rsTmp1                      = $quuery->result_array();
                            $rs['customers'][$i]['administration_details'][0]['list_phone_contact'] = $rsTmp1;
            
                            $this->db->select("*")->from("tb_client_mails");
                            $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                            $quuery = $this->db->where("tb_client_mails.idClientFk =", $row->idClientAdminFk)->get();
            
                            $rsTmp2               = $quuery->result_array();
                            $rs['customers'][$i]['administration_details'][0]['list_emails'] = $rsTmp2;
                        }
                    }

                    if (! is_null($row->idClientCompaniFk)){
                        $this->db->select("*")->from("tb_clients");
                        $quuery = $this->db->where("tb_clients.idClient =", $row->idClientCompaniFk)->get();


                        if ($quuery->num_rows() > 0) {
                            $rs11                       = $quuery->result_array();
                            $rs['customers'][$i]['company_details']      = $rs11;
    
                            $this->db->select("*")->from("tb_client_phone_contact");
                            $quuery = $this->db->where("tb_client_phone_contact.idClientFk =", $row->idClientCompaniFk)->get();
            
                            $rsTmp1                      = $quuery->result_array();
                            $rs['customers'][$i]['company_details'][0]['list_phone_contact'] = $rsTmp1;
            
                            $this->db->select("*")->from("tb_client_mails");
                            $this->db->join('tb_tipo_mails', 'tb_tipo_mails.idTipoMail = tb_client_mails.idTipoDeMailFk', 'left');
                            $quuery = $this->db->where("tb_client_mails.idClientFk =", $row->idClientCompaniFk)->get();
            
                            $rsTmp2               = $quuery->result_array();
                            $rs['customers'][$i]['company_details'][0]['list_emails'] = $rsTmp2;
                        }
                    }
                    $i++;
                }

                return $rs;
            }

            return null;
        }
    }
    public function list_admin_companies(){
        $quuery         = null;
        $query_total    = null;
        $rs             = null;
        $where          = null;

        //echo isset($limit)."\n";
        //echo isset($start);

            $this->db->select("*")->from("tb_clients");
            $this->db->join('tb_client_type', 'tb_client_type.idClientType = tb_clients.idClientTypeFk', 'left');
            $this->db->join('tb_zonas', 'tb_zonas.idZona = tb_clients.idZonaFk', 'left');
            $this->db->join('tb_location', 'tb_location.idLocation = tb_clients.idLocationFk', 'left');
            $this->db->join('tb_province', 'tb_province.idProvince = tb_clients.idProvinceFk', 'left');
            $this->db->where("tb_clients.idStatusFk !=", -1);
            $this->db->where('tb_clients.isNotCliente', 0);
            $this->db->group_start();
            $this->db->where('tb_clients.idClientTypeFk', 1);
            $this->db->or_where('tb_clients.idClientTypeFk', 1);
            $this->db->group_end();

            $quuery = $this->db->order_by("tb_clients.idClient", "ASC")->get();


            if ($quuery->num_rows() > 0) {

                $rs['customers'] = $quuery->result_array();

                return $rs;

            }

            return null;
    }
    public function postUploadFiles($customerId, $fileName, $file) {
        $image_path = realpath(APPPATH . '../../files');
        $file_name_ext = explode(".", $file["file"]["name"])[1];
        $file_name_tmp = explode(".", $file["file"]["name"])[0];
        if ($fileName != ''){
            $file_name  = $customerId . '_'. $fileName . '_' . date("Ymd") . '.' . $file_name_ext;    
        }else{
           $file_name  = $customerId . '_'. $file_name_tmp . '_' . date("Ymd") . '.' . $file_name_ext;     
        }
        
        //$file_size  = $file['file']['size'];
        $file_type  = $file['file']['type'];
        //$error      = $file['file']['error'];
        $tempPath   = $file['file']['tmp_name' ];
        $uploadPath = $image_path. DIRECTORY_SEPARATOR .$file_name;
        move_uploaded_file($tempPath, $uploadPath);
        $answer = array('dir' => '/files/', 'filename' => $file_name, 'type' => $file_type);

        return $answer;
    }
    public function addCustomerUploadedFile($client) {
        $this->db->insert('tb_client_files_list', [
                'idClientfK'       => $client['idClient'],
                'title'            => $client['name'],
                'urlFile'          => $client['urlFile'],
                'typeFile'         => $client['type'],
                ]
        );
        if ($this->db->affected_rows() === 1) {
            return true;
        }else{
            return null;
        }
    }
    public function postDeleteFiles($fileName) {
        $image_path = realpath(APPPATH . '../../files');
        $filePath = $image_path. DIRECTORY_SEPARATOR .$fileName;
        unlink($filePath);  
        return true;
    }      
    public function deleteCustomerUploadedFile($idClientFile) {
        $this->db->delete('tb_client_files_list', array('idClientFiles' => $idClientFile));  
        return true;
    }
    public function getKeysAssociatedToACustomerService($idClient = null) {
        $quuery      = null;
        $rs          = null;
        $where_string= null;
        if (! is_null($idClient)) {
            $this->db->select("tb_contratos.idStatusFk, tb_status.statusTenantName AS contractStatus, tb_servicios_del_contrato_cabecera.serviceName, tb_products.*, tb_products_classification.classification")->from("tb_contratos");
            $this->db->join('tb_servicios_del_contrato_cabecera', 'tb_servicios_del_contrato_cabecera.idContratoFk = tb_contratos.idContrato', 'left');
            $this->db->join('tb_servicios_del_contrato_cuerpo', 'tb_servicios_del_contrato_cuerpo.idServiciosDelContratoFk = tb_servicios_del_contrato_cabecera.idServiciosDelContrato', 'left');
            $this->db->join('tb_client_services_access_control', 'tb_client_services_access_control.idContracAssociated_SE = tb_contratos.idContrato', 'left');
            $this->db->join('tb_open_devices_access_control', 'tb_open_devices_access_control.idOPClientServicesAccessControlFk = tb_client_services_access_control.idClientServicesAccessControl', 'left');
            $this->db->join('tb_products', 'tb_products.idProduct = tb_open_devices_access_control.idOpenDevice', 'left');
            $this->db->join('tb_products_classification', 'tb_products_classification.idProductClassification = tb_products.idProductClassificationFk', 'left');
            $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_contratos.idStatusFk', 'left');
            $where_string = "tb_contratos.idClientFk = $idClient AND tb_contratos.idStatusFk = 1 AND tb_servicios_del_contrato_cabecera.idServiceType = 1 AND tb_client_services_access_control.idContracAssociated_SE!=''
            GROUP BY tb_products.idProduct,tb_servicios_del_contrato_cabecera.serviceName ORDER BY tb_products.idProduct";
            $quuery = $this->db->where($where_string)->get();
            if ($quuery->num_rows() > 0) {
                $rs = $quuery->result_array();
                return $rs;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
    public function getControlAccessDoorsAssociatedToACustomerServices($idClient = null) {
        $quuery      = null;
        $rs          = null;
        $where_string= null;
        if (! is_null($idClient)) {
            $this->db->select("tb_contratos.idStatusFk, tb_status.statusTenantName AS contractStatus, tb_servicios_del_contrato_cabecera.serviceName, tb_contratos.idContrato, tb_servicios_del_contrato_cuerpo.idAccCrtlDoor, tb_servicios_del_contrato_cuerpo.idServiciosDelContratoCuerpo, tb_servicios_del_contrato_cuerpo.idServiceTypeFk, tb_access_control_door.*", FALSE)->from("tb_contratos");
            $this->db->join('tb_servicios_del_contrato_cabecera', 'tb_servicios_del_contrato_cabecera.idContratoFk = tb_contratos.idContrato', 'left');
            $this->db->join('tb_servicios_del_contrato_cuerpo', 'tb_servicios_del_contrato_cuerpo.idServiciosDelContratoFk = tb_servicios_del_contrato_cabecera.idServiciosDelContrato', 'left');
            $this->db->join('tb_access_control_door', 'tb_access_control_door.idAccessControlDoor = tb_servicios_del_contrato_cuerpo.idAccCrtlDoor', 'left');
            $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_contratos.idStatusFk', 'left');
            $where_string = "tb_contratos.idClientFk = $idClient AND tb_contratos.idStatusFk = 1 AND tb_servicios_del_contrato_cabecera.idServiceType = 1 AND tb_servicios_del_contrato_cuerpo.idServiceTypeFk = 1
            GROUP BY tb_servicios_del_contrato_cuerpo.idAccCrtlDoor,tb_servicios_del_contrato_cabecera.serviceName ORDER BY tb_access_control_door.idAccessControlDoor;";
            $quuery = $this->db->where($where_string)->get();
            $rs = $quuery->result_array();
            if ($quuery->num_rows() > 0) {
                $i = 0;
                foreach ($quuery->result_array() as $key => $ticket) {
                    #print_r($ticket);
                    $this->db->select("itemAclaracion")->from("tb_servicios_del_contrato_cuerpo");
                    $this->db->where('idServiciosDelContratoCuerpo', $ticket['idServiciosDelContratoCuerpo']);
                    $this->db->where('idServiceTypeFk', 1);
                    $cuerpo = $this->db->get();
                    if ($cuerpo->num_rows()>0) {
                        if (!is_null($ticket['idAccessControlDoor'])){
                            #print_r($cuerpo->result_array());
                            $rs[$i]['itemAclaracion']=$cuerpo->result_array()[0]['itemAclaracion'];
                        }
                    }
                    #print_r($ticket);
                    $this->db->select("tb_client_services_access_control.idClientServicesAccessControl AS idService, tb_client_services_access_control.addressClient, tb_client_services_access_control.addressVpn, tb_client_services_access_control.portHttp, tb_client_services_access_control.portVpn, tb_client_services_access_control.passVpn, tb_client_services_access_control.useVpn")->from("tb_client_services_access_control");
                    $this->db->where('idContracAssociated_SE', $ticket['idContrato']);
                    $this->db->where('idDoorFk', $ticket['idAccessControlDoor']);
                    $service = $this->db->get();
                    if ($service->num_rows()>0) {
                        if (!is_null($ticket['idContrato'])){
                            //print_r($service->result_array());                            
                            $rs[$i]['controlAccessInternet']=$service->result_array()[0];
                        }
                    }
                    $i++;
                }
                return $rs;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
    public function getInternetServiceAssociatedToCustomer($idClient = null) {
        $quuery      = null;
        $rs          = null;
        $where_string= null;
        if (! is_null($idClient)) {
            $this->db->select("tb_client_services_internet.idClientServicesInternet AS idService, tb_contratos.idStatusFk, tb_status.statusTenantName AS contractStatus, tb_servicios_del_contrato_cabecera.serviceName, tb_contratos.idContrato, tb_servicios_del_contrato_cuerpo.idServiciosDelContratoCuerpo, tb_servicios_del_contrato_cuerpo.itemAclaracion, tb_client_services_internet.*", FALSE)->from("tb_contratos");
            $this->db->join('tb_servicios_del_contrato_cabecera', 'tb_servicios_del_contrato_cabecera.idContratoFk = tb_contratos.idContrato', 'left');
            $this->db->join('tb_servicios_del_contrato_cuerpo', 'tb_servicios_del_contrato_cuerpo.idServiciosDelContratoFk = tb_servicios_del_contrato_cabecera.idServiciosDelContrato', 'left');
            $this->db->join('tb_client_services_internet', 'tb_client_services_internet.idContracAssociated_SE = tb_contratos.idContrato', 'left');
            $this->db->join('tb_tipos_servicios_internet', 'tb_tipos_servicios_internet.idTipoServicioInternet = tb_client_services_internet.idTypeInternetFk', 'left');
            $this->db->join('tb_status', 'tb_status.idStatusTenant = tb_contratos.idStatusFk', 'left');
            $where_string = "tb_contratos.idClientFk = $idClient AND tb_contratos.idStatusFk = 1 AND tb_servicios_del_contrato_cabecera.idServiceType = 2 AND tb_client_services_internet.idContracAssociated_SE!='' AND (tb_client_services_internet.dateDown = '' OR tb_client_services_internet.dateDown IS NULL)
            GROUP BY tb_servicios_del_contrato_cuerpo.idAccCrtlDoor,tb_servicios_del_contrato_cabecera.serviceName ORDER BY tb_tipos_servicios_internet.idTipoServicioInternet;";
            $quuery = $this->db->where($where_string)->get();
            $servicesAssociated = null;
            //print_r($quuery->result_array());
            if ($quuery->num_rows() > 0) {
                foreach ($quuery->result_array() as $key => $ticket) {
                    //Check if the Internet Type if BSS Wifi.
                    //print($ticket['idTypeInternetFk']);
                    //print($ticket['idServiceAsociateFk']);
                    if($ticket['idTypeInternetFk']==1){
                        $rs = $quuery->result_array();
                        $servicesAssociated=json_decode($ticket['idServiceAsociateFk']);
                        if (count($servicesAssociated)>0){
                            $serviceAsociate_arr=[];
                            foreach ($servicesAssociated as $idServiceAssociated) {
                                $aux = null;
                                $this->db->select("*")->from("tb_client_services_access_control");
                                $quuery2 = $this->db->where("tb_client_services_access_control.idClientServicesFk",$idServiceAssociated)->get();
                                //print_r($quuery2->result_array());
                                if ($quuery2->num_rows() > 0) {
                                    $aux=$quuery2->result_array();
                                }
                                array_push($serviceAsociate_arr,$aux);
                            }
                            $rs[0]['idServiceAsociateFk_array']=$serviceAsociate_arr;
                        }
                    }
                }
            }
            
            return $rs;
        }else{
            return null;
        }
    }
    public function initialDelivery($client) {
        // INITIAL DELIVERY DATA
        $now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->insert('tb_client_initial_delivery', [
                'idClientKf'        => $client['idClientKf'],
                'expirationDate'    => $client['expirationDate'],
                'initial_price'     => $client['initial_price'],
                'initial_qtty'      => $client['initial_qtty'],
                'created_by'        => $client['created_by_idUserKf'],
                'created_at'        => $now->format('Y-m-d H:i:s'),
            ]
        );
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 2;
        }
    }

    public function initialDeliveryUpdate($client) {
        // INITIAL DELIVERY DATA
        $now        = new DateTime(null , new DateTimeZone('America/Argentina/Buenos_Aires'));
        $this->db->set(
            [
                'idClientKf'        => $client['idClientKf'],
                'expirationDate'    => $client['expirationDate'],
                'initial_price'     => $client['initial_price'],
                'initial_qtty'      => $client['initial_qtty'],
                'updated_by'         => $client['updated_by_idUserKf'],
                'updated_at'         => $now->format('Y-m-d H:i:s'),
            ]
        )->where("idInitialDelivery", $client['idInitialDelivery'])->update("tb_client_initial_delivery");
        if ($this->db->affected_rows() === 1) {
            return 1;
        } else {
            return 2;
        }


    }
}

?>
