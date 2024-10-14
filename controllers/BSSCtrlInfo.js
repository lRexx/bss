/**
* Info Controller
**/
var sysInfo = angular.module("module.Info", ["tokenSystem", "angular.filter", "services.Customers", "services.Departments","services.Address", "services.Products", "services.Contracts", "services.Service", "services.User", "ngAnimate", "ngSanitize", "ui.bootstrap", "ui.select", "services.Utilities", "bootstrapLightbox"]);

sysInfo.controller('infoCtrl', function($scope, $location, $routeParams, blockUI, $q, Lightbox, $timeout, inform, DepartmentsServices, CustomerServices, ProductsServices, ContractServices, serviceServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo Info");
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
      $location.path("/login");
    }
    
    var currentUrl = $location.path()
    var urlPath = currentUrl.split('/');
    $scope.urlPathSelected=urlPath[1];
      /**************************************************
      *                                                 *
      *                GET CUSTOMER BY ID               *
      *                                                 *
      **************************************************/
          $scope.getCustomerDetailsByIdFn = function(id){
            CustomerServices.getCustomersById(id).then(function(response){
              console.log(response);
              $scope.serviceResponse=response;
              if(response.status==200){
                  if (response.data.IsInDebt=="0" || response.data.IsInDebt==null){
                    $timeout(function() {
                      var el = $('.circle-loader-spin')
                      el.removeClass();
                      el.addClass('circle-loader-spin');
                      el.addClass('success');
                      $scope.customerStatus = response.data;
                    },1500);
                  }else{
                    $timeout(function() {
                      var el = $('.circle-loader-spin')
                      el.removeClass()
                      el.addClass('circle-loader-spin');
                      el.addClass('failed');
                      $scope.customerStatus = response.data;
                    },1500);
                  }
                
              }else if (response.status==404){
                inform.add('[Info]: '+response.status+', Cliente no encontrado. ',{
                  ttl:3000, type: 'warning'
                });
                $scope.customerStatus=undefined;
              }else if (response.status==500){
                inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                  ttl:3000, type: 'danger'
                });
                $scope.customerStatus=undefined;
              }
            });
          };
      /**************************************************
      *                                                 *
      *   ASSIGN DEPARTMENT TO THE CURRENT OWNER USER   *
      *                                                 *
      **************************************************/
          $scope.customerStatus=undefined;
          $scope.serviceResponse=undefined;
          $scope.checkCustomerIsInDebtFn = function(id){
            $scope.customerStatus=undefined;
            CustomerServices.checkCustomerIsInDebt(id).then(function(response) {
              console.log(response);
              $scope.serviceResponse=response;
              if(response.status==200){
                  if (response.data.IsInDebt=="0" || response.data.IsInDebt==null){
                    $timeout(function() {
                      var el = $('.circle-loader-spin')
                      el.removeClass();
                      el.addClass('circle-loader-spin');
                      el.addClass('success');
                      $scope.customerStatus = response.data;
                    },1500);
                  }else{
                    $timeout(function() {
                      var el = $('.circle-loader-spin')
                      el.removeClass()
                      el.addClass('circle-loader-spin');
                      el.addClass('failed');
                      $scope.customerStatus = response.data;
                    },1500);
                  }
                
              }else if (response.status==404){
                inform.add('[Info]: '+response.status+', Cliente no encontrado. ',{
                  ttl:3000, type: 'warning'
                });
                $scope.customerStatus=undefined;
              }else if (response.status==500){
                inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                  ttl:3000, type: 'danger'
                });
                $scope.customerStatus=undefined;
              }
            });
          }
      /**************************************************
      *                                                 *
      *         LIST OF ATTENDANTS BY ID ADDRESS        *
      *                                                 *
      **************************************************/
          $scope.attendantListByAddress = [];
          $scope.getAttendantListFn = function(idAddress){
              $scope.attendantListByAddress = [];
              userServices.attendantList(idAddress).then(function(response) {
                  if(response.status==200){
                      $scope.attendantListByAddress = response.data;
                      console.log($scope.attendantListByAddress);
                  }else if (response.status==404){
                      $scope.attendantListByAddress = [];
                      inform.add('No se encontraron Encargados asociados al consorcio seleccionado. ',{
                          ttl:5000, type: 'info'
                      });
                  }else if (response.status==500){
                      inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                          ttl:5000, type: 'danger'
                      });
                  }
              });
              
          }
      /**************************************************
      *                                                 *
      *          COLLAPSE / EXPAND TABLE ROWS           *
      *                                                 *
      **************************************************/
            $scope.tableRowExpanded          = false;
            $scope.tableRowIndexCurrExpanded = "";
            $scope.tableRowIndexPrevExpanded = "";
            $scope.dayDataCollapseFn = function () {
                $scope.tableRowExpanded          = false;
                $scope.tableRowIndexCurrExpanded = "";
                $scope.tableRowIndexPrevExpanded = "";
                $scope.vIndex=null;
                $scope.dayDataCollapse = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
            };
            $scope.dayDataCollapse = [];
            $scope.vIndex=null;
            $scope.selectedDepto = {};
            $scope.selectTable = {'rowIndex':'', 'depto':{}, 'option':''}; 
            $scope.selectTableRow = function (value, item, opt) {
                $scope.selectTable = {'rowIndex':'', 'depto':{}, 'option':''}; 
                $scope.vIndex = value;
                $scope.selectedDepto = item;
                $scope.departmentSelected = item;
                $scope.selectTable.rowIndex = value;
                $scope.selectTable.depto = item;
                $scope.selectTable.option = opt;
                $scope.idDeptoKf = item.idClientDepartament;
                console.log("[selectTableRow ("+$scope.vIndex +")]->idDeptoKf: "+$scope.idDeptoKf);
                if ($scope.dayDataCollapse === 'undefined') {
                    $scope.dayDataCollapse = $scope.dayDataCollapseFn();
                    console.log("dayDataCollapse:");
                    console.log($scope.dayDataCollapse);
                } else {
                    //console.log("dayDataCollapse != undefined");
                    //console.log($scope.dayDataCollapse);
                    console.log('Variable tableRowExpanded: '+$scope.tableRowExpanded);
                    console.log('Variable tableRowIndexCurrExpanded: '+$scope.tableRowIndexCurrExpanded);
                    if ($scope.tableRowExpanded === false && $scope.tableRowIndexCurrExpanded === "") {
                        console.log("ROWEXPANDED FALSE")
                        $scope.tableRowIndexPrevExpanded = "";
                        $scope.tableRowExpanded = true;
                        $scope.tableRowIndexCurrExpanded = $scope.vIndex;
                        $scope.dayDataCollapse[$scope.vIndex] = false;
                        //console.log('Id del idDeptoKf: '+$scope.idDeptoKf+' / Index Id de la tabla: ' +$scope.vIndex);
                        if(opt=="depto"){$scope.lisTenantByType($scope.idDeptoKf, null);}
                        if(opt=="service"){$scope.getListContractServicesFn($scope.idDeptoKf, null);}
                        //console.log("===================================")
                    } else if ($scope.tableRowExpanded === true) {
                            console.log("ROWEXPANDED TRUE")
                        if ($scope.tableRowIndexCurrExpanded === $scope.vIndex) {
                            console.log("tableRowIndexCurrExpanded == vIndex")
                            $scope.tableRowExpanded = false;
                            $scope.tableRowIndexCurrExpanded = "";
                            $scope.selectTable = {'rowIndex':'', 'depto':{}, 'option':''}; 
                            $scope.idDeptoKf = undefined;
                            $scope.selectedDepto = {};
                            //console.log('Id del idDeptoKf: '+$scope.idDeptoKf+' / Index Id de la tabla: ' +$scope.vIndex);
                            $scope.dayDataCollapse[$scope.vIndex] = true;
                            $scope.vIndex =null;
                            //console.log("===================================")
                        } else {
                            //console.log("tableRowIndexCurrExpanded != vIndex")
                            //console.log('Id del idDeptoKf: '+$scope.idDeptoKf+' / Index Id de la tabla: ' +$scope.vIndex);
                            $scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
                            $scope.tableRowIndexCurrExpanded = $scope.vIndex;
                            if(opt=="depto"){$scope.lisTenantByType($scope.idDeptoKf, null);}
                            if(opt=="service"){$scope.getListContractServicesFn($scope.idDeptoKf, null);}
                            $scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = true;
                            $scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = false;
                            //console.log("===================================")
                        }
                    } 
                }
            };
      /**************************************************
      *                                                 *
      *     SELECCIONA DATA DE TENANT SELECCIONADO      *
      *                 DE LA LISTA                     *
      **************************************************/
          $scope.lisTenantByType = function(idDepto, idTypeTenant){
            var typeTenant=idTypeTenant==null?-1:idTypeTenant;
            if (($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==5 || $scope.sysLoggedUser.idProfileKf==6) && $scope.sysLoggedUser.idTypeTenantKf!=null){
                DepartmentsServices.listTenant2AssignedDeptoByIdDeptoByTypeTenant(idDepto, typeTenant).then(function(response) {
                    if(response.status==200){
                        console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                        $scope.listTenant = response.data.tenant;
                    }else if (response.status==404){
                        $scope.listTenant =[];
                    }else if (response.status==500){
                        $scope.listTenant =[];
                    }
                });
            }else{
                DepartmentsServices.listTenant2AssignedDeptoByIdDepto(idDepto).then(function(response) {
                    if(response.status==200){
                        $scope.listTenant = response.data.tenant;
                        $scope.tenantNotFound=false; 
                        $scope.dayDataCollapse[$scope.vIndex] = false;
                        console.log('typeTenant = '+ typeTenant + ' / Profile = '+$scope.sysLoggedUser.idProfileKf);
                        console.log(response.data.tenant);
                    }else if (response.status==404){
                        $scope.tenantNotFound=true;
                        $scope.dayDataCollapse[$scope.vIndex] = false;
                        $scope.tenantNotFound=true;
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
      * DEPARTMENT LIST BY SELECTED ADDRESS AND TENANT  *
      *                                                 *
      **************************************************/
        $scope.ListDpto=[];
        $scope.getDeptoListByAddress = function (idAddress){
            if(idAddress!=undefined){
                $scope.ListDpto=[];
                var idStatusFk='-1';
                DepartmentsServices.byIdDireccion(idAddress, idStatusFk).then(function(response) {
                  console.log(response);
                    if(response.status==200){
                        $scope.ListDpto = response.data;
                        console.log($scope.ListDpto);
                        if ($scope.idDeptoKf!=undefined){
                            $timeout(function() {
                                $scope.tableRowExpanded = false;
                                $scope.tableRowIndexCurrExpanded = "";
                                $scope.selectTableRow($scope.vIndex, $scope.selectedDepto, "depto");
                                //$scope.dayDataCollapse[$scope.vIndex] = false;
                            }, 200);
                        }
                    }else if (response.status==404){
                        $scope.ListDpto=[];
                        inform.add('No hay departamentos en esta direccion para ser asociados, contacte al area de soporte de TASS.',{
                        ttl:5000, type: 'danger'
                        });
                    }
                });
            }
        };


    /**************************************************
    *                                                 *
    *                 MODAL CONFIRMATION              *
    *                                                 *
    **************************************************/
    $scope.argObj=null;
    $scope.modalConfirmation = function(opt, confirm, obj, obj2){
      $scope.swMenu = opt;
      $scope.vConfirm = confirm;
      $scope.mess2show="";
      $scope.messAction="";
      //console.log("$scope.swMenu: "+$scope.swMenu);
      switch ($scope.swMenu){
          case "closeWindow":
              if (confirm==0){
                  if ($scope.isNewUser==true){
                    $scope.mess2show="Se perderan todos los datos cargados del registro actual, esta seguro que desea cancelar?";
                  }else{
                    $scope.mess2show="Se perderan todas las modificaciones realizadas en el registro actual, esta seguro que desea cancelar la modificacion?";
                  }
                  $("#confirmRequestModal").modal('show');
              }else if (confirm==1){
                  $("#confirmRequestModal").modal('hide');
                  $("#RegisterUser").modal('hide');
                  $("#newSysProfile").modal('hide');
                  $("#updateSysProfile").modal('hide');
                  $("#UpdateUser").modal('hide');
                  if ($scope.sysContentList=="users" && ($scope.isNewUser==true || $scope.isUpdateUser==true)){
                    $scope.refreshList();
                  }else if ($scope.isNewProfileRole==true || $scope.isUpdateProfileRole==true){
                    $scope.getSysProfilesFn("");
                  }
              }
          break;
          case "trigger_call":
            if (confirm==0){
                if (obj.fullNameUser!=undefined){
                  $scope.mess2show="Desea llamar a "+obj.fullNameUser+" ("+obj.nameProfile+"), Confirmar?";
                }else{
                  $scope.mess2show="Desea llamar al teléfono "+obj.phoneTag+" de la Administración, Confirmar?";
                }
                  
                $scope.argObj = obj;
                $scope.telf = obj2;
                console.log('Llamar al usuario '+obj.fullNameUser+' Telefono: '+obj2+' Solicitado por el usuario: '+$scope.sysLoggedUser.fullNameUser);
                console.log("============================================================================")
                console.log($scope.argObj);
                $('#confirmRequestModal').modal('toggle');
            }else if (confirm==1){
                $scope.triggerCall($scope.telf);
                $('#confirmRequestModal').modal('hide');
                //console.log($scope.argObj);
            }
          break;
          case "trigger_mail":
            if (confirm==0){
                $scope.mess2show="Desea enviar un correo a la dirección "+obj.mailContact+" ("+obj.descripcion+") de la Administración, Confirmar?";
                  
                $scope.argObj = obj;
                $scope.mail = obj2;
                console.log('Llamar al usuario '+obj.fullNameUser+' Telefono: '+obj2+' Solicitado por el usuario: '+$scope.sysLoggedUser.fullNameUser);
                console.log("============================================================================")
                console.log($scope.argObj);
                $('#confirmRequestModal').modal('toggle');
            }else if (confirm==1){
                $scope.triggerMail($scope.mail);
                $('#confirmRequestModal').modal('hide');
                //console.log($scope.argObj);
            }
          break;
          default:
      }
    }
        $scope.triggerCall = function(obj){
          window.open('tel:'+obj);
        }
        $scope.triggerMail = function(obj){
          window.open('mailto:'+obj+'?subject=BSS%20Soporte');
        }
        
    /***************************************************************************
    *                                                                          *
    *   PARAMETER TO RECEIVED TO CHECK WETHER A CLIENT IS ENABLE OR DISABLE    *
    *                                                                          *
    ****************************************************************************/

    $scope.sysRouteParams = undefined;
    $scope.sysRouteParams = tokenSystem.getTokenStorage(8);
    if ($scope.sysRouteParams && $scope.sysRouteParams!=undefined){
        console.log("===========================================");
        console.log("    Parameters for Approval received       ");
        console.log("===========================================");
        console.log($scope.sysRouteParams);
        $scope.checkStatus={'services':false, 'client':false}
        if($scope.sysRouteParams){
          if ($scope.sysRouteParams.client!=undefined){
            var idClient = $scope.sysRouteParams.client;
            //console.log("client: "+idClient);
            //$timeout(function() {$scope.checkCustomerIsInDebtFn(idClient);}, 1500);
            //$scope.checkCustomerIsInDebtFn(idClient);
            $scope.getCustomerDetailsByIdFn(idClient);
            $scope.getAttendantListFn(idClient); //LOAD ATTENDANT LIST
            $scope.getDeptoListByAddress(idClient);
            $scope.checkStatus.client=true;
              $timeout(function() {
                  var isCollapsed = false;
                  isCollapsed = !isCollapsed; 
                  $scope.dayDataCollapseFn();
              }, 700);
            console.log($scope.sysRouteParams);
          }else{
            $location.path("/login");
          }

        }else{
          inform.add('Numero de Id del cliene no ha sido recibido',{
              ttl:5000, type: 'warning'
            });
        }
    }

});