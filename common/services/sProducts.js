var moduleProductsServices = angular.module("services.Products", ["tokenSystem", "services.User"]);

moduleProductsServices.service("ProductsServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var rsJson = {};
      var sndJson= {};
      var checkResult =0;
      return {
          /* GET ALL PRODUCTS OR SEARCH BY ANY CRITERIA */
          list: function(searchFilter) {
            var sFilter=searchFilter;
            var sMsg=searchFilter=='' || searchFilter==null||searchFilter==undefined?"All":searchFilter;
            console.log("[Products Services] => criterio de busqueda: "+sMsg);
              return $http.post(serverHost+serverBackend+"Product/search",sFilter,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response.data;
                  return rsJson;
                },function myError(response) { 
                  console.log("Error: "+response); 
                  return response;
                })  
          },
          getProductClassification: function() {
            console.log("[Products Services]: Products Classification");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Seeds/ProductClassification/"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response); 
                    return response;
            });   
          },
          getDiviceOpening: function() {
            console.log("[Products Services]: Products Device Opening");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Seeds/DiviceOpening/"
                  }).then(function mySuccess(response) {
                    rsJson=response.data;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response); 
                    return response;
            });   
          },
          /* NEW PRODUCT */
          new: function(newProduct) {
            sndJson = newProduct;
            console.log("[Product Services] => New Product ");
            console.log(sndJson);
              return $http.post(serverHost+serverBackend+"Product",sndJson,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                },function myError(response) { 
                  console.log("[Product Services] => newProduct: error");
                  //console.log(response);
                  console.log("Error: "+response.status+" ["+response.statusText+"]"); 
                  return response;
                }); 
          },
          /* NEW PRODUCT */
          update: function(updateProduct) {
            sndJson = updateProduct;
            console.log("[Product Services] => Update Product ");
            console.log(sndJson);
              return $http.post(serverHost+serverBackend+"Product/update",sndJson,serverHeaders)
                .then(function mySucess(response, status) {
                  rsJson=response;
                  return rsJson;
                },function myError(response) { 
                  console.log("[Product Services] => newProduct: error");
                  //console.log(response);
                  console.log("Error: "+response.status+" ["+response.statusText+"]"); 
                  return response;
                }); 
          },
          delete: function(id) {
            console.log("[Product Services] => Delete Product ");
              return $http({
                    method : "delete",
                    url : serverHost+serverBackend+"Product/delete/"+id
                  }).then(function mySuccess(response) {
                    rsJson=response;
                    return rsJson;
                  },function myError(response) { 
                    console.log("Error: "+response.status+" ["+response.statusText+"]");  
                    return response;
            });   
          },
          listProducts4Service: function() {
            console.log("[Product Services] => List Product for service");
              return $http({
                    method : "GET",
                    url : serverHost+serverBackend+"Product/getProducts4Service"
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