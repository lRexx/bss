/**
* Customers Controller
**/
var users = angular.module("module.Users", ["tokenSystem", "angular.filter", "services.User", "services.Customers", "ngclipboard", "services.Address", "services.Ticket", "services.Profiles", "services.Departments", "ui.select", "services.Utilities"]);
/**************************************************
*                                                 *
*          DATE FILTER FOR MYSQL TIMESTAMP        *
*                                                 *
**************************************************/
 users.filter('dateToISO', function() {
  return function(input) {
      input = new Date(input).toISOString();
      return input;
  }
});
users.controller('UsersCtrl', function($scope, $location, $q, $routeParams, blockUI, Lightbox, $timeout, inform, CustomerServices, addressServices, ticketServices, userServices, ProfileServices, DepartmentsServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS, APP_REGEX){
    console.log(APP_SYS.app_name+" Modulo Users");
    //console.log($routeParams);

    if(!$scope.sysToken && ($scope.sysLoggedUser==false || $scope.sysLoggedUser==undefined)){
      console.log("login required!!");
      $location.path("/login");
    }else{
      console.log("No login required!!");
    }
    
    //if (!$scope.sysModules.idUsers){
    //  $location.path("/");
    //}
    $scope.filterAddressKf = {'selected':undefined};
    $scope.filterCompanyKf = {'selected':undefined};
    $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isNotCliente':undefined, 'isInDebt':false, 'isStockInBuilding': false, 'isStockInOffice': false, 'strict':false};

      /**************************************************
      *                                                 *
      *       GET LIST OF CUSTOMER BY CUSTOMER ID       *
      *                                                 *
      **************************************************/
        $scope.listOffices=[];
        $scope.getLisOfCustomersByIdFn = function(obj){
          //console.log("getLisOfCustomersByIdFn: "+obj.idClient);
          $scope.listOffices=[];
          CustomerServices.getCustomersListByCustomerId(obj.idClient).then(function(response){
            //console.log(response);
            if(response.status==200){
              $scope.listOffices = response.data;
            }else{
              $scope.listOffices = [];
              inform.add('No hay Consorcios o Sucursales asociadas a la ('+obj.ClientType+') - '+obj.name+' , contacte al area de soporte de BSS.',{
                ttl:5000, type: 'info'
                });
            }
          });
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
            "strict":strict,
            "totalCount":null,
            };
            console.log($scope.customersSearch);
            return CustomerServices.getCustomerListLimit($scope.customersSearch).then(function(response){
            console.info(response);
            if(response.status==200){
                return response.data;
            }else if(response.status==404){
              inform.add('[Info]: '+response.data.error+'.',{
                ttl:5000, type: 'info'
              });
                return response;
            }
            });
        }
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
        $scope.findCustomerFn=function(string, user, opt){
          var userProfile = user == undefined?$scope.users.update.idProfileKf:user;
          if (opt!="setClient"){
            var typeClient=null;
            if(event.keyCode === 8 || event.which === 8){
              console.log("event.which: "+event.which);
              $scope.listOffices=[];
              $scope.select.address.selected=undefined;
            }else if(event.keyCode === 1 || event.which === 1 || event.keyCode === 13 || event.which === 13){
              console.log("Search:");
              console.log("string: "+string);
              console.log("option: "+opt);
              if (userProfile!="2" && userProfile!="4" && $scope.att.ownerOption!="3"){
                typeClient = "2"
              }
              console.log("typeClient: "+typeClient);
              $scope.listOffices=[];
              $scope.select.address.selected=undefined;
                var output=[];
                var i=0;
                if (string!=undefined && string!=""){
                    $scope.customerFound={};
                    $scope.getCustomerLisServiceFn(string, "0", typeClient, null, 0, 10, null).then(function(response) {
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
                  $timeout(function() {
                    //$scope.mainSwitchFn('search', null);
                    }, 1500);
                  }
                console.info($scope.listCustomerFound);
            }
          }else{
            var typeClient=null;
            if(event.keyCode === 8 || event.which === 8){
              console.log("event.which: "+event.which);
              $scope.listOffices=[];
              $scope.filterCompanyKf.selected=undefined;
              $scope.filterAddressKf.selected=undefined;
            }else if(event.keyCode === 1 || event.which === 1 || event.keyCode === 13 || event.which === 13){
              console.log("Search:");
              console.log("string: "+string);
              console.log("option: "+opt);
              if (userProfile!="2" && userProfile!="4"){
                typeClient = "2"
              }
              console.log("typeClient: "+typeClient);
              $scope.listOffices=[];
              $scope.filterCompanyKf.selected=undefined;
              $scope.filterAddressKf.selected=undefined;
                var output=[];
                var i=0;
                if (string!=undefined && string!=""){
                    $scope.customerFound={};
                    $scope.getCustomerLisServiceFn(string, "0", typeClient, null, 0, 10, null).then(function(response) {
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
                  $timeout(function() {
                    //$scope.mainSwitchFn('search', null);
                    }, 1500);
                  }
                console.info($scope.listCustomerFound);
            }
          }
        }
        $scope.customerFound={};
        $scope.loadCustomerFieldsFn=function(obj, opt){
            $scope.customerFound={};
            console.log("===============================");
            console.log("|  SERVICE CUSTOMER SELECTED  |");
            console.log("===============================");
            console.log(obj);
            if (opt!="setClient"){
              $scope.select.company.selected = undefined;
              $scope.customerFound=obj;
              $scope.customerSearch.address = obj.name;
              if (obj.idClientTypeFk=="1" || obj.idClientTypeFk=="3"){
                $scope.select.company.selected=obj;
                $scope.getLisOfCustomersByIdFn(obj);
              }else if (obj.idClientTypeFk=="2"){
                if ($scope.customerFound.idClientAdminFk!=null && $scope.customerFound.idClientAdminFk!=undefined){
                  var arrCompany=[]
                  arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientAdminFk);
                  $timeout(function() {
                    if (arrCompany.length==1){
                        $scope.select.company.selected=arrCompany[0];
                        console.log($scope.select.company.selected);
                    }
                  }, 500);
                }else{
                    inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                            ttl:10000, type: 'danger'
                    });
                }
                $scope.select.address.selected=obj;
              }else if (obj.idClientTypeFk=="4"){
                if ($scope.customerFound.idClientBranchFk!=null && $scope.customerFound.idClientBranchFk!=undefined){
                  var arrCompany=[]
                  arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientBranchFk);
                  
                  $timeout(function() {
                    if (arrCompany.length==1){
                        $scope.select.company.selected=arrCompany[0];
                        console.log($scope.select.company.selected);
                    }
                  }, 500);
                }else{
                    inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                            ttl:10000, type: 'danger'
                    });
                }
                $scope.select.address.selected=obj;
              }
              $scope.listCustomerFound=[];
              $scope.getDeptoListByAddress($scope.select.address.selected.idClient);
              $scope.select.departmentList=null;
              console.log($scope.select.address.selected);
            }else{
              $scope.filterCompanyKf.selected = undefined;
              $scope.customerFound=obj;
              $scope.customerSearch.name = obj.name;
              if (obj.idClientTypeFk=="1" || obj.idClientTypeFk=="3"){
                $scope.filterCompanyKf.selected=obj;
                $scope.getLisOfCustomersByIdFn(obj);
              }else if (obj.idClientTypeFk=="2"){
                if ($scope.customerFound.idClientAdminFk!=null && $scope.customerFound.idClientAdminFk!=undefined){
                  var arrCompany=[]
                  arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientAdminFk);
                  $timeout(function() {
                    if (arrCompany.length==1){
                        $scope.filterCompanyKf.selected=arrCompany[0];
                        console.log($scope.filterCompanyKf.selected);
                    }
                  }, 500);
                }else{
                    inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                            ttl:10000, type: 'danger'
                    });
                }
                $scope.filterAddressKf.selected=obj;
                console.log($scope.filterAddressKf.selected);
              }else if (obj.idClientTypeFk=="4"){
                if ($scope.customerFound.idClientBranchFk!=null && $scope.customerFound.idClientBranchFk!=undefined){
                  var arrCompany=[]
                  arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customerFound.idClientBranchFk);
                  
                  $timeout(function() {
                    if (arrCompany.length==1){
                        $scope.filterCompanyKf.selected=arrCompany[0];
                        console.log($scope.filterCompanyKf.selected);
                    }
                  }, 500);
                }else{
                    inform.add("El Consorcio "+obj.name+ " no se encuentra asociado a una Administración.",{
                            ttl:10000, type: 'danger'
                    });
                }
                $scope.filterAddressKf.selected=obj;
              }
              $scope.listCustomerFound=[];
            }

        }
      /**************************************************
      *                                                 *
      *                 MODAL CONFIRMATION              *
      *                                                 *
      **************************************************/
        $scope.argObj={};
        $scope.modalConfirmation = function(opt, confirm, obj){
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
            case "update":
                if (confirm==0){
                    $scope.tenantObj=obj;
                        //console.log(obj)
                        $scope.mess2show="Se actualizaran los datos del usuario: "+$scope.tenantObj.fname+" "+$scope.tenantObj.lname+" por favor,     Confirmar?";
                        console.log("ID del Usuario a actualizar  : "+obj.idUser);
                        console.log("Nombres del Usuario a actualizar  : "+$scope.tenantObj.fname+" "+$scope.tenantObj.lname);
                        console.log("============================================================================");
                        //console.log(obj);
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchUsersFn("update", $scope.tenantObj);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "resetPwd":
                if (confirm==0){
                    $scope.userObj=obj;
                        console.log(obj)
                        $scope.mess2show="Se restablecera la clave del usuario: "+$scope.userObj.fullNameUser+" por favor,     Confirmar?";
                        console.log("ID del Usuario a restablecer la clave  : "+obj.idUser);
                        console.log("Nombres del Usuario a restablecer la clave  : "+$scope.userObj.fullNameUser);
                        console.log("============================================================================");
                        //console.log(obj);
                $('#confirmRequestModal').modal({backdrop: 'static', keyboard: true});
                }else if (confirm==1){
                    $scope.switchUsersFn("resetPwd", $scope.userObj);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "remove":
            case "disabled":
            case "enabled":
              if (confirm==0){
                  if (obj.idUser!=0){
                    if (opt=="remove"){
                      $scope.messAction="Eliminado.";
                    }else if (opt=="disabled"){
                      $scope.messAction="Deshabilitado.";
                    }else{
                      $scope.messAction="Habilitado.";
                    }
                    $scope.mess2show="El usuario ("+obj.fullNameUser+") bajo el perfil de "+obj.nameProfile+" sera "+$scope.messAction+",     Confirmar?";
                    $scope.idUserKf   =  obj.idUser;
                    $scope.argObj = obj;
                    console.log('El Usuario sera '+$scope.messAction+' ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                    console.log("============================================================================")
                    console.log($scope.argObj);
                  }
                $('#confirmRequestModal').modal('toggle');
              }else if (confirm==1){
                if (opt=="remove"){
                  $scope.switchUsersFn('remove', $scope.argObj);
                }else if (opt=="disabled"){
                  $scope.switchUsersFn('disabled', $scope.argObj);
                }else{
                  console.log($scope.argObj);
                  $scope.switchUsersFn('enabled', $scope.argObj);
                }
                $('#confirmRequestModal').modal('hide');
              }
            break;
            case "removet":
              if (confirm==0){
                $scope.tenantObj=$scope.users.update;
                $scope.deptoObj=obj;
                console.log($scope.tenantObj);
                console.log(obj);
                var deptoSelected = obj.floor+"-"+obj.departament;
                  if (($scope.sysLoggedUser.idProfileKf!=3 && $scope.sysLoggedUser.idProfileKf!=5 && $scope.sysLoggedUser.idProfileKf!=6 && $scope.tenantObj.idTypeTenantKf!=0) || ($scope.sysLoggedUser.idProfileKf==3 && $scope.tenantObj.idTypeTenantKf==2) || ($scope.sysLoggedUser.idProfileKf==6 && $scope.tenantObj.idTypeTenantKf==2)){
                    $scope.mess2show="Dar de baja al Habitante de la unidad: "+deptoSelected.toUpperCase()+", Por favor confirmar para continuar ?";
                  }else if ($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==5 || ($scope.sysLoggedUser.idProfileKf==6 && $scope.sysLoggedUser.idTypeTenantKf==2)){
                    $scope.mess2show="Esta seguro que desea darse de baja?";
                  }
                  if(($scope.sysLoggedUser.idProfileKf!=3 && $scope.tenantObj.idTypeTenantKf!=0) || ($scope.sysLoggedUser.idProfileKf==3 && $scope.tenantObj.idTypeTenantKf==2) || ($scope.sysLoggedUser.idProfileKf==6 && $scope.tenantObj.idTypeTenantKf==2)){
                        $scope.remove.info.idUser           = $scope.tenantObj.idUser;
                        $scope.remove.info.idDepartmentKf   = $scope.tenantObj.idDepartmentKf==null?obj.idClientDepartament:$scope.tenantObj.idDepartmentKf;
                        $scope.remove.info.idTypeTenant     = $scope.tenantObj.idTypeTenantKf;
                        $scope.remove.info.idProfileKf      = $scope.tenantObj.idProfileKf;
                        console.log('ID: '+$scope.tenantObj.idUser+' ID DPTO: '+$scope.remove.info.idDepartmentKf+' ID TIPO TENANT: '+$scope.tenantObj.idTypeTenantKf);
                        console.log("DATOS DEL DEPARTAMENTO A DAR DE BAJA");
                        console.log($scope.deptoObj);
                        blockUI.start('Verificando si el habitante posee un pedido activo asociado.');
                        $scope.checkTicketTenantDeptoFn($scope.remove.info.idUser, $scope.remove.info.idDepartmentKf);
                  }else if($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==6 || $scope.sysLoggedUser.idProfileKf==5){
                        console.log("::::::: REMOVE AN DEPTO OWNER :::::::");
                        $scope.remove.info.idUser           = $scope.tenantObj.idUser;
                        $scope.remove.info.idDepartmentKf   = $scope.tenantObj.idDepartmentKf==null?obj.idClientDepartament:$scope.tenantObj.idDepartmentKf;
                        $scope.remove.info.idTypeTenant     = $scope.tenantObj.idTypeTenantKf;
                        $scope.remove.info.idProfileKf      = $scope.tenantObj.idProfileKf;
                        console.log('ID: '+$scope.tenantObj.idUser+' ID DPTO: '+$scope.remove.info.idDepartmentKf+' ID TIPO TENANT: '+$scope.tenantObj.idTypeTenantKf);
                        console.log("DATOS DEL DEPARTAMENTO O PROPIETARIO A DAR DE BAJA");
                        console.log($scope.deptoObj);
                        blockUI.start('Dando de baja al habitante del departamento seleccionado.');
                        $scope.checkTicketTenantDeptoFn($scope.remove.info.idUser, $scope.remove.info.idDepartmentKf);
                  }
              }else if (confirm==1){
                $scope.IsFnRemove=true;
                if($scope.sysLoggedUser.idProfileKf==5 || ($scope.sysLoggedUser.idProfileKf==6 && $scope.sessionidTypeTenant==2)){
                    //$scope.sysUnAssignDep2Tenant()
                }else{
                    $scope.removeTenantFn($scope.remove);
                    $scope.removeDepartmentFromListFn($scope.deptoObj, $scope.tenantObj)
                }
                $('#confirmRequestModal').modal('hide');
              }
            break;
            case "removeSysProf":
              if (confirm==0){
                  if (obj.idProfiles!=0){
                    $scope.idSysProf = obj.idProfiles;
                    $scope.mess2show="El Perfil "+obj.name+" sera Eliminado.     Confirmar?";
                      console.log('Usuario a eliminar ID: '+obj.idProfiles+' BAJO EL NOMBRE: '+obj.name);
                      console.log("============================================================================")
                      console.log(obj);
                  }      
                $('#confirmRequestModal').modal('toggle');
              }else if (confirm==1){
                    $scope.deleteSysProfileFn($scope.idSysProf);
                $('#confirmRequestModal').modal('hide');
              }
            break;
            case "updateSysUser":
              if (confirm==0){
                  if ($scope.sessionidProfile==1 && obj.idUser!=0){
                    if (obj.idProfileKf){$scope.mess2show="El usuario ("+obj.fullNameUser+") bajo el perfil de "+obj.nameProfile+" sera Actualizado.     Confirmar?";}
                      $scope.idUserKf   =  obj.idUser;
                      $scope.argObj = obj;
                      console.log('Usuario a eliminar ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                      console.log("============================================================================")
                      console.log($scope.argObj);
                  }      
                $('#confirmRequestModal').modal('toggle');
              }else if (confirm==1){
                    $scope.sysUpdateUserFn($scope.argObj);
                $('#confirmRequestModal').modal('hide');
              }
            break;
            case "updateProfileUser":
              if (confirm==0){
                  if ($scope.sysLoggedUser.idProfileFk==1 && obj.idUser!=0){
                    if (obj.idProfileKf){$scope.mess2show="El usuario ("+obj.fullNameUser+") bajo el perfil de "+obj.nameProfile+" sera Actualizado.     Confirmar?";}
                      $scope.idUserKf   =  obj.idUser;
                      $scope.argObj = obj;
                      console.log('Usuario a eliminar ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                      console.log("============================================================================")
                      console.log($scope.argObj);
                  }      
                $('#confirmRequestModal').modal('toggle');
              }else if (confirm==1){
                    $scope.sysUpdateUserFn($scope.argObj);
                $('#confirmRequestModal').modal('hide');
              }
            break;
            case "closeNotificationModal":
              $('.circle-loader').toggleClass('load-complete');
              $('.checkmark').toggle();
              $('#userNotificationModal').modal('hide');
          break;
            default:
          }
        }
        $scope.filterProfileAtt = function(item){
          //alert($scope.select.idCompanyKf);
          //console.log(item);
          return item.idProfileKf == 6;
        };
        $scope.filterProfileTenant = function(item){
          //alert($scope.select.idCompanyKf);
          //console.log(item);
          return item.idProfileKf == 3 || item.idProfileKf == 5 ;
        };
      /**
      * Pagination Functions
      **/
          $scope.pagedItems    = [];
          $scope.itemPerPage=0;
          $scope.loadPagination = function(item, orderBy, itemsByPage){
              var rowList=[];
              var rowId=null;
              for (var key in item){
                if (item[key].idClient!=undefined && typeof item[key].idClient === 'string'){
                  rowId=Number(item[key].idClient);
                  item[key].idClient=rowId;
                  rowList.push(item[key]);
                }else if (item[key].idUser!=undefined && typeof item[key].idUser === 'string'){
                  rowId=Number(item[key].idUser);
                  item[key].idUser=rowId;
                  rowList.push(item[key]);
                }else if (item[key].idUserFk!=undefined && typeof item[key].idUserFk === 'string'){
                  rowId=Number(item[key].idUserFk);
                  item[key].idUserFk=rowId;
                  rowList.push(item[key]);
                }else if (item[key].idProduct!=undefined && typeof item[key].idProduct === 'string'){
                  rowId=Number(item[key].idProduct);
                  item[key].idProduct=rowId;
                  rowList.push(item[key]);            
                }else if (item[key].idDepartmentFk!=undefined && typeof item[key].idProduct === 'string'){
                  rowId=Number(item[key].idDepartmentFk);
                  item[key].idDepartmentFk=rowId;
                  rowList.push(item[key]);            
                }else{
                  rowList.push(item[key]);
                }
              }
              //console.log(rowList);
              var sortingOrder     = orderBy;
              var itemsPerPage     = itemsByPage;
              $scope.sortingOrder  = sortingOrder;
              $scope.reverse       = false;
              $scope.filteredItems = [];
              $scope.groupedItems  = [];
              $scope.itemsPerPage  = itemsPerPage;
              $scope.pagedItems    = [];
              $scope.currentPage   = 0;
              $scope.items         = [];
              $scope.items         = rowList;
              $scope.itemPerPage   = $scope.itemsPerPage;
              $scope.search();
          }
          // init the filtered items
          $scope.search = function (qvalue1, qvalue2, qvalue3, qvalue4, qvalue5, qvalue6, vStrict) {
                  //console.log("[search]-->qvalue1: "+qvalue1);
                  //console.log("[search]-->qvalue2: "+qvalue2);
                  //console.log("[search]-->qvalue3: "+qvalue3);
                  //console.log("[search]-->qvalue4: "+qvalue4);
                  //console.log("[search]-->qvalue5: "+qvalue5);
                  //console.log("[search]-->qvalue6: "+qvalue6);
                  //console.log("[search]-->vStrict: "+vStrict);
                  $scope.filteredItems = $filter("filter")($scope.items, qvalue1, vStrict);
                  if (qvalue2!=undefined && qvalue2!='' && qvalue2!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue2, vStrict);}
                  if (qvalue3!=undefined && qvalue3!='' && qvalue3!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue3, vStrict);}
                  if (qvalue4!=undefined && qvalue4!='' && qvalue4!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue4, vStrict);}
                  if (qvalue5!=undefined && qvalue5!='' && qvalue5!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue5, vStrict);}
                  if (qvalue6!=undefined && qvalue6!='' && qvalue6!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue6, vStrict);}
              //console.log($scope.filteredItems);
              // take care of the sorting order
              if ($scope.sortingOrder !== '') {
                  $scope.filteredItems = $filter("orderBy")($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
                  //console.log($scope.filteredItems);
              }
              $scope.currentPage = 0;
              // now group by pages
              $scope.groupToPages();
          };
          // Group Items By Pages
          $scope.groupToPages = function (itemPerPage) {
              var itemsPerPage = itemPerPage==undefined || itemPerPage==null?$scope.itemsPerPage:itemPerPage;
              $scope.pagedItems = [];
              for (var i = 0; i < $scope.filteredItems.length; i++) {
                  if (i % itemsPerPage === 0) {
                      //console.log("entro al if");
                      $scope.pagedItems[Math.floor(i / itemsPerPage)] = [ $scope.filteredItems[i] ];
                  } else {
                      //console.log("entro al else");
                      $scope.pagedItems[Math.floor(i / itemsPerPage)].push($scope.filteredItems[i]);
                  } 
                  //console.log($scope.pagedItems[Math.floor(i / itemsPerPage)]);
              }
              //console.log($scope.pagedItems.length);
              //console.log("PAGINATION LOADED");
          };
          //Previous Page
          $scope.prevPage = function () {
              if ($scope.currentPage > 0) {
                  $scope.currentPage--;
              }
          };
          //Next Page
          $scope.nextPage = function () {
              if ($scope.currentPage < $scope.pagedItems.length - 1) {
                  $scope.currentPage++;
              }
          };
          //Last Page
          $scope.lastPage = function(){          
              $scope.currentPage=($scope.pagedItems.length-1);
          }
          //First Page
          $scope.firstPage = function () {
              $scope.currentPage=($scope.pagedItems.length-$scope.pagedItems.length);
          };
    
          // change sorting order
          $scope.sort_by = function(newSortingOrder) {
              if ($scope.sortingOrder == newSortingOrder)
                  $scope.reverse = !$scope.reverse;
    
              $scope.sortingOrder = newSortingOrder;
    
              // icon setup
              //$('th i').each(function(){
              //    // icon reset
              //    $(this).removeClass().addClass('icon-sort');
              //});
              if ($scope.reverse)
                  $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
              else
                  $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
          };
          $scope.sort = function(keyname){
              $scope.sortKey = keyname;   //set the sortKey to the param passed
              $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          }
