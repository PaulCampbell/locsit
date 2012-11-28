var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')
var ErrorHandler = require('./errorHandler')

function home(req,res) {
    res.render('index', {
      title: 'Realtime Twitter Hashmaps'
    });
}

function map(req,res) {

    var tag = req.params.hashtag;

    // first we log the visit
    var visit = new Models.Visit();
    visit.hashtag = tag;
    visit.ip_address = req.connection.remoteAddress;
    visit.save(function(){

      TwitterService.getTweets(tag, function(err, tweets){
          if(err)
          {
              ErrorHandler.handle(err, 500, res)
          }
          else
          {
              res.render('map', {
                  tweets: tweets,
                  title: '#' + tag +  ': Realtime Twitter Hashmaps',
                  hashtag:tag
              });
          }
      });
    })
}

exports.home = home;
exports.hashmap = map;