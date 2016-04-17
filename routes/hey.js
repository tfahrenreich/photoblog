/**
 * Created by Tim on 4/16/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('HEY');
});

module.exports = router;