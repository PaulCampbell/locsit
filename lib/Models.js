var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var mongooseValidator = require('mongoose-validator');
var validator = mongooseValidator.validator;


var placeNameValidator = [validator.len(1, 140, 'Must be between 1 and 140 characters')]

var PlaceSchema = new Schema({
  name: { type: String,
              required:true,
              validate: placeNameValidator},
  longitude: {type:Number,
                required:true},
  latitude: {type:Number,
                required:true},
  description: {type: String}
});


var placeListNameValidator = [validator.len(1, 140, 'Must be between 1 and 140 characters')]

var PlaceListSchema = new Schema({
    places: [PlaceSchema],
    description:{type:String},
    name:{  type:String,
            required:true,
            validate: placeListNameValidator},
    created:  {type: Date, default: Date.now},
    user: { type: Schema.Types.ObjectId , ref: 'User'}
});


var usernameValidator = [validator.len(3, 50, 'Must be between 3 and 50 characters')]
var emailValidator = [validator.isEmail('Must be valid email address')]
var bioValidator = [validator.len(0, 140, 'Must be less than 140 characters')]

var UserSchema = new Schema({
        email: { type: String,
            required:true,
            validate: emailValidator,
            unique: true
        },

        hashed_password: String,
        salt: String,

        username: {
            type: String,
            validate: usernameValidator,
            unique: true,
            required:true
        },
        bio: {
            type: String,
            validate: bioValidator
        },
        followerCount:{
            type: Number, default:0
        },
        followingCount:{
           type: Number, default:0
        },
        favoriteCount:{
           type: Number, default:0
        },
        listCount:{
               type: Number, default:0
        },
        favoriteLists: [{ type: Schema.Types.ObjectId , ref: 'PlaceList'}],
        favoriteListsCount: {type:Number, default:0},
        placeLists: [{ type: Schema.Types.ObjectId , ref: 'PlaceList'}],
        imageUrl: {
            type: String
        }
});

UserSchema.virtual('id')
   .get(function() {
     return this._id.toHexString();
   });

UserSchema.virtual('password')
   .set(function(password) {
     this._password = password;
     this.salt = this.makeSalt();
     this.hashed_password = this.encryptPassword(password);
   })
   .get(function() { return this._password; });

UserSchema.method('authenticate', function(plainText) {
   return this.encryptPassword(plainText) === this.hashed_password;
 });

UserSchema.method('makeSalt', function() {
   return Math.round((new Date().valueOf() * Math.random())) + '';
 });

UserSchema.method('encryptPassword', function(password) {
   return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
 });

UserSchema.pre('save', function(next) {
    if(this.isNew){
        if (!validatePresenceOf(this.password)) {
            var error = new Error('Password required')
            error.type="noPassword";
            return next(error);
       }
    }
    return next();
 });

function validatePresenceOf(value) {
    return value && value.length;
  }



exports.User = mongoose.model('User', UserSchema)
exports.PlaceList = mongoose.model('PlaceList', PlaceListSchema)
exports.Place = mongoose.model('Place', PlaceSchema)
