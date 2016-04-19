/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
    title: String,
    url: {
        type: String,
        index: {unique:true}
    },
    content: String,
    menuIndex: Number,
    date: Date
});

var Page = mongoose.model('Page', PageSchema);

module.exports = Page;