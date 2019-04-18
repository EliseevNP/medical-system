// import HTTPService from './http/service';
// import http from '../config/http';
import models from './models';
// import routes from './routes';

// Error.stackTraceLimit = Infinity;

// const httpService = new HTTPService(routes);

models.sequelize.sync().then(() => {
  console.log('[SEQUELIZE] Sync all defined models in DB successfully');
}).catch(error => {
  console.log('[SEQUELIZE]', error);
});

// httpService.start(process.env.PORT || http[process.env.NODE_ENV].port);