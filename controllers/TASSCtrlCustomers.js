/**
* Customers Controller
**/
var customer = angular.module("module.Customers", ["tokenSystem", "angular.filter", "services.Customers","services.Address", "services.User", "ngAnimate", "ngSanitize", "ui.bootstrap", "ui.select", "services.Utilities", "bootstrapLightbox"]);

customer.controller('CustomersCtrl', function($scope, $location, $routeParams, blockUI, Lightbox, $timeout, inform, CustomerServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo Clientes");
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
        $location.path("/login");
    }
    $scope.pagination = {
      'maxSize': 5,     // Limit number for pagination display number.  
      'totalCount': 0,  // Total number of items in all pages. initialize as a zero  
      'pageIndex': 1,   // Current page number. First page is 1.-->  
      'pageSizeSelected': 10, // Maximum number of items per page. 
      'totalCount':0
   } 
  


    /**************************************************
    *                                                 *
    *         NG-SWITCH STEP FORM FUNCTIONS           *
    *                                                 *
    **************************************************/
      $scope.pasos = [];
      $scope.pasos= [
                   'PASO 1',
                   'PASO 2',
                   'DEPARTAMENTOS',
                   'FINALIZAR'
                    ];
      $scope.mySwitch = {};
      $scope.mySwitch = $scope.pasos[0];
      $scope.btnShow=true;
      $scope.btnBack=false;
      $scope.stepIndexTmp=0;
      $scope.open_end_date = function() {
        $scope.popup_end_date.opened = true;
      };
      $scope.popup_end_date = {
        opened: false
      };
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

      $scope.incrementStep = function() {
        
        console.log("$scope.hasNextStep:"+$scope.hasNextStep())
        if ( $scope.hasNextStep() )
        {
          //console.log("$scope.getCurrentStepIndex:"+$scope.getCurrentStepIndex())
          var stepIndex = $scope.getCurrentStepIndex();
          var nextStep = stepIndex + 1;
          //console.log("nextStep: "+nextStep);
          $scope.stepIndexTmp = nextStep;
          //console.log("$scope.customer.update.idClientTypeFk: "+$scope.customer.update.idClientTypeFk)
          //console.log("$scope.customer.new.idClientTypeFk: "+$scope.customer.new.idClientTypeFk)
          if ((($scope.customer.new.idClientTypeFk!='' && $scope.customer.new.idClientTypeFk!=undefined && $scope.customer.new.idClientTypeFk!=2) || ($scope.customer.update.idClientTypeFk!='' && $scope.customer.update.idClientTypeFk!=undefined && $scope.customer.update.idClientTypeFk!=2)) && nextStep==2){

            $scope.mySwitch = $scope.pasos[3];
            console.log("entro al if  => "+$scope.mySwitch);
            nextStep=3;
          }else{
            console.log("$scope.mySwitch => "+$scope.pasos[nextStep]);
            $scope.mySwitch = $scope.pasos[nextStep];
          }
          $scope.formValidated=false;
          $scope.btnBack=true;
          if(nextStep>1){
            $scope.btnShow=false;
          }
          //console.log("incrementStep: "+nextStep);
          if(nextStep>2){
            $scope.btnShow=false;
          }
          if(nextStep<=2){
            $scope.btnShow=true;
          }
        }else{
          //console.log("$scope.hasNextStep:"+$scope.hasNextStep())
        }
      };

      $scope.decrementStep = function() {
        if ( $scope.hasPreviousStep() )
        {
          var stepIndex = $scope.getCurrentStepIndex();
          var previousStep = stepIndex - 1;
          $scope.stepIndexTmp = previousStep;
          if (($scope.customer.new.idClientTypeFk!=2 && $scope.customer.update.idClientTypeFk!=2) && previousStep==2){
            $scope.mySwitch = $scope.pasos[1];
          }else{
              $scope.mySwitch = $scope.pasos[previousStep];
          }
          $scope.formValidated=true;
          $scope.btnShow=true;
          if(previousStep<1){$scope.btnBack=false;}
        }
      };

      $scope.enabledNextBtn=function(item){
        //console.clear();
        $scope.formValidated=false;
          console.log("$scope.stepIndexTmp :"+$scope.stepIndexTmp);
        switch ($scope.stepIndexTmp){
          case 0:
            //console.log("ARRAY FIELDS");
            //console.log($scope.customer);
            //console.log("PHONE LIST");
            //console.log($scope.list_phones);
            //console.log("SCHEDULE LIST");
            //console.log($scope.list_schedule_atention);
            //$scope.customer.select.main = {'address':{}, 'department':{}, 'province':{}, 'location':{}}
            if($scope.isNewCustomer){
                if($scope.customer.new.idClientTypeFk==1 || $scope.customer.new.idClientTypeFk==3){//ADMINISTRATION OR COMPANY CUSTOMER
                  //console.log("Validation Customer :::> Administration or Company [ok] ");
                    //console.log("Form Step :::> 1 [ok] ");
                    if($scope.customer.new.typeInmueble!=undefined && $scope.customer.new.name!='' && $scope.customer.new.idAgent!='' && $scope.customer.new.razonSocial!='' && 
                        $scope.customer.new.cuit!='' && ($scope.customer.new.idZonaFk!='' && $scope.customer.new.idZonaFk!=undefined) && $scope.list_schedule_atention.length>=1){
                        //console.log("First inputs :::> [ok] ");
                        if($scope.customer.new.typeInmueble==1){ //Validacion si es Inmueble :::>Department
                            console.log("Inmueble :::> Department [ok] ");
                            if (!$scope.customer.new.isNotClient){
                                console.log("Building not registered :::> [ok] ");
                                var deptoObj=$scope.customer.new.department!=undefined && $scope.customer.new.department!=''?$scope.customer.new.department:null;
                                var floorObj=$scope.customer.new.floor!=undefined && $scope.customer.new.floor!=''?$scope.customer.new.floor:null;
                                if ($scope.customer.select.main.location.selected!=undefined && $scope.customer.select.main.province.selected!=undefined && $scope.customer.new.nameAddress!='' && ((floorObj!=null && typeof floorObj === 'string' && (floorObj.length==2 || parseInt(floorObj)>=1))) && (deptoObj!=null && deptoObj.length>=1)){
                                  $scope.formValidated=true;
                                  console.log("Address inputs :::> [ok] ");
                                  console.log("$scope.formValidated: New "+$scope.formValidated);
                                }else{
                                    console.log("Address inputs :::> [Fail] ");
                                    $scope.formValidated=false;
                                }
                            }else{
                              //console.log("Building registered :::> [ok] ");
                              //console.info($scope.customer.select.main.department);
                              if (($scope.customer.select.main.department!=undefined && $scope.customer.select.main.department!='')  && $scope.customer.select.main.address.selected!=undefined){
                                //console.log("Building Address :::> [ok] ");
                                $scope.formValidated=true;
                                //console.log("$scope.formValidated: New "+$scope.formValidated);
                              }else{
                                //console.log("Building Address :::> [Fail] ");
                                  $scope.formValidated=false;
                              }
                            }
                        }else if($scope.customer.new.typeInmueble>1){ //Validacion si es Inmueble :::> Local/Casa
                            console.log("Inmueble :::> Local/Casa [ok] ");
                            if ($scope.customer.select.main.location.selected!=undefined && $scope.customer.select.main.province.selected!=undefined && $scope.customer.new.nameAddress!=''){
                                $scope.formValidated=true;
                                //console.log("$scope.formValidated: New "+$scope.formValidated);
                            }else{
                                  
                                  $scope.formValidated=false;
                            }
                        }
                    }else{
                        console.log("First inputs :::> [Fail] ");
                        $scope.formValidated=false;
                    }
                }else if($scope.customer.new.idClientTypeFk==2){//BUILDING CUSTOMER
                  //console.log("Validation Customer :::> Edificio [ok] ");
                  if ($scope.stepIndexTmp==0){
                    //console.log("Form Step :::> 1 [ok] ");
                    if($scope.customer.select.company.selected!=undefined && ($scope.customer.new.idZonaFk!='' && $scope.customer.new.idZonaFk!=undefined) && $scope.list_schedule_atention.length>=1 && 
                        $scope.customer.select.main.location.selected!=undefined && $scope.customer.select.main.province.selected!=undefined  && ($scope.customer.new.nameAddress!='' && $scope.addrrSelected)) {
                        $scope.formValidated=true;
                        //console.log("First Steps inputs :::> [ok] ");
                    }else{
                        //console.log("First Steps inputs :::> [Fail] ");
                        $scope.formValidated=false;
                    }
                  }
                }else if($scope.customer.new.idClientTypeFk==4){//BRANCH CUSTOMER
                  console.log("Validation Customer :::> Branch [ok] ");
                  if ($scope.stepIndexTmp==0){
                    //console.log("Form Step :::> 1 [ok] ");
                    
                    if($scope.customer.new.typeInmueble!=undefined && $scope.customer.select.company.selected!=undefined && ($scope.customer.new.idZonaFk!='' && $scope.customer.new.idZonaFk!=undefined) && $scope.list_schedule_atention.length>=1) {
                        //console.log("First inputs :::> [ok] ");
                        if($scope.customer.new.typeInmueble==1){
                          //console.log("Inmueble :::> Department [ok] ");
                          if (!$scope.customer.new.isNotClient){
                              //console.log("Building not registered :::> [ok] ");
                              var deptoObj=$scope.customer.new.department!=undefined && $scope.customer.new.department!=''?$scope.customer.new.department:null;
                              var floorObj=$scope.customer.new.floor!=undefined && $scope.customer.new.floor!=''?$scope.customer.new.floor:null;
                              if ($scope.customer.select.main.location.selected!=undefined && $scope.customer.select.main.province.selected!=undefined && $scope.customer.new.nameAddress!='' && ((floorObj!=null && typeof floorObj === 'string' && floorObj.length==2)||(floorObj!=undefined  && typeof floorObj === 'number' && floorObj.length>=1)) && (deptoObj!=null && deptoObj.length>=1 && deptoObj!='')){
                                $scope.formValidated=true;
                                //console.log("Address inputs :::> [ok] ");
                                ////console.log("$scope.formValidated: New "+$scope.formValidated);
                              }else{
                                  //console.log("Address inputs :::> [Fail] ");
                                  $scope.formValidated=false;
                              }
                          }else{
                            //console.log("Building registered :::> [ok] ");
                            //console.info($scope.customer.select.main.department);
                            if (($scope.customer.select.main.department!=undefined && $scope.customer.select.main.department!='')  && $scope.customer.select.main.address.selected!=undefined){
                              //console.log("Building Address :::> [ok] ");
                              $scope.formValidated=true;
                              //console.log("$scope.formValidated: New "+$scope.formValidated);
                            }else{
                              //console.log("Building Address :::> [Fail] ");
                                $scope.formValidated=false;
                            }
                          }
                        }else if($scope.customer.new.typeInmueble>1){
                          console.log("Inmueble :::> Local/Casa [ok] ");
                          if ($scope.customer.select.main.location.selected!=undefined && $scope.customer.select.main.province.selected!=undefined && $scope.customer.new.nameAddress!=''){
                              $scope.formValidated=true;
                              //console.log("$scope.formValidated: New "+$scope.formValidated);
                            }else{
                                $scope.formValidated=false;
                            }
                        }
                    }else{
                        console.log("First inputs :::> [Fail] ");
                        $scope.formValidated=false;
                    }
                  }
                }else if($scope.customer.new.idClientTypeFk==5){//PARTICULAR CUSTOMER
                  //console.log("Validation Customer :::> Particular [ok] ");
                  if ($scope.stepIndexTmp==0){
                    //console.log("Form Step :::> 1 [ok] ");
                    //console.log($scope.customer.new);
                    if($scope.customer.new.name!='' && $scope.customer.new.idAgent!='' && 
                      $scope.customer.new.mail!='' && ($scope.customer.new.localPhone!='' || $scope.customer.new.mobile!='')){
                        //console.log("First inputs :::> [ok] ");
                        if($scope.list_address_particular.length>=1){
                          //console.log("Address inputs :::> [ok] ");
                          $scope.formValidated=true;
                        }else{
                          //console.log("Address inputs :::> [Fail] ");
                          $scope.formValidated=false;
                        }
                    }else{
                      $scope.formValidated=false;
                      //console.log("$scope.formValidated: New "+$scope.formValidated);
                    }
                  }
                }else{
                    //console.log("First inputs :::> [Fail] ");
                    $scope.formValidated=false;
                }
            }else{
              //if($scope.customer.update.nameLocation!='' && $scope.customer.update.nameState!='' && $scope.customer.update.nameAddress!='' && $scope.customer.update.cuit!='' &&
              //    $scope.customer.update.razonSocial!='' && $scope.customer.update.idAgent!='' && $scope.customer.update.name!='' && $scope.customer.update.idClientTypeFk!='' &&
              //    $scope.list_phones.length>=1 && ($scope.list_schedule_atention.length>=1 || $scope.customer.update.list_schedule_atention.length>=1) && 
              //    ($scope.customer.update.mailFronKey!='' && $scope.customer.update.mailFronKey!=undefined) &&
              //    ($scope.customer.update.mailServiceTecnic!='' && $scope.customer.update.mailServiceTecnic!=undefined) &&
              //    ($scope.customer.update.mailCollection!='' && $scope.customer.update.mailCollection!=undefined)){
              //    $scope.formValidated=true;
              //    console.log("$scope.formValidated: Update "+$scope.formValidated);
              //}else{
              //    $scope.formValidated=false;
              //}
            }
          break;
          case 1:
            $scope.typeOption = item;
            //console.log("$scope.typeOption: "+$scope.typeOption);
            //alert("ENTRO CASE 1");
              if ($scope.isNewCustomer){
                if ($scope.customer.new.idClientTypeFk==1 ){//ADMINISTRATION CUSTOMER
                      //console.log("Validation Customer :::> Administration [ok] ");
                      //console.log("Form Step :::> 2 [ok] ");
                      if (($scope.list_mails_contact.length>=3) &&
                          $scope.list_phones.length>=1)
                      {
                            $scope.formValidated=true;
                          //console.log("Form Step Validation :::> 2 [ok] ");
                      }else{
                          console.log("Form Step Validation :::> [Fail] ");
                          $scope.formValidated=false;  
                      }
                }else if ($scope.customer.new.idClientTypeFk==2){//BUILDING CUSTOMER
                      console.log("Validation Customer :::> Building [ok] ");
                      console.log("Form Step :::> 2 [ok] ");
                      if ($scope.list_mails_contact.length>=3)
                      {
                            $scope.formValidated=true;
                          console.log("Form Step Validation :::> 2 [ok] ");
                      }else{
                          console.log("Form Step Validation :::> [Fail] ");
                          $scope.formValidated=false;  
                      }
                }else if ($scope.customer.new.idClientTypeFk==3){//COMPANY CUSTOMER
                      //console.log("Validation Customer :::> Company [ok] ");
                      //console.log("Form Step :::> 2 [ok] ");
                      if (($scope.list_mails_contact.length>=2) &&
                          $scope.list_phones.length>=1)
                      {
                            $scope.formValidated=true;
                          //console.log("Form Step Validation :::> 2 [ok] ");
                      }else{
                          //console.log("Form Step Validation :::> [Fail] ");
                          $scope.formValidated=false;  
                      }
                }else if ($scope.customer.new.idClientTypeFk==4){//BRANCH CUSTOMER
                      console.log("Validation Customer :::> Branch [ok] ");
                      console.log("Form Step :::> 2 [ok] ");
                      if (($scope.list_mails_contact.length>=2))
                      {
                            $scope.formValidated=true;
                          console.log("Form Step Validation :::> 2 [ok] ");
                      }else{
                          console.log("Form Step Validation :::> [Fail] ");
                          $scope.formValidated=false;  
                      }
                }
              }else{

              }
          break;
          case 2:
            $scope.typeOption = item;
            //console.log("$scope.typeOption: "+$scope.typeOption);
            //alert("ENTRO CASE 1");
            if ($scope.isNewCustomer){
              if ($scope.customer.new.idClientTypeFk==1 ){//ADMINISTRATION CUSTOMER
                    //console.log("Validation Customer :::> Administration [ok] ");
                    //console.log("Form Step :::> 2 [ok] ");
                    if (($scope.list_mails_contact.length>=3) &&
                        $scope.list_phones.length>=1)
                    {
                          $scope.formValidated=true;
                        //console.log("Form Step Validation :::> 2 [ok] ");
                    }else{
                        console.log("Form Step Validation :::> [Fail] ");
                        $scope.formValidated=false;  
                    }
              }else if ($scope.customer.new.idClientTypeFk==2){//BUILDING CUSTOMER
                    console.log("Validation Customer :::> Building [ok] ");
                    console.log("Form Step :::> 3 [ok] ");
                    if ($scope.list_depto_floors.length>0)
                    {
                          $scope.formValidated=true;
                        console.log("Form Step Validation :::> 3 [ok] ");
                    }else{
                        console.log("Form Step Validation :::> [Fail] ");
                        $scope.formValidated=false;  
                    }
              }else if ($scope.customer.new.idClientTypeFk==3){//COMPANY CUSTOMER
                    //console.log("Validation Customer :::> Company [ok] ");
                    //console.log("Form Step :::> 2 [ok] ");
                    if (($scope.list_mails_contact.length>=2) &&
                        $scope.list_phones.length>=1)
                    {
                          $scope.formValidated=true;
                        //console.log("Form Step Validation :::> 2 [ok] ");
                    }else{
                        //console.log("Form Step Validation :::> [Fail] ");
                        $scope.formValidated=false;  
                    }
              }else if ($scope.customer.new.idClientTypeFk==4){//BRANCH CUSTOMER
                    console.log("Validation Customer :::> Branch [ok] ");
                    console.log("Form Step :::> 2 [ok] ");
                    if (($scope.list_mails_contact.length>=2) &&
                        $scope.list_phones.length>=1)
                    {
                          $scope.formValidated=true;
                        console.log("Form Step Validation :::> 2 [ok] ");
                    }else{
                        console.log("Form Step Validation :::> [Fail] ");
                        $scope.formValidated=false;  
                    }
              }
            }else{

            }
          break;
          default:
        }
      }
   /**************************************************************/

      $scope.customerTypeCustomer = function(){
        $scope.customer.new.typeInmueble='';
        $scope.enabledNextBtn();
        //console.info($scope.customer.new.idClientTypeFk);
        if ($scope.customer.new.idClientTypeFk==undefined){
          inform.add("Selecciona un tipo de cliente para continuar.",{
              ttl:5000, type: 'warning'
            });              
          $("#customer_type").focus();
        }else{
          $("#tipo_inmueble").focus();
          $("#schedule_info").fadeIn("slow");
          $timeout(function() {
                    $("#schedule_info").fadeOut("slow");
          }, 30000);
        }
        
      };
      $scope.customerTypeInmueble = function(){
        $scope.customer.new.isNotClient=false;
        $scope.customer.update.isNotClient=false;
        $scope.enabledNextBtn();
        //$("#tipo_inmueble").focus();
        //$("#customer_address").focus();

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
        };//$scope.getUserLists("","");

    /**************************************************
    *            SHOW ONLY ADMIN AND COMPANY          *
    *                 CUSTOMER OPTIONS                *
    **************************************************/
         $scope.filterCustomerType = function(item){
            return (item.idClientTypeFk == "1" ||  item.idClientTypeFk == "3");
        };
    /**************************************************
    *          SHOW ONLY CUSTOMER BY X TYPE OF        *
    *             ADMINISTRATION OR COMPANY           *
    **************************************************/
        $scope.filterCustomerByType = function(item){
          var objOpt = $scope.isNewCustomer==true?$scope.customer.new.idClientTypeFk:$scope.customer.update.idClientTypeFk;
          switch(objOpt){
            case "2":
              return item.idClientTypeFk == "1";
            break;
            case "4":
              return item.idClientTypeFk == "1" || item.idClientTypeFk == "3";
            break;
          }
        };
      /**************************************************
      *                                                 *
      *           LIST CUSTOMER REGISTERED              *
      *                                                 *
      **************************************************/
        $scope.rsCustomerListData = [];
        $scope.rsCustomerAdminListData = [];
        $scope.rsFrmCustomerListData = [];
        $scope.rsCustomerListByTypeData = [];
        $scope.rsCustomerSelectData = [];
        $scope.customersRawData=[];
        $scope.getCustomerListFn = function(optSwitch, opt){
            $scope.rsCustomerListData = [];
            $scope.rsCustomerAdminListData = [];
            $scope.rsFrmCustomerListData = [];
            $scope.rsCustomerListByTypeData = [];
            $scope.rsCustomerSelectData = [];
            switch (optSwitch){
                case 1:
                  $scope.customersRawData = $scope.globalCustomers.administrations;
                break;
                case 2:
                  $scope.customersRawData = $scope.globalCustomers.buildings;
                break;
                case 3:
                  $scope.customersRawData = $scope.globalCustomers.companies;
                break;
                case 4:
                  $scope.customersRawData = $scope.globalCustomers.branches;
                break;
                case 5:
                  $scope.customersRawData = $scope.globalCustomers.particulars;
                break;
                case "registered":
                  $scope.customersRawData = $scope.globalCustomers.registered;
                break;
                case "notregistered":
                  $scope.customersRawData = $scope.globalCustomers.notRegistered;
                break;
                case "all":
                  $scope.customersRawData = $scope.globalCustomers.all;
                break;
                default:
              }
            $scope.rsCustomerListData = $scope.customersRawData;
            $scope.rsCustomerSelectData = $scope.customersRawData;
            $scope.rsCustomerAdminListData = $scope.customersRawData;
            $scope.rsCustomerListByTypeData  = $scope.customersRawData.length>0?$scope.rsCustomerListByTypeData=[]:$scope.customersRawData;
            if(opt==1){$scope.loadPagination($scope.rsCustomerListData, "idClient", "10");}
            if(opt==2){$scope.rsFrmCustomerListData = $scope.customersRawData;}
        };

        $scope.customersSearch={
          "searchFilter":null,
          "isNotCliente":"0",
          "idClientTypeFk":null,
          "isInDebt": null,
          "start":"1",
          "limit":"10",
          "strict": null,
          "totalCount": null
        }
      /**************************************************
      *                                                 *
      *             LIST CUSTOMER SERVICE               *
      *                                                 *
      **************************************************/
        $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
        $scope.setCustomersListRs = {}
        $scope.getCustomerLisServiceFn = function(searchFilter, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit, strict, totalCount){
          console.log($scope.customerSearch);
          console.log("isStockInOffice: "+isStockInOffice);
          console.log("totalCount     : "+totalCount);
          console.log("isInDebt       : "+isInDebt);
          console.log("strict         : "+strict);
          var searchFilter        = searchFilter!=undefined && searchFilter!="" && searchFilter!=null?searchFilter:null;
          var isNotCliente        = isNotCliente!=undefined && isNotCliente!=null?isNotCliente:"0";
          var idClientTypeFk      = idClientTypeFk!=undefined && idClientTypeFk!="" && idClientTypeFk!=null?idClientTypeFk:null;
          var isInDebt            = isInDebt!=false && isInDebt!=undefined && isInDebt!=null?1:null;
          var isStockInBuilding   = isStockInBuilding!=false && isStockInBuilding!=undefined && isStockInBuilding!=null?1:null;
          var isStockInOffice     = isStockInOffice!=false && isStockInOffice!=undefined && isStockInOffice!=null?1:null;
          var start               = start!=undefined && start!=null && ((!isInDebt || !isStockInBuilding || !isStockInOffice) && !strict)?start:"";
          var limit               = limit!=undefined && limit!=null && ((!isInDebt || !isStockInBuilding || !isStockInOffice) && !strict)?limit:"";
          var strict              = strict!=false && strict!=undefined && strict!=null?strict:null;
          var totalCount          = totalCount!=false && totalCount!=undefined && totalCount!=null?totalCount:null;
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
            "totalCount":totalCount
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
          $scope.getCustomersListFn(null, $scope.customersSearch.isNotCliente, $scope.customersSearch.idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, pagIndex, $scope.pagination.pageSizeSelected, false);
        }
      /**************************************************
      *                                                 *
      *           GET CUSTOMER LIST FUNCTION            *
      *                                                 *
      **************************************************/
          $scope.getCustomersListFn = function(search, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit, strict, totalCount) {
            console.log("totalCount:"+totalCount);
            $scope.getCustomerLisServiceFn(search, isNotCliente, idClientTypeFk, isInDebt, isStockInBuilding, isStockInOffice, start, limit, strict, totalCount).then(function(data) {
              console.info(data);
              $scope.rsCustomerListData     = data.customers;
              if (data.totalCount!=undefined){
                $scope.pagination.totalCount  = data.totalCount;
              }
            }, function(err) {
              //error
            });
          }
      /**************************************************
      *                                                 *
      *             LIST CUSTOMER BY TYPE               *
      *                                                 *
      **************************************************/
          $scope.getCustomersListByTypeFn = function(idClientTypeFk) {
            if (idClientTypeFk!=undefined && idClientTypeFk!='' && idClientTypeFk!=null){
              if ($scope.select.filterTypeOfClient!=undefined){
                if (idClientTypeFk!='2'){
                  $scope.customerSearch.isStockInOffice   = false;
                  $scope.customerSearch.isStockInBuilding = false;
                }
                $scope.getCustomerLisServiceFn(null, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", "", $scope.customerSearch.strict, null).then(function(data) {
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
                $scope.getCustomerLisServiceFn($scope.customersSearch.searchFilter, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", "10", $scope.customerSearch.strict, true).then(function(data) {
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
              $scope.getCustomerLisServiceFn($scope.customersSearch.searchFilter, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", "10", $scope.customerSearch.strict, true).then(function(data) {
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
          $scope.getCustomerByTypeFn = function(idClientTypeFk) {
            $scope.getCustomerLisServiceFn(null, $scope.customersSearch.isNotCliente, idClientTypeFk, $scope.customerSearch.isInDebt, $scope.customerSearch.isStockInBuilding, $scope.customerSearch.isStockInOffice, "", "", $scope.customerSearch.strict, null).then(function(data) {
              //console.info(data.customers);
                $scope.rsCustomerAdminListData = data.customers;
            }, function(err) {
              //error
              $scope.rsCustomerAdminListData = [];
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
      *                 CUSTOM SEARCH                   *
      *                                                 *
      **************************************************/
          $scope.realItemList = null;
          $scope.searchboxfilterOffline=null;
          $scope.fullSourceList = [];
          $scope.offlineSearch = function (sourceList, qvalue1, qvalue2, vStrict) {
            console.log("[search]-->qvalue1: "+qvalue1);
            console.log("[search]-->qvalue2: "+qvalue2);
            console.log("[search]-->vStrict: "+vStrict);
            console.log(sourceList);
            //console.log("sourceList: "+sourceList.length);
            //console.log("fullSourceList: "+$scope.fullSourceList.length);
            $scope.fullSourceList=$scope.fullSourceList.length==0 && sourceList.length>$scope.fullSourceList.length?sourceList:$scope.fullSourceList;
            $scope.items = $scope.fullSourceList;
            
            var output=[];
            if ((qvalue1!=undefined && qvalue1!='' && qvalue1!=null) || (qvalue2!=undefined && qvalue2!='' && qvalue2!=null)){
              console.log($scope.items);
              angular.forEach($scope.items,function(customer){
                var customerName=customer.name;
                var customerAddress=customer.address;
                var customerId=customer.idClient;
                var customerType=customer.idClientType;
                var customerNumber=customer.idClientAssociated_SE;
                var customerIsInDebt=customer.IsInDebt;
                var idClientAdminFk = customer.idClientAdminFk;
                var idClientCompaniFk = customer.idClientCompaniFk;
                var customerBusinessName=customer.companyBusinessName==null || customer.companyBusinessName==undefined?null:customer.companyBusinessName;
                var customerbusinessNameBilling=customer.billing_information==null || customer.billing_information==undefined || customer.billing_information.length==0?null:customer.billing_information[0].businessNameBilling;
                //console.log("customerIsInDebt: "+customerIsInDebt);
                    if ((qvalue1!=undefined && qvalue1!='' && qvalue1!=null) && !vStrict){
                        if(customerId.indexOf(qvalue1.toLowerCase())>=0 || (customerName!=null && customerName.indexOf(qvalue1.toUpperCase())>=0) || (customerAddress!=null && customerAddress.indexOf(qvalue1.toUpperCase())>=0) || (customerBusinessName!=null && customerBusinessName.indexOf(qvalue1.toUpperCase())>=0) || (customerbusinessNameBilling!=null && customerbusinessNameBilling.indexOf(qvalue1.toUpperCase())>=0)){
                            output.push(customer);
                            //console.log(output);
                        }
                    }else if ((qvalue1!=undefined && qvalue1!='' && qvalue1!=null) && vStrict){
                        if(customerId===qvalue1 || customerName===qvalue1.toUpperCase() || customerAddress===qvalue1.toUpperCase() || (customerBusinessName!=null && customerBusinessName===qvalue1.toUpperCase()) || (customerbusinessNameBilling!=null && customerbusinessNameBilling===qvalue1.toUpperCase())){
                            output.push(customer);
                            //console.log(output);
                        }
                    }
                    if (qvalue2){
                      if(customerIsInDebt==1 && (idClientAdminFk == $scope.select.filterCustomerIdFk.selected.idClient || idClientCompaniFk == $scope.select.filterCustomerIdFk.selected.idClient)){
                          console.log("customerName: "+customerName+" [customerIsInDebt]["+customerIsInDebt+"]");
                          output.push(customer);
                          //console.log(output);
                      }
                    }
              });
              //console.log(output);
              if (output.length>0){
                $scope.rsCustomerListData = output;
              }else{
                $scope.rsCustomerListData = [];
              }
            }else{
              $scope.getLisOfCustomersByIdFn($scope.select.filterCustomerIdFk.selected.idClient, true);
            }
          };
      /**************************************************
      *                                                 *
      *         LIST ADMINISTRATION CUSTOMERS           *
      *                                                 *
      **************************************************/
          $scope.getAdminCustomersListFn = function() {
            $scope.getCustomerLisServiceFn(null,"0",1, null, "","",null,null,null,null).then(function(data) {
              $scope.rsCustomerAdminListData = data.customers;
            }, function(err) {
              $scope.customersSearch.idClientTypeFk = null;
            });
          };//$scope.getAdminCustomersListFn();
      /**************************************************
      *                                                 *
      *            LIST COMPANIES CUSTOMERS             *
      *                                                 *
      **************************************************/
        $scope.getCompaniesCustomersListFn = function() {
          $scope.getCustomerLisServiceFn(null,"0",3, null, "","",null,null,null,null).then(function(data) {
            $scope.rsCustomerCompaniesListData = data.customers;
          }, function(err) {
            $scope.customersSearch.idClientTypeFk = null;
          });
        };//$scope.getCompaniesCustomersListFn();

      /**************************************************
      *                                                 *
      *                GET TYPE OF CUSTOMER             *
      *                                                 *
      **************************************************/
          $scope.rsCustomerTypeData = {};
          $scope.rsCustomerTypeFilterData = [];
          $scope.getCustomerTypesFn = function(){
            CustomerServices.getCustomerType().then(function(data){
              for (var type in data){
                if(data[type].idClientType==1 || data[type].idClientType==3){
                  $scope.rsCustomerTypeFilterData.push(data[type]);
                }
              }
              $scope.rsCustomerTypeData = data;
                //console.log($scope.rsCustomerTypeFilterData);
            });
          };$scope.getCustomerTypesFn();
      /**************************************************
      *                                                 *
      *                GET CUSTOMER BY ID               *
      *                                                 *
      **************************************************/
          $scope.getCustomerByIdFn = function(id){
            CustomerServices.getCustomersById(id).then(function(response){
              if(response.status==200){
                $scope.customer.files   = response.data;
                if ($scope.customer.files.files_uploaded.length==0){
                  $('#listCustomerFiles').modal('hide');
                  $scope.customer.files = {};
                }            
              }
            });
          };
      /**************************************************
      *                                                 *
      *       GET LIST OF CUSTOMER BY CUSTOMER ID       *
      *                                                 *
      **************************************************/
          $scope.rsListCustomersOfCustomerData = [];
          $scope.rsAllCustomersList = [];
          $scope.getLisOfCustomersByIdFn = function(id){
            console.log("getLisOfCustomersByIdFn: "+id);
            $scope.rsCustomerListData=[];
            CustomerServices.getCustomersListByCustomerId(id).then(function(response){
              
              if(response.status==200){
                $scope.rsCustomerListData     = response.data;
                $scope.pagination.totalCount  = response.data.length;
                console.log($scope.rsCustomerListData);
                if($scope.select.filterTypeOfClient!=undefined && $scope.select.filterCustomerIdFk.selected!=undefined){
                  console.log("select.filterTypeOfClient: ");
                  console.log($scope.select.filterTypeOfClient);
                  console.log("select.filterCustomerIdFk: ");
                  console.log($scope.select.filterCustomerIdFk.selected);
                  //$scope.offlineSearch($scope.rsCustomerListData,$scope.searchboxfilterOffline,$scope.customerSearch.isInDebt,false);
                }
              }else{
                $scope.rsCustomerListData     = [];
              }
              //$scope.loadPagination($scope.rsCustomerListData, "idClientIndex", "10");
              //console.log($scope.rsCustomerListData);
            });
          };

          /**
          * Modal Confirmation function 
          **/
            $scope.modalConfirmation = function(opt, confirm, obj, obj2){
              $scope.swMenu = opt;
              console.log($scope.swMenu);
              $scope.vConfirm = confirm;
              var tmpOpt=$scope.div2Open;
              //console.log(tmpOpt);
              $scope.mess2show="";
              switch ($scope.swMenu){
              case "closeCustomerWindow":
                  if (confirm==0){
                      if ($scope.isNewCustomer==true){
                      $scope.mess2show="Se perderan todos los datos cargados para el registro del cliente, esta seguro que desea cancelar?";
                      }else{
                      $scope.mess2show="Se perderan todas las modificaciones realizadas en el registro actual, esta seguro que desea cancelar la modificacion?";
                      }    
                      $('#confirmRequestModal').modal('show');
                  }else if (confirm==1){
                      $('#confirmRequestModal').modal('hide');
                      $('#customerParticularAddress').modal('hide');
                      $('#BuildingUnit').modal('hide');
                      $('#functionalUnit').modal('hide');
                      $('#AddressLatLon').modal('hide');
                      $('#RegisterModalCustomer').modal('hide');
                      $('#UpdateModalCustomer').modal('hide');
                      $('#changeModalAdmin').modal('hide');
                      if($scope.sysContent!="" && $scope.sysContent=="registeredCustomers"){
                        $scope.switchCustomersFn('dashboard','', 'registered')
                      }else if($scope.sysContent!="" && $scope.sysContent=="registeredNotCustomers"){
                        $scope.switchCustomersFn('dashboard','', 'unregistered')
                      }
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
              //removeContactUserFn
              case "removeContactUser":
                if (confirm==0){
                    $scope.removeContactUser=obj;
                        $scope.mess2show="El usuario "+obj.fullNameUser+" sera removido de los usuarios de contacto.     Confirmar?";                                        
                      
                        console.log('Usuario a remover ID: '+obj.idUserFk);
                        console.log("============================================================================");
                        //console.log(obj);     
                  $('#confirmRequestModal').modal('toggle');
                }else if (confirm==1){
                      $scope.removeContactUserFn($scope.removeContactUser);
                  $('#confirmRequestModal').modal('hide');
                }
              break;
              case "isInDebtClient":
                  if (confirm==0){
                    $scope.customerDetail=obj;
                    if($scope.customer.details.IsInDebtTmp){
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] sera deshabilitado.     Confirmar?";
                      console.log("============================================================================");
                      console.log("Deshabilitar al cliente por mora.");
                      console.log("============================================================================");
                      console.log("ID del Cliente             : "+obj.idClient);
                      console.log("Dirección del consorcio    : "+obj.address);
                      console.log("============================================================================");
                    }else{
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] sera habilitado.     Confirmar?";
                        console.log("============================================================================");
                        console.log("Habilitar el cliente, ya no se encuentra en mora.");
                        console.log("============================================================================");
                        console.log("ID del Cliente             : "+obj.idClient);
                        console.log("Dirección del consorcio    : "+obj.address);
                        console.log("============================================================================");
                    }   
                    $('#confirmRequestModalCustom').modal({backdrop: 'static', keyboard: false});
                    $('#confirmRequestModalCustom').on('shown.bs.modal', function () {});
                    
                  }else if (confirm==1){
                      if($scope.customer.details.IsInDebtTmp){
                          $scope.customerDetail.IsInDebt=1;
                      }else{
                          $scope.customerDetail.IsInDebt=0;
                      }
                      console.log($scope.customerDetail);
                      $scope.switchCustomersFn('isInDebtClient', $scope.customerDetail);
                  $('#confirmRequestModalCustom').modal('hide');
                  }else if (confirm==null){
                      if ($scope.customer.details.IsInDebt==0 || $scope.customer.details.IsInDebt==null){
                          $scope.customer.details.IsInDebtTmp=false
                      }else{
                          $scope.customer.details.IsInDebtTmp=true
                      }
                      
                  }
              break;
              case "isStockInBuilding":
                  if (confirm==0){
                    $scope.customerDetail=obj;
                    if($scope.customer.details.isStockInBuildingTmp){
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] posee stock en edificio.     Confirmar?";
                      console.log("============================================================================");
                      console.log("El cliente posee stock en edificio.");
                      console.log("============================================================================");
                      console.log("ID del Cliente             : "+obj.idClient);
                      console.log("Dirección del consorcio    : "+obj.address);
                      console.log("============================================================================");
                    }else{
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] no posee stock en edificio.     Confirmar?";
                        console.log("============================================================================");
                        console.log("El cliente no posee stock en edificio.");
                        console.log("============================================================================");
                        console.log("ID del Cliente             : "+obj.idClient);
                        console.log("Dirección del consorcio    : "+obj.address);
                        console.log("============================================================================");
                    }
                    $('#confirmRequestModalCustom').modal({backdrop: 'static', keyboard: false});
                    $('#confirmRequestModalCustom').on('shown.bs.modal', function () {});
                  }else if (confirm==1){
                      if($scope.customer.details.isStockInBuildingTmp){
                          $scope.customerDetail.isStockInBuilding=1;
                      }else{
                          $scope.customerDetail.isStockInBuilding=0;
                      }
                      console.log($scope.customerDetail);
                      $scope.switchCustomersFn('isStockInBuilding', $scope.customerDetail);
                  $('#confirmRequestModalCustom').modal('hide');
                  }else if (confirm==null){
                      console.log($scope.customerDetail);
                      if ($scope.customer.details.isStockInBuilding==0 || $scope.customer.details.isStockInBuilding==null){
                          $scope.customer.details.isStockInBuildingTmp=false
                      }else{
                          $scope.customer.details.isStockInBuildingTmp=true
                      }
                      
                  }
              break;
              case "isStockInOffice":
                console.log(confirm);
                  if (confirm==0){
                    $scope.customerDetail=obj;
                    if($scope.customer.details.isStockInOfficeTmp){
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] posee stock en oficina.     Confirmar?";
                      console.log("============================================================================");
                      console.log("El cliente posee stock en oficina.");
                      console.log("============================================================================");
                      console.log("ID del Cliente             : "+obj.idClient);
                      console.log("Dirección del consorcio    : "+obj.address);
                      console.log("============================================================================");
                    }else{
                      $scope.mess2show="El Cliente "+obj.name+" ["+obj.ClientType+"] no posee stock en oficina.     Confirmar?";
                        console.log("============================================================================");
                        console.log("El cliente no posee stock en oficina.");
                        console.log("============================================================================");
                        console.log("ID del Cliente             : "+obj.idClient);
                        console.log("Dirección del consorcio    : "+obj.address);
                        console.log("============================================================================");
                    }
                    $('#confirmRequestModalCustom').modal({backdrop: 'static', keyboard: false});
                    $('#confirmRequestModalCustom').on('shown.bs.modal', function () {});
                  }else if (confirm==1){
                      if($scope.customer.details.isStockInOfficeTmp){
                          $scope.customerDetail.isStockInOffice=1;
                      }else{
                          $scope.customerDetail.isStockInOffice=0;
                      }
                      console.log($scope.customerDetail);
                      $scope.switchCustomersFn('isStockInOffice', $scope.customerDetail);
                  $('#confirmRequestModalCustom').modal('hide');
                  }else if (confirm==null){
                      console.log($scope.customerDetail);
                      if ($scope.customer.details.isStockInOffice==0 || $scope.customer.details.isStockInOffice==null){
                          $scope.customer.details.isStockInOfficeTmp=false
                      }else{
                          $scope.customer.details.isStockInOfficeTmp=true
                      }
                      
                  }
              break;
              default:
              }
            }
    /************************************************************************************************/ 
          
        /**************************************************
        *                                                 *
        *           GET SELECTED COMPANY BY ID            *
        *                                                 *
        **************************************************/
            $scope.rsCustomerData={};
            $scope.getCustomersByIdFn = function(opt, idClient, opt2){
              //console.log(obj);
              if (idClient!=undefined){
                CustomerServices.getCustomersById(idClient).then(function(response){
                  if(response.status==200){
                    $scope.rsCustomerData = response.data;
                    console.log($scope.rsCustomerData);
                    $scope.switchCustomersFn(opt, $scope.rsCustomerData, opt2);
                  }
                });
              }else{
                  inform.add('Seleccione una Administracion/Empresa. ',{
                    ttl:4000, type: 'info'
                  });
              }
            }

        /**************************************************
        *                                                 *
        *                GET BUILDINGS                    *
        *                                                 *
        **************************************************/
            $scope.rsBuildingAddressData = {};
            $scope.getBuildingsFn = function(){
              addressServices.getBuildings().then(function(data){
                  $scope.rsBuildingAddressData = data;
                  //console.log($scope.rsBuildingAddressData);
              });
            };
        /**************************************************
        *                                                 *
        *        GET BUILDING DEPTOS BY DEPTO ID          *
        *                                                 *
        **************************************************/
            $scope.rsBuildingDepartmentsData = {};
            $scope.getBuildingsDeptosByDeptoIdFn = function(id){
              addressServices.getBuildingsDeptosFromDeptoId(id).then(function(data){
                  $scope.rsBuildingDepartmentsData = data;
                  //console.log($scope.rsBuildingDepartmentsData);
              });
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
        *             GET LOCATION BY NAME                *
        *                  ARG GOB API                    *
        *                                                 *
        **************************************************/
          $scope.rsLocations_API_Data = {};
          $scope.getLocationByNameFn = function(name){
            addressServices.getLocationsByName(name).then(function(data){
                $scope.rsLocations_API_Data = data;
                //console.log($scope.rsLocations_API_Data);
                console.info("getLocationByNameFn => rsLocations_API_Data =>Length: "+$scope.rsLocations_API_Data.length);
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
            var searchAddress={};
            var rsJsonData={};
            $scope.sysApiAddressNotFound=false;
            $scope.customerNotClient={};
            $scope.searchAddressByNameFn = function(item, opt1, opt2){
              $scope.customerNotClient={};
              if (!$scope.gobApiAddressNotFound){
                console.log("$scope.gobApiAddressNotFound: "+$scope.gobApiAddressNotFound);
                if ((($scope.customer.new.typeInmueble=='1' || $scope.customer.update.idTipoInmuebleFk=='1') || $scope.customer.particular.typeInmueble=='1') || ($scope.customer.new.idClientTypeFk=='2' || $scope.customer.update.idClientTypeFk=='2')){
                  var nameAddress=item.calle.nombre+" "+item.altura.valor;
                  searchAddress.address=nameAddress;
                  blockUI.start('Verificando direccion: '+nameAddress);
                  $timeout(function() {
                    addressServices.checkIfBuildingExistByAddressName(searchAddress).then(function(response){
                      rsJsonData=response;
                        if(rsJsonData.status==200){
                          console.log(rsJsonData.data)
                          $scope.customerNotClient=response.data;
                          blockUI.message('Direccion: '+nameAddress+' encontrada.');
                          $timeout(function() {
                            $scope.fillData(opt1, opt2, rsJsonData);
                          }, 1500);
                          $scope.sysApiAddressNotFound=false;
                        }else{
                          $scope.sysApiAddressNotFound=true;
                          blockUI.message('Direccion: '+nameAddress+' no encontrada en el sistema.');
                          $timeout(function() {
                            item.status=404;
                            $scope.fillData(opt1, opt2, item);
                          }, 1500);
                        } 
                    });   
                  }, 1500);
                }else{
                  item.status=404;
                  $scope.fillData(opt1, opt2, item);
                }
              }else{
                  var nameAddress=item;
                  searchAddress.address=nameAddress;
                  blockUI.start('Verificando direccion: '+nameAddress);
                  $timeout(function() {
                    addressServices.checkIfBuildingExistByAddressName(searchAddress).then(function(data){
                      rsJsonData=data;
                      console.log(rsJsonData)
                        if(rsJsonData.status==200){
                          blockUI.message('Direccion: '+nameAddress+' encontrada.');
                          $timeout(function() {
                            $scope.fillData(opt1, opt2, rsJsonData);
                          }, 1500);
                          $scope.sysApiAddressNotFound=false;
                        }else{
                          $scope.sysApiAddressNotFound=true;
                          blockUI.message('Direccion: '+nameAddress+' no encontrada en el sistema.');
                          $timeout(function() {
                            blockUI.stop();
                              switch(opt2){
                                case "main":
                                  $scope.customer.new.address=nameAddress.toUpperCase();
                                  $scope.customer.new.nameAddress=nameAddress.toUpperCase(); 
                                  $scope.customer.new.addressLat=null;
                                  $scope.customer.new.addressLon=null;
                                  $scope.geoLocation.option="main";
                                  $scope.geoLocation.address=nameAddress.toUpperCase();
                                  $scope.addrrSelected=true;
                                  $("#AddressLatLon").modal({backdrop: 'static', keyboard: false});
                                  $("#AddressLatLon").on('shown.bs.modal', function () {
                                    $("#addr_Lat").focus();
                                  });
                                break;
                                case "payment":
                                    $scope.customer.new.billing_information_details.nameAddress=nameAddress.toUpperCase();
                                break;
                                case "particular":
                                  $scope.customer.particular.address=nameAddress.toUpperCase();              
                                  $scope.customer.particular.nameAddress=nameAddress.toUpperCase(); 
                                  $scope.customer.particular.addressLat=null;
                                  $scope.customer.particular.addressLon=null;
                                  $scope.geoLocation.option="particular";
                                  $scope.geoLocation.address=nameAddress.toUpperCase();
                                  $scope.addrrSelected=true;
                                  $("#AddressLatLon").modal({backdrop: 'static', keyboard: false});
                                  $("#AddressLatLon").on('shown.bs.modal', function () {
                                    $("#addr_Lat").focus();
                                  });
                                break;
                              }
                          }, 1500);
                        } 
                    });   
                  }, 1500);
              }
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
                  console.log(data);
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
                  }else if(data==null){
                    $scope.gobApiAddressNotFound=true;
                    $scope.geoLocation = {'address':'','addressLat':'', 'addressLon':'', 'option':''};
                    inform.add('Direccion no encontrada en la API del Servicio de Normalizacion de Datos Geograficos. ',{
                        ttl:4000, type: 'danger'
                    });
                    $scope.searchAddressByNameFn(name,'address', opt);
                  }else{
                    inform.add('Error Api Gob AR: '+data.message+'. ',{
                      ttl:4000, type: 'danger'
                    });
                  }
                });
              }else{
                    inform.add('Debe indicar el nombre y numero de la calle. ',{
                      ttl:2000, type: 'warning'
                    });
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
          
            $scope.closeAddressLatLonModal = function(){
              $("#AddressLatLon").modal('hide');
              $scope.geoLocation={};
            }
            $scope.setAddressLatLonFn = function(obj){
              switch(obj.option){
                case "main":
                  $scope.customer.new.addressLat=obj.addressLat;
                  $scope.customer.new.addressLon=obj.addressLon;
                break;
                case "particular":
                  $scope.customer.particular.addressLat=obj.addressLat;
                  $scope.customer.particular.addressLon=obj.addressLon;
                break;  
              }
                inform.add('Coordenadas de Lat:'+obj.addressLat+'/Lon:'+obj.addressLon+' han sido asignadas satisfactoriamente.. ',{
                          ttl:4000, type: 'success'
                });
                $("#AddressLatLon").modal('hide');
            }
        /**************************************************
        *                                                 *
        *               Fill Address Data                 *
        *                                                 *
        **************************************************/
            $scope.addrrSelected=false;
            $scope.fillData=function(opt1, opt2, obj){
              console.log(opt1);
              console.log(opt2);
              console.log(obj);
              switch (opt1){
                case "address":
                  switch(opt2){
                    case "main":
                    case "particular":
                      if(obj.status==200){
                        if (opt2=="main"){
                          console.log(obj.data);
                          $scope.customer.new.isNotClient=true;
                          $scope.customer.select.main.address.selected=(obj.data);
                          $scope.rsAddress_API_Data_Main=null;
                        }else if (opt2=="particular"){
                          $scope.customer.particular.isBuilding=true;
                          //console.log(obj.data);
                          $scope.customer.particular.select.address.selected={address:obj.data.address};
                          $scope.rsAddress_API_Data_PCA=null;
                        }
                        $timeout(function() {
                          $scope.getBuildingsDeptosFn(obj.data.idClient);
                        }, 1500);
                        if ($scope.customer.new.idClientTypeFk!='2' || $scope.customer.update.idClientTypeFk!='2'){
                          blockUI.message('Cargando departamentos de '+obj.data.address);
                        }
                        $timeout(function() {
                            blockUI.stop();
                        }, 1500);
                        inform.add('La direccion '+obj.data.address+', se encuentra registrada. ',{
                            ttl:4000, type: 'success'
                        });
                        if ($scope.customer.new.idClientTypeFk=='2'){$scope.customer.new.nameAddress='';}
                      }else{
                        //console.log(obj.status);
                        blockUI.message('Complete los campos restantes.');
                        if (opt2=="main"){
                          if ($scope.isNewCustomer){
                            $scope.customer.new.nameAddress=obj.calle.nombre+" "+obj.altura.valor;              
                            $scope.customer.new.address=obj.calle.nombre+" "+obj.altura.valor;
                            $scope.customer.new.addressLat=obj.ubicacion.lat;
                            $scope.customer.new.addressLon=obj.ubicacion.lon;
                          }else{
                            $scope.customer.update.nameAddress=obj.calle.nombre+" "+obj.altura.valor;              
                            $scope.customer.update.address=obj.calle.nombre+" "+obj.altura.valor;
                            $scope.customer.update.addressLat=obj.ubicacion.lat;
                            $scope.customer.update.addressLon=obj.ubicacion.lon;
                          }
                          
                          $scope.rsAddress_API_Data_Main=null;
                        }else if (opt2=="particular"){
                          $scope.customer.particular.nameAddress=obj.calle.nombre+" "+obj.altura.valor;
                          //$scope.customer.particular.address=obj.calle.nombre+" "+obj.altura.valor;
                          $scope.customer.particular.addressLat=obj.ubicacion.lat;
                          $scope.customer.particular.addressLon=obj.ubicacion.lon;
                          $scope.rsAddress_API_Data_PCA=null;
                          $scope.addrrSelected=true;
                        }
                        $scope.addrrSelected=true;
                        $timeout(function() {
                          blockUI.stop();
                        }, 1500);
                      }
                        $scope.enabledNextBtn();
                    break;
                    case "update":
                      $scope.customer.update.nameAddress=obj.calle.nombre+" "+obj.altura.valor;
                      $scope.customer.update.address=obj.calle.nombre+" "+obj.altura.valor;
                      $scope.customer.update.addressLat=obj.ubicacion.lat;
                      $scope.customer.update.addressLon=obj.ubicacion.lon;
                      $scope.rsAddress_API_Data_Main=null;
                    break;
                    case "payment":
                      console.log(obj);
                      if ($scope.isNewCustomer){
                        $scope.customer.new.billing_information_details.nameAddress=obj.calle.nombre+" "+obj.altura.valor;
                      }else{
                        $scope.customer.update.billing_information_details.nameAddress=obj.calle.nombre+" "+obj.altura.valor;
                      }
                      console.log($scope.customer.update.billing_information_details);
                      $scope.rsAddress_API_Data_Payment=null;
                      $scope.addrrSelected=true;
                      $scope.enabledNextBtn();
                    break;                          
                  }
                break;
                default:
              }

            }
            $scope.sysArrFound=false;
            $scope.rsStatesList={}; $scope.rsLocationsList={};
            $scope.rsStatesList2={}; $scope.rsLocationsList2={};
            $scope.sysFindInArrFn=function(string, objArr, opt){
              var nombre_1="";
              var nombre_2="";
              $scope.objArrTmp={};
              $scope.objArrTmp=objArr;
              console.log($scope.objArrTmp);
              var output=[];
              var i=0;
              if (string!=undefined && string!=""){
                angular.forEach($scope.objArrTmp,function(objTmp){
                  console.log(objTmp);
                  nombre_1=objTmp.province
                  nombre_2=objTmp.location;
                  var nameTmp=!nombre_1?nombre_2:nombre_1;
                  console.info(nameTmp);
                  if(nameTmp.toLowerCase().indexOf(string.toLowerCase())>=0){
                    output.push({objTmp});
                  }
                });
              }else{
                    $scope.objArrTmp=null;
                    $scope.sysArrFound=false;
              }
              switch (opt){
                case "states":
                  $scope.rsStatesList=output;
                  console.log($scope.rsStatesList);
                break;
                case "locations":
                  $scope.rsLocationsList=output;
                  console.log($scope.rsLocationsList);
                break;
                case "states2":
                  $scope.rsStatesList2=output;
                  console.log($scope.rsStatesList2);
                break;
                case "locations2":
                  $scope.rsLocationsList2=output;
                  console.log($scope.rsLocationsList2);
                break;        
                default:
              }   
            }
        /************************************************************************************************/
          /**************************************************
          *                                                 *
          *             AUTH USER FOR CUSTOMER              *
          *                                                 *
          **************************************************/    
            $scope.selectAuthUserDataFn=function(obj){
              $scope.list_id_user = [];
              $scope.list_users   = [];
              //console.log(obj.list_client_user);
              if (obj.list_client_user.length>0){
                for (var key in  obj.list_client_user){
                  //console.log(obj.diviceOpening[key]);
                  $scope.list_id_user.push({'idDiviceOpeningFk':obj.list_client_user[key].idUserFk});
                  $scope.list_divices.push({'idDiviceOpeningFk':obj.diviceOpening[key].idUserFk, 'diviceOpening':obj.diviceOpening[key].diviceOpening});
                }
              }else{
                //console.log("obj.diviceOpening is empty");
              }
              $('#updateProduct').modal('show');
              //console.log(obj);
            }
            $scope.addAuthUserFn = function (obj, opt){
              if (opt=="new"){
                if ($scope.list_users.length<=0){            
                  $scope.list_client_user.push({'idUserFk':obj.idUser});
                  $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser});
                }else{
                  for (var key in  $scope.list_client_user){
                  // console.log(key);
                    //console.log("Validando: "+$scope.list_client_user[key].idUserFk+" == "+obj.idUser);
                      if ( $scope.list_client_user[key].idUserFk==obj.idUser){
                        inform.add("El Usuario "+obj.fullNameUser+", ya se encuentra Autorizado.",{
                          ttl:5000, type: 'success'
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
                        //console.log("ADD_NO_EXIST");
                      $scope.list_client_user.push({'idUserFk':obj.idUser});
                      $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser});
                    }
                }
              }else if (opt=="update"){
                if ($scope.list_users.length<=0){
                  var idClientFk=$scope.isUpdateCustomer==true?$scope.customer.update.idClient:$scope.customer.info.idClient;
                  $scope.list_client_user.push({'idUserFk':obj.idUser, 'idClientFk':idClientFk});
                  $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser, 'idClientFk':idClientFk});
                }else{
                  for (var key in  $scope.list_client_user){
                  // console.log(key);
                    //console.log("Validando: "+$scope.list_client_user[key].idUserFk+" == "+obj.idUser);
                      if ( $scope.list_client_user[key].idUserFk==obj.idUser){
                        inform.add("El Usuario "+obj.fullNameUser+", ya se encuentra Autorizado.",{
                          ttl:5000, type: 'success'
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
                        //console.log("ADD_NO_EXIST");
                      console.log("$scope.isUpdateCustomer: "+$scope.isUpdateCustomer);
                      var idClientFk=$scope.isUpdateCustomer==true?$scope.customer.update.idClient:$scope.customer.info.idClient;
                      $scope.list_client_user.push({'idUserFk':obj.idUser, 'idClientFk':idClientFk});
                      $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser, 'idClientFk':idClientFk});
                    }
                }
                if($scope.isListCustomer==true && $scope.isNewCustomer==false && $scope.isUpdateCustomer==false){
                  $scope.isArrChanged=true;
                }else{
                  $scope.isArrChanged=false;
                }          
              }
              //console.log("OBJ A ADICIONAR:");
              //console.log(obj);
              //console.log("list_client_user:");
              //console.log($scope.list_client_user);
              //console.log("list_users:");
              //console.log($scope.list_users);
              console.log("ArrayChanged: "+$scope.isArrChanged);
              $scope.authUser.selected=undefined;
            }
            $scope.isArrChanged=false;
            $scope.removeAuthUserFn = function (obj){
              //console.log($scope.list_client_user);
              for (var key in  $scope.list_client_user){
                  if ( $scope.list_client_user[key].idUserFk==obj.idUserFk){
                      $scope.list_users.splice(key,1);
                      $scope.list_client_user.splice(key,1);
                      if($scope.isListCustomer==true && $scope.isNewCustomer==false && $scope.isUpdateCustomer==false){
                        $scope.isArrChanged=true;
                      }else{
                        $scope.isArrChanged=false;
                      }
                  }
              }
              //console.log("OBJ A ELIMINAR:");
              //console.log(obj);
              //console.log($scope.list_client_user);
              //console.log($scope.list_users);
              console.log("ArrayChanged: "+$scope.isArrChanged);
            }
            $scope.removeAllUsers = function(){
              for (var key in  $scope.list_users){
                $scope.list_users.splice(key,1);
                $scope.list_client_user.splice(key,1);
              }
            }
            $scope.closeAllowedUsersFn = function(){
              $("#allowedUsers").modal('hide');
              $("#allowedUsers").on('hidden.bs.modal', function () {
                if($scope.sysContent!="" && $scope.sysContent=="registeredCustomers"){
                  $scope.switchCustomersFn('dashboard','', 'registered')
                }else if($scope.sysContent!="" && $scope.sysContent=="registeredNotCustomers"){
                  $scope.switchCustomersFn('dashboard','', 'unregistered')
                }
              });
            }
          /**************************************************
          *                                                 *
          *             CONTACT USER CUSTOMER               *
          *                                                 *
          **************************************************/
            $scope.allowedUsers = {}
            $scope.showCurrentUserInfoFn = function(idUser){
              //console.log("Usuario ID: "+idUser);
              $scope.allowedUsers={};
              for (var key in $scope.rsList.clientUser){
                if ($scope.rsList.clientUser[key].idUser==idUser){
                  $scope.allowedUsers=$scope.rsList.clientUser[key];
                  //console.log($scope.rsList.clientUser[key]);
                }
              }
              $("#allowedUserInfo").modal('toggle');
              $("#allowedUserInfo").on('shown.bs.modal', function () {
                $('#cancelModalWindow').focus();
              });        
            }
            $scope.addContactUserFn = function (obj, opt){
              if (opt=="new"){
                if ($scope.list_users.length<=0){            
                  $scope.list_client_user.push({'idUserFk':obj.idUser});
                  $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser});
                }else{
                  for (var key in  $scope.list_client_user){
                  // console.log(key);
                    //console.log("Validando: "+$scope.list_client_user[key].idUserFk+" == "+obj.idUser);
                      if ( $scope.list_client_user[key].idUserFk==obj.idUser){
                        inform.add("El Usuario "+obj.fullNameUser+", ya se encuentra Autorizado.",{
                          ttl:5000, type: 'success'
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
                        //console.log("ADD_NO_EXIST");
                      $scope.list_client_user.push({'idUserFk':obj.idUser});
                      $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser});
                    }
                }
              }else if (opt=="update"){
                if ($scope.list_users.length<=0){
                  var idClientFk=$scope.isUpdateCustomer==true?$scope.customer.update.idClient:$scope.customer.info.idClient;
                  $scope.list_client_contact_users.push({'idUserFk':obj.idUser, 'idClientFk':idClientFk});
                  $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser, 'idClientFk':idClientFk});
                }else{
                  for (var key in  $scope.list_client_contact_users){
                  // console.log(key);
                    //console.log("Validando: "+$scope.list_client_contact_users[key].idUserFk+" == "+obj.idUser);
                      if ( $scope.list_client_contact_users[key].idUserFk==obj.idUser){
                        inform.add("El Usuario "+obj.fullNameUser+", ya se encuentra Autorizado.",{
                          ttl:5000, type: 'success'
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
                        //console.log("ADD_NO_EXIST");
                      console.log("$scope.isUpdateCustomer: "+$scope.isUpdateCustomer);
                      var idClientFk=$scope.isUpdateCustomer==true?$scope.customer.update.idClient:$scope.customer.info.idClient;
                      $scope.list_client_contact_users.push({'idUserFk':obj.idUser, 'idClientFk':idClientFk});
                      $scope.list_users.push({'idUserFk':obj.idUser, 'fullNameUser':obj.fullNameUser, 'idClientFk':idClientFk});
                    }
                }
                if($scope.isListCustomer==true && $scope.isNewCustomer==false && $scope.isUpdateCustomer==false){
                  $scope.isArrChanged=true;
                }else{
                  $scope.isArrChanged=false;
                }          
              }
              //console.log("OBJ A ADICIONAR:");
              //console.log(obj);
              //console.log("list_client_contact_users:");
              //console.log($scope.list_client_contact_users);
              //console.log("list_users:");
              //console.log($scope.list_users);
              console.log("ArrayChanged: "+$scope.isArrChanged);
              $scope.contactUser.selected=undefined;
            }
            $scope.isArrChanged=false;
            $scope.removeContactUserFn = function (obj){
              //console.log($scope.list_client_contact_users);
              for (var key in  $scope.list_client_contact_users){
                  if ( $scope.list_client_contact_users[key].idUserFk==obj.idUserFk){
                      $scope.list_users.splice(key,1);
                      $scope.list_client_contact_users.splice(key,1);
                      if($scope.isListCustomer==true && $scope.isNewCustomer==false && $scope.isUpdateCustomer==false){
                        $scope.isArrChanged=true;
                      }else{
                        $scope.isArrChanged=false;
                      }
                  }
              }
              //console.log("OBJ A ELIMINAR:");
              //console.log(obj);
              //console.log($scope.list_client_contact_users);
              //console.log($scope.list_users);
              console.log("ArrayChanged: "+$scope.isArrChanged);
            }
            $scope.removeAllUsers = function(){
              for (var key in  $scope.list_users){
                $scope.list_users.splice(key,1);
                $scope.list_client_user.splice(key,1);
              }
            }
            $scope.closeContactUsersFn = function(){
              $("#contactUsers").modal('hide');
              $("#contactUsers").on('hidden.bs.modal', function () {
                if($scope.sysContent!="" && $scope.sysContent=="registeredCustomers"){
                  $scope.switchCustomersFn('dashboard','', 'registered')
                }else if($scope.sysContent!="" && $scope.sysContent=="registeredNotCustomers"){
                  $scope.switchCustomersFn('dashboard','', 'unregistered')
                }
              });
            }
          /**************************************************
          *                                                 *
          *           GET SELECTED COMPANY BY ID            *
          *                                                 *
          **************************************************/
            $scope.listCustomerUsersData=[];
            $scope.getUsersByClientIdFn = function(idClient){
              console.log(idClient);
              if (idClient!=undefined){
                CustomerServices.getUsersByClientId(idClient).then(function(response){
                  if(response.status==200){
                    $scope.listCustomerUsersData = response.data;
                    console.log($scope.listCustomerUsersData);
                  }
                });
              }else{
                  inform.add('No hay usuarios asociados al cliente seleccionado. ',{
                    ttl:4000, type: 'info'
                  });
              }
            }
          /**************************************************
          *                                                 *
          *                  CONTACT PHONES                 *
          *                                                 *
          **************************************************/
            $scope.list_phone_contact=[];
            $scope.list_phones=[];
            $scope.contactPhones={};
            $scope.isPhoneExist=null;
            $scope.addPhoneNumFn = function (obj, opt){
              //console.log("before addPhoneNumFn => $scope.list_phones.length: "+$scope.list_phones.length);
              //console.log($scope.list_phones);
              if (opt=="new"){
                if ($scope.list_phones.length<=0){
                  console.log("length is equal 0 or less 0");
                  $scope.list_phone_contact.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                  $scope.list_phones.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                }else{
                  for (var key in  $scope.list_phone_contact){
                  // console.log(key);
                      console.log("Validando: "+$scope.list_phone_contact[key].phoneContact+" == "+obj.phoneContact);
                      if ($scope.list_phone_contact[key].phoneContact==obj.phoneContact && $scope.list_phone_contact[key].phoneTag==obj.phoneTag){
                        var tmpTag=$scope.list_phone_contact[key].phoneTag;
                        var ptag= tmpTag.toUpperCase();
                        inform.add("El Numero de contacto: "+obj.phoneContact+", se encuentra agregado como contacto "+ptag,{
                          ttl:5000, type: 'success'
                        });
                        $scope.isPhoneExist=true;
                        break;
                        //console.log($scope.isPhoneExist);
                      }else{
                        $scope.isPhoneExist=false;
                        //console.log($scope.isPhoneExist);
                      }
                  }
                  if(!$scope.isPhoneExist){
                      console.log("ADD_NO_EXIST");
                        $scope.list_phone_contact.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                        $scope.list_phones.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                  }
                }
              }else if (opt=="update"){
                //$scope.list_phone_contact.push({'idClientFk': obj.list_phone_contact[key].idClientFk,'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                if ($scope.list_phones.length<=0){
                  //console.log("length is equal 0 or less 0");
                  $scope.list_phone_contact.push({'idClientFk':$scope.customer.update.idClient,'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                  $scope.list_phones.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                }else{
                  for (var key in  $scope.list_phone_contact){
                  // console.log(key);
                    //console.log("Validando: "+$scope.list_phone_contact[key].phoneContact+" == "+obj.phoneContact);
                      if ($scope.list_phone_contact[key].phoneContact==obj.phoneContact && $scope.list_phone_contact[key].phoneTag==obj.phoneTag){
                        var tmpTag=$scope.list_phone_contact[key].phoneTag;
                        var ptag= tmpTag.toUpperCase();
                        inform.add("El Numero de contacto: "+obj.phoneContact+", se encuentra agregado como contacto "+ptag,{
                          ttl:5000, type: 'success'
                        });
                        $scope.isPhoneExist=true;
                        break;
                        //console.log($scope.isPhoneExist);
                      }else{
                        $scope.isPhoneExist=false;
                        //console.log($scope.isPhoneExist);
                      }
                  }
                  if(!$scope.isPhoneExist){
                      //console.log("ADD_NO_EXIST");
                        $scope.list_phone_contact.push({'idClientFk':$scope.customer.update.idClient,'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                        $scope.list_phones.push({'phoneTag':obj.phoneTag, 'phoneContact':obj.phoneContact});
                  }
                }      
              }
              //console.log("OBJ A ADICIONAR:");
              //console.log(obj);
              //console.log("list_phone_contact:");
              //console.log($scope.list_phone_contact);
              //console.log("list_phones:");
              //console.log($scope.list_phones);
              $scope.enabledNextBtn();
              //console.log("after addPhoneNumFn => $scope.list_phones.length: "+$scope.list_phones.length);
              //console.log($scope.list_phones);
              $scope.contactPhones={};
              $("#contactNumbers").focus();
            }
            $scope.removePhoneNumFn = function (obj){
              for (var key in  $scope.list_phone_contact){
                  if ( $scope.list_phone_contact[key].phoneContact==obj.phoneContact && $scope.list_phone_contact[key].phoneTag==obj.phoneTag){
                      $scope.list_phones.splice(key,1);
                      $scope.list_phone_contact.splice(key,1);
                  }
              }
              //console.log("OBJ A ELIMINAR:");
              //console.log(obj);
              //console.log("list_phone_contact:");
              //console.log($scope.list_phone_contact);
              //console.log("list_phones:");
              //console.log($scope.list_phones);
              $scope.enabledNextBtn();
              $("#contactNumbers").focus();      
            }
            $scope.removeAllPhones = function(){
              for (var key in  $scope.list_phones){
                $scope.list_phones.splice(key,1);
                $scope.list_phone_contact.splice(key,1);
              }
              $("#contactNumbers").focus();
            }
          /**************************************************
          *                                                 *
          *                  CONTACT MAILS                  *
          *                                                 *
          **************************************************/
            $scope.list_mails_contact=[];
            $scope.list_mails=[];
            $scope.contactMails={};
            $scope.isMailExist=null;
            $scope.addMailContactFn = function (obj, opt){
              var typeName = '';
              for (var type in $scope.rsTypeOfMailsData){
                if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.idTipoDeMailFk){
                  typeName= $scope.rsTypeOfMailsData[type].descripcion;
                }
              }
              //console.log("before addMailContactFn => $scope.list_mails.length: "+$scope.list_mails.length);
              //console.log($scope.list_mails);
              if (opt=="new"){
                if ($scope.list_mails.length<=0){
                  //console.log("length is equal 0 or less 0");
                  $scope.list_mails_contact.push({'mailTag':null, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk});
                  $scope.list_mails.push({'mailTag':null, 'typeName':typeName, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk});
                }else{
                  for (var key in  $scope.list_mails_contact){
                  // console.log(key);
                      //console.log("Validando: "+$scope.list_mails_contact[key].mailContact+" == "+obj.idTipoDeMailFk);
                      if ($scope.list_mails_contact[key].mailContact==obj.mailContact && $scope.list_mails_contact[key].idTipoDeMailFk==obj.idTipoDeMailFk){
                        var tmpTag=typeName;
                        var ptag= tmpTag.toUpperCase();
                        inform.add("El Correo: "+obj.mailContact+" ["+ptag+"], ya ha sido agregado.",{
                          ttl:5000, type: 'success'
                        });
                        $scope.isMailExist=true;
                        break;
                        //console.log($scope.isMailExist);
                      }else{
                        $scope.isMailExist=false;
                        //console.log($scope.isMailExist);
                      }
                  }
                  if(!$scope.isMailExist){
                      //console.log("ADD_NO_EXIST");
                        $scope.list_mails_contact.push({'mailTag':null, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk});
                        $scope.list_mails.push({'mailTag':null, 'typeName':typeName, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk});
                  }
                }
              }else if (opt=="update"){
                //$scope.list_mails_contact.push({'idClientFk': obj.list_mails_contact[key].idClientFk,'phoneTag':obj.list_mails_contact[key].phoneTag, 'phoneContact':obj.list_mails_contact[key].phoneContact});
                if ($scope.list_mails.length<=0){
                  //console.log("length is equal 0 or less 0");
                  $scope.list_mails_contact.push({'idClienteFk':$scope.customer.update.idClient, 'mailTag':null, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk, 'status':1});
                  $scope.list_mails.push({'idClienteFk':$scope.customer.update.idClient, 'mailTag':null, 'typeName':typeName, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk, 'status':1});
                }else{
                  for (var key in  $scope.list_mails_contact){
                  // console.log(key);
                      //console.log("Validando: "+$scope.list_mails_contact[key].mailContact+" == "+obj.idTipoDeMailFk);
                      if ($scope.list_mails_contact[key].mailContact==obj.mailContact && $scope.list_mails_contact[key].idTipoDeMailFk==obj.idTipoDeMailFk){
                        var tmpTag=typeName;
                        var ptag= tmpTag.toUpperCase();
                        inform.add("El Correo: "+obj.mailContact+" ["+ptag+"], ya ha sido agregado.",{
                          ttl:5000, type: 'success'
                        });
                        $scope.isMailExist=true;
                        break;
                        //console.log($scope.isMailExist);
                      }else{
                        $scope.isMailExist=false;
                        //console.log($scope.isMailExist);
                      }
                  }
                  if(!$scope.isMailExist){
                        console.log("ADD_NO_EXIST");
                        $scope.list_mails_contact.push({'idClienteFk':$scope.customer.update.idClient,'mailTag':null, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk, 'status':1, 'typeName':typeName});
                        $scope.list_mails.push({'idClienteFk':$scope.customer.update.idClient,'mailTag':null, 'mailContact':obj.mailContact, 'idTipoDeMailFk': obj.idTipoDeMailFk, 'status':1, 'typeName':typeName});
                  }
                }      
              }
              //console.log("OBJ A ADICIONAR:");
              //console.log(obj);
              //console.log("list_mails_contact:");
              console.log($scope.list_mails_contact);
              //console.log("list_mails:");
              //console.log($scope.list_mails);
              $scope.enabledNextBtn();
              //console.log("after addMailContactFn => $scope.list_mails.length: "+$scope.list_mails.length);
              //console.log($scope.list_mails);
              $scope.contactMails={};
              $("#contactMail").focus();
            }
            $scope.removeMailFn = function (obj){
              for (var key in  $scope.list_mails_contact){
                  if ( $scope.list_mails_contact[key].mailContact==obj.mailContact && $scope.list_mails_contact[key].idTipoDeMailFk==obj.idTipoDeMailFk){
                      $scope.list_mails.splice(key,1);
                      $scope.list_mails_contact.splice(key,1);
                  }
              }
              //console.log("OBJ A ELIMINAR:");
              //console.log(obj);
              //console.log("list_mails_contact:");
              //console.log($scope.list_mails_contact);
              //console.log("list_mails:");
              //console.log($scope.list_mails);
              $scope.enabledNextBtn();
              $("#contactMail").focus();      
            }
          /**************************************************
          *                                                 *
          *                   SCHEDULE TIME                 *
          *                                                 *
          **************************************************/
            $scope.list_schedule_atention = [];
            $scope.list_schedule_Arr = [];
            $scope.list_input_first = {fronAm:'', toAm:'', fronPm: '', toPm:''};
            $scope.list_input_last = {fronAm:'', toAm:'', fronPm: '', toPm:''};
            $scope.dayOfWeek_list=[{}];
            $scope.setScheduleTimeFn = function(obj, opt){
              //console.log(obj);
              //console.log("================================================================");
              if (opt=="new"){
                if(obj.selected==true){
                  //console.info("Checkbox selected = "+obj.selected);
                  if ($scope.list_schedule_atention.length<=0 ){
                    //console.log("length is equal 0 or less 0");
                    $scope.list_schedule_atention.push({'day':obj.day, 'fronAm':obj.fronAm, 'toAm': obj.toAm, 'fronPm': obj.fronPm, 'toPm': obj.toPm});
                    $scope.list_input_first.fronAm  = obj.fronAm;
                    $scope.list_input_first.toAm    = obj.toAm;
                    $scope.list_input_first.fronPm  = obj.fronPm;
                    $scope.list_input_first.toPm    = obj.toPm;
                  }else{
                    for (var key in  $scope.list_schedule_atention){
                    // console.log(key);
                      //console.log("Validando: "+$scope.list_phone_contact[key].phoneContact+" == "+obj.idDiviceOpening);
                        if ($scope.list_schedule_atention[key].day==obj.day){
                            $scope.list_schedule_atention[key].fronAm   = obj.fronAm;
                            $scope.list_schedule_atention[key].toAm     = obj.toAm;
                            $scope.list_schedule_atention[key].fronPm   = obj.fronPm;
                            $scope.list_schedule_atention[key].toPm     = obj.toPm;
                            //Validate if there is only one item in the array.
                            if($scope.list_schedule_atention.length==1 || ($scope.list_schedule_atention[key].day==obj.day && obj.day=="Lunes")){
                              $scope.list_input_first.fronAm  = obj.fronAm;
                              $scope.list_input_first.toAm    = obj.toAm;
                              $scope.list_input_first.fronPm  = obj.fronPm;
                              $scope.list_input_first.toPm    = obj.toPm;
                            }

                          $scope.isSchedItemExist=true;
                          break;
                          
                        }else{
                          $scope.isSchedItemExist=false;
                        }
                    }
                    //console.log("isSchedItemExist: "+$scope.isSchedItemExist);
                    if(!$scope.isSchedItemExist){
                        console.log("ADD_NO_EXIST");
                      for (var key in  $scope.list_schedule){
                          if ( $scope.list_schedule[key].day==obj.day){
                            $scope.list_schedule[key].fronAm = $scope.list_input_first.fronAm;
                            $scope.list_schedule[key].toAm   = $scope.list_input_first.toAm;
                            $scope.list_schedule[key].fronPm = $scope.list_input_first.fronPm;
                            $scope.list_schedule[key].toPm   = $scope.list_input_first.toPm;
                          }
                      }
                      $scope.list_schedule_atention.push({'day':obj.day, 'fronAm':obj.fronAm, 'toAm': obj.toAm, 'fronPm': obj.fronPm, 'toPm': obj.toPm});
                    }
                  }
                  //console.info($scope.list_schedule_atention);
                }else{
                  //console.info("Checkbox selected = "+obj.selected);
                  console.info("The arr Item id ["+obj.id+"] - "+obj.day+" Will be removed.");
                  for (var key in  $scope.list_schedule_atention){
                    if ($scope.list_schedule_atention[key].day==obj.day){
                      $scope.list_schedule_atention.splice(key,1);
                    }
                  }
                  for (var key in  $scope.list_schedule){
                    if ( $scope.list_schedule[key].day==obj.day){
                      $scope.list_schedule[key].fronAm = "";
                      $scope.list_schedule[key].toAm   = "";
                      $scope.list_schedule[key].fronPm = "";
                      $scope.list_schedule[key].toPm   = "";
                    }
                  }
                  //console.info($scope.list_schedule_atention);
                }
              }else{
                if(obj.selected==true){
                  var list_schedule_atention_length=$scope.list_schedule_atention.length;
                  //console.info("Checkbox selected = "+obj.selected);
                  if (list_schedule_atention_length<=0 ){
                    //console.log("length is equal 0 or less 0");
                    $scope.list_schedule_atention.push({'idClienteFk':$scope.customer.update.idClient, 'day':obj.day, 'fronAm':obj.fronAm, 'toAm': obj.toAm, 'fronPm': obj.fronPm, 'toPm': obj.toPm});
                    $scope.list_input_first.fronAm  = obj.fronAm;
                    $scope.list_input_first.toAm    = obj.toAm;
                    $scope.list_input_first.fronPm  = obj.fronPm;
                    $scope.list_input_first.toPm    = obj.toPm;
                  }else{
                    for (var key in  $scope.list_schedule_atention){
                      //Validate if there is one or more item in the array to pick up the first element value or the last one
                      if(list_schedule_atention_length==1 || ($scope.list_schedule_atention[key].day==obj.day && obj.day=="Lunes")){
                        $scope.list_input_first.fronAm  = $scope.list_schedule_atention[key].fronAm;
                        $scope.list_input_first.toAm    = $scope.list_schedule_atention[key].toAm;
                        $scope.list_input_first.fronPm  = $scope.list_schedule_atention[key].fronPm;
                        $scope.list_input_first.toPm    = $scope.list_schedule_atention[key].toPm;
                      }else if(list_schedule_atention_length>1 && ($scope.list_schedule_atention[key].day=="Lunes" || $scope.list_schedule_atention[key].day=="Martes" || $scope.list_schedule_atention[key].day=="Miercoles" || $scope.list_schedule_atention[key].day=="Jueves" || $scope.list_schedule_atention[key].day=="Viernes" || $scope.list_schedule_atention[key].day=="Sabado" || $scope.list_schedule_atention[key].day=="Domingo")){
                        $scope.list_input_last.fronAm  = $scope.list_schedule_atention[key].fronAm;
                        $scope.list_input_last.toAm    = $scope.list_schedule_atention[key].toAm;
                        $scope.list_input_last.fronPm  = $scope.list_schedule_atention[key].fronPm;
                        $scope.list_input_last.toPm    = $scope.list_schedule_atention[key].toPm;                      
                      }
                    }
                    for (var key in  $scope.list_schedule_atention){
                        if ($scope.list_schedule_atention[key].day==obj.day){
                            $scope.list_schedule_atention[key].fronAm   = obj.fronAm;
                            $scope.list_schedule_atention[key].toAm     = obj.toAm;
                            $scope.list_schedule_atention[key].fronPm   = obj.fronPm;
                            $scope.list_schedule_atention[key].toPm     = obj.toPm;
                          $scope.isSchedItemExist=true;
                          break;
                          
                        }else{
                          $scope.isSchedItemExist=false;
                        }
                    }
                    //console.log("isSchedItemExist: "+$scope.isSchedItemExist);
                    if(!$scope.isSchedItemExist){
                        //console.log("ADD_NO_EXIST");
                      for (var key in  $scope.list_schedule){
                          if ( $scope.list_schedule[key].day==obj.day){
                            if (list_schedule_atention_length==1){
                              //console.log("adding the data of the first element of the array.");
                              $scope.list_schedule[key].fronAm = $scope.list_input_first.fronAm;
                              $scope.list_schedule[key].toAm   = $scope.list_input_first.toAm;
                              $scope.list_schedule[key].fronPm = $scope.list_input_first.fronPm;
                              $scope.list_schedule[key].toPm   = $scope.list_input_first.toPm;
                              $scope.list_schedule_atention.push({
                                'idClienteFk':$scope.customer.update.idClient, 
                                'day':obj.day, 
                                'fronAm':$scope.list_input_first.fronAm, 
                                'toAm': $scope.list_input_first.toAm, 
                                'fronPm': $scope.list_input_first.fronPm, 
                                'toPm': $scope.list_input_first.toPm});                      
                            }else if(list_schedule_atention_length>1){
                              //console.log("adding the data of the last element of the array.");
                              $scope.list_schedule[key].fronAm = $scope.list_input_last.fronAm;
                              $scope.list_schedule[key].toAm   = $scope.list_input_last.toAm;
                              $scope.list_schedule[key].fronPm = $scope.list_input_last.fronPm;
                              $scope.list_schedule[key].toPm   = $scope.list_input_last.toPm;
                              $scope.list_schedule_atention.push({
                                'idClienteFk':$scope.customer.update.idClient, 
                                'day':obj.day, 
                                'fronAm':$scope.list_input_last.fronAm, 
                                'toAm': $scope.list_input_last.toAm, 
                                'fronPm': $scope.list_input_last.fronPm, 
                                'toPm': $scope.list_input_last.toPm});
                            }
                          }
                      }
                      
                    }
                  }
                  //console.info($scope.list_schedule_atention);
                }else{
                  //console.info("Checkbox selected = "+obj.selected);
                  //console.info("The arr Item id ["+obj.id+"] - "+obj.day+" Will be removed.");
                  for (var key in  $scope.list_schedule_atention){
                    if ($scope.list_schedule_atention[key].day==obj.day){
                      $scope.list_schedule_atention.splice(key,1);
                    }
                  }
                  for (var key in  $scope.list_schedule){
                    if ( $scope.list_schedule[key].day==obj.day){
                      $scope.list_schedule[key].fronAm = "";
                      $scope.list_schedule[key].toAm   = "";
                      $scope.list_schedule[key].fronPm = "";
                      $scope.list_schedule[key].toPm   = "";
                    }
                  }
                }
              }
              
            }
            $scope.schedTime=[];
            $scope.list_schedule_time_orderBy=[];
            $scope.orderScheduleTimeFn = function(arr){
              $scope.schedTime = arr;
              $scope.list_schedule_time_orderBy=[];
              for (i=0;i<$scope.list_schedule.length;i++){
                j=0;
                for (j=0;j<$scope.schedTime.length;j++){
                  if($scope.list_schedule[i].day==$scope.schedTime[j].day){
                    //$scope.list_schedule_time_orderBy.push({'day':$scope.schedTime[j].day, 'fronAm':$scope.schedTime[j].fronAm, 'toAm': $scope.schedTime[j].toAm, 'fronPm': $scope.schedTime[j].fronPm, 'toPm': $scope.schedTime[j].toPm});
                    $scope.list_schedule_time_orderBy.push($scope.schedTime[j]);              
                    break;
                  }
                }
              }
              //console.info($scope.list_schedule_time_orderBy);
            }

          /**************************************************
          *                                                 *
          *     LOAD FIELDS TO NEXT REGISTRATION STEPS      *
          *                                                 *
          **************************************************/
            $scope.loadFieldsTo2Step = function(opt){
              if (opt =="new"){
                $scope.orderScheduleTimeFn($scope.list_schedule_atention);
                if ($scope.customer.new.idClientTypeFk!=4){
                  if ($scope.customer.new.idClientTypeFk==1 || $scope.customer.new.idClientTypeFk==3){
                    /*Load if the customer is administration or company*/
                    $scope.customer.new.billing_information_details.businessNameBilling    = $scope.customer.new.businessName;           
                    $scope.customer.new.billing_information_details.cuitBilling            = $scope.customer.new.CUIT;
                    
                    if (!$scope.customer.new.isNotClient){ 
                      /*load for all customer differents than building, branch and particular */
                      $scope.addrrSelected=true;
                      $scope.customer.new.billing_information_details.nameAddress          = $scope.customer.new.nameAddress;
                      $scope.customer.select.payment.province.selected                     = {idProvince: $scope.tmpAddres.province.idProvince, province: $scope.tmpAddres.province.province, idProvinceAPIGobFk: $scope.tmpAddres.province.idProvinceAPIGobFk};
                      $scope.customer.select.payment.location.selected                     = {idLocation: $scope.tmpAddres.location.idLocation, location: $scope.tmpAddres.location.location};
                    }else{
                      $scope.addrrSelected=true;
                      $scope.customer.new.billing_information_details.nameAddress          = $scope.customer.select.main.address.selected.address;
                      $scope.customer.select.payment.province.selected                     = {idProvince: $scope.customer.select.main.address.selected.idProvinceFk, province: $scope.customer.select.main.address.selected.province};
                      $scope.customer.select.payment.location.selected                     = {idLocation: $scope.customer.select.main.address.selected.idLocationFk, location: $scope.customer.select.main.address.selected.location};
                    }  
                  }else if ($scope.customer.new.idClientTypeFk==5){
                    /*load the province and location data if there isn't a registered building for particular users*/ 
                    $scope.customer.new.billing_information_details.businessNameBilling   = $scope.customer.new.name;        
                    $scope.customer.new.billing_information_details.nameAddress           = $scope.customer.new.nameAddress;
                  }else{
                    $scope.customer.new.billing_information_details.businessNameBilling   = $scope.customer.new.nameAddress;
                    $scope.customer.new.billing_information_details.nameAddress           = $scope.customer.new.nameAddress;
                    $scope.customer.select.payment.province.selected                      = {idProvince: $scope.tmpAddres.province.idProvince, province: $scope.tmpAddres.province.province, idProvinceAPIGobFk: $scope.tmpAddres.province.idProvinceAPIGobFk};
                    $scope.customer.select.payment.location.selected                      = {idLocation: $scope.tmpAddres.location.idLocation, location: $scope.tmpAddres.location.location};
                    $scope.addrrSelected=true;
                  }
                }else{
                  $scope.addrrSelected=true;
                  $scope.customer.new.billing_information_details.businessNameBilling    = $scope.customer.companyData.businessName;
                  $scope.customer.new.billing_information_details.cuitBilling            = $scope.customer.companyData.CUIT;
                  $scope.customer.new.billing_information_details.nameAddress            = $scope.customer.companyData.address;
                  $scope.customer.select.payment.province.selected                       = {idProvince: $scope.customer.companyData.idProvinceFk, province: $scope.customer.companyData.provinceName};
                  $scope.customer.select.payment.location.selected                       = {idLocation: $scope.customer.companyData.idLocationFk, location: $scope.customer.companyData.locationName};
                }          
              }else if (opt=="update"){
                    $scope.orderScheduleTimeFn($scope.list_schedule_atention);
                    if ($scope.customer.update.isNotCliente=="0"){
                      $scope.addrrSelected=true;
                      if ($scope.customer.update.billing_information_details==undefined || $scope.customer.update.billing_information.length==0){
                        inform.add('Datos de facturacion incompletos, por favor complete los datos y guarde los cambios. ',{
                              ttl:6000, type: 'warning'
                        });
                      }else{
                        $scope.customer.update.billing_information_details.businessNameBilling = $scope.customer.update.billing_information_details.businessNameBilling;           
                        $scope.customer.update.billing_information_details.cuitBilling         = $scope.customer.update.billing_information_details.cuitBilling;
                        $scope.customer.update.billing_information_details.nameAddress         = ($scope.customer.update.idClientTypeFk=="2" || $scope.customer.update.idClientTypeFk=="4") && ($scope.customer.update.billing_information_details.businessAddress=='' || $scope.customer.update.billing_information_details.businessAddress==null)?$scope.customer.update.address:$scope.customer.update.billing_information_details.businessAddress;
                        $scope.customer.update.billing_information_details.idTypeTaxFk         = $scope.customer.update.billing_information_details.idTypeTaxFk;
                        $scope.customer.select.payment.province.selected                       = {idProvince: $scope.customer.update.billing_information_details.idProvinceBillingFk, province: $scope.customer.update.billing_information_details.province};
                        $scope.customer.select.payment.location.selected                       = {idLocation: $scope.customer.update.billing_information_details.idLocationBillingFk, location: $scope.customer.update.billing_information_details.location};
                      }
                    }else{
                      $scope.addrrSelected=false;                
                      $scope.customer.update.billing_information_details={};
                      $scope.getCurrentAddrVal($scope.customer.select.main.province.selected, $scope.customer.select.main.location.selected)
                      $scope.customer.update.billing_information_details.nameAddress         = $scope.customer.update.nameAddress;
                      $scope.customer.select.payment.province.selected                       = {idProvince: $scope.tmpAddres.province.idProvince, province: $scope.tmpAddres.province.province, idProvinceAPIGobFk: $scope.tmpAddres.province.idProvinceAPIGobFk};
                      $scope.customer.select.payment.location.selected                       = {idLocation: $scope.tmpAddres.location.idLocation, location: $scope.tmpAddres.location.location};
                    }

              }
            }
          /**************************************************
          *                                                 *
          *                  DEPARTMENTS                    *
          *                                                 *
          **************************************************/
            /**************************************************
            *                SINGLE FUNCTION                  *
            ***************************************************/
              $scope.list_departments=[];
              $scope.list_depto=[];
              $scope.isDeptoExist=null;
              $scope.showPagination=false;
              $scope.addDeptoSingleFn = function (obj, opt){
                //console.log(obj);
                //console.log("addDeptoSingleFn => $scope.list_depto.length: "+$scope.list_depto.length);
                if (opt=="new"){
                  if ($scope.list_depto.length<=0){
                    //console.log("length is equal 0 or less 0");
                    $scope.list_departments.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                    $scope.list_depto.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                  }else{
                    for (var key in  $scope.list_departments){
                      // console.log(key);
                      //console.log("Validando PISO: "+$scope.list_departments[key].floor+" == "+obj.floor);
                      //console.log("Validando DEPTO: "+$scope.list_departments[key].departament+" == "+obj.departament);
                        if ($scope.list_departments[key].floor==obj.floor && $scope.list_departments[key].departament==obj.departament){
                          var tmpFloor=obj.floor;
                          var tmpDepto=obj.departament;
                          var pDepto= tmpDepto.toUpperCase();
                          inform.add("El Departamento: ["+tmpFloor+" - "+pDepto+"] se encuentra registrado.",{
                            ttl:5000, type: 'warning'
                          });
                          $scope.isDeptoExist=true;
                          break;
                          //console.log($scope.isDeptoExist);
                        }else{
                          $scope.isDeptoExist=false;
                          //console.log($scope.isDeptoExist);
                        }
                    }
                    if(!$scope.isDeptoExist){
                        //console.log("ADD_NO_EXIST");
                          $scope.list_departments.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                          $scope.list_depto.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                    }
                  }
                }else if (opt=="update"){
                  //$scope.list_departments.push({'idClientFk': obj.list_departments[key].idClientFk,'phoneTag':obj.list_departments[key].phoneTag, 'phoneContact':obj.list_departments[key].phoneContact});
                  if ($scope.list_depto.length<=0){
                    //console.log("length is equal 0 or less 0");
                    $scope.list_departments.push({'idClientFk':$scope.customer.update.idClient,'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                    $scope.list_depto.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                  }else{
                    for (var key in  $scope.list_departments){
                        // console.log(key);
                        //console.log("Validando PISO: "+$scope.list_departments[key].floor+" == "+obj.floor);
                        //console.log("Validando DEPTO: "+$scope.list_departments[key].departament+" == "+obj.departament);
                        if ($scope.list_departments[key].floor==obj.floor && $scope.list_departments[key].departament==obj.departament){
                          var tmpFloor=obj.floor;
                          var tmpDepto=obj.departament;
                          var pDepto= tmpDepto.toUpperCase();
                          inform.add("El Departamento: ["+tmpFloor+" - "+pDepto+"] se encuentra registrado.",{
                            ttl:5000, type: 'success'
                          });
                          $scope.isDeptoExist=true;
                          break;
                          //console.log($scope.isDeptoExist);
                        }else{
                          $scope.isDeptoExist=false;
                          //console.log($scope.isDeptoExist);
                        }
                    }
                    if(!$scope.isDeptoExist){
                        //console.log("ADD_NO_EXIST");
                          $scope.list_departments.push({'idClientFk':$scope.customer.update.idClient,'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                          $scope.list_depto.push({'floor':obj.floor, 'departament':obj.departament, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk});
                    }
                  }      
                }
                //console.log("OBJ A ADICIONAR:");
                //console.log(obj);
                //console.log("list_departments:");
                //console.log($scope.list_departments);
                //console.log("list_depto:");
                //console.log($scope.list_depto);
                $scope.enabledNextBtn();
                console.info($scope.list_departments);
              }
              $scope.removeDeptoSingleFn = function (obj){
                //console.log(obj);
                for (var key in  $scope.list_departments){
                    if ($scope.list_departments[key].floor==obj.floor && $scope.list_departments[key].departament==obj.departament){
                        $scope.list_depto.splice(key,1);
                        $scope.list_departments.splice(key,1);
                    }
                }
                //console.log("OBJ A ELIMINAR:");
                //console.log(obj);
                //console.log("list_departments:");
                //console.log($scope.list_departments);
                //console.log("list_depto:");
                //console.log($scope.list_depto);
                $scope.enabledNextBtn();      
              }
            /**************************************************
             *                MULTI FUNCTION                   *
             ***************************************************/  
                //$scope.loadMultiDeptosFn = function(){
                //  $scope.list_depto_floors=[];
                //  $scope.list_department_multi={'floor':'','departament':'','correlacion':undefined,'unidad':undefined, 'idCategoryDepartamentFk':''};
                //  departmentUnidad=0;
                //  $("#RegisterMultiDeptosModalCustomer").modal('toggle');
                //    $('#RegisterMultiDeptosModalCustomer').on('shown.bs.modal', function () {
                //      $('#garage_number').focus();
                //    });
                //}      
                $scope.list_department_multi={'garage':'','floor':'','departament':'','correlacion':undefined,'unidad':undefined, 'idCategoryDepartamentFk':''};
                $scope.list_depto_floors=[];
                $scope.deptoUnidades =  [{idUnidad:1, unidad:'Letras'},
                                          {idUnidad:2, unidad:'Numeros'}];
                $scope.deptoCorrelacion   =  [{id:1, nombre:'Letras A, B, C por piso', idUnidadKf: 1},
                                              {id:2, nombre:'Numeros correlativos', idUnidadKf: 2},
                                              {id:3, nombre:'Numeros correlativos por piso', idUnidadKf: 2}];   
                var arrLetras=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
                var departmentUnidad=0;  
            /**************************************************
             *              ADD FLOOR FUNCTION                 *
             ***************************************************/
              $scope.addFloorFn = function(){
                var nFloor= $scope.list_depto_floors.length;
                $scope.list_depto_floors.push({'id':(nFloor-1)+1,'nameFloor':(nFloor-4)+1, 'deptos':[]});
                if($scope.list_depto_floors.length>7){
                  setTimeout(function() {
                    $('.table-list-deptos > tbody > tr:last-child').find('.btn').focus();
                  }, 100);  
                }
              }
            /**************************************************
             *              DEL FLOOR FUNCTION                 *
             ***************************************************/
              $scope.delFloorFn = function(floor){
                console.log("Piso seleccionado que sera Eliminado: "+floor.id);
                $scope.list_depto_floors.splice(floor.id, 1);
              }
            /**************************************************
             *          CREATE BUILDING & DEPTO FUNCTION       *
             ***************************************************/
              $scope.addDeptoMultiFn = function(obj, opt){
                  $scope.list_department_multi.idCategoryDepartamentFk="1"; 
                if (opt=="new"){
                  $scope.list_depto_floors=[];
                  departmentUnidad=0;
                  /*SUB FLOOR AND GARAGES */
                  //ADD THE FLOOR 0 AS A SUB FLOOR 
                  $scope.list_depto_floors.push({'id':0, 'nameFloor':'co', 'deptos':[]});
                  $scope.list_depto_floors.push({'id':1,'nameFloor':'ba', 'deptos':[]});
                  $scope.list_depto_floors.push({'id':2,'nameFloor':'lo', 'deptos':[]});
                  //ADD THE FLOOR 0 AS A SUB FLOOR 
                  /*CALCULATE THE AMOUNT OF GARAGE BEFORE CREATE */
                  //var total_garage=obj.garage==""?(obj.departament*obj.floor):obj.garage;
                  //for (var g=0; g<total_garage; g++){
                  //  $scope.list_depto_floors[0].deptos.push({'idDepto':$scope.list_depto_floors[0].deptos.length+1, 'floor':$scope.list_depto_floors[0].nameFloor, 'departament':($scope.list_depto_floors[0].deptos.length+1), 'idCategoryDepartamentFk': '2', 'enabled':false, 'categoryDepartament':[]});
                  //}
                  //for (var d in  $scope.list_depto_floors[0].deptos){
                  //  for (var item in $scope.rsCategoryDeptoData){
                  //    $scope.list_depto_floors[0].deptos[d].categoryDepartament.push({'idCategoryDepartament':$scope.rsCategoryDeptoData[item].idCategoryDepartament, 'categoryDepartament':$scope.rsCategoryDeptoData[item].categoryDepartament});
                  //  }
                  //}
                  /*SUB FLOOR AND GARAGES */
                  //ADD THE FLOOR 1 AS A PB DEFAULT FLOOR
                  $scope.list_depto_floors.push({'id':3,'nameFloor':'pb', 'deptos':[]});
                  /*ALL FLOOR AND DEPTO AFTER LO */
                  for ( var i=1; i<=obj.floor; i++){
                      $scope.list_depto_floors.push({'id':(i+3),'nameFloor':i.toString(), 'deptos':[]});
                  }
                  l=1;
                  for (var i=3; i<$scope.list_depto_floors.length; i++){
                    for (var j=0; j<obj.departament; j++){
                      /* UNIDAD LETRAS & CORRELATIVAS POR PISO*/
                      if (obj.unidad==1 && obj.correlacion==1){
                        departmentUnidad='';
                        departmentUnidad=arrLetras[j];
                        /* UNIDAD NUMEROS & CORRELATIVOS */
                      }else if(obj.unidad==2 && obj.correlacion==2) {
                        departmentUnidad=departmentUnidad+1;
                        /* UNIDAD NUMEROS & CORRELATIVOS POR PISO*/
                      }else if(obj.unidad==2 && obj.correlacion==3) {
                          if(departmentUnidad==obj.departament){departmentUnidad=1}else{departmentUnidad=departmentUnidad+1;}
                      }else{
                        departmentUnidad=''
                      }
                      $scope.list_depto_floors[i].deptos.push({'idDepto':j+1, 'unitNumber':'', 'floor':$scope.list_depto_floors[i].nameFloor, 'departament':departmentUnidad, 'idCategoryDepartamentFk': obj.idCategoryDepartamentFk, 'enabled':false, 'idStatusFk':1, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[i].id});             
                    }
                    l++;
                  }
                  for (var i=3; i<$scope.list_depto_floors.length; i++){
                    for (var d in  $scope.list_depto_floors[i].deptos){
                      for (var item in $scope.rsCategoryDeptoData){

                        $scope.list_depto_floors[i].deptos[d].categoryDepartament.push({'idCategoryDepartament':$scope.rsCategoryDeptoData[item].idCategoryDepartament, 'categoryDepartament':$scope.rsCategoryDeptoData[item].categoryDepartament});
                      }
                    }
                  }          
                  /*ALL FLOOR AND DEPTO AFTER PB */
                  console.log("Building Floor Length  : "+$scope.list_depto_floors.length);
                  console.log("Building garage floor  : "+$scope.list_depto_floors[0].deptos.length);
                  console.log("Building storage floor : "+$scope.list_depto_floors[1].deptos.length);
                  console.log("Building stores floor  : "+$scope.list_depto_floors[2].deptos.length);
                  console.log("Building Main floor    : "+$scope.list_depto_floors[3].deptos.length);
                  console.log($scope.list_depto_floors);
                  $scope.enabledNextBtn();
                }else if (opt=="update"){
                }

                
              }
            /**************************************************
             *              ADD ONE DEPTO FUNCTION             *
             ***************************************************/
              $scope.porteriaCount=0; 
              $scope.addOneDeptoMultiFn = function(obj, argCategoryDepartament, deptoUnit){
                
                console.log("======================");
                console.log("|    Add One Depto   |")
                console.log("======================");
                console.log("floorId["+obj.id+"] => floor: "+obj.nameFloor);
                console.log("Qty of Units before add of Floor["+obj.nameFloor+"]: "+obj.deptos.length);
                console.log("Category of unit to be add in the floor: ["+obj.nameFloor+"]: "+argCategoryDepartament);    

                var floorsLength       =  obj.deptos.length;
                if (($scope.list_department_multi.unidad!=null || $scope.list_department_multi.unidad!=undefined) && ($scope.list_department_multi.correlacion!=null || $scope.list_department_multi.correlacion!=undefined)){
                  if(obj.nameFloor!="co" && obj.nameFloor!="ba" && obj.nameFloor!="lo"){
                    if ($scope.list_depto_floors[obj.id].deptos.length==0){
                        $scope.poUnit=0;
                        $scope.porteriaCount=0;                
                        /* UNIDAD LETRAS & CORRELATIVAS POR PISO*/
                        if ($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1){
                          departmentUnidad='';                        
                          departmentUnidad=arrLetras[0];
                        }else if($scope.list_department_multi.unidad==2 && ($scope.list_department_multi.correlacion==2 || $scope.list_department_multi.correlacion==3)){
                          departmentUnidad=0;
                          departmentUnidad=(departmentUnidad+1);
                        }
                        if(argCategoryDepartament=="5"){
                          $scope.porteriaCount=($scope.porteriaCount+1)
                          $scope.poUnit=($scope.poUnit+1)
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'poNumber':$scope.porteriaCount, 'departament':'PO-'+$scope.porteriaCount, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':false, 'idStatusFk':1, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[obj.id].id});                    
                        }else if(argCategoryDepartament=="6"){
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':deptoUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':false, 'idStatusFk':1, 'categoryDepartament':[],'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else{
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':departmentUnidad, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':false, 'idStatusFk':1, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[obj.id].id});
                        }
                        for (var d in  $scope.list_depto_floors[obj.id].deptos){
                          for (var item in $scope.rsCategoryDeptoData){
                            $scope.list_depto_floors[obj.id].deptos[d].categoryDepartament.push({'idCategoryDepartament':$scope.rsCategoryDeptoData[item].idCategoryDepartament, 'categoryDepartament':$scope.rsCategoryDeptoData[item].categoryDepartament});
                          }
                        }
                        // UNIDAD EN NUMEROS CORRELATIVOS EN EL EDIFICIO
                        if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==2){
                          departmentUnidad=0;                                               
                          for (var i=1; i<$scope.list_depto_floors.length; i++){
                            for (var d in  $scope.list_depto_floors[i].deptos){
                              if($scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="5" && $scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[i].deptos[d].idStatusFk=="1"){
                                departmentUnidad=departmentUnidad+1;
                                $scope.list_depto_floors[i].deptos[d].departament=departmentUnidad;
                              }
                            }
                          }   
                        }              
                    }else{ //IF $scope.list_depto_floors[obj.nameFloor+1].deptos.length is bigger than 0
                      if ($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1){
                        departmentUnidad='';               
                        $scope.poUnit=0;
                        $scope.porteriaCount=0;
                        for (var unit in $scope.list_depto_floors[obj.id].deptos){
                          if ($scope.list_depto_floors[obj.id].deptos[unit].idCategoryDepartamentFk=="5" && $scope.list_depto_floors[obj.id].deptos[unit].idStatusFk=="1"){
                            if ($scope.isNewCustomer==true){
                              $scope.poUnit=$scope.list_depto_floors[obj.id].deptos[unit].poNumber;
                            }else{
                              var poUnitString=$scope.list_depto_floors[obj.id].deptos[unit].departament;                        
                              $scope.poUnit=poUnitString.substr(3, 1);                        
                            }
                          }else if ($scope.list_depto_floors[obj.id].deptos[unit].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[obj.id].deptos[unit].idStatusFk=="1"){
                            $scope.unitId=$scope.list_depto_floors[obj.id].deptos[unit].departament;
                          }
                        }
                        //var arrIndex = arrLetras.indexOf(obj.deptos[floorsLength-1].departament);
                          if(argCategoryDepartament=="5"){
                              $scope.porteriaCount=parseInt($scope.poUnit)+1;
                              $scope.poUnit = parseInt($scope.poUnit)+1;
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'poNumber':$scope.porteriaCount, 'departament':'PO-'+$scope.poUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament, 'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else if(argCategoryDepartament=="6"){
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':deptoUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else{
                          var indexArray=[],
                          arrIndex=0;
                          indexArray = arrLetras;
                          arrIndex   = indexArray.indexOf($scope.unitId);
                          departmentUnidad=arrLetras[arrIndex+1];
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0,'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':departmentUnidad, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }
                        //REORDEN DE LOS ID'S DE LAS UNIDADES DEL PISO
                        $scope.unitNumberId=0;
                        for (var uni in $scope.list_depto_floors[obj.id].deptos){
                          $scope.unitNumberId=($scope.unitNumberId+1);
                          if($scope.list_depto_floors[obj.id].deptos[uni].idStatusFk=="1"){
                            $scope.list_depto_floors[obj.id].deptos[uni].idDepto=$scope.unitNumberId;
                          }
                        }                    
                        // UNIDAD EN NUMEROS CORRELATIVOS EN EL EDIFICIO
                      }else if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==2){
                        departmentUnidad=0;
                        $scope.poUnit=0;
                        $scope.porteriaCount=0;
                        for (var unit in $scope.list_depto_floors[obj.id].deptos){
                          if ($scope.list_depto_floors[obj.id].deptos[unit].idCategoryDepartamentFk=="5" && $scope.list_depto_floors[obj.id].deptos[unit].idStatusFk=="1"){
                            if ($scope.isNewCustomer==true){
                              $scope.poUnit=$scope.list_depto_floors[obj.id].deptos[unit].poNumber;
                            }else{
                              var poUnitString=$scope.list_depto_floors[obj.id].deptos[unit].departament;                        
                              $scope.poUnit=poUnitString.substr(3, 1);
                            }
                          }
                        }
                        if(argCategoryDepartament=="5"){
                              $scope.porteriaCount=parseInt($scope.poUnit)+1;
                              $scope.poUnit = parseInt($scope.poUnit)+1;
                              $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'poNumber':$scope.poUnit, 'departament':'PO-'+$scope.poUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else if(argCategoryDepartament=="6"){
                              $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':deptoUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else{
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':floorsLength-1+1, 'unitNumber':'', 'floor':obj.nameFloor, 'departament':'', 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }                    
                          //$scope.list_depto_floors[0].deptos.push({'idDepto':($scope.list_depto_floors[0].deptos.length+1), 'floor':$scope.list_depto_floors[0].nameFloor, 'departament':($scope.list_depto_floors[0].deptos.length+1), 'idCategoryDepartamentFk': '2', 'enabled':obj.deptos[floorsLength-1].enabled, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament});
                            for (var i=3; i<$scope.list_depto_floors.length; i++){
                              for (var d in  $scope.list_depto_floors[i].deptos){
                                if($scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="5" && $scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[i].deptos[d].idStatusFk=="1"){
                                  departmentUnidad=departmentUnidad+1;
                                  $scope.list_depto_floors[i].deptos[d].departament=departmentUnidad;
                                }
                              }
                            } 
                        //UNIDADES EN NUMEROS CORRELATIVAS POR PISO           
                      }else if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==3) {
                        departmentUnidad=0;
                        $scope.poUnit=0;
                        $scope.unitId=0;
                        for (var unit in $scope.list_depto_floors[obj.id].deptos){
                          if ($scope.list_depto_floors[obj.id].deptos[unit].idCategoryDepartamentFk=="5" && $scope.list_depto_floors[obj.id].deptos[unit].idStatusFk=="1"){
                            if ($scope.isNewCustomer==true){
                              $scope.poUnit=$scope.list_depto_floors[obj.id].deptos[unit].poNumber;
                            }else{
                              var poUnitString=$scope.list_depto_floors[obj.id].deptos[unit].departament;                        
                              $scope.poUnit=poUnitString.substr(3, 1);
                            }
                          }else if ($scope.list_depto_floors[obj.id].deptos[unit].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[obj.id].deptos[unit].idStatusFk=="1"){
                            $scope.unitId=$scope.list_depto_floors[obj.id].deptos[unit].departament;
                            //console.log($scope.unitId);
                          }else{
                            //console.log("entro al ultimo else");
                            departmentUnidad=(departmentUnidad+1);
                            $scope.unitId=0;
                            //console.log($scope.unitId);
                            //console.log(departmentUnidad);
                          }
                        }
                        if(argCategoryDepartament=="5"){
                              $scope.porteriaCount=parseInt($scope.poUnit)+1;
                              $scope.poUnit = parseInt($scope.poUnit)+1;                    
                              $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'poNumber':$scope.poUnit, 'departament':'PO-'+$scope.poUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else if(argCategoryDepartament=="6"){
                              $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(floorsLength+1), 'unitNumber':'', 'floor':obj.nameFloor, 'departament':deptoUnit, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        }else{
                            //console.log("BEFORE:");
                            //console.log("departmentUnidad: "+departmentUnidad);
                            //console.log("unitId: "+$scope.unitId);
                            departmentUnidad=parseInt($scope.unitId)+1;
                            //console.log("AFTER:");
                            //console.log(departmentUnidad);
                            $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':floorsLength+1, 'unitNumber':'', 'floor':obj.nameFloor, 'departament':departmentUnidad, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':obj.deptos[floorsLength-1].categoryDepartament,'idFloor':$scope.list_depto_floors[obj.id].id});
                        } 
                        //REORDEN DE LOS ID'S DE LAS UNIDADES DEL PISO
                        $scope.unitNumberId=0;
                        for (var uni in $scope.list_depto_floors[obj.id].deptos){
                          $scope.unitNumberId=($scope.unitNumberId+1);
                          if($scope.list_depto_floors[obj.id].deptos[uni].idStatusFk=="1"){
                            $scope.list_depto_floors[obj.id].deptos[uni].idDepto=$scope.unitNumberId;
                          }
                        }                    
                      }else{
                          departmentUnidad=''
                      }         
                    }
                    /* UNIDAD LETRAS & CORRELATIVAS POR PISO*/
                  }else {
                    var varCategoryDepartament="";
                    var unitNumber="";
                    console.log("argCategoryDepartament: "+argCategoryDepartament);
                    console.log("deptoUnit: "+deptoUnit);
                    varCategoryDepartament=argCategoryDepartament;
                    unitNumber=deptoUnit;
                      if ($scope.list_depto_floors[obj.id].deptos.length==0){
                          $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':($scope.list_depto_floors[obj.id].deptos.length+1), 'unitNumber':'', 'floor':$scope.list_depto_floors[obj.id].nameFloor, 'departament':unitNumber, 'idCategoryDepartamentFk': varCategoryDepartament, 'enabled':false, 'idStatusFk':1, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[obj.id].id});
                      }else{
                        $scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':0, 'idDepto':(obj.deptos.length+1), 'floor':obj.nameFloor, 'unitNumber':'', 'departament':unitNumber, 'idCategoryDepartamentFk': varCategoryDepartament, 'enabled':obj.deptos[floorsLength-1].enabled, 'idStatusFk':1, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[obj.id].id});
                      }        
                  }
                }else{
                    inform.add("Debe designar el tipo de unidad y correlaccion para agregar unidades al edificio.",{
                                ttl:6000, type: 'warning'
                    });              
                }    
                //console.info("Floor selected data:");
                console.log($scope.list_depto_floors);
                //console.info("Deparments on the Floor selected:");
                //console.log(obj.deptos);
                //console.info("The last Depto Category Data:");
                //console.log(obj.deptos[floorsLength-1].categoryDepartament);
                //console.log("Department length: "+floorsLength);
                //ADD ONE DEPTO ON THE PB DEFAULT FLOOR
                //$scope.list_depto_floors[3].deptos.push({'idDepto':$scope.list_depto_floors[3].deptos.length+1, 'unitNumber':'', 'floor':$scope.list_depto_floors[3].nameFloor, 'departament':'pb'+($scope.list_depto_floors[3].deptos.length+1), 'idCategoryDepartamentFk': $scope.list_department_multi.idCategoryDepartamentFk, 'enabled':false, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[3].id});
                  //console.log($scope.rsCategoryDeptoData);
                  //for (var item in $scope.rsCategoryDeptoData){
                    //$scope.list_depto_floors[3].deptos[0].categoryDepartament.push({'idCategoryDepartament':$scope.rsCategoryDeptoData[item].idCategoryDepartament, 'categoryDepartament':$scope.rsCategoryDeptoData[item].categoryDepartament});
                  //}
                console.log("-----------------------------------");
                console.log("Qty of Units before add ["+obj.nameFloor+"]: "+obj.deptos.length); 
                $scope.porteriaExist=$scope.checkIsPorteriaExistFn(obj);
              }
            /**************************************************
            *            DEL LAST DEPTO FUNCTION              *
            ***************************************************/
              $scope.deleteLastDeptoMultiFn = function(obj){
                //console.log(obj);
                var floorsLength  =  obj.deptos.length;
                var depto2Del     =  obj.deptos[floorsLength-1];
                console.log("======================");
                console.log("|  Remove Last Depto |")
                console.log("======================");
                console.log("floorId["+obj.id+"] => floor: "+obj.nameFloor);
                console.log("floorId["+obj.id+"] => floor["+obj.nameFloor+"] => depto: "+depto2Del.idDepto);
                if (obj.nameFloor=="co" || obj.nameFloor=="ba" || obj.nameFloor=="lo"){
                    if($scope.isNewCustomer==true){
                      $scope.list_depto_floors[obj.id].deptos.splice(-1);
                    }else{
                      $scope.list_depto_floors[obj.id].deptos[depto2Del].idStatusFk="-1";
                    }
                  console.log("Depto Successfully removed");
                }else{
                    if($scope.isNewCustomer==true){
                      $scope.list_depto_floors[obj.id].deptos.splice(-1);
                    }else{
                      $scope.list_depto_floors[obj.id].deptos[depto2Del].idStatusFk="-1";
                    }
                  /* UNIDAD EN NUMEROS CORRELATIVOS POR EDIFICIO*/
                  if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==2) {
                    departmentUnidad=0;                                               
                    for (var i=3; i<$scope.list_depto_floors.length; i++){
                      for (var d in  $scope.list_depto_floors[i].deptos){
                        if($scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="5" && $scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[i].deptos[d].idStatusFk=="1"){
                          departmentUnidad=departmentUnidad+1;
                          $scope.list_depto_floors[i].deptos[d].departament=departmentUnidad;
                        }
                      }
                    }               
                  }
                }
                  $("#btnDelDepto").tooltip('hide');
              }
            /**************************************************
            *            DEL SELECTED DEPTO FUNCTION          *
            ***************************************************/
              $scope.jsonMsg={'add':{},'delete':{}};
              $scope.deleteSelectedDeptoMultiFn = function(depto){
                console.log("=========================");
                console.log("| Remove selected Depto |")
                console.log("=========================");
                switch(depto.idCategoryDepartamentFk){
                  case "1":
                    $scope.jsonMsg.delete.unit="Departamento";
                  break;
                  case "2":
                    $scope.jsonMsg.delete.unit="Cochera";
                  break;
                  case "3":
                    $scope.jsonMsg.delete.unit="Baulera";
                  break;
                  case "4":
                    $scope.jsonMsg.delete.unit="Local";
                  break;
                  case "5":
                    $scope.jsonMsg.delete.unit="Porteria";
                  break;
                  case "6":
                    $scope.jsonMsg.delete.unit="Departamento";
                  break;
                }
                var floorUpper=depto.floor
                $scope.jsonMsg.delete.floor=String(floorUpper).toUpperCase();
                $scope.jsonMsg.delete.depto=depto.departament;
                $scope.jsonMsg.delete.msg="Eliminado del Piso:"+$scope.jsonMsg.delete.floor+", la unidad: "+$scope.jsonMsg.delete.unit+" - "+$scope.jsonMsg.delete.depto+".";
                console.log("floorId["+depto.idFloor+"] => floor["+depto.floor+"] => depto: "+depto.idDepto);
                objArr     = $scope.list_depto_floors[depto.idFloor].deptos;
                indexArray = objArr.map(function(o){return o.idDepto;});
                arrIndex   = indexArray.indexOf(depto.idDepto);
                if(depto.floor!="co" && depto.floor!="ba" && depto.floor!="lo"){
                    departmentUnidad=0;
                    if($scope.isNewCustomer==true){
                      $scope.list_depto_floors[depto.idFloor].deptos.splice(arrIndex, 1);
                    }else{
                      if (depto.idClientDepartament!=undefined){
                        $scope.list_depto_floors[depto.idFloor].deptos[arrIndex].idStatusFk="-1";
                      }else{
                        $scope.list_depto_floors[depto.idFloor].deptos.splice(arrIndex, 1);
                      }
                    }
                    
                    /* UNIDAD LETRAS/NUMEROS CORRELATIVAS POR PISO*/
                    /*if (($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1) || ($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==3)){
                      for (var j=0; j<$scope.list_depto_floors[depto.idFloor].deptos.length;j++){
                        if($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1){
                          departmentUnidad='';
                          departmentUnidad=arrLetras[j];
                        }else if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==3){
                          departmentUnidad=departmentUnidad+1;
                        }

                        $scope.list_depto_floors[depto.idFloor].deptos[j].departament=departmentUnidad;
                      }*/   
                    /* UNIDAD EN NUMEROS CORRELATIVOS POR EDIFICIO*/
                  if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==2) {
                      for (var i=3; i<$scope.list_depto_floors.length; i++){
                        for (var d in  $scope.list_depto_floors[i].deptos){
                          if($scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="5" && $scope.list_depto_floors[i].deptos[d].idCategoryDepartamentFk!="6" && $scope.list_depto_floors[i].deptos[d].idStatusFk=="1" ){
                            departmentUnidad=departmentUnidad+1;
                            $scope.list_depto_floors[i].deptos[d].departament=departmentUnidad;
                          }
                        }
                      }   
                    
                  }
                }else{
                    if($scope.isNewCustomer==true){
                      $scope.list_depto_floors[depto.idFloor].deptos.splice(arrIndex, 1);
                    }else{
                      $scope.list_depto_floors[depto.idFloor].deptos[arrIndex].idStatusFk="-1";
                    }
                  // if (depto.floor=="pb"){
                  //   departmentUnidad=0; 
                  //   for (var d in  $scope.list_depto_floors[depto.idFloor].deptos){
                  //     departmentUnidad=departmentUnidad+1;
                  //     $scope.list_depto_floors[depto.idFloor].deptos[d].departament=departmentUnidad;
                  //   }          
                  //} 
                } 
                inform.add($scope.jsonMsg.delete.msg,{
                            ttl:6000, type: 'success'
                });
                console.log($scope.list_depto_floors[depto.idFloor].deptos[arrIndex]);
              }
            /**************************************************
            *            ASSIGN UNIT NUMBER FUNCTION          *
            ***************************************************/
              $scope.objFloor="";
              $scope.porteriaExist=false;
              $scope.objFloor=[];
              $scope.inputUnit="";
              $scope.inputUnit2="";
              var unitFound=false;
              var categoryDepartament="";
              var unitName="";
              $scope.assign2UnitFn = function(obj, opt, argDeptoCtgry, argBuildingUnit){
                if (($scope.list_department_multi.unidad!=null || $scope.list_department_multi.unidad!=undefined) && ($scope.list_department_multi.correlacion!=null || $scope.list_department_multi.correlacion!=undefined)){
                  console.log("$scope.inputUnit: "+$scope.inputUnit);
                  unitFound=false;
                  switch(opt){
                    case "open":
                        $scope.objFloor=obj;
                        console.log($scope.objFloor);
                        var rsExistPort=$scope.checkIsPorteriaExistFn($scope.objFloor);
                        if ($scope.objFloor.nameFloor=="co" || $scope.objFloor.nameFloor=="ba" || $scope.objFloor.nameFloor=="lo"){
                          $scope.isNotDeptoUnit=1;
                          $("#BuildingUnit").modal('toggle');
                        }else{
                          $scope.isNotDeptoUnit=0;
                          //console.info("Porteria existe: "+rsExistPort);
                          if (rsExistPort){
                            $scope.porteriaExist=true;
                          }else{
                            $scope.porteriaExist=false;
                          }
                          $("#BuildingUnit").modal('toggle');
                        }
                    break;
                    case "set":
                      if($scope.isNotDeptoUnit==1){
                        if ($scope.objFloor.nameFloor=="co"){
                          unitName="La Cochera";
                          categoryDepartament="2"
                        }else if ($scope.objFloor.nameFloor=="ba"){
                          unitName="La Baulera";
                          categoryDepartament="3"
                        }else if ($scope.objFloor.nameFloor=="lo"){
                          unitName="El Local";
                          categoryDepartament="4"
                        }
                        if($scope.checkIsUnitExistFn($scope.objFloor, argBuildingUnit)){
                          unitFound=true;
                          inform.add(unitName+' Numero: '+argBuildingUnit+', Ya se encuentra asignada. ',{ttl:2000, type: 'warning'});
                        }
                      }else if ($scope.isNotDeptoUnit==0 && argDeptoCtgry=="6"){
                            unitName="La unidad ";
                            categoryDepartament=argDeptoCtgry;
                        if ($scope.checkIsUnitExistFn($scope.objFloor, argBuildingUnit)){
                          unitFound=true;
                          inform.add(unitName+argBuildingUnit+', Ya se encuentra asignada. ',{ttl:2000, type: 'warning'});
                        }
                      }else{
                          categoryDepartament=argDeptoCtgry;
                      }
                      if(!unitFound){
                        $scope.addOneDeptoMultiFn($scope.objFloor, categoryDepartament, argBuildingUnit);
                      }
                      $("#unit_number").val("");
                      $("#unit_number").focus();
                      $("#unit_number2").val("");
                      $("#unit_number2").focus();
                    break;
                  }
                }else{
                    inform.add("Debe designar el tipo de unidad y correlaccion para agregar unidades al edificio.",{
                                ttl:6000, type: 'warning'
                    });              
                }  
              } 
              $scope.checkIsPorteriaExistFn = function(obj){
                for (var d in  obj.deptos){
                    if (obj.deptos[d].idCategoryDepartamentFk=="5" && obj.deptos[d].idStatusFk=="1"){
                      var isPorteriaExist=true;
                      break;
                    }else{
                      var isPorteriaExist=false;
                    }
                  }
                  return isPorteriaExist;
              }
              $scope.checkIsUnitExistFn = function(obj, newUnit){
                for (var d in  obj.deptos){
                    if (obj.deptos[d].departament==newUnit && obj.deptos[d].idStatusFk=="1"){
                      var isUnitExist=true;
                      break;
                    }else{
                      var isUnitExist=false;
                    }
                  }
                  return isUnitExist;
              }
            /**************************************************
            *          SET DEPARTMENT ARRAY FUNCTION          *
            ***************************************************/
              $scope.selectDeptoDataFn = function(){
                $scope.list_departments=[];
                for (var f in $scope.list_depto_floors){
                  for (var d in  $scope.list_depto_floors[f].deptos){
                    $scope.list_departments.push({'idClientDepartament':$scope.list_depto_floors[f].deptos[d].idClientDepartament,'floor':$scope.list_depto_floors[f].deptos[d].floor, 'departament':$scope.list_depto_floors[f].deptos[d].departament, 'idCategoryDepartamentFk': $scope.list_depto_floors[f].deptos[d].idCategoryDepartamentFk, 'numberUNF':$scope.list_depto_floors[f].deptos[d].unitNumber, 'idStatusFk':$scope.list_depto_floors[f].deptos[d].idStatusFk});
                  }
                }
                $scope.enabledNextBtn();
                //console.log($scope.list_departments);
              }
              $scope.closeBuildingUnitModal = function(){
                $("#BuildingUnit").modal('hide');
              }
              $scope.selectBuildingUnitFn = function(obj, opt, argBuildingUnit){
                if (opt=="open"){
                  objFloor=obj;
                  $("#BuildingUnit").modal('toggle');
                }else{
                  $("#BuildingUnit").modal('hide');
                  
                } 
              }
            /**************************************************
            *       SET DEPARTMENT FUNCTIONAL UNIT NUMBER     *
            ***************************************************/
              $scope.editUnitNumberFn = function(floor, depto) {
                $scope.unitFloor=floor;
                $scope.unitDepto=depto;
                //console.log(floor);
                //console.log(depto);
                $("#functionalUnit").modal('toggle');
                $("#functional_unit_number").focus();
                if ($scope.unitDepto.unitNumber=="0"){
                  $scope.unitDepto.unitNumber="";
                }
              }
            /**************************************************
            * OPEN MODAL OF NEW DEPTO FOR CUSTOMER NOT CLIENT *
            ***************************************************/
              $scope.setDepto2CustomerNotClient = function(obj){
                $scope.customer.notClient={};
                $scope.customer.notClient=obj;
                $("#newDeptoCustomerNotClient").modal({backdrop: 'static', keyboard: false});
              }
              $scope.closeDepto2CustomerNotClient = function(){
                $("#newDeptoCustomerNotClient").modal("hide");
              }
            /**************************************************
            *    ADD NEW DEPARTMENT TO A NO CLIENT BUILDING   *
            ***************************************************/
              $scope.isDeptoRegistered = false;
              $scope.addDepto2NotClientCustomer = function (obj){
                console.log(obj);
                var depto = obj.floor+'-'+obj.department;
                for (var key in $scope.rsBuildingDepartmentsData){
                  if ($scope.rsBuildingDepartmentsData[key].Depto == depto.toUpperCase() && $scope.rsBuildingDepartmentsData[key].idCategoryDepartamentFk == obj.idCategoryDepartamentFk){
                    inform.add('El departamento '+depto.toUpperCase()+' ya esta registrado. ',{
                            ttl:6000, type: 'warning'
                    });
                    $scope.isDeptoRegistered = true;
                    $scope.customer.notClient.idCategoryDepartamentFk='';
                    $scope.customer.notClient.department='';
                    $scope.customer.notClient.floor='';
                    //$("#newDeptoCustomerNotClient").modal("hide");
                    break;                
                  }else{
                    $scope.isDeptoRegistered = false;
                  }
                }
                if (!$scope.isDeptoRegistered){
                  CustomerServices.addNotCustomerDepto(obj).then(function(response){
                      console.log(response);
                      $scope.rsJsonData = response;
                      if($scope.rsJsonData.status==200){
                        console.log("New Depto Successfully registered");
                        inform.add('Departamento '+depto.toUpperCase()+' registrado con exito. ',{
                              ttl:2000, type: 'success'
                        });
                        $scope.getBuildingsDeptosFn(obj.idClient);
                        blockUI.start('Cargando departamento nuevo '+depto.toUpperCase()+' a la lista.');                     
                        $timeout(function() {
                          var idDepto = $scope.rsJsonData.data
                          $scope.customer.select.main.department=idDepto.toString();
                          blockUI.stop();  
                        }, 1500);
                      }else if($scope.rsJsonData.status==500){
                        console.log("Customer not Created, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                              ttl:2000, type: 'danger'
                        });
                      }
                  });
                  $scope.customer.notClient={};
                  $("#newDeptoCustomerNotClient").modal("hide");
                }

              }
            /**************************************************
            *     SET THE FLOOR DIFFERENT THAN DEPARTMENT     *
            ***************************************************/
              $scope.setNewDeptoFloor = function(opt){
                switch (opt){         
                  case "2":
                    if($scope.isNewCustomer && !$scope.customer.new.isNotClient){
                      $scope.customer.new.floor = "co";
                      $scope.customer.new.department = "";
                    }else if($scope.isUpdateCustomer && !$scope.customer.update.isNotClient){
                      $scope.customer.update.floor = "co";
                      $scope.customer.update.department = "";
                    }else{
                      $scope.customer.notClient.floor = "co";
                      $scope.customer.notClient.department = "";
                    }
                  break;
                  case "3":
                    if($scope.isNewCustomer && !$scope.customer.new.isNotClient){
                      $scope.customer.new.floor = "ba";
                      $scope.customer.new.department = "";
                    }else if($scope.isUpdateCustomer && !$scope.customer.update.isNotClient){              
                      $scope.customer.update.floor = "ba";
                      $scope.customer.update.department = "";
                    }else{
                      $scope.customer.notClient.floor = "ba";
                      $scope.customer.notClient.department = "";
                    }
                  break;
                  case "4":
                    if($scope.isNewCustomer && !$scope.customer.new.isNotClient){
                      $scope.customer.new.floor = "lo";
                      $scope.customer.new.department = "";
                    }else if($scope.isUpdateCustomer && !$scope.customer.update.isNotClient){              
                      $scope.customer.update.floor = "lo";
                      $scope.customer.update.department = "";
                    }else{
                      $scope.customer.notClient.floor = "lo";
                      $scope.customer.notClient.department = "";
                    }
                  break;
                  case "5":
                    if($scope.isNewCustomer && !$scope.customer.new.isNotClient){
                      $scope.customer.new.department = "po-"+$scope.customer.new.floor;
                    }else if($scope.isUpdateCustomer && !$scope.customer.update.isNotClient){              
                      $scope.customer.update.department = "po-"+$scope.customer.new.floor;
                    }else{
                      $scope.customer.notClient.department = "po-"+$scope.customer.notClient.floor;
                    }
                  break;
                }
              }
            /**************************************************
            *                                                 *
            *            CUSTOMER PARTICULAR ADDRESS          *
            *                                                 *
            **************************************************/ 
              $scope.list_particular_address={};
              $scope.list_address_particular=[];
              $scope.isPCA=false;   
              $scope.newParticularAddressFn = function(){
                $scope.isPCA = true;
                $scope.customer.particular    = {'isBuilding':false,'typeInmueble':'', 'nameAddress':'', 'address':'', 'floor':'','clarification':'', 'depto':'', 'select':{}}
                $scope.customer.particular.select = {'address':{}, 'depto':{}, 'province':{'selected':undefined}, 'location':{'selected':undefined}}
                $("#customerParticularAddress").modal('toggle');
                $('#customerParticularAddress').on('shown.bs.modal', function () {
                  $('#addrText').focus();
                });
              }
              $scope.addParticularAddressFn = function(opt, obj){
                $scope.isCpartAddrExist=false;
                console.log($scope.customer.particular);
                switch(obj.typeInmueble){
                  case "1":
                    var customerisBuilding=obj.isBuilding?1:0;
                    var department  = customerisBuilding==0?obj.depto.toUpperCase():null;
                    var depto       = customerisBuilding==0?obj.floor+"-"+obj.depto.toUpperCase():obj.select.depto.Depto;
                    var floor       = customerisBuilding==0?obj.floor.toUpperCase():null;
                    var idDepartment= customerisBuilding==0?null:obj.select.depto.idDepto;
                    var nameAddress = customerisBuilding==0?obj.nameAddress:obj.select.address.selected.address;
                    var idProvince  = customerisBuilding==0?obj.select.province.selected.idProvince:obj.select.address.selected.idProvinceFk;
                    var idLocation  = customerisBuilding==0?obj.select.location.selected.idLocation:obj.select.address.selected.idLocationFk;
                    var addrLatitud = customerisBuilding==0 && !$scope.gobApiAddressNotFound?obj.addressLat:null;
                    var addrLongitud= customerisBuilding==0 && !$scope.gobApiAddressNotFound?obj.addressLon:null;
                    addrLatitud     = customerisBuilding==0 && $scope.gobApiAddressNotFound?$scope.customer.particular.addressLat:obj.addressLat;
                    addrLongitud    = customerisBuilding==0 && $scope.gobApiAddressNotFound?$scope.customer.particular.addressLon:obj.addressLon;
                  break;
                  case "2":
                    var nameAddress = obj.nameAddress;
                    var idProvince  = obj.select.province.selected.idProvince;
                    var idLocation  = obj.select.location.selected.idLocation;
                  break;
                  case "3":
                    var nameAddress = obj.nameAddress;
                    var idProvince  = obj.select.province.selected.idProvince;
                    var idLocation  = obj.select.location.selected.idLocation;
                  break;
                }
                  var idZonaFk    = $scope.customer.new.idZonaFk!=null && $scope.customer.new.idZonaFk!=undefined && $scope.customer.new.idZonaFk!=''?$scope.customer.new.idZonaFk:$scope.customer.update.idZonaFk;
                //{"address":"TEST", "depto":"depto", "isBuilding":1, "idProvinceFk":1, "idLocationFk":1, "clarification":"TEST"}
                if (opt=="new"){
                  if ($scope.list_address_particular.length<=0){
                    $scope.list_address_particular.push({"address":nameAddress, "idParticularDepartamentKf":idDepartment, "depto": depto, "department": department, "floor": floor, "isBuilding":customerisBuilding, "idProvinceFk":idProvince, "idLocationFk":idLocation, "idTipoInmuebleFk":obj.typeInmueble, "clarification":obj.clarification, 'addressLat':addrLatitud,'addressLon':addrLongitud, 'idZonaFk': idZonaFk});
                  }else{
                    for (var key in  $scope.list_address_particular){
                      if (obj.typeInmueble=="1"){
                        $scope.validationRS=$scope.list_address_particular[key].idTipoInmuebleFk==obj.typeInmueble && $scope.list_address_particular[key].address==nameAddress && $scope.list_address_particular[key].depto==depto?true:false;
                      }else{
                        $scope.validationRS=$scope.list_address_particular[key].idTipoInmuebleFk==obj.typeInmueble && $scope.list_address_particular[key].address==nameAddress?true:false;

                      }
                      if ($scope.validationRS){
                          //var typeInmueble=obj.typeInmueble;
                          //var pTypeInmueble= tmpDepartment.toUpperCase();
                          if (obj.typeInmueble=="1"){
                            inform.add("El Departamento: "+department+" en la direccion: "+nameAddress+" ya se encuentra registrado.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });
                          }else if (obj.typeInmueble=="2"){
                            inform.add("La Casa en la direccion: "+nameAddress+" ya se encuentra registrada.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });
                          }else{
                            inform.add("El Local en la direccion: "+nameAddress+" ya se encuentra registrado.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });                    
                          }
                          $scope.isCpartAddrExist=true; /*Is Customer Particular Address exist */
                          break;
                        }else{
                          $scope.isCpartAddrExist=false;
                        }
                    }
                    if(!$scope.isCpartAddrExist){
                        $scope.list_address_particular.push({"address":nameAddress, "idParticularDepartamentKf":idDepartment, "depto": depto, "department": department, "floor": floor, "isBuilding":customerisBuilding, "idProvinceFk":idProvince, "idLocationFk":idLocation, "idTipoInmuebleFk":obj.typeInmueble, "clarification":obj.clarification, 'addressLat':addrLatitud,'addressLon':addrLongitud, 'idZonaFk': idZonaFk});
                    }
                  }
                }else if (opt=="update"){
                  if ($scope.list_address_particular.length<=0){
                    $scope.list_address_particular.push({"address":nameAddress, "idParticularDepartamentKf":idDepartment, "depto": depto, "department": department, "floor": floor, "isBuilding":customerisBuilding, "idProvinceFk":idProvince, "idLocationFk":idLocation, "idTipoInmuebleFk":obj.typeInmueble, "clarification":obj.clarification, 'addressLat':addrLatitud,'addressLon':addrLongitud, 'idZonaFk': idZonaFk});
                  }else{
                    for (var key in  $scope.list_address_particular){
                      if (obj.typeInmueble=="1"){
                        $scope.validationRS=$scope.list_address_particular[key].idTipoInmuebleFk==obj.typeInmueble && $scope.list_address_particular[key].address==nameAddress && $scope.list_address_particular[key].depto==depto?true:false;
                      }else{
                        $scope.validationRS=$scope.list_address_particular[key].idTipoInmuebleFk==obj.typeInmueble && $scope.list_address_particular[key].address==nameAddress?true:false;

                      }
                      if ($scope.validationRS){
                          //var typeInmueble=obj.typeInmueble;
                          //var pTypeInmueble= tmpDepartment.toUpperCase();
                          if (obj.typeInmueble=="1"){
                            inform.add("El Departamento: "+department+" en la direccion: "+nameAddress+" ya se encuentra registrado.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });
                          }else if (obj.typeInmueble=="2"){
                            inform.add("La Casa en la direccion: "+nameAddress+" ya se encuentra registrada.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });
                          }else{
                            inform.add("El Local en la direccion: "+nameAddress+" ya se encuentra registrado.",{
                            //inform.add("La direccion adicional: ("+nameAddress+") y el departamento ("+pIdentify+"), ya se encuentra registrado.",{
                              ttl:5000, type: 'warning'
                            });                    
                          }
                          $scope.isCpartAddrExist=true; /*Is Customer Particular Address exist */
                          break;
                        }else{
                          $scope.isCpartAddrExist=false;
                        }
                    }
                    if(!$scope.isCpartAddrExist){
                        $scope.list_address_particular.push({"address":nameAddress, "idParticularDepartamentKf":idDepartment, "depto": depto, "department": department, "floor": floor, "isBuilding":customerisBuilding, "idProvinceFk":idProvince, "idLocationFk":idLocation, "idTipoInmuebleFk":obj.typeInmueble, "clarification":obj.clarification, 'addressLat':addrLatitud,'addressLon':addrLongitud, 'idZonaFk': idZonaFk});
                    }
                  }
                }
                if(!$scope.isCpartAddrExist){
                  $("#customerParticularAddress").modal('hide');
                }
                console.log($scope.list_address_particular);
                $scope.enabledNextBtn();
              }
              $scope.removeParticularAddressFn = function (obj){
                console.log(obj);
                  for (var key in  $scope.list_address_particular){
                      if ($scope.list_address_particular[key].idTipoInmuebleFk==obj.idTipoInmuebleFk && $scope.list_address_particular[key].address==obj.address){
                            if (obj.idTipoInmuebleFk=="1"){
                            inform.add("El Departamento: "+obj.depto+" en la direccion: "+obj.address+" ha sido eliminado satisfactoriamente.",{
                              ttl:5000, type: 'success'
                            });
                          }else if (obj.idTipoInmuebleFk=="2"){
                            inform.add("La Casa en la direccion: "+obj.address+" ha sido eliminado satisfactoriamente.",{
                              ttl:5000, type: 'success'
                            });
                          }else{
                            inform.add("El Local en la direccion: "+obj.address+" ha sido eliminado satisfactoriamente.",{
                              ttl:5000, type: 'success'
                            });                    
                          } 
                          $scope.list_address_particular.splice(key,1);                  
                      }
                  } 
                $scope.enabledNextBtn();  
              }
          /*************************************************/
        $scope.list_id_user=[];
        $scope.contactUser={'selected':undefined}
        $scope.list_client_user=[];
        $scope.list_users=[];
        $scope.isUserExist=null;
        $scope.isNewCustomer=false;
        $scope.isUpdateCustomer=false;
        $scope.isUpdateCustomerRegistered=null;
        $scope.isListCustomer=false;
        $scope.isListCustomerService=false;
        $scope.isInfoCustomer=false;
        $scope.confirmAdminDataChange=false;
        $scope.rsCustomerAdminListData=[]
        $scope.rsCustomerCompaniesListData=[]
        $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isInDebt':false, 'isStockInBuilding': false, 'isStockInOffice': false, 'strict':false};
        $scope.defArrForCustomersFn = function(){
          $scope.allowAction={'edit':{'costCenterBilling':true}};
          $scope.mySwitch = $scope.pasos[0];
          $scope.btnShow=true;
          $scope.btnBack=false;
          $scope.stepIndexTmp=0;
          $scope.sysApiAddressNotFound=false;
          $scope.gobApiAddressNotFound=false;
          $scope.list_depto_floors=[];
          $scope.list_phone_contact=[];
          $scope.list_schedule_atention=[];
          $scope.list_departments=[];
          $scope.list_address_particular=[];
          $scope.list_mails_contact=[];
          $scope.list_mails=[];
          $scope.list_users=[];
          $scope.list_client_user=[];
          $scope.list_user_licence=[];
          $scope.formValidated=false;
          $scope.idProvinceFk=null;
          $scope.rsAddress_API_Data_Main = [];
          $scope.rsAddress_API_Data_Payment = [];
          $scope.rsAddress_API_Data_PCA = [];
          $scope.geoLocation = {'address':'','addressLat':'', 'addressLon':'', 'option':''};
          $scope.tmpAddres = {'province':{},'location':{}};         
          $scope.customer = {'new':{}, 'update':{}, 'info':{}, 'upload':{}, 'details':{}, 'companyData':{}, 'particular':{}, 'notClient':{}, 'select':{'main':{},'payment':{}, 'company':{}}};          
          $scope.select = {'filterTypeOfClient': {}, 'filterCustomerIdFk':{'selected':undefined}};
          $scope.customer.select.main = {'address':{}, 'department':'', 'province':{'selected':undefined}, 'location':{'selected':undefined}, }
          $scope.customer.select.payment = {'address':{}, 'department':'', 'province':{'selected':undefined}, 'location':{'selected':undefined}}
          $scope.customer.particular    = {'isBuilding':false,'typeInmueble':'', 'nameAddress':'', 'address':'', 'floor':'','clarification':'', 'depto':'', 'select':{}}
          $scope.customer.particular.select = {'address':{}, 'depto':{}, 'province':{'selected':undefined}, 'location':{'selected':undefined}}
          $scope.customer.select.company={};
          $scope.customer.new = {
                                'idClientTypeFk':'', 
                                'name':'', 
                                'idAgentFk':'',
                                'businessName':'',
                                'idClientAssociated_SE':'',
                                'CUIT':'', 
                                'observationOrderKey': '', 
                                'idDepartmentFk':'', 
                                'nameAddress':'', 
                                'idProvinceFk':'', 
                                'idLocationFk':'', 
                                'pageWeb':'', 
                                'observationSericeTecnic':'', 
                                'observationCollection':'', 
                                'observation':'', 
                                'isNotCliente':0, 
                                'localPhone':'', 
                                'mobilePhone':'', 
                                'mail':'',
                                'floor':'',
                                'department':'',
                                'idCategoryDepartamentFk':'',
                                'numberUNF':'',
                                'departmentUnit':'',
                                'idZonaFk':'',
                                'departmentCorrelation':'',
                                'billing_information_details':{
                                    'businessNameBilling':'', 
                                    'cuitBilling':'', 
                                    'nameAddress':'', 
                                    'idLocationBillingFk':undefined, 
                                    'idProvinceBillingFk':undefined, 
                                    'idTypeTaxFk':''
                                }, 
                                'billing_information':{
                                    'businessNameBilling':'', 
                                    'cuitBilling':'', 
                                    'nameAddress':'', 
                                    'idLocationBillingFk':undefined, 
                                    'idProvinceBillingFk':undefined, 
                                    'idTypeTaxFk':''
                                }, 
                                'list_departament':{
                                    'floor':'', 
                                    'departament':'', 
                                    'idCategoryDepartamentFk':'',
                                    'numberUNF':''
                                },
                                'list_address_particular':{
                                    'address':'',
                                    'depto':'',
                                    'isBuilding':'',
                                    'idProvinceFk':'',
                                    'idLocationFk':'',
                                    'idDepartmentFk':'',
                                    'clarification':'',
                                    'idTipoInmuebleFk':'',
                                    'idZonaFk':'',
                                    'addressLat':'',
                                    'addressLon':''
    
                                },
                                'list_emails':{
                                    'mailTag':'',
                                    'mailContact':'',
                                    'idTipoDeMailFk':''
                                },
                                'list_phone_contact':{},
                                'list_client_user':{}
          };
          //console.log($scope.service)
        }
        $scope.cleanCustomerFieldFn = function(){
          $scope.mySwitch = $scope.pasos[0];
          $scope.btnShow=true;
          $scope.btnBack=false;
          $scope.stepIndexTmp=0;
          $scope.sysApiAddressNotFound=false;
          $scope.gobApiAddressNotFound=false;
          $scope.allowAction={'edit':{'costCenterBilling':true}};
          //$scope.allowAction.edit.province=false;
          //$scope.allowAction.edit.location=false;
          $scope.geoLocation = {'address':'','addressLat':'', 'addressLon':'', 'option':''};
          $scope.customer.new.billing_information={'businessNameBilling':'', 'cuitBilling':'', 'nameAddress':'', 'idLocationBillingFk':'', 'idProvinceBillingFk':'',  'idTypeTaxFk':''};
          $scope.customer.new.list_departament={'floor':'', 'departament':'', 'idCategoryDepartamentFk':'', 'numberUNF':''};
          $scope.customer.new.list_address_particular={'address':'', 'depto':'', 'isBuilding':'', 'idProvinceFk':'', 'idLocationFk':'', 'idDepartmentFk':'','clarification':'', 'idTipoInmuebleFk':''};
          $scope.customer.select.main = {'address':{}, 'department':'', 'province':{'selected':undefined}, 'location':{'selected':undefined}, }
          $scope.customer.select.payment = {'address':{}, 'department':'', 'province':{}, 'location':{}}
          $scope.customer.particular    = {'isBuilding':false,'typeInmueble':'', 'nameAddress':'', 'address':'', 'floor':'','clarification':'', 'depto':'', 'select':{}}
          $scope.customer.particular.select = {'address':{}, 'depto':{}, 'province':{'selected':undefined}, 'location':{'selected':undefined}}
          $scope.customerFound=null;
          $scope.customerSearch.address = "";
          $scope.customer.select.company.selected=undefined;
          $scope.customer.select.main.address.selected=undefined;
          $scope.list_phones=[];
          $scope.list_department_multi={'garage':'','floor':'','departament':'','correlacion':undefined,'unidad':undefined, 'idCategoryDepartamentFk':''};
          $scope.list_depto_floors=[];
          $scope.list_phone_contact=[];
          $scope.list_schedule_atention =  [];
          $scope.setScheduleListFn();
          $scope.list_departments = [];
          $scope.list_address_particular=[];
          $scope.list_mails_contact=[];
          $scope.list_mails=[];
          $scope.list_users=[];
          $scope.list_client_user = [];
          $scope.idProvinceFk=null;
        }
        $scope.switchCustomersFn = function(opt1, obj1, opt2){
            var cObj = !obj1 || obj1==undefined ? null : obj1;
            switch (opt1){
              /******************************
              *          CUSTOMERS          *
              ******************************/  
                case "dashboard":
                  switch (opt2){
                    case "registered":
                      $scope.defArrForCustomersFn();
                      $scope.getBuildingsFn();
                      $scope.sysContent                         = "";
                      $scope.pagination.pageIndex               = 1;
                      $scope.customersSearch.isNotCliente       = "0";
                      $scope.customersSearch.isInDebt           = false;
                      $scope.getCustomersListFn(null, "0", null, null, null, null, ($scope.pagination.pageIndex-1), $scope.pagination.pageSizeSelected, null, true);
                      $scope.select.filterTypeOfClient          = undefined;
                      $scope.select.filterCustomerIdFk.selected = undefined;
                      $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isInDebt':false, 'isStockInBuilding':false, 'isStockInOffice':false, 'strict':false};
                      $scope.isNewCustomer                      = false;
                      $scope.isUpdateCustomer                   = false;
                      //$scope.customerPaginationFn($scope.rsCustomerListData, 10);
                      //$scope.loadPagination($scope.rsCustomerListData, "idClientIndex", "10");
                      $scope.sysContent                         = 'registeredCustomers';
                    break;
                    case "unregistered":
                      $scope.defArrForCustomersFn();
                      $scope.getBuildingsFn();
                      $scope.sysContent                         = "";
                      $scope.pagination.pageIndex               = 1;
                      $scope.customersSearch.isNotCliente       = "1";
                      $scope.customersSearch.isInDebt           = false;
                      $scope.select.filterTypeOfClient          = undefined;
                      $scope.select.filterCustomerIdFk.selected = undefined;
                      $scope.customerSearch={'searchFilter':'', 'typeClient':'', 'isInDebt':false, 'isStockInBuilding':false, 'isStockInOffice':false, 'strict':false};
                      $scope.isNewCustomer                      = false;
                      $scope.isUpdateCustomer                   = false;
                      $scope.getCustomersListFn(null, "1", null, null, null, null, ($scope.pagination.pageIndex-1), $scope.pagination.pageSizeSelected, null, true);
                      $scope.sysContent                         = 'registeredNotCustomers';
                    break;
                  }
                break;
                case "new":
                  $scope.isNewCustomer=true;
                  $scope.isUpdateCustomer=false;
                  $scope.setScheduleListFn();
                  $scope.defArrForCustomersFn();
                  //$scope.getCustomerListFn("all", 2);
                  //$scope.getBuildingsFn();
                  $scope.rsCustomerSelectData = [];
                  if ($scope.rsCustomerAdminListData!=undefined && $scope.rsCustomerAdminListData.length==0 && $scope.rsCustomerSelectData.length==0){
                    //$scope.getAdminCustomersListFn();
                    //console.log("Entro Admin");
                  }
                  if ($scope.rsCustomerCompaniesListData!=undefined && $scope.rsCustomerCompaniesListData.length==0 && $scope.rsCustomerSelectData.length==0){
                    //$scope.getCompaniesCustomersListFn();
                    //console.log("Entro Company");
                  }
                  //$timeout(function() {
                  //  for (var admin in $scope.rsCustomerAdminListData){
                  //    $scope.rsCustomerSelectData.push($scope.rsCustomerAdminListData[admin]);
                  //  }
                  //}, 4000);
                  //$timeout(function() {
                  //  for (var company in $scope.rsCustomerCompaniesListData){
                  //    $scope.rsCustomerSelectData.push($scope.rsCustomerCompaniesListData[company]);
                  //  }
                  //  //console.log($scope.rsCustomerSelectData);
                  //}, 4500);
                  
                  $scope.customer.new.isNotClient=false;
                  $('#RegisterModalCustomer').modal({backdrop: 'static', keyboard: false});
                    $('#RegisterModalCustomer').on('shown.bs.modal', function () {
                        $('#customer_type').focus();
                    });
                break;
                case "add":
                    $scope.fnNewCustomerFn(cObj);
                break; 
                case "edit":
                case "upgrade":
                  $scope.isNewCustomer=false;
                  $scope.isUpdateCustomer=true;
                  $scope.setScheduleListFn();
                  $scope.defArrForCustomersFn();
                  //$scope.getCustomerListFn("all", 2);
                  $scope.getBuildingsFn();
                  $scope.rsCustomerSelectData = [];
                  $timeout(function() {
                    for (var admin in $scope.rsCustomerAdminListData){
                      $scope.rsCustomerSelectData.push($scope.rsCustomerAdminListData[admin]);
                    }//console.log($scope.rsCustomerSelectData);
                    for (var company in $scope.rsCustomerCompaniesListData){
                      $scope.rsCustomerSelectData.push($scope.rsCustomerCompaniesListData[company]);
                    }//console.log($scope.rsCustomerSelectData);
                  }, 1000);
                  if (cObj.isNotCliente=="0"){
                    $scope.isUpdateCustomerRegistered=true;
                  }else{
                    $scope.isUpdateCustomerRegistered=false;
                  }
                  $scope.customer.update.isNotClient=false;
                  if (opt1=="edit"){
                    blockUI.start('Cargando datos del cliente '+cObj.ClientType);
                  }else{
                    blockUI.start('Cargando datos del consorcio '+cObj.address);
                  }
                  $timeout(function() {
                    $scope.customerDataFn(cObj, 'edit');
                  }, 1500); 
                break;
                case "update":
                    $scope.customerDataFn(cObj, 'update');
                break;
                case "details_customer":
                  switch (opt2){
                      case "show":
                        $scope.customerDataFn(cObj,'details_customer');
                      break;
                      case "usersAllowed":
                        $('#UsersAllowedDetails').modal('show');
                      break;
                      case "customerMails":
                        $('#customerMailsDetails').modal('show');
                      break;
                      case "customerPhones":
                        $('#customerPhonesDetails').modal('show');
                      break;
                      case "customerScheduleTime":
                        $('#customerScheduleTimeDetails').modal('show');
                      break;
                      case "customerPaymentInfo":
                        $('#customerPaymentInfoDetails').modal('show');
                      break;
                      case "customerDepartmentInfo":
                        $('#customerDepartmentsDetails').modal('show');
                      break;
                      case "initial_delivery":
                        $('#customerInitialDeliveryDetails').modal('show');
                      break;
                  }
                break;
                case "details_company":
                  switch (opt2){
                      case "show":
                        $scope.customerDataFn(cObj,'details_company');
                      break;               
                      case "companyDetails_usersAllowed":
                        $('#companyDetails_usersAllowedDetails').modal('show');
                      break;
                      case "companyDetails_customerMails":
                        $('#companyDetails_mailsDetails').modal('show');
                      break;
                      case "companyDetails_customerPhones":
                        $('#companyDetails_phonesDetails').modal('show');
                      break;
                      case "companyDetails_customerScheduleTime":
                        $('#companyDetails_scheduleTimeDetails').modal('show');
                      break;
                      case "companyDetails_customerPaymentInfo":
                        $('#companyDetails_paymentInfoDetails').modal('show');
                      break;
                      case "companyDetails_customerDepartmentInfo":
                        $('#companyDetails_departmentsDetails').modal('show');
                      break;              
                  }            
                break;         
                case "enabled":
                  //Enabled client function
                break; 
                case "disabled":
                  //disabled client function
                break;
                case "remove":
                  //remove client function
                break;
                case "phonesandschedule":
                  $scope.customerDataFn(cObj,'phones');   
                break;  
                case "seemails":
                  $scope.customerDataFn(cObj,'mails');
                break;
                case "departments":
                  $scope.customerDataFn(cObj,'deptos');
                break;
                case "particularAddress":
                  $scope.customerDataFn(cObj,'particularAddress');
                break;
                case "loadCustomerFields":
                  $scope.loadCustomerFieldsFn(cObj)
                break;
                case "uploadFiles":
                  $scope.customer.upload={};
                  blockUI.start('Subir archivos al cliente '+cObj.ClientType);
                  $timeout(function() {
                    $scope.customerDataFn(cObj, 'uploadFiles');
                    blockUI.stop();
                  }, 1500); 
                break;
                case "listFiles":
                  blockUI.start('ver archivos del cliente '+cObj.ClientType);
                  $timeout(function() {
                    $scope.customerDataFn(cObj, 'listFiles');
                    blockUI.stop();
                  }, 1500); 
                break;
                case "deleteSingleFile":
                  blockUI.start('Eliminando archivo del cliente '+$scope.customer.files.ClientType);
                  $timeout(function() {
                    $scope.deleteSingleFile(cObj);
                    blockUI.stop();
                  }, 1500);         
                break;
                case "switchToServices":
                  tokenSystem.setSelectedCustomerDataStorage(cObj);
                  $timeout(function() {
                    blockUI.message('Cargando datos asociados cliente '+cObj.ClientType);
                  }, 1500);
                  blockUI.start('Cambiando al modulo de servicios');
                  $timeout(function() {
                    $location.path("/services");
                    blockUI.stop();
                  }, 2500);
                break;
                case "securityCode":
                  blockUI.start('Generando Codigo de Seguridad');
                  $timeout(function() {
                    $scope.customerDataFn(cObj, 'securityCode');
                  }, 1500);
                break;
                case "adminChange": //Change building between administration
                  $scope.confirmAdminDataChange=false;
                  if (cObj.isNotCliente=="0"){
                    $scope.isUpdateCustomerRegistered=true;
                  }else{
                    $scope.isUpdateCustomerRegistered=false;
                  }          
                  $scope.customer={'buildingSelected':{}, 'currentAdmin':{}, 'newAdmin':{}};
                  blockUI.start('Cambio de administración, cliente '+cObj.ClientType); 
                  $timeout(function() {
                    $scope.customerDataFn(cObj,'adminChange');
                  }, 1500);
                  $timeout(function() {
                    //COMPANY RELATED
                    blockUI.message('Cargando datos de la administracion actual.');
                    var arrCurrentCompany=[]
                    $scope.customer={'currentAdmin':{}, 'newAdmin':{}};
                    arrCurrentCompany=$scope.getCustomerDataByIdFn(cObj.idClientAdminFk);
                    $timeout(function() {
                        $scope.customer.currentAdmin=arrCurrentCompany.length==1?arrCurrentCompany[0]:null;
                        console.log($scope.customer.currentAdmin);
                    }, 500);
                    $timeout(function() {
                      $scope.getCustomerByTypeFn(1);
                    }, 700);
                  }, 1500);
                break;
                case "getNewAdmin": //Get new administration data
                  blockUI.start('Cargando datos de la nueva administracion.');
                  $timeout(function() {
                    //COMPANY RELATED
                    var arrNewCompany=[]
                    arrNewCompany=$scope.getCustomerDataByIdFn(cObj.idClient);
                    $timeout(function() {
                        $scope.customer.newAdmin=arrNewCompany.length==1?arrNewCompany[0]:null;
                        console.log($scope.customer.currentAdmin);
                    }, 500);
                    blockUI.stop();
                    
                  }, 1500);
                break;
                case "startAdminChangeProcess": //Change building between administration
                  $scope.buildingOldData={'list_emails':{},'list_phone_contact':{},'list_client_user':{}};
                  $scope.buildingNewData={'list_emails':[],'list_phone_contact':[],'list_client_user':[]};
                  blockUI.start('Iniciando cambio de administracion.');
                  $timeout(function() {
                    //REMOVE DATA FROM CURRENT COMPANY 
                    blockUI.message('Removiendo datos de la actual Administracion '+$scope.customer.currentAdmin.name);
                    $scope.customerDataFn(null,'removeLinkedAdminData');
                  }, 2000);
                  $timeout(function() {
                    blockUI.message('Procesando datos de la nueva Administracion '+$scope.customer.newAdmin.name);
                    $scope.customerDataFn(null,'linkNewAdminData');
                  }, 4000);
                  $timeout(function() {
                    blockUI.message('Verificar datos a continuacion.');
                  }, 5000);
                  $timeout(function() {
                    
                    blockUI.stop();
                  }, 6000);
                break; 
                case "changeBuildingAdmin": //Update building with new administration
                  blockUI.start('Procesando datos del Edificio '+cObj.address);
                  $timeout(function() {
                    $scope.customerDataFn(cObj, 'updateBuildingAdmin');
                  }, 1500);
                break;
                case "allowedUsers":
                  $scope.isNewCustomer=false;
                  $scope.isUpdateCustomer=false;
                  $scope.isListCustomer=true;
                  $scope.customerDataFn(cObj,'allowedUsers'); 
                break;
                case "allowedUsers_update":
                  $scope.customerDataFn(cObj,'allowedUsers_update'); 
                break;
                case "contactdUsers":
                  $scope.isNewCustomer=false;
                  $scope.isUpdateCustomer=false;
                  $scope.isListCustomer=true;
                  $scope.getUsersByClientIdFn(cObj.idClient);
                  $scope.customerDataFn(cObj,'contactdUsers'); 
                break;
                case "contactdUsers_update":
                  $scope.customerDataFn(cObj,'contactUsers_update'); 
                break;
                case "info":
                  $scope.isInfoCustomer=true;
                  $scope.customer.info={};
                  $scope.customer.info.isNotCliente=false;
                  console.log(cObj)
                  $scope.customerDataFn(cObj,'info'); 
                break;
                case "isInDebtClient":
                  console.log(cObj);
                  $scope.setClientInDebtFn(cObj);
                break;
                case "isStockInBuilding":
                  console.log(cObj);
                  $scope.setClientHasStockInBuildingFn(cObj);
                break;
                case "isStockInOffice":
                  console.log(cObj);
                  $scope.setClientHasStockInOfficeFn(cObj);
                break;
                case "newManualAddress":
                  console.log(cObj);
                  var twoNumber_patt=/^(?=(?:\D*\d){2})[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
                  if (twoNumber_patt.test(cObj.nameAddress)){
                    switch(opt2){
                      case "main":
                        $scope.customer.new.address=cObj.nameAddress.toUpperCase();
                        $scope.customer.new.nameAddress=cObj.nameAddress.toUpperCase(); 
                        $scope.customer.new.addressLat=null;
                        $scope.customer.new.addressLon=null;
                        $scope.geoLocation.option="main";
                        $scope.geoLocation.address=cObj.nameAddress.toUpperCase();
                        $scope.addrrSelected=true;
                        $("#AddressLatLon").modal({backdrop: 'static', keyboard: false});
                        $("#AddressLatLon").on('shown.bs.modal', function () {
                          $("#addr_Lat").focus();
                        });
                      break;
                      case "payment":
                          $scope.customer.new.billing_information_details.nameAddress=cObj.nameAddress.toUpperCase();
                      break;
                      case "particular":
                        $scope.customer.particular.address=cObj.nameAddress.toUpperCase();              
                        $scope.customer.particular.nameAddress=cObj.nameAddress.toUpperCase(); 
                        $scope.customer.particular.addressLat=null;
                        $scope.customer.particular.addressLon=null;
                        $scope.geoLocation.option="particular";
                        $scope.geoLocation.address=cObj.nameAddress.toUpperCase();
                        $scope.addrrSelected=true;
                        $("#AddressLatLon").modal({backdrop: 'static', keyboard: false});
                        $("#AddressLatLon").on('shown.bs.modal', function () {
                          $("#addr_Lat").focus();
                        });
                      break;
                    }
                  }else{
                    inform.add('Debe indicar el nombre y numero de la calle. ',{
                      ttl:2000, type: 'warning'
                    });
                  }
                break;
                case "enableInitialKeys":
                  blockUI.start('Cargando lista de departamentos del '+cObj.ClientType);
                  $timeout(function() {
                    $scope.customerDataFn(cObj,'enableInitialKeys'); 
                    blockUI.stop();
                  }, 1500); 
                break;
              default:
            }
        }
        /**************************************************
        *                                                 *
        *                 ADD NEW CUSTOMER                *
        *                                                 *
        **************************************************/
            /******************************
            *    GETTING CUSTOMER DATA    *
            ******************************/    
            $scope.fnNewCustomerFn = function(client){
              var switchOption = client.idClientTypeFk;
              //console.log(switchOption);
              switch(switchOption){
                case "1": //ADMINISTRATION CUSTOMER
                      //Getting the customer schedule setting
                      $scope.customer.new.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                      //Getting the customer phones contact list
                      $scope.customer.new.list_phone_contact                        = $scope.list_phone_contact;
                      //Getting the customer Mail list
                      $scope.customer.new.list_emails                               = $scope.list_mails_contact;
                      //Getting the authorized user to the new customer
                      $scope.customer.new.list_client_user                          = $scope.list_client_user;
                      if ($scope.customer.new.typeInmueble==1 && $scope.customer.new.isNotClient==true){
                        $scope.customer.new.idDepartmentFk                          = $scope.customer.select.main.department;
                        $scope.customer.new.address                                 = $scope.customer.select.main.address.selected.address;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk;
                        $scope.customer.new.addressLat                              = $scope.customer.select.main.address.selected.addressLat;
                        $scope.customer.new.addressLon                              = $scope.customer.select.main.address.selected.addressLon;

                      }else{
                        $scope.customer.new.idDepartmentFk                          = null;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                        $scope.customer.new.numberUNF                               = null;
                      }
                      $scope.customer.new.billing_information                       = {};
                      $scope.customer.new.billing_information                       = $scope.customer.new.billing_information_details;
                      $scope.customer.new.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                      $scope.customer.new.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                      //Assigning the default value to 0
                      $scope.customer.new.isNotCliente                              = 0;
                      $scope.customer.new.idClientAdminFk                           = 0;
                      $scope.customer.new.idClientCompaniFk                         = 0;
                      $scope.customer.new.idTipoInmuebleFk                          = $scope.customer.new.typeInmueble;
                      //Printing the current array before add the customer
                      console.log($scope.customer.new);
                      //Send the customer data to the addcustomer service
                      $scope.fnAddCustomerFn($scope.customer.new);        
                break;
                case "2": //BUILDING CUSTOMER
                      //Getting the customer schedule setting
                      $scope.customer.new.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                      //Getting the customer phones contact list
                      $scope.customer.new.list_phone_contact                        = $scope.list_phone_contact;
                      //Getting the department that was created
                      $scope.selectDeptoDataFn();
                      $scope.customer.new.list_departament                          = $scope.list_departments;
                      //Getting the customer Mail list
                      $scope.customer.new.list_emails                               = $scope.list_mails_contact;
                      //Getting the authorized user to the new customer
                      $scope.customer.new.list_client_user                          = $scope.list_client_user;
                      $scope.customer.new.idProvinceFk                              = $scope.customer.select.main.province.selected.idProvince;
                      $scope.customer.new.idLocationFk                              = $scope.customer.select.main.location.selected.idLocation;
                      $scope.customer.new.billing_information                       = {};
                      $scope.customer.new.billing_information                       = $scope.customer.new.billing_information_details;                    
                      $scope.customer.new.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                      $scope.customer.new.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                      //Assigning the default value to 0
                      $scope.customer.new.isNotCliente                              = 0;
                      $scope.customer.new.idClientAdminFk                           = $scope.customer.select.company.selected!=undefined?$scope.customer.companyData.idClient:null;
                      $scope.customer.new.idClientCompaniFk                         = null;
                      $scope.customer.new.idDepartmentFk                            = null;
                      $scope.customer.new.idTipoInmuebleFk                          = null;
                      $scope.customer.new.name                                      = $scope.customer.new.address;
                      $scope.customer.new.departmentUnit                            = $scope.list_department_multi.unidad;
                      $scope.customer.new.departmentCorrelation                     = $scope.list_department_multi.correlacion;
                      //Printing the current array before add the customer
                      console.log($scope.customer.new);
                      //Send the customer data to the addcustomer service
                      $scope.fnAddCustomerFn($scope.customer.new);                     
                break;
                case "3": //COMPANY CUSTOMER
                      //Getting the customer schedule setting
                      $scope.customer.new.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                      //Getting the customer phones contact list
                      $scope.customer.new.list_phone_contact                        = $scope.list_phone_contact;
                      //Getting the customer Mail list
                      $scope.customer.new.list_emails                               = $scope.list_mails_contact;
                      //Getting the authorized user to the new customer
                      $scope.customer.new.list_client_user                          = $scope.list_client_user;
                      if ($scope.customer.new.typeInmueble==1 && $scope.customer.new.isNotClient==true){
                        $scope.customer.new.idDepartmentFk                          = $scope.customer.select.main.department;
                        $scope.customer.new.address                                 = $scope.customer.select.main.address.selected.address;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk;
                        $scope.customer.new.addressLat                              = $scope.customer.select.main.address.selected.addressLat;
                        $scope.customer.new.addressLon                              = $scope.customer.select.main.address.selected.addressLon;

                      }else{
                        $scope.customer.new.idDepartmentFk                          = null;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                        $scope.customer.new.numberUNF                               = null;
                      }
                      $scope.customer.new.billing_information                       = {};
                      $scope.customer.new.billing_information                       = $scope.customer.new.billing_information_details;                    
                      $scope.customer.new.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                      $scope.customer.new.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                      //Assigning the value of the field isNotCliente to 0
                      $scope.customer.new.isNotCliente                              = 0;
                      $scope.customer.new.idClientAdminFk                           = null;
                      $scope.customer.new.idClientCompaniFk                         = null;
                      $scope.customer.new.idDepartmentFk                            = null;
                      $scope.customer.new.idTipoInmuebleFk                          = $scope.customer.new.typeInmueble;
                      //Printing the current array before add the customer
                      console.log($scope.customer.new);
                      //Send the customer data to the addcustomer service
                      $scope.fnAddCustomerFn($scope.customer.new);                      
                break;
                case "4": //BRANCH CUSTOMER
                      //Getting the customer schedule setting
                      $scope.customer.new.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                      //Getting the customer phones contact list
                      $scope.customer.new.list_phone_contact                        = $scope.customer.companyData.list_phone_contact;
                      //Getting the customer Mail list
                      $scope.customer.new.list_emails                               = $scope.list_mails_contact;
                      //Getting the authorized user to the new customer
                      $scope.customer.new.list_client_user                          = $scope.list_client_user;
                      if ($scope.customer.new.typeInmueble==1 && $scope.customer.new.isNotClient==true){
                        $scope.customer.new.idDepartmentFk                          = $scope.customer.select.main.department;
                        $scope.customer.new.address                                 = $scope.customer.select.main.address.selected.address;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk;
                        $scope.customer.new.addressLat                              = $scope.customer.select.main.address.selected.addressLat;
                        $scope.customer.new.addressLon                              = $scope.customer.select.main.address.selected.addressLon;

                      }else{
                        $scope.customer.new.idDepartmentFk                          = null;
                        $scope.customer.new.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                        $scope.customer.new.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                        $scope.customer.new.numberUNF                               = null;
                      }
                      $scope.customer.new.billing_information                       = {};
                      $scope.customer.new.billing_information                       = $scope.customer.new.billing_information_details;                    
                      $scope.customer.new.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                      $scope.customer.new.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                      //Assigning the value of the field isNotCliente to 0
                      $scope.customer.new.idClientAdminFk                           = 0;
                      $scope.customer.new.isNotCliente                              = 0;
                      $scope.customer.new.idClientCompaniFk                         = $scope.customer.select.company.selected!=undefined?$scope.customer.companyData.idClient:null;
                      $scope.customer.new.name                                      = $scope.customer.new.address;
                      $scope.customer.new.idTipoInmuebleFk                          = $scope.customer.new.typeInmueble;
                      //Printing the current array before add the customer
                      console.log($scope.customer.new);
                      //Send the customer data to the addcustomer service
                      $scope.fnAddCustomerFn($scope.customer.new);                      
                break;
                case "5": //PARTICULAR CUSTOMER
                      $scope.customer.new.list_address_particular                   = $scope.list_address_particular;
                      $scope.customer.new.billing_information                       = {};
                      $scope.customer.new.billing_information                       = $scope.customer.new.billing_information_details;
                      $scope.customer.new.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                      $scope.customer.new.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                      //Assigning the value of the field isNotCliente to 0
                      $scope.customer.new.isNotCliente                              = 0;
                      $scope.customer.update.mobile                                 = null;
                      $scope.customer.update.local                                  = null;
                      $scope.customer.update.idTipoInmuebleFk                       = null;
                      $scope.customer.new.idTipoInmuebleFk                          = null;
                      $scope.list_phone_contact = [];
                      if ($scope.customer.new.mobilePhone!=''){
                        $scope.list_phone_contact.push({"phoneTag":"mobile", "phoneContact":$scope.customer.new.mobilePhone});
                      }
                      if ($scope.customer.new.localPhone!=''){
                        $scope.list_phone_contact.push({"phoneTag":"local", "phoneContact":$scope.customer.new.localPhone});
                      }

                      $scope.customer.new.list_phone_contact                        = $scope.list_phone_contact;
                      //Printing the current array before add the customer
                      console.log($scope.customer.new);
                      //Send the customer data to the addcustomer service
                      $scope.fnAddCustomerFn($scope.customer.new);
                break;
                default:
              }
            };
          /******************************
          *   ADDING NEW THE CUSTOMER   *
          ******************************/
            $scope.fnAddCustomerFn = function(client){
              blockUI.start('Registrando Nuevo Cliente.');
              CustomerServices.addCustomer(client).then(function(response){
                  //console.log(response);
                  if(response.status==200){
                    $timeout(function() {
                      blockUI.message('Cliente Registrado Satisfactoriamente.');
                      console.log("Customer Successfully Created");
                      inform.add('Cliente Registrado Satisfactoriamente. ',{
                            ttl:5000, type: 'success'
                      });
                      $('#RegisterModalCustomer').modal('hide');
                    }, 500);
                    $scope.getAdminCustomersListFn();
                    $scope.getCompaniesCustomersListFn();
                  }else if(response.status==203){
                    console.log("Customer already exist, contact administrator");
                    inform.add('INFO: Cliente ya se encuentra registrado. ',{
                          ttl:5000, type: 'warning'
                    });
                    //$('#RegisterModalCustomer').modal('hide');
                  }else if(response.status==500){
                    console.log("Customer not Created, contact administrator");
                    inform.add('Error: [500] Contacta al area de soporte. ',{
                          ttl:5000, type: 'danger'
                    });
                    //$('#RegisterModalCustomer').modal('hide');
                  }
                  $timeout(function() {
                    blockUI.message('Actualizando listado de clientes.');
                  }, 1500);
                  $timeout(function() {
                    if($scope.isNewCustomer || client.isNotCliente=='0'){
                      $scope.switchCustomersFn('dashboard','', 'registered')
                    }else{
                      $scope.switchCustomersFn('dashboard','', 'unregistered')
                    }
                    blockUI.stop();
                  }, 2000);
                    //$scope.getCustomerListFn("",1);
                    $scope.isNewCustomer=false;
                    $scope.isUpdateCustomer=false;
                  //console.log($scope.rsLocations_API_Data);
              });
            };
      /**************************************************
      *                                                 *
      *             CUSTOMER DATA FUNCTION              *
      *                                                 *
      **************************************************/
          /******************************
          *  SWITCH CUSTOMER FUNCTION   *
          ******************************/
            $scope.chekBox={row: {}};
            $scope.tmpVars ={};
            $scope.customerDataFn=function(obj, switchOption){
              //console.log(obj);
              switch (switchOption){
                  case "edit":
                    var subOption = obj.idClientTypeFk;
                    switch (subOption){
                      case "1": //ADMINISTRATION CUSTOMER
                        $timeout(function() {
                          $scope.customer.update=obj;
                          $scope.tmpVars.list_schedule_atention=obj.list_schedule_atention;
                          $scope.customer.update.billing_information_details=obj.billing_information[0];
                          $scope.customer.update.isBillingInformationEmpty=obj.billing_information.length==0?1:0;
                          var chekbDays = $scope.chekBox.row;
                          /* PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
                          for (var key in chekbDays){
                              if (chekbDays[key]==true){
                                $scope.chekBox.row[key]=false;
                              }
                          }
                          var arrProvince  = [];
                          var arrLocation = [];
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.update.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.update.idLocationFk, $scope.customer.update.idProvinceFk);
                          $scope.customer.select.main.province.selected = arrProvince.length==1?{idProvince: arrProvince[0].idProvince, province: arrProvince[0].province}:undefined;
                          $scope.customer.select.main.location.selected = arrLocation.length==1?{idLocation: arrLocation[0].idLocation, location: arrLocation[0].location}:undefined;
                          if ($scope.customer.select.main.province.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.select.main.location.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          $scope.customer.update.nameAddress=$scope.customer.update.idClientDepartamentFk==null||$scope.customer.update.idClientDepartamentFk==''?$scope.customer.update.address:'';
                          $scope.customerSearch.address = $scope.customer.update.idClientDepartamentFk!=null?$scope.customer.update.name:undefined;
                          $scope.customer.select.main.address.selected=$scope.customer.update.idClientDepartamentFk!=null?{address:$scope.customer.update.address}:undefined;
                          if($scope.customer.update.idClientDepartamentFk){                          
                            $scope.customer.update.isNotClient=true;
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.update.idClientDepartamentFk);
                            $scope.customer.select.main.department=$scope.customer.update.idClientDepartamentFk;
                          }else{
                            $scope.customer.update.isNotClient=false;
                            $scope.addrrSelected=true;
                          }
                          //blockUI.message('Cargando telefonos del cliente '+obj.list_phone_contact.length);
                          //PHONES
                          $scope.list_phone_contact=[];
                          $scope.list_phones=[];  
                          if (obj.list_phone_contact.length>0){
                            for (var key in  obj.list_phone_contact){
                              //console.log(obj.list_phone_contact[key]);
                              $scope.list_phone_contact.push(obj.list_phone_contact[key]);
                              $scope.list_phones.push(obj.list_phone_contact[key]);
                            }
                          }
                          //blockUI.message('Cargando correos del cliente '+obj.list_emails.length);
                          //MAILS
                          $scope.list_mails_contact=[];
                          $scope.list_mails=[];
                          var typeName = '';
                          if (obj.list_emails.length>0){
                            for (var key in  obj.list_emails){
                              for (var type in $scope.rsTypeOfMailsData){
                                if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                  typeName= $scope.rsTypeOfMailsData[type].descripcion;
                                }
                              }
                              $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                              $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                            }
                          }
                          //blockUI.message('Cargando horarios del cliente '+$scope.tmpVars.list_schedule_atention.length);
                          //SCHEDULE
                          for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                            if($scope.tmpVars.list_schedule_atention[i].day==$scope.list_schedule[i].day){
                              //Load the data to the list that will be render in the frontend
                              $scope.list_schedule[i].fronAm    = $scope.tmpVars.list_schedule_atention[i].fronAm;
                              $scope.list_schedule[i].toAm      = $scope.tmpVars.list_schedule_atention[i].toAm;
                              $scope.list_schedule[i].fronPm    = $scope.tmpVars.list_schedule_atention[i].fronPm;
                              $scope.list_schedule[i].toPm      = $scope.tmpVars.list_schedule_atention[i].toPm;
                              $scope.list_schedule[i].selected  = true;
                              //Load the data to a temp array to handle the schedule
                              $scope.list_schedule_atention.push({
                                  'idScheduleAtention':$scope.tmpVars.list_schedule_atention[i].idScheduleAtention,
                                  'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                                  'day':$scope.tmpVars.list_schedule_atention[i].day, 
                                  'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                                  'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                                  'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                                  'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                            }
                          }
                          //blockUI.message('Cargando usuarios autorizados del cliente '+obj.list_client_user.length);
                          //USERS
                          $scope.list_users       = [];
                          $scope.list_client_user = [];
                          if (obj.list_client_user.length>0){
                            for (var user in  obj.list_client_user){
                              //console.log(obj.list_client_user[key]);
                              $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                              $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                            }
                          }
                          $('#UpdateModalCustomer').modal({backdrop: 'static', keyboard: false});
                          $('#UpdateModalCustomer').on('shown.bs.modal', function () {
                          });
                          blockUI.stop();
                          console.info($scope.customer.update);
                        }, 1500);
                        $scope.enabledNextBtn();
                      break;
                      case "2": //BUILDING CUSTOMER
                        $timeout(function() {
                          $scope.customer.update=obj;
                          $scope.tmpVars.list_schedule_atention=obj.list_schedule_atention;
                          $scope.customer.update.billing_information_details=obj.billing_information[0];
                          $scope.customer.update.isBillingInformationEmpty=obj.billing_information.length==0?1:0;
                          console.info($scope.customer.update);
                          var chekbDays = $scope.chekBox.row;
                          //console.log($scope.tmpVars.billing_information);
                          /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
                          for (var key in chekbDays){
                              if (chekbDays[key]==true){
                                $scope.chekBox.row[key]=false;
                              }
                          }
                          var arrProvince  = [];
                          var arrLocation = [];                              
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.update.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.update.idLocationFk, $scope.customer.update.idProvinceFk);
                          $scope.customer.select.main.province.selected = arrProvince.length==1?{idProvince: arrProvince[0].idProvince, province: arrProvince[0].province}:undefined;
                          $scope.customer.select.main.location.selected = arrLocation.length==1?{idLocation: arrLocation[0].idLocation, location: arrLocation[0].location}:undefined;
                          if ($scope.customer.select.main.province.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.select.main.location.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          $scope.customer.update.nameAddress=$scope.customer.update.address;
                          $scope.addrrSelected=$scope.customer.update.address!=null || $scope.customer.update.address!=undefined?true:false;
                          //COMPANY RELATED
                          var arrCompany=[]
                          arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customer.update.idClientAdminFk);
                          //console.log(arrCompany);
                          $timeout(function() {
                            if (arrCompany.length==1){
                              $scope.customerSearch.address = arrCompany[0].businessName;
                              $scope.customer.select.company.selected= {'idClient':arrCompany[0].idClient, 'businessName':arrCompany[0].businessName}
                            }
                          }, 500);
                          //PHONES
                          $scope.list_phone_contact=[];
                          $scope.list_phones=[];  
                          if (obj.list_phone_contact.length>0){
                            for (var key in  obj.list_phone_contact){
                              //console.log(obj.list_phone_contact[key]);
                              $scope.list_phone_contact.push({'idClientFk': obj.list_phone_contact[key].idClientFk,'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                              $scope.list_phones.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                            }
                          }
                          //MAILS
                          $scope.list_mails_contact=[];
                          $scope.list_mails=[];
                          var typeName = '';
                          if (obj.list_emails.length>0){
                            for (var key in  obj.list_emails){
                              for (var type in $scope.rsTypeOfMailsData){
                                if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                  typeName= $scope.rsTypeOfMailsData[type].descripcion;
                                }
                              }
                              $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                              $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                            }
                          }
                          //SCHEDULE 
                          for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                            if($scope.tmpVars.list_schedule_atention[i].day==$scope.list_schedule[i].day){
                              //Load the data to the list that will be render in the frontend
                              $scope.list_schedule[i].fronAm    = $scope.tmpVars.list_schedule_atention[i].fronAm;
                              $scope.list_schedule[i].toAm      = $scope.tmpVars.list_schedule_atention[i].toAm;
                              $scope.list_schedule[i].fronPm    = $scope.tmpVars.list_schedule_atention[i].fronPm;
                              $scope.list_schedule[i].toPm      = $scope.tmpVars.list_schedule_atention[i].toPm;
                              $scope.list_schedule[i].selected  = true;
                              //Load the data to a temp array to handle the schedule
                              $scope.list_schedule_atention.push({
                                  'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                                  'day':$scope.tmpVars.list_schedule_atention[i].day, 
                                  'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                                  'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                                  'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                                  'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                            }
                          }
                          //DEPARTMENTS
                          $scope.rolePermission="rw";
                          $scope.list_depto_floors=[];
                          $scope.list_floor=""; 
                          $scope.floorExist=null;
                          $scope.list_department_multi.unidad=$scope.customer.update.departmentUnit;
                          $scope.list_department_multi.correlacion=$scope.customer.update.departmentCorrelation;
                          var i=3;
                          //console.log($scope.customer.info.list_departament);
                          $scope.list_depto_floors.push({'id':0,'nameFloor':'co', 'deptos':[]});
                          $scope.list_depto_floors.push({'id':1,'nameFloor':'ba', 'deptos':[]});
                          $scope.list_depto_floors.push({'id':2,'nameFloor':'lo', 'deptos':[]});
                          $scope.list_depto_floors.push({'id':3,'nameFloor':'pb', 'deptos':[]});
                          //FLOORS
                          var buildingList=$scope.customer.update.list_departament;
                          $scope.customer.update.list_departament=buildingList.sort(function(a, b) {
                              return b.floor.localeCompare(a.floor)
                          });
                          //console.table(buildingList);
                          var lastFloor=null;
                          var lastFloorTmp=null;
                          for (floor in $scope.customer.update.list_departament){
                            if ($scope.customer.update.list_departament[floor].floor!="co" && $scope.customer.update.list_departament[floor].floor!="ba" && $scope.customer.update.list_departament[floor].floor!="lo" && $scope.customer.update.list_departament[floor].floor!="pb"){
                              //console.log("lastFloor: "+lastFloor+" se valida si es mayor que lastFloorTmp: "+lastFloorTmp);
                                lastFloorTmp=parseInt($scope.customer.update.list_departament[floor].floor);
                              if ((lastFloor==null || lastFloor!=null) && lastFloorTmp>lastFloor){
                                lastFloor=parseInt($scope.customer.update.list_departament[floor].floor);
                              }
                            }
                          }
                          for (var floorItem=1;  floorItem<=lastFloor; floorItem++){
                            $scope.list_depto_floors.push({'id':(floorItem+3),'nameFloor':floorItem.toString(), 'deptos':[]});
                          }
                          //console.table($scope.list_depto_floors);
                          var d=0;
                          //DEPTOS
                          for (arrList in $scope.list_depto_floors){
                              d=0;
                              for (var depto in $scope.customer.update.list_departament){

                                  if($scope.customer.update.list_departament[depto].floor==$scope.list_depto_floors[arrList].nameFloor){
                                    //$scope.list_depto_floors[d].deptos.push($scope.customer.update.list_departament[depto]);
                                    $scope.list_depto_floors[arrList].deptos.push({'idClientDepartament':$scope.customer.update.list_departament[depto].idClientDepartament, 'idDepto':(d+1), 'unitNumber':$scope.customer.update.list_departament[depto].numberUNF, 'floor':$scope.customer.update.list_departament[depto].floor, 'departament':$scope.customer.update.list_departament[depto].departament, 'idCategoryDepartamentFk': $scope.customer.update.list_departament[depto].idCategoryDepartamentFk, 'idStatusFk':$scope.customer.update.list_departament[depto].idStatusFk, 'categoryDepartament':[],'idFloor':$scope.list_depto_floors[arrList].id});
                                  }
                                  d++;
                              }
                          }console.log($scope.list_depto_floors);
                          //CLIENT USERS
                          $scope.list_id_user = [];
                          $scope.list_users   = [];
                          if (obj.list_client_user.length>0){
                            for (var user in  obj.list_client_user){
                              //console.log(obj.list_client_user[key]);
                              $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                              $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                            }
                          }

                          //CONTACT USERS
                          $scope.list_id_user = [];
                          $scope.list_users   = [];
                          $scope.list_client_contact_users = [];
                          if (obj.list_client_contact_users.length>0){
                            for (var user in  obj.list_client_contact_users){
                              //console.log(obj.list_client_contact_users[key]);
                              $scope.list_client_contact_users.push({'idUserFk':obj.list_client_contact_users[user].idUser,'idClientFk': obj.list_client_contact_users[user].idClientFk});
                              $scope.list_users.push({'idUserFk':obj.list_client_contact_users[user].idUser, 'fullNameUser':obj.list_client_contact_users[user].fullNameUser,'idClientFk': obj.list_client_contact_users[user].idClientFk});
                            }
                          }
                          
                          $('#UpdateModalCustomer').modal({backdrop: 'static', keyboard: false});
                          $('#UpdateModalCustomer').on('shown.bs.modal', function () {
                          });

                        blockUI.stop();
                          if (!$scope.isUpdateCustomerRegistered){
                              inform.add('Completa los datos requeridos para efectivizar al cliente. ',{
                                    ttl:5000, type: 'info'
                              });
                          }
                        }, 1500);
                          $scope.enabledNextBtn();
                      break;
                      case "3": //COMPANY CUSTOMER
                        $timeout(function() {
                          $scope.customer.update=obj;
                          $scope.tmpVars.list_schedule_atention=obj.list_schedule_atention;
                          $scope.customer.update.billing_information_details=obj.billing_information[0];
                          $scope.customer.update.isBillingInformationEmpty=obj.billing_information.length==0?1:0;
                          console.info($scope.customer.update);
                          var chekbDays = $scope.chekBox.row;
                          //console.log($scope.tmpVars.billing_information);
                          /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
                          for (var key in chekbDays){
                              if (chekbDays[key]==true){
                                $scope.chekBox.row[key]=false;
                              }
                          }
                          var arrProvince  = [];
                          var arrLocation = [];                              
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.update.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.update.idLocationFk, $scope.customer.update.idProvinceFk);
                          $scope.customer.select.main.province.selected = arrProvince.length==1?{idProvince: arrProvince[0].idProvince, province: arrProvince[0].province}:undefined;
                          $scope.customer.select.main.location.selected = arrLocation.length==1?{idLocation: arrLocation[0].idLocation, location: arrLocation[0].location}:undefined;
                          if ($scope.customer.select.main.province.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.select.main.location.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          $scope.customerSearch.address = $scope.customer.update.idClientDepartamentFk!=null?$scope.customer.update.name:undefined;
                          $scope.customer.update.nameAddress=$scope.customer.update.idClientDepartamentFk==null||$scope.customer.update.idClientDepartamentFk==''?$scope.customer.update.address:'';
                          $scope.customer.select.main.address.selected=$scope.customer.update.idClientDepartamentFk!=null?{address:$scope.customer.update.address}:undefined;
                          if($scope.customer.update.idClientDepartamentFk){
                            $scope.customer.update.isNotClient=true
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.update.idClientDepartamentFk);
                            $scope.customer.select.main.department=$scope.customer.update.idClientDepartamentFk;
                          }else{
                            $scope.customer.update.isNotClient=false
                            $scope.addrrSelected=true;
                          }
                          //PHONES
                          $scope.list_phone_contact=[];
                          $scope.list_phones=[];  
                          if (obj.list_phone_contact.length>0){
                            for (var key in  obj.list_phone_contact){
                              //console.log(obj.list_phone_contact[key]);
                              $scope.list_phone_contact.push({'idClientFk': obj.list_phone_contact[key].idClientFk,'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                              $scope.list_phones.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                            }
                          }
                          //MAILS
                          $scope.list_mails_contact=[];
                          $scope.list_mails=[];
                          var typeName = '';
                          if (obj.list_emails.length>0){
                            for (var key in  obj.list_emails){
                              for (var type in $scope.rsTypeOfMailsData){
                                if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                  typeName= $scope.rsTypeOfMailsData[type].descripcion;
                                }
                              }
                              $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                              $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                            }
                          }

                          //SCHEDULE 
                          for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                            if($scope.tmpVars.list_schedule_atention[i].day==$scope.list_schedule[i].day){
                              //Load the data to the list that will be render in the frontend
                              $scope.list_schedule[i].fronAm    = $scope.tmpVars.list_schedule_atention[i].fronAm;
                              $scope.list_schedule[i].toAm      = $scope.tmpVars.list_schedule_atention[i].toAm;
                              $scope.list_schedule[i].fronPm    = $scope.tmpVars.list_schedule_atention[i].fronPm;
                              $scope.list_schedule[i].toPm      = $scope.tmpVars.list_schedule_atention[i].toPm;
                              $scope.list_schedule[i].selected  = true;
                              //Load the data to a temp array to handle the schedule
                              $scope.list_schedule_atention.push({
                                  'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                                  'day':$scope.tmpVars.list_schedule_atention[i].day, 
                                  'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                                  'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                                  'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                                  'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                            }
                          }
                          //USERS
                          $scope.list_id_user = [];
                          $scope.list_users   = [];
                          if (obj.list_client_user.length>0){
                            for (var user in  obj.list_client_user){
                              //console.log(obj.list_client_user[key]);
                              $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                              $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                            }
                          }
                          $('#UpdateModalCustomer').modal({backdrop: 'static', keyboard: false});
                          $('#UpdateModalCustomer').on('shown.bs.modal', function () {
                              
                          });
                          blockUI.stop();
                        }, 500);
                        $scope.enabledNextBtn();
                      break;
                      case "4": //BRANCH CUSTOMER
                        $timeout(function() {
                          $scope.customer.update=obj;
                          $scope.tmpVars.list_schedule_atention=obj.list_schedule_atention;
                          $scope.customer.update.billing_information_details=obj.billing_information[0];
                          $scope.customer.update.isBillingInformationEmpty=obj.billing_information.length==0?1:0;
                          console.info($scope.customer.update);
                          var chekbDays = $scope.chekBox.row;
                          //console.log($scope.tmpVars.billing_information);
                          /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
                          for (var key in chekbDays){
                              if (chekbDays[key]==true){
                                $scope.chekBox.row[key]=false;
                              }
                          }
                          var arrProvince  = [];
                          var arrLocation = [];                              
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.update.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.update.idLocationFk, $scope.customer.update.idProvinceFk);
                          $scope.customer.select.main.province.selected = arrProvince.length==1?{idProvince: arrProvince[0].idProvince, province: arrProvince[0].province}:undefined;
                          $scope.customer.select.main.location.selected = arrLocation.length==1?{idLocation: arrLocation[0].idLocation, location: arrLocation[0].location}:undefined;
                          if ($scope.customer.select.main.province.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.select.main.location.selected==undefined){
                              inform.add('El cliente '+$scope.customer.update.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          $scope.customer.update.nameAddress=$scope.customer.update.idClientDepartamentFk==null||$scope.customer.update.idClientDepartamentFk==''?$scope.customer.update.address:'';
                          $scope.customer.select.main.address.selected=$scope.customer.update.idClientDepartamentFk!=null?{address:$scope.customer.update.address}:undefined;

                          //COMPANY RELATED
                          var arrCompany=[]
                          arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customer.update.idClientCompaniFk);
                          //console.log(arrCompany[0]);
                          $timeout(function() {
                            if (arrCompany.length==1){
                              $scope.customerSearch.address = arrCompany[0].businessName;
                              $scope.customer.select.company.selected= {'idClient':arrCompany[0].idClient, 'businessName':arrCompany[0].businessName}
                            }
                          }, 500);
                          if($scope.customer.update.idClientDepartamentFk){
                            $scope.customer.update.isNotClient=true
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.update.idClientDepartamentFk);
                            $scope.customer.select.main.department=$scope.customer.update.idClientDepartamentFk;
                          }else{
                            $scope.customer.update.isNotClient=false
                            $scope.addrrSelected=true;
                          }
                          //PHONES
                          $scope.list_phone_contact=[];
                          $scope.list_phones=[];  
                          if (obj.list_phone_contact.length>0){
                            for (var key in  obj.list_phone_contact){
                              //console.log(obj.list_phone_contact[key]);
                              $scope.list_phone_contact.push({'idClientFk': obj.list_phone_contact[key].idClientFk,'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                              $scope.list_phones.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                            }
                          }
                          //MAILS
                          $scope.list_mails_contact=[];
                          $scope.list_mails=[];
                          var typeName = '';
                          if (obj.list_emails.length>0){
                            for (var key in  obj.list_emails){
                              for (var type in $scope.rsTypeOfMailsData){
                                if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                  typeName= $scope.rsTypeOfMailsData[type].descripcion;
                                }
                              }
                              $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status});
                              $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status});
                            }
                          }

                          //SCHEDULE 
                          for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                            if($scope.tmpVars.list_schedule_atention[i].day==$scope.list_schedule[i].day){
                              //Load the data to the list that will be render in the frontend
                              $scope.list_schedule[i].fronAm    = $scope.tmpVars.list_schedule_atention[i].fronAm;
                              $scope.list_schedule[i].toAm      = $scope.tmpVars.list_schedule_atention[i].toAm;
                              $scope.list_schedule[i].fronPm    = $scope.tmpVars.list_schedule_atention[i].fronPm;
                              $scope.list_schedule[i].toPm      = $scope.tmpVars.list_schedule_atention[i].toPm;
                              $scope.list_schedule[i].selected  = true;
                              //Load the data to a temp array to handle the schedule
                              $scope.list_schedule_atention.push({
                                  'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                                  'day':$scope.tmpVars.list_schedule_atention[i].day, 
                                  'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                                  'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                                  'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                                  'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                            }
                          }
                          //USERS
                          $scope.list_id_user = [];
                          $scope.list_users   = [];
                          if (obj.list_client_user.length>0){
                            for (var user in  obj.list_client_user){
                              //console.log(obj.list_client_user[key]);
                              $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                              $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                            }
                          }
                          $('#UpdateModalCustomer').modal({backdrop: 'static', keyboard: false});
                          $('#UpdateModalCustomer').on('shown.bs.modal', function () {
                              
                          });                        
                          blockUI.stop();
                        }, 500);
                        $scope.enabledNextBtn();
                      break;
                      case "5": //PARTICULAR CUSTOMER
                        $timeout(function() {
                          $scope.customer.update=obj;
                          $scope.customer.update.billing_information_details=obj.billing_information[0];
                          $scope.customer.update.isBillingInformationEmpty=obj.billing_information.length==0?1:0;
                          console.info($scope.customer.update);

                          //PHONES
                          $scope.list_phone_contact=[];
                          $scope.list_phones=[];  
                          if (obj.list_phone_contact.length>0){
                            for (var key in  obj.list_phone_contact){
                              if (obj.list_phone_contact[key].phoneTag=="mobile"){
                                $scope.customer.update.mobilePhone=obj.list_phone_contact[key].phoneContact;
                              }else{
                                $scope.customer.update.localPhone=obj.list_phone_contact[key].phoneContact;
                              }                                                                    
                            }
                          }
                          //PARTICULAR ADDRESS
                          $scope.list_address_particular=[];
                          //$scope.list_address_particular.push({"address":nameAddress, "idParticularDepartamentKf":idDepartment, "depto": department, "isBuilding":customerisBuilding, "idProvinceFk":idProvince, "idLocationFk":idLocation, "idTipoInmuebleFk":obj.typeInmueble, "clarification":obj.clarification, 'addressLat':addrLatitud,'addressLon':addrLongitud});
                          var typeName = '';
                          if (obj.list_address_particular.length>0){
                            for (var key in  obj.list_address_particular){
                              for (var type in $scope.rsCustomerTypeData){
                                if ($scope.rsCustomerTypeData[type].idClientType==obj.list_address_particular[key].idTipoInmuebleFk){
                                  typeName= $scope.rsCustomerTypeData[type].ClientType;
                                }
                              }
                              $scope.list_address_particular.push(obj.list_address_particular[key]);
                            }
                          }                              
                          $('#UpdateModalCustomer').modal({backdrop: 'static', keyboard: false});
                          $('#UpdateModalCustomer').on('shown.bs.modal', function () {
                              
                          });
                          blockUI.stop();
                        }, 500);
                        $scope.enabledNextBtn();
                      break;
                      default:
                    }
                  break;
                  case "update":
                    var subOption = obj.idClientTypeFk;
                    switch (subOption){
                      case "1": //ADMINISTRATION CUSTOMER
                        //Getting the customer schedule setting
                        $scope.customer.update.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                        //Getting the customer phones contact list
                        $scope.customer.update.list_phone_contact                        = $scope.list_phone_contact;
                        //Getting the customer Mail list
                        $scope.customer.update.list_emails                               = $scope.list_mails_contact;
                        //Getting the authorized user to the new customer
                        $scope.customer.update.list_client_user                          = [];
                        $scope.customer.update.list_client_user                          = $scope.list_client_user;
                        if ($scope.customer.update.idTipoInmuebleFk==1 && $scope.customer.update.isNotClient==true){
                          $scope.customer.update.idClientDepartamentFk                   = $scope.customer.select.main.department;
                          $scope.customer.update.address                                 = $scope.customer.select.main.address.selected.address;
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk==undefined?$scope.customer.update.idProvinceFk:$scope.customer.select.main.address.selected.idProvinceFk;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk==undefined?$scope.customer.update.idLocationFk:$scope.customer.select.main.address.selected.idLocationFk;
                          $scope.customer.update.addressLat                              = $scope.customer.update.addressLat;
                          $scope.customer.update.addressLon                              = $scope.customer.update.addressLon;

                        }else{
                          $scope.customer.update.idClientDepartamentFk                   = null;
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                          $scope.customer.update.numberUNF                               = null;
                        }
                        $scope.customer.update.billing_information                       = {};
                        $scope.customer.update.billing_information                       = $scope.customer.update.billing_information_details;
                        $scope.customer.update.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                        $scope.customer.update.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                        //Assigning the default value to 0
                        $scope.customer.update.isNotClient                               = 0;
                        $scope.customer.update.idClientAdminFk                           = 0;
                        $scope.customer.update.idClientCompaniFk                         = 0;
                        //Printing the current array before add the customer
                        console.log($scope.customer.update);
                        //Send the customer data to the addcustomer service
                        $scope.updateCustomerFn($scope.customer.update);    
                      break;
                      case "2": //BUILDING CUSTOMER
                            //Getting the customer schedule setting
                            $scope.customer.update.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                            //Getting the customer phones contact list
                            $scope.customer.update.list_phone_contact                        = $scope.list_phone_contact;
                            //Getting the department that was created
                            $scope.selectDeptoDataFn();
                            $scope.customer.update.list_departament                          = $scope.list_departments;
                            //Getting the customer Mail list
                            $scope.customer.update.list_emails                               = $scope.list_mails_contact;
                            //Getting the authorized user to the new customer
                            $scope.customer.update.list_client_user                          = $scope.list_client_user;
                            $scope.customer.update.idProvinceFk                              = $scope.customer.select.main.province.selected.idProvince;
                            $scope.customer.update.idLocationFk                              = $scope.customer.select.main.location.selected.idLocation;
                            $scope.customer.update.billing_information                       = {'businessNameBilling':'','cuitBilling':'','idTypeTaxFk':'','nameAddress':'','idLocationBillingFk':'','idProvinceBillingFk':''};
                            $scope.customer.update.billing_information                       = $scope.customer.update.billing_information_details;
                            //console.log($scope.customer.update.billing_information_details);
                            //$scope.customer.update.billing_information.nameAddress           = $scope.customer.update.billing_information_details;
                            $scope.customer.update.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                            $scope.customer.update.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                            console.log($scope.customer.update.billing_information);
                            //console.log("Count: "+$scope.customer.update.billing_information.length)
                            //Assigning the default value to 0
                            $scope.customer.update.isNotClient                               = 0;
                            $scope.customer.update.isNotCliente                              = 0;
                            $scope.customer.update.idClientAdminFk                           = $scope.customer.select.company.selected!=undefined?$scope.customer.select.company.selected.idClient:null;
                            $scope.customer.update.idClientCompaniFk                         = null;
                            $scope.customer.update.idDepartmentFk                            = null;
                            $scope.customer.update.idTipoInmuebleFk                          = null;
                            $scope.customer.update.address
                            $scope.customer.update.name                                      = $scope.customer.update.address;
                            $scope.customer.update.departmentUnit                            = $scope.list_department_multi.unidad;
                            $scope.customer.update.departmentCorrelation                     = $scope.list_department_multi.correlacion;
                            $scope.customer.update.idStatusFk                                = $scope.customer.update.isNotCliente=="0" || $scope.customer.update.isNotCliente==0?1:$scope.customer.update.idStatusFk;
                            //Printing the current array before add the customer
                            console.log($scope.customer.update);
                            //Send the customer data to the addcustomer service
                            $scope.updateCustomerFn($scope.customer.update);
                      break;                    
                      case "3": //COMPANY CUSTOMER
                        //Getting the customer schedule setting
                        $scope.customer.update.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                        //Getting the customer phones contact list
                        $scope.customer.update.list_phone_contact                        = $scope.list_phone_contact;
                        //Getting the customer Mail list
                        $scope.customer.update.list_emails                               = $scope.list_mails_contact;
                        //Getting the authorized user to the new customer
                        $scope.customer.update.list_client_user                          = [];
                        $scope.customer.update.list_client_user                          = $scope.list_client_user;
                        if ($scope.customer.update.idTipoInmuebleFk==1 && $scope.customer.update.isNotClient==true){
                          $scope.customer.update.idClientDepartamentFk                   = $scope.customer.select.main.department;
                          $scope.customer.update.address                                 = $scope.customer.select.main.address.selected.address;                                                
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk==undefined?$scope.customer.update.idProvinceFk:$scope.customer.select.main.address.selected.idProvinceFk;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk==undefined?$scope.customer.update.idLocationFk:$scope.customer.select.main.address.selected.idLocationFk;
                          $scope.customer.update.addressLat                              = $scope.customer.update.addressLat;
                          $scope.customer.update.addressLon                              = $scope.customer.update.addressLon;                        

                        }else{
                          $scope.customer.update.idDepartmentFk                          = null;
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                          $scope.customer.update.numberUNF                               = null;
                        }
                        $scope.customer.update.billing_information                       = {};
                        $scope.customer.update.billing_information                       = $scope.customer.update.billing_information_details;
                        $scope.customer.update.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                        $scope.customer.update.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                        //Assigning the default value to 0
                        $scope.customer.update.isNotClient                              = 0;
                        $scope.customer.update.idClientAdminFk                           = 0;
                        $scope.customer.update.idClientCompaniFk                         = 0;
                        //Printing the current array before add the customer
                        console.log($scope.customer.update);
                        //Send the customer data to the addcustomer service
                        $scope.updateCustomerFn($scope.customer.update);    
                      break;
                      case "4": //BRANCH CUSTOMER
                        //Getting the customer schedule setting
                        $scope.customer.update.list_schedule_atention                    = $scope.list_schedule_time_orderBy;
                        //Getting the customer phones contact list
                        $scope.customer.update.list_phone_contact                        = $scope.list_phone_contact;
                        //Getting the customer Mail list
                        $scope.customer.update.list_emails                               = $scope.list_mails_contact;
                        //Getting the authorized user to the new customer
                        $scope.customer.update.list_client_user                          = $scope.list_client_user;
                        //Getting the authorized user to the new customer
                        $scope.customer.update.list_client_user                          = [];
                        $scope.customer.update.list_client_user                          = $scope.list_client_user;
                        if ($scope.customer.update.idTipoInmuebleFk==1 && $scope.customer.update.isNotClient==true){
                          $scope.customer.update.idClientDepartamentFk                   = $scope.customer.select.main.department;
                          $scope.customer.update.address                                 = $scope.customer.select.main.address.selected.address;
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.address.selected.idProvinceFk==undefined?$scope.customer.update.idProvinceFk:$scope.customer.select.main.address.selected.idProvinceFk;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.address.selected.idLocationFk==undefined?$scope.customer.update.idLocationFk:$scope.customer.select.main.address.selected.idLocationFk;
                          $scope.customer.update.addressLat                              = $scope.customer.update.addressLat;
                          $scope.customer.update.addressLon                              = $scope.customer.update.addressLon;


                        }else{
                          $scope.customer.update.idDepartmentFk                          = null;
                          $scope.customer.update.idProvinceFk                            = $scope.customer.select.main.province.selected.idProvince;
                          $scope.customer.update.idLocationFk                            = $scope.customer.select.main.location.selected.idLocation;
                          $scope.customer.update.numberUNF                               = null;
                        }
                        $scope.customer.update.billing_information                       = {};
                        $scope.customer.update.billing_information                       = $scope.customer.update.billing_information_details;                      
                        $scope.customer.update.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                        $scope.customer.update.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                        //Assigning the value of the field isNotCliente to 0
                        $scope.customer.update.idClientAdminFk                           = 0;
                        $scope.customer.update.isNotClient                              = 0;
                        $scope.customer.update.idClientCompaniFk                         = $scope.customer.select.company.selected.idClient;
                        $scope.customer.update.name                                      = $scope.customer.update.address;                      
                        //Printing the current array before add the customer
                        console.log($scope.customer.update);
                        //Send the customer data to the addcustomer service
                        $scope.updateCustomerFn($scope.customer.update);                    
                      break;
                      case "5": //PARTICULAR CUSTOMER
                            $scope.customer.update.list_address_particular                   = $scope.list_address_particular;
                            $scope.customer.update.billing_information                       = {};
                            $scope.customer.update.billing_information                       = $scope.customer.update.billing_information_details;                          
                            $scope.customer.update.billing_information.idProvinceBillingFk   = $scope.customer.select.payment.province.selected.idProvince;
                            $scope.customer.update.billing_information.idLocationBillingFk   = $scope.customer.select.payment.location.selected.idLocation;
                            //Assigning the value of the field isNotCliente to 0
                            $scope.customer.update.isNotClient                              = 0;
                            $scope.customer.update.mobile                                   = null;
                            $scope.customer.update.local                                    = null;
                            $scope.customer.update.idTipoInmuebleFk                         = null;
                            $scope.list_phone_contact = [];
                            if ($scope.customer.update.mobilePhone!=''){
                              $scope.list_phone_contact.push({"phoneTag":"mobile", "phoneContact":$scope.customer.update.mobilePhone});
                            }
                            if ($scope.customer.update.localPhone!=''){
                              $scope.list_phone_contact.push({"phoneTag":"local", "phoneContact":$scope.customer.update.localPhone});
                            }

                            $scope.customer.update.list_phone_contact                        = $scope.list_phone_contact;
                            //Printing the current array before add the customer
                            console.log($scope.customer.update);
                            //Send the customer data to the addcustomer service
                            $scope.updateCustomerFn($scope.customer.update);
                      break;
                    }
                  break;
                  case "phones":
                    $scope.list_phone_contact=[];
                    $scope.list_phones=[];
                    $scope.customer.info = obj;
                    //console.log(obj.list_phone_contact);
                    if (obj.list_phone_contact.length>0){
                      for (var key in  obj.list_phone_contact){
                        //console.log(obj.list_phone_contact[key]);
                        $scope.list_phone_contact.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                        $scope.list_phones.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                      }
                    }else{
                      //console.log("obj.list_phone_contact is empty");
                    }
                    $('#customerPhonesContact').modal('toggle'); 
                  break;
                  case "mails":
                    $scope.list_mails_contact=[];
                    $scope.list_mails=[];                   
                    $scope.customer.info = obj;
                    //console.log(obj.list_emails);
                    var typeName = '';
                    if (obj.list_emails.length>0){
                      for (var key in  obj.list_emails){
                        for (var type in $scope.rsTypeOfMailsData){
                          if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                            typeName= $scope.rsTypeOfMailsData[type].descripcion;
                          }
                        }
                        //console.log(obj.list_emails[key]);
                        $scope.list_mails_contact.push({'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk});
                        $scope.list_mails.push({'mailTag':obj.list_emails[key].mailTag, 'typeName':typeName, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk}); 
                      }
                    }else{
                      console.log("obj.list_emails is empty");
                    }
                    $('#customerMailsContact').modal('toggle');                       
                  break;
                  case "deptos":
                    $scope.rolePermission="ro";
                    $scope.list_depto_floors=[];
                    $scope.customer.info = obj;
                    console.log(obj);
                    $scope.list_floor="";
                    $scope.floorExist=null;
                    var i=3;
                    //console.log($scope.customer.info.list_departament);
                    $scope.list_depto_floors.push({'id':0,'nameFloor':'co', 'deptos':[]});
                    $scope.list_depto_floors.push({'id':1,'nameFloor':'ba', 'deptos':[]});
                    $scope.list_depto_floors.push({'id':2,'nameFloor':'lo', 'deptos':[]});
                    $scope.list_depto_floors.push({'id':3,'nameFloor':'pb', 'deptos':[]});
                    //FLOORS
                    var buildingList=$scope.customer.info.list_departament;
                    $scope.customer.info.list_departament=buildingList.sort(function(a, b) {
                        return b.floor.localeCompare(a.floor)
                    });
                    //console.table($scope.customer.info.list_departament);
                    var lastFloor=null;
                    var lastFloorTmp=null;
                    for (floor in $scope.customer.info.list_departament){
                      if ($scope.customer.info.list_departament[floor].floor!="co" && $scope.customer.info.list_departament[floor].floor!="ba" && $scope.customer.info.list_departament[floor].floor!="lo" && $scope.customer.info.list_departament[floor].floor!="pb"){
                        //console.log("lastFloor: "+lastFloor+" se valida si es mayor que lastFloorTmp: "+lastFloorTmp);
                          lastFloorTmp=parseInt($scope.customer.info.list_departament[floor].floor);
                        if ((lastFloor==null || lastFloor!=null) && lastFloorTmp>lastFloor){
                          lastFloor=parseInt($scope.customer.info.list_departament[floor].floor);
                        }
                      }
                    }

                    for (var floorItem=1;  floorItem<=lastFloor; floorItem++){
                      $scope.list_depto_floors.push({'id':(floorItem+3),'nameFloor':floorItem.toString(), 'deptos':[]});
                    }console.log($scope.list_depto_floors);
                    var d=0;
                    //DEPTOS
                    for (arrList in $scope.list_depto_floors){
                      d=0;
                      for (var depto in $scope.customer.info.list_departament){
                          if($scope.customer.info.list_departament[depto].floor.toLowerCase()==$scope.list_depto_floors[arrList].nameFloor){
                            //$scope.list_depto_floors[d].deptos.push($scope.customer.info.list_departament[depto]);
                            $scope.list_depto_floors[arrList].deptos.push({'idClientDepartament':$scope.customer.info.list_departament[depto].idClientDepartament, 'idDepto':(d+1), 'unitNumber':$scope.customer.info.list_departament[depto].numberUNF, 'floor':$scope.customer.info.list_departament[depto].floor, 'departament':$scope.customer.info.list_departament[depto].departament, 'idCategoryDepartamentFk': $scope.customer.info.list_departament[depto].idCategoryDepartamentFk, 'idStatusFk':$scope.customer.info.list_departament[depto].idStatusFk, 'categoryDepartament':[],'idFloor':$scope.list_depto_floors[arrList].id});
                          }
                          d++;
                      }
                    }console.log($scope.list_depto_floors);
                    //console.log($scope.list_depto_floors);
                    $('#DepartmentsCustomer').modal('toggle');
                  break;
                  case "particularAddress":
                    $scope.list_address_particular=[];
                    $scope.customer.info = obj;
                    var typeName = '';
                    if (obj.list_address_particular.length>0){
                      for (var key in  obj.list_address_particular){
                        for (var type in $scope.rsCustomerTypeData){
                          if ($scope.rsCustomerTypeData[type].idClientType==obj.list_address_particular[key].idTipoInmuebleFk){
                            typeName= $scope.rsCustomerTypeData[type].ClientType;
                          }
                        }
                        $scope.list_address_particular.push(obj.list_address_particular[key]);
                      }
                    }else{
                      //console.log("obj.list_phone_contact is empty");
                    }
                    $('#AddressParticularCustomer').modal('toggle');
                  break;
                  case "allowedUsers":
                    //USERS
                    $scope.customer.info    = obj;
                    $scope.customer.info.billing_information_details=obj.billing_information[0];
                    //console.info($scope.customer.info);
                    $scope.customer.info.billing_information_details.nameAddress=$scope.customer.info.billing_information_details.businessAddress;
                    //console.info($scope.customer.info);
                    $scope.list_users       = [];
                    $scope.list_client_user = [];
                    if (obj.list_client_user.length>0){
                      for (var user in  obj.list_client_user){
                        //console.log(obj.list_client_user[key]);
                        $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                        $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                      }
                    }
                    console.info($scope.customer.info);
                    $('#allowedUsers').modal('toggle');                       
                  break;
                  case "allowedUsers_update":
                    $scope.customer.info.list_client_user                = [];
                    $scope.customer.info.list_client_user                = $scope.list_client_user;
                    $scope.customer.info.billing_information             = {};
                    $scope.customer.info.billing_information             = $scope.customer.info.billing_information_details;
                    $scope.customer.info.isBillingInformationEmpty       = $scope.customer.info.length==0?1:0;
                    //Printing the current array before add the customer
                    console.log($scope.customer.info);
                    //Send the customer data to the addcustomer service
                    $scope.updateCustomerFn($scope.customer.info);
                    $('#allowedUsers').modal('hide');
                  break;
                  case "contactdUsers":
                    //CONTACT USERS
                    $scope.customer.info    = obj;
                    $scope.customer.info.billing_information_details=obj.billing_information[0];
                    //console.info($scope.customer.info);
                    $scope.customer.info.billing_information_details.nameAddress=$scope.customer.info.billing_information_details.businessAddress;
                    //console.info($scope.customer.info);
                    $scope.list_users       = [];
                    $scope.list_client_contact_users = [];
                    if (obj.list_client_contact_users.length>0){
                      for (var user in  obj.list_client_contact_users){
                        //console.log(obj.list_client_contact_users[key]);
                        $scope.list_client_contact_users.push({'idUserFk':obj.list_client_contact_users[user].idUser,'idClientFk': obj.list_client_contact_users[user].idClientFk});
                        $scope.list_users.push({'idUserFk':obj.list_client_contact_users[user].idUser, 'fullNameUser':obj.list_client_contact_users[user].fullNameUser,'idClientFk': obj.list_client_contact_users[user].idClientFk});
                      }
                    }
                    console.info($scope.customer.info);
                    $('#contactUsers').modal('toggle');                       
                  break;
                  case "contactUsers_update":
                    $scope.customer.info.list_client_contact_users       = [];
                    $scope.customer.info.list_client_contact_users       = $scope.list_client_contact_users;
                    $scope.customer.info.billing_information             = {};
                    $scope.customer.info.billing_information             = $scope.customer.info.billing_information_details;
                    $scope.customer.info.isBillingInformationEmpty       = $scope.customer.info.length==0?1:0;
                    //Printing the current array before add the customer
                    console.log($scope.customer.info);
                    //Send the customer data to the addcustomer service
                    $scope.updateCustomerFn($scope.customer.info);
                    $('#contactUsers').modal('hide');
                  break;
                  case "details_customer": //CUSTOMER
                      var arrProvince  = [];
                      var arrLocation = []; 
                      console.log(obj);
                      var subOption = obj.idClientTypeFk;
                      $scope.tmpVars.list_schedule_atention               = obj.list_schedule_atention;
                      $scope.customer.details                             = obj;
                      $scope.customer.details.billing_information_details = obj.billing_information[0];
                      $scope.customer.details.IsInDebtTmp                 = obj.IsInDebt==1?true:false;
                      $scope.customer.details.isStockInBuildingTmp        = obj.isStockInBuilding==1?true:false;
                      $scope.customer.details.isStockInOfficeTmp          = obj.isStockInOffice==1?true:false;
                      $scope.customer.details.IsInDebtURL                 = serverHost+"/status/client/"+$scope.customer.details.idClient;
                      $scope.customer.details.servicesStatustURL          = serverHost+"/status/services/"+$scope.customer.details.idClient;
                      $scope.customer.details.infoURL                     = serverHost+"/info/client/"+$scope.customer.details.idClient;
                      switch (subOption){
                        case "1": //ADMINISTRATION CUSTOMER
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.details.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.details.idLocationFk, $scope.customer.details.idProvinceFk);
                          $scope.customer.details.province = arrProvince.length==1?arrProvince[0].province:null;
                          $scope.customer.details.location = arrLocation.length==1?arrLocation[0].location:null;
                          if ($scope.customer.details.province==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.details.location==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          
                          if($scope.customer.details.idClientDepartamentFk){
                            $scope.customer.update.isNotClient=true;
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.details.idClientDepartamentFk);
                            $timeout(function() {
                              for (var depto in $scope.rsBuildingDepartmentsData){
                                if ($scope.customer.details.idClientDepartamentFk==$scope.rsBuildingDepartmentsData[depto].idDepto){
                                  $scope.customer.details.department=$scope.rsBuildingDepartmentsData[depto];
                                }
                              }
                            blockUI.stop();
                            }, 1000);
                          }else{
                            $scope.customer.update.isNotClient=false;
                            $scope.addrrSelected=true;
                          }
                        break;
                        case "2": //BUILDING CUSTOMER
                          arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customer.details.idClientAdminFk);
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.details.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.details.idLocationFk, $scope.customer.details.idProvinceFk);
                          $timeout(function() {
                            if (arrCompany.length==1){
                              $scope.customer.details.companyBusinessName=arrCompany.length==1?arrCompany[0].businessName:null;
                            }
                          }, 500);
                          $scope.customer.details.province = arrProvince.length==1?arrProvince[0].province:null;
                          $scope.customer.details.location = arrLocation.length==1?arrLocation[0].location:null;
                          if ($scope.customer.details.province==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.details.location==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          
                          $scope.rolePermission="ro";
                          $scope.list_depto_floors_details=[];
                          $scope.customer.info = obj;
                          $scope.list_floor="";
                          $scope.floorExist=null;
                          if (obj.list_departament.length>0){
                            var i=3;
                            //console.log($scope.customer.info.list_departament);
                            $scope.list_depto_floors_details.push({'id':0,'nameFloor':'co', 'deptos':[]});
                            $scope.list_depto_floors_details.push({'id':1,'nameFloor':'ba', 'deptos':[]});
                            $scope.list_depto_floors_details.push({'id':2,'nameFloor':'lo', 'deptos':[]});
                            $scope.list_depto_floors_details.push({'id':3,'nameFloor':'pb', 'deptos':[]});
                            //FLOORS
                            var buildingList=$scope.customer.info.list_departament;
                            $scope.customer.info.list_departament=buildingList.sort(function(a, b) {
                                return b.floor.localeCompare(a.floor)
                            });
                            //console.table($scope.customer.info.list_departament);
                            var lastFloor=null;
                            var lastFloorTmp=null;
                            for (floor in $scope.customer.info.list_departament){
                              if ($scope.customer.info.list_departament[floor].floor!="co" && $scope.customer.info.list_departament[floor].floor!="ba" && $scope.customer.info.list_departament[floor].floor!="lo" && $scope.customer.info.list_departament[floor].floor!="pb"){
                                //console.log("lastFloor: "+lastFloor+" se valida si es mayor que lastFloorTmp: "+lastFloorTmp);
                                  lastFloorTmp=parseInt($scope.customer.info.list_departament[floor].floor);
                                if ((lastFloor==null || lastFloor!=null) && lastFloorTmp>lastFloor){
                                  lastFloor=parseInt($scope.customer.info.list_departament[floor].floor);
                                }
                              }
                            }

                            for (var floorItem=1;  floorItem<=lastFloor; floorItem++){
                              $scope.list_depto_floors_details.push({'id':(floorItem+3),'nameFloor':floorItem.toString(), 'deptos':[]});
                            }//console.log($scope.list_depto_floors_details);
                            var d=0;
                            //DEPTOS
                            for (arrList in $scope.list_depto_floors_details){
                              d=0;
                              for (var depto in $scope.customer.info.list_departament){

                                  if($scope.customer.info.list_departament[depto].floor==$scope.list_depto_floors_details[arrList].nameFloor){
                                    //$scope.list_depto_floors_details[d].deptos.push($scope.customer.info.list_departament[depto]);
                                    $scope.list_depto_floors_details[arrList].deptos.push({'idClientDepartament':$scope.customer.info.list_departament[depto].idClientDepartament, 'idDepto':(d+1), 'unitNumber':$scope.customer.info.list_departament[depto].numberUNF, 'floor':$scope.customer.info.list_departament[depto].floor, 'departament':$scope.customer.info.list_departament[depto].departament, 'idCategoryDepartamentFk': $scope.customer.info.list_departament[depto].idCategoryDepartamentFk, 'idStatusFk':$scope.customer.info.list_departament[depto].idStatusFk, 'categoryDepartament':[],'idFloor':$scope.list_depto_floors_details[arrList].id});
                                  }
                                  d++;
                              }
                            }
                          }
                        break;
                        case "3": //COMPANY CUSTOMER
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.details.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.details.idLocationFk, $scope.customer.details.idProvinceFk);
                          $scope.customer.details.province = arrProvince.length==1?arrProvince[0].province:null;
                          $scope.customer.details.location = arrLocation.length==1?arrLocation[0].location:null;
                          if ($scope.customer.details.province==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.details.location==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          
                          if($scope.customer.details.idClientDepartamentFk){                          
                            $scope.customer.details.isNotClient=true;
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.details.idClientDepartamentFk);
                            $timeout(function() {
                              for (var depto in $scope.rsBuildingDepartmentsData){
                                if ($scope.customer.details.idClientDepartamentFk==$scope.rsBuildingDepartmentsData[depto].idDepto){
                                  $scope.customer.details.department=$scope.rsBuildingDepartmentsData[depto];
                                }
                              }
                            blockUI.stop();
                            }, 100);
                          }else{
                            $scope.customer.details.isNotClient=false;
                            $scope.addrrSelected=true;
                          }
                        break;
                        case "4": //BRANCH CUSTOMER
                          arrCompany=$scope.getCustomerBusinessNameByIdFn($scope.customer.details.idClientCompaniFk);
                          $timeout(function() {
                            if (arrCompany.length==1){
                              $scope.customer.details.companyBusinessName=arrCompany.length==1?arrCompany[0].businessName:null;
                            }
                          }, 500);
                          arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.details.idProvinceFk);
                          arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.details.idLocationFk, $scope.customer.details.idProvinceFk);
                          $scope.customer.details.province = arrProvince.length==1?arrProvince[0].province:null;
                          $scope.customer.details.location = arrLocation.length==1?arrLocation[0].location:null;
                          if ($scope.customer.details.province==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.details.location==null){
                              inform.add('El cliente '+$scope.customer.details.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          
                          if($scope.customer.details.idClientDepartamentFk){                          
                            $scope.customer.details.isNotClient=true;
                            $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.details.idClientDepartamentFk);
                            $timeout(function() {
                              for (var depto in $scope.rsBuildingDepartmentsData){
                                if ($scope.customer.details.idClientDepartamentFk==$scope.rsBuildingDepartmentsData[depto].idDepto){
                                  $scope.customer.details.department=$scope.rsBuildingDepartmentsData[depto];
                                }
                              }
                            blockUI.stop();
                            }, 100);
                          }else{
                            $scope.customer.details.isNotClient=false;
                            $scope.addrrSelected=true;
                          }                      
                        break;
                        case "5": //PARTICULAR CUSTOMER
                        break;
                      }
                        //PHONES
                        $scope.list_phone_contact=[];
                        $scope.list_phones=[];  
                        if (obj.list_phone_contact.length>0){
                          for (var key in  obj.list_phone_contact){
                            //console.log(obj.list_phone_contact[key]);
                            $scope.list_phone_contact.push(obj.list_phone_contact[key]);
                            $scope.list_phones.push(obj.list_phone_contact[key]);
                          }
                        }
                        //blockUI.message('Cargando correos del cliente '+obj.list_emails.length);
                        //MAILS
                        $scope.list_mails_contact=[];
                        $scope.list_mails=[];
                        var typeName = '';
                        if (obj.list_emails.length>0){
                          for (var key in  obj.list_emails){
                            for (var type in $scope.rsTypeOfMailsData){
                              if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                typeName= $scope.rsTypeOfMailsData[type].descripcion;
                              }
                            }
                            $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                            $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                          }
                        }
                        //USERS
                        $scope.list_users       = [];
                        $scope.list_client_user = [];
                        if (obj.list_client_user.length>0){
                          for (var user in  obj.list_client_user){
                            for (var key in $scope.rsList.clientUser){
                              if ($scope.rsList.clientUser[key].idUser==obj.list_client_user[user].idUser){
                                //console.log($scope.rsList.clientUser[key]);
                                //console.log(obj.list_client_user[key]);
                                $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk, 'idStatusKf':$scope.rsList.clientUser[key].idStatusKf, 'statusTenantName':$scope.rsList.clientUser[key].statusTenantName});
                                $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk, 'idStatusKf':$scope.rsList.clientUser[key].idStatusKf, 'statusTenantName':$scope.rsList.clientUser[key].statusTenantName});                            
                              }
                            }
                          }
                        }
                        //SCHEDULE
                        $scope.list_schedule_details=$scope.list_schedule;
                        $scope.list_schedule_atention_details=[];                    
                        if (obj.list_schedule_atention.length>0){
                          for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                              //Load the data to a temp array to handle the schedule
                              $scope.list_schedule_atention_details.push({
                                  'idScheduleAtention':$scope.tmpVars.list_schedule_atention[i].idScheduleAtention,
                                  'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                                  'day':$scope.tmpVars.list_schedule_atention[i].day, 
                                  'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                                  'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                                  'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                                  'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                          }
                        }
                        //console.log($scope.list_users);
                        //var zonaInfo=$scope.getZoneNameFn($scope.customerFound.idZonaFk);
                        $scope.customer.details.zona={'n_zona':$scope.customer.details.n_zona, 'descripcion':$scope.customer.details.descripcion};
                        console.log($scope.customer.details);
                        $('#customerModalDetails').modal({backdrop: 'static', keyboard: false});
                        $('#customerModalDetails').on('shown.bs.modal', function () {
                        });
                  break;
                  case "details_company": //CUSTOMER Company or Administration
                    var arrProvince  = [];
                    var arrLocation = []; 
                    var subOption = obj.idClientTypeFk;
                    $scope.tmpVars.companyDetails_list_schedule_atention=obj.list_schedule_atention;                  
                    $scope.customer.companyDetails=obj;
                    $scope.customer.companyDetails.billing_information_details=obj.billing_information[0];
                    switch (subOption){
                      case "1": //ADMINISTRATION CUSTOMER
                        arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.companyDetails.idProvinceFk);
                        arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.companyDetails.idLocationFk, $scope.customer.companyDetails.idProvinceFk);
                        $scope.customer.companyDetails.province = arrProvince.length==1?arrProvince[0].province:null;
                        $scope.customer.companyDetails.location = arrLocation.length==1?arrLocation[0].location:null;
                        if ($scope.customer.companyDetails.province==null){
                              form.add('El cliente '+$scope.customer.companyDetails.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                        }
                        if ($scope.customer.companyDetails.location==null){
                              form.add('El cliente '+$scope.customer.companyDetails.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                        }
                        if($scope.customer.companyDetails.idClientDepartamentFk){                          
                          $scope.customer.update.isNotClient=true;
                          $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.companyDetails.idClientDepartamentFk);
                          $timeout(function() {
                            for (var depto in $scope.rsBuildingDepartmentsData){
                              if ($scope.customer.companyDetails.idClientDepartamentFk==$scope.rsBuildingDepartmentsData[depto].idDepto){
                                $scope.customer.companyDetails.department=$scope.rsBuildingDepartmentsData[depto];
                              }
                            }
                          blockUI.stop();
                          }, 1000);
                        }else{
                          $scope.customer.update.isNotClient=false;
                          $scope.addrrSelected=true;
                        }
                      break;
                      case "3": //COMPANY CUSTOMER
                        arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.companyDetails.idProvinceFk);
                        arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.companyDetails.idLocationFk, $scope.customer.companyDetails.idProvinceFk);
                        $scope.customer.companyDetails.province = arrProvince.length==1?arrProvince[0].province:null;
                        $scope.customer.companyDetails.location = arrLocation.length==1?arrLocation[0].location:null;
                        if ($scope.customer.companyDetails.province==null){
                              form.add('El cliente '+$scope.customer.companyDetails.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                        }
                        if ($scope.customer.companyDetails.location==null){
                              form.add('El cliente '+$scope.customer.companyDetails.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                        }
                        if($scope.customer.companyDetails.idClientDepartamentFk){                          
                          $scope.customer.companyDetails.isNotClient=true;
                          $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.companyDetails.idClientDepartamentFk);
                          $timeout(function() {
                            for (var depto in $scope.rsBuildingDepartmentsData){
                              if ($scope.customer.companyDetails.idClientDepartamentFk==$scope.rsBuildingDepartmentsData[depto].idDepto){
                                $scope.customer.companyDetails.department=$scope.rsBuildingDepartmentsData[depto];
                              }
                            }
                          blockUI.stop();
                          }, 100);
                        }else{
                          $scope.customer.companyDetails.isNotClient=false;
                          $scope.addrrSelected=true;
                        }
                      break;
                    }
                      //PHONES
                      $scope.companyDetails_list_phone_contact=[];
                      $scope.companyDetails_list_phones=[];  
                      if (obj.list_phone_contact.length>0){
                        for (var key in  obj.list_phone_contact){
                          //console.log(obj.list_phone_contact[key]);
                          $scope.companyDetails_list_phone_contact.push(obj.list_phone_contact[key]);
                          $scope.companyDetails_list_phones.push(obj.list_phone_contact[key]);
                        }
                      }
                      //blockUI.message('Cargando correos del cliente '+obj.list_emails.length);
                      //MAILS
                      $scope.companyDetails_list_mails_contact=[];
                      $scope.companyDetails_list_mails=[];
                      var typeName = '';
                      if (obj.list_emails.length>0){
                        for (var key in  obj.list_emails){
                          for (var type in $scope.rsTypeOfMailsData){
                            if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                              typeName= $scope.rsTypeOfMailsData[type].descripcion;
                            }
                          }
                          $scope.companyDetails_list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                          $scope.companyDetails_list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                        }
                      }                  
                      //USERS
                      $scope.companyDetails_list_users       = [];
                      $scope.companyDetails_list_client_user = [];
                      if (obj.list_client_user.length>0){
                        for (var user in  obj.list_client_user){
                          for (var key in $scope.rsList.clientUser){
                            if ($scope.rsList.clientUser[key].idUser==obj.list_client_user[user].idUser){
                              //console.log($scope.rsList.clientUser[key]);
                              //console.log(obj.list_client_user[key]);
                              $scope.companyDetails_list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk, 'idStatusKf':$scope.rsList.clientUser[key].idStatusKf, 'statusTenantName':$scope.rsList.clientUser[key].statusTenantName});
                              $scope.companyDetails_list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk, 'idStatusKf':$scope.rsList.clientUser[key].idStatusKf, 'statusTenantName':$scope.rsList.clientUser[key].statusTenantName});                            
                            }
                          }
                        }
                      }
                      //SCHEDULE
                      $scope.companyDetails_list_schedule_details=$scope.list_schedule;
                      $scope.companyDetails_list_schedule_atention_details=[];                    
                      if (obj.list_schedule_atention.length>0){
                        for (var i = 0; i < $scope.tmpVars.companyDetails_list_schedule_atention.length; i++) {
                            //Load the data to a temp array to handle the schedule
                            $scope.companyDetails_list_schedule_atention_details.push({
                                'idScheduleAtention':$scope.tmpVars.companyDetails_list_schedule_atention[i].idScheduleAtention,
                                'idClienteFk':$scope.tmpVars.companyDetails_list_schedule_atention[i].idClienteFk, 
                                'day':$scope.tmpVars.companyDetails_list_schedule_atention[i].day, 
                                'fronAm':$scope.tmpVars.companyDetails_list_schedule_atention[i].fronAm, 
                                'toAm':$scope.tmpVars.companyDetails_list_schedule_atention[i].toAm, 
                                'fronPm':$scope.tmpVars.companyDetails_list_schedule_atention[i].fronPm, 
                                'toPm':$scope.tmpVars.companyDetails_list_schedule_atention[i].toPm});
                        }
                      }
                      //console.log($scope.list_users);
                      //var zonaInfo=$scope.getZoneNameFn($scope.customerFound.idZonaFk);
                      $scope.customer.companyDetails.zona={'n_zona':$scope.customer.companyDetails.n_zona, 'descripcion':$scope.customer.companyDetails.descripcion};
                      console.log($scope.customer.companyDetails);
                      $('#customerCompanyModalDetails').modal({keyboard: false});
                      $('#customerCompanyModalDetails').on('shown.bs.modal', function () {
                      });                    
                  break;                 
                  case "info": //ADMINISTRATION OR COMPANY CUSTOMER
                      $scope.customer.info=obj;
                      $scope.tmpVars.list_schedule_atention=obj.list_schedule_atention;
                      $scope.customer.info.billing_information_details=obj.billing_information[0];
                      var chekbDays = $scope.chekBox.row;
                      /*PUT ALL THE CHECKBOXES TO FALSE OR UNCHECKED STATE */
                      for (var key in chekbDays){
                          if (chekbDays[key]==true){
                            $scope.chekBox.row[key]=false;
                          }
                      }
                      var arrProvince  = [];
                      var arrLocation = [];                              
                      arrProvince = $scope.getCustomerProvinceNameFromIdFn($scope.customer.info.idProvinceFk);
                      arrLocation= $scope.getCustomerLocationNameFromIdFn($scope.customer.info.idLocationFk, $scope.customer.info.idProvinceFk);
                      $scope.customer.select.main.province.selected = arrProvince.length==1?{idProvince: arrProvince[0].idProvince, province: arrProvince[0].province}:undefined;
                      $scope.customer.select.main.location.selected = arrLocation.length==1?{idLocation: arrLocation[0].idLocation, location: arrLocation[0].location}:undefined;
                          if ($scope.customer.select.main.province.selected==undefined){
                              inform.add('El cliente '+$scope.customer.info.name+' No tiene asignada una provincia, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                          if ($scope.customer.select.main.location.selected==undefined){
                              inform.add('El cliente '+$scope.customer.info.name+' No tiene asignada una localidad, contacte con soporte, BSS Seguridad.',{
                              ttl:12000, type: 'info'
                              });
                          }
                      $scope.customer.info.nameAddress=$scope.customer.info.idClientDepartamentFk==null||$scope.customer.info.idClientDepartamentFk==''?$scope.customer.info.address:'';
                      $scope.customer.select.main.address.selected=$scope.customer.info.idClientDepartamentFk!=null?{address:$scope.customer.info.address}:undefined;

                      if($scope.customer.info.idClientDepartamentFk){
                        $scope.customer.info.isNotCliente=true;
                        $scope.getBuildingsDeptosByDeptoIdFn($scope.customer.info.idClientDepartamentFk);
                        $scope.customer.select.main.department=$scope.customer.info.idClientDepartamentFk;
                      }else{
                        $scope.customer.info.isNotCliente=false;
                        $scope.addrrSelected=true;
                      }
                      //blockUI.message('Cargando telefonos del cliente '+obj.list_phone_contact.length);
                      //PHONES
                      $scope.list_phone_contact=[];
                      $scope.list_phones=[];  
                      if (obj.list_phone_contact.length>0){
                        for (var key in  obj.list_phone_contact){
                          //console.log(obj.list_phone_contact[key]);
                          $scope.list_phone_contact.push(obj.list_phone_contact[key]);
                          $scope.list_phones.push(obj.list_phone_contact[key]);
                        }
                      }
                      //blockUI.message('Cargando correos del cliente '+obj.list_emails.length);
                      //MAILS
                      $scope.list_mails_contact=[];
                      $scope.list_mails=[];
                      var typeName = '';
                      if (obj.list_emails.length>0){
                        for (var key in  obj.list_emails){
                          for (var type in $scope.rsTypeOfMailsData){
                            if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                              typeName= $scope.rsTypeOfMailsData[type].descripcion;
                            }
                          }
                          $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                          $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                        }
                      }
                      //blockUI.message('Cargando horarios del cliente '+$scope.tmpVars.list_schedule_atention.length);
                      //SCHEDULE
                      for (var i = 0; i < $scope.tmpVars.list_schedule_atention.length; i++) {
                        if($scope.tmpVars.list_schedule_atention[i].day==$scope.list_schedule[i].day){
                          //Load the data to the list that will be render in the frontend
                          $scope.list_schedule[i].fronAm    = $scope.tmpVars.list_schedule_atention[i].fronAm;
                          $scope.list_schedule[i].toAm      = $scope.tmpVars.list_schedule_atention[i].toAm;
                          $scope.list_schedule[i].fronPm    = $scope.tmpVars.list_schedule_atention[i].fronPm;
                          $scope.list_schedule[i].toPm      = $scope.tmpVars.list_schedule_atention[i].toPm;
                          $scope.list_schedule[i].selected  = true;
                          //Load the data to a temp array to handle the schedule
                          $scope.list_schedule_atention.push({
                              'idScheduleAtention':$scope.tmpVars.list_schedule_atention[i].idScheduleAtention,
                              'idClienteFk':$scope.tmpVars.list_schedule_atention[i].idClienteFk, 
                              'day':$scope.tmpVars.list_schedule_atention[i].day, 
                              'fronAm':$scope.tmpVars.list_schedule_atention[i].fronAm, 
                              'toAm':$scope.tmpVars.list_schedule_atention[i].toAm, 
                              'fronPm':$scope.tmpVars.list_schedule_atention[i].fronPm, 
                              'toPm':$scope.tmpVars.list_schedule_atention[i].toPm});
                        }
                      }
                      //blockUI.message('Cargando usuarios autorizados del cliente '+obj.list_client_user.length);
                      //USERS
                      $scope.list_users       = [];
                      $scope.list_client_user = [];
                      if (obj.list_client_user.length>0){
                        for (var user in  obj.list_client_user){
                          //console.log(obj.list_client_user[key]);
                          $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser,'idClientFk': obj.list_client_user[user].idClientFk});
                          $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser,'idClientFk': obj.list_client_user[user].idClientFk});
                        }
                      }
                      $('#InfoModalCustomer').modal({backdrop: 'static', keyboard: false});
                      $('#InfoModalCustomer').on('shown.bs.modal', function () {
                      });
                      console.info($scope.customer.info);
                      $scope.enabledNextBtn();
                  break;
                  case "uploadFiles":
                    $timeout(function() {
                      $scope.customer.upload=obj;
                        $('#attachCustomerFiles').modal({backdrop: 'static', keyboard: false});
                        $('#attachCustomerFiles').on('shown.bs.modal', function () {
                        });
                      blockUI.stop();
                      $scope.customer.upload.editFileTitle=false;
                      //console.info($scope.customer.upload);
                    }, 500);
                  break;
                  case "listFiles":
                    $timeout(function() {
                      $scope.customer.files=obj;
                        $('#listCustomerFiles').modal({backdrop: 'static', keyboard: false});
                        $('#listCustomerFiles').on('shown.bs.modal', function () {
                        });
                      blockUI.stop();
                      console.info($scope.customer.files);
                    }, 500);
                  break;
                  case "adminChange":
                    $('#buildingMails').collapse('hide');
                    $('#buildingPhones').collapse('hide');
                    $('#buildingAuthUsers').collapse('hide');
                    $('.chevron-icon').removeClass('glyphicon-chevron-up');
                    $('.chevron-icon').addClass('glyphicon-chevron-down');
                    $timeout(function() {
                      blockUI.message('Cargando datos asociados cliente '+obj.ClientType);
                        $scope.list_emails=[];
                        $scope.customer.buildingSelected=obj;
                        var typeName = '';
                        if (obj.list_emails.length>0){
                          for (var key in obj.list_emails){
                            for (var type in $scope.rsTypeOfMailsData){
                              if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                                typeName= $scope.rsTypeOfMailsData[type].descripcion;
                              }
                            }
                            $scope.list_emails.push({'idClientMail':obj.list_emails[key].idClientMail, 'mailTag':obj.list_emails[key].mailTag, 'typeName':typeName, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status});                         
                          }
                        }
                        $scope.customer.buildingSelected.list_emails=[];
                        $scope.customer.buildingSelected.list_emails=$scope.list_emails;
                      blockUI.stop();
                      //console.info($scope.customer.buildingSelected); 
                    }, 1500);
                      $('#changeModalAdmin').modal({backdrop: 'static', keyboard: false});
                  break;
                  case "removeLinkedAdminData":
                    $scope.buildingOldData.list_emails=$scope.customer.buildingSelected.list_emails;
                    $scope.buildingOldData.list_phone_contact=$scope.customer.buildingSelected.list_phone_contact;
                    $scope.buildingOldData.list_client_user=$scope.customer.buildingSelected.list_client_user;
                    //EMAILS
                    for (var item1 in $scope.buildingOldData.list_emails){
                      for (var item2 in $scope.customer.currentAdmin.list_emails){
                        console.log("Mail Building: "+$scope.buildingOldData.list_emails[item1].mailContact+" / Mail Administration: "+$scope.customer.currentAdmin.list_emails[item2].mailContact);
                        if ($scope.buildingOldData.list_emails[item1].mailContact==$scope.customer.currentAdmin.list_emails[item2].mailContact && $scope.buildingOldData.list_emails[item1].idTipoDeMailFk==$scope.customer.currentAdmin.list_emails[item2].idTipoDeMailFk){
                          var objItem             = $scope.buildingOldData.list_emails;
                          var arrItem             = objItem.map(function(i){return i.idClientMail;});
                          var indexItem           = arrItem.indexOf($scope.buildingOldData.list_emails[item1].idClientMail);
                          //console.log(indexItem);
                          $scope.buildingOldData.list_emails.splice(indexItem, 1);
                        }
                      }
                    }
                    //PHONES
                    /*for (var item1 in $scope.buildingOldData.list_phone_contact){
                      for (var item2 in $scope.customer.currentAdmin.list_phone_contact){
                        if ($scope.buildingOldData.list_phone_contact[item1].phoneContact==$scope.customer.currentAdmin.list_phone_contact[item2].phoneContact && $scope.buildingOldData.list_phone_contact[item1].phoneTag==$scope.customer.currentAdmin.list_phone_contact[item2].phoneTag){
                          var objItem             = $scope.buildingOldData.list_phone_contact; 
                          var arrItem             = objItem.map(function(i){return i.idClientPhoneFk;});        
                          var indexItem           = arrItem.indexOf($scope.buildingOldData.list_phone_contact[item1].idClientPhoneFk);
                          $scope.buildingOldData.list_phone_contact.splice(indexItem, 1);
                        }
                      }
                    }*/
                    //AUTHORIZED USERS
                    for (var item1 in $scope.buildingOldData.list_client_user){
                      for (var item2 in $scope.customer.currentAdmin.list_client_user){
                        if ($scope.buildingOldData.list_client_user[item1].idUserFk==$scope.customer.currentAdmin.list_client_user[item2].idUserFk && $scope.buildingOldData.list_client_user[item1].emailUser==$scope.customer.currentAdmin.list_client_user[item2].emailUser){
                          var objItem             = $scope.buildingOldData.list_client_user; 
                          var arrItem             = objItem.map(function(i){return i.idUserFk;});        
                          var indexItem           = arrItem.indexOf($scope.buildingOldData.list_client_user[item1].idUserFk);
                          $scope.buildingOldData.list_client_user.splice(indexItem, 1);
                        }
                      }
                    }
                    console.log($scope.buildingOldData);
                  break;
                  case "linkNewAdminData":
                    $scope.buildingNewData={'observationOrderKey':'','observationSericeTecnic':'','observationCollection':'','observation':'','list_emails':[],'list_phone_contact':[],'list_client_user':[]};
                    $timeout(function() {
                      //EMAILS
                      for (var key in $scope.buildingOldData.list_emails){
                        for (var type in $scope.rsTypeOfMailsData){
                          if ($scope.rsTypeOfMailsData[type].idTipoMail==$scope.buildingOldData.list_emails[key].idTipoDeMailFk){
                            typeName= $scope.rsTypeOfMailsData[type].descripcion;
                          }
                        }
                        $scope.buildingNewData.list_emails.push({'idClientMail':$scope.buildingOldData.list_emails[key].idClientMail, 'mailTag':$scope.buildingOldData.list_emails[key].mailTag, 'typeName':typeName, 'mailContact':$scope.buildingOldData.list_emails[key].mailContact, 'idTipoDeMailFk': $scope.buildingOldData.list_emails[key].idTipoDeMailFk, 'status':$scope.buildingOldData.list_emails[key].status});                         
                      }
                      for (var key in $scope.customer.newAdmin.list_emails){
                        for (var type in $scope.rsTypeOfMailsData){
                          if ($scope.rsTypeOfMailsData[type].idTipoMail==$scope.customer.newAdmin.list_emails[key].idTipoDeMailFk){
                            typeName= $scope.rsTypeOfMailsData[type].descripcion;
                          }
                        }
                        $scope.buildingNewData.list_emails.push({'idClientMail':$scope.customer.newAdmin.list_emails[key].idClientMail, 'mailTag':$scope.customer.newAdmin.list_emails[key].mailTag, 'typeName':typeName, 'mailContact':$scope.customer.newAdmin.list_emails[key].mailContact, 'idTipoDeMailFk': $scope.customer.newAdmin.list_emails[key].idTipoDeMailFk, 'status':$scope.customer.newAdmin.list_emails[key].status});                         
                      }
                      //PHONES
                      /*for (var phones in $scope.buildingOldData.list_phone_contact){
                        $scope.buildingNewData.list_phone_contact.push($scope.buildingOldData.list_phone_contact[phones])
                      }                    
                      for (var phones in $scope.customer.newAdmin.list_phone_contact){
                        $scope.buildingNewData.list_phone_contact.push($scope.customer.newAdmin.list_phone_contact[phones])
                      }*/
                      //AUTHORIZED USERS
                      for (var users in $scope.buildingOldData.list_client_user){
                        $scope.buildingNewData.list_client_user.push($scope.buildingOldData.list_client_user[users])
                      }                    
                      for (var users in $scope.customer.newAdmin.list_client_user){
                        $scope.buildingNewData.list_client_user.push($scope.customer.newAdmin.list_client_user[users])
                      }
                      $scope.buildingNewData.billing_information      = $scope.customer.buildingSelected.billing_information[0];
                      $scope.buildingNewData.observationOrderKey      = $scope.customer.buildingSelected==''?$scope.customer.newAdmin.observationOrderKey:$scope.customer.buildingSelected.observationOrderKey;
                      $scope.buildingNewData.observationSericeTecnic  = $scope.customer.buildingSelected==''?$scope.customer.newAdmin.observationSericeTecnic:$scope.customer.buildingSelected.observationSericeTecnic;
                      $scope.buildingNewData.observationCollection    = $scope.customer.buildingSelected==''?$scope.customer.newAdmin.observationCollection:$scope.customer.buildingSelected.observationCollection;
                      $scope.buildingNewData.observation              = $scope.customer.buildingSelected==''?$scope.customer.newAdmin.observation:$scope.customer.buildingSelected.observation;                    
                      console.log($scope.buildingNewData);
                      $scope.confirmAdminDataChange=true;
                    }, 500);
                  break;
                  case "updateBuildingAdmin":
                    $('#changeModalAdmin').modal('hide');
                    $timeout(function() {
                    blockUI.message('Actualizando datos del Edificio '+obj.address);
                      $scope.customer.update=obj;
                      $scope.customer.update.list_emails                      = [];
                      $scope.customer.update.list_client_user                 = [];
                      $scope.customer.update.billing_information              = [];
                      $scope.customer.update.billing_information              = $scope.buildingNewData.billing_information;
                      $scope.customer.update.billing_information.nameAddress  = $scope.buildingNewData.billing_information.businessAddress;
                      $scope.customer.update.idClientAdminFk                  = $scope.customer.newAdmin.idClient;
                      $scope.customer.update.list_emails                      = $scope.buildingNewData.list_emails;
                      $scope.customer.update.list_client_user                 = $scope.buildingNewData.list_client_user;
                      $scope.customer.update.observationOrderKey              = $scope.buildingNewData.observationOrderKey;
                      $scope.customer.update.observationSericeTecnic          = $scope.buildingNewData.observationSericeTecnic;
                      $scope.customer.update.observationCollection            = $scope.buildingNewData.observationCollection;
                      $scope.customer.update.observation                      = $scope.buildingNewData.observation;
                      $scope.customer.update.isBillingInformationEmpty        = obj.billing_information.length==0?1:0;
                      //Send the customer data to the addcustomer service
                      console.log($scope.customer.update);
                    }, 2000); 
                    $timeout(function() {
                      $scope.updateCustomerFn($scope.customer.update);
                      blockUI.stop();  
                    }, 3500);
                  break;
                  case "securityCode":
                    $timeout(function() {
                      $scope.generateSecurityCodeFn(obj);
                    }, 2000);
                    blockUI.stop();
                  break;
                  case "enableInitialKeys":
                    $('#enableInitialKeys').modal('toggle');  
                    blockUI.stop();
                  break;
                  default:
                    console.info("-------------------------");
                    console.info("    showCustomerFields   ");
                    console.info("-------------------------");
              }
            }
          /******************************
          *     UPDATE THE CUSTOMER     *
          ******************************/
            $scope.updateCustomerFn = function(client){
              blockUI.start('Actualizando cliente.');
              CustomerServices.updateCustomer(client).then(function(response){
                  //console.log(response);
                  if(response.status==200){
                    $timeout(function() {
                      blockUI.message('Cliente Actualizado satisfactoriamente.');
                      console.log("Customer Successfully Updated");
                      inform.add('Cliente Actualizado satisfactoriamente. ',{
                            ttl:5000, type: 'success'
                      });
                      $('#UpdateModalCustomer').modal('hide');
                    }, 500);
                    //$scope.getAdminCustomersListFn();
                    //$scope.getCompaniesCustomersListFn();
                  }else if(response.status==404){
                    console.log("not found, contact administrator");
                    inform.add('Error: [404] Contacta al area de soporte. ',{
                          ttl:5000, type: 'danger'
                    });
                    //$('#RegisterModalCustomer').modal('hide');
                  }else if(response.status==500){
                    console.log("Customer not Created, contact administrator");
                    inform.add('Error: [500] Contacta al area de soporte. ',{
                          ttl:5000, type: 'danger'
                    });
                    //$('#RegisterModalCustomer').modal('hide');
                  }
                  $timeout(function() {
                    blockUI.message('Actualizando listado de clientes.');
                  }, 1500);
                  $timeout(function() {
                    if($scope.isUpdateCustomerRegistered || client.isNotCliente=='0'){
                      $scope.switchCustomersFn('dashboard','', 'registered')
                    }else{
                      $scope.switchCustomersFn('dashboard','', 'unregistered')
                    }
                    blockUI.stop();
                  }, 2000);
                  $scope.isUpdateCustomerRegistered=null;
                  $scope.isArrChanged=false;
                  //console.log($scope.rsLocations_API_Data);
              });
            };
          /******************************
          *    UTIL FOR CUSTOMER DATA   *
          ******************************/    
              $scope.getCustomerProvinceNameFromIdFn = function(ProvinceId){
                var arrProvinceSelect = [];
                for (var key in  $scope.rsStatesData){
                    if ( $scope.rsStatesData[key].idProvince==ProvinceId){
                        arrProvinceSelect.push({'idProvince':$scope.rsStatesData[key].idProvince, 'province':$scope.rsStatesData[key].province});
                        break;
                    }
                }
                //console.log(arrProvinceSelect);
                return arrProvinceSelect;
              }
              $scope.getCustomerLocationNameFromIdFn = function(LocationId, ProvinceId){
                var arrLocationSelect = [];
                for (var key in  $scope.rsLocations_All2){
                    if ( $scope.rsLocations_All2[key].idLocation==LocationId && $scope.rsLocations_All2[key].idProvinceFK==ProvinceId){
                        arrLocationSelect.push({'idLocation':$scope.rsLocations_All2[key].idLocation, 'location':$scope.rsLocations_All2[key].location});
                        break;
                    }
                }
                //console.log(arrLocationSelect);
                return arrLocationSelect;
              }
              $scope.getCustomerBusinessNameByIdFnOld = function(clientId){
                //console.log("getCustomerBusinessNameByIdFn: "+clientId);
                var arrCompanySelect = [];
                //console.log($scope.rsCustomerAdminListData);
                for (var key in  $scope.rsCustomerAdminListData){
                    if ($scope.rsCustomerAdminListData[key].idClient==clientId){
                        arrCompanySelect.push({'idClient':$scope.rsCustomerAdminListData[key].idClient, 'businessName':$scope.rsCustomerAdminListData[key].businessName});
                        break;
                    }
                }
                //console.log(arrCompanySelect);
                return arrCompanySelect;
              }
              $scope.getCustomerBusinessNameByIdFn = function(clientId){
                //console.log("getCustomerBusinessNameByIdFn: "+clientId);
                var arrCompanySelect = [];
                if (clientId!=undefined){
                  CustomerServices.getCustomersById(clientId).then(function(response){
                    if(response.status==200){
                      //console.log(response.data);
                      arrCompanySelect.push({'idClient':response.data.idClient, 'businessName':response.data.businessName});
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
              $scope.getCustomerDataByIdFn = function(clientId){
                //console.log("getCustomerBusinessNameByIdFn: "+clientId);
                var arrCompanySelect = [];
                //console.log($scope.rsCustomerListData);
                CustomerServices.getCustomersById(clientId).then(function(response){
                  if(response.status==200){
                    //console.log(response.data);
                    arrCompanySelect.push(response.data);
                  }
                });
                //console.log(arrCompanySelect);
                return arrCompanySelect;
              }
              $scope.getZoneNameFn = function(zoneId){
                //console.log("getZoneNameFn: "+zoneId);
                $scope.zoneInfo={}
                //console.log($scope.rsZonesData);
                for (var key in  $scope.rsZonesData){
                    if ($scope.rsZonesData[key].idZona==zoneId){
                        $scope.zoneInfo.n_zona=$scope.rsZonesData[key].n_zona;
                        $scope.zoneInfo.descripcion=$scope.rsZonesData[key].descripcion;
                        break;
                    }
                }
                //console.log($scope.zoneInfo);
                return $scope.zoneInfo;
              }
          /**************************************************/
          /**************************************************
          *                                                 *
          *       GET LIST OF CUSTOMER BY CUSTOMER ID       *
          *                                                 *
          **************************************************/
              $scope.listOffices=[];
              $scope.getLisOfCustomersByIdFn2 = function(obj){
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
                "idClientTypeFk":"",
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
            $scope.getCustomerLisServiceFn2 = function(searchFilter, isNotCliente, idClientTypeFk, isInDebt, start, limit, strict){
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
            $scope.searchCustomerFound=false;
            $scope.select={'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined};
            $scope.findCustomerFn=function(string, typeClient, strict){
                if(event.keyCode === 8 || event.which === 8){
                    console.log(event.which);
                    $scope.buildingList=[];
                    $scope.ListDpto=[];
                    $scope.sysSubContent  = "";
                    //$scope.select.admins.selected=undefined;
                    //$scope.select.buildings.selected=undefined;
                }else if(event.keyCode === 1 || event.which === 1 || event.keyCode === 13 || event.which === 13){
                    console.log("Search:");
                    console.log("string: "+string);
                    console.log("typeClient: "+typeClient);
                    console.log("strict: "+strict);
                    $scope.buildingList=[];
                    $scope.ListDpto=[];
                    $scope.sysSubContent  = "";
                    //$scope.select.admins.selected=undefined;
                    //$scope.select.buildings.selected=undefined;
                    var output=[];
                    var i=0;
                    if (string!=undefined && string!="" && ($scope.customer.new.idClientTypeFk=='2'||$scope.customer.new.idClientTypeFk=='4' || ($scope.customer.update.idClientTypeFk=='2'||$scope.customer.update.idClientTypeFk=='4'))){
                        $scope.customerFound={};
                        $scope.getCustomerLisServiceFn2(string, "0", null, null, 0, 10, strict).then(function(response) {
                            if(response.status==undefined){
                              $scope.listCustomerFound = response.customers;
                              //$scope.pagination.totalCount = response.customers.length;
                              console.info($scope.listCustomerFound);
                            }else if(response.status==404){
                              $scope.customerFound=null;
                              $scope.customerSearch.address = "";
                              $scope.customer.select.main.address.selected=undefined;
                              $scope.customer.select.company.selected=undefined;
                              $scope.listCustomerFound = [];
                              //$scope.pagination.totalCount  = 0;
                            } 
                        }, function(err) {
                            $scope.listCustomerFound = [];
                            //$scope.pagination.totalCount  = 0;
                        });
                    }else if (string!=undefined && string!="" && ($scope.customer.new.idClientTypeFk!='2' && $scope.customer.new.isNotClient || $scope.customer.update.idClientTypeFk!='2' && $scope.customer.update.isNotClient)){
                      $scope.customerFound={};
                      $scope.getCustomerLisServiceFn2(string, "0", "2", null, 0, 10, strict).then(function(response) {
                          if(response.status==undefined){
                            $scope.listCustomerFound = response.customers;
                            //$scope.pagination.totalCount = response.customers.length;
                            console.info($scope.listCustomerFound);
                          }else if(response.status==404){
                            $scope.customerFound=null;
                            $scope.customerSearch.address = "";
                            $scope.customer.select.main.address.selected=undefined;
                            $scope.customer.select.company.selected=undefined;
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
                $scope.customerFound=obj;
                if (obj.idClientTypeFk=="1" || obj.idClientTypeFk=="3"){
                    $scope.customerSearch.address = obj.name;
                    $scope.customer.select.company.selected = obj;
                    $timeout(function() {
                      $scope.getCompanyDataFn($scope.customer.select.company.selected)
                  }, 700);
                }else if ($scope.customer.new.idClientTypeFk!='2' && obj.idClientTypeFk=="2" || obj.idClientTypeFk=="4"){
                  $scope.customerSearch.address = obj.name;
                  $scope.customer.select.main.address.selected = obj;
                  $scope.getBuildingsDeptosFn($scope.customer.select.main.address.selected.idClient); 
                  $scope.enabledNextBtn(); 
                  $scope.customer.select.main.department='';
                }else{
                  $scope.customerFound=null;
                  $scope.customerSearch.address = "";
                  $scope.customer.select.company.selected=undefined;
                  $scope.customer.select.main.address.selected=undefined;
                  inform.add('Cliente '+obj.name+' ('+obj.ClientType+'), incorrecto.',{
                    ttl:5000, type: 'warning'
                });
                }
                $scope.listCustomerFound=[];
            }
          /******************************
          *     UPDATE THE CUSTOMER     *
          ******************************/
            $scope.generateSecurityCodeFn = function(client){
              CustomerServices.generateCustomerSecurityCode(client.idClient).then(function(data){
                  $scope.rsJsonData = data;
                  //console.log($scope.rsJsonData);
                  if($scope.rsJsonData.status==200){
                    console.log("Customer Security Code Successfully Generated");
                    inform.add('Codigo de Seguridad ha sido generado con exito. ',{
                          ttl:2000, type: 'success'
                    });
                  }else if($scope.rsJsonData.status==404){
                    console.log("error, contact administrator");
                    inform.add('Error: [404] Contacta al area de soporte. ',{
                          ttl:2000, type: 'danger'
                    });
                  }else if($scope.rsJsonData.status==500){
                    console.log("Customer not Created, contact administrator");
                    inform.add('Error: [500] Contacta al area de soporte. ',{
                          ttl:2000, type: 'danger'
                    });
                  }
                  blockUI.start('');
                  $timeout(function() {
                    blockUI.message('Actualizando datos del cliente: '+client.name);
                  }, 1000);
                  $timeout(function() {
                    //$scope.switchCustomersFn('dashboard','', 'registered');
                  }, 1500);
                  $timeout(function() {
                    $scope.getCustomersByNameFn($scope.customerSearch.searchFilter, $scope.customerSearch.isInDebt, $scope.customerSearch.strict);
                  }, 2500);
                  $timeout(function() {
                    $scope.getCustomersByIdFn('details_customer', client.idClient, 'show');
                    blockUI.stop();
                  }, 3500);
              });
            };
          /**************************************************
          *                                                 *
          *                SET CLIENT IN DEBT               *
          *                                                 *
          **************************************************/
            $scope.setClientInDebtFn = function(obj){
              //console.log(obj);
              if (obj.IsInDebt==1){
                blockUI.start('Inhabilitando cliente: '+obj.name);
              }else{
                blockUI.start('Habilitando cliente: '+obj.name);
              }
              CustomerServices.setClientInDebt(obj).then(function(response){
                  console.log(response);
                  if(response.status==200){
                      if (obj.IsInDebtTmp){
                        inform.add('Cliente inhabilitado satisfactoriamente.',{
                            ttl:5000, type: 'warning'
                        });
                      }else{
                        inform.add('Cliente habilitado satisfactoriamente.',{
                            ttl:5000, type: 'success'
                        });
                      }
                      $timeout(function() {
                        blockUI.message('Actualizando datos del cliente: '+obj.name);
                      }, 1500);
                      $timeout(function() {
                        $scope.getCustomersByNameFn($scope.customerSearch.searchFilter, $scope.customerSearch.isInDebt, $scope.customerSearch.strict);
                      }, 2500);
                      $timeout(function() {
                        $scope.getCustomersByIdFn('details_customer', obj.idClient, 'show');
                        blockUI.stop();
                      }, 3500);
                      
                  }
              });
            }
          /**************************************************
          *                                                 *
          *         SET CLIENT STOCK IN BUILDING            *
          *                                                 *
          **************************************************/
            $scope.setClientHasStockInBuildingFn = function(obj){
              console.log(obj);
              CustomerServices.setClientHasStockInBuilding(obj).then(function(response){
                  console.log(response);
                  if(response.status==200){
                      if (obj.isStockInBuilding && obj.isStockInBuildingTmp){
                        inform.add('Stock en Edificio habilitado satisfactoriamente.',{
                            ttl:5000, type: 'success'
                        });
                      }else{
                        inform.add('Stock en Edificio deshabilitado satisfactoriamente.',{
                            ttl:5000, type: 'warning'
                        });
                      }
                      $timeout(function() {
                          blockUI.message('Actualizando datos del cliente: '+obj.name);
                          blockUI.stop();
                      }, 1500);
                      
                  }
              });
            }
          /**************************************************
          *                                                 *
          *         SET CLIENT STOCK IN OFFICE              *
          *                                                 *
          **************************************************/
            $scope.setClientHasStockInOfficeFn = function(obj){
                console.log(obj);
                CustomerServices.setClientHasStockInOffice(obj).then(function(response){
                    console.log(response);
                    if(response.status==200){
                        if (obj.isStockInOffice  && obj.isStockInOfficeTmp){
                          inform.add('Stock en Oficina habilitado satisfactoriamente.',{
                              ttl:5000, type: 'success'
                          });
                        }else{
                          inform.add('Stock en Oficina deshabilitado satisfactoriamente.',{
                              ttl:5000, type: 'warning'
                          });
                        }
                        $timeout(function() {
                        blockUI.message('Actualizando datos del cliente: '+obj.name);
                        blockUI.stop();
                        }, 1500);
                    }
                });
            }
      /**************************************************
      *                                                 *
      *                UPLOAD CUSTOMER FILES            *
      *                                                 *
      **************************************************/
            $scope.filesUploadList=[];
            $scope.fileList=[];
            $scope.fileListTmp=[];
            $scope.fileName=null;
            $scope.invalidTypeOf=false;
            $scope.fileTypeOf=null;
            $scope.isFileExist = null;
            /**************************************
            *             IMAGE VIEWER            *
            **************************************/
              $scope.openLightboxModal = function (arrObj, index) {
                Lightbox.openModal(arrObj, index);
              }
            /**************************************
            *               PDF VIEWER            *
            **************************************/
              $scope.openPDFModalViewer = function (obj) {
                $('#pdfViewerModal').modal('show');
                $('#pdfViewerModal').on('shown.bs.modal', function () {
                  PDFObject.embed(serverHost+obj.urlFile, "#pdfobject");
                });            
                
              }
            /**************************************
            *             DOWNLOAD FILE           *
            **************************************/
              $scope.downloadFile = function (obj) {
                var a = document.createElement('a');
                a.href = obj.urlFile;
                a.download = obj.title;
                a.click();
                a.remove();
              };
            /**************************************
            *         LOAD FILES TO UPLOAD        *
            **************************************/
              $scope.loadFilesFn = function(e) {
                $scope.fileListTmp=[];
                var list = e;
                $scope.$apply(function($scope) {
                for(var i=0;i<list.files.length;i++){
                  file = list.files[i];
                  var fileName=file.name.replace(/ /g,"_");
                  var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                  if('|jpg|png|jpeg|bmp|gif|pdf|docx|xlsx|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|'.indexOf(type) !== -1){
                    var cleanFile = new File([file], fileName, {type: file.type, lastModified: file.lastModified, size: file.size});
                    //console.log(cleanFile);
                    $scope.fileListTmp.push(cleanFile);
                  }else{
                      $scope.fileName=file.name;
                      $scope.fileTypeOf=file.type.slice(file.type.lastIndexOf('/') + 1)
                      $scope.invalidTypeOf=true;
                      inform.add('El archivo: '+file.name+' es de tipo invalido. ',{
                        ttl:4000, type: 'warning'
                      });
                      console.log(file.name + " with type "+file.type+" is not supported");
                    $("#uploadCustomerfiles").val(null);
                  }
                }
                //console.log($scope.fileListTmp);
                $scope.processFileListFn();
                });
              }
            /**************************************
            *          UPLOAD SINGLE FILE         *
            **************************************/
              $scope.uploadSingleFile = function(item){
                for (var key in $scope.filesUploadList){
                  if ($scope.filesUploadList[key].name==item.name && $scope.filesUploadList[key].type==item.type){
                    var file      =  $scope.filesUploadList[key];
                    var fileTitle  =  item.fileTitle==''?'':item.fileTitle.replace(/ /g,"_");;
                    break;
                  }
                }
                //SEND DATA TO THE UPLOAD SERVICE
                $scope.uploadFilesFn(file, $scope.customer.upload.idClient, fileTitle, item)
                blockUI.start('');
                $timeout(function() {
                  blockUI.message('Actualizando listado de clientes.');
                }, 1000);
                $timeout(function() {
                  $scope.switchCustomersFn('dashboard','', 'registered')
                  blockUI.stop();
                }, 1500);
              }
            /**************************************
            *          UPLOAD ALL FILES           *
            **************************************/
              $scope.uploadAllFiles = function(fileList){
                for (var item in fileList){
                  //console.log(fileList[item]);
                  if (fileList[item].uploadStatus==false){
                    for (var key in $scope.filesUploadList){
                      if ($scope.filesUploadList[key].name==fileList[item].name && $scope.filesUploadList[key].type==fileList[item].type){
                        var file      =  $scope.filesUploadList[key];
                        var fileTitle  =  fileList[item].fileTitle==''?'':fileList[item].fileTitle.replace(/ /g,"_");;
                      //SEND DATA TO THE UPLOAD SERVICE
                      $scope.uploadFilesFn(file, $scope.customer.upload.idClient, fileTitle, fileList[item])
                      }
                    }
                  }
                }
                blockUI.start('');
                $timeout(function() {
                  blockUI.message('Actualizando listado de clientes.');
                }, 1000);
                $timeout(function() {
                  $scope.switchCustomersFn('dashboard','', 'registered')
                  blockUI.stop();
                }, 1500);
              }
            /**************************************
            *          REMOVE SINGLE FILE         *
            **************************************/
              $scope.removeSingleFile = function(index, obj){
                //console.log(index);
                $scope.filesUploadList.splice(index, 1);
                $scope.fileList.splice(index, 1);
                  inform.add("Archivo: "+obj.name+" ha sido removido correctamente.",{
                    ttl:5000, type: 'success'
                  });            
              }
            /**************************************
            *            REMOVE FILE LIST         *
            **************************************/
              $scope.clearFilesQueue = function(opt){
                $scope.filesUploadList=[];
                $scope.fileList=[];
                if(opt==null || opt==undefined){
                  inform.add("Todos los archivos han sido removidos de la lista correctamente.",{
                    ttl:5000, type: 'success'
                  });
                }
              }
            /**************************************
            *            UPLOAD FILES             *
            **************************************/
              $scope.uploadFilesFn = function(file, idClient, fileTitle, item){
                $scope.uploadCustomerData={};
                CustomerServices.uploadCustomerFiles(file, idClient, fileTitle).then(function(rsupload){
                  //console.log(rsupload);
                  if(rsupload.status==200){
                    $scope.uploadCustomerData.idClient = idClient;
                    $scope.uploadCustomerData.urlFile  = rsupload.data.dir+rsupload.data.filename;
                    $scope.uploadCustomerData.name     = rsupload.data.filename;
                    $scope.uploadCustomerData.type     = rsupload.data.type;
                    //console.log($scope.uploadCustomerData);
                    CustomerServices.addUploadedCustomerFile($scope.uploadCustomerData).then(function(response){
                      if(response.status==200){
                        var fileName=item.fileTitle==''?item.name:item.fileTitle;
                        inform.add('Archivo '+fileName+' subido satisfactoriamente. ',{
                              ttl:2000, type: 'success'
                        });                    
                        item.uploadStatus=true;
                        //$scope.getCustomerListFn("",1);
                      }else if(response.status==404){
                      console.log("not found, contact administrator");
                      inform.add('Error: [404] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                      });
                      //$('#RegisterModalCustomer').modal('hide');
                      }else if(response.status==500){
                        console.log("file uploaded not added into the db, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                              ttl:2000, type: 'danger'
                        });
                        item.uploadStatus=null;
                        //$('#RegisterModalCustomer').modal('hide');
                      }
                    });
                  }
                });
              }
            /**************************************
            *          DELETE SINGLE FILE         *
            **************************************/
              $scope.deleteSingleFile = function(file){
                var idClient = $scope.customer.files.idClient;
                //SEND DATA TO THE DELETE FILE SERVICE
                $scope.deleteFilesFn(file);
                blockUI.start('');
                $timeout(function() {
                  blockUI.message('Actualizando listado de clientes.');
                }, 1000);
                $timeout(function() {
                  $scope.switchCustomersFn('dashboard','', 'registered');
                  $scope.getCustomerByIdFn(idClient);
                  blockUI.stop();
                }, 1500);
              }          
            /**************************************
            *           DELETED FILES             *
            **************************************/
              $scope.deleteFilesFn = function(file){
                CustomerServices.deleteCustomerFiles(file.title).then(function(rsdeletedFile){
                  //console.log(rsdeletedFile);
                  if(rsdeletedFile.status==200){
                    CustomerServices.deleteUploadedCustomerFile(file.idClientFiles).then(function(response){
                      console.log(response);
                      if(response.status==200){
                        var fileName=file.title;
                        inform.add('Archivo '+fileName+' eliminado satisfactoriamente. ',{
                              ttl:2000, type: 'success'
                        });
                        
                      }else if(response.status==404){
                      console.log("not found, contact administrator");
                      inform.add('Error: [404] Contacta al area de soporte. ',{
                            ttl:2000, type: 'danger'
                      });
                      //$('#RegisterModalCustomer').modal('hide');
                      }else if(response.status==500){
                        console.log("file uploaded not added into the db, contact administrator");
                        inform.add('Error: [500] Contacta al area de soporte. ',{
                              ttl:2000, type: 'danger'
                        });
                        //$('#RegisterModalCustomer').modal('hide');
                      }
                    });
                  }
                });
              }
            /**************************************
            *             SET FILENAME            *
            **************************************/
              $scope.editItem = function(item) {
                $('#editItemTitleModal').modal({backdrop: 'static', keyboard: false});
                angular.element(document.getElementById("editItemTitleModal")).scope().item = {};
                $('#editItemTitleModal').on('shown.bs.modal', function () {
                  angular.element(document.getElementById("editItemTitleModal")).scope().item = item;
                  $("#fileTitle").focus();
                });
              };
              $scope.saveItem = function(item) {
                $('#editItemTitleModal').modal('hide');
              }
            /**************************************
            *   PROCESS FILE LIST TO SET PREVIEW  *
            **************************************/
              $scope.processFileListFn = function(){
                for(var i=0;i<$scope.fileListTmp.length;i++){
                  var file = $scope.fileListTmp[i];
                  if ($scope.fileList.length>0){
                      for (var key in $scope.fileList){
                        if ($scope.fileList[key].name==file.name && $scope.fileList[key].type==file.type){       
                            inform.add('El archivo: '+file.name+' ya se encuentra en la lista. ',{
                              ttl:4000, type: 'warning'
                            }); 
                            $scope.isFileExist=true;
                          break;
                        }else{
                            console.log("File isn't loaded already!!")
                            $scope.isFileExist=false; 
                        }
                      }
                  }else{
                    $scope.isFileExist=false;
                  }
                  if (!$scope.isFileExist){
                    $scope.setPreviewBeforeUploadFile(file);
                    $scope.invalidTypeOf=false;
                  }
                }            
              }            
            /**************************************
            *     PREVIEW IMAGE BEFORE UPLOAD     *
            **************************************/
              $scope.setPreviewBeforeUploadFile = function (file){
                //console.info(file);
                $scope.invalidTypeOf=false;
                var reader = new FileReader();
                    reader.onload = function(event) {
                        var src = event.target.result;
                        $scope.$apply(function($scope) {
                          $scope.filesUploadList.push(file);
                          $scope.fileList.push({'name':file.name,'size':file.size,'type':file.type,'src':src,'lastModified':file.lastModified, 'uploadStatus':false, 'fileTitle':''});
                        });
                        //console.log($scope.fileList);
                    }
                    reader.readAsDataURL(file);
                    $("#uploadCustomerfiles").val(null);
              }
        /**************************************************/

          $scope.tmpAddres = {'province':{},'location':{}};
        /**************************************************
        *                                                 *
        *          GET CURRENT ADDR/LOCAT VALUE           *
        *                                                 *
        **************************************************/
            $scope.getCurrentAddrVal = function(province, location){

                  $scope.tmpAddres.province=province;
                  //'idProvince': $scope.tmpAddres.province.idProvince, 'province': $scope.tmpAddres.province.province;
                  
                  $scope.tmpAddres.location=location;
                  //'idLocation': $scope.tmpAddres.location.idLocation, 'location': $scope.tmpAddres.location.location;

              //console.log($scope.tmpAddres);
            }
        /**************************************************
        *                                                 *
        *        GET CURRENT COMPANY DATA & LOAD          *
        *                                                 *
        **************************************************/
            $scope.getCompanyDataFn = function(obj){
              blockUI.start('Cargando datos de la de Administracion '+obj.name);
                  console.log(obj);
                if (obj){
                    var typeName = '';
                    $scope.customer.companyData = obj;
                    //MAILS
                    $scope.list_mails_contact=[];
                    $scope.list_mails=[];
                    var typeName = '';
                    if (obj.list_emails.length>0){
                      $timeout(function() {
                      for (var key in  obj.list_emails){
                        for (var type in $scope.rsTypeOfMailsData){
                          if ($scope.rsTypeOfMailsData[type].idTipoMail==obj.list_emails[key].idTipoDeMailFk){
                            typeName= $scope.rsTypeOfMailsData[type].descripcion;
                          }
                        }
                        //console.log(obj.list_emails[key]);
                        $scope.list_mails_contact.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                        $scope.list_mails.push({'idClientMail':obj.list_emails[key].idClientMail, 'idClientFk': obj.list_emails[key].idClientFk, 'mailTag':obj.list_emails[key].mailTag, 'mailContact':obj.list_emails[key].mailContact, 'idTipoDeMailFk': obj.list_emails[key].idTipoDeMailFk, 'status':obj.list_emails[key].status, 'typeName':typeName});
                      }
                        blockUI.message('Correos');
                      }, 1500);                
                    }else{
                      console.log("No Mails Found!!");
                    }
                    //USERS
                    $scope.list_users   = [];
                    if (obj.list_client_user.length>0){
                      $timeout(function() {  
                      for (var user in  obj.list_client_user){
                        //console.log(obj.list_client_user[user]);
                        $scope.list_client_user.push({'idUserFk':obj.list_client_user[user].idUser});
                        $scope.list_users.push({'idUserFk':obj.list_client_user[user].idUser, 'fullNameUser':obj.list_client_user[user].fullNameUser});
                      }
                      blockUI.message('Usuarios Autorizados');
                      },2500);
                    }else{
                      console.log("No Auth User Found!!");
                    }
                    //console.log($scope.customer.companyData);
                    var addrArr  = [];
                    var locatArr = [];
                    addrArr  = $scope.getCustomerProvinceNameFromIdFn($scope.customer.companyData.billing_information[0].idProvinceBillingFk);
                    locatArr = $scope.getCustomerLocationNameFromIdFn($scope.customer.companyData.billing_information[0].idLocationBillingFk, $scope.customer.companyData.billing_information[0].idProvinceBillingFk);
                  $timeout(function() {
                    //console.log(addrArr);
                    //console.log(locatArr);
                    $scope.customer.companyData.provinceName  = addrArr[0].province;
                    $scope.customer.companyData.locationName  = locatArr[0].location;
                    blockUI.message('Dirección de Facturacion');
                  }, 3500);
                  $timeout(function() {
                    blockUI.stop();
                  }, 4000);
                  if ($scope.customer.new.idClientTypeFk==4){
                    $timeout(function() {
                      $scope.list_phone_contact=[];
                      $scope.list_phones=[];
                      /*Load phones list contacts */
                      if (obj.list_phone_contact.length>0){
                        for (var key in  obj.list_phone_contact){
                          console.log(obj.list_phone_contact[key]);
                          $scope.list_phone_contact.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                          $scope.list_phones.push({'phoneTag':obj.list_phone_contact[key].phoneTag, 'phoneContact':obj.list_phone_contact[key].phoneContact});
                        }
                      }else{
                        console.log("No Phones Found!!");
                      }
                      blockUI.message('Telefonos');
                    },1500);
                    $timeout(function() {
                        if($scope.isNewCustomer){
                          $scope.customer.new.billing_information.businessNameBilling    = $scope.customer.companyData.businessName;
                          $scope.customer.new.billing_information.cuitBilling            = $scope.customer.companyData.CUIT;
                        }else{
                          $scope.customer.update.billing_information.businessNameBilling    = $scope.customer.companyData.businessName;
                          $scope.customer.update.billing_information.cuitBilling            = $scope.customer.companyData.CUIT;
                        }
                        $scope.customer.select.payment.province.selected               = {idProvince: addrArr[0].idProvince, province: addrArr[0].province};
                        $scope.customer.select.payment.location.selected               = {idLocation: locatArr[0].idLocation, location: locatArr[0].location};
                        $scope.customer.new.billing_information.idTypeTaxFk            = $scope.customer.companyData.billing_information[0].idTypeTax;
                    blockUI.message('Datos de Facturacion');
                    },3000);
                  }
                }else{
                  //console.log("erasing companyData");
                  $scope.customer.companyData={};
                }
            }   
});