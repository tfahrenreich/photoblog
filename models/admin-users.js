/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminUser = new Schema({
    username: String,
    password: String
});

var adminUser = mongoose.model('adminUser', adminUser);

module.exports = adminUser;