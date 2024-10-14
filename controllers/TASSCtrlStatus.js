/**
* Status Controller
**/
var sysStatus = angular.module("module.Status", ["tokenSystem", "angular.filter", "services.Customers","services.Address", "services.Products", "services.Contracts", "services.Service", "services.User", "ngAnimate", "ngSanitize", "ui.bootstrap", "ui.select", "services.Utilities", "bootstrapLightbox"]);

sysStatus.controller('statusCtrl', function($scope, $location, $routeParams, blockUI, $q, Lightbox, $timeout, inform, CustomerServices, ProductsServices, ContractServices, serviceServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo Status");
      console.log($routeParams);
      if ($routeParams.Type!=undefined || $routeParams.info!=undefined){
        tokenSystem.setRouteParamsStorage($routeParams);
      }
      $scope.sysRouteParams = tokenSystem.getTokenStorage(8);
      console.log("$scope.sysToken: "+$scope.sysToken);  
      console.log("$scope.sysLoggedUser: "+$scope.sysLoggedUser);
      console.log("$scope.sysRouteParams:"); 
      console.log($scope.sysRouteParams); 
      //https://devbss.sytes.net/status/services/1
    if(!$scope.sysToken && $scope.sysRouteParams.Type==undefined && $scope.sysRouteParams.service==undefined && $scope.sysRouteParams.info!='status' && ($scope.sysLoggedUser==false || $scope.sysLoggedUser==undefined)){
      $location.path("/login");
    }else{
      console.log("No login required!!");
    }
    
    var currentUrl = $location.path()
    var urlPath = currentUrl.split('/');
    $scope.urlPathSelected=urlPath[1];
    $scope.list_batteries=[];
    $scope.battery_install=[];
    $scope.list_cameras=[];
    $scope.list_cameras_ports=[];
    $scope.list_sensors=[];
    $scope.list_sensors_zones=[];
    $scope.list_tampers_zones=[];
    $scope.list_open_devices=[];
    $scope.list_user=[];
    $scope.service = {};
    $scope.list_user_licence=[];

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
      *                 LIST PRODUCTS                   *
      *                                                 *
      **************************************************/
        $scope.rsProductsData = [];
        $scope.getProductsFn = function(search){
            ProductsServices.list(search).then(function(data){
                $scope.rsProductsData = data;
                //console.log($scope.rsProfileData);
            });
        };$scope.getProductsFn("");
      /**************************************************
      *                                                 *
      *           GET CUSTOMER SERVICES LIST            *
      *                                                 *
      **************************************************/
        $scope.rsServicesListByCustomerIdData=[];
        $scope.getListCustomersServicesFn=function(idCustomer, opt){
            $scope.rsServicesListByCustomerIdData=[];
            serviceServices.getServiceListByIdCustomer(idCustomer).then(function(data){
                $scope.rsJsonData = data;
                //console.log($scope.rsJsonData);
                if($scope.rsJsonData.status==200){
                    $scope.rsServicesListByCustomerIdData=$scope.rsJsonData.data;
                    console.log($scope.rsServicesListByCustomerIdData);
                }else{
                    $scope.rsServicesListByCustomerIdData=[];
                    if($scope.rsContractNotFound==false){
                        inform.add('No se existen servicios asociados al cliente. ',{
                            ttl:2000, type: 'warning'
                        });
                    }
                }
                //console.log($scope.rsServicesListByCustomerIdData);

            });

        };
      /**************************************************
      *                                                 *
      *                 USER  SERVICES                  *
      *  [userLists]: clientUser, attendants, tenants   *
      *               sysUser, companyUser              *
      **************************************************/ 
        $scope.rsList = {};
        $scope.getUserLists = function(opt, group){
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
      *            HIDE SELF INTERNETSERVICES           *
      *     USED IN CREATE & UPDATE INTERNET SERVICE    *
      **************************************************/
        $scope.filterAssociatedServices = function(item){
          console.log(item);
          //console.log($scope.serviceSelected.idServiceAsociateFk);
          //console.log($scope.serviceSelected.idServiceAsociateFk_array);
          var itemFound = $scope.serviceSelected.idServiceAsociateFk_array.findIndex(element => element.idClientServices === item.idClientServices);
          //console.log(itemFound);
          if (itemFound<0){
            itemFound = null;
          }
          return item.idTipeServiceFk != '2' && itemFound!=null;
        };
      /**************************************************
      *                                                 *
      *              GET CUSTOMERS CONTRACT             *
      *                                                 *
      **************************************************/
        $scope.rsContractsListByCustomerIdData=[];
        $scope.rsContractNotFound=false;
        $scope.getContractsByCustomerIdFn=function(idClient){
            $scope.rsContractsListByCustomerIdData=[];
            ContractServices.getContractListByCustomerId(idClient).then(function(response){
              //console.log(response);
                if(response.status==200){
                  if(response.data!=undefined && response.data.length>0){
                      var existingContracts = [];
                      angular.forEach(response.data,function(contract){
                          //console.log(contract)
                          var deferredContracts = $q.defer();
                          existingContracts.push(deferredContracts.promise);
                          //ASSIGN DEPARTMENT SERVICE
                              deferredContracts.resolve();
                              serviceServices.getServiceListByIdContract(contract.idContrato).then(function(response_services) {
                                  if(response_services.status==200){
                                      contract.services_active = response_services.data;
                                  }else if (response_services.status==404){
                                      contract.services_active = [];
                                  }else if (response_services.status==500){
                                      contract.services_active = [];
                                  }
                              });
                      });
                      
                      $q.all(existingContracts).then(function () {
                              $scope.rsContractsListByCustomerIdData=response.data;
                              console.log($scope.rsContractsListByCustomerIdData);
                      });
                  }
                }else{
                  $scope.rsContractsListByCustomerIdData=[];
                  $scope.rsContractNotFound=true;
                  inform.add('No existen contratos activos asociados al cliente. ',{
                          ttl:2000, type: 'warning'
                  });
                }
                //console.log($scope.rsContractsListByCustomerIdData);
            });
        }


      $scope.serviceSelected = {}
      $scope.mainSwitchFn = function(opt, obj){
        switch (opt){
            case "open_service":
              $scope.serviceSelected = {}
              console.log(obj);
              $scope.list_batteries=[];
              $scope.battery_install=[];
              $scope.list_cameras=[];
              $scope.list_cameras_ports=[];
              $scope.list_sensors=[];
              $scope.list_sensors_zones=[];
              $scope.list_tampers_zones=[];
              $scope.list_open_devices=[];
              $scope.list_user=[];
              switch (obj.idTipeServiceFk){
                case "1":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName=obj.clientTypeServices;
                  //LIST OPEN DEVICES
                  //console.log($scope.list_open_devices);
                  var productIdNumber = 1;
                  for (var device in $scope.serviceSelected.tb_open_devices_access_control_array){
                      for (var prduct in $scope.rsProductsData){
                        if ($scope.serviceSelected.tb_open_devices_access_control_array[device].idOpenDevice==$scope.rsProductsData[prduct].idProduct){
                            $scope.list_open_devices.push({'idProductIndex':productIdNumber,'idOpenDevice':$scope.serviceSelected.tb_open_devices_access_control_array[device].idOpenDevice,'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.tb_open_devices_access_control_array[device].numberSerieFabric, 'numberSerieInternal':$scope.serviceSelected.tb_open_devices_access_control_array[device].numberSerieInternal,'dateExpiration':$scope.serviceSelected.tb_open_devices_access_control_array[device].dateExpiration, 'idProductClassification':$scope.rsProductsData[prduct].idProductClassificationFk, 'classification': $scope.rsProductsData[prduct].classification, 'description':null, 'isNew':0});
                            productIdNumber++;
                            break;
                        }
                      }
                  }
                  //LIST BATTERIES INSTALLED
                  //console.log($scope.list_batteries);
                  var productIdNumber = 1;
                  for (var battery in $scope.serviceSelected.tb_battery_install_access_control_array){
                      for (var prduct in $scope.rsProductsData){
                        if ($scope.serviceSelected.tb_battery_install_access_control_array[battery].idBatteryFk==$scope.rsProductsData[prduct].idProduct){
                            $scope.list_batteries.push({'idProductIndex':productIdNumber,'idBatteryFk':$scope.serviceSelected.tb_battery_install_access_control_array[battery].idBatteryFk,'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.tb_battery_install_access_control_array[battery].numberSerieFabric, 'numberSerieInternal':$scope.serviceSelected.tb_battery_install_access_control_array[battery].numberSerieInternal,'dateExpiration':$scope.serviceSelected.tb_battery_install_access_control_array[battery].dateExpiration, 'idProductClassification':$scope.rsProductsData[prduct].idProductClassificationFk, 'classification': null, 'description':null, 'isNew':0});
                            productIdNumber++;
                            break;
                        }
                      }
                  }
                  console.log($scope.list_open_devices);
                  $("#selectServiceItem").modal('toggle');
                break;
                case "2":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName="Internet";
                  $("#selectServiceItem").modal('toggle');
                break;
                case "3":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName="Totem";
                  $("#selectServiceItem").modal('toggle');
                  var productIndexNumb = 1;
                  for (var key in $scope.serviceSelected.adicional){
                    for (var prduct in $scope.rsProductsData){
                        for (var batery in $scope.serviceSelected.tb_backup_energy_array){
                            if ($scope.serviceSelected.adicional[key].idProductoFk==$scope.rsProductsData[prduct].idProduct && $scope.serviceSelected.tb_backup_energy_array[batery].idBatteryFk==$scope.serviceSelected.adicional[key].idProductoFk){
                            $scope.list_batteries.push({'idProductIndex':productIndexNumb,'idBatteryFk':$scope.serviceSelected.tb_backup_energy_array[batery].idBatteryFk, 'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.adicional[key].numberSerieFabric, 'numberSerieInternal':$scope.serviceSelected.adicional[key].numberSerieInternal,'dateExpiration':$scope.serviceSelected.adicional[key].dateExpiration, 'idProductClassification':$scope.serviceSelected.tb_backup_energy_array[batery].idProductClassificationFk, 'classification': $scope.rsProductsData[prduct].classification, 'description':$scope.rsProductsData[prduct].descriptionProduct, 'isNew':0});
                            productIndexNumb++;
                            }
                        }
                    }
                  }
                  //LOAD CAMERAS
                  for (var camera in $scope.serviceSelected.tb_cameras_array){
                      for (var prduct in $scope.rsProductsData){
                          if ($scope.rsProductsData[prduct].idProduct==$scope.serviceSelected.tb_cameras_array[camera].idProductFk){
                              $scope.list_cameras.push({'idProductFk':$scope.serviceSelected.tb_cameras_array[camera].idProductFk, 'idCameraFk':$scope.serviceSelected.tb_cameras_array[camera].idProductFk,'portCamera':parseInt($scope.serviceSelected.tb_cameras_array[camera].portCamera), 'coveredArea':$scope.serviceSelected.tb_cameras_array[camera].coveredArea, 'locationCamera': $scope.serviceSelected.tb_cameras_array[camera].locationCamera, 'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.tb_cameras_array[camera].nroFabricCamera, 'numberSerieInternal':$scope.serviceSelected.tb_cameras_array[camera].nroSerieCamera,'dateExpiration':$scope.serviceSelected.tb_cameras_array[camera].dateExpireCamera, 'idProductClassification':$scope.rsProductsData[prduct].idProductClassification, 'classification': $scope.rsProductsData[prduct].classification, 'nroSerieCamera':$scope.serviceSelected.tb_cameras_array[camera].nroSerieCamera,'nroFabricCamera':$scope.serviceSelected.tb_cameras_array[camera].nroFabricCamera,'dateExpireCamera':$scope.serviceSelected.tb_cameras_array[camera].dateExpireCamera, 'isNew':0});
                              break;
                          }
                      }
                  }
                  //LOAD DVR USERS
                  $scope.getUserLists();
                  var idListItem = 1;
                  for (var dvrUser in $scope.serviceSelected.tb_client_camera_array){
                      $scope.list_user.push({'idItem':idListItem,'idClientFk':$scope.serviceSelected.tb_client_camera_array[dvrUser].idClientFk,'name':$scope.serviceSelected.tb_client_camera_array[dvrUser].name, 'user':$scope.serviceSelected.tb_client_camera_array[dvrUser].user, 'pass':$scope.serviceSelected.tb_client_camera_array[dvrUser].pass, 'profile':$scope.serviceSelected.tb_client_camera_array[dvrUser].userProfile, 'userProfile':$scope.serviceSelected.tb_client_camera_array[dvrUser].userProfile, 'qrCode':$scope.serviceSelected.tb_client_camera_array[dvrUser].qrBase64, 'qrBase64':$scope.serviceSelected.tb_client_camera_array[dvrUser].qrBase64});
                      idListItem++;
                  }
                  console.log($scope.serviceSelected);
                break;
                case "4":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName="Camaras";
                  $("#selectServiceItem").modal('toggle');
                  var productIndexNumb = 1;
                  for (var key in $scope.serviceSelected.adicional){
                    for (var prduct in $scope.rsProductsData){
                        for (var batery in $scope.serviceSelected.tb_backup_energy_array){
                            if ($scope.serviceSelected.adicional[key].idProductoFk==$scope.rsProductsData[prduct].idProduct && $scope.serviceSelected.tb_backup_energy_array[batery].idBatteryFk==$scope.serviceSelected.adicional[key].idProductoFk){
                            $scope.list_batteries.push({'idProductIndex':productIndexNumb,'idBatteryFk':$scope.serviceSelected.tb_backup_energy_array[batery].idBatteryFk, 'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.adicional[key].numberSerieFabric, 'numberSerieInternal':$scope.serviceSelected.adicional[key].numberSerieInternal,'dateExpiration':$scope.serviceSelected.adicional[key].dateExpiration, 'idProductClassification':$scope.serviceSelected.tb_backup_energy_array[batery].idProductClassificationFk, 'classification': $scope.rsProductsData[prduct].classification, 'description':$scope.rsProductsData[prduct].descriptionProduct, 'isNew':0});
                            productIndexNumb++;
                            }
                        }
                    }
                  }
                  //LOAD CAMERAS
                  for (var camera in $scope.serviceSelected.tb_cameras_array){
                      for (var prduct in $scope.rsProductsData){
                          if ($scope.rsProductsData[prduct].idProduct==$scope.serviceSelected.tb_cameras_array[camera].idProductFk){
                              $scope.list_cameras.push({'idProductFk':$scope.serviceSelected.tb_cameras_array[camera].idProductFk, 'idCameraFk':$scope.serviceSelected.tb_cameras_array[camera].idProductFk,'portCamera':parseInt($scope.serviceSelected.tb_cameras_array[camera].portCamera), 'coveredArea':$scope.serviceSelected.tb_cameras_array[camera].coveredArea, 'locationCamera': $scope.serviceSelected.tb_cameras_array[camera].locationCamera, 'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.tb_cameras_array[camera].nroFabricCamera, 'numberSerieInternal':$scope.serviceSelected.tb_cameras_array[camera].nroSerieCamera,'dateExpiration':$scope.serviceSelected.tb_cameras_array[camera].dateExpireCamera, 'idProductClassification':$scope.rsProductsData[prduct].idProductClassification, 'classification': $scope.rsProductsData[prduct].classification, 'nroSerieCamera':$scope.serviceSelected.tb_cameras_array[camera].nroSerieCamera,'nroFabricCamera':$scope.serviceSelected.tb_cameras_array[camera].nroFabricCamera,'dateExpireCamera':$scope.serviceSelected.tb_cameras_array[camera].dateExpireCamera, 'isNew':0});
                              break;
                          }
                      }
                  }
                  //LOAD DVR USERS
                  //$scope.getUserLists();
                  var idListItem = 1;
                  for (var dvrUser in $scope.serviceSelected.tb_client_camera_array){
                      $scope.list_user.push({'idItem':idListItem,'idClientFk':$scope.serviceSelected.tb_client_camera_array[dvrUser].idClientFk,'name':$scope.serviceSelected.tb_client_camera_array[dvrUser].name, 'user':$scope.serviceSelected.tb_client_camera_array[dvrUser].user, 'pass':$scope.serviceSelected.tb_client_camera_array[dvrUser].pass, 'profile':$scope.serviceSelected.tb_client_camera_array[dvrUser].userProfile, 'userProfile':$scope.serviceSelected.tb_client_camera_array[dvrUser].userProfile, 'qrCode':$scope.serviceSelected.tb_client_camera_array[dvrUser].qrBase64, 'qrBase64':$scope.serviceSelected.tb_client_camera_array[dvrUser].qrBase64});
                      idListItem++;
                  }
                  console.log($scope.serviceSelected);
                break;
                case "5":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName="Alarmas";
                  $("#selectServiceItem").modal('toggle');
                  //LOAD CONECTION REMOTE TYPE
                  $scope.tipo_conexion_remoto_tmp={};
                  if($scope.serviceSelected.tb_tipo_conexion_remoto_array!=undefined && $scope.serviceSelected.tb_tipo_conexion_remoto_array.length>=1){
                      for (var connType in $scope.serviceSelected.tb_tipo_conexion_remoto_array){
                          for (var prduct in $scope.rsProductsData){
                              if ($scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleIp==$scope.rsProductsData[prduct].idProduct && $scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleGprs==undefined){
                              $scope.tipo_conexion_remoto_tmp=$scope.serviceSelected.tb_tipo_conexion_remoto_array[connType];
                              $scope.tipo_conexion_remoto_tmp.idTipoConexionRemoto="2";
                              $scope.tipo_conexion_remoto_tmp.ipAlarmModule={'selected':undefined};
                              $scope.tipo_conexion_remoto_tmp.ipAlarmModule.selected=$scope.rsProductsData[prduct];
                              break;
                              }else if ($scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleGprs==$scope.rsProductsData[prduct].idProduct && $scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleIp==undefined){
                              $scope.tipo_conexion_remoto_tmp=$scope.serviceSelected.tb_tipo_conexion_remoto_array[connType];
                              $scope.tipo_conexion_remoto_tmp.idTipoConexionRemoto="3";
                              $scope.tipo_conexion_remoto_tmp.gprsAlarmModule={'selected':undefined};
                              $scope.tipo_conexion_remoto_tmp.gprsAlarmModule.selected=$scope.rsProductsData[prduct];
                              break;
                              }else if ($scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleIp==undefined && $scope.serviceSelected.tb_tipo_conexion_remoto_array[connType].moduleGprs==undefined){
                              //console.log($scope.serviceSelected.tb_tipo_conexion_remoto_array[connType]);
                              $scope.tipo_conexion_remoto_tmp=$scope.serviceSelected.tb_tipo_conexion_remoto_array[connType];
                              $scope.tipo_conexion_remoto_tmp.idTipoConexionRemoto="1";
                              break;
                              }
                          }
                          for (var type in $scope.rsTypeConnectionListData){
                              console.log($scope.rsTypeConnectionListData[type])
                              if($scope.rsTypeConnectionListData[type].idTipoConexionRemoto==$scope.tipo_conexion_remoto_tmp.idTipoConexionRemoto){
                                  $scope.rsTypeConnectionListData[type].selected=true;
                              }
                          }
                          //console.log($scope.tipo_conexion_remoto_tmp);
                          //$scope.addServiceModuleConnectionDetailsFn($scope.tipo_conexion_remoto_tmp, $scope.tipo_conexion_remoto_tmp.idTipoConexionRemoto, 'new')
                      }
                  }else{
                      inform.add('El servicio no tiene un Tipo de conexion asociado. ',{
                      ttl:10000, type: 'info'
                      });
                  }
                  var productIndexNumb = 1;
                  //LOAD BATTERIES                      
                  for (var batery in $scope.serviceSelected.tb_alarm_batery_array){
                    for (var prduct in $scope.rsProductsData){
                        if ($scope.serviceSelected.tb_alarm_batery_array[batery].idProductoFk==$scope.rsProductsData[prduct].idProduct){
                        $scope.list_batteries.push({'idProductIndex':productIndexNumb,'idBatteryFk':$scope.serviceSelected.tb_alarm_batery_array[batery].idProductoFk,'descriptionProduct':$scope.rsProductsData[prduct].descriptionProduct, 'model':$scope.rsProductsData[prduct].model, 'brand': $scope.rsProductsData[prduct].brand,'isNumberSerieInternal':$scope.rsProductsData[prduct].isNumberSerieInternal,'isNumberSerieFabric':$scope.rsProductsData[prduct].isNumberSerieFabric,'isDateExpiration':$scope.rsProductsData[prduct].isDateExpiration, 'numberSerieFabric':$scope.serviceSelected.tb_alarm_batery_array[batery].nroFabric, 'numberSerieInternal':$scope.serviceSelected.tb_alarm_batery_array[batery].nroInternal,'dateExpiration':$scope.serviceSelected.tb_alarm_batery_array[batery].dateExpired, 'idProductClassification':$scope.rsProductsData[prduct].idProductClassificationFk, 'classification': $scope.rsProductsData[prduct].classification, 'description':$scope.rsProductsData[prduct].descriptionProduct, 'isNew':0});
                        productIndexNumb++; 
                        }
                    }
                  }
                  //LOAD SENSORS
                  if ($scope.serviceSelected.tb_sensors_alarm_array!=undefined && $scope.serviceSelected.tb_sensors_alarm_array.length>=1){
                    for (var sensor in $scope.serviceSelected.tb_sensors_alarm_array){
                        for (var prduct in $scope.rsProductsData){
                          if ($scope.serviceSelected.tb_sensors_alarm_array[sensor].idSensorProduct==$scope.rsProductsData[prduct].idProduct){
                              var sensorSelected = $scope.rsProductsData[prduct];
                          }
                        }
                        var dvrSelected   = null;
                        var portCamera    = null;                            
                        var nroZoneTamper = $scope.serviceSelected.tb_sensors_alarm_array[sensor].nroZoneTamper!=null?parseInt($scope.serviceSelected.tb_sensors_alarm_array[sensor].nroZoneTamper):null;
                        $scope.list_sensors.push({'idSensor':$scope.serviceSelected.tb_sensors_alarm_array[sensor].idSensorProduct,'sensorDetails':sensorSelected,'numberZoneSensor':parseInt($scope.serviceSelected.tb_sensors_alarm_array[sensor].numberZoneSensor),'area':$scope.serviceSelected.tb_sensors_alarm_array[sensor].area, 'isWirelessSensor':parseInt($scope.serviceSelected.tb_sensors_alarm_array[sensor].isWirelessSensor), 'nroZoneTamper':nroZoneTamper, 'locationLon':$scope.serviceSelected.tb_sensors_alarm_array[sensor].locationLon, 'idDvr':$scope.serviceSelected.tb_sensors_alarm_array[sensor].idDvr, 'dvrDetails':dvrSelected, 'idCameraFk':$scope.serviceSelected.tb_sensors_alarm_array[sensor].idCameraFk, 'portCamera':portCamera, 'nroInterno':$scope.serviceSelected.tb_sensors_alarm_array[sensor].nroInterno, 'nroFrabric':$scope.serviceSelected.tb_sensors_alarm_array[sensor].nroFrabric});
                    }
                  console.log($scope.list_sensors);
                  }else{
                    inform.add('El servicio no tiene Sensores asociados. ',{
                    ttl:10000, type: 'info'
                    });
                  }
                  //console.log($scope.list_batteries);
                break;
                case "6":
                  $scope.serviceSelected = obj;
                  $scope.serviceSelected.winName="APP Monitoreo";
                  $("#selectServiceItem").modal('toggle');
                  $scope.list_user_licence_idDepartmentList=[];
                  for (var key in $scope.serviceSelected.tb_user_license_array){
                      $scope.list_user_licence_idDepartmentList.push({'idDetinationOfLicenseFk':$scope.serviceSelected.tb_user_license_array[key].idDetinationOfLicenseFk, 'idUserFk':$scope.serviceSelected.tb_user_license_array[key].idUserFk,'fullName':$scope.serviceSelected.tb_user_license_array[key].fullName, 'idDepartmentFk':$scope.serviceSelected.tb_user_license_array[key].idDepartmentFk,'depto': $scope.serviceSelected.tb_user_license_array[key].Depto, 'idParticularAddressFk':$scope.serviceSelected.tb_user_license_array[key].idParticularAddressFk, 'email':$scope.serviceSelected.tb_user_license_array[key].email, 'phone':$scope.serviceSelected.tb_user_license_array[key].phone, 'keyword':$scope.serviceSelected.tb_user_license_array[key].keyword, 'idOS':$scope.serviceSelected.tb_user_license_array[key].idOS, 'profileUser':$scope.serviceSelected.tb_user_license_array[key].profileUser,'userNumbPasswd':$scope.serviceSelected.tb_user_license_array[key].numberUserPassword, 'nameProfile':$scope.serviceSelected.tb_user_license_array[key].nameProfile});
                      
                  }
                  console.log($scope.list_user_licence_idDepartmentList);
                break;
              }
              
            break;
        }
      }

    /***************************************************************************
    *                                                                          *
    *   PARAMETER TO RECEIVED TO CHECK WETHER A CLIENT IS ENABLE OR DISABLE    *
    *                                                                          *
    ****************************************************************************/

        /* USAGE: /status/client/55 */
        if ($scope.sysRouteParams && $scope.sysRouteParams!=undefined){
            console.log("===========================================");
            console.log("    Parameters for Approval received       ");
            console.log("===========================================");
            console.log($scope.sysRouteParams);
          $scope.checkStatus={'services':false, 'client':false}
          if($scope.sysRouteParams){
            if ($scope.sysRouteParams.client!=undefined){
              var idClient = $scope.sysRouteParams.client;
              console.log("client: "+idClient);
              //$timeout(function() {$scope.checkCustomerIsInDebtFn(idClient);}, 1500);
              $scope.checkCustomerIsInDebtFn(idClient);
              $scope.checkStatus.client=true;
              $scope.checkStatus.services=false;
            }else if ($scope.sysRouteParams.service!=undefined){
              var idClient = $scope.sysRouteParams.service;
              //console.log("client: "+idClient);
              //$timeout(function() {$scope.checkCustomerIsInDebtFn(idClient);}, 1500);
              $scope.checkCustomerIsInDebtFn(idClient);
              
              $timeout(function() {
                $scope.getContractsByCustomerIdFn(idClient);
                //$scope.getSelectedServiceByIdContractFn(obj.idContractFk, obj.idTipeServiceFk);
              }, 1500);
              $timeout(function() {
                $scope.getListCustomersServicesFn(idClient);
              }, 2000);
              $scope.checkStatus.client=false;
              $scope.checkStatus.services=true;
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