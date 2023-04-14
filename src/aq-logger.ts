import { TNodeColor, EColors } from './colors';

const moduleColorsArr: Array<TNodeColor> = [
    'bgCyan', 'bgMagenta', 'bgRed',
    'bgGreen', 'bgYellow', 'bgBlue',
    'bgWhite'];

interface colorsDictionary {
    [key: string]: string;
}

export class AQLogger {
    private _moduleName: string;
    private static _activeModules: colorsDictionary = {};

    constructor(moduleName: string) {
        this._moduleName = moduleName;
        if (!AQLogger._activeModules[moduleName]) {
            const index = Object.keys(AQLogger._activeModules).length % moduleColorsArr.length;
            AQLogger._activeModules[moduleName] = EColors[moduleColorsArr[index]];
        }
    }

    public log(message: string, ...data: any[]) {
        const timestamp = new Date().toLocaleString();
        const moduleColorPrint = AQLogger._activeModules[this._moduleName] || '';
        const logMessage = `[ ${timestamp} ] ${moduleColorPrint} ${this._moduleName.padEnd(15)} ${EColors.reset} ${message}`;
        console.log(logMessage, ...data);
    }

    public debug(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgBlue}${EColors.dim}DEBUG: ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public trace(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgWhite}${EColors.dim}TRACE: ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public action(message: string, ...data: any[]) {
        const coloredMessage = `• ${message}..${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public warn(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgYellow}${EColors.bright}WARNING: ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public event(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgCyan}${EColors.bright}EVENT: ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public info(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgBlue}${EColors.bright}• ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public success(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgGreen}${EColors.bright}✔ ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public results(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgRed}${EColors.bright}• Results => ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public request(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.bgRed}${EColors.bright}${EColors.fgWhite}🌐 ${message}${EColors.reset}`;
        this.log(coloredMessage, ...data);
    }

    public error(message: string, ...data: any[]) {
        const coloredMessage = `${EColors.fgRed}${EColors.bright}${EColors.fgRed}${message}${EColors.reset}`;
        this.log(coloredMessage);
    }
}

export const aqLogger = new AQLogger('System');