should = require 'assert'
zombie = require 'zombie'
assert = require 'assert'


describe 'index page', ->

  it 'should return the home page with title set',(done) ->
    zombie.visit 'http://localhost:3000/',(e, browser)  ->
      browser.text('title').should.equal 'Realtime Twitter Hashmaps'
      done()

  it 'should render the "home" template', (done) ->
    zombie.visit 'http://localhost:3000/',(e, browser)  ->
       browser.text('h1').should.equal 'Realtime Twitter Hashmaps'
       done()



describe 'map page', ->

  it 'should return the map page with title set', (done) ->
    zombie.visit 'http://localhost:3000/thehashtag',(e, browser)  ->
      browser.text('title').should.equal '#thehashtag: Realtime Twitter Hashmaps'
      done()