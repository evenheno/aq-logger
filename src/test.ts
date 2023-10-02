import { AQGlobalLogger } from "./class/global-logger";

const globalLogger = new AQGlobalLogger({
    environment: 'development',
    logLevelColors: {
        info: ['bgBlue','fgWhite'],
        warn: ['bgYellow','fgRed']
    },
    moduleColors: {
        Database: ['bgRed', 'fgWhite']
    },
    rules: {
        development: {
            modules: {
                Controller: {},
                Database: {}
            }
        }
    }
});

const loggerCtl = globalLogger.create('Controller', 'UserController');
const loggerDb = globalLogger.create('Database', 'UserController');

loggerCtl.warn('warm from controller logger');
loggerDb.info('Hello from database logger');