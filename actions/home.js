var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')
var ErrorHandler = require('./errorHandler')

function home(req,res) {
    Models.HashTag.find().limit(5).sort('-visit_date')
          .exec(function(err, docs){
            if(err)
            {
                res.render('index', {
                      hashtags: [],
                      title: 'Realtime Twitter Maps'
                    });
            }
            else
            {

                res.render('index', {
                      hashtags: docs,
                      title: 'Realtime Twitter Maps'
                    });
            }
        });

}

function map(req,res) {

    var tag = req.params.hashtag;

    // first we log the visit
    var visit = new Models.Visit();
    visit.hashtag = tag;
    visit.ip_address = req.connection.remoteAddress;
    visit.save(function(){

      TwitterService.getTweets(tag,null, function(err, tweets){
          if(err)
          {
              ErrorHandler.handle(err, 500, res)
          }
          else
          {
              res.render('map', {
                  tweets: tweets,
                  title: '#' + tag +  ': Realtime Twitter Maps',
                  hashtag:tag
              });
          }
      });
    })
}

exports.home = home;
exports.hashmap = map;