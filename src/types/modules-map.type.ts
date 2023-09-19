import { TAQLoggerDefaultModule } from "./defaults.type.js";
import { TLogOptions } from "./module-options.type.js";

export type TModulesMap<TCModule extends string, TCLogLevel extends string> = {
    [key in TAQLoggerDefaultModule | TCModule]?: TLogOptions<TCLogLevel>;
};