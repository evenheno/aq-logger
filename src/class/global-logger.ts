import {
    TAQLoggerOptions,
    TAQLoggerDefaultEnv,
    TAQLoggerDefaultLogLevel,
    TAQLoggerDefaultModule
} from "../types/types.js";
import { AQLogger } from "./logger.js";

class AQGlobalLogger<
    TCEnv extends string = string,
    TCLogLevel extends string = string,
    TCModule extends string = string> {

    private _options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>;
    public get options() { return this._options }

    public constructor(options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>) {
        this._options = options;
    }
    public create(module: TCModule | TAQLoggerDefaultModule, subModule?: string) {
        return new AQLogger(module, { ...this._options, subModule: subModule });
    }
}

const aqGlobalLogger = new AQGlobalLogger();

export { AQGlobalLogger, aqGlobalLogger }