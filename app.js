const express = require('express');
const path = require('path');
const createError = require('http-errors')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const indexRoute = require('./routes/index');
const User = require('./models/user')

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

// MIDDLEWARES
app.use(session({secret: "cats", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRoute)
  
app.listen(3000, () => console.log('app listening to port 3000'));