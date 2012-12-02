var Twitter = require('twitter')
var Models = require('./Models')


var twitter = new Twitter();

var thisService = this

var getTweets = function(hashtag, callback){
  // Grab the tweets for this tag from the database
      Models.Tweet.find({hashtag:hashtag})
      .limit(100).sort('-created_at')
      .exec(function(err, docs){
        if(err)
        {
          console.log(err)
          callback(err)
        }
        else
        {
          if(docs.length==0)
          {
            // there weren't any in the database. lets get some and create some docs
            var tweetDocs = []
              thisService.search(hashtag, function(data){
                data.results.forEach(function(tweet){
                    if(tweet.text.indexOf('RT:')==-1 && tweet.text.indexOf('RT ')==-1)
                    {
                    var t = new Models.Tweet({
                        hashtag: hashtag,
                        from_user:tweet.from_user,
                        from_user_name: tweet.from_user_name,
                        text: tweet.text,
                        profile_image_url: tweet.profile_image_url,
                        created_at: tweet.created_at
                    });
                    if(tweet.geo)
                    {
                        t.longitude = tweet.geo.coordinates[0];
                        t.latitude = tweet.geo.coordinates[1];
                    }

                    t.setLocationForMaps(function(err,tweetInstance){
                        if(err)
                            callback(err)
                        else
                        {
                        tweetDocs.push(t);
                        t.save();


                        }
                    })
                    }
                })
                  callback(null, tweetDocs);

            });
          }
          else
          {
              callback(null, docs);
          }
        }
    })
}

exports.getTweets = getTweets

var search = function(searchTerm, cb) {
    twitter.search(searchTerm, function(data) {
        cb(data);
    });
}
exports.search = search