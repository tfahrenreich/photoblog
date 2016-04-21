/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers

        .controller("IndexCtrl", function($scope, $log, photoService){
            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(err) {
                    $log.error(err);
                });

        })

        .controller("AdminLoginCtrl", function($scope, $location, $cookies, authService, $log){
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function(credentials) {
                authService.login(credentials).then(
                    function(res, err) {
                        $cookies.loggedInUser = res.data;
                        $location.path('/admin/pages');
                    },
                    function(err) {
                        $log.log(err);
                    });
            };
        })

        .controller("AdminPhotosCtrl", function($scope, $log, photoService){
            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(err) {
                    $log.error(err);
                });

            $scope.deletePhoto = function(id) {
                photoService.deletePhoto(id);
            };

        });
});