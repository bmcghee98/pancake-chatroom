// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const Room = require("./models/Rooms")
const Message = require("./models/Messages")
const Profile = require("./models/Profiles")
const moment = require('moment');
// import handlers
const homeHandler = require('./controllers/home.js');
const profileHandler = require('./controllers/profile.js');
const roomHandler = require('./controllers/room.js');
const roomIdGenerator = require('./util/roomIdGenerator');
const userHandler = require('./controllers/user.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', 
                       defaultLayout: 'layout', 
                       layoutsDir: __dirname + '/views/layouts/'
                    }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const db = config.get('mongoURI'); //pull db connection from default.json
mongoose.connect(db, //connect to database
    err => {
        if(err) throw err;
        console.log("Connected to MongoDB")
    })

//getRoom - return json of all rooms in the database
app.get("/getRoom", function(req,res){
    Room.find().lean().then(item => {
        res.json(item)
    })
})

//messages - return json of all rooms in the database
app.get("/:roomId/messages", function(req,res){
    Message.find({room_id: req.params.roomId}).lean().then(item => {
        res.json(item)
    })
})

//return json of all users in the database
app.get("/getUsers", function(req,res){
    Profile.find().lean().then(item => {
        res.json(item)
    })
})

// Create controller handlers to handle requests at each endpoint
app.get('/', homeHandler.getHome, profileHandler.getProfile, homeHandler.renderHome);
app.get('/register', (req,res)=> res.render('profile'));
app.get('/login', (req,res)=> res.render('login'));
app.get('/user/:userId', profileHandler.getProfile, userHandler.getUser,userHandler.getUserMessages, userHandler.renderUser);
app.get('/:roomId', roomHandler.getRoom, profileHandler.getProfile, roomHandler.renderRoom);

//profileHandler.findUser, profileHandler.getProfile, profileHandler.renderUser);
//Create endpoint- to create a new room in the database
app.post("/create", function(req,res){
    const newRoom = new Room({
        name: req.body.roomName,
        id: roomIdGenerator.roomIdGenerator(),
    })
    newRoom.save().then(console.log("Room has been added")).catch(err=>console.log("Error when creating room", err));
    res.redirect('/');
});

app.post("/newMsg", function(req,res){
    const newMessage = new Message({
        username: req.body.username,
        text_msg: req.body.msg,
        msg_id: roomIdGenerator.roomIdGenerator(),
        room_id: req.body.room_id,
        moment_data: moment(),
        date: moment().format("LLLL"),
    })
    newMessage.save().then(console.log("New Message has been added")).catch(err=>console.log("Error when creating room", err));
    res.redirect('back');
});

//endpoint to create new profile
app.post("/newProfile", function(req,res){
    const newProfile = new Profile({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        user_id: roomIdGenerator.roomIdGenerator(),
    })
    newProfile.save().then(console.log("New Profile has been created")).catch(err=>console.log("Error when creating new profile", err));
    res.redirect('/login');
});


// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));