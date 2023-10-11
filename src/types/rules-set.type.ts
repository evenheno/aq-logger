import { TDefEnv, TDefLogLevel, TDefModule } from "./defaults.type.js";
import { TLogLevelMap } from "./log-level-map.type.js";
import { TModulesMap } from "./modules-map.type.js";
import { TPrintOptions } from "./print-options.type.js";

export type TAQLoggerRulesSet<
    TEnv extends string,
    TLogLevel extends string,
    TModule extends string> = {
        [key in TEnv]?: {
            logLevel?: TLogLevelMap<TLogLevel | TDefLogLevel>;
            print?: TPrintOptions;
            modules?: TModulesMap<TModule | TDefModule, TLogLevel | TDefLogLevel>;
        };
    };