angular
    .module('app.ctrl',[])
    .controller('DropdownCtrl', DropdownCtrl)
    .controller('orderHandle', orderHandle);
DropdownCtrl.$inject = ['$scope', '$log'];
orderHandle.$inject = ['$scope','$http','$q'];

function DropdownCtrl($scope, $log) {

    /*$scope.items = [
     'The first choice!',
     'And another choice for you.',
     'but wait! A third!'
     ];*/

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
}


function orderHandle($scope,$http,$q) {
    var a = function(){
        var defer=$q.defer();  //声明延后执行
        $http({
            method:'GET',
            url:'http://192.168.199.111:8089/portal/rest/selectorders'
        })
            .success(function(data,status,headers,config){
                defer.resolve(data);  //声明执行成功
                console.log('UserInfoService success');
            })
            .error(function(data,status,headers,config){
                defer.reject();      //声明执行失败
            });

        return defer.promise; //返回承诺，返回获取数据的API
    };
    var promise = a();
    promise.then(function(data){
        $scope.orderList=data;  //调用承诺接口resolove()
        console.log('MainCtrl ...');
    },function(data){
       // $scope.user={error:'数据不存在。。。'}; //调用承诺接口reject();
    });
    $scope.bsTableControl = {
        options: {
            data: orderList,
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50,100],
            search: true,
            showColumns: true,
            //showRefresh: false,
            minimumCountColumns: 2,
            clickToSelect: false,
            //showToggle: true,
            //maintainSelected: true,
            toolbar:"#toolbar",
            columns: [{
                field: 'state',
                checkbox: true
            }, {
                field: 'order_id',
                title: 'ID',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'customer_name',
                title: 'Name',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'turf_type',
                title: 'Type',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'turf_variety',
                title: 'Variety',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'turf_quantity',
                title: 'Quantity',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'total_price',
                title: 'Price',
                align: 'center',
                valign: 'middle',
                clickToSelect: false
                //formatter: flagFormatter,
                // events: flagEvents
            }, {
                field: 'cutter',
                title: 'Cutter',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'driver',
                title: 'Driver',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'layer',
                title: 'Layer',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'delivery_date_time',
                title: 'DeliveryDate',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'submitted_date_time',
                title: 'SubmittedDate',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'order_status',
                title: 'Status',
                align: 'center',
                valign: 'middle',
                sortable: true
            }]
        }
    };
}
