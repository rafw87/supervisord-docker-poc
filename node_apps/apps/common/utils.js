const log4js = require('log4js');

const logger = log4js.getLogger('app');

const exit = (reason, exitCode) => {
    logger.info(`Exiting with code ${exitCode}. Reason: ${reason}`);
    process.exit(exitCode);
};

const scheduleExit = (reason, exitCode, delay) => {
    logger.info(`Scheduled exit in ${delay}ms with code ${exitCode}. Reason: ${reason}`);
    setTimeout(() => exit(reason, exitCode), delay);
};

module.exports = {
    exit, scheduleExit
}
