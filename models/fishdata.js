'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */


const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let FishSchema = new Schema({
    user: String,
    position: {
        longitude: Number,
        latitude: Number,
    },
    fish: {
        species: String,
        weight: Number,
        length: Number,
    },
    imageurl: String,
    Timestamp: Date,
    method: String,
    description: String
});

module.exports = mongoose.model('FishData', FishSchema);