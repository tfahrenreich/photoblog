/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers

        .controller("AppContainerCtrl", function($scope, $log, appData){
            $scope.getData = function(){
                appData.getData().then(
                    function(response){
                        $scope.appData = response.data
                    },
                    function(error){
                        $log.error(error)
                    });
            };

            $scope.$on('refreshAppData', function (){
                $scope.getData();
            });

            $scope.getData();
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

        .controller("AdminLoginCtrl", function($scope, $location, $cookies, authService, $log, messageService){
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function(credentials) {
                authService.login(credentials).then(
                    function(response) {
                        $cookies.loggedInUser = response.data;
                        $location.path('/admin/pages');
                        messageService.setMessage({type:'success', message: response.data});

                    },
                    function(error) {
                        messageService.setMessage({type:'alert', message: error.data});
                        $log.log(error);
                    });
            };
        })

        .controller("AdminPhotosCtrl", function($scope, $log, photoService, appData, messageService){
            photoService.getPhotos().then(
                function(response) {
                    $scope.allPhotos = response.data;
                },
                function(error) {
                    $log.error(error);
                });

            $scope.siteDataForm = {};

            $scope.updateSiteInfo = function(){
                appData.setData($scope.siteDataForm).then(
                    function(response){
                        $scope.siteDataForm = {};
                        $scope.$emit('refreshAppData');
                        messageService.setMessage({type: 'success', message: 'Info Updated!'})
                    },
                    function(error){
                        $log.debug(error)
                    }
                );
            };

            $scope.deletePhoto = function(photo) {
                photoService.deletePhoto(photo._id).then(
                    function(response){
                        messageService.setMessage({type:'warning', message: photo.title+" deleted"});
                        $scope.allPhotos.splice($scope.allPhotos.indexOf(photo), 1)
                    },
                    function(error){
                        $log.error(error)
                    }
                );
            };
        });
});