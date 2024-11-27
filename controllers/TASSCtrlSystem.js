/**
* System Controller
**/
var system = angular.module("module.System", ["tokenSystem", "angular.filter", "services.Keys", "services.Customers", "ui.select", "services.Ticket", "services.Products", "services.Utilities", "services.Departments", "bootstrapLightbox","services.Service", "services.Contracts", "services.Products", "services.User"]);
/**************************************************
*                                                 *
*          DATE FILTER FOR MYSQL TIMESTAMP        *
*                                                 *
**************************************************/
system.filter('dateToISO', function() {
    return function(input) {
        input = new Date(input).toISOString();
        return input;
    }
});

system.filter('toDate', function() {
    return function(items) {
      return new Date(items);
    };
});
system.controller('SystemCtrl', function($scope, $location, $rootScope, $routeParams, blockUI, $q, Lightbox, KeysServices, $timeout, inform, ProductsServices, ticketServices, CustomerServices, serviceServices, ContractServices, DepartmentsServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS, APP_REGEX){
    console.log(APP_SYS.app_name+" Modulo System");
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
        $location.path("/login");
    }  
    
    //Variables Initialization
    $scope.pagination = {
        'maxSize': 5,     // Limit number for pagination display number.  
        'totalCount': 0,  // Total number of items in all pages. initialize as a zero  
        'pageIndex': 1,   // Current page number. First page is 1.-->  
        'pageSizeSelected': 10, // Maximum number of items per page. 
        'totalCount':0
     } 
    $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isNotCliente':undefined, 'isInDebt':false, 'isStockInBuilding': false, 'isStockInOffice': false, 'strict':false};
    $scope.select={'filterTypeOfClient':{}, 'filterCustomerIdFk':{'selected':undefined},'admins':{'selected':undefined}, 'buildings':{'selected':undefined}, 'province':{'selected':undefined}, 'location':{'selected':undefined}, 'depto':undefined,'floor':undefined, 'product':{'selected':undefined}};
    $scope.zone={'new':{}, 'update':{}};
    $scope.rsNewZonesData ={};
    $scope.zones={'new':{'zona':{}}, 'update':{'zona':{}}};
    $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
    $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
    $scope.rsTechServicesData = null;
    $scope.isDeleteKeyMulti=false;
        /**
        * Modal Confirmation function 
        **/
        $scope.modalConfirmation = function(opt, confirm, obj, obj2){
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
                        }if($scope.isDeleteKeyMulti==true){
                            $scope.mess2show="Esta seguro que desea cancelar la eliminación de los llaveros?";
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
                        $("#deleteKeys").modal('hide');
                        //$scope.switchCustomersFn('dashboard','', 'registered');
                    }
                break;
                case "tdown":
                    if (confirm==0){
                    console.log(confirm);
                    $scope.mess2show="Desea Solicitar una nueva llave?";
                    $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                    $('.jumbotron [id^="m_"]').removeClass('active');
                    $('#m_pedidos').addClass('active');
                    $('#SubM_Pedidos').show();
                    $scope.fnShowHide('rukeyup', 'open');
                    $('#confirmRequestModal').modal('hide');
                    }
                    $('#confirmRequestModal').on('hide.bs.modal', function (e) {
                    $scope.dhboard();
                    $scope.fnShowHide('home','open');
                    });
                break;
                case "checkAddr":
                    if (confirm==0 && $scope.addrNoFound==1){
                    if (tmpOpt!="home"){
                        $scope.mess2show="No posee departamento autorizados, Desea registrar un departamento?";
                    }else{
                        $scope.mess2show="No registra tickets actualmente, Desea verificar si tiene un departmanto asociado?";
                    }
                    $('#confirmRequestModal').modal('toggle');
                    }else if(confirm==0 && $scope.addrNoFound==0 && $scope.sysLoggedUser.idProfileKf!=0){ 
                        if(tmpOpt=="rukeyup"){
                        if ($scope.sysLoggedUser.idProfileKf==5 ||($scope.sysLoggedUser.idProfileKf==6 && $scope.sessionidTypeTenant==2)){
                            $scope.sysCheckAddrIsInDebt($scope.ListTenantAddress);
                            $scope.refresSession($scope.sessionMail);
                            $scope.idAddressAtt=$scope.sessionNameAdress;
                            $scope.namesTenant=$scope.sessionNames;
                            if($scope.sessionidAddress){
                            $scope.getKeyChains($scope.sessionidAddress); 
                            $scope.getServicesValues($scope.sessionidAddress);
                            }else{
                            $scope.idAddressAtt="Consorcio no asignado";
                            }
                            if($scope.sessionidAddress && (!$scope.sessionisDepartmentApproved || $scope.sessionisDepartmentApproved>=0)){
                            $scope.deptoTenant   =($scope.sessionidAddress && !$scope.sessionisDepartmentApproved) || ($scope.sessionidAddress && $scope.sessionisDepartmentApproved==0)?$scope.getDeptoName($scope.sessionIdDeparmentKf)+" (No aprobado)":$scope.getDeptoName($scope.sessionIdDeparmentKf)+" (Aprobado)";
                            }else{
                            $scope.deptoTenant = "Departamento no ha sido asignado."
                            }
                        }else{
                            $scope.rukeyup = true;
                        }
                        }else 
                        if(tmpOpt=="rukeydown"){
                        if ($scope.sysLoggedUser.idProfileKf==5 ||($scope.sysLoggedUser.idProfileKf==6 && $scope.sessionidTypeTenant==2)){
                            $scope.sysCheckAddrIsInDebt($scope.ListTenantAddress);
                            $scope.refresSession($scope.sessionMail);
                            $scope.idAddressAtt=$scope.sessionNameAdress;
                            $scope.namesTenant=$scope.sessionNames;
                            if($scope.sessionidAddress){
                            $scope.getKeyChains($scope.sessionidAddress); 
                            $scope.getServicesValues($scope.sessionidAddress);
                            }else{
                            $scope.idAddressAtt="Consorcio no asignado";
                            }
                            if($scope.sessionidAddress && (!$scope.sessionisDepartmentApproved || $scope.sessionisDepartmentApproved>=0)){
                            $scope.deptoTenant   =($scope.sessionidAddress && !$scope.sessionisDepartmentApproved) || ($scope.sessionidAddress && $scope.sessionisDepartmentApproved==0)?$scope.getDeptoName($scope.sessionIdDeparmentKf)+" (No aprobado)":$scope.getDeptoName($scope.sessionIdDeparmentKf)+" (Aprobado)";
                            }else{
                            $scope.deptoTenant = "Departamento no ha sido asignado."
                            }
                        }else{
                            $scope.rukeydown = true;
                        }
                        }else 
                        if(tmpOpt=="home"){
                        $scope.home = true;
                        }else 
                        if(tmpOpt=="rucost"){
                        $scope.rucost=true;
                        }else
                        if(tmpOpt=="ruother"){
                        $scope.ruother=true;
                        }
                    }else if (confirm==1){
                    $('.jumbotron [id^="m_"]').removeClass('active');
                    $('#m_depto').addClass('active');
                    $('#SubM_Pedidos').hide();
                    $scope.fnShowHide('managedepto', 'open');
                    $('#confirmRequestModal').modal('hide');
                    }
                break;
            
                if (confirm==0){
                    if ($scope.sysLoggedUser.idProfileKf==1 && obj.idProduct!=0){
                    $scope.idProducto = obj.idProduct;
                    $scope.mess2show="El Producto "+obj.descriptionProduct+" sera Eliminado.     Confirmar?";
                        console.log('Producto a eliminar ID: '+obj.idProduct+' DESCRIPCION: '+obj.descriptionProduct);
                        console.log("============================================================================")
                        console.log(obj);
                    }      
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.deleteProductFn($scope.idProducto);
                $('#confirmRequestModal').modal('hide');
                }
                break;
                case "closeCustomerWindow":
                    if (confirm==0){
                        if ($scope.isNewCustomer==true){
                        $scope.mess2show="Se perderan todos los datos cargados para el registro del cliente, esta seguro que desea cancelar?";
                        }else{
                        $scope.mess2show="Se perderan todos las modificaciones realizadas en el registro actual, esta seguro que desea cancelar la modificacion?";
                        }    
                        $('#confirmRequestModal').modal('show');
                    }else if (confirm==1){
                        $('#confirmRequestModal').modal('hide');
                        $('#customerParticularAddress').modal('hide');
                        $('#BuildingUnit').modal('hide');
                        $('#functionalUnit').modal('hide');
                        $("#AddressLatLon").modal('hide');
                        $('#RegisterModalCustomer').modal('hide');
                        $('#UpdateModalCustomer').modal('hide');
                        $('#changeModalAdmin').modal('hide');
                        $scope.switchCustomersFn('dashboard','', 'registered');
                    }
                break;
                case "closeServiceWindow":
                    if (confirm==0){
                        if ($scope.isNewCustomerService==true){
                        $scope.serviceNew=obj;
                        console.log($scope.serviceNew);
                        $scope.mess2show="Se perderan todos los datos cargados para el registro del servicio, esta seguro que desea cancelar?";
                        $scope.getListContractServicesFn($scope.serviceNew.idContratoFk, null);
                        }else{
                        $scope.serviceUpdate=obj;
                        $scope.mess2show="Se perderan todos las modificaciones realizadas en el registro actual, esta seguro que desea cancelar la modificacion?";
                        $scope.getListContractServicesFn($scope.serviceUpdate.idContratoFk, null);
                        }    
                        $('#confirmRequestModal').modal('show');
                    }else if (confirm==1){
                        $('#confirmRequestModal').modal('hide');
                        $('#RegisterCtrlAccessService').modal('hide');
                        $('#RegisterInternetService').modal('hide');
                        $('#RegisterTotemService').modal('hide');
                        $('#RegisterCamerasService').modal('hide');
                        $('#RegisterAlarmService').modal('hide');
                        $('#RegisterAppMonitorService').modal('hide');
                        $('#updateCtrlAccessService').modal('hide');
                        $('#updateInternetService').modal('hide');
                        $('#updateTotemService').modal('hide');
                        $('#updateCamerasService').modal('hide');
                        $('#updateAlarmService').modal('hide');
                        $('#updateAppMonitorService').modal('hide');   
                        
                        //$scope.loadPagination($scope.rsCustomerListData, "idClient", "10");
                    }
                break;
                case "removeZone":
                    if (confirm==0){
                        $scope.removeZone=obj;
                            console.log(obj)
                            $scope.mess2show="La zona ("+obj.n_zona+") "+obj.descripcion+" sera eliminada.     Confirmar?";
                            console.log("============================================================================");
                            console.log("Datos de la Zona a Eliminar");
                            console.log("============================================================================");
                            console.log("ID de la Zona :  "+obj.n_zona);
                            console.log("Descripción   :  "+obj.descripcion);
                            console.log("============================================================================");
                            //console.log(obj);
                        $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                        $scope.mainSwitchFn("zones", "deleteZone", $scope.removeZone)
                        $('#confirmRequestModal').modal('hide');
                    }
                case "process_keyList":
                    if (confirm==0){
                        $scope.keyObj=obj;
                        console.log(obj.keyList)
                        $scope.mess2show="Dara de baja ("+obj.keyList.length+") Llaveros, por favor,     Confirmar?";
                        console.log("============================================================================");
                        console.log("Llaves a eliminar: ");
                        console.log(obj.keyList.length);
                        console.log("============================================================================");
                        //console.log(obj);
                        $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                        $scope.mainSwitchFn("keys","process_list", $scope.keyObj);
                        $('#confirmRequestModal').modal('hide');
                    }
                break;
                case "createService4AllCustomers":
                    if (confirm==0){
                        switch (obj){
                            case "1":
                                var ClientType="Administración"
                            break;
                            case "2":
                                var ClientType="Edificio"
                            break;
                            case "3":
                                var ClientType="Empresa"
                            break;
                            case "4":
                                var ClientType="Sucursal"
                            break;
                            case "5":
                                var ClientType="Particular"
                            break;
                            default:
                                var ClientType="Todos"
                            break;
                            
                        }
                            if (obj==""){
                                $scope.mess2show="Iniciar la Creación de servicios de forma masiva para todos los clientes.     Confirmar?";
                            }else{
                                $scope.mess2show="Iniciar la Creación de servicios de forma masiva para todos los clientes de tipo ["+ClientType+"].     Confirmar?";
                            }
                            console.log("Tipo de Cliente :  "+obj);
                            console.log("Descripción     :  "+ClientType);
                            //console.log(obj);
                        $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                        $scope.mainSwitchFn("customers", "getAllCustomers", null)
                        $('#confirmRequestModal').modal('hide');
                    }
                break;
                case "removeAllKeys":
                    if (confirm==0){
                        switch (obj){
                            case "1":
                                var categoryName="Departamento"
                            break;
                            case "2":
                                var categoryName="Stock"
                            break;
                            case "3":
                                var categoryName="Reserva"
                            break;
                            case "4":
                                var categoryName="Apertura"
                            break;
                            case "5":
                                var categoryName="Administración"
                            break;
                            case "5":
                                var categoryName="Consorcio"
                            break;
                            default:
                                var categoryName="Todos"
                            break;
                            
                        }
                            if (obj==""){
                                $scope.mess2show="Iniciar la Baja de Llaveros de forma masiva.     Confirmar?";
                            }else{
                                $scope.mess2show="Iniciar la Baja de Llaveros de forma masiva de tipo ["+categoryName+"].     Confirmar?";
                            }
                            console.log("Tipo de Llavero         :  "+obj);
                            console.log("Nombre de categoria     :  "+categoryName);
                            //console.log(obj);
                        $('#confirmRequestModal').modal('toggle');
                    }else if (confirm==1){
                        $scope.mainSwitchFn("keys", "list", null)
                        $('#confirmRequestModal').modal('hide');
                    }
                break;
                default:
            }
        }

        /**
        * Pagination Functions
        **/
        $scope.pagedItems    = [];
        $scope.itemPerPage=0;
        $scope.loadPagination = function(item, orderBy, itemsByPage){
            //console.log("[loadPagination]");
            var rowList=[];
            var rowId=null;
            for (var key in item){
                if (item[key].idServiceTechnician!=undefined && typeof item[key].idServiceTechnician === 'string'){
                    rowId=Number(item[key].idServiceTechnician);
                    item[key].idServiceTechnician=rowId;
                    rowList.push(item[key]);
                }else{
                    rowList.push(item[key]);
                }
            }
            //console.log(item);
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
        $scope.search = function (qv1, qv2, qv3, qv4, vStrict) {
                var qvalue1 = qv1==""?undefined:qv1;
                var qvalue2 = qv2==""?undefined:qv2;
                var qvalue3 = qv3==""?undefined:qv3;
                var qvalue4 = qv4==""?undefined:qv4;
                console.log("[search]-->qvalue1: "+qvalue1);
                console.log("[search]-->qvalue2: "+qvalue2);
                console.log("[search]-->qvalue3: "+qvalue3);
                console.log("[search]-->qvalue4: "+qvalue4);
                //console.log("[search]-->qvalue5: "+qvalue5);
                //console.log("[search]-->qvalue6: "+qvalue6);
                //console.log("[search]-->vStrict: "+vStrict);
                $scope.filteredItems = $filter("filter")($scope.items, qvalue1, vStrict);
                if (qvalue2!=undefined && qvalue2!='' && qvalue2!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue2, vStrict);}
                if (qvalue3!=undefined && qvalue3!='' && qvalue3!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue3, vStrict);}
                if (qvalue4!=undefined && qvalue4!='' && qvalue4!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue4, vStrict);}
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
            $scope.selectedItem = undefined;
            $scope.selectTable = {'rowIndex':'', 'item':{}, 'option':''};
            $scope.selectTableRow = function (value, item, opt) {
                $scope.selectTable = {'rowIndex':'', 'item':{}, 'option':''}; 
                $scope.vIndex = value;
                $scope.selectTable.rowIndex = value;
                $scope.selectTable.option = opt;
                $scope.selectTable.item = item;
                $scope.selectedItem = item;
                console.log("[selectTableRow ("+$scope.vIndex +")]->idService: "+$scope.selectTable.item.idServiceTechnician);
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
                        if(opt=="cost"){$scope.getTechServiceCostByTypeServiceIdFn($scope.selectTable.item.idServiceTechnician);}
                        //console.log("===================================")
                    } else if ($scope.tableRowExpanded === true) {
                            console.log("ROWEXPANDED TRUE")
                        if ($scope.tableRowIndexCurrExpanded === $scope.vIndex) {
                            console.log("tableRowIndexCurrExpanded == vIndex")
                            $scope.tableRowExpanded = false;
                            $scope.tableRowIndexCurrExpanded = "";
                            $scope.selectTable = {'rowIndex':'', 'item':{}, 'option':''};
                            $scope.selectedItem = undefined;
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
                            if(opt=="cost"){$scope.getTechServiceCostByTypeServiceIdFn($scope.selectTable.item.idServiceTechnician);}
                            $scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = true;
                            $scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = false;
                            //console.log("===================================")
                        }
                    } 
                }
            };

            $scope.customersSearch={
            "searchFilter":null,
            "isNotCliente":"0",
            "idClientTypeFk":null,
            "isInDebt": null,
            "start":"1",
            "limit":"10",
            "strict": null,
            "totalCount":true
            }
        /**************************************************
        *                                                 *
        *             LIST CUSTOMER SERVICE               *
        *                                                 *
        **************************************************/
            $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
            $scope.setCustomersListRs = {}
            $scope.getCustomerLisServiceFn = function(searchFilter, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit, strict){
                console.log($scope.customerSearch);
                console.log("isStockInOffice:"+isStockInOffice);
                var searchFilter        = searchFilter!=undefined && searchFilter!="" && searchFilter!=null?searchFilter:null;
                var isNotCliente        = isNotCliente!=undefined && isNotCliente!=null?isNotCliente:"0";
                var idClientTypeFk      = idClientTypeFk!=undefined && idClientTypeFk!="" && idClientTypeFk!=null?idClientTypeFk:null;
                var isInDebt            = isInDebt!=false && isInDebt!=undefined && isInDebt!=null?1:null;
                var isStockInBuilding   = isStockInBuilding!=false && isStockInBuilding!=undefined && isStockInBuilding!=null?1:null;
                var isStockInOffice     = null;
                var start               = start!=undefined && start!=null && ((!isInDebt || !isStockInBuilding || !isStockInOffice) && !strict)?start:"";
                var limit               = limit!=undefined && limit!=null && ((!isInDebt || !isStockInBuilding || !isStockInOffice) && !strict)?limit:"";
                var strict              = strict!=false && strict!=undefined && strict!=null?strict:null;
                //console.log(isStockInOffice);
                $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
                $scope.customersSearch={
                    "searchFilter":searchFilter,
                    "isNotCliente":isNotCliente,
                    "idClientTypeFk":idClientTypeFk,
                    "isInDebt":isInDebt,
                    "isStockInBuilding":isStockInBuilding,
                    "isStockInOffice":isStockInOffice,
                    "start":start,
                    "limit":limit,
                    "strict":strict,
                    "totalCount":true
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
            $scope.pageChanged = function(){
                //console.info($scope.pagination.pageIndex);
                var pagIndex = ($scope.pagination.pageIndex-1)*($scope.pagination.pageSizeSelected);
                $scope.getCustomersListFn(null, $scope.customersSearch.isNotCliente, $scope.customersSearch.idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, pagIndex, $scope.pagination.pageSizeSelected);
            }
        /**************************************************
        *                                                 *
        *           GET CUSTOMER LIST FUNCTION            *
        *                                                 *
        **************************************************/
            $scope.getCustomersListFn = function(search, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit) {
                $scope.getCustomerLisServiceFn(search, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit, null).then(function(data) {
                    console.info(data);
                    $scope.rsCustomerListData     = data.customers;
                    $scope.pagination.totalCount  = data.totalCount;
                }, function(err) {
                //error
                });
            }
        /**************************************************
         *                                                 *
         *              GET CUSTOMER BY NAME               *
         *                                                 *
         **************************************************/
            $scope.searchboxfilterDB=null;
            $scope.getCustomersByNameFn = function(clientName, isInDebt, strict, totalCount) {
                var clientTypeFk = $scope.customersSearch.idClientTypeFk!= undefined && ($scope.customerSearch.typeClient=="" && $scope.customerSearch.typeClient!=undefined)?$scope.customersSearch.idClientTypeFk:$scope.customerSearch.typeClient;
                console.log("clientName  : "+clientName);
                console.log("clientTypeFk: "+clientTypeFk);
                console.log("totalCount  : "+totalCount);
                console.log("isInDebt    : "+isInDebt);
                console.log("strict      : "+strict);
                console.log($scope.customerSearch.isStockInOffice);
                if(clientName!=undefined && clientName.length>=2){
                if (clientName!=undefined && clientName!='' && clientName!=null){
                    $scope.getCustomerLisServiceFn(clientName, $scope.customersSearch.isNotCliente, clientTypeFk, isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, 0, 10, strict, totalCount).then(function(response) {
                    console.info(response);
                    if(response.status==undefined){
                        $scope.rsCustomerListData    = response.customers;
                        $scope.pagination.totalCount = response.customers.length;
                    }else if(response.status==404){
                        $scope.rsCustomerListData = [];
                        $scope.pagination.totalCount  = 0;
                    } 
                    }, function(err) {
                    $scope.rsCustomerListData = [];
                    $scope.pagination.totalCount  = 0;
                    });
                }else{
                    $scope.rsCustomerListData = [];
                    $scope.pagination.totalCount  = 0;
                    $scope.customersSearch.idClientTypeFk = null;
                    $scope.pageChanged();
                }
                }else{
                $scope.customersSearch.idClientTypeFk = null;
                $scope.pageChanged();
                }
            }
        /**************************************************
        *                                                 *
        *             LIST CUSTOMER BY TYPE               *
        *                                                 *
        **************************************************/
            $scope.getCustomersListByTypeFn = function(idClientTypeFk) {
                if ($scope.select.checkList!=undefined){
                    $scope.select.checkList.selected=false;
                }
                if (idClientTypeFk!=undefined && idClientTypeFk!='' && idClientTypeFk!=null){
                if ($scope.select.filterTypeOfClient!=undefined){
                    if (idClientTypeFk!='2'){
                    $scope.customerSearch.isStockInOffice   = false;
                    $scope.customerSearch.isStockInBuilding = false;
                    }
                    $scope.getCustomerLisServiceFn(null, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", $scope.pagination.pageSizeSelected, $scope.customerSearch.strict).then(function(data) {
                    //console.info(data.customers);
                        $scope.rsCustomerListByTypeData = data.customers;
                    }, function(err) {
                    //error
                    $scope.rsCustomerListByTypeData = [];
                    });
                }else{
                    console.info("idClientTypeFk: "+ idClientTypeFk);
                    if (idClientTypeFk!='2'){
                    $scope.customerSearch.isStockInOffice   = false;
                    $scope.customerSearch.isStockInBuilding = false;
                    }
                    $scope.getCustomerLisServiceFn($scope.customersSearch.searchFilter, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", $scope.pagination.pageSizeSelected, $scope.customerSearch.strict).then(function(data) {
                        console.info(data);
                        if(data.status==404){
                        $scope.rsCustomerListData = [];
                        }else{
                        $scope.rsCustomerListData    = data.customers;
                        $scope.pagination.totalCount = data.totalCount;
                        }
                    }, function(err) {
                    //error
                    $scope.rsCustomerListData = [];
                    });
                }
                }else{
                console.info("idClientTypeFk: "+ idClientTypeFk);
                $scope.customerSearch.isStockInOffice   = false;
                $scope.customerSearch.isStockInBuilding = false;
                $scope.customersSearch.idClientTypeFk = null;
                $scope.getCustomerLisServiceFn($scope.customersSearch.searchFilter, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", $scope.pagination.pageSizeSelected, $scope.customerSearch.strict).then(function(data) {
                    //console.info(data.customers);
                    if(data.status==404){
                    $scope.rsCustomerListData = [];
                    }else{
                    $scope.rsCustomerListData    = data.customers;
                    $scope.pagination.totalCount = data.totalCount;
                    }
                }, function(err) {
                    //error
                    $scope.rsCustomerListData = [];
                });
                }
            }

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
                        $scope.rsContractNotFound=false;
                        $scope.rsContractsListByCustomerIdData=response.data;
                    }else{
                        $scope.rsContractsListByCustomerIdData=[];
                        $scope.rsContractNotFound=true;
                        inform.add('No se existen contratos asociados al cliente. ',{
                                ttl:2000, type: 'warning'
                        });
                    }
                    //console.log($scope.rsContractsListByCustomerIdData);
                });
            }
        /**************************************************
        *                                                 *
        *                    ADD ZONE                     *
        *                                                 *
        **************************************************/
            $scope.addNewZoneFn = function(obj){
                UtilitiesServices.addNewZone($scope.zones.new).then(function(response){
                    if(response.status==200){
                        console.log("Zone Successfully Created");
                        inform.add('Registro de nueva zona realizado con exito. ',{
                            ttl:2000, type: 'success'
                        });
                        $('#newZoneModal').modal('hide');
                        $scope.zone={'new':{}, 'update':{}};
                        $scope.zones={'new':{'zona':{}}, 'update':{'zona':{}}};
                    }else if(response.status==203){
                        console.log("Zone already exist, contact administrator");
                        inform.add('INFO: La zona ya se encuentra registrado. ',{
                            ttl:2000, type: 'warning'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }else if(response.status==500){
                        console.log("Zone not Created, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.getZonesFn();
                    $timeout(function() {
                        $scope.mainSwitchFn("zones", "list", null)
                        blockUI.stop();
                    }, 2000);
                });
            };

        /**************************************************
         *                                                 *
         *                   UPDATE ZONE                   *
         *                                                 *
        **************************************************/
            $scope.rsUpdatedZone={};
            $scope.zones={'new':{'zona':{}}, 'update':{'zona':{}}};
            $scope.updateZoneFn = function(obj){
                UtilitiesServices.updateZone(obj).then(function(response){
                    if(response.status==200){
                        console.log("Zone Successfully updated");
                        inform.add('Modificacion de zona realizado con exito. ',{
                            ttl:2000, type: 'success'
                        });
                        $('#updateZoneModal').modal('hide');
                        $scope.zone={'new':{}, 'update':{}};
                        $scope.zones={'new':{'zona':{}}, 'update':{'zona':{}}};
                    }else if(response.status==500){
                        console.log("Zone not updated, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.getZonesFn();
                    $timeout(function() {
                        $scope.mainSwitchFn("zones", "list", null)
                        blockUI.stop();
                    }, 2500);

                });
            };
        /**************************************************
        *                                                 *
        *                   DELETE ZONE                   *
        *                                                 *
        **************************************************/
            $scope.deleteZoneFn = function(idZona){
                UtilitiesServices.deleteZone(idZona).then(function(response){
                    if(response.status==200){
                        console.log("Zone Successfully deleted");
                        inform.add('Zona eliminada satisfactoriamente. ',{
                            ttl:2000, type: 'success'
                        });
                    }else if(response.status==500){
                        console.log("Zone not deleted, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                        });
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.getZonesFn();
                    $timeout(function() {
                        $scope.mainSwitchFn("zones", "list", null)
                        blockUI.stop();
                    }, 2000);
                });
            };
        /**************************************************
        *                                                 *
        *                  GET LOCATION                   *
        *                   LOCAL API                     *
        *                                                 *
        **************************************************/
            $scope.rsLocations_Data = {};
            $scope.getLocationByIdFn = function(idProvince){
                addressServices.getLocationsZones(idProvince).then(function(data){
                    $scope.rsLocations_All = data;
                    //console.log($scope.rsLocations_Data);
                });
            };
            $scope.provincesAllowed = function(item){
                return item.idProvince == "1" || item.idProvince == "2";
            }
        /**************************************************
        *                                                 *
        *            LIST TECHNICIAN SERVICES             *
        *                                                 *
        **************************************************/
            $scope.getTechServiceListFn = function(obj){
                serviceServices.getTechServiceList().then(function(response){
                    if(response.status==200){
                        $scope.rsTechServicesData = response.data
                    }else if(response.status==404){
                        inform.add('Error[404]: no se pudo obtener la lista de servicios tecnicos, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        $scope.rsTechServicesData = null;
                    }else if(response.status==500){
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        $scope.rsTechServicesData = null;
                    }
                });
            };
        /**************************************************
        *                                                 *
        *              ADD TECH SERVICE                   *
        *                                                 *
        **************************************************/
            $scope.getTechServiceTypeFn = function(obj){
                UtilitiesServices.typeTechnicianServices().then(function(response){
                    if(response.status==200){
                        $scope.rsTechServicesTypeData = response.data
                    }else if(response.status==404){
                        inform.add('Error[404]: no se pudo obtener la lista de servicios tecnicos, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        $scope.rsTechServicesTypeData = null;
                    }else if(response.status==500){
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        $scope.rsTechServicesTypeData = null;
                    }
                });
            };$scope.getTechServiceTypeFn();
        /**************************************************
        *                                                 *
        *              ADD TECH SERVICE                   *
        *                                                 *
        **************************************************/
            $scope.addNewTechServiceFn = function(obj){
                serviceServices.addTechService(obj).then(function(response){
                    if(response.status==200){
                        console.log("Technician Service Successfully Created");
                        inform.add('El servicio ha sido registrado con exito. ',{
                            ttl:5000, type: 'success'
                        });
                        $('#newTechService').modal('hide');
                        $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                        $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                    }else if(response.status==404){
                        console.log("Something went wrong, contact administrator");
                        inform.add('Error[404]: no se pudo realizar el registro, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }else if(response.status==500){
                        console.log("Service not registered, contact administrator");
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.dayDataCollapseFn();
                    $timeout(function() {
                        $scope.getTechServiceListFn();
                        blockUI.stop();
                    }, 2000);
                });
            };
        /**************************************************
        *                                                 *
        *            CHECK TECH SERVICE BY NAME           *
        *                                                 *
        **************************************************/
            $scope.checkTechServiceNameFn = function(name){
                var upperName = $scope.technician_services.update.description;
                console.log(upperName.toUpperCase())
                console.log($scope.technician_services.temp.description)
                if ($scope.technician_services.temp == undefined || ($scope.technician_services.temp != undefined && $scope.technician_services.temp.description != upperName.toUpperCase())){
                    serviceServices.checkTechServiceName(name).then(function(response){
                        if(response.status==200){
                            inform.add('El nombre '+name.toUpperCase()+' ya se encuentra registrado. ',{
                                ttl:5000, type: 'warning'
                            });
                            console.log("Tech Service Name Already used");
                            $scope.technician_services.new.description=undefined;
                            $scope.technician_services.update.description=undefined;
                        }else if(response.status==404){
                            console.log("Tech Service Name Available");
                            //$('#RegisterModalCustomer').modal('hide');
                        }else if(response.status==500){
                            console.log("Error 500, contact administrator");
                            inform.add('Error[500] Contacta al area de soporte. ',{
                                ttl:5000, type: 'danger'
                            });
                            //$('#RegisterModalCustomer').modal('hide');
                        }
                    });
                }
            };
        /**************************************************
         *                                                 *
         *             UPDATE TECH SERVICE                 *
         *                                                 *
        **************************************************/
            $scope.updateTechServiceFn = function(obj){
                serviceServices.updateTechService(obj).then(function(response){
                    if(response.status==200){
                        console.log("Technician Service Successfully updated");
                        inform.add('El servicio ha sido actualizado con exito. ',{
                            ttl:5000, type: 'success'
                        });
                        $('#editTechService').modal('hide');
                        $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                        $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                    }else if(response.status==404){
                        console.log("Something went wrong, contact administrator");
                        inform.add('Error[404]: no se pudo realizar la actualizacion, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }else if(response.status==500){
                        console.log("Service not registered, contact administrator");
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.dayDataCollapseFn();
                    $timeout(function() {
                        $scope.getTechServiceListFn();
                        blockUI.stop();
                    }, 2000);
                });
            };
        /**************************************************
        *                                                 *
        *               DELETE TECH SERVICE               *
        *                                                 *
        **************************************************/
            $scope.deleteTechServiceFn = function(idZona){
                UtilitiesServices.deleteZone(idZona).then(function(response){
                    if(response.status==200){
                        console.log("Zone Successfully deleted");
                        inform.add('Zona eliminada satisfactoriamente. ',{
                            ttl:2000, type: 'success'
                        });
                    }else if(response.status==500){
                        console.log("Zone not deleted, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                        });
                    }
                    blockUI.start('Actualizando listado.');
                    $scope.getZonesFn();
                    $timeout(function() {
                        $scope.mainSwitchFn("zones", "list", null)
                        blockUI.stop();
                    }, 2000);
                });
            };

        /**************************************************
        *                                                 *
        *              ADD TECH SERVICE COST              *
        *                                                 *
        **************************************************/
            $scope.addNewTechServiceCostFn = function(obj){
                serviceServices.addTechServiceCost(obj).then(function(response){
                    if(response.status==200){
                        console.log("Technician Service Cost Successfully Created");
                        inform.add('El Costo del mantenimiento ha sido registrado con exito. ',{
                            ttl:5000, type: 'success'
                        });
                        $('#newTechServiceCost').modal('hide');
                        $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                        $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                    }else if(response.status==404){
                        console.log("Something went wrong, contact administrator");
                        inform.add('Error[404]: no se pudo realizar el registro, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }else if(response.status==500){
                        console.log("Cost not registered, contact administrator");
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    
                    if ($scope.selectedItem!=undefined){
                        blockUI.start('Actualizando listado.');
                        $timeout(function() {
                            $scope.tableRowExpanded = false;
                            $scope.tableRowIndexCurrExpanded = "";
                            $scope.selectTableRow($scope.vIndex, $scope.selectTable.item, "cost");
                            //$scope.dayDataCollapse[$scope.vIndex] = false;
                            blockUI.stop();
                        }, 1000);
                    }
                });
            };
        /**************************************************
        *                                                 *
        *              ADD TECH SERVICE COST              *
        *                                                 *
        **************************************************/
            $scope.updateTechServiceCostFn = function(obj){
                serviceServices.updateTechServiceCost(obj).then(function(response){
                    if(response.status==200){
                        console.log("Technician Service Cost Successfully Updated");
                        inform.add('El Costo del mantenimiento ha sido actualizado con exito. ',{
                            ttl:5000, type: 'success'
                        });
                        $('#editTechServiceCost').modal('hide');
                        $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                        $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                    }else if(response.status==404){
                        console.log("Something went wrong, contact administrator");
                        inform.add('Error[404]: no se pudo actualizar el registro, Contacta al area de soporte. ',{
                            ttl:5000, type: 'warning'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }else if(response.status==500){
                        console.log("Cost not registered, contact administrator");
                        inform.add('Error[500] Contacta al area de soporte. ',{
                            ttl:5000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                    }
                    
                    if ($scope.selectedItem!=undefined){
                        blockUI.start('Actualizando listado.');
                        $timeout(function() {
                            $scope.tableRowExpanded = false;
                            $scope.tableRowIndexCurrExpanded = "";
                            $scope.selectTableRow($scope.vIndex, $scope.selectTable.item, "cost");
                            //$scope.dayDataCollapse[$scope.vIndex] = false;
                            blockUI.stop();
                        }, 1000);
                    }
                });
            };
        /**************************************************
        *                                                 *
        *                  GET TECH SERVICES              *
        *                                                 *
        **************************************************/
            $scope.rsTechServiceCostData = {};
            $scope.getTechServiceCostByTypeServiceIdFn = function(id){
                serviceServices.getTechServiceCostByTypeServiceIdList(id).then(function(response){
                    if(response.status==200){
                        $scope.rsTechServiceCostData = response.data;
                    }else if (response.status==404){
                        $scope.rsTechServiceCostData = [];
                        inform.add('No hay resultados, por favor contacte al area de soporte de TASS.',{
                        ttl:5000, type: 'warning'
                        });
                    }else if (response.status==500){
                        $scope.rsTechServiceCostData = [];
                        inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:5000, type: 'danger'
                        });
                    }
                });
            };
        /**************************************************
        *                                                 *
        *           GET TYPE OF TypeMaintenance           *
        *                                                 *
        **************************************************/
            $scope.rsTypeOfMaintenanceListData = [];
            $scope.getTypeOfMaintenanceFn = function(){
                UtilitiesServices.typeOfMaintenance().then(function(response){
                    if(response.status==200){
                        $scope.rsTypeOfMaintenanceListData = response.data;
                    }
                });
            };
        /**************************************************
        *                                                 *
        *           GET TYPE OF TypeMaintenance           *
        *                                                 *
        **************************************************/
            $scope.rsTypeOfMaintenanceData = [];
            $scope.getTypeOfMaintenanceByTechServiceIdFn = function(id){
                serviceServices.maintenanceTypeByTechServiceId(id).then(function(response){
                    if(response.status==200){
                        $scope.rsTypeOfMaintenanceData = response.data;
                    }else if (response.status==404){
                        $scope.rsTypeOfMaintenanceData = [];
                        inform.add('No hay tipos de mantenimientos disponibles para el servicio seleccionado.',{
                        ttl:5000, type: 'warning'
                        });
                    }else if (response.status==500){
                        $scope.rsTypeOfMaintenanceData = [];
                        inform.add('Ocurrio un error, contacte al area de soporte de TASS.',{
                        ttl:5000, type: 'danger'
                        });
                    }
                });
            };
        /***********************************
        *   ADDING NEW CUSTOMER SERVICE    *
        ************************************/
            $scope.addCustomerServiceFn = function(service){
                serviceServices.addService(service).then(function(data){
                    $scope.rsJsonData = data;
                    //console.log($scope.rsJsonData);
                    if($scope.rsJsonData.status==200){
                        console.log("Customer Service Successfully Created");
                        inform.add('El Servicio del cliente ha sido creado con exito. ',{
                            ttl:2000, type: 'success'
                        });
                    }else if($scope.rsJsonData.status==500){
                        console.log("Customer Service not Created, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                        });
                    }
                });
            };
      /**************************************************
      *                                                 *
      *  SLIDER RANGE FOR THE AMOUNT OF TICKET TO SHOW  *
      *                                                 *
      **************************************************/
        //https://angular-slider.github.io/angularjs-slider/index.html
        //https://github.com/angular-slider/angularjs-slider
        //https://jsfiddle.net/ValentinH/954eve2L/
        $scope.slider = {
            value: 10,
            options: {
              floor: 10,
              ceil: 100,
              step: 10,
              showTicksValues: true,
              onChange: function () {
                $scope.pagination.pageSizeSelected = $scope.slider.value;
                $scope.getCustomersListByTypeFn($scope.customerSearch.typeClient)
              },
              ticksTooltip: function(v) {
                return 'Mostrar: ' + v;
              },
              customValueToPosition: function(val, minVal, maxVal) {
                val = Math.sqrt(val);
                minVal = Math.sqrt(minVal);
                maxVal = Math.sqrt(maxVal);
                var range = maxVal - minVal;
                return (val - minVal) / range;
              },
              customPositionToValue: function(percent, minVal, maxVal) {
                minVal = Math.sqrt(minVal);
                maxVal = Math.sqrt(maxVal);
                var value = percent * (maxVal - minVal) + minVal;
                return Math.pow(value, 2);
              }
            }
        };


        function convertTZ(date, tzString) {
            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("es-AR", {timeZone: tzString}));   
        }
        /**************************************************
        *                                                 *
        *                 LIST ALL KEYS                   *
        *                                                 *
        **************************************************/
            $scope.rsAllKeychainListData = [];

            $scope.keychainSearch={
              "idClientKf":null,
              "idCategoryKf":null,
              "idKeychainStatusKf":null,
              "idDepartmenKf":null,
              "create_at":null,
              "start":null,
              "limit":null,
              "strict":null,
              "totalCount":null,
            };
            $scope.getKeychainListFn = function(idClientKf,create_at,idCategoryKf,idKeychainStatusKf,idDepartmenKf,start,limit,strict,totalCount){

                //console.log("idClientKf           : "+idClientKf);
                //console.log("create_at            : "+create_at);
                //console.log("idCategoryKf         : "+idCategoryKf);
                //console.log("idKeychainStatusKf   : "+idKeychainStatusKf);
                //console.log("start                : "+start);
                //console.log("limit                : "+limit);
                //console.log("strict               : "+strict);
                //console.log("totalCount           : "+totalCount);
                var idClientKf          = idClientKf!=undefined && idClientKf!=null?idClientKf:null;
                var idCategoryKf        = idCategoryKf!=undefined && idCategoryKf!="" && idCategoryKf!=null?idCategoryKf:null;
                var idKeychainStatusKf  = idKeychainStatusKf!=undefined && idKeychainStatusKf!="" && idKeychainStatusKf!=null?idKeychainStatusKf:null;
                var idDepartmenKf       = idDepartmenKf!=undefined && idDepartmenKf!="" && idDepartmenKf!=null?idDepartmenKf:null;
                var create_at           = create_at!=undefined && create_at!="" && create_at!=null?create_at:null;
                var start               = start!=undefined && start!=null && !strict?start:"";
                var limit               = limit!=undefined && limit!=null && !strict?limit:"";
                var strict              = strict!=false && strict!=undefined && strict!=null?strict:null;
                var totalCount          = totalCount!=false && totalCount!=undefined && totalCount!=null?totalCount:null;
                console.log("=================================================");
                console.log("                 getKeychainListFn               ");
                console.log("=================================================");
                console.log("idClientKf           : "+idClientKf);
                console.log("create_at            : "+create_at);
                console.log("idCategoryKf         : "+idCategoryKf);
                console.log("idKeychainStatusKf   : "+idKeychainStatusKf);
                console.log("idDepartmenKf        : "+idDepartmenKf);
                console.log("start                : "+start);
                console.log("limit                : "+limit);
                console.log("strict               : "+strict);
                console.log("totalCount           : "+totalCount);
                $scope.keychainSearch={
                    "idClientKf":idClientKf,
                    "idCategoryKf":idCategoryKf,
                    "idKeychainStatusKf":idKeychainStatusKf,
                    "idDepartmenKf":idDepartmenKf,
                    "create_at":create_at,
                    "start":start,
                    "limit":limit,
                    "strict":strict,
                    "totalCount":totalCount,
                    };
                KeysServices.getKeychainList($scope.keychainSearch).then(function(response){
                    if(response.status==200){
                        $scope.rsAllKeychainListData   = response.data.tb_keychain;
                        if (response.data.totalCount!=undefined){
                            $scope.pagination.totalCount    = response.data.totalCount;
                        }
                        console.log(response.data);
                    }else if(response.status==404){
                        inform.add('[Info]: No se encontraron registros. ',{
                            ttl:5000, type: 'info'
                            });
                            $scope.rsAllKeychainListData = [];
                    }else if(response.status==500){
                        inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con el servidor, contacta el area de soporte. ',{
                        ttl:5000, type: 'danger'
                        });
                        $scope.rsAllKeychainListData = [];
                    }
                });
            };
            $scope.pageChanged = function(){
                console.info($scope.pagination.pageIndex);
                console.log("$scope.sysContent: "+$scope.sysContent);
                var pagIndex = ($scope.pagination.pageIndex-1)*($scope.pagination.pageSizeSelected);
                var idKeychainStatus = 1;
                if ($scope.sysContent=='listKeys'){
                    $scope.getKeychainListFn($scope.customerFound.idClient,null, $scope.select.filterCategoryKey,idKeychainStatus,$scope.select.idDepartmenKf,pagIndex,$scope.pagination.pageSizeSelected, false, false);
                }else{
                    $scope.getKeychainProcessFn($scope.select.idTypeTicketKf,$scope.customerFound.idClient,null,$scope.select.filterCategoryKey,pagIndex,$scope.pagination.pageSizeSelected, false, false);
                }
                
            }
            $scope.slider_keys = {
                value: 10,
                options: {
                  floor: 10,
                  ceil: 100,
                  step: 10,
                  showTicksValues: true,
                  onChange: function () {
                    $scope.pagination.pageSizeSelected = $scope.slider_keys.value;
                    var pagIndex = ($scope.pagination.pageIndex-1)*($scope.pagination.pageSizeSelected);
                    var idKeychainStatus = "1";
                    $scope.getKeychainListFn($scope.customerFound.idClient,null, $scope.select.filterCategoryKey,idKeychainStatus,$scope.select.idDepartmenKf,pagIndex,$scope.pagination.pageSizeSelected, false, false);
                  },
                  ticksTooltip: function(v) {
                    return 'Mostrar: ' + v;
                  },
                  customValueToPosition: function(val, minVal, maxVal) {
                    val = Math.sqrt(val);
                    minVal = Math.sqrt(minVal);
                    maxVal = Math.sqrt(maxVal);
                    var range = maxVal - minVal;
                    return (val - minVal) / range;
                  },
                  customPositionToValue: function(percent, minVal, maxVal) {
                    minVal = Math.sqrt(minVal);
                    maxVal = Math.sqrt(maxVal);
                    var value = percent * (maxVal - minVal) + minVal;
                    return Math.pow(value, 2);
                  }
                }
            };
        /**************************************************
        *                                                 *
        *              GET TICKET TYPES LIST              *
        *                                                 *
        **************************************************/
            $scope.listStatusKeychain = undefined;
            $scope.getStatusKeychainFn = function(){
                KeysServices.statusKeychain().then(function(response){
                    if(response.status==200){
                            $scope.listStatusKeychain = response.data;
                    }else if (response.status==404){
                        inform.add('Ocurrio un error, contacte al area de soporte de BSS.',{
                            ttl:3000, type: 'danger'
                        });
                            $scope.listStatusKeychain = undefined;
                    }else if (response.status==500){
                        inform.add('Ocurrio un error, contacte al area de soporte de BSS.',{
                        ttl:3000, type: 'danger'
                        });
                        $scope.listStatusKeychain = undefined;
                    }
                });
            };$scope.getStatusKeychainFn();
        /**************************************************
        *                                                 *
        *            GET CATEGORY KEYS CHAIN              *
        *                                                 *
        **************************************************/
            $scope.rsCategoryKeyChainsData = [];
            $scope.getCategoryKeyChainsFn = function(){
                UtilitiesServices.CategoryKeyChains().then(function(response){
                    if(response.status==200){
                        $scope.rsCategoryKeyChainsData = response.data;
                    }else{
                        $scope.rsCategoryKeyChainsData = [];
                    }
                });
                //console.log($scope.rsCategoryKeyChainsData);
            };$scope.getCategoryKeyChainsFn("");
        /***********************************
        *         DELETE SINGLE KEY        *
        ************************************/
        $scope.deleteKeyFn = function(llavero) {
            return KeysServices.updateKey(llavero).then(function(response) {
                if (response.status == 200) {
                    console.log("Key (" + llavero.llavero.codigo + ") Successfully deleted");
                } else if (response.status == 404) {
                    console.log("Not found, contact administrator");
                    inform.add('Error: [404] Contacta al área de soporte.', {
                        ttl: 5000,
                        type: 'danger'
                    });
                } else if (response.status == 500) {
                    console.log("There was an error removing the key, contact administrator");
                    inform.add('Error: [500] Contacta al área de soporte.', {
                        ttl: 5000,
                        type: 'danger'
                    });
                }
            });
        };
        /***********************************
        *         ADD KEY PROCESS EVENT    *
        ************************************/
        $scope.addProcessEventFn = function(llavero) {
            return KeysServices.addProcessEvent(llavero).then(function(response_keychain_process) {
                if (response_keychain_process.status == 200) {
                    console.log("Key (" + llavero.llavero.codigo + ") Successfully deleted");
                } else if (response_keychain_process.status == 404) {
                    console.log("Not found, contact administrator");
                    inform.add('Error: [404] Contacta al área de soporte.', {
                        ttl: 5000,
                        type: 'danger'
                    });
                } else if (response_keychain_process.status == 500) {
                    console.log("There was an error removing the key, contact administrator");
                    inform.add('Error: [500] Contacta al área de soporte.', {
                        ttl: 5000,
                        type: 'danger'
                    });
                }
            });
        };
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
            $scope.select={'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined};
            $scope.findCustomerFn=function(string, typeClient, strict){
                if(event.keyCode === 8 || event.which === 8){
                    console.log(event.which);
                    $scope.buildingList=[];
                    $scope.ListDpto=[];
                    $scope.sysSubContent  = "";
                    //$scope.select.admins.selected=undefined;
                    $scope.select.buildings={'selected':undefined}
                }else if(event.keyCode === 1 || event.which === 1 || event.keyCode === 13 || event.which === 13){
                    console.log("Search:");
                    console.log("string: "+string);
                    console.log("typeClient: "+typeClient);
                    console.log("strict: "+strict);
                    $scope.buildingList=[];
                    $scope.ListDpto=[];
                    $scope.sysSubContent  = "";
                    //$scope.select.admins.selected=undefined;
                    $scope.select.buildings={'selected':undefined}
                    var output=[];
                    var i=0;
                    if (string!=undefined && string!=""){
                        $scope.customerFound={};
                        $scope.getCustomerLisServiceFn(string, "0", "2", null, 0, 10, strict).then(function(response){
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
                    if ($scope.sysContent=='listKeysProcess'){
                        $scope.customerFound={};
                        $scope.switchKeysFn('keychain_process_list', null);
                    }else{
                        $scope.customerFound={};
                        $scope.switchKeysFn('list', null);
                    }
                    }
                    console.info($scope.listCustomerFound);
                }
            }
            $scope.customerFound={};
            $scope.loadCustomerFieldsFn=function(obj, generateFile=false){
                $scope.customerFound={};
                console.log("===============================");
                console.log("|  SERVICE CUSTOMER SELECTED  |");
                console.log("===============================");
                console.log(obj);
                $scope.customerFound=obj;
                $scope.customerSearch.address = obj.name;
                $scope.customerSearch.name    = obj.name;
                if (obj.idClientTypeFk=="2"){
                    $scope.select.buildings.selected=$scope.customerFound;
                    if ($scope.sysContent=='listKeys'){
                        $scope.getKeychainListFn($scope.customerFound.idClient,null, $scope.select.filterCategoryKey,"1",$scope.select.idDepartmenKf,($scope.pagination.pageIndex-1),$scope.pagination.pageSizeSelected, false, true);
                        //$scope.getDeptoListByAddress($scope.customerFound.idClient);
                    }else{
                        $scope.getKeychainProcessFn(null,$scope.customerFound.idClient,null,$scope.select.filterCategoryKey,($scope.pagination.pageIndex-1),$scope.pagination.pageSizeSelected, false, true);
                    }
                }else{
                    $scope.rsKeyListsData = [];
                    $scope.select.buildings={'selected':undefined}
                }
                $scope.listCustomerFound=[];
            }
        /**************************************************
        *                                                 *
        *             SYSTEM MENU FUNCTION                *
        *                                                 *
        **************************************************/
            $scope.listItemSelected=null;
            $scope.mainSwitchFn = function(opt1, opt2, obj, obj2){
                switch (opt1){
                    case "dash":
                      switch (fnAction){
                          case "open":
                            $scope.getSysData();
                            $scope.getParameter();
                            $scope.loadParameter(1, 11,'sysParam');
                            $scope.sysContent = 'dashboard';
                          break;
                      }
                    break;
                    case "customers":
                        switch (opt2){
                            case "list":
                                $scope.sysContent                         = "";
                                $scope.pagination.pageIndex               = 1;
                                $scope.customersSearch.isNotCliente       = "0";
                                $scope.customersSearch.isInDebt           = false;
                                $scope.getCustomersListFn(null, "0", null, null, null, null, ($scope.pagination.pageIndex-1), $scope.pagination.pageSizeSelected, null);
                                $scope.select.filterTypeOfClient          = undefined;
                                $scope.select.filterCustomerIdFk={'selected':undefined};
                                $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isInDebt':false, 'isStockInBuilding':false, 'isStockInOffice':false, 'strict':false};
                                $scope.isNewCustomer                      = false;
                                $scope.isUpdateCustomer                   = false;
                                $rootScope.$broadcast('rzSliderForceRender');
                                //$scope.customerPaginationFn($scope.rsCustomerListData, 10);
                                //$scope.loadPagination($scope.rsCustomerListData, "idClientIndex", "10");
                                $scope.sysContent                         = 'registeredCustomers';
                            break;
                            case "checkList":
                                //console.log($scope.select.checkList.selected);
                                if ($scope.select.checkList.selected){
                                    for (var key in $scope.rsCustomerListData){
                                        $scope.rsCustomerListData[key].selected=true;
                                    }
                                }else{
                                    for (var key in $scope.rsCustomerListData){
                                        $scope.rsCustomerListData[key].selected=false;
                                    }
                                }
                                $scope.mainSwitchFn('customers','check_list_item', $scope.rsCustomerListData);
                            break;
                            case "check_list_item":
                                for (var key in obj){
                                    if (obj[key].selected){
                                        $scope.listItemSelected=true;
                                        break;
                                    }else{
                                        $scope.listItemSelected=false;
                                    }
                                }
                            break;
                            case "process_list":
                                var customerSelectedList = [];
                                for (var key in obj){
                                    if (obj[key].selected){
                                        console.log("id: "+obj[key].idClient+", Name: "+obj[key].name+", Selected: "+obj[key].selected);
                                        customerSelectedList.push(obj[key]);
                                    }
                                }
                                if (customerSelectedList.length>0){
                                    var processCustomer = [];
                                    angular.forEach(customerSelectedList,function(customer){
                                        console.log(customer);
                                        var deferredCustomer = $q.defer();
                                        processCustomer.push(deferredCustomer.promise);
                                        console.log(processCustomer);
                                        //CREATE SERVICE
                                        $timeout(function() {
                                            deferredCustomer.resolve();
                                            $scope.mainSwitchFn('customers','create', customer)
                                        }, 1000);
                                    });
                                    $q.all(processCustomer).then(function () {
                                        $timeout(function() {
                                            blockUI.stop();
                                        }, 1500);
                                    });
                                }else{
                                    console.log("nada");
                                }
                            break;
                            case "getAllCustomers":
                                $scope.customersSearch={
                                    "searchFilter":null,
                                    "isNotCliente":"0",
                                    "idClientTypeFk":$scope.customerSearch.typeClient,
                                    "isInDebt":null,
                                    "isStockInBuilding":null,
                                    "isStockInOffice":null,
                                    "start":0,
                                    "limit":null,
                                    "strict":null
                                };
                                CustomerServices.getCustomerListLimit($scope.customersSearch).then(function(response){
                                    //console.info(response.data);
                                    if(response.status==200){
                                        //console.log(response.data.customers);
                                        if (response.data.customers.length>0){
                                            var processCustomer = [];
                                            angular.forEach(response.data.customers,function(customer){
                                                console.log(customer);
                                                var deferredCustomer = $q.defer();
                                                processCustomer.push(deferredCustomer.promise);
                                                console.log(processCustomer);
                                                //CREATE SERVICE
                                                $timeout(function() {
                                                    deferredCustomer.resolve();
                                                    $scope.mainSwitchFn('customers','create', customer)
                                                }, 1000);
                                            });
                                            $q.all(processCustomer).then(function () {
                                                $timeout(function() {
                                                    blockUI.stop();
                                                }, 1500);
                                            });
                                        }else{
                                            console.log("nada");
                                        }
                                    }else if(response.status==404){
                                        console.log(response);
                                    }
                                });
                            break;
                            case "create":
                                console.log(obj);
                                $scope.services_to_add = [];
                                var currentDate        = new Date();
                                var rawDate            = moment(currentDate).toDate();
                                var formatedDate       = moment(rawDate).format('YYYY-MM-DD');
                                ContractServices.getContractListByCustomerId(obj.idClient).then(function(response){
                                    console.log(formatedDate);
                                    if(response.status==200){
                                        $scope.rsContractNotFound=false;
                                        $scope.rsContractsListByCustomerIdData=response.data;
                                        console.info(response.data);
                                        for (var key in response.data){
                                            console.info(response.data[key].idContrato+" - "+response.data[key].numeroContrato);
                                            for (var srv in response.data[key].services){
                                                console.info("   * "+response.data[key].services[srv].idServiceType+" - "+response.data[key].services[srv].serviceName);
                                                switch (response.data[key].services[srv].idServiceType){
                                                    case "1": //CONTROL ACCESS
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].idAccCrtlDoor+" - "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].available+"]");
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].available; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        'idDoorFk': response.data[key].services[srv].service_items[crt].idAccCrtlDoor,
                                                                        "name": "",
                                                                        "MntType": response.data[key].description,
                                                                        "dateDown": null,
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": null,
                                                                        "addressVpn": null,
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "",
                                                                        "observation":"",
                                                                        "aclaration": "No corresponde",
                                                                        "locationGabinet": "No corresponde",
                                                                        "isBlocklingScrew": "0",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "No corresponde",
                                                                        "locationOffKey": "No corresponde",
                                                                        "portNumberRouter": null,
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": null,
                                                                        "pass": null,
                                                                        "useVpn": null,
                                                                        "passVpn": null,
                                                                        "portVpn": null,
                                                                        "isSysUser": false,
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": "1",
                                                                        "idServiceType": "1",
                                                                        "idAccessControlFk": "88",
                                                                        "lock": "56",
                                                                        "idInputReaderFk": "60",
                                                                        "ouputReader": "60",
                                                                        "ouputButom": null,
                                                                        "idFontFk": "43",
                                                                        "idEmergencyButtonFk": "61",
                                                                        "idShutdownKeyFk": "31",
                                                                        "battery_install": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idBatteryFk": "62",
                                                                                "descriptionProduct": "NO    CORRESPONDE",
                                                                                "model": "NO    CORRESPONDE",
                                                                                "brand": "NO    CORRESPONDE",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "5",
                                                                                "classification": "BATERIA",
                                                                                "description": "BATERIA",
                                                                                "isNew": 1
                                                                            }
                                                                        ],
                                                                        "open_devices": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idOpenDevice": "32",
                                                                                "descriptionProduct": "LLAVERO HID SEOS EXCLUSIVO",
                                                                                "model": "SEOS EX",
                                                                                "brand": "HID",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "idProductClassification": "19",
                                                                                "classification": "DISPOSITIVO DE APERTURA",
                                                                                "numberSerieInternal": null,
                                                                                "numberSerieFabric": null,
                                                                                "dateExpiration": null,
                                                                                "isNew": 1
                                                                            }
                                                                        ],
                                                                        "isOuputReader": "1",
                                                                        "isOuputButom": null,
                                                                        "acaration2": null,
                                                                        "addressClient": null,
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "56",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "43",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 2,
                                                                                "idProductoFk": "60",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": "entrance"
                                                                            },
                                                                            {
                                                                                "idProductDetail": 3,
                                                                                "idProductoFk": "29",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 4,
                                                                                "idProductoFk": "60",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": "exit"
                                                                            },
                                                                            {
                                                                                "idProductDetail": 5,
                                                                                "idProductoFk": "61",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 6,
                                                                                "idProductoFk": "31",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                    ]});
                                                                }
                                                        }
                                                    break;
                                                    case "2": //INTERNET
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].idAccCrtlDoor+" - "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                                if (response.data[key].services[srv].service_items[crt].used==0){
                                                                    for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                        $scope.services_to_add.push({
                                                                            'idClientFk': obj.idClient,
                                                                            'clientName': obj.name,
                                                                            'dateUp': formatedDate,
                                                                            'idContratoFk': response.data[key].idContrato,
                                                                            'idContracAssociatedFk': response.data[key].idContrato,
                                                                            'idContracAssociated_SE' : response.data[key].idContrato,
                                                                            'contractNumb': response.data[key].numeroContrato,
                                                                            'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                            "MntType": response.data[key].description,
                                                                            "name": "",
                                                                            "dateDown": null,
                                                                            "location": "",
                                                                            "maxCamera": "",
                                                                            "zonesQttyInstalled": "",
                                                                            "isHasInternetConnect": 0,
                                                                            "numberPortRouter": "",
                                                                            "addessClient": null,
                                                                            "portHttp": "",
                                                                            "addressVpn": "",
                                                                            "namePort1": "",
                                                                            "nroPort1": "",
                                                                            "namePort2": "",
                                                                            "nroPort2": "",
                                                                            "generalComments": "",
                                                                            "aclaration": "",
                                                                            "locationGabinet": "",
                                                                            "isBlocklingScrew": "",
                                                                            "lockingScrewComment": "",
                                                                            "locationEmergencyButton": "",
                                                                            "locationOffKey": "",
                                                                            "portNumberRouter": "",
                                                                            "idTipoConexionRemoto": "",
                                                                            "isSysUser": false,
                                                                            "people": {},
                                                                            "serviceName": "INTERNET",
                                                                            "idTipeServiceFk": "2",
                                                                            "idServiceType": "2",
                                                                            "idTypeInternetFk": response.data[key].services[srv].service_items[crt].idAccCrtlDoor,
                                                                            "idInternetCompanyFk": "1",
                                                                            "idServiceFk": "1",
                                                                            "idServiceAsociateFk": [
                                                                            ],
                                                                            "port": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"1":null,
                                                                            "macAddr": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"2C-54-91-88-C9-E3":null,
                                                                            "userAdmin": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "passAdmin": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "userWifi": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "passWifi": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "idRouterInternetFk": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"55":null,
                                                                            "idModemInternetFk": "63",
                                                                            "macAddress": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"2C-54-91-88-C9-E3":null,
                                                                            "numberLine": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?null:"1",
                                                                            "numberChip": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?null:"1",
                                                                            "isDown": null,
                                                                            "adicional": [
                                                                                {
                                                                                    "idProductDetail": 0,
                                                                                    "idProductoFk": "55",
                                                                                    "numberSerieFabric": ".",
                                                                                    "numberSerieInternal": null,
                                                                                    "dateExpiration": null,
                                                                                    "optAux": null
                                                                                },
                                                                                {
                                                                                    "idProductDetail": 1,
                                                                                    "idProductoFk": "63",
                                                                                    "numberSerieFabric": null,
                                                                                    "numberSerieInternal": null,
                                                                                    "dateExpiration": null,
                                                                                    "optAux": null
                                                                                }
                                                                            ]
                                                                        });
                                                                    }
                                                                }
                                                        }
                                                    break;
                                                    case "3": //TOTEM
                                                    case "4": //CAMERA
                                                        $scope.list_cameras=[];
                                                        $scope.idDvr_nvrFk
                                                        $scope.idDvr1=null;
                                                        $scope.idDvr2=null;
                                                        $scope.idDvrCh=null;
                                                        $scope.dvCh1=0;
                                                        $scope.dvCh2=0;
                                                        $scope.cameraServices=0;
                                                        $scope.totalAvailableCameras=0;
                                                        $scope.totalCameras=0;
                                                        $scope.totalCamerasUsed=0;
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if ($scope.totalAvailableCameras==0){
                                                                $scope.totalAvailableCameras = Number(response.data[key].services[srv].service_items[crt].available);
                                                            }else{
                                                                $scope.totalAvailableCameras = Number($scope.totalAvailableCameras)+Number(response.data[key].services[srv].service_items[crt].available);
                                                            }
                                                            if ($scope.totalCameras==0){
                                                                $scope.totalCameras = Number(response.data[key].services[srv].service_items[crt].qtty);
                                                            }else{
                                                                $scope.totalCameras = Number($scope.totalCameras)+Number(response.data[key].services[srv].service_items[crt].qtty);
                                                            }
                                                        }
                                                        $scope.totalCamerasUsed=($scope.totalCameras-$scope.totalAvailableCameras);
                                                        console.log("$scope.totalCameras: "+$scope.totalCameras);
                                                        console.log("$scope.totalAvailableCameras: "+$scope.totalAvailableCameras);
                                                        console.log("$scope.totalCamerasUsed: "+$scope.totalCamerasUsed);
                                                        if ($scope.totalCameras>0){
                                                            if ($scope.totalCamerasUsed==0 || $scope.totalCamerasUsed < $scope.totalCameras){
                                                                if ($scope.totalAvailableCameras<=4){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=48
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=4; //4 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>4 && $scope.totalAvailableCameras<=8){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=75
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=8; //8 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>=9 && $scope.totalAvailableCameras<=16){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>16 && $scope.totalAvailableCameras<=20){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=48;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=4; //4 Ch
                                                                }else if ($scope.totalAvailableCameras>16 && $scope.totalAvailableCameras<=24){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=75;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=8; //8 Ch
                                                                }else if ($scope.totalAvailableCameras>24 && $scope.totalAvailableCameras<=32){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=74;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=16; //16 Ch
                                                                }
                                                                console.log($scope.cameraServices);
                                                                for (var s = 0; s < $scope.cameraServices; s++) {
                                                                    var qttyCamerasEachService = 0;
                                                                    if (s==0){
                                                                        if ($scope.totalAvailableCameras>$scope.dvCh1 || $scope.totalAvailableCameras==$scope.dvCh1){
                                                                            qttyCamerasEachService=$scope.dvCh1;
                                                                        }else{
                                                                            qttyCamerasEachService=$scope.totalAvailableCameras;
                                                                        }
                                                                    }else{
                                                                        if (($scope.totalAvailableCameras-$scope.dvCh1)>$scope.dvCh2 || ($scope.totalAvailableCameras-$scope.dvCh1)==$scope.dvCh2){
                                                                            qttyCamerasEachService=$scope.dvCh2;
                                                                        }else{
                                                                            qttyCamerasEachService=($scope.totalAvailableCameras-$scope.dvCh1);
                                                                        }
                                                                    }
                                                                    console.log("qttyCamerasEachService:" +qttyCamerasEachService);
                                                                    $scope.list_cameras=[];
                                                                    for (var i = 0; i < qttyCamerasEachService; i++) {
                                                                        $scope.list_cameras.push(
                                                                            {
                                                                                "idProductFk": "49",
                                                                                "idCameraFk": "49",
                                                                                "portCamera": (i+1),
                                                                                "coveredArea": ".",
                                                                                "locationCamera": ".",
                                                                                "descriptionProduct": "DOMO CCTV",
                                                                                "model": "DOMO CCTV",
                                                                                "brand": "SIN DATO",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "1",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": ".",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "11",
                                                                                "classification": "CAMARA",
                                                                                "nroSerieCamera": null,
                                                                                "nroFabricCamera": ".",
                                                                                "dateExpireCamera": null,
                                                                                "isNew": 1
                                                                        });
                                                                    };
                                                                    console.log($scope.list_cameras);
                                                                    $scope.idDvr_nvrFk=s==0?$scope.idDvr1:$scope.idDvr2;
                                                                    $scope.idDvrCh=s==0?$scope.dvCh1:$scope.dvCh2;
                                                                    console.log("$scope.idDvr_nvrFk: "+$scope.idDvr_nvrFk);
                                                                    console.log("$scope.idDvrCh: "+$scope.idDvrCh);
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "Camara/Totem test",
                                                                        "dateDown": null,
                                                                        "location": "NO CORRESPONDE",
                                                                        "maxCamera": $scope.idDvrCh,
                                                                        "portNumberRouter": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": true,
                                                                        "numberPortRouter": "1",
                                                                        "addessClient": "NO CORRESPONDE",
                                                                        "portHttp": "1111",
                                                                        "addressVpn": "NO CORRESPONDE",
                                                                        "namePort1": "HTTPS",
                                                                        "nroPort1": "443",
                                                                        "namePort2": "SERVIDOR",
                                                                        "nroPort2": "8000",
                                                                        "generalComments": "NO CORRESPONDE",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "namePort": "RTSP",
                                                                        "port": "554",
                                                                        "idDvr_nvrFk": $scope.idDvr_nvrFk,
                                                                        "observation": "NO CORRESPONDE",
                                                                        "idTotenModelFk": "1",
                                                                        "idCompanyFk": "1",
                                                                        "numberAbonado": "12345678",
                                                                        "addressClientInter": "NO CORRESPONDE",
                                                                        "backup_energy": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idBatteryFk": "62",
                                                                                "descriptionProduct": "NO    CORRESPONDE",
                                                                                "model": "NO    CORRESPONDE",
                                                                                "brand": "NO    CORRESPONDE",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "5",
                                                                                "classification": "BATERIA",
                                                                                "description": "BATERIA",
                                                                                "isNew": 1,
                                                                                "$$hashKey": "object:12230"
                                                                            }
                                                                        ],
                                                                        "cameras": $scope.list_cameras,
                                                                        "clients": [
                                                                            {
                                                                                "idItem": 1,
                                                                                "name": "admin",
                                                                                "user": "admin",
                                                                                "pass": "admin",
                                                                                "profile": "admin",
                                                                                "userProfile": "admin",
                                                                                "qrCode": "data:image/png;base64,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",
                                                                                "qrBase64": "data:image/png;base64,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"
                                                                            }
                                                                        ],
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "74",
                                                                                "numberSerieFabric": ".",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "62",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                        ]
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    break;
                                                    case "5": //ALARM
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if (response.data[key].services[srv].service_items[crt].used==0){
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "Alarma test",
                                                                        "dateDown": "",
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": "",
                                                                        "addressVpn": "",
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "portNumberRouter": "",
                                                                        "idTipoConexionRemoto": "1",
                                                                        "idTypeConectionRemote": "1",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "useVpn": "",
                                                                        "passVpn": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "numbOfLicence": 0,
                                                                        "idCompanyMonitorFK": "1",
                                                                        "numberCustomer": "12345678",
                                                                        "observation": "SIN DATO",
                                                                        "tipo_conexion_remoto": [
                                                                            {
                                                                                "idTipoConexionRemoto": "1",
                                                                                "data": {
                                                                                    "ipAlarmModule": {},
                                                                                    "gprsAlarmModule": {},
                                                                                    "details": true,
                                                                                    "company": "123213213213213",
                                                                                    "line": "Personal",
                                                                                    "idTipoConexionRemoto": "1"
                                                                                },
                                                                                "$$hashKey": "object:24185"
                                                                            }
                                                                        ],
                                                                        "adicional_alarmar": [
                                                                            {
                                                                                "sysUser": {},
                                                                                "fk_idTipoCliente": "4",
                                                                                "typeOfClient_others": "SIN DATO",
                                                                                "nombresEncargadoManual": "SIN DATO",
                                                                                "telefono": "+54 (011) (15) 3152-2434",
                                                                                "calles_laterales": "SIN DATO",
                                                                                "calle_trasera": "SIN DATO",
                                                                                "mail_reporte": "nocorresponde@nada.com",
                                                                                "fk_idFormatoTransmision": "1",
                                                                                "fk_idAutomarcado": "0",
                                                                                "horario_automarcado": "",
                                                                                "n_usuario_asalto": "SIN DATO",
                                                                                "contrasena_asalto": "SIN DATO",
                                                                                "comisaria": "SIN DATO",
                                                                                "tlf_comisaria": "SIN DATO",
                                                                                "servicio_emergencia_medica": "SIN DATO",
                                                                                "n_de_socio": "SIN DATO",
                                                                                "plan": "SIN DATO",
                                                                                "observacion_general": "SIN DATO",
                                                                                "fk_idEncargado": null,
                                                                                "franjas_horarias": [
                                                                                    {
                                                                                        "day": "Lunes",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Martes",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Miercoles",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Jueves",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    }
                                                                                ],
                                                                                "personas_para_dar_aviso": [
                                                                                    {
                                                                                        "id": 1,
                                                                                        "fk_idUserSystema": null,
                                                                                        "nombre_apellido": "SIN DATO",
                                                                                        "vinculo": "SIN DATO",
                                                                                        "palabra_clave": "SIN DATO",
                                                                                        "telefono": "+54 (011) (15) 1111-1111",
                                                                                        "numero_del_usuario": "111",
                                                                                        "opt": "getnotice",
                                                                                        "$$hashKey": "object:23928"
                                                                                    }
                                                                                ],
                                                                                "personas_para_verificar_en_el_lugar": [
                                                                                    {
                                                                                        "id": 1,
                                                                                        "fk_idUserSystema": null,
                                                                                        "nombre_apellido": "SIN DATO",
                                                                                        "vinculo": "SIN DATO",
                                                                                        "telefono": "+54 (011) (15) 1111-1111",
                                                                                        "numero_del_usuario": "2222",
                                                                                        "opt": "verifyplace",
                                                                                        "$$hashKey": "object:23937"
                                                                                    }
                                                                                ],
                                                                                "fk_idServiciosAdicionales": [
                                                                                    "1"
                                                                                ]
                                                                            }
                                                                        ],
                                                                        "sensores_de_alarmas": [
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 1,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:23777"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 2,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:23974"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 3,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:24008"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 4,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:24040"
                                                                            }
                                                                        ],
                                                                        "companyMonitor": "1",
                                                                        "numberPay": "12345678",
                                                                        "panelAlarm": "50",
                                                                        "keyboardAlarm": "51",
                                                                        "countZoneIntaled": "4",
                                                                        "idTypeConectionRemote": "",
                                                                        "baterias_instaladas": [
                                                                            {
                                                                                "idProductoFk": "62",
                                                                                "nroFabric": null,
                                                                                "nroInternal": null,
                                                                                "dateExpired": null
                                                                            }
                                                                        ],
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "50",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "51",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                        ]
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    break;
                                                    case "6": //APP MONITOR
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if (response.data[key].services[srv].service_items[crt].used==0){
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "APP Monitor test",
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "dateDown": null,
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": "",
                                                                        "addressVpn": "",
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "NO CORRESPONDE",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "portNumberRouter": "",
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "useVpn": "",
                                                                        "passVpn": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "numbOfLicence": 0,
                                                                        "sucribeNumber": "12345678",
                                                                        "idCompanyMonitorFK": "1",
                                                                        "observation": "NO CORRESPONDE",
                                                                        "licenses": [],
                                                                        "countNewLicense": 3,
                                                                        "idApplicationFk": "1",
                                                                        "passwordApp": null,
                                                                        "adicional": {}
                                                                    });
                                                                }
                                                            }
                                                        }
                                                        
                                                    break;
                                                }
                                            }
                                        }                                        
                                    }else{
                                        $scope.rsContractsListByCustomerIdData=[];
                                        $scope.rsContractNotFound=true;
                                        inform.add('No se existen contratos asociados al cliente. ',{
                                                ttl:2000, type: 'warning'
                                        });
                                    }
                                    //console.log($scope.rsContractsListByCustomerIdData);
                                    console.info($scope.services_to_add);
                                    //blockUI.start('Registrando servicios.');
                                    console.log($scope.services_to_add.length)
                                    if ($scope.services_to_add.length>0){
                                        var createdService = [];
                                        angular.forEach($scope.services_to_add,function(service){
                                            var deferredService = $q.defer();
                                            createdService.push(deferredService.promise);
                                            //CREATE SERVICE
                                            $timeout(function() {
                                                deferredService.resolve();
                                                serviceServices.addService(service).then(function(response){
                                                    if(response.status==200){
                                                        console.log("Customer Service Successfully Created");
                                                        inform.add('Servicio de '+service.serviceName+' del cliente '+service.clientName+' han sido creados con exito. ',{
                                                            ttl:2000, type: 'success'
                                                        });
                                                    }else if($scope.rsJsonData.status==500){
                                                        console.log("Customer Service not Created, contact administrator");
                                                        inform.add('Error: [500] Contacta al area de soporte. ',{
                                                            ttl:2000, type: 'danger'
                                                        });
                                                    }
                                                });
                                            }, 1000);
                                        });
                                        
                                        $q.all(createdService).then(function () {
                                            $timeout(function() {
                                                blockUI.stop();
                                            }, 2000);
                                        });
                                    }else{
                                        inform.add('El Cliente '+obj.name+', no posee servicios, disponibles para crear, seleccione otro cliente. ',{
                                            ttl:8000, type: 'info'
                                        });
                                    }
                                });
                            break;

                        }
                    break;
                    case "keys":
                        switch (opt2){
                            case "list":
                                $rootScope.$broadcast('rzSliderForceRender');
                                $scope.sysContent     = "";
                                $scope.isNewKeySingle = false;
                                $scope.isEditKey      = false;
                                $scope.isNewKeyMulti  = false;
                                $scope.rsKeyListsData = null;
                                $scope.pagination.pageIndex               = 1;
                                $scope.keychainSearch={
                                "idClientKf":null,
                                "idCategoryKf":null,
                                "idKeychainStatusKf":null,
                                "create_at":null,
                                "start":null,
                                "limit":null,
                                "strict":null,
                                "totalCount":null,
                                };
                                $scope.customerFound={};
                                $scope.customerSearch.name=undefined;
                                $scope.select={'filterCustomerIdFk':{'selected':undefined},'filterCategoryKey':'', 'department':'', 'keychainStatus':{}, 'idTypeTicketKf':null,  
                                'companies':{'selected':undefined}, 'address':{'selected':undefined}, 'products':{'selected':undefined}, 
                                'products_reserva':{'selected':undefined}, 'products_cocheras':{'selected':undefined}}
                                $scope.getKeychainListFn(null,null,null,"1",null,($scope.pagination.pageIndex-1),$scope.pagination.pageSizeSelected, false, true);
                                $scope.customerFound={};
                                //$("#categoryKeyAll").prop("checked", true);
                                //$("#categoryKeyAll").val("undefined");
                                $scope.sysContent                         = 'listKeys';
                            break;
                            case "checkList":
                                //console.log($scope.select.checkList.selected);
                                if ($scope.select.checkList.selected){
                                    for (var key in $scope.rsAllKeychainListData){
                                        $scope.rsAllKeychainListData[key].selected=true;
                                    }
                                }else{
                                    for (var key in $scope.rsAllKeychainListData){
                                        $scope.rsAllKeychainListData[key].selected=false;
                                    }
                                }
                                $scope.mainSwitchFn('keys','check_list_item', $scope.rsAllKeychainListData);
                            break;
                            case "check_list_item":
                                for (var key in obj){
                                    if (obj[key].selected){
                                        $scope.listItemSelected=true;
                                        break;
                                    }else{
                                        $scope.listItemSelected=false;
                                    }
                                }
                            break;
                            case "deleteKey_init":
                                $scope.getDisabledReasonKeyFn();
                                $scope.isNewKeySingle = false;
                                $scope.isEditKey      = false;
                                $scope.isNewKeyMulti  = false;
                                $scope.isDeleteKeyMulti=true;
                                //console.log(obj);
                                $scope.keys={'llavero':{},'update':{'reason':null, 'keyList':{}, 'description':''}};
                                $scope.keys.update.keyList = [];
                                for (var key in obj){
                                    if (obj[key].selected){
                                        //console.log("id: "+obj[key].idClient+", Name: "+obj[key].name+", Selected: "+obj[key].selected);
                                        $scope.keys.update.keyList.push(obj[key]);
                                    }
                                }
                                obj;
                                $('#deleteKeys').modal({backdrop: 'static', keyboard: false});
                                $('#deleteKeys').on('shown.bs.modal', function () {
                                    $('#descriptionField').focus();
                                    $scope.keys.update.reason="4";
                                    console.log($scope.keys.update);
                                });
                            break;
                            case "deleteKey":
                                console.log(obj);
                                $scope.keys.llavero.idKeychain          = obj.idKeychain;
                                $scope.keys.llavero.idKeychainKf        = obj.idKeychain;
                                $scope.keys.llavero.idKeychainStatusKf  = "-1";
                                $scope.keys.llavero.idProductKf         = obj.idProductKf;
                                $scope.keys.llavero.codExt              = obj.codigoExt==undefined?null:obj.codigoExt;
                                $scope.keys.llavero.codigo              = obj.codigo==undefined?null:obj.codigo;
                                $scope.keys.llavero.idDepartmenKf       = obj.idCategoryKf=="1"?obj.idDepartmenKf:null;
                                $scope.keys.llavero.idClientKf          = obj.idClientKf;
                                $scope.keys.llavero.idUserKf            = null;
                                $scope.keys.llavero.idCategoryKf        = obj.idCategoryKf;
                                $scope.keys.llavero.isKeyTenantOnly     = null;
                                $scope.keys.llavero.idTypeTicketKf      = 2;
                                $scope.keys.llavero.idReasonKf          = 4
                                $scope.keys.llavero.description         = $scope.keys.update.description!=undefined?$scope.keys.update.description:null;
                                $scope.keys.llavero.idClientAdminKf     = obj.idCategoryKf=="5"?null:obj.idClientAdminKf;
                                $scope.keys.llavero.createdBy           = $scope.sysLoggedUser.idUser;
                                $scope.keys.llavero.idKeychainUserLast  = obj.idUserKf!=null && obj.idUserKf!=undefined?obj.idUserKf:null;
                                $scope.keys.llavero.idClientAdminLast   = obj.idCategoryKf=="5"?null:obj.idClientAdminKf;
                                console.log($scope.keys.llavero);
                                //$scope.deleteKeyFn($scope.keys);
                                angular.forEach($scope.keys, function(key) {
                                    console.log(key);
                                    (function(keyCopy) {
                                        console.log(keyCopy);
                                        KeysServices.updateKey(keyCopy).then(function(response) {
                                            if(response.status == 200) {
                                                KeysServices.addProcessEvent(keyCopy).then(function(response_keychain_process) {
                                                    if(response_keychain_process.status == 200) {
                                                        console.log("Key (" + keyCopy.llavero.codigo + ") Successfully deleted");
                                                    }
                                                });
                                            }
                                        });
                                    })({...key}); // Using a copy of `key` in each iteration
                                });
                            break;
                            case "process_list":
                                var keysSelectedList = [];
                                for (var key in obj.keyList){
                                    if (obj.keyList[key].selected){
                                        //console.log("id: "+obj[key].idClient+", Name: "+obj[key].name+", Selected: "+obj[key].selected);
                                        keysSelectedList.push(obj.keyList[key]);
                                    }
                                }
                                if (keysSelectedList.length>0){
                                    var processKeyList = [];
                                    angular.forEach(keysSelectedList, function (key) {
                                        if (key.selected) {
                                            var deferredKeyList = $q.defer();
                                            processKeyList.push(deferredKeyList.promise);
                                    
                                            // Create a unique copy of the keychain data for this iteration
                                            let keyData = {
                                                llavero: {
                                                    idKeychain: key.idKeychain,
                                                    idKeychainKf: key.idKeychain,
                                                    idKeychainStatusKf: "-1",
                                                    idProductKf: key.idProductKf,
                                                    codExt: key.codigoExt || null,
                                                    codigo: key.codigo || null,
                                                    idDepartmenKf: key.idCategoryKf === "1" ? key.idDepartmenKf : null,
                                                    idClientKf: key.idClientKf,
                                                    idUserKf: null,
                                                    idCategoryKf: key.idCategoryKf,
                                                    isKeyTenantOnly: null,
                                                    idTypeTicketKf: 2,
                                                    idReasonKf: 4,
                                                    description: $scope.keys.update?.description || null,
                                                    idClientAdminKf: key.idCategoryKf === "5" ? null : key.idClientAdminKf,
                                                    createdBy: $scope.sysLoggedUser.idUser,
                                                    idKeychainUserLast: key.idUserKf || null,
                                                    idClientAdminLast: key.idCategoryKf === "5" ? null : key.idClientAdminKf,
                                                },
                                            };
                                    
                                            console.log(keyData);
                                            $timeout(function() {
                                                $scope.deleteKeyFn(keyData);
                                                $scope.addProcessEventFn(keyData);
                                            }, 1500);
                                            $timeout(function() {
                                                deferredKeyList.resolve();
                                            }, 1500);
                                        }
                                    });
                                    $q.all(processKeyList).then(function () {
                                        $timeout(function() {
                                            inform.add('Los ('+obj.keyList.length+') han sido Eliminados con exito. ',{
                                                ttl:5000, type: 'success'
                                            });
                                            $scope.getKeychainListFn($scope.customerFound.idClient,null,$scope.select.filterCategoryKey,1,null,($scope.pagination.pageIndex-1),$scope.pagination.pageSizeSelected, false, true);
                                            $('#deleteKeys').modal('hide');
                                            blockUI.stop();
                                        }, 3000);
                                    });
                                }else{
                                    console.log("nada");
                                    inform.add('[Aviso]: Selecciona nuevamente los llaveros de la pagina actual para procesar la lista, en caso de error con contacta el area de soporte. ',{
                                        ttl:8000, type: 'warning'
                                      });
                                }
                            break;
                            case "getAllCustomers":
                                $scope.customersSearch={
                                    "searchFilter":null,
                                    "isNotCliente":"0",
                                    "idClientTypeFk":$scope.customerSearch.typeClient,
                                    "isInDebt":null,
                                    "isStockInBuilding":null,
                                    "isStockInOffice":null,
                                    "start":0,
                                    "limit":null,
                                    "strict":null
                                };
                                CustomerServices.getCustomerListLimit($scope.customersSearch).then(function(response){
                                    //console.info(response.data);
                                    if(response.status==200){
                                        //console.log(response.data.customers);
                                        if (response.data.customers.length>0){
                                            var processCustomer = [];
                                            angular.forEach(response.data.customers,function(customer){
                                                console.log(customer);
                                                var deferredCustomer = $q.defer();
                                                processCustomer.push(deferredCustomer.promise);
                                                console.log(processCustomer);
                                                //CREATE SERVICE
                                                $timeout(function() {
                                                    deferredCustomer.resolve();
                                                    $scope.mainSwitchFn('customers','create', customer)
                                                }, 1000);
                                            });
                                            $q.all(processCustomer).then(function () {
                                                $timeout(function() {
                                                    blockUI.stop();
                                                }, 1500);
                                            });
                                        }else{
                                            console.log("nada");
                                        }
                                    }else if(response.status==404){
                                        console.log(response);
                                    }
                                });
                            break;
                            case "create":
                                console.log(obj);
                                $scope.services_to_add = [];
                                var currentDate        = new Date();
                                var rawDate            = moment(currentDate).toDate();
                                var formatedDate       = moment(rawDate).format('YYYY-MM-DD');
                                ContractServices.getContractListByCustomerId(obj.idClient).then(function(response){
                                    console.log(formatedDate);
                                    if(response.status==200){
                                        $scope.rsContractNotFound=false;
                                        $scope.rsContractsListByCustomerIdData=response.data;
                                        console.info(response.data);
                                        for (var key in response.data){
                                            console.info(response.data[key].idContrato+" - "+response.data[key].numeroContrato);
                                            for (var srv in response.data[key].services){
                                                console.info("   * "+response.data[key].services[srv].idServiceType+" - "+response.data[key].services[srv].serviceName);
                                                switch (response.data[key].services[srv].idServiceType){
                                                    case "1": //CONTROL ACCESS
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].idAccCrtlDoor+" - "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].available+"]");
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].available; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        'idDoorFk': response.data[key].services[srv].service_items[crt].idAccCrtlDoor,
                                                                        "name": "",
                                                                        "MntType": response.data[key].description,
                                                                        "dateDown": null,
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": null,
                                                                        "addressVpn": null,
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "",
                                                                        "observation":"",
                                                                        "aclaration": "No corresponde",
                                                                        "locationGabinet": "No corresponde",
                                                                        "isBlocklingScrew": "0",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "No corresponde",
                                                                        "locationOffKey": "No corresponde",
                                                                        "portNumberRouter": null,
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": null,
                                                                        "pass": null,
                                                                        "useVpn": null,
                                                                        "passVpn": null,
                                                                        "portVpn": null,
                                                                        "isSysUser": false,
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": "1",
                                                                        "idServiceType": "1",
                                                                        "idAccessControlFk": "88",
                                                                        "lock": "56",
                                                                        "idInputReaderFk": "60",
                                                                        "ouputReader": "60",
                                                                        "ouputButom": null,
                                                                        "idFontFk": "43",
                                                                        "idEmergencyButtonFk": "61",
                                                                        "idShutdownKeyFk": "31",
                                                                        "battery_install": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idBatteryFk": "62",
                                                                                "descriptionProduct": "NO    CORRESPONDE",
                                                                                "model": "NO    CORRESPONDE",
                                                                                "brand": "NO    CORRESPONDE",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "5",
                                                                                "classification": "BATERIA",
                                                                                "description": "BATERIA",
                                                                                "isNew": 1
                                                                            }
                                                                        ],
                                                                        "open_devices": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idOpenDevice": "32",
                                                                                "descriptionProduct": "LLAVERO HID SEOS EXCLUSIVO",
                                                                                "model": "SEOS EX",
                                                                                "brand": "HID",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "idProductClassification": "19",
                                                                                "classification": "DISPOSITIVO DE APERTURA",
                                                                                "numberSerieInternal": null,
                                                                                "numberSerieFabric": null,
                                                                                "dateExpiration": null,
                                                                                "isNew": 1
                                                                            }
                                                                        ],
                                                                        "isOuputReader": "1",
                                                                        "isOuputButom": null,
                                                                        "acaration2": null,
                                                                        "addressClient": null,
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "56",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "43",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 2,
                                                                                "idProductoFk": "60",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": "entrance"
                                                                            },
                                                                            {
                                                                                "idProductDetail": 3,
                                                                                "idProductoFk": "29",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 4,
                                                                                "idProductoFk": "60",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": "exit"
                                                                            },
                                                                            {
                                                                                "idProductDetail": 5,
                                                                                "idProductoFk": "61",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 6,
                                                                                "idProductoFk": "31",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                    ]});
                                                                }
                                                        }
                                                    break;
                                                    case "2": //INTERNET
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].idAccCrtlDoor+" - "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                                if (response.data[key].services[srv].service_items[crt].used==0){
                                                                    for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                        $scope.services_to_add.push({
                                                                            'idClientFk': obj.idClient,
                                                                            'clientName': obj.name,
                                                                            'dateUp': formatedDate,
                                                                            'idContratoFk': response.data[key].idContrato,
                                                                            'idContracAssociatedFk': response.data[key].idContrato,
                                                                            'idContracAssociated_SE' : response.data[key].idContrato,
                                                                            'contractNumb': response.data[key].numeroContrato,
                                                                            'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                            "MntType": response.data[key].description,
                                                                            "name": "",
                                                                            "dateDown": null,
                                                                            "location": "",
                                                                            "maxCamera": "",
                                                                            "zonesQttyInstalled": "",
                                                                            "isHasInternetConnect": 0,
                                                                            "numberPortRouter": "",
                                                                            "addessClient": null,
                                                                            "portHttp": "",
                                                                            "addressVpn": "",
                                                                            "namePort1": "",
                                                                            "nroPort1": "",
                                                                            "namePort2": "",
                                                                            "nroPort2": "",
                                                                            "generalComments": "",
                                                                            "aclaration": "",
                                                                            "locationGabinet": "",
                                                                            "isBlocklingScrew": "",
                                                                            "lockingScrewComment": "",
                                                                            "locationEmergencyButton": "",
                                                                            "locationOffKey": "",
                                                                            "portNumberRouter": "",
                                                                            "idTipoConexionRemoto": "",
                                                                            "isSysUser": false,
                                                                            "people": {},
                                                                            "serviceName": "INTERNET",
                                                                            "idTipeServiceFk": "2",
                                                                            "idServiceType": "2",
                                                                            "idTypeInternetFk": response.data[key].services[srv].service_items[crt].idAccCrtlDoor,
                                                                            "idInternetCompanyFk": "1",
                                                                            "idServiceFk": "1",
                                                                            "idServiceAsociateFk": [
                                                                            ],
                                                                            "port": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"1":null,
                                                                            "macAddr": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"2C-54-91-88-C9-E3":null,
                                                                            "userAdmin": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "passAdmin": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "userWifi": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "passWifi": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"admin":null,
                                                                            "idRouterInternetFk": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"55":null,
                                                                            "idModemInternetFk": "63",
                                                                            "macAddress": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?"2C-54-91-88-C9-E3":null,
                                                                            "numberLine": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?null:"1",
                                                                            "numberChip": response.data[key].services[srv].service_items[crt].idAccCrtlDoor<="2"?null:"1",
                                                                            "isDown": null,
                                                                            "adicional": [
                                                                                {
                                                                                    "idProductDetail": 0,
                                                                                    "idProductoFk": "55",
                                                                                    "numberSerieFabric": ".",
                                                                                    "numberSerieInternal": null,
                                                                                    "dateExpiration": null,
                                                                                    "optAux": null
                                                                                },
                                                                                {
                                                                                    "idProductDetail": 1,
                                                                                    "idProductoFk": "63",
                                                                                    "numberSerieFabric": null,
                                                                                    "numberSerieInternal": null,
                                                                                    "dateExpiration": null,
                                                                                    "optAux": null
                                                                                }
                                                                            ]
                                                                        });
                                                                    }
                                                                }
                                                        }
                                                    break;
                                                    case "3": //TOTEM
                                                    case "4": //CAMERA
                                                        $scope.list_cameras=[];
                                                        $scope.idDvr_nvrFk
                                                        $scope.idDvr1=null;
                                                        $scope.idDvr2=null;
                                                        $scope.idDvrCh=null;
                                                        $scope.dvCh1=0;
                                                        $scope.dvCh2=0;
                                                        $scope.cameraServices=0;
                                                        $scope.totalAvailableCameras=0;
                                                        $scope.totalCameras=0;
                                                        $scope.totalCamerasUsed=0;
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if ($scope.totalAvailableCameras==0){
                                                                $scope.totalAvailableCameras = Number(response.data[key].services[srv].service_items[crt].available);
                                                            }else{
                                                                $scope.totalAvailableCameras = Number($scope.totalAvailableCameras)+Number(response.data[key].services[srv].service_items[crt].available);
                                                            }
                                                            if ($scope.totalCameras==0){
                                                                $scope.totalCameras = Number(response.data[key].services[srv].service_items[crt].qtty);
                                                            }else{
                                                                $scope.totalCameras = Number($scope.totalCameras)+Number(response.data[key].services[srv].service_items[crt].qtty);
                                                            }
                                                        }
                                                        $scope.totalCamerasUsed=($scope.totalCameras-$scope.totalAvailableCameras);
                                                        console.log("$scope.totalCameras: "+$scope.totalCameras);
                                                        console.log("$scope.totalAvailableCameras: "+$scope.totalAvailableCameras);
                                                        console.log("$scope.totalCamerasUsed: "+$scope.totalCamerasUsed);
                                                        if ($scope.totalCameras>0){
                                                            if ($scope.totalCamerasUsed==0 || $scope.totalCamerasUsed < $scope.totalCameras){
                                                                if ($scope.totalAvailableCameras<=4){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=48
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=4; //4 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>4 && $scope.totalAvailableCameras<=8){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=75
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=8; //8 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>=9 && $scope.totalAvailableCameras<=16){
                                                                    $scope.cameraServices=1;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=null;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=null;
                                                                }else if ($scope.totalAvailableCameras>16 && $scope.totalAvailableCameras<=20){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=48;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=4; //4 Ch
                                                                }else if ($scope.totalAvailableCameras>16 && $scope.totalAvailableCameras<=24){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=75;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=8; //8 Ch
                                                                }else if ($scope.totalAvailableCameras>24 && $scope.totalAvailableCameras<=32){
                                                                    $scope.cameraServices=2;
                                                                    $scope.idDvr1=74;
                                                                    $scope.idDvr2=74;
                                                                    $scope.dvCh1=16; //16 Ch
                                                                    $scope.dvCh2=16; //16 Ch
                                                                }
                                                                console.log($scope.cameraServices);
                                                                for (var s = 0; s < $scope.cameraServices; s++) {
                                                                    var qttyCamerasEachService = 0;
                                                                    if (s==0){
                                                                        if ($scope.totalAvailableCameras>$scope.dvCh1 || $scope.totalAvailableCameras==$scope.dvCh1){
                                                                            qttyCamerasEachService=$scope.dvCh1;
                                                                        }else{
                                                                            qttyCamerasEachService=$scope.totalAvailableCameras;
                                                                        }
                                                                    }else{
                                                                        if (($scope.totalAvailableCameras-$scope.dvCh1)>$scope.dvCh2 || ($scope.totalAvailableCameras-$scope.dvCh1)==$scope.dvCh2){
                                                                            qttyCamerasEachService=$scope.dvCh2;
                                                                        }else{
                                                                            qttyCamerasEachService=($scope.totalAvailableCameras-$scope.dvCh1);
                                                                        }
                                                                    }
                                                                    console.log("qttyCamerasEachService:" +qttyCamerasEachService);
                                                                    $scope.list_cameras=[];
                                                                    for (var i = 0; i < qttyCamerasEachService; i++) {
                                                                        $scope.list_cameras.push(
                                                                            {
                                                                                "idProductFk": "49",
                                                                                "idCameraFk": "49",
                                                                                "portCamera": (i+1),
                                                                                "coveredArea": ".",
                                                                                "locationCamera": ".",
                                                                                "descriptionProduct": "DOMO CCTV",
                                                                                "model": "DOMO CCTV",
                                                                                "brand": "SIN DATO",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "1",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": ".",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "11",
                                                                                "classification": "CAMARA",
                                                                                "nroSerieCamera": null,
                                                                                "nroFabricCamera": ".",
                                                                                "dateExpireCamera": null,
                                                                                "isNew": 1
                                                                        });
                                                                    };
                                                                    console.log($scope.list_cameras);
                                                                    $scope.idDvr_nvrFk=s==0?$scope.idDvr1:$scope.idDvr2;
                                                                    $scope.idDvrCh=s==0?$scope.dvCh1:$scope.dvCh2;
                                                                    console.log("$scope.idDvr_nvrFk: "+$scope.idDvr_nvrFk);
                                                                    console.log("$scope.idDvrCh: "+$scope.idDvrCh);
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "Camara/Totem test",
                                                                        "dateDown": null,
                                                                        "location": "NO CORRESPONDE",
                                                                        "maxCamera": $scope.idDvrCh,
                                                                        "portNumberRouter": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": true,
                                                                        "numberPortRouter": "1",
                                                                        "addessClient": "NO CORRESPONDE",
                                                                        "portHttp": "1111",
                                                                        "addressVpn": "NO CORRESPONDE",
                                                                        "namePort1": "HTTPS",
                                                                        "nroPort1": "443",
                                                                        "namePort2": "SERVIDOR",
                                                                        "nroPort2": "8000",
                                                                        "generalComments": "NO CORRESPONDE",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "namePort": "RTSP",
                                                                        "port": "554",
                                                                        "idDvr_nvrFk": $scope.idDvr_nvrFk,
                                                                        "observation": "NO CORRESPONDE",
                                                                        "idTotenModelFk": "1",
                                                                        "idCompanyFk": "1",
                                                                        "numberAbonado": "12345678",
                                                                        "addressClientInter": "NO CORRESPONDE",
                                                                        "backup_energy": [
                                                                            {
                                                                                "idProductIndex": 1,
                                                                                "idBatteryFk": "62",
                                                                                "descriptionProduct": "NO    CORRESPONDE",
                                                                                "model": "NO    CORRESPONDE",
                                                                                "brand": "NO    CORRESPONDE",
                                                                                "isNumberSerieInternal": "0",
                                                                                "isNumberSerieFabric": "0",
                                                                                "isDateExpiration": "0",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "idProductClassification": "5",
                                                                                "classification": "BATERIA",
                                                                                "description": "BATERIA",
                                                                                "isNew": 1,
                                                                                "$$hashKey": "object:12230"
                                                                            }
                                                                        ],
                                                                        "cameras": $scope.list_cameras,
                                                                        "clients": [
                                                                            {
                                                                                "idItem": 1,
                                                                                "name": "admin",
                                                                                "user": "admin",
                                                                                "pass": "admin",
                                                                                "profile": "admin",
                                                                                "userProfile": "admin",
                                                                                "qrCode": "data:image/png;base64,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",
                                                                                "qrBase64": "data:image/png;base64,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"
                                                                            }
                                                                        ],
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "74",
                                                                                "numberSerieFabric": ".",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "62",
                                                                                "numberSerieFabric": null,
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                        ]
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    break;
                                                    case "5": //ALARM
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if (response.data[key].services[srv].service_items[crt].used==0){
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "Alarma test",
                                                                        "dateDown": "",
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": "",
                                                                        "addressVpn": "",
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "portNumberRouter": "",
                                                                        "idTipoConexionRemoto": "1",
                                                                        "idTypeConectionRemote": "1",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "useVpn": "",
                                                                        "passVpn": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "numbOfLicence": 0,
                                                                        "idCompanyMonitorFK": "1",
                                                                        "numberCustomer": "12345678",
                                                                        "observation": "SIN DATO",
                                                                        "tipo_conexion_remoto": [
                                                                            {
                                                                                "idTipoConexionRemoto": "1",
                                                                                "data": {
                                                                                    "ipAlarmModule": {},
                                                                                    "gprsAlarmModule": {},
                                                                                    "details": true,
                                                                                    "company": "123213213213213",
                                                                                    "line": "Personal",
                                                                                    "idTipoConexionRemoto": "1"
                                                                                },
                                                                                "$$hashKey": "object:24185"
                                                                            }
                                                                        ],
                                                                        "adicional_alarmar": [
                                                                            {
                                                                                "sysUser": {},
                                                                                "fk_idTipoCliente": "4",
                                                                                "typeOfClient_others": "SIN DATO",
                                                                                "nombresEncargadoManual": "SIN DATO",
                                                                                "telefono": "+54 (011) (15) 3152-2434",
                                                                                "calles_laterales": "SIN DATO",
                                                                                "calle_trasera": "SIN DATO",
                                                                                "mail_reporte": "nocorresponde@nada.com",
                                                                                "fk_idFormatoTransmision": "1",
                                                                                "fk_idAutomarcado": "0",
                                                                                "horario_automarcado": "",
                                                                                "n_usuario_asalto": "SIN DATO",
                                                                                "contrasena_asalto": "SIN DATO",
                                                                                "comisaria": "SIN DATO",
                                                                                "tlf_comisaria": "SIN DATO",
                                                                                "servicio_emergencia_medica": "SIN DATO",
                                                                                "n_de_socio": "SIN DATO",
                                                                                "plan": "SIN DATO",
                                                                                "observacion_general": "SIN DATO",
                                                                                "fk_idEncargado": null,
                                                                                "franjas_horarias": [
                                                                                    {
                                                                                        "day": "Lunes",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Martes",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Miercoles",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    },
                                                                                    {
                                                                                        "day": "Jueves",
                                                                                        "fronAm": "08:00",
                                                                                        "toAm": "12:00",
                                                                                        "fronPm": "17:00",
                                                                                        "toPm": "20:00"
                                                                                    }
                                                                                ],
                                                                                "personas_para_dar_aviso": [
                                                                                    {
                                                                                        "id": 1,
                                                                                        "fk_idUserSystema": null,
                                                                                        "nombre_apellido": "SIN DATO",
                                                                                        "vinculo": "SIN DATO",
                                                                                        "palabra_clave": "SIN DATO",
                                                                                        "telefono": "+54 (011) (15) 1111-1111",
                                                                                        "numero_del_usuario": "111",
                                                                                        "opt": "getnotice",
                                                                                        "$$hashKey": "object:23928"
                                                                                    }
                                                                                ],
                                                                                "personas_para_verificar_en_el_lugar": [
                                                                                    {
                                                                                        "id": 1,
                                                                                        "fk_idUserSystema": null,
                                                                                        "nombre_apellido": "SIN DATO",
                                                                                        "vinculo": "SIN DATO",
                                                                                        "telefono": "+54 (011) (15) 1111-1111",
                                                                                        "numero_del_usuario": "2222",
                                                                                        "opt": "verifyplace",
                                                                                        "$$hashKey": "object:23937"
                                                                                    }
                                                                                ],
                                                                                "fk_idServiciosAdicionales": [
                                                                                    "1"
                                                                                ]
                                                                            }
                                                                        ],
                                                                        "sensores_de_alarmas": [
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 1,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:23777"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 2,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:23974"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 3,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:24008"
                                                                            },
                                                                            {
                                                                                "idSensor": "52",
                                                                                "sensorDetails": {
                                                                                    "idProduct": "52",
                                                                                    "descriptionProduct": "SENSOR ROTURA DE VIDRIO",
                                                                                    "codigoFabric": "RV",
                                                                                    "brand": "SIN DATOS",
                                                                                    "model": "ROTURA DE VIDRIO",
                                                                                    "idProductClassificationFk": "14",
                                                                                    "isNumberSerieFabric": "1",
                                                                                    "isNumberSerieInternal": "0",
                                                                                    "isDateExpiration": "0",
                                                                                    "isControlSchedule": null,
                                                                                    "isRequestNumber": "0",
                                                                                    "priceFabric": "35.00",
                                                                                    "idStatusFk": "1",
                                                                                    "idProductClassification": "14",
                                                                                    "classification": "SENSOR DE ALARMA",
                                                                                    "$$hashKey": "object:19343"
                                                                                },
                                                                                "numberZoneSensor": 4,
                                                                                "area": "SIN DATO",
                                                                                "nroZoneTamper": null,
                                                                                "isWirelessSensor": 1,
                                                                                "locationLon": "SIN DATO",
                                                                                "idDvr": null,
                                                                                "idCameraFk": null,
                                                                                "dvrDetails": null,
                                                                                "nroInterno": "SIN DATO",
                                                                                "nroFrabric": "SIN DATO",
                                                                                "$$hashKey": "object:24040"
                                                                            }
                                                                        ],
                                                                        "companyMonitor": "1",
                                                                        "numberPay": "12345678",
                                                                        "panelAlarm": "50",
                                                                        "keyboardAlarm": "51",
                                                                        "countZoneIntaled": "4",
                                                                        "idTypeConectionRemote": "",
                                                                        "baterias_instaladas": [
                                                                            {
                                                                                "idProductoFk": "62",
                                                                                "nroFabric": null,
                                                                                "nroInternal": null,
                                                                                "dateExpired": null
                                                                            }
                                                                        ],
                                                                        "adicional": [
                                                                            {
                                                                                "idProductDetail": 0,
                                                                                "idProductoFk": "50",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            },
                                                                            {
                                                                                "idProductDetail": 1,
                                                                                "idProductoFk": "51",
                                                                                "numberSerieFabric": "1",
                                                                                "numberSerieInternal": null,
                                                                                "dateExpiration": null,
                                                                                "optAux": null
                                                                            }
                                                                        ]
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    break;
                                                    case "6": //APP MONITOR
                                                        for (var crt in response.data[key].services[srv].service_items){
                                                            console.log("     * "+response.data[key].services[srv].service_items[crt].itemName+" ["+response.data[key].services[srv].service_items[crt].qtty+"]");
                                                            if (response.data[key].services[srv].service_items[crt].used==0){
                                                                for (var i = 0; i < response.data[key].services[srv].service_items[crt].qtty; i++) {
                                                                    $scope.services_to_add.push({
                                                                        'idClientFk': obj.idClient,
                                                                        'clientName': obj.name,
                                                                        'dateUp': formatedDate,
                                                                        'idContratoFk': response.data[key].idContrato,
                                                                        'idContracAssociatedFk': response.data[key].idContrato,
                                                                        'idContracAssociated_SE' : response.data[key].idContrato,
                                                                        'contractNumb': response.data[key].numeroContrato,
                                                                        'idTypeMaintenanceFk': response.data[key].maintenanceType,
                                                                        "MntType": response.data[key].description,
                                                                        "name": "APP Monitor test",
                                                                        "serviceName": response.data[key].services[srv].serviceName,
                                                                        "idTipeServiceFk": response.data[key].services[srv].idServiceType,
                                                                        "idServiceType": response.data[key].services[srv].idServiceType,
                                                                        "dateDown": null,
                                                                        "location": "",
                                                                        "maxCamera": "",
                                                                        "zonesQttyInstalled": "",
                                                                        "isHasInternetConnect": 0,
                                                                        "numberPortRouter": "",
                                                                        "addessClient": null,
                                                                        "portHttp": "",
                                                                        "addressVpn": "",
                                                                        "namePort1": "",
                                                                        "nroPort1": "",
                                                                        "namePort2": "",
                                                                        "nroPort2": "",
                                                                        "generalComments": "NO CORRESPONDE",
                                                                        "idDoorFk": "",
                                                                        "aclaration": "",
                                                                        "locationGabinet": "",
                                                                        "isBlocklingScrew": "",
                                                                        "lockingScrewComment": "",
                                                                        "locationEmergencyButton": "",
                                                                        "locationOffKey": "",
                                                                        "portNumberRouter": "",
                                                                        "idTipoConexionRemoto": "",
                                                                        "user": "",
                                                                        "pass": "",
                                                                        "useVpn": "",
                                                                        "passVpn": "",
                                                                        "isSysUser": false,
                                                                        "people": {},
                                                                        "numbOfLicence": 0,
                                                                        "sucribeNumber": "12345678",
                                                                        "idCompanyMonitorFK": "1",
                                                                        "observation": "NO CORRESPONDE",
                                                                        "licenses": [],
                                                                        "countNewLicense": 3,
                                                                        "idApplicationFk": "1",
                                                                        "passwordApp": null,
                                                                        "adicional": {}
                                                                    });
                                                                }
                                                            }
                                                        }
                                                        
                                                    break;
                                                }
                                            }
                                        }                                        
                                    }else{
                                        $scope.rsContractsListByCustomerIdData=[];
                                        $scope.rsContractNotFound=true;
                                        inform.add('No se existen contratos asociados al cliente. ',{
                                                ttl:2000, type: 'warning'
                                        });
                                    }
                                    //console.log($scope.rsContractsListByCustomerIdData);
                                    console.info($scope.services_to_add);
                                    //blockUI.start('Registrando servicios.');
                                    console.log($scope.services_to_add.length)
                                    if ($scope.services_to_add.length>0){
                                        var createdService = [];
                                        angular.forEach($scope.services_to_add,function(service){
                                            var deferredService = $q.defer();
                                            createdService.push(deferredService.promise);
                                            //CREATE SERVICE
                                            $timeout(function() {
                                                deferredService.resolve();
                                                serviceServices.addService(service).then(function(response){
                                                    if(response.status==200){
                                                        console.log("Customer Service Successfully Created");
                                                        inform.add('Servicio de '+service.serviceName+' del cliente '+service.clientName+' han sido creados con exito. ',{
                                                            ttl:2000, type: 'success'
                                                        });
                                                    }else if($scope.rsJsonData.status==500){
                                                        console.log("Customer Service not Created, contact administrator");
                                                        inform.add('Error: [500] Contacta al area de soporte. ',{
                                                            ttl:2000, type: 'danger'
                                                        });
                                                    }
                                                });
                                            }, 1000);
                                        });
                                        
                                        $q.all(createdService).then(function () {
                                            $timeout(function() {
                                                blockUI.stop();
                                            }, 2000);
                                        });
                                    }else{
                                        inform.add('El Cliente '+obj.name+', no posee servicios, disponibles para crear, seleccione otro cliente. ',{
                                            ttl:8000, type: 'info'
                                        });
                                    }
                                });
                            break;

                        }
                    break;
                    case "sysUsers":
                        switch (opt2){
                          case "dash":
                            $scope.sysContent = "";
                            console.log("sysUsers");
                            $scope.loadPagination($scope.rsList.sysUser, "idUser", "7");
                            $scope.sysContent = 'sysUsers';
                          break;
                          case "newSysUser":
                            $('#newSysUser').modal('show');
                          break;
                          case "updProfile2":
                            $scope.sysUpProfile.Name="";
                            $scope.filterSysProfile=null;
                            $scope.sysProfFound=false;
                            $('#updateSysProfile2').modal('show');
                          break;
                          default:
                        }
                    break;
                    case "smtp":
                      if(fnAction=="open"){
                        $scope.smtp.mail ="";
                        $scope.smtp.password ="";
                        $scope.loadParameter(1, 6,'sysParam');
                        $('#ModalSMTPEmail').modal('show');
                      }
                      if(fnAction=="save"){
                        $scope.smtpMail="";
                        $scope.smtpPwd = "";
                        $scope.updateMailSmtp($http, $scope);
                      }
                    break;
                    case "mails":
                      if(fnAction=="open"){
                        $scope.sys.email ="";
                        $scope.loadParameter(1, 6,'sysParam');
                        $('#ModalSetupEmail').modal('show');
      
                      }
                      if(fnAction=="save"){
                        $scope.salesMail    = "";
                        $scope.payrollMail  = "";
                        $scope.supportMail  = "";
                        $scope.adminMail    = "";
                        switch ($scope.sys.idTypeOutherKf){
                          case "1":
                            $scope.sysParam.idParam = 7;
                            $scope.sysParam.msg="VENTAS";
                          break;
                          case "3":
                            $scope.sysParam.idParam = 8;
                            $scope.sysParam.msg="SERVICIO TECNICO";
                          break;
                          case "4":
                            $scope.sysParam.idParam = 9;
                            $scope.sysParam.msg="FACTURACION";
                          break;
                          case "5":
                            $scope.sysParam.idParam = 10;
                            $scope.sysParam.msg="ADMINISTRATIVO";
                          break;
                          default:
                        }
                        
                        $scope.sysParam.value = $scope.sys.email;
                        console.log($scope.sys.email);  
                        $scope.updateSysParam($http, $scope);
                      }
                    break;
                    case "zones":
                        switch (opt2){
                            case "list":
                                $scope.sysContent = "";
                                $scope.getZonesFn();
                                $timeout(function() {
                                    $scope.loadPagination($scope.rsZonesData, "idZona", "10");
                                }, 500);
                                $scope.sysContent = 'sysZones';
                            break;
                            case "newZone":
                                $scope.list_locations = [];
                                $scope.select.province.selected = undefined;
                                $scope.select.location.selected = undefined;
                                $scope.zone={'new':{}, 'update':{}};
                                $('#newZoneModal').modal('toggle');
                            break;
                            case "addZone":
                                $scope.zones.new.zona.n_zona        = obj.zoneNumber;
                                $scope.zones.new.zona.costo_envio   = obj.costDelivery;
                                $scope.zones.new.zona.valor_envio   = obj.priceDelivery;
                                $scope.zones.new.zona.descripcion   = obj.description;
                                $scope.zones.new.zona.locations     = $scope.list_locations;
                                console.log($scope.zones.new);
                                $scope.addNewZoneFn($scope.zones.new);
                            break;
                            case "editZone":
                                $scope.zone.update = {};
                                $scope.zone.update.zoneNumber       = obj.n_zona;
                                $scope.zone.update.costDelivery     = obj.costo_envio;
                                $scope.zone.update.priceDelivery    = obj.valor_envio;
                                $scope.zone.update.description      = obj.descripcion;
                                $scope.zone.update.idZona           = obj.idZona;
                                $scope.list_locations = [];
                                $scope.select.province={'selected': undefined};
                                $scope.select.location={'selected': undefined};
                                var id = 0;
                                for (var key in  obj.locations){
                                    id++;
                                    $scope.list_locations.push({'id':id, 'idLocation':obj.locations[key].idLocationKf, 'idProvinceFK':obj.locations[key].idProvinceFK, 'location':obj.locations[key].location,  'province': obj.locations[key].province});
                                }
                                console.log($scope.zone.update);
                                console.log($scope.list_locations);
                                $('#updateZoneModal').modal('toggle');
                            break;
                            case "updateZone":
                                $scope.zones.update.zona.idZona         = $scope.zone.update.idZona;
                                $scope.zones.update.zona.n_zona         = obj.zoneNumber;
                                $scope.zones.update.zona.costo_envio    = obj.costDelivery;
                                $scope.zones.update.zona.valor_envio    = obj.priceDelivery;
                                $scope.zones.update.zona.descripcion    = obj.description;
                                $scope.zones.update.zona.locations      = $scope.list_locations;
                                console.log($scope.zones.update);
                                $scope.updateZoneFn($scope.zones.update);
                            break;
                            case "deleteZone":
                                blockUI.start('Eliminando Zona - '+obj.descripcion);
                                console.log(obj);
                                $timeout(function() {
                                    $scope.deleteZoneFn(obj.idZona);
                                    blockUI.stop();
                                }, 2000);
                            break;
                            case "addLocationsToList":
                                var id = $scope.list_locations.length==0?1:($scope.list_locations.length+1);
                                if ($scope.list_locations.length<=0){
                                    $scope.list_locations.push({'id':1, 'idLocation':obj.idLocation, 'idProvinceFK':obj.idProvinceFK, 'location':obj.location, 'province': obj2.province});
                                    inform.add('Localidad '+obj.location+' ha sido agregado a la lista.',{
                                        ttl:5000, type: 'success'
                                    });
                                }else{
                                    for (var key in  $scope.list_locations){
                                        if ( $scope.list_locations[key].idLocation==obj.idLocation){
                                        inform.add("La localidad "+obj.location+", ya se encuentra en la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        $scope.isLocationExist=true;
                                        break;
                                        }else{
                                        $scope.isLocationExist=false;
                                        }
                                    }
                                    if(!$scope.isLocationExist){
                                        //console.log("ADD_NO_EXIST");
                                        var id = $scope.list_locations.length==0?1:($scope.list_locations.length+1);
                                        $scope.list_locations.push({'id':id, 'idLocation':obj.idLocation, 'idProvinceFK':obj.idProvinceFK, 'location':obj.location,  'province': obj2.province});
                                        inform.add('Localidad '+obj.location+' ha sido agregado a la lista.',{
                                            ttl:5000, type: 'success'
                                        });
                                    }
                                }
                                console.log($scope.list_locations);
                                //$scope.select.province.selected = undefined;
                                $scope.select.location.selected = undefined;
                            break;
                            case "removeLocationsFromList":
                                for (var key in  $scope.list_locations){
                                    if ( $scope.list_locations[key].id==obj.id){
                                        inform.add("La localidad "+obj.location+", ha sido removida de la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        $scope.list_locations.splice(key,1);
                                    }
                                }
                            break;
                            default:
                        }
                    break;
                    case "techServicesCosts":
                        switch (opt2){
                            case "list":
                                $scope.sysContent = "";
                                $scope.getTechServiceListFn();
                                $timeout(function() {
                                    $scope.dayDataCollapseFn();
                                    $scope.sysContent = 'sysServiceCosts';
                                }, 500);
                            break;
                            case "newTechService":
                                $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                                $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                                $('#newTechService').modal('toggle');
                            break;
                            case "newTechServiceCost":
                                $scope.technician={'new':{'service':{}, 'rate':{}}, 'update':{'service':{}, 'rate':{}}};
                                $scope.technician_services={'new':{}, 'update':{}, 'temp':undefined};
                                $('#newTechServiceCost').modal('toggle');
                            break;
                            case "addTechService":
                                //console.log(obj);                                
                                var description = obj.description;
                                $scope.technician.new.service.description       = description.toUpperCase();
                                $scope.technician.new.service.isProtected       = obj.isProtected;
                                $scope.technician.new.service.idServiceTypeFk   = obj.idServiceTypeFk;
                                $scope.technician.new.service.idServiceModeFk   = obj.idServiceModeFk!=true?2:1;
                                $scope.technician.new.service.hasStock          = obj.hasStock!=true?0:1;
                                console.log($scope.technician.new.service);
                                $scope.addNewTechServiceFn($scope.technician.new);
                            break;
                            case "addTechServiceCost":
                                console.log(obj);
                                $scope.technician.new.rate.idServiceTechnicianKf = obj.idServiceTechnicianKf;
                                $scope.technician.new.rate.idTipoMantenimientoKf = obj.idTipoMantenimientoKf;
                                $scope.technician.new.rate.cost                  = obj.cost;
                                console.log($scope.technician.new);
                                $scope.addNewTechServiceCostFn($scope.technician.new);
                            break;
                            case "editTechService":
                                $scope.technician_services={'new':{}, 'update':{}, 'temp':{}};
                                $scope.technician_services.update = obj;
                                $scope.technician_services.update.isProtected       = obj.isProtected==1?true:false;
                                $scope.technician_services.update.idServiceModeFk   = obj.idServiceModeFk==1?true:false;
                                $scope.technician_services.temp.description         = obj.description;
                                $scope.technician_services.update.hasStock              = obj.hasStock==1?true:false;
                                console.log($scope.technician_services.update);
                                $('#editTechService').modal('toggle');
                            break;
                            case "editTechServiceCost":
                                console.log(obj);
                                $scope.getTypeOfMaintenanceFn();
                                $scope.technician_services={'new':{}, 'update':{}, 'temp':{}};
                                $scope.technician_services.update = obj;
                                //$scope.getTypeOfMaintenanceByTechServiceIdFn(obj.idServiceTechnicianKf);
                                console.log($scope.technician_services.update);
                                $('#editTechServiceCost').modal('toggle');
                                $('#technician_cost').focus();
                            break;
                            case "updateTechService":
                                //console.log(obj);
                                var description = obj.description;
                                $scope.technician.update.service.idServiceTechnician    = obj.idServiceTechnician
                                $scope.technician.update.service.description            = description.toUpperCase();
                                $scope.technician.update.service.isProtected            = obj.isProtected;
                                $scope.technician.update.service.idServiceTypeFk        = obj.idServiceTypeFk;
                                $scope.technician.update.service.idServiceModeFk        = obj.idServiceModeFk!=true?2:1;
                                $scope.technician.update.service.hasStock               = obj.hasStock!=true?0:1;
                                console.log($scope.technician.update.service);
                                $scope.updateTechServiceFn($scope.technician.update);
                            break;
                            case "updateTechServiceCost":
                                console.log(obj);
                                $scope.technician.update.rate.idServiceTechnicianCost   = obj.idServiceTechnicianCost
                                $scope.technician.update.rate.idServiceTechnicianKf     = obj.idServiceTechnicianKf;
                                $scope.technician.update.rate.idTipoMantenimientoKf     = obj.idTipoMantenimientoKf;
                                $scope.technician.update.rate.cost                      = obj.cost;
                                console.log($scope.technician.update);
                                $scope.updateTechServiceCostFn($scope.technician.update);
                            break;
                            case "delete":
                                blockUI.start('Eliminando Zona - '+obj.descripcion);
                                console.log(obj);
                                $timeout(function() {
                                    $scope.deleteZoneFn(obj.idZona);
                                    blockUI.stop();
                                }, 2000);
                            break;
                            case "addLocationsToList":
                                var id = $scope.list_locations.length==0?1:($scope.list_locations.length+1);
                                if ($scope.list_locations.length<=0){
                                    $scope.list_locations.push({'id':1, 'idLocation':obj.idLocation, 'idProvinceFK':obj.idProvinceFK, 'location':obj.location, 'province': obj2.province});
                                    inform.add('Localidad '+obj.location+' ha sido agregado a la lista.',{
                                        ttl:5000, type: 'success'
                                    });
                                }else{
                                    for (var key in  $scope.list_locations){
                                        if ( $scope.list_locations[key].idLocation==obj.idLocation){
                                        inform.add("La localidad "+obj.location+", ya se encuentra en la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        $scope.isLocationExist=true;
                                        break;
                                        }else{
                                        $scope.isLocationExist=false;
                                        }
                                    }
                                    if(!$scope.isLocationExist){
                                        //console.log("ADD_NO_EXIST");
                                        var id = $scope.list_locations.length==0?1:($scope.list_locations.length+1);
                                        $scope.list_locations.push({'id':id, 'idLocation':obj.idLocation, 'idProvinceFK':obj.idProvinceFK, 'location':obj.location,  'province': obj2.province});
                                        inform.add('Localidad '+obj.location+' ha sido agregado a la lista.',{
                                            ttl:5000, type: 'success'
                                        });
                                    }
                                }
                                console.log($scope.list_locations);
                                //$scope.select.province.selected = undefined;
                                $scope.select.location.selected = undefined;
                            break;
                            case "removeLocationsFromList":
                                for (var key in  $scope.list_locations){
                                    if ( $scope.list_locations[key].id==obj.id){
                                        inform.add("La localidad "+obj.location+", ha sido removida de la lista.",{
                                            ttl:5000, type: 'warning'
                                        });
                                        $scope.list_locations.splice(key,1);
                                    }
                                }
                            break;
                            default:
                        }
                    break;
                    default:
                }
            }
});