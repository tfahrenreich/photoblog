/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(controllers){
    controllers
        .controller("AppContainerCtrl", function($scope, $rootScope, $log, appData, messageService,authService){
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

            $rootScope.admin = authService.user;


            $scope.$on('refreshAppData', function (){
                $scope.getData();
            });

            $scope.$on('login', function (){
               $rootScope.admin = authService.user
            });

            $scope.login = function(){
                authService.check();
            };

            $scope.getData();
        })

        .controller("IndexCtrl", function($scope, $rootScope, $log, photoService, collectionService){
            $scope.allCollections = collectionService.collections;
            $scope.collection = collectionService.populatedCollection;
            $scope.photos = [];

            // Infinite scroll
            $scope.lastPost = 0;
            $scope.loadPage = function(){
                photoService.loadRange($scope.lastPost,$scope.collection._id).then(
                    function(response){
                    $scope.lastPost = response.startFrom;
                    $scope.photos = $scope.photos.concat(response.photos)
                });
            };
            $scope.loadPage()
        })

        .controller("AdminLoginCtrl", function($scope, $location, $cookies, authService){
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.login = function(credentials) {
                authService.login(credentials);
            };
        })

        .controller("catalogCtrl", function($scope, $log, appData, messageService, photoService, collectionService){
            $scope.allCollections = collectionService.collections;
            $scope.photos = [];

            $scope.lastPost = 0;
            $scope.loadPage = function(){
                photoService.loadRange($scope.lastPost, null, 20).then(
                    function(response){
                        $scope.lastPost = response.startFrom;
                        $scope.photos = $scope.photos.concat(response.photos)
                    });
            };
            $scope.loadPage();

            $scope.deletePhoto = function(photo) {
                photoService.deletePhoto(photo._id).then(
                    function(response){
                        messageService.setMessage({type:'warning', message: photo.title+" deleted"});
                        $scope.photos.splice($scope.photos.indexOf(photo), 1);

                        photoService.loadRange(($scope.lastPost-1), null, 1).then(
                            function(response){
                                $scope.photos = $scope.photos.concat(response.photos)
                            });
                    },
                    function(error){
                        $log.error(error)
                    }
                );
            };
        })

        .controller("PhotoCtrl", function($scope, $log, photoService, messageService, $routeParams, collectionService){
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
            };

            $scope.removeCollection = function(collection, index){
                photoService.removeCollection({
                    photo: $scope.photo._id,
                    collection: collection._id
                }).then(
                    function(response){
                        $scope.photo.collections.splice(index,1)
                    },
                    function(error){

                    }
                )
            }
        })

        .controller('AdminSiteData', function($scope, $log, appData){
            $scope.siteDataForm = {};

            $scope.updateSiteInfo = function(){

                appData.setData($scope.siteDataForm);
                $scope.siteDataForm = {};
            };

        })

        .controller("AdminCollectionCtrl", function($scope,$location, $log, collectionService, photoService, messageService){
            $scope.allCollections = collectionService.collections;
            $scope.collection = collectionService.populatedCollection;
            $scope.admin = true;

            $scope.newCollection = {};
            $scope.allPhotos = [];
            $scope.photos = [];

            $scope.addCollection = function(){
                collectionService.addCollection($scope.newCollection).then(
                    function(response){
                        messageService.setMessage({type:"success", message: $scope.newCollection.name+" Created"});
                        $scope.allCollections.push(response.data);
                        $scope.newCollection = {};
                        $location.path('/admin/collections/'+response.data._id);
                    },
                    function(error){

                    }
                )
            };

            $scope.removeFromCollection = function(photo, index){
                var photoKey = $scope.allPhotos.indexOf($scope.allPhotos.filter(function(obj){
                    return obj._id === photo._id
                })[0]);

                photoService.removeCollection({
                    photo: photo._id,
                    collection: $scope.collection._id
                }).then(
                    function(response){
                        $scope.photos.splice(index,1);

                        if(photoKey > 0) $scope.allPhotos[photoKey].collections.splice($scope.allPhotos[photoKey].collections.indexOf($scope.collection._id), 1);
                    },
                    function(error){

                    }
                )
            };

            $scope.addToCollection = function(photo){
                photoService.addPhotoToCollection({
                    photo: photo._id,
                    collection: $scope.collection._id
                }).then(function(response){
                    //create pseudo collection obj
                    var collection = {_id: $scope.collection._id };
                    photo.collections.push(collection);
                    $scope.collection.photos.push(photo._id);
                    $scope.photos.unshift(photo)
                },function(error){

                });
            };

            $scope.lastPost = 0;
            $scope.loadPage = function(){
                photoService.loadRange($scope.lastPost,$scope.collection._id).then(
                    function(response){
                        $scope.lastPost = response.startFrom;
                        $scope.photos = $scope.photos.concat(response.photos)
                    });
            };
            if($scope.collection._id)$scope.loadPage();

            $scope.allPhotosLoaded = 0;
            $scope.loadAllPage = function(){
                photoService.loadRange($scope.allPhotosLoaded, null, 25).then(
                    function(response){
                        $scope.allPhotosLoaded = response.startFrom;
                        $scope.allPhotos = $scope.allPhotos.concat(response.photos)
                    });
            };
            if($scope.collection._id)$scope.loadAllPage();
        })

        .controller("AdminUploadCtrl", function($scope,$location, $log, collectionService, photoService){
            $scope.uploadForm = {};
            $scope.allCollections = collectionService.collections;

            $scope.upload = function(){
                photoService.uploadPhotos($scope.uploadForm)
            }
        });
});