const express = require('express');
const path = require('path');
const createError = require('http-errors')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler');

const indexRoute = require('./routes/index');
const messageRoute = require('./routes/message')

const User = require('./models/user');

//ENV FILE
require('dotenv').config()
//console.log(process.env)

const mongoDb = process.env.URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'))

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// PASSPORT
passport.use(
    new LocalStrategy(asyncHandler (async (username,password,done) =>{
        const user = await User.findOne({user_name: username});
        if(!user){
            return done(null, false, {message: "Incorrect Username. Try again"});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            //passwords do not match!
            return done(null, false, {message: "Incorrect Password"});
        }
        return done(null, user);
    }))
)

passport.serializeUser((user,done)=>{
    done(null, user.id)
});

passport.deserializeUser(async (id, done)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch(err){
        done(err);
    }
})

// MIDDLEWARES
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.post('/login',
    passport.authenticate('local',{
        failureRedirect: '/',
    }), (req,res) => {
        const user = new User({
            _id: req.user._id
        });
        res.redirect(user.url)
    }
)

//saving the current user data
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', indexRoute)
app.use('/', messageRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));