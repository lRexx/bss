var moduleServiceServices = angular.module("services.Service", ["tokenSystem", "services.User"]);

moduleServiceServices.service("serviceServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var serviceResult=0;
      var rsJsonServices = {};
      var rsCustomerServices={'service':{}};
      var rsJson={};
      var checkResult =0;
      var typeOfService = "";
      return {
          /*GET LIST OF TYPE OF SERVICES*/
          getTypeOfServices: function() {
            rsJson={};
            //console.log("[Service Services]: Type of Services ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Services/typeOfServices"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*GET LIST OF ACCESS CONTROL DOORS */
          accessCtrlDoors: function() {
            rsJson={};
            //console.log("[Service Services]: Access Control Door List ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Services/accessCtrlDoors"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*ADD A SERVICE */
          addService: function(data) {
            rsCustomerServices.service = data;
            var switchOption = rsCustomerServices.service.idTipeServiceFk;
            switch(switchOption){
              case "1": //CONTROL ACCESS
                typeOfService="addaccescontrol";
              break;
              case "2": //INTERNET
                typeOfService="addinternet";
              break;
              case "3": //TOTEM
                typeOfService="addtotem";
              break;
              case "4": //CAMERA
                typeOfService="addcamera";
              break;
              case "5": //ALARM
                typeOfService="addalarm";
              break;
              case "6": //APP MONITOR
                typeOfService="addsmartpanic";
              break;              
              default:
            }
              console.log("[Service Services]: new customer service ");
              console.log(rsCustomerServices);
              return $http.post(serverHost+serverBackend+"Services/"+typeOfService,rsCustomerServices,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                },function myError(response) { 
                  console.log("Error: "+response); 
                  return response;
                });
          },
          /*UPDATE A SERVICE */
          updateService: function(data) {
            rsCustomerServices.service = data;
            var switchOption = rsCustomerServices.service.idClientTypeServices;
            switch(switchOption){
              case "1": //CONTROL ACCESS
                typeOfService="editAccescontrol";
              break;
              case "2": //INTERNET
                typeOfService="editInternet";
              break;
              case "3": //TOTEM
                typeOfService="editTotem";
              break;
              case "4": //CAMERA
                typeOfService="editCamera";
              break;
              case "5": //ALARM
                typeOfService="editAlarm";
              break;
              case "6": //APP MONITOR
                typeOfService="editSmartpanic";
              break;              
              default:
            }
              console.log("[Service Services]: update customer service ");
              console.log(rsCustomerServices);
              return $http.post(serverHost+serverBackend+"Services/"+typeOfService,rsCustomerServices,serverHeaders)
                .then(function mySucess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Error: "+response); 
                  return response;
                });
          },
          getServiceListByIdContract: function(idContract) {
            rsJson={};
            console.log("[Service Services]: List of Services Items By Contract: "+idContract);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/servicesPorIdContrato/"+idContract
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          getServiceListByIdCustomer: function(idCustomer) {
            rsJson={};
            console.log("[Service Services]: List of Services Items By Customer Id");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/getServicesPorIdCliente/"+idCustomer
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          getTechServiceList: function() {
            rsJson={};
            console.log("[Service Services]: List of Technician Services");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/listarTechService"
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          getTechServiceCostList: function() {
            console.log("[Service Services]: List of Technician Services Costs");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"rates/listar"
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          getTechServiceCostByTypeServiceIdList: function(id) {
            console.log("[Service Services]: List of Technician Services Costs By Service Type ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"rates/listarByServiceType/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          maintenanceTypeByTechServiceId: function(id) {
            console.log("[Service][maintenanceTypeByTechServiceId]: List of Maintenance Types By Technician Services ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/maintenanceTypeByTechServiceId/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          addTechService: function(data) {
            console.log("[Service][addTechService]---> add a technician service ");
            return $http.post(serverHost+serverBackend+"services/addTechService",data, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
          },

          updateTechService: function(data) {
            console.log("[Service][updateTechService]---> update a technician service ");
            return $http.post(serverHost+serverBackend+"services/editTechService",data, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
          },
          addTechServiceCost: function(data) {
            console.log("[Service][addTechService]---> add a technician service ");
            return $http.post(serverHost+serverBackend+"rates/add",data, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
          },

          updateTechServiceCost: function(data) {
            console.log("[Service][updateTechService]---> update a technician service ");
            return $http.post(serverHost+serverBackend+"rates/edit",data, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
          },
          checkTechServiceName: function(name) {
            console.log("[Service][maintenanceTypeByTechServiceId]: List of Maintenance Types By Technician Services ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/checkTechServiceName/"+name
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          getServiceCostByCustomer: function(data) {
            console.log("[Service][getServiceCostByCustomer] ");
            return $http.post(serverHost+serverBackend+"rates/getServiceCostByCustomer",data, serverHeaders)
              .then(function mySucess(response) {
                 return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]"); 
                 return response;
            });
          },

          checkTicketsActiveByService: function(id) {
            console.log("[Service][checkTicketsActiveByService]: Get Ticket Active related By Service ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/checkTicketsActiveByService/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          }, 

          checkServicesAssociatedByService: function(id) {
            console.log("[Service][checkTicketsActiveByService]: Get Ticket Active related By Service ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/checkServicesAssociatedByService/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          checkInternetServicesAssociatedByService: function(id) {
            console.log("[Service][checkTicketsActiveByService]: Get Ticket Active related By Service ID");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"services/checkInternetServicesAssociatedByService/"+id
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          }, 
      }
}]);