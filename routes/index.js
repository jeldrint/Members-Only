const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler');

const User = require('../models/user')

//FOR LOGIN
router.get('/', (req,res) => {
    //console.log(res.locals);
    res.render('index', {user: res.locals.currentUser})
})

router.get('/logout', (req,res,next) => {
    req.logOut((err) => {
        return next(err)
    })
    res.redirect('/');
})

//FOR SIGN UP
router.get('/sign-up', (req,res) => res.render('sign-up-form'))

router.post('/sign-up', asyncHandler (async (req,res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) =>{
        if (err) console.log(err);
        else{
            const user = new User({
                first_name: req.body.firstname,
                family_name: req.body.lastname,
                user_name: req.body.username,
                password: hashedPassword,
            })
            const result = await user.save();
            res.redirect('/');
        }
    })
}))


module.exports = router;