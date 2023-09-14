import { AQGlobalLogger } from "./class/aq-global-logger";
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel } from "./global/types";

type TModules = 'server' | 'ui';

const globalLogger = new AQGlobalLogger<TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TModules>({
    environment: 'production',
    rules: {
        production: {
            print: { data: false },
            modules: {
                server: {allow: false}
            }
        }
    }
});

const logger = globalLogger.create('server');
logger.info('Hello from server', { ts: Date.now() });