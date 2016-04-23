/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers

        .controller("AppContainerCtrl", function($scope, $log, appData){
            appData.getData().then(
                function(response){
                    $scope.appData = response.data
                },
                function(error){
                    $log.error(error)
                })
        })

        .controller("IndexCtrl", function($scope, $log, photoService){
            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(error) {
                    $log.error(error);
                });
        })

        .controller("AdminLoginCtrl", function($scope, $location, $cookies, authService, $log){
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function(credentials) {
                authService.login(credentials).then(
                    function(response) {
                        $cookies.loggedInUser = response.data;
                        $location.path('/admin/pages');
                    },
                    function(error) {
                        $log.log(error);
                    });
            };
        })

        .controller("AdminPhotosCtrl", function($scope, $log, photoService){
            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(error) {
                    $log.error(error);
                });

            $scope.deletePhoto = function(id) {
                photoService.deletePhoto(id);
            };
        });
});