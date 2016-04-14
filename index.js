/**
 * Created by Tim on 4/13/2016.
 */

global.__base = __dirname + '/';

var express = require('express');

var app = express();
var port = 2368;

//View Engine
app.set('views', __base + '/tpl');
app.set('view engine', 'jade');
app.use('/assets', express.static(__base + '/public'));


//app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.send('hello world');
});

app.use(express.static(__base + '/public'));

app.listen(port, function(){
    console.log('ok');
});