import { AQGlobalLogger } from "./class/global-logger";
const globalLogger = new AQGlobalLogger({
    environment: 'development',
    rules: {
        development: {
            modules: {
                DB: {
                    print: {timestamp: true}
                }
            }
        }
    }
});

const logger = globalLogger.create('DB', 'Test.ts');
logger.success('AQLogger is OK');