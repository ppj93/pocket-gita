var express = require('express'),
    config = require('./dashboardConfig'),
    fs = require('fs'),
    handlebars = require('express-handlebars'),
    app = express();

app.set('port', config.appConfig.port);

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/public/views')
app.get('/', function (req, res) {
    res.render('index');
});

/* Support for autoViews */
var autoViews = {};

app.use(function(req,res,next){
    var path = req.path.toLowerCase();  
    // check cache; if it's there, render the view
    if(autoViews[path]) return res.render(autoViews[path]);
    // if it's not in the cache, see if there's
    // a .handlebars file that matches
    if(fs.existsSync(__dirname + '/public/views' + path + '.handlebars')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    // no view found; pass on to 404 handler
    next();
});

app.listen(config.appConfig.port, function () {
    console.log("Dashboard listening on port: " +
        config.appConfig.port
    );
});