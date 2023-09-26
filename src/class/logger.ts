import {
    TAQLoggerOptions,
    TAQLoggerRulesSet,
    TColor,
    TAQLoggerDefaultEnv,
    TAQLoggerDefaultLogLevel,
    TAQLoggerDefaultModule,
    TPrintOptions
} from '../types/types.js';

import { ENodeColors, EWebColors } from '../enum/enum.js';
import { activeModules, moduleColors, platform } from '../const/const.js';
import { Exception } from './exception.js';

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
        this._setModules();
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

    private _setModules() {
        if (!activeModules[this._module]) {
            const index = Object.keys(activeModules).length % moduleColors.length;
            let dictionary: typeof ENodeColors | typeof EWebColors;
            if (platform === 'NodeJS') {
                dictionary = ENodeColors;
            } else if (platform === 'Browser') {
                dictionary = EWebColors;
            } else { throw `Unsupported platform: ${platform}` }
            activeModules[this._module] = moduleColors[index];
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

    public log(logLevel: TAQLoggerDefaultLogLevel, text: string, ...data: any[]) {
        this._log(logLevel, text, ['fgWhite'], ...data);
    }

    public debug(text: string, ...data: any[]) {
        this._log('debug', text, ['fgMagenta'], ...data);
    }

    public action(text: string, ...data: any[]) {
        this._log('debug', `${text}...`, ['fgYellow'], ...data);
    }

    public success(text: string, ...data: any[]) {
        this._log('info', text, ['fgGreen'], ...data);
    }

    public info(text: string, ...data: any[]) {
        this._log('info', `${text}...`, ['fgCyan'], ...data);
    }

    public error(error: any, ...data: any[]) {
        this._log('error', `${error}`, ['bgRed', 'fgWhite'], ...data);
    }

    public warn(text: string, ...data: any[]) {
        this._log('warn', text, ['bgYellow', 'fgBlack'], ...data);
    }

    public exception(message: string, error?: any) {
        const exception = new Exception(this._module, message, error);
        return exception;
    }

    public throw(message: string, error: any) {
        throw new Exception(this._module, message, error);
    }

    private _allowLog(logLevel: TAQLoggerDefaultLogLevel): TPrintOptions | undefined {
        let printOptions: TPrintOptions = {
            data: true,
            logLevel: true,
            moduleName: true,
            timestamp: false,
            subModule: true
        }

        if (this._options?.print) {
            printOptions = { ...printOptions, ...this._options.print }
        }

        if (!this._rules) { return printOptions; }
        if (!this?._options?.environment) { return printOptions; }

        const envRules = this._rules[this._options?.environment];
        if (!envRules) { return printOptions; }

        if (envRules.print) { printOptions = { ...printOptions, ...envRules.print } }
        if (!envRules.modules) { return printOptions; }

        const moduleOptions = envRules.modules[this._module];
        if (!moduleOptions) { return printOptions; }
        if (!defTrue(moduleOptions.allow)) { return; }

        if (moduleOptions.print) { printOptions = { ...printOptions, ...moduleOptions.print }; }

        if (!envRules.logLevel) { return printOptions; }
        if (!defTrue(envRules.logLevel[logLevel])) { return; }

        if (!moduleOptions.logLevel) { return printOptions }
        if (!defTrue(moduleOptions.logLevel[logLevel])) { return; }

        return printOptions;
    }

    private _log(logLevel: TAQLoggerDefaultLogLevel, message: string, colors: TColor[], ...data: any[]) {
        let printOptions = this._allowLog(logLevel);
        if (!printOptions) { return }

        const browserStyle: Array<string> = [];
        const moduleColor = activeModules[this._module as string];

        const logMessage = [];
        if (defTrue(printOptions.timestamp)) {
            const ts = new Date().toLocaleString();
            logMessage.push(this._paint(`${ts} `, ['dim'], browserStyle));
        }
        if (defTrue(printOptions.logLevel)) {
            const str = `${`[${(logLevel as string)}]`.toUpperCase().slice(0,7).padEnd(8)}`;
            logMessage.push(this._paint(str, ['bright'], browserStyle))
        }
        if (defTrue(printOptions.moduleName)) {
            logMessage.push(this._paint(` @${this._module.slice(0,9).padEnd(10)}`, moduleColor, browserStyle), ' ');
        }
        if (defTrue(printOptions.subModule)) {
            logMessage.push(this._paint(`${this._subModule}`.slice(0,9).padEnd(10),['fgBlue'], browserStyle), ' ');
        }
        logMessage.push(this._paint(`${message}`, colors, browserStyle));
        const outputMessage = logMessage.join('');
        const outputData = [...browserStyle];
        if (printOptions.data === true) {
            outputData.push(...data);
        }
        console.log(outputMessage, ...outputData);
    }
}

export { AQLogger }