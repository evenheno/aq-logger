import { TAQLoggerOptions, TAQLoggerRulesSet, TColor, TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel, TAQLoggerDefaultModule } from '../global/types';
import { ENodeColors, EWebColors } from '../global/enums';
import { activeModules, moduleColors, platform } from '../global/const';
import { Exception } from './exception';

class AQLogger<
    TCEnv extends string = TAQLoggerDefaultEnv,
    TCLogLevel extends string = TAQLoggerDefaultLogLevel,
    TCModule extends string = TAQLoggerDefaultModule>{

    private _module: TCModule | TAQLoggerDefaultModule;

    private _rules?: TAQLoggerRulesSet<TCEnv, TCLogLevel, TCModule>;
    private _options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>;

    constructor(
        module: TCModule | TAQLoggerDefaultModule,
        options?: TAQLoggerOptions<TCEnv, TCLogLevel, TCModule>) {
        this._options = options;
        this._rules = options?.rules;
        this._module = module;
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

    private _allowLog(logLevel: TAQLoggerDefaultLogLevel) {

        if (!this._rules) { return true; }
        if (!this?._options?.environment) { return true; }

        const rules = this._rules[this._options?.environment];

        if (!rules) { return false }
        if (rules === '*') { return true; }

        let allowModule = false;
        let allowLogLevel = false;
        let allowModuleLogLevel = false;

        if (rules.modules) {
            if (rules.modules === '*') {
                allowModule = true;
                allowModuleLogLevel = true;
            } else {
                const moduleMeta = rules.modules[this._module];
                if (moduleMeta == undefined || moduleMeta === true) {
                    allowModule = true;
                    allowModuleLogLevel = true;
                }
                else if (typeof moduleMeta !== 'boolean') {
                    allowModule = true;
                    if (moduleMeta.enabled != undefined) { allowModule = moduleMeta.enabled; }
                    if (moduleMeta.logLevel == undefined) {
                        allowModuleLogLevel = true;
                    } else if (moduleMeta.logLevel === '*') {
                        allowModuleLogLevel = true;
                    } else if (moduleMeta.logLevel.includes(logLevel)) {
                        allowModuleLogLevel = true;
                    }
                }
            }
        }

        if (!allowModule) { return false }

        if (rules.logLevel) {
            const allowAllLevels = rules.logLevel === '*';
            if (allowAllLevels || rules.logLevel.includes(logLevel)) {
                allowLogLevel = true;
            }
        }

        if (allowLogLevel && allowModuleLogLevel) {
            return true;
        }

        return false;
    }


    private _log(logLevel: TAQLoggerDefaultLogLevel, message: string, colors: TColor[], ...data: any[]) {

        if (!this._allowLog(logLevel)) { return }


        const browserStyle: Array<string> = [];
        const moduleColor = activeModules[this._module as string];

        const logMessage = [];
        if (this._options?.printTimestamp === true) {
            const ts = new Date().toLocaleString();
            logMessage.push(this._paint(`[${ts}] `, ['dim'], browserStyle));
        }
        if (this._options?.printModuleName === true) {
            logMessage.push(this._paint(` ${this._module} `.padEnd(13), moduleColor, browserStyle), ' ');
        }
        if (this._options?.printLogLevel === true) {
            logMessage.push(this._paint(`[${(logLevel as string).toUpperCase()}] `.padEnd(8), ['bright'], browserStyle))
        }
        logMessage.push(this._paint(message, colors, browserStyle));
        console.log(logMessage.join(''), ...browserStyle, ...data);
    }


}

export { AQLogger }