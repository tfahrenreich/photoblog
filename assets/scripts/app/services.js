/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(services) {
    services
        .factory('authService' , function ($http, $q){
            function login(credentials) {
                return $http.post('/api/login', credentials);
            }

            function logout(){
                return $http.get('/api/logout');
            }

            return {
                login : login,
                logout : logout
            };
        })

        .factory('photoService', function ($http, $q){
            function getPhotos(){
                return $http.get('/api/photos');
            }

            function deletePhoto(id){
                return $http.get('/api/photo/delete/' + id)
            }

            return {
                getPhotos : getPhotos,
                deletePhoto : deletePhoto
            };
        })
});

