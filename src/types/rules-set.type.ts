import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TAQLoggerDefaultModule } from "./defaults.type.js";
import { TLogLevelMap } from "./log-level-map.type.js";
import { TModulesMap } from "./modules-map.type.js";
import { TPrintOptions } from "./print-options.type.js";

export type TAQLoggerRulesSet<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        [key in TAQLoggerDefaultEnv | TCEnv]?: {
            logLevel?: TLogLevelMap<TCLogLevel | TAQLoggerDefaultLogLevel>;
            print?: TPrintOptions;
            modules?: TModulesMap<TCModule, TCLogLevel>;
        };
    };