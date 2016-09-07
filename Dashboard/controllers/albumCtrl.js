var album = require('../models/album');
var responseCodeMessages = require('../common/constants').responseCodeMessages;

module.exports = {
    registerRoutes: function (app) {
        app.get('/albumListPartial', this.getAlbumListPartial);
        app.post('/getAlbumList', this.getAlbumList);
    },

    getAlbumListPartial: function (req, res) {
        res.render('albumListPartial');
    },

    getAlbumList: function (req, res) {
        console.log(req);
        var reqBody = req.body;
        
        if (!reqBody.requestId) {
            res.send(500, responseCodeMessages.invalidRequest);
        }
    }

};

