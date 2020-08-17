const {createApp} = require('./app');
const log4js = require('log4js');
const { scheduleExit } = require('./utils');

const logger = log4js.getLogger('app');

const runApp = (port) => {
    const app = createApp();

    const server = app.listen(port, err => {
        const address = server.address();
        const url = typeof address === 'string' ? address : `${address.address}:${address.port}`
        logger.info(`Server listening on ${url}`);
    });

    return { app, server };
}

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        scheduleExit(signal, 0, 300);
    })
})

module.exports = {
    log4js,
    runApp,
};
