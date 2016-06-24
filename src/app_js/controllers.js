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

       /* $http({
            method:'GET',
            url:'http://192.168.199.111:8089/portal/rest/selectorders'
        }).success(function(data,status,headers,config){
            $scope.bsTableControl = {
                options: {
                    data: data,
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
        })
        .error(function(error){
                  //声明执行失败
        });*/

    $scope.orderList = [
        {
            "order_id": "2",
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": null,
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": null,
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": null,
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160614220921",
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160614220923",
            "owner": "walden",
            "customer_name": "walden",
            "customer_contact": "123456",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160615105249",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "12",
            "turf_quanutity": 23,
            "cutter": "walden",
            "layer": "wadeln",
            "driver": "walden",
            "total_price": 123,
            "address_detail": "qweqweqeqwe",
            "delivery_date_time": "2016",
            "submitted_date_time": "2017",
            "order_status": "in progress",
            "customer_email": "iverson.wuwei@gmail.com",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr2016061511032620160615110326",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "2016/06/22",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160615110433\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160615110557",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "2016/06/22",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": "1"
        },
        {
            "order_id": "eeerrr20160615131604",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": "1"
        },
        {
            "order_id": "aa20160615230255",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615230412",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615230551",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "null20160615230803",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231003",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231054",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231101",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231523",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231618",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231631",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231809",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615231904",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615232012",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "aa20160615232031",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615232421",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615232711",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615232820",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615232852",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233008",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233106",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233106",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233107",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233107",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233108",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233108",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233108",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233108",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233109",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233109",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233133",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615233133",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "null20160615233825",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615233938",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "null20160615234145",
            "owner": null,
            "customer_name": null,
            "customer_contact": null,
            "turf_varity": null,
            "turf_quanutity": 0,
            "cutter": null,
            "layer": null,
            "driver": null,
            "total_price": 0,
            "address_detail": null,
            "delivery_date_time": null,
            "submitted_date_time": null,
            "order_status": null,
            "customer_email": null,
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "aa20160615234250",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615234323",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615234458",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615234629",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615235224",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615235345",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615235749",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615235819",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160615235932",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160616000021",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15",
            "submitted_date_time": "2016-06-15T15",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160616094406",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160616094451",
            "owner": "a",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160616162626",
            "owner": "",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160617101121",
            "owner": "",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160617101422",
            "owner": "",
            "customer_name": "aa",
            "customer_contact": "111",
            "turf_varity": "A",
            "turf_quanutity": 10,
            "cutter": "ss",
            "layer": "ss",
            "driver": "ss",
            "total_price": 200,
            "address_detail": "assas",
            "delivery_date_time": "2016-06-15T15:04:20+08:00",
            "submitted_date_time": "2016-06-15T15:04:20+08:00",
            "order_status": "new",
            "customer_email": "aa@aa.com",
            "last_modified": "",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "ss20160617102943",
            "owner": "",
            "customer_name": "ss",
            "customer_contact": "1234",
            "turf_varity": "4.45",
            "turf_quanutity": 200,
            "cutter": "",
            "layer": "",
            "driver": "",
            "total_price": 0,
            "address_detail": "address",
            "delivery_date_time": "2016-06-24T02:31:32.000Z",
            "submitted_date_time": "2016-06-17T10:31:32+08:00",
            "order_status": "new",
            "customer_email": "ss@dfs",
            "last_modified": "2016-06-17T10:31:32+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "ee20160617103225",
            "owner": "",
            "customer_name": "ee",
            "customer_contact": "333",
            "turf_varity": "9.95",
            "turf_quanutity": 300,
            "cutter": "",
            "layer": "",
            "driver": "",
            "total_price": 2985,
            "address_detail": "eeeeeaddress",
            "delivery_date_time": "2016-06-24T02:34:23.000Z",
            "submitted_date_time": "2016-06-17T10:34:23+08:00",
            "order_status": "new",
            "customer_email": "ee@ee",
            "last_modified": "2016-06-17T10:34:23+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "hh20160617103600",
            "owner": "",
            "customer_name": "hh",
            "customer_contact": "7777",
            "turf_varity": "9.95",
            "turf_quanutity": 2000,
            "cutter": "",
            "layer": "",
            "driver": "",
            "total_price": 0,
            "address_detail": "klklklkl",
            "delivery_date_time": "2016-07-29T02:36:20.000Z",
            "submitted_date_time": "2016-06-17T10:36:20+08:00",
            "order_status": "new",
            "customer_email": "hh@hj",
            "last_modified": "2016-06-17T10:36:20+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "ee20160617133517",
            "owner": "",
            "customer_name": "ee",
            "customer_contact": "123",
            "turf_varity": "4.45",
            "turf_quanutity": 20,
            "cutter": "John Black",
            "layer": "Richard Wood",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "asdsf",
            "delivery_date_time": "2016-06-30T05:37:51.000Z",
            "submitted_date_time": "2016-06-17T13:37:51+08:00",
            "order_status": "new",
            "customer_email": "ee@ee",
            "last_modified": "2016-06-17T13:37:51+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "dd20160617134143",
            "owner": "",
            "customer_name": "dd",
            "customer_contact": "333",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "John Black",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "dssf",
            "delivery_date_time": "2016-06-24T05:43:52.000Z",
            "submitted_date_time": "2016-06-17T13:43:52+08:00",
            "order_status": "new",
            "customer_email": "dd@dd",
            "last_modified": "2016-06-17T13:43:52+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "ABC20160617135728",
            "owner": "",
            "customer_name": "ABC",
            "customer_contact": "123456",
            "turf_varity": "15",
            "turf_quanutity": 100,
            "cutter": "",
            "layer": "",
            "driver": "",
            "total_price": 1800,
            "address_detail": "abc",
            "delivery_date_time": "2016-06-22T05:56:07.000Z",
            "submitted_date_time": "2016-06-17T13:56:07+08:00",
            "order_status": "new",
            "customer_email": "Turftest@yeah.net",
            "last_modified": "2016-06-17T13:56:07+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "AAA20160617140704",
            "owner": "",
            "customer_name": "AAA",
            "customer_contact": "Zoe Zheng",
            "turf_varity": "15",
            "turf_quanutity": 100,
            "cutter": "",
            "layer": "",
            "driver": "",
            "total_price": 1400,
            "address_detail": "aaa",
            "delivery_date_time": "2016-06-30T06:05:07.000Z",
            "submitted_date_time": "2016-06-17T14:05:07+08:00",
            "order_status": "new",
            "customer_email": "zoe@turf.com",
            "last_modified": "2016-06-17T14:05:07+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "adad20160617145200",
            "owner": "",
            "customer_name": "adad",
            "customer_contact": "1234",
            "turf_varity": "",
            "turf_quanutity": 2000,
            "cutter": "John Black",
            "layer": "Mark Wolf",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "adadadaddda",
            "delivery_date_time": "2016-06-24T06:54:34.000Z",
            "submitted_date_time": "2016-06-17T14:54:34+08:00",
            "order_status": "new",
            "customer_email": "adad@fff",
            "last_modified": "2016-06-17T14:54:34+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "ad20160617145335",
            "owner": "",
            "customer_name": "ad",
            "customer_contact": "ad",
            "turf_varity": "",
            "turf_quanutity": 20,
            "cutter": "James Grey",
            "layer": "Kevin Smith",
            "driver": "William King",
            "total_price": 0,
            "address_detail": "dddddd",
            "delivery_date_time": "2016-06-24T06:56:10.000Z",
            "submitted_date_time": "2016-06-17T14:56:10+08:00",
            "order_status": "new",
            "customer_email": "ad@ad",
            "last_modified": "2016-06-17T14:56:10+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "adad20160617145645",
            "owner": "",
            "customer_name": "adad",
            "customer_contact": "1234",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "John Black",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 890,
            "address_detail": "adadadad",
            "delivery_date_time": "2016-06-30T06:58:45.000Z",
            "submitted_date_time": "2016-06-17T14:58:45+08:00",
            "order_status": "new",
            "customer_email": "adad@cc.com",
            "last_modified": "2016-06-17T14:58:45+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "cc20160617150512",
            "owner": "",
            "customer_name": "cc",
            "customer_contact": "1234",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "John Black",
            "layer": "Jack Sheriff",
            "driver": "William King",
            "total_price": 20000,
            "address_detail": "sfsfd",
            "delivery_date_time": "2016-06-30T07:07:26.000Z",
            "submitted_date_time": "2016-06-17T15:07:26+08:00",
            "order_status": "new",
            "customer_email": "cc@dd.com",
            "last_modified": "2016-06-17T15:07:26+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "vv20160617150705",
            "owner": "",
            "customer_name": "vv",
            "customer_contact": "333",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "Kim White",
            "layer": "Henry Marsh",
            "driver": "William King",
            "total_price": 0,
            "address_detail": "sfsdf",
            "delivery_date_time": "2016-06-30T07:09:47.000Z",
            "submitted_date_time": "2016-06-17T15:09:47+08:00",
            "order_status": "new",
            "customer_email": "vv@fff",
            "last_modified": "2016-06-17T15:09:47+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "vvv20160617150743",
            "owner": "",
            "customer_name": "vvv",
            "customer_contact": "333",
            "turf_varity": "",
            "turf_quanutity": 20,
            "cutter": "James Grey",
            "layer": "Alex Lake",
            "driver": "William King",
            "total_price": 0,
            "address_detail": "sdfdsf",
            "delivery_date_time": "2016-06-30T07:10:28.000Z",
            "submitted_date_time": "2016-06-17T15:10:28+08:00",
            "order_status": "new",
            "customer_email": "aa@fff",
            "last_modified": "2016-06-17T15:10:28+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "rr20160617150858",
            "owner": "",
            "customer_name": "rr",
            "customer_contact": "dfd",
            "turf_varity": "",
            "turf_quanutity": 2000,
            "cutter": "Kim White",
            "layer": "Alex Lake",
            "driver": "William King",
            "total_price": 0,
            "address_detail": "dfd",
            "delivery_date_time": "2016-06-30T07:11:42.000Z",
            "submitted_date_time": "2016-06-17T15:11:42+08:00",
            "order_status": "new",
            "customer_email": "ss@fgfg",
            "last_modified": "2016-06-17T15:11:42+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa20160617150952",
            "owner": "",
            "customer_name": "aa",
            "customer_contact": "123",
            "turf_varity": "",
            "turf_quanutity": 2222000,
            "cutter": "David Green",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "fdsdf",
            "delivery_date_time": "2016-06-30T07:12:29.000Z",
            "submitted_date_time": "2016-06-17T15:12:29+08:00",
            "order_status": "new",
            "customer_email": "fss@dsd",
            "last_modified": "2016-06-17T15:12:29+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "aa5520160617151141",
            "owner": "",
            "customer_name": "aa55",
            "customer_contact": "345",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "David Green",
            "layer": "Alex Lake",
            "driver": "William King",
            "total_price": 0,
            "address_detail": "sdfs",
            "delivery_date_time": "2016-06-24T07:14:17.000Z",
            "submitted_date_time": "2016-06-17T15:14:17+08:00",
            "order_status": "new",
            "customer_email": "aa2@dd",
            "last_modified": "2016-06-17T15:14:17+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "eeerrr20160617151352",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160617151418",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "fsf20160617151445",
            "owner": "",
            "customer_name": "fsf",
            "customer_contact": "232",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "John Black",
            "layer": "Richard Wood",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "sfds",
            "delivery_date_time": "2016-06-23T07:17:27.000Z",
            "submitted_date_time": "2016-06-17T15:17:27+08:00",
            "order_status": "new",
            "customer_email": "22@dd",
            "last_modified": "2016-06-17T15:17:27+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "eeerrr20160617151651",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr2016061715173820160617151738",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr2016061715173820160617151738",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "eeerrr20160617151919",
            "owner": "rrrr",
            "customer_name": "eeerrr",
            "customer_contact": "sdsdsd",
            "turf_varity": "34",
            "turf_quanutity": 45,
            "cutter": "Wwu",
            "layer": "erer",
            "driver": "dsdsd",
            "total_price": 123,
            "address_detail": "asdasd",
            "delivery_date_time": "asdsad",
            "submitted_date_time": "tttttt",
            "order_status": "asds",
            "customer_email": "ffffff",
            "last_modified": null,
            "modifier": null,
            "turf_type": null,
            "is_delete": null
        },
        {
            "order_id": "2220160617152054",
            "owner": "",
            "customer_name": "22",
            "customer_contact": "123",
            "turf_varity": "",
            "turf_quanutity": 100,
            "cutter": "John Black",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "eere",
            "delivery_date_time": "2016-06-24T07:23:34.000Z",
            "submitted_date_time": "2016-06-17T15:23:34+08:00",
            "order_status": "new",
            "customer_email": "erw2@244",
            "last_modified": "2016-06-17T15:23:34+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "dddd20160617152517",
            "owner": "",
            "customer_name": "dddd",
            "customer_contact": "5555",
            "turf_varity": "4.45",
            "turf_quanutity": 100,
            "cutter": "Kim White",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 0,
            "address_detail": "fsf",
            "delivery_date_time": "2016-06-24T07:27:53.000Z",
            "submitted_date_time": "2016-06-17T15:27:53+08:00",
            "order_status": "new",
            "customer_email": "ww2@dd",
            "last_modified": "2016-06-17T15:27:53+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "fsdf20160617152617",
            "owner": "",
            "customer_name": "fsdf",
            "customer_contact": "222",
            "turf_varity": "4.45",
            "turf_quanutity": 100,
            "cutter": "John Black",
            "layer": "Kevin Smith",
            "driver": "William King",
            "total_price": 445,
            "address_detail": "sfsda",
            "delivery_date_time": "2016-06-23T16:00:00.000Z",
            "submitted_date_time": "2016-06-17T15:28:39+08:00",
            "order_status": "new",
            "customer_email": "ss@sddd",
            "last_modified": "2016-06-17T15:28:39+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        },
        {
            "order_id": "uuu20160617153423",
            "owner": "",
            "customer_name": "uuu",
            "customer_contact": "123",
            "turf_varity": "",
            "turf_quanutity": 200,
            "cutter": "John Black",
            "layer": "Kevin Smith",
            "driver": "Robert Johnson",
            "total_price": 890,
            "address_detail": "dfd",
            "delivery_date_time": "2016-06-24T07:36:34.000Z",
            "submitted_date_time": "2016-06-17T15:36:34+08:00",
            "order_status": "new",
            "customer_email": "ee@ff",
            "last_modified": "2016-06-17T15:36:34+08:00",
            "modifier": "",
            "turf_type": "",
            "is_delete": ""
        }
    ];
    $scope.bsTableControl = {
        options: {
            data: $scope.orderList,
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
                /*events: window.actionEvents = {
                 'click .detail': function (e, value, row, index) {
                 alert(JSON.stringify(row));
                 console.log(value, row, index);
                 }

                 },*/
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
    /*function idFormatter(value,row,index) {
        //var detail = JSON.stringify(row);
        var orderId = row.order_id;
        //var owner = row.owner;
        var customerName = row.customer_name;
        var customerContact = row.customer_contact;
        var customerEmail = row.customer_email;
        var turfVariety = row.turf_variety;
        var turfQuantity = row.turf_quantity;
        var totalPrice = row.total_price;
        var cutter = row.cutter;
        var driver = row.driver;
        var layer = row.layer;
        var deliveryDate = row.delivery_date_time;
        var submittedDate = row.submitted_date_time;
        var address = row.address_detail;
        var orderStatus = row.order_status;
        return '<a href  ng-click="$parent.detail(\''+ orderId +'\',\''+ customerName +'\',\''
            + customerContact +'\',\''+ customerEmail +'\',\''+ turfVariety +'\',\''+ turfQuantity +'\',\''
            + totalPrice +'\',\''+ cutter +'\',\''+ driver +'\',\''+ layer +'\',\''+ deliveryDate +'\',\''
            + submittedDate +'\',\''+ address +'\',\''+ orderStatus +'\')">' + value + '</a>';
        //return '<a href  ng-click="$parent.detail(\''+ row +'\')">' + value + '</a>';
    }*/

    //$scope.detail = function (orderId,customerName,customerContact,customerEmail,turfVariety,turfQuantity,totalPrice,cutter,driver,layer,deliveryDate,submittedDate,address,orderStatus) {
    //    $state.go('index.order_detail', {
    //        order_id:orderId,
    //        //owner: owner,
    //        customer_name: customerName,
    //        customer_contact: customerContact,
    //        customer_email: customerEmail,
    //        turf_variety: turfVariety,
    //        turf_quantity: turfQuantity,
    //        total_price: totalPrice,
    //        cutter: cutter,
    //        driver: driver,
    //        layer: layer,
    //        address_detail: address,
    //        delivery_date_time: deliveryDate,
    //        submitted_date_time: submittedDate,
    //        order_status: orderStatus
    //    });
    //};
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
    //$scope.order_id = $stateParams.order_id;
    $http({
        url: 'http://192.168.199.111:8080/portal/insert/order/',
        method: 'GET',
        data: JSON.stringify($stateParams.order_id)
    }).success(function (data) {
        //jumping to homepage according to the role
        console.log('updata success! ');
        $scope.order = data;
        $state.go('ohhome', {});
    })
        .error(function (error) {
            //jumping to homepage according to the role
            console.log('updata fail: ');
        }
    );
    /*$scope.order = {
        order_id: $stateParams.order_id,
        customer_name: $stateParams.customer_name,
        customer_contact: $stateParams.customer_contact,
        customer_email: $stateParams.customer_email,
        turf_variety: Number($stateParams.turf_variety),
        turf_quantity: Number($stateParams.turf_quantity),
        total_price: Number($stateParams.total_price),
        cutter: $stateParams.cutter,
        driver: $stateParams.driver,
        layer: $stateParams.layer,
        address_detail: $stateParams.address_detail,
        delivery_date_time: $stateParams.delivery_date_time,
        submitted_date_time: $stateParams.submitted_date_time,
        order_status: $stateParams.order_status
    };*/
    $scope.order = {
        order_id: $stateParams.order_id
    };
    $scope.disableSwitch = true;
    $scope.mySwitch = function () {
        $scope.disableSwitch = false;
    };
    $scope.myCancel = function () {
        $scope.order = {
            order_id: $stateParams.order_id,
            customer_name: $stateParams.customer_name,
            customer_contact: $stateParams.customer_contact,
            customer_email: $stateParams.customer_email,
            turf_variety: Number($stateParams.turf_variety),
            turf_quantity: Number($stateParams.turf_quantity),
            total_price: Number($stateParams.total_price),
            cutter: $stateParams.cutter,
            driver: $stateParams.driver,
            layer: $stateParams.layer,
            address_detail: $stateParams.address_detail,
            delivery_date_time: $stateParams.delivery_date_time,
            submitted_date_time: $stateParams.submitted_date_time,
            order_status: $stateParams.order_status
        };
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
            url: 'http://192.168.199.111:8080/portal/insert/order/',
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
