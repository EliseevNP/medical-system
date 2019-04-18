import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { errorToObject } from '../utils/routes';
import log from '../logging/service';

const application = express();
var connection;

class HTTPService {
  constructor(routes) {
    application.use(cors());
    application.use(bodyParser.json({
      limit: '10mb'
    }));
    application.use('/api/', routes);
  }

  async start (port) {
    let expressPromise = new Promise((resolve) => {
      connection = application.listen(port, function () {
        if (process.env.NODE_ENV !== 'test') {
          log.trace('SERVER', { message: `Listening on port: ${port}`, isShort: true });
        }
        resolve();
      });
    });

    try {
      await expressPromise;
      return connection;
    } catch (error) {
      log.critical('SERVER', errorToObject(error));
    }
  }

  get connection () {
    return connection;
  }
}

export default HTTPService;
