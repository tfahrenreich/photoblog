/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(services) {
    services
        .factory('appData' , function ($http, $q){
            function getData(){
                return $http.get('/api/site/info');
            }

            return {
                getData : getData
            };
        })

        .factory('photoService', function ($http, $q){
            function getPhotos(){
                return $http.get('/api/photos');
            }

            function deletePhoto(id){
                return $http.get('/api/photos/delete/' + id)
            }

            return {
                getPhotos : getPhotos,
                deletePhoto : deletePhoto
            };
        })

        .factory('photoService', function ($http, $q){
            function getPhotos(){
                return $http.get('/api/photos');
            }

            function deletePhoto(id){
                return $http.get('/api/photos/delete/' + id)
            }

            return {
                getPhotos : getPhotos,
                deletePhoto : deletePhoto
            };
        })
});

