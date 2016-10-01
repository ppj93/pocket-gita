var vhost = require('vhost'),
    express = require('express'),
    app = express(),
    config = require('./config');

app.use(vhost(config.appConfig.adminSiteUrl, require('./dashboard/service').app))
    .use(vhost(config.appConfig.mainSiteUrl, require('./website/service').app))
    .listen(config.appConfig.port);


