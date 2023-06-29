import { TColor, TLogLevel } from '../global/types';
import { ENodeColors, EWebColors } from '../global/enums';
import { Exception } from './exception';
import { activeModules, moduleColors, platform } from '../global/const';
import { ensureArray } from '../global/utils';
type T = TLogLevel | Array<TLogLevel>;

export type TAQLoggerOptions = {
    useLogLevel?: boolean,
    logLevels?: T
}

export class AQLogger {

    private _moduleName: string;
    private static _logLevel: { [key: string]: boolean } = {};
    public static printTimestamp: boolean = true;

    constructor(moduleName: string) {
        this._moduleName = moduleName;

        //Initiate logger's log levels

        /*if (AQLogger.options?.logLevels) {
            const logLevels = ensureArray(AQLogger.options.logLevels);
            for (let logLevel of logLevels) {
                this.logLevel[logLevel as string] = true;
            }
        }*/

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

    public static setLogLevel(...logLevel: Array<TLogLevel>) {
        const list = ensureArray<T>(logLevel);
        for (let item of list) {
            AQLogger._logLevel[item as string] = true;
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

    private _wrapData(data?: any) {
        if (!data) { return [] }
        return [data];
    }

    public log(message: string, colors: TColor[], ...data: any[]) {
        const ts = new Date().toLocaleString();
        const browserStyle: Array<string> = [];
        const moduleColor = activeModules[this._moduleName];
        const logMessage = [];
        if (AQLogger.printTimestamp) {
            logMessage.push(this._paint(`[${ts}] `, ['dim'], browserStyle));
        }
        logMessage.push(
            this._paint(` ${this._moduleName} `, moduleColor, browserStyle),
            this._paint(` ${message}`, colors, browserStyle)
        );
        console.log(logMessage.join(''), ...browserStyle, ...data);
    }

    private _resolve(param1?: T | object, param2?: object) {
        const logLevels = ((typeof param1 === 'string') ? param1 : param2) as T;
        const data = ((typeof param1 === 'object') ? param1 : undefined);
        if (!logLevels) { return { data, allowPrint: true } }

        //Check if log is allowed according to module log level and global log level
        const logLevelsArr = ensureArray<T>(logLevels);
        for (let logLevel of logLevelsArr) {
            const allowGlobal = AQLogger._logLevel[logLevel as string] === true;
            //const allowModule = this.logLevels[logLevel as string] === true;
            if (allowGlobal) {
                return { data, allowPrint: true }
            }
        }

        //Log is not allowed to be printed, return false
        return { allowPrint: false };
    }

    public action(message: string): void
    public action(message: string, logLevel: T): void
    public action(message: string, data: object): void
    public action(message: string, logLevel: T, data: object): void
    public action(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        allowPrint && this.log(`⋄ ${message}...`, ['fgYellow'], ...this._wrapData(data));
    }

    public warn(message: string): void
    public warn(message: string, logLevel: T): void
    public warn(message: string, data: object): void
    public warn(message: string, logLevel: T, data: object): void
    public warn(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        allowPrint && this.log(`⚠️ WARNING: ${message}...`, ['fgYellow'], ...this._wrapData(data));
    }

    public info(message: string): void
    public info(message: string, logLevel: T): void
    public info(message: string, data: object): void
    public info(message: string, logLevel: T, data: object): void
    public info(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        allowPrint && this.log(`🛈 ${message}`, ['fgCyan'], ...this._wrapData(data));
    }

    public success(message: string): void
    public success(message: string, logLevel: T): void
    public success(message: string, data: object): void
    public success(message: string, logLevel: T, data: object): void
    public success(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        allowPrint && this.log(`√ ${message}`, ['fgGreen'], ...this._wrapData(data));
    }

    public debug(message: string): void
    public debug(message: string, logLevel: T): void
    public debug(message: string, data: object): void
    public debug(message: string, logLevel: T, data: object): void
    public debug(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        allowPrint && this.log(`🐞 [DEBUG] ${message}...`, ['fgMagenta'], ...this._wrapData(data));
    }

    public event(message: string): void
    public event(message: string, logLevel: T): void
    public event(message: string, data: object): void
    public event(message: string, logLevel: T, data: object): void
    public event(message: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        allowPrint && this.log(`⚡ [EVENT] ${message}...`, ['fgMagenta'], ...this._wrapData(data));
    }

    public request(path: string, method: string): void
    public request(path: string, method: string, logLevel: T): void
    public request(path: string, method: string, data: object): void
    public request(path: string, method: string, logLevel: T, data: object): void
    public request(path: string, method: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        allowPrint && this.log(`🌐 [REQUEST] ${method.toUpperCase()} ${path}`,
            ['fgBlue'], ...this._wrapData(data));
    }

    public response(path: string, method: string): void
    public response(path: string, method: string, logLevel: T): void
    public response(path: string, method: string, data: object): void
    public response(path: string, method: string, logLevel: T, data: object): void
    public response(path: string, method: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        allowPrint && this.log(`🌐 [RESPONSE] ${method.toUpperCase()} ${path}`,
            ['fgBlue'], ...this._wrapData(data));
    }

    public error(message: any): void
    public error(message: any, logLevel: T): void
    public error(message: any, data: object): void
    public error(message: any, logLevel: T, data: object): void
    public error(message: any, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        allowPrint && this.log(`🔴 ${message}`, ['fgRed'], ...this._wrapData(data));
    }

    public exception(message: string): Exception
    public exception(message: string, error?: any): Exception
    public exception(message: string, statusCode?: number): Exception
    public exception(message: string, error?:any, statusCode?: number): Exception
    public exception(message: string, param1?: unknown, param2?: number) {
        const statusCode = (typeof (param1) === 'number') ? param1 : param2;
        const error = (typeof (param1) !== 'number') ? param1 : undefined;
        return new Exception(this._moduleName, message, error, statusCode);
    }
}

export const aqLogger = new AQLogger('System');