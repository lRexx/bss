var moduleNewPwd = angular.module("module.NewPwd", ["tokenSystem", "services.User"]);

moduleNewPwd.directive('noSpaces', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      attrs.ngTrim = 'false';

      element.bind('keydown', function(e) {
        if (e.which === 32) {
          e.preventDefault();
          return false;
        }
      });

      ngModel.$parsers.unshift(function(value) {
        var spacelessValue = value.replace(/ /g, '');

        if (spacelessValue !== value) {
          ngModel.$setViewValue(spacelessValue);
          ngModel.$render();
        }

        return spacelessValue;
      });
    }
  };
});
moduleNewPwd.controller('NewPwdCtrl', function($scope, $rootScope, $location, $http, blockUI,userServices, inputService, userServices, $timeout, tokenSystem, inform, $window, APP_SYS, APP_REGEX){

  //console.log(serverHeaders)
  $scope.new = {pwd1: '', pwd2:''};
  $scope.redirectSuccessfull = false;
  $scope.counT  =5;
  $scope.redirect ="#/login";
  tokenSystem.destroyTokenStorage(2);
  $scope.sysToken      = tokenSystem.getTokenStorage(1);
  $scope.sysLoggedUser = tokenSystem.getTokenStorage(2);
  $scope.sysRsTmpUser  = tokenSystem.getTokenStorage(3);
  $scope.regexStrongPwd=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  $scope.regexRules = {uperChar:false, lowerChar:false, numberChar:false, specialChar:false, minChar:false } ;
  var regexUperChar    =/^(?=.*[A-Z]).{1,}$/;
  var regexLowerChar   =/^(?=.*[a-z]).{1,}$/;
  var regexNumberChar  =/^(?=.*\d).{1,}$/;
  var regexSpecialChar =/^(?=.*\W).{1,}$/;
  var regexMinChar     =/^.{8,}/;
  var data2update = {};
  var user = !$scope.sysToken ? $scope.sysRsTmpUser : $scope.sysLoggedUser;
  //console.log(user);
  var data2update = {
                      user
                    };

  /**************************************************
  *                                                 *
  *                 NEW PWD INIT                    *
  *                                                 *
  **************************************************/
  $scope.sysRequestInit = function(){
    if (!$scope.new.pwd1 && !$scope.new.pwd2){
      console.log("Modo cambio de clave activado: "+data2update.user.isEditUser);
      inform.add('Estimado '+data2update.user.fullNameUser + ', ha iniciado el proceso de cambio de clave.',{
                ttl:4000, type: 'warning'
      });
    }
  }
  /**************************************************
  *                                                 *
  *           SEND THE NEW PWD TO UPDATE            *
  *                                                 *
  **************************************************/

  $scope.sysSendPwd2change= function (){
      userServices.updateUser(data2update).then(function(response){
        if(response.status==200){
          tokenSystem.destroyTokenStorage(4);
          inform.add('El cambio de clave se ha realizado con exito, ya puede acceder al sistema.',{
            ttl:4000, type: 'warning'
          });
          blockUI.message('Su Nueva Clave fue cambiada con exito!');
          $timeout(function() {
            blockUI.stop();
            $location.path("/login");
          }, 1500);
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

  $scope.sysRequestNewPwd = function () {
      if ($scope.new.pwd1 == $scope.new.pwd2){
        data2update.user.passwordUser=$scope.new.pwd2;
        $scope.sysSendPwd2change();
      }

  };

  $scope.inputCheckCss = function (obj) {
      var $this      = $('input[name*='+obj+']');
      var inputObj   = $this
      var inputValue = $this.val();
      inputService.setClass(inputValue, inputObj);
  }

  if ($scope.sysToken || $scope.sysLoggedUser || $scope.sysRsTmpUser){
      data2update.user.isEditUser='true';
      $scope.sysRequestInit();
  }else{
      tokenSystem.destroyTokenStorage(2);
      tokenSystem.destroyTokenStorage(3);
      $location.path("/login");
  }
  /**************************************************
  *                                                 *
  *             CHECK THE PASSWD STRENG             *
  *                                                 *
  **************************************************/
  $scope.regexChecker = function(value){
    if (value!=undefined && value!=''){
      $scope.regexRules.lowerChar=regexLowerChar.test(value);
      $scope.regexRules.uperChar=regexUperChar.test(value);
      $scope.regexRules.numberChar=regexNumberChar.test(value);
      $scope.regexRules.specialChar=regexSpecialChar.test(value);
      $scope.regexRules.minChar=regexMinChar.test(value);
      console.log("regexRules.lowerChar: "+$scope.regexRules.lowerChar);
    }else{
      $scope.regexRules = {uperChar:false, lowerChar:false, numberChar:false, specialChar:false, minChar:false }
    }
  }
});
