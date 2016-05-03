/**
 * Created by Tim on 5/2/2016.
 */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    adminUser = require('./../models/admin-users.js'),
    Site = require('./../models/site.js');

mongoose.connect('mongodb://localhost/pb');

var site = new Site({
    _id: "siteData",
    date: new Date(Date.now())
});
site.save(function(){
    console.log('SiteData Created\n');
    var salt, hash;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync('Password', salt);
    var AdminUser = new adminUser({
        username: 'Admin',
        password: hash
    });
    AdminUser.save(function(){
        mongoose.disconnect();
    });
    console.log('Created U:Admin P:Password \n');
    console.log('DELETE AFTER YOU CREATE YOUR OWN ACCOUNT\n');
});



