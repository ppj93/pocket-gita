'use strict';

var express = require('express'),
    config = require('./config'),
    fs = require('fs'),
    app = express(),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    _ = require('underscore');
    

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

app.get('/trackListPartial', function (req, res) {
    res.render('trackListPartial');
});
/** TODO: move this to common folder */
var schemaRegistration = require('./dbSetupScripts/schemaRegistration');

schemaRegistration.registerModules();

var albumCtrl = require('./controllers/albumCtrl');

albumCtrl.registerRoutes(app);

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
                console.log(__dirname + '/public/views/' + dirName + path + '.handlebars');
            }
        });
    });
    // no view found; pass on to 404 handler

    if(!found) {
        next();
    }
});

app.listen(config.appConfig.port, function () {
    console.log("Dashboard listening on port: " +
        config.appConfig.port
    );
});
