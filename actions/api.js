var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')
var ErrorHandler = require('./errorHandler')
var DemoData = require('../lib/DemoData')



function map(req,res) {
    var tag = req.params.hashtag;
    var dateFrom = req.query["from"];


    if(tag == 'TheseFloodsAreInconvenient')
    {
        // this is the demo data
        console.log(tag)
        var demoTweet = DemoData.getDemoTweet()
        console.log(demoTweet)
        var responseArray = [demoTweet]
        res.send(responseArray)
    }
    else
    {
        console.log('real data lookup')
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
              res.send(objects);
          }
        })
    }
}

exports.hashmap = map;