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

            return {
                login : login,
                logout : logout
            };
        })

        .factory('photoService', function ($http, $q, messageService){

            var service = {
                photos: [],
                addPhotoToCollection: addPhotoToCollection,
                loadPhotos : loadPhotos,
                deletePhoto : deletePhoto
            };

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
                    deferred.resolve(error.data);
                    return deferred.promise;
                });
            }

            function deletePhoto(photoID){
                return $http.get('/api/photos/delete/' + photoID)
            }

            function addPhotoToCollection(IDs){
                return $http.post('/api/photos/add-collection', IDs)
            }

            return service;
        })
        
        .factory('collectionService', function ($http, $q){
            var service = {
                collections : [],
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
});

