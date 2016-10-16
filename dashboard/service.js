'use strict';

var express = require('express'),
    config = require('./config'),
    fs = require('fs'),
    app = express(),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    albumCtrl = require('./controllers/albumCtrl'),
    trackCtrl = require('./controllers/trackCtrl'),
    passport = require('passport'),
    GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;

var GOOGLE_CLIENT_ID      = "41242017152-a5jlf53g0iasia2sq37mmk52ja944r43.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "-4OoXlnDG1V4dx1GNltb2qUP";

app.set('port', config.appConfig.port);

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(expressSession({ name: config.appConfig.cookieName, cookie: { secure: false }, secret: config.appConfig.cookieSecret}));


/* Foll is required to access POST data in a request */
app.use(bodyParser.json());

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/public/views')
app.get('/', function (req, res) {
    res.render('login');
});

app.get('/index', function (req, res) {
    res.render('index');
});


app.use(passport.initialize());
app.use(passport.session());


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

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: "/authorizeCallback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        
        if (config.appConfig.adminAccessEmailList.indexOf(profile.email) < 0) {
            request.res.send(401, "You are not authorized to perform this operation! Contact dev team.");    
        }
        else {
            
            console.log(profile);
            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);      
        }
    });
  }
));

passport.serializeUser(function (user, done) {
    console.log("user is");
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) { 
    done(null, obj);
});

app.get('/authorizeCallback', 
    	passport.authenticate( 'google', { 
    		successRedirect: '/index',
    		failureRedirect: '/'
    }));

app.get('/authorize', passport.authenticate('google', { scope: [
       'email', 'profile'] 
}));

exports.app = app;