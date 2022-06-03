// Controller handler to handle functionality in home page

const Rooms = require("../models/Rooms");
const Profiles = require("../models/Profiles")

// Example for handle a get request at '/' endpoint.

function getHome(request, response, next){
  Rooms.find().lean().then(items =>{
    response.locals.rooms = items;
    response.locals.isAvailable = true;
    response.locals.title = "Chatroom Directory";
    next();
  });
}

function renderHome(req, res) {
  res.render('home');
};

module.exports = {
    getHome, renderHome
};