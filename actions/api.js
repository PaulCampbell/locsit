var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')
var ErrorHandler = require('./errorHandler')


function map(req,res) {
    var tag = req.params.hashtag;
    console.log(tag)
    TwitterService.getTweets(tag,  function(err, tweets){
      if(err)
      {
          ErrorHandler.handle(err, 500, res)
      }
      else
      {
          res.send(tweets);
      }
    })
}

exports.hashmap = map;