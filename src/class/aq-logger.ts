import { TColor, TLogLevel } from '../global/types';
import { ENodeColors, EWebColors } from '../global/enums';
import { Exception } from './exception';
import { activeModules, moduleColors, platform } from '../global/const';

export class AQLogger<T extends string | number | symbol = TLogLevel> {
    private _moduleName: string;
    public whiteList: { [key in T]?: boolean };
    public logLevel?: T;

    constructor(moduleName: string, logLevel?: T) {
        this._moduleName = moduleName;
        this.whiteList = {};
        if (!activeModules[moduleName]) {
            const index = Object.keys(activeModules).length % moduleColors.length;
            let dictionary: typeof ENodeColors | typeof EWebColors;
            if (platform === 'NodeJS') {
                dictionary = ENodeColors;
            } else if (platform === 'Browser') {
                dictionary = EWebColors;
            } else { throw `Unsupported platform: ${platform}` }
            activeModules[moduleName] = moduleColors[index];
        }
    }

    private _getColor(key: TColor) {
        if (platform === 'NodeJS') {
            return ENodeColors[key];
        } else if (platform === 'Browser') {
            return EWebColors[key];
        } else {
            throw `Unsupported platform: ${platform}`
        }
    }

    private _paint(text: string, colors: TColor[], browserStyles: string[]) {
        const strColors = colors.map(color => this._getColor(color)).join('');
        if (platform === 'NodeJS') {
            return `${strColors}${text}${ENodeColors.reset}`;
        } else if (platform === 'Browser') {
            browserStyles.push(strColors);
            return `%c${text}`;
        } else {
            throw `Unsupported platform: ${platform}`
        }
    }

    public log(message: string, colors: TColor[], ...data: any[]) {
        const ts = new Date().toLocaleString();
        const browserStyle: Array<string> = [];
        const moduleColor = activeModules[this._moduleName];
        const logMessage = [
            this._paint(`[${ts}] `, ['dim'], browserStyle),
            this._paint(` ${this._moduleName} `, moduleColor, browserStyle),
            this._paint(` ${message}`, colors, browserStyle)
        ].join('');
        console.log(logMessage, ...browserStyle, ...data);
    }

    public debug(message: string, ...data: any[]) {
        this.log(`🐞 ${message}`, ['fgMagenta'], ...data);
    }

    public trace(message: string, ...data: any[]) {
        this.log(message, ['fgCyan'], ...data);
    }

    public action(message: string, ...data: any[]) {
        this.log(`${message}...`, ['fgYellow'], ...data);
    }

    public warn(message: string, ...data: any[]) {
        this.log(`⚠️ ${message}`, ['fgYellow'], ...data);
    }

    public event(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgCyan'], ...data);
    }

    public info(message: string, ...data: any[]) {
        this.log(`INFO: ${message}`, ['fgCyan'], ...data);
    }

    public success(message: string, ...data: any[]) {
        this.log(`✅ ${message}`, ['fgGreen'], ...data);
    }

    public results(message: string, ...data: any[]) {
        this.log(`${message}`, ['fgMagenta'], ...data);
    }

    public request(message: string, ...data: any[]) {
        this.log(`🌐 ${message}`, ['fgCyan'], ...data);
    }

    public error(message: string, ...data: any[]) {
        this.log(`❌ ${message}`, ['fgRed'], ...data);
    }

    public exception(message: string, error?: any,) {
        const exception = new Exception(this._moduleName, message, error);
        this.error(`${exception}`);
        return exception;
    }
}

export const aqLogger = new AQLogger('System');