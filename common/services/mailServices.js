var moduleMailServices = angular.module("systemServices.Mail", ["tokenSystem", "services.User"]);

moduleMailServices.service("mailServices", ['$http', 'tokenSystem', '$timeout', 'serverHost', 'serverBackend', 'serverHeaders', 
  function($http, tokenSystem, $timeout, serverHost, serverBackend, serverHeaders){
      var addressResult=0;
      var rsJsonAddress = {};
      var checkResult =0;
      var mdata={title:'', mailTo:'', body:''}
      return {
          /* GET TICKET */
          sendMail: function(mto, mtitle, mbody) {
              mdata.title=mtitle;
              mdata.mailTo=mto;
              mdata.body=mbody;
              //console.log(mdata);
              //console.log(ticketData);
              return $http.post(serverHost+serverBackend+"Ticket/sendMail",mdata, serverHeaders)
                .then(function mySucess(response) {
                  checkResult = response.data.code;
                  console.log(response.data.code); 
                  return checkResult;
              },function myError(response) { 
                //console.log(response.data); 
                checkResult = response.data.code;
                return checkResult;
              });
          },
      }
}]);