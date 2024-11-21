/**
* Products Controller
**/
var tickets = angular.module("module.Tickets", ["tokenSystem", "angular.filter", "services.Customers", "services.Keys", "ui.select", "services.Ticket", "services.Products", "services.Utilities", "services.Departments", "bootstrapLightbox","services.Service", "services.Contracts", "services.Products", "services.User"]);

tickets.controller('TicketsCtrl', function($scope, $compile, $location, $interval, $q, $routeParams, blockUI, Lightbox, $timeout, inform, ProductsServices, KeysServices,  ticketServices, CustomerServices, serviceServices, ContractServices, DepartmentsServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS, APP_REGEX){
    console.log(APP_SYS.app_name+" Modulo Tickets");
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
        $location.path("/login");
    }    
    //Variables Initialization
    $scope.new={'ticket':{}};
    $scope.keys={'idProductKf': null,'idCategoryKf': null,'idUserKf': null,'idDepartmenKf': null,'isKeyTenantOnly': null,'idClientKf': null,'idClientAdminKf':null};
    $scope.new.ticket={
        'idTypeRequestFor': null,
        'idTypeTicketKf':  null,
        'idUserMadeBy':  null,
        'idUserRequestBy':  null,
        'idBuildingKf': null,
        'idDepartmentKf': null,
        'keys': [],
        'idTypeDeliveryKf': null,
        'idWhoPickUp': null,
        'idUserDelivery': null,
        'idDeliveryTo': null,
        'idDeliveryAddress': null,
        'otherDeliveryAddress': {
            'address': null,
            'number': null,
            'floor': null,
            'idProvinceFk': null,
            'idLocationFk': null
        },
        'thirdPersonDelivery': {
            'fullName': null,
            'dni': null,
            'movilPhone': null,
            'address': null,
            'number': null,
            'floor': null,
            'idProvinceFk': null,
            'idLocationFk': null 
        },
        'idTypePaymentKf': null,
        'sendNotify': null,
        'description': null,
        'costService': null,
        'costKeys': null,
        'costDelivery': null,
        'total': null,
        'urlToken': null,
        'autoApproved': null,
        'isNew': null,
        'history': []
    };
    $scope.customerSearch={'name':'', 'typeClient':null};
    $scope.select={'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined, 'product':{'selected':undefined}};
    $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
    $scope.ticket = {'administration':undefined, 'building':undefined, 'idClientDepartament':undefined, 'radioButtonDepartment':undefined, 'radioButtonBuilding':undefined, 'optionTypeSelected': {}, 'userRequestBy':{}, 'userNotify':null, 'keys':[], 'delivery':{'idTypeDeliveryKf':null, 'whoPickUp':null, 'zone':{}, 'thirdPerson':undefined, 'deliveryTo':{}, 'otherAddress':undefined}, 'cost':{'keys':0, 'delivery':0, 'service':0, 'total':0}};
    $scope.costs={'keys':{'cost':0, 'manual':false}, 'delivery':{'cost':0, 'manual':false}, 'service':{'cost':0, 'manual':false}, 'total':0};
    $scope.attendantFound  = false;
    $scope.list_doors = [];
    $scope.list_doors_ticket = [];
    $scope.list_keys = [];
    $scope.tenant={
        'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'','depto':''},
        'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':'','depto':''},
        'tmp':{'dni':'','mail':''}};
    $scope.attendant={
        'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'','depto':''},
        'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':'','depto':''},
        'tmp':{'dni':'','mail':''}};
    $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
    $scope.remove = {'info':{'idUser':null, 'idDepartmentKf2':null, 'idTypeTenant': null}}
    $scope.att= {'ownerOption':undefined}
    $scope.update={'user':{'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null, 'typeTenantChange':false}};
    $scope.thirdPerson = {};
    $scope.selectedRequestKeyOwnerUser = undefined;
    $scope.selectedUser = undefined;
    $scope.selectSubType = false;
    $scope.isHomeSelected = false;
    $scope.isCompanyAdministrator = false;
    $scope.keyTotalAllowed=25000;
    $scope.keysAllowed=10;
    $scope.mp={'link':{}, 'payment':{}, 'data':{}}; 
        /**
        * Modal Confirmation function 
        **/
        $scope.modalConfirmation = function(opt, confirm, obj){
            $scope.swMenu = opt;
            $scope.vConfirm = confirm;
            var tmpOpt=$scope.div2Open;
            //console.log(tmpOpt);
            $scope.mess2show="";
            switch ($scope.swMenu){
                case "closeWindow":
                    if (confirm==0){
                        if ($scope.isNewTenant==true || $scope.isNewAttendant==true){
                            $scope.mess2show="Se perderan todos los datos cargados para el registro actual, esta seguro que desea cancelar?";
                        }else{
                            $scope.mess2show="Se perderan todos las modificaciones realizadas en el registro actual, esta seguro que desea cancelar la modificacion?";
                        }    
                        $("#confirmRequestModal").modal('show');
                    }else if (confirm==1){
                        if ($scope.idDeptoKf!=undefined){
                            $timeout(function() {
                                $scope.tableRowExpanded = false;
                                $scope.tableRowIndexCurrExpanded = "";
                                $scope.selectTableRow($scope.vIndex, $scope.selectedDepto, "depto");
                                //$scope.dayDataCollapse[$scope.vIndex] = false;
                            }, 200);
                        }
                        $("#confirmRequestModal").modal('hide');
                        $("#RegisterTenant").modal('hide');
                        $("#UpdateTenant").modal('hide');
                        $("#RegisterAttendant").modal('hide');
                        $("#UpdateAttendant").modal('hide');
                        //$scope.switchCustomersFn('dashboard','', 'registered');
                    }
                break;
                case "closeRequest":
                    if (confirm==0){
                        $('.circle-loader').toggleClass('load-complete');
                        $('.checkmark').toggle();
                        $('#showModalRequestStatus').modal('hide');
                        $scope.ticketRegistered=null;
                        $timeout(function() {
                            $scope.mess2show="Desea realizar un nuevo pedido.     Confirmar?";
                            $('#confirmRequestModalCustom').modal({backdrop: 'static', keyboard: false});
                            $('#confirmRequestModalCustom').on('shown.bs.modal', function () {});
                        }, 500);
                    }else if (confirm==1){
                        $('#confirmRequestModalCustom').modal('hide');
                        $timeout(function() {
                            if(($scope.sysLoggedUser.idProfileKf=='4' && $scope.sysLoggedUser.idTypeTenantKf==null) || ($scope.sysLoggedUser.idProfileKf=='1' || $scope.sysLoggedUser.idProfileKf=='3' ||  $scope.sysLoggedUser.idProfileKf=='5')){
                                $scope.mainSwitchFn('selectTicketType', null);
                            }else{
                                $scope.mainSwitchFn('selectPlace', null);
                            }
                        }, 1000);
                    
                    }else if (confirm==null){
                        $timeout(function() {
                          blockUI.message('Cargando Monitor de Pedidos ');
                        }, 1500);
                        blockUI.start('Cambiando al modulo Monitor de Pedidos');
                        $timeout(function() {
                          $location.path("/monitor");
                          blockUI.stop();
                          $('#confirmRequestModalCustom').modal('hide');
                        }, 2500); 
                    }
                break;
                case "checkReason":
                    if (confirm==0){
                        $scope.tmpReason=obj;
                        $timeout(function() {
                            $scope.mess2show="Desea continuar con el pedido.     Confirmar?";
                            $('#showModalRequestDown').modal({backdrop: 'static', keyboard: false});
                            $('#showModalRequestDown').on('shown.bs.modal', function () {});
                        }, 500);
                    }else if (confirm==1){
                        $('#showModalRequestDown').modal('hide');
                        inform.add('Por favor continue con el proceso de baja para completar la solicitud.',{
                            ttl:15000, type: 'info'
                        });
                        $timeout(function() {
                            $scope.mainSwitchFn('setReason', $scope.tmpReason, null);
                        }, 1000);
                    
                    }else if (confirm==null){
                        $('#showModalRequestDown').modal('hide');
                    }
                break;
                case "tup":
                    if (confirm==0){
                    $scope.ticketUp=obj;
                    $scope.mess2show="Esta seguro que desea realizar el pedido de alta.     Confirmar?";
  
                    console.log("Pedido de Alta:");
                    console.log("============================================================================");
                    console.log($scope.ticketUp);
                    $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                        $scope.mainSwitchFn('up', $scope.ticketUp);
                        $('#confirmRequestModal').modal('hide');
                    }              
                break;
                case "closeModalRequestStatus":
                    $('.circle-loader').toggleClass('load-complete');
                    $('.checkmark').toggle();
                    $('#showModalRequestStatus').modal('hide');
                    $scope.ticketRegistered=null;
                break;
                case "tdown":
                    if (confirm==0){
                        $scope.ticketDown=obj;
                        $scope.mess2show="Esta seguro que desea realizar el pedido de baja.     Confirmar?";
      
                        console.log("Pedido de Baja:");
                        console.log("============================================================================")   
                        $('#confirmRequestModal').modal('toggle');
                        }else if (confirm==1){
                            $scope.mainSwitchFn('down', $scope.ticketDown);
                            $('#confirmRequestModal').modal('hide');
                        }              
                    break;
                default:
            }
        }
        /**************************************************
        *                                                 *
        *         NG-SWITCH STEP FORM FUNCTIONS           *
        *                                                 *
        **************************************************/
            $scope.pasos = [];
            $scope.pasos1 = [
                        'PASO 1: DIRECCIÓN',
                        'PASO 2: LLAVEROS DE LA SOLICITUD',
                        'PASO 3: MÉTODO DE ENVÍO O ENTREGA',
                        'PASO 4: MÉTODO DE PAGO',
                        'VERIFICAR Y CONFIRMAR'
                        ];
            $scope.pasos2 = [
                        'PASO 1: RAZÓN',
                        'PASO 2: DIRECCIÓN',
                        'PASO 3: LLAVEROS DE LA SOLICITUD',
                        'PASO 4: MÉTODO DE PAGO',
                        'VERIFICAR Y CONFIRMAR'
                        ];
            $scope.pasos3= [
                        'PASO 1: DATOS',
                        'PASO 2: DATOS DEL SERVICIO'
                            ];
            $scope.pasos4= [
                        'PASO 1: DATOS PERSONALES',
                        'PASO 2: DATOS DE LA SOLICITUD'
                            ];
            $scope.fSwitch = "";
            function selectSwitch(valor){
                $scope.fSwitch = valor;
                if ($scope.fSwitch=="n"){ 
                    $scope.pasos= $scope.pasos1;
                }else if ($scope.fSwitch=="d"){ 
                    $scope.pasos= $scope.pasos2;
                }else if ($scope.fSwitch=="s"){
                    $scope.pasos=$scope.pasos3;
                }else if ($scope.fSwitch=="i"){
                    $scope.pasos=$scope.pasos4;
                }
                $scope.mySwitch = $scope.pasos[0];
                console.log($scope.mySwitch);
            }
            $scope.mySwitch = {};
            $scope.btnShow=true;
            $scope.btnBack=false;
            $scope.stepIndexTmp=0;
            $scope.getCurrentStepIndex = function(){
            // Get the index of the current step given mySwitch
                return _.indexOf($scope.pasos, $scope.mySwitch);
            };

            $scope.hasNextStep = function(){
                var stepIndex = $scope.getCurrentStepIndex();
                var nextStep = stepIndex + 1;
                // Return true if there is a next step, false if not
                return !_.isUndefined($scope.pasos[nextStep]);
            };

            $scope.hasPreviousStep = function(){ 
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                // Return true if there is a previous step, false if not
                return !_.isUndefined($scope.pasos[previousStep]);
            };
            var nextStep = 0;
            $scope.incrementStep = function() {
                console.log("$scope.mySwitch :"+$scope.mySwitch);
                console.log("$scope.hasNextStep: "+$scope.hasNextStep())
                if ( $scope.hasNextStep() )
                    {
                        console.log("$scope.getCurrentStepIndex: "+$scope.getCurrentStepIndex())
                        var stepIndex = $scope.getCurrentStepIndex();
                        nextStep = stepIndex + 1;
                        console.log("nextStep: "+nextStep);
                        $scope.stepIndexTmp = nextStep;
                        console.log("$scope.mySwitch => "+$scope.pasos[nextStep]);
                        $scope.mySwitch = $scope.pasos[nextStep];
                        $scope.formValidated=false;
                        $scope.btnBack=true;
                        if($scope.fSwitch=="n"){
                            if(nextStep == ($scope.pasos.length-1)){
                                $scope.btnShow=false;

                            }else if (nextStep==2 && $scope.ticket.optionTypeSelected.name=='building' && ($scope.ticket.radioButtonBuilding!='1' && $scope.ticket.radioButtonBuilding!='2' && $scope.ticket.radioButtonBuilding!='3')){
                                $scope.mySwitch = $scope.pasos[4];
                                nextStep=4;
                                $scope.btnShow=false;
                            }
                        }else if($scope.fSwitch=="d" && nextStep==3 && $scope.ticket.cost.service!=null && $scope.ticket.cost.service!=undefined && $scope.ticket.cost.service==0){
                            $scope.mySwitch = $scope.pasos[4];
                            nextStep=4;
                            $scope.btnShow=false;
                        }else{
                            if(nextStep == ($scope.pasos.length-1)){
                                $scope.btnShow=false;
                            }else if (nextStep==3 && $scope.ticket.optionTypeSelected.name=='building' && ($scope.ticket.radioButtonBuilding!='1' && $scope.ticket.radioButtonBuilding!='2' && $scope.ticket.radioButtonBuilding!='3')){
                                $scope.mySwitch = $scope.pasos[4];
                                nextStep=4;
                                $scope.btnShow=false;
                            }
                        }
                    }else{
                        console.log("$scope.hasNextStep: "+$scope.hasNextStep())
                    }
            };

            $scope.decrementStep = function() {
            if ( $scope.hasPreviousStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                console.log("stepIndex: "+stepIndex);
                console.log("nextStep: "+nextStep);
                $scope.stepIndexTmp = previousStep;
                $scope.formValidated=true;
                $scope.btnShow=true;
                if ($scope.fSwitch=="n" && nextStep==4 && $scope.ticket.optionTypeSelected.name=='building' && ($scope.ticket.radioButtonBuilding!='1' && $scope.ticket.radioButtonBuilding!='2' && $scope.ticket.radioButtonBuilding!='3')){
                    $scope.mySwitch = $scope.pasos[1];
                    nextStep=1;
                }else if($scope.fSwitch=="d" && previousStep==3 && $scope.ticket.cost.service!=null && $scope.ticket.cost.service!=undefined && $scope.ticket.cost.service==0){
                    $scope.mySwitch = $scope.pasos[2];
                    nextStep=4;
                    $scope.btnShow=true;
                }else{
                    $scope.mySwitch = $scope.pasos[previousStep];
                }
                if(previousStep<1){
                    $scope.btnBack=false;
                }
            }
            };
            $scope.enabledNextBtn=function(item){
                //console.clear();
                console.log($scope.fSwitch);
                //$scope.select.idAddressAtt = !$scope.select.idAddressAtt?$scope.selectIdAddressKf.selected:$scope.select.idAddressAtt;
                $scope.formValidated=false;
                //console.log($scope.select.idAddressAtt);
                    //alert($scope.stepIndexTmp);
                switch ($scope.stepIndexTmp){
                    case 0: console.log($scope.ticket);
                        if ($scope.fSwitch=="n"){
                            $scope.deliveryCostFree = 0;
                            console.log($scope.sysLoggedUser.idProfileKf);
                            if ($scope.sysLoggedUser.idProfileKf==1 || ($scope.sysLoggedUser.idProfileKf==4  && $scope.isCompanyAdministrator)){
                                //PASO 1: DIRECCIÓN
                                if ($scope.select.admins.selected!=undefined && $scope.select.buildings.selected!=undefined){
                                    if (($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.idClientDepartament!=undefined) || ($scope.ticket.optionTypeSelected.name=="building" && $scope.ticket.radioButtonBuilding!=undefined)){
                                        if($scope.customerCosts){ //$scope.attendantFound &&  #removed by request by Leandro 26/01/2023
                                            $scope.formValidated=true;
                                        }else{
                                            $scope.formValidated=false;
                                        }
                                    }else{
                                        $scope.formValidated=false;
                                    }
                                }else{
                                    $scope.formValidated=false;
                                }
                            }else{
                                console.log($scope.sysLoggedUser.idProfileKf);
                                if ($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.idClientDepartament!=undefined){
                                    if($scope.customerCosts){ //$scope.attendantFound &&  #removed by request by Leandro 
                                        $scope.formValidated=true;
                                    }else{
                                        $scope.formValidated=false;
                                    }
                                }else{
                                    $scope.formValidated=false;
                                }
                            }
                        }else if ($scope.fSwitch=="d"){
                            console.log($scope.sysLoggedUser.idProfileKf);
                            if ($scope.sysLoggedUser.idProfileKf==1 || ($scope.sysLoggedUser.idProfileKf==4  && $scope.isCompanyAdministrator)){
                                //PASO 1: RAZON
                                if ($scope.ticket.reason!=undefined && $scope.ticket.reason!=undefined){
                                    $scope.formValidated=true;
                                }else{
                                    $scope.formValidated=false;
                                }
                                 
                            }else{
                                console.log($scope.sysLoggedUser.idProfileKf);
                                if ($scope.ticket.reason!=undefined && $scope.ticket.reason!=undefined){
                                    $scope.formValidated=true;
                                }else{
                                    $scope.formValidated=false;
                                }
                            }
                        }else if ($scope.fSwitch=="s" && $scope.sysLoggedUser.idProfileKf!=3){
                            if (!$scope.select.idAddressAtt){
                                $scope.formValidated=false; 
                            }else{
                                $scope.formValidated=true;
                            }
                        }
                    break;
                    case 1: console.log($scope.ticket);
                        if (($scope.fSwitch=="n") && $scope.sysLoggedUser.idProfileKf!=0){
                            //PASO 2: LLAVEROS DE LA SOLICITUD
                            if (($scope.ticket.optionTypeSelected.name=="department" && 
                                ($scope.ticket.radioButtonDepartment==null || $scope.ticket.radioButtonDepartment==undefined || $scope.selectedRequestKeyOwnerUser==null || $scope.selectedRequestKeyOwnerUser==undefined)) || 
                                ($scope.ticket.optionTypeSelected.name=="building" && ($scope.ticket.radioButtonBuilding==undefined || $scope.ticket.radioButtonBuilding==null)) || 
                                $scope.list_keys.length==0){
                                $scope.formValidated=false;
                            }else{
                                $scope.formValidated=true;
                            }
                        }else if ($scope.fSwitch=="d" && $scope.sysLoggedUser.idProfileKf!=0){
                            console.log($scope.ticket);
                            //PASO 2: LLAVEROS DE LA SOLICITUD
                            if (($scope.select.admins.selected==undefined && $scope.select.buildings.selected==undefined) && (($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.idClientDepartament==undefined) || ($scope.ticket.optionTypeSelected.name=="building" && $scope.ticket.radioButtonBuilding==undefined))){
                                $scope.formValidated=false;
                            }else{
                                $scope.formValidated=true;
                            }
                        }
                    break;
                    case 2: console.log($scope.ticket);
                        if ($scope.fSwitch=="n" && $scope.sysLoggedUser.idProfileKf!=0){
                            console.info("ENTRO AL CASE 3 : ALTA DE LLAVE - PASO 3: MÉTODO DE ENVÍO O ENTREGA");
                            if ($scope.ticket.delivery.idTypeDeliveryKf==undefined || $scope.ticket.delivery.idTypeDeliveryKf==null){
                                $scope.formValidated=false;
                            }else{
                                if ($scope.ticket.delivery.idTypeDeliveryKf=="1"){
                                    console.log($scope.ticket);
                                    //if (($scope.ticket.delivery.whoPickUp==null || $scope.ticket.delivery.whoPickUp.idUser!=undefined)  &&  ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined)){
                                    //    console.log("Entro a la primera condicion del tipo de entrega 'Retiro en Oficina'"); 
                                    //    console.log($scope.ticket); 
                                    //}
                                    //if($scope.ticket.delivery.whoPickUp.id==2 && ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined)){
                                    //    console.log("Entro a la segunda condicion del tipo de entrega 'Retiro en Oficina'");
                                    //    console.log($scope.ticket); 
                                    //}

                                    if ((($scope.ticket.delivery.whoPickUp==null || $scope.ticket.delivery.whoPickUp.idUser!=undefined)  &&  ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined))||
                                        ($scope.ticket.delivery.whoPickUp.id==2 && ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined))||
                                        ($scope.ticket.delivery.whoPickUp.id==3 && ($scope.ticket.delivery.thirdPerson==null || $scope.ticket.delivery.thirdPerson.dni==undefined))){
                                            $scope.formValidated=false;
                                    }else{
                                            $scope.formValidated=true;
                                    }
                                    //deliveryTo: null
                                    //idTypeDeliveryKf: "2"
                                    //otherAddress: undefined
                                    //thirdPerson: null
                                    //whoPickUp: null
                                }else if ($scope.ticket.delivery.idTypeDeliveryKf=="2"){
                                    console.log($scope.ticket);
                                    if (((($scope.ticket.delivery.whoPickUp==null || $scope.ticket.delivery.whoPickUp.idUser!=undefined)  && ($scope.ticket.delivery.idDeliveryTo==undefined || $scope.ticket.delivery.idDeliveryTo==1 || $scope.ticket.delivery.idDeliveryTo==2)) && ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined)) ||
                                       ($scope.ticket.delivery.idDeliveryTo==2 && ($scope.ticket.delivery.whoPickUp==null || $scope.ticket.delivery.whoPickUp.idUser!=undefined) && ($scope.ticket.delivery.otherAddress==null || $scope.ticket.delivery.otherAddress.streetName==undefined || $scope.ticket.delivery.otherAddress.streetNumber==undefined)) || 
                                       ($scope.ticket.delivery.whoPickUp!=null && $scope.ticket.delivery.whoPickUp.id==2 && ($scope.ticket.delivery.deliveryTo==null || $scope.ticket.delivery.deliveryTo.idUser==undefined)) || 
                                       ($scope.ticket.delivery.whoPickUp!=null && $scope.ticket.delivery.whoPickUp.id==3 && ($scope.ticket.delivery.idDeliveryTo==null) && ($scope.ticket.delivery.otherAddress==null || $scope.ticket.delivery.otherAddress.streetName==undefined || $scope.ticket.delivery.otherAddress.streetNumber==undefined) && ($scope.ticket.delivery.thirdPerson==null || $scope.ticket.delivery.thirdPerson.fullNameUser==undefined || $scope.ticket.delivery.thirdPerson.dni==undefined))){
                                        $scope.formValidated=false;
                                    }else{
                                        $scope.formValidated=true;
                                    }
                                }else if ($scope.ticket.delivery.idTypeDeliveryKf=="3"){
                                    $scope.formValidated=true;
                                }
                            }
                        }else if ($scope.fSwitch=="d" && $scope.sysLoggedUser.idProfileKf!=0){
                            console.info("ENTRO AL CASE 3 : BAJA DE LLAVE - PASO 3: LLAVEROS DE LA SOLICITUD");
                            if (($scope.ticket.optionTypeSelected.name=="department" && 
                                ($scope.ticket.radioButtonDepartment==null || $scope.ticket.radioButtonDepartment==undefined || $scope.selectedRequestKeyOwnerUser==null || $scope.selectedRequestKeyOwnerUser==undefined)) || 
                                ($scope.ticket.optionTypeSelected.name=="building" && ($scope.ticket.radioButtonBuilding==undefined || $scope.ticket.radioButtonBuilding==null)) || 
                                $scope.list_keys.length==0){
                                $scope.formValidated=false;
                            }else{
                                $scope.formValidated=true;
                            }
                        }
                    break;
                    case 3: console.log($scope.ticket);
                        if ($scope.fSwitch=="n" && $scope.sysLoggedUser.idProfileKf!=0){
                            //PASO 4: MÉTODO DE PAGO
                            if ($scope.ticket.cost.idTypePaymentKf==null || $scope.ticket.cost.idTypePaymentKf==undefined){
                                $scope.formValidated=false;
                            }else{
                                $scope.formValidated=true;
                            }
                        }else if ($scope.sysLoggedUser.idProfileKf==3 || ($scope.sysLoggedUser.idProfileKf==3 && $scope.sysLoggedUser.idTypeTenantKf==1)){
                            //alert("ENTRO");
                            if (!$scope.ticket.idClientDepartament || $scope.tenant.namesTenant==""){
                                $scope.formValidated=false;
                            }else{
                                $scope.formValidated=true;
                            }
                        }
                    break;
                    default:
                } 
            }
        /**************************************************/
            $scope.switchTabSelected=null;
            $scope.switchTab = function (value) {
                
                /*--------------*/
                $scope.switchTabSelected=value;
                console.log($scope.ticket);
                if($scope.ticket.radioButtonDepartment && value==2){
                    var typeT1 = $('#typeTenant1').is(':checked');
                    var typeT2 = $('#typeTenant2').is(':checked');
                    console.log("typeTenant: "+$scope.ticket.radioButtonDepartment+" / radioButtonDepartment: "+$scope.ticket.radioButtonDepartment);
                    console.log("typeT1: "+typeT1+" / typeT2: "+typeT2);
                    $scope.ticket.radioButtonDepartment=0;
                    if(typeT1!=false || typeT2!=false){
                        console.log("cleaning... the department radio button");
                        document.getElementById("typeTenant1").checked=false;
                        document.getElementById("typeTenant2").checked=false;
                    }
                }else if($scope.ticket.radioButtonDepartment && value==1){
                    var typeO1 = $('#typeOption1').is(':checked');
                    var typeO2 = $('#typeOption2').is(':checked');
                    console.log("typeTenant: "+$scope.ticket.radioButtonDepartment+" / radioButtonDepartment: "+$scope.ticket.radioButtonDepartment);
                    console.log("typeO1: "+typeO1+" / typeO2: "+typeO2);
                    $scope.ticket.radioButtonDepartment=0;
                    if(typeO1!=false || typeO2!=false){
                        console.log("cleaning... the building radio button");
                        document.getElementById("typeOption1").checked=false;
                        document.getElementById("typeOption2").checked=false;
                    }
                }
                if ($scope.IsTicket){
                    $scope.formValidated=false; 
                    /*--------------------------------*/
                    $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
                    $scope.tenantNotFound = false;
                }
                if(value==1){
                    $scope.collap=1;
                    $scope.getDeptoListByAddress($scope.select.buildings.selected.idClient);
                }else if(value==2){
                    $scope.collap=2;
                }
            //console.log("Collap : "+$scope.collap)
            //console.log("isCollapsed : "+$scope.isCollapsed)
            };
            $scope.setOptionType = function(obj) {
                var elem = angular.element(obj.target);// or angular.element(obj.target);
                console.log(elem)
                switch (elem[0].getAttribute("id")){
                    case "department":
                        if ($scope.ticket.optionTypeSelected.name==undefined){
                            $scope.ticket.optionTypeSelected.name = elem[0].getAttribute("id");
                            $scope.ticket.optionTypeSelected.obj = elem;
                            elem.removeClass('btn-primary').addClass("btn-success");
                        }else if ($scope.ticket.optionTypeSelected.name!=elem[0].getAttribute("id")){
                            document.getElementById("typeOption1").checked=false;
                            document.getElementById("typeOption2").checked=false;
                            $scope.ticket.radioButtonBuilding=undefined;
                            $scope.list_keys = [];
                            var removeElem = document.getElementById("building")
                            //console.log(removeElem)
                            $scope.ticket.optionTypeSelected.name = elem[0].getAttribute("id");
                            $scope.ticket.optionTypeSelected.obj = elem;
                            elem.removeClass('btn-primary').addClass("btn-success");
                        }
                    break;
                    case "building":
                        if ($scope.ticket.optionTypeSelected.name==undefined){
                            $scope.ticket.optionTypeSelected.name = elem[0].getAttribute("id");
                            elem.removeClass('btn-primary').addClass("btn-success");
                        }else if ($scope.ticket.optionTypeSelected.name!=elem[0].getAttribute("id")){
                            //document.getElementById("typeTenant1").checked=false;
                            //document.getElementById("typeTenant2").checked=false;
                            $scope.ticket.radioButtonDepartment=undefined;
                            $scope.ticket.idClientDepartament=undefined;
                            $scope.selectedUser=undefined;
                            $scope.list_keys = [];
                            var removeElem = document.getElementById("department")
                            $scope.ticket.optionTypeSelected.name = elem[0].getAttribute("id");
                            $scope.ticket.optionTypeSelected.obj = elem;
                            elem.removeClass('btn-primary').addClass("btn-success");
                        }
                    break;
                    default:
                }
                console.log($scope.ticket);
             };
        /**************************************************
        *                                                 *
        *            GET ADMINISTRATION LIST              *
        *                                                 *
        **************************************************/
            $scope.getAdminListFn = function() {
                $scope.administrationList = [];
                $scope.globalGetCustomerListFn(null,"0",1,"","",null).then(function(data) {
                  $scope.administrationList = data.customers;
                }, function(err) {
                    $scope.administrationList = [];
                });
              };
        /**************************************************
        *                                                 *
        *                GET BUILDING LIST                *
        *                                                 *
        **************************************************/
            $scope.buildingList = [];
            $scope.getBuildingListFn = function(obj){
                $scope.buildingList = [];
                $scope.ticket.administration=obj;
                CustomerServices.getCustomersListByCustomerId(obj.idClient).then(function(response){
                    if(response.status==200){
                        $scope.buildingList = response.data;
                    }else if (response.status==404){
                        $scope.buildingList = [];
                        inform.add('No hay consorcios asociados a la administracion seleccionada, contacte al area de soporte de TASS.',{
                        ttl:5000, type: 'warning'
                        });
                    }else if (response.status==500){
                        $scope.buildingList = [];
                        inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                        ttl:5000, type: 'danger'
                        });
                    }
                });
             };
        /**************************************************
        *                                                 *
        *                GET DELIVERY TYPES               *
        *                                                 *
        **************************************************/
         $scope.typedelivery = [];
         $scope.getDeliveryTypesFn = function(obj){
             $scope.typedelivery = [];
             ticketServices.typeDelivery().then(function(response){
                 if(response.status==200){
                     $scope.typedelivery = response.data;
                 }else if (response.status==404){
                     $scope.typedelivery = [];
                     inform.add('No hay tipos de deliverys registrados, contacte al area de soporte de TASS.',{
                     ttl:5000, type: 'warning'
                     });
                 }else if (response.status==500){
                     $scope.typedelivery = [];
                     inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                     ttl:5000, type: 'danger'
                     });
                 }
             });
          };
        /**************************************************
        *                                                 *
        * DEPARTMENT LIST BY SELECTED ADDRESS AND TENANT  *
        *                                                 *
        **************************************************/
             $scope.ListDpto=[];
             $scope.dptoNotFound = true;
             $scope.getDeptoListByAddress = function (idAddress){
                 if(idAddress!=undefined){
                     $scope.ListDpto=[];
                     var idStatusFk='-1';
                     DepartmentsServices.byIdDireccion(idAddress, idStatusFk).then(function(response) {
                         if(response.status==200){
                            $scope.dptoNotFound = false;
                            $scope.ListDpto = response.data;
                             //console.log($scope.ListDpto);
                         }else if (response.status==404){
                             $scope.ListDpto=[];
                             $scope.dptoNotFound = true;
                             inform.add('No hay departamentos en esta direccion para ser asociados, contacte al area de soporte de TASS.',{
                             ttl:5000, type: 'danger'
                             });
                         }
                     });
                 }
             };
        /**************************************************
        *                                                 *
        *         LIST OF ATTENDANTS BY ID ADDRESS        *
        *                                                 *
        **************************************************/
            $scope.attendantListByAddress = [];
            $scope.getAttendantListFn = function(idAddress){
                $scope.attendantListByAddress = [];
                userServices.attendantsOnlyList(idAddress).then(function(response) {
                    if(response.status==200){
                        $scope.attendantListByAddress = response.data;
                        $scope.attendantFound=true;
                    }else if (response.status==404){
                        $scope.attendantFound=false;
                        $scope.attendantListByAddress = [];
                        if ($scope.isRequest!="costs"){
                            inform.add('No se encontraron Encargados asociados al consorcio seleccionado. ',{
                                ttl:5000, type: 'info'
                            });
                        }
                    }else if (response.status==500){
                        $scope.attendantFound=false;
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                    }
                });
                
            }
        /**************************************************
        *                                                 *
        *                 LIST PRODUCTS                   *
        *                                                 *
        **************************************************/
            $scope.rsKeyProductsData = [];
            $scope.getKeysAssociatedToACustomerFn = function(idClient){
                console.log("getKeysAssociatedToACustomerFn-->Service")
                CustomerServices.getKeysAssociatedToACustomerService(idClient).then(function(response){
                    if(response.status==200){
                        $scope.rsKeyProductsData = response.data;
                        console.info($scope.keyList);
                        $timeout(function() {
                            $scope.select.products.selected={'idStatusFk':$scope.rsKeyProductsData[0].idStatusFk,'contractStatus':$scope.rsKeyProductsData[0].contractStatus,'serviceName':$scope.rsKeyProductsData[0].serviceName,'idProduct':$scope.rsKeyProductsData[0].idProduct,'descriptionProduct':$scope.rsKeyProductsData[0].descriptionProduct,'codigoFabric':$scope.rsKeyProductsData[0].codigoFabric,'brand':$scope.rsKeyProductsData[0].brand,'model':$scope.rsKeyProductsData[0].model,'idProductClassificationFk':$scope.rsKeyProductsData[0].idProductClassificationFk,'isNumberSerieFabric':$scope.rsKeyProductsData[0].isNumberSerieFabric,'isNumberSerieInternal':$scope.rsKeyProductsData[0].isNumberSerieInternal,'isDateExpiration':$scope.rsKeyProductsData[0].isDateExpiration,'isControlSchedule':$scope.rsKeyProductsData[0].isControlSchedule,'isRequestNumber':$scope.rsKeyProductsData[0].isRequestNumber,'priceFabric':$scope.rsKeyProductsData[0].priceFabric,'classification':$scope.rsKeyProductsData[0].classification};
                            console.log($scope.select.products.selected);
                        }, 1700);
                    }else if (response.status==404){
                        $scope.rsKeyProductsData = [];
                    }else if (response.status==500){
                        $scope.rsKeyProductsData = [];
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                    }
                });
                
            }
        /**************************************************
        *                                                 *
        *                 LIST PRODUCTS                   *
        *                                                 *
        **************************************************/
            $scope.rsCustomerAccessControlDoors = [];
            $scope.getControlAccessDoorsAssociatedToACustomerFn = function(idClient){
                $scope.rsCustomerAccessControlDoors = [];
                //console.log("Getting --> ControlAccessDoorsAssociatedToACustomerFn");
                CustomerServices.getControlAccessDoorsAssociatedToACustomerServices(idClient).then(function(response){
                    console.log(response.data);
                    if(response.status==200){
                        $scope.rsCustomerAccessControlDoors = response.data;
                    }else if (response.status==404){
                        $scope.rsCustomerAccessControlDoors = [];
                    }else if (response.status==500){
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                    }
                });
                //console.log($scope.rsCustomerAccessControlDoors);
            }
            $scope.rsCustomerInterneServices = [];
            $scope.rsControlAccessAssociated = false;
            $scope.checkControlAccessStateFn = function(idClient){
                $scope.rsCustomerInterneServices = [];
                //console.log("Getting --> ControlAccessDoorsAssociatedToACustomerFn");
                CustomerServices.getCheckControlAccessState(idClient).then(function(response){
                    console.log(response.data);
                    if(response.status==200){
                        for (var srv in response.data){
                            console.info(response.data[srv])
                            console.info(response.data[srv].idServiceAsociateFk_array.length);
                            console.info(response.data[srv].idServiceAsociateFk_array);
                            console.info(response.data[srv].idServiceAsociateFk_array[0]);
                            if (response.data[srv].idServiceAsociateFk_array.length>0){
                                for (var srva in response.data[srv].idServiceAsociateFk_array){
                                    console.info(response.data[srv].idServiceAsociateFk_array[srva])
                                    if (response.data[srv].idServiceAsociateFk_array[srva]!=null && response.data[srv].idServiceAsociateFk_array[srva][0].idClientServicesAccessControl!=undefined){
                                        $scope.getCostByCustomer.rate.deviceIsOnline="1";
                                        console.log($scope.getCostByCustomer);
                                        $scope.getServiceCostByCustomerFn($scope.getCostByCustomer);
                                        $scope.rsControlAccessAssociated = true;
                                        break;
                                    }else{
                                        console.log($scope.getCostByCustomer);
                                        $scope.rsControlAccessAssociated = false;
                                    }
                                }
                                if (!$scope.rsControlAccessAssociated){
                                    $scope.getCostByCustomer.rate.deviceIsOnline="2";
                                    //console.log($scope.getCostByCustomer);
                                    $scope.getServiceCostByCustomerFn($scope.getCostByCustomer);
                                }
                            }else{
                                $scope.getCostByCustomer.rate.deviceIsOnline="2";
                                //console.log($scope.getCostByCustomer);
                                $scope.getServiceCostByCustomerFn($scope.getCostByCustomer);
                            }
                            if ($scope.rsControlAccessAssociated){
                                break;
                            }
                        }
                    }else if (response.status==404){
                        $scope.getCostByCustomer.rate.deviceIsOnline="2";
                        $scope.getServiceCostByCustomerFn($scope.getCostByCustomer);
                    }else if (response.status==500){
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                    }
                });
                //console.log($scope.rsCustomerInterneServices);
            }
        /**************************************************
        *                                                 *
        *     SELECCIONA DATA DE TENANT SELECCIONADO      *
        *                 DE LA LISTA                     *
        **************************************************/
            $scope.listTenantByDepto = [];
            $scope.lisTenantsByDepto = function(idDepto, idTypeTenant){
                $scope.listTenantByDepto = [];
                var typeTenant=idTypeTenant==null?-1:idTypeTenant;
                if (($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==4 || $scope.sysLoggedUser.idProfileKf==5 || $scope.sysLoggedUser.idProfileKf==6) && $scope.sysLoggedUser.idTypeTenantKf!=null){
                    DepartmentsServices.listTenant2AssignedDeptoByIdDeptoByTypeTenant(idDepto, typeTenant).then(function(response) {
                        console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                        if(response.status==200){
                            console.log(response);
                            $scope.listTenantByDepto = response.data.tenant;
                        }else if (response.status==404){
                            $scope.listTenantByDepto =[];
                        }else if (response.status==500){
                            $scope.listTenantByDepto =[];
                        }
                    });
                }else{
                    DepartmentsServices.listTenantsWithoutKeyAssignedByIdDepto(idDepto).then(function(response) {
                        console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                        if(response.status==200){
                            console.log(response.data);
                            switch (typeTenant){
                                case "1":
                                    console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                                    for (var user in response.data){
                                        if (response.data[user].idTypeTenantKf==typeTenant){
                                            $scope.listTenantByDepto.push(response.data[user]);
                                            break;
                                        }
                                    }
                                break;
                                case "2":
                                    console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                                    for (var user in response.data){
                                        if (response.data[user].idTypeTenantKf==typeTenant){
                                            $scope.listTenantByDepto.push(response.data[user]);
                                        }
                                    }
                                break;
                                default:
                            }
                            console.log($scope.listTenantByDepto);
                            $scope.tenantNotFound=false; 
                        }else if (response.status==404){
                            $scope.tenantNotFound=true;
                            $scope.listTenantByDepto =[];
                            $scope.messageInform1 = " Propietario registrado.";
                            $scope.messageInform2 = " inquilinos registrados.";
                            $scope.messageInform  = typeTenant == 1 ? $scope.messageInform1 : $scope.messageInform2;
                            inform.add('El departamento no presenta'+$scope.messageInform+'.',{
                                ttl:3000, type: 'warning'
                            });
                        }else if (response.status==500){
                            $scope.tenantNotFound=true;
                            $scope.listTenantByDepto =[];
                            inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                                ttl:3000, type: 'danger'
                            });
                        }
                    });
                }
            }
        /**************************************************
        *                                                 *
        *     SELECCIONA DATA DE TENANT SELECCIONADO      *
        *                 DE LA LISTA                     *
        **************************************************/
            $scope.listTenantByType =[];
            $scope.lisTenantsByType = function(idDepto, idTypeTenant){
                $scope.listTenantByType =[];
                var typeTenant=idTypeTenant==null?-1:idTypeTenant;
                if (($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==5 || $scope.sysLoggedUser.idProfileKf==6) && $scope.sysLoggedUser.idTypeTenantKf!=null){
                    DepartmentsServices.listTenant2AssignedDeptoByIdDeptoByTypeTenant(idDepto, typeTenant).then(function(response) {
                        if(response.status==200){
                            console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                            $scope.listTenantByType = response.data.tenant;
                        }else if (response.status==404){
                            $scope.listTenantByType =[];
                        }else if (response.status==500){
                            $scope.listTenantByType =[];
                        }
                    });
                }else{
                    DepartmentsServices.listTenant2AssignedDeptoByIdDepto(idDepto).then(function(response) {
                        if(response.status==200){
                            switch (typeTenant){
                                case "1":
                                    console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                                    for (var user in response.data.tenant){
                                        if (response.data.tenant[user].idTypeTenantKf==typeTenant){
                                            $scope.listTenantByType = response.data.tenant;
                                            break;
                                        }
                                    }
                                break;
                                case "2":
                                    console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                                    for (var user in response.data.tenant){
                                        if (response.data.tenant[user].idTypeTenantKf==typeTenant){
                                            $scope.listTenantByType.push(response.data.tenant[user]);
                                        }
                                    }
                                break;
                                default:
                            }
                            $scope.tenantNotFound=false; 
                            console.log(response.data.tenant);
                            console.log($scope.listTenantByType);
                            
                        }else if (response.status==404){
                            $scope.tenantNotFound=true;
                            $scope.listTenantByType =[];
                            $scope.messageInform1 = " Propietario registrado.";
                            $scope.messageInform2 = " inquilinos registrados.";
                            $scope.messageInform  = typeTenant == 1 ? $scope.messageInform1 : $scope.messageInform2;
                            inform.add('El departamento no presenta'+$scope.messageInform+'.',{
                                ttl:3000, type: 'warning'
                            });
                        }else if (response.status==500){
                            $scope.tenantNotFound=true;
                            inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                                ttl:3000, type: 'danger'
                            });
                        }
                    });
                }
            }
        /**************************************************
        *                                                 *
        *   FUNCTION TO CONCATENATE NAMES ATT IN SELECT   *
        *                                                 *
        **************************************************/
            $scope.combined_products = function(product){
                return product.descriptionProduct+ " Precio:" + product.priceFabric;
            }
        /**************************************************
        *                                                 *
        *   FUNCTION TO CONCATENATE NAMES ATT IN SELECT   *
        *                                                 *
        **************************************************/
            $scope.combined_att = function(att){
                if(att.idTyepeAttendantKf == '1'){
                    return att.fullNameUser+ " (" + att.nameTypeAttendant + ") Funcion: "+att.descOther;
                }
                else {
                    return att.fullNameUser + " (" + att.nameTypeAttendant + ")";
                }
            }
            $scope.addDoorOpenList = function(item){
                if (item.selected){
                    $scope.list_doors.push(item);
                }else{
                    for (var key in  $scope.list_doors){
                        if ($scope.list_doors[key].idAccessControlDoor==item.idAccessControlDoor){
                            $scope.list_doors.splice(key,1);
                        }
                    }
                }
                console.log($scope.list_doors);
            }
        /**************************************************
        *                                                 *
        *                CHECK MAIL OR DNI                *
        *                   DUPLICATES                    *
        *                                                 *|
        **************************************************/
            $scope.sysCheck4Duplicates = function(value, opt){
                if(value){
                    //console.log($scope.users.update.mail);
                    //console.log(value);
                    //console.log(opt);
                    if (((($scope.tenant.new!=undefined && $scope.tenant.new.dni!="" && opt=="dni") || ($scope.tenant.new!=undefined && $scope.tenant.new.mail!="" && opt=="mail")) || 
                        (($scope.tenant.update!=undefined && $scope.tenant.tmp.dni!=value && opt=="dni") || ($scope.tenant.update!=undefined && $scope.tenant.tmp.mail!=value && opt=="mail"))) ||
                        ((($scope.attendant.new!=undefined && $scope.attendant.tmp.dni!=value && opt=="dni") || ($scope.attendant.new!=undefined && $scope.attendant.tmp.mail!=value && opt=="mail")) ||
                        (($scope.attendant.update!=undefined && $scope.attendant.tmp.dni!=value && opt=="dni") || ($scope.attendant.update!=undefined && $scope.attendant.tmp.mail!=value && opt=="mail")))
                        ){
                        userServices.findUserByEmail(value).then(function(response) {
                            console.log(response.data);
                            console.log($scope.tenant.new);
                            if(response.status==200){
                                if(APP_REGEX.checkDNI.test(value)){
                                    $scope.sysDNIRegistered=true;
                                    //console.log(response.data[0].fullNameUser);
                                    if ($scope.isNewTenant && $scope.tenant.new.idTypeTenantKf!="1"){
                                        $scope.tenant.new.dni=undefined;
                                    }else{
                                        $scope.tenant.new.idUser = response.data[0].idUser;
                                        $scope.tenant.new.fullname = response.data[0].fullNameUser;
                                        $scope.tenant.new.dni = response.data[0].dni;
                                        $scope.tenant.new.mail = response.data[0].emailUser;
                                        $scope.tenant.new.phoneMovilNumberUser = response.data[0].phoneNumberUser;
                                        $scope.tenant.new.phonelocalNumberUser = response.data[0].phoneLocalNumberUser;
                                    }
                                    $scope.attendant.new.dni=undefined;
                                }
                                if(APP_REGEX.checkEmail.test(value)){
                                    $scope.sysEmailRegistered=true;
                                }
                            }else if (response.status==404){
                                if(APP_REGEX.checkDNI.test(value)){
                                    $scope.sysDNIRegistered=false;
                                }
                                if(APP_REGEX.checkEmail.test(value)){
                                    $scope.sysEmailRegistered=false;
                                }
                            }
                        });
                    }
                }
            }
        /**************************************************
        *                                                 *
        *           CHECK IF A DEPTO HAS OWNER            *
        *                                                 *
        **************************************************/
            $scope.ownerFound=false;
            $scope.checkDeptoOwner = function(idDepartment){
                $scope.ownerFound=false;
                var idDepartmentKf = idDepartment;
                console.log(idDepartmentKf);
                if (($scope.isNewTenant && $scope.tenant.new.idTypeTenantKf!=undefined && $scope.tenant.new.idTypeTenantKf==1) || ($scope.isUpdateTenant && $scope.tenant.update.idTypeTenantKf!=undefined && $scope.tenant.update.idTypeTenantKf==1)){
                    if ($scope.isNewTenant){
                        $scope.tenant.new.idProfileKf = 3;
                    }
                    if ($scope.isUpdateTenant){
                        $scope.tenant.update.idProfileKf = 3;
                    }
                }else{
                    if ($scope.isNewTenant){
                        $scope.tenant.new.idProfileKf = 5;
                    }
                    if ($scope.isUpdateTenant){
                        $scope.tenant.update.idProfileKf = 5;
                    }
                }
                //console.log(idDepartment);
                if(((($scope.tenant.new!=undefined && $scope.tenant.new.idProfileKf=="3") || ($scope.tenant.update!=undefined && $scope.tenant.update.idProfileKf=="3"))) || ((($scope.attendant.new!=undefined && $scope.attendant.new.idProfileKf=="6") || ($scope.attendant.update!=undefined && $scope.attendant.update.idProfileKf=="6")) && $scope.att.ownerOption==1)){
                    DepartmentsServices.chekDepartamenteOwner(idDepartmentKf).then(function(response){
                        console.log(response);
                        if(response.status==200){
                            if (response.data==true){
                                $scope.ownerFound=true;
                                if ($scope.isNewTenant){
                                    $scope.tenant.new.idTypeTenantKf=undefined;
                                }
                                if ($scope.isUpdateTenant){
                                    $scope.tenant.update.idTypeTenantKf=undefined;
                                }
                                $scope.att.ownerOption=undefined;
                                $scope.attendant.new.idDepartmentKf=undefined;
                                console.log("EL DEPTO                        : "+idDepartmentKf+" Ya tiene un propietario Asignado");
                                //console.log("$scope.ownerFound               : "+$scope.ownerFound);
                                //console.log("$scope.attendant.new.idProfileKf: "+$scope.attendant.new.idProfileKf);
                                //console.log("$scope.att.ownerOption          : "+$scope.att.ownerOption);
                            }else if(response.data==false){
                                $scope.ownerFound=false;
                                console.log("EL DEPTO                        : "+idDepartmentKf+" No tiene un propietario Asignado");
                            }
                        }
                    });
                }
            }
        /**************************************************
        *                                                 *
        *           CHECK IF A DEPTO HAS OWNER            *
        *                                                 *
        **************************************************/
            $scope.titularAttendantFound=false;
            $scope.checBuildingTitularAttendant = function(idAddress){
                $scope.titularAttendantFound=false;
                //console.log(idDepartment);
                userServices.checBuildingTitularAttendant(idAddress).then(function(response){
                    if(response.status==200){
                        $scope.titularAttendantFound=true;
                        console.log("EL CONSORCIO   : "+idAddress+" Ya tiene un Encargado Titular Asociado");
                    }else if(response.data==false){
                        $scope.titularAttendantFound=false;
                        console.log("EL CONSORCIO   : "+idAddress+" No tiene un Encargado Titular Asociado");
                    }
                });
            }
            $scope.filterTitularAttendantOption = function(item){
                if ($scope.titularAttendantFound){
                    if (item.idTyepeAttendant!='2'){
                        return item;
                    }
                }else{
                    return item;
                }
            };
        /**************************************************
        *                                                 *
        *   ASSIGN DEPARTMENT TO THE CURRENT OWNER USER   *
        *                                                 *
        **************************************************/
            $scope.fnAssignDepto = function(userData){
                DepartmentsServices.assignDepto(userData).then(function(response) {
                    if(response.status==200){
                        inform.add('Departamento Asignado y pendiente por aprobacion por la administracion.',{
                        ttl:3000, type: 'success'
                        });
                    }else if (response.status==404){
                        inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:3000, type: 'danger'
                        });
                    }
                });
            }
        /**************************************************
        *                                                 *
        *  APPROVE DEPARTMENT TO AN OWNER OR TENANT USER  *
        *                                                 *
        **************************************************/
            $scope.approveDepto = function (type, id, idStatus) {
                switch (type){
                    case 1:
                    case "1"://OWNER
                        console .log("Depto: "+id)
                        DepartmentsServices.approveOwnerDepto(id).then(function(response) {
                            if(response.status==200){
                                inform.add('Departamento del propietario autorizado satisfactoriamente.',{
                                ttl:5000, type: 'success'
                                });
                                $timeout(function() {
                                    blockUI.stop();
                                }, 1500);
                                //$scope.lisTenantsByDeptoFn($scope.idDeptoKf, null);
                            }else if (response.status==404){
                                inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                ttl:5000, type: 'warning'
                                });
                            }
                        });
                    break;
                    case 2: 
                    case "2"://TENANT
                    console .log("User: "+id)
                    DepartmentsServices.approveTenantDepto(id, idStatus).then(function(response) {
                        if(response.status==200){
                            inform.add('Departamento del Habitante autorizado satisfactoriamente.',{
                            ttl:5000, type: 'success'
                            });
                            $timeout(function() {
                                blockUI.stop();
                            }, 1500);
                            //$scope.lisTenantsByDeptoFn($scope.idDeptoKf, null);
                        }else if (response.status==404){
                            inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'warning'
                            });
                        }
                    });
                break;
                }
            };

        /**************************************************
        *                                                 *
        *         ADD OWNER / TENANT / ATTENDANT          *
        *                                                 *
        **************************************************/
            $scope.sysRegisterTenantFn = function(){
                console.log($scope.register);
                $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                userServices.addUser($scope.register).then(function(response_tenantRegister){
                    if(response_tenantRegister.status==200){
                        console.log("REGISTERED SUCCESSFULLY");
                        inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                        ttl:5000, type: 'success'
                        });
                        userServices.findUserByEmail($scope.register.user.dni).then(function(response_tenantFound) {
                            if(response_tenantFound.status==200){
                                //OWNERS AND TENANTS
                                if(($scope.register.user.idProfileKf==3 || $scope.register.user.idProfileKf==4 || $scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==1 && $scope.register.user.idDeparment_Tmp){
                                    blockUI.start('Asociando usuario al departamento seleccionado.');
                                    $timeout(function() {
                                        $scope.depto.department.idUserKf           = response_tenantFound.data[0].idUser;
                                        $scope.depto.department.idDepartment       = $scope.register.user.idDeparment_Tmp;
                                        $scope.depto.department.isApprovalRequired = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?false:true;
                                    }, 1500); 
                                    //console.log(response_tenantFound);
                                    //OWNER
                                    $timeout(function() {
                                        blockUI.message('Asignando departamento al usuario.');
                                        $scope.fnAssignDepto($scope.depto);
                                    }, 2000);
                                    $timeout(function() {
                                        blockUI.message('Aprobando departamento del usuario.');
                                        $scope.approveDepto($scope.register.user.idTypeTenantKf, $scope.depto.department.idDepartment, 1);
                                    }, 3000);
                                    $timeout(function() {
                                        blockUI.message('Actualizando listado.');
                                        if ($scope.ticket.optionTypeSelected.name=="department" && ($scope.ticket.radioButtonDepartment=="1" || $scope.ticket.radioButtonDepartment=="2")){
                                            $scope.lisTenantsByType($scope.ticket.idClientDepartament.idClientDepartament, $scope.ticket.radioButtonDepartment);
                                        }else{
                                            $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                        }
                                        blockUI.stop();
                                    }, 3500);
                                }else if(($scope.register.user.idProfileKf==4 || $scope.register.user.idProfileKf==5 || $scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==2 && $scope.register.user.idDepartmentKf){
                                    blockUI.start('Aprobando departamento del usuario.');
                                    $timeout(function() {
                                        $scope.depto.department.idUserKf        = response_tenantFound.data[0].idUser;
                                        $scope.depto.department.idDepartment    = $scope.register.user.idDepartmentKf;
                                    }, 1500);
                                    $timeout(function() {
                                        //TENANT
                                        $scope.approveDepto($scope.register.user.idTypeTenantKf, $scope.depto.department.idUserKf, 1);
                                    }, 2000);
                                    $timeout(function() {
                                        blockUI.message('Actualizando listado.');
                                        if ($scope.ticket.optionTypeSelected.name=="department" && ($scope.ticket.radioButtonDepartment=="1" || $scope.ticket.radioButtonDepartment=="2")){
                                            $scope.lisTenantsByType($scope.ticket.idClientDepartament.idClientDepartament, $scope.ticket.radioButtonDepartment);
                                        }else{
                                            $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                        }
                                        blockUI.stop();
                                    }, 3000);
                                }else if(($scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==null){
                                    blockUI.start('Actualizando listado.');
                                    $timeout(function() {
                                        $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                        blockUI.stop();
                                    }, 3000);
                                }
                            }
                        });
                    }else if (response_tenantRegister.status==404){
                        inform.add('[Error]: '+response_tenantRegister.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                            ttl:5000, type: 'warning'
                            });
                    }else if(response_tenantRegister.status==500){
                        inform.add('[Error]: '+response_tenantRegister.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                    }
                });
                $('#RegisterTenant').modal('hide');
                $('#RegisterAttendant').modal('hide');
            }
        /**************************************************
        *                                                 *
        *                   UPDATE USER                   *
        *                                                 *
        **************************************************/
            $scope.sysUpdateTenantFn = function(){
                //console.log($scope.update.user);
                userServices.updateUser($scope.update).then(function(response){
                    if(response.status==200){
                        if($scope.update.user.typeTenantChange){
                            console.log("Usuario: "+$scope.update.user.fullNameUser+" Successfully updated");
                            inform.add('El Usuario: '+$scope.update.user.fullNameUser+' ha sido actualizado con exito. ',{
                                ttl:3000, type: 'success'
                            });
                            //OWNERS AND TENANTS
                            if(($scope.update.user.idProfileKf==3 || $scope.update.user.idProfileKf==4 || $scope.update.user.idProfileKf==6) && $scope.update.user.idTypeTenantKf==1 && $scope.update.user.idDeparment_Tmp){
                                blockUI.start('Asociando usuario al departamento seleccionado.');
                                $timeout(function() {
                                    $scope.depto.department.idUserKf           = $scope.update.user.idUser;
                                    $scope.depto.department.idDepartment       = $scope.update.user.idDeparment_Tmp;
                                    $scope.depto.department.isApprovalRequired = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?false:true;
                                }, 1500); 
                                //console.log(response_tenantFound);
                                //OWNER
                                $timeout(function() {
                                    console.log($scope.depto.department);
                                    blockUI.message('Asignando departamento del usuario.');
                                    $scope.fnAssignDepto($scope.depto);
                                }, 2000);
                                $timeout(function() {
                                    blockUI.message('Aprobando departamento del usuario.');
                                    $scope.approveDepto($scope.update.user.idTypeTenantKf, $scope.depto.department.idDepartment, 1);
                                }, 2500);
                                $timeout(function() {
                                    blockUI.message('Actualizando listado.');
                                    if ($scope.ticket.optionTypeSelected.name=="department" && ($scope.ticket.radioButtonDepartment=="1" || $scope.ticket.radioButtonDepartment=="2")){
                                        $scope.lisTenantsByType($scope.ticket.idClientDepartament.idClientDepartament, $scope.ticket.radioButtonDepartment);
                                    }else{
                                        $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                    }
                                    blockUI.stop();
                                }, 3000);
                            }else if(($scope.update.user.idProfileKf==4 || $scope.update.user.idProfileKf==5 || $scope.update.user.idProfileKf==6) && $scope.update.user.idTypeTenantKf==2 && $scope.update.user.idDepartmentKf){
                                blockUI.start('Aprobando departamento del usuario.');
                                $timeout(function() {
                                    $scope.depto.department.idUserKf        = $scope.update.user.idUser;
                                    $scope.depto.department.idDepartment    = $scope.update.user.idDepartmentKf;
                                }, 1500);
                                $timeout(function() {
                                    //TENANT
                                    $scope.approveDepto($scope.update.user.idTypeTenantKf, $scope.depto.department.idUserKf, 1);
                                    blockUI.stop();
                                }, 2000);
                                $timeout(function() {
                                    blockUI.message('Actualizando listado.');
                                    if ($scope.ticket.optionTypeSelected.name=="department" && ($scope.ticket.radioButtonDepartment=="1" || $scope.ticket.radioButtonDepartment=="2")){
                                        $scope.lisTenantsByType($scope.ticket.idClientDepartament.idClientDepartament, $scope.ticket.radioButtonDepartment);
                                    }else{
                                        $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                    }
                                    blockUI.stop();
                                }, 3000);
                            }else if(($scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==null){
                                blockUI.start('Actualizando listado.');
                                $timeout(function() {
                                    $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                    blockUI.stop();
                                }, 3000);
                            }
                        }else{
                            $timeout(function() {
                                console.log("Usuario: "+$scope.update.user.fullNameUser+" Successfully updated");
                                inform.add('El Usuario: '+$scope.update.user.fullNameUser+' ha sido actualizado con exito. ',{
                                    ttl:3000, type: 'success'
                                });
                                blockUI.message('Usuario: '+$scope.update.user.fullNameUser+' actualizado con exito');
                            }, 1500);
                            if($scope.sysSubContent=="departments"){
                                $timeout(function() {
                                    $scope.lisTenantsByDeptoFn($scope.idDeptoKf, null);
                                    blockUI.stop();
                                }, 2000);
                            }else if($scope.sysSubContent=="attendants"){
                                $timeout(function() {
                                    $scope.getDeptoListByAddress($scope.select.buildings.selected.idClient);
                                }, 1500);
                                $timeout(function() {
                                    $scope.getAttendantListFn($scope.select.buildings.selected.idClient);
                                    blockUI.stop();
                                }, 2000);
                            }
                        }
                    }else if (response.status==404){
                            $timeout(function() {
                                inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                ttl:5000, type: 'warning'
                                });
                                blockUI.message('Usuario: '+$scope.update.user.fullNameUser+' no sido actualizado.');
                                blockUI.stop();
                            }, 1500);
                    }else if(response.status==500){
                        $timeout(function() {
                            inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                            ttl:5000, type: 'danger'
                            });
                            blockUI.message('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor.');
                            blockUI.stop();
                        }, 1500);
                    }
                });
                $('#UpdateTenant').modal('hide');
                $('#UpdateAttendant').modal('hide');
            }
        /**************************************************
        *                                                 *
        *                  GET LOCATION                   *
        *                   LOCAL API                     *
        *                                                 *
        **************************************************/
            $scope.rsLocations_Data = {};
            $scope.getLocationByIdFn = function(idProvince){
                addressServices.getLocations(idProvince).then(function(data){
                    $scope.rsLocations_All = data;
                    //console.log($scope.rsLocations_Data);
                });
            };
        /**************************************************
        *                                                 *
        *         GET PROVINCE ID BY ADDRESS Name         *
        *                                                 *
        **************************************************/
            $scope.idProvinceFk=null;
            $scope.getAddressIdByNameFn = function(addressName, opt){
                //$scope.idProvinceFk=null;
                addressServices.getProvinceIdByName(addressName).then(function(data){
                $scope.idProvinceFk=data;
                switch(opt){
                    case 'main':
                    if (((!$scope.addrrSelected && $scope.customer.new.nameAddress!='') || !$scope.gobApiAddressNotFound) && $scope.customer.new.typeInmueble=='1' && $scope.customer.new.idTipoInmuebleFk=='1') {
                        $scope.getAddressByNameFn($scope.customer.new.nameAddress,'main');
                    }
                    break;
                    case 'particular':
                    if (((!$scope.addrrSelected && $scope.list_particular_address.nameAddress!='') || !$scope.gobApiAddressNotFound) && $scope.customer.particular.typeInmueble=='1'){
                        $scope.getAddressByNameFn($scope.list_particular_address.nameAddress,'particular');
                    }
                    break;
                    default:
                    $scope.idProvinceFk=null;
                }
                });
            }

       /**************************************************
       *                                                 *
       *              GET ADDRESS BY Name                *
       *                   API LOCAL                     *
       **************************************************/
            $scope.searchAddressByNameFn = function(item){
                $scope.ticket.delivery.thirdPerson.nameAddress=item.calle.nombre+" "+item.altura.valor;
                $scope.addrrSelected=true;
                $scope.rsAddress_API_Data_Main=null;
            }

        /**************************************************
        *                                                 *
        *              GET ADDRESS BY Name                *
        *                   API GOB AR                    *
        **************************************************/
            $scope.registerAdddressNotFound = function(){
                $scope.gobApiAddressNotFound=false;
                $scope.addrrSelected=false;
                $scope.customer.new.nameAddress='';
            }
            $scope.gobApiAddressNotFound=false;
            $scope.addrrSelected=false;
            $scope.addressLatLonOpt='';
            $scope.addressName='';
            $scope.rsAddress_API_Data_Main = {}; $scope.rsAddress_API_Data_Payment = {}; $scope.rsAddress_API_Data_PCA = {};
            $scope.getAddressByNameFn = function(name, idProvinceFk, opt){
                $scope.rsAddress_API_Data_Main = {}; $scope.rsAddress_API_Data_Payment = {}; $scope.rsAddress_API_Data_PCA = {};
                var twoNumber_patt=/^(?=(?:\D*\d){2})[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
                var idProvinceGobARFk= idProvinceFk!=undefined || idProvinceFk!=null?idProvinceFk:null;
                if (twoNumber_patt.test(name)){
                    addressServices.getAddressByName(name, idProvinceGobARFk).then(function(data){
                    if(data!=null){
                        switch(opt){
                        case "main":
                            $scope.rsAddress_API_Data_Main = data; //Main = Principal Customer Address
                        break;
                        case "payment":
                            $scope.rsAddress_API_Data_Payment = data; //Payment = Payment Customer Address
                        break;
                        case "particular":
                            $scope.rsAddress_API_Data_PCA = data;  //PCA = Particular Customer Address
                        break;
                        }
                        //console.log($scope.rsProfileData);
                        $scope.gobApiAddressNotFound=false;
                        $scope.addrrSelected=false;
                        $scope.enabledNextBtn();
                    }else{
                        $scope.gobApiAddressNotFound=true;
                        $scope.geoLocation = {'address':'','addressLat':'', 'addressLon':'', 'option':''};
                        inform.add('Direccion no encontrada en la API del Servicio de Normalizacion de Datos Geograficos. ',{
                            ttl:4000, type: 'danger'
                        });

                        $scope.searchAddressByNameFn(name,'address', opt);
                    }
                    });
                }else{
                    switch(opt){
                        case "main":
                        $scope.rsAddress_API_Data_Main = null; //Main = Principal Customer Address
                        break;
                        case "payment":
                        $scope.rsAddress_API_Data_Payment = null; //Payment = Payment Customer Address
                        break;
                        case "particular":
                        $scope.rsAddress_API_Data_PCA = null;  //PCA = Particular Customer Address
                        break;
                    }
                    $scope.addrrSelected=false;
                    //console.info("expected 2 numbers at least");
                    $scope.enabledNextBtn();
                }
            };
            function NaN2Zero(n){
                return isNaN( n ) ? 0 : n; 
            }
        /**************************************************
        *                                                 *
        *   GET COST OF SERVICES BY CUSTOMER ID           *
        *                                                 *
        **************************************************/
            $scope.buildingServiceValue=0;
            $scope.getServiceCostByCustomerFn = function(data){
                serviceServices.getServiceCostByCustomer(data).then(function(response) {
                    if(response.status==200){
                        $scope.ticket.cost.service   = Number(response.data.technician_service_cost[0].cost);
                        $scope.buildingServiceValue  = Number(response.data.technician_service_cost[0].cost);
                        $scope.customerCosts=true;
                    }else if (response.status==404){
                        inform.add('El consorcio no presenta costos de servicios asociados, contacte al area de soporte de TASS.',{
                            ttl:3000, type: 'warning'
                        });
                        $scope.customerCosts=false;
                        $scope.ticket.cost.service  = 0;
                        $scope.buildingServiceValue = 0;
                    }else if (response.status==500){
                        inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:3000, type: 'danger'
                        });
                        $scope.ticket.cost.service  = 0;
                        $scope.buildingServiceValue = 0;
                        $scope.customerCosts=false;
                    }
                });
            }
        /**************************************************
        *                                                 *
        *           GET DISABLED REASONS FOR KEY          *
        *                                                 *
        **************************************************/
         $scope.reasonDisabledKey = null;
         $scope.getDisabledReasonKeyFn = function(){
            UtilitiesServices.getDisabledReasonKey().then(function(response) {
                if(response.status==200){
                    $scope.reasonDisabledKey = response.data;
                }else if (response.status==404){
                    inform.add('Tipos de razones para dar de baja no encontradas, contacte al area de soporte de TASS.',{
                        ttl:3000, type: 'warning'
                    });
                    $scope.reasonDisabledKey = null;
                }else if (response.status==500){
                    inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                    ttl:3000, type: 'danger'
                    });
                    $scope.reasonDisabledKey = null;
                }
            });
        }
        /**************************************************
        *                                                 *
        *   GET ADMIN USERS OF AN ADMIN CUSTOMER BY ID    *
        *                                                 *
        **************************************************/
            $scope.getUsersByCompanyClientIdFn = function(data){
                userServices.getUsersByCompanyClientId(data).then(function(response) {
                    if(response.status==200){
                        $scope.ticket.companyUserList = response.data;
                    }else if (response.status==404){
                        inform.add('No hay Administradores asociados a la administración, contacte al area de soporte de TASS.',{
                            ttl:3000, type: 'warning'
                        });
                        $scope.ticket.companyUserList = null;
                    }else if (response.status==500){
                        inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:3000, type: 'danger'
                        });
                        $scope.ticket.companyUserList = null;
                    }
                });
            }
        /**************************************************
        *                                                 *
        *              GET CUSTOMER BY ID                 *
        *                                                 *
        **************************************************/
            $scope.getCustomerByIdFn = function(id, type){
                CustomerServices.getCustomersById(id).then(function(response){
                if(response.status==200){
                    if (type=="admin"){
                        $scope.ticket.administration = response.data;
                    }else{
                        $scope.ticket.building = response.data;
                        $scope.select.buildings.selected = response.data;
                    }
                }else if (response.status==404){
                    inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:3000, type: 'danger'
                    });
                    if (type=="admin"){
                        $scope.ticket.administration = undefined;
                    }else{
                        $scope.ticket.building = undefined;
                        $scope.select.buildings.selected = undefined;
                    }
                }else if (response.status==500){
                    inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                    ttl:3000, type: 'danger'
                    });
                        if (type=="admin"){
                        $scope.ticket.administration = undefined;
                    }else{
                        $scope.ticket.building = undefined;
                        $scope.select.buildings.selected = undefined;
                    }
                }
                });
            };
        /**************************************************
        *                                                 *
        *                  SYS TOKEN GEN                  *
        *                                                 *
        **************************************************/      
            $scope.sysTokenFn = function(vLength){
                $scope.charters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
                var randomString = '';
                for (i = 0; i < vLength; i++) {
                    randomString += $scope.charters.charAt(Math.floor(Math.random() * $scope.charters.length));
                }
                return randomString;
            }
        /**************************************************
        *                                                 *
        *               PROVINCE FILTER                   *
        *                                                 *
        **************************************************/  
            $scope.provincesAllowed = function(item){
                return item.idProvince == "1" || item.idProvince == "2";
            }
        /**************************************************
        *            SHOW ONLY ADMIN AND COMPANY          *
        *                 CUSTOMER OPTIONS                *
        **************************************************/
            $scope.checkDeliveryMethod = function(item){                
                if($scope.ticket.building!=undefined && ($scope.ticket.building.isStockInBuilding=='1' || (($scope.ticket.building.isStockInBuilding==null || $scope.ticket.building.isStockInBuilding=='0') && ($scope.ticket.building.isStockInOffice==null || $scope.ticket.building.isStockInOffice=='0')))){
                    return item.idTypeDelivery != "1";
                }else{
                    return item.idTypeDelivery;
                }
                
            };

            /******************************
            *    UTIL FOR CUSTOMER DATA   *
            ******************************/
            $scope.customersSearch={
                "searchFilter":null,
                "isNotCliente":"0",
                "idClientTypeFk":null,
                "isInDebt": null,
                "start":"1",
                "limit":"10",
                "strict": null
            }
            /**************************************************
            *                                                 *
            *             LIST CUSTOMER SERVICE               *
            *                                                 *
            **************************************************/
                $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
                $scope.setCustomersListRs = {}
                $scope.getCustomerLisServiceFn = function(searchFilter, isNotCliente, idClientTypeFk, isInDebt, start, limit, strict){
                    console.log($scope.customerSearch);
                    console.log(idClientTypeFk);
                    var searchFilter    = searchFilter!=undefined && searchFilter!="" && searchFilter!=null?searchFilter:null;
                    var isNotCliente    = isNotCliente!=undefined && isNotCliente!=null?isNotCliente:"0";
                    var idClientTypeFk  = idClientTypeFk!=undefined && idClientTypeFk!="" && idClientTypeFk!=null?idClientTypeFk:null;
                    var isInDebt        = isInDebt!=false && isInDebt!=undefined && isInDebt!=null?1:null;
                    var start           = start!=undefined && start!=null && (!isInDebt && !strict)?start:"";
                    var limit           = limit!=undefined && limit!=null && (!isInDebt && !strict)?limit:"";
                    var strict          = strict!=false && strict!=undefined && strict!=null?strict:null;
                    $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
                    $scope.customersSearch={
                    "searchFilter":searchFilter,
                    "isNotCliente":isNotCliente,
                    "idClientTypeFk":idClientTypeFk,
                    "isInDebt":isInDebt,
                    "start":start,
                    "limit":limit,
                    "strict":strict
                    };
                    console.log($scope.customersSearch);
                    return CustomerServices.getCustomerListLimit($scope.customersSearch).then(function(response){
                    //console.info(response);
                    if(response.status==200){
                        return response.data;
                    }else if(response.status==404){
                        return response;
                    }
                    });
                }
                $scope.getLisOfCustomersByIdFn = function(obj){
                    //console.log("getLisOfCustomersByIdFn: "+obj.idClient);
                    $scope.buildingList=[];
                    CustomerServices.getCustomersListByCustomerId(obj.idClient).then(function(response){
                      //console.log(response);
                      if(response.status==200){
                        $scope.buildingList = response.data;
                      }else{
                        $scope.buildingList = [];
                        inform.add('No hay Consorcios o Sucursales asociadas a la ('+obj.ClientType+') - '+obj.name+' , contacte al area de soporte de BSS.',{
                          ttl:5000, type: 'info'
                          });
                      }
                    });
                  };
        /**************************************************
        *                                                 *
        *                 SEARCH CUSTOMERS                *
        *                                                 *
        **************************************************/
            $scope.getCustomerBusinessNameByIdFn = function(clientId){
                //console.log("getCustomerBusinessNameByIdFn: "+clientId);
                var arrCompanySelect = [];
                if (clientId!=undefined){
                CustomerServices.getCustomersById(clientId).then(function(response){
                    if(response.status==200){
                    //console.log(response.data);
                    arrCompanySelect.push(response.data);
                    }
                });
                }else{
                    inform.add('Client Id, no recibido. ',{
                    ttl:4000, type: 'warning'
                    });
                }
                //console.log(arrCompanySelect);
                return arrCompanySelect;
            }
            $scope.searchCustomerFound=false;
            $scope.findCustomerFn=function(string, typeClient, strict){
                console.log(event.which);
                if(event.keyCode === 8 || event.which === 8){
                    console.log(event.which);
                    $scope.buildingList=[];
                    $scope.select.admins.selected=undefined;
                    $scope.select.buildings.selected=undefined;
                }else if(event.keyCode === 1 || event.which === 1 || event.keyCode === 13 || event.which === 13){
                    console.log("Search:");
                    console.log("string: "+string);
                    console.log("typeClient: "+typeClient);
                    console.log("strict: "+strict);
                    $scope.buildingList=[];
                    $scope.select.admins.selected=undefined;
                    $scope.select.buildings.selected=undefined;
                    var output=[];
                    var i=0;
                    if (string!=undefined && string!=""){
                        $scope.customerFound={};
                        $scope.getCustomerLisServiceFn(string, "0", typeClient, null, 0, 10, strict).then(function(response) {
                            if(response.status==undefined){
                            $scope.listCustomerFound = response.customers;
                            //$scope.pagination.totalCount = response.customers.length;
                            console.info($scope.listCustomerFound);
                            }else if(response.status==404){
                            $scope.listCustomerFound = [];
                            //$scope.pagination.totalCount  = 0;
                            } 
                        }, function(err) {
                            $scope.listCustomerFound = [];
                            //$scope.pagination.totalCount  = 0;
                        });
                    }else{
                        $scope.customerFound={};
                    }
                    console.info($scope.listCustomerFound);
                }

            }
            $scope.customerFound={};
            $scope.loadCustomerFieldsFn=function(obj){
                $scope.customerFound={};
                console.log("===============================");
                console.log("|  SERVICE CUSTOMER SELECTED  |");
                console.log("===============================");
                console.log(obj);
                $scope.select.admins.selected = undefined;
                $scope.customerFound=obj;
                $scope.customerSearch.name = obj.name;
                if (obj.idClientTypeFk=="1" || obj.idClientTypeFk=="3"){
                    $scope.select.admins.selected=obj;
                    $scope.ticket.administration=obj;
                    $scope.getLisOfCustomersByIdFn(obj);
                }else if (obj.idClientTypeFk=="2"){
                    if ($scope.customerFound.idClientAdminFk!=null && $scope.customerFound.idClientAdminFk!=undefined){
                        var arrCompany=[]
                        arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientAdminFk);
                        $timeout(function() {
                        if (arrCompany.length==1){
                            $scope.select.admins.selected=arrCompany[0];
                            $scope.ticket.administration=arrCompany[0];
                            console.log($scope.select.admins.selected);
                        }
                        }, 500);
                    }else{
                        inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                                ttl:10000, type: 'danger'
                        });
                    }
                    $scope.select.buildings.selected=obj;
                }else if (obj.idClientTypeFk=="4"){
                    if ($scope.customerFound.idClientBranchFk!=null && $scope.customerFound.idClientBranchFk!=undefined){
                        var arrCompany=[]
                        arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientBranchFk);
                        
                        $timeout(function() {
                        if (arrCompany.length==1){
                            $scope.select.admins.selected=arrCompany[0];
                            $scope.ticket.administration=arrCompany[0];
                            console.log($scope.select.admins.selected);
                        }
                        }, 500);
                    }else{
                        inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                                ttl:10000, type: 'danger'
                        });
                    }
                    $scope.select.buildings.selected=obj;
                }
                $scope.listCustomerFound=[];
                $timeout(function() {
                    $scope.mainSwitchFn('loadBuildingData', $scope.select.buildings.selected, null);
                }, 700);
                

            }
        /**************************************************
        *                                                 *
        *            TICKETS MENU FUNCTION                *
        *                                                 *
        **************************************************/
            $scope.mainSwitchFn = function(opt, obj, obj2){
                switch (opt){
                    case "selectTicketType":
                        $scope.sysContent                         = "";
                        $("#selectType").modal('toggle');
                    break;
                    case "selectPlace":
                        $scope.sysContent                         = "";
                        $("#selectPlace").modal('toggle');
                    break;
                    case "newKeyRequest":
                        $scope.sysContent                         = "";
                        $scope.sysSubContent                      = "";
                        $scope.select = {'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined};
                        $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
                        $scope.ticket = {'administration':undefined, 'building':undefined, 'idClientDepartament':undefined, 'radioButtonDepartment':undefined, 'radioButtonBuilding':undefined, 'optionTypeSelected': {}, 'userNotify':null, 'keys':[], 'delivery':{'idTypeDeliveryKf':null, 'whoPickUp':null, 'zone':{}, 'thirdPerson':undefined, 'deliveryTo':{}, 'otherAddress':undefined}, 'cost':{'keys':0, 'delivery':0, 'service':0, 'total':0}};
                        $scope.ticket.delivery.thirdPerson={};
                        $scope.costs={'keys':{'cost':0, 'manual':false}, 'delivery':{'cost':0, 'manual':false}, 'service':{'cost':0, 'manual':false}, 'total':0};
                        $scope.selectedUser = undefined;
                        $scope.ticketRegistered = null;
                        $scope.formValidated=false;
                        $scope.list_doors = [];
                        $scope.list_doors_ticket = [];
                        $scope.list_keys = [];
                        $scope.keysTotalPrice=0;
                        $scope.deliveryCostFree=0
                        $scope.getCostByCustomer={'rate':{'idCustomer':null, 'idServiceType':null, 'idServiceTechnician':null}};
                        $scope.getCostByCustomer.rate.idServiceType="1";
                        $scope.getCostByCustomer.rate.idServiceTechnician="1";
                        $scope.getDeliveryTypesFn();
                        $scope.ticket.requestDate = new Date();
                        $("#selectType").modal('hide');
                        $scope.btnShow=true;
                        $scope.btnBack=false;
                        $scope.stepIndexTmp=0;
                        $scope.IsTicket = true;
                        $scope.isRequest="up";
                        $scope.selectedRequestKeyOwnerUser=undefined;
                        selectSwitch ('n');
                        if ($scope.sysLoggedUser.idProfileKf==1){
                            //$scope.getAdminListFn(); //LOAD ADMINISTRATION LIST
                            $scope.sysContent                         = "tickets";
                            $scope.sysSubContent                      = "newKeyRequest";
                        }else if($scope.sysLoggedUser.idProfileKf==4 && !$scope.isHomeSelected){
                            $scope.isCompanyAdministrator = true;
                            console.log($scope.sysLoggedUser);
                            $scope.select.admins.selected = {'idClient': $scope.sysLoggedUser.company[0].idClient, 'name': $scope.sysLoggedUser.company[0].name};
                            $scope.getBuildingListFn($scope.sysLoggedUser.company[0]);
                            $scope.sysContent                         = "tickets";
                            $scope.sysSubContent                      = "newKeyRequest";
                        }else{
                            $scope.mainSwitchFn("myDepartments",null,null);
                        }
                    break;
                    case "removeKeyRequest":
                        $scope.sysContent                         = "";
                        $scope.sysSubContent                      = "";
                        $scope.select = {'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined};
                        $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
                        $scope.ticket = {'administration':undefined, 'building':undefined, 'idClientDepartament':undefined, 'radioButtonDepartment':undefined, 'radioButtonBuilding':undefined, 'reason':undefined,'optionTypeSelected': {}, 'userNotify':null, 'keys':[], 'delivery':{'idTypeDeliveryKf':null, 'whoPickUp':null, 'zone':{}, 'thirdPerson':undefined, 'deliveryTo':{}, 'otherAddress':undefined}, 'cost':{'keys':0, 'delivery':0, 'service':0, 'total':0}};
                        $scope.ticket.delivery.thirdPerson={};
                        $scope.costs={'keys':{'cost':0, 'manual':false}, 'delivery':{'cost':0, 'manual':false}, 'service':{'cost':0, 'manual':false}, 'total':0};
                        $scope.selectedUser = undefined;
                        $scope.formValidated=false;
                        $scope.list_doors = [];
                        $scope.list_doors_ticket = [];
                        $scope.list_keys = [];
                        $scope.getCostByCustomer={'rate':{'idCustomer':null, 'idServiceType':null, 'idServiceTechnician':null}};
                        $scope.getCostByCustomer.rate.idServiceType="2";
                        $scope.getCostByCustomer.rate.idServiceTechnician="2";
                        $scope.getDeliveryTypesFn();
                        $scope.ticket.requestDate = new Date();
                        $("#selectType").modal('hide');
                        $scope.btnShow=true;
                        $scope.btnBack=false;
                        $scope.stepIndexTmp=0;
                        $scope.IsTicket = true;
                        $scope.isRequest="down";
                        $scope.selectedRequestKeyOwnerUser=undefined;
                        $scope.getDisabledReasonKeyFn();
                        selectSwitch ('d');
                        $scope.sysContent                         = "tickets";
                        $scope.sysSubContent                      = "removeKeyRequest";
                        if ($scope.sysLoggedUser.idProfileKf==1){
                            //$scope.getAdminListFn(); //LOAD ADMINISTRATION LIST
                            $scope.sysContent                         = "tickets";
                            $scope.sysSubContent                      = "removeKeyRequest";
                        }else if($scope.sysLoggedUser.idProfileKf==4 && !$scope.isHomeSelected){
                            $scope.isCompanyAdministrator = true;
                            console.log($scope.sysLoggedUser);
                            $scope.select.admins.selected = {'idClient': $scope.sysLoggedUser.company[0].idClient, 'name': $scope.sysLoggedUser.company[0].name};
                            $scope.getBuildingListFn($scope.sysLoggedUser.company[0]);
                            $scope.sysContent                         = "tickets";
                            $scope.sysSubContent                      = "removeKeyRequest";
                        }else{
                            $scope.mainSwitchFn("myDepartments",null,null);
                        }
                    break;
                    case "costServices":
                        $scope.sysContent                         = "";
                        $scope.sysSubContent                      = "";
                        $scope.buildingServiceValue = 0;
                        $scope.buildingDeliveryCost = 0;
                        $scope.rsKeyProductsData = [];
                        $scope.select = {'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined};
                        $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
                        $scope.ticket = {'administration':undefined, 'building':undefined, 'idClientDepartament':undefined, 'radioButtonDepartment':undefined, 'radioButtonBuilding':undefined, 'optionTypeSelected': {}, 'userNotify':null, 'keys':[], 'delivery':{'idTypeDeliveryKf':null, 'whoPickUp':null, 'zone':{}, 'thirdPerson':null, 'deliveryTo':{}, 'otherAddress':undefined}, 'cost':{'keys':0, 'delivery':0, 'service':0, 'total':0}};
                        $scope.costs={'keys':{'cost':0, 'manual':false}, 'delivery':{'cost':0, 'manual':false}, 'service':{'cost':0, 'manual':false}, 'total':0};
                        $scope.selectedUser = undefined;
                        $scope.formValidated=false;
                        $scope.list_doors = [];
                        $scope.list_doors_ticket = [];
                        $scope.list_keys = [];
                        $scope.rsCustomerAccessControlDoors = [];
                        $scope.keysTotalPrice=0;
                        $scope.deliveryCostFree=0
                        $scope.getCostByCustomer={'rate':{'idCustomer':null, 'idServiceType':null, 'idServiceTechnician':null}};
                        $scope.getCostByCustomer.rate.idServiceType="1";
                        $scope.getCostByCustomer.rate.idServiceTechnician="1";
                        $scope.ticket.requestDate = new Date();
                        $scope.isRequest="costs";
                        if ($scope.sysLoggedUser.idProfileKf==1){
                            //$scope.getAdminListFn(); //LOAD ADMINISTRATION LIST
                            $scope.sysContent                         = "services";
                            $scope.sysSubContent                      = "costs";
                        }else if($scope.sysLoggedUser.idProfileKf==4 && !$scope.isHomeSelected){
                            console.log($scope.sysLoggedUser);
                            $scope.select.admins.selected = {'idClient': $scope.sysLoggedUser.company[0].idClient, 'name': $scope.sysLoggedUser.company[0].name};
                            $scope.getBuildingListFn($scope.sysLoggedUser.company[0]);
                            $scope.sysContent                         = "services";
                            $scope.sysSubContent                      = "costs";
                        }else{
                            $scope.mainSwitchFn("myDepartments",null,null);
                        }
                    break;
                    case "setReason":
                        $scope.enabledNextBtn();
                        switch (obj.idReasonDisabledItem){
                            case "1":
                                $scope.ticket.reason_details = obj;
                            break;
                            case "2":
                                $scope.ticket.reason_details = obj;
                            break;
                            case "3":
                                $scope.ticket.reason_details = obj;
                            break;
                        }
                        //if ($scope.sysLoggedUser.idProfileKf==1){
                        //    //$scope.getAdminListFn(); //LOAD ADMINISTRATION LIST
                        //    $scope.sysContent                         = "tickets";
                        //    $scope.sysSubContent                      = "removeKeyRequest";
                        //}else if($scope.sysLoggedUser.idProfileKf==4 && !$scope.isHomeSelected){
                        //    $scope.select.admins.selected = {'idClient': $scope.sysLoggedUser.company[0].idClient, 'name': $scope.sysLoggedUser.company[0].name};
                        //    //$scope.getBuildingListFn($scope.sysLoggedUser.company[0]);
                        //    $scope.sysContent                         = "tickets";
                        //    $scope.sysSubContent                      = "removeKeyRequest";
                        //}else{
                        //    
                        //    $scope.mainSwitchFn("myDepartments",null,null);
                        //}
                    break;
                    case "autoSelectDoors":
                        $scope.list_doors = [];
                        for (var key in $scope.rsCustomerAccessControlDoors){
                            $scope.rsCustomerAccessControlDoors[key].selected=true;
                            $scope.addDoorOpenList($scope.rsCustomerAccessControlDoors[key]);
                        }
                        console.log($scope.ticket);
                    break;
                    case "switchKeyCategory":
                        $scope.list_keys                        = [];
                        $scope.whoPickUpList                    = [];
                        $scope.ticket.cost.keys                 = 0;
                        $scope.ticket.cost.delivery             = 0;
                        $scope.ticket.cost.total                = 0;
                        $scope.ticket.cost.idTypePaymentKf      = null;
                        $scope.ticket.delivery.deliveryTo       = null;
                        $scope.ticket.delivery.idTypeDeliveryKf = null;
                        $scope.ticket.delivery.thirdPerson      = null;
                        $scope.ticket.delivery.whoPickUp        = null;
                        $scope.ticket.idClientDepartament       = null;
                        $scope.ticket.keyQtty                   = null;
                        $scope.selectedDeliveryAttendant        = undefined;
                        //$scope.select.products.selected         = undefined;
                        $scope.selectedRequestKeyOwnerUser      = undefined; 
                        if ($scope.ticket.optionTypeSelected.name=="building"&& $scope.ticket.radioButtonBuilding!="1" && $scope.ticket.radioButtonBuilding!="4" && $scope.ticket.radioButtonBuilding!="5"){
                            $scope.getUsersByCompanyClientIdFn($scope.select.admins.selected.idClient);
                        }else{
                            $scope.getAttendantListFn($scope.ticket.building.idClient);
                        }
                        console.log($scope.ticket);
                    break;
                    case "changeDepartment":
                        console.log(obj);
                        $scope.list_keys                        = [];
                        $scope.whoPickUpList                    = [];
                        $scope.ticket.delivery.thirdPerson      = null;
                        $scope.selectedDeliveryAttendant        = undefined;
                        $scope.selectedDeliveryAttendant        = undefined;
                        //$scope.select.products.selected         = undefined;
                        $scope.selectedRequestKeyOwnerUser      = undefined;
                        $scope.ticket.delivery.deliveryTo       = null;
                        if ($scope.isRequest == "down"){
                            KeysServices.getKeyListByDepartmentId($scope.ticket.idClientDepartament.idClientDepartament).then(function(response_keys) {
                                if(response_keys.status==200){
                                    $scope.ticket.idClientDepartament.keys=response_keys.data;
                                    $scope.ticket.keys = response_keys.data;
                                    $scope.keyList = response_keys.data;
                                }else if (response_keys.status==404){
                                    $scope.ticket.idClientDepartament.keys = [];
                                    $scope.ticket.keys = [];
                                    $scope.keyList = [];
                                }else if (response_keys.status==500){
                                    $scope.ticket.idClientDepartament.keys = [];
                                    $scope.ticket.keys = [];
                                    $scope.keyList = [];
                                }
                            });
                        }
                        console.log($scope.ticket);
                    break;
                    case "loadBuildingData":
                        $scope.select.products={'selected':undefined}
                        console.log(obj);
                        $scope.isDataLoaded=false;
                        console.log("$scope.isCompanyAdministrator :"+$scope.isCompanyAdministrator);
                        console.log("$scope.isHomeSelected :"+$scope.isHomeSelected);
                        $scope.rsCustomerAccessControlDoors = [];
                        $scope.list_keys=[];
                        $scope.rsKeyProductsData=[];
                        if ($scope.sysLoggedUser.idProfileKf=="1" || obj.IsInDebt!="1"){
                            if ($scope.sysLoggedUser.idProfileKf=="1" && obj.IsInDebt=="1"){
                                $scope.clientName=obj.name;
                                $scope.msg1 = 'El cliente ';
                                $scope.msg2 = ' esta inhabilitado para realizar pedidos';
                                $scope.msg3 = 'Contacte con la administración y/o el area de soporte.';
                                $('#customerNotificationModal').modal({backdrop: 'static', keyboard: true});
                            }
                            if ($scope.isRequest!="costs"){
                                blockUI.start('Cargando datos asociados al consorcio '+obj.name);
                            }
                            if (obj!=undefined && ($scope.sysLoggedUser.idProfileKf=="1" || ($scope.sysLoggedUser.idProfileKf=="4" && $scope.isCompanyAdministrator && !$scope.isHomeSelected))){
                                $scope.ticket.building = obj;
                                $scope.buildingDeliveryCost = obj.valor_envio;
                                $scope.getCostByCustomer.rate.idCustomer=obj.idClient;   
                                $scope.checkControlAccessStateFn(obj.idClient);
                                $timeout(function() {
                                    $scope.checBuildingTitularAttendant(obj.idClient);
                                    $scope.getDeptoListByAddress(obj.idClient);                                  
                                    
                                }, 1000);
                                $timeout(function() {
                                    $scope.getKeysAssociatedToACustomerFn(obj.idClient);
                                    $scope.getControlAccessDoorsAssociatedToACustomerFn(obj.idClient);
                                    $scope.getAttendantListFn(obj.idClient);
                                    blockUI.stop();
                                    console.log("chargeForExpenses  :"+$scope.ticket.building.chargeForExpenses);
                                    if ($scope.ticket.building.chargeForExpenses=='0' || $scope.ticket.building.chargeForExpenses==null || $scope.ticket.building.chargeForExpenses==undefined){
                                        $scope.ticket.cost.idTypePaymentKf=2;
                                    }
                                }, 1500);

                                $timeout(function() {
                                    if ($scope.isRequest=="costs"){
                                        $scope.buildingDeliveryCost = obj.valor_envio;
                                    }
                                    //$scope.mainSwitchFn('autoSelectDoors', null, null);
                                    blockUI.stop();
                                }, 2000);
                            }else if (obj!=undefined && $scope.sysLoggedUser.idProfileKf!="1"){
                                $scope.getCostByCustomer.rate.idCustomer=obj.idClient;   
                                $scope.checkControlAccessStateFn(obj.idClient);
                                $timeout(function() {
                                    $scope.getCustomerByIdFn(obj.idClient, "building");                     
                                }, 1000);
                                $timeout(function() {
                                    $scope.getKeysAssociatedToACustomerFn(obj.idClient);
                                    $scope.getControlAccessDoorsAssociatedToACustomerFn(obj.idClient);
                                    $scope.getAttendantListFn(obj.idClient);
                                    console.log("chargeForExpenses  :"+$scope.ticket.building.chargeForExpenses);
                                    if ($scope.ticket.building.chargeForExpenses=='0' || $scope.ticket.building.chargeForExpenses==null || $scope.ticket.building.chargeForExpenses==undefined){
                                        $scope.ticket.cost.idTypePaymentKf=2;
                                    }
                                }, 1500);
                                $timeout(function() {
                                    if ($scope.isRequest=="costs"){
                                        console.log(obj);
                                        $scope.buildingDeliveryCost = obj.valor_envio;
                                    }else{
                                        $scope.mainSwitchFn('autoSelectDoors', null, null);
                                    }
                                    blockUI.stop();
                                    $scope.enabledNextBtn();
                                    $scope.isDataLoaded=true;
                                }, 2000);
                            }
                        }else{
                            $scope.clientName=obj.name;
                            $scope.msg1 = 'El cliente ';
                            $scope.msg2 = ' esta inhabilitado para realizar pedidos';
                            $scope.msg3 = 'Contacte con la administración y/o el area de soporte.';
                            $('#customerNotificationModal').modal({backdrop: 'static', keyboard: true});
                            //inform.add('El cliente '+obj.name+' se encuentra inhabilitado para realizar pedidos, contacte al area de soporte de TASS.',{
                            //    ttl:6000, type: 'warning'
                            //});
                        }
                    break;
                    case "home":
                        $scope.isHomeSelected = obj;
                        $scope.isCompanyAdministrator = false;
                        $scope.sysContent                         = "";
                        $("#selectPlace").modal('hide');
                        $("#selectType").modal('toggle');
                    break;
                    case "myDepartments":
                        blockUI.start('Obteniendo los departamentos asociados.');
                        $scope.ListDpto = [];
                        $scope.keyListByBuildingId = [];
                        $scope.myDepartamentlist=[];
                        $scope.statusByTenantType = $scope.sysLoggedUser.idTypeTenantKf=='1'?-1:-1;
                        $scope.idDepartmentKfTmp = $scope.sysLoggedUser.idTypeTenantKf=='1'?null:$scope.sysLoggedUser.idDepartmentKf;
                        DepartmentsServices.listDepartmentsByIdOwner($scope.idDepartmentKfTmp, $scope.sysLoggedUser.idUser, $scope.statusByTenantType, $scope.sysLoggedUser.idTypeTenantKf).then(function(response) {
                            console.log(response.data.length)
                            if(response.status==200){
                                if(response.data!=undefined && response.data.length>0){
                                    var assignedDeptos = [];
                                    angular.forEach(response.data,function(depto){
                                        var deferredDeptos = $q.defer();
                                        assignedDeptos.push(deferredDeptos.promise);
                                        //ASSIGN DEPARTMENT SERVICE
                                        $timeout(function() {
                                            deferredDeptos.resolve();
                                            DepartmentsServices.listTenant2AssignedDeptoByIdDepto(depto.idClientDepartament).then(function(response_tenants) {
                                                if(response_tenants.status==200){
                                                    depto.tenants = response_tenants.data.tenant;
                                                }else if (response_tenants.status==404){
                                                    depto.tenants = [];
                                                }else if (response_tenants.status==500){
                                                    depto.tenants = [];
                                                }
                                            });
                                        }, 1000);
                                    });
                                    
                                    $q.all(assignedDeptos).then(function () {
                                        $timeout(function() {
                                            blockUI.stop();
                                        }, 2000);
                                    });
                                    if ($scope.isRequest!="costs"){
                                        $timeout(function() {
                                            blockUI.start('Obteniendo datos de los Llaveros');
                                        }, 2000);
                                    }
                                    var assignedKeys = [];
                                    angular.forEach(response.data,function(depto){
                                        var deferredKeys = $q.defer();
                                        assignedKeys.push(deferredKeys.promise);
                                        $timeout(function() {
                                            deferredKeys.resolve();
                                            KeysServices.getKeyListByDepartmentId(depto.idClientDepartament).then(function(response_keys) {
                                                if(response_keys.status==200){
                                                    depto.keys=response_keys.data;
                                                }else if (response_keys.status==404){
                                                    depto.keys = [];
                                                }else if (response_keys.status==500){
                                                    depto.keys = [];
                                                }
                                            });
                                        }, 1000);
                                    });
                                    $q.all(assignedKeys).then(function () {
                                        $timeout(function() {
                                            blockUI.stop();
                                            $scope.myDepartamentlist = response.data;
                                            console.log($scope.myDepartamentlist);
                                            $scope.sysContent                         = "tickets";
                                            if ($scope.isRequest == "up"){
                                                $scope.sysSubContent                      = "newKeyRequest";
                                            }else if ($scope.isRequest == "down"){
                                                $scope.sysSubContent                      = "removeKeyRequest";
                                            }else if ($scope.isRequest == "costs"){
                                                $scope.sysContent                         = "services";
                                                $scope.sysSubContent                      = "costs";
                                            }
                                            console.log("sysContent :"+$scope.sysContent+ " "+"sysSubContent :"+$scope.sysSubContent);
                                            $scope.enabledNextBtn();
                                        }, 2000);
                                    });
                                }else{
                                    $scope.myDepartamentlist = [];
                                    blockUI.stop();
                                }
                            }else if (response.status==404){
                                $scope.myDepartamentlist = [];
                                $scope.sysContent                         = "tickets";
                                if ($scope.isRequest == "up"){
                                    $scope.sysSubContent                      = "newKeyRequest";
                                }else if ($scope.isRequest == "down"){
                                    $scope.sysSubContent                      = "removeKeyRequest";
                                }else if ($scope.isRequest == "costs"){
                                    $scope.sysSubContent                      = "costs";
                                }
                                $scope.enabledNextBtn();
                                blockUI.stop();
                            }
                        });
                    break;
                    case "selectDepartment":
                        console.log(obj);
                        if (obj.IsInDebt!="1"){
                            $scope.ticket.optionTypeSelected.name="department";
                            $scope.ticket.idClientDepartament = obj;
                            $scope.ticket.keys = obj.keys;
                            $scope.keyList = obj.keys;
                            $timeout(function() {
                                $scope.getCustomerByIdFn(obj.idClientAdminFk, "admin");
                                $scope.mainSwitchFn('loadBuildingData', obj, null);
                                if ($scope.isRequest!="costs"){
                                    inform.add('Departamento seleccionado: '+obj.Depto+' haga clic en siguiente para continuar.',{
                                        ttl:5000, type: 'success'
                                    });
                                    $scope.enabledNextBtn();
                                }                               
                            }, 1000);
                        }else{
                            $scope.clientName=obj.name;
                            $scope.msg1 = 'El cliente ';
                            $scope.msg2 = ' esta inhabilitado para realizar pedidos';
                            $scope.msg3 = 'Contacte con la administración y/o el area de soporte.';
                            $('#customerNotificationModal').modal({backdrop: 'static', keyboard: true});
                            //inform.add('El cliente '+obj.name+' se encuentra inhabilitado para realizar pedidos, contacte al area de soporte de TASS.',{
                            //    ttl:6000, type: 'warning'
                            //});
                        }
                    break;
                    case "administration":
                        inform.add('Debe seleccionar un consorcio para continuar.',{
                            ttl:5000, type: 'info'
                        }); 
                        $scope.isCompanyAdministrator = obj;
                        console.log($scope.isCompanyAdministrator);
                        $scope.isHomeSelected = false;
                        $scope.sysContent                         = "";
                        $("#selectPlace").modal('hide');
                        $("#selectType").modal('toggle');
                    break;
                    case "list_tenants":
                        $scope.selectedRequestKeyOwnerUser = undefined;
                            $scope.tenantNotFound = false;
                        if ($scope.ticket.idClientDepartament==null || $scope.ticket.idClientDepartament==undefined){
                            inform.add('Debe seleccionar un departamento.',{
                                            ttl:5000, type: 'warning'
                            }); 
                        }else if ($scope.ticket.radioButtonDepartment==null){
                            inform.add('Debe seleccionar una opcion [Propietario/Inquilino].',{
                                            ttl:5000, type: 'warning'
                            });
                        }else if($scope.sysLoggedUser.idProfileKf==3 && $scope.ticket.radioButtonDepartment=="1"){
                            $scope.getData(1);
                        }else if($scope.sysLoggedUser.idProfileKf!=0 && $scope.ticket.radioButtonDepartment!="0"){
                            $scope.IsTenant=true;
                            console.log("$scope.ticket.radioButtonDepartment :"+$scope.ticket.radioButtonDepartment)
                            $scope.lisTenantsByType($scope.ticket.idClientDepartament.idClientDepartament, $scope.ticket.radioButtonDepartment);
                        }
                        $('#tenantList').modal({backdrop: 'static', keyboard: true});
                    break;
                    case "selectedRequestKeyOwnerUser":
                        //console.log(obj);
                        $scope.selectedRequestKeyOwnerUser=obj!=undefined?obj:undefined;
                        $scope.enabledNextBtn();
                        inform.add('El usuario '+obj.fullNameUser+' ha sido asignado como solicitante del pedido.',{
                            ttl:5000, type: 'success'
                        }); 
                        $('#tenantList').modal("hide");
                        $scope.ticket.userRequestBy = $scope.selectedRequestKeyOwnerUser;
                        $scope.mainSwitchFn('setWhoPickUpList', null, null);
                    break;
                    case "list_depto_tenant":
                            $scope.tenant = {'namesTenant':null, 'addressTenant':null, 'movilPhoneTenant':null, 'localPhoneTenant':null, 'emailTenant':null}
                            $scope.tenantNotFound = false;
                        if ($scope.ticket.idClientDepartament==null || $scope.ticket.idClientDepartament==undefined){
                            inform.add('Debe seleccionar un departamento.',{
                                            ttl:5000, type: 'warning'
                            }); 
                        }else if ($scope.ticket.radioButtonDepartment==null){
                            inform.add('Debe seleccionar una opcion [Propietario/Inquilino].',{
                                            ttl:5000, type: 'warning'
                            });
                        }else if($scope.sysLoggedUser.idProfileKf==3 && $scope.ticket.radioButtonDepartment=="1"){
                            $scope.getData(1);
                        }else if($scope.sysLoggedUser.idProfileKf!=0 && $scope.ticket.radioButtonDepartment!="0"){
                            $scope.IsTenant=true;
                            console.log("$scope.ticket.radioButtonDepartment :"+$scope.ticket.radioButtonDepartment)
                            $scope.lisTenantsByDepto($scope.ticket.idClientDepartament.idClientDepartament, -1);
                        }
                        $('#tenantListByDepto').modal({backdrop: 'static', keyboard: true});
                    break;
                    case "list_attendants":
                        $('#attendantList').modal({backdrop: 'static', keyboard: true});
                    break;
                    case "setWhoPickUpList":
                        $scope.whoPickUpList = [];
                        if ($scope.sysLoggedUser.idTypeTenantKf=="1" && $scope.sysLoggedUser.idUser!=$scope.selectedRequestKeyOwnerUser.idUser) {
                            $scope.whoPickUpList.push($scope.sysLoggedUser);
                        }
                        if ($scope.selectedRequestKeyOwnerUser!=undefined) {
                            $scope.whoPickUpList.push($scope.selectedRequestKeyOwnerUser);
                        }

                        //if ($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment=="2"){
                        //    for (var user in $scope.listTenantByType){
                        //        if ($scope.selectedRequestKeyOwnerUser.idUser != $scope.listTenantByType[user].idUser){
                        //            $scope.whoPickUpList.push($scope.listTenantByType[user]);
                        //        }
                        //    }
                        //}
                        for (var key in $scope.list_keys){
                            if ($scope.list_keys[key].user!=null){
                                $scope.whoPickUpList.push($scope.list_keys[key].user);
                            }
                        }
                        if ($scope.ticket.optionTypeSelected.name=="building" && $scope.ticket.radioButtonBuilding!="4" && $scope.ticket.radioButtonBuilding!="5"){
                            for (var key in $scope.ticket.companyUserList){
                                $scope.whoPickUpList.push($scope.ticket.companyUserList[key]);
                            }
                        }
                        for (var key in $scope.whoPickUpList){
                            $scope.whoPickUpList[key].type="Usuarios";
                        }
                        $scope.whoPickUpList.push({'id': 2, 'fullNameUser': "Encargado", 'type':"Otros"});
                        $scope.whoPickUpList.push({'id': 3, 'fullNameUser': "Tercera Persona", 'type':"Otros"});
                        console.log($scope.whoPickUpList);
                    break;
                    case "selectedUser":
                        $scope.selectedUser=obj!=undefined?obj:undefined;
                        inform.add('El usuario '+obj.fullNameUser+' sera asociado al llavero seleccionado.',{
                            ttl:5000, type: 'success'
                        }); 
                        $('#tenantListByDepto').modal("hide");
                        $('#attendantList').modal("hide");
                    break;
                    case "addKeyFieldsToList":
                        console.log(obj);
                        var productSelected         = {'brand':'','categoryName':'','classification':'','codigoFabric':'','contractStatus':'','descriptionProduct':'','idCategoryKf':'','idClientKf':'','idDepartmenKf':'','idProduct':'','idProductClassificationFk':'','idStatusFk':'','isControlSchedule':'','isDateExpiration':'','isKeyTenantOnly':'','isNumberSerieFabric':'','isNumberSerieInternal':'','isRequestNumber':'','model':'','priceFabric':'','serviceName':''};
                        $scope.list_doors_ticket    = [];
                        if (obj!=undefined){
                            productSelected.brand                       = obj.brand; 
                            productSelected.categoryName                = obj.categoryName; 
                            productSelected.classification              = obj.classification; 
                            productSelected.codigoFabric                = obj.codigoFabric; 
                            productSelected.contractStatus              = obj.contractStatus; 
                            productSelected.descriptionProduct          = obj.descriptionProduct; 
                            productSelected.idCategoryKf                = obj.idCategoryKf; 
                            productSelected.idClientKf                  = obj.idClientKf; 
                            productSelected.idDepartmenKf               = obj.idDepartmenKf; 
                            productSelected.idProduct                   = obj.idProduct; 
                            productSelected.idProductClassificationFk   = obj.idProductClassificationFk; 
                            productSelected.idStatusFk                  = obj.idStatusFk; 
                            productSelected.isControlSchedule           = obj.isControlSchedule; 
                            productSelected.isDateExpiration            = obj.isDateExpiration; 
                            productSelected.isKeyTenantOnly             = obj.isKeyTenantOnly; 
                            productSelected.isNumberSerieFabric         = obj.isNumberSerieFabric; 
                            productSelected.isNumberSerieInternal       = obj.isNumberSerieInternal; 
                            productSelected.isRequestNumber             = obj.isRequestNumber; 
                            productSelected.model                       = obj.model; 
                            productSelected.priceFabric                 = obj.priceFabric; 
                            productSelected.serviceName                 = obj.serviceName;
                            
                        }else{
                            productSelected = null;
                        }
                        $scope.item_added           = false;
                        var userSelected            = $scope.selectedUser!=undefined?$scope.selectedUser:null;
                        var radioButtonDepartment   = $scope.ticket.radioButtonDepartment!=undefined?$scope.ticket.radioButtonDepartment:null;
                        var radioButtonBuilding     = $scope.ticket.radioButtonBuilding!=undefined?$scope.ticket.radioButtonBuilding:null;
                        for (var door in obj2){
                            if ( obj2[door].selected==true ){
                                $scope.list_doors_ticket.push({'contractStatus':obj2[door].contractStatus,'idAccessControlDoor':obj2[door].idAccessControlDoor,'idContrato':obj2[door].idContrato,'idService':obj2[door].idService,'idServiciosDelContratoCuerpo':obj2[door].idServiciosDelContratoCuerpo,'idStatusFk':obj2[door].idStatusFk,'itemAclaracion':obj2[door].itemAclaracion,'selected':obj2[door].selected,'serviceName':obj2[door].serviceName,'titulo':obj2[door].titulo});
                            }
                        }
                        var doorsSelected = $scope.list_doors_ticket.length>0?$scope.list_doors_ticket:null;
                        //console.log(doorsSelected);
                        var departmentSelected = $scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment!=undefined?$scope.ticket.idClientDepartament.idClientDepartament:null;
                        var switchOption = $scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment!=undefined?$scope.ticket.radioButtonDepartment:$scope.ticket.radioButtonBuilding
                        switch (switchOption){
                            case "1":
                                if($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment!=undefined){
                                    productSelected.idCategoryKf        = 1;
                                    productSelected.categoryName        = "Departamento";
                                    productSelected.idClientKf          = null;
                                    productSelected.idDepartmenKf       = departmentSelected;
                                    //productSelected.isKeyTenantOnly   = userSelected!=undefined && userSelected.idTypeTenantKf!=null && userSelected.idTypeTenantKf == "2"?1:null;
                                    productSelected.isKeyTenantOnly     = $scope.ticket.userRequestBy.idTypeTenantKf!=null && $scope.ticket.userRequestBy.idTypeTenantKf == "2"?1:null;                                    
                                }else{
                                    productSelected.idCategoryKf        = 6;
                                    productSelected.categoryName        = "Consorcio";
                                    productSelected.idClientKf          = $scope.select.buildings.selected.idClient;
                                    productSelected.idDepartmenKf       = null;
                                    productSelected.isKeyTenantOnly     = null
                                }
                            break;
                            case "2":
                                if($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment!=undefined){
                                    productSelected.idCategoryKf        = 1;
                                    productSelected.categoryName        = "Departamento";
                                    productSelected.idClientKf          = null;
                                    productSelected.idDepartmenKf       = departmentSelected;
                                    //productSelected.isKeyTenantOnly     = userSelected!=undefined && userSelected.idTypeTenantKf!=null && userSelected.idTypeTenantKf == "2"?1:null;
                                    productSelected.isKeyTenantOnly     = $scope.ticket.userRequestBy.idTypeTenantKf!=null && $scope.ticket.userRequestBy.idTypeTenantKf == "2"?1:null;
                                }else{
                                    productSelected.idCategoryKf        = 5;
                                    productSelected.categoryName        = "Administracion";
                                    productSelected.idClientKf          = $scope.select.buildings.selected.idClient;
                                    productSelected.idClientAdminKf     = $scope.select.admins.selected.idClient;
                                    productSelected.idDepartmenKf       = null;
                                    productSelected.isKeyTenantOnly     = null
                                }
                            break;
                            case "3":
                                productSelected.idCategoryKf            = 3;
                                productSelected.categoryName            = "Reserva";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;
                            case "4":
                                productSelected.idCategoryKf            = 2;
                                productSelected.categoryName            = "Stock";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;
                            case "5":
                                productSelected.idCategoryKf            = 4;
                                productSelected.categoryName            = "Apertura";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;

                        }
                        if ($scope.list_keys.length == 0){
                            $scope.keysTotalPrice=0;
                            var id = 1;
                            if ($scope.select.buildings.selected.initial_delivery!=undefined && $scope.select.buildings.selected.initial_delivery.length>0 && !$scope.select.buildings.selected.initial_delivery[0].expiration_state && (($scope.list_keys.length+1))<=parseInt($scope.select.buildings.selected.initial_delivery[0].initial_qtty)){
                                productSelected.priceFabric = 0;
                            }
                            console.log(productSelected);
                            $scope.list_keys.push({'id':id, 'optionTypeSelected':$scope.ticket.optionTypeSelected.name, 'radioButtonDepartment':radioButtonDepartment, 'radioButtonBuilding':radioButtonBuilding, 'key':productSelected, 'user':userSelected, 'doors':doorsSelected});
                            $scope.item_added = true;
                        }else{
                            if ($scope.list_keys.length<$scope.keysAllowed){
                                for (var key in $scope.list_keys){
                                    if ($scope.list_keys[key].user!=null && userSelected!=null && $scope.list_keys[key].user.idUser == $scope.selectedUser.idUser){
                                        inform.add("El Llavero seleccionado no ha sido agregado a la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        inform.add("El Usuario "+$scope.selectedUser.fullNameUser+", ya se encuentra asociado a un llavero de la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        $scope.isUserExist=true;
                                        break;
                                        //console.log($scope.isUserExist);
                                    }else{
                                        $scope.isUserExist=false;
                                        //console.log($scope.isUserExist);
                                    }
                                }
                                if(!$scope.isUserExist){
                                    var id = ($scope.list_keys.length+1);
                                    if ($scope.select.buildings.selected.initial_delivery.length>0 && !$scope.select.buildings.selected.initial_delivery[0].expiration_state && (($scope.list_keys.length+1))<=parseInt($scope.select.buildings.selected.initial_delivery[0].initial_qtty)){
                                        productSelected.priceFabric = 0;
                                    }else if ($scope.select.buildings.selected.initial_delivery.length>0 && !$scope.select.buildings.selected.initial_delivery[0].expiration_state && (($scope.list_keys.length+1))>parseInt($scope.select.buildings.selected.initial_delivery[0].initial_qtty)){
                                        productSelected.priceFabric = Number($scope.select.buildings.selected.initial_delivery[0].initial_price);
                                    }
                                    $scope.list_keys.push({'id':id, 'optionTypeSelected':$scope.ticket.optionTypeSelected.name, 'radioButtonDepartment':radioButtonDepartment, 'radioButtonBuilding':radioButtonBuilding, 'key':productSelected, 'user':userSelected, 'doors':doorsSelected});
                                    $scope.item_added = true;
                                }
                            }else{
                                inform.add("Puede solicitar hasta un maximo de "+$scope.keysAllowed+", si desea hacer un pedido mayor, contactar con el equipo de Tass Seguridad.",{
                                    ttl:5000, type: 'warning'
                                });
                            }
                        }
                        if ($scope.item_added){
                            if($scope.ticket.optionTypeSelected.name=='department'){
                                if (userSelected==null){
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado al Departamento:  '+$scope.ticket.idClientDepartament.Depto+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }else{
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado usuario '+userSelected.fullNameUser+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }
                            }else{
                                if($scope.ticket.radioButtonBuilding=="1"){
                                    if (userSelected==null){
                                        inform.add('El llavero '+productSelected.descriptionProduct+' asociado al Consorcio:  '+$scope.select.buildings.selected.name+' ha sido agregado al pedido.',{
                                            ttl:5000, type: 'success'
                                        }); 
                                    }else{
                                        inform.add('El llavero '+productSelected.descriptionProduct+' asociado usuario '+userSelected.fullNameUser+' ha sido agregado al pedido.',{
                                            ttl:5000, type: 'success'
                                        }); 
                                    }
                                }else{
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado a la Administracion:  '+$scope.select.admins.selected.name+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }
                            }
                        }
                        // SET VALUES TO KEY DEPENDING ON THE INITIAL DELIVERY DETAILS SET

                        //CHECK AMOUNT OF KEY REQUESTED
                        var subTotalKeys = 0;
                        //console.log($scope.list_keys);
                        for (var key in $scope.list_keys){
                            var keyCost = $scope.list_keys[key].key.priceFabric;
                            console.log("subTotalKeys: "+subTotalKeys+"\n"+"keyCost :"+keyCost);
                            if (subTotalKeys == 0){
                                subTotalKeys = Number(keyCost);
                            }else{
                                subTotalKeys = Number(subTotalKeys)+Number(keyCost);
                            }
                        }
                        $scope.keysTotalPrice=subTotalKeys.toFixed(2);
                        var keyTotalAllowed = Number($scope.keyTotalAllowed);
                        //console.log("subTotalKeys: "+subTotalKeys+"\n"+"keyTotalAllowed :"+keyTotalAllowed);
                        if ($scope.keysTotalPrice>=keyTotalAllowed){
                            $scope.deliveryCostFree = 1;
                        }else{
                            $scope.deliveryCostFree = 0;
                        }
                        $scope.enabledNextBtn(); 
                        console.log($scope.list_keys);
                        $scope.ticket.keys=$scope.list_keys;
                        console.log($scope.ticket);
                        $scope.list_doors_ticket = [];
                        $scope.selectedUser = undefined;
                        $scope.mainSwitchFn('setWhoPickUpList', null, null);
                    break;
                    case "setKeysToList":
                        $scope.list_keys = [];
                        var userSelected = $scope.selectedUser!=undefined?$scope.selectedUser:null;
                        var productSelected = obj!=undefined?obj:null;
                        var radioButtonDepartment = $scope.ticket.radioButtonDepartment!=undefined?$scope.ticket.radioButtonDepartment:null;
                        var radioButtonBuilding = $scope.ticket.radioButtonBuilding!=undefined?$scope.ticket.radioButtonBuilding:null;
                        for (var key in obj2){
                            if ( obj2[key].selected==true){
                                $scope.list_doors_ticket.push(obj2[key]);
                            }
                        }
                        var doorsSelected = $scope.list_doors_ticket.length>0?$scope.list_doors_ticket:null;
                        var switchOption = $scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment!=undefined?$scope.ticket.radioButtonDepartment:$scope.ticket.radioButtonBuilding
                        switch (switchOption){
                            case "1":
                                if($scope.ticket.optionTypeSelected=="department" && $scope.ticket.radioButtonDepartment!=undefined){
                                    productSelected.idCategoryKf        = 1;
                                    productSelected.categoryName        = "Departamento";
                                    productSelected.idClientKf          = null;
                                    productSelected.idDepartmenKf       = departmentSelected;
                                    //productSelected.isKeyTenantOnly     = userSelected!=undefined && userSelected.idTypeTenantKf!=null && userSelected.idTypeTenantKf == "2"?1:null;
                                    productSelected.isKeyTenantOnly     = $scope.ticket.userRequestBy.idTypeTenantKf!=null && $scope.ticket.userRequestBy.idTypeTenantKf == "2"?1:null;
                                }else{
                                    productSelected.idCategoryKf        = 6;
                                    productSelected.categoryName        = "Consorcio";
                                    productSelected.idClientKf          = $scope.select.buildings.selected.idClient;
                                    productSelected.idDepartmenKf       = null;
                                    productSelected.isKeyTenantOnly     = null;
                                }
                            break;
                            case "2":
                                if($scope.ticket.optionTypeSelected=="department" && $scope.ticket.radioButtonDepartment!=undefined){
                                    productSelected.idCategoryKf        = 1;
                                    productSelected.categoryName        = "Departamento";
                                    productSelected.idClientKf          = null;
                                    productSelected.idDepartmenKf       = departmentSelected;
                                    //productSelected.isKeyTenantOnly     = userSelected!=undefined && userSelected.idTypeTenantKf!=null && userSelected.idTypeTenantKf == "2"?1:null;
                                    productSelected.isKeyTenantOnly     = $scope.ticket.userRequestBy.idTypeTenantKf!=null && $scope.ticket.userRequestBy.idTypeTenantKf == "2"?1:null;
                                }else{
                                    productSelected.idCategoryKf        = 5;
                                    productSelected.categoryName        = "Administración";
                                    productSelected.idClientKf          = $scope.select.buildings.selected.idClient;
                                    productSelected.idClientAdminKf     = $scope.select.admins.selected.idClient;
                                    productSelected.isKeyTenantOnly     = null;
                                }
                            break;
                            case "3":
                                productSelected.idCategoryKf            = 3;
                                productSelected.categoryName            = "Reserva";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;
                            case "4":
                                productSelected.idCategoryKf            = 2;
                                productSelected.categoryName            = "Stock";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;
                            case "5":
                                productSelected.idCategoryKf            = 4;
                                productSelected.categoryName            = "Apertura";
                                productSelected.idClientKf              = $scope.select.buildings.selected.idClient;
                                productSelected.idDepartmenKf           = null;
                                productSelected.idClientAdminKf         = null; 
                                productSelected.isKeyTenantOnly         = null;
                            break;

                        }
                        for (var i = 0; i < $scope.ticket.keyQtty; i++) {
                            $scope.list_keys.push({'id':(i+1), 'optionTypeSelected':$scope.ticket.optionTypeSelected.name, 'radioButtonDepartment':radioButtonDepartment, 'radioButtonBuilding':radioButtonBuilding, 'key':productSelected, 'user':userSelected, 'doors':doorsSelected});
                        }
                        $scope.enabledNextBtn(); 
                        console.log($scope.list_keys);
                        $scope.ticket.keys=$scope.list_keys;
                        console.log($scope.ticket);
                        $scope.list_doors_ticket = [];
                    break;
                    case "addKeyToDownList":
                        console.log(obj);
                        var productSelected         = {'brand':'','categoryName':'','classification':'','codigoFabric':'','contractStatus':'','descriptionProduct':'','idCategoryKf':'','idClientKf':'','idDepartmenKf':'','idProduct':'','idProductClassificationFk':'','idStatusFk':'','isControlSchedule':'','isDateExpiration':'','isKeyTenantOnly':'','isNumberSerieFabric':'','isNumberSerieInternal':'','isRequestNumber':'','model':'','priceFabric':'','serviceName':''};
                        $scope.list_doors_ticket    = [];
                        if (obj!=undefined){
                            productSelected.brand                       = obj.brand; 
                            productSelected.categoryName                = obj.categoryName;  
                            productSelected.codigoFabric                = obj.codigoFabric;  
                            productSelected.descriptionProduct          = obj.descriptionProduct;  
                            productSelected.idClientKf                  = obj.idClientKfDepto;
                            productSelected.idDepartmenKf               = obj.idDepartmenKf; 
                            productSelected.idProduct                   = obj.idProduct; 
                            productSelected.isKeyTenantOnly             = obj.isKeyTenantOnly; 
                            productSelected.isNumberSerieFabric         = obj.isNumberSerieFabric; 
                            productSelected.isNumberSerieInternal       = obj.isNumberSerieInternal; 
                            productSelected.isRequestNumber             = obj.isRequestNumber; 
                            productSelected.model                       = obj.model; 
                            productSelected.priceFabric                 = obj.priceFabric; 
                            productSelected.codExt                      = obj.codExt;
                            productSelected.codigo                      = obj.codigo;
                            productSelected.idKeychain                  = obj.idKeychain;
                            productSelected.idClientAdminKf             = obj.idClientKfKeychain;
                            productSelected.idDepartmenKf               = obj.idDepartmenKf;
                            productSelected.idUserKf                    = obj.idUserKf;
                            productSelected.idProductKf                 = obj.idProductKf;
                            
                        }else{
                            productSelected = null;
                        }
                        $scope.item_added           = false;
 
                        if ($scope.list_keys.length == 0 && obj.selected==true){
                            $scope.keysTotalPrice=0;
                            var id = 1;
                            $scope.list_keys.push({'id':id, 'optionTypeSelected':$scope.ticket.optionTypeSelected.name, 'radioButtonDepartment':radioButtonDepartment, 'radioButtonBuilding':radioButtonBuilding, 'key':productSelected, 'user':userSelected, 'selected':obj.selected});
                            $scope.item_added = true;
                        }else{
                            for (var key in $scope.list_keys){
                                if ($scope.list_keys[key].key.idKeychain==obj.idKeychain && obj.selected){
                                    $scope.isKeyExist=true;
                                    break;
                                    //console.log($scope.isKeyExist);
                                }else if ($scope.list_keys[key].key.idKeychain==obj.idKeychain && (!obj.selected || !$scope.list_keys[key].selected)){
                                    $scope.isKeyExist=true;
                                    $scope.list_keys.splice(key,1);
                                    break;
                                    //console.log($scope.isKeyExist);
                                }else if ($scope.list_keys[key].key.idKeychain!=obj.idKeychain && obj.selected){
                                    $scope.isKeyExist=false;
                                }else{
                                    $scope.isKeyExist=true;
                                }
                            }
                            if(!$scope.isKeyExist){
                                var id = ($scope.list_keys.length+1);
                                $scope.list_keys.push({'id':id, 'optionTypeSelected':$scope.ticket.optionTypeSelected.name, 'radioButtonDepartment':radioButtonDepartment, 'radioButtonBuilding':radioButtonBuilding, 'key':productSelected, 'user':userSelected, 'selected':obj.selected});
                                $scope.item_added = true;
                            }
                        }
                        if ($scope.item_added){
                            if($scope.ticket.optionTypeSelected.name=='department'){
                                if (userSelected==null){
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado al Departamento:  '+$scope.ticket.idClientDepartament.Depto+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }else{
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado usuario '+userSelected.fullNameUser+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }
                            }else{
                                if($scope.ticket.radioButtonBuilding=="1"){
                                    if (userSelected==null){
                                        inform.add('El llavero '+productSelected.descriptionProduct+' asociado al Consorcio:  '+$scope.select.buildings.selected.name+' ha sido agregado al pedido.',{
                                            ttl:5000, type: 'success'
                                        }); 
                                    }else{
                                        inform.add('El llavero '+productSelected.descriptionProduct+' asociado usuario '+userSelected.fullNameUser+' ha sido agregado al pedido.',{
                                            ttl:5000, type: 'success'
                                        }); 
                                    }
                                }else{
                                    inform.add('El llavero '+productSelected.descriptionProduct+' asociado a la Administracion:  '+$scope.select.admins.selected.name+' ha sido agregado al pedido.',{
                                        ttl:5000, type: 'success'
                                    }); 
                                }
                            }
                        }
                        // SET VALUES TO KEY DEPENDING ON THE INITIAL DELIVERY DETAILS SET

                        //CHECK AMOUNT OF KEY REQUESTED
                        var subTotalKeys = 0;
                        //console.log($scope.list_keys);
                        for (var key in $scope.list_keys){
                            var keyCost = $scope.list_keys[key].key.priceFabric;
                            console.log("subTotalKeys: "+subTotalKeys+"\n"+"keyCost :"+keyCost);
                            if (subTotalKeys == 0){
                                subTotalKeys = Number(keyCost);
                            }else{
                                subTotalKeys = Number(subTotalKeys)+Number(keyCost);
                            }
                        }
                        $scope.keysTotalPrice=subTotalKeys.toFixed(2);
                        var keyTotalAllowed = Number($scope.keyTotalAllowed);
                        //console.log("subTotalKeys: "+subTotalKeys+"\n"+"keyTotalAllowed :"+keyTotalAllowed);
                        if ($scope.keysTotalPrice>=keyTotalAllowed){
                            $scope.deliveryCostFree = 1;
                        }else{
                            $scope.deliveryCostFree = 0;
                        }
                        $scope.enabledNextBtn(); 
                        console.log($scope.list_keys);
                        $scope.ticket.keys=$scope.list_keys;
                        //console.log($scope.ticket);
                        $scope.list_doors_ticket = [];
                        $scope.selectedUser = undefined;
                        $scope.mainSwitchFn('setWhoPickUpList', null, null);
                    break;
                    case "deleteKeyFieldsToList":
                        if($scope.ticket.optionTypeSelected.name=='department'){
                            if (obj.user==null){
                                inform.add('El llavero '+obj.key.descriptionProduct+' asociado al Departamento:  '+$scope.ticket.idClientDepartament.Depto+' ha sido removido al pedido.',{
                                    ttl:5000, type: 'warning'
                                }); 
                            }else{
                                inform.add('El llavero '+obj.key.descriptionProduct+' asociado usuario '+obj.user.fullNameUser+' ha sido removido al pedido.',{
                                    ttl:5000, type: 'warning'
                                }); 
                            }
                        }else{
                            if($scope.ticket.radioButtonBuilding=="1"){
                                if (obj.user==null){
                                    inform.add('El llavero '+obj.key.descriptionProduct+' asociado al Consorcio:  '+$scope.select.buildings.selected.name+' ha sido removido al pedido.',{
                                        ttl:5000, type: 'warning'
                                    }); 
                                }else{
                                    inform.add('El llavero '+obj.key.descriptionProduct+' asociado usuario '+obj.user.fullNameUser+' ha sido removido al pedido.',{
                                        ttl:5000, type: 'warning'
                                    }); 
                                }
                            }else{
                                inform.add('El llavero '+obj.key.descriptionProduct+' asociado a la Administracion:  '+$scope.select.admins.selected.name+' ha sido removido al pedido.',{
                                    ttl:5000, type: 'warning'
                                }); 
                            }
                        }
                        for (var key in  $scope.list_keys){
                            if ( $scope.list_keys[key].id==obj.id){
                                $scope.list_keys.splice(key,1);
                            }
                        }
                        //CHECK AMOUNT OF KEY REQUESTED
                        var subTotalKeys = 0;
                        for (var key in $scope.list_keys){
                            var keyCost = $scope.list_keys[key].key.priceFabric;
                            console.log("subTotalKeys: "+subTotalKeys+"\n"+"keyCost :"+keyCost);
                            if (subTotalKeys == 0){
                                subTotalKeys = Number(keyCost);
                            }else{
                                subTotalKeys = Number(subTotalKeys)+Number(keyCost);
                            }
                        }
                        $scope.keysTotalPrice=subTotalKeys.toFixed(2);
                        var keyTotalAllowed = Number($scope.keyTotalAllowed);
                        if ($scope.keysTotalPrice>=keyTotalAllowed){
                            $scope.deliveryCostFree = 1;
                        }else{
                            $scope.deliveryCostFree = 0;
                        }
                        $scope.enabledNextBtn();
                        $scope.mainSwitchFn('setWhoPickUpList', null, null);
                    break;
                    case "newTenant":
                        $scope.tenant={
                        'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'','depto':''},
                        'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':''},
                        'tmp':{'dni':'','mail':''}};
                        $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                        $scope.ownerFound=false;
                        $scope.isNewTenant                          = true;
                        $scope.isUpdateTenant                       = false;
                        $scope.sysDNIRegistered                     = false;
                        $scope.sysEmailRegistered                   = false;
                        $scope.tenant.new.idSysProfileFk            = "10";
                        $scope.tenant.new.idDepartmentKf            = obj.idClientDepartament;
                        $scope.tenant.new.depto                     = obj.Depto;
                        if ($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment=="1"){
                            $scope.tenant.new.idTypeTenantKf        = "1";
                            $scope.tenant.new.idProfileKf           = "3";
                        }else if($scope.ticket.optionTypeSelected.name=="department" && $scope.ticket.radioButtonDepartment=="2"){
                            $scope.tenant.new.idAddresKf            = obj.idClientFk;
                            $scope.tenant.new.idTypeTenantKf        = "2";
                            $scope.tenant.new.idProfileKf           = "5";
                        }
                        //$scope.closeMembersTypeModal();
                        $('#RegisterTenant').modal({backdrop: 'static', keyboard: false});
                        $('#RegisterTenant').on('shown.bs.modal', function () {
                            $('#dniUser').focus();
                        });
                        console.log($scope.ticket);
                        console.log($scope.tenant.new);
                    break;
                    case "addTenant":
                        $scope.register={'user':{'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null}};
                        $scope.register.user.idProfileKf            = $scope.isNewTenant && obj.idTypeTenantKf!=undefined && obj.idTypeTenantKf==1?3:5;
                        $scope.register.user.idSysProfileFk         = obj.idSysProfileFk;
                        $scope.register.user.fullNameUser           = obj.fullname;
                        $scope.register.user.emailUser              = obj.mail;
                        $scope.register.user.phoneNumberUser        = obj.phoneMovilNumberUser;
                        $scope.register.user.phoneLocalNumberUser   = obj.phonelocalNumberUser;
                        $scope.register.user.idTyepeAttendantKf     = obj.idProfileKf==6?obj.idTyepeAttendantKf:null;
                        $scope.register.user.dni                    = obj.dni;
                        $scope.register.user.isCreateByAdmin        = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?1:null;
                        $scope.register.user.idAddresKf             = ($scope.register.user.idProfileKf==4 || $scope.register.user.idProfileKf==5) && ($scope.register.user.idTypeTenantKf!=null || $scope.register.user.idTypeTenantKf!=0)?obj.idAddresKf:null;
                        $scope.register.user.idTypeTenantKf         = obj.idTypeTenantKf;
                        $scope.register.user.idDepartmentKf         = (obj.idProfileKf==5 || obj.idProfileKf==6) && obj.idTypeTenantKf==2?obj.idDepartmentKf:null;
                        $scope.register.user.idDeparment_Tmp        = (obj.idProfileKf==3 || obj.idProfileKf==6) && obj.idTypeTenantKf==1?obj.idDepartmentKf:null;
                        console.log($scope.register.user);
                        $scope.sysRegisterTenantFn();
                    break;
                    case "associateTenant":
                        console.log(obj);
                        $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                        blockUI.start('Asociando usuario al departamento seleccionado.');
                        $timeout(function() {
                            $scope.depto.department.idUserKf           = obj.idUser;
                            $scope.depto.department.idDepartment       = obj.idDepartmentKf;
                            $scope.depto.department.isApprovalRequired = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?false:true;
                        }, 1500); 
                        //console.log(response_tenantFound);
                        //OWNER
                        $timeout(function() {
                            blockUI.message('Asignando departamento al usuario.');
                            $scope.fnAssignDepto($scope.depto);
                        }, 2000);
                        $timeout(function() {
                            blockUI.message('Aprobando departamento del usuario.');
                            $scope.approveDepto(obj.idTypeTenantKf, obj.idDepartmentKf, 1);
                        }, 2500);
                        $timeout(function() {
                            blockUI.message('Actualizando listado.');
                            if ($scope.ticket.optionTypeSelected.name=="department" && ($scope.ticket.radioButtonDepartment=="1" || $scope.ticket.radioButtonDepartment=="2")){
                                $scope.lisTenantsByType(obj.idDepartmentKf, $scope.ticket.radioButtonDepartment);
                            }
                            blockUI.stop();
                        }, 3000);
                        $('#RegisterTenant').modal('hide');
                    break;
                    case "edit":
                        $scope.tenant={
                            'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'', 'depto':''},
                            'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':'', 'depto':''},
                            'tmp':{'dni':'','mail':''}};
                        $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                        $scope.attendant={
                            'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'','depto':'', 'idTypeAttKf':{}},
                            'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':'','depto':'', 'idTypeAttKf':{}},
                            'tmp':{'dni':'','mail':''}};
                        $scope.att= {'ownerOption':undefined}
                        $scope.ownerFound                                  = false;
                        console.log(obj);
                        //TENANT & OWNERS / ELSE / ATTENANDANTS
                        if (obj.idProfileKf=="3" || obj.idProfileKf=="5"){
                            $scope.isNewTenant=false;
                            $scope.isUpdateTenant=true;
                            $scope.sysDNIRegistered                     = false;
                            $scope.sysEmailRegistered                   = false;
                            $scope.tenant.update                        = obj;
                            $scope.tenant.update.idProfileKf            = obj.idProfileKf;
                            $scope.tenant.update.dni                    = obj.dni;
                            $scope.tenant.update.fullname               = obj.fullNameUser;
                            $scope.tenant.update.phoneMovilNumberUser   = obj.phoneNumberUser;
                            $scope.tenant.update.phonelocalNumberUser   = obj.phoneLocalNumberUser;
                            $scope.tenant.update.idTypeTenantKf         = obj.idTypeTenantKf;
                            $scope.tenant.update.idTypeTenantKf_tmp     = obj.idTypeTenantKf;
                            $scope.tenant.update.mail                   = obj.emailUser;
                            $scope.tenant.update.idDepartmentKf2        = obj.idDepartmentKf;
                            $scope.tenant.update.depto                  = $scope.selectedDepto.Depto;
                            $scope.tenant.update.idAddresKf             = $scope.select.buildings.selected.idClient;
                            $scope.tenant.update.idStatusKf             = obj.idStatusKf;
                            $scope.tenant.update.statusTenantName       = obj.statusTenantName;
                            $scope.tenant.tmp.dni                       = obj.dni;
                            $scope.tenant.tmp.email                     = obj.emailUser;
                            $('#UpdateTenant').modal({backdrop: 'static', keyboard: false});
                            $('#UpdateTenant').on('shown.bs.modal', function () {
                                $('#idTypeTenantKf').focus();
                            });
                            console.log($scope.tenant.update);
                        }else if(obj.idProfileKf=="4" || obj.idProfileKf=="6" && (obj.idTypeTenantKf>=1 || obj.idTypeTenantKf==null)){
                            $scope.isUpdateAttendant                       = true;
                            $scope.isNewAttendant                          = false;
                            $scope.isNewTenant                             = false;
                            $scope.isUpdateTenant                          = false;
                            $scope.sysDNIRegistered                        = false;
                            $scope.sysEmailRegistered                      = false;
                            $scope.attendant.update                        = obj;
                            $scope.attendant.update.idProfileKf            = obj.idProfileKf;
                            $scope.attendant.update.dni                    = obj.dni;
                            $scope.attendant.update.fullname               = obj.fullNameUser;
                            $scope.attendant.update.phoneMovilNumberUser   = obj.phoneNumberUser;
                            $scope.attendant.update.phonelocalNumberUser   = obj.phoneLocalNumberUser;
                            $scope.attendant.update.idTypeTenantKf         = obj.idTypeTenantKf;
                            $scope.attendant.update.idTypeTenantKf_tmp     = obj.idTypeTenantKf;
                            $scope.attendant.update.email                  = obj.emailUser;
                            $scope.attendant.update.idDepartmentKf2        = null;
                            $scope.attendant.update.idDepartmentKf2        = obj.idDepartmentKf;
                            $scope.attendant.update.depto                  = $scope.selectedDepto.Depto;
                            $scope.attendant.update.idAddresKf             = $scope.select.buildings.selected.idClient;
                            $scope.attendant.update.idStatusKf             = obj.idStatusKf;
                            $scope.attendant.update.statusTenantName       = obj.statusTenantName;
                            $scope.attendant.tmp.dni                       = obj.dni;
                            $scope.attendant.tmp.email                     = obj.emailUser;
                            $scope.attendant.update.typeOtherAtt           = obj.descOther;
                            $scope.attendant.update.building               = $scope.select.buildings.selected.address;
                            $scope.attendant.update.idTypeAttKf            = {'idTyepeAttendant':obj.idTyepeAttendantKf, 'nameTypeAttendant':obj.nameTypeAttendant};
                            if (obj.idTyepeAttendantKf!=null && obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==1){
                            //console.log(obj);
                                $scope.att.ownerOption              = "1"
                            }else if (obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==2){
                                $scope.att.ownerOption              = "2";
                            }else if (obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==null){
                                $scope.att.ownerOption              = "3";
                            }
                            if (obj.idTyepeAttendantKf==null && obj.idTypeTenantKf==1){
                            //console.log(obj);
                                $scope.att.ownerOption              = "1"
                            }else if (obj.idTypeTenantKf==2){
                                $scope.att.ownerOption              = "2";
                            }else if (obj.idTypeTenantKf==null){
                                $scope.att.ownerOption              = "3";
                            }
                            $timeout(function() {
                                $('#UpdateAttendant').modal({backdrop: 'static', keyboard: false});
                                $('#UpdateAttendant').on('shown.bs.modal', function () {
                                    $('#idTypeAttKf').focus();
                                });
                            }, 1000);
                            console.log($scope.attendant.update);
                        }
                    break;
                    case "update":
                        $scope.update={'user':{'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null, 'typeTenantChange':false}};
                        $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                        //console.log(obj);
                        if (obj.idProfileKf=="3" || obj.idProfileKf=="5"){
                            blockUI.start('Actualizando usuario.');
                            $timeout(function() {
                                $scope.update.user                             = obj;
                                $scope.update.user.idProfileKf                 = $scope.isUpdateTenant && obj.idTypeTenantKf!=undefined && obj.idTypeTenantKf==1?3:5;
                                $scope.update.user.idTypeTenantKf              = obj.idTypeTenantKf;
                                $scope.update.user.fullNameUser                = obj.fullname;
                                $scope.update.user.emailUser                   = obj.mail;
                                $scope.update.user.phoneLocalNumberUser        = obj.phonelocalNumberUser;
                                $scope.update.user.phoneNumberUser             = obj.phoneMovilNumberUser;
                                $scope.update.user.isEdit                      = 1;
                                $scope.update.user.idAddresKf                  = ($scope.update.user.idProfileKf==4 || $scope.update.user.idProfileKf==5) && ($scope.update.user.idTypeTenantKf!=null || $scope.update.user.idTypeTenantKf!=0)?obj.idAddresKf:null;
                                $scope.update.user.idDepartmentKf              = $scope.update.user.idProfileKf==5 && $scope.update.user.idTypeTenantKf==2?$scope.idDeptoKf:null;
                                $scope.update.user.idDeparment_Tmp             = $scope.update.user.idProfileKf==3 && $scope.update.user.idTypeTenantKf==1?$scope.idDeptoKf:null;
                                if($scope.update.user.idTypeTenantKf_tmp!=$scope.update.user.idTypeTenantKf){
                                    $scope.remove.info.idUser           = $scope.update.user.idUser;
                                    $scope.remove.info.idDepartmentKf   = $scope.update.user.idTypeTenantKf==1?$scope.update.user.idDeparment_Tmp:$scope.update.user.idDepartmentKf;
                                    $scope.remove.info.idTypeTenant     = $scope.update.user.idTypeTenantKf_tmp;
                                    $scope.remove.info.idProfileKf      = $scope.update.user.idProfileKf;
                                    $scope.update.user.typeTenantChange = true;
                                    console.log($scope.remove.info);
                                    $scope.removeTenantFn($scope.remove);
                                }
                            }, 1000);
                            $timeout(function() {
                                console.log($scope.update.user);
                                $scope.sysUpdateTenantFn();
                            }, 2500);
                        }else if(obj.idProfileKf=="6" && (obj.idTypeTenantKf>=1 || obj.idTypeTenantKf==null)){
                            blockUI.start('Actualizando encargado.');
                                $scope.update.user                             = obj;
                                $scope.update.user.idTyepeAttendantKf          = obj.idTypeAttKf.idTyepeAttendant;
                                $scope.update.user.idTypeTenantKf              = $scope.att.ownerOption==undefined || $scope.att.ownerOption==null || $scope.att.ownerOption==3 || obj.idTypeAttKf.idTyepeAttendant==1?null:$scope.att.ownerOption;
                                $scope.update.user.fullNameUser                = obj.fullname;
                                $scope.update.user.emailUser                   = obj.email;
                                $scope.update.user.phoneLocalNumberUser        = obj.phonelocalNumberUser;
                                $scope.update.user.phoneNumberUser             = obj.phoneMovilNumberUser;
                                $scope.update.user.idAddresKf                  = (obj.idProfileKf==6) && $scope.att.ownerOption!=null || $scope.att.ownerOption!=0?obj.idAddresKf:null;
                                $scope.update.user.idDepartmentKf              = $scope.sysSubContent=="departments" && (obj.idProfileKf==6) && $scope.update.user.idTypeTenantKf==2 && $scope.att.ownerOption!=3 && obj.idTypeAttKf.idTyepeAttendant!=1?$scope.idDeptoKf:null;
                                $scope.update.user.idDeparment_Tmp             = $scope.sysSubContent=="departments" && (obj.idProfileKf==6) && $scope.update.user.idTypeTenantKf==1 && $scope.att.ownerOption!=3 && obj.idTypeAttKf.idTyepeAttendant!=1?$scope.idDeptoKf:null;
                                $scope.update.user.idDepartmentKf              = $scope.sysSubContent=="attendants" && $scope.update.user.idDepartmentKf==null && $scope.update.user.idTypeTenantKf==2 && $scope.att.ownerOption!=3?obj.idDepartmentKf2:$scope.update.user.idDepartmentKf;
                                $scope.update.user.idDeparment_Tmp             = $scope.sysSubContent=="attendants" && $scope.update.user.idDeparment_Tmp==null && $scope.update.user.idTypeTenantKf==1 && $scope.att.ownerOption!=3?obj.idDepartmentKf2:$scope.update.user.idDeparment_Tmp;
                                $scope.update.user.isEdit                      = 1;
                                $scope.update.user.descOther                   = obj.idTypeAttKf.idTyepeAttendant==1?obj.typeOtherAtt:null;
                                $scope.update.user.requireAuthentication       = obj.idTypeAttKf.idTyepeAttendant==1?0:1;
                                $scope.update.user.typeTenantChange            = false;
                            $timeout(function() {
                                if($scope.update.user.idTypeTenantKf_tmp!=$scope.update.user.idTypeTenantKf){
                                    $scope.remove.info.idUser           = $scope.update.user.idUser;
                                    $scope.remove.info.idDepartmentKf   = $scope.update.user.idTypeTenantKf==1?$scope.update.user.idDeparment_Tmp:$scope.update.user.idDepartmentKf;
                                    $scope.remove.info.idTypeTenant     = $scope.update.user.idTypeTenantKf_tmp;
                                    $scope.remove.info.idProfileKf      = $scope.update.user.idProfileKf;
                                    $scope.update.user.typeTenantChange = true;
                                    console.log($scope.remove.info);
                                    $scope.removeTenantFn($scope.remove);
                                }
                            }, 1000);
                            $timeout(function() {
                                console.log($scope.update.user);
                                $scope.sysUpdateTenantFn();
                            }, 2500);
                        }
                    break;
                    case "newAttendant":
                        $scope.attendant={
                            'new':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf':'','depto':''},
                            'update':{'idProfileKf':'', 'dni':'', 'fullname':'', 'phoneMovilNumberUser':'', 'phonelocalNumberUser':'', 'idAddresKf':'', 'idTypeTenantKf': null, 'mail':'', 'idDepartmentKf2':'','depto':''},
                            'tmp':{'dni':'','mail':''}};
                        $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                        $scope.att= {'ownerOption':undefined}
                        $scope.att.ownerOption=$scope.sysContent=='attendants'?3:undefined;
                        console.log($scope.att.ownerOption);
                        $scope.ownerFound=false;
                        console.log(obj);
                        $scope.isNewAttendant                       = true;
                        $scope.isNewTenant                          = false;
                        $scope.isUpdateTenant                       = false;
                        $scope.sysDNIRegistered                     = false;
                        $scope.sysEmailRegistered                   = false;
                        $scope.attendant.new.idProfileKf            = "6";
                        $scope.attendant.new.idSysProfileFk         = "10"; 
                        //$scope.attendant.new.idDepartmentKf         = obj.idClientDepartament;
                        //$scope.attendant.new.depto                  = obj.Depto;
                        $scope.attendant.new.idAddresKf             = $scope.select.buildings.selected.idClient;
                        $scope.attendant.new.building               = $scope.select.buildings.selected.address;
                        //$scope.closeMembersTypeModal();
                        $('#RegisterAttendant').modal({backdrop: 'static', keyboard: false});
                        $('#RegisterAttendant').on('shown.bs.modal', function () {
                            $('#idTypeAttKf').focus();
                        });
                        console.log($scope.attendant.new);
                    break;
                    case "addAttendant":
                        $scope.register={'user':{'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null}};
                        //console.log(obj);
                        $scope.register.user.idProfileKf            = obj.idProfileKf;
                        $scope.register.user.fullNameUser           = obj.fullname;
                        $scope.register.user.emailUser              = obj.email;
                        $scope.register.user.phoneNumberUser        = obj.phoneMovilNumberUser;
                        $scope.register.user.phoneLocalNumberUser   = obj.phonelocalNumberUser;
                        $scope.register.user.idTyepeAttendantKf     = obj.idProfileKf==6?obj.idTypeAttKf.idTyepeAttendant:null;
                        $scope.register.user.dni                    = obj.dni;
                        $scope.register.user.idTypeTenantKf         = $scope.att.ownerOption==undefined || $scope.att.ownerOption==null || $scope.att.ownerOption==3 || obj.idTypeAttKf.idTyepeAttendant==1?null:$scope.att.ownerOption;
                        $scope.register.user.isCreateByAdmin        = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?1:null;
                        $scope.register.user.isEdit                 = 1;
                        $scope.register.user.idAddresKf             = (obj.idProfileKf==6) && $scope.att.ownerOption!=null || $scope.att.ownerOption!=0?obj.idAddresKf:null;
                        $scope.register.user.idDepartmentKf         = (obj.idProfileKf==6) && $scope.register.user.idTypeTenantKf==2 && $scope.att.ownerOption!=3 && obj.idTypeAttKf.idTyepeAttendant!=1?obj.idDepartmentKf:null;
                        $scope.register.user.idSysProfileFk         = obj.idSysProfileFk;
                        $scope.register.user.idDeparment_Tmp        = (obj.idProfileKf==6) && $scope.register.user.idTypeTenantKf==1 && $scope.att.ownerOption!=3 && obj.idTypeAttKf.idTyepeAttendant!=1?obj.idDepartmentKf:null;
                        $scope.register.user.requireAuthentication  = obj.idTypeAttKf.idTyepeAttendant==1?0:1;
                        $scope.register.user.descOther              = obj.idTypeAttKf.idTyepeAttendant==1?obj.typeOtherAtt:null;
                        console.log($scope.register.user);
                        $scope.sysRegisterTenantFn();
                    break;
                    case "checkWhoPickUp":
                        console.log(obj);
                        if(obj.whoPickUp!=undefined){
                            $scope.ticket.delivery.idDeliveryTo = null;
                            if (obj.whoPickUp.id=="3"){
                                $scope.selectedDeliveryAttendant    = undefined;
                                $scope.ticket.delivery.deliveryTo   = null
                                $scope.ticket.delivery.idDeliveryTo = null;
                                $scope.ticket.delivery.otherAddress = null;
                                $scope.enabledNextBtn();
                                if ($scope.ticket.delivery.idTypeDeliveryKf!=1 && $scope.ticket.delivery.thirdPerson!=undefined){
                                    inform.add('Completar todos datos de la tercera persona:  '+$scope.ticket.delivery.thirdPerson.fullNameUser+' para continuar.',{
                                        ttl:5000, type: 'warning'
                                    });
                                    $('#RegisterThirdPerson').modal({backdrop: 'static', keyboard: true});
                                    if($scope.ticket.building.isStockInBuilding=='1' || (($scope.ticket.building.isStockInBuilding==null || $scope.ticket.building.isStockInBuilding=='0') && ($scope.ticket.building.isStockInOffice==null || $scope.ticket.building.isStockInOffice=='0'))){
                                        let streetName = $scope.ticket.building.address;
                                        let result = streetName.trim();
                                        let street = result.substring(0,result.length - 4);
                                        let number = result.substring(result.length - 4);
                                        console.log("Street: "+street.trim().toString());
                                        console.log("Number: "+number.trim().toString());
                                        $scope.ticket.delivery.thirdPerson.streetName    = street.trim().toString();
                                        $scope.ticket.delivery.thirdPerson.streetNumber  = number.trim().toString();
                                        $scope.ticket.delivery.thirdPerson.province={'selected':{'idProvince':$scope.ticket.building.idProvince,'province':$scope.ticket.building.province,'idProvinceAPIGobFk':$scope.ticket.building.idProvinceAPIGobFk}};
                                        $scope.ticket.delivery.thirdPerson.location={'selected':{'idLocation':$scope.ticket.building.idLocation,'location':$scope.ticket.building.location,'idProvinceFK':$scope.ticket.building.idProvinceFK}};
                                    }
                                    $('#third_address_streetName').focus();
                                }else{
                                    $scope.ticket.delivery.thirdPerson={};
                                    $('#RegisterThirdPerson').modal({backdrop: 'static', keyboard: true});
                                    if($scope.ticket.building.isStockInBuilding=='1' || (($scope.ticket.building.isStockInBuilding==null || $scope.ticket.building.isStockInBuilding=='0') && ($scope.ticket.building.isStockInOffice==null || $scope.ticket.building.isStockInOffice=='0'))){
                                        let streetName = $scope.ticket.building.address;
                                        let result = streetName.trim();
                                        let street = result.substring(0,result.length - 4);
                                        let number = result.substring(result.length - 4);
                                        console.log("Street: "+street.trim().toString());
                                        console.log("Number: "+number.trim().toString());
                                        $scope.ticket.delivery.thirdPerson.streetName    = street.trim().toString();
                                        $scope.ticket.delivery.thirdPerson.streetNumber  = number.trim().toString();
                                        $scope.ticket.delivery.thirdPerson.province={'selected':{'idProvince':$scope.ticket.building.idProvince,'province':$scope.ticket.building.province,'idProvinceAPIGobFk':$scope.ticket.building.idProvinceAPIGobFk}};
                                        $scope.ticket.delivery.thirdPerson.location={'selected':{'idLocation':$scope.ticket.building.idLocation,'location':$scope.ticket.building.location,'idProvinceFK':$scope.ticket.building.idProvinceFK}};
                                    }
                                    $('#fullNameUser').focus();
                                    
                                }
                            }else if (obj.whoPickUp.id=="2"){
                                $scope.ticket.delivery.thirdPerson  = null;
                                $scope.ticket.delivery.deliveryTo   = null;
                                $scope.ticket.delivery.idDeliveryTo = null;
                                $scope.ticket.delivery.otherAddress = null;
                                $scope.enabledNextBtn();
                                $('#deliveryAttendantList').modal({backdrop: 'static', keyboard: true});
                            }else if (obj.whoPickUp.id==undefined && $scope.ticket.delivery.idTypeDeliveryKf==2 && (obj.idDeliveryTo==null || obj.idDeliveryTo==1)){
                                $scope.ticket.delivery.idDeliveryTo = null;
                                $scope.mainSwitchFn("selectDeliveryAddress",obj,null);
                            }else if (obj.whoPickUp.id==undefined && $scope.ticket.delivery.idTypeDeliveryKf==2 && (obj.idDeliveryTo==null || obj.idDeliveryTo==2)){
                                $scope.ticket.delivery.thirdPerson  = null;
                                $scope.ticket.delivery.idDeliveryTo = null;
                                if ($scope.ticket.delivery.otherAddress!=undefined){
                                    inform.add('Completar todos datos de la dirección a la cual sera enviado el pedido, para continuar.',{
                                        ttl:5000, type: 'warning'
                                    });
                                    $('#RegisterDeliveryToOtherAddress').modal({backdrop: 'static', keyboard: true});
                                }else{
                                    $('#RegisterDeliveryToOtherAddress').modal({backdrop: 'static', keyboard: true});
                                }
                            }else{
                                $scope.mainSwitchFn('setDeliveryUser', obj.whoPickUp, null);
                            }
                        }else{
                            $scope.ticket.delivery.deliveryTo=null; $scope.ticket.delivery.whoPickUp=null;
                        }
                    break;
                    case "selectDeliveryAddress":
                        $scope.selectedUserToDelivery = null;
                        $scope.selectedUserToDelivery = obj.whoPickUp;
                        console.log(obj);
                        if ($scope.ticket.delivery.whoPickUp.id==undefined){
                            inform.add('Seleccionar/Indicar la direccion a la cual se hara la entrega del pedido.',{
                                ttl:5000, type: 'info'
                            }); 
                            $('#selectDeliveryAddress').modal({backdrop: 'static', keyboard: true});
                        }
                    break;
                    case "setDeliveryAttendant":
                        $scope.selectedDeliveryAttendant  = obj!=undefined?obj:undefined;
                        $scope.ticket.delivery.deliveryTo = $scope.selectedDeliveryAttendant;
                        $scope.ticket.delivery.thirdPerson = null;
                        $scope.ticket.delivery.otherAddress = null;
                        if ($scope.ticket.delivery.idTypeDeliveryKf==1){
                            inform.add('El encargado '+obj.fullNameUser+' retirara el pedido en la oficina.',{
                                ttl:5000, type: 'success'
                            }); 
                        }else{
                            inform.add('El encargado '+obj.fullNameUser+' recibira el pedido en el domicilio.',{
                                ttl:5000, type: 'success'
                            });
                        }
                        $('#deliveryAttendantList').modal("hide");
                        $scope.enabledNextBtn(); 
                    break;
                    case "setDeliveryUser":
                        if ($scope.ticket.delivery.idTypeDeliveryKf=="2" && $scope.ticket.delivery.idDeliveryTo!=2){
                            $scope.ticket.delivery.idDeliveryTo = 1;
                            $scope.ticket.delivery.thirdPerson = null;
                            $scope.ticket.delivery.otherAddress = null;
                        }else if ($scope.ticket.delivery.idTypeDeliveryKf=="1"){
                            $scope.ticket.delivery.idDeliveryTo = null;
                            $scope.ticket.delivery.thirdPerson = null;
                            $scope.ticket.delivery.otherAddress = null;
                        }
                        if ($scope.ticket.delivery.idDeliveryTo!=null && $scope.ticket.delivery.idDeliveryTo==1){
                            $scope.ticket.delivery.otherAddress = null;
                            $scope.ticket.delivery.thirdPerson = null;
                        }
                        $scope.ticket.delivery.deliveryTo = obj;
                        if ($scope.ticket.delivery.idTypeDeliveryKf==1){
                            inform.add('El '+obj.nameProfile+' '+obj.fullNameUser+' retirara el pedido en la oficina.',{
                                ttl:5000, type: 'success'
                            }); 
                        }else{
                            inform.add('El '+obj.nameProfile+' '+obj.fullNameUser+' recibira el pedido en el domicilio.',{
                                ttl:5000, type: 'success'
                            });
                        }
                        $('#selectDeliveryAddress').modal("hide");
                        $('#deliveryAttendantList').modal("hide");
                        $scope.enabledNextBtn(); 
                    break;
                    case "deliveryToOtherAddress":
                        console.log(obj);
                        console.log(obj2);
                        if ($scope.ticket.delivery.otherAddress==null){
                            $scope.ticket.delivery.otherAddress = {'streetName':undefined, 'streetNumber':undefined, 'floor':undefined, 'department':undefined, 'province':{'selected':undefined}, 'location':{'selected':undefined}};
                        }
                        $scope.selectedUserToDelivery = null;
                        $scope.ticket.delivery.idDeliveryTo = obj2!=undefined?obj2:null;
                        $scope.selectedUserToDelivery = obj.whoPickUp!=undefined?obj.whoPickUp:obj;
                        if ($scope.ticket.delivery.whoPickUp.id==undefined){
                            inform.add('Completar los campos de direccion a la cual se hara la entrega del pedido.',{
                                ttl:5000, type: 'info'
                            }); 
                            $('#selectDeliveryAddress').modal("hide");
                            $('#RegisterDeliveryToOtherAddress').modal({backdrop: 'static', keyboard: true});
                        }
                        $scope.enabledNextBtn(); 
                    break;
                    case "setDeliveryToOtherAddress":
                        console.log(obj);
                        console.log(obj2);
                        $scope.ticket.delivery.otherAddress = obj;
                        $('#RegisterDeliveryToOtherAddress').modal("hide");
                        inform.add('El '+obj2.nameProfile+' '+obj2.fullNameUser+' recibira el pedido en el domicilio indicado.',{
                            ttl:5000, type: 'success'
                        });
                        $scope.enabledNextBtn(); 
                    break;
                    case "checkThirdPersonLocation":
                        UtilitiesServices.checkZonaByLocationAndCustomerId($scope.ticket.building.idClient, obj.idLocation).then(function(response) {
                            if(response.status==200){
                                $scope.ticket.delivery.zone = response.data[0]
                            }else if(response.status==404){
                                inform.add('El envio a la localidad seleccionada tendra un recargo extra, contacta al area de soporte de tass.',{
                                ttl:8000, type: 'info'
                                });
                                $scope.ticket.delivery.zone = null;
                            }else if (response.status==500){
                                inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                ttl:5000, type: 'warning'
                                });
                            }
                        });
                    break;
                    case "setThirdPersonData":
                        //console.log(obj);
                        if ($scope.ticket.delivery.idTypeDeliveryKf!=1){
                            var streetName = obj.streetName;
                            $scope.ticket.delivery.thirdPerson.address=streetName.toUpperCase()+' '+obj.streetNumber;
                        }
                        $scope.ticket.delivery.deliveryTo = $scope.ticket.delivery.thirdPerson;
                        console.log($scope.ticket);
                        $('#RegisterThirdPerson').modal("hide");
                        if ($scope.ticket.delivery.idTypeDeliveryKf==1){
                            inform.add('El Pedido sera retirado por '+obj.fullNameUser+' en la oficina.',{
                                ttl:5000, type: 'success'
                            }); 
                        }else{
                            inform.add('El Pedido sera entregado a '+obj.fullNameUser+' en el domicilio indicado.',{
                                ttl:5000, type: 'success'
                            });
                        }
                        $scope.enabledNextBtn();
                    break;
                    case "setCosts":
                        console.log($scope.costs);
                        if ($scope.ticket.optionTypeSelected.name=="building" && ($scope.ticket.radioButtonBuilding=="4" || $scope.ticket.radioButtonBuilding=="5")){
                            var subTotalKeys = 0;
                            var subTotalDelivery = 0;
                            var subTotalService = 0;
                            $scope.ticket.cost.keys = subTotalKeys.toFixed(2);
                            $scope.ticket.cost.delivery = subTotalDelivery.toFixed(2);
                            $scope.ticket.cost.service = subTotalService.toFixed(2);
                        }else{
                            if (($scope.ticket.userNotify==null || $scope.ticket.userNotify=="1")){
                                console.info("userNotify: 1/null");
                                console.info($scope.ticket.userNotify);
                                //KEY COSTS
                                    var subTotalKeys = 0;
                                    if (!$scope.costs.keys.manual){
                                        var subTotalKeys = 0;
                                        for (var key in $scope.list_keys){
                                            var keyCost = $scope.list_keys[key].key.priceFabric!=undefined?$scope.list_keys[key].key.priceFabric:0;
                                            if (subTotalKeys == 0){
                                                subTotalKeys = Number(keyCost);
                                            }else{
                                                subTotalKeys = Number(subTotalKeys)+Number(keyCost);
                                            }
                                        }
                                        $scope.ticket.cost.keys = subTotalKeys.toFixed(2);
                                        $scope.costs.keys.cost  = subTotalKeys.toFixed(2);
                                    }else{
                                        subTotalKeys = $scope.costs.keys.cost;
                                        subTotalKeys = $scope.ticket.cost.keys;
                                    }
                                //DELIVERY COSTS
                                //$scope.isRequest
                                    var subTotalDelivery = 0;
                                    if (!$scope.costs.delivery.manual){
                                        if ($scope.deliveryCostFree==0){
                                            if(((($scope.ticket.building.isStockInBuilding==null && $scope.ticket.building.isStockInBuilding=='0') && ($scope.ticket.building.isStockInOffice==null && $scope.ticket.building.isStockInOffice=='0')) || ($scope.ticket.building.isStockInOffice!=null && $scope.ticket.building.isStockInOffice!='0'))){
                                                var subTotalDelivery = 0;
                                                if ($scope.ticket.delivery.idTypeDeliveryKf!=undefined && $scope.ticket.delivery.idTypeDeliveryKf!=null && $scope.ticket.delivery.idTypeDeliveryKf!=1){
                                                    if (($scope.ticket.delivery.whoPickUp.id==undefined && $scope.ticket.delivery.idDeliveryTo!=null && $scope.ticket.delivery.idDeliveryTo<=2) || 
                                                        ($scope.ticket.delivery.idDeliveryTo==null && $scope.ticket.delivery.whoPickUp.id==2)){
                                                        $scope.ticket.cost.delivery=$scope.ticket.building.valor_envio;
                                                        subTotalDelivery = Number($scope.ticket.building.valor_envio);
                                                        $scope.costs.delivery.cost=subTotalDelivery.toFixed(2);
                                                    }else{
                                                        $scope.ticket.cost.delivery=$scope.ticket.delivery.zone.valor_envio;
                                                        subTotalDelivery = Number($scope.ticket.delivery.zone.valor_envio);
                                                        $scope.costs.delivery.cost=subTotalDelivery.toFixed(2);
                                                    }
                                                }else{
                                                    $scope.ticket.cost.delivery = subTotalDelivery.toFixed(2);
                                                    $scope.costs.delivery.cost  = subTotalDelivery.toFixed(2);
                                                }
                                            }
                                        }
                                    }else{
                                        subTotalDelivery=$scope.costs.delivery.cost;
                                        subTotalDelivery=$scope.ticket.cost.delivery;
                                    }
                                //SERVICE COSTS
                                    var subTotalService = 0;
                                    if (!$scope.costs.service.manual){
                                        console.log("SERVICE COSTS");
                                        console.log("$scope.ticket.cost.service: "+$scope.buildingServiceValue);
                                        var subTotalService = 0;
                                        subTotalService = Number($scope.buildingServiceValue);
                                        $scope.costs.service.cost=subTotalService.toFixed(2);
                                    }else{
                                        subTotalService=$scope.costs.service.cost;
                                        subTotalService=$scope.ticket.cost.service;
                                    }
                            }else{
                                console.info("userNotify: 0");
                                var subTotalKeys = 0;
                                var subTotalDelivery = 0;
                                var subTotalService = 0;
                                $scope.ticket.cost.keys = subTotalKeys.toFixed(2);
                                $scope.ticket.cost.delivery = subTotalDelivery.toFixed(2);
                                $scope.ticket.cost.service = subTotalService.toFixed(2);
                            }
                        }
                        //TOTAL COST
                        var subTotalCosts = 0;
                        $scope.ticket.cost.total = 0;
                        console.log("subTotalService "+Number(subTotalService))
                        console.log("subTotalKeys "+Number(subTotalKeys))
                        console.log("subTotalDelivery "+Number(subTotalDelivery))
                        subTotalCosts = Number(subTotalService)+Number(subTotalKeys)+Number(subTotalDelivery);
                        $scope.ticket.cost.total = subTotalCosts.toFixed(2);
                        $scope.costs.total       = subTotalCosts.toFixed(2);
                        console.log($scope.costs);
                    break;
                    case "recalculateCosts":
                        if ($scope.ticket.userNotify==null || $scope.ticket.userNotify=="1"){
                            var subTotalKeys        = NaN2Zero(Number($scope.ticket.cost.keys));
                            var subTotalService     = NaN2Zero(Number($scope.ticket.cost.service));
                            var subTotalDelivery    = NaN2Zero(Number($scope.ticket.cost.delivery));
                            var subTotalCosts = 0;
                            console.log("subTotalService  : "+Number(subTotalService))
                            console.log("subTotalKeys     : "+Number(subTotalKeys))
                            console.log("subTotalDelivery : "+Number(subTotalDelivery))
                            console.log("Obj : "+Number(obj))
                            var opt2 = obj2;
                            switch (opt2){
                                case "service":
                                    if (Number(subTotalService) != Number(obj)){
                                        subTotalService=obj;
                                        $scope.costs.service.cost  =subTotalService;
                                        $scope.ticket.cost.service = subTotalService;
                                        $scope.costs.service.manual=true;
                                    }
                                break;
                                case "keys":
                                    if (Number(subTotalKeys) != Number(obj)){
                                        subTotalKeys = obj;
                                        $scope.costs.keys.cost      = subTotalKeys;
                                        $scope.ticket.cost.keys     = subTotalKeys;
                                        $scope.costs.keys.manual    = true;
                                    }
                                break;
                                case "delivery":
                                    if (Number(subTotalDelivery) != Number(obj)){
                                        subTotalDelivery = obj;
                                        $scope.costs.delivery.cost      = subTotalDelivery;
                                        $scope.ticket.cost.delivery     =  subTotalDelivery;
                                        $scope.costs.delivery.manual    = true;
                                    }
                                break;
                            }
                            subTotalCosts = NaN2Zero(Number(subTotalService))+NaN2Zero(Number(subTotalKeys))+NaN2Zero(Number(subTotalDelivery));
                            
                            $scope.ticket.cost.total = subTotalCosts.toFixed(2);
                            $scope.costs.total       = subTotalCosts.toFixed(2);
                            console.log($scope.costs);
                        }else{
                            var subTotalKeys        = 0;
                            var subTotalDelivery    = 0;
                            var subTotalService     = 0;
                            var subTotalCosts       = 0;
                            $scope.ticket.cost.keys     = subTotalKeys.toFixed(2);
                            $scope.ticket.cost.delivery = subTotalDelivery.toFixed(2);
                            $scope.ticket.cost.service  = subTotalService.toFixed(2);
                            $scope.ticket.cost.total    = subTotalCosts.toFixed(2);
                        }
                    break;
                    case "sendNotification":
                        switch(obj){
                            case "0":
                                var subTotalKeys = 0;
                                var subTotalDelivery = 0;
                                var subTotalService = 0;
                                var subTotalCosts = 0;
                                $scope.costs.keys.cost      = subTotalKeys.toFixed(2);
                                $scope.costs.service.cost   = subTotalService.toFixed(2);
                                $scope.costs.delivery.cost  = subTotalDelivery.toFixed(2);
                                $scope.costs.total          = subTotalCosts.toFixed(2);
                                $scope.mainSwitchFn('setCosts', null, null);
                            break;
                            case "1":
                                if ($scope.costs.keys.cost==0 && $scope.costs.delivery.cost==0 && $scope.costs.service.cost==0){
                                    $scope.costs.keys.cost       = NaN2Zero(Number($scope.ticket.cost.keys));
                                    $scope.costs.delivery.cost   = NaN2Zero(Number($scope.ticket.cost.delivery));
                                    $scope.costs.service.cost    = NaN2Zero(Number($scope.ticket.cost.service));
                                }
                                $scope.mainSwitchFn('setCosts', null, null);
                            break;
                        }

                    break;
                    case "up": // SOLOCITUD DE ALTA
                        console.log("---------------------------------------");
                        console.log("DATOS DE LA SOLICITUD DE ALTA DE LLAVE");
                        console.log("---------------------------------------");
                        console.log("[New Ticket]");
                        console.log(obj);
                        $scope.new.ticket={'idTypeRequestFor': null,'idTypeTicketKf':  null,'idUserMadeBy':  null,'idUserRequestBy':  null,'idBuildingKf': null,'idDepartmentKf': null,'keys': [],'idTypeDeliveryKf': null,'idWhoPickUp': null,'idUserDelivery': null,'idDeliveryTo': null,'idDeliveryAddress': null,'otherDeliveryAddress': {'address': null,'number': null,'floor': null,'idProvinceFk': null,'idLocationFk': null},'thirdPersonDelivery': {'fullName': null,'dni': null,'movilPhone': null,'address': null,'number': null,'floor': null,'idProvinceFk': null,'idLocationFk': null},'idTypePaymentKf': null,'sendNotify': null,'description': null,'costService': null,'costKeys': null,'costDelivery': null,'total': null,'urlToken': null,'autoApproved': null,'isNew': null,'history': []};
                        $scope.new.ticket.idTypeTicketKf    = 1;
                        $scope.new.ticket.idBuildingKf      = obj.building.idClient;
                        $scope.new.ticket.idUserMadeBy      = $scope.sysLoggedUser.idUser;
                        $scope.new.ticket.idTypeDeliveryKf  = obj.delivery.idTypeDeliveryKf
                        $scope.new.ticket.keys = [];
                            $scope.new.ticket.mail = '';
                            $scope.new.ticket.mail = '<table width="100%" style="max-width: 768px;min-width: 100%;border-collapse: collapse; padding-top:2%; padding-bottom:2%;font-size:1vw;font-family:sans-serif;color:#555555;padding:2%">';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Datos de la Solicitud</td></tr>';
                            $scope.new.ticket.mail += '<tr><td align="center" valign="middle"style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Realizado por</td>';
                            $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 35%;font-size: 1vw;padding-left: 0.4%">'+$scope.sysLoggedUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.sysLoggedUser.nameProfile+'</b></span></td>';
                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Solicitado por</td>';
                            if (obj.optionTypeSelected.name=='department' && obj.radioButtonDepartment!=undefined && (obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">'+$scope.selectedRequestKeyOwnerUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.selectedRequestKeyOwnerUser.nameProfile+'</b></span>'; 
                                if ($scope.selectedRequestKeyOwnerUser.idProfileKf!=3 && $scope.selectedRequestKeyOwnerUser.idProfileKf!=5 && $scope.selectedRequestKeyOwnerUser.idTypeTenantKf!=null){
                                    $scope.new.ticket.mail +=' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.selectedRequestKeyOwnerUser.typeTenantName+'</b></span>';
                                }
                                $scope.new.ticket.mail +='</td>';
                            }else if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding=='1' || obj.radioButtonBuilding=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle" style="width: 40%;font-size: 1vw;padding-left: 0.4%">'+obj.administration.name+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.administration.ClientType+'</b></span></td>';
                            }else if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle" style="width: 40%;font-size: 1vw;padding-left: 0.4%">'+$scope.sysLoggedUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.sysLoggedUser.nameProfile+'</b></span></td>';
                            }
                            $scope.new.ticket.mail +='</tr><tr><td  align="center" valign="middle"style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Fecha de solicitud</td>';
                            var requestDate  = new Date(obj.requestDate);
                            var formatedDate    = requestDate.getDate()+"-"+(requestDate.getMonth()+1)+"-"+requestDate.getFullYear()+ " / " +requestDate.getHours() + ":" + requestDate.getMinutes();
                            $scope.new.ticket.mail += '<td align="left" valign="middle">'+formatedDate+'</td>';
                            $scope.new.ticket.mail +='<td align="center" valign="middle" style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Solicitado para</td>';
                            if (obj.radioButtonDepartment!=undefined && (obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Departamento <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.idClientDepartament.Depto+'</b></span></td>';
                            }else if (obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='1'){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Encargado</td>';
                            }else if (obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='2'){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Administración</td>';
                            }else if (obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Consorcio</td>';
                            }
                            $scope.new.ticket.mail +='</tr></tbody>';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Detalles - Dirección</td></tr>';
                            $scope.new.ticket.mail += '<tr><td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Administracíon</td>';
                            $scope.new.ticket.mail +='<td align="left" valign="middle">'+obj.administration.name+'</td>';
                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Consorcio</td>';
                            $scope.new.ticket.mail +='<td align="left" valign="middle">'+obj.building.name+'</td>';
                            $scope.new.ticket.mail +='</tr></tbody>';
                            /*-- KEYS REQUESTED --*/
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Llaves solicitadas</td></tr>';
                            $scope.new.ticket.mail +='<tr><td colspan="4" style="background:#fff;">';

                            $scope.new.ticket.mail += '<table width="100%" style="max-width:768px;min-width:100%;background-color: #fff;">';
                            $scope.new.ticket.mail += '<thead><tr>';
                            $scope.new.ticket.mail += '<th width="5px"  style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> N°</th>';
                            $scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Llavero</th>';
                            $scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Precio</th>';
                            
                            if (obj.optionTypeSelected.name=='department' || obj.optionTypeSelected.name=='building'){
                                
                                $scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Asignado</th>';
                            }
                            if (obj.optionTypeSelected.name=='building'){
                                $scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Categoria</th>';
                            }
                            /*<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Usuario </th>*/
                            $scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Puertas</th>';
                            $scope.new.ticket.mail += '</tr></thead>';'<tbody style="overflow: auto;">';
                            $scope.new.ticket.mail += '<tbody style="overflow: auto;">';
                            for (var i = 0; i < $scope.list_keys.length; i++) {
                                var idUserKf = $scope.list_keys[i].user!=undefined?$scope.list_keys[i].user.idUser:null;
                                $scope.new.ticket.keys.push({'idProductKf':$scope.list_keys[i].key.idProduct, 'idCategoryKf':$scope.list_keys[i].key.idCategoryKf, 'idUserKf':idUserKf, 'idDepartmenKf':$scope.list_keys[i].key.idDepartmenKf, 'isKeyTenantOnly':$scope.list_keys[i].key.isKeyTenantOnly, 'idClientKf':$scope.list_keys[i].key.idClientKf, 'priceFabric':$scope.list_keys[i].key.priceFabric,'doors':$scope.list_keys[i].doors});
                                $scope.new.ticket.mail += '<tr style="align-content: center; cursor: pointer;">';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;"><span class="font-size-18px">'+(i+1)+'</span></td>';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;">'+$scope.list_keys[i].key.descriptionProduct+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].key.brand+'</b></span></td>';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: right;">$ '+$scope.list_keys[i].key.priceFabric+'</td>';
                                if (obj.optionTypeSelected.name=='building'){
                                    $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;"><span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].key.categoryName+'</b></span></td>';
                                }
                                
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;">';
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='1'){
                                    $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].user.nameProfile+'</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2' && $scope.list_keys[i].key.idCategoryKf!='5' && $scope.list_keys[i].key.idCategoryKf!='6'){
                                    $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Consorcio</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding=='2' && $scope.list_keys[i].key.idCategoryKf=='5'){
                                    $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Administracíon</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='department' && (obj.radioButtonDepartment==null || obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                    $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.idClientDepartament.Depto+'</b></span>';
                                }
                                $scope.new.ticket.mail +='</td>';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;">';
                                $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].doors.length+'</b></span>';
                                $scope.new.ticket.mail +='</td>';
                                $scope.new.ticket.mail +='</tr>';
                            }
                            $scope.new.ticket.mail += '</tbody></table>';
                            $scope.new.ticket.mail +='</td></tr></tbody>';
                            /*-- DELIVERY METHOD --*/
                                $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Detalles del Envío</td></tr>';
                                $scope.new.ticket.mail +='<tr><td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Método</td>';
                                if (obj.delivery.idTypeDeliveryKf=='1'){
                                    $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">Retiro en Oficina</td>';
                                }else if (obj.delivery.idTypeDeliveryKf=='2'){
                                    $scope.new.ticket.mail +='<td align="left" style="width: 40%;" valign="middle">Entrega en Domicilio ';
                                    if ((obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==1) || (obj.delivery.idTypeDeliveryKf==2 && obj.delivery.whoPickUp.id==2)){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Asociado</b></span>';
                                    }else if((obj.optionTypeSelected.name=='building' || obj.optionTypeSelected.name=='department') && obj.radioButtonBuilding==1 && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.building.name+'</b></span>';
                                    }else if((obj.optionTypeSelected.name=='building' || obj.optionTypeSelected.name=='department') && (obj.radioButtonBuilding==2 || obj.radioButtonBuilding==3) && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.administration.address+'</b></span>';
                                    }else if((obj.optionTypeSelected.name=='department') && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.building.name+'</b></span>';
                                    }else if(obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==2 && (obj.delivery.whoPickUp.id==undefined || obj.delivery.whoPickUp.id==1)){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Otro</b></span>';
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;text-transform: uppercase;"><b>'+obj.delivery.otherAddress.streetName+' '+obj.delivery.otherAddress.streetNumber+'</b></span>';
                                    }else if(obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==null && obj.delivery.whoPickUp.id==3){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;text-transform: uppercase;"><b>'+obj.delivery.thirdPerson.streetName+' '+obj.delivery.thirdPerson.streetNumber+'</b></span>';
                                    }
                                    $scope.new.ticket.mail +='</td>';
                                }
                                if (obj.delivery.idTypeDeliveryKf==null){
                                    $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">Proceso interno</td>';
                                }
                                if (obj.delivery.idTypeDeliveryKf!=null){
                                    if (obj.delivery.idTypeDeliveryKf=='1'){
                                        $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Quien retira</td>';
                                    }else if (obj.delivery.idTypeDeliveryKf=='2'){
                                        $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Quien recibe</td>';
                                    }
                                    if (obj.delivery.idTypeDeliveryKf!=null){
                                        $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">'+obj.delivery.deliveryTo.fullNameUser;
                                    }
                                    if (obj.delivery.whoPickUp!=null && obj.delivery.whoPickUp.id!=3 && (obj.delivery.whoPickUp.id==undefined || obj.delivery.whoPickUp.id==2)){
                                        $scope.new.ticket.mail += ' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.delivery.deliveryTo.nameProfile+'</b></span>';
                                    }else if(obj.delivery.whoPickUp!=null && obj.delivery.whoPickUp.id==3){
                                        $scope.new.ticket.mail += ' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Tercera Persona</b></span>';
                                    }else if(obj.delivery.deliveryTo==null && obj.delivery.deliveryTo.idProfileKf!=3 && obj.delivery.deliveryTo.idProfileKf!=5 && obj.delivery.deliveryTo.idTypeTenantKf!=null){
                                        $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.delivery.deliveryTo.typeTenantName+'</b></span>';
                                    }
                                    $scope.new.ticket.mail +='</td>';
                                }
                                if (obj.delivery.idTypeDeliveryKf==null){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Procesado por</td>';
                                    $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle"><span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>BSS</b></span></td>';
                                }
                            /*-- DELIVERY METHOD --*/
                            $scope.new.ticket.mail +='</tr></tbody>';
                            /*--  PAYMENT METHOD --*/
                                $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:0.4%">Metodo de Pago</td></tr>';
                                $scope.new.ticket.mail +='<tr><td align="center" valign="middle" style="vertical-align: middle;width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Método</td>';
                                if (obj.cost.idTypePaymentKf==null){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7" ><img data-type="image" itemprop="image" style="width: 10%;max-width: 110% !important;" src="'+serverHost+'"/images/logo_2.png"></td>';
                                }
                                if (obj.cost.idTypePaymentKf=='1' && obj.optionTypeSelected.name=='department'){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" align="center" valign="middle"colspan="7" >Abono por expensas</td>';
                                }
                                if (obj.cost.idTypePaymentKf=='1' && (obj.radioButtonBuilding=='1' || obj.radioButtonBuilding=='2' || obj.radioButtonBuilding=='3')){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7" >Pago en Abono</td>';
                                }
                                if (obj.cost.idTypePaymentKf=='2'){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7"><img data-type="image" itemprop="image" src="'+serverHost+'"/images/mp_logo.png" style="width: 10%;max-width: 110% !important;"></td>';

                                }
                            /*--  PAYMENT METHOD --*/
                            $scope.new.ticket.mail +='</tr></tbody>';
                            /*--  COSTS --*/
                                $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:0.4%">Detalles de Costos</td></tr>';
                                $scope.new.ticket.mail +='<tr><td colspan="10" style="background:#fff;">';
                                $scope.new.ticket.mail += '<table width="100%">';
                                $scope.new.ticket.mail += '<tbody style="text-align: right;"><tr>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Gestión</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.service+'</td>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Llaves</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.keys+'</td>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Envío</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.delivery+'</td>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Total</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.total+'</td>';
                                $scope.new.ticket.mail +='</tr></tbody></table>';
                                $scope.new.ticket.mail +='</td>';
                            /*--  COSTS --*/
                            $scope.new.ticket.mail +='</tr></tbody>';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:1.5%"></td></tr></tbody>';
                            $scope.new.ticket.mail += '</table>';
                        /*
                        <td ng-if="ticket.optionTypeSelected.name=='building' && (ticket.radioButtonBuilding=='1' || ticket.radioButtonBuilding=='2')">{{ticket.administration.name}}
                            <span ng-if="ticket.radioButtonBuilding!=undefined && (ticket.radioButtonBuilding=='1' || ticket.radioButtonBuilding=='2')" class="badge badge-warning">{{ticket.administration.ClientType}}</span>
                        </td>
                        <td ng-if="ticket.optionTypeSelected.name=='building' && ticket.radioButtonBuilding!='1' && ticket.radioButtonBuilding!='2'">{{sysLoggedUser.fullNameUser}}
                            <span class="badge badge-warning">{{sysLoggedUser.nameProfile}}</span>
                        </td>*/
                        console.table($scope.new.ticket.mail);
                        switch (obj.optionTypeSelected.name){
                            case "department":
                                $scope.new.ticket.idTypeRequestFor  = 1;
                                switch (obj.radioButtonDepartment){
                                    case "1":
                                        if ($scope.sysLoggedUser.idProfileKf=="3"){
                                            console.log("[New Ticket] => Propietario haciendo pedido.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = $scope.sysLoggedUser.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = $scope.sysLoggedUser.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="5"){
                                            console.log("[New Ticket] => Inquilino haciendo pedido.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = $scope.sysLoggedUser.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = $scope.sysLoggedUser.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="1"){
                                            console.log("[New Ticket] => BSS haciendo pedido a Propietario.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idProfileKf!=obj.userRequestBy.idProfileKf && ($scope.sysLoggedUser.idTypeTenantKf==null || $scope.sysLoggedUser.idTypeTenantKf!=null) && (!$scope.isHomeSelected || $scope.isHomeSelected)){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido a Propietario.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && ($scope.sysLoggedUser.idTypeTenantKf=="1" || $scope.sysLoggedUser.idTypeTenantKf=="2") && $scope.isHomeSelected){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido para su usuario.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }
                                    break;
                                    case "2":
                                        if ($scope.sysLoggedUser.idProfileKf=="3"){
                                            console.log("[New Ticket] => Propietario haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="5"){
                                            console.log("[New Ticket] => Inquilino haciendo pedido a otro inquilino.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="1"){
                                            console.log("[New Ticket] => BSS haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idProfileKf!=obj.userRequestBy.idProfileKf && ($scope.sysLoggedUser.idTypeTenantKf==null || $scope.sysLoggedUser.idTypeTenantKf!=null) && (!$scope.isHomeSelected || $scope.isHomeSelected)){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && ($scope.sysLoggedUser.idTypeTenantKf=="1" || $scope.sysLoggedUser.idTypeTenantKf=="2") && $scope.isHomeSelected){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido para su usuario.");
                                            $scope.new.ticket.idDepartmentKf            = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy           = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile    = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }
                                    break;
                                }
                            break;
                            case "building":
                                switch (obj.radioButtonBuilding){
                                    case "1":$scope.new.ticket.idTypeRequestFor = 6;
                                    break;
                                    case "2":$scope.new.ticket.idTypeRequestFor = 5;
                                    break;
                                    case "3":$scope.new.ticket.idTypeRequestFor = 3;
                                    break;
                                    case "4":$scope.new.ticket.idTypeRequestFor = 2;
                                    break;
                                    case "5":$scope.new.ticket.idTypeRequestFor = 4;
                                    break;
                                }
                            break;
                        }
                        if(obj.radioButtonBuilding!="4" && obj.radioButtonBuilding!="5"){
                            if (obj.delivery.idTypeDeliveryKf=="1"){
                                $scope.new.ticket.idDeliveryTo              = null
                                $scope.new.ticket.otherDeliveryAddress      = {'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                if (obj.delivery.whoPickUp.id==undefined){
                                    $scope.new.ticket.idWhoPickUp           = "1";
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }else if (obj.delivery.whoPickUp.id==2){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'dni':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }else{
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':obj.delivery.thirdPerson.fullNameUser, 'movilPhone':obj.delivery.thirdPerson.movilPhone, 'dni':obj.delivery.thirdPerson.dni, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }
                            }else{
                                $scope.new.ticket.idDeliveryTo              = obj.delivery.idDeliveryTo;
                                if (obj.delivery.whoPickUp.id==undefined && obj.delivery.idDeliveryTo==1){
                                    $scope.new.ticket.idWhoPickUp           = "1";
                                    $scope.new.ticket.otherDeliveryAddress  = {'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.idDeliveryAddress     = obj.building.idClient;
                                }else if(obj.delivery.whoPickUp.id==undefined && obj.delivery.idDeliveryTo==2){
                                    $scope.new.ticket.idWhoPickUp           = 1;
                                    $scope.new.ticket.otherDeliveryAddress  = {'address':obj.delivery.otherAddress.streetName,'number':obj.delivery.otherAddress.streetNumber,'floor':obj.delivery.otherAddress.floor+"-"+obj.delivery.otherAddress.department, 'idProvinceFk':obj.delivery.otherAddress.province.selected.idProvince, 'idLocationFk':obj.delivery.otherAddress.location.selected.idLocation};
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.whoPickUp.idUser;
                                }else if(obj.delivery.whoPickUp.id==2 && obj.delivery.idDeliveryTo==null){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                }else if(obj.delivery.whoPickUp.id==3 && obj.delivery.idDeliveryTo==null){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':obj.delivery.thirdPerson.fullNameUser, 'movilPhone':obj.delivery.thirdPerson.movilPhone, 'dni':obj.delivery.thirdPerson.dni, 'address':obj.delivery.thirdPerson.streetName,'number':obj.delivery.thirdPerson.streetNumber,'floor':obj.delivery.thirdPerson.floor+"-"+obj.delivery.thirdPerson.department, 'idProvinceFk':obj.delivery.thirdPerson.province.selected.idProvince, 'idLocationFk':obj.delivery.thirdPerson.location.selected.idLocation};
                                }   
                            }
                        }
                        $scope.new.ticket.idTypePaymentKf               = obj.cost.idTypePaymentKf;
                        $scope.new.ticket.sendNotify                    = $scope.sysLoggedUser.idProfileKf=="1"?obj.userNotify:null;
                        $scope.new.ticket.description                   = obj.description;
                        $scope.new.ticket.costService                   = obj.cost.service;
                        $scope.new.ticket.costKeys                      = obj.cost.keys;
                        $scope.new.ticket.costDelivery                  = obj.cost.delivery;
                        $scope.new.ticket.total                         = obj.cost.total;
                        $scope.new.ticket.urlToken                      = $scope.sysTokenFn(128);
                        $scope.new.ticket.autoApproved                  = obj.building.autoApproveAll == "1" || (($scope.new.ticket.idUserRequestByProfile=="3" || $scope.new.ticket.idUserRequestByProfile=="4" || $scope.new.ticket.idUserRequestByProfile=="6")&&$scope.new.ticket.idUserRequestByTypeTenant=="1" && obj.building.autoApproveOwners=="1")?1:0;
                        $scope.new.ticket.isNew                         = 1;
                        //HISTORY TICKET CHANGES
                        $scope.new.ticket.history                       = [];
                        $scope.new.ticket.history.push({'idUserKf': $scope.sysLoggedUser.idUser, 'descripcion': null, 'idCambiosTicketKf':"1"});
                        if($scope.new.ticket.idTypeRequestFor==1){
                            if (obj.building.autoApproveAll=="1"){
                                if((($scope.new.ticket.idUserRequestByProfile == "3" || $scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="1" && obj.idClientDepartament.isAprobatedAdmin=="1") 
                                    ||(($scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "5"  || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="2" && obj.userRequestBy.isDepartmentApproved=="1")){
                                    //SET AUTO APPROVED HISTORY ROW FOR ALL
                                    console.log("ENTRO");
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por el consorcio, automaticamente, para todos los habitantes.', 'idCambiosTicketKf':"2"});
                                    if ($scope.new.ticket.total>0){
                                        $scope.new.ticket.status = 3;
                                    }else{
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                        $scope.new.ticket.status = 8;
                                    }
                                }else if (obj.building.mpPaymentMethod=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                    $scope.new.ticket.status = 9;
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if ((obj.building.autoApproveOwners!=null || obj.building.autoApproveOwners==null) && ($scope.new.ticket.idUserRequestByProfile == "3" || $scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="1"){
                                if (obj.building.autoApproveOwners=="1"  && obj.idClientDepartament.isAprobatedAdmin=="1" && (obj.building.mpPaymentMethod!="1" || obj.building.mpPaymentMethod=="1")){
                                    //SET AUTO APPROVED HISTORY ROW FOR OWNERS ONLY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por el consorcio, automaticamente, solo para propietarios.', 'idCambiosTicketKf':"2"});
                                    if ($scope.new.ticket.total>0){
                                        $scope.new.ticket.status = 3;
                                    }else{
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                        $scope.new.ticket.status = 8;
                                    }
                                }else if ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && obj.building.mpPaymentMethod=="1" && (obj.idClientDepartament.isAprobatedAdmin!="1" || obj.idClientDepartament.isAprobatedAdmin=="1")){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    if ($scope.new.ticket.total>0 && obj.idClientDepartament.isAprobatedAdmin=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                        $scope.new.ticket.status = 9;
                                    }else if ($scope.new.ticket.total==0 && obj.idClientDepartament.isAprobatedAdmin=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                        $scope.new.ticket.status = 8;
                                    }
                                }else if ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && obj.building.mpPaymentMethod!="1" && (obj.idClientDepartament.isAprobatedAdmin=="1")){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    if ($scope.new.ticket.total==0){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                        $scope.new.ticket.status = 8;
                                    }
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if (obj.building.mpPaymentMethod=="1" && ($scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "5"  || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="2"){
                                if(obj.userRequestBy.isDepartmentApproved!="1" || obj.userRequestBy.isDepartmentApproved=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    if ($scope.new.ticket.total>0 && (obj.userRequestBy.isDepartmentApproved!="1" || obj.userRequestBy.isDepartmentApproved=="1")){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                        $scope.new.ticket.status = 9;
                                    }else if ($scope.new.ticket.total==0 && obj.userRequestBy.isDepartmentApproved=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                        $scope.new.ticket.status = 8;
                                    }
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if ($scope.new.ticket.sendNotify!=null && $scope.new.ticket.sendNotify==0){
                                //SET APPROVAL IS REQUIRED HISTORY
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Proceso de pago interno.', 'idCambiosTicketKf':"4"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                $scope.new.ticket.status = 8;
                            }else if (($scope.new.ticket.sendNotify!=null && $scope.new.ticket.sendNotify!=0) && obj.building.autoApproveOwners!="1" && obj.building.autoApproveAll!="1"){
                                if (obj.building.mpPaymentMethod!="1"){
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }else if (obj.building.mpPaymentMethod=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                    $scope.new.ticket.status = 9;
                                }
                            }
                            if (($scope.new.ticket.status == 3 && obj.building.autoApproveAll=="1" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || ($scope.new.ticket.status == 3 && obj.building.autoApproveOwners=="1" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1")){
                                //SET PAYMENT APPROVED & ALLOWED BY THE BUILDING
                                if ($scope.new.ticket.total>0){
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido sera pagado por expensas, habilitado por el consorcio.', 'idCambiosTicketKf':"4"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                    $scope.new.ticket.status = 8;
                                }else if ($scope.new.ticket.total==0){
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                    $scope.new.ticket.status = 8;
                                }
                            }else if ($scope.new.ticket.status == 3 && ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && (obj.building.autoApproveAll==null || obj.building.autoApproveAll=="0")) && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.status = 2;
                            }else if ($scope.new.ticket.status == 3 && (obj.building.chargeForExpenses==null || obj.building.chargeForExpenses=="1") && $scope.new.ticket.idTypePaymentKf!="1"){
                                //ONLY IF REQUEST PAYMENT OPTION IS 2
                                //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                            }
                        }else if($scope.new.ticket.idTypeRequestFor!=1 && $scope.new.ticket.idTypeRequestFor!=3 && $scope.new.ticket.idTypeRequestFor!=5 && $scope.new.ticket.idTypeRequestFor!=6){
                            if (($scope.new.ticket.idUserRequestByProfile == "4" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || $scope.sysLoggedUser.idProfileKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por la Administración automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                $scope.new.ticket.status = 8;
                            }
                        }else{
                            if (($scope.new.ticket.idUserRequestByProfile == "4" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || $scope.sysLoggedUser.idProfileKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por la Administración automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido sera pagado por expensas, habilitado por el consorcio.', 'idCambiosTicketKf':"4"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"13"});
                                $scope.new.ticket.status = 8;
                            }
                        }
                        console.log($scope.new.ticket);
                        $('#showModalRequestStatus').modal({backdrop: 'static', keyboard: false});
                        $timeout(function() {
                           $scope.addUpRequestFn($scope.new);
                        }, 2000);
                                            
                    break;
                    case "down": // SOLOCITUD DE BAJA
                        console.log("---------------------------------------");
                        console.log("DATOS DE LA SOLICITUD DE BAJA DE LLAVE");
                        console.log("---------------------------------------");
                        console.log("[Baja Ticket]");
                        console.log(obj);
                        $scope.new.ticket={'idTypeRequestFor': null,'idTypeTicketKf':  null,'idUserMadeBy':  null,'idUserRequestBy':  null,'idBuildingKf': null,'idDepartmentKf': null,'keys': [],'idTypeDeliveryKf': null,'idWhoPickUp': null,'idUserDelivery': null,'idDeliveryTo': null,'idDeliveryAddress': null,'otherDeliveryAddress': {'address': null,'number': null,'floor': null,'idProvinceFk': null,'idLocationFk': null},'thirdPersonDelivery': {'fullName': null,'dni': null,'movilPhone': null,'address': null,'number': null,'floor': null,'idProvinceFk': null,'idLocationFk': null},'idTypePaymentKf': null,'sendNotify': null,'description': null,'costService': null,'costKeys': null,'costDelivery': null,'total': null,'urlToken': null,'autoApproved': null,'isNew': null,'history': []};
                        $scope.new.ticket.idTypeTicketKf    = 2;
                        $scope.new.ticket.idBuildingKf      = obj.building.idClient;
                        $scope.new.ticket.idUserMadeBy      = $scope.sysLoggedUser.idUser;
                        $scope.new.ticket.idTypeDeliveryKf  = obj.delivery.idTypeDeliveryKf
                        $scope.new.ticket.keys = [];
                            $scope.new.ticket.mail = '';
                            $scope.new.ticket.mail = '<table width="100%" style="max-width: 768px;min-width: 100%;border-collapse: collapse; padding-top:2%; padding-bottom:2%;font-size:1vw;font-family:sans-serif;color:#555555;padding:2%">';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Datos de la Solicitud</td></tr>';
                            $scope.new.ticket.mail += '<tr><td align="center" valign="middle"style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Realizado por</td>';
                            $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 35%;font-size: 1vw;">'+$scope.sysLoggedUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.sysLoggedUser.nameProfile+'</b></span></td>';
                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Solicitado por</td>';
                            if (obj.optionTypeSelected.name=='department' && obj.radioButtonDepartment!=undefined && (obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">'+$scope.selectedRequestKeyOwnerUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.selectedRequestKeyOwnerUser.nameProfile+'</b></span>'; 
                                if ($scope.selectedRequestKeyOwnerUser.idProfileKf!=3 && $scope.selectedRequestKeyOwnerUser.idProfileKf!=5 && $scope.selectedRequestKeyOwnerUser.idTypeTenantKf!=null){
                                    $scope.new.ticket.mail +=' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.selectedRequestKeyOwnerUser.typeTenantName+'</b></span>';
                                }
                                $scope.new.ticket.mail +='</td>';
                            }else if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding=='1' || obj.radioButtonBuilding=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle" style="width: 40%;font-size: 1vw;padding-left: 0.4%">'+obj.administration.name+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.administration.ClientType+'</b></span></td>';
                            }else if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle" style="width: 40%;font-size: 1vw;padding-left: 0.4%">'+$scope.sysLoggedUser.fullNameUser+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.sysLoggedUser.nameProfile+'</b></span></td>';
                            }
                            $scope.new.ticket.mail +='</tr><tr><td  align="center" valign="middle"style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Fecha de solicitud</td>';
                            var requestDate  = new Date(obj.requestDate);
                            var formatedDate    = requestDate.getDate()+"-"+(requestDate.getMonth()+1)+"-"+requestDate.getFullYear()+ " / " +requestDate.getHours() + ":" + requestDate.getMinutes();
                            $scope.new.ticket.mail += '<td align="left" valign="middle">'+formatedDate+'</td>';
                            $scope.new.ticket.mail +='<td align="center" valign="middle" style="width: 15%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Solicitado para</td>';
                            if (obj.radioButtonDepartment!=undefined && (obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Departamento <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.idClientDepartament.Depto+'</b></span></td>';
                            }else if (obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='1'){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Encargado</td>';
                            }else if (obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='2'){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Administración</td>';
                            }else if (obj.radioButtonBuilding!=undefined && (obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2')){
                                $scope.new.ticket.mail +='<td align="left" valign="middle">Consorcio</td>';
                            }
                            $scope.new.ticket.mail +='</tr></tbody>';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Detalles - Dirección</td></tr>';
                            $scope.new.ticket.mail += '<tr><td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Administracíon</td>';
                            $scope.new.ticket.mail +='<td align="left" valign="middle">'+obj.administration.name+'</td>';
                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;padding-left: 0.4%">Consorcio</td>';
                            $scope.new.ticket.mail +='<td align="left" valign="middle">'+obj.building.name+'</td>';
                            $scope.new.ticket.mail +='</tr></tbody>';
                            /*-- KEYS REQUESTED --*/
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Llaveros a dar de baja</td></tr>';
                            $scope.new.ticket.mail +='<tr><td colspan="4" style="background:#fff;">';

                            $scope.new.ticket.mail += '<table width="100%" style="max-width:768px;min-width:100%;background-color: #fff;">';
                            $scope.new.ticket.mail += '<thead><tr>';
                            $scope.new.ticket.mail += '<th style="vertical-align: middle;text-align: center; background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> N°</th>';
                            $scope.new.ticket.mail += '<th style="vertical-align: middle;text-align: center; background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Llavero</th>';
                            $scope.new.ticket.mail += '<th style="vertical-align: middle;text-align: center; background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Codigo</th>';
                            
                            if (obj.optionTypeSelected.name=='department' || obj.optionTypeSelected.name=='building'){ 
                                //$scope.new.ticket.mail += '<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Asignado</th>';
                            }
                            /*<th style="background-color: #b8c3d2;border-right: 1px solid #ddd !important; "> Usuario </th>*/
                            $scope.new.ticket.mail += '</tr></thead>';'<tbody style="overflow: auto;">';
                            $scope.new.ticket.mail += '<tbody style="overflow: auto;">';
                            for (var i = 0; i < $scope.list_keys.length; i++) {
                                var idUserKf = $scope.list_keys[i].user!=undefined?$scope.list_keys[i].user.idUser:null;
                                $scope.new.ticket.keys.push({'idProductKf':$scope.list_keys[i].key.idProductKf, 'idKeychainKf':$scope.list_keys[i].key.idKeychain, 'idCategoryKf':$scope.list_keys[i].key.idCategoryKf, 'idUserKf':$scope.list_keys[i].key.idUserKf, 'idDepartmenKf':$scope.list_keys[i].key.idDepartmenKf, 'isKeyTenantOnly':$scope.list_keys[i].key.isKeyTenantOnly, 'idClientKf':$scope.list_keys[i].key.idClientKf, 'idClientAdminKf':$scope.list_keys[i].key.idClientAdminKf, 'priceFabric':$scope.list_keys[i].key.priceFabric});
                                $scope.new.ticket.mail += '<tr style="align-content: center; cursor: pointer;">';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;"><span class="font-size-18px">'+(i+1)+'</span></td>';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;">'+$scope.list_keys[i].key.descriptionProduct+' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].key.brand+'</b></span></td>';
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: right;">'+$scope.list_keys[i].key.codigo+'</td>';
                                if (obj.optionTypeSelected.name=='building'){
                                    //$scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;"><span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].key.categoryName+'</b></span></td>';
                                }
                                
                                $scope.new.ticket.mail += '<td style="vertical-align: middle;text-align: center;">';
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding=='1'){
                                    $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+$scope.list_keys[i].user.nameProfile+'</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding!=undefined && obj.radioButtonBuilding!='1' && obj.radioButtonBuilding!='2' && $scope.list_keys[i].key.idCategoryKf!='5' && $scope.list_keys[i].key.idCategoryKf!='6'){
                                    //$scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Consorcio</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='building' && obj.radioButtonBuilding=='2' && $scope.list_keys[i].key.idCategoryKf=='5'){
                                    //$scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Administracíon</b></span>';
                                }
                                if (obj.optionTypeSelected.name=='department' && (obj.radioButtonDepartment==null || obj.radioButtonDepartment=='1' || obj.radioButtonDepartment=='2')){
                                    //$scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.idClientDepartament.Depto+'</b></span>';
                                }
                                $scope.new.ticket.mail +='</td>';
                                $scope.new.ticket.mail +='</tr>';
                            }
                            $scope.new.ticket.mail += '</tbody></table>';
                            $scope.new.ticket.mail +='</td></tr></tbody>';
                            /*-- DELIVERY METHOD --*/
                                if($scope.ticket.cost.service!=null && $scope.ticket.cost.service!=undefined && $scope.ticket.cost.service!=0){
                                    $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="4" style="background:#427a9d;color:white; padding:0.4%">Detalles del Envío</td></tr>';
                                    $scope.new.ticket.mail +='<tr><td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Método</td>';
                                    if (obj.delivery.idTypeDeliveryKf=='1'){
                                        $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">Retiro en Oficina</td>';
                                    }else if (obj.delivery.idTypeDeliveryKf=='2'){
                                        $scope.new.ticket.mail +='<td align="left" style="width: 40%;" valign="middle">Entrega en Domicilio ';
                                        if ((obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==1) || (obj.delivery.idTypeDeliveryKf==2 && obj.delivery.whoPickUp.id==2)){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Asociado</b></span>';
                                        }else if((obj.optionTypeSelected.name=='building' || obj.optionTypeSelected.name=='department') && obj.radioButtonBuilding==1 && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.building.name+'</b></span>';
                                        }else if((obj.optionTypeSelected.name=='building' || obj.optionTypeSelected.name=='department') && (obj.radioButtonBuilding==2 || obj.radioButtonBuilding==3) && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.administration.address+'</b></span>';
                                        }else if((obj.optionTypeSelected.name=='department') && obj.delivery.idTypeDeliveryKf==2 && (obj.delivery.idDeliveryTo==1 || obj.delivery.whoPickUp.id==2)){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.building.name+'</b></span>';
                                        }else if(obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==2 && (obj.delivery.whoPickUp.id==undefined || obj.delivery.whoPickUp.id==1)){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Otro</b></span>';
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;text-transform: uppercase;"><b>'+obj.delivery.otherAddress.streetName+' '+obj.delivery.otherAddress.streetNumber+'</b></span>';
                                        }else if(obj.delivery.idTypeDeliveryKf==2 && obj.delivery.idDeliveryTo==null && obj.delivery.whoPickUp.id==3){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;text-transform: uppercase;"><b>'+obj.delivery.thirdPerson.streetName+' '+obj.delivery.thirdPerson.streetNumber+'</b></span>';
                                        }
                                        $scope.new.ticket.mail +='</td>';
                                    }
                                    if (obj.delivery.idTypeDeliveryKf==null){
                                        $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">Proceso interno</td>';
                                    }
                                    if (obj.delivery.idTypeDeliveryKf!=null){
                                        if (obj.delivery.idTypeDeliveryKf=='1'){
                                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Quien retira</td>';
                                        }else if (obj.delivery.idTypeDeliveryKf=='2'){
                                            $scope.new.ticket.mail += '<td align="center" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Quien recibe</td>';
                                        }
                                        if (obj.delivery.idTypeDeliveryKf!=null){
                                            $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle">'+obj.delivery.deliveryTo.fullNameUser;
                                        }
                                        if (obj.delivery.whoPickUp!=null && obj.delivery.whoPickUp.id!=3 && (obj.delivery.whoPickUp.id==undefined || obj.delivery.whoPickUp.id==2)){
                                            $scope.new.ticket.mail += ' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.delivery.deliveryTo.nameProfile+'</b></span>';
                                        }else if(obj.delivery.whoPickUp!=null && obj.delivery.whoPickUp.id==3){
                                            $scope.new.ticket.mail += ' <span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>Tercera Persona</b></span>';
                                        }else if(obj.delivery.deliveryTo==null && obj.delivery.deliveryTo.idProfileKf!=3 && obj.delivery.deliveryTo.idProfileKf!=5 && obj.delivery.deliveryTo.idTypeTenantKf!=null){
                                            $scope.new.ticket.mail += '<span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>'+obj.delivery.deliveryTo.typeTenantName+'</b></span>';
                                        }
                                        $scope.new.ticket.mail +='</td>';
                                    }
                                    if (obj.delivery.idTypeDeliveryKf==null){
                                        $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Procesado por</td>';
                                        $scope.new.ticket.mail += '<td align="left" style="width: 40%;" valign="middle"><span style="font-size: 0.7vw; background-color:#ffc107;border-color: #ffc107 !important;color: #000 !important; border-radius: 10px; padding: 3px 7px;"><b>BSS</b></span></td>';
                                    }
                                    $scope.new.ticket.mail +='</tr></tbody>';
                                }
                            /*-- DELIVERY METHOD --*/
                            /*--  PAYMENT METHOD --*/
                            if($scope.ticket.cost.service!=null && $scope.ticket.cost.service!=undefined && $scope.ticket.cost.service!=0){
                                $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:0.4%">Metodo de Pago</td></tr>';
                                $scope.new.ticket.mail +='<tr><td align="center" valign="middle" style="vertical-align: middle;width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff; padding-left: 0.4%">Método</td>';
                                if (obj.cost.idTypePaymentKf==null){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7" ><img data-type="image" itemprop="image" style="width: 10%;max-width: 110% !important;" src="'+serverHost+'"/images/logo_2.png"></td>';
                                }
                                if (obj.cost.idTypePaymentKf=='1' && obj.optionTypeSelected.name=='department'){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" align="center" valign="middle"colspan="7" >Abono por expensas</td>';
                                }
                                if (obj.cost.idTypePaymentKf=='1' && (obj.radioButtonBuilding=='1' || obj.radioButtonBuilding=='2' || obj.radioButtonBuilding=='3')){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7" >Pago en Abono</td>';
                                }
                                if (obj.cost.idTypePaymentKf=='2'){
                                    $scope.new.ticket.mail += '<td align="left" valign="middle" style="width: 90%;" colspan="7"><img data-type="image" itemprop="image" src="'+serverHost+'"/images/mp_logo.png" style="width: 10%;max-width: 110% !important;"></td>';
                                }
                                $scope.new.ticket.mail +='</tr></tbody>';
                            }
                            /*--  PAYMENT METHOD --*/
                                
                            /*--  COSTS --*/
                                var costService=obj.cost.service==0?"0.00":obj.cost.service;
                                var costTotal=obj.cost.total==0?"0.00":obj.cost.total;
                                $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:0.4%">Detalles de Costos</td></tr>';
                                $scope.new.ticket.mail +='<tr><td colspan="10" style="background:#fff;">';
                                $scope.new.ticket.mail += '<table width="100%">';
                                $scope.new.ticket.mail += '<tbody style="text-align: right;"><tr>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Gestión</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+costService+'</td>';
                                //$scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Llaves</td>';
                                //$scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.keys+'</td>';
                                //$scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Envío</td>';
                                //$scope.new.ticket.mail += '<td style="width: 15%;"> $ '+obj.cost.delivery+'</td>';
                                $scope.new.ticket.mail += '<td style="width: 10%; background-color: #b8c3d2;font-size: 1vw;color: #fff;text-align: center;">Total</td>';
                                $scope.new.ticket.mail += '<td style="width: 15%;"> $ '+costTotal+'</td>';
                                $scope.new.ticket.mail +='</tr></tbody></table>';
                                $scope.new.ticket.mail +='</td>';
                            /*--  COSTS --*/
                            $scope.new.ticket.mail +='</tr></tbody>';
                            $scope.new.ticket.mail += '<tbody><tr><td align="center" valign="middle" colspan="10" style="background:#427a9d;color:white; padding:1.5%"></td></tr></tbody>';
                            $scope.new.ticket.mail += '</table>';
                        /*
                        <td ng-if="ticket.optionTypeSelected.name=='building' && (ticket.radioButtonBuilding=='1' || ticket.radioButtonBuilding=='2')">{{ticket.administration.name}}
                            <span ng-if="ticket.radioButtonBuilding!=undefined && (ticket.radioButtonBuilding=='1' || ticket.radioButtonBuilding=='2')" class="badge badge-warning">{{ticket.administration.ClientType}}</span>
                        </td>
                        <td ng-if="ticket.optionTypeSelected.name=='building' && ticket.radioButtonBuilding!='1' && ticket.radioButtonBuilding!='2'">{{sysLoggedUser.fullNameUser}}
                            <span class="badge badge-warning">{{sysLoggedUser.nameProfile}}</span>
                        </td>*/
                        console.table($scope.new.ticket.mail);
    
                        switch (obj.optionTypeSelected.name){
                            case "department":
                                $scope.new.ticket.idTypeRequestFor  = 1;
                                switch (obj.radioButtonDepartment){
                                    case "1":
                                        if ($scope.sysLoggedUser.idProfileKf=="3"){
                                            console.log("[New Ticket] => Propietario haciendo pedido.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = $scope.sysLoggedUser.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = $scope.sysLoggedUser.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="5"){
                                            console.log("[New Ticket] => Inquilino haciendo pedido.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = $scope.sysLoggedUser.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = $scope.sysLoggedUser.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="1"){
                                            console.log("[New Ticket] => BSS haciendo pedido a Propietario.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idProfileKf!=obj.userRequestBy.idProfileKf && ($scope.sysLoggedUser.idTypeTenantKf==null || $scope.sysLoggedUser.idTypeTenantKf!=null) && (!$scope.isHomeSelected || $scope.isHomeSelected)){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido a Propietario.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idTypeTenantKf=="1" && $scope.isHomeSelected){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido para su usuario.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }
                                    break;
                                    case "2":
                                        if ($scope.sysLoggedUser.idProfileKf=="3"){
                                            console.log("[New Ticket] => Propietario haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="5"){
                                            console.log("[New Ticket] => Inquilino haciendo pedido a otro inquilino.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="1"){
                                            console.log("[New Ticket] => BSS haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idProfileKf!=obj.userRequestBy.idProfileKf && ($scope.sysLoggedUser.idTypeTenantKf==null || $scope.sysLoggedUser.idTypeTenantKf!=null) && (!$scope.isHomeSelected || $scope.isHomeSelected)){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido a inquilino.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = obj.userRequestBy.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }else if ($scope.sysLoggedUser.idProfileKf=="4" && $scope.sysLoggedUser.idTypeTenantKf=="1" && $scope.isHomeSelected){
                                            console.log("[New Ticket] => Admin consorcio haciendo pedido para su usuario.");
                                            $scope.new.ticket.idDepartmentKf    = obj.idClientDepartament.idClientDepartament;
                                            $scope.new.ticket.idUserRequestBy   = $scope.sysLoggedUser.idUser;
                                            $scope.new.ticket.idUserRequestByProfile = obj.userRequestBy.idProfileKf;
                                            $scope.new.ticket.idUserRequestByTypeTenant = obj.userRequestBy.idTypeTenantKf;
                                        }
                                    break;
                                }
                            break;
                            case "building":
                                switch (obj.radioButtonBuilding){
                                    case "1":$scope.new.ticket.idTypeRequestFor = 6;
                                    break;
                                    case "2":$scope.new.ticket.idTypeRequestFor = 5;
                                    break;
                                    case "3":$scope.new.ticket.idTypeRequestFor = 3;
                                    break;
                                    case "4":$scope.new.ticket.idTypeRequestFor = 2;
                                    break;
                                    case "5":$scope.new.ticket.idTypeRequestFor = 4;
                                    break;
                                }
                            break;
                        }
                        if(obj.radioButtonBuilding!="4" && obj.radioButtonBuilding!="5"){
                            if (obj.delivery.idTypeDeliveryKf=="1"){
                                $scope.new.ticket.idDeliveryTo              = null
                                $scope.new.ticket.otherDeliveryAddress      = {'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                if (obj.delivery.whoPickUp.id==undefined){
                                    $scope.new.ticket.idWhoPickUp           = "1";
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }else if (obj.delivery.whoPickUp.id==2){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'dni':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }else{
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':obj.delivery.thirdPerson.fullNameUser, 'movilPhone':obj.delivery.thirdPerson.movilPhone, 'dni':obj.delivery.thirdPerson.dni, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                }
                            }else if (obj.delivery.idTypeDeliveryKf=="2"){
                                $scope.new.ticket.idDeliveryTo              = obj.delivery.idDeliveryTo;
                                if (obj.delivery.whoPickUp.id==undefined && obj.delivery.idDeliveryTo==1){
                                    $scope.new.ticket.idWhoPickUp           = "1";
                                    $scope.new.ticket.otherDeliveryAddress  = {'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':null, 'movilPhone':null, 'address':null,'number':null,'floor':null, 'idProvinceFk':null, 'idLocationFk':null};
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                    $scope.new.ticket.idDeliveryAddress     = obj.building.idClient;
                                }else if(obj.delivery.whoPickUp.id==undefined && obj.delivery.idDeliveryTo==2){
                                    $scope.new.ticket.idWhoPickUp           = 1;
                                    $scope.new.ticket.otherDeliveryAddress  = {'address':obj.delivery.otherAddress.streetName,'number':obj.delivery.otherAddress.streetNumber,'floor':obj.delivery.otherAddress.floor+"-"+obj.delivery.otherAddress.department, 'idProvinceFk':obj.delivery.otherAddress.province.selected.idProvince, 'idLocationFk':obj.delivery.otherAddress.location.selected.idLocation};
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.whoPickUp.idUser;
                                }else if(obj.delivery.whoPickUp.id==2 && obj.delivery.idDeliveryTo==null){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.idUserDelivery        = obj.delivery.deliveryTo.idUser;
                                }else if(obj.delivery.whoPickUp.id==3 && obj.delivery.idDeliveryTo==null){
                                    $scope.new.ticket.idWhoPickUp           = obj.delivery.whoPickUp.id;
                                    $scope.new.ticket.thirdPersonDelivery   = {'fullName':obj.delivery.thirdPerson.fullNameUser, 'movilPhone':obj.delivery.thirdPerson.movilPhone, 'dni':obj.delivery.thirdPerson.dni, 'address':obj.delivery.thirdPerson.streetName,'number':obj.delivery.thirdPerson.streetNumber,'floor':obj.delivery.thirdPerson.floor+"-"+obj.delivery.thirdPerson.department, 'idProvinceFk':obj.delivery.thirdPerson.province.selected.idProvince, 'idLocationFk':obj.delivery.thirdPerson.location.selected.idLocation};
                                }   
                            }
                        }
                        $scope.new.ticket.idTypePaymentKf               = obj.cost.total>0?obj.cost.idTypePaymentKf:null;
                        $scope.new.ticket.sendNotify                    = $scope.sysLoggedUser.idProfileKf=="1"?obj.userNotify:null;
                        $scope.new.ticket.description                   = obj.description;
                        $scope.new.ticket.costService                   = obj.cost.service;
                        $scope.new.ticket.costKeys                      = obj.cost.keys;
                        $scope.new.ticket.costDelivery                  = obj.cost.delivery;
                        $scope.new.ticket.total                         = obj.cost.total;
                        $scope.new.ticket.urlToken                      = $scope.sysTokenFn(128);
                        $scope.new.ticket.autoApproved                  = obj.building.autoApproveAll == "1" || (($scope.new.ticket.idUserRequestByProfile=="3" || $scope.new.ticket.idUserRequestByProfile=="4" || $scope.new.ticket.idUserRequestByProfile=="6")&&$scope.new.ticket.idUserRequestByTypeTenant=="1" && obj.building.autoApproveOwners=="1")?1:0;
                        $scope.new.ticket.isNew                         = 1;
                        //HISTORY TICKET CHANGES
                        $scope.new.ticket.history                       = [];
                        $scope.new.ticket.history.push({'idUserKf': $scope.sysLoggedUser.idUser, 'descripcion': null, 'idCambiosTicketKf':"1"});
                        if($scope.new.ticket.idTypeRequestFor==1){
                            if (obj.building.autoApproveAll=="1"){
                                if((($scope.new.ticket.idUserRequestByProfile == "3" || $scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="1" && obj.idClientDepartament.isAprobatedAdmin=="1") 
                                    ||(($scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "5"  || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="2" && obj.userRequestBy.isDepartmentApproved=="1")){
                                    //SET AUTO APPROVED HISTORY ROW FOR ALL
                                    console.log("ENTRO");
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por el consorcio, automaticamente, para todos los habitantes.', 'idCambiosTicketKf':"2"});
                                    if ($scope.new.ticket.total>0){
                                        $scope.new.ticket.status = 3;
                                    }else{
                                        //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                        $scope.new.ticket.status = 12;
                                    }
                                }else if (obj.building.mpPaymentMethod=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    if ($scope.new.ticket.total>0){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                        $scope.new.ticket.status = 9;
                                    }else{
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.status = 2;
                                    }
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if ((obj.building.autoApproveOwners!=null || obj.building.autoApproveOwners==null) && ($scope.new.ticket.idUserRequestByProfile == "3" || $scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="1"){
                                if (obj.building.autoApproveOwners=="1"  && obj.idClientDepartament.isAprobatedAdmin=="1" && (obj.building.mpPaymentMethod!="1" || obj.building.mpPaymentMethod=="1")){
                                    //SET AUTO APPROVED HISTORY ROW FOR OWNERS ONLY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por el consorcio, automaticamente, solo para propietarios.', 'idCambiosTicketKf':"2"});
                                    if ($scope.new.ticket.total>0){
                                        $scope.new.ticket.status = 3;
                                    }else{
                                        //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                        $scope.new.ticket.status = 12;
                                    }
                                }else if ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && obj.building.mpPaymentMethod=="1" && (obj.idClientDepartament.isAprobatedAdmin!="1" || obj.idClientDepartament.isAprobatedAdmin=="1")){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    if ($scope.new.ticket.total>0 && obj.idClientDepartament.isAprobatedAdmin=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                        $scope.new.ticket.status = 9;
                                    }else if ($scope.new.ticket.total==0 && obj.idClientDepartament.isAprobatedAdmin=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                        $scope.new.ticket.status = 12;
                                    }
                                }else if ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && obj.building.mpPaymentMethod!="1" && (obj.idClientDepartament.isAprobatedAdmin=="1")){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    //obj.idClientDepartament.idClientDepartament
                                    //obj.userRequestBy.idTypeTenantKf
                                    if ($scope.new.ticket.total==0){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                        $scope.new.ticket.status = 12;
                                    }
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if (obj.building.mpPaymentMethod=="1" && ($scope.new.ticket.idUserRequestByProfile == "4" || $scope.new.ticket.idUserRequestByProfile == "5"  || $scope.new.ticket.idUserRequestByProfile == "6") && $scope.new.ticket.idUserRequestByTypeTenant=="2"){
                                if(obj.userRequestBy.isDepartmentApproved!="1" || obj.userRequestBy.isDepartmentApproved=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    if ($scope.new.ticket.total>0 && (obj.userRequestBy.isDepartmentApproved!="1" || obj.userRequestBy.isDepartmentApproved=="1")){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                        $scope.new.ticket.status = 9;
                                    }else if ($scope.new.ticket.total==0 && obj.userRequestBy.isDepartmentApproved=="1"){
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                        //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                        $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                        $scope.new.ticket.status = 12;
                                    }
                                }else{
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }
                            }else if ($scope.new.ticket.sendNotify!=null && $scope.new.ticket.sendNotify==0){
                                //SET APPROVAL IS REQUIRED HISTORY
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por BSS, automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Proceso de pago interno.', 'idCambiosTicketKf':"4"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                $scope.new.ticket.status = 12;
                            }else if (($scope.new.ticket.sendNotify!=null && $scope.new.ticket.sendNotify!=0) && obj.building.autoApproveOwners!="1" && obj.building.autoApproveAll!="1"){
                                if (obj.building.mpPaymentMethod!="1"){
                                    //SET APPROVAL IS REQUIRED HISTORY
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.status = 2;
                                }else if (obj.building.mpPaymentMethod=="1"){
                                    //SET STATUS FOR REQUEST with MercadoPago Payment Method config parameter enable  
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                                    $scope.new.ticket.status = 9;
                                }
                            }
                            if (($scope.new.ticket.status == 3 && obj.building.autoApproveAll=="1" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || ($scope.new.ticket.status == 3 && obj.building.autoApproveOwners=="1" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1")){
                                //SET PAYMENT APPROVED & ALLOWED BY THE BUILDING
                                if ($scope.new.ticket.total>0){
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido sera pagado por expensas, habilitado por el consorcio.', 'idCambiosTicketKf':"4"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                    $scope.new.ticket.status = 12;
                                }else if ($scope.new.ticket.total==0){
                                    //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"4"});
                                    $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                    $scope.new.ticket.status = 12;
                                }
                            }else if ($scope.new.ticket.status == 3 && ((obj.building.autoApproveOwners==null || obj.building.autoApproveOwners=="0") && (obj.building.autoApproveAll==null || obj.building.autoApproveAll=="0")) && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.status = 2;
                            }else if ($scope.new.ticket.status == 3 && (obj.building.chargeForExpenses==null || obj.building.chargeForExpenses=="1") && $scope.new.ticket.idTypePaymentKf!="1"){
                                //ONLY IF REQUEST PAYMENT OPTION IS 2
                                //$scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"5"});
                            }
                        }else if($scope.new.ticket.idTypeRequestFor!=1 && $scope.new.ticket.idTypeRequestFor!=3 && $scope.new.ticket.idTypeRequestFor!=5 && $scope.new.ticket.idTypeRequestFor!=6){
                            if (($scope.new.ticket.idUserRequestByProfile == "4" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || $scope.sysLoggedUser.idProfileKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por la Administración automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                $scope.new.ticket.status = 12;
                            }
                        }else{
                            if (($scope.new.ticket.idUserRequestByProfile == "4" && obj.building.chargeForExpenses=="1" && $scope.new.ticket.idTypePaymentKf=="1") || $scope.sysLoggedUser.idProfileKf=="1"){
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"3"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido aprobado por la Administración automaticamente.', 'idCambiosTicketKf':"2"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': 'Pedido sera pagado por expensas, habilitado por el consorcio.', 'idCambiosTicketKf':"4"});
                                $scope.new.ticket.history.push({'idUserKf': "1", 'descripcion': null, 'idCambiosTicketKf':"27"});
                                $scope.new.ticket.status = 12;
                            }
                        }
                        console.log($scope.new.ticket);
                        $('#showModalRequestStatus').modal({backdrop: 'static', keyboard: false});
                        $timeout(function() {
                        $scope.addDownRequestFn($scope.new);
                        }, 2000);
                                            
                    break;
                    case "linkMP": // Payment Link Mercado Pago
                        console.log("---------------------------------------");
                        console.log("  CREAR LINK DE PAGO PARA MERCADOPAGO  ");
                        console.log("---------------------------------------");
                        console.log("[New MP Payment Link]");
                        console.log(obj);
                        //$scope.mp.link.new.data.linkDeNotificacion    = serverHost+"/Back/index.php/MercadoLibre/getNotificationOfMP";
                        //$scope.mp.link.new.data.back_url              = serverHost+"/monitor";
                        $scope.mp.link={'new':{'data':{}},'url':null}; //codTicket
                        $scope.mp.link.new.data={'idPago': null,'monto':  null,'linkDeNotificacion':  null,'back_url':  null,'metadata': {}};
                        $scope.mp.link.new.data.idTicket              = obj.idTicket;
                        $scope.mp.link.new.data.ticket_number         = obj.codTicket;
                        $scope.mp.link.new.data.monto                 = Number(parseInt(obj.total));
                        $scope.mp.link.new.data.linkDeNotificacion    = serverHost+"/Back/index.php/MercadoLibre/getNotificationOfMP";
                        $scope.mp.link.new.data.back_url              = "";
                        $scope.mp.link.new.data.description           = obj.typeticket.TypeTicketName;
                        $scope.mp.link.new.data.quantity              = obj.keys.length;
                        $scope.mp.link.new.data.metadata.paymentFor   = 1;
                        console.log($scope.mp.link);
                        $scope.mpCreateLinkFn($scope.mp.link.new);                  
                    break;
                    default:
                }
            }
          /******************************
          *   ADDING NEW REQUEST UP     *
          ******************************/
           $scope.ticketRegistered = null;
           $scope.addUpRequestFn = function(pedido){
                console.log(pedido);
                $scope.ticketRegistered = null;
                ticketServices.addUpRequest(pedido).then(function(response){
                    //console.log(response);
                    if(response.status==200){
                    $timeout(function() {
                        console.log("Request Successfully Created");
                        inform.add('Pedido Registrado Satisfactoriamente. ',{
                            ttl:5000, type: 'success'
                        });
                        $('.circle-loader').toggleClass('load-complete');
                        $('.checkmark').toggle();
                        $scope.ticketRegistered = response.data.response[0];
                    }, 2500);
                    if((response.data.response[0].idStatusTicketKf=="3" || response.data.response[0].idStatusTicketKf=="9") && response.data.response[0].idTypePaymentKf=="2" && response.data.response[0].total>0){
                        $timeout(function() {
                            $scope.mainSwitchFn("linkMP",response.data.response[0],null);
                        }, 2700);
                    }
                    }else if(response.status==500){
                        $scope.ticketRegistered = null;
                    console.log("Customer not Created, contact administrator");
                    inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                    });
                    }
                    //$('#showModalRequestStatus').modal('hide');
                });
           };
          /******************************
          *   ADDING NEW REQUEST DOWN   *
          ******************************/
          $scope.ticketRegistered = null;
          $scope.addDownRequestFn = function(pedido){
               console.log(pedido);
               $scope.ticketRegistered = null;
               ticketServices.addDownRequest(pedido).then(function(response){
                   //console.log(response);
                   if(response.status==200){
                   $timeout(function() {
                       console.log("Request Successfully Created");
                       inform.add('Pedido Registrado Satisfactoriamente. ',{
                           ttl:5000, type: 'success'
                       });
                       $('.circle-loader').toggleClass('load-complete');
                       $('.checkmark').toggle();
                       $scope.ticketRegistered = response.data.response[0];
                   }, 2500);
                   if((response.data.response[0].idStatusTicketKf=="3" || response.data.response[0].idStatusTicketKf=="9") && response.data.response[0].idTypePaymentKf=="2" && response.data.response[0].total>0){
                       $timeout(function() {
                           $scope.mainSwitchFn("linkMP",response.data.response[0],null);
                       }, 2700);
                   }
                   }else if(response.status==500){
                       $scope.ticketRegistered = null;
                   console.log("Customer not Created, contact administrator");
                   inform.add('Error: [500] Contacta al area de soporte. ',{
                           ttl:5000, type: 'danger'
                   });
                   }
                   //$('#showModalRequestStatus').modal('hide');
               });
          };
          /******************************
          *   CREATING MP PAYMENT LINK  *
          ******************************/
           $scope.mpCreateLinkFn = function(data){
                ticketServices.createMPLink(data).then(function(response){
                    //console.log(response);
                    if(response.status==200){
                        console.log("Request Successfully Created");
                        inform.add('Link de pago generado satisfactoriamente. ',{
                            ttl:5000, type: 'success'
                        });
                        console.log(response);
                        $scope.mp.link.url  = response.data[0].data.response.init_point;
                        $scope.mp.data      = response.data[0].data.response;
                        $scope.addPaymentFn(response.data[0].data.response);
                    }else if(response.status==500){
                        $scope.ticketRegistered = null;
                    console.log("MP Payment Link not Created, contact administrator");
                    inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                    });
                    }
                });
           };
          /****************************
          *    ADD PAYMENT DETAILS    *
          ****************************/
            $scope.mp.payment={"data":{
                "idTicketKf": null,
                "client_id":null,
                "id": null,
                "collector_id": null,
                "date_created": null,
                "expires": null,
                "external_reference":null,
                "init_point": null,
                "sandbox_init_point": null,
                "operation_type":null
            }}
            $scope.addPaymentFn = function(payment){
                console.log($scope.mp);
                $scope.mp.payment.data.idTicketKf         = $scope.mp.link.new.data.idTicket;
                $scope.mp.payment.data.client_id          = payment.client_id;
                $scope.mp.payment.data.id                 = payment.id;
                $scope.mp.payment.data.collector_id       = payment.collector_id;
                $scope.mp.payment.data.date_created       = payment.date_created;
                $scope.mp.payment.data.expires            = payment.expires;
                $scope.mp.payment.data.external_reference = payment.external_reference;
                $scope.mp.payment.data.init_point         = payment.init_point;
                $scope.mp.payment.data.sandbox_init_point = payment.sandbox_init_point;
                $scope.mp.payment.data.operation_type     = payment.operation_type;
                $scope.mp.payment.data.paymentForDelivery = false;
                $scope.addPaymentDetailsFn = null;
                console.log($scope.mp.payment.data);
                ticketServices.addPayment($scope.mp.payment).then(function(response){
                    //console.log(response);
                    if(response.status==200){
                        console.log("Solicitud de Pago registrada satisfactoriamente");
                        inform.add('La solicitud de pago ha sido registrada Satisfactoriamente. ',{
                                ttl:5000, type: 'success'
                        });
                        $scope.addPaymentDetailsFn = response.data.response[0];
                    }else if(response.status==500){
                        $scope.addPaymentDetailsFn = null;
                        console.log("Payment request has failed, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                                ttl:5000, type: 'danger'
                        });
                    }
                });

            };
            $scope._getData2DelKey = function () {

                var delKey =
                        {
                            ticket:
                                    {
                                        idTypeTicketKf        : $scope.tk.idTicket,
                                        idUserEnterpriceKf    : $scope.tk.idUserEnterpriceKf,
                                        idUserTenantKf        : $scope.tk.idTenantKf,
                                        idUserAdminKf         : $scope.tk.idUserAdminKf,
                                        idOWnerKf             : $scope.tk.idOWnerKf,
                                        idProfileKf           : $scope.tk.idProfileKf,
                                        numberItemes          : $scope.tk.numberItemes,
                                        idDepartmentKf        : $scope.tk.idDepartmentKf,
                                        description           : $scope.tk.description,
                                        idAttendantKf         : $scope.tk.idAttendantKf,
                                        idOpcionLowTicketKf   : $scope.tk.idOpcionLowTicketKf,
                                        idReasonDisabledItemKf: $scope.tk.idReasonDisabledItemKf,
                                        itemToDisabled        : $scope.tk.itemToDisabled,
                                        idAdressKf            : $scope.tk.idAddresKf,
                                        idCompanyKf           : $scope.tk.idCompanyKf,
                                        idTypeOfOptionKf      : $scope.tk.idTypeOfOptionKf,
                                        sendNotify            : $scope.tk.sendNotify,
                                        isNew                 : $scope.tk.isNew
                                    }
                        };
                return delKey;
            };

});