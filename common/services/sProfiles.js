var moduleProfilesServices = angular.module("services.Profiles", ["tokenSystem", "services.User"]);

moduleProfilesServices.service("ProfileServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var rsJson = {};
      var sndJson= {};
      var checkResult =0;
      return {
          /* GET ALL SYS PROFILES OR SEARCH BY ANY CRITERIA */
          listProfiles: function(searchFilter) {
            var sFilter=searchFilter;
            var sMsg=searchFilter==null||searchFilter==undefined?"All":searchFilter;
            console.log("[Profile Services] => criterio de busqueda: "+sMsg);
              return $http.post(serverHost+serverBackend+"profiles/search",sFilter)
                .then(function mySucess(response, status) {
                  rsJson=response.data;
                  return rsJson;
                },function myError(response) { 
                  console.log("Error: "+response.error); 
                  return response;
                })  
          },
          byIdProfile: function(id) {
            console.log("[Profile Services]: buscar profile por el id "+id);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"profiles/find/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response.data.response;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.error); 
                    return response;
            });   
          },
          getSysModules: function(id) {
            console.log("[Profile Services]: Get Modules ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"profiles/modules/"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.error); 
                    return response;
            });   
          },
          /* NEW SYSTEM PROFILE */
          newSysProfile: function(newProfile) {
            sndJson = newProfile;
            console.log("[Profile Services] => New profile: ");
            console.log(sndJson);
              return $http.post(serverHost+serverBackend+"profiles",sndJson, serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                },function myError(response) { 
                  console.log("[Profile Services] => newSysProfile: error");
                  //console.log(response);
                  console.log("Error: "+response.status+" ["+response.statusText+"]"); 
                  return response;
                }); 
          },
          /* NEW SYSTEM PROFILE */
          updateSysProfile: function(updProfile) {
            sndJson = updProfile;
            console.log("[Profile Services] => update profile: ");
            console.log(sndJson);
              return $http.post(serverHost+serverBackend+"profiles/update",sndJson, serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                },function myError(response) { 
                  console.log("[Profile Services] => newSysProfile: error");
                  //console.log(response);
                  console.log("Error: "+response.status+" ["+response.statusText+"]"); 
                  return response;
                }); 
          },
          deleteSysProfile: function(id) {
            console.log("[Profile Services]: Delete sys Profile ");
              return $http({
                    method : "delete",
                    url : serverHost+serverBackend+"profiles/delete/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.status+" ["+response.statusText+"]");  
                    return response;
            });   
          },
      }
}]);