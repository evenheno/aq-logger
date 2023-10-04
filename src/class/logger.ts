import {
    TAQLoggerOptions,
    TAQLoggerRulesSet,
    TColors,
    TAQLoggerDefaultEnv,
    TAQLoggerDefaultLogLevel,
    TAQLoggerDefaultModule,
    TColor,
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
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule>{

    private _module: TCModule | TAQLoggerDefaultModule;
    private _subModule?: string;
    private _rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>;
    private _options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>;

    constructor(
        module: TCModule | TAQLoggerDefaultModule,
        options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>) {
        this._options = options;
        this._rules = options?.rules;
        this._module = module;
        this._subModule = options?.subModule;
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

    public log(logLevel: TAQLoggerDefaultLogLevel, text: string, ...data: any[]) {
        this._log(logLevel, text, text, ['fgWhite'], ...data);
    }

    public debug(text: string, ...data: any[]) {
        this._log('debug', text, text, ['fgMagenta'], ...data);
    }

    public success(text: string, ...data: any[]) {
        this._log('info', text, text, ['fgGreen'], ...data);
    }

    public info(text: string, ...data: any[]) {
        this._log('info', `${text}...`, text, ['fgCyan'], ...data);
    }

    public error(error: any, ...data: any[]) {
        this._log('error', `${error}`, error, ['bgRed', 'fgWhite'], ...data);
    }

    public warn(text: string, ...data: any[]) {
        this._log('warn', text, text, ['bgYellow', 'fgBlack'], ...data);
    }

    public exception(message: string, error?: any) {
        const exception = new Exception(this._module, message, error);
        return exception;
    }

    public throw(message: string, error: any) {
        throw new Exception(this._module, message, error);
    }

    private _getLogLevelPermission(logLevel: TAQLoggerDefaultLogLevel): TLogLevelPermission | undefined {

        const result: TLogLevelPermission = {
            printOptions: {
                data: true,
                logLevel: true,
                moduleName: true,
                timestamp: true,
                subModule: true
            }
        }

        if (this._options?.print) {
            result.printOptions = { ...result.printOptions, ...this._options.print }
        }

        if (!this._rules) { return result; }
        if (!this?._options?.environment) { return result; }

        const envRules = this._rules[this._options?.environment];
        if (!envRules) { return result; }

        if (envRules.print) { result.printOptions = { ...result.printOptions, ...envRules.print } }
        if (!envRules.modules) { return result; }

        const moduleOptions = envRules.modules[this._module];
        if (!moduleOptions) { return result; }
        if (!defTrue(moduleOptions.allow)) { return; }

        if (moduleOptions.print) { result.printOptions = { ...result.printOptions, ...moduleOptions.print }; }

        if (!envRules.logLevel) { return result; }
        if (!defTrue(envRules.logLevel[logLevel])) { return; }

        if (!moduleOptions.logLevel) { return result }
        if (!defTrue(moduleOptions.logLevel[logLevel])) { return; }

        return result;
    }

    private _getModuleColor(module: TCModule | TAQLoggerDefaultModule): TColor[] {
        const colors = this._options?.moduleColors;
        if (!colors) { return []; }
        const moduleColor = colors[module];
        return moduleColor || [];
    }

    private _getLogLevelColor(module: TCLogLevel | TAQLoggerDefaultLogLevel): TColor[] {
        const colors = this._options?.logLevelColors;
        if (!colors) { return []; }
        const moduleColor = colors[module];
        return moduleColor || [];
    }

    private _log(
        logLevel: TAQLoggerDefaultLogLevel,
        message: string,
        rawMessage: string,
        colors: TColor[],
        ...data: any[]) {

        const permission = this._getLogLevelPermission(logLevel);
        if (!permission) { return }

        const output = [];
        const browserStyle: Array<string> = [];
        const printOptions = permission.printOptions;
        const moduleColor = this._getModuleColor(this._module);
        const logLevelColor = this._getLogLevelColor(logLevel);

        if (defTrue(printOptions.timestamp)) {
            output.push(this._paint(`${getTs()} `, ['dim'], browserStyle));
        };

        if (defTrue(printOptions.logLevel)) {
            const str = `${`[${(logLevel as string)}]`.toUpperCase().slice(0, 7).padEnd(7)}`;
            output.push(this._paint(str, ['bright', ...logLevelColor], browserStyle), ' ');
        };

        if (defTrue(printOptions.moduleName)) {
            output.push(this._paint(`${this._module.slice(0, 10).padEnd(10)}`, moduleColor, browserStyle), ' ');
        };

        if (defTrue(printOptions.subModule)) {
            output.push(this._paint(`${this._subModule}`.slice(0, 10).padEnd(10), [], browserStyle), ' ');
        };

        output.push(this._paint(`${message}`, colors, browserStyle));
        const outputData = [...browserStyle];

        if (printOptions.data === true) { outputData.push(...data); };
        console.log(output.join(''), ...outputData);
    }
}

export { AQLogger }