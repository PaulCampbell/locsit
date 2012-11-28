mongoose = require 'mongoose'
Models = require '../lib/Models'
actions = require '../actions/home'
should = require 'should'
Twitter = require '../lib/TwitterService'


newtag = "cat"


describe 'the twitter service', ->

  it 'getTweets with new tag should add new tweets to database', (done) ->
    Models.Tweet.find {hashtag: newtag}, (err, docs) ->
         docs.length.should.equal 0
         Twitter.getTweets newtag, (err, tweets) ->
           tweets.should.exist
           Models.Tweet.find {hashtag: newtag}, (err, newDocs) ->
             newDocs.should.exist
             newDocs.length.should.be.above 0
             done()


  it 'getTweets with existing tag should not add new tweets to the database', (done) ->
    Models.Tweet.find {hashtag: newtag}, (err, docs) ->
       existingDocCount = docs.length
       Twitter.getTweets newtag, (err, tweets) ->
         tweets.should.exist
         Models.Tweet.find {hashtag: newtag}, (err, allCatDocs) ->

           allCatDocs.length.should.equal existingDocCount
           done()


after (done) ->
   Models.Tweet.remove {}, (err, result) ->
     done()