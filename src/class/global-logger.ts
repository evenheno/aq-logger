import { TAQLoggerOptions, TDefEnv, TDefLogLevel, TDefModule, } from "../types/types.js";
import { AQLogger } from "./logger.js";

/*export type TDic<T extends string> = { [key in T]?: string }
export class NewLogger<TModule extends string>{
    private _modules: TDic<TModule>;
    public modules: { [key in TModule]?: string } = {
    
    }
    constructor(modules: TDic<TModule>) {
        this._modules = modules;
    }
}*/

class AQGlobalLogger<
    TEnv extends string = TDefEnv,
    TModule extends string = TDefModule,
    TLogLevel extends string = TDefLogLevel> {
    private _options?: TAQLoggerOptions<TEnv, TLogLevel, TModule>;
    public get options() { return this._options }
    public constructor(options?: TAQLoggerOptions<TEnv, TLogLevel, TModule>) {
        if (!options) { options = {} }
        if (!options.logLevelColors) {
            options.logLevelColors = {
                alert: { header: ['fgYellow'], text: ['fgYellow'] },
                critical: { header: ['fgYellow'], text: ['fgYellow']},
                debug: { header: ['fgMagenta'], text: ['fgMagenta'] },
                emergency: { header: ['fgRed'], text: ['fgRed'] },
                error: { header: ['fgRed'], text: ['fgRed']},
                info: { header: ['fgCyan'], text: ['fgCyan'] },
                warn: { header: ['fgYellow'], text: ['fgYellow'] }
            }
        }
        this._options = options;
    }
    public create(module: TModule) {
        return new AQLogger<TEnv, TLogLevel, TModule>(module, this._options);
    }
}

const aqGlobalLogger = new AQGlobalLogger();

export { AQGlobalLogger, aqGlobalLogger }