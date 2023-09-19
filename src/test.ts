import { AQGlobalLogger } from "./class/global-logger";
import { AQLogger } from "./class/logger";
import { TAQLoggerDefaultEnv, TAQLoggerDefaultLogLevel } from "./types/types.js";

type TModules = 'server' | 'ui';

const logger = new AQLogger();

logger.warn('Warning')