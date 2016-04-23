/**
 * Created by Tim on 4/23/2016.
 *
 * @route /api/site
 */

/* MODULES */
var express = require('express'),
    router = express.Router();

/* MODELS */
var Site = require('../../models/site.js');

/* SITE MANAGEMENT*/
router.post('/set', sessionCheck, function(request, response){
    var site = new Site({
        _id: "siteData",
        date: new Date(Date.now()),
        name: request.body.name
    });

    site.save(function(err){
        if (!err) return response.status(201).send(site);

        Site.update({
            _id: site._id
        }, {
            $set: {
                date: new Date(Date.now()),
                name: site.name
            }
        }).exec();
        response.status(200).send("site updated");
    })
});

router.get('/info', function(request, response){
    return Site.findOne({
        _id : "siteData"
    }, function(err, data){
        if (err || data == null) return response.status(404).send('SiteData not found! Set it up!');
        return response.status(200).send(data);
    });
});

function sessionCheck(request,response,next){
    if(request.session.user) next();
    else response.status(401).send('authorization failed');
}

module.exports = router;