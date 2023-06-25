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
            const dictionary = platform === 'NodeJS' ? ENodeColors : platform === 'Browser' ? EWebColors : null;
            if(!dictionary){ AQLogger._activeModules[moduleName] = moduleName; return;}
            AQLogger._activeModules[moduleName] = dictionary[moduleColorsArr[index]];
        }
    }

    private _paint(text: string, colors: TColor[]){
        let output: Array<string>;
        if (platform === 'NodeJS') {
            const strColors = colors.map(color=> `${ENodeColors[color]}`);
            output = [`${strColors}${text}${ENodeColors.reset}`];
        } else if (platform === 'Browser') {
            const strStyles = colors.map(color => `color:${EWebColors[color]};`).join('');
            output = [`%c${text}`, strStyles];
        } else{
            output = [text];
        }
        return output;
    }

    public log(message: string, colors: TColor[], ...data:any[]) {
        let output: Array<string>;
        const ts = new Date().toLocaleString();
        if (platform === 'NodeJS') {
            const colorsString = colors.map(color=> `${ENodeColors[color]}`);
            output = [`${ENodeColors.dim}[${ts}]${ENodeColors.reset} ${ENodeColors.bright}${this._moduleName}${ENodeColors.reset} ${colorsString}${message}${ENodeColors.reset}`];
        } else if (platform === 'Browser') {
            const colorsString = colors.map(color => `color:${EWebColors[color]};`).join('');
            output = [`[${ts}] ${this._moduleName} %c${message}`, colorsString];
        } else{
            output = [message];
        }
        console.log(...output, ...data);
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