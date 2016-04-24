/**
 * Created by Tim on 4/23/2016.
 *
 * @route /api/user
 */

/* MODULES */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

/* MODELS */
var adminUser = require('../../models/admin-users.js');

/* AUTHENTICATION*/
router.post('/add-user', function(req, res) {
    var salt, hash, password;

    password = req.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
        username: req.body.username,
        password: hash
    });
    AdminUser.save(function(error) {
        if (!error) {
            return res.status(201).send('Admin User successfully created');

        } else {
            return res.send(error);
        }
    });
});

router.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    adminUser.findOne({
        username: username
    }, function(err, data) {
        if (err || data === null) {
            return response.status(401).send("User Doesn't exist");
        } else {
            var usr = data;

            if (username == usr.username && bcrypt.compareSync(password, usr.password)) {
                request.session.regenerate(function() {
                    request.session.user = username;
                    return response.send('Logged in as '+username);
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

module.exports = router;