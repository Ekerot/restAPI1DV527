'use strict';

/**
 * Created by ekerot on 2017-02-19.
 */

const router = require('express').Router();
const Users = require('../models/Users.js');

let WebHooks = require('node-webhooks')

let webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
});

router.get('/', (req, res) => {

    res.status(200).send({
        Status: '200: OK',
        message: 'By now there is only one webhook to choose from. ' +
        'That webhook sends you information when a new catch is registred. Webhookname: createcatchdata',
        _links: {
            self: [
                {
                    href: "http://localhost:3000/api/v1/webhook",
                    type: "application/json",
                    rel: "self",
                    verb: "GET",
                    title: "Webbhook information"
                }
            ],
            to:
                [
                    {
                        href: "http://localhost:3000/api/v1/webhook/add/Webhookname",
                        type: "application/json",
                        rel: "next",
                        verb: "POST",
                        title: "Add webhook",
                        description: 'Use url as parameter to register your ' +
                        'url to the webhook of your choice'
                    },
                    {
                        href: "http://localhost:3000/api/v1/webhook/delete/Wehookname",
                        type: "application/json",
                        rel: "next",
                        verb: "DELETE",
                        title: "Delete webhook",
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
        }})
});

router.post('/add/createcatchdata', (req, res) => { // add new url to webbhooksDB
    webHooks.add('createcatchdata', req.body.url)
        .then(() => {
            res.status(201).send({
                status: '201: Created',
                message: 'Your webhook are successfully registered!',
                _links: {
                    self: {
                        href: "http://localhost:3000/api/v1/webhook/add/createcatchdata",
                        type: "application/json",
                        rel: "self",
                        verb: "POST",
                        title: "Add webhook"
                    },
                    from: {
                        href: "http://localhost:3000/api/v1/add/webhook",
                        type: "application/json",
                        rel: "next",
                        verb: "GET",
                        title: "Webbhook information",
                    }
                }
            });
        })
        .catch((err) => {
            res.send({Message: `Error ${err}`});
        });
});


router.delete('/delete/createcatchdata', (req) => { // delete url from webhooksDB
    webHooks.remove('createcatchdata', req.body.url).then (() =>{
        res.status(201).send({
            status: '201: Accepted',
            message: 'Your webhook are successfully deleted!',
            _links: {
                self: {
                    href: "http://localhost:3000/api/v1/webhook/add/createcatchdata",
                    type: "application/json",
                    rel: "self",
                    verb: "DELETE",
                    title: "Delete webhook"
                }
                ,
                from: {
                    href: "http://localhost:3000/api/v1/add/webhook",
                    type: "application/json",
                    rel: "next",
                    verb: "GET",
                    title: "Webbhook information",
                }
            }
        });
    })
        .catch((err) => {
        res.send({Message: `Error ${err}`});
    });
});

module.exports = router;