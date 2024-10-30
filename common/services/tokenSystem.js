var tkSysService = angular.module("tokenSystem", []);
/**************************************************
*                                                 *
*        TOKEN SERVICE FOR USER LOGGED IN         *
*                                                 *
**************************************************/ 
tkSysService.service("tokenSystem",function(){
      var tokenStorageValue="";
      return {
          getTokenStorage: function(value) {
            switch (value){
              case 1:
                tokenStorageValue = !sessionStorage.getItem("sysToken") ? false : sessionStorage.getItem("sysToken");
              break;
              case 2:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("sysLoggedUser")) ? false : JSON.parse(sessionStorage.getItem("sysLoggedUser"));
              break;
              case 3:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("sysTmpUser")) ? false : JSON.parse(sessionStorage.getItem("sysTmpUser"));
              break;
              case 4:
                tokenStorageValue = JSON.parse(sessionStorage.getItem("attempsToken"));
              break;
              case 5:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("sysTmpTicket")) ? false : JSON.parse(sessionStorage.getItem("sysTmpTicket"));
              break;
              case 6:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("sysLoggedUserModules")) ? false : JSON.parse(sessionStorage.getItem("sysLoggedUserModules"));
              break;
              case 7:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("tknCustomerData")) ? false : JSON.parse(sessionStorage.getItem("tknCustomerData"));
              break;
              case 8:
                tokenStorageValue = !JSON.parse(sessionStorage.getItem("sysRouteParams")) ? false : JSON.parse(sessionStorage.getItem("sysRouteParams"));
              break;
              default:

            }
              return tokenStorageValue;
          },
          setTokenStorage: function(tksSystem, tkLoggedUser, tkModulesUser) {
              sessionStorage.setItem("sysToken", tksSystem);
              sessionStorage.setItem("sysLoggedUser", JSON.stringify(tkLoggedUser));
              sessionStorage.setItem("sysLoggedUserModules", JSON.stringify(tkModulesUser));
          },
          setTokenStorageToNull: function() {
            sessionStorage.setItem("sysToken", null);
            sessionStorage.setItem("sysLoggedUser", null);
            sessionStorage.setItem("sysLoggedUserModules", null);
          },
          setLoggedUserStorage: function(tkLoggedUser) {
              sessionStorage.setItem("sysLoggedUser", JSON.stringify(tkLoggedUser));
          },
          setRouteParamsStorage: function(routeParams) {
            sessionStorage.setItem("sysRouteParams", JSON.stringify(routeParams));
          },
          setCustomerByTypeDataStorage: function(value, tkCustomers) {
            //console.log(tkCustomers);
            switch (value){
              case 1:
                sessionStorage.setItem("tkAdministrationCustomersData", JSON.stringify(tkCustomers));
              break;
              case 2:
                sessionStorage.setItem("tkBuildingCustomersData", JSON.stringify(tkCustomers));
              break;
              case 3:
                sessionStorage.setItem("tkCompanyCustomersData", JSON.stringify(tkCustomers));
              break;
              case 4:
                sessionStorage.setItem("tkBranchCustomersData", JSON.stringify(tkCustomers));
              break;
              case 5:
                sessionStorage.setItem("tkParticularCustomersData", JSON.stringify(tkCustomers));
              break;
              case "registered":
                sessionStorage.setItem("tkCustomersRegisteredData", JSON.stringify(tkCustomers));
              break;
              case "notregistered":
                sessionStorage.setItem("tkCustomersNotRegisteredData", JSON.stringify(tkCustomers));
              break;
              default:

            }
              return tokenStorageValue;
          },
          getCustomerByTypeDataStorage: function(value) {
            switch (value){
              case 1:
                tkData = !JSON.parse(sessionStorage.getItem("tkAdministrationCustomersData")) ? false : JSON.parse(sessionStorage.getItem("tkAdministrationCustomersData"));
              break;
              case 2:
                tkData = !JSON.parse(sessionStorage.getItem("tkBuildingCustomersData")) ? false : JSON.parse(sessionStorage.getItem("tkBuildingCustomersData"));
              break;
              case 3:
                tkData = !JSON.parse(sessionStorage.getItem("tkCompanyCustomersData")) ? false : JSON.parse(sessionStorage.getItem("tkCompanyCustomersData"));
              break;
              case 4:
                tkData = !JSON.parse(sessionStorage.getItem("tkBranchCustomersData")) ? false : JSON.parse(sessionStorage.getItem("tkBranchCustomersData"));
              break;
              case 5:
                tkData = !JSON.parse(sessionStorage.getItem("tkParticularCustomersData")) ? false : JSON.parse(sessionStorage.getItem("tkParticularCustomersData"));
              break;
              case "registered":
                tkData = !JSON.parse(sessionStorage.getItem("tkCustomersRegisteredData")) ? false : JSON.parse(sessionStorage.getItem("tkCustomersRegisteredData"));
              break;
              case "notregistered":
                tkData = !JSON.parse(sessionStorage.getItem("tkCustomersNotRegisteredData")) ? false : JSON.parse(sessionStorage.getItem("tkCustomersNotRegisteredData"));
              break;
              default:
            }
              return tkData;
          },
          setSelectedCustomerDataStorage: function(tkCustomerData) {
            sessionStorage.setItem("tknCustomerData", JSON.stringify(tkCustomerData));
          },
          temporalStorage: function(tkTmpUser) {
              sessionStorage.setItem("sysTmpUser", JSON.stringify(tkTmpUser));
          },
          tmpTicketlStorage: function(tkTmpTicket) {
              sessionStorage.setItem("sysTmpTicket", JSON.stringify(tkTmpTicket));
          },
          destroyTokenStorage: function(value) {
            switch (value){
              case 1:
                console.log("Destroying the local storage for sysToken, sysLoggedUser, sysLoggedUserModules");
                sessionStorage.removeItem("sysToken");
                sessionStorage.removeItem("sysLoggedUser");
                sessionStorage.removeItem("sysLoggedUserModules");
                sessionStorage.removeItem("sysRouteParams");
                sessionStorage.removeItem("hasReloadedKey");
                sessionStorage.removeItem("loggedOut");
              break;
              case 2:
                sessionStorage.removeItem("attempsToken");
              break;
              case 3:
                sessionStorage.removeItem("sysTmpUser");
              break;
              case 4:
                sessionStorage.removeItem("attempsToken");
                sessionStorage.removeItem("sysTmpUser");
                //sessionStorage.removeItem("sysTmpTicket");
              break;
              case 5:
                sessionStorage.removeItem("sysLoggedUser");
              break;
              case 6:
                sessionStorage.removeItem("tknCustomerData");
              break;
              case 7:
                sessionStorage.removeItem("sysRouteParams");
              break;
              default:

            }

              
              
          },
      }
});

