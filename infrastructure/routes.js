var fs =require('fs');
var homeActions = require('../actions/home.js');
var apiActions = require('../actions/api.js');
var jade = require('jade');
var path = require('path');

function init(app)
{
    app.get('/',  homeActions.home);
    app.get('/:hashtag',  homeActions.hashmap);
    app.get('/api/map/:hashtag',  apiActions.hashmap);
}

exports.init = init
