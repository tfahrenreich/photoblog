/**
 * Created by Tim on 4/19/2016.
 */

var express = require('express'),
    router = express.Router();

router.use('/assets', express.static(__base + '/assets'));

/** EXPOSED MODULES*/
router.use('/assets/scripts/libs/requirejs', express.static(__base + '/node_modules/requirejs'));
router.use('/assets/scripts/libs/angular', express.static(__base + '/node_modules/angular'));
router.use('/assets/scripts/libs/angular-resource', express.static(__base + '/node_modules/angular-resource'));
router.use('/assets/scripts/libs/angular-route', express.static(__base + '/node_modules/angular-route'));
router.use('/assets/scripts/libs/jquery', express.static(__base + '/node_modules/jquery/dist'));

/** SERVE UPLOADED IMAGES*/
router.get('assets/images/uploads/:file', function(request ,response){
    var file = request.params.file,
        path = __base+'/uploads/'+file;

    response.sendFile(path);
});

router.get("/", function(req, res){
    res.render("index");
});

module.exports = router;