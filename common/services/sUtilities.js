var moduleUtilitiesServices = angular.module("services.Utilities", ["tokenSystem"]);

moduleUtilitiesServices.service("UtilitiesServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var rsJson = {};
      var sndJson= {};
      var checkResult =0;
      return {
          /* GET AGENTS */
            getAgents: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/agent"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          /* GET COST CENTERS */
          getCostCenter: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/costcenter"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
           /* GET ALL ZONES FOR CUSTOMERS */
          getZones: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Zonas/listar"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },      
          addNewZone: function(zona) {
            //console.log("[Utilities Services] => Add New Zone ");
              return $http.post(serverHost+serverBackend+"Zonas/add",zona,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })  
          },
          updateZone: function(zona) {
            //console.log("[Utilities Services] => Update Zone ");
              return $http.post(serverHost+serverBackend+"Zonas/edit",zona,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })  
          },
          deleteZone: function(id) {
            //console.log("[Utilities Services] => Delete Zone: "+id);
              return $http({
                    method : "DELETE",
                    url : serverHost+serverBackend+"Zonas/delete/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },          
          getTypeOfIVA: function() {
            //console.log("[Utilities Services]: Get Type of iva ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/taxtype"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          checkZonaByLocationAndCustomerId: function(idClient, idLocation) {
            //console.log("[Customer Services] => get customer by id: "+sMsg);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Zonas/checkZonaByLocationAndCustomerId/"+idClient+"/"+idLocation
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
              })
          },
          categoryDepartament: function() {
            //console.log("[Utilities Services]: Get Department Category ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/categoryDepartament"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },
          CategoryKeyChains: function() {
            //console.log("[Utilities Services]: Get KeyChains Category ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/CategoryKeyChains"
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },          
          typeOfMails: function() {
            //console.log("[Utilities Services]: Get Type of Mails");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/typeOfMails"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeOfProperty: function() {
            //console.log("[Utilities Services]: Get Type of Property");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/tipoInmueble"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeOfInternetServices: function() {
            //console.log("[Utilities Services]: Get Type of Internet Services");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/tipoServiciosInternet"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeOfMaintenance: function() {
            //console.log("[Utilities Services]: Get Type of Maintenance Services");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/TypeMaintenance"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeOfContracts: function() {
            //console.log("[Utilities Services]: Get Type of Contracts Services");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/typeContrato"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          internetCompanyList: function() {
            //console.log("[Utilities Services]: Get Internet Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/InternetCompany"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          monitorCompanyList: function() {
            //console.log("[Utilities Services]: Get Monitor Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/monitorCompany"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          appMonitorApplicationList: function() {
            //console.log("[Utilities Services]: Get Monitor Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/monitorApplication"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },          
          totemModelList: function() {
            //console.log("[Utilities Services]: Get Totem Model List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/totemModel"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },          
          internetPlanList: function() {
            //console.log("[Utilities Services]: Get Internet Plan List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/TypeInternet"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          detinationLicense: function() {
            //console.log("[Utilities Services]: Get Detination License List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/detinationLicense"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeOperatingSystem: function() {
            //console.log("[Utilities Services]: Get type of operating system List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/typeOperatingSystem"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          /* GET TYPE OF ALARM CLIENT */
            typeAlarmClientList: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getTypeAlarmClient"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          /* GET REMOTE CONNECTION TYPE */
            typeConnectionList: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getTipeConetionRemote"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },          
          /* ALARM SERVICE ADITIONALS */
            alarmServicesAditionalsList: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getAlarmServicesAditionals"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          /* ALARM SERVICE ADITIONALS */
            transmissionFormatList: function() {
            //console.log("[Utilities Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getFormatoTransmision"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },     
          /* DISABLED REASON KEY */
          getDisabledReasonKey: function() {
            //console.log("[Utilities Services]: Get Disabled Reasons ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"seeds/reasonDisabledKey"
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeTechnicianServices: function() {
            //console.log("[Utilities Services]: Get type of operating system List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/typeTechnicianServices"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });   
          },
          typeReasonDownServices: function() {
            //console.log("[Utilities Services]: Get type of operating system List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/typeReasonDownServices"
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