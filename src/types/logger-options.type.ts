import { AQGlobalLogger } from "../class/global-logger.js"
import { TColor, TColorsMap } from "./colors.type.js"
import { TDefEnv, TDefLogLevel, TDefModule } from "./defaults.type.js"
import { TPrintOptions } from "./print-options.type.js"
import { TAQLoggerRulesSet } from "./rules-set.type.js"

export type TAQLoggerOptions<
    TEnv extends string = TDefEnv,
    TLogLevel extends string = TDefLogLevel,
    TModule extends string = TDefModule> = {
        env?: TEnv,
        rules?: TAQLoggerRulesSet<TEnv, TLogLevel, TModule>,
        print?: TPrintOptions,
        moduleColors?: TColorsMap<TModule>
        logLevelColors?: {[key in (TLogLevel | TDefLogLevel)]?: {
            symbol?: string,
            header?: TColor[],
            text?: TColor[]
        }},
        globalLogger?: AQGlobalLogger<TEnv,TModule, TLogLevel>
    }