'use strict';

/**
 * Function to connect, disconnect
 */

let mongoose = require('mongoose');

module.exports =  function() {
    mongoose.Promise = global.Promise;
    let db = mongoose.connect('mongodb://localhost/mongoDB');

    db.connection.on('connected', function() {
        console.log('Mongoose connection is open!');
    });

    db.connection.on('error', function(err) {
        console.error('Connection ERROR: ', err);
    });

    //if error show error message
    db.connection.on('disconnected', function() {
        console.log('Mongoose is disconnected!');
    });

    //if connection goes down db turns off
    process.on('SIGINT', function() {
        db.connection.close(function() {
            console.log('App termination, closing down mongoose!');
            process.exit(0);
        });
    });

    return db;
};