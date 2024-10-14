var moduleRegisterUser = angular.module("module.RegisterUser", ["tokenSystem", "services.User" , "ngSanitize", "ui.select"]);



moduleRegisterUser.controller('RegisterUserCtrl', function($scope, inform, $rootScope, $location, $http, blockUI, inputService, userServices, $timeout, tokenSystem, serverHost, serverBackend, $window){

  $scope.register = {idProfileKf:'', fname:'', lname:'', email:'', password1:'', password2:'', phonelocalNumberUser:'', phoneMovilNumberUser: ''};
  $scope.redirectSuccessfull = false;
  $scope.counT  =5;
  $scope.redirect ="#/login";
  $scope.email2Register = {};
  $scope.selectIdAddressKf = {};
  $scope.sysRegisteredUser = {};
  $scope.tmp               = {};
  $scope.email2Register = tokenSystem.getTokenStorage(4);
  $scope.rsInput = false;
  $scope.rsInputLength = 0;
  $scope.regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  //console.log($scope.email2Register.emailAttempted)
  $scope.register.email = !$scope.email2Register?'':$scope.email2Register.emailAttempted;

  if($scope.register.email){
    setTimeout(function() {
        $('#emailRegister').addClass('active');
        $('#idProfileKf').focus();
    }, 100);

  }

  tokenSystem.destroyTokenStorage(2);
  $scope.sysToken      = tokenSystem.getTokenStorage(1);
  $scope.sysLoggedUser = tokenSystem.getTokenStorage(2);

$scope.modalConfirmation = function(){
  $scope.register.securityCode = "";
  $scope.register.idAddrName = "";
  $scope.reg.idAddrAttKf = "";
  $scope.register.idDepartmentKf = "";
  $('#confirmCodeModal').modal({backdrop: 'static', keyboard: false});
  $('#confirmCodeModal').on('shown.bs.modal', function () {
      $('#checkCode').focus();
  })
  //$('#confirmCodeModal').modal('show');
  console.log("register.idAddrName :" +$scope.register.idAddrName);
}
$scope.reg = {idAddrAttKf: ''};
$scope.sysCheckCode = function(){
  $scope.sysSecurityCode='';
  if($scope.register.securityCode){
    userServices.addressByCode($scope.register.securityCode).then(function(data) {
      $scope.sysSecurityCode= data;
      console.log($scope.sysSecurityCode.data);
      if(!$scope.sysSecurityCode.data.error){
        console.log($scope.sysSecurityCode.data[0].idAdress);
        $scope.register.idAddrName = $scope.sysSecurityCode.data[0].nameAdress;
        $scope.reg.idAddrAttKf = $scope.sysSecurityCode.data[0].idAdress;
        $scope.getDeptoListByAddress($scope.reg.idAddrAttKf);
        $('#confirmCodeModal').modal('hide');
        $('#confirmCodeModal').on('hidden.bs.modal', function () {
          $('#idAddrAttKf').focus();
          $('#idDepartmentKf').focus();
        });
      }else{
        $scope.sysSecurityCode={};
        inform.add('Codigo de seguridad invalido por favor valida nuevamente o comunicate con el area de soporte.',{
                    ttl:3000, type: 'danger'
        });
        $scope.register.securityCode="";
        $('#checkCode').focus();
      }
    });
  }
}

  /**************************************************
  *                                                 *
  *               REGISTRO DE USUARIO               *
  *                                                 *
  **************************************************/
  $scope.sysRegisterFn = function(){
    $scope.tmp.idDepartmentKf=$scope.register.idDepartmentKf;$scope.register.idAddrAttKf /*?$scope.selectIdAddressKf.selected.idAdress*/
    $scope.register.idAddrAttKf=$scope.reg.idAddrAttKf;
    console.log($scope.register.idAddrAttKf);
    console.log($scope.userData2Add());
      userServices.addUser($scope.userData2Add()).then(function(data){
        $scope.addUserResult = data;
          if($scope.addUserResult){
            console.log("REGISTERED SUCCESSFULLY");
              if($scope.register.idProfileKf==3){
                userServices.checkUserMail($scope.register.email, "").then(function(data) {
                  $scope.mailCheckResult= data;
                  if($scope.mailCheckResult){
                      $scope.sysRegisteredUser = $scope.sysLoggedUser = tokenSystem.getTokenStorage(3);
                            var dpto =
                                      {
                                           department: { 
                                                        idDepartment      : $scope.tmp.idDepartmentKf,
                                                        idUserKf          : $scope.sysRegisteredUser.idUser
                                                       }
                                      }; 
                      $scope.fnAssignDepto(dpto);
                  }
                });
              }else{
                  $scope.redirectSuccessfull = true;
                  $scope.countDownRedirect($scope.redirect, $scope.counT);
              }
          }
      });
 
  }
  $scope.userData2Add = function () {
    if($scope.register.idProfileKf==3){
      $scope.register.idTypeTenantKf ="1";
      $scope.register.idDepartmentKf=null;
    }else if ($scope.register.idProfileKf==5){
      $scope.register.idTypeTenantKf ="2";
      $scope.register.isDepartmentApproved = 0;
    }else if($scope.register.idProfileKf==6 && $scope.register.idTypeAttKf==2){
      $scope.register.idTypeTenantKf=1;
      $scope.register.isRequireAuthentication=1;
    }else{
      $scope.register.idTypeTenantKf=null;
      $scope.register.isRequireAuthentication=0;
      $scope.register.idDepartmentKf=null;
      $scope.register.isDepartmentApproved = null;
    }
    if($scope.register.idProfileKf!=2 && $scope.register.idProfileKf!=4 && $scope.register.idProfileKf!=4 && $scope.register.idAddrAttKf){
      $scope.register.idCompanyKf = $scope.getCompanyFromAddress();
    }
    var user =
          {
            user:{
                        fullNameUser            : $scope.register.fname+' '+$scope.register.lname,
                        emailUser               : $scope.register.email,
                        phoneNumberUser         : $scope.register.phoneMovilNumberUser,
                        phoneLocalNumberUser    : $scope.register.phonelocalNumberUser,
                        passwordUser            : $scope.register.password2,
                        idProfileKf             : $scope.register.idProfileKf,
                        idCompanyKf             : $scope.register.idCompanyKf,
                        /*-----------------------------------------*/
                        idAddresKf              : $scope.register.idAddrAttKf,
                        idTyepeAttendantKf      : $scope.register.idTypeAttKf,
                        idTypeTenantKf          : $scope.register.idTypeTenantKf,
                        descOther               : $scope.register.typeOtherAtt,
                        idDepartmentKf          : $scope.register.idDepartmentKf,
                        isEdit                  : 1,
                        isDepartmentApproved    : $scope.register.isDepartmentApproved,
                        requireAuthentication   : $scope.register.isRequireAuthentication
                  }
          };
    return user;
  };

$scope.sysCheckEmail = function(){
  $scope.sysEmailRegistered=false;
  if($scope.register.email){
    userServices.checkUserMail($scope.register.email, "register").then(function(data) {
      $scope.mailCheckResult= data;
      if($scope.mailCheckResult){
        $scope.sysEmailRegistered=true;
          $scope.register.email="";

      }else{
        $scope.sysEmailRegistered=false;
      }
    });
  }
}

$('#confirmCodeModal').on('hide.bs.modal', function (e) {
    

});
/**************************************************
*                                                 *
*   ASSIGN DEPARTMENT TO THE CURRENT OWNER USER   *
*                                                 *
**************************************************/
  $scope.fnAssignDepto = function(userData){
    $http.post(serverBackend+"Department/update",userData)
          .then(function(success, data) {
                  inform.add('Departamento Asignado y pendiente por aprobacion por la administracion.',{
                    ttl:3000, type: 'success'
                  });
                $scope.redirectSuccessfull = true;
                $scope.countDownRedirect($scope.redirect, $scope.counT);
          },function (error, data, status) {
              if(status == 404){alert("!Informacion "+status+data.error+"info");}
              else if(status == 203){alert("!Informacion "+status,data.error+"info");}
              else{alert("Error ! "+status+" Contacte a Soporte");}
             
          }); 
  }
/**************************************************
*                                                 *
*               REQUEST SELECT LIST               *
*     (status, profile, typeTenant, company)      *
**************************************************/
  $scope.CallFilterFormU = function(){
     $http({
        method : "GET",
        url : "Coferba/Back/index.php/User/filterForm"
      }).then(function mySuccess(response) {
          $scope.listProfile      = response.data.profile;
          $scope.lisTypeTenant    = response.data.type;
          $scope.listCompany      = response.data.company;
          $scope.listTypeOfTenant = response.data.type;
          $scope.listStatus       = response.data.status;
        }, function myError(response) {
      });
  }
  /**************************************************
  *                                                 *
  *                  ADDRESS LIST                   *
  *                                                 *
  **************************************************/
  $scope.getAllAddress = function (){
    $http({
        method : "GET",
        url : "Coferba/Back/index.php/Direccion"
      }).then(function mySuccess(response){
          $scope.ListAddress = response.data;
      }, function myError (response){
        
    });
  }
  $scope.getAdressSelected = function(){
    var idAddrr = $scope.register.idAddrAttKf;
    /* Recorrer el Json para obtener datos */
    var length = $scope.ListAddress.length;
    var rsJSON = {address: {}};
    for (i = 0; i < length; i++) {
        if($scope.ListAddress[i].idAdress == idAddrr){
            rsJSON.address = $scope.ListAddress[i];
            //console.log(rsJSON);
            break;
        }
    }; 
    return rsJSON;
  }
  $scope.getCompanyFromAddress = function(){
      var rsJSONAddress = $scope.getAdressSelected();
      /* Recorrer el Json para obtener datos */
      var companyKf = "";
      var length = $scope.listCompany.length;
      for (i = 0; i < length; i++) {
          if($scope.listCompany[i].idCompany == rsJSONAddress.address.idCompanyKf){
              
              companyKf = $scope.listCompany[i].idCompany;
              //console.log($scope.listCompany[i]);
              break;
          }
      }; 
      return companyKf;
  }


//**************************************************************
//**************************************************************


  $scope.fnLoadPhoneMask = function(){
    /**********************************************
    *               INPUT PHONE MASK              *
    **********************************************/
    $('.input--movil').mask('99999999999999999999');
    $('.input--local').mask('99999999999999999999');
    $('.input--tel').on('focus', function () {
       if ($(this).val().length === 0) {
         $(this).val();
       }
    });
    
    $('.input--tel').keydown(function (e) {
          if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
               (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
               (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
               (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
               (e.keyCode >= 35 && e.keyCode <= 39)) {
                  return;
          }

          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
          }
      });
  }
  $scope.inputCheckLength = function(obj){
    
    var input = obj=="" || obj==undefined ?"":obj;
    console.log("input length="+input.length);
    $scope.rsInputLength  = input.length;
  }
  $scope.printScope = function(obj, nameInput){
    console.log(nameInput+" : "+obj);
    if (obj!=undefined){
      console.log(nameInput +" length : "+obj.length);
    }
  }
  $scope.inputCheckCss = function (obj, type) {
    var $this;
    switch (type){
      case 'i':
        $this      = $('input[name*='+obj+']');
      break;
      case 's':
        $this      = $('select[name*='+obj+']');
      break;
      case 'ui':

        $this      = $('#'+obj);
        console.log($this)
      break;
    }
      
      //console.log($this)
      var inputObj   = $this
      var inputValue = !$this.val()?$this[0].innerText:$this.val();
      //console.log(inputValue);
      inputService.setClass(inputValue, inputObj);
  }
  /**************************************************
  *                                                 *
  *             REQUEST SELECT LIST                 *
  *  (user, reason_disabled_item, typedelivery)     *
  *     (typeouther, typeticket, tipeOpcion)        *
  **************************************************/
  $scope.CallFilterFormT = function(){
    $scope.listUser = "";
     $http({
        method : "GET",
        url : "Coferba/Back/index.php/Ticket/filter"
      }).then(function mySuccess(response) {
          $scope.listTypeDelivery = response.data.typedelivery;
          $scope.listTypeLost     = response.data.reason_disabled_item;
          $scope.listTypeQuery    = response.data.typeouther;
          $scope.listUser         = response.data.user;
          $scope.listTypeTicket   = response.data.typeticket;
          $scope.listStatusTicket = response.data.statusticket;
        }, function myError(response) {
          $scope.listTypeDelivery = "";
          $scope.listTypeLost     = "";
          $scope.listTypeQuery    = "";
          $scope.listUser         = "";
          $scope.listTypeTicket   = "";
          $scope.listStatusTicket = "";
      });
  }

  /**************************************************
  *                                                 *
  *                ATTENDANT TYPE LIST              *
  *                                                 *
  **************************************************/

  $scope.getTypeAttendant = function(){
     $http({
        method : "GET",
        url : "Coferba/Back/index.php/Ticket/typeAttendant"
      }).then(function mySuccess(response) {
            $scope.listTypeAttendant = response.data;
             $scope.attendantTypeFound=true;
        }, function myError(response) {
          $scope.listTypeAttendant ="";
           $scope.attendantTypeFound=false;
      });
  }
/**************************************************
*                                                 *
*           CHECK IF A DEPTO HAS OWNER            *
*                                                 *
**************************************************/
$scope.ownerFound=false;
$scope.deptoHasOwner = function (idDeparment) {
    var idDepto = idDeparment;
    if(idDepto){
      $http({
        method : "GET",
        url : serverBackend+"Department/chekDepartamenteOwner/"+idDepto
      }).then(function mySuccess(response) {
            if (response.data=="true"){
              $scope.ownerFound=true;
              idDepto=null;
              console.log("EL DEPTO: "+idDepto+" Ya tiene un propietario Asignado");
              inform.add('Contacte con la administracion del consorcio.',{
                    ttl:6000, type: 'warning'
              });
            }else if(response.data=="false"){
              $scope.ownerFound=false;
              console.log("EL DEPTO: "+idDepto+" No tiene un propietario Asignado");
            }
              
        }, function myError(response) {
            if (!idDepto){
              inform.add('Contacte con la administracion del consorcio.',{
                    ttl:6000, type: 'danger'
              });
            }
          
      });
    }else{
      inform.add('Debe seleccionar un departamento para continuar con el registro de usuario.',{
          ttl:6000, type: 'danger'
      });
    }
};
/**************************************************/

/**************************************************
*            HIDE PROFILES FUNCTION               *
*         USED IN THE USER REGISTER FORM          *
**************************************************/
$scope.filterProfileUser = function(item){
  //alert($scope.select.idCompanyKf);
  //console.log(item);
  return item.idProfile == 3 ||  item.idProfile == 5;
};
/**************************************************/ 
/**************************************************
*                                                 *
* DEPARTMENT LIST BY SELECTED ADDRESS AND TENANT  *
*                                                 *
**************************************************/
$scope.getDeptoListByAddress = function (idAddress){
  console.clear();
  $scope.ListDpto="";
  console.log("idProfileKf: "+$scope.register.idProfileKf);
  if((($scope.register.idProfileKf==3 || $scope.register.idProfileKf==5) && !$scope.register.idTypeAttKf) || ($scope.register.idProfileKf==6 && $scope.register.idTypeAttKf!=1)){
     var idAddressTmp=idAddress;
     console.log("idAddressTmp: "+idAddressTmp);
     var urlT="";
      if($scope.register.idProfileKf==3){
        urlT=serverBackend+"Department/byIdDireccion/"+idAddressTmp+"/"+'0';
      }else{
        urlT=serverBackend+"Department/byIdDireccion/"+idAddressTmp+"/"+'-1';
      }

    $http({
        method : "GET",
        url : urlT
      }).then(function mySuccess(response){
            $scope.ListDpto = response.data;
            var listLength = $scope.ListDpto.length;
            for (i = 0; i < listLength; i++) {
                if($scope.register.idProfileKf==6){
                  if($scope.ListDpto[i].idAdressKf == idAddressTmp && ($scope.ListDpto[i].departmentFloor=="Porteria" || $scope.ListDpto[i].departmentFloor=="porteria") && $scope.ListDpto[i].idUserKf!=null){
                    //console.log($scope.ListDpto[i].departmentFloor);
                    $scope.ownerFound=true;
                    //console.log("ownerFoundtrue: "+$scope.ownerFound+" idUserKf: "+$scope.ListDpto[i].idUserKf);
                    
                  }else if($scope.ListDpto[i].idAdressKf == idAddressTmp && ($scope.ListDpto[i].departmentFloor=="Porteria" || $scope.ListDpto[i].departmentFloor=="porteria") && $scope.ListDpto[i].idUserKf==null){
                    //console.log($scope.ListDpto[i].departmentFloor);
                    $scope.ownerFound=false;
                    //console.log("ownerFoundfalse: "+$scope.ownerFound+" idUserKf: "+$scope.ListDpto[i].idUserKf);
                  }
                  // console.log("total de deptos: "+listLength+" / contador: "+i);
                }
            }; 
              return $scope.ownerFound;
            //console.log(response.data);
      }, function myError (response){
        $scope.ListDpto="";
        if (!idAddressTmp && response.status=="404"){
          inform.add('Debe seleccionar una direccion para ver los departamentos asociados..',{
                        ttl:5000, type: 'warning'
          }); 
        }else if (response.status=="404" || response.status=="500"){
          inform.add('No hay departamentos en esta direccion para ser asignados, Contacte al administrador.',{
                        ttl:5000, type: 'info'
          }); 
        }
      });
  }
};
/**************************************************/

  $scope.hideDeptoByProfile = function(){
    return function(item){
      if($scope.register.idProfileKf==6 && item.idUserKf!=null && (item.departmentFloor=="Porteria" || item.departmentFloor=="porteria")){
      
        //$scope.ownerFound=true;
        //console.log("ownerFound1: "+$scope.ownerFound+"item.idUserKf: "+item.idUserKf)
        return false;
      }else if($scope.register.idProfileKf==6 && item.idUserKf==null && (item.departmentFloor=="Porteria" || item.departmentFloor=="porteria")){
        
        //$scope.ownerFound=false;
        //console.log("ownerFound2: "+$scope.ownerFound+"item.idUserKf: "+item.idUserKf)
        return true;
      }
      else if(($scope.register.idProfileKf==3 || $scope.register.idProfileKf==5) && (item.departmentFloor!="Porteria" && item.departmentFloor!="porteria")){
        return true;
      }
        
        return false;
    }
  };
  $scope.hideTypeAttendant = function(){
    return function(item){
      if($scope.register.idProfileKf==6 && item.idTyepeAttendant==2){
        return true;
      }
      return false;
    }
  };
});
