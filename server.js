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
const bodyParser = require('body-parser')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET="7f7b0rbvrevnppjnvlkbwcrvv8r902ff19048fnvvnuvobsabb36432f78518vfiuvfdacuabvflbzbv874"
// import handlers
const homeHandler = require('./controllers/home.js');
const profileHandler = require('./controllers/profile.js');
const roomHandler = require('./controllers/room.js');
const roomIdGenerator = require('./util/roomIdGenerator');
const res = require('express/lib/response');

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
app.get('/change-password',(req,res)=> res.render('changePass'))
app.get('/:roomId', roomHandler.getRoom, profileHandler.getProfile, roomHandler.renderRoom);

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

/*
//endpoint to create new profile
app.post("/api/newProfile", function(req,res){
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
*/

app.post("/api/change-password", async(req, res) => {
    const {token, newpassword:plainTextPassword} = req.body

    
    if (!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status:"error", error:"Invalid password"})
    }

    if (plainTextPassword.length < 5){
        return res.json({status:"error", error:"Password should be at least 5 characters"})
    }

    try { //verify the JWT received
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword, 10)
        await Profile.updateOne(
            {_id},
            {
                $set:{password}
            }
        )
        console.log("Password update successful")
        return res.json({status:"ok"})
    } catch(error) {
        console.log(error)
        return res.json({status:"error", error:""})
    }
})

app.post("/api/login", async(req, res) => {
    const {username, password} = req.body
    
    const user = await Profile.findOne({username}).lean()
    if(!user) { // user not found
        res.json({status:"error", error:"Invalid username/password"})
    }

    if (await bcrypt.compare(password, user.password)){
        //username, password correct
        const token = jwt.sign({
            id:user._id,
            username: user.username
        },
        JWT_SECRET)
        console.log({status:"success", data:token});
        res.redirect('/')
        
    } else {
        console.log({status:"error", error:"Invalid username/password"})
        res.redirect("/login")
    }


})

app.post("/api/register", async (req, res) => {
    console.log(req.body);
    const username = req.body.username
    const name = req.body.name;
    const email = req.body.email;
    const {password: plainTextPassword} = req.body
    const user_id = roomIdGenerator.roomIdGenerator()
    
    /*
    if (username || typeof username !== 'String'){
        return res.json({status:"error", error:"Invalid username"})
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status:"error", error:"Invalid password"})
    }
    */
    if (plainTextPassword.length < 4){
        return res.json({status:"error", error:"Password is too short"})
    }

    const password = await bcrypt.hash(plainTextPassword, 10)
    //create the user
    try{
        await Profile.create({
            username,
            name,
            password,
            email,
            user_id
        })
    } catch(error) {
        console.log(error);
        return res.json({status:"error"})
    }
})


// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));