Models = require '../lib/models'

describe 'Models', ->
  describe 'Tweets', ->
    it 'tweet with location and score can be added to map', (done) ->
      tweet = new Models.Tweet({text:"some text with a postcode LS1  and score 8/10."})
      tweet.can_be_added_to_map.should.equal true
      done()

    it 'tweet with no location and  no score can not be added to map', (done) ->
      tweet = new Models.Tweet({text:"some text with no postcode  or score."})
      tweet.can_be_added_to_map.should.equal false
      done()

    it 'extracts embedded postcode outcode', (done) ->
      tweet = new Models.Tweet({text:'some crap and an embedded outcode LS17'})
      tweet.embedded_postcode.should.equal 'LS17'
      done()

    it 'extracts FULL embedded postcode', (done) ->
          tweet = new Models.Tweet({text:'some crap and an embedded outcode LS17 6JR'})
          tweet.embedded_postcode.should.equal 'LS17 6JR'
          done()

    it 'tweet with location but no score can not be added to map', (done) ->
      tweet = new Models.Tweet({text:"some text with postcode LS17 6JR but no score."})
      tweet.can_be_added_to_map.should.equal false
      done()

    it 'tweet with no location but with score can not be added to map', (done) ->
      tweet = new Models.Tweet({text:"some text with no postcode but with score 1/10."})
      tweet.can_be_added_to_map.should.equal false
      done()

    it 'tweet containing username has it replaced with link', (done) ->
      tweet = new Models.Tweet({text:"here is a tweet containing a username @paulcampbell_"})
      tweet.text_as_html.should.equal 'here is a tweet containing a username @<a href="http://www.twitter.com/paulcampbell_">paulcampbell_</a>'
      done()


    it 'tweet containing hashtag has it replaced with link', (done) ->
      tweet = new Models.Tweet({text:"here is a tweet containing a hashtag #maptwit"})
      tweet.text_as_html.should.equal 'here is a tweet containing a hashtag #<a href="http://search.twitter.com/search?q=%23maptwit">maptwit</a>'
      done()

    it 'rating can be extracted', (done) ->
      tweet = new Models.Tweet({text:"some text with no postcode but with score 1/10."})
      tweet.rating.should.equal 1
      done()

    it 'rating can be extracted',  (done)  ->
        tweet = new Models.Tweet({text:"some text with no postcode but with score 10/10."})
        tweet.rating.should.equal 10
        done()

    it 'no rating tweeted get a rating of 0',  (done)  ->
      tweet = new Models.Tweet({text:"some text with no postcode but with no score."})
      tweet.rating.should.equal 0
      done()

    describe 'Setting the tweet location for use on the map', ->

      it 'tweet containing postcode should do a geo lookup and use that for map positioning', (done) ->
        tweet = new Models.Tweet({text: 'tweet body text and postcode SN6 7NU', longitude: -1.5, latitude: 51.2})
        tweet.setLocationForMaps (err, instance) ->
          instance.longitude_for_map.should.exist
          instance.longitude_for_map.should.not.equal instance.longitude
          instance.latitude_for_map.should.exist
          instance.latitude_for_map.should.not.equal instance.latitude
          done()

      it 'tweet containing outcode should do a geo lookup and use that for map positioning', (done) ->
        tweet = new Models.Tweet({text: 'tweet body text and postcode SN2', longitude: -1.5, latitude: 51.2})
        tweet.setLocationForMaps (err, instance) ->
          instance.longitude_for_map.should.exist
          instance.longitude_for_map.should.not.equal instance.longitude
          instance.latitude_for_map.should.exist
          instance.latitude_for_map.should.not.equal instance.latitude
          done()

      it 'tweet without postcode should use tweet geo information for map positioning', (done) ->
        tweet = new Models.Tweet({text: 'tweet body text', longitude: -1.5, latitude: 51.2})
        tweet.setLocationForMaps (err, instance)  ->
          instance.longitude_for_map.should.exist
          instance.longitude_for_map.should.equal instance.longitude
          instance.latitude_for_map.should.exist
          instance.latitude_for_map.should.equal instance.latitude
          done()

