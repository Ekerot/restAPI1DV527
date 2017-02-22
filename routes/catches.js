'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();
const FishData = require('../models/Fishdata.js');
const Users = require('../models/Users.js');
const jwt = require('jsonwebtoken');
const WebHooks = require('node-webhooks');

let webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
    debug: true
});

router.get('/', (req, res) => {   //shows all registered data

    FishData.find((err, fish) => {
        if (err)
            return res.status(500).send({
                status: '500: Internal Server Error',
                message: 'Something went wrong! Please try again later!'
            });

        let context = {
            status: '200: OK',
            data: fish.map((fish) =>
            {
                return {
                    catch: {
                        id: fish._id,
                        username: fish.username,
                        longitude: fish.longitude,
                        latitude: fish.latitude,
                        species: fish.species,
                        weight: fish.weight,
                        length: fish.length,
                        imageurl: fish.imageurl,
                        timestamp: fish.timestamp,
                        method: fish.method,
                        description: fish.description
                    },
                    _links: {
                        self: [
                            {
                                href: "http://localhost:3000/api/v1/collection",
                                type: "application/json",
                                rel: "self",
                                verb: "GET",
                                title: "A collection of catches"
                            }
                        ],
                        to:
                            [
                                {
                                    href: "http://localhost:3000/api/v1/catches/"+fish._id,
                                    type: "application/json",
                                    rel: "next",
                                    verb: "GET",
                                    title: "Single data of a catch"
                                },
                                {
                                    href: "http://localhost:3000/api/v1/catches/"+fish._id,
                                    type: "application/json",
                                    rel: "next",
                                    verb: "PATCH",
                                    title: "Update data",
                                    description: "Parameters: longitude, latitude, " +
                                    "species, weight, length, imageurl, method, description. " +
                                    "Login needed! When you enter your token use x-access-token as parameter"
                                },
                                {
                                    href: "http://localhost:3000/api/v1/catches/"+fish._id,
                                    type: "application/json",
                                    rel: "next",
                                    verb: "DELETE",
                                    title: "Delete data",
                                    description:  "Login needed! When you enter your " +
                                    "token use x-access-token as parameter"
                                }
                            ],
                        from:
                            [{
                                href: "http://localhost:3000/api/v1/",
                                type: "application/json",
                                rel: "previous",
                                verb: "GET",
                                title: "This is the API root!"
                            }]
                    }
                }
            })
        };
        res.setHeader("Cache-control", "public");
        return res.status(200).send(context);
    });
});

router.post('/',(req, res) => {    // register new data
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, (err, decoded) => { //verify user is authenticated

            if (err) {
                return res.status(403).send({
                    status: '403: Forbidden',
                    message: 'Token not valid!'
                });
            } else {

                let fishData = new FishData({
                    username: decoded.username,
                    position: {
                        longitude: req.body.longitude,
                        latitude: req.body.latitude
                    },
                    fish: {
                        species: req.body.species,
                        weight: req.body.weight,
                        length: req.body.length
                    },
                    imageurl: req.body.imageurl,
                    timestamp: req.body.timestamp,
                    method: req.body.method,
                    description: req.body.description
                });

                fishData.save().then((err) => {  // save data to DBS
                    if (err)
                        return res.status(500).send({
                            status: '500: Internal Server Error',
                            message: 'Something went wrong! Please try again later!'
                        });

                    res.setHeader('Cache-control', 'no-cache');

                    return res.status(201).send({
                        status: '201: Created',
                        message: 'Fish data created!',
                        _links: {
                            self: {
                                href: "http://localhost:3000/api/v1/catches/",
                                type: "application/json",
                                rel: "self",
                                verb: "POST",
                                title: "Creating new data"
                            },
                            from:
                                {
                                    href: "http://localhost:3000/api/v1/catches",
                                    type: "application/json",
                                    rel: "previous",
                                    verb: "GET",
                                    title: "A collection of catches"
                                }
                        }});
                });
                webHooks.trigger('createcatchdata', fishData);  //trigger the webhook(thetriggername, data)
            }
        });
    } else {

        return res.status(403).send({
            status: '403: Forbidden',
            message: 'Token not provided'
        });
    }
});

router.get('/:id', (req, res) => {  //gets individual data for each catch

    //Search for data by ID
    FishData.findById(req.params.id, (err, fish) => {
        if (err)
            return res.status(500).send({
            status: '500: Internal Server Error',
            message: 'Something went wrong! Please try again later!'
        });

        let context = {
            status: '200: OK',
            data: {
                    catch: {
                        id: fish._id,
                        username: fish.username,
                        longitude: fish.longitude,
                        latitude: fish.latitude,
                        species: fish.species,
                        weight: fish.weight,
                        length: fish.length,
                        imageurl: fish.imageurl,
                        timestamp: fish.timestamp,
                        method: fish.method,
                        description: fish.description
                    },

                    _links: {
                        self: [
                            {
                                href: "http://localhost:3000/api/v1/catches/" + fish._id,
                                type: "application/json",
                                rel: "self",
                                verb: "GET",
                                title: "Single data of a catch"
                            }
                        ],
                        from: [
                            {
                                href: "http://localhost:3000/api/v1/catches",
                                type: "application/json",
                                rel: "previous",
                                verb: "GET",
                                title: "A collection of catches"
                            }
                        ]
                    }
            }
        };
        res.setHeader("Cache-control", "public");
        return res.status(200).send(context); //send data
    });
});

router.patch('/:id',(req, res) => {  // update and change data in registered catch
// using patch after reading this article: https://blog.risingstack.com/10-best-practices-for-writing-node-js-rest-apis/

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) { //verify token

            if (err) {
                return res.status(403).send({
                    status: '403: Forbidden',
                    message: 'Token not valid!'
                });
            } else {

                FishData.findById(req.params.id, (err, catchData) => {  //find data by id

                    Users.findOne({username: decoded.username}, (err, user) => {    //Only the user that registered
                                                                                    // the data can change it.

                        if (user.username !== catchData.username)
                            return res.status(403).send({
                                status: '403: Forbidden',
                                message: 'You are not allowed to update data that belongs to other users!'
                            });

                        else {

                            if (err)
                                return res.status(500).send({
                                    status: '500: Internal Server Error',
                                    message: 'Something went wrong! Please try again later!'
                                });

                            catchData.longitude = req.body.longitude;
                            catchData.latitude = req.body.latitude;
                            catchData.species = req.body.species;
                            catchData.weight = req.body.weight;
                            catchData.length = req.body.length;
                            catchData.imageurl = req.body.imageurl;
                            catchData.method = req.body.method;
                            catchData.description = req.body.description;

                            catchData.save().then((err) => {

                                if (err)
                                    return res.status(500).send({
                                        status: '500: Internal Server Error',
                                        message: 'Something went wrong! Please try again later!'
                                    });
                            });
                        }
                    });
                });
            }

            res.setHeader("Cache-control", "no-cache");

            return res.status(202).send({
                status: '202: Accepted',
                message: 'Data updated',
                _links: {
                    self: [
                        {
                            href: "http://localhost:3000/api/v1/catches/"+req.params.id,
                            type: "application/json",
                            rel: "self",
                            verb: "PUT",
                            title: "Update data"
                        }
                    ],
                    from:[
                        {
                            href: "http://localhost:3000/api/v1/catches",
                            type: "application/json",
                            rel: "previous",
                            verb: "GET",
                            title: "A collection of catches"
                        }]
                }
            });
        });
    } else {

        return res.status(403).send({
            status: '403: Forbidden',
            message: 'Token not provided'
        });
    }
});

router.delete('/:id',(req, res) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) { //verify token
            if (err) {

                return res.status(403).send({
                    status: '403: Forbidden',
                    message: 'Token not valid'
                });
            } else {

                FishData.findOneAndRemove(req.params.id, (err, catchData) => { //find and remove data on id

                    Users.findOne({username: decoded.username}, (err, user) => { //verify user

                        if (user.username !== catchData.username)
                            return res.status(403).send({
                                status: '403: Forbidden',
                                message: 'You are not allowed to delete data that belongs to other users!'
                            });

                        if (err)
                            return res.status(500).send({
                                status: '500: Internal Server Error',
                                message: 'Something went wrong! Please try again later!'
                            });

                        res.setHeader("Cache-control", "no-cache");
                        return res.status(202).send({
                            status: '202: Accepted',
                            message: 'Fish data deleted!',
                            _links: {
                                self: [
                                    {
                                        href: "http://localhost:3000/api/v1/catches/" + req.params.id,
                                        type: "application/json",
                                        rel: "self",
                                        verb: "DELETE",
                                        title: "Delete data"
                                    }
                                ],
                                from: [
                                    {
                                        href: "http://localhost:3000/api/v1/catches",
                                        type: "application/json",
                                        rel: "previous",
                                        verb: "GET",
                                        title: "A collection of catches"
                                    }]
                            }
                        });
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
