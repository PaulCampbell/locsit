var Models = require('./Models.js')

var AddPlaceList = function(username, placelist, callback){
  Models.User.findOne({username:username}, function(err,user){
      if(err)
      {
        return callback(err);
      }
      else
      {
          var listExists = false;
          Models.PlaceList.findOne({name:placelist.name, user:user._id}, function(err,existingPlaceList){

            if(existingPlaceList)
            {
                console.log('Placelist called: ' + existingPlaceList.name + ' already exists for user: ' + user.username)
                listExists = true;
            }

              if(listExists)
                {
                   return callback(new Error('User has place list with the same name', null));
                }
                else
                {

                    placelist.user= user._id;
                    placelist.save(function(err){
                        if(err)
                          return callback(new Error(err, null));
                        else
                        {
                            user.placeLists.push(placelist._id);
                            user.save(function(){
                                return callback(null,placelist);
                            })
                        }
                    });
                }
          });
      }
  })

};

exports.addPlaceList = AddPlaceList;