var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')
var ErrorHandler = require('./errorHandler')



function map(req,res) {
    var tag = req.params.hashtag;
    var dateFrom = req.query["from"];
    console.log(tag)
    TwitterService.getTweets(tag, dateFrom, function(err, tweets){
      if(err)
      {
          ErrorHandler.handle(err, 500, res)
      }
      else
      {
          var objects = [];
          tweets.forEach(function(t)
          {
            var o = t.toObject()
              o.pretty_date = t.pretty_date;
              o.text_as_html = t.text_as_html;
            objects.push(o)
          });
          console.log(objects)
          res.send(objects);
      }
    })
}

exports.hashmap = map;