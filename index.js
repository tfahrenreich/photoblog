/**
 * Created by Tim on 4/13/2016.
 */

global.__base = __dirname + '/';

/** MODULES */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var app = express();
var db = mongoose.connection;

/** APP CONFIG */
mongoose.connect('mongodb://localhost/pb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({ mongooseConnection: db })}
));
app.set('views', __base + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

/** ROUTES */
app.use('/api', require('./routes/api/index'));
app.use('/', require('./routes/index'));

app.listen(2368 , function(){
    console.log('listening on 2368');
});