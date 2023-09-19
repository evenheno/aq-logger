import { AQGlobalLogger } from "./class/global-logger";
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel } from "./types/types.js";

type TModules = 'server' | 'ui';

const globalLogger = new AQGlobalLogger<TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TModules>({
    environment: 'production',
    rules: {
        production: {
            print: { data: false },
            modules: {
                server: { allow: true, logLevel: { debug: false} },
                ui: { allow: true }
            }
        }
    }
});

const serverLogger = globalLogger.create('server');
const uiLogger = globalLogger.create('ui');
serverLogger.debug('Hello from Server', { ts: Date.now() });
uiLogger.debug('Hello from UI', { ts: Date.now() });