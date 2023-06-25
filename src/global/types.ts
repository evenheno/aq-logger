import { ENodeColors, EWebColors } from "./enums";

export type TPlatform = 'Browser' | 'NodeJS';
export type TNodeColor = keyof typeof ENodeColors;
export type TWebColor = keyof typeof EWebColors;
export type TColor = TNodeColor & TWebColor;
export type TLogLevel = 'prod' | 'dev' | 'verbose';

export interface colorsDictionary {
    [key: string]: Array<TColor>;
}

