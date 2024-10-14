var moduleForgotPwd = angular.module("module.ForgotPwd", ["tokenSystem", "services.User"]);

moduleForgotPwd.controller('ForgotPwdCtrl', function($scope, $rootScope, $location, $http, blockUI, inputService, userServices, $timeout, tokenSystem, serverHost, inform, $window){

  $scope.forgot={email: ''};
  $scope.redirectSuccessfull = false;
  $scope.counT  =5;
  $scope.redirect ="#/login";
  tokenSystem.destroyTokenStorage(2);
  $scope.sysToken = tokenSystem.getTokenStorage(1);
  $scope.sysRsTmpUser = tokenSystem.getTokenStorage(3);
  
  if (!$scope.sysRsTmpUser){
        setTimeout(function() {
        $('#forgotemail').addClass('active');
        $('#forgotemail').focus();
        }, 100);

  }else{
        $scope.forgot.email = $scope.sysRsTmpUser.emailUser
        setTimeout(function() {
        $('#forgotemail').addClass('active');
        $('#sendBtnForgotpwd').focus();
        }, 100);

  }
       
  
  /**************************************************
  *                                                 *
  *                LOST PWD USER                    *
  *                                                 *
  **************************************************/
  $scope.sysPwdRequest = function(){
    if($scope.forgot.email == $scope.sysRsTmpUser.emailUser){
      $scope.recoverPwdUser();
    }else{
      $scope.sysCheckEmail();
    }

  }
  /**************************************************
  *                                                 *
  *             REQUEST PWD FUNCTION                *
  *                                                 *
  **************************************************/
  $scope.recoverPwdUser = function (){
      userServices.recoverPwd($scope.requestNewPwd()).then(function(data){
        $scope.recovPwdResult = data;
        if($scope.recovPwdResult){
          $scope.redirectSuccessfull = true;
          $scope.countDownRedirect($scope.redirect, $scope.counT);
        }

      });
  }
  $scope.sysCheckEmail = function(){
    if($scope.forgot.email){
      userServices.checkUserMail($scope.forgot.email, "forgotPwd").then(function(data) {
        $scope.mailCheckResult= data; 
          if(!$scope.mailCheckResult){
            var attempsToken = JSON.parse(localStorage.getItem("attempsToken"));
            $scope.mailCheckCount = attempsToken.attempsCount;
            if($scope.mailCheckCount==3){
              $scope.checkEmailLogin = 1;
              $scope.msg1="Ha realizado "+$scope.mailCheckCount+" intentos fallidos de ingreso con el correo "+$scope.forgot.email;
              $scope.msg2="Desea realizar el registro de usuario?";
              $('#confirmRequestModal').modal('show');
                    $scope.mailCheckCount++;
                    $("#forgotemail").popover({
                      container: 'body',
                      placement:'auto right',
                      trigger: 'manual',
                      title: '<div>Soporte coferba</div>',
                      template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-footer"><button type="button" class="btn btn-sm btn-success modalYes">Si</button>&nbsp<button type="button" class="btn btn-sm btn-danger modalNo" data-dismiss="modal">No</button></div></div>',
                      html: true
              }); 
              $("#forgotemail").popover('show');
            }else{
              inform.add('El Correo: '+ $scope.forgot.email + ', no se encuentra registrado, verifique los datos ingresados.',{
                ttl:4000, type: 'warning'
              });
              console.log("Email No registrado / "+ $scope.forgot.email);
            }
          }else{
            $scope.recoverPwdUser();
          }
      });
    }
  }
  $scope.requestNewPwd = function () {
    var user =
            {
              user:{
                      emailUser: $scope.forgot.email
                    }
            };
      return user;
  };
  /**************************************************
  *                                                 *
  *            Modal de confirmacion                *
  *                                                 *
  **************************************************/
  $(document).on("click", ".popover-footer .modalYes" , function(){
    $("#forgotemail").popover('hide');
    $scope.modalConfirmation("register");
  });
  $(document).on("click", ".popover-footer .modalNo" , function(){
    $("#forgotemail").popover('hide');
    $scope.modalConfirmation("login");
  });
  $scope.modalConfirmation = function(value){
      switch (value){
        case 'register':
          $scope.redirect2Register = true;
          $scope.countDownRedirect("#/register", 3);
        break;
        case 'login':
          $scope.countDownRedirect("#/login", 3);
        break;

        default:
      }
  }
  /**************************************************/
  $scope.inputCheckCss = function (obj) {
    var $this      = $('input[name*='+obj+']');
    var inputObj   = $this
    var inputValue = $this.val();
    inputService.setClass(inputValue, inputObj);
  }
});
