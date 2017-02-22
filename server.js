'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */

const       express = require('express');
const       bodyParser = require('body-parser');

const       app = express();
const       port = process.env.PORT || 3000;

const       mongoose = require('./config/mongoose');

app.use(bodyParser.urlencoded({ extended: false }));  //we only want json to be allowed
app.use(bodyParser.json());

mongoose();

//------------------routes--------------------------//

app.use('/api/v1', require('./routes/main.js'));
app.use('/api/v1', require('./routes/register'));
app.use('/api/v1', require('./routes/user'));
app.use('/api/v1/catches', require('./routes/catches'));
app.use('/api/v1/webhook', require('./routes/webhooks'));

app.use((req, res) => res.status(404).json({status: '404: No response'}));

app.listen(port, () => console.log(new Date() + ` Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));