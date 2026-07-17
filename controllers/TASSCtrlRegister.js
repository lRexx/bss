var registerUser = angular.module("module.RegisterUser", ["tokenSystem", "services.User" , "ngSanitize", "services.Departments", "services.Utilities"]);

/**************************************************************************
*                                                                         *
*               Servicio para validar si tiene un valor para              *
*                                                                         *
*                      agregar o remover la clase css                     *
***************************************************************************/
registerUser.service("inputService",function(){
  return {
      setClass: function(value, obj) {
            if (value!==""){
                //console.log(value);
                //console.log(obj);
                obj.addClass('active');
            }else{
                obj.removeClass('active');
            }
      },
  }
});

registerUser.controller('RegisterUserCtrl', function($scope, inform, $rootScope, $location, $http, blockUI, inputService, userServices, UtilitiesServices, DepartmentsServices, $timeout, tokenSystem, serverHost, serverBackend, $window, APP_SYS, APP_REGEX){
  console.log(APP_SYS.app_name+" Modulo Register User");
  $scope.launchLoader = function(){
    $scope.wLoader  = true;
     $timeout(function() {
       $('#loader').fadeOut();
       $('#wLoader').delay(350).fadeOut('slow');
       $scope.wLoader  = false;
     }, 5500);
   }

  $scope.email2Register = {};
  $scope.selectIdAddressKf = {};
  $scope.sysRegisteredUser = {};
  $scope.sysToken      = tokenSystem.getTokenStorage(1);
  $scope.sysLoggedUser = tokenSystem.getTokenStorage(2);
  $scope.email2Register = tokenSystem.getTokenStorage(4);
  $scope.rsInput = false;
  $scope.rsInputLength = 0;
  $scope.sysEmailRegistered=false;
  $scope.sysDNIRegistered=false;
  $scope.select={'admins':{'selected':undefined}, 'buildings':{'selected':undefined},'depto':undefined,'floor':undefined, 'phoneCountryMovil':{'selected':undefined}, 'phoneCountryWired':{'selected':undefined}};
  $scope.register = {'idProfileKf':'', 'fname':'', 'lname':'', 'dni':'', 'email':'', 'phoneCountryMovil':{'selected':undefined}, 'phoneCountryWired':{'selected':undefined}, 'phoneLocalNumberUser':'', 'phoneMovilNumberUser': '', 'idProfileKf':'', 'idCompanyKf':'', 'idAddresKf':'', 'idTyepeAttendantKf':'', 'idTypeTenantKf':'', 'descOther':'', 'idDepartmentKf':'', 'isDepartmentApproved':'', 'requireAuthentication':''};
  $scope.depto={'department':{'idDepartment':null, 'idUserKf':null}};

  if (!$scope.sysToken && !$scope.sysLoggedUser){
    if($scope.email2Register==undefined){
      setTimeout(function() {
          $('#idProfileKf').addClass('active');
          $('#idProfileKf').focus();
      }, 100);

    }
    if($scope.email2Register!=undefined && APP_REGEX.checkDNI.test($scope.email2Register.emailAttempted)){
      $scope.register.dni = $scope.email2Register.emailAttempted;
      setTimeout(function() {
        $('#dniUser').addClass('active');
        $('#idProfileKf').focus();
      }, 100);

    }
    if($scope.email2Register!=undefined && APP_REGEX.checkEmail.test($scope.email2Register.emailAttempted)){
      $scope.register.email = $scope.email2Register.emailAttempted;
        setTimeout(function() {
          $('#emailRegister').addClass('active');
          $('#idProfileKf').focus();
        }, 100);

    }
/**************************************************
*                                                 *
*               GET PHONE CODES LIST              *
*                                                 *
**************************************************/
  $scope.countryPhoneCodesList = [];
  $scope.getCountryPhoneCodesFn = function(){
      UtilitiesServices.getCountryPhoneCodes().then(function(response){
        //console.log(response);
      if(response.status==200){
              $scope.countryPhoneCodesList = response.data;
      }else if (response.status==404){
          inform.add('Ocurrio un error, contacte al area de soporte de BSS.',{
              ttl:3000, type: 'danger'
          });
              $scope.countryPhoneCodesList = undefined;
      }else if (response.status==500){
          inform.add('Ocurrio un error, contacte al area de soporte de BSS.',{
          ttl:3000, type: 'danger'
          });
          $scope.countryPhoneCodesList = undefined;
      }
      });
  };
  $scope.getCountryPhoneCodesFn();
    setTimeout(function() {
      $scope.select.phoneCountryWired.selected=$scope.countryPhoneCodesList.find(c => c.isoCode === "AR");
      $scope.select.phoneCountryMovil.selected=$scope.countryPhoneCodesList.find(c => c.isoCode === "AR");
      $scope.register.phoneWiredPrefix = "11"
      $scope.register.phoneMovilPrefix = "11"
      console.log($scope.select);
    }, 1000);
  }else{
    tokenSystem.destroyTokenStorage(2);
    tokenSystem.destroyTokenStorage(3);
    $location.path("/");
  }

  //tokenSystem.destroyTokenStorage(2);
  //$scope.sysToken      = tokenSystem.getTokenStorage(1);
  //$scope.sysLoggedUser = tokenSystem.getTokenStorage(2);

  $scope.modalConfirmation = function(){
    $scope.register.securityCode = "";
    $scope.register.idAddrName = "";
    $scope.register.idAddresKf = "";
    $scope.register.idDepartmentKf = "";
    $('#confirmCodeModal').modal({backdrop: 'static', keyboard: false});
    $('#confirmCodeModal').on('shown.bs.modal', function () {
        $('#checkCode').focus();
    })
    //$('#confirmCodeModal').modal('show');
    console.log("register.idAddrName :" +$scope.register.idAddrName);
  }
  /**************************************************
  *                                                 *
  *         GET ADDRESS BY SECURITY CODE            *
  *                                                 *
  **************************************************/
    $scope.sysCheckCode = function(){
      $scope.sysSecurityCode='';
      console.log($scope.register.securityCode);
      if($scope.register.securityCode){
        userServices.addressByCode($scope.register.securityCode).then(function(data) {
          $scope.sysSecurityCode= data;
          console.log($scope.sysSecurityCode.data);
          if(!$scope.sysSecurityCode.data.error){
            console.log($scope.sysSecurityCode.data[0].idClient);
            $scope.register.idAddrName = $scope.sysSecurityCode.data[0].address;
            $scope.register.idAddresKf = $scope.sysSecurityCode.data[0].idClient;
            $scope.getDeptoListByAddress($scope.register.idAddresKf);
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
    $scope.normalizePhoneE164 = function (countryCodeTmp, prefixNumber, phoneNumber) {

        if (!countryCodeTmp ||
            !prefixNumber ||
            !phoneNumber) {
            return null;
        }

        let countryCode = countryCodeTmp.phoneCode;
        let localNumber = phoneNumber;

        // 1️⃣ Quitar todo lo que no sea número (elimina paréntesis, espacios y guiones de la máscara)
        localNumber = localNumber.replace(/\D/g, '');

        // 2️⃣ Eliminar ceros iniciales
        localNumber = localNumber.replace(/^0+/, '');

        // 2.5️⃣ ELIMINAR EL "15" INICIAL (Solo para almacenamiento en Base de Datos)
        // Si el número limpio empieza con 15, lo removemos para guardar solo el número de abonado real
        if (localNumber.startsWith('15')) {
            localNumber = localNumber.substring(2);
        }

        // 3️⃣ Quitar + del countryCode
        countryCode = countryCode.replace('+', '');

        // Se unifica: Código País + Prefijo de Área (ej: 11) + Número local sin el 15 (ej: 22356388)
        let fullNumber = '+' + countryCode + prefixNumber + localNumber;

        // 4️⃣ Validar longitud máxima E.164
        if (fullNumber.length > 16) { // + incluido
            return null;
        }

        return fullNumber;
    };
    $scope.parsePhoneE164 = function (fullNumber, countryPhoneCodesList) {
        if (!fullNumber || !countryPhoneCodesList || countryPhoneCodesList.length === 0) {
            return null;
        }

        // 1️⃣ Limpiar el número dejando solo el '+' inicial y los dígitos
        let cleanNumber = fullNumber.replace(/[^\d+]/g, '');

        // 2️⃣ Encontrar el país correspondiente que coincida al inicio del string
        // Ordenamos por longitud descrita para que coincidan primero códigos largos (ej: +1246 antes que +1)
        let sortedCountries = [...countryPhoneCodesList].sort((a, b) => b.phoneCode.length - a.phoneCode.length);
        let matchedCountry = sortedCountries.find(c => cleanNumber.startsWith(c.phoneCode));

        if (!matchedCountry) {
            return null; // No se encontró un país válido en la lista
        }

        // 3️⃣ Remover el código de país para procesar el resto del número
        let remaining = cleanNumber.substring(matchedCountry.phoneCode.length);

        let prefixNumber = "";
        let phoneNumber = "";

        // 4️⃣ Lógica específica para Argentina (+54)
        if (matchedCountry.isoCode === "AR" || matchedCountry.phoneCode === "+54") {
            // En Argentina, los prefijos más comunes son de 2 dígitos (11) o 3 dígitos (341, 261, etc)
            // Probamos primero con el prefijo AMBA / Buenos Aires que es "11"
            if (remaining.startsWith("11")) {
                prefixNumber = "11";
                let afterPrefix = remaining.substring(2);

                // Verificamos si incluye el "15" de celular
                if (afterPrefix.startsWith("15")) {
                    phoneNumber = "15" + afterPrefix.substring(2);
                } else {
                    phoneNumber = afterPrefix;
                }
            } else {
                // Para otros prefijos de provincias de 3 dígitos (ej: 341, 261)
                // Tomamos 3 dígitos como prefijo estándar fuera de BsAs
                prefixNumber = remaining.substring(0, 3);
                let afterPrefix = remaining.substring(3);

                if (afterPrefix.startsWith("15")) {
                    phoneNumber = "15" + afterPrefix.substring(2);
                } else {
                    phoneNumber = afterPrefix;
                }
            }
        } else {
            // 5️⃣ Lógica genérica para otros países (Mitad prefijo, mitad número como fallback)
            let mid = Math.floor(remaining.length / 2);
            prefixNumber = remaining.substring(0, mid);
            phoneNumber = remaining.substring(mid);
        }

        // Retorna el objeto desarmado listo para asignar a tus variables de $scope
        return {
            countryCodeTmp: matchedCountry,
            prefixNumber: prefixNumber,
            phoneNumber: phoneNumber
        };
    };
  /**************************************************
  *                                                 *
  *               REGISTRO DE USUARIO               *
  *                                                 *
  **************************************************/
    $scope.sysRegisterFn = function(obj){
      console.log($scope.userData2Add());
        userServices.addUser($scope.userData2Add()).then(function(response_userRegister){
          if(response_userRegister.status==200){
            inform.add('Su Cuenta de usuario ha sido creada satisfactoriamente, verifique su casilla de correo electronico para continuar.',{
              ttl:6000, type: 'success'
            });
            console.log("REGISTERED SUCCESSFULLY");
            if($scope.register.idProfileKf==3){
              userServices.findUserByEmail($scope.register.dni).then(function(response_userFound) {
                //console.log(response_userFound);
                if(response_userFound.status==200){
                  blockUI.start('Asociando usuario al departamento seleccionado.');
                  $timeout(function() {
                    $scope.depto.department.idUserKf=response_userFound.data[0].idUser;
                    $scope.depto.department.isApprovalRequired = true;
                    $scope.depto.department.idDepartment=$scope.register.idDepartmentKf;
                  }, 1500);
                  $timeout(function() {
                    $scope.fnAssignDepto($scope.depto);
                    console.log($scope.depto)
                    blockUI.stop();
                  }, 1500);
                }
              });
            }else{
              //$location.path("/login");
              $scope.redirectSuccessfull = true;
            }
          }
        });

    }
    $scope.userData2Add = function () {
      if($scope.register.idProfileKf==3){
        $scope.register.idTypeTenantKf          = "1";
        $scope.register.idDepartment_tmp        = null;
        $scope.register.isDepartmentApproved    = null;
        $scope.register.isRequireAuthentication = null;
        $scope.register.typeOtherAtt            = null;
      }else if ($scope.register.idProfileKf==5){
        $scope.register.idTypeTenantKf          ="2";
        $scope.register.isDepartmentApproved    = 0;
        $scope.register.isRequireAuthentication = null;
        $scope.register.typeOtherAtt            = null;
        $scope.register.idDepartment_tmp        =$scope.register.idDepartmentKf;
      }else if($scope.register.idProfileKf==6 && $scope.register.idTypeAttKf==2){
        $scope.register.idTypeTenantKf          = 1;
        $scope.register.isRequireAuthentication = 1;
        $scope.register.isDepartmentApproved    = null;
        $scope.register.idDepartment_tmp        = $scope.register.idDepartmentKf;
      }else{
        $scope.register.idTypeTenantKf          = null;
        $scope.register.isRequireAuthentication = 0;
        $scope.register.idDepartmentKf          = null;
        $scope.register.isDepartmentApproved    = null;
      }
      if($scope.register.idProfileKf!=2 && $scope.register.idProfileKf!=4 && $scope.register.idAddrAttKf){
        $scope.register.idCompanyKf = null;
      }
      var user =
            {
              user:{
                          fullNameUser            : $scope.register.fname+' '+$scope.register.lname,
                          emailUser               : $scope.register.email,
                          dni                     : $scope.register.dni,
                          phoneNumberUser         : $scope.normalizePhoneE164($scope.select.phoneCountryMovil.selected,$scope.register.phoneMovilPrefix,$scope.register.phoneMovilNumberUser),
                          phoneLocalNumberUser    : $scope.normalizePhoneE164($scope.select.phoneCountryWired.selected,$scope.register.phoneWiredPrefix,$scope.register.phoneLocalNumberUser),
                          idProfileKf             : $scope.register.idProfileKf,
                          idCompanyKf             : $scope.register.idCompanyKf,
                          /*-----------------------------------------*/
                          idAddresKf              : $scope.register.idAddresKf,
                          idTyepeAttendantKf      : $scope.register.idTypeAttKf,
                          idTypeTenantKf          : $scope.register.idTypeTenantKf,
                          descOther               : $scope.register.typeOtherAtt,
                          idDepartmentKf          : $scope.register.idDepartment_tmp,
                          isEdit                  : 1,
                          idSysProfileFk          : 10,
                          isTyCAccepted           : 0,
                          isDepartmentApproved    : $scope.register.isDepartmentApproved,
                          requireAuthentication   : $scope.register.isRequireAuthentication
                    }
            };
      return user;
    };
  /**************************************************/
  /**************************************************
  *                                                 *
  *                CHECK MAIL OR DNI                *
  *                   DUPLICATES                    *
  *                                                 *
  **************************************************/
    $scope.sysCheck4Duplicates = function(value){
      if(value){
        userServices.findUserByEmail(value).then(function(response) {
          //console.log(response);
          if(response.status==200){
            if(APP_REGEX.checkDNI.test(value)){
              $scope.sysDNIRegistered=true;
              //console.log(response.data[0].fullNameUser);
              $scope.register.dni=undefined;
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


  $('#confirmCodeModal').on('hide.bs.modal', function (e) {


  });
  /**************************************************
  *                                                 *
  *   ASSIGN DEPARTMENT TO THE CURRENT OWNER USER   *
  *                                                 *
  **************************************************/
  $scope.redirectSuccessfull = false;
    $scope.fnAssignDepto = function(userData){
      DepartmentsServices.assignDepto(userData).then(function(response) {
        if(response.status==200){
          /*inform.add('Departamento Asignado y pendiente por aprobacion por la administracion.',{
            ttl:6000, type: 'success'
          });*/
          $timeout(function() {
            //$location.path("/login");
            $scope.redirectSuccessfull = true;
            blockUI.stop();
          }, 1500);
        }else if (response.status==404){
          inform.add('Ocurrio un error, contacte al area de soporte de BSS',{
            ttl:3000, type: 'danger'
          });
        }
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
          url : serverHost+serverBackend+"/User/filterForm"
        }).then(function mySuccess(response) {
            $scope.listProfile      = response.data.profile;
            $scope.lisTypeTenant    = response.data.type;
            $scope.listCompany      = response.data.company;
            $scope.listTypeOfTenant = response.data.type;
            $scope.listStatus       = response.data.status;
          }, function myError(response) {
        });
    }
  //**************************************************************


    $scope.fnLoadPhoneMask = function(){
      console.log($scope.register)
      /**********************************************
      *               INPUT PHONE MASK              *
      **********************************************/

        $('.input-phone-prefix').mask('####', {
          reverse: false,
          translation:{
            '0': null,
            '#':{
              pattern: /[1-9]/
            },
          },
          placeholder: '____'
        });

        $('.input-movil').mask('(15) ####-####',
        {
          reverse: false,
          translation:{
            '0': null,
            '1': null,
            '4': null,
            '5': null,
            '#':{
              pattern: /[0-9]/
            }
          },
          placeholder: "(15) ____ ____"
        });
        $('.input-local').mask('####-####',
        {
          reverse: false,
          translation:{
            '0': null,
            '1': null,
            '4': null,
            '5': null,
            '+': null,
            '#':{
              pattern: /[0-9]/
            }
          },
          placeholder: "____ ____"
        });
        $('.input--phone').mask('+54 (####) (15) ####-####',
        {
          reverse: false,
          translation:{
            '0': null,
            '1': null,
            '4': null,
            '5': null,
            '+': null,
            '#':{
              pattern: /[0-9]/
            }
          },
          placeholder: "+54 (_____) (15) ____ ____"
        });
        $('.input--phone--wired').mask('+54 (####) ####-####',
        {
          reverse: false,
          translation:{
            '0': null,
            '1': null,
            '4': null,
            '5': null,
            '+': null,
            '#':{
              pattern: /[0-9]/
            }
          },
          placeholder: "+54 (_____) ____ ____"
        });
      /**********************************************
      *               INPUT DNI MASK                *
      **********************************************/
        $('.input--dni').mask('99999999');
    }
    $scope.inputCheckCss = function (obj, type) {
      var $this=null;
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

        console.log($this)
        var inputObj   = $this
        var inputValue = !$this.val()?$this[0].innerText:$this.val();
        console.log(inputValue);
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
          url : serverHost+serverBackend+"/Ticket/filter"
        }).then(function mySuccess(response) {
            //console.log(response.data);
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
  *           CHECK IF A DEPTO HAS OWNER            *
  *                                                 *
  **************************************************/
    $scope.ownerFound=false;
    $scope.deptoHasOwner = function (idDeparment) {
        var idDepto = idDeparment;
        if(idDepto){
          $http({
            method : "GET",
            url : serverHost+serverBackend+"Department/chekDepartamenteOwner/"+idDepto
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
        $scope.ListDpto={};
        console.log("idProfileKf: "+$scope.register.idProfileKf);
        if((($scope.register.idProfileKf==3 || $scope.register.idProfileKf==5) && !$scope.register.idTypeAttKf) || ($scope.register.idProfileKf==6 && $scope.register.idTypeAttKf!=1)){
          var idAddressTmp=idAddress;
          console.log("idAddressTmp: "+idAddressTmp);
          var idStatusFk=null;
            if($scope.register.idProfileKf==3){
              idStatusFk='0';
            }else{
              idStatusFk='-1';
            }
            DepartmentsServices.byIdDireccion(idAddress, idStatusFk).then(function(response) {
              if(response.status==200){
                $scope.ListDpto = response.data;
              }else if (response.status==404){
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
      if(($scope.register.idProfileKf==3 || $scope.register.idProfileKf==5) && (item.idUserKf!=null || item.idUserKf==null)  && (item.floor=="pb" || item.floor=="ba" || item.floor=="co" || item.floor=="lo")){

        //$scope.ownerFound=true;
        //console.log("ownerFound1: "+$scope.ownerFound+"item.idUserKf: "+item.idUserKf)
        return false;
      }
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
