'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */

const       express = require('express');
const       bodyParser = require('body-parser');

const       app = express();
const       port = process.env.PORT || 3000;

const       mongoose = require('./config/mongoose');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose();

//------------------routes--------------------------//


app.use('/api', require('./routes/main.js'));

app.listen(port, () => console.log(new Date() + ` Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));