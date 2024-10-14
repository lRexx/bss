var moduleAddressServices = angular.module("services.Address", ["tokenSystem", "services.User"]);

moduleAddressServices.service("addressServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var addressResult=0;
      var rsJsonAddress = {};
      var rsJson={};
      var checkResult =0;
      return {
          /* CHECK ADDRESS IF IN DEBT */
          checkIfInDebt: function(idAddress) {
            console.log("[Address Services] => Id Address a verificar: "+idAddress);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Direccion/checkIfAddressIsInDebt/"+idAddress
                  }).then(function mySuccess(response) {
                      addressResult = response.data;
                      return addressResult;
                  },function myError(response) { 
                        if(!idAddress){
                            checkResult = null;
                        }
                    return checkResult;
            });   
          },
          /* GET BUILDING LIST BY ADMIN ID */
          buildingListByAdminId: function(idAdmin) {
            console.log("[Address Services] => Listado de consorcios por id de administracion: "+idAdmin);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Direccion/addressListByCompanyid/"+idAdmin
                  }).then(function mySuccess(response) {
                      return response;
                  },function myError(response) { 
                      console.log("Error: "+response.data.error); 
                      return response;
                  })
          },
          /* GET ALL BUILDINGS CUSTOMERS */
          getBuildings: function() {
            rsJson={};
            //console.log("[Address Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/adress"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /* GET ALL BUILDINGS DEPARTMENTS BY ID*/
          getBuildingsDeptos: function(id) {
            rsJson={};
            //console.log("[Address Services]: Get Agents ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getDepartmentsByCustomerId/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /* GET ALL BUILDINGS DEPARTMENTS BY ID*/
          getBuildingsDeptosFromDeptoId: function(id) {
            rsJson={};
            //console.log("[Address Services]: Get building deptos from depto id ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/getCustomerIdByDepartmentsId/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          getLocations: function(idProvince) {
            rsJson={};
            //console.log("[Address Services]: Get Locations of province id:"+idProvince);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/localidad/"+idProvince
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          getLocationsZones: function(idProvince) {
            rsJson={};
            //console.log("[Address Services]: Get Locations of province id:"+idProvince);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/locationsZone/"+idProvince
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });
          },
          getAllLocations: function() {
            rsJson={};
            //console.log("[Address Services]: Get Locations:");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/localidades"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    //console.log(rsJson);
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*API GOB AR */
          getProvinceIdByName: function(provinceName) {
            rsJson={};
            console.log("[Address Services]: Get Province ID By his Name: "+provinceName);
              return $http({
                    method : "GET",
                    url : "https://apis.datos.gob.ar/georef/api/provincias?nombre="+provinceName+"&campos=id,nombre"
                  }).then(function mySuccess(response) {
                    rsJson=response.data.provincias[0].id;
                    console.log("Provincia: "+provinceName+" ID: "+rsJson);
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*API GOB AR */
          getLocationsByName: function(locationName) {
            rsJson={};
            //console.log("[Address Services]: Get Locations By Name: "+locationName);
              return $http({
                    method : "GET",
                    url : "https://apis.datos.gob.ar/georef/api/localidades?provincia="+locationName+"&campos=id,nombre"
                  }).then(function mySuccess(response) {
                    rsJson=response.data.localidades;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*API GOB AR */
          getAddressByName: function(addressName, idProvince) {
            rsJson={};
            console.log("[Address Services]: Get Address By name" + addressName+"& Province ID: "+idProvince);
            var API_url=idProvince==null || idProvince==''?"https://apis.datos.gob.ar/georef/api/direcciones?direccion=":"https://apis.datos.gob.ar/georef/api/direcciones?provincia="+idProvince+"&direccion=";
            console.log(API_url);
              return $http({
                    method : "GET",
                    url : API_url+addressName+"&campos=provincia, localidad_censal, ubicacion, nomenclatura&exacto=true"
                  }).then(function mySuccess(response) {
                    rsJson=response.data.direcciones.length>0?response.data.direcciones:null;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.errores.codigo_interno);
                    console.log("Error: "+response.data.errores.mensaje); 
                    return response;
            });   
          },
          /*API LOCAL */
          checkIfBuildingExistByAddressName: function(jsonAddr) {
            rsJson={};
            console.log("[Address Services]: chek if a Building Exist by Address name");
            console.log(jsonAddr);
              return $http.post(serverHost+serverBackend+"Clientes/searchAddress",jsonAddr)
                .then(function mySucess(response, status, data) {
                  rsJson.status=response.status;
                  rsJson.data=response.data[0];
                  return rsJson;
              },function myError(response, error) { 
                console.log("Error: "+response.status+" ["+response.statusText+"]");
                rsJson.status=response.status;
                rsJson.data=response.error;   
                return rsJson;
              }); 
          },  
          /*API GOB AR */   
          getStates_API: function() {
            //console.log("[Address Services]: Get States ");
              return $http({
                    method : "GET",
                    url : "https://apis.datos.gob.ar/georef/api/provincias"
                  }).then(function mySuccess(response) {
                    rsJson=response.data.provincias;
                    //console.log(rsJson);
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          /*API LOCAL */   
          getStates: function() {
            //console.log("[Address Services]: Get States ");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Util/provincia/"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    //console.log(rsJson);
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.data.error); 
                    return response;
            });   
          },
          getAddressByidTenant: function(idUser, idTypeTenant, idStatus) {
            //console.log("[Customer Services] => get customer by id: "+sMsg);
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Direccion/addressByidTenant/"+idUser+"/"+idTypeTenant+"/"+idStatus
                  }).then(function mySuccess(response) {
                    return response;
                  }).catch(function onError(response) {
                    console.log("Error: "+response.data.error); 
                    return response;
              })
          },
      }
}]);