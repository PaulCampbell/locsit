should = require 'should'
zombie = require 'zombie'

describe 'Web tests', ->
  describe 'map page', ->

    it 'should return the map page with title set', (done) ->
      zombie.visit 'http://localhost:3000/thehashtag',(e, browser)  ->
        browser.text('title').should.exist
        done()

  describe 'index page', ->

    it 'should return the home page with title set',(done) ->
      zombie.visit 'http://localhost:3000/',(e, browser)  ->
        browser.text('title').should.equal 'Realtime Twitter Hashmaps'
        done()

    it 'should render the "home" template', (done) ->
      zombie.visit 'http://localhost:3000/',(e, browser)  ->
         browser.text('h1').should.equal 'Realtime Twitter Hashmaps'
         done()

    it 'should contain a list of recent links', (done) ->
      zombie.visit 'http://localhost:3000/',(e, browser)  ->
         browser.queryAll('#recent-tags li').length.should.be.greaterThan 0
         browser.text('#recent-tags li:first').should.equal 'thehashtag'
         done()






  describe 'api', ->
    describe 'map', ->
      it 'should return a json result of stored results', (done) ->
        zombie.visit 'http://localhost:3000/api/map/thehashtag',(e, browser)  ->
           browser.response.statusCode.should.equal 200
           done()