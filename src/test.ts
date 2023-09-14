import { AQGlobalLogger } from "./class/aq-global-logger";
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel } from "./global/types";

type TModules = 'server' | 'ui';

const globalLogger = new AQGlobalLogger<TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TModules>({
    environment: 'production',
    rules: {
        development: {
            print: '*',
            logLevel: '*', modules: {
                server: { logLevel: '*' }
            }
        },
        production: {
            print: '*',
            logLevel: '*', modules: {
                server: { logLevel: '*' }
            }
        }
    }
});

const logger = globalLogger.create('server');

logger.info('Hello from server', { ts: Date.now() });
