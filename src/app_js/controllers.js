angular
    .module('login', [])
    .controller('loginCtrl',['$scope', '$http', '$state', '$window', 'API', function($scope, $http, $state, $window, API) {
        $scope.account = {
            email: 'mytest@111.com',
            psw: '123'
        };
        $scope.signIn = function(account){
            //send data to BE
            var loginUrl = 'http://localhost:8000/test.json';
            $http.get(loginUrl, account)
                .success(function (data) {
                    //jumping to homepage according to the role
                    //$window.sessionStorage.token = data.token;
                    $window.sessionStorage.token = 'this is the token message';
                    console.log('login success at '+ $window.sessionStorage.token);
                    $state.go('ohhome', {});

                })
                .error(function (error) {
                    //jumping to homepage according to the role
                    delete $window.sessionStorage.token;
                    console.log('login fail at '+ loginUrl);
                    $state.go('login', {});
                });
        }
    }
    ]);

angular
    .module('orderManagement',[])
    .controller('createNewOrder',['$scope', '$state', function($scope, $state){
        $scope.createNewOrder = function(){
            $state.go('newOrder', {});
        }
    }])
    .controller('saveOrder',['$scope', '$state', '$http', function($scope, $state, $http){
        var saveOrderUrl = 'http://192.168.199.111:8080/insert';
        $scope.order = {
            customerName: '',
            customerContact: '',
            customerEmail: '',
            turfVariety: '',
            turfQuantity: '',
            cutter: '',
            driver: '',
            layer: '',
            address: '',
            expectDeliveryDate: moment().format(),
            orderCreate: moment().format(),
            lastModified: moment().format()
        };

        $scope.save = function() {
            if ($scope.form.$valid) {
                $http.post(saveOrderUrl, $scope.order)
                    .success(function (data) {
                        //jumping to homepage according to the role
                        console.log('create success! ' + $scope.order.customerName);
                        $state.go('ohhome', {});
                    })
                    .error(function (error) {
                            //jumping to homepage according to the role
                            console.log('create fail: ' + error.errorCode + ': ' + error.errorMessages);
                        }
                    );
            } else {
                console.log('Invalid form to save ! ');
            }
        }
    }]);

