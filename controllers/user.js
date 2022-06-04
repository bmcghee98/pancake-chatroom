const Profiles = require("../models/Profiles")
const Messages = require("../models/Messages");

function getMessages(req, res) {
    Messages.find({username: request.params.roomId}).lean().then(items =>{
        response.locals.title = "Chatroom";
        response.locals.roomId = request.params.roomId;
        response.locals.messages = items;
        response.locals.roomName = roomname;
        next();
    });
};

function getUser(req, res) {
    Profiles.findOne({user_id: req.params.userId}).lean().then(item =>{
        console.log("user found: ", item.name);
        res.render('user',{user: item} );
    });
};


module.exports = {
    getMessages, getUser,
};