const express = require('express');
const helmet = require('helmet');
const accountAPI = require('./api');
const config = require('./config')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use('/api', accountAPI);

const port = config.uS_port || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