/*******************************************************************
*                                                                  *
*                       USERS FUNCTIONS                            *
*                                                                  *
*******************************************************************/
        /**************************************************
        *                                                 *
        *           LIST CUSTOMER REGISTERED              *
        *                                                 *
        **************************************************/
          $scope.rsCustomerListData = [];
          $scope.rsCustomerListSelectData = [];
          $scope.rsCustomerListByTypeData = [];
          $scope.rsCustomerSelectData = [];
        /**************************************************
        *                                                 *
        *             LIST CUSTOMER BY TYPE               *
        *                                                 *
        **************************************************/
            $scope.getCustomersListByTypeFn = function(type) {
              console.log("getCustomerListByTypeFn => type:"+type);
                $scope.rsCustomerListByTypeData=[];
                //console.log($scope.rsCustomerSelectData);
                  if (type!=undefined && type!='' && type!=null){
                    var idClientTypeFk="";
                    if (type=="2"){
                      idClientTypeFk="3";
                    }else if (type=="4"){
                      idClientTypeFk="1";
                    }else if (type=="3" || type=="5" || type=="6"){
                      idClientTypeFk="2";
                    }
                    if (type!="1"){
                      $scope.globalGetCustomerListFn(null, "0", idClientTypeFk, "", "", null).then(function(data) {
                        //console.info(data.customers);
                        $scope.rsCustomerListByTypeData = data.customers;
                      }, function(err) {
                        $scope.rsCustomerListByTypeData=[];
                      });
                    }
                  }
            }
        /**************************************************
        *                                                 *
        *             LIST CUSTOMER BY TYPE               *
        *                                                 *
        **************************************************/
          $scope.rsCustomerListSelectData=[];
          $scope.getCustomersBuildingListFn = function(idProfileKf, ownerOption) {
            if ($scope.rsCustomerListSelectData.length==0){
              console.log("getCustomersBuildingListFn");
              console.log("=> idProfileKf:"+idProfileKf);
              console.log("=> ownerOption:"+ownerOption);
                if (idProfileKf=="3" || idProfileKf=="5" || ((idProfileKf=="4" || idProfileKf=="6") && ownerOption!=undefined && ownerOption!="3")){
                  $scope.globalGetCustomerListFn(null, "0", "2", "", "", null).then(function(data) {
                    //console.info(data.customers);
                    $scope.rsCustomerListSelectData = data.customers;
                  }, function(err) {
                    $scope.rsCustomerListSelectData=[];
                  });
                }
              }
          }
        /**************************************************
        *                                                 *
        *      SHOW ONLY CUSTOMER BY TYPE OF PROFILE      *
        *                                                 *
        **************************************************/
          $scope.filterCustomerByType = function(item){
            var objOpt = $scope.isNewUser==true && ($scope.users.new.idProfileKf!=undefined && $scope.users.new.idProfileKf!='')?$scope.users.new.idProfileKf.idProfile:$scope.users.update.idProfileKf;
            switch(objOpt){
              case "2":
                return item.idClientTypeFk == "3";
              break;
              case "4":
                if (($scope.isNewUser || $scope.isUpdateUser) && $scope.att.ownerOption==3){
                  return item.idClientTypeFk == "1" || item.idClientTypeFk == "3";
                }else{
                  return item.idClientTypeFk == "2"
                }
              break;
              case "3":
              case "5":
              case "6":
                return item.idClientTypeFk == "2";
              break;
            }
          };
          $scope.filterCustomerByType2 = function(item){
            var objOpt = $scope.isNewUser==true && ($scope.users.new.idProfileKf!=undefined && $scope.users.new.idProfileKf!='')?$scope.users.new.idProfileKf.idProfile:$scope.users.update.idProfileKf;
            switch(objOpt){
              case "2":
                return item.idClientTypeFk == "3";
              break;
              case "4":
                  return item.idClientTypeFk == "1" || item.idClientTypeFk == "3";
              break;
              case "3":
              case "5":
              case "6":
                return item.idClientTypeFk == "2";
              break;
            }
          };
        /**************************************************
        *                                                 *
        *       SHOW ONLY ROLES BY TYPE OF PROFILE        *
        *                                                 *
        **************************************************/
          $scope.filterRolesByType = function(obj){
            //console.log(item);
            var objOpt = $scope.isNewUser==true && ($scope.users.new.idProfileKf!=undefined && $scope.users.new.idProfileKf!='')?$scope.users.new.idProfileKf.idProfile:$scope.users.update.idProfileKf;
            switch(objOpt){
              case "1":
                return obj.idProfiles;
              break;
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
                return obj.idProfiles != "1";
              break;
            }
          };
        /**************************************************
        *                                                 *
        *                GET DEPTOS BY ID                 *
        *                                                 *
        **************************************************/
          $scope.rsBuildingDepartmentsData={};
          $scope.getBuildingsDeptosFn = function(idClient){
            //console.log(obj);
            addressServices.getBuildingsDeptos(idClient).then(function(data){
                $scope.rsBuildingDepartmentsData = data;
                //console.log($scope.rsBuildingDepartmentsData);
            });
          };
        /**************************************************
        *                                                 *
        *           CHECK IF A DEPTO HAS OWNER            *
        *                                                 *
        **************************************************/
          $scope.checkDeptoOwner = function(idDepartment){
            var idProfileFk = $scope.users.new.idProfileKf!=undefined?$scope.users.new.idProfileKf.idProfile:$scope.users.update.idProfileKf;
            if((idProfileFk=="3") || (idProfileFk=="4") || (idProfileFk=="6" && $scope.att.ownerOption==1)){
              DepartmentsServices.chekDepartamenteOwner(idDepartment).then(function(response){
                //console.log(response);
                if(response.status==200){
                  if (response.data==true){
                    $scope.ownerFound=true;
                    console.log("EL DEPTO: "+idDepartment+" Ya tiene un propietario Asignado");
                  }else if(response.data==false){
                    $scope.ownerFound=false;
                    console.log("EL DEPTO: "+idDepartment+" No tiene un propietario Asignado");
                  }
                }
              });
            }
          }
        /**************************************************
        *                                                 *
        *                 USER  SERVICES                  *
        *  [userLists]: clientUser, attendants, tenants   *
        *               sysUser, companyUser              *
        **************************************************/ 
          $scope.rsList = {};
          $scope.getUserLists = function(opt, group){
              $scope.rsList = {};
              userServices.userLists().then(function(response) {
              if (opt!=undefined && group!=undefined){
                  //console.log("[getUserList] ==> "+opt+" : "+group);
                $scope.rsList = response;
                if(opt==1){
                  switch (group){
                    case "1":
                      $scope.loadPagination($scope.rsList.sysUser, "idUser", "7");
                    break;
                    case "2":
                      $scope.loadPagination($scope.rsList.companyUser, "idUser",  "7");
                    break;
                    case "3":
                      $scope.loadPagination($scope.rsList.owners, "idUser",  "7");
                    break;
                    case "4":
                      $scope.loadPagination($scope.rsList.companyUser, "idUser",  "7");
                    break;
                    case "5":
                      $scope.loadPagination($scope.rsList.tenants, "idUser",  "7");
                    break;
                    case "6":
                      $scope.loadPagination($scope.rsList.attendants, "idUser",  "7");
                    break;
                    case "owners_tenants":
                      $scope.loadPagination($scope.rsList.owners_tenants, "idUser",  "7");
                    break;
                    case "users":
                      $scope.loadPagination($scope.rsList.users, "idUser",  "7");
                    break;
                    case "clients":
                      $scope.loadPagination($scope.rsList.clientUser, "idUser",  "7");
                    break;
                  }
                }
                //console.log($scope.rsList.tenants);
              }
              });
          };

        /**************************************************
        *                                                 *
        *                GET USER DATA                    *
        *                                                 *
        **************************************************/

          $scope.selectUserDataFn = function (obj) {
            $("#UpdateUser").modal({backdrop: 'static', keyboard: false});
            $scope.users.update = {'idUser':null,'idProfileKf':{}, 'idSysProfileFk':null, 'fname':'','lname':'', 'dni':'','email':'', 'phonelocalNumberUser':'', 'phoneMovilNumberUser':'', 'idDepartmentKf':null, 'idTypeAttKf':null, 'typeOtherAtt':'', 'idTypeTenantKf':''}
            $scope.users.tmp    = {'dni':'','email':''}
            $scope.ListDpto     = {};
            $scope.filterAddressKf.selected   = undefined;
            $scope.filterCompanyKf.selected   = undefined;
            $scope.sysDNIRegistered           = 0;
            $scope.sysEmailRegistered         = 0;
            $scope.userDepartamentList        = [];
            $scope.users.tmp                  = {};
            $scope.users.tmp                  = obj;
            $scope.isNewProfileRole           = false;
            $scope.isUpdateProfileRole        = false;
            $scope.isNewUser                  = false;
            $scope.isUpdateUser               = true;
            $scope.users.update.idUser        = obj.idUser;
            var switchOption                  = obj.idProfileKf;
            var fullNameUser                  = obj.fullNameUser.split(" ");
            console.log(obj);
            if (fullNameUser.length==2){
              $scope.users.update.fname = fullNameUser[0];
              $scope.users.update.lname = fullNameUser[1];
            }else if (fullNameUser.length==3){
              $scope.users.update.fname = fullNameUser[0] +" "+fullNameUser[1];
              $scope.users.update.lname = fullNameUser[2];
            }else{
              $scope.users.update.fname = fullNameUser[0] +" "+fullNameUser[1];
              $scope.users.update.lname = fullNameUser[2] +" "+fullNameUser[3];
            }
            $scope.users.update.idProfileKf           = obj.idProfileKf;
            $scope.users.update.idSysProfileFk        = obj.idSysProfileFk;
            $scope.users.update.dni                   = obj.dni;
            $scope.users.tmp.dni                      = obj.dni;
            $scope.users.update.email                 = obj.emailUser;
            $scope.users.tmp.email                    = obj.emailUser;
            $scope.users.update.phonelocalNumberUser  = obj.phoneLocalNumberUser;
            $scope.users.update.phoneMovilNumberUser  = obj.phoneNumberUser;
            $scope.users.update.idStatusKf            = obj.idStatusKf;
            $scope.users.update.statusTenantName      = obj.statusTenantName;
            $scope.users.update.deptos                = obj.deptos!=undefined?obj.deptos:[];
            $scope.userDepartamentList                = obj.deptos!=undefined?obj.deptos:[];
            if ($scope.userDepartamentList!=undefined && $scope.userDepartamentList.length>0) {
              for (var depto in $scope.userDepartamentList){
                $scope.userDepartamentList[depto].isNew = false;
              }
            }
            
            $scope.users.update.idTypeTenantKf        = obj.idTypeTenantKf;
            switch (switchOption) {
              case "1": //SYS USER
              break;
              case "2": //COMPANY USER
                $scope.filterCompanyKf.selected      = {'idClient': obj.company[0].idClient, 'name': obj.company[0].name};
                $scope.customerSearch.name = obj.company[0].name;
                //$scope.getCustomersListByTypeFn($scope.users.update.idProfileKf);
              break;
              case "3": //OWNER USER
                $scope.register.user.idDeparment_Tmp  = obj.idClientDepartament;
              break;
              case "4": //BUILDING ADMIN USER
                $scope.filterCompanyKf.selected      = {'idClient': obj.company[0].idClient, 'name': obj.company[0].name};
                $scope.customerSearch.name = obj.company[0].name;
                if (obj.idTypeTenantKf==1){
                  //console.log(obj);
                  $scope.att.ownerOption              = "1"
                }else if (obj.idTypeTenantKf==2){
                  $scope.att.ownerOption              = "2";
                }else if (obj.idTypeTenantKf==null){
                  $scope.att.ownerOption              = "3";
                }
                //$scope.getCustomersListByTypeFn($scope.users.update.idProfileKf);
              break;
              case "5": //TENANT USER
                $scope.rsCustomerListSelectData       = $scope.rsCustomerSelectData;
                $scope.filterAddressKf.selected        = obj.idAddresKf!=null?{'idClient': obj.building[0].idClient, 'address': obj.building[0].address}:null;
                $scope.customerSearch.name = obj.building[0].address;
                if(obj.idAddresKf!=null){
                  $scope.getDeptoListByAddress(obj.building[0].idClient);
                  $timeout(function() {
                    $scope.users.update.idDepartmentKf = obj.idDepartmentKf;
                  }, 100);
                };
              break;
              case "6": //ATTENDANT USER
                $scope.rsCustomerListSelectData     = $scope.rsCustomerSelectData;
                if (obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==1){
                  //console.log(obj);
                  $scope.att.ownerOption              = "1"
                }else if (obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==2){
                  $scope.att.ownerOption              = "2";
                }else if (obj.idTyepeAttendantKf!=1 && obj.idTypeTenantKf==null){
                  $scope.att.ownerOption              = "3";
                }
                $scope.filterAddressKf.selected        = obj.idAddresKf!=null?{'idClient': obj.building[0].idClient, 'address': obj.building[0].address}:null;
                $scope.filterCompanyKf.selected        = obj.idAddresKf!=null?{'idClient': obj.building[0].idClient, 'address': obj.building[0].address}:null;
                $scope.customerSearch.name = obj.building[0].address;
                //$scope.getLisOfCustomersByIdFn(obj.company[0].idClient, true)
                $scope.users.update.typeOtherAtt      = obj.descOther;
                $scope.users.update.idTypeAttKf       = obj.idTyepeAttendantKf;
                //$scope.getCustomersListByTypeFn($scope.users.update.idProfileKf);
              break;
            }
            //$scope.getCustomersBuildingListFn($scope.users.update.idProfileKf, $scope.att.ownerOption);
            console.log($scope.users.update);
           
          };
        /**************************************************
        *                                                 *
        *                 REFRESH LIST                    *
        *                                                 *
        **************************************************/
          $scope.refreshList = function() {
            blockUI.start('Actualizando listado de usuarios.');
            var nameProfile = $scope.filters.userProfile==undefined?null:$scope.filters.userProfile.nameProfile;
            var statusTenantName = $scope.filters.userStatus==undefined?null:$scope.filters.userStatus.statusTenantName;
            var customerName = $scope.filters.companies.selected==undefined?null:$scope.filters.companies.selected.name;
            var buildings = $scope.filters.buildings.selected==undefined?null:$scope.filters.buildings.selected.address;
            var nameTypeAttendant = $scope.filters.attProfile.nameTypeAttendant==undefined?null:$scope.filters.attProfile.nameTypeAttendant;
            var searchboxfilter = $scope.searchboxfilter==undefined?null:$scope.searchboxfilter;
            $timeout(function() {
              $scope.getUserLists(1, 'users');
              blockUI.stop();
            }, 500);
            $timeout(function() {
              $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true);
            }, 650);
          }
        /**************************************************
        *                                                 *
        *       ADD, UPDATE OR REMOVE DEPARTMENT LIST     *
        *                OWNER / TENANTS                  *
        **************************************************/
          $scope.userDepartmentListFn = function(objDepto, objUser, opt) {
            console.log($scope.userDepartamentList);
            switch(opt){
              case "add":
                if($scope.userDepartamentList.length==0){
                  $scope.userDepartamentList.push(objDepto);
                  for (var depto in $scope.userDepartamentList){
                    if (objDepto.idClientDepartament == $scope.userDepartamentList[depto].idClientDepartament){
                      $scope.userDepartamentList[depto].isNew = true;
                        inform.add("El Departamento: "+objDepto.Depto+", ha sido agregado a la lista.",{
                          ttl:5000, type: 'success'
                        });
                        if ($scope.isUpdateUser){
                          inform.add("Importante hacer click en Actualizar, para completar la asociación del departamento "+objDepto.Depto+" al usuario seleccionado.",{
                            ttl:5000, type: 'info'
                          });
                        }

                    }
                  }
                  //$scope.filterAddressKf.selected=undefined;
                  $scope.select.departmentList=undefined;
                  $("#SetUserDepartment").modal("hide");
                }else{
                  for (var depto in $scope.userDepartamentList){
                      if (objDepto.idClientDepartament == $scope.userDepartamentList[depto].idClientDepartament){
                        inform.add("El Departamento: "+objDepto.Depto+", ya se encuentra en la lista.",{
                          ttl:5000, type: 'warning'
                        });
                        $scope.isDeptoExist=true;
                        break;
                      }else{
                        $scope.isDeptoExist=false;
                        //console.log($scope.isDeptoExist);
                      }
                  }
                  if(!$scope.isDeptoExist){
                    console.log("Profile                  : "+objUser.idProfileKf.idProfile);
                    console.log("OwnerOption              : "+$scope.att.ownerOption);
                    console.log("Cantidad de Departamentos: "+$scope.userDepartamentList.length);
                      if ((((objUser.idProfileKf!=undefined && objUser.idProfileKf.idProfile == 5) || objUser.idProfileKf == 5) || ((((objUser.idProfileKf!=undefined && objUser.idProfileKf.idProfile == 4) || objUser.idProfileKf == 4) || (objUser.idProfileKf.idProfile == 6 || objUser.idProfileKf == 6)) && $scope.att.ownerOption==2)) && $scope.userDepartamentList.length==1){
                        inform.add("El usuario (Habitante), ya posee un departamento asociado o que sera asociado.",{
                          ttl:5000, type: 'warning'
                        });
                        inform.add("El usuario (Habitante), solo puede tener un departamento asociado.",{
                          ttl:5000, type: 'info'
                        });
                        //$scope.filterAddressKf.selected=undefined;
                        $scope.select.departmentList=undefined;
                        $("#SetUserDepartment").modal("hide");
                      }else{
                        //console.log("ADD_NO_EXIST");
                        $scope.userDepartamentList.push(objDepto);
                        for (var depto in $scope.userDepartamentList){
                          if (objDepto.idClientDepartament == $scope.userDepartamentList[depto].idClientDepartament){
                            $scope.userDepartamentList[depto].isNew = true;
                            inform.add("El Departamento: "+objDepto.Depto+", ha sido agregado a la lista.",{
                              ttl:5000, type: 'success'
                            });
                            if ($scope.isUpdateUser){
                              inform.add("Importante hacer click en Actualizar, para completar la asociación del departamento "+objDepto.Depto+" al usuario seleccionado.",{
                                ttl:5000, type: 'info'
                              });
                            }
                          }
                        }
                        $("#SetUserDepartment").modal("hide");
                      }
                  }
                }

                console.log($scope.userDepartamentList);
              break;
              case "update":
              break;
            }
          }
          $scope.removeDepartmentFromListFn = function (objDepto, objUser){
            for (var key in  $scope.userDepartamentList){
                if ($scope.userDepartamentList[key].idClientDepartament == objDepto.idClientDepartament){
                    $scope.userDepartamentList.splice(key,1);
                }
            }
            if (((objUser.idProfileKf!=undefined && objUser.idProfileKf.idProfile == 5 || objUser.idProfileKf == 5) || (((objUser.idProfileKf.idProfile == 4 || objUser.idProfileKf == 4) || (objUser.idProfileKf.idProfile == 6 || objUser.idProfileKf == 6)) && $scope.att.ownerOption==2)) && $scope.userDepartamentList.length<=0){
              inform.add("El usuario (Habitante), debe tener un departamento asociado.",{
                ttl:5000, type: 'info'
              });
            }
          }
          $scope.checkDepartmentListFn = function (objUser){
            console.log(objUser);
            if (objUser.idProfileKf!=undefined){
              if (((((objUser.idProfileKf.idProfile == 5) || objUser.idProfileKf == 5) || 
                  (((objUser.idProfileKf.idProfile == 4 || objUser.idProfileKf == 4) || (objUser.idProfileKf.idProfile == 6 || objUser.idProfileKf == 6)) && $scope.att.ownerOption==2)) && $scope.userDepartamentList.length>1) || 
                  (((objUser.idProfileKf.idProfile == 4 || objUser.idProfileKf == 4) || (objUser.idProfileKf.idProfile == 6 || objUser.idProfileKf == 6)) && $scope.att.ownerOption==3)){
                $scope.userDepartamentList = [];
              }
            }
          }
        /**************************************************
        *                                                 *
        *             REQUEST PWD FUNCTION                *
        *                                                 *
        **************************************************/
        $scope.notificationUser = {'emailUser':null, 'newPasswd': null}
          $scope.recoverPwdUser = function (newpwd){
            console.log(newpwd);
              userServices.recoverPwd(newpwd).then(function(response){
                console.log(response.data);
                if(response.status==200){
                  $scope.notificationUser.newPasswdCpy=response.data;
                  $timeout(function() {
                    console.log("Password Successfully restored.");
                    inform.add('La clave ha sido restablecida satisfactoriamente, por favor verificar casilla de correo.',{
                      ttl:4000, type: 'warning'
                    });
                    $('.circle-loader').toggleClass('load-complete');
                    $('.checkmark').toggle();
                    $scope.notificationUser.emailUser=newpwd.user.emailUser;
                    $scope.notificationUser.newPasswd=response.data;
                  }, 2000);
                  $timeout(function() {
                    blockUI.stop();
                    console.log($scope.notificationUser);
                  }, 2500);

                }else if(response.status==404){
                  inform.add('[Error]: '+response.status+', Ocurrio error verifique los datos e intenta de nuevo o contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                }else if(response.status==500){
                  inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con servidor, contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                }
      
              });
          }
        /**************************************************
        *                                                 *
        *                 SWITCH USER DATA                *
        *                                                 *
        **************************************************/
          $scope.switchUsersFn = function(opt, obj){
            switch(opt){
              case "add":
                $scope.register.user={'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null};
                $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                var switchOption = obj.idProfileKf.idProfile;
                $scope.register.user.fullNameUser            = obj.fname+' '+obj.lname;
                $scope.register.user.idProfileKf             = obj.idProfileKf.idProfile;
                $scope.register.user.idSysProfileFk          = obj.idSysProfileFk;
                $scope.register.user.dni                     = obj.dni;
                $scope.register.user.emailUser               = obj.email;
                $scope.register.user.phoneLocalNumberUser    = obj.phonelocalNumberUser;
                $scope.register.user.phoneNumberUser         = obj.phoneMovilNumberUser;
                $scope.register.user.isEdit                  = 1;
                $scope.register.user.isCreateByAdmin         = 1;
                $scope.register.user.loggedUser              = $scope.sysLoggedUser;
                switch (switchOption) {
                  case "1": //SYS USER
                  break;
                  case "2": //COMPANY USER
                    $scope.register.user.idCompanyKf             = $scope.filterCompanyKf.selected.idClient;
                  break;
                  case "3": //OWNER USER
                    $scope.register.user.idDeparment_Tmp         = obj.idDepartmentKf;
                    $scope.register.user.idTypeTenantKf          = 1;
                  break;
                  case "4": //BUILDING ADMIN USER
                    $scope.register.user.idCompanyKf             = $scope.filterCompanyKf.selected.idClient;
                    if ($scope.att.ownerOption==1){
                      $scope.register.user.idTypeTenantKf        =  1;
                    }else if ($scope.att.ownerOption==2){
                      $scope.register.user.idTypeTenantKf        =  2;
                      if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                        $scope.register.user.idDepartmentKf        = null;
                        $scope.register.user.departmentIsNew       = null;
                      }else{
                        $scope.register.user.idDepartmentKf        = $scope.userDepartamentList[0].idClientDepartament;
                      }
                    }else{
                      $scope.register.user.idTypeTenantKf        = null;
                      $scope.register.user.idDepartmentKf        = null;
                    }
                  break;
                  case "5": //TENANT USER
                    $scope.register.user.idTypeTenantKf          = 2;
                    if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                      $scope.register.user.idAddresKf            = null;
                      $scope.register.user.idDepartmentKf        = null;
                    }else{
                      $scope.register.user.idAddresKf            = $scope.userDepartamentList[0].idClient;
                      $scope.register.user.idDepartmentKf        = $scope.userDepartamentList[0].idClientDepartament;
                    }
                  break;
                  case "6": //ATTENDANT USER
                    if (obj.idTypeAttKf!=1 && $scope.att.ownerOption==1){
                      $scope.register.user.idTypeTenantKf        =  1;
                    }else if ($scope.register.user.idTypeAttKf!=1 && $scope.att.ownerOption==2){
                      $scope.register.user.idTypeTenantKf        =  2;
                      if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                        $scope.register.user.idDepartmentKf      = null;
                        $scope.register.user.departmentIsNew     = null;
                      }else{
                        $scope.register.user.idDepartmentKf      = $scope.userDepartamentList[0].idClientDepartament;
                      }
                    }else{
                      $scope.register.user.idTypeTenantKf        = null;
                      $scope.register.user.idDepartmentKf        = null;
                    }
                    $scope.register.user.requireAuthentication   = obj.idTypeAttKf==1?0:1;
                    $scope.register.user.descOther               = obj.idTypeAttKf==1?obj.typeOtherAtt:null;
                    $scope.register.user.idTyepeAttendantKf      = obj.idTypeAttKf;
                    $scope.register.user.idAddresKf              = $scope.filterAddressKf.selected.idClient;
                  break;
                }
                console.log("==============================");
                console.log("DATOS DEL USUARIO A REGISTRAR");
                console.log("==============================");
                console.log($scope.register.user);
                console.log("=======================");
                console.log("DEPARTAMENTOS A ASOCIAR");
                console.log("=======================");
                console.log($scope.userDepartamentList);
                //for (var depto in $scope.userDepartamentList){
                //  console.log($scope.userDepartamentList[depto]);
                //}
                $scope.sysRegisterFn();
              break;
              case "update":
                blockUI.start('Actualizando usuario.');
                $timeout(function() {
                  $scope.update.user={'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null, 'departmentIsNew':false};
                  $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
                  //console.log(obj);
                  var switchOption = obj.idProfileKf;
                  $scope.update.user                             = $scope.users.tmp;
                  $scope.update.user.idUser                      = obj.idUser;
                  $scope.update.user.fullNameUser                = obj.fname+' '+obj.lname;
                  $scope.update.user.idProfileKf                 = obj.idProfileKf;
                  $scope.update.user.idSysProfileFk              = obj.idSysProfileFk;
                  $scope.update.user.dni                         = obj.dni;
                  $scope.update.user.emailUser                   = obj.email;
                  $scope.update.user.phoneLocalNumberUser        = obj.phonelocalNumberUser;
                  $scope.update.user.phoneNumberUser             = obj.phoneMovilNumberUser;
                  $scope.update.user.isEdit                      = 1;
                  $scope.update.user.isCreateByAdmin             = 1;
                  $scope.update.user.loggedUser                  = $scope.sysLoggedUser;
                  switch (switchOption) {
                    case "1": //SYS USER
                    break;
                    case "2": //COMPANY USER
                      $scope.update.user.idCompanyKf             = $scope.filterCompanyKf.selected.idClient;
                    break;
                    case "3": //OWNER USER
                      $scope.update.user.idDeparment_Tmp         = obj.idDepartmentKf;
                      $scope.update.user.idTypeTenantKf          = 1;
                    break;
                    case "4": //BUILDING ADMIN USER
                      $scope.update.user.idCompanyKf             = $scope.filterCompanyKf.selected.idClient;
                      if ($scope.att.ownerOption==1){
                        $scope.update.user.idTypeTenantKf        =  1;
                      }else if ($scope.att.ownerOption==2){
                        $scope.update.user.idTypeTenantKf        =  2;
                        if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                          $scope.update.user.idDepartmentKf        = null;
                          $scope.update.user.departmentIsNew       = null;
                        }else{
                          $scope.update.user.idDepartmentKf        = $scope.userDepartamentList[0].idClientDepartament;
                          $scope.update.user.departmentIsNew       = $scope.userDepartamentList[0].isNew;
                        }
                      }else{
                        $scope.update.user.idTypeTenantKf        = null;
                        $scope.update.user.idDepartmentKf        = null;
                      }
                    break;
                    case "5": //TENANT USER
                      $scope.update.user.idTypeTenantKf          = 2;                      
                      if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                        $scope.update.user.idAddresKf            = null;
                        $scope.update.user.idDepartmentKf        = null;
                        $scope.update.user.departmentIsNew       = null;
                      }else{
                        $scope.update.user.idAddresKf            = $scope.userDepartamentList[0].idClient;
                        $scope.update.user.idDepartmentKf        = $scope.userDepartamentList[0].idClientDepartament;
                        $scope.update.user.departmentIsNew       = $scope.userDepartamentList[0].isNew;
                      }
                    break;
                    case "6": //ATTENDANT USER
                      if (obj.idTypeAttKf!=1 && $scope.att.ownerOption==1){
                        $scope.update.user.idTypeTenantKf        =  1;
                      }else if (obj.idTypeAttKf!=1 && $scope.att.ownerOption==2){
                        $scope.update.user.idTypeTenantKf        =  2;
                        if ($scope.userDepartamentList==undefined || $scope.userDepartamentList.length==0){
                          $scope.update.user.idDepartmentKf        = null;
                          $scope.update.user.departmentIsNew       = null;
                        }else{
                          $scope.update.user.idDepartmentKf        = $scope.userDepartamentList[0].idClientDepartament;
                          $scope.update.user.departmentIsNew       = $scope.userDepartamentList[0].isNew;
                        }
                      }else{
                        $scope.update.user.idTypeTenantKf        =  null;
                      }
                      $scope.update.user.idAddresKf              = $scope.filterAddressKf.selected.idClient;
                      $scope.update.user.requireAuthentication   = obj.idTypeAttKf==1?0:1;
                      $scope.update.user.descOther               = obj.idTypeAttKf==1?obj.typeOtherAtt:null;
                      $scope.update.user.idTyepeAttendantKf      = obj.idTypeAttKf;
                    break;
                  }
                  console.log("==============================");
                  console.log("DATOS DEL USUARIO A ACTUALIZAR");
                  console.log("==============================");
                  console.log($scope.update.user);
                  $scope.sysUpdateFn();
                }, 500);
                  //console.log($scope.update.user);
              break;
              case "edit":
                //Edit User function
                $scope.selectUserDataFn(obj);
              break;
              case "enabled":
                //Enabled User function
                $scope.enabledUser(obj);
              break; 
              case "disabled":
                //disabled User function
                $scope.disabledUser(obj);
              break;
              case "remove":
                //remove User function
                $scope.deleteUser(obj);
              break;
              case "resetPwd":
                $scope.newpwd = {'user':{'emailUser':null, 'dni':null}};
                $scope.notificationUser = {};
                $scope.newpwd.user.emailUser=obj.emailUser;
                $scope.newpwd.user.dni=obj.dni;
                $timeout(function() {
                  $scope.recoverPwdUser($scope.newpwd);
                }, 2000);
                $timeout(function() {
                  $('.circle-loader').removeClass('load-complete');
                  $('.checkmark').hide();
                  $('#userNotificationModal').modal({backdrop: 'static', keyboard: false});
                  $('#userNotificationModal').on('shown.bs.modal', function () {
                    $('[data-toggle="tooltip"]').tooltip();
                  });
                }, 2300);
              break;
              case "selectDepto":
                $scope.tmp.data=obj;
                console.log($scope.tmp.data);
                $scope.select.address.selected = undefined;
                $scope.select.departmentList   = null;
                $scope.customerSearch.address  = undefined;
                $scope.ListDpto = null;
                $("#SetUserDepartment").modal({backdrop: 'static', keyboard: true});
              break;
            }
          };

          $scope.onSuccess = function(e) {
            console.log("Copied text: " + e);
            // Optional: Show a message or feedback to the user
          };
          $scope.onError = function(e) {
            console.error("Failed to copy text.");
            // Optional: Show an error message to the user
        };
          function wait(ms)
          {
              var d = new Date();
              var d2 = null;
              do { d2 = new Date(); }
              while(d2-d < ms);
          }
        /**************************************************
        *                                                 *
        *                   ADD USER                      *
        *                                                 *
        **************************************************/
            $scope.department={'user':{}};
            $scope.sysRegisterFn = function(){
              //console.log($scope.register);
                userServices.addUser($scope.register).then(function(response_userRegister){
                  if(response_userRegister.status==200){
                      if($scope.register.user.idProfileKf!=1 && $scope.register.user.idProfileKf!=2){
                        userServices.findUserByEmail($scope.register.user.dni).then(function(response_userFound) {
                          if(response_userFound.status==200){
                            if(($scope.register.user.idProfileKf==3 || $scope.register.user.idProfileKf==4 || $scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==1){
                              //OWNER
                              if ($scope.userDepartamentList!=undefined && $scope.userDepartamentList.length>0){
                                  var assignPromises = [];
                                  angular.forEach($scope.userDepartamentList,function(depto){
                                    var deferred = $q.defer();
                                    assignPromises.push(deferred.promise);
                                    blockUI.start('Asignando el departamento '+depto.floor+'-'+depto.departament+' seleccionado.');
                                    //ASSIGN DEPARTMENT SERVICE
                                    $timeout(function() {
                                        deferred.resolve();
                                        $scope.depto.department = {};
                                        $scope.depto.department.idUserKf      = response_userFound.data[0].idUser;
                                        $scope.depto.department.idDepartment  = depto.idClientDepartament;
                                        $scope.depto.department.isApprovalRequired = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?false:true;
                                        console.log($scope.depto.department);
                                        DepartmentsServices.assignDepto($scope.depto).then(function(response_assign) {
                                          if(response_assign.status==200){
                                            //inform.add('Departamento Asignado y en proceso de aprobacion automatica.',{
                                            //  ttl:5000, type: 'success'
                                            //});
                                            console.log("[Service][assignDepto]---> Department N°: "+depto.idDepartment+" (Successfully Assigned)");
                                          }else if (response_assign.status==404){
                                            inform.add('Departamento del propietario no ha sido asignado, contacte al area de soporte.',{
                                              ttl:5000, type: 'warning'
                                              });
                                          }else if (response_assign.status==500){
                                            inform.add('[Error]: '+response_assign.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                              ttl:3000, type: 'danger'
                                            });
                                          }
                                        });
                                      }, 2000);
                                      $timeout(function() {
                                        blockUI.stop();
                                      }, 3000);
                                  });
                                  $q.all(assignPromises).then(function () {
                                      inform.add('Departamentos Asignados y en proceso de aprobacion automatica.',{
                                        ttl:5000, type: 'success'
                                      });
                                  });	
                                  var approvePromises = [];
                                  angular.forEach($scope.userDepartamentList,function(depto){
                                      var deferred = $q.defer();
                                      approvePromises.push(deferred.promise);
                                      blockUI.start('Aprobando el departamento '+depto.floor+'-'+depto.departament+' seleccionado.');
                                      console.log(depto.idClientDepartament);
                                      //APPROVE DEPARTMENT SERVICE
                                      $timeout(function() {
                                        deferred.resolve();
                                        DepartmentsServices.approveOwnerDepto(depto.idClientDepartament).then(function(response_approve) {
                                          if(response_approve.status==200){
                                            //inform.add('Departamento del propietario autorizado satisfactoriamente.',{
                                            //  ttl:5000, type: 'success'
                                            //});
                                            console.log("[Service][approveOwnerDepto]---> idDepto: "+depto.idClientDepartament+" (Successfully Approved)");
                                          }else if (response_approve.status==404){
                                            inform.add('Departamento del propietario no ha sido aprobado, contacte al area de soporte.',{
                                              ttl:5000, type: 'warning'
                                              });
                                          }else if (response_approve.status==500){
                                            inform.add('[Error]: '+response_approve.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                              ttl:3000, type: 'danger'
                                            });
                                          }
                                        });
                                      }, 2000);
                                      $timeout(function() {
                                        blockUI.stop();
                                      }, 3000);
                                  });
                                  $q.all(approvePromises).then(function () {
                                    console.log("REGISTERED SUCCESSFULLY");
                                    inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                                      ttl:5000, type: 'success'
                                    });
                                    inform.add('Departamentos Aprobados Satisfactoriamente.',{
                                      ttl:5000, type: 'success'
                                    });
                                    $timeout(function() {
                                      $scope.refreshList();
                                      blockUI.stop();
                                    }, 1500);
                                  });
                              }else{
                                $timeout(function() {
                                  console.log("REGISTERED SUCCESSFULLY");
                                  inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                                    ttl:5000, type: 'success'
                                  });
                                  $scope.refreshList();
                                  blockUI.stop();
                                }, 3000);
                              }
                              $('#RegisterUser').modal('hide');
                            }else if(($scope.register.user.idProfileKf==4 || $scope.register.user.idProfileKf==5 || $scope.register.user.idProfileKf==6) && $scope.register.user.idTypeTenantKf==2 && ($scope.register.user.idDepartmentKf || $scope.register.user.idDepartmentKf==null)){
                              if ($scope.register.user.idDepartmentKf!=null){
                                blockUI.start('Aprobando departamento del usuario.');
                                $timeout(function() {
                                  $scope.department.user  = response_userFound.data[0];
                                  $scope.department.user.registerBy = $scope.register.user.loggedUser;
                              }, 1500);
                                $timeout(function() {
                                    //TENANT
                                    $scope.approveTenantDeptoFn($scope.department);
                                  $('#RegisterUser').modal('hide');
                                  console.log("REGISTERED SUCCESSFULLY");
                                  inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                                    ttl:5000, type: 'success'
                                  });
                                  $scope.refreshList();
                                  blockUI.stop();
                                }, 2500);
                              }else{
                                $timeout(function() {
                                  //TENANT
                                  $('#RegisterUser').modal('hide');
                                  console.log("REGISTERED SUCCESSFULLY");
                                  inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                                    ttl:5000, type: 'success'
                                  });
                                  $scope.refreshList();
                                  blockUI.stop();
                                }, 2500); 
                              }
                            }
                          }else if (response_userFound.status==404){
                            inform.add('No encontrado el Usuario: '+$scope.register.user.fullNameUser+' por favor contacte al area de soporte.',{
                              ttl:5000, type: 'danger'
                            });
                          }else if (response_userFound.status==500){
                            inform.add('[Error]: '+response_userFound.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                              ttl:3000, type: 'danger'
                            });
                          }
                        });
                      }else{
                        $timeout(function() {
                          //USERS DEFAULT
                          $('#UpdateUser').modal('hide');
                          console.log("REGISTERED SUCCESSFULLY");
                          inform.add('Usuario '+$scope.register.user.fullNameUser+' registrado satisfactoriamente.',{
                            ttl:5000, type: 'success'
                          });
                          $scope.refreshList();
                          blockUI.stop();
                        }, 2500); 
                      }
                  }else if (response_userRegister.status==404){
                    inform.add('[Error]: '+response_userRegister.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                      ttl:5000, type: 'warning'
                      });
                  }else if(response_userRegister.status==500){
                    inform.add('[Error]: '+response_userRegister.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                      ttl:5000, type: 'danger'
                      });
                  }
                });
                $('#RegisterUser').modal('hide');
            }
        /**************************************************
        *                                                 *
        *                   UPDATE USER                   *
        *                                                 *
        **************************************************/
            $scope.sysUpdateFn = function(){
              //console.log($scope.update.user);
              var nameProfile       = $scope.filters.userProfile==undefined?null:$scope.filters.userProfile.nameProfile;
              var statusTenantName  = $scope.filters.userStatus==undefined?null:$scope.filters.userStatus.statusTenantName;
              var customerName      = $scope.filters.companies.selected==undefined?null:$scope.filters.companies.selected.name;
              var buildings         = $scope.filters.buildings.selected==undefined?null:$scope.filters.buildings.selected.address;
              var nameTypeAttendant = $scope.filters.attProfile.nameTypeAttendant==undefined?null:$scope.filters.attProfile.nameTypeAttendant;
              var searchboxfilter   = $scope.searchboxfilter==undefined?null:$scope.searchboxfilter;
              userServices.updateUser($scope.update).then(function(response){
                if(response.status==200){
                  if($scope.update.user.idProfileKf!=1 && $scope.update.user.idProfileKf!=2){
                    if(($scope.update.user.idProfileKf==3 || $scope.update.user.idProfileKf==4 || $scope.update.user.idProfileKf==6) && $scope.update.user.idTypeTenantKf==1){
                      //OWNER
                      var assignPromises = [];
                      angular.forEach($scope.userDepartamentList,function(depto){
                        var deferred = $q.defer();
                        assignPromises.push(deferred.promise);
                        if (depto.isNew){
                            blockUI.start('Asignando el departamento '+depto.floor+'-'+depto.departament+' seleccionado.');
                            //ASSIGN DEPARTMENT SERVICE
                            $timeout(function() {
                                deferred.resolve();
                                $scope.depto.department = {};
                                $scope.depto.department.idUserKf           = $scope.update.user.idUser;
                                $scope.depto.department.idDepartment       = depto.idClientDepartament;
                                $scope.depto.department.isApprovalRequired = $scope.sysLoggedUser.idProfileKf==1 || $scope.sysLoggedUser.idProfileKf==4?false:true;
                                console.log($scope.depto.department);
                                DepartmentsServices.assignDepto($scope.depto).then(function(response_assign) {
                                  if(response_assign.status==200){
                                    //inform.add('Departamento Asignado y en proceso de aprobacion automatica.',{
                                    //  ttl:5000, type: 'success'
                                    //});
                                    console.log("[Service][assignDepto]---> Department N°: "+depto.idDepartment+" (Successfully Assigned)");
                                  }else if (response_assign.status==404){
                                    inform.add('Departamento del propietario no ha sido asignado, contacte al area de soporte.',{
                                      ttl:5000, type: 'warning'
                                      });
                                  }else if (response_assign.status==500){
                                    inform.add('[Error]: '+response_assign.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                      ttl:3000, type: 'danger'
                                    });
                                  }
                                });
                              }, 2000);
                              $timeout(function() {
                                blockUI.stop();
                              }, 2500);
                        }
                      });
                      $q.all(assignPromises).then(function () {
                          inform.add('Departamentos Asignados y en proceso de aprobacion automatica.',{
                            ttl:5000, type: 'success'
                          });
                      });	
                      var approvePromises = [];
                      angular.forEach($scope.userDepartamentList,function(depto){
                          var deferred = $q.defer();
                          approvePromises.push(deferred.promise);
                          if (depto.isNew){
                              blockUI.start('Aprobando el departamento '+depto.floor+'-'+depto.departament+' seleccionado.');
                              console.log(depto.idClientDepartament);
                              //APPROVE DEPARTMENT SERVICE
                              $timeout(function() {
                                deferred.resolve();
                                DepartmentsServices.approveOwnerDepto(depto.idClientDepartament).then(function(response_approve) {
                                  if(response_approve.status==200){
                                    //inform.add('Departamento del propietario autorizado satisfactoriamente.',{
                                    //  ttl:5000, type: 'success'
                                    //});
                                    console.log("[Service][approveOwnerDepto]---> idDepto: "+depto.idClientDepartament+" (Successfully Approved)");
                                  }else if (response_approve.status==404){
                                    inform.add('Departamento del propietario no ha sido aprobado, contacte al area de soporte.',{
                                      ttl:5000, type: 'warning'
                                      });
                                  }else if (response_approve.status==500){
                                    inform.add('[Error]: '+response_approve.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                                      ttl:3000, type: 'danger'
                                    });
                                  }
                                });
                              }, 3000);
                              $timeout(function() {
                                blockUI.stop();
                              }, 3500);
                          }
                      });
                      $q.all(approvePromises).then(function () {
                        console.log("Usuario: "+$scope.update.user.fullNameUser+" Successfully updated");
                        inform.add('El Usuario: '+$scope.update.user.fullNameUser+' ha sido actualizado con exito. ',{
                              ttl:3000, type: 'success'
                        });
                        $timeout(function() {
                        }, 1500);
                        inform.add('Departamentos Aprobados Satisfactoriamente.',{
                          ttl:5000, type: 'success'
                        });
                      });	
                      $timeout(function() {
                        $scope.refreshList();
                        blockUI.stop();
                      }, 3000);
                      $('#UpdateUser').modal('hide');
                    }else if(($scope.update.user.idProfileKf==4 || $scope.update.user.idProfileKf==5 || $scope.update.user.idProfileKf==6) && $scope.update.user.idTypeTenantKf==2 && ($scope.update.user.idDepartmentKf || $scope.update.user.idDepartmentKf==null)){
                      if($scope.update.user.departmentIsNew && $scope.update.user.idDepartmentKf!=null){
                        blockUI.message('Aprobando departamento del usuario.');
                        $timeout(function() {
                          $scope.department.user  = $scope.update.user;
                          $scope.department.user.registerBy = $scope.update.user.loggedUser;
                      }, 1500);
                        $timeout(function() {
                            //TENANT
                            $scope.approveTenantDeptoFn($scope.department);
                            $('#UpdateUser').modal('hide');
                            console.log("Usuario: "+$scope.update.user.fullNameUser+" Successfully updated");
                            inform.add('El Usuario: '+$scope.update.user.fullNameUser+' ha sido actualizado con exito. ',{
                                  ttl:3000, type: 'success'
                            });
                            $scope.refreshList();
                            blockUI.stop();
                        }, 2500); 
                      }else{
                        $timeout(function() {
                          //TENANT
                          $('#UpdateUser').modal('hide');
                          console.log("Usuario: "+$scope.update.user.fullNameUser+" Successfully updated");
                          inform.add('El Usuario: '+$scope.update.user.fullNameUser+' ha sido actualizado con exito. ',{
                                ttl:3000, type: 'success'
                          });
                          $scope.refreshList();
                          blockUI.stop();
                        }, 2500); 
                      }
                    }
                  }else{
                    $timeout(function() {
                      blockUI.message('Usuario: '+$scope.update.user.fullNameUser+' actualizado con exito');
                    }, 1500);
                    $timeout(function() {
                      //USERS DEFAULT
                      $('#UpdateUser').modal('hide');
                      console.log("REGISTERED SUCCESSFULLY");
                      inform.add('Usuario '+$scope.update.user.fullNameUser+' actualizado satisfactoriamente.',{
                        ttl:5000, type: 'success'
                      });
                      $scope.refreshList();
                      blockUI.stop();
                    }, 2500); 
                  }
                }else if (response.status==404){
                  $timeout(function() {
                    inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                      ttl:5000, type: 'warning'
                      });
                      blockUI.message('Usuario: '+$scope.update.user.fullNameUser+' no sido actualizado.');
                    }, 1500);
                }else if($scope.rsJsonData.status==500){
                  $timeout(function() {
                    inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                    blockUI.message('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor.');
                  }, 1500);
                }
              });
              $('#RegisterUser').modal('hide');
            }
        /**************************************************
        *                                                 *
        *   ASSIGN DEPARTMENT TO THE CURRENT OWNER USER   *
        *                                                 *
        **************************************************/
            $scope.fnAssignDepto = function(userData){
                DepartmentsServices.assignDepto(userData).then(function(response) {
                  if(response.status==200){
                    inform.add('Departamento del propietario autorizado satisfactoriamente.',{
                      ttl:5000, type: 'success'
                    });
                  }else if (response.status==404){
                    inform.add('Departamento del propietario no ha sido aprobado, contacte al area de soporte.',{
                    ttl:5000, type: 'warning'
                    });
                  }else if (response.status==500){
                    inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
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
                  case 1: //OWNER
                    DepartmentsServices.approveOwnerDepto(id).then(function(response) {
                      if(response.status==200){
                        inform.add('Departamento del propietario autorizado satisfactoriamente.',{
                          ttl:5000, type: 'success'
                        });
                      }else if (response.status==404){
                        inform.add('Departamento del propietario no ha sido aprobado, contacte al area de soporte.',{
                          ttl:5000, type: 'warning'
                          });
                      }else if (response.status==500){
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                          ttl:3000, type: 'danger'
                        });
                      }
                    });
                  break;
                  case 2: //TENANT
                    DepartmentsServices.approveTenantDepto(id, idStatus).then(function(response) {
                      if(response.status==200){
                        inform.add('Departamento del Habitante autorizado satisfactoriamente.',{
                          ttl:5000, type: 'success'
                        });
                      }else if (response.status==404){
                        inform.add('Departamento del propietario no ha sido autorizado, contacte al area de soporte.',{
                          ttl:5000, type: 'warning'
                        });
                      }else if (response.status==500){
                        inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                          ttl:3000, type: 'danger'
                        });
                      }
                    });
                  break;
                }
            };
        /**************************************************
        *                                                 *
        *  APPROVE DEPARTMENT TO AN OWNER OR TENANT USER  *
        *                                                 *
        **************************************************/
            $scope.approveTenantDeptoFn = function (data) {
              console.log(data);
              DepartmentsServices.approveTenantDepartment(data).then(function(response) {
                  if(response.status==200){
                      inform.add('Departamento del Habitante autorizado satisfactoriamente.',{
                      ttl:5000, type: 'success'
                      });
                      $timeout(function() {
                          blockUI.stop();
                      }, 1500);
                      //$scope.lisTenantByType($scope.idDeptoKf, null);
                  }else if (response.status==404){
                      inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                      ttl:5000, type: 'warning'
                      });
                  }
              });
            }
        /*************************************************************
        *                                                            *
        *    VERIFICAR SI UN INQUILINO TIENE UN TICKET ACTIVO        *
        *                                                            *
        *************************************************************/
            $scope.checkTicketTenant = function(idUser){
              var msg1, msg2;
              ticketServices.verifyTicketsByIdUser(idUser).then(function(response){
                  if(response.status==200){
                      $timeout(function() {
                          blockUI.message('El habitante posee pedidos activos asociados.');
                          $scope.isHasTicket = true;
                          console.log("POSEE TICKETS")
                      }, 1500);
                      $timeout(function() {
                          msg1="Tenes solicitudes pendientes, debes esperar a que finalice o cancelar para darte de baja.";
                          msg2="El Habitante presenta solicitudes pendientes, se deben finalizar o cancelar para poder dar de baja.";
                          $scope.messageInform = $scope.sysLoggedUser.idProfileKf!=1 && $scope.sysLoggedUser.idProfileKf!=4 ? msg1 : msg2;
                          inform.add($scope.messageInform,{
                              ttl:5000, type: 'warning'
                          });
                      blockUI.stop();
                      }, 3000);
                  }else if (response.status==404){
                      $timeout(function() {
                          blockUI.message('El habitante no posee pedidos activos asociados.');
                          $scope.isHasTicket = true;
                          console.log("NO POSEE TICKETS --> SE PROCEDE A SOLICITAR LA CONFIRMACION PARA LA BAJA.");
                      }, 1500);
                      $timeout(function() {
                          $('#confirmRequestModal').modal('toggle');
                      blockUI.stop();
                      }, 3000);
                  }
              });
            }
        /*************************************************************
        *                                                            *
        *    VERIFICAR SI UN INQUILINO TIENE UN TICKET ACTIVO        *
        *                                                            *
        *************************************************************/
            $scope.checkTicketTenantDeptoFn = function(idUser, idDepto){
              var msg1, msg2;
              ticketServices.verifyTicketsByIdUserDepto(idUser, idDepto).then(function(response){
                  if(response.status==200){
                      $timeout(function() {
                          blockUI.message('El Departamento y el habitante posee pedidos activos asociados.');
                          $scope.isHasTicket = true;
                          console.log("POSEE TICKETS")
                      }, 1500);
                      $timeout(function() {
                          msg1="Tenes solicitudes pendientes, debes esperar a que finalice o cancelar para darte de baja.";
                          msg2="El Habitante presenta solicitudes pendientes, se deben finalizar o cancelar para poder dar de baja.";
                          $scope.messageInform = $scope.sysLoggedUser.idProfileKf!=1 && $scope.sysLoggedUser.idProfileKf!=4 ? msg1 : msg2;
                          inform.add($scope.messageInform,{
                              ttl:5000, type: 'warning'
                          });
                      blockUI.stop();
                      }, 3000);
                  }else if (response.status==404){
                      $timeout(function() {
                          blockUI.message('El Departamento y el habitante no posee pedidos activos asociados.');
                          $scope.isHasTicket = true;
                          console.log("NO POSEE TICKETS --> SE PROCEDE A SOLICITAR LA CONFIRMACION PARA LA BAJA.");
                      }, 1500);
                      $timeout(function() {
                          $('#confirmRequestModal').modal('toggle');
                      blockUI.stop();
                      }, 3000);
                  }
              });
            }
        /**************************************************
        *                                                 *
        *        REMOVER TENANT DE UN DEPARTAMENTO        *
        *                                                 *
        **************************************************/
            $scope.removeTenantFn = function(obj){
              console.log(obj);
              blockUI.start('Dando de baja al habitante del departamento seleccionado.');
              DepartmentsServices.removeTenantDepto(obj).then(function(response){
                  //console.log(response);
                  if(response.status==200){
                      if (($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==6) && obj.idTypeTenantKf==1){
                          inform.add('Se ha dado de baja satisfactoriamente.',{
                              ttl:3000, type: 'success'
                          });
                          $timeout(function() {
                              
                              $scope.remove = {'info':{'idUser':null, 'idDepartmentKf2':null, 'idTypeTenant': null}}
                              blockUI.stop();
                          }, 2000);
                      }else if ((($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==6) && obj.idTypeTenantKf==2) || ($scope.sysLoggedUser.idProfileKf!=3 && obj.idTypeTenantKf!=0)){
                          inform.add('El Habitante ha sido dado de baja satisfactoriamente.',{
                              ttl:3000, type: 'success'
                          });
                      }
                  }
                  blockUI.stop();
              });
            } 
        /**************************************************
        *                                                 *
        *                DISABLED AN USER                 *
        *                                                 *
        **************************************************/
            $scope.disabledUser = function (user) {
              blockUI.start('Deshabilitando usuario.');
              var nameProfile = $scope.filters.userProfile==undefined?null:$scope.filters.userProfile.nameProfile;
              var statusTenantName = $scope.filters.userStatus==undefined?null:$scope.filters.userStatus.statusTenantName;
              var customerName = $scope.filters.companies.selected==undefined?null:$scope.filters.companies.selected.name;
              var buildings = $scope.filters.buildings.selected==undefined?null:$scope.filters.buildings.selected.address;
              var nameTypeAttendant = $scope.filters.attProfile.nameTypeAttendant==undefined?null:$scope.filters.attProfile.nameTypeAttendant;
              var searchboxfilter = $scope.searchboxfilter==undefined?null:$scope.searchboxfilter;
              userServices.disabled(user.idUser).then(function(response){
                //console.log(response);
                if(response.status==200 && response.data){
                  inform.add('El usuario '+user.fullNameUser+' ha sido deshabilitado con exito.',{
                    ttl:5000, type: 'warning'
                  });
                  blockUI.message('El usuario ha sido deshabilitado con exito!');
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==200 && !response.data){
                  blockUI.message('El usuario no ha sido deshabilitado!');
                  inform.add('El usuario no ha sido deshabilitado, intenta de nuevo o contacta el area de soporte.',{
                    ttl:5000, type: 'warning'
                  });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==404){
                  inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                    ttl:5000, type: 'warning'
                    });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==500){
                  inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }
                $scope.argObj={};
              });
            };
        /**************************************************
        *                                                 *
        *                 ENABLED AN USER                 *
        *                                                 *
        **************************************************/
            $scope.enabledUser = function (user) {
              blockUI.start('Habilitando usuario.');
              var nameProfile = $scope.filters.userProfile==undefined?null:$scope.filters.userProfile.nameProfile;
              var statusTenantName = $scope.filters.userStatus==undefined?null:$scope.filters.userStatus.statusTenantName;
              var customerName = $scope.filters.companies.selected==undefined?null:$scope.filters.companies.selected.name;
              var buildings = $scope.filters.buildings.selected==undefined?null:$scope.filters.buildings.selected.address;
              var nameTypeAttendant = $scope.filters.attProfile.nameTypeAttendant==undefined?null:$scope.filters.attProfile.nameTypeAttendant;
              var searchboxfilter = $scope.searchboxfilter==undefined?null:$scope.searchboxfilter;
              userServices.enabled(user.idUser).then(function(response){
                //console.log(response);
                if(response.status==200 && response.data){
                  inform.add('El usuario '+user.fullNameUser+' ha sido habilitado con exito.',{
                    ttl:5000, type: 'success'
                  });
                  blockUI.message('El usuario ha sido habilitado con exito!');
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                    
                  }, 500);
                  $timeout(function() {
                    //console.log(nameProfile+statusTenantName+customerName+buildings+nameTypeAttendant+searchboxfilter);
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==200 && !response.data){
                  blockUI.message('El usuario no ha sido habilitado!');
                  inform.add('El usuario no ha sido habilitado, intenta de nuevo o contacta el area de soporte.',{
                    ttl:5000, type: 'warning'
                  });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==404){
                  inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                    ttl:5000, type: 'warning'
                    });
                    $timeout(function() {
                      $scope.getUserLists(1, 'users');
                    }, 500);
                    $timeout(function() {
                      $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                      blockUI.stop();
                    }, 600);
                }else if(response.status==500){
                  inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                    $timeout(function() {
                      $scope.getUserLists(1, 'users');
                    }, 500);
                    $timeout(function() {
                      $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                      blockUI.stop();
                    }, 600);
                }
                $scope.argObj={};
              });
            };
        /**************************************************
        *                                                 *
        *                 DELETE AN USER                  *
        *                                                 *
        **************************************************/
            $scope.deleteUser = function (user) {
              blockUI.start('Eliminando usuario.');
              var nameProfile = $scope.filters.userProfile==undefined?null:$scope.filters.userProfile.nameProfile;
              var statusTenantName = $scope.filters.userStatus==undefined?null:$scope.filters.userStatus.statusTenantName;
              var customerName = $scope.filters.companies.selected==undefined?null:$scope.filters.companies.selected.name;
              var buildings = $scope.filters.buildings.selected==undefined?null:$scope.filters.buildings.selected.address;
              var nameTypeAttendant = $scope.filters.attProfile.nameTypeAttendant==undefined?null:$scope.filters.attProfile.nameTypeAttendant;
              var searchboxfilter = $scope.searchboxfilter==undefined?null:$scope.searchboxfilter;
              userServices.remove(user.idUser).then(function(response){
                //console.log(response);
                if(response.status==200 && response.data){
                  inform.add('El usuario '+user.fullNameUser+' ha sido eliminado con exito.',{
                    ttl:5000, type: 'danger'
                  });
                  blockUI.message('El usuario ha sido eliminado con exito!');
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==200 && !response.data){
                  blockUI.message('El usuario no ha sido eliminado!');
                  inform.add('El usuario no ha sido eliminado, intenta de nuevo o contacta el area de soporte.',{
                    ttl:5000, type: 'warning'
                  });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==404){
                  inform.add('[Error]: '+response.status+', Ocurrio error intenta de nuevo o contacta el area de soporte. ',{
                    ttl:5000, type: 'warning'
                    });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }else if(response.status==500){
                  inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                    ttl:5000, type: 'danger'
                    });
                  $timeout(function() {
                    $scope.getUserLists(1, 'users');
                  }, 500);
                  $timeout(function() {
                    $scope.search(nameProfile, statusTenantName, customerName, buildings, nameTypeAttendant, searchboxfilter, true)
                    blockUI.stop();
                  }, 600);
                }
                $scope.argObj={};
              });
            };
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
                if ((($scope.users.new.dni!=undefined && opt=="dni") || ($scope.users.new.email!=undefined && opt=="mail")) || (($scope.users.update.dni!=undefined && $scope.users.tmp.dni!=value && opt=="dni") || ($scope.users.update.email!=undefined && $scope.users.tmp.email!=value && opt=="mail"))){
                  userServices.findUserByEmail(value).then(function(response) {
                    //console.log(response);
                    if(response.status==200){
                      if(APP_REGEX.checkDNI.test(value)){
                        $scope.sysDNIRegistered=true;
                        //console.log(response.data[0].fullNameUser);
                        $scope.users.new.dni=undefined;
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
        * DEPARTMENT LIST BY SELECTED ADDRESS AND TENANT  *
        *                                                 *
        **************************************************/
            $scope.ListDpto=[];
            $scope.getDeptoListByAddress = function (idAddress){
              $scope.ListDpto=[];
              var idProfileFk = $scope.users.new.idProfileKf!=undefined?$scope.users.new.idProfileKf.idProfile:$scope.users.update.idProfileKf;
              var idTypeAttFk = $scope.users.new.idTypeAttKf!=undefined?$scope.users.new.idTypeAttKf:$scope.users.update.idTypeAttKf;
              if((((idProfileFk=='3' || idProfileFk=='4' || idProfileFk=='5') && !idTypeAttFk) || (idProfileFk=='6' && idTypeAttFk!='1')) || (((idProfileFk=='3' || idProfileFk=='4' || idProfileFk=='5') && !idTypeAttFk) || (idProfileFk=='6' && idTypeAttFk!='1'))){
                var idAddressTmp=idAddress;
                console.log("idAddressTmp  : "+idAddressTmp);
                console.log("idProfileFk   : "+idProfileFk);
                console.log("ownerOption   : "+$scope.att.ownerOption);
                var idStatusFk=null;
                  if((idProfileFk=='3') || (idProfileFk=='4' && $scope.att.ownerOption!='3') || (idProfileFk=='6' && idTypeAttFk!='1' && $scope.att.ownerOption!='3')){
                    idStatusFk='0';
                  }else{
                    idStatusFk='-1';
                  }
                  DepartmentsServices.byIdDireccion(idAddress, idStatusFk).then(function(response) {
                    if(response.status==200){
                      $scope.ListDpto = response.data;
                      console.log($scope.ListDpto);
                    }else if (response.status==404){
                      $scope.ListDpto=[];
                      inform.add('No hay departamentos en esta direccion para ser asociados, contacte al area de soporte de BSS.',{
                        ttl:5000, type: 'danger'
                      });
                    }
                  });

              }
            };
        /**************************************************/
            $scope.hideDeptoByProfile = function(item){
              console.log(item);
              return function(item){
                if(($scope.users.new.idProfileKf.idProfile==3 || $scope.users.new.idProfileKf.idProfile==5) && (item.idUserKf!=null || item.idUserKf==null)  && (item.floor=="pb" || item.floor=="ba" || item.floor=="co" || item.floor=="lo")){
                
                  //$scope.ownerFound=true;
                  //console.log("ownerFound1: "+$scope.ownerFound+"item.idUserKf: "+item.idUserKf)
                  return false;
                }
              }
            };
/*******************************************************************
*                                                                  *
*                  USERS PROFILES ROLES FUNCTIONS                  *
*                                                                  *
*******************************************************************/
        /**************************************************
        *                                                 *
        *               LIST SYS PROFILE                  *
        *                                                 *
        **************************************************/
         $scope.rsProfileData = [];
          $scope.getSysProfilesFn = function(search){
            ProfileServices.listProfiles(search).then(function(data){
                $scope.rsProfileData = data;
                $scope.loadPagination($scope.rsProfileData, "idProfiles", "7");
                //console.log($scope.rsProfileData);
            });
          };$scope.getSysProfilesFn("");
        /**************************************************
        *                                                 *
        *                NEW SYS PROFILE                  *
        *                                                 *
        **************************************************/
          $scope.checkBoxes={modulo: {}};
          $scope.sysProfile={Name:''};
          var newProfile={profile:{name:'', list_id_modules:[{}]}};
          var listOfModules=[];
          $scope.newSysProfileFn = function(){
            console.clear();
            i=0;
            listOfModules=[];
            var chkbModules = $scope.checkBoxes.modulo;
            var firArrItem=Object.keys(chkbModules).length==1?Object.keys(chkbModules)[0]:null;
            if ((Object.keys(chkbModules).length>1) || (Object.keys(chkbModules).length==1 && chkbModules[firArrItem]!=false)){
              for (var key in chkbModules){
                if (chkbModules[key]==true){
                  listOfModules.push({'idModuleFk':key});
                }
              }
              if (listOfModules.length>0){
                newProfile.profile.name=$scope.sysProfile.Name;
                newProfile.profile.list_id_modules=listOfModules;
                //console.log("Sending data to the API...");
                ProfileServices.newSysProfile(newProfile).then(function(data){
                  var rsNewProfileData = data;
                  //console.log("STATUS: "+rsNewProfileData.status);
                  //console.log("MSG   : "+rsNewProfileData.statusText);
                  //console.log("DATA  : "+rsNewProfileData.data.response);
                  //console.log($scope.rsModulesData);
                  $('#newSysProfile').modal('hide');
                  if (rsNewProfileData.status==200){
                    inform.add("Perfil creado satisfactoriamente",{
                      ttl:5000, type: 'success'
                    });
                  }
                  $scope.getSysProfilesFn("");
                });
                //console.log(newProfile);
              }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
              }
              
            }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
            }   
          }
      /**************************************************
       *                                                 *
       *               UPDATE SYS PROFILE                *
       *                                                 *
       **************************************************/
          $scope.chkBox={modulo: {}};
          $scope.sysUpProfile={Name:''};
          var updProfile={profile:{idProfiles:'', name:'', list_id_modules:[{}]}};
          $scope.tmpSysModules = [];
          $scope.selectProfileDataFn=function(obj){
            console.clear();
            $scope.tmpSysModules=obj;
            console.log($scope.tmpSysModules);
            var chkbModules = $scope.chkBox.modulo;
            console.log($scope.chkBox.modulo);
            /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
            for (var key in chkbModules){
                if (chkbModules[key]==true){
                  $scope.chkBox.modulo[key]=false;
                }
            }
            $scope.sysUpProfile.Name=$scope.tmpSysModules.name;
            $scope.isNewProfileRole=false;
            $scope.isUpdateProfileRole=true;
            $scope.isNewUser=false;
            $scope.isUpdateUser=false;
            console.log($scope.tmpSysModules.modules);
            //console.log($scope.tmpSysModules.length);
            for (var i = 0; i < $scope.tmpSysModules.modules.length; i++) {
              $scope.chkBox.modulo[$scope.tmpSysModules.modules[i].idModule]=true;
            }
            $("#updateSysProfile").modal({backdrop: 'static', keyboard: false});
              $("#updateSysProfile").on('shown.bs.modal', function () {
                $("#profileName").focus();
              });
            //console.log($scope.checkBoxes);
          }
          $scope.data2UpdateSysProfileFn=function(){
            console.clear();
            i=0;
            var listOfModules=[];
            var chkbModules = $scope.chkBox.modulo;
            var firArrItem=Object.keys(chkbModules).length==1?Object.keys(chkbModules)[0]:null;
            if ((Object.keys(chkbModules).length>1) || (Object.keys(chkbModules).length==1 && chkbModules[firArrItem]!=false)){
              for (var key in chkbModules){
                if (chkbModules[key]==true){
                  listOfModules.push({'idModuleFk':key});
                }
              }
              if (listOfModules.length>0){
                updProfile.profile.idProfiles=$scope.tmpSysModules.idProfiles;
                updProfile.profile.name=$scope.sysUpProfile.Name;
                updProfile.profile.list_id_modules=listOfModules;
                console.log("Sending data to the API...");
                $scope.updateSysProfileFn(updProfile,1);
                //console.log(updProfile);
              }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
              }
              
            }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
            } 
          }
          $scope.chkBox2={modulo: {}};
          $scope.sysProfFound=false;
          $scope.sysFindFn=function(string){
            var output=[{idProfiles:'', nameProf: ''}];
            var i=0;
            if (string!=undefined && string!=""){
              angular.forEach($scope.rsProfileData,function(sysProfile){
                var sysIdProfile=sysProfile.name;
                if(sysIdProfile.toLowerCase().indexOf(string.toLowerCase())>=0){
                  output.push({sysProfile});
                }
              });
            }else{
                  $scope.filterSysProfile=null;
                  $scope.sysProfFound=false;
            }
            $scope.filterSysProfile=output;
            console.info($scope.filterSysProfile);
          }
          $scope.fillTextbox=function(item){
            $scope.tmpSysModules=item;
            $scope.sysUpProfile.Name=item.name;
            var chkbModules = $scope.chkBox2.modulo;
            /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
            for (var key in chkbModules){
                if (chkbModules[key]==true){
                  $scope.chkBox2.modulo[key]=false;
                }
            }
            console.log(item);
            for (var i = 0; i < item.modules.length; i++) {
              $scope.chkBox2.modulo[item.modules[i].idModule]=true;
            }
            $scope.filterSysProfile=null;
            $scope.sysProfFound=true;
          }
          $scope.data2UpdateSysProfile2Fn=function(item){
            console.clear();
            i=0;
            var listOfModules=[];
            var chkbModules = $scope.chkBox2.modulo;
            var firArrItem=Object.keys(chkbModules).length==1?Object.keys(chkbModules)[0]:null;
            if ((Object.keys(chkbModules).length>1) || (Object.keys(chkbModules).length==1 && chkbModules[firArrItem]!=false)){
              for (var key in chkbModules){
                if (chkbModules[key]==true){
                  listOfModules.push({'idModuleFk':key});
                }
              }
              if (listOfModules.length>0){
                updProfile.profile.idProfiles=$scope.tmpSysModules.idProfiles;
                updProfile.profile.name=$scope.sysUpProfile.Name;
                updProfile.profile.list_id_modules=listOfModules;
                console.log("Sending data to the API...");
                $scope.updateSysProfileFn(updProfile,2);
              }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
              }
              
            }else{
                inform.add('Selecciona un modulo como minimo para crear el perfil',{
                  ttl:5000, type: 'warning'
                });
            } 
          }
          $scope.rsUpdProfileData={};
          $scope.updateSysProfileFn = function(dataProfile, opt){
            ProfileServices.updateSysProfile(dataProfile).then(function(data){
              $scope.rsUpdProfileData=data;
              console.log("STATUS: "+$scope.rsUpdProfileData.status);
              console.log("MSG   : "+$scope.rsUpdProfileData.statusText);
              console.log("DATA  : "+$scope.rsUpdProfileData.data);
              switch(opt){
                case 1:
                  if ($scope.rsUpdProfileData.status==200){
                    $scope.getSysProfilesFn("");
                    $scope.tmpSysModules={};
                    $('#updateSysProfile').modal('hide');
                    inform.add("Perfil Actualizado satisfactoriamente",{
                      ttl:5000, type: 'success'
                    });
                    
                  }
                break;
                case 2:
                if ($scope.rsUpdProfileData.status==200){
                    inform.add("Perfil Actualizado satisfactoriamente",{
                      ttl:5000, type: 'success'
                    });
                    $scope.getSysProfilesFn("");
                    $scope.filterSysProfile=null;
                    $scope.sysProfFound=false;
                    $scope.sysUpProfile.Name="";
                    $scope.tmpSysModules={};
                    $("#sysIdProfileKf").focus();
                  }
                break;
              }
              //console.log($scope.rsModulesData); 
            });
          }
          /**************************************************
          *                                                 *
          *             DELETE SYS PROFILE                  *
          *                                                 *
          **************************************************/          
            $scope.deleteSysProfileFn = function(idProfile){
              ProfileServices.deleteSysProfile(idProfile).then(function(data){
                $scope.rsDelProfileData=data;
                console.log("STATUS: "+$scope.rsDelProfileData.status);
                console.log("MSG   : "+$scope.rsDelProfileData.statusText);
                console.log("DATA  : "+$scope.rsDelProfileData.data);
                if ($scope.rsDelProfileData.status==200){
                  $scope.getSysProfilesFn("");
                  inform.add("Perfil Eliminado satisfactoriamente",{
                    ttl:5000, type: 'success'
                  });
                  
                }
                //console.log($scope.rsModulesData); 
              });
            }
          /**************************************************
          *                                                 *
          *                GET SYS MODULES                  *
          *                                                 *
          **************************************************/
            $scope.rsModulesData = {};
            $scope.getSysModulesFn = function(){
              $scope.rsModulesData = {};
              ProfileServices.getSysModules().then(function(data){
                  $scope.rsModulesData = data;
                  //console.log($scope.rsModulesData);
              });
            };$scope.getSysModulesFn();

          /**************************************************************************************/
            $scope.cleanFilters = function(){
              $scope.filters={'companies':{'selected':undefined},'buildings':{'selected':undefined},'attProfile':{},'status':{}, 'tenantProfile':{}, 'userProfile':{}, 'searchboxfilter':''}
              $scope.select={'companies':{'selected':undefined}, 'address':{'selected':undefined},'company':{'selected':undefined},'addressAttendant':{'selected':undefined}, 'deptos':{}, 'departmentList':{}}
            }

            //$scope.getUserLists("","");
            $scope.filters={'companies':{'selected':undefined},'buildings':{'selected':undefined},'attProfile':{},'status':{}, 'tenantProfile':{}, 'userProfile':{}, 'searchboxfilter':''}
            $scope.select={'companies':{'selected':undefined}, 'address':{'selected':undefined},'company':{'selected':undefined}, 'addressAttendant':{'selected':undefined}, 'deptos':{}, 'departmentList':{}}
            $scope.users={'new':{}, 'update':{}, 'details':{}}
            $scope.register={'user':{}};
            $scope.register.user={'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null};
            $scope.update={'user':{}};
            $scope.update.user={'fullNameUser':null, 'emailUser': null, 'phoneNumberUser': null, 'phoneLocalNumberUser': null, 'idAddresKf': null, 'idProfileKf': null, 'idTypeTenantKf': null, 'idCompanyKf': null, 'idTyepeAttendantKf': null, 'descOther': null, 'idDepartmentKf':null, 'isEdit': null, 'requireAuthentication': null, 'dni': null, 'idSysProfileFk': null, 'isCreateByAdmin': null, 'departmentIsNew': false};
            $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};
            $scope.remove = {'info':{'idUser':null, 'idDepartmentKf2':null, 'idTypeTenant': null}}
            $scope.tmp={'data':{}};
            $scope.userDepartamentList=[];
            $scope.userList={};
            $scope.isNewUser=null;
            $scope.isUpdateUser=null;
            $scope.isNewProfileRole=null;
            $scope.isUpdateProfileRole=null;
            $scope.userOwnerDeptos=[];
            $scope.sysContentList = "";
            $scope.att={'ownerOption':null};
            $scope.form = {};
            $scope.managedUsers = function(val1, val2, fnAction){
                $scope.sysReg={};
                //$scope.filterCompanyKf.selected           = undefined;
                //$scope.filterAddressKf.selected           = undefined;
                switch (val1){
                  /*CUSTOMER USERS*/
                  case "new":
                      switch (val2) {
                          case "user":
                            $scope.form.fNewUser.$setPristine();
                            $scope.userDepartamentList = [];
                            $scope.users={'new':{}, 'update':{}, 'details':{}, 'register':{}}
                            $scope.select={'companies':{'selected':undefined}, 'address':{'selected':undefined}, 'company':{'selected':undefined}, 'addressAttendant':{'selected':undefined}, 'departmentList':{}}
                            $scope.users.new={'idUser':null,'idProfileKf':{}, 'idSysProfileFk':null, 'fname':'','lname':'', 'dni':'','email':'', 'phonelocalNumberUser':'', 'phoneMovilNumberUser':'', 'idDepartmentKf':null, 'idTypeAttKf':null, 'typeOtherAtt':''}
                            $scope.att={'ownerOption':null};
                            $scope.isNewUser=true;$scope.isUpdateUser=false;
                            $scope.isNewProfileRole=false;$scope.isUpdateProfileRole=false;
                            $scope.sysDNIRegistered = 0;
                            $scope.sysEmailRegistered = 0;
                            $("#RegisterUser").modal({backdrop: 'static', keyboard: false});
                            $("#RegisterUser").on('shown.bs.modal', function () {
                              $("#profile").focus();
                            });
                          break;
                          case "profileRole":
                            $scope.sysProfile.Name="";
                            $scope.checkBoxes.modulo=[];
                            console.log($scope.checkBoxes);
                            $scope.isNewProfileRole=true;$scope.isUpdateProfileRole=false;
                            $scope.isNewUser=false;$scope.isUpdateUser=false;
                            $("#newSysProfile").modal({backdrop: 'static', keyboard: false});
                            $("#newSysProfile").on('shown.bs.modal', function () {
                              $("#profileName").focus();
                            });
                          break;
                      }
                  break;
                  case "list":
                    $scope.userList=[];
                    switch (val2){
                        case "users":
                          $scope.getUserLists(1, 'users');
                          $timeout(function() {
                            $scope.sysContentList = "";
                            $scope.userList=$scope.rsList.users;
                            $scope.loadPagination($scope.userList, "idUser", "10");
                            $scope.sysContentList = 'users';
                        }, 1000);
                        break;
                        case "owners_tenants":
                          $scope.sysContentList = "";
                          $scope.userList=$scope.rsList.owners_tenants;
                          $scope.loadPagination($scope.userList, "idUser", "7");
                          $scope.sysContentList = 'owners_tenants';
                        break;
                        case "tenant":
                          $scope.sysContentList = "";
                          $scope.userList=$scope.rsList.tenants;
                          $scope.loadPagination($scope.userList, "idUser", "7");
                          $scope.sysContentList = 'tenant';
                        break;
                        case "att":
                          $scope.sysContentList = "";
                          $scope.userList=$scope.rsList.attendants;
                          $scope.loadPagination($scope.userList, "idUser", "7");
                          $scope.sysContentList = 'att';
                        break;
                        case "company":
                          $scope.sysContentList = "";
                          $scope.userList=$scope.rsList.companyUser;
                          $scope.loadPagination($scope.userList, "idUser", "7");
                          $scope.sysContentList = 'company';
                        break;
                        case "sysUsers":
                          $scope.sysContentList = "";
                          $scope.userList=$scope.rsList.sysUser;
                          $scope.loadPagination($scope.userList, "idUser", "7");
                          $scope.sysContentList = 'sysUsers';
                        break;
                        case "profileRoles":
                          $scope.sysContentList = "";
                          $scope.loadPagination($scope.rsProfileData, "idProfiles", "10");
                          $scope.sysContentList = 'profileRoles';
                        break;
                    }
                  break;
                  /*USERS*/
                  default:
                }
            }


});