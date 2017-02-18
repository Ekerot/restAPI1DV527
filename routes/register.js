'use strict';

/**
 * Created by ekerot on 2017-02-16.
 */

const router = require('express').Router();
const Users = require('../models/Users');

router.post('/register', (req, res) =>{

    if(!req.body.username || !req.body.email || !req.body.password)
        res.status(401).send({
            message: 'You need to enter your desired username' +
        ', password and email to register!'});

    else {
        let user = new Users({  //creating new user from input

            username: req.body.username,
            email: req.body.email,
            password: req.body.password,

        });

        user.save()
            .then(() => {
                res.status(200).send({status: "OK", message: 'Your account registered successfully'});
            }).catch((err) =>{
                return res.json({message: err});
            })
    }
});


module.exports = router;
