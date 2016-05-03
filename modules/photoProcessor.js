/**
 * Created by Tim on 4/20/2016.
 *
 * Process image after upload
 */

// Requires ImageMagick CLI to be installed on server
var im = require('imagemagick');

module.exports = {
    processImage : processImages
};

function processImages(photos, callback, i){
    i = i || 0;
    orientPhoto(photos[i].files.actual, function(){
        console.log(i);
        i++;
        if(i < photos.length){
            processImages(photos, callback, i)
        }else{
            callback();
        }
    })
}

function orientPhoto(path, callback){
    im.convert([path, '-auto-orient', path],
        function(error){
            if(error)console.log("orient:"+err);
            thumbnail(path, callback)
        }
    )
}

function thumbnail(path, callback){
    im.convert([path,'-resize','230x', '-gravity', 'Center',  '-crop', '140x140+0+0', path+'_thumb'],
        function(error){
            if(error)console.log("thumbnail:"+error);
            small(path, callback)
        })
}

function small(path, callback){
    im.convert([path, '-resize','256x', path+'_small'],
        function(error){
            if(error)console.log("small:"+error);
            medium(path, callback);
        })
}

function medium(path, callback){
    im.convert([path, '-resize','512x', path+'_med'],
        function(error){
            if(error)console.log("small:"+error);
            large(path, callback);
        })
}

function large(path, callback){
    im.convert([path, '-resize','1024x', path+'_large'],
        function(error){
            if(error)console.log("large:"+error);
            huge(path, callback);
        })
}

function huge(path, callback){
    im.convert([path, '-resize','2048x', path+'_huge'],
        function(error){
            if(error)console.log("huge:"+error);
            callback();
        })
}