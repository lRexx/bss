/**
* Approve Controller
**/
var sysApproval = angular.module("module.Approval", ["tokenSystem", "angular.filter", "services.Customers","services.Address", "services.User", "ngAnimate", "ngSanitize", "ui.bootstrap", "ui.select", "services.Utilities", "bootstrapLightbox"]);

sysStatus.controller('approvalCtrl', function($scope, $location, $routeParams, blockUI, Lightbox, $timeout, inform, CustomerServices, addressServices, userServices, tokenSystem, $window, serverHost, UtilitiesServices, $filter, APP_SYS){
    console.log(APP_SYS.app_name+" Modulo Approval");
    $scope.sysToken             = tokenSystem.getTokenStorage(1);
    $scope.sysLoggedUser        = tokenSystem.getTokenStorage(2);
    if (!$scope.sysToken || !$scope.sysLoggedUser ){
        $location.path("/login");
    }
    $scope.sysRouteParams = tokenSystem.getTokenStorage(8);
    console.log($scope.sysRouteParams);
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

});