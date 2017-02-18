'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FishSchema = new Schema({
    username: {type: String, required: true, maxlength: 15},
    position: {
        longitude: {type: Number, maxlength: 30},
        latitude: {type: Number, maxlength: 30},
    },
    fish: {
        species: {type: String,  maxlength: 30},
        weight: {type: String,  maxlength: 15},
        length: {type: String,  maxlength: 15},
    },
    imageurl: {type: String,  maxlength: 100},
    timestamp: {
        type: Date,
        default: Date.now
    },
    method: {type: String,  maxlength: 40},
    description: {type: String, maxlength: 300}
});

module.exports = mongoose.model('FishData', FishSchema);