angular
    .module('login', [])
    .controller('loginCtrl',['$scope', function($scope) {
        $scope.account = {
            email: 'mytest@111.com',
            psw: '123'
        };
        $scope.signIn = function(account){
            //send data to BE
        }
    }
    ]);