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
        $scope.save = function() {
            var saveOrderUrl = 'http://192.168.199.111:8089/portal/insert/order/';
            $http({
                url: saveOrderUrl,
                method: 'POST',
                data: JSON.stringify($scope.order)
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
    }])
    .controller('saveOrder',['$scope', '$state', '$http', function($scope, $state, $http){
        var saveOrderUrl = 'http://192.168.199.111:8080/portal/insert/order/';
        $scope.order = {
            customerName: '',
            customerContact: '',
            customerEmail: '',
            turfVariety: '',
            turfQuantity: '',
            totalPrice: '',
            cutter: '',
            driver: '',
            layer: '',
            address: '',
            expectDeliveryDate: moment().format(),
            orderCreate: moment().format(),
            lastModified: moment().format()
        };
        var postData = {
            order_id: '',
            owner: '',
            customer_name: $scope.order.customerName,
            customer_contact: $scope.order.customerContact,
            turf_varity: $scope.order.turfVariety,
            turf_quanutity: $scope.order.turfQuantity,
            cutter: $scope.order.cutter,
            driver: $scope.order.driver,
            layer: $scope.order.layer,
            total_price: $scope.order.totalPrice,
            address_detail: $scope.order.address,
            delivery_date_time: $scope.order.expectDeliveryDate,
            submitted_date_time: $scope.order.orderCreate,
            order_status: 'new',
            customer_email:$scope.order.customerEmail,
            last_modified: $scope.order.orderCreate,
            modifier: '',
            turf_type: '',
            is_delete: ''
        };
        $scope.save = function() {
            //if ($scope.form.$valid) {
                //$http.get(saveOrderUrl)
                //$http(saveOrderUrl, {data:test})
            $http({
                url: saveOrderUrl,
                method: 'POST',
                data: JSON.stringify(postData)
            }).success(function (data) {
                        //jumping to homepage according to the role
                        console.log('create success! ' + data);
                        $state.go('ohhome', {});
                    })
                    .error(function (error) {
                            //jumping to homepage according to the role
                            console.log('create fail: ');
                        }
                    );
           // } else {
           //     console.log('Invalid form to save ! ');
           // }

        }
    }]);

