angular
    .module('login', [])
    .controller('loginCtrl',['$scope', '$http', '$state', '$window', 'API', function($scope, $http, $state, $window, API) {
        $scope.account = {
            email: 'mytest@111.com',
            psw: '123'
        };
        $scope.signIn = function(account){
            //send data to BE
            //var loginUrl = 'http://192.168.199.111:8080/portal/rest/selectorders/';
            $state.go('ohhome', {});
            //var loginUrl = 'http://localhost:8000/test.json';
/*            $http.get(loginUrl)
            //$http.get(loginUrl, account)
                .success(function (data) {
                    //jumping to homepage according to the role
                    //$window.sessionStorage.token = data.token;
                    $window.sessionStorage.token = 'this is the token message';
                    console.log('login success at '+ data);
                    $state.go('ohhome', {});

                })
                .error(function (error) {
                    //jumping to homepage according to the role
                    delete $window.sessionStorage.token;
                    console.log('login fail at '+ loginUrl);
                    $state.go('login', {});
                });*/
        }
    }
    ]);

angular
    .module('orderManagement',[])
    .controller('orderMngCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
        $scope.$state = $state;
        $scope.createNewOrder = function(){
            $state.go('newOrder', {});
        };
        $scope.loadSelectOption = function(){
            var selectOptionsUrl = 'http://192.168.199.111:8089/portal/select/test/';
            $http.get(selectOptionsUrl)
                .success(function (data) {
                    $scope.turf = data[0].turf;
                    $scope.cutters = data[0].cutters;
                    $scope.drivers = data[0].drivers;
                    $scope.layers = data[0].layers;
                    console.log('Get select options ready! ');
                })
                .error(function (error) {
                    console.log('Get select options fail! ');
                });
        };
        $scope.loadSelectOption();
        /*$scope.order = {
            customerName: '',
            customerContact: '',
            customerEmail: '',
            turfVariety: 0,
            turfQuantity: '',
            totalPrice: '',
            cutter: '',
            driver: '',
            layer: '',
            address: '',
            expectDeliveryDate: moment().format(),
            orderCreate: moment().format(),
            lastModified: moment().format()
        };*/
        $scope.order = {
            order_id: '',
            owner: '',
            customer_name: '',
            customer_contact: '',
            turf_varity: 0,
            turf_quanutity: '',
            cutter: '',
            driver: '',
            layer: '',
            total_price: '',
            address_detail: '',
            delivery_date_time: moment().format(),
            submitted_date_time: moment().format(),
            order_status: 'new',
            customer_email:'',
            last_modified: moment().format(),
            modifier: '',
            turf_type: '',
            is_delete: ''
        };

        $scope.updateTotalPrice = function(tv, tq){
            $scope.order.total_price = tv*tq;
            console.log('ng-change execute!')
        };

        $scope.save = function() {
            var saveOrderUrl = 'http://192.168.199.111:8089/portal/insert/order/';
            var orderData = {
                order_id: '',
                owner: '',
                customer_name: $scope.order.customer_name,
                customer_contact: $scope.order.customer_contact,
                turf_varity: $scope.order.turf_varity.turf_type,
                turf_quanutity: $scope.order.turf_quanutity,
                cutter: $scope.order.cutter,
                driver: $scope.order.driver,
                layer: $scope.order.driver,
                total_price: $scope.order.total_price,
                address_detail: $scope.order.address_detail,
                delivery_date_time: $scope.order.delivery_date_time,
                submitted_date_time: moment().format(),
                order_status: 'new',
                customer_email:$scope.order.customer_email,
                last_modified: moment().format(),
                modifier: '',
                turf_type: '',
                is_delete: ''
            };
            $http({
                url: saveOrderUrl,
                method: 'POST',
                data: JSON.stringify(orderData)
            })
            .success(function (data) {
                //jumping to homepage according to the role
                console.log('create success! ' + data);
                $state.go('ohhome', {});
            })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('create fail: ');
                $state.go('ohhome', {});
            });
        }
    }]);

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
    var query = function(){
        var defer=$q.defer();  //声明延后执行
        $http({
            method:'GET',
            url:'http://192.168.199.111:8089/portal/rest/selectorders'
        }).success(function(data,status,headers,config){
                defer.resolve(data);  //声明执行成功

                console.log('orderList success');
            })
            .error(function(data,status,headers,config){
                defer.reject();      //声明执行失败
            });

        return defer.promise; //返回承诺，返回获取数据的API
    };
    var promise = query();
    promise.then(function(data){
        $scope.orderList=data;  //调用承诺接口resolove()
        $scope.bsTableControl = {
            options: {
                data: $scope.orderList,
                cache: false,
                striped: true,
                pagination: true,
                pageSize: 10,
                pageList: [10, 25, 50,100],
                search: true,
                //showColumns: true,
                //showRefresh: false,
                //minimumCountColumns: 2,
                clickToSelect: false,
                //showToggle: true,
                //maintainSelected: true,
                toolbar:"#toolbar",
                formatter: idFormatter,
                columns: [ {
                    field: 'state',
                    checkbox: true
                },{
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
                    sortable: true,
                    visible: false
                }, {
                    field: 'driver',
                    title: 'Driver',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    visible: false
                }, {
                    field: 'layer',
                    title: 'Layer',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    visible: false
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
        console.log('orderHandleCtrl ...');
    },function(data){
       // $scope.user={error:'数据不存在。。。'}; //调用承诺接口reject();
    });

    function idFormatter(value) {
        return '<a ui-sref="index">' + value + '</a>';
    }
}
