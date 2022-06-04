const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    name:{ //"name" is deprecated??
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    user_id:{
        type: String,
        required: true,
    }
});

module.exports = Item = mongoose.model('profile', ProfileSchema);