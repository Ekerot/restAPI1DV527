'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();
const FishData = require('../models/Fishdata.js');

router.get('/', (req, res) => {
    res.json({message: 'Welcome to mr Ekerots API'});
});

router.route('/catches')
    .post(function(req, res) {

        let fishData = new FishData({
            user: req.body.user,
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

        fishData.save().then(function(err) {
            if (err)
                res.send(err);

            res.json({message: 'Fish data created!'});

        });

    }).get(function(req, res) {
    FishData.find(function(err, fish) {
        if (err)
            res.send(err);

        let context = {
            catches: fish.map(function(fish)
            {
                return {
                    id: fish._id,
                    user: fish.user,
                    longitude: fish.longitude,
                    latitude: fish.latitude,
                    species: fish.species,
                    weight: fish.weight,
                    length: fish.length,
                    imageurl: fish.imageurl,
                    timestamp: fish.timestamp,
                    method: fish.method,
                    description: fish.description
                }
            })
        };

        res.json(context);
    });
});

router.route('/catches/:id')
    .get((req, res) => {

    //Search for data by ID
    FishData.findById(req.params.id, function(err, catchData){

        res.json(catchData); //send data
    });

}).put((req, res) => {

    FishData.findById(req.params.id, function(err, catchData){

        if(err)
            res.send(err);

        catchData.user = req.body.user;
        catchData.longitude = req.body.longitude;
        catchData.latitude = req.body.latitude;
        catchData.species = req.body.species;
        catchData.weight = req.body.weight;
        catchData.length = req.body.length;
        catchData.imageurl = req.body.imageurl;
        catchData.timestamp = req.body.timestamp;
        catchData.method = req.body.method;
        catchData.description = req.body.description;

        catchData.save().then(function(err) {

            if (err)
                res.send(err);

            res.json({message: 'Fish data updated!'});
        });
    });

}).delete((req, res) => {

    FishData.findOneAndRemove(req.params.id, function(err){

        if(err)
            res.send(err);

        res.json({message: 'Fish data deleted!'});
    });
});

module.exports = router;