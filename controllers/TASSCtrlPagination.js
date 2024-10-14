/**
* Pagination Controller
**/
var pagination = angular.module("module.Pagintation", ["angular.filter"]);

pagination.controller('PaginationCtrl', function($scope, $filter){

    /********************************************************************************************************************************************
    *                                                                                                                                           *
    *                                                                                                                                           *
    *                                                             P A G I N A C I O N                                                           *
    *                                                                                                                                           *
    *                                                                                                                                           *
    ********************************************************************************************************************************************/
    /**
    * Pagination Functions
    **/
     $scope.itemPerPage=0;
    $scope.loadPagination = function(item, orderBy, itemsByPage){
       //console.log("[loadPagination]");
       var rowList=[];
       var rowId=null;
       for (var key in item){
        if (item[key].idProduct!=undefined && typeof item[key].idProduct === 'string'){
           rowId=Number(item[key].idProduct);
           item[key].idProduct=rowId;
           rowList.push(item[key]);
        }
       }
       //console.log(rowList);
       var sortingOrder     = orderBy;
       var itemsPerPage     = itemsByPage;
       $scope.sortingOrder  = sortingOrder;
       $scope.reverse       = false;
       $scope.filteredItems = [];
       $scope.groupedItems  = [];
       $scope.itemsPerPage  = itemsPerPage;
       $scope.pagedItems    = [];
       $scope.currentPage   = 0;
       $scope.items         = [];
       $scope.items         = rowList;
       $scope.itemPerPage   = $scope.itemsPerPage;
       //console.log($scope.items);
       $scope.search();
    }
    // init the filtered items
    $scope.search = function (qvalue1, qvalue2, vStrict) {
            //console.log("[search]-->qvalue1: "+qvalue1);
            //console.log("[search]-->qvalue2: "+qvalue2);
            //console.log("[search]-->vStrict: "+vStrict);
            $scope.filteredItems = $filter("filter")($scope.items, qvalue1, vStrict);
            if (qvalue2!='' && qvalue2!=null){$scope.filteredItems = $filter("filter")($scope.filteredItems, qvalue2, vStrict);}
        //console.log($scope.filteredItems);
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter("orderBy")($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
            //console.log($scope.filteredItems);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    // calculate page in place
    $scope.groupToPages = function (itemPerPage) {
        var itemsPerPage = itemPerPage==undefined || itemPerPage==null?$scope.itemsPerPage:itemPerPage;
        $scope.pagedItems = [];
        for (var i = 1; i < $scope.filteredItems.length; i++) {
            if (i % itemsPerPage === 1) {
                //console.log("entro al if");
                $scope.pagedItems[Math.floor(i / itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                //console.log("entro al else");
                $scope.pagedItems[Math.floor(i / itemsPerPage)].push($scope.filteredItems[i]);
            } 
            //console.log($scope.pagedItems[Math.floor(i / itemsPerPage)]);
        }
        //console.log($scope.pagedItems);
        //console.log("PAGINATION LOADED");
    };
    //Previous Page
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    //Next Page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    //Last Page
    $scope.lastPage = function(){          
        $scope.currentPage=($scope.pagedItems.length-1);
    }
    //First Page
    $scope.firstPage = function () {
        $scope.currentPage=($scope.pagedItems.length-$scope.pagedItems.length);
    };

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        //$('th i').each(function(){
        //    // icon reset
        //    $(this).removeClass().addClass('icon-sort');
        //});
        if ($scope.reverse)
            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
        else
            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
    };
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});