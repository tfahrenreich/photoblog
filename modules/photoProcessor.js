/**
 * Created by Tim on 4/20/2016.
 *
 * Process image after upload
 */
var im = require('imagemagick'); // Requires ImageMagick CLI to be installed on server

module.exports = {
    processImage : processImage
};

function processImage(path){
    // Orient Original
    im.convert([path, '-auto-orient', path],
        function(err){
            if(err){console.log(err)}
        });

    // Create Small
    im.convert([path, '-auto-orient','-resize','256x', path+'_small'],
        function(err){
            if(err){console.log(err)}
        });

    // Create Medium
    im.convert([path, '-auto-orient','-resize','512x', path+'_med'],
        function(err){
            if(err){console.log(err)}
        });
}