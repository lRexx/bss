  /**
   * Menu Controller
   */
  var menu = angular.module("module.Menu", ["tokenSystem", "angular.filter", "services.Customers", "services.Address", "services.User", "services.Utilities"]);
  menu.directive('allowTyping', function () {
    return {
      restrict : 'A',
      link : function(scope, elem, attrs, ctrl) {
        var regex = attrs.allowTyping;
        elem.bind('keypress', function(event) {
          var pos =  event.target.selectionStart;
          var oldViewValue = elem.val();
          var input = newViewValue(oldViewValue, pos, event.key);
          if ((typeof input === 'string' && input.length==2) || (typeof input === 'number' && input>=1)){
            var validator = new RegExp(regex);
            console.log("regexEval:"+validator.test(input));
              if (!validator.test(input)) {
                event.preventDefault();
                return false;
              }
          }
        });
          function newViewValue(oldViewValue, pos, key) {
            if (!oldViewValue) return key;
            return   [oldViewValue.slice(0, pos), key, oldViewValue.slice(pos)].join('');
          } 
      }
    };
  });
  menu.directive('noSpaces', function() {
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
  menu.controller('MenuCtrl', function($scope, $cookies, $location, $routeParams, $document, $interval, blockUI, $timeout, inform, inputService, CustomerServices, userServices, tokenSystem, addressServices, UtilitiesServices, $window, $filter, APP_SYS, APP_REGEX){
      //if ($location.path() == "/login"){console.log($location.path());}
      console.log("Bienvenido al sistema de "+APP_SYS.app_name);
      console.log("Version v"+APP_SYS.version);
      console.log("Loading Menu Controller");
      //console.log($location.path());
      //$cookies.put('systemToken', "#$%#%$#%$#&%$&%$&54gdfbg3w44t34tgsdvgsd#$234fvds");
      $scope.sysToken             = tokenSystem.getTokenStorage(1);
      $scope.sysLoggedUser        = tokenSystem.getTokenStorage(2);
      $scope.sysLoggedUserModules = tokenSystem.getTokenStorage(6);
      var regexPath = /(\/status\/|\/info\/)+([A-z_]{4,15})+\/\d/;
      var regexPathStatusClient = /^\/status\/client\/\d+$/;
      var regexPathValidateUser = /^\/validate\/token\/+([A-z_]{4,15})+\/\d+$/;
      var currentUrl = $location.path()
      var urlPath = currentUrl.split('/');
      $scope.urlPathSelected1=urlPath[1];
      $scope.urlPathSelected2=urlPath[2];
      //console.log(regexPath);
      //console.log("currentUrl Match with regexPath: ")
      //console.log(currentUrl.match(regexPath));
      //if (!currentUrl.match(statusPath) && (!$scope.sysToken || $scope.sysToken==null || $scope.sysToken==undefined) && (!$scope.sysLoggedUser || $scope.sysLoggedUser==null || $scope.sysLoggedUser==undefined)){
      //  console.log("Redirecting to login page....");
      //  $location.path("/login");
      //}
      /**************************************************
      *                                                 *
      *         PARAMETER TO AUTHORIZE A DEPTO          *
      *                                                 *
      **************************************************/
      //console.log($scope.sysLoggedUser);
      $scope.pattOnlyNumbersX2         = /^[0-9]{1,2}$/;
      $scope.pattX2CharactersNumbersX2 = /^(pb|PB)|^[0-9]{1,2}$/;
      $scope.pattX3CharactersNumbersX3 = /^([a-zA-Z]|[\d])|^[0-9]{1,3}$/;
      $scope.pattOnlyNumbersX6         = /^[0-9]{1,6}$/;
      $scope.counterInformShow = 0;
      $scope.regexStrongPwd=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
      $scope.regexRules = {uperChar:false, lowerChar:false, numberChar:false, specialChar:false, minChar:false } ;
      var regexUperChar    =/^(?=.*[A-Z]).{1,}$/;
      var regexLowerChar   =/^(?=.*[a-z]).{1,}$/;
      var regexNumberChar  =/^(?=.*\d).{1,}$/;
      var regexSpecialChar =/^(?=.*\W).{1,}$/;
      var regexMinChar     =/^.{8,}/;
      $scope.chg = {'pwd1': '', 'pwd2':''};
      $('.modal-backdrop').hide();
      $scope.launchLoader = function(){
        $scope.wLoader  = true;
         $timeout(function() {
           $('#loader').fadeOut();
           $('#wLoader').delay(350).fadeOut('slow'); 
           $scope.wLoader  = false;
         }, 1500);
       }
      /*************************************************************
      *                                                            *
      *               UPDATE SYS LOGGED USER DATA                  *
      *                                                            *
      *************************************************************/
        $scope.updateSysUserLoggedSession = function(idUser){
          userServices.updateLoggedUserData(idUser).then(function(response){
              if(response.status==200){
                  //console.log("User Logged data has been updated");
                  $scope.sysLoggedUser        = tokenSystem.getTokenStorage(2);
                  $scope.sysLoggedUserModules = tokenSystem.getTokenStorage(6);
              }else if (response.status==404){
                  console.log("Something went wrong");
              }
          });
      }
      /**
       * LOAD SYSTEM MODULES AND MENU
       */
        $scope.sysModules = {'idMonitor':false, 'idLlaveros':false, 'idEdificios':false, 'idConfiguracion':false, 'idPerfilUsuario':false, 'idCliente':false, 'idServicio':false, 'idProducto': false, 'idUsers': false};
        $scope.sysLoadModules = function (){
          for (var key in $scope.sysLoggedUserModules){
          switch ($scope.sysLoggedUserModules[key].idModuleFk){
            case "1":
              $scope.sysModules.idMonitor=true;
            break;
            case "2":
              $scope.sysModules.idKeys=true;
            break;
            case "3":
              $scope.sysModules.idEdificios=true;
            break;
            case "4":
              $scope.sysModules.idConfiguracion=true;
            break;
            case "5":
              $scope.sysModules.idPerfilUsuario=true;
            break;
            case "6":
              $scope.sysModules.idCliente=true;
            break;
            case "7":
              $scope.sysModules.idServices=true;
            break;
            case "8":
              $scope.sysModules.idProducto=true;
            break;
            case "9":
              $scope.sysModules.idUsers=true;
            break;
            case "10":
              $scope.sysModules.idPedidos=true;
            break;
            case "11":
              $scope.sysModules.idTechnician=true;
            break;
            default:
          }
          }
        };$scope.sysLoadModules();
       /*********************************************/
       $scope.regexURL = '^((https?|ftp)://)?([A-Za-z]+\\.)?[A-Za-z0-9-]+(\\.[a-zA-Z]{1,4}){1,2}(/.*\\?.*)?$';
       $scope.regexTIME='/([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/';
       $scope.regexDepto = '/([a-zA-Z]|[\d]){1,3}\b$/'
        $scope.modalConfirmationMenu = function(opt, confirm, obj){
          $scope.swMenu = opt;
          $scope.mess2show="";
          console.log("$scope.swMenu: "+$scope.swMenu);
          switch ($scope.swMenu){
            case "closeRequest":
              $('#showModalEmailChange').modal('hide');
            break;
            case "updateSysUser":
              if (confirm==0){
                  if (obj.idUser!=0){
                    if (obj.idProfileKf){$scope.mess2show="El usuario ("+obj.fullNameUser+") bajo el perfil de "+obj.nameProfile+" sera Actualizado.     Confirmar?";}
                      $scope.idUserKf   =  obj.idUser;
                      $scope.argObj = obj;
                      console.log('Usuario a eliminar ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                      console.log("============================================================================")
                      console.log($scope.argObj);
                  }      
                $('#confirmRequestModalMenu').modal('toggle');
              }else if (confirm==1){
                $scope.updateProfileLoggedUser();
                $('#confirmRequestModalMenu').modal('hide');
              }
            break;
            case "updateUserPwd":
              if (confirm==0){
                  if (obj.idUser!=0){
                    if (obj.idProfileKf){$scope.mess2show="Esta seguro que desea hacer el cambio de contraseña.     Confirmar?";}
                      $scope.idUserKf   =  obj.idUser;
                      $scope.argObj = obj;
                      console.log('Usuario a eliminar ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                      console.log("============================================================================")
                      console.log($scope.argObj);
                  }      
                $('#confirmRequestModalMenu').modal('toggle');
              }else if (confirm==1){
                    $scope.sysPwdChangeFn();
                $('#confirmRequestModalMenu').modal('hide');
              }
            break;
            case "logout":
              if (confirm==0){
                  if (obj.idUser!=null){
                      $scope.mess2show  = "Esta seguro que desea cerrar la session, Confirmar?";
                      $scope.idUserKf   =  obj.idUser;
                      $scope.argObj     = obj;
                      console.log('Cierre de session del usuario ID: '+$scope.idUserKf+' BAJO EL NOMBRE: '+obj.fullNameUser);
                      console.log("============================================================================")
                      console.log($scope.argObj);
                  }      
                $('#confirmRequestModalMenu').modal('toggle');
              }else if (confirm==1){
                $scope.logout();
                $('#confirmRequestModalMenu').modal('hide');
              }
            break;
            default:
          }
        }
      /**************************************************
      *                                                 *
      *                   SCHEDULE TIME                 *
      *                                                 *
      **************************************************/
        $scope.sysUpdateUserFn = function(obj){
          $scope.rsUser = {'user':{}}
          $scope.rsUser.user=obj;
          console.log($scope.rsUser);
          userServices.updateUser($scope.rsUser).then(function(data){
            $scope.rsJsonData = data;
            if($scope.rsJsonData.status==200){
              console.log("Usuario: "+obj.fullNameUser+" Successfully updated");
              inform.add('El Usuario: '+obj.fullNameUser+' ha sido actualizado con exito. ',{
                    ttl:3000, type: 'success'
              });
            }else if($scope.rsJsonData.status==500){
              console.log("User not updated, contact administrator");
              inform.add('Error: [500] Contacta al area de soporte. ',{
                    ttl:2000, type: 'danger'
              });
            }
          });
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
      *                SCHEDULE ATENTION                *
      *                                                 *
      **************************************************/
       $scope.setScheduleListFn = function(){
          $scope.list_schedule=[{
                              id    :1,
                              day   :'Lunes',
                              fronAm:'08:00',
                              toAm  :'12:00',
                              fronPm:'17:00',
                              toPm  :'20:00',
                              selected:false
                            },{
                              id    :2,                          
                              day   :'Martes',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'',
                              selected:false                          
                            },{
                              id    :3,
                              day   :'Miercoles',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'',
                              selected:false                          
                            },{
                              id    :4,
                              day   :'Jueves',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'',
                              selected:false                          
                            },{
                              id    :5,
                              day   :'Viernes',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'' ,
                              selected:false                         
                            },{
                              id    :6,
                              day   :'Sabado',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'' ,
                              selected:false                         
                            },{
                              id    :7,
                              day   :'Domingo',
                              fronAm:'',
                              toAm  :'',
                              fronPm:'',
                              toPm  :'',
                              selected:false                          
          }];
       }

      /**************************************************
      *                                                 *
      *             GET STATES & LOCATIONS              *
      *                  LOCAL API                      *
      *                                                 *
      **************************************************/
        $scope.rsStatesData = {};
        $scope.getStatesFn = function(){
          addressServices.getStates().then(function(data){
              $scope.rsStatesData = data;
              //console.log($scope.rsStatesData);
          });
        };
        $scope.getAllLocationsFn = function(){
          addressServices.getAllLocations().then(function(data){
              $scope.rsLocations_All = data;
              $scope.rsLocations_All2 = data;
              //console.log($scope.rsLocations_API_Data);
          });
        };        
      /**************************************************
       *                                                 *
       *                GET TYPE OF IVA                  *
       *                                                 *
       **************************************************/
        $scope.rsTypeOfIVAData = {};
        $scope.getTypeOfIVAFn = function(){
          UtilitiesServices.getTypeOfIVA().then(function(data){
              $scope.rsTypeOfIVAData = data;
              //console.log($scope.rsProfileData);
          });
        };
      /**************************************************
       *                                                 *
       *                GET TYPE OF IVA                  *
       *                                                 *
       **************************************************/
        $scope.rsTypeReasonDownServicesData = {};
        $scope.getTypeReasonDownServicesFn = function(){
          UtilitiesServices.typeReasonDownServices().then(function(response){
              if(response.status==200){
                $scope.rsTypeReasonDownServicesData = response.data;
            }else if(response.status==404){
                inform.add('Error[404]: no se pudo obtener la lista de motivos para dar de baja un contrato/servicio, Contacta al area de soporte. ',{
                    ttl:5000, type: 'warning'
                });
                $scope.rsTypeReasonDownServicesData = null;
            }else if(response.status==500){
                inform.add('Error[500] Contacta al area de soporte. ',{
                    ttl:5000, type: 'danger'
                });
                $scope.rsTypeReasonDownServicesData = null;
            }
          });
        };
      /**************************************************
      *                                                 *
      *                GET TYPE OF MAILS                *
      *                                                 *
      **************************************************/
        $scope.rsTypeOfMailsData = {};
        $scope.getTypeOfMailsFn = function(){
          UtilitiesServices.typeOfMails().then(function(data){
              $scope.rsTypeOfMailsData = data;
              //console.log($scope.rsProfileData);
          });
        };

        /**************************************************
        *                                                 *
        *                     GET AGENTS                  *
        *                                                 *
        **************************************************/
          $scope.rsAgentsData = {};
          $scope.getAgentsFn = function(){
           UtilitiesServices.getAgents().then(function(data){
               $scope.rsAgentsData = data;
               //console.log($scope.rsProfileData);
           });
          };
        /**************************************************
        *                                                 *
        *                     GET AGENTS                  *
        *                                                 *
        **************************************************/
        $scope.rsCostCenterData = {};
        $scope.getCostCenterFn = function(){
         UtilitiesServices.getCostCenter().then(function(data){
             $scope.rsCostCenterData = data;
             //console.log($scope.rsProfileData);
         });
        };
        /**************************************************
        *                                                 *
        *                    GET ZONES                    *
        *                                                 *
        **************************************************/
          $scope.rsZonesData = {};
          $scope.getZonesFn = function(opt){
            UtilitiesServices.getZones().then(function(data){
                $scope.rsZonesData = data;
                if(opt==1){$scope.loadPagination($scope.rsZonesData, "idZona", "10");}
                //console.log($scope.rsZonesData);
            });
          };

        /**************************************************
        *                                                 *
        *       GET CATEGORY TYPES OF BUILDING UNITS      *
        *                                                 *
        **************************************************/
          $scope.rsCategoryDeptoData = {};
          $scope.getCategoryDepartamentFn = function(){
              UtilitiesServices.categoryDepartament().then(function(data){
                  $scope.rsCategoryDeptoData = data;
                  //console.log($scope.rsCategoryDeptoData);
              });
          };
        /**************************************************
        *                                                 *
        *             GET TYPE OF Property                *
        *                                                 *
        **************************************************/
          $scope.rsTypeOfPropertyData = {};
          $scope.typeOfPropertyFn = function(){
              UtilitiesServices.typeOfProperty().then(function(data){
                  $scope.rsTypeOfPropertyData = data;
                  //console.log($scope.rsTypeOfPropertyData);
              });
          };
        /**************************************************
        *                                                 *
        *          GET TYPES OF INTERNET SERVICES         *
        *                                                 *
        **************************************************/
          $scope.rsInternetTypesData = {};
          $scope.getInternetTypesFn = function(opt){
            UtilitiesServices.typeOfInternetServices().then(function(data){
                $scope.rsInternetTypesData = data;
                //console.log($scope.rsProfileData);
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
        *               REQUEST SELECT LIST               *
        *     (status, profile, typeTenant, company)      *
        **************************************************/
          $scope.listProfile      = [];
          $scope.listProfiles     = [];
          $scope.lisTypeTenant    = [];
          $scope.listStatus       = [];
          $scope.listTypeAttendant= [];
          $scope.CallFilterFormU = function(){
            userServices.filterForm().then(function(response){
              if(response.status==200){
                $scope.listProfile      = response.data.profile;
                $scope.listProfiles     = response.data.profiles;
                $scope.lisTypeTenant    = response.data.typeTenant;
                $scope.listStatus       = response.data.status;
                $scope.listTypeAttendant= response.data.typeattendant;
              }else{
                $scope.listProfile      = [];
                $scope.listProfiles     = [];
                $scope.lisTypeTenant    = [];
                $scope.listStatus       = [];
                $scope.listTypeAttendant= [];
              }
            });
          };
          $scope.fnLoadPhoneMask = function(){
            /**********************************************
            *               INPUT PHONE MASK              *
            **********************************************/
              $('.input--phone-no-format').mask('9999999999999');
              $('.input--depto').mask('ZZZ',
                  {
                    translation:{
                      'Z':{
                        pattern: /[a-zA-Z0-9]/
                      }
                    }
                  }
              );
              $('.input-contract-number').mask('ZZZZZZZZZZZZZZZZ',
                  {
                    translation:{
                      'Z':{
                        pattern: /[a-zA-Z0-9-]/
                      }
                    }
                  }
              );               
              $('.input--movil').mask('+54 (####) (15) ####-####',
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
              $('.input--local').mask('+54 (####) ####-####',
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
              $('.input--time').mask('00:00');
              $('.input--date').mask('00r00r0000', {
                  translation: {
                    'r': {
                      pattern: /[\/]/,
                      fallback: '/'
                    },
                    placeholder: "__/__/____"
                  }
                })
            /**********************************************
            *               INPUT DNI MASK                *
            **********************************************/
              $('.input--dni').mask('99999999');
              $('.input--dni').mask('99999999');
              $('.input--number--2').mask('99');
              $('.input--number').mask('999');
              $('.install-password-alarm').mask('******',
              {
                translation:{
                  '*':{
                    pattern: /[0-9]/
                  }
                }
              }
          ); 
              $('.input--depto').mask('ZZZ',
                  {
                    translation:{
                      'Z':{
                        pattern: /[a-zA-Z0-9]/
                      }
                    }
                  }
              );          
              $('.input--floor').mask('XX',
                  {
                    translation:{
                      'X':{
                        pattern: /[a-zA-Z0-9]/
                      }
                    }
                  }
              );
              $('.input--date-number').mask('999999');
              $('.input--date').mask('00/00/0000', {placeholder: "__/__/____"});
              $('.input-ipaddr').mask('099.099.099.099', {placeholder: "___.___.___.___"});
              $('.input-macaddr').mask('ZZ:ZZ:ZZ:ZZ:ZZ:ZZ', 
                  {
                    translation:{
                      'Z':{
                        pattern: /[a-zA-Z0-9]/
                      }
                    },
                    placeholder: "__:__:__:__:__:__"}
              );
              $('.input--decimal').mask('999999,99');
              $('.input--tel.input--dni').on('focus', function () {
                //console.log($(this).val());
                if ($(this).val().length === 0) {
                  $(this).val();
                }
              });
              $('.input--tel.input--dni').keydown(function (e) {
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
          };
        /**************************************************
        *                                                 *
        *           UPDATE PROFILE LOGGED USER            *
        *     (status, profile, typeTenant, company)      *
        **************************************************/
          $scope.profile={};
          $scope.profileUserOpen = function(){
            $scope.profile={};
            $scope.profile=tokenSystem.getTokenStorage(2);
            $('#ProfileModalUser').modal({backdrop: 'static', keyboard: false});
            $('#ProfileModalUser').on('shown.bs.modal', function () {
                $('#profileNames').focus();
            });
            //console.log($scope.profile);
          }
          $scope.updateProfileLoggedUser=function(){
            $scope.rsUser = {'user':{}}
            var isEmailChange = $scope.sysLoggedUser.emailUser != $scope.profile.emailUser?true:false;
            console.log("==========================================");
                $scope.sysLoggedUser.fullNameUser         = $scope.profile.fullNameUser;
                $scope.sysLoggedUser.emailUser            = $scope.profile.emailUser;
                $scope.sysLoggedUser.phoneNumberUser      = $scope.profile.phoneNumberUser;
                $scope.sysLoggedUser.phoneLocalNumberUser = $scope.profile.phoneLocalNumberUser;
                $scope.sysLoggedUser.isEdit               = 1;
                $scope.rsUser.user=$scope.sysLoggedUser;
                $scope.rsUser.user.isEmailChange = isEmailChange;
            console.log($scope.rsUser)
            console.log("==========================================");
            userServices.updateUser($scope.rsUser).then(function(response){
              if(response.status==200){
                console.log("Usuario: "+$scope.rsUser.user.fullNameUser+" Successfully updated");
                inform.add($scope.rsUser.user.fullNameUser+', su perfil ha sido actualizado con exito. ',{
                      ttl:4000, type: 'success'
                });
                if ($scope.rsUser.user.isEmailChange){
                  $('#showModalEmailChange').modal({backdrop: 'static', keyboard: false});
                }
                $('#ProfileModalUser').modal('hide');
                $timeout(function() {
                  $scope.updateSysUserLoggedSession($scope.rsUser.user.idUser);
                }, 1000);
              }else if(response.status==404){
                inform.add('[Error]: '+response.status+', Ocurrio error verifique los datos e intenta de nuevo o contacta el area de soporte. ',{
                  ttl:5000, type: 'danger'
                  });
              }else if(response.status==500){
                console.log("User not updated, contact administrator");
                inform.add('[Error]: '+response.status+', Ha ocurrido un error en la comunicacion con servidor, contacta el area de soporte. ',{
                  ttl:5000, type: 'danger'
                  });
              }
            });
          }
        /**************************************************
        *                                                 *
        *        REMOVER TENANT DE UN DEPARTAMENTO        *
        *                                                 *
        **************************************************/
          $scope.rsAuthtokenListData = [];
          $scope.authorizationTokensFn = function(sysLoggedUser){
            $scope.rsAuthtokenListData = [];
            console.log(sysLoggedUser);
            blockUI.start('Obteniendo listado de token para aprobar.');
            $timeout(function() {
              userServices.geAuthTokentList(sysLoggedUser.idUser).then(function(response){
                  //console.log(response);
                  if(response.status==200){
                    $scope.rsAuthtokenListData = response.data;
                    $('#AuthTokenModalUser').modal({backdrop: 'static', keyboard: false});
                    $('#AuthTokenModalUser').on('shown.bs.modal', function () {
                    });
                  }else if(response.status==404){
                    $scope.rsAuthtokenListData = [];
                  }else if(response.status==500){
                    $scope.rsAuthtokenListData = [];
                  }
                  blockUI.stop();
              });
            }, 1500);
          } 
        /**************************************************
        *                                                 *
        *             CHECK THE PASSWD STRENG             *
        *                                                 *
        **************************************************/
          $scope.regexChecker = function(value){
            if (value!=undefined && value!=''){
              $scope.regexRules.lowerChar   = regexLowerChar.test(value);
              $scope.regexRules.uperChar    = regexUperChar.test(value);
              $scope.regexRules.numberChar  = regexNumberChar.test(value);
              $scope.regexRules.specialChar = regexSpecialChar.test(value);
              $scope.regexRules.minChar     = regexMinChar.test(value);
              //console.log("regexRules.lowerChar: "+$scope.regexRules.lowerChar);
            }else{
              $scope.regexRules = {uperChar:false, lowerChar:false, numberChar:false, specialChar:false, minChar:false }
            }
          }
          $scope.passwdModalUserOpen = function(){
            $scope.chg = {'pwd1': '', 'pwd2':''};
            $('#PasswdModalUser').modal({backdrop: 'static', keyboard: false});
            $('#PasswdModalUser').on('shown.bs.modal', function () {
                $('#pwd1').focus();
            });
          }
        /**************************************************
        *                                                 *
        *           SEND THE NEW PWD TO UPDATE            *
        *                                                 *
        **************************************************/
          $scope.sysPwdChangeFn= function (){
            blockUI.start('Iniciando el cambio de contrañea.');
            $scope.rsUser       = {'user':{}}
            $scope.rsUser.user  = $scope.sysLoggedUser;
            if ($scope.chg.pwd1 == $scope.chg.pwd2){
              $scope.rsUser.user.isPwdChange='true';
              $scope.rsUser.user.passwordUser=$scope.chg.pwd2;
              console.log($scope.rsUser);
              userServices.updateUser($scope.rsUser).then(function(response){
                if(response.status==200){
                  $timeout(function() {
                    blockUI.message('Su contraseña fue cambiada con exito.');
                    inform.add('El cambio de contraseña se ha realizado con exito.',{
                      ttl:4000, type: 'success'
                    });
                  }, 1000);
                  $timeout(function() {
                    $scope.updateSysUserLoggedSession($scope.rsUser.user.idUser);
                    blockUI.stop();
                    $('#PasswdModalUser').modal('hide');
                  }, 2000);
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
          }
          /**************************************************
          *                                                 *
          *            GET ADMINISTRATION LIST              *
          *                                                 *
          **************************************************/
              $scope.buildingCustomerRegistered={
                "searchFilter":null,
                "isNotCliente":"0",
                "idClientTypeFk":null,
                "start":"1",
                "limit":"10",
                "strict": null
              }
              $scope.globalCustomers = {'status':0, 'all':[], 'registered':[],'notRegistered':[],'administrations':[], 'buildings':[], 'branches':[], 'companies':[], 'particulars':[]}
              $scope.globalGetCustomerListFn = function(searchFilter, isNotCliente, idClientTypeFk, isInDebt, start, limit, strict){
                console.log("getting Customers List from Database");
                var searchFilter    = searchFilter!=undefined && searchFilter!=null?searchFilter:null;
                var isNotCliente    = isNotCliente!=undefined && isNotCliente!=null?isNotCliente:"0";
                var idClientTypeFk  = idClientTypeFk!=undefined && idClientTypeFk!=null?idClientTypeFk:null;
                var isInDebt        = isInDebt!=undefined && isInDebt!=null?isInDebt:null;
                var start           = start!=undefined && start!=null?start:"";
                var limit           = limit!=undefined && limit!=null?limit:"";
                var strict          = strict!=undefined && strict!=null?strict:null;
                $scope.getCustomersListRs = {'customerList':null, 'totalNumberOfCustomer':0}
                $scope.buildingCustomerRegistered={
                  "searchFilter":searchFilter,
                  "isNotCliente":isNotCliente,
                  "idClientTypeFk":idClientTypeFk,
                  "isInDebt":isInDebt,
                  "start":start,
                  "limit":limit,
                  "strict":strict
                };
                  return CustomerServices.getCustomerListLimit($scope.buildingCustomerRegistered).then(function(response){
                    if(response.status==200){
                      return response.data;
                    }else if(response.status==404){
                      return response;
                    }
                  });
              };
              
              
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
            $timeout(function() {
              $location.path("/logout");
            }, 1000);
            //$('#logoutmsgbox').modal('hide');
            //$window.location.reload();
          };
        /**************************************************
        *                                                 *
        *             AUTO LOGOUT FUNCTIONS               *
        *                                                 *
        **************************************************/
            // Timeout timer value
            $scope.TimeOutTimeValue   = 900000;//900000; //15 min
            //$scope.TimeOutTimeValue   = 9000;//900000; //15 min
            //$scope.TimeOutTimeValue   = 90000000;//900000; //15 min
            //$scope.TimeOutTimeValue   = 190000;//900000; //15 min
            $scope.IntervalTimerValue   = (20/100)*$scope.TimeOutTimeValue;
            $scope.intervalCountDown = 0;
            $scope.timeOutCountDown  = 0;
            $scope.counterTimeDown   = 0;
            var timeOutCounter;
            var intervalCounter;
            var TimeOut_Thread;
            $scope.loggedOut  = false;
            console.log("Inactivity session timer: "+($scope.TimeOutTimeValue/1000/60));
            console.log("User Warning start from the last: "+Math.round(($scope.IntervalTimerValue/1000/60))+" minutes");
            // Start a timeout
            $scope.warningTimeOut = function(action){
              switch (action){
                case "start_timeout":
                  //Start the no activity timeout of the user
                  $scope.timeOutCountDown  = 0;
                  TimeOut_Thread = $timeout(function(){ $scope.warningTimeOut("close_session");}, $scope.TimeOutTimeValue);
                  $scope.timeOutCountDown  = ($scope.TimeOutTimeValue/1000);
                  $scope.intervalCountDown = ($scope.IntervalTimerValue/1000);

                  timeOutCounter = $interval( function(){
                    $scope.timeOutCountDown--;
                    if ($scope.timeOutCountDown == $scope.intervalCountDown) {
                      $interval.cancel(timeOutCounter);
                      $timeout.cancel(TimeOut_Thread);
                      $scope.warningTimeOut("start_interval");
                    }else{
                      var ms = $scope.timeOutCountDown;
                      var d = new Date(1000*Math.round(ms)); // round to nearest second
                      function pad(i) { return ('0'+i).slice(-2); }
                      $scope.counterTimeOutDown = d.getUTCHours() + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
                      //console.clear();
                      //console.log($scope.counterTimeOutDown);
                    }
                  }, 1000);
                break;
                case "start_interval":
                  $scope.showTimeOutWarning = true;
                  $scope.intervalCountDown = ($scope.IntervalTimerValue/1000);
                  //Start the user Warning
                  intervalCounter = $interval( function(){
                    //console.log($scope.intervalCountDown);
                    var ms = $scope.intervalCountDown;
                    var d = new Date(1000*Math.round(ms)); // round to nearest second
                    function pad(i) { return ('0'+i).slice(-2); }
                    $scope.counterTimeDown = d.getUTCHours() + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
                    $scope.mess2show="La sesión finalizara en "+$scope.counterTimeDown+" minutos.     Desea mantener la sesión activa, Confirmar?";
                    if ($scope.intervalCountDown == 0) {
                      $scope.warningTimeOut("close_session");
                    }else if($scope.timeOutCountDown == $scope.intervalCountDown){
                      $timeout(function() {
                        console.log("La sesión finalizara en "+$scope.counterTimeDown+" minutos.");
                        console.log("============================================================================")
                        //console.log(obj);
                        $('#sessionExpiredModal').modal({backdrop: 'static', keyboard: false});
                        $('#sessionExpiredModal').on('shown.bs.modal', function () {
                          $scope.showTimeOutWarning = true;
                          $scope.mess2show="La sesión finalizara en "+$scope.counterTimeDown+" minutos.     Desea mantener la sesión activa, Confirmar?";
                        });
                        inform.add('Su sesión expirara pronto.' ,{
                          ttl:8000, type: 'warning'
                        });
                      }, 0);
                    }
                    $scope.intervalCountDown--;
                  }, 1000);
                break;
                case "stop_timeout":
                  $scope.showTimeOutWarning = false;
                  $timeout.cancel(TimeOut_Thread);
                  $interval.cancel(timeOutCounter);
                  $scope.warningTimeOut("start_timeout");
                break;
                case "stop_interval":
                  $scope.showTimeOutWarning = false;
                  $('#sessionExpiredModal').modal('hide');
                  $interval.cancel(intervalCounter);
                  $scope.warningTimeOut("start_timeout");
                break;
                case "close_session": 
                  $timeout.cancel(TimeOut_Thread);
                  $interval.cancel(timeOutCounter);
                  $interval.cancel(intervalCounter);                  
                  $timeout(function() {
                    tokenSystem.destroyTokenStorage(1);
                    $scope.sysToken = false;
                    $scope.sysLoggedUser = null;
                  }, 1000);
                  $timeout(function() {
                    $('#sessionExpiredModal').modal('hide');
                    $location.path("/logout");
                  }, 1500);
                break;
              }
            }
            //Actions in case of the timeout is up.
            function NoActivityTimeOut_Resetter(e){
                //console.log(e.type);
                /// Stop the reset the timeout timer
                if (!$scope.showTimeOutWarning){
                  //console.log("Timer count down resetted");
                  $scope.warningTimeOut("stop_timeout");
                }
            }
            $scope.timeOutFn = function(){
              var currentLocation = $location.path();
              if (currentLocation!="/login" && currentLocation!="/register" && currentLocation!="/forgotpwd" && currentLocation!="/newpwd" && currentLocation!="/validate" && !currentUrl.match(regexPathValidateUser) && !currentUrl.match(regexPathStatusClient)){
                  //console.log('starting session timer');
                  $scope.warningTimeOut("start_timeout");
                  //Get the inputs Events of mouse/keyboard to check the activity.
                  var bodyElement = angular.element($document);
                  angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'], 
                  function(EventName) {
                      bodyElement.bind(EventName, function (e) { NoActivityTimeOut_Resetter(e) });  
                  });
              }
            };

            //console.log(currentUrl); && !currentUrl.match(regexPath)
            console.log($location.path()+" - Match: "+currentUrl.match(regexPathStatusClient));
            console.log($location.path()+" - Match: "+currentUrl.match(regexPathValidateUser))
            
            $scope.sysRouteParams = tokenSystem.getTokenStorage(8);
            console.log("$scope.sysToken: "+$scope.sysToken);  
            console.log("$scope.sysLoggedUser: "+$scope.sysLoggedUser);
            console.log("$scope.sysRouteParams:"); 
            console.log($scope.sysRouteParams); 
      if ($location.path() != "/logout" && $location.path() != "/register" && $location.path() != "/forgotpwd" && $location.path() != "/newpwd" && $location.path() !="/validate" && !currentUrl.match(regexPathValidateUser) && !currentUrl.match(regexPathStatusClient)){
        console.log($location.path());
        if (!$scope.sysToken || $scope.sysLoggedUser==undefined || $scope.sysLoggedUserModules==undefined){
          $timeout(function() {
            console.log("Login redirection...");
            $location.path("/login");
          }, 2000);
        }else{
          console.log("Login success, system loading...");
          //$scope.sysLoadLStorage();
          $scope.sysLoadModules();
          $scope.getStatesFn();
          $scope.getAllLocationsFn();
          $scope.setScheduleListFn();
          $scope.getTypeOfIVAFn();
          $scope.getTypeReasonDownServicesFn();
          $scope.getTypeOfMailsFn();
          $scope.getAgentsFn();
          $scope.getCostCenterFn();
          $scope.getZonesFn();
          $scope.getCategoryDepartamentFn();
          $scope.typeOfPropertyFn();
          $scope.getInternetTypesFn();
          $scope.CallFilterFormU();
          $scope.fnLoadPhoneMask();
          $timeout(function() {
            inform.add('Bienvenido Sr/a '+ $scope.sysLoggedUser.fullNameUser,{
                ttl:3000, type: 'info'
            });
            $scope.timeOutFn();
          }, 620);
          $interval( function(){
            if ($scope.sysToken && $scope.sysLoggedUser.idUser!=undefined){
              $scope.updateSysUserLoggedSession($scope.sysLoggedUser.idUser);
            }
          }, 60000);
          if (($scope.sysLoggedUser.idProfileKf!=3 && $scope.sysLoggedUser.idProfileKf!=4 && $scope.sysLoggedUser.idProfileKf!=5 && $scope.sysLoggedUser.idProfileKf!=6) && $scope.sysLoggedUser.idTypeTenantKf==null){
            blockUI.start('Cargando...');
            //$scope.globalGetCustomerListFn(null, null); //LOAD CUSTOMER LIST
            $timeout(function() {
              blockUI.stop(); 
            }, 500);
          }
          if (($scope.sysToken) && ($scope.sysRouteParams.Type!=undefined && $scope.sysRouteParams.info!=undefined) && ($scope.sysLoggedUser!=false || $scope.sysLoggedUser!=undefined)){
            console.log("Redirecting to menu page....");  
            $location.path(currentUrl);
          }else if(($scope.sysToken) && ($scope.sysRouteParams.Type!=undefined || $scope.sysRouteParams.info!=undefined) && ($scope.sysLoggedUser!=false || $scope.sysLoggedUser!=undefined)){
            var switch_opt=$scope.sysRouteParams.Type!=undefined && $scope.sysRouteParams.info==undefined?$scope.sysRouteParams.Type:$scope.sysRouteParams.info
            switch (switch_opt){
              case "depto":
                $location.path("/buildings");
              break;
              case "ticket":
                $location.path("/monitor");
              break;
              case "info":
                $location.path("/info");
              break;
              case "status":
                $location.path("/status");
              break;
              default:
            }
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
          }

          
        }
      }
      $scope.getRoute = function(route){
        return route === $location.path();
      }
  });