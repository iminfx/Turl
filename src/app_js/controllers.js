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

    }])
    .controller('saveOrder',['$scope', '$state', '$http', '$stateParams', function($scope, $state, $http, $stateParams){
        //$scope.$state = $state;
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
            customer_name: $stateParams.customer_name,
            customer_contact: $stateParams.customer_contact,
            turf_variety: $stateParams.turf_variety,
            turf_quantity: Number($stateParams.turf_quantity),
            cutter: $stateParams.cutter,
            driver: $stateParams.driver,
            layer: $stateParams.layer,
            total_price: $stateParams.total_price,
            address_detail: $stateParams.address_detail,
            delivery_date_time: moment().format(),
            submitted_date_time: moment().format(),
            order_status: 'new',
            customer_email: $stateParams.customer_email,
            last_modified: moment().format(),
            modifier: '',
            turf_type: '',
            is_delete: ''
        };

        $scope.updateTotalPrice = function(tv, tq){
            $scope.order.total_price = tv*tq;
            //console.log('ng-change execute!')
        };

        $scope.save = function() {
            var saveOrderUrl = 'http://192.168.199.111:8089/portal/insert/order/';
            var orderData = {
                order_id: '',
                owner: '',
                customer_name: $scope.order.customer_name,
                customer_contact: $scope.order.customer_contact,
                turf_variety: $scope.order.turf_variety,
                turf_quantity: $scope.order.turf_quantity,
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
        };

        $scope.saveDraft = function(order) {
            var saveDraftUrl = 'http://192.168.199.111:8089/portal/select/saveasdraft';
            var orderData = {
                draft_id: $stateParams.draft_id,
                owner: '',
                customer_name: order.customer_name,
                customer_contact: order.customer_contact,
                turf_variety: order.turf_variety?order.turf_variety.turf_type:'',
                turf_quantity: order.turf_quantity,
                cutter: order.cutter,
                driver: order.driver,
                layer: order.driver,
                total_price: order.total_price,
                address_detail: order.address_detail,
                delivery_date_time: order.delivery_date_time,
                submitted_date_time: '',
                order_status: 'draft',
                customer_email:order.customer_email,
                last_modified: moment().format(),
                modifier: '',
                turf_type: '',
                is_delete: ''
            };
            $http({
                url: saveDraftUrl,
                method: 'POST',
                data: JSON.stringify(orderData)
            })
                .success(function (data) {
                    //jumping to homepage according to the role
                    console.log('save draft success! ' + data);
                    $state.go('ohhome', {});
                })
                .error(function (error) {
                    //jumping to homepage according to the role
                    console.log('save draft fail: ');
                    $state.go('ohhome', {});
                });
        };
    }])
    .controller('draftOrders',['$scope', '$http', '$q','$state','API', function($scope, $http, $q, $state, API) {

        $scope.loadDrafts = function(){
            var draftOrdersUrl = API+'/portal/select/alldraftfiles';
            //var draftOrdersUrl = 'http://192.168.199.111:8089/portal/rest/selectorders';
            $http.get(draftOrdersUrl)
                .success(function (data) {
                    $scope.bsTableControl.options.data = data;
                    console.log('Get draft orders ready! ');
                })
                .error(function (error) {
                    console.log('Get draft orders fail! ');
                });
        };
        $scope.loadDrafts();
        $scope.bsTableControl = {
            options: {
                data: {},
                cache: false,
                striped: true,
                pagination: true,
                pageSize: 10,
                pageList: [10, 25, 50,100],
                search: true,
                showColumns: true,
                //showRefresh: false,
                //minimumCountColumns: 2,
                clickToSelect: false,
                //showToggle: true,
                //maintainSelected: true,
                toolbar:"#toolbar",
                sortName: 'submitted_date_time',
                sortOrder: 'desc',
                columns: [ {
                    field: 'order_id',
                    checkbox: true
                },{
                    field: 'order_id',
                    title: 'ID',
                    align: 'center',
                    valign: 'middle',
                    formatter: idFormatter,
                    sortable: true,
                    visible: false
                },{
                    field: 'draft_id',
                    title: 'Draft ID',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    visible: false
                }, {
                    field: 'customer_name',
                    title: 'Name',
                    align: 'center',
                    valign: 'middle',
                    formatter: ngclick,
                    sortable: true
                }, {
                    field: 'turf_variety',
                    title: 'Variety',
                    align: 'center',
                    valign: 'middle',
                    formatter: turfVarietyFormatter,
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
                    formatter: dateFormat2,
                    sortable: true
                }, {
                    field: 'submitted_date_time',
                    title: 'SubmittedDate',
                    align: 'center',
                    valign: 'middle',
                    formatter: dateFormat,
                    sortable: true
                }, {
                    field: 'order_status',
                    title: 'Status',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    visible: false
                }]
            }
        };
        function idFormatter(value) {
            return '<a href ui-sref="index">' + value + '</a>';
        }
        function dateFormat(value){
            return value?value.slice(0,10)+'<br/>'+value.slice(11,19):'';
        }
        function dateFormat2(value){
            return value?value.slice(0,10):'';
        }
        function turfVarietyFormatter(value){
            return value?value.turf_type:'';
        }
        $scope.doSomething = function (v) {
            console.log('go to the new order with draft row:'+ v);
            var p = {};
            var fieldsArr = v.split(',');
            for (var i in fieldsArr){
                var key_value = fieldsArr[i].split(':');
                var key = key_value[0];
                p[key] = key_value[1];
            }
            //alert(p.customer_name);
            $state.go('newOrder', p);
        };
        function ngclick(value, row, index) {
            var str = 'customer_name:' + row.customer_name
                + ',customer_contact:' + row.customer_contact
                + ',address_detail:' + row.address_detail
                + ',customer_email:' + row.customer_email
                + ',cutter:' + row.cutter
                + ',delivery_date_time:' + row.delivery_date_time
                + ',driver:' + row.driver
                + ',layer:' + row.layer
                + ',total_price:' + row.total_price
                + ',turf_quantity:' + row.turf_quantity
                + ',turf_variety:' + row.turf_variety
                + ',draft_id:' + row.draft_id;
            return '<a ng-click="$parent.doSomething(\''+str +'\')">'+value+'</a>';
        }

    }]);

angular
    .module('app.ctrl',[])
    .controller('DropdownCtrl', DropdownCtrl)
    .controller('orderHandle', orderHandle)
    .controller('orderDetail', orderDetail);
DropdownCtrl.$inject = ['$scope', '$log'];
orderHandle.$inject = ['$scope','$state','$http','$q', '$stateParams'];
orderDetail.$inject = ['$scope','$http','$state', '$stateParams'];

function DropdownCtrl($scope, $log) {

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


function orderHandle($scope,$state,$http,$q,$stateParams) {

        $http({
            method:'GET',
            url:'http://192.168.199.111:8089/portal/rest/selectorders'
        }).success(function(data,status,headers,config){
            $scope.bsTableControl.options.data = data;

        })
        .error(function(error){
                  //声明执行失败
        });
    $scope.bsTableControl = {
        options: {
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50,100],
            search: true,
            showColumns: true,
            //showRefresh: false,
            //minimumCountColumns: 2,
            clickToSelect: false,
            //showToggle: true,
            //maintainSelected: true,
            toolbar:"#toolbar",
            sortName: 'submitted_date_time',
            sortOrder: 'desc',
            columns: [ {
                field: 'state',
                checkbox: true
            },{
                field: 'order_id',
                title: 'ID',
                align: 'center',
                valign: 'middle',
                formatter: idFormatter,
                sortable: true
            }, {
                field: 'customer_name',
                title: 'Name',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'turf_variety',
                title: 'Variety',
                align: 'center',
                valign: 'middle',
                formatter: turfVarietyFormatter,
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
                sortable: true
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
                formatter: dateFormat2,
                sortable: true
            }, {
                field: 'submitted_date_time',
                title: 'SubmittedDate',
                align: 'center',
                valign: 'middle',
                formatter: dateFormat,
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

    function idFormatter(value,row,index) {
        return '<a href  ui-sref="index.order_detail({order_id:\''+ value +'\'})">' + value + '</a>';
    }
    function turfVarietyFormatter(value){
        return value?value.turf_type:'';
    }
    function dateFormat(value){
        return value?value.slice(0,10)+'<br/>'+value.slice(11,19):'';
    }
    function dateFormat2(value){
        return value?value.slice(0,10):'';
    }
}

function orderDetail ($scope, $http, $state, $stateParams){
    console.log($stateParams);
    $scope.loadSelectOption = function(){
        var selectOptionsUrl = 'http://192.168.199.111:8089/portal/select/test/';
        $http.get(selectOptionsUrl)
            .success(function (data) {
                $scope.turf = data[0].turf;
                $scope.cutters = data[0].cutters;
                $scope.drivers = data[0].drivers;
                $scope.layers = data[0].layers;
            })
            .error(function (error) {
            });
    };
    $scope.loadSelectOption();
    $http({
        url: 'http://192.168.199.111:8089/portal/rest/selectbyid',
        method: 'POST',
        data: $stateParams.order_id
    }).success(function (data) {
        //jumping to homepage according to the role
        console.log('detail success! '+data);
        $scope.order = data[0];
    })
        .error(function (error) {
            //jumping to homepage according to the role
            console.log('detail fail: ');
        }
    );
    $scope.order = {
        order_id: '',
        owner: '',
        customer_name: '',
        customer_contact: '',
        turf_variety: '',
        turf_quantity: '',
        cutter: '',
        driver: '',
        layer: '',
        total_price: '',
        address_detail: '',
        delivery_date_time: moment().format(),
        submitted_date_time: moment().format(),
        order_status: '',
        customer_email: '',
        last_modified: moment().format(),
        modifier: '',
        turf_type: '',
        is_delete: ''
    };

    $scope.disableSwitch = true;
    $scope.mySwitch = function () {
        $scope.disableSwitch = false;
    };
    $scope.myCancel = function () {
       // $scope.order = $scope.orderList;
        $scope.disableSwitch = true;
    };
    $scope.updata = function() {
        /*$scope.updataData = {

        };*/
        var updataData = {
            order_id: $scope.order.order_id,
            customer_name: $scope.order.customer_name,
            customer_contact: $scope.order.customer_contact,
            turf_variety: $scope.order.turf_variety,
            turf_quantity: $scope.order.turf_quantity,
            cutter: $scope.order.cutter,
            driver: $scope.order.driver,
            layer: $scope.order.layer,
            total_price: $scope.order.total_price,
            address_detail: $scope.order.address_detail,
            delivery_date_time: $scope.order.delivery_date_time,
            submitted_date_time: $scope.order.submitted_date_time,
            order_status: $scope.order.order_status,
            customer_email:$scope.order.customer_email,
            last_modified: '',
            modifier: '',
            turf_type: '',
            is_delete: ''
        };
        $http({
            url: 'http://192.168.199.111:8089/portal/insert/order/',
            method: 'POST',
            data: JSON.stringify(updataData)
        }).success(function () {
            //jumping to homepage according to the role
            console.log('updata success! ');
            $state.go('ohhome', {});
        })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('updata fail: ');
            }
        );

    }
}
