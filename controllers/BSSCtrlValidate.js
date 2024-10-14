/**
* Validate Controller
**/
var sysValidation = angular.module("module.Validate", ["tokenSystem", "angular.filter", "services.Customers", "services.Departments","services.Address", "services.Products", "services.Contracts", "services.Service", "services.User", "ngAnimate", "ngSanitize", "ui.bootstrap", "ui.select", "services.Utilities", "bootstrapLightbox"]);

sysValidation.controller('ValidationCtrl', function($scope, $location, $routeParams, blockUI, $q, Lightbox, $timeout, inform, DepartmentsServices, CustomerServices, ProductsServices, ContractServices, serviceServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo Validation");
    console.log($routeParams);
    if ($routeParams.secureToken!=undefined){
      tokenSystem.setRouteParamsStorage($routeParams);
    }
    $scope.sysRouteParams = tokenSystem.getTokenStorage(8);
    $location.path("/validate");
    const hasReloadedKey = 'hasReloaded';

    // Función para recargar la página solo una vez
    function reloadOnce() {
        if (!sessionStorage.getItem(hasReloadedKey)) {
            // Establecer el estado en localStorage para evitar recargas adicionales
            sessionStorage.setItem(hasReloadedKey, 'true');
            
            // Recargar la página
            console.log("reloading windows!!")
            window.location.reload();
        }
    }
    $timeout(function() {
      reloadOnce();
    }, 500);
    var currentUrl = $location.path()
    var urlPath = currentUrl.split('/');
    $scope.urlPathSelected=urlPath[1];
    if (!$scope.sysToken && !$scope.sysLoggedUser && !$scope.sysLoggedUserModules && sessionStorage.getItem(hasReloadedKey)){

    /***************************************************************************
    *                                                                          *
    *   PARAMETER TO RECEIVED TO CHECK WETHER A CLIENT IS ENABLE OR DISABLE    *
    *                                                                          *
    ****************************************************************************/
        /**************************************************
        *                                                 *
        *        REMOVER TENANT DE UN DEPARTAMENTO        *
        *                                                 *
        **************************************************/
        $scope.serviceResponse=undefined;
        $scope.validateAccountFn = function(token){
          console.log("secureToken: "+secureToken);
          //blockUI.start('Validando cuenta.');
          userServices.validateAccount(token).then(function(response){
              console.log(response);
              $scope.serviceResponse=response;
              if(response.status==200){
                  inform.add('Email confirmado satisfactoriamente.',{
                      ttl:10000, type: 'success'
                  });
                  $('.circle-loader').toggleClass('load-complete');
                  $('.checkmark').toggle();
                  //blockUI.start('Esta siendo redireccionado al Login.');
                  $timeout(function() {
                      tokenSystem.destroyTokenStorage(1);
                      //blockUI.stop();
                  }, 100);
              }else if(response.status==404){
                $scope.confirmAccount.secureToken=true;
                inform.add('Token de seguridad invalido o ya ha sido confirmado, intente nuevamente, en caso contrario por favor comuniquese con el soporte de BSS.',{
                  ttl:15000, type: 'danger'
                });
                //blockUI.stop();
              }else{
                inform.add('Ocurrio un error validando su cuenta, por favor comuniquese con el soporte de BSS.',{
                  ttl:15000, type: 'danger'
                });
                //blockUI.stop();
              }
              
          });
        }
      //https://devbss.sytes.net/validate/token/dfgt34534gdfgfdgdfgdfg
      

      console.log("$scope.sysToken: "+$scope.sysToken);  
      console.log("$scope.sysLoggedUser: "+$scope.sysLoggedUser);
      console.log("$scope.sysRouteParams:"); 
      console.log($scope.sysRouteParams);
      if ($scope.sysRouteParams.secureToken!=undefined){
        console.log("===========================================");
        console.log("    Parameters for Email Confirmation      ");
        console.log("===========================================");
        console.log($scope.sysRouteParams);
      $scope.confirmAccount={'secureToken':false}
      if($scope.sysRouteParams){
        if ($scope.sysRouteParams.secureToken!=undefined){
          console.log("Validating token: "+$scope.sysRouteParams.secureToken);
          var secureToken = $scope.sysRouteParams.secureToken;
          $scope.validateAccountFn(secureToken);
        }else{
          $location.path("/login");
        }

      }else{
        inform.add('Numero de token no ha sido recibido',{
            ttl:5000, type: 'warning'
          });
      }
    }
  }
});