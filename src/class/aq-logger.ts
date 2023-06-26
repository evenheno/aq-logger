import { TColor, TLogLevel } from '../global/types';
import { ENodeColors, EWebColors } from '../global/enums';
import { Exception } from './exception';
import { activeModules, moduleColors, platform } from '../global/const';

export class AQLogger<T extends string = TLogLevel> {

    private static logLevels: { [key: string]: boolean } = {};
    private _moduleName: string;
    public whiteList: { [key in T as string]?: boolean };
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

    public static setLogLevels<T extends string>(
        logLevels: { [key in T | TLogLevel]?: boolean }) {
        AQLogger.logLevels = logLevels as { [key: string]: boolean };
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

    private _wrapData(data?: any) {
        if (!data) { return [] }
        return [data];
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

    private _resolve(param1?: T | object, param2?: object) {
        const logLevels = ((typeof param1 === 'string') ? param1 : param2) as T;
        const data = ((typeof param1 === 'object') ? param1 : undefined);
        if (!logLevels) { return { data: data, allowPrint: true } }
        let allowPrint = false;
        if (logLevels && Array.isArray(logLevels)) {
            for (let item of logLevels) {
                const allow = AQLogger.logLevels[item] === true;
                if (allow) { allowPrint = true; break; }
            }
        } else if (logLevels && AQLogger.logLevels[logLevels as string] === true) {
            allowPrint = true;
        }
        return { data: data, allowPrint: allowPrint };
    }

    public action(message: string): void
    public action(message: string, logLevel: T): void
    public action(message: string, data: object): void
    public action(message: string, logLevel: T, data: object): void
    public action(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`⚙️ ${message}...`, ['fgYellow'], ...this._wrapData(data));
    }

    public warn(message: string): void
    public warn(message: string, logLevel: T): void
    public warn(message: string, data: object): void
    public warn(message: string, logLevel: T, data: object): void
    public warn(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`⚠️ ${message}...`, ['fgYellow'], ...this._wrapData(data));
    }

    public info(message: string): void
    public info(message: string, logLevel: T): void
    public info(message: string, data: object): void
    public info(message: string, logLevel: T, data: object): void
    public info(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`ℹ️ ${message}...`, ['fgCyan'], ...this._wrapData(data));
    }

    public success(message: string): void
    public success(message: string, logLevel: T): void
    public success(message: string, data: object): void
    public success(message: string, logLevel: T, data: object): void
    public success(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`✅ ${message}...`, ['fgCyan'], ...this._wrapData(data));
    }

    public debug(message: string): void
    public debug(message: string, logLevel: T): void
    public debug(message: string, data: object): void
    public debug(message: string, logLevel: T, data: object): void
    public debug(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`🐞 ${message}...`, ['fgMagenta'], ...this._wrapData(data));
    }

    public event(message: string): void
    public event(message: string, logLevel: T): void
    public event(message: string, data: object): void
    public event(message: string, logLevel: T, data: object): void
    public event(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`⚡ ${message}...`, ['fgMagenta'], ...this._wrapData(data));
    }

    public request(path: string, method: string): void
    public request(path: string, method: string, logLevel: T): void
    public request(path: string, method: string, data: object): void
    public request(path: string, method: string, logLevel: T, data: object): void
    public request(path: string, method: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`🌐 ${method.toUpperCase()} Request: ${path}`,
            ['fgMagenta'], ...this._wrapData(data));
    }

    public error(message: string): void
    public error(message: string, logLevel: T): void
    public error(message: string, data: object): void
    public error(message: string, logLevel: T, data: object): void
    public error(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        this.log(`🔴 ${message}`, ['fgRed'], ...this._wrapData(data));
    }

    public exception(message: string, error?: any,) {
        return new Exception(this._moduleName, message, error);
    }

}

export const aqLogger = new AQLogger('System');