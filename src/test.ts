import { AQGlobalLogger } from "./class/global-logger";

const globalLogger = new AQGlobalLogger({
    rules: {
        development: {
            modules: {
                
            }
        }
    }
});

globalLogger.onLog = (text)=> {
    console.log(text);
}
const loggerCtl = globalLogger.create('system');

loggerCtl.debug('Debug message');
loggerCtl.warn('Warning message')
loggerCtl.error('Error message');
loggerCtl.info('Info message');
loggerCtl.success('Success message');