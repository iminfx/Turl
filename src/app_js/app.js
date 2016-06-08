angular
    .module('turfApp', ['ui.router', 'login'])
    .value('API', 'http://localhost:8000/')
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/login');
          $stateProvider
              .state('index', {
                  url: '/index',
                  views: {
                      '': {
                          templateUrl: 'tpls/home.html'
                      },
                      'topbar@index': {
                          templateUrl: 'tpls/topbar.html'
                      },
                      'sidebar@index': {
                          templateUrl: 'tpls/sidebar.html'
                      },
                      'main@index': {
                          templateUrl: 'tpls/tenantlist.html'
                          /*controller: function($scope, $state) {
                              $scope.addUserType = function() {
                                  $state.go("index.addusertype");
                              }
                          }*/
                      }
                  }
              })
              .state('login', {
                  url: '/login',
                  views: {
                      '': {
                          templateUrl: 'tpls/login.html'
                      }
                  }
              })
              .state('index.addusertype', {
                  url: '/addusertype',
                  views: {
                      'main@index': {
                          templateUrl: 'tpls/addusertype.html'

                      }
                  }
              })
              .state('index.resetpw', {
                  url: '/resetpw',
                  views: {
                      'main@index': {
                          templateUrl: 'tpls/reset_password.html'

                      }
                  }
              })
              .state('index.change', {
                  url: '/change',
                  views: {
                      'main@index': {
                          templateUrl: 'tpls/change.html'

                      }
                  }
              })

      }]);
