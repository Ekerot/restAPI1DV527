'use strict';

/**
 * Created by ekerot on 2017-02-16.
 */
const router = require('express').Router();
const Users = require('../models/Users.js');
const jwt = require('jsonwebtoken');

router.post('/login', (req,res) => {

    Users.findOne({username: req.body.username}, (err, user) => {

        if(!user)
            return res.status(401).send({
                status: 'Error',
                message: 'User not found!'
            });

        else{
            user.comparePassword(req.body.password, (err, userpassword) =>{
                if(err)
                    res.json({message: err});

                else if(!userpassword)
                    return res.status(403).send({
                        status: 'Error',
                        message: 'Password not valid!'
                    });

                else{
                    let token = jwt.sign({username: user.username}, process.env.TOKEN, {
                        expiresIn: '1h'
                    });

                    return res.status(200).send({
                        status: 'OK - status 200',
                        message: 'Welcome!',
                        token: token
                    });
                }
            });
        }
    });
});

router.get('/users', (req, res) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Your token is not valid!'});

            } else {

                Users.findOne({username: decoded.username}, (err, user) => {
                    if (err)
                        return res.json(err);

                    if (user.admin == true) {

                        Users.find({}, (err, users) => {
                            if (err)
                                return res.json(err);

                            let context = {
                                users: users.map((users) => {
                                    return {
                                        username: users.username,
                                        email: users.email,
                                        admin: users.admin
                                    }
                                })
                            };
                            res.json(context);
                        });
                    }

                    else
                        return res.status(403).send({
                            status: 'Forbidden',
                            message: 'You are not granted access to this url!'
                        });
                });
            }
        });

    } else {

        return res.status(401).send({
            status: 'Error',
            message: 'Token not provided'
        });
    }
});


module.exports = router;