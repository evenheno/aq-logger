import { AQGlobalLogger } from "./class/aq-logger";
type TLogLevel = 'dev' | 'prod';
const globalLogger = new AQGlobalLogger<TLogLevel>();
const devLogger = globalLogger.create('TestApp', 'prod');
devLogger.action('Hello DEV1');
devLogger.action('Hello DEV2', 'dev');
