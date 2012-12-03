var Twitter = require('twitter')
var Models = require('./Models')


var twitter = new Twitter();

var thisService = this

var getTweets = function(hashtag, dateFrom, callback){

    Models.HashTag.findOne({tag:hashtag}, function(err,tag){
        if(tag)
        {
            // this has been searched for before... grab tweets from the db
            var query = Models.Tweet.find({hashtag:hashtag});
               if(dateFrom)
                   query.where('created_at').gt(dateFrom)

               query.limit(100).sort('-created_at')
                 .exec(function(err, docs){
                   if(err)
                   {
                     console.log(err)
                     callback(err)
                   }
                   else
                   {

                         callback(null, docs);
                   }
               })
        }
        else
        {
          //this is the first time it's been searched for.
          // Add a hashtag doc
            var tag = new Models.HashTag({tag: hashtag})
            tag.save()
              var tweetDocs = []
              thisService.search(hashtag, function(data){
                  console.log(data)
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

  })
}

exports.getTweets = getTweets

var search = function(searchTerm, cb) {
    twitter.search(searchTerm, function(data) {
        cb(data);
    });
}
exports.search = search