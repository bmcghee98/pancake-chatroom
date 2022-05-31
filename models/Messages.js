const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    room_name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    text_msg:{
        type: String,
        required: true,
    },
    msg_id:{
        type: String,
        required: true,
    },
    moment_data:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    }
});

module.exports = Item = mongoose.model('message', MessageSchema);