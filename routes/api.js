/**
 * Created by Tim on 4/16/2016.
 */

var express = require('express');
var mongoose = require('mongoose');

var multer  = require('multer')({dest: 'assets/images/uploads/'}),
    imageUpload = multer.single('photo');

var bcrypt = require('bcrypt-nodejs');
var router = express.Router();

var Page = require('../models/page.js');
var Photo = require('../models/photo.js');
var adminUser = require('../models/admin-users.js');

/* User Routes. */

router.get('/', function(req, res) {
    res.send('Welcome to the API zone');
});

router.get('/pages', function(request, response) {

    return Page.find(function(err, pages) {
        if (!err) {
            return response.send(pages);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.get('/pages/delete/:id', function(request, response) {
    var id = request.params.id;
    Page.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('Page id- ' + id + ' has been deleted');
});

router.get('/pages/admin-details/:id', function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});

router.post('/pages/add', function(request, response) {
    var page = new Page({
        title: request.body.title,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        date: new Date(Date.now())
    });

    page.save(function(err) {
        if (!err) {
            return response.status(200).send(page);

        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/photo/add', imageUpload, function(request, response){
    var photo = new Photo({
        filename: request.file.filename,
        date: new Date(Date.now())
    });

    photo.save(function(err) {
        if (!err) {
            return response.status(200).send(photo);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/pages/update', function(request, response) {
    var id = request.body._id;

    Page.update({
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
    response.send("Page updated");
});

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

function sessionCheck(request,response,next){

    if(request.session.user) next();
    else response.status(401).send('authorization failed');
}

module.exports = router;