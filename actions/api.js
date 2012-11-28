var Models = require('../lib/Models');
var TwitterService = require('../lib/TwitterService')


function map(req,res) {

    var tag = req.params.hashtag;

    function renderMapPage(tweets){
        res.render('map', {
            tweets: tweets,
            title: '#' + tag +  ': Realtime Twitter Hashmaps',
            hashtag:tag
        });
    }


    // first we log the visit
    var visit = new Models.Visit();
    visit.hashtag = tag;
    visit.ip_address = req.connection.remoteAddress;
    visit.save(function(){
      // Grab the tweets for this tag from the database
      Models.Tweet.find({hashtag:tag})
      .limit(100).sort('-created_at')
      .exec(function(err, docs){
        if(err)
          console.log(err)
        else
        {
          if(docs.length==0)
          {
            // there weren't any in the database. lets get some and create some docs
            var tweetDocs = []
            TwitterService.search(tag, function(data){
                data.results.forEach(function(tweet){
                    var t = new Models.Tweet({
                        hashtag: tag,
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
                    tweetDocs.push(t);
                    t.save();
                })
                renderMapPage(tweetDocs);
            });
          }
          else
          {
              renderMapPage(docs);
          }
        }
      })
    })
}

exports.hashmap = map;