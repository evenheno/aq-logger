import { AQLogger } from '.';
const logger = new AQLogger('AQLoggerTest');
logger.success('Success');
logger.action('Some BL action');
logger.info('Information');
logger.error(logger.exception('Exception message', 'error details', 500))