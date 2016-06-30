angular
    .module('app.ctrl', [])
    .controller('loginCtrl',loginCtrl)
    .controller('saveOrder',saveOrder)
    .controller('draftOrders',draftOrders)
    .controller('DropdownCtrl', DropdownCtrl)
    .controller('sidebarCtrl', sidebarCtrl)
    .controller('orderHandle', orderHandle)
    .controller('orderDetail', orderDetail)
    .controller('register', register)
    .controller('workerList', workerList);
loginCtrl.$inject = ['$scope', '$http', '$state', '$window', 'API'];
saveOrder.$inject = ['$scope', '$state', '$http', '$stateParams'];
draftOrders.$inject = ['$scope', '$http', '$q','$state','API'];
DropdownCtrl.$inject = ['$scope', '$log'];
sidebarCtrl.$inject = ['$scope', '$state'];
orderHandle.$inject = ['$scope','$state','$http','$q', '$stateParams','orderHandleService'];
orderDetail.$inject = ['$scope','$http','$state', '$stateParams'];
register.$inject = ['$scope','$http','$state', '$stateParams'];
workerList.$inject = ['$scope','$http','$state', '$stateParams'];
function loginCtrl ($scope, $http, $state, $window, API) {
    $scope.account = {
        email: 'mytest@111.com',
        psw: '123'
    };
    $scope.signIn = function(account){
        //send data to BE
        //var loginUrl = 'http://192.168.199.111:8080/portal/rest/selectorders/';
        $state.go('orderhandler', {});
        //var loginUrl = 'http://localhost:8000/test.json';
        /*            $http.get(loginUrl)
         //$http.get(loginUrl, account)
         .success(function (data) {
         //jumping to homepage according to the role
         //$window.sessionStorage.token = data.token;
         $window.sessionStorage.token = 'this is the token message';
         console.log('login success at '+ data);
         $state.go('orderhandler', {});

         })
         .error(function (error) {
         //jumping to homepage according to the role
         delete $window.sessionStorage.token;
         console.log('login fail at '+ loginUrl);
         $state.go('login', {});
         });*/
    }
}

function saveOrder ($scope, $state, $http, $stateParams){
    //$scope.$state = $state;
    $scope.loadSelectOption = function(){
        var selectOptionsUrl = 'http://192.168.199.150:8089/portal/select/test/';
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
        delivery_date_time: new Date(),
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
        var saveOrderUrl = 'http://192.168.199.150:8089/portal/insert/order/';
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
                $state.go('orderhandler', {});
            })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('create fail: ');
                $state.go('orderhandler', {});
            });
    };

    $scope.saveDraft = function(order) {
        var saveDraftUrl = 'http://192.168.199.150:8089/portal/select/saveasdraft';
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
                $state.go('orderhandler.draftOrders', {});
            })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('save draft fail: ');
                $state.go('orderhandler.draftOrders', {});
            });
    };
}

function draftOrders ($scope, $http, $q, $state, API) {

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

}

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
}

function sidebarCtrl($scope, $state) {
    $scope.$state = $state;
}

function orderHandle($scope,$state,$http,$q,$stateParams,orderHandleService) {
    $scope.createNewOrder = function(){
        $state.go('orderhandler.newOrder', {});
    };
    $scope.mypromise = $http({
            method:'GET',
            url:'http://192.168.199.150:8089/portal/rest/selectorders'
            //url:'http://localhost:8000/orderlist.json'
        }).success(function(data,status,headers,config){
            $scope.bsTableControl.options.data = data;

        })
        .error(function(error){
                  //声明执行失败
        });
    /*$scope.promise = orderHandleService.query()  //同步调用，获取承诺接口
    .then(function(data){
        $scope.bsTableControl.options.data = data;  //调用承诺接口resolove()
        console.log('orderHandleService success ...');
    },function(data){
       // $scope.bsTableControl.options.data={error:'数据不存在。。。'}; //调用承诺接口reject();
        console.log('orderHandleService fail');
    });*/

    $scope.bsTableControl = {
            options: {
                //data:orderList,
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
        return '<a href  ui-sref="orderhandler.order_detail({order_id:\''+ value +'\'})">' + value + '</a>';
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
    $scope.getId = [];
    $scope.delete = function() {
        $scope.ids = $.map($('#table').bootstrapTable('getSelections'), function (row) {
            $scope.getId.push(row.order_id);
            return row.order_id;
        });
        $('#table').bootstrapTable('remove', {
            field: 'order_id',
            values: $scope.ids
        });
        $http({
            url: 'http://192.168.199.111:8089/portal/insert/order/',
            method: 'POST',
            data: JSON.stringify($scope.getId)
        }).success(function () {
            //jumping to homepage according to the role
            console.log('delete success! ');
            $state.go('orderhandler', {});
        })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('delete fail: ');
                $state.go('orderhandler', {});
            }
        );

    }
}

function orderDetail ($scope, $http, $state, $stateParams){
    console.log($stateParams);
    $scope.updateTotalPrice = function(tv, tq){
        $scope.order.total_price = tv*tq;
        //console.log('ng-change execute!')
    };
    $scope.loadSelectOption = function(){
        var selectOptionsUrl = 'http://192.168.199.150:8089/portal/select/test/';
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
        delivery_date_time: new Date(),
        submitted_date_time: new Date(),
        order_status: '',
        customer_email: '',
        last_modified: '',
        modifier: '',
        turf_type: '',
        is_delete: ''
    };
    $scope.detailInfo = function() {
        $scope.mypromise = $http({
            url: 'http://192.168.199.150:8089/portal/rest/selectbyid',
            method: 'POST',
            data: $stateParams.order_id
            //url: 'http://localhost:8000/ordedetail.json',
           // method: 'GET'
        }).success(function (data) {
            //jumping to homepage according to the role
            console.log('detail success! '+data);
            $scope.order = data[0];
            $scope.order.delivery_date_time = new Date(data[0].delivery_date_time);
            $scope.temoOrder = {
                c_order_id: data[0].order_id,
                c_customer_name: data[0].customer_name,
                c_customer_contact: data[0].customer_contact,
                c_turf_variety: data[0].turf_variety,
                c_turf_quantity: data[0].turf_quantity,
                c_cutter: data[0].cutter,
                c_driver: data[0].driver,
                c_layer: data[0].layer,
                c_total_price: data[0].total_price,
                c_address_detail: data[0].address_detail,
                c_delivery_date_time: new Date(data[0].delivery_date_time),
                c_submitted_date_time: new Date(data[0].submitted_date_time),
                c_order_status: data[0].order_status,
                c_customer_email:data[0].customer_email,
                c_is_delete: ''
            };
        })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('detail fail: ');
            }
        );
    };
    $scope.detailInfo();


    $scope.disableSwitch = true;
    $scope.mySwitch = function () {
        $scope.disableSwitch = false;
    };
    $scope.myCancel = function () {
        $scope.order = {
            order_id: $scope.temoOrder.c_order_id,
            customer_name: $scope.temoOrder.c_customer_name,
            customer_contact: $scope.temoOrder.c_customer_contact,
            turf_variety: $scope.temoOrder.c_turf_variety,
            turf_quantity: $scope.temoOrder.c_turf_quantity,
            cutter: $scope.temoOrder.c_cutter,
            driver: $scope.temoOrder.c_driver,
            layer: $scope.temoOrder.c_layer,
            total_price: $scope.temoOrder.c_total_price,
            address_detail: $scope.temoOrder.c_address_detail,
            delivery_date_time: $scope.temoOrder.c_delivery_date_time,
            submitted_date_time: $scope.temoOrder.c_submitted_date_time,
            order_status: $scope.temoOrder.c_order_status,
            customer_email:$scope.temoOrder.c_customer_email,
            is_delete: ''
        };
        $scope.disableSwitch = true;
    };
    $scope.upData = function() {
        var upDataPost = {
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
            url: 'http://192.168.199.150:8089/portal/insert/order/',
            method: 'POST',
            data: JSON.stringify(upDataPost)
        }).success(function () {
            //jumping to homepage according to the role
            console.log('upData success! ');
            $state.go('orderhandler', {});
        })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('upData fail: ');
                $state.go('orderhandler', {});
            }
        );

    };
    $scope.delete = function() {
        $http({
            //url: 'http://192.168.199.111:8089/portal/insert/order/',
            method: 'POST',
            data: JSON.stringify($scope.order.order_id)
        }).success(function () {
            //jumping to homepage according to the role
            console.log('delete success! ');
            $state.go('orderhandler', {});
        })
            .error(function (error) {
                //jumping to homepage according to the role
                console.log('delete fail: ');
                $state.go('orderhandler', {});
            }
        );

    }
}

function register ($scope, $http, $state, $stateParams) {
    $scope.registerWork = function(){

    }
}

function workerList ($scope, $http, $state, $stateParams) {

    /*$http({
        method:'GET',
        url:'http://192.168.199.150:8089/portal/rest/selectorders'
    }).success(function(data,status,headers,config){
        $scope.bsTableControl.options.data = data;

    })
        .error(function(error){
            //声明执行失败
        });*/
    /*$scope.promise = orderHandleService.query()  //同步调用，获取承诺接口
     .then(function(data){
     $scope.bsTableControl.options.data = data;  //调用承诺接口resolove()
     console.log('orderHandleService success ...');
     },function(data){
     // $scope.bsTableControl.options.data={error:'数据不存在。。。'}; //调用承诺接口reject();
     console.log('orderHandleService fail');
     });*/

    $scope.bsTableControl = {
        options: {
            data:[],
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
            sortName: 'submitted_date_time',
            sortOrder: 'desc',
            columns: [ {
                field: 'state',
                checkbox: true
            },{
                field: 'work_id',
                title: 'ID',
                align: 'center',
                valign: 'middle',
                //formatter: idFormatter,
                sortable: true
            },{
                field: 'name',
                title: 'Name',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'contact',
                title: 'Contact',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'e-mail',
                title: 'E-mail',
                align: 'center',
                valign: 'middle',
                //formatter: turfVarietyFormatter,
                sortable: true
            }, {
                field: 'address',
                title: 'Address',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'role',
                title: 'Role',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'submitted_date_time',
                title: 'SubmittedDate',
                align: 'center',
                valign: 'middle',
                //formatter: dateFormat,
                sortable: true
            }/*, {
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
                //formatter: dateFormat2,
                sortable: true
            }, {
                field: 'submitted_date_time',
                title: 'SubmittedDate',
                align: 'center',
                valign: 'middle',
                //formatter: dateFormat,
                sortable: true
            }, {
                field: 'order_status',
                title: 'Status',
                align: 'center',
                valign: 'middle',
                sortable: true
            }*/]
        }
    };

    function idFormatter(value,row,index) {
        return '<a href  ui-sref="orderhandler.order_detail({worker_id:\''+ value +'\'})">' + value + '</a>';
    }

    $scope.registerNewWorker = function(){
        $state.go('orderhandler.register', {});
     };
}
