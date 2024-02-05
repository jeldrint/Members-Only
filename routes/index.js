const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../models/user')

//FOR LOGIN
router.get('/', (req,res) => {
    console.log(res.locals);
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

router.post('/sign-up', async (req,res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) =>{
        if (err) console.log(err);
        else{
            try {
                const user = new User({
                    first_name: req.body.firstname,
                    family_name: req.body.lastname,
                    user_name: req.body.username,
                    password: hashedPassword,
                })
                const result = await user.save();
                res.redirect('/');
            }catch(err){
                return next(err)
            }        
        }
    })
})


module.exports = router;