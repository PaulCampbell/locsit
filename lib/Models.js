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


exports.Tweet = mongoose.model('Tweet', TweetSchema)
exports.Visit = mongoose.model('Visit', VisitSchema)

