var vhost = require('vhost'),
    express = require('express'),
    app = express(),
    config = require('./config'),
    handlebars = require('express-handlebars'),
    mongoUtil = require('./common/mongoUtil');
    
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/common/views');

mongoUtil.connectToDb(function (error, response) { 
    if (error) {
        //LOG & shutdown the app!! 
        process.exit(1);
        return;
    }

    app.use(vhost(config.appConfig.adminSiteUrl, require('./dashboard/service').app))
        .use(vhost(config.appConfig.mainSiteUrl, require('./website/service').app))
        .listen(config.appConfig.port);
});

app.use(function (error, request, response, next) { 
    response.status(500);
    response.render('../../../common/views/500');
});