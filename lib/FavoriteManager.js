var Models = require('./Models.js');
var und = require('underscore');

var addFavoritePlaceList = function(placelistId, username, callback){
    Models.User.findOne({username:username}, function (err, user) {
        if (err) {
            return callback(err);
        }
        else {
            und.each(user.favoriteLists, function(list){
                if(list.toString()==placelistId)
                {
                    return callback(new Error('List already favorited'));
                }
            });

            user.favoriteLists.push(placelistId);
            user.favoriteCount = user.favoriteCount + 1;
            user.save(function(err){
                 if(err)
                   return callback(err);
                 else
                   return callback(null,user);
             });
        }
    });
}


exports.addFavoriteList = addFavoritePlaceList;