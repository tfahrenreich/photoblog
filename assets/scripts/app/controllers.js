/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers
        .controller("MyCtrl1", function($scope, $log, photoService){

            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(err) {
                    $log.error(err);
                });

        });
});