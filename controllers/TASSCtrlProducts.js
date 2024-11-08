/**
* Products Controller
**/
var product = angular.module("module.Products", ["tokenSystem", "angular.filter", "services.Products"]);

product.controller('ProductsCtrl', function($scope, $location, $filter, $routeParams, blockUI, $timeout, inform, ProductsServices, tokenSystem, $window, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo productos");
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
        $location.path("/login");
    }    
    $scope.list_id_divice=[];
    $scope.list_divices=[];
    $scope.isDeviceExist=null;
    $scope.new={product:{}};
    $scope.update={product:{}};

    $scope.newProduct = function(){
        $scope.new={product:{}};
        $scope.list_id_divice=[];
        $scope.list_divices=[];
        $scope.isDeviceExist=null;
        $('#newProduct').modal('show');
    }

    $scope.listProducts = function(){
        $scope.sysContent = "";
        $scope.getProductsFn("",1);
        $scope.sysContent = 'products';
    }
    /**
     * Pagination Functions
     **/
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
            //console.log($scope.items);
            $scope.search();
        }
        // init the filtered items
        $scope.search = function (qvalue1, qvalue2, vStrict) {
                console.log("[search]-->qvalue1: "+qvalue1);
                console.log("[search]-->qvalue2: "+qvalue2);
                console.log("[search]-->vStrict: "+vStrict);
                $scope.filteredItems = $filter("filter")($scope.items, qvalue1, vStrict);
                if (qvalue2!='' && qvalue2!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue2, vStrict);}
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
            //console.log($scope.pagedItems);
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
    /**
    * CLASSIFICATION PRODUCTS
    **/
        $scope.rsClasProductsData = {};
        $scope.getProductClassificationFn = function(){
            ProductsServices.getProductClassification().then(function(data){
                $scope.rsClasProductsData = data;
                //$scope.loadPagination($scope.rsClasProductsData, "idProductClassification");
                //console.log($scope.rsClasProductsData);
            });
        };$scope.getProductClassificationFn();

    /**
    * OPEN DEVICES PRODUCTS
    **/
        $scope.rsOpenDeviceProductsData = [];
        $scope.getDiviceOpening = function(){
            ProductsServices.getDiviceOpening().then(function(data){
                $scope.rsOpenDeviceProductsData = data;
                //$scope.loadPagination($scope.rsOpenDeviceProductsData, "idProductClassification");
                //console.log($scope.rsOpenDeviceProductsData);
            });
        };$scope.getDiviceOpening();

    /**
    * GET PRODUCTS
    **/
        $scope.rsProductsData = [];
        $scope.getProductsFn = function(search, opt){
            ProductsServices.list(search).then(function(data){
                $scope.rsProductsData = data;
                if(opt==1){$scope.loadPagination($scope.rsProductsData, "idProduct", "10");}
                //console.log($scope.rsProductsData);
            });
        };
    /**
    * NEW PRODUCT 
    **/        
        $scope.addNewProductFn = function(){
            $scope.new.product.list_id_divice       = $scope.new.product.idProductClassificationFk==3?$scope.list_id_divice:null;
            $scope.new.product.isNumberSerieFabric  = $scope.new.product.isNumberSerieFabric==undefined?false:$scope.new.product.isNumberSerieFabric;
            $scope.new.product.isNumberSerieInternal= $scope.new.product.isNumberSerieInternal==undefined?false:$scope.new.product.isNumberSerieInternal
            $scope.new.product.isDateExpiration     = $scope.new.product.isDateExpiration==undefined?false:$scope.new.product.isDateExpiration;
            $scope.new.product.isControlSchedule    = $scope.new.product.idProductClassificationFk==1?$scope.new.product.isControlSchedule:null;
            $scope.new.product.isRequestNumber      = $scope.new.product.idProductClassificationFk==19 && $scope.new.product.isRequestNumber!=undefined?$scope.new.product.isRequestNumber:null;
            console.log($scope.new);
            ProductsServices.new($scope.new).then(function(data){
                $scope.rsNewProductData = data;
                $('#newProduct').modal('hide');
                    if ($scope.rsNewProductData.status==200){
                    inform.add("Producto Cargado Satisfactoriamente.",{
                        ttl:5000, type: 'success'
                    });
                    }
                    $scope.getProductsFn("", 1);
            });
        }

    /**
    * SELECT PRODUCT TO EDIT 
    **/
        $scope.selectProductDataFn=function(obj){
            $scope.update={product:{}};
            $scope.list_id_divice = [];
            $scope.list_divices   = [];
            $scope.update.product.idProduct                 = obj.idProduct;
            $scope.update.product.descriptionProduct        = obj.descriptionProduct;
            $scope.update.product.codigoFabric              = obj.codigoFabric;
            $scope.update.product.brand                     = obj.brand;
            $scope.update.product.model                     = obj.model;
            $scope.update.product.priceFabric               = obj.priceFabric;
            $scope.update.product.isNumberSerieFabric       = obj.isNumberSerieFabric==1?true:false;
            $scope.update.product.isNumberSerieInternal     = obj.isNumberSerieInternal==1?true:false;
            $scope.update.product.isDateExpiration          = obj.isDateExpiration==1?true:false;
            $scope.update.product.isControlSchedule         = obj.isControlSchedule==1?true:false;
            $scope.update.product.idProductClassificationFk = obj.idProductClassificationFk;
            $scope.update.product.isRequestNumber           = obj.isRequestNumber!=undefined?true:false;
            $scope.update_ProductTemp_diviceOpening         = obj.diviceOpening;
            
            //console.log(obj.diviceOpening);
            if (obj.diviceOpening.length>0){
                for (var key in  obj.diviceOpening){
                //console.log(obj.diviceOpening[key]);
                $scope.list_id_divice.push({'idDiviceOpeningFk':obj.diviceOpening[key].idDiviceOpening});
                $scope.list_divices.push({'idDiviceOpeningFk':obj.diviceOpening[key].idDiviceOpening, 'diviceOpening':obj.diviceOpening[key].diviceOpening});
                }
            }else{
                //console.log("obj.diviceOpening is empty");
            }
            $('#updateProduct').modal('show');
            //console.log(obj);
        }
    /**
    * UPDATE PRODUCT 
    **/        
        $scope.updateProductFn = function(){
            $scope.update.product.list_id_divice       = $scope.update.product.idProductClassificationFk==3?$scope.list_id_divice:null;
            $scope.update.product.isNumberSerieFabric  = $scope.update.product.isNumberSerieFabric==undefined?false:$scope.update.product.isNumberSerieFabric;
            $scope.update.product.isNumberSerieInternal= $scope.update.product.isNumberSerieInternal==undefined?false:$scope.update.product.isNumberSerieInternal
            $scope.update.product.isDateExpiration     = $scope.update.product.isDateExpiration==undefined?false:$scope.update.product.isDateExpiration;
            $scope.update.product.isControlSchedule    = $scope.update.product.idProductClassificationFk==1 && $scope.update.product.isControlSchedule!=undefined?$scope.update.product.isControlSchedule:false;
            $scope.update.product.isRequestNumber      = $scope.update.product.idProductClassificationFk==19 && $scope.update.product.isRequestNumber!=undefined?$scope.update.product.isRequestNumber:false;
            console.log($scope.update);
            ProductsServices.update($scope.update).then(function(data){
                $scope.rsupdateProductData = data;
                $('#updateProduct').modal('hide');
                    if ($scope.rsupdateProductData.status==200){
                    inform.add("Producto Actualizado Satisfactoriamente.",{
                        ttl:5000, type: 'success'
                    });
                    }
                    $scope.getProductsFn("",1);
            });
        }

    /**
    * DELETE PRODUCT 
    **/
        $scope.deleteProductFn = function(idProduct){
            ProductsServices.delete(idProduct).then(function(data){
                $scope.rsDelProductData=data;
                console.log("STATUS: "+$scope.rsDelProductData.status);
                console.log("MSG   : "+$scope.rsDelProductData.statusText);
                console.log("DATA  : "+$scope.rsDelProductData.data);
                if ($scope.rsDelProductData.status==200){
                    $scope.getProductsFn("",1);
                    inform.add("Producto Eliminado satisfactoriamente",{
                        ttl:5000, type: 'success'
                    });
                }
                //console.log($scope.rsModulesData); 
            });
        }

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
            case "removet":
                if (confirm==0){
                    if (($scope.sysLoggedUser.idProfileKf!=3 && $scope.sysLoggedUser.idProfileKf!=5 && $scope.sysLoggedUser.idProfileKf!=6 && obj.idTypeTenantKf!=0) || ($scope.sysLoggedUser.idProfileKf==3 && obj.idTypeTenantKf==2) || ($scope.sysLoggedUser.idProfileKf==6 && obj.idTypeTenantKf==2)){
                    $scope.mess2show="Esta seguro que desea dar de baja al Habitante?";
                    }else if ($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==5 || ($scope.sysLoggedUser.idProfileKf==6 && $scope.sessionidTypeTenant==2)){
                    $scope.mess2show="Esta seguro que desea darse de baja?";
                    }
                    if(($scope.sysLoggedUser.idProfileKf!=3 && obj.idTypeTenantKf!=0) || ($scope.sysLoggedUser.idProfileKf==3 && obj.idTypeTenantKf==2) || ($scope.sysLoggedUser.idProfileKf==6 && obj.idTypeTenantKf==2)){
                        $scope.idTenantKf     =  obj.idUser;
                        $scope.idDeparmentKf  =  $scope.idDeptoKf;
                        $scope.typeTenantKf   =  obj.idTypeTenantKf;
                        console.log("Manage Depto: "+$scope.manageDepto);
                        console.log('ID: '+$scope.idTenantKf+' ID DPTO: '+$scope.idDeparmentKf+' ID TIPO TENANT: '+$scope.typeTenantKf);
                        console.log("DATOS DEL INQUILINO O PROPIETARIO A DAR DE BAJA");
                        console.log(obj)
                        $scope.checkTicketTenant($scope.idTenantKf);
                    }else if($scope.sysLoggedUser.idProfileKf==3 || $scope.sysLoggedUser.idProfileKf==6 || $scope.sysLoggedUser.idProfileKf==5){
                        console.log("::::::: REMOVE AN DEPTO OWNER :::::::");
                        $scope.idTenantKf     = $scope.sessionidTenantUser;
                        $scope.idDeparmentKf  = obj.idDepartment;
                        $scope.typeTenantKf   = $scope.sessionidTypeTenant;
                        console.log("Manage Depto: "+$scope.manageDepto);
                        console.log('ID: '+$scope.idTenantKf+' ID DPTO: '+$scope.idDeparmentKf+' ID TIPO TENANT: '+$scope.typeTenantKf);
                        console.log("DATOS DEL INQUILINO O PROPIETARIO A DAR DE BAJA");
                        console.log(obj)
                        $scope.checkTicketTenant($scope.idTenantKf);
                    }
                }else if (confirm==1){
                $scope.IsFnRemove=true;
                if($scope.sysLoggedUser.idProfileKf==5 || ($scope.sysLoggedUser.idProfileKf==6 && $scope.sessionidTypeTenant==2)){
                    $scope.sysUnAssignDep2Tenant()
                }else{
                    $scope.fnRemoveTenant($http, $scope);
                }
                $('#confirmRequestModal').modal('hide');
                }
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
            case "removeu":
                if (confirm==0){
                    if ($scope.sysLoggedUser.idProfileKf==1 && obj.idUser!=0){
                    if (obj.idProfileKf){$scope.mess2show="El usuario ("+obj.fullNameUser+") bajo el perfil de "+obj.nameProfile+" sera Eliminado.     Confirmar?";}
                        $scope.idUserKf   =  obj.idUser;
                        $scope.argObj = obj;
                        console.log('Usuario a eliminar ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                        console.log("============================================================================")
                        console.log($scope.argObj);
                    }      
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.deleteUser($scope.argObj);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removeSysProf":
                if (confirm==0){
                    if ($scope.sysLoggedUser.idProfileKf==1 && obj.idProfiles!=0){
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
            case "removeProduct":
                if (confirm==0){
                    console.log(obj);
                    if ($scope.sysLoggedUser.idProfileKf==1 && obj.idProduct!=undefined){
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
            case "removeParticularAddress":
                if (confirm==0){
                    $scope.removeParticularAddress=obj;
                    if(obj.idTipoInmuebleFk=="1"){
                        $scope.mess2show="El departamento: "+obj.depto+" en la direccion "+obj.address+" sera Eliminado.     Confirmar?";
                    }else if(obj.idTipoInmuebleFk=="2"){
                        $scope.mess2show="La casa en la direccion: "+obj.address+" sera Eliminado.     Confirmar?";
                    }else{
                        $scope.mess2show="El local en la direccion: "+obj.address+" sera Eliminado.     Confirmar?";
                    }
                    
                        console.log('Direccion a eliminar ID: '+obj.idAddressParticular+' Direccion: '+obj.address);
                        console.log("============================================================================")
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.removeParticularAddressFn($scope.removeParticularAddress);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removePhoneNum":
                if (confirm==0){
                    $scope.removePhoneNum=obj;
                        $scope.mess2show="El telefono "+obj.phoneContact+" de contacto ["+obj.phoneTag+"] sera Eliminado.     Confirmar?";                                        
                    
                        console.log('Telefono a eliminar ID: '+obj.idClientPhoneFk+' Telefono: '+obj.phoneContact);
                        console.log("============================================================================")
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.removePhoneNumFn($scope.removePhoneNum);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removeMail":
                if (confirm==0){
                    $scope.removeMail=obj;
                        $scope.mess2show="El correo "+obj.mailContact+" de tipo ["+obj.typeName+"] sera Eliminado.     Confirmar?";                                        
                    
                        console.log('Correo a eliminar ID: '+obj.idClientMail+' Telefono: '+obj.mailContact);
                        console.log("============================================================================")
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.removeMailFn($scope.removeMail);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removeAuthUser":
                if (confirm==0){
                    $scope.removeAuthUser=obj;
                        $scope.mess2show="El usuario "+obj.fullNameUser+" sera removido de los usuarios autorizados.     Confirmar?";                                        
                    
                        console.log('Usuario a remover ID: '+obj.idUserFk);
                        console.log("============================================================================");
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.removeAuthUserFn($scope.removeAuthUser);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removeZone":
                if (confirm==0){
                    $scope.removeZone=obj;
                        $scope.mess2show="La zona ("+obj.n_zona+") "+obj.descripcion+" sera eliminada.     Confirmar?";                                        
                    
                        console.log('Zona a remover ID: '+obj.idZona);
                        console.log("============================================================================");
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.deleteZoneFn($scope.removeZone);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "removeDepto":
                if (confirm==0){
                    $scope.removeDepto=obj;
                    var deptoUpper =obj.departament;
                    var floorUpper =obj.floor;
                    switch(obj.idCategoryDepartamentFk){
                        case "1":
                        $scope.mess2show="El departamento   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+" sera eliminado.     Confirmar?";
                        break;
                        case "2":
                        $scope.mess2show="La Cochera   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+" sera eliminada.     Confirmar?";
                        break;
                        case "3":
                        $scope.mess2show="La Baulera   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+" sera eliminada.     Confirmar?";
                        break;
                        case "4":
                        $scope.mess2show="El Local   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+" sera eliminado.     Confirmar?";
                        break;
                        case "5":
                        $scope.mess2show="La unidad Porteria   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+"  sera eliminada.     Confirmar?";
                        break;
                        case "6":
                        $scope.mess2show="El departamento   : "+deptoUpper.toString().toUpperCase()+"    Piso: "+floorUpper.toString().toUpperCase()+" sera eliminado.     Confirmar?";
                        break;                    
                    }
                        console.log('Depto a remover ID: '+obj.idDepto);
                        console.log("============================================================================");
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.deleteSelectedDeptoMultiFn($scope.removeDepto);
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "newService":
                if (confirm==0){
                    $scope.addService=obj;
                        $scope.mess2show="El servicio "+obj.serviceName+" en el contrato "+obj.contractNumb+" sera creado.     Confirmar?";                                        
                    
                        console.log("servicio a crear  : "+obj.serviceName);
                        console.log("Numero de contrato: "+obj.contractNumb);
                        console.log("============================================================================");
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('services', $scope.addService, 'add_new_service');
                $('#confirmRequestModal').modal('hide');
                }
            break;
            case "updateService":
                if (confirm==0){
                    $scope.updateService=obj;
                        $scope.mess2show="El servicio "+obj.clientTypeServices+" en el contrato "+obj.numeroContrato+" sera actualizado.     Confirmar?";
                    
                        console.log("servicio a actualizar  : "+obj.clientTypeServices);
                        console.log("Numero de contrato: "+obj.numeroContrato);
                        console.log("============================================================================");
                        //console.log(obj);     
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('services', $scope.updateService, 'update');
                $('#confirmRequestModal').modal('hide');
                }
            break;            
            case "updateSysUser":
                if (confirm==0){
                    if ($scope.sysLoggedUser.idProfileKf==1 && obj.idUser!=0){
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
            case "sign_and_enable_contract":
                if (confirm==0){
                $scope.mess2show="El contrato "+obj.numeroContrato+" sera Aprobado y Activado en la fecha: "+$scope.contract.tmpFechaFirmaActivacion+".     Confirmar?";
                $scope.argObj={};
                $scope.argObj = obj;
                console.log('Contrato a Aprovar y Activar ID: '+obj.idContrato+' Contrato: '+obj.numeroContrato);
                console.log("============================================================================")
                console.log($scope.argObj);
                $('#activationDateContractWindows').modal('hide');
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('contract', $scope.argObj, 'activateDate');
                    $('#confirmRequestModal').modal('hide');
                }            
            break;             
            case "contract_enable":
                if (confirm==0){
                $scope.mess2show="El contrato "+obj.numeroContrato+" sera activado.     Confirmar?";
                $scope.argObj={};
                $scope.argObj = obj;
                console.log('Contrato a habilitar ID: '+obj.idContrato+' Contrato: '+obj.numeroContrato);
                console.log("============================================================================")
                console.log($scope.argObj);   
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('contract', $scope.argObj, 'enable');
                    $('#confirmRequestModal').modal('hide');
                }            
            break;            
            case "contract_disable":
                if (confirm==0){
                $scope.mess2show="El contrato "+obj.numeroContrato+" sera desactivado.     Confirmar?";
                $scope.argObj={};
                $scope.argObj = obj;
                console.log('Contrato a desahibilitar ID: '+obj.idContrato+' Contrato: '+obj.numeroContrato);
                console.log("============================================================================")
                console.log($scope.argObj);   
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('contract', $scope.argObj, 'disable');
                    $('#confirmRequestModal').modal('hide');
                }            
            break;
            case "contract_remove_service_item":
                if (confirm==0){
                $scope.mess2show="El item "+obj2.itemName+" de servicio "+obj.serviceName+" sera removido.     Confirmar?";
                $scope.argObj={};
                $scope.argObj2={};
                $scope.argObj = obj;
                $scope.argObj2 = obj2;
                console.log('item del Servicio a Remover: '+obj.itemName+' Servicio: '+obj.serviceName);
                console.log("============================================================================")
                console.log($scope.argObj);   
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.removeServiceItemFn($scope.argObj, $scope.argObj2);
                    $('#confirmRequestModal').modal('hide');
                }            
            break;            
            case "deleteSingleFile":
                if (confirm==0){
                $scope.delFile=obj;
                $scope.mess2show="El archivo "+obj.title+" sera eliminado.     Confirmar?";

                console.log('Archivo a eliminar ID: '+obj.idClientFiles+' File: '+obj.title);
                console.log("============================================================================")   
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('deleteSingleFile', $scope.delFile);
                    $('#confirmRequestModal').modal('hide');
                }              
            break;
            case "changeBuildingAdmin":
                if (confirm==0){
                $scope.selectedBuilding=obj;
                $scope.mess2show="El Edificio "+obj.name+" sera asociado a la Administracion "+$scope.customer.newAdmin.name+",     Confirmar?";

                console.log('Cambio de administracion al Edificio: '+obj.name+' Administracion: '+$scope.customer.newAdmin.name);
                console.log("============================================================================")   
                $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                    $scope.switchCustomersFn('changeBuildingAdmin', $scope.selectedBuilding);
                    $('#confirmRequestModal').modal('hide');
                }              
            break;            
            default:
            }
        }

});