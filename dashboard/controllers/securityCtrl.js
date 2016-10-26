var operationResults = require('../../common/constants').operationResults,
    passport = require('passport'),
    googleStrategy = require('passport-google-oauth2').Strategy,
    config = require('../config'),
    async = require('async'),
    utilities = require('../../common/utilities'),
    secret = require('../secret');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) { 
    done(null, obj);
});

module.exports = {
    registerPassportModulesAndRoutes: function (app) {
        passport.use(new googleStrategy({
            clientID: config.appConfig.googleClientId,
            clientSecret: config.appConfig.googleClientSecret,
            //NOTE :
            //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
            //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
            //then edit your /etc/hosts local file to point on your private IP. 
            //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
            //if you use it.
            callbackURL: "/authorizeCallback",
            passReqToCallback: true
        },
            function (request, accessToken, refreshToken, profile, done) {
                // asynchronous verification, for effect...
                process.nextTick(function () {
        
                    if (config.appConfig.adminAccessEmailList.indexOf(profile.email) < 0) {
                        request.res.send(401, "You are not authorized to perform this operation! Contact dev team.");
                    }
                    else {
                        return done(null, profile);
                    }
                });
            }
        ));

        app.use(passport.initialize());
        app.use(passport.session());

        app.get('/authorizeCallback',
            passport.authenticate('google', {
                successRedirect: '/index',
                failureRedirect: '/'
            }));

        app.get('/authorize', passport.authenticate('google', {
            scope: [
                'email', 'profile']
        }));

        app.get('/getAmazonS3Credentials', function (request, response) {
            var executeGetAmazonS3Credentials = function (params, callback) { 
                callback(null, {
                    result: operationResults.success,
                    credentials: secret.amazonS3 
                });
            };

            async.waterfall([
                async.constant({request: request}),
                utilities.checkIfUserIsAuthorized,
                executeGetAmazonS3Credentials
            ],
                utilities.getUiJsonResponseSender(response)
            );

        });
    }
};

    
