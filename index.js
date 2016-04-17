/**
 * Created by Tim on 4/13/2016.
 */

global.__base = __dirname + '/';

var express = require('express');
var mongoose = require('mongoose');

var api = require('./routes/api');
var hey = require('./routes/hey');

var app = express();
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/pb');
app.use('/api', api);
app.use('/hey', hey);

//View Engine
app.set('views', __base + '/views');
app.set('view engine', 'jade');
app.use('/assets', express.static(__base + '/assets'));

app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("index");
});

app.listen(2368 , function(){
    console.log('5ok');
});