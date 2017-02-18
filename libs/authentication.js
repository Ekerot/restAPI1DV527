/**
 * Created by ekerot on 2017-02-17.
 */

const router = require('express').Router();
const jwt = require('jsonwebtoken');

module.exports = () =>
    router.use((req, res, next) =>{

        let token = req.body.token || req.query.token || req.headers['x-access-token'];


        if (token) {

            jwt.verify(token, process.env.TOKEN, function(err, decoded) {
                if (err) {

                    return res.status(401).send({
                        status: 'Error',
                        message: 'Token not valid!'
                    });;
                } else {
                    next();
                }
            });

        } else {

            return res.status(401).send({
                status: 'Error',
                message: 'Token not provided'
            });
        }
    });