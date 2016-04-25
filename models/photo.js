/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    title: {
        type: String,
        default: 'untitled'
    },
    filename: String,
    date: Date,
    files: {
        actual: String,
        original: String,
        thumb: String,
        medium: String,
        small: String,
        large: String,
        huge: String
    }
});

var Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;