/**
 * Created by Tim on 4/16/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: Array,
    date: Date
});

var Collection = mongoose.model('Collection', CollectionSchema);

module.exports = Collection;