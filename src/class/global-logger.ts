import {
    TAQLoggerOptions,
    TAQLoggerDefaultEnv,
    TAQLoggerDefaultLogLevel,
    TAQLoggerDefaultModule
} from "../types/types.js";
import { AQLogger } from "./logger.js";

class AQGlobalLogger<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> {

    private _options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>;
    public get options() { return this._options }

    public constructor(options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>) {
        this._options = options;
    }
    public create(module: TCModule | TAQLoggerDefaultModule) {
        return new AQLogger(module, this._options);
    }
}

const aqGlobalLogger = new AQGlobalLogger();

export { AQGlobalLogger, aqGlobalLogger }