/**
 * Created by Tim on 4/20/2016.
 *
 * Process image after upload
 */
var im = require('imagemagick'); // Requires ImageMagick CLI to be installed on server

module.exports = {
    processImage : parse
};

function parse(photos){
    for(var i = 0; i < photos.length; i++ ){
        processImage(photos[i].files.actual);
    }
}

function processImage(path){
    //todo make a job queue
    im.convert([path, '-auto-orient', path],
        function(err){
            if(err){console.log("orient:"+err)}
            // Thumbnail
            im.convert([path,'-resize','230x', '-gravity', 'Center',  '-crop', '140x140+0+0', path+'_thumb'],
                function(err){
                    if(err){console.log("thmb:"+err)}
                    // Create Small
                    im.convert([path, '-resize','256x', path+'_small'],
                        function(err){
                            if(err){console.log("sm:"+err)}
                            // Create Medium
                            im.convert([path, '-resize','512x', path+'_med'],
                                function(err){
                                    if(err){console.log("med:"+err)}
                                    // Create large
                                    im.convert([path, '-resize','1024x', path+'_large'],
                                        function(err){
                                            if(err){console.log("lrg:"+err)}
                                            // Create huge
                                            im.convert([path, '-resize','2048x', path+'_huge'],
                                                function(err){
                                                    if(err){console.log("lrg:"+err)}
                                                });
                                        });
                                });
                        });
                });
        });
}