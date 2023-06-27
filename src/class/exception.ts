import { generateId } from "../global/utils";

export class Exception {
    private _type = 'exception';
    private _name: string;
    private _message: string;
    private _error: any;
    private _errorId: string;
    private _moduleName: string;
    private _ts: number;
    private _statusCode?: number;
    public get errorId() { return this._errorId };
    public get statusCode() { return this._statusCode };
    public get moduleName() { return this._moduleName };
    public get ts() { return this._ts };
    public get error() { return this._error }
    public get message() { return this._message }
    public get name() { return this._name }

    public constructor(
        moduleName: string,
        message: string,
        error?: any,
        statusCode?: number) {

        this._name = moduleName;
        this._message = message;
        this._statusCode = statusCode;
        this._errorId = generateId();
        this._moduleName = moduleName;
        this._error = error;
        this._ts = Date.now();
    }

    public toString() {
        let errorDesc: string = '';
        if (this._error instanceof Error) {
            errorDesc = `\n- ${this._error.message}` || '';
        } else if (typeof this._error === 'string') {
            errorDesc = `\n- ${this._error}`;
        } else if (this._error instanceof Exception &&
            this._error._type === this._type) {
            errorDesc = `\n- ${this._error}` || '';
        }
        return `${this.name}Error: ${this.message} (${this._errorId})${errorDesc}`
    }
}
