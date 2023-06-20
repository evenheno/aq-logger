import { TNodeColor, ENodeColors, TColor, EWebColors, TWebColor } from './colors';

const moduleColorsArr: Array<TNodeColor> = [
    'bgCyan', 'bgMagenta', 'bgRed',
    'bgGreen', 'bgYellow', 'bgBlue',
    'bgWhite'];

interface colorsDictionary {
    [key: string]: string;
}

type TPlatform = 'Browser' | 'NodeJS';
const platform: TPlatform = typeof window === 'undefined' ? 'NodeJS' : 'Browser';

export class AQLogger {
    private _moduleName: string;
    private static _activeModules: colorsDictionary = {};

    constructor(moduleName: string) {
        this._moduleName = moduleName;
        if (!AQLogger._activeModules[moduleName]) {
            const index = Object.keys(AQLogger._activeModules).length % moduleColorsArr.length;
            AQLogger._activeModules[moduleName] = ENodeColors[moduleColorsArr[index]];
        }
    }

    public log(message: string, colors: TColor[], ...data:any[]) {
        let output: Array<string>;
        const timestamp = new Date().toLocaleString();

        if (platform === 'NodeJS') {
            const colorsString = colors.map(color=> `${ENodeColors[color]}`);
            output = [`[ ${timestamp} ] ${this._moduleName} ${colorsString}${message}${ENodeColors.reset}`];
        } else if (platform === 'Browser') {
            const colorsString = colors.map(color => `color:${EWebColors[color]};`).join('');
            output = [`[ ${timestamp} ] ${this._moduleName} %c${message}${ENodeColors.reset}`, colorsString];
        } else{
            output = [message];
        }

        console.log(...output);
        /*const timestamp = new Date().toLocaleString();
        const moduleColorPrint = AQLogger._activeModules[this._moduleName] || '';
        const logMessage = `[ ${timestamp} ] ${moduleColorPrint} ${this._moduleName.padEnd(15)} ${EColors.reset} ${message}`;
        console.log(logMessage, ...data);*/
    }

    public debug(message: string, ...data: any[]) {
        this.log(message, ['fgMagenta'], ...data);
    }

    public trace(message: string, ...data: any[]) {
        this.log(message, ['fgCyan'], ...data);
    }

    public action(message: string, ...data: any[]) {
        this.log(`${message}...`, ['fgYellow'], ...data);
    }

    public warn(message: string, ...data: any[]) {
        this.log(`WARNING: ${message}`, ['fgYellow'], ...data);
    }

    public event(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgCyan'], ...data);        
    }

    public info(message: string, ...data: any[]) {
        this.log(`INFO: ${message}`, ['fgCyan'], ...data);
    }

    public success(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgGreen'], ...data);
    }

    public results(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgMagenta'], ...data);
    }

    public request(message: string, ...data: any[]) {
        this.log(`Request: ${message}`, ['fgCyan'], ...data);
    }

    public error(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgRed'], ...data);
    }
}

export const aqLogger = new AQLogger('System');