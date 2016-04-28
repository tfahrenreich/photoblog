/**
 * Created by Tim on 4/26/2016.
 */
define([
    'app/app'
], function(filters) {
    filters
        .filter('collectionFilter', function() {
            return function(photos,findInID, notInID) {
                var filtered = [];
                if (findInID === "false" && !notInID || !angular.isObject(photos)) return photos;

                photos.forEach(function(photo){
                    var findIn = photo.collections.find(function(collections){
                        return(findInID === collections._id)
                    });

                    var notIn = photo.collections.find(function(collections){
                        return(notInID === collections._id)
                    });

                    if(findInID === 'notincollection' && photo.collections.length === 0){
                        filtered.push(photo);
                    }else{
                        if((findIn && !notIn) || (findInID === "false" && !notIn)) filtered.push(photo);
                    }
                });
                return filtered;
            }
        });
});