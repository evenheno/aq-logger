import { TColor, TPlatform, colorsDictionary } from "./types";

export const moduleColors: Array<Array<TColor>> = [
    ['bgCyan', 'fgBlack', 'bright'],
    ['bgMagenta', 'fgBlack', 'bright'],
    ['bgRed', 'fgWhite', 'bright'],
    ['bgGreen', 'fgBlack', 'bright'],
    ['bgYellow', 'fgBlack', 'bright'],
    ['bgBlue', 'fgWhite', 'bright'],
    ['bgWhite', 'fgBlack', 'bright']
];

export const platform: TPlatform =
    typeof window === 'undefined' ? 'NodeJS' : 'Browser';

export const activeModules: colorsDictionary = {
    
};