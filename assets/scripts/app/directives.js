/**
 * Created by Tim on 4/24/2016.
 */

define([
    'app/app'
], function(directives) {
    directives
        .directive('messageFlash', function(){
            return{
                controller: function($scope, messageService, $timeout){
                    $scope.$on('newMessage', function(){
                        $scope.message = messageService.getMessage();
                        $("#message-box").slideDown();

                        return $timeout(function() {
                            $("#message-box").slideUp(function(){
                                return $scope.message = '';
                            });
                        }, 4000);
                    })
                },
                templateUrl: '/assets/angular-views/directive-message-service.html'
            }
        })
});