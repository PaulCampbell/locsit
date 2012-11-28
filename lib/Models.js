var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var TweetSchema = new Schema({
  hashtag: {type:String},
  from_user: { type: String},
  from_user_name: { type:String},
  longitude: {type:Number},
  latitude: {type:Number},
  text: {type: String},
  profile_image_url: {type:String},
  created_at: {type:Date},
  added: {type:Date, default: Date.now}
});

var VisitSchema = new Schema({
    hashtag:{type:String},
    visit_date:{type:Date, default: Date.now},
    ip_address:{type:String}
});

TweetSchema.virtual('text_as_html').get(function() {
   var tweet = this.text.replace(/(^|\s)@(\w+)/g, '$1@<a href="http://www.twitter.com/$2">$2</a>');
   return tweet.replace(/(^|\s)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>');
 });

TweetSchema.virtual('can_be_added_to_map').get(function () {
  var hasPostcode = false;
  var postcodePattern = new RegExp(/[A-Z]{1,2}[0-9]{1,2}/i);
  var postcodeMatches = this.text.match(postcodePattern);
  hasPostcode = postcodeMatches != null

  var hasRating = false;
  var ratingPattern = new RegExp(/[0-9]\/10/i);
  var ratingMatches = this.text.match(ratingPattern);
  hasRating = ratingMatches != null

  return hasPostcode && hasRating;
});

TweetSchema.virtual('embedded_postcode').get(function() {

    var postcodeRegEx =  new RegExp(/[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i);
    var postcodeMatches = this.text.match(postcodeRegEx);
    if(postcodeMatches!= null)
        return postcodeMatches[0]

    var outcodePattern = new RegExp(/[A-Z]{1,2}[0-9]{1,2}/i);
    var outcodeMatches = this.text.match(outcodePattern);
    if(outcodeMatches!=null)
      return outcodeMatches[0];

    return null
})

exports.Tweet = mongoose.model('Tweet', TweetSchema)
exports.Visit = mongoose.model('Visit', VisitSchema)

