var moduleTicketrServices = angular.module("services.Ticket", ["tokenSystem", "services.User"]);

moduleTicketrServices.service("ticketServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders',
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var ticketResult=0;
      var rsJsonTicket = {};
      var rsTicket={'ticket':{}};
      var checkResult =0;
      return {
          /* LISTA ALL TICKETS */
          all: function(ticket) {
            console.log("List all tickets or list by filters selected");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"Ticket/allnew",ticket, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* ADD TICKET UP */
          addUpRequest: function(ticket) {
            console.log("Adding ticket service :: Triggered");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"Ticket/index2",ticket, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* ADD TICKET DOWN*/
          addDownRequest: function(ticket) {
            console.log("Adding ticket service :: Triggered");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"Ticket/index3",ticket, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* APPROVE TICKET */
          approvedTicket: function(data) {
            console.log("[Ticket Services] => Approve Ticket Id: "+data.ticket.idTicket);
            console.log(data);
            return $http.post(serverHost+serverBackend+"Ticket/approve",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
            });
          },
          /* SET BILLING INITIATE TICKET */
          seBillingInitiate: function(data) {
            console.log("[Ticket Services] => Set Billing Initiate: ");
            return $http.post(serverHost+serverBackend+"Ticket/billingInitiate",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
            });
          },
          /* REQUEST CANCEL TICKET */
          requestCancelTicket: function(data) {
            console.log("[Ticket Services] => Request Cancel of Ticket Id: "+data.ticket.idTicket);
            console.log(data);
            return $http.post(serverHost+serverBackend+"Ticket/requestCancel",data, serverHeaders)
              .then(function mySucess(response) {
                    return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
            });
          },
          /* REJECT REQUEST CANCEL TICKET */
          rejectRequestCancelTicket: function(data) {
            console.log("[Ticket Services] => Reject Cancel Request of Ticket Id: "+data.ticket.idTicket);
            console.log(data);
            return $http.post(serverHost+serverBackend+"Ticket/rejectRequestCancel",data, serverHeaders)
              .then(function mySucess(response) {
                    return response;
            }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
            });
          },
          /* CANCEL TICKET */
          cancelTicket: function(data) {
            console.log("[Ticket Services] => Cancel Ticket Id: "+data.ticket.idTicket);
            console.log(data);
              return $http.post(serverHost+serverBackend+"Ticket/cancelTicket",data, serverHeaders)
                .then(function mySucess(response) {
                  return response;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /* UPDATE TMP DELIVERY DATA APPROVE TO TICKET */
          updateTmpTicket: function(ticket) {
              console.log("UPDATING TMP DELIVERY DATA TICKET");
              //console.log(ticket);
              return $http.post(serverHost+serverBackend+"Ticket/updateTmpTicket",ticket, serverHeaders)
                .then(function mySuccess(response) {
                      ticketResult = 1;
                      return ticketResult;
                  },function myError(response) {
                      console.log(response.data);
                      checkResult = 0;
                    return checkResult;
                  });
          },
          /* NOTICE THAT A CHANGE HAS BEEND APPLIED TO SPECIFIC TICKET */
          changeApplied: function(id, value) {
            var idTmpDeliveryData=id;
            var responseMsg=value==1?"True":"False";
            console.log("INDICANDO SI CAMBIO SOBRE UN TICKET HA SIDO APLICADO");
            console.log("[TicketService]=>[changeApplied]: "+idTmpDeliveryData+" Aplicado: "+responseMsg);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/changeApplied/"+idTmpDeliveryData+"/"+value
                  }).then(function mySuccess(response) {
                      ticketResult = 1;
                      return ticketResult;
                  },function myError(response) {
                        if(!idTmpDeliveryData){
                            checkResult = 0;
                        }
                    return checkResult;
            });
          },
          rejectedChOrCanTicket: function(id, value) {
            var responseMsg=value==1?"un Cambio de envio rechazado":"una Cancelacion rechazada";
            console.log("[TicketService]=>[rejectedChOrCanTicket]: Aplicando los cambios sobre "+responseMsg+" en el ticket N#: "+id);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/rejectedChOrCanTicket/"+id+"/"+value
                  }).then(function mySuccess(response) {
                      ticketResult = 1;
                      return ticketResult;
                  },function myError(response) {
                        if(!idTmpDeliveryData){
                            checkResult = 0;
                        }
                    return checkResult;
            });
          },
          /*COMPLETE REFUND TICKET */
          completeTicketRefund: function(ticket) {
            console.log("Completing refund ticket service :: Triggered");
            //console.log(tkUpdateData);
            return $http.post(serverHost+serverBackend+"Ticket/completeTicketRefund",ticket, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /*CHANCE STATUS TICKET */
          changueStatus: function(ticket) {
            console.log("Changing status ticket service :: Triggered");
            //console.log(tkUpdateData);
            return $http.post(serverHost+serverBackend+"Ticket/changueStatus",ticket, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* UPDATE TICKET */
          updateUpRequest: function(ticket) {
              console.log("Updating ticket service :: Triggered");
              //console.log(tkUpdateData);
              return $http.post(serverHost+serverBackend+"Ticket/update",ticket, serverHeaders)
                .then(function mySucess(response) {
                  return response;
                },function myError(response) {
                  console.log("Error: "+response.data.error);
                  return response;
                })
          },
          /* ADD TEMPORAL DELIVERY DATA TICKET */
          tmpDeliveryData: function(ticket) {
              console.log("ADDING TMP DATA");
              //console.log(ticket);
              return $http.post(serverHost+serverBackend+"Ticket/addTmpDeliveryOrCancelData",ticket, serverHeaders)
                .then(function mySucess(response) {
                  checkResult = 1;
                  return checkResult;
              },function myError(response) {
                console.log(response.data);
                checkResult = 0;
                return checkResult;
              });
          },
          /* GET TICKET BY ID*/
          ticketById: function(ticketID) {
            var ticketId=ticketID;
            console.log("[Service] => [ticketById] => Ticket a buscar: "+ticketID);
              return $http({
                method : "GET",
                url : serverHost+serverBackend+"Ticket/ticketById/"+ticketID
              }).then(function mySuccess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* VERIFY IF TICKET HAS BILLING RECEIPT UPLOADED BY TICKET ID*/
          billingFileUploaded: function(ticketID) {
            var ticketId=ticketID;
            console.log("[Service] => [billingFileUploaded] => Ticket a buscar: "+ticketID);
              return $http({
                method : "GET",
                url : serverHost+serverBackend+"Ticket/billingUploaded/"+ticketID
              }).then(function mySuccess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          /* GET TICKET BY ID*/
          ticketByToken: function(ticketToken) {
            var ticketToken=ticketToken;
            console.log("Ticket a buscar: "+ticketToken);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/ticketByToken/"+ticketToken
                  }).then(function mySuccess(response) {
                      rsJsonTicket = response.data;
                      tokenSystem.tmpTicketlStorage(rsJsonTicket[0]);
                      checkResult = 1;
                      return checkResult;
                  },function myError(response) {
                        if(!ticketToken){
                            checkResult = 0;
                        }
                    return checkResult;
            });
          },
          /* CHECK TICKET BEFORE CANCEL*/
          checkTicketBeforeCancel: function(ticketID) {
            var ticketId=ticketID;
            console.log("Ticket a buscar: "+ticketID);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/verificateTicketBeforeCancel/"+ticketID
                  }).then(function mySuccess(response) {
                      rsJsonTicket = response.data;
                      return rsJsonTicket;
                  },function myError(response) {
                        if(!ticketId){
                            checkResult = 0;
                        }
                    return checkResult;
            });
          },
          /* TICKET LIST WITH CHANGE OR CANCEL APPROVED*/
          getTickets2Check: function(id) {
            var msg=id==1?"Approved":"Rejected";
            console.log("[getTickets2Check] => Getting data of tickets "+msg);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/getTickets2Check/"+id
                  }).then(function mySuccess(response) {
                      rsJsonTicket = response.data;
                      return rsJsonTicket;
                  },function myError(response) {
                           checkResult = 0;
                    return checkResult;
            });
          },
          /* VERIFY TICKET */
          verifyTicketsByIdUser: function(idUser) {
            console.log("[Ticket Services] => verificar si un usuario tiene un pedido asociado: "+idUser);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/verificateTicketByIdUser/"+idUser
                  }).then(function mySuccess(response) {
                      return response;
                  },function myError(response, error) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /* VERIFY TICKET */
          verifyTicketsByIdUserDepto: function(idUser, idDepto) {
            console.log("[Ticket Services] => verificar si un usuario y depto tiene un pedido asociado: "+idUser);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/verificateTicketByidUserDepto/"+idUser+"/"+idDepto
                  }).then(function mySuccess(response) {
                      return response;
                  },function myError(response, error) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /* VERIFY TICKET */
          getTicketFilter: function() {
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/filter/"
                  }).then(function mySuccess(response) {
                      return response;
                  }).catch(function onError(response) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /* STATUS TICKET */
          getTicketStatusTypeList: function() {
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Ticket/ticketStatusType/"
                }).then(function mySuccess(response) {
                    return response;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /* TICKET TYPE */
          getTypeTicketList: function() {
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"Ticket/typeTickets/"
                }).then(function mySuccess(response) {
                    return response;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          typeDelivery: function() {
            //console.log("[Utilities Services]: Get Internet Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/typedelivery"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },
          deliveryCompanies: function() {
            //console.log("[Utilities Services]: Get Delivery Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/deliveryCompanies"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },
          paymentsType: function() {
            //console.log("[Utilities Services]: Get Internet Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/paymentsType"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },
          manualPaymentsType: function() {
            //console.log("[Utilities Services]: Get Internet Company List");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Ticket/manualPaymentsType"
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
            });
          },
          createMPLink: function(data) {
            console.log("Create Mercado Pago Link for pay the request");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"MercadoLibre/crearEnlaceMercadoPago",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          addPayment: function(data) {
            console.log("Add payment details");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"MercadoLibre/addPayment",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          updatePayment: function(data) {
            console.log("Update payment details");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"MercadoLibre/updatePayment",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
          uploadTicketFiles: function(file, idTicketKf){
            var fd = new FormData();
            fd.append('file', file);
            fd.append('idTicketKf', idTicketKf);
            console.log("[Ticket Services] => upload file: ");
            //console.log(file);
            //console.log(idTicketKf);
            //console.log(fileName);
            return $http.post(serverHost+serverBackend+"Ticket/uploadFile", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function mySuccess(response) {
              return response;
            },function myError(response) {
              console.log("Error: "+response);
              return response;
            })
          },
          addUploadedTicketFile: function(data) {
            rsTicket.ticket = data;
            console.log("[Ticket Services] => add Ticket Uploaded File");
            return $http.post(serverHost+serverBackend+"Ticket/addUploadedTicketFile",rsTicket,serverHeaders)
              .then(function mySuccess(response) {
                return response;
              }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
              });
          },
          deleteTicketFiles: function(data){
            rsTicket.fileName = data;
            console.log("[Ticket Services] => Delete Ticket Uploaded File from server ");
            return $http.post(serverHost+serverBackend+"Ticket/deleteFile",rsTicket,serverHeaders)
            .then(function mySuccess(response) {
              return response;
            }).catch(function onError(response) {
              console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
              return response;
            })
          },
          deleteUploadedTicketFile: function(data) {
            rsTicket.ticket = data;
            console.log("[Ticket Services] => Delete Ticket Uploaded File from db");
            return $http.post(serverHost+serverBackend+"Ticket/deleteUploadedTicketFile",rsTicket,serverHeaders)
              .then(function mySuccess(response) {
                return response;
            }).catch(function onError(response) {
              console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
              return response;
            });
          },
          /* Set isBillingUploaded field to True */
          setIsBillingUploaded: function(idTicket, setValue) {
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Ticket/setIsBillingUploaded/"+idTicket+"/"+setValue
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                  })
          },
          /* Send billing uploaded notification service */
          sendBillingMailNotification: function(idTicket, filename) {
            console.log("[Ticket Services] => sendBillingMailNotification");
            console.log("[Ticket Services] => idTicket: "+idTicket);
            console.log("[Ticket Services] => idTicket: "+filename);
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"Ticket/sendPostBillingMailNotification/"+idTicket+"/"+filename
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                  })
          },
          ticketInitialDeliveryActiveByDeptoId: function(data) {
            console.log("ticketInitialDeliveryActiveByDeptoId");
            //console.log(ticket);
            return $http.post(serverHost+serverBackend+"Ticket/ticketInitialDeliveryActiveByDeptoId",data, serverHeaders)
              .then(function mySucess(response) {
                return response;
              },function myError(response) {
                console.log("Error: "+response.data.error);
                return response;
              })
          },
      }
}]);
