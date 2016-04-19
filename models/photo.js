/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    title: String,
    filename: String,
    date: Date
});

var Page = mongoose.model('Photo', PhotoSchema);

module.exports = Page;