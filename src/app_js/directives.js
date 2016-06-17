angular
    .module('app.directive',[])
    .directive('sidebar',sidebar);
    function sidebar () {
        return {
            restrict: 'AE',
            scope: {},
            link: function(scope, element, attrs) {

                element.on('click',function(event){
                    if ($('#sidebar > ul').is(":visible") === true) {
                        $('#main-content').css({
                            'margin-left': '0px'
                        });
                        $('#sidebar').css({
                            'margin-left': '-210px'
                        });
                        $('#sidebar > ul').hide();

                    } else {
                        $('#main-content').css({
                            'margin-left': '210px'
                        });
                        $('#sidebar > ul').show();
                        $('#sidebar').css({
                            'margin-left': '0'
                        });

                    }
                })
            }
        }
    }


