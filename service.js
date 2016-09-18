var vhost = require('vhost'),
    express = require('express'),
    app = express(),
    config = require('./config');

app.use(vhost(config.appConfig.adminSiteUrl, require('./Dashboard/service').app))
    .use(vhost(config.appConfig.mainSiteUrl, require('./Website/service').app))
    .listen(config.appConfig.port);


