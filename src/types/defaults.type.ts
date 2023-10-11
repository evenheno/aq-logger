export type TDefModule =
    | 'system';

export type TDefEnv =
    | 'development'
    | 'test'
    | 'staging'
    | 'production';

export type TDefLogLevel =
    | 'debug'
    | 'info'
    | 'warn'
    | 'error'
    | 'critical'
    | 'alert'
    | 'emergency';


export type TStr<T extends string> = T;