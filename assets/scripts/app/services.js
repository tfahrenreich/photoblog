/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(services) {
    services
        .factory('appData' , function ($http, $rootScope, $log, messageService){
            function getData(){
                return $http.get('/api/site/info');
            }

            function setData(formData){
                return $http.post('/api/site/set', formData).then(
                    function(response){
                        $rootScope.$broadcast('refreshAppData');
                        messageService.setMessage({type: 'success', message: 'Info Updated!'})
                    },
                    function(error){
                        $log.debug(error)
                    })
            }

            return {
                getData : getData,
                setData : setData
            };
        })

        .factory('authService' , function ($http, $cookies, $location, $rootScope, messageService, $log){
            var service = {
                user : false,
                login : login,
                logout : logout,
                check : check
            };

            function login(credentials) {
                return $http.post('/api/user/login', credentials).then(
                    function(response) {
                        $cookies.loggedInUser = response.data;
                        $location.path('/');
                        service.user = response.data;
                        $rootScope.$broadcast('login');
                        messageService.setMessage({type:'success', message: 'Sign in as '+response.data});
                    },
                    function(error) {
                        messageService.setMessage({type:'alert', message: error.data});
                        $log.log(error);
                    })
            }

            function logout(){
                return $http.get('/api/user/logout');
            }

            function check(){
                return $http.get('/api/user/check').then(
                    function(response){
                        if(!service.user){
                            service.user = response.data;
                            messageService.setMessage({type:'success', message: 'Sign in as '+response.data});
                        }
                        $rootScope.$broadcast('login');
                    }
                );
            }

            return service;
        })

        .factory('photoService', function ($http, $q, $rootScope, messageService, $location){
            var service = {
                    photos: [],
                    loadRange:loadRange,
                    addPhotoToCollection: addPhotoToCollection,
                    loadPhotos : loadPhotos,
                    deletePhoto : deletePhoto,
                    removeCollection: removeCollection,
                    uploadPhotos: uploadPhotos
                };

            function loadRange(from, collection_id, override){

                var deferred = $q.defer();
                var postPerPage = override || $rootScope.appData.pages || 10;

                return $http.get('/api/photos/page', {
                    params: {
                        from: from,
                        to: (from + postPerPage) ,
                        collection: collection_id
                    }
                }).then(
                function(response){
                    var newStart = (from + postPerPage);

                    deferred.resolve({
                        photos: response.data,
                        startFrom: newStart
                    });
                    return deferred.promise;
                },
                function(error){
                    messageService.setMessage({type:"alert", message: error});
                    return deferred.promise;
                });
            }

            function loadPhotos(photoID){
                var deferred = $q.defer();

                //accepts array of IDs
                photoID = photoID || null;

                return $http.get('/api/photos', {
                    params:{
                        'photo[]' : photoID
                    }
                }).then(
                function(response){
                    service.photos = response.data;
                    deferred.resolve(response.data);
                    return deferred.promise;
                },
                function(error){
                    messageService.setMessage({type:"alert", message: "No Photos by that ID(s)"});
                    return deferred.promise;
                });
            }

            function deletePhoto(photoID){
                var deferred = $q.defer();

                return $http.get('/api/photos/delete/' + photoID).then(
                    function(response){
                        service.photos = response.data;
                        deferred.resolve(response.data);
                        return deferred.promise;
                    },
                    function(error) {
                        messageService.setMessage({type:"alert", message: error.data});
                        return deferred.promise;
                    }
                )
            }

            function addPhotoToCollection(IDs){
                var deferred = $q.defer();

                return $http.post('/api/photos/add-collection', IDs).then(
                    function(response){
                        deferred.resolve(response.data);
                        return deferred.promise;
                    },
                    function(error) {
                        messageService.setMessage({type:"alert", message: error.data});
                        return deferred.promise;
                    }
                )
            }

            function removeCollection(IDs){
                var deferred = $q.defer();

                return $http.post('/api/photos/remove-collection', IDs).then(
                    function(response){
                        deferred.resolve(response.data);
                        return deferred.promise;
                    },
                    function(error) {
                        messageService.setMessage({type:"alert", message: error.data});
                        return deferred.promise;
                    }
                )
            }

            function uploadPhotos(uploadForm){
                var photos = uploadForm.files,
                    i = 0;

                function photoLoop(photos){
                    uploadPhoto(photos[i], function(){
                        i++;
                        if(i < photos.length){
                            photoLoop(photos)
                        }else{
                            $rootScope.$broadcast('doneUploading');
                            $location.path('/catalog');
                        }
                    })
                }

                photoLoop(photos);

                function uploadPhoto(photo, callback){
                    $rootScope.$broadcast('uploading', { progress: Math.floor(((i)/photos.length)*100)});
                    var fd = new FormData();

                    fd.append('titles[]', photo.title);
                    fd.append('photos', photo);
                    if(uploadForm.collection !== "false")fd.append('collection', uploadForm.collection);

                    $http({
                        method: 'POST',
                        url: '/api/photos/add',
                        headers: {'Content-Type': undefined},
                        arrayKey: '', // default is '[i]'
                        data: fd
                    }).then(function(response){
                        callback()
                    })
                }
            }

            return service;
        })
        
        .factory('collectionService', function ($http, $q, messageService){
            var service = {
                collections : [],
                populatedCollection: {},
                loadPopulatedCollection: loadPopulatedCollection,
                loadCollections : loadCollections,
                addCollection : addCollection,
                deleteCollection : deleteCollection
            };

            function loadCollections(){
                var deferred = $q.defer();

                return $http.get('/api/collections').then(
                    function (response) {
                    service.collections = response.data;
                    deferred.resolve(response.data);
                    return deferred.promise;
                });
            }

            function loadPopulatedCollection(id){
                var deferred = $q.defer();

                return $http.get('/api/collections/get/'+id).then(
                    function(response){
                        service.populatedCollection = response.data[0];
                        deferred.resolve(response.data);
                        return deferred.promise;
                    },function(error){
                        messageService.setMessage({type:"alert", message: "No Collection by that ID"});
                        deferred.resolve(error.data);
                        return deferred.promise;
                    }
                )
            }

            function addCollection(name){
                return $http.post('/api/collections/add', name);
            }

            function deleteCollection(id){
                return $http.get('/api/collections/delete/' + id)
            }

            return service
        })

        .factory('messageService', function($rootScope){
            var message = {};
            return {
                getMessage: function () {
                    return message;
                },
                setMessage: function (newMessage) {
                    message.type = newMessage.type;
                    message.message = newMessage.message;
                    $rootScope.$broadcast('newMessage')
                }
            }
        })

        .factory('myHttpInterceptor', ['$q', '$location', function($q, $location) {
            return {
                response: function(response) {
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    return $q.reject(response);
                }
            };
        }]);
});

