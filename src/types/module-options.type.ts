
import { TDefLogLevel } from "./defaults.type.js";
import { TLogLevelMap } from "./log-level-map.type.js";
import { TPrintOptions } from "./print-options.type.js";

export type TLogOptions<TCLogLevel extends string> = {
    allow?: boolean;
    logLevel?: TLogLevelMap<TCLogLevel>;
    print?: TPrintOptions;
};