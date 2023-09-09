import { generateId } from "../global/utils";

export class Exception {
    private _message: string;
    private _error: any;
    private _errorId: string;
    private _moduleName: string;
    private _ts: number;
    public get errorId() { return this._errorId };
    public get moduleName() { return this._moduleName };
    public get ts() { return this._ts };
    public get error() { return this._error }
    public get message() { return this._message }

    public constructor(
        moduleName: string,
        message: string,
        error?: any) {

        this._message = message;
        this._errorId = generateId();
        this._moduleName = moduleName;
        this._error = error;
        this._ts = Date.now();
    }

    public toString() {
        let errorDesc = this._error ? `\n- ${this._error}` : '';
        return `${this.moduleName}Error: ${this.message} (${this._errorId})${errorDesc}`
    }
}
