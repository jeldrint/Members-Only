const express = require('express');
const path = require('path');
const createError = require('http-errors')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const indexRoute = require('./routes/index');
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
    new LocalStrategy(async (username,password,done) =>{
        try {
            const user = await User.findOne({user_name: username});
            if(!user){
                return done(null, false, {message: "Incorrect Username. Try again"});
            }
            if(user.password !== password){
                return done(null, false, {message: "Incorrect Password"});
            }
            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
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

app.post('/login',
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/',
    })
)

app.use('/', indexRoute)

app.listen(3001, () => console.log('app listening to port 3001'));