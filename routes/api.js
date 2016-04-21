/**
 * Created by Tim on 4/16/2016.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var multer  = require('multer')({dest: 'assets/uploads/'}),
    imageUpload = multer.single('photo');
var photoLab = require('../modules/photoProcessor.js');

/** MODELS */
var Photo = require('../models/photo.js');
var Site = require('../models/site.js');
var adminUser = require('../models/admin-users.js');

/** ROUTES */
router.get('/', function(req, res) {
    res.send('Welcome to the API zone');
});

/* AUTHENTICATION*/
router.post('/add-user', function(request, response) {
    var salt, hash, password;
    password = request.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
        username: request.body.username,
        password: hash
    });
    AdminUser.save(function(err) {
        if (!err) {
            return response.send('Admin User successfully created');

        } else {
            return response.send(err);
        }
    });
});

router.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    adminUser.findOne({
        username: username
    }, function(err, data) {
        if (err | data === null) {
            return response.status(401).send("User Doesn't exist");
        } else {
            var usr = data;

            if (username == usr.username && bcrypt.compareSync(password, usr.password)) {

                request.session.regenerate(function() {
                    request.session.user = username;
                    return response.send(username);

                });
            } else {
                return response.status(401).send("Bad Username or Password");
            }
        }
    });
});

router.get('/logout', function(request, response) {
    request.session.destroy(function() {
        return response.status(401).send('User logged out');
    });
});

/* SITE MANAGEMENT*/
router.post('/site/set', sessionCheck, function(request, response){
    var site = new Site({
        _id: "siteData",
        date: new Date(Date.now()),
        name: request.body.name
    });

    site.save(function(err){
        if (!err) return response.status(201).send(site);

        Site.update({
            _id: site._id
        }, {
            $set: {
                date: new Date(Date.now()),
                name: site.name
            }
        }).exec();
        response.status(200).send("site updated");
    })
});

router.get('/site/info', function(request, response){
    return Site.findOne({
        _id : "siteData"
    }, function(err, data){
        if (err || data == null) return response.status(500).send('no info set');
        return response.status(200).send(data);
    });
});


/* PHOTO MANAGEMENT*/
router.post('/photo/add', sessionCheck, imageUpload, function(request, response){
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

router.get('/photos', function(request, response) {

    return Photo.find(function(err, photos) {
        if (!err) {
            return response.status(200).send(photos);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/photo/update', sessionCheck, function(request, response) {
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

router.get('/photo/delete/:id', sessionCheck, function(request, response) {
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