'use strict';

/**
 * Created by ekerot on 2017-02-16.
 */

const router = require('express').Router();
const Users = require('../models/Users');

router.post('/register', (req, res) =>{

    if(!req.body.username || !req.body.email || !req.body.password) //input on all parameters needs to be done
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

                res.setHeader('Cache-control', 'no-cache');
                res.status(201).send({
                    status: '201: Created',
                    message: 'Your account registered successfully',
                    _links: {
                        self: [
                            {
                                href: 'http://localhost:3000/api/v1/register',
                                type: 'application/json',
                                rel: 'next',
                                verb: 'POST',
                                title: 'Register a user'
                            }
                        ],
                        from: [
                            {
                                href: 'http://localhost:3000/api/v1',
                                type: 'application/json',
                                rel: 'self',
                                verb: 'GET',
                                title: 'This is the API root!'
                            }]
                    }
                });
            }).catch((err) =>{
            res.send({Message: `Error ${err}`}); // send error if something went wrong
            })
    }
});

module.exports = router;
