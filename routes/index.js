/**
 * Created by Tim on 4/19/2016.
 */

var express = require('express'),
    router = express.Router();


router.use('/asset', express.static(__base + '/assets'));
router.use('/assets/libs/requirejs', express.static(__base + '/node_modules/requirejs'));
router.use('/assets/libs/angular', express.static(__base + '/node_modules/angular'));
router.use('/assets/libs/angular-resource', express.static(__base + '/node_modules/angular-resource'));

router.get('/uploads/:file', function(request ,response){
    var file = request.params.file,
        path = __base+'/uploads/'+file;

    response.sendFile(path);
});

router.get("/", function(req, res){
    res.render("index");
});

module.exports = router;