import { ENodeColors, EWebColors } from "./enums";

export type TPlatform = 'Browser' | 'NodeJS';
export type TNodeColor = keyof typeof ENodeColors;
export type TWebColor = keyof typeof EWebColors;
export type TColor = TNodeColor & TWebColor;

export interface colorsDictionary {
    [key: string]: Array<TColor>;
}

export type TLogLevel =
    'prod' | 'dev' | 'verbose' |
    'debug' | 'db' | 'apiLogic' |
    'bLogic' | 'daLogic'
;
