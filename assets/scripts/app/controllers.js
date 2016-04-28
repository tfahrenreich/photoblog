/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers
        .controller("AppContainerCtrl", function($scope, $rootScope, $log, appData, messageService){
            $scope.getData = function(){
                appData.getData().then(
                    function(response){
                        $rootScope.appData = response.data
                    },
                    function(error){
                        messageService.setMessage({type:'alert', message: error.data});
                        $log.error(error)
                    });
            };

            $scope.$on('refreshAppData', function (){
                $scope.getData();
            });

            $scope.getData();
        })

        .controller("IndexCtrl", function($scope, $rootScope, $log, photoService, collectionService){
            $scope.allCollections = collectionService.collections;
            $scope.collection = collectionService.populatedCollection;

            photoService.set(0, $scope.collection._id);
            $scope.loadPage = function(){
                photoService.loadRange().then(function(){
                    $scope.photos = photoService.photos;
                });
            };
            $scope.loadPage()
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
                        $location.path('/admin');
                        messageService.setMessage({type:'success', message: response.data});

                    },
                    function(error) {
                        messageService.setMessage({type:'alert', message: error.data});
                        $log.log(error);
                    });
            };
        })

        .controller("AdminCtrl", function($scope, $log, appData, messageService, photoService, collectionService){
            $scope.allCollections = collectionService.collections;
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

            photoService.set(0, null, 10);
            $scope.loadPage = function(){
                photoService.loadRange().then(function(){
                    $scope.photos = photoService.photos;
                });
            };
            $scope.loadPage();

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
        })

        .controller("AdminCollectionCtrl", function($scope, $log, collectionService, photoService, messageService){
            $scope.allPhotos = photoService.photos;
            $scope.allCollections = collectionService.collections;
            $scope.collection = collectionService.populatedCollection;
            $scope.newCollection = {};

            $scope.addCollection = function(){
                collectionService.addCollection($scope.newCollection).then(
                    function(response){
                        messageService.setMessage({type:"success", message: $scope.newCollection.name+" Created"});
                        $scope.allCollections.push(response.data);
                        $scope.newCollection = {};
                    },
                    function(error){

                    }
                )
            };

            photoService.set(0, $scope.collection._id);
            $scope.loadPage = function(){
                photoService.loadRange().then(function(){
                    $scope.photos = photoService.photos;
                });
            };

            if($scope.collection._id)$scope.loadPage();
        })

        .controller("AdminPhotoCtrl", function($scope, $log, photoService, messageService, $routeParams, collectionService){
            $scope.photo = photoService.photos[0];
            $scope.collections = collectionService.collections;

            $scope.addToCollection = function(collectionID){
                photoService.addPhotoToCollection({
                    photo: $scope.photo._id,
                    collection: collectionID
                }).then(
                    function(response){
                        $scope.photo.collections.push(response.collection)
                    },
                    function(error){

                    }
                )
            }
        })
});