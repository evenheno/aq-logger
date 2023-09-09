import {
    TAQGlobalLoggerOptions,
    TAQLoggerOptions,
    TAQLoggerDefaultEnv,
    TAQLoggerDefaultLogLevel,
    TAQLoggerDefaultModule
} from "../global/types";
import { AQLogger } from "./aq-logger";

class AQGlobalLogger<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> {

    private _loggerOptions?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>;

    public constructor(options?: TAQGlobalLoggerOptions<TCEnv, TCLogLevel, TCModule>) {
        this._loggerOptions = {
            environment: options?.environment,
            printTimestamp: options?.printTimestamp,
            printLogLevel: options?.printLogLevel,
            printModuleName: options?.printModuleName,
            rules: options?.rules
        }
    }
    public create(module: TCModule | TAQLoggerDefaultModule) {
        return new AQLogger(module, this._loggerOptions);
    }
}

const aqGlobalLogger = new AQGlobalLogger();

export { AQGlobalLogger, aqGlobalLogger }