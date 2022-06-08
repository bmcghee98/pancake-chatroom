const Profiles = require("../models/Profiles")
const Messages = require("../models/Messages");

function getUser(req, res, next) {
    Profiles.findOne({user_id: req.params.userId}).lean().then(item =>{
        res.locals.user = item;
        console.log("user found:", item.username)
        next();
    });
};

function getUserMessages(req, res, next) {
    Profiles.findOne({user_id: req.params.userId}).lean().then(item =>{
        console.log("user found for messages:",item.username)
        Messages.find({username: item.username}).sort({date :-1}).lean().then(items =>{
            res.locals.messages = items;
            // console.log("messages found", items)
            next();
        });
    });
};

function renderUser(req,res){
    res.render('user')
}


module.exports = {
    getUser, getUserMessages, renderUser
};