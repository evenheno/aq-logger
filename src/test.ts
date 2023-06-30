import { AQGlobalLogger } from "./class/aq-logger";
type TLogLevel = 'dev' | 'prod';
const globalLogger = new AQGlobalLogger<TLogLevel>();
const devLogger = globalLogger.create('TestApp', 'prod');