import { AQLogger } from '.';
const logger = new AQLogger('AQLoggerTest');
logger.success('Success');
logger.action('Some BL action');
logger.info('Information')