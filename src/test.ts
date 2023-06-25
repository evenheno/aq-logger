import { AQLogger } from '.';
export type TLogLevels = 'A' | 'B'

const logger = new AQLogger<TLogLevels>('AQLoggerTest', 'A');

logger.action('Testing AQLogger');
logger.exception('Example exception');