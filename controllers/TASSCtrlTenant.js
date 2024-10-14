
app.controller('coferbaCtrlTenant', function($scope, $rootScope, $location, $http, blockUI, $timeout, inform, $window){
$scope.noLogin = {email:''};
$scope.noLoginToken = false;
$scope.checkTokens = function(){
      if (!$scope.noLoginToken){
        console.log($scope.noLoginToken);
        location.href="/coferba/Frond/Modules/";
      }
}
$scope.sysLoadLStorage = function(){
	$scope.noLoginToken = localStorage.getItem("noLoginToken");
}
$scope.sysNoLoginTenant = function(){
	 $scope.searchTenantByMail();
}



/**************************************************
*                                                 *
*         BUSCAR INQUILINO POR EL EMAIL           *
*                                                 *
**************************************************/

$scope.searchTenantByMail = function (){
  $http({
        method : "GET",
        url : $scope.serverHost+"Coferba/Back/index.php/Tenant/findByEmail/"+$scope.noLogin.email
      }).then(function mySuccess(response) {
            $scope.rsTenantData = response.data;
            console.log("<<<INQUILINO ENCONTRADO>>>");
            console.log(response.data);
            
            localStorage.setItem("noLoginToken", true);
            $scope.noLoginToken = localStorage.getItem("noLoginToken");
            location.href="#/nologinuser";
            console.log("LA VARIABLE LOCALSTORAGE ES: "+$scope.noLoginToken);
            /*VALIDAMOS CUANDO SE LOGUEA UN USUARIO PROPIETARIO Y OBTENES SU ID DE INQUILINO*/
            /*if($scope.isLogin==true){
              $scope.idTenantmp = response.data.idTenant;
              localStorage.setItem("idTenantUser", $scope.idTenantmp);
              location.href = "index.html"
            }*/
            /*VALIDACIONES SI LA PETICION NO ES DE BUSQUEDA*/
            /*if($scope.tSearch==false){
              if($scope.manageDepto>=0){
                $scope.idTenantKf              =  $scope.rsTenantData.idTenant;
                $scope.t.idTypeKf              =  $scope.rsTenantData.idTypeKf;
                  if($scope.IsTicket==true){
                    console.log("<<<PROCESO DE GESTION DE TICKET>>>")
                    if($scope.IsTenant==true){
                      console.log("<<<CARGAMOS LOS DATOS SELECCIONADOS DEL TENANT AL FORMULARIO DEL ALTA/BAJA>>>");
                      $scope.tenant.namesTenant      =  $scope.rsTenantData.fullNameTenant;
                      $scope.tenant.localPhoneTenant =  $scope.rsTenantData.phoneNumberContactTenant;
                      $scope.tenant.movilPhoneTenant =  $scope.rsTenantData.phoneNumberTenant;
                      $scope.tenant.emailTenant      =  $scope.rsTenantData.emailTenant;
                      $scope.enabledNextBtn();
                    }
                  }
                  if(!$scope.IsAttendant && $scope.t.idTypeKf==1){
                    console.log("PASO 1, Function Add TENANT: "+$scope.IsTenant+" And Type Tenant: "+$scope.t.idTypeKf+" Department: "+$scope.select.idDepartmentKf);
                    $scope.consoleMessage="==>SE ASIGNA EL DEPTO"+$scope.select.idDepartmentKf+" Y ES APROBADO AL PROPIETARIO: "+$scope.tenant.namesTenant+" SATISFACTORIAMENTE";
                  }
                  if($scope.IsAttendant && $scope.t.idTypeKf==1){
                    console.log("PASO 1, Function Add ATT: "+$scope.IsAttendant+" And Type Tenant: "+$scope.t.idTypeKf+" Department: "+$scope.att.idDepartmentKf);
                    $scope.consoleMessage="==>SE ASIGNA EL DEPTO: "+$scope.att.idDepartmentKf+" Y ES APROBADO AL ENCARGADO: "+$scope.t.fullNameTenant+" SATISFACTORIAMENTE";
                  }
              }
              if($scope.sessionidProfile!=3 && $scope.t.idTypeKf==1){
                console.log("<<<PROCESO DE ASIGNACIONDE DEPTO AL INQUILINO DE TIPO PROPIETARIO Y APROBACION>>>");
                if ($scope.manageDepto==0){$scope.tmp.idDeparmentKf=!$scope.IsAttendant ? $scope.select.idDepartmentKf : $scope.att.idDepartmentKf;}else
                {$scope.tmp.idDeparmentKf=!$scope.IsAttendant ? $scope.idDeptoKf : $scope.att.idDepartmentKf;}
                
                console.log($scope.consoleMessage);
                $scope.fnAssignDepto($scope.tmp.idDeparmentKf,1);
              }else{
                console.log("<<<NO TIENE PRIVILEGIOS PARA ASIGNAR Y/O APROBAR UN DEPARTAMENTO>>>");
              }
            }*/
            /*VALIDACIONES SI LA PETICION ES DE BUSQUEDA*/
            /*if($scope.tSearch==true){
              if (!$scope.Token && $scope.rsTenantData.idTypeKf==1){
                console.log("==>USUARIO PROPIETARIO ENCONTRADO => SE ACTUALIZAN DATOS");
                $scope.t.idTenant                 = $scope.rsTenantData.idTenant;
                $scope.t.idTypeKf                 = $scope.rsTenantData.idTypeKf;
                $scope.t.idDepartmentKf           = $scope.rsTenantData.idDepartmentKf;
              }else if ($scope.Token && $scope.rsTenantData.idTypeKf==1){
                console.log("==>PROPIETARIO ENCONTRADO => SE ACTUALIZAN DATOS"); 
              }else if ($scope.Token && $scope.rsTenantData.idTypeKf==2){
                console.log("==>INQUILINO ENCONTRADO => SE ACTUALIZAN DATOS"); 
              }
              $scope.sysFunctionsTenant('update');
              $scope.tSearch=false;
              /*
              $scope.t.fullNameTenant           =
              $scope.t.idTypeKf                 =
              $scope.t.phoneNumberTenant        =
              $scope.t.phoneNumberContactTenant =
              $scope.t.emailTenant              =
              

            }*/
        }, function myError(response) {
            /*if($scope.tSearch==true){console.log("====>INQUILINO NO ENCONTRADO => INICIO DE REGISTRO"); 
            $scope.sysFunctionsTenant('addT'); $scope.tSearch=false;}*/
            inform.add("Correo no registrado :" +$scope.noLogin.email,{
                          ttl:5000, type: 'danger'
               });
            $scope.noLoginToken = 0;
      });
};
/**************************************************/

$scope.noLoginOut = function(){
	localStorage.clear();
	$scope.noLoginToken = false;
	location.href="/coferba/Frond/Modules/";

}

});
