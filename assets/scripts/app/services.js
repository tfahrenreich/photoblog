/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(services) {
    services
        .factory('appData' , function ($http){
            function getData(){
                return $http.get('/api/site/info');
            }

            function setData(formData){
                return $http.post('/api/site/set', formData);
            }

            return {
                getData : getData,
                setData : setData
            };
        })

        .factory('authService' , function ($http){
            function login(credentials) {
                return $http.post('/api/user/login', credentials);
            }

            function logout(){
                return $http.get('/api/user/logout');
            }
            function check(){
                return $http.get('/api/user/check');
            }

            return {
                login : login,
                logout : logout,
                check : check
            };
        })

        .factory('photoService', function ($http, $q, $rootScope, messageService){
            var parameters, 
                service = {
                    photos: [],
                    set: set,
                    loadRange:loadRange,
                    addPhotoToCollection: addPhotoToCollection,
                    loadPhotos : loadPhotos,
                    deletePhoto : deletePhoto
                };

            function set(from, collection_id, override){
                service.photos = [];
                parameters = [from, collection_id, override];
            }

            function loadRange(range){
                var deferred = $q.defer();
                var postPerPage = parameters[2] || $rootScope.appData.pages;

                return $http.get('/api/photos/page', {
                    params: {
                        from: parameters[0],
                        to: (parameters[0] + postPerPage) ,
                        collection: parameters[1]
                    }
                }).then(
                function(response){
                    service.photos = service.photos.concat(response.data);
                    parameters[0] += postPerPage;
                    deferred.resolve(response.data);
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

