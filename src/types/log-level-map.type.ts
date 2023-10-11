export type TLogLevelMap<TLogLevel extends string> = {
    [key in TLogLevel]?: boolean;
};