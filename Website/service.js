'use strict';

var express = require('express'),
    app = express(),
    handlebars = require('express-handlebars');
    

/** app.use(express.static(__dirname + '/public'));

/* Foll is required to access POST data in a request 
app.use(bodyParser.json());
*/
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/public/views')
app.get('/', function (req, res) {
    res.render('index');
});

exports.app = app;

