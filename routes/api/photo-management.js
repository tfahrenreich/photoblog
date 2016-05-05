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
    imageUpload = multer.array('photos'),
    photoLab = require('../../modules/photoProcessor.js');

/* MODELS */
var Photo = require('../../models/photo.js');
var Collection = require('../../models/collection.js');

/* PHOTO MANAGEMENT*/
router.get('/', function(request, response){
    //returns all photos if no queries
    if(!request.query.photo){
        return Photo.find().populate('collections').exec(
            function(error, photos){
                if (error) return response.status(500).send(error);
                return response.status(200).send(photos);
            }
        );
    }else{
        return Photo.find({
            '_id': { $in: request.query.photo}
        }).populate('collections').exec(
            function(error, photos){
                if (error) return response.status(500).send(error);
                return response.status(200).send(photos);
            }
        );
    }
});

router.get('/page', function(request, response){
    var from = parseInt(request.query.from),
        to = parseInt(request.query.to),
        collection = request.query.collection;

    if(!isNaN(request.query.from) && !isNaN(request.query.to)){
        var Find = (collection == undefined) ? Photo.find() : Photo.find({ 'collections' : { $in : [collection] }});

        return Find.sort('-date').limit(to-from).skip(from).populate('collections').exec(
            function(error, photos){
                if (error) return response.status(500).send(error);
                return response.status(200).send(photos);
            }
        );
    }else{
        return response.status(500).send("bad request fam");
    }
});

/** PROTECTED ROUTES */

router.post('/add', sessionCheck, imageUpload, function(request, response){
    // creates all database entries for photos at once. Starts processing for photos, one at a time.
    // sends response after processing is done. queuing will happen on client side, but nice to have a fail-safe.

    var photos = [], i;
    for(i=0; i < request.files.length; i++){
        var file = request.files[i];
        var title = (request.body.titles[i] !== 'undefined') ? request.body.titles[i] : "Untitled";
        var photo = new Photo({
            title: title,
            date: new Date(Date.now()),
            collections: [],
            files: {
                actual: file.path,
                original: "/assets/images/uploaded/"+file.filename,
                thumb: "/assets/images/uploaded/"+file.filename+"_thumb",
                medium: "/assets/images/uploaded/"+file.filename+"_med",
                small: "/assets/images/uploaded/"+file.filename+"_small",
                large: "/assets/images/uploaded/"+file.filename+"_large",
                huge: "/assets/images/uploaded/"+file.filename+"_huge"
            }
        });

        if(request.body.collection)photo.collections.push(request.body.collection);

        photos.push(photo);

        photo.save(function(err) {
            if(err) photos.pop().push(err);
        });
    }

    photoLab.processImage(photos, function(){
        return response.status(200).send(photos);
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

router.post('/add-collection', sessionCheck, function(request, response){
    var collection_id = request.body.collection,
        photo_id = request.body.photo,
        res = {};

    Photo.findByIdAndUpdate(
        photo_id,
        {
            $addToSet: {collections: collection_id}
        }, function(error, photo){
            if(error){
                res.error = error;
                return response.status(500).send(error);
            }
            res.photo = photo;

            Collection.findByIdAndUpdate(
                collection_id,
                {
                    $addToSet: {photos: photo_id}
                }, function(error, collection){
                    if(error){
                        res.error = error;
                        return response.status(500).send(error);
                    }
                    res.collection = collection;
                    return response.status(200).send(res)
                }
            );
        }
    );
});

router.post('/remove-collection', function(request, response){
    var collection_id = request.body.collection,
        photo_id = request.body.photo,
        res = {};

    Photo.findByIdAndUpdate(
        photo_id,
        {
            $pull: {collections: collection_id}
        }, function(error, photo){
            if(error){
                res.error = error;
                return response.status(500).send(error);
            }
            res.photo = photo;

            Collection.findByIdAndUpdate(
                collection_id,
                {
                    $pull: {photos: photo_id}
                }, function(error, collection){
                    if(error){
                        res.error = error;
                        return response.status(500).send(error);
                    }
                    res.collection = collection;
                    return response.status(200).send(res)
                }
            );
        }
    );
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