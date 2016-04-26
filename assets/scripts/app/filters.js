/**
 * Created by Tim on 4/26/2016.
 */
define([
    'app/app'
], function(filters) {
    filters
        .filter('collectionFiler', function() {
            'use strict';
            return function(photos, collectionID) {
                if (collectionID === (undefined||'none')) return photos;

                var filtered = [];
                photos.forEach(function(photo){
                    if(collectionID === 'notincollection' && photo.collections.length === 0){
                        filtered.push(photo);
                    }else{
                        var found = photo.collections.find(function(collections){
                            return(collectionID === collections._id)
                        });

                        if(found)filtered.push(photo);
                    }
                });
                return filtered;
            }
        });

});