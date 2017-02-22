'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();

router.get('/', (req, res) => {  //first route to go to information about the api

    res.setHeader("Cache-control", "public");
    res.status(200).send(
        {
            status: "200: OK",
            message: "Welcome to 'Den svartmunnade smörbultens banne' API.",
            _links: {
                self: [
                    {
                        href: "http://localhost:3000/api/v1",
                        type: "application/json",
                        rel: "self",
                        verb: "GET",
                        title: "This is the API root!"
                    }
                ],
                to:
                    [
                        {
                            href: "http://localhost:3000/api/v1/catches",
                            type: "application/json",
                            rel: "next",
                            verb: "GET",
                            title: "Collection of catches",
                            description: "It is possible to search for different parameters with query strings " +
                            "example localhost:3000/api/v1/catches?username=Daniel"
                        },
                        {
                            href: "http://localhost:3000/api/v1/catches",
                            type: "application/json",
                            rel: "self",
                            verb: "POST",
                            title: "Creating new data",
                            description: "Parameters: longitude, latitude, " +
                            "species, weight, length, imageurl, method, description"
                        },
                        {
                            href: "http://localhost:3000/api/v1/register",
                            type: "application/json",
                            rel: "next",
                            verb: "POST",
                            title: "Register a user",
                            description: "Parameters: username, password, email. All are required"
                        },
                        {
                            href: "http://localhost:3000/api/v1/add/webhook",
                            type: "application/json",
                            rel: "next",
                            verb: "GET",
                            title: "Webbhook information",
                        }
                    ],
            }
        });
});

module.exports = router;