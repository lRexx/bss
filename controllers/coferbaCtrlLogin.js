var moduleLoginUser = angular.module("module.LoginUser", ["tokenSystem", "services.User"]);


moduleLoginUser.controller('LoginCtrl', function($scope, $location, $http, $routeParams, blockUI, $timeout, inform, inputService, userServices, tokenSystem, serverHost, serverBackend, $window){

  $scope.login               = {email:'', passwd:''};
  $scope.signup              = {email:''};
  $scope.signupUser          = false;
  $scope.loginUser           = true;
  $scope.mailCheckResult     = 0;
  $scope.loginResult         = 0;
  $scope.mailCheckCount      = 0;
  $scope.redirect2NewPwd     = false;
  $scope.redirect2RestorePwd = false;
  $scope.redirect2Register   = false;
  $scope.redirect2MainApp    = false;
  $scope.swOption            = "";
  tokenSystem.destroyTokenStorage(4);
  $scope.counT  =5;
  $scope.redirect ="#/mainapp";
  $scope.sysToken      = tokenSystem.getTokenStorage(1);
  $scope.sysLoggedUser = tokenSystem.getTokenStorage(2);
  if ($scope.sysToken || $scope.sysLoggedUser ){
      location.href = $scope.redirect;      
  }

  /**************************************************
  *                                                 *
  *         PARAMETER TO AUTHORIZE A TICKET         *
  *                                                 *
  **************************************************/

  /* USAGE: /login/auth/ticket/id/tokenId/token/secureToken */
  if($routeParams.ticketId && $routeParams.secureToken){
    $scope.ticketId = $routeParams.ticketId;
    $scope.secureToken = $routeParams.secureToken;
    console.log("$scope.ticketId :" +$scope.ticketId+"$scope.secureToken: "+$scope.secureToken);
    inform.add('Inicia la sesion para autorizar el ticket:  '+$scope.ticketId,{
    ttl:5000, type: 'info'
    });
  }
    

    

  /**************************************************
  *                                                 *
  *       VALIDACION DE EMAIL ANTES DEL LOGIN       *
  *                                                 *
  **************************************************/
  $scope.sysCheckEmailLogin = function(){
    if($scope.login.email){
      userServices.checkUserMail($scope.login.email, "login").then(function(data) {
        $scope.mailCheckResult= data;
        //console.log("[sysCheckEmailLogin] --> mailCheckResult: "+$scope.mailCheckResult); 
          if(!$scope.mailCheckResult || $scope.mailCheckResult==500){
            if($scope.mailCheckResult==500){
              inform.add('[Error]: '+$scope.mailCheckResult+', Ha ocurrido un error en la comunicacion con servidor, contacta el area de soporte. ',{
              ttl:5000, type: 'danger'
              });
            }else{
              var attempsToken = JSON.parse(localStorage.getItem("attempsToken"));
              $scope.mailCheckCount = attempsToken.attempsCount;

              if($scope.mailCheckCount==3){
                $scope.checkEmailLogin = 1;
                console.log($scope.mailCheckCount);
                $scope.swOption = "register";
                $scope.msg1="Ha realizado "+$scope.mailCheckCount+" intentos fallidos de ingreso con el correo "+$scope.login.email;
                $scope.msg2="Desea realizar el registro de usuario?";
                $('#confirmRequestModal').modal('show');
                      $scope.mailCheckCount++;
                      $("#loginEmail").popover({
                        container: 'body',
                        placement:'auto right',
                        trigger: 'manual',
                        title: '<div>TASS seguridad</div>',
                        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-footer"><button type="button" class="btn btn-sm btn-success modalYes">Si</button>&nbsp<button type="button" class="btn btn-sm btn-danger modalNo" data-dismiss="modal">No</button></div></div>',
                        html: true
                }); 
                $("#loginEmail").popover('show');
              }else{
                console.log($scope.mailCheckResult);
                inform.add('El Correo: '+ $scope.login.email + ', no se encuentra registrado, verifique los datos ingresados.',{
                  ttl:4000, type: 'warning'
                });
                console.log("Email No registrado / "+ $scope.login.email);
              }
            }
          }else{
            var sysCheckEmailLogin=true;
            $scope.sysLoginUser();
          }
      });
    }
  }  
  /**************************************************/

  /**************************************************
  *                                                 *
  *        VALIDACION DE PWD ANTES DEL LOGIN        *
  *                                                 *
  **************************************************/
  $scope.sysCheckPasswordLogin = function(){
    var attempsToken = JSON.parse(localStorage.getItem("attempsToken"));
      $scope.mailCheckCount = attempsToken.attempsCount;
      if($scope.mailCheckCount==3){
        $scope.checkPasswdLogin = 1;
        console.log($scope.mailCheckCount);
        $scope.msg1="Ha ingresado en "+$scope.mailCheckCount+" oportunidades la clave incorrecta. ";
        $scope.msg2="Desea restablecer la Contrase&#241a de su cuenta?";
        $('#confirmRequestModal').modal('show');
              $scope.mailCheckCount++;
              $("#loginpassword").popover({
                container: 'body',
                placement:'auto right',
                trigger: 'manual',
                title: '<div>TASS seguridad</div>',
                template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title pop-warning"></h3><div class="popover-content"></div><div class="popover-footer"><button type="button" class="btn btn-sm btn-success modalYes">Si</button>&nbsp<button type="button" class="btn btn-sm btn-danger modalNo" data-dismiss="modal">No</button></div></div>',
                html: true
        }); 
        $("#loginpassword").popover('show');
      }else{
        inform.add('Ha ingresado una Contrasena incorrecta, verifique los datos ingresados.',{
          ttl:4000, type: 'warning'
        });
        console.log("Email No registrado / "+ $scope.login.email);
      }
  }
  /**************************************************/
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
          $scope.countDownRedirect("#/mainapp", 3);
        break;
        case 2:
          $scope.redirect2NewPwd = true;
          $scope.countDownRedirect("#/newpwd", 3);
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
  /**************************************************/
  /**************************************************
  *                                                 *
  *         RECOLECCIONDE DATOS DE USUARIO          *
  *                                                 *
  **************************************************/
  $scope._getLoginData = function () {
    var dataUser =
            {
                 user: { 
                          fullNameUser : $scope.login.email,
                          passwordUser : $scope.login.passwd
                        }
            };
    return dataUser;
  };
  /**************************************************/
  /**************************************************
  *                                                 *
  *    VALIDACION DE EMAIL ANTES DEL REGISTRARSE    *
  *                                                 *
  **************************************************/
  $scope.sysCheckBeforeSignup = function(){
    userServices.checkUserMail($scope.signup.email, "register").then(function(data) {
      $scope.mailCheckResult= data; 
        if($scope.mailCheckResult){
          console.log("Mail check attemps: "+$scope.mailCheckCount);
          $scope.swOption = "forgotpwd";
          $scope.msg1="El correo "+$scope.signup.email+", se encuentra registrado en nuestro sistema.";
          $scope.msg2="Desea restablacer su clave?";
          $('#confirmRequestModal').modal('show');
            $("#signupemail").popover({
              container: 'body',
              placement:'auto right',
              trigger: 'manual',
              title: '<div>TASS seguridad</div>',
              template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-footer"><button type="button" class="btn btn-sm btn-success modalYes">Si</button>&nbsp<button type="button" class="btn btn-sm btn-danger modalNo" data-dismiss="modal">No</button></div></div>',
              html: true
          }); 
          $("#signupemail").popover('show');
          inform.add('El correo: '+ $scope.signup.email + ', se encuentra registrado, puede ingresar con su clave o restablecerla si no la recuerda.',{
            ttl:4000, type: 'success'
          });
          console.log("Email registrado / "+ $scope.signup.email);
        }else{
          $scope.redirect2Register = true;
        $scope.countDownRedirect("#/register", 5);

        }
    });
  } 

  /**************************************************
  *                                                 *
  *            Modal de confirmacion                *
  *                                                 *
  **************************************************/
  $(document).on("click", ".popover-footer .modalYes" , function(){
        if($scope.login.email && $scope.checkEmailLogin){
          $("#loginEmail").popover('hide');
          $scope.modalConfirmation("register");
        }else if($scope.login.email && $scope.checkPasswdLogin){
          $("#loginpassword").popover('hide');
          $scope.modalConfirmation("forgotpwd");
        }else if($scope.signup.email){
          $("#signupemail").popover('hide');
          $scope.modalConfirmation("forgotpwd");
        }
  });
  $(document).on("click", ".popover-footer .modalNo" , function(){
          $("#loginEmail").popover('hide');
          $("#signupemail").popover('hide');
          $("#loginpassword").popover('hide');
  });
  $scope.modalConfirmation = function(value){
      switch (value){
        case 'register':
          $scope.redirect2Register = true;
          $scope.countDownRedirect("#/register", 3);
        break;
        case 'forgotpwd':
          $scope.redirect2RestorePwd = true;
          $scope.countDownRedirect("#/forgotpwd", 3);
        break;

        default:
      }
  }
  /**************************************************/



  /**************************************************
  *                                                 *
  *         TRANSICIÓN DE LOGIN A REGISTRO          *
  *                                                 *
  **************************************************/
  var $loginMsg  = $('.textcontent1'),
      $signupMsg = $('.textcontent2'),
      $frontbox  = $('.frontbox');

  $scope.fnLoginToggle = function(swLogin){
    switch (swLogin){
      case 1:
        $frontbox.addClass('moving');
        $scope.signupUser=true; 
        $scope.loginUser=false;
        $scope.signup  = {email:''};
        $scope.login   = {email:'', passwd:''};
        $("#loginEmail").popover('hide');
        $("#signupemail").popover('hide');
      break;
      case 2:
        $frontbox.removeClass("moving");
        $scope.signupUser=false; 
        $scope.loginUser=true;
        $scope.signup  = {email:''};
        $scope.login   = {email:'', passwd:''};
        $("#loginEmail").popover('hide');
        $("#signupemail").popover('hide');
      break;
      default:

    }
  }
  /**************************************************/
  $scope.checkUserAdd = function(){ 
    $scope.$on('message', function(event, response) {
        console.log(response);
    });
    if($scope.mensajeTest){       
      inform.add('Usuario registrado con exito. ',{
                  ttl:2000, type: 'success'
      });
    }
    //console.log($scope.mensajeTest);
  }

  $scope.inputCheckCss = function (obj) {
      var $this      = $('input[name*='+obj+']');
      //console.log($this)
      var inputObj   = $this
      var inputValue = $this.val();
      inputService.setClass(inputValue, inputObj);
  }

});

