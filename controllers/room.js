// Controller handler to handle functionality in room page

const Messages = require("../models/Messages");
const Rooms = require("../models/Rooms");
// Example for handle a get request at '/:roomName' endpoint.
function getRoom(request, response, next){
    let roomname = "";
    Rooms.findOne({id: request.params.roomId}).lean().then(item =>{
        if(item){
            roomname = item.name;
            // console.log("roomname found:", roomname);
            Messages.find({room_id: request.params.roomId}).lean().then(items =>{
                response.locals.title = "Chatroom";
                response.locals.roomId = request.params.roomId;
                response.locals.messages = items;
                // console.log("messages found", items)
                response.locals.roomName = roomname;
                next();
            });
        }
    });
}

function renderRoom(req, res) {
    res.render('room');
  };

module.exports = {
    getRoom, renderRoom,
};