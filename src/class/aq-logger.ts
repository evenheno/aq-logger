import { TColor, TLogLevel, TLogLevelArr, TLogLevelParam } from '../global/types';
import { ENodeColors, EWebColors } from '../global/enums';
import { Exception } from './exception';
import { activeModules, moduleColors, platform } from '../global/const';
import { ensureArray } from '../global/utils';

class AQLogger<T extends string> {

    private _parent?: AQLogger<T>;
    private _moduleName: string;
    private _printTs: boolean;
    public logLevel: { [key in TLogLevel<T>]?: boolean };

    constructor(moduleName: string, logLevel?: TLogLevelParam<T>, parent?: AQLogger<T>) {
        this._moduleName = moduleName;
        this._parent = parent;
        this._printTs = true;
        this.logLevel = {};
        this._setModules();
        //Initiate logger's log levels
        const logLevelArr = ensureArray<TLogLevel<T>>(logLevel);
        if (logLevel) {
            this.enableLogLevel(...logLevelArr)
        }
    }

    public enableLogLevel(...logLevels: TLogLevelArr<T>) {
        for (let logLevel of logLevels) {
            this.logLevel[logLevel] = true;
        }
    }
    public disableLogLevel(...logLevels: TLogLevelArr<T>) {
        for (let logLevel of logLevels) {
            this.logLevel[logLevel] = false;
        }
    }

    private _setModules() {
        if (!activeModules[this._moduleName]) {
            const index = Object.keys(activeModules).length % moduleColors.length;
            let dictionary: typeof ENodeColors | typeof EWebColors;
            if (platform === 'NodeJS') {
                dictionary = ENodeColors;
            } else if (platform === 'Browser') {
                dictionary = EWebColors;
            } else { throw `Unsupported platform: ${platform}` }
            activeModules[this._moduleName] = moduleColors[index];
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
        if (this._printTs) {
            logMessage.push(this._paint(`[${ts}] `, ['dim'], browserStyle));
        }
        logMessage.push(
            this._paint(` ${this._moduleName} `, moduleColor, browserStyle),
            this._paint(` ${message}`, colors, browserStyle)
        );
        console.log(logMessage.join(''), ...browserStyle, ...data);
    }

    private _resolve(param1?: TLogLevelParam<T> | object, param2?: object) {
        const logLevles = ensureArray<TLogLevel<T>>(param1 || []);
        logLevles.push('all');
        const data = ((typeof param1 === 'object') ? param1 : undefined);
        for (let key in this.logLevel) {
            logLevles.push(key as TLogLevel<T>);
        }
        for (let logLevel of logLevles) {
            const localRule = this.logLevel[logLevel];
            const globalRule = this._parent?.logLevel[logLevel];
            if ((localRule == null || localRule === true) && globalRule === true) {
                return { data: data, allowPrint: true }
            }
        };
        return { allowPrint: false };
    }

    public action(action: string): void
    public action(action: string, logLevel: T): void
    public action(action: string, data: object): void
    public action(action: string, logLevel: T, data: object): void
    public action(action: string, param1?: T | object, param2?: object) {
        const { data, allowPrint } = this._resolve(param1, param2);
        if (!allowPrint) { return }
        allowPrint && this.log(`⋄ ${action}...`, ['fgYellow'], ...this._wrapData(data));
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
    public exception(message: string, error?: any, statusCode?: number): Exception
    public exception(message: string, param1?: unknown, param2?: number) {
        const statusCode = (typeof (param1) === 'number') ? param1 : param2;
        const error = (typeof (param1) !== 'number') ? param1 : undefined;
        return new Exception(this._moduleName, message, error, statusCode);
    }
}

class AQGlobalLogger<T extends string> extends AQLogger<T>{
    public constructor(...logLevel: TLogLevelArr<T>) {
        super('AQGlobalLogger');
        this.enableLogLevel(...logLevel);
    }
    public create(moduleName: string, logLevel?: TLogLevelParam<T>) {
        const logger = new AQLogger<T>(moduleName, logLevel, this);
        return logger;
    }
}

export { AQGlobalLogger, AQLogger }