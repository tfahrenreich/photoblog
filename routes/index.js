/**
 * Created by Tim on 4/19/2016.
 */

var express = require('express'),
    router = express.Router(),
    fs = require('fs');

router.use('/assets', express.static(__base + '/assets'));

/** EXPOSED MODULES*/
router.use('/assets/scripts/libs/requirejs', express.static(__base + '/node_modules/requirejs'));
router.use('/assets/scripts/libs/angular', express.static(__base + '/node_modules/angular'));
router.use('/assets/scripts/libs/angular-cookies', express.static(__base + '/node_modules/angular-cookies'));
router.use('/assets/scripts/libs/angular-resource', express.static(__base + '/node_modules/angular-resource'));
router.use('/assets/scripts/libs/angular-route', express.static(__base + '/node_modules/angular-route'));
router.use('/assets/scripts/libs/jquery', express.static(__base + '/node_modules/jquery/dist'));
router.use('/assets/scripts/libs/jquery-ui', express.static(__base + '/node_modules/jquery-ui/'));

/** SERVE UPLOADED IMAGES*/
router.get('/assets/images/uploaded/:file', function(request ,response){
    var file = request.params.file,
        path = __base+'/assets/uploads/'+file,
        img = fs.readFileSync(path);

    response.writeHead(200, {'Content-Type': 'image/jpg' });
    response.end(img, 'binary');
});

router.get("*", function(req, res){
    res.render("index");
});

module.exports = router;