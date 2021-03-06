'use strict';

var express = require('express'),
    config = require('./config'),
    fs = require('fs'),
    app = express(),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    albumCtrl = require('./controllers/albumCtrl'),
    trackCtrl = require('./controllers/trackCtrl');

app.set('port', config.appConfig.port);

app.use(express.static(__dirname + '/public'));

/* Foll is required to access POST data in a request */
app.use(bodyParser.json());

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/public/views')
app.get('/', function (req, res) {
    res.render('index');
});

albumCtrl.registerRoutes(app);
trackCtrl.registerRoutes(app);

var autoViews = {};
app.use(function(req,res,next){
    var path = req.path.toLowerCase();  
    // check cache; if it's there, render the view
    if(autoViews[path]) return res.render(autoViews[path]);
    // if it's not in the cache, see if there's
    // a .handlebars file that matches

    var found = false;    
    /**
     * Though javascript offers function for iterating lists, use underscore functions for consistency
     *  */
    _.each(config.appConfig.viewDirectories, function (dirName) {

        var files = fs.readdirSync(__dirname + '/public/views/' + dirName);

        // TODO: change below to for loop -- to break on found. 
        _.each(files, function (fileName) {
            if (fileName.toLowerCase() === path.replace(/^\//, '').toLowerCase() + '.handlebars') {
                
                autoViews[path] = dirName.replace(/^\//, '') + '/' + fileName;
                found = true;
                return res.render(autoViews[path]);
            } else {
                //TODO: remove else when dev fairly stable
                console.log(__dirname + '/public/views/' + dirName + path + '.handlebars');
            }
        });
    });
    // no view found; pass on to 404 handler

    if(!found) {
        next();
    }
});

exports.app = app;