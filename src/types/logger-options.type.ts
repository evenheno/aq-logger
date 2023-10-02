import { TColorsMap } from "./colors.type.js"
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TAQLoggerDefaultModule } from "./defaults.type.js"
import { TPrintOptions } from "./print-options.type.js"
import { TAQLoggerRulesSet } from "./rules-set.type.js"

export type TAQLoggerOptions<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        environment?: TCEnv | TAQLoggerDefaultEnv,
        rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>,
        print?: TPrintOptions,
        subModule?: string,
        moduleColors?: TColorsMap<TCModule | TAQLoggerDefaultModule>
        logLevelColors?: TColorsMap<TCLogLevel | TAQLoggerDefaultLogLevel>
    }