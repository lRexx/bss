var moduleDepartmentsServices = angular.module("services.Departments", ["tokenSystem", "services.User"]);

moduleDepartmentsServices.service("DepartmentsServices", ['$http', '$q', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, $q, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var rsJson = {};
      var sndJson= {};
      var checkResult =0;
      var deferred = $q.defer();
      return {
        getDeptoById: function(idDepto) {
          //console.log(serverHeaders);
            console.log("[Service][approveOwnerDepto]---> idDepto: "+idDepto);
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Department/find/"+idDepto
                }).then(function onSuccess(response) {
                    deferred.resolve(response);
                    return deferred.promise;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                    deferred.resolve(response);
                    return deferred.promise;
                });
        },
        byIdDireccion: function(idClient, idStatus) {
            //console.log(serverHeaders);
              console.log("[Service][byIdDireccion] idClient---> "+idClient+" | idStatus---> "+idStatus);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Department/byIdDireccion/"+idClient+"/"+idStatus
                  }).then(function onSuccess(response) {
                      return response;

                  }).catch(function onError(response) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                      return response;
                  });
        },
        /* CHECK IF A DEPTO HAS A OWNER ASSIGNED*/
        chekDepartamenteOwner: function(id) {
          console.log("[Department Services] => Check Department Owner ");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Department/chekDepartamenteOwner/"+id
            }).then(function onSuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
              return response;
            });   
        },
        approveDepto: function(idDepto) {
          //console.log(serverHeaders);
            console.log("[Service][approveDepto]---> idDepto: "+idDepto);
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Department/aprobated/"+idDepto
            }).then(function onSuccess(response) {
                console.log("[Service][approveDepto]---> idDepto: "+idDepto+" (Successfully Approved)");
                return response;

            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                return response;
            });
        },
        approveOwnerDepto: function(idDepto) {
          //console.log(serverHeaders);
            console.log("[Service][approveOwnerDepto]---> idDepto: "+idDepto);
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Department/aprobated/"+idDepto
                }).then(function onSuccess(response) {
                    deferred.resolve(response);
                    return deferred.promise;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                    deferred.resolve(response);
                    return deferred.promise;
                });
        },
        approveTenantDepto: function(idUser, idStatus) {
          //console.log(serverHeaders);
            console.log("[Service][approveTenantDepto]---> idDepto: "+idUser+' / idStatus: '+idStatus);
            return $http({
                  method : "GET",
                  url: serverHost+serverBackend+"Department/deptoTenantStatus/"+idUser+"/"+idStatus
                }).then(function onSuccess(response) {
                    console.log("[Service][approveTenantDepto]---> idDepto: "+idUser+" (Successfully Approved)");
                    return response;

                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                    return response;
                });
        },
        approveTenantDepartment: function(data) {
          console.log("[Service][approveTenantDepto]---> Department to Approve: "+data.user.idDepartmentKf);
          return $http.post(serverHost+serverBackend+"Department/approveTenantDepartment",data, serverHeaders)
            .then(function mySucess(response) {
               return response;
          }).catch(function onError(response) {
              console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
               return response;
          });
      },
        assignDepto: function(userData2Assign) {
            console.log("[Service][assignDepto]---> Department to Assign: "+userData2Assign.department.idDepartment);
            return $http.post(serverHost+serverBackend+"Department/update",userData2Assign, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
        },
        unAssignDepto: function(userData2UnAssign) {
          console.log("[Service][unassignDepto]---> Department to Unassign: "+userData2UnAssign.department.idDepartment);
          return $http.post(serverHost+serverBackend+"Department/update",userData2UnAssign, serverHeaders)
            .then(function mySucess(response) {
              deferred.resolve(response);
              return deferred.promise;
          }).catch(function onError(response) {
              console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
              deferred.resolve(response);
              return deferred.promise;
          });
        },
        removeTenantDepto: function(userData2Remove) {
            console.log("[Service][removeTenantDepto]---> Department to remove: "+userData2Remove.info.idDepartmentKf);
            return $http.post(serverHost+serverBackend+"Department/removeTenant",userData2Remove, serverHeaders)
              .then(function mySucess(response) {
                console.log("[Service][removeTenantDepto]---> Department N°: "+userData2Remove.info.idDepartmentKf+" (Successfully removed)");
                return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                return response
            });
        },
        listTenant2AssignedDeptoByIdDepto: function(id) {
          //console.log("[Department Services] => List tenant assigned to the Depto selected by ID ");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"tenant/allByIdDepartament/"+id
            }).then(function onSuccess(response) {
                return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
                return response;
            });
        },
        listTenantsWithoutKeyAssignedByIdDepto: function(id) {
          //console.log("[Department Services] => List tenant assigned to the Depto selected by ID ");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"tenant/allWithoutKeyAssignedByIdDepartament/"+id
            }).then(function onSuccess(response) {
                return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
                return response;
            });
        },
        listTenant2AssignedDeptoByIdDeptoByTypeTenant: function(idDepto, idTypeTenant) {
          console.log("[Department Services] => List tenant assigned to the Depto selected by ID ");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"tenant/tenanatByIdDepartament/"+idDepto+"/"+idTypeTenant
            }).then(function onSuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
              return response;
            });
        },
        listDepartmentsByIdOwner: function(idDepto, idUser, idStatus, idTypeTenant) {
          //console.log("[Department Services] => List Departments assigned to the owner ");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Department/byIdTenantYDireccion/"+idDepto+"/"+idUser+"/"+idStatus+"/"+idTypeTenant
            }).then(function onSuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
              return response;
            });
        },
        requesLowByProp: function(idDepto,) {
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Department/requesLowByProp/"+idDepto
            }).then(function onSuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
              return response;
            });
        },
        requesLowByTenant: function(idUser) {
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Department/requesLowByTenant/"+idUser
            }).then(function onSuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Error: "+response.status+" ["+response.statusText+"]");  
              return response;
            });
        },
      }
}]);