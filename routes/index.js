const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator')

const User = require('../models/user')
const Messages = require('../models/messages')

//ENV FILE
require('dotenv').config()

router.get('/', (req,res) => {
    res.redirect('/members-only')
})

router.get('/members-only', (req,res) => {
    res.render('index', {user: res.locals.currentUser})
})

//FOR LOGIN AND LOGOUT
router.get('/members-only/:id', asyncHandler (async (req,res) => {
    const messages = await Messages.find().exec();

    res.render('index', {
        user: res.locals.currentUser,
        messages: messages,
    })
}))

router.get('/logout', (req,res,next) => {
    req.logOut((err) => {
        return next(err)
    })
    res.redirect('/');
})

// FOR ELITE MEMBERS
router.post('/members-only/:id/elite-member',[
    body('passcode').custom(value => value === process.env.PASSCODE || value === process.env.ADMIN)
        .withMessage('passcode is wrong. try again'),

    asyncHandler(async(req, res, next) => {
        const err = validationResult(req);        

        console.log('elite POST')
        if (!err.isEmpty()){
            res.render('elite', {
                err: err.array(),
            })
        }else{
            let user = '';
            if(req.body.passcode === process.env.ADMIN){
                user = await User.updateOne({_id: res.locals.currentUser._id}, {$set:{membership_status: 'Administrator'}});
            }
            if(req.body.passcode === process.env.PASSCODE){
                user = await User.updateOne({_id: res.locals.currentUser._id}, {$set:{membership_status: 'Elite'}});
            }

            res.render('elite', {
                err: 'No error',
                user: user
            })
        } 
    })
])


//FOR SIGN UP
router.get('/sign-up', (req,res) => {
    console.log('sign up GET')
    res.render('sign-up-form');
})

router.post('/sign-up', [
    body("firstname")
        .trim().isLength({min: 1}).escape().withMessage("First name is empty.")
        .matches(/[a-zA-Z][a-zA-Z ]+/).withMessage("Name must be alphabet letters")
        .escape(),
    body("lastname")
        .trim().isLength({min: 1}).withMessage("First name is empty.")
        .matches(/[a-zA-Z][a-zA-Z ]+/).withMessage("Name must be alphabet letters")
        .escape(),
    body("username")
        .trim().isLength({min: 1}).withMessage("user name cannot be empty.")
        .escape(),
    body("password")
        .trim().isLength({min: 8}).withMessage("Password must be 8 characters long")
        .escape(),
    body('confirm-password')
        .custom((value, { req }) => value === req.body.password )
        .withMessage('The password does not match.'),

    asyncHandler (async (req,res, next) => {
        const errors = validationResult(req);

        console.log('sign-up POST')

        const user = new User({
            first_name: req.body.firstname,
            family_name: req.body.lastname,
            user_name: req.body.username,
        })
        
        console.log(errors.array())
        if(!errors.isEmpty()){         
            res.render('sign-up-form', {
                errors: errors.array(),
            })
            return;
        }else{
            bcrypt.hash(req.body.password, 10, async (err, hashedPW) => {
            console.log(req.body.password, hashedPW)
            if(err){
                return err
            }else{
                user.password = hashedPW;
                await user.save();
                res.redirect('/')
            }
            })
        }
    })
])


module.exports = router;