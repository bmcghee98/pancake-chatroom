const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    room_id:{
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
    date:{
        type: String,
        required: true,
    },
    vote:{
        type: Number,
        required: true,
    }
});

module.exports = Item = mongoose.model('message', MessageSchema);