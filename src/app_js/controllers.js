angular
    .module('login', [])
    .controller('loginCtrl',['$scope', '$http', '$state', 'API', function($scope, $http, $state, API) {
        $scope.account = {
            email: 'mytest@111.com',
            psw: '123'
        };
        $scope.signIn = function(account){
            //send data to BE
            var loginUrl = 'http://123.345.222:8000/'+'loginddffgghhgj';
            $http.post(loginUrl, account)
                .success(function (data) {
                    //jumping to homepage according to the role
                    console.log('login success at '+ loginUrl);
                    $state.go('index', {});

                })
                .error(function (error) {
                    //jumping to homepage according to the role
                    console.log('login fail at '+ loginUrl);
                    $state.go('login', {});
                });
        }
    }
    ]);