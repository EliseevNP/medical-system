import { errorToObject } from './utils/routes';
import HttpService from './http/service';
import httpCfg from '../config/http';
import log from './logging/service';
import models from './models';
import routes from './routes';

async function main () {
  try {
    const httpService = new HttpService(routes);
    await models.sequelize.sync();
    log.trace('SEQUELIZE', { message: 'Sync all defined models in DB successfully', isShort: true });
    httpService.start(process.env.PORT || httpCfg[process.env.NODE_ENV].port);
  } catch(err) {
    log.critical('INDEX', errorToObject(err));
  }
}

main();