// Controller handler to handle functionality in room page

const Messages = require("../models/Messages");
// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response, next){
    Messages.find({room_name: request.params.roomName}).lean().then(items =>{
        response.locals.messages = items;
        response.locals.title = "Chatroom";
        response.locals.roomName = request.params.roomName;
        next();
        // response.render('room', {title: 'Chatroom', roomName: request.params.roomName, messages: items});
    });
}

function renderRoom(req, res) {
    res.render('room');
  };

module.exports = {
    getRoom, renderRoom,
};