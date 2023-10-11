import {
    TAQLoggerOptions,
    TAQLoggerRulesSet,
    TColor,
    TDefEnv,
    TDefLogLevel,
    TDefModule,
    getColor,
} from '../types/types.js';
import { platform } from '../const/const.js';
import { Exception } from './exception.js';
import { getTs } from '../global/utils.js';
import { TLogLevelPermission } from '../types/log-level-permissions.js';

const defTrue = (value?: boolean) => {
    return value === false ? false : true;
}

class AQLogger<
    TEnv extends string = TDefEnv,
    TLogLevel extends string = TDefLogLevel,
    TModule extends string = TDefModule>{

    private _module: TModule;
    private _rules?: TAQLoggerRulesSet<TEnv, TLogLevel, TModule>;
    private _options?: TAQLoggerOptions<TEnv, TLogLevel, TModule>;

    constructor(
        module: TModule,
        options?: TAQLoggerOptions<TEnv, TLogLevel, TModule>) {
        this._options = options;
        this._rules = options?.rules;
        this._module = module;
    }

    private _getColors(colors: TColor[]) {
        const result: string[] = [];
        for (let color of colors) { result.push(getColor(color)) }
        return result.join('')
    }

    private _paint(text: string, colors: TColor[], browserStyles: string[]) {
        const strColors = this._getColors(colors);
        if (platform === 'NodeJS') {
            return `${strColors}${text}${getColor('reset')}`;
        } else if (platform === 'Browser') {
            browserStyles.push(strColors);
            return `%c${text}`;
        } else {
            throw `Unsupported platform: ${platform}`
        }
    }

    public log(logLevel: TLogLevel | TDefLogLevel, text: string, ...data: any[]) {
        this._log(logLevel, null, text, text, ...data);
    }

    public warn(text: string, ...data: any[]) {
        this._log('warn', null, `WARNING: ${text}`, text, ...data);
    }

    public debug(text: string, ...data: any[]) {
        this._log('debug', null, text, text, ...data);
    }

    public info(text: string, ...data: any[]) {
        this._log('info', null, text, text, ...data);
    }

    public success(error: any, ...data: any[]) {
        this._log('info', ['fgGreen'], `${error}`, `${error}`, ...data);
    }


    public error(error: any, ...data: any[]) {
        this._log('error', null, `${error}`, `${error}`, ...data);
    }

    public exception(message: string, error?: any) {
        const exception = new Exception(`${this._module}`, message, error);
        return exception;
    }

    public throw(message: string, error: any) {
        throw new Exception(`${this._module}`, message, error);
    }

    private _getLogLevelPermission(logLevel: TLogLevel | TDefLogLevel): TLogLevelPermission | undefined {

        const result: TLogLevelPermission = {
            printOptions: {
                data: true,
                logLevel: true,
                moduleName: true,
                timestamp: true
            }
        }

        if (this._options?.print) {
            result.printOptions = { ...result.printOptions, ...this._options.print }
        }

        if (!this._rules) { return result; }
        if (!this?._options?.env) { return result; }

        const envRules = this._rules[this._options?.env];
        if (!envRules) { return result; }

        if (envRules.print) { result.printOptions = { ...result.printOptions, ...envRules.print } }
        if (!envRules.modules) { return result; }

        const moduleOptions = envRules.modules[this._module as string];
        if (!moduleOptions) { return result; }
        if (!defTrue(moduleOptions.allow)) { return; }

        if (moduleOptions.print) { result.printOptions = { ...result.printOptions, ...moduleOptions.print }; }

        if (!envRules.logLevel) { return result; }
        if (!defTrue(envRules.logLevel[logLevel])) { return; }

        if (!moduleOptions.logLevel) { return result }
        if (!defTrue(moduleOptions.logLevel[logLevel])) { return; }

        return result;
    }

    private _getModuleColor(module: TModule): TColor[] {
        const colors = this._options?.moduleColors;
        if (!colors) { return []; }
        const moduleColor = colors[module];
        return moduleColor || [];
    }

    private _log(
        logLevel: TLogLevel | TDefLogLevel,
        colors: TColor[] | undefined | null,
        message: string,
        rawMessage: string,
        ...data: any[]) {

        const permission = this._getLogLevelPermission(logLevel);
        if (!permission) { return }

        const output = [];
        const browserStyle: Array<string> = [];
        const printOptions = permission.printOptions;
        const moduleColor = this._getModuleColor(this._module);

        let logLevelColor: TColor[] = [];
        let logLevelHeaderColor: TColor[] = [];
        let logLevelSymbol: string | undefined;

        if (this._options?.logLevelColors) {
            const entry = this._options.logLevelColors[logLevel];
            if (entry) {
                logLevelColor = entry.text || [];
                logLevelHeaderColor = entry.header || [];
                logLevelSymbol = entry.symbol;
            }
        }
        if (colors) { logLevelColor = colors || [] }

        if (defTrue(printOptions.timestamp)) {
            output.push(this._paint(`${getTs()} `, ['dim'], browserStyle));
        };

        if (defTrue(printOptions.logLevel)) {
            const symbol = logLevelSymbol ? `${logLevelSymbol} ` : ' ';
            const str = `${`[${(logLevel as string)}]`.toUpperCase().slice(0, 8).padEnd(8)}`;
            output.push(this._paint(`${symbol}${str}`, ['bright', ...logLevelHeaderColor], browserStyle), ' ');
        };

        if (defTrue(printOptions.moduleName)) {
            const moduleName = `@${this._module}`.slice(0, 13).padEnd(13);
            output.push(this._paint(moduleName, moduleColor, browserStyle), ' ');
        };

        output.push(this._paint(`${message}`, logLevelColor, browserStyle));
        const outputData = [...browserStyle];

        if (printOptions.data === true) { outputData.push(...data); };
        console.log(output.join(''), ...outputData);
    }
}

export { AQLogger }