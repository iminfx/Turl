angular
    .module('app.services', [])
    .factory('orderHandleService', ['$http', '$q', function ($http, $q) {
        return {
            query: function () {
                var defer = $q.defer();  //声明延后执行
                $http({
                    method: 'GET',
                    //url: 'http://localhost:8000/orderlist.json'
                    url: 'http://192.168.199.111:8089/portal/rest/selectorders'
                }).success(function (data, status, headers, config) {
                    defer.resolve(data);  //声明执行成功
                    console.log('orderHandleService success1');
                }).error(function (data, status, headers, config) {
                    defer.reject();      //声明执行失败
                });

                return defer.promise; //返回承诺，返回获取数据的API
            }
        }
    }]);