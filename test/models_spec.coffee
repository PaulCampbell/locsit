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


