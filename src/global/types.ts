import { ENodeColors, EWebColors } from "./enums";

export type TPlatform = 'Browser' | 'NodeJS';
export type TNodeColor = keyof typeof ENodeColors;
export type TWebColor = keyof typeof EWebColors;
export type TColor = TNodeColor & TWebColor;

export interface colorsDictionary {
    [key: string]: Array<TColor>;
}

export type TDefaultLogLevel = 'all';
export type TLogLevel<T> = TDefaultLogLevel | T;
export type TLogLevelArr<T> = Array<TLogLevel<T>>
export type TLogLevelParam<T> = TLogLevel<T> | TLogLevelArr<T>;