mongoose = require 'mongoose'
Models = require '../lib/Models'
actions = require '../actions/home'
should = require 'should'



mongoose.connect 'mongodb://localhost/locsit_test'

describe 'visiting the Map action', ->
  it 'creates a new Visit document', (done) ->
    mockRes =
      render: (viewName) ->
        Models.Visit.findOne {hashtag: 'UKSnow'},(err, doc) ->
          should.exist doc
          should.not.exist err
    actions.hashmap(mockReq, mockRes)
    done()


  it 'logs the clients ip address', (done) ->
    mockRes =
      render: (viewName) ->
        Models.Visit.findOne {hashtag: 'UKSnow'},(err, doc) ->
          doc.ip_address.should.equal '122.122.122.122'

    actions.hashmap(mockReq, mockRes)
    done()


  #describe 'when it is the first time a tag has been visited', ->
   # it 'calls the twitter rest service to get a bunch of recent matching tweets', (done) ->
    #  newMockReq =
     #    params: {hashtag:'cat'}
      #   connection: {remoteAddress:'122.122.122.122' }
      #newMockRes =
       #  render: (viewName) ->
        #   Models.Tweet.findOne {hashtag: 'UKSnow'}, (err, doc) ->
         #    doc.should.not.exist

    #  actions.hashmap(newMockReq, newMockRes)
     # done()


  #describe 'when the hashtag has been hit before', ->
   # it 'just grabs the tweets from the database', (done) ->
    #  done()



after (done) ->
   Models.Visit.remove {}, (err, result) ->
     done()



# MOCKS...
mockReq =
  params: {hashtag:'UKSnow'}
  connection: {remoteAddress:'122.122.122.122' }