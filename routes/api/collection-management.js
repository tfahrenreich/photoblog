/**
 * Created by Tim on 4/23/2016.
 *
 * @route /api/collections
 */

/* MODULES */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

/* MODELS */
var Collection = require('../../models/collection.js');

/* PHOTO MANAGEMENT*/
router.get('/', function(request, response) {

    return Collection.find(function(err, collections) {
        if (!err) {
            return response.status(201).send(collections);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/add', sessionCheck, function(request, response){
    var collection = new Collection({
        name: request.body.name,
        label: request.body.name.toLowerCase(),
        date: new Date(Date.now())
    });

    collection.save(function(err) {
        if (!err) {
            return response.status(200).send(collection);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/update/:id', sessionCheck, function(request, response) {
    var id = request.body._id;

    Collection.update({
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
    response.send("collection updated");
});

router.get('/delete/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Collection.remove({
        _id: id
    }, function(err) {
        if(err) return err;
        return response.send('collection id- ' + id + ' has been deleted');
    });
});

function sessionCheck(request,response,next){
    if(request.session.user) next();
    else response.status(401).send('authorization failed');
}

module.exports = router;