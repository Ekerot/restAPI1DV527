'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();
let FishData = require('../models/fishdata.js');

router.get('/', (req, res) => {
    res.json({message: 'Welcome to mr Ekerots API'});
});

router.route('/catches')
    .post(function(req, res) {

        let fishData = new FishData({
            user: req.body.user,
            fish: {
                species: req.body.species,
                weight: req.body.weight,
                length: req.body.length
            },
            method: req.body.method
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
                user: fish.user,
                method: fish.method
            }
        })
    };

        res.json(context);
    });
});

module.exports = router;