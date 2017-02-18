'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */
const router = require('express').Router();

router.get('/', (req, res) => {
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
                            title: "Collection of catches"
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
                            href: "http://localhost:3000/api/v1/login",
                            type: "application/json",
                            rel: "next",
                            verb: "POST",
                            title: "Login user",
                            description: "Parameters: username, password. All are required"
                        },
                        {
                            href: "http://localhost:3000/api/v1/users",
                            type: "application/json",
                            rel: "next",
                            verb: "GET",
                            title: "Show users",
                            description: "Admin role required to grant access"
                        }
                    ],
            }
        });
});

module.exports = router;