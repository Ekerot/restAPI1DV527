'use strict';

/**
 * Created by ekerot on 2017-02-16.
 */

const router = require('express').Router();
const Users = require('../models/Users.js');
const jwt = require('jsonwebtoken');

router.post('/users', (req,res) => {

    Users.findOne({username: req.body.username}, (err, user) => {

        if(!user)
            return res.status(403).send({
                status: '403: Forbidden',
                message: 'User not found!'
            });

        else{
            user.comparePassword(req.body.password, (err, userpassword) =>{  //check for valid password
                if(err)
                    res.send({Message: `Error ${err}`});

                else if(!userpassword) //if password does not match
                    return res.status(403).send({
                        status: '403: Forbidden',
                        message: 'Password not valid!'
                    });

                else{
                    let token = jwt.sign({username: user.username}, process.env.TOKEN, { // sign JWT token store username
                        expiresIn: '2h' //expires in 2h - we don´ want it to be to long on the protected routes
                    });

                    res.setHeader("Cache-control", "no-cache");
                    return res.status(202).send({
                        status: '202: Accepted',
                        message: 'Welcome!',
                        token: token,
                        _links: {
                            self: [
                                {
                                    href: "http://localhost:3000/api/v1/login",
                                    type: "application/json",
                                    rel: "next",
                                    verb: "POST",
                                    title: "Login as user"
                                }
                            ],
                            from: [
                                {
                                    href: "http://localhost:3000/api/v1",
                                    type: "application/json",
                                    rel: "self",
                                    verb: "GET",
                                    title: "This is the API root!"
                                }]
                        }

                    });
                }
            });
        }
    });
});

router.get('/users', (req, res) => {   //get all users, only for administrators

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    status: '403: Forbidden', message: 'Your token is not valid!'});

            } else {

                Users.findOne({username: decoded.username}, (err, user) => { // find user to verify if they are admin
                    if (err)
                        res.send({Message: `Error ${err}`});

                    if (user.admin == true) { // they also need to be administrators to be allowed to enter

                        Users.find({}, (err, users) => {
                            if (err)
                                return res.json(err);

                            let context = {
                                status: "200: OK",
                                users: users.map((users) => {
                                    return {
                                        username: users.username,
                                        email: users.email,
                                        admin: users.admin
                                    }
                                }),
                                _links: {
                                    self: [
                                        {
                                            href: "http://localhost:3000/api/v1/users",
                                            type: "application/json",
                                            rel: "self",
                                            verb: "GET",
                                            title: "Users data"
                                        }
                                    ],
                                    from: [
                                        {
                                            href: "http://localhost:3000/api/v1",
                                            type: "application/json",
                                            rel: "self",
                                            verb: "GET",
                                            title: "This is the API root!"
                                        }]
                                }
                            };

                            res.setHeader("Cache-control", "private"); // set header to cache-control private
                            return res.status(200).send(context);
                        });
                    }

                    else
                        return res.status(401).send({
                            status: '401: Unauthorized',
                            message: 'You are not granted access to this url!'
                        });
                });
            }
        });

    } else {

        return res.status(403).send({
            status: '403: Forbidden',
            message: 'Token not provided'
        });
    }
});

module.exports = router;