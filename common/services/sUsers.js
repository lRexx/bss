var moduleUserServices = angular.module("services.User", ["tokenSystem"]);

moduleUserServices.service("userServices", ['$http', '$q', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders',
  function($http, $q, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var checkResult=0;
      var attempsToken = {emailAttempted:'', attempsCount: 0};
      var loginResult="";
      var rsJSON = {};
      var mail2Search = {mail:{ email: ''}};
      var deferred = $q.defer();
      return {
          /* FIND USER BY EMAIL */
          checkUserMail: function(userMail, typeOfCheck) {
            mail2Search.mail.email=userMail;
            //console.log("Email a verificar: "+userMail);
              return $http.post(serverHost+serverBackend+"User/findUserByEmail",mail2Search, serverHeaders)
                .then(function mySucess(response, status, data) {
                      checkResult = 1;
                      //console.log("Email registrado: "+response.data.emailUser);
                      if(typeOfCheck!="updatesession"){
                        tokenSystem.destroyTokenStorage(3)
                        tokenSystem.temporalStorage(response.data[0]);
                      }else if(typeOfCheck=="updatesession"){
                        tokenSystem.destroyTokenStorage(5);
                      }else if(typeOfCheck=="forgotPwd"){
                        tokenSystem.temporalStorage(response.data[0]);
                      }
                      return checkResult;
                      //console.log(response.data)
                  },function myError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    if(response.status==500 || response.status==503){
                      return checkResult=response.status;
                    }else{
                      if (typeOfCheck=="login" || typeOfCheck=="forgotPwd"){
                        var attempsTkn=!JSON.parse(sessionStorage.getItem("attempsToken"))? false :JSON.parse(sessionStorage.getItem("attempsToken"));
                          if(attempsTkn==false || attempsTkn==undefined){
                              attempsToken['attempsCount']=0;
                              attempsToken['attempsCount']++;
                              attempsToken['emailAttempted']=userMail;
                          }else if(userMail!==attempsTkn.emailAttempted) {
                              sessionStorage.removeItem("attempsToken");
                              attempsToken['attempsCount']=0;
                              attempsToken['attempsCount']++;
                              attempsToken['emailAttempted']=userMail;
                          }else{
                              attempsToken['attempsCount']=attempsTkn.attempsCount+1;
                              attempsToken['emailAttempted']=attempsTkn.emailAttempted;
                          }
                      }else if (typeOfCheck=='register'){
                              sessionStorage.removeItem("attempsToken");
                              attempsToken['attempsCount']=0;
                              attempsToken['emailAttempted']=userMail;
                      }
                      sessionStorage.setItem("attempsToken", JSON.stringify(attempsToken));
                      checkResult = 0;
                      return checkResult;
                    }
            });
          },
          /* FIND USER BY EMAIL */
          findUserByEmail: function(userMail) {
            mail2Search.mail.email=userMail;
            //console.log("Email a verificar: "+userMail);
              return $http.post(serverHost+serverBackend+"User/findUserByEmail",mail2Search, serverHeaders)
                .then(function mySucess(response, status, data) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                  })
          },
          /* FIND USER BY ID */
          findUserById: function(idUser) {
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"User/index/"+idUser
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                  })
          },
          /* RESTORE PASSWORD */
          recoverPwd: function(userPwd2Recover) {
            var rsTmpUser=tokenSystem.getTokenStorage(3);
              console.log("Cuenta a restablecer: "+rsTmpUser.emailUser);
              console.log(userPwd2Recover);
              return $http.post(serverHost+serverBackend+"User/updatePass",userPwd2Recover, serverHeaders)
                .then(function mySucess(response, status, data) {
                  return response;
              },function myError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
              });
          },
          validateAccount: function(token) {
            //console.log("[Customer Services] => get customer by id: "+sMsg);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"User/validate/"+token
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response);
                    return response;
              })
          },
          /* UPDATE AN USER AND CHANGE PASSWORD */
          updateUser: function(userData2Change) {
            var data2update = userData2Change;
            //console.log(serverHeaders);
            console.log(data2update);
              return $http.post(serverHost+serverBackend+"User/update",data2update, serverHeaders)
                .then(function mySucess(response) {
                  return response;
              },function myError(response, error) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
              });
          },
          /* ADD GUEST */
          addGuest: function(userData2Add) {
            //console.log(serverHeaders);
              console.log(userData2Add);
              return $http.post(serverHost+serverBackend+"User/addGuest", userData2Add, serverHeaders)
                .then(function mySucess(response, status, data) {
                  return response;
              },function myError(response, error) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return checkResult;
              });
          },
          /* UPDATE GUEST */
          updateGuest: function(userData2Add) {
            //console.log(serverHeaders);
              console.log(userData2Add);
              return $http.post(serverHost+serverBackend+"User/updateGuest", userData2Add, serverHeaders)
                .then(function mySucess(response, status, data) {
                  return response;
              },function myError(response, error) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return checkResult;
              });
          },
          /* ADD GUEST */
          addUser: function(userData2Add) {
            //console.log(serverHeaders);
              console.log(userData2Add);
              return $http.post(serverHost+serverBackend+"User/", userData2Add, serverHeaders)
                .then(function mySucess(response, status, data) {
                  return response;
              },function myError(response, error) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return checkResult;
              });
          },
          /* LOGIN SERVICE */
          letLogin: function(jsonLogin) {
            var jsonUser=jsonLogin.user.fullNameUser;
            rsJSON.loginResult = null;
              //console.log(jsonLogin);
              return $http.post(serverHost+serverBackend+"User/auth",jsonLogin, serverHeaders)
                .then(function mySucess(response, status) {
                  console.log(response.status);
                  //rsJSON=response.data.response;
                  //rsJSON.loginResult = null;
                  //if(rsJSON){
                  //  console.log(rsJSON.fullNameUser);
                  //  console.log(rsJSON);
                  //}

                  switch (response.status){

                    case 200:
                      rsJSON=response.data.response;
                      console.log("Method: "+response.config.method+" - msg code["+response.status+"]");
                      console.log(rsJSON.fullNameUser);
                      sessionStorage.removeItem("attempsToken");
                      if(rsJSON.idProfileKf==6 && rsJSON.requireAuthentication==0){
                          console.log('is an Attendant without login premission');
                        tokenSystem.temporalStorage(rsJSON);
                          rsJSON.loginResult = 10;
                        return rsJSON;
                      }else if(rsJSON.isConfirmatedMail==0){
                        console.log('Confirm Email Required');
                        tokenSystem.temporalStorage(rsJSON);
                          rsJSON.loginResult = 3;
                        return rsJSON;
                      }else if(rsJSON.isConfirmatedMail==1 && rsJSON.idStatusKf==0){
                        console.log('Account Inactive, please contact support');
                        tokenSystem.temporalStorage(rsJSON);
                          rsJSON.loginResult = 4;
                        return rsJSON;
                      }else if(rsJSON.isConfirmatedMail==1 && rsJSON.idStatusKf==1 && rsJSON.resetPasword==1){
                        console.log('Change Password Required');
                        tokenSystem.temporalStorage(rsJSON);
                          rsJSON.loginResult = 2;
                        return rsJSON;
                      }else  if(rsJSON.resetPasword==0 && rsJSON.idStatusKf==1){
                      tokenSystem.destroyTokenStorage(4);
                      //$cookies.put('sysToken', true);
                      //$cookies.put('sysLoggedUser', rsJSON);
                      //$cookies.put('sysLoggedUserModules', rsJSON.modules);
                      tokenSystem.setTokenStorage(true, rsJSON, rsJSON.modules);
                      $timeout(function() {
                          var jsonTokenUser = tokenSystem.getTokenStorage(2);
                          console.log('Login Successfully', jsonTokenUser.emailUser);

                      }, 1500);
                        rsJSON.loginResult = 1;
                      return rsJSON;
                      }
                    break;
                    case 203:
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      //tokenSystem.temporalStorage(rsJSON);
                      var jsonTokenUser = tokenSystem.getTokenStorage(3);

                      console.log("Error: " + response.data.error);
                        var rsTmpUser = tokenSystem.getTokenStorage(3);
                        if (rsTmpUser.idStatusKf=='1' && rsTmpUser.isConfirmatedMail=='1'){
                          var attempsTkn=!JSON.parse(sessionStorage.getItem("attempsToken"))? false :JSON.parse(sessionStorage.getItem("attempsToken"));
                          if(attempsTkn==false || attempsTkn==undefined){
                              attempsToken['attempsCount']=0;
                              attempsToken['attempsCount']++;
                              attempsToken['emailAttempted']=jsonUser;
                          }else if(jsonUser!==attempsTkn.emailAttempted) {
                              sessionStorage.removeItem("attempsToken");
                              attempsToken['attempsCount']=0;
                              attempsToken['attempsCount']++;
                              attempsToken['emailAttempted']=jsonUser;
                          }else{
                              attempsToken['attempsCount']=attempsTkn.attempsCount+1;
                              attempsToken['emailAttempted']=attempsTkn.emailAttempted;
                          }
                          sessionStorage.setItem("attempsToken", JSON.stringify(attempsToken));
                          console.log('<<<Incorrect Password 5 >>>');
                          rsJSON.loginResult = 5;
                        }else{
                          console.log('<<<Incorrect Password 6 >>>');
                          rsJSON.loginResult = 6;
                        }
                      return rsJSON;
                    default:
                  }
                },function myError(response) {
                    if(response.status == 404){
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      /*inform.add(response.data.error,{
                        ttl:5000, type: 'warning'
                      }); */
                    }else{
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      /*inform.add(response.data.error,{
                        ttl:5000, type: 'warning'
                      }); */
                    }
                })
          },
          /*/LOGIN SERVICE*/
          /* UPDATE LOGGED USER DATA SERVICE */
          updateLoggedUserData: function(idUser) {
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"User/index/"+idUser
                }).then(function mySuccess(response) {

                  tokenSystem.destroyTokenStorage(5);
                  tokenSystem.setTokenStorage(true, response.data, response.data.modules);
                  return response;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*/LOGIN SERVICE*/
          /*GET OFFICES BY COMPANY ID*/
          officeList: function(idCompany) {
              var rsData = {};
              console.log("[Service][officeList]---> idCompany: "+idCompany);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Direccion/addressListByCompanyid/"+idCompany
                  }).then(function mySuccess(response) {
                      rsData = response.data;
                      //console.log(rsData);
                      return rsData;

                  }).catch(function onError(response) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /*/GET OFFICES BY COMPANY ID*/
          /*UPDATE COMPANY*/
          updateCompany: function(companyData2Update) {
              var rsData = {};
              console.log("[Service][updateCompany]---> idCompany: "+companyData2Update.company.idCompany);
              return $http.post(serverHost+serverBackend+"user/updatecompany",companyData2Update, serverHeaders)
                .then(function mySuccess(response) {
                    checkResult = 1;
                    return checkResult;

                },function myError(response, error) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*/GET OFFICES BY COMPANY ID*/
          addressByCode: function(codeSecurity) {
            //console.log(serverHeaders);
              console.log("[Service][addressByCode]---> codeSecurity: "+codeSecurity);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Direccion/getTheAddressBySecurityCode/"+codeSecurity
                  }).then(function mySuccess(response) {
                      console.log("[Service][addressByCode]---> codeSecurity: "+codeSecurity+" (Successfully Confirmed)");
                      return response;

                  },function myError(response, error) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /*/GET THE TENANT WITHOUT DEPT AND OWNER WITH OR WITHOUT DEPT*/
          userListToAssing: function(idDepto) {
              console.log("[Service][usersWithoutDepto]---> idDeparment: "+idDepto);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"user/usernoregister/"+idDepto
                  }).then(function mySuccess(response) {
                      return response;
                  },function myError(response, error) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /*/GET THE TENANT WITHOUT DEPT AND OWNER WITH OR WITHOUT DEPT*/
          attendantsListToAssing: function() {
            console.log("[Service][attendantsWithoutAddressAssigned]");
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"user/attendantWithNobuildingAssigned/"
                }).then(function onSuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                });
         },
          /*GET USER LIST BY GROUP*/
          userLists: function() {
              var rsData = {};
              console.log("[Service][Getting]--->[userLists]");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"User/getListOfUsers/"
                  }).then(function mySuccess(response) {
                      rsData = response.data;
                      //console.log(rsData);
                      return rsData;

                  },function myError(response, error) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          getUsersList: function(data) {
            console.log("[User Services] => get all User");
              return $http.post(serverHost+serverBackend+"User/list",data,serverHeaders)
              .then(function onSuccess(response) {
                rsJson=response;
                return rsJson;
              }).catch(function onError(response) {
                //console.log("Error: "+response);
                return response;
              });
          },
          /*GET ATTENDANT LIST BY ADDRESS*/
          attendantList: function(idAddress) {
              var rsData = {};
              console.log("[Service][Getting]--->[attendants] by Address "+idAddress);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"User/attendantByIdDirecction/"+idAddress
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /*GET ATTENDANT LIST ONLY BY ADDRESS*/
          attendantsOnlyList: function(idAddress) {
              var rsData = {};
              console.log("[Service][Getting]--->[attendants] by Address "+idAddress);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"User/attendantsOnlyByIdDirecction/"+idAddress
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                      console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                      return response;
                  });
          },
          /*CHECK IF THE BUILDING HAVE A TITULAR ATTENDANT ASSOCIATED*/
          checBuildingTitularAttendant: function(idAddress) {
            var rsData = {};
            console.log("[Service][Getting]--->[attendants] by Address "+idAddress);
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"User/chekBuildingTitularAttendant/"+idAddress
                }).then(function mySuccess(response) {
                  return response;
                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*GET FILTER FORM LIST*/
          filterForm: function() {
            console.log("[Service][Getting]--->[filterForm]");
            return $http({
              method : "GET",
              url : serverHost+serverBackend+"User/filterForm/"
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                  })
          },
          /*ENABLED AN USER*/
          enabled: function(idUser) {
            console.log("[Service][id]: "+idUser+" --->[enable]");
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"User/active/"+idUser
                }).then(function mySuccess(response) {
                  return response;
                },function myError(response, error) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*DISABLED AN USER*/
          disabled: function(idUser) {
            console.log("[Service][user][id]: "+idUser+" --->[disabled]");
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"User/inactive/"+idUser
                }).then(function mySuccess(response) {
                  return response;
                },function myError(response, error) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*REMOVE AN USER*/
          remove: function(idUser) {
            console.log("[Service][user][id]: "+idUser+" --->[remove]");
            return $http({
                  method : "DELETE",
                  url : serverHost+serverBackend+"User/delete/"+idUser
                }).then(function mySuccess(response) {
                  return response;
                },function myError(response, error) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
          },
          /*REMOVE A GUEST*/
          removeg: function(idGuest) {
            console.log("[Service][guest][id]: "+idGuest+" --->[remove]");
            return $http({
                  method : "DELETE",
                  url : serverHost+serverBackend+"User/delGuest/"+idGuest
                }).then(function mySuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                });
          },
          /*GET OFFICES BY COMPANY ID*/
          getUsersByCompanyClientId: function(idCompany) {
            var rsData = {};
            console.log("[Service][userList]---> idCompany: "+idCompany);
            return $http({
                  method : "GET",
                  url : serverHost+serverBackend+"User/getUsersByCompanyClientId/"+idCompany
                }).then(function mySuccess(response) {
                    return response;

                }).catch(function onError(response) {
                    console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                    return response;
                });
        },
        getListAuthorizedUsers: function() {
          var rsData = {};
          console.log("[Service][Getting]--->[getListAuthorizedUsers]");
          return $http({
            method : "GET",
            url : serverHost+serverBackend+"User/listAuthorizedUsers"
                }).then(function mySuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })
        },
        geAuthTokentList: function(id) {
          var rsData = {};
          console.log("[Service][Getting]--->[geAuthTokentList]");
          return $http({
            method : "GET",
            url : serverHost+serverBackend+"User/listAuthorizationTokenByUserId/"+id
                }).then(function mySuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })
        },
        setTokenCompleted: function(id) {
          var rsData = {};
          console.log("[Service][Getting]--->[setTokenCompleted]");
          return $http({
            method : "GET",
            url : serverHost+serverBackend+"User/setTokenCompleted/"+id
                }).then(function mySuccess(response) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })
        },
        /* GENERATE AND SEND TOKEN CODE */
        sendGeneratedToken: function(user) {
            return $http.post(serverHost+serverBackend+"User/sendGeneratedToken",user, serverHeaders)
              .then(function mySucess(response, status, data) {
                  return response;
                }).catch(function onError(response) {
                  console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                  return response;
                })
        },
        addAuthorizationToken: function(user) {
          return $http.post(serverHost+serverBackend+"User/addAuthorizationToken",user, serverHeaders)
            .then(function mySucess(response, status, data) {
                return response;
              }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
              })
        },
        validateAuthorizationToken: function(token) {
          return $http.post(serverHost+serverBackend+"User/validateAuthorizationToken",token, serverHeaders)
            .then(function mySucess(response, status, data) {
                return response;
              }).catch(function onError(response) {
                console.log("Method: "+response.config.method+" - Error code["+response.status+"]");
                return response;
              })
        },
      }
}]);
