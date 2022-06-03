const Profiles = require("../models/Profiles")

function getProfile(request, response, next){
    Profiles.find().lean().then(items =>{
      response.locals.users = items;
      next();
    });
  }

module.exports = {
    getProfile
};