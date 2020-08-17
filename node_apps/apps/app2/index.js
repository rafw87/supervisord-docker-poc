const { resolve: pathResolve } = require('path');
const { log4js, runApp } = require('common');

log4js.configure(pathResolve(__dirname, 'log4js.json'));

runApp(8081);

