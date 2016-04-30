/**
 * Created by Tim on 4/24/2016.
 */

define([
    'app/app',
    'jqueryUI'
], function(directives) {
    directives
        .directive('messageFlash', function(){
            return{
                controller: function($scope, messageService, $timeout){
                    $scope.$on('newMessage', function(){
                        $("#message-box").slideUp('fast', function(){
                            $scope.message = messageService.getMessage();
                            $("#message-box").slideDown();

                            return $timeout(function() {
                                $("#message-box").slideUp(function(){
                                    return $scope.message = '';
                                });
                            }, 4000);
                        });
                    })
                },
                templateUrl: '/assets/angular-views/directive-message-service.html'
            }
        })
        .directive('collectionAutoComplete', function($timeout) {
            return function($scope, element, attrs) {
                $(element).autocomplete({
                    source: $scope[attrs.uiItems],
                    messages: {
                        noResults: '',
                        results: function(){}
                    },
                    search: function(event, ui){
                        var usedCollections = $scope.photo.collections;
                        var filteredItems = $scope[attrs.uiItems].filter(
                            function(collection){
                              var found = usedCollections.find(function(used){
                                     return used._id === collection._id;
                                });
                                return found === undefined;
                            }
                        );
                        $(element).autocomplete('option','source',filteredItems);
                    },
                    select:function(event, ui){
                        var collectionID = ui.item._id;
                        $(element).val('');
                        $scope.addToCollection(collectionID);
                        return false;
                    }
                });
            };
        })
        .directive('imagePreview', function (){
            return {
                restrict: 'E',
                templateUrl: '/assets/angular-views/directive-image-preview.html',
                transclude: true,
                link: function($scope, element, attrs){
                    $(element).click(function(){
                        $(element).slideUp();
                    });
                    $(element).mouseover(function(event){
                        $(this).append("" +
                            "<div class='preview-box panel'>" +
                            "<img src='"+attrs.image+"'>" +
                            "</div>");
                        $(this).unbind(event);
                    })
                }
            }
        })
        .directive('collectionView', function(){
            return{
                restrict: 'E',
                templateUrl: '/assets/angular-views/directive-view-collection.html'
            }
        })
        .directive('pageView', function(){
            return{
                restrict: 'E',
                templateUrl: '/assets/angular-views/directive-view-page.html'
            }
        })
        .directive('collectionFilter', function(){
            return{
                restrict: 'E',
                templateUrl: '/assets/angular-views/directive-collection-filter.html'
            }
        });
});