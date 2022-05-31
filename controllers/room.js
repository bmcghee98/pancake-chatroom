// Controller handler to handle functionality in room page

const Messages = require("../models/Messages");
// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response){
    Messages.find({room_name: request.params.roomName}).lean().then(items =>{
        response.render('room', {title: 'Chatroom', roomName: request.params.roomName, messages: items});
    });
}



module.exports = {
    getRoom
};