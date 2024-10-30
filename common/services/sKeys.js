var moduleKeysServices = angular.module("services.Keys", ["tokenSystem"]);

moduleKeysServices.service("KeysServices", ['$http', '$q', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, $q, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var rsJson = {};
      var sndJson= {};
      var rsCustomer={'client':{}};
      var rsKey={'llavero':{}};
      var checkResult =0;
      var typeOfCustomer = "";
      var deferred = $q.defer();
      return {
          addKey: function(data) {
            rsKey.llavero=data.llavero;
            //console.log("[Key Services] => add: ");
            //console.log(rsKey);
              return $http.post(serverHost+serverBackend+"Llavero/add",rsKey,serverHeaders)
                .then(function onSuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  //console.log("Error: "+response.data.error); 
                  return response;
                })  
          },
          updateKey: function(data) {
            rsKey.llavero=data.llavero;
            console.log("[Key Services] => update: ");
            console.log(rsKey);
              return $http.post(serverHost+serverBackend+"Llavero/edit",rsKey,serverHeaders)
                .then(function onSuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log(response); 
                  return response;
                })  
          },
          addProcessEvent: function(data) {
            rsKey.processEvent=data.llavero;
            //console.log("[Key Services] => add: ");
            //console.log(rsKey);
              return $http.post(serverHost+serverBackend+"Llavero/addProcessEvent",rsKey,serverHeaders)
                .then(function onSuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  //console.log("Error: "+response.data.error); 
                  return response;
                })
          },
          listAll: function() {
            console.log("[Key Services] => get all keys");
            return $http({
                method : "GET",
                url : serverHost+serverBackend+"Llavero/index"
              }).then(function mySuccess(response) {
                rsJson=response;
                return rsJson;
              },function myError(response) { 
                console.log("Error: "+response.data.error); 
                return response;
              });
          },
          getKeychainList: function(data) {
            console.log("[Key Services] => get all keyschain processes");
              return $http.post(serverHost+serverBackend+"Llavero/listAllKeychain",data,serverHeaders)
              .then(function onSuccess(response) {
                rsJson=response;
                return rsJson;
              }).catch(function onError(response) {
                //console.log("Error: "+response); 
                return response;
              });
          },
          getKeychainProcess: function(data) {
            console.log("[Key Services] => get all keyschain processes");
              return $http.post(serverHost+serverBackend+"Llavero/listAllProcessEvents",data,serverHeaders)
              .then(function onSuccess(response) {
                rsJson=response;
                return rsJson;
              }).catch(function onError(response) {
                //console.log("Error: "+response); 
                return response;
              });
          },
          getKeyListByBuildingId: function(id) {
            //console.log("[Key Services] => get key List by Building id: "+id);
              return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Llavero/findByBuldingId/"+id
              }).then(function onSuccess(response) {
                  return response;
              }).catch(function onError(response) {
                //console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                  return response;
              })
          },
          getKeyListByDepartmentId: function(id) {
            //console.log("[Key Services] => get key List by Department id: "+id);
              return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Llavero/findIdDeparment/"+id
              }).then(function onSuccess(response) {
                  return response;
              }).catch(function onError(response) {
                  //console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                  return response;
              })
          },
          getCustomersListByCustomerId: function(id) {
            //console.log("[Customer Services] => Listado de clientes asociado a un cliente: "+sMsg);
              return $http({
                method : "GET",
                url : serverHost+serverBackend+"Clientes/listCustomersById/"+id
              }).then(function onSuccess(response) {
                return response;
              }).catch(function onError(response) {
                //console.log("Error: "+response.data.error); 
                return response;
              })  
          },
          addMultiKeys: function(file){
              var fd = new FormData();
              fd.append('excel', file);
              //console.log("[Key Services] => addMultiKeys uploading file: ");
              return $http.post(serverHost+serverBackend+"Llavero/varios", fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              }).then(function onSuccess(response) {
                return response;
              }).catch(function onError(response) {
               //console.log("Error: "+response); 
                return response;
              })
          },
          addUploadedCustomerFile: function(data) {
            rsCustomer.client = data;
            //console.log("[Customer Services] => add Customer Uploaded File");
            return $http.post(serverHost+serverBackend+"Clientes/addCustomerUploadedFile",rsCustomer,serverHeaders)
              .then(function onSuccess(response) {
                rsJson=response;
                return rsJson;
              }).catch(function onError(response) {
                //console.log("Error: "+response); 
                return response;
              });
          },
          assignKeyToUser: function(data) {
            //console.log("[Customer Services] => add Customer Uploaded File");
            return $http.post(serverHost+serverBackend+"Llavero/asignar",data,serverHeaders)
              .then(function onSuccess(response) {
                return response;
              }).catch(function onError(response) {
                //console.log("Error: "+response); 
                return response;
              });
          },
          unAssignKeyToUser: function(data) {
            //console.log("[Customer Services] => add Customer Uploaded File");
            return $http.post(serverHost+serverBackend+"Llavero/asignareliminar",data,serverHeaders)
              .then(function onSuccess(response) {
                return response;
              }).catch(function onError(response) {
                //console.log("Error: "+response); 
                return response;
              });
          },
          verifyKeysByIdUser: function(idDepto, idUser) {
            //console.log("[Key Services] => get key List by Department id: "+id);
              return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Llavero/verifyKeysByIdUser/"+idDepto+"/"+idUser
              }).then(function onSuccess(response) {
                  return response;
              }).catch(function onError(response) {
                  //console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                  return response;
              })
          },
          checkKeysAssigned2DepartmentByService: function(id) {
            console.log("[Key Services][checkKeysAssigned2DepartmentByService]: Check if there are keys associated to a department in the building By Service ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Llavero/checkKeysAssigned2DepartmentByService/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          statusKeychain: function() {
            //console.log("[Key Services]: Get status of keychain");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Llavero/statusKeychain"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
      }
}]);