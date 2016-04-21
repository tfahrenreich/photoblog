/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteSchema = new Schema({
    _id: String,
    name: String,
    date: Date
},{
    collection: 'data'}
);

var Page = mongoose.model('Site', SiteSchema);

module.exports = Page;