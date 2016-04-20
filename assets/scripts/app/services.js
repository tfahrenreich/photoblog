/**
 * Created by Tim on 4/19/2016.
 */

define([
    'app/app'
], function(services) {
    services
        .factory('photoService', function ($http){
            var service = {
              getPhotos : getPhotos
            };

            function getPhotos(){
                return $http.get('/api/photos');
            }

            return service;

        })
});

