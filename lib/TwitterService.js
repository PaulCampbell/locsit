var Twitter = require('twitter')



var twitter = new Twitter();


var search = function(searchTerm, cb) {
    twitter.search(searchTerm, function(data) {
        console.log(data.results[0]);
        cb(data);
    });
}

exports.search = search

