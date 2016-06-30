angular
    .module('turfApp', ['ui.router','ngAnimate', 'ui.bootstrap','bsTable','app.ctrl','app.directive','app.services'])
    .value('API', 'http://192.168.199.150:8089')
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
                      }
                  }
              })
              .state('orderhandler', {
                  url: '/orderhandler',
                  views: {
                      '': {
                          templateUrl: 'tpls/oh/home.html'
                      },
                      'topbar@orderhandler': {
                          templateUrl: 'tpls/oh/topbar.html'
                      },
                      'sidebar@orderhandler': {
                          templateUrl: 'tpls/oh/sidebar_oh.html'
                      },
                      'main@orderhandler': {
                          templateUrl: 'tpls/oh/main.html'
                      }
                  }
              })
              .state('orderhandler.newOrder', {
                  url: '/newOrder',
                  views: {
                      'main@orderhandler': {
                          templateUrl: 'tpls/oh/newOrder.html'
                      }
                  }
              })
              .state('orderhandler.draftOrders', {
                  url: '/draftOrders',
                  views: {
                      'main@orderhandler': {
                          templateUrl: 'tpls/oh/draftOrders.html'
                      }
                  }
              })
              .state('orderhandler.register', {
                  url: '/register',
                  views: {
                      'main@orderhandler': {
                          templateUrl: 'tpls/register.html'
                      }
                  }
              })

              .state('orderhandler.workerlist', {
                  url: '/workerlist',
                  views: {
                      'main@orderhandler': {
                          templateUrl: 'tpls/oh/workerlist.html',
                          controller: 'workerList'
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

              .state('orderhandler.order_detail', {
                  url: '/order_detail/:order_id',
                  views: {
                      'main@orderhandler': {
                          templateUrl: 'tpls/oh/orderDetail.html'

                      }
                  }
                  /*params: {
                      order_id: '',
                      customer_name: '',
                      customer_contact: '',
                      customer_email: '',
                      turf_variety: '',
                      turf_quantity: '',
                      total_price: '',
                      cutter: '',
                      driver: '',
                      layer: '',
                      address_detail: '',
                      delivery_date_time: '',
                      submitted_date_time: '',
                      order_status: ''
                  }*/
              })
      }])
