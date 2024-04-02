const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const User = require('../models/user');
const Messages = require('../models/messages');

router.get('/members-only/:id/message', (req,res)=>{
    res.render('message')
})

router.post('/members-only/:id/message', asyncHandler (async(req,res)=>{
    const msg = new Messages({
        title: req.body.title,
        timestamp: Date.now(),
        message: req.body.message,
        userId: res.locals.currentUser._id
    })        
    await msg.save();
    
    res.redirect('/login');
}))

module.exports = router;