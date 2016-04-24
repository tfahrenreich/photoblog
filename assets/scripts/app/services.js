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

            function setData(formData){
                return $http.post('/api/site/set', formData);
            }

            return {
                getData : getData,
                setData : setData
            };
        })

        .factory('authService' , function ($http, $q){
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

