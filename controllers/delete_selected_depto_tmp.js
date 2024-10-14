        $scope.deleteSelectedDeptoMultiFn = function(depto){
          console.log("Depto seleccionado:");
          console.log(depto);
          var objArr = [],
          indexArray=[],
          arrIndex=0;
          if(depto.floor!="pb" && depto.floor!="co"){
            /* UNIDAD LETRAS/NUMEROS CORRELATIVAS POR PISO*/
              objArr     = $scope.list_depto_floors[depto.floor+1].deptos;
              indexArray = objArr.map(function(o){return o.idDepto;});
              arrIndex   = indexArray.indexOf(depto.idDepto);
              var tmpFloor=depto.floor+1;departmentUnidad=0;
              $scope.list_depto_floors[depto.floor+1].deptos.splice(arrIndex, 1);
              if (($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1) || ($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==3)){
                for (var j=0; j<$scope.list_depto_floors[tmpFloor].deptos.length;j++){
                  if($scope.list_department_multi.unidad==1 && $scope.list_department_multi.correlacion==1){
                    departmentUnidad='';
                    departmentUnidad=arrLetras[j];
                  }else if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==3){
                    departmentUnidad=departmentUnidad+1;
                  }

                  $scope.list_depto_floors[tmpFloor].deptos[j].departament=departmentUnidad;
                }                  
              /* UNIDAD NUMEROS CORRELATIVOS */
            }else if($scope.list_department_multi.unidad==2 && $scope.list_department_multi.correlacion==2) {                                               
                for (var i=2; i<$scope.list_depto_floors.length; i++){
                  for (var d in  $scope.list_depto_floors[i].deptos){
                    departmentUnidad=departmentUnidad+1;
                    $scope.list_depto_floors[i].deptos[d].departament=departmentUnidad;
                  }
                }   
              
            }
          }else if(depto.floor=="pb"){
            objArr     = $scope.list_depto_floors[1].deptos;
            indexArray = objArr.map(function(o){return o.idDepto;});
            arrIndex   = (depto.idDepto-1);
            $scope.list_depto_floors[1].deptos.splice(arrIndex, 1);
            departmentUnidad=0; 
            for (var d in  $scope.list_depto_floors[1].deptos){
              departmentUnidad=departmentUnidad+1;
              $scope.list_depto_floors[1].deptos[d].departament=departmentUnidad;
            }          
          }else{
            objArr     = $scope.list_depto_floors[0].deptos;
            indexArray = objArr.map(function(o){return o.idDepto;});
            arrIndex   = indexArray.indexOf(depto.idDepto);
            $scope.list_depto_floors[0].deptos.splice(arrIndex, 1);
            departmentUnidad=0; 
            for (var d in  $scope.list_depto_floors[0].deptos){
              departmentUnidad=departmentUnidad+1;
              $scope.list_depto_floors[0].deptos[d].departament=departmentUnidad;
            }       
          }  
        }


Pres Tte Gral Juan Domingo Peron 1219
NEUQUEN 554

Pres Tte Gral Juan Domingo Peron 1218


$scope.list_depto_floors[obj.id].deptos.push({'idClientDepartament':obj.idClientDepartament, 'idDepto':floorsLength+1, 'unitNumber':'', 'floor':obj.nameFloor, 'poNumber':$scope.porteriaCount, 'departament':'PO-'+$scope.porteriaCount, 'idCategoryDepartamentFk': argCategoryDepartament, 'enabled':false, 'idStatusFk':obj.idStatusFk, 'categoryDepartament':[], 'idFloor':$scope.list_depto_floors[obj.id].id});