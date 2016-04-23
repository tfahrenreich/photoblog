/**
 * Created by Tim on 4/23/2016.
 *
 * @route /api/photos
 */

/* MODULES */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    multer  = require('multer')({dest: 'assets/uploads/'}),
    imageUpload = multer.single('photo'),
    photoLab = require('../../modules/photoProcessor.js');

/* MODELS */
var Photo = require('../../models/photo.js');

/* PHOTO MANAGEMENT*/
router.get('/', function(request, response) {

    return Photo.find(function(err, photos) {
        if (!err) {
            return response.status(201).send(photos);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/add', sessionCheck, imageUpload, function(request, response){
    var photo = new Photo({
        date: new Date(Date.now()),
        files: {
            actual: request.file.path,
            original: "/assets/images/uploaded/"+request.file.filename,
            medium: "/assets/images/uploaded/"+request.file.filename+"_med",
            small: "/assets/images/uploaded/"+request.file.filename+"_small",
            large: "/assets/images/uploaded/"+request.file.filename+"_large"
        }
    });

    photoLab.processImage(photo.files.actual);

    photo.save(function(err) {
        if (!err) {
            return response.status(200).send(photo);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/update/:id', sessionCheck, function(request, response) {
    var id = request.body._id;

    Photo.update({
        _id: id
    }, {
        $set: {
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        }
    }).exec();
    response.send("photo updated");
});

router.get('/delete/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Photo.remove({
        _id: id
    }, function(err) {
        if(err) return err;
        return response.send('photo id- ' + id + ' has been deleted');
    });
});

function sessionCheck(request,response,next){
    if(request.session.user) next();
    else response.status(401).send('authorization failed');
}

module.exports = router;