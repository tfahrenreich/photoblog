/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    _id: String,
    name: {
        type: String,
        default: "PhotoBlog CMS"
    },
    date: Date,
    postsPerPage: {
        type: Number,
        default: 5
    }
},{
    collection: 'data'}
);

var Page = mongoose.model('Site', SiteSchema);

module.exports = Page;