/**
 * Created by Tim on 4/13/2016.
 */

global.__base = __dirname + '/';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var api = require('./routes/api');
var hey = require('./routes/hey');

var app = express();

mongoose.connect('mongodb://localhost/pb');
var db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({ mongooseConnection: db })}
));

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