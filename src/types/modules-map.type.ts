import { TDefLogLevel, TDefModule } from "./defaults.type.js";
import { TLogOptions } from "./module-options.type.js";

export type TModulesMap<
    TModule extends string,
    TLogLevel extends string> = {
        [key in TModule | TDefModule as string]?: TLogOptions<TLogLevel | TDefLogLevel>;
    };