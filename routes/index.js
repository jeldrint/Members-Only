const express = require('express');
const router = express.Router();

const User = require('../models/user')

router.get('/', (req,res) => res.render('index', {user: req.user}));


//FOR SIGN UP
router.get('/sign-up', (req,res) => res.render('sign-up-form'))

router.post('/sign-up', async (req,res, next) => {
    try {
        const user = new User({
            first_name: req.body.firstname,
            family_name: req.body.lastname,
            user_name: req.body.username,
            password: req.body.password,
        })
        const result = await user.save();
        res.redirect('/');
    }catch(err){
        return next(err)
    }
})


module.exports = router;