export type TLogLevelMap<TCLogLevel extends string> = {
    [key in TCLogLevel]?: boolean;
};