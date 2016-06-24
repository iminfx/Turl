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
                turf_variety: $scope.order.turf_variety.turf_type,
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
                draftid: '',
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
        /*$scope.orderList = [
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
        ];*/
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
                    sortable: true,
                    visible: false
                }]
            }
        };
        function idFormatter(value) {
            return '<a href ui-sref="index">' + value + '</a>';
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
            var str = 'customer_name:'+row.customer_name
                +',customer_contact:'+row.customer_contact
                +',address_detail:'+row.address_detail
                +',customer_email:'+row.customer_email
                +',cutter:'+row.cutter
                +',delivery_date_time:'+row.delivery_date_time
                +',driver:'+row.driver
                +',layer:'+row.layer
                +',total_price:'+row.total_price
                +',turf_quantity:'+row.turf_quantity
                +',turf_variety:'+row.turf_variety;
            return '<a ng-click="$parent.doSomething(\''+str +'\')">'+value+'</a>';
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
/*    var query = function(){
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
          //调用承诺接口resolove()
        $scope.orderList=data;
        console.log('orderHandleCtrl ...');
    },function(data){
       // $scope.user={error:'数据不存在。。。'}; //调用承诺接口reject();
    });*/
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
        //调用承诺接口resolove()
        //$scope.orderList=data;
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
        console.log('orderHandleCtrl ...');
    },function(data){
        // $scope.user={error:'数据不存在。。。'}; //调用承诺接口reject();
    });
    function idFormatter(value) {
        return '<a href ui-sref="index">' + value + '</a>';
    }
}
