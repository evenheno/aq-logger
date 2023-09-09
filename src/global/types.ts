import { ENodeColors, EWebColors } from "./enums";

export type TPlatform = 'Browser' | 'NodeJS';
export type TNodeColor = keyof typeof ENodeColors;
export type TWebColor = keyof typeof EWebColors;
export type TColor = TNodeColor & TWebColor;

export interface colorsDictionary {
    [key: string]: Array<TColor>;
}

export type TAQLoggerRulesSet<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        [key in TAQLoggerDefaultEnv | TCEnv]?: '*' | {
            logLevel?: '*' | Array<TAQLoggerDefaultLogLevel | TCLogLevel>;
            modules?: '*' | {
                [key in TAQLoggerDefaultModule | TCModule ] ?: boolean | {
                    enabled?: boolean,
                    logData?: boolean,
                    logLevel?: '*' | Array<TAQLoggerDefaultLogLevel | TCLogLevel>,
                    excludeLogLevel?: '*' | Array<TAQLoggerDefaultLogLevel | TCLogLevel>
                }
            };
        };
    };

export type TAQGlobalLoggerOptions<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        environment?: TCEnv | TAQLoggerDefaultEnv,
        rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>,
        printTimestamp?: boolean,
        printModuleName?: boolean,
        printLogLevel?: boolean,
    }

export type TAQLoggerOptions<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule> = {
        environment?: TCEnv | TAQLoggerDefaultEnv,
        printTimestamp?: boolean,
        printModuleName?: boolean,
        printLogLevel?: boolean,
        rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>
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