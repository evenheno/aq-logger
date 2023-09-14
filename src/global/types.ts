import { ENodeColors, EWebColors } from "./enums";

export type TPlatform = 'Browser' | 'NodeJS';
export type TNodeColor = keyof typeof ENodeColors;
export type TWebColor = keyof typeof EWebColors;
export type TColor = TNodeColor & TWebColor;

export interface colorsDictionary {
    [key: string]: Array<TColor>;
}

export type TLogLevelMap<TCLogLevel extends string> = {
    [key in TCLogLevel]?: boolean;
};

export type TModuleOptions<TCLogLevel extends string> = {
    allow?: boolean;
    logLevel?: TLogLevelMap<TCLogLevel | TAQLoggerDefaultLogLevel>;
    print?: TPrintOptions;
};

export type TModulesMap<TCModule extends string, TCLogLevel extends string> = {
    [key in TAQLoggerDefaultModule | TCModule]?: TModuleOptions<TCLogLevel>;
};


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

export type TPrintOptions = {
    timestamp?: boolean,
    moduleName?: boolean,
    logLevel?: boolean,
    data?: boolean
}

export type TAQLoggerOptions<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        environment?: TCEnv | TAQLoggerDefaultEnv,
        rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>,
        print?: TPrintOptions
    }

export type TAQLoggerDefaultModule =
    | 'system';

export type TAQLoggerDefaultEnv =
    | 'development'
    | 'test'
    | 'staging'
    | 'production';

export type TAQLoggerDefaultLogLevel =
    | 'debug'
    | 'info'
    | 'warn'
    | 'error'
    | 'critical'
    | 'alert'
    | 'emergency';