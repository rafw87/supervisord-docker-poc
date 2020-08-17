const express = require('express');
const { json, text } = require('body-parser');
const log4js = require('log4js');
const { scheduleExit } = require('./utils');

const logger = log4js.getLogger('app');

const createApp = () => {
    const app = express();
    app.get('/ping', (req, res) => {
        res.status(200).send('OK');
    });

    app.post('/stop', json(), (req, res) => {
        const { exitCode = 0, delay = 10 } = req.body;
        scheduleExit('HTTP request', exitCode, delay);
        res.status(200).send('OK');
    });

    const router = express.Router();
    ['error', 'warn', 'info', 'debug', 'trace'].forEach(level => {
        router.post(`/${level}`, text(), (req, res) => {
            logger[level](req.body);
            res.status(200).send('OK');
        })
    })

    app.use('/log', router);

    return app;
}

module.exports = {
    createApp
}
