var moduleManageUsers = angular.module("module.ManageUsers", ["tokenSystem", "services.User" , "ngSanitize", "ui.select"]);



moduleManageUsers.controller('ManageUserCtrls', function($scope, inform, $rootScope, $location, $http, blockUI, inputService, userServices, $timeout, tokenSystem, serverHost, serverBackend, $window){
  $scope.redirectSuccessfull = false;
  $scope.locationHref=window.location.href;
  //console.log($scope.locationHref);
  //console.log(serverHost+serverBackend);
  $scope.counT  =5;
  $scope.redirect ="/login";
  tokenSystem.destroyTokenStorage(4);
  $scope.sysToken             = tokenSystem.getTokenStorage(1);
  $scope.sysLoggedUser        = tokenSystem.getTokenStorage(2);
  $scope.sysLoggedUserModules = tokenSystem.getTokenStorage(6);
  $scope.regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  
  $scope.sysConfig = function(val1, val2, fnAction){
    $scope.sysReg={};
    $scope.companyFound=false;
    $scope.filterCompanyKf.selected           = undefined;
    $scope.filterAddressKf.selected           = undefined;
    switch (val1){
      /*CUSTOMER USERS*/
      case "customers":
        $scope.getUserLists();   /* New Function using angular Services: userServices.userLists*/
        switch (val2){
            case "user":
              $scope.getAllAddress();
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";
                  $scope.loadPagination($scope.rsList.clientUser, "idUser", "7");
                  $scope.sysContent = 'user';
                break;
                case "openW":
                  $('#RegisterModalUser').modal('toggle');
                break;
                default:
              }
            break;
            case "tenant":
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";
                  $scope.loadPagination($scope.rsList.tenants, "idUser", "7");
                  $scope.sysContent = 'tenant';
                break;
                case "openW":
                  $('#RegisterModalUser').modal('toggle');
                break;
                default:
              }
            break;
            case "att":
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";  
                  $scope.loadPagination($scope.rsList.attendants, "idUser", "7");
                  $scope.sysContent = 'att';
                break;
                case "openW":
                  $('#RegisterModalUser').modal('toggle');
                break;
                default:
              }
            break;
            case "company":
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";
                  $scope.loadPagination($scope.listCompany, "idCompany", "7");
                  $scope.sysContent = 'company';
                break;
                default:
              }
            break;
            case "clients":
              $scope.getCustomerListFn("",1);
              switch (fnAction){
                case "new":                                       
                  $('#RegisterModalCustomer').modal('toggle');
                break;
                case "dash":
                  $scope.loadPagination($scope.rsCustomerListData, "idClient", "7");
                  //console.log($scope.rsCustomerListData);
                break;                
                default:
              }
            break;
        }
      break;
      /*CUSTOMER USERS*/
      /*SYSTEM USERS*/
      case "sys":
        switch (val2){
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
          case "sysProfile":
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";
                  $scope.loadPagination($scope.rsProfileData, "idProfiles", "10");
                  $scope.sysContent = 'sysProfile';
                break;
                case "newProfile":
                  $scope.sysProfile.Name="";
                  $scope.checkBoxes.modulo=false;
                  $('#newSysProfile').modal('show');
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
          case "sysUsers":
              switch (fnAction){
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
          case "services":
            if(fnAction=="open"){
              $scope.select.idCompanyKf="";
              $scope.select.idAddressAtt="";
              $('#ModalServiceCost').modal('show');
            }
            if(fnAction=="save"){
              var i = 3;
              for (i=3; i<6; i++){
                $scope.updateServiceCost($http, $scope, i)
              }
            }
          break;
          case "zones":
              switch (fnAction){
                case "dash":
                  $scope.sysContent = "";
                  $scope.loadPagination($scope.rsZonesData, "idZona", "10");
                  $scope.sysContent = 'sysZones';
                break;
                case "newZone":
                  $('#newZoneModal').modal('toggle');
                break;
                case "updateZone":
                  $('#updateZoneModal').modal('show');
                break;
                default:
              }
          break;
          case "products":
              switch (fnAction){
                case "listProducts":
                  $scope.sysContent = "";
                  $scope.getProductsFn("",1);
                  $scope.sysContent = 'products';
                break;
                case "newProduct":
                  $scope.newProduct={product:{}};
                    $scope.list_id_divice=[];
                    $scope.list_divices=[];
                    $scope.isDeviceExist=null;
                  $('#newProduct').modal('show');
                break;
                default:
              }
          break;
          default:
        }
      break;
      default:
    }
  }


   /**************************************************
  *                                                 *
  *                LOGIN DE USUARIO                 *
  *                                                 *
  **************************************************/
    $scope.sysLoginUser = function(){
      $scope.checkEmailLogin    = 0;
      $scope.checkPasswdLogin = 0;
      if($scope.mailCheckResult){
        userServices.letLogin($scope._getLoginData()).then(function(data){
        $scope.loginResult = data;
        console.log("Value returned by the LoginService: "+$scope.loginResult);
        switch ($scope.loginResult){
          case 1:
            $scope.redirect2MainApp = true;
            $scope.countDownRedirect("/mainapp", 3);
          break;
          case 2:
            $scope.redirect2NewPwd = true;
            $scope.countDownRedirect("/newpwd", 3);
          break;
          case 3:
            //$scope.redirect2ResendEmail = true;
            //$scope.countDownRedirect("#/resendemail", 3);
            var rsTmpUser = tokenSystem.getTokenStorage(3);
            $scope.msg1="Disculpa, "+rsTmpUser.fullNameUser+", para continuar debe confirmar su correo electronico.";
            $scope.msg2="Verifica tu casilla de correo."
            $('#notificationModal').modal('show');
          break;
          case 4:
            var rsTmpUser = tokenSystem.getTokenStorage(3);

            $scope.msg1="Disculpa "+rsTmpUser.fullNameUser+" su cuenta se encuentra inactiva.";
            $scope.msg2="Comunicate con el area de soporte o el administrador."
            $('#notificationModal').modal('show');
              /*$timeout(function() {
                $('#notificationModal').modal('hide');
              }, 3000);*/
          break;
          case 5:
            $scope.sysCheckPasswordLogin();
          break;
          case 10:
            var rsTmpUser = tokenSystem.getTokenStorage(3);

            $scope.msg1="Disculpa "+rsTmpUser.fullNameUser+" no esta habilitado como usuario del sistema .";
            $scope.msg2="Comunicate con el area de soporte o el administrador."
            $('#notificationModal').modal('show');
              /*$timeout(function() {
                $('#notificationModal').modal('hide');
              }, 3000);*/
          break;  
          default:
        }
        });
      }else{
        $scope.sysCheckEmailLogin();
      }
    };
    /**************************************************
    *                                                 *
    *                 USER  SERVICES                  *
    *  [userLists]: clientUser, attendants, tenants   *
    *               sysUser, companyUser              *
    **************************************************/ 
      $scope.rsList = [];
      $scope.getUserLists = function(opt, group){
        userServices.userLists().then(function(response) {
          if (opt!=undefined && group!=undefined){
            console.log("[getUserList] ==> "+opt+" : "+group);
          }         
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
                $scope.loadPagination($scope.rsList.tenants, "idUser",  "7");
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
              case "clients":
                 $scope.loadPagination($scope.rsList.clientUser, "idUser",  "7");
              break;
            }
            
          }
          //console.log($scope.rsList.tenants);           
        });
      }
    $scope.getUserLists();  
});
