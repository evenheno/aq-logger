import { AQGlobalLogger } from "./class/aq-global-logger";
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel } from "./global/types";

type TEnv = 'devVerbose'
type TModules = 'Main' | 'UI';

const globalLogger = new AQGlobalLogger<TEnv, TAQLoggerDefaultLogLevel, TModules>({
    environment: 'devVerbose',
    printTimestamp: true,
    printLogLevel: true,
    printModuleName: true,
    rules: {
        development: { logLevel: '*', modules: '*' },
        devVerbose: { logLevel: '*', modules: '*' },
        production: { logLevel: ['error'], modules: '*' }
    }
});

const uiLogger = globalLogger.create('UI')
const mainLogger = globalLogger.create('Main');

uiLogger.debug('Hello from UI');
mainLogger.debug('Hello from Main');

uiLogger.error('Error from UI');
mainLogger.error('Error from Main');
