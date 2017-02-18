'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();
const FishData = require('../models/Fishdata.js');
const Users = require('../models/Users.js');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {

    FishData.find((err, fish) => {
        if (err)
            res.send(err);

        let context = {
            status: '200: OK',
            catches: fish.map((fish) =>
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
                                    verb: "PUT",
                                    title: "Update data"
                                },
                                {
                                    href: "http://localhost:3000/api/v1/catches/"+fish._id,
                                    type: "application/json",
                                    rel: "next",
                                    verb: "DELETE",
                                    title: "Delete data"
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
        return res.status(200).send(context);
    });
});

router.post('/',(req, res) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    status: '401: Unauthorized',
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

                fishData.save().then((err) => {
                    if (err)
                        return res.send(err);

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
            }
        });
    } else {

        return res.status(401).send({
            status: '401: Unautharized',
            message: 'Token not provided'
        });
    }
});

router.get('/:id', (req, res) => {

    //Search for data by ID
    FishData.findById(req.params.id, (err, catchData) => {

        catchData: status: '200: OK',
            fish.map((fish) =>
            {

                return {
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
                    description: fish.description,

                    _links: {
                        self: [{
                            href: "http://localhost:3000/api/v1/catches/"+fish._id,
                            type: "application/json",
                            rel: "self",
                            verb: "GET",
                            title: "Single data of a catch"
                        }],
                        from:[
                            {
                                href: "http://localhost:3000/api/v1/catches",
                                type: "application/json",
                                rel: "previous",
                                verb: "GET",
                                title: "A collection of catches"
                            }]
                    }
                }
            });

        return res.status(200).send(catchData); //send data
    });
})

router.put('/:id',(req, res) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) {

            if (err) {
                return res.status(401).send({
                    status: '401: Unauthorized',
                    message: 'Token not valid!'
                });
            } else {

                FishData.findById(req.params.id, (err, catchData) => {

                    Users.findOne({username: decoded.username}, (err, user) => {

                        if (user.username !== catchData.username)
                            return res.status(401).send({
                                status: '403: Forbidden',
                                message: 'You are not allowed to update data that belongs to other users!'
                            });

                        else {

                            if (err)
                                return res.send(err);

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
                                    return res.send(err);

                                return res.status(202).send({
                                    status: '202: Accepted',
                                    message: 'Data updated',
                                    _links: {
                                        self: [{
                                            href: "http://localhost:3000/api/v1/catches/"+req.params.id,
                                            type: "application/json",
                                            rel: "self",
                                            verb: "PUT",
                                            title: "Update data"
                                        }],
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
                        }
                    });
                });
            }
        });
    } else {

        return res.status(401).send({
            status: '401: Unauthorized',
            message: 'Token not provided'
        });
    }
});

router.delete('/:id',(req, res) => {

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, process.env.TOKEN, function (err, decoded) {
            if (err) {

                return res.status(401).send({
                    status: '401: Unauthorized',
                    message: 'Token not valid'
                });
            } else {

                FishData.findOneAndRemove(req.params.id, (err, catchData) => {

                    Users.findOne({username: decoded.username}, (err, user) => {

                        if (user.username !== catchData.username)
                            return res.status(403).send({
                                status: '403: Forbidden',
                                message: 'You are not allowed to delete data that belongs to other users!'
                            });

                        if (err)
                            res.send(err);

                        return res.status(202).send({
                            status: '202: Accepted',
                            message: 'Fish data deleted!',
                            _links: {
                                self: [{
                                    href: "http://localhost:3000/api/v1/catches/" + req.params.id,
                                    type: "application/json",
                                    rel: "self",
                                    verb: "DELETE",
                                    title: "Delete data"
                                }],
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

        return res.status(401).send({
            status: '401: Unauthorized',
            message: 'Token not provided'
        });
    }

});

module.exports = router;
