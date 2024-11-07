var Logout = angular.module("module.Logout", ["tokenSystem", "ngCookies", "services.User", "services.Ticket", "services.Departments"]);

 Logout.controller('LogoutCtrl', function($scope, $cookies, $location, $routeParams, blockUI, $timeout, DepartmentsServices, inform, inputService, ticketServices, userServices, tokenSystem, serverHost, serverBackend, $window, APP_SYS){
  console.log(APP_SYS.app_name+" Modulo Login Out User");
  blockUI.stop();
    // Clear session storage with a slight delay
    $timeout(function() {
        sessionStorage.clear(); // Clear all session storage items just to ensure all are removed
        // Redirect after delay to allow storage to clear
    }, 100);
    $timeout(function() {
      blockUI.start('Cerrando sesión...');
      $scope.sysToken   = false;
      $scope.rsJSON = "";
      $scope.sysLoggedUser = null;
      tokenSystem.destroyTokenStorage(1);
      //$location.path("/login");
    }, 1000);
    $timeout(function() {
      $scope.loggedOut  = true;
      $('#logoutmsgbox').modal({backdrop: 'static', keyboard: false});
      $('#logoutmsgbox').on('shown.bs.modal', function () {
        $scope.sysToken   = false;
        $scope.sysLoggedUser = null;
        tokenSystem.destroyTokenStorage(1);
      });
      blockUI.stop();
    }, 2000);
    /**************************************************
    *                                                 *
    *                LOGOUT FUNCTION                  *
    *                                                 *
    **************************************************/
        $scope.logout = function(){
          $scope.rsJSON = "";
          tokenSystem.destroyTokenStorage(1);
          $scope.sysToken = false;
          $scope.sysLoggedUser = null;
          $location.path("/logout");
          $('#logoutmsgbox').modal('hide');
          $timeout(function() {
            $window.location.reload();
          }, 2000);
        };
});

