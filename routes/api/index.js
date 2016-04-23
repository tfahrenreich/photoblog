/**
 * Created by Tim on 4/16/2016.
 *
 * @route /api/
 */

var express = require('express'),
    router = express.Router();

/** ROUTES */
router.get('/', function(req, res) {
    res.status(200).send('PhotoBlog API!');
});

router.use('/user', require('./user-authentication'));
router.use('/photos', require('./photo-management'));
router.use('/site', require('./site-management'));

module.exports = router;