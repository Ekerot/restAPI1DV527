'use strict';

/**
 * Created by ekerot on 2017-02-09.
 */

const       express = require('express');
const       bodyParser = require('body-parser');

const       app = express();
const       port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//------------------routes--------------------------//

let         router =  express.Router();

router.get('/', (req, res) => {
    res.json({message: 'Welcome to mr Ekerots API'});
});

app.use('/api', router);

app.listen(port, () => console.log(new Date() + ` Express app listening on port ${port}!`
    + '\nIf you want to terminate press ctrl+c'));