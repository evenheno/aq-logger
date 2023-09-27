import { AQGlobalLogger } from "./class/global-logger";

const globalLogger = new AQGlobalLogger({
    environment: 'development',
    rules: {
        development: {
            modules: {
                DB: {
                    print: {timestamp: true}
                },
                Controller: {
                    
                }
            }
        }
    }
});

const logger = globalLogger.create(
        'Controller',
        'UserController');
        
const logger2 = globalLogger.create(
        'Controller',
        'UserController');
        
        
logger.success('AQLogger1 is OK');
logger.success('Lo')
