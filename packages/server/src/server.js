import url from 'url';
import http from 'http';
import addGraphQLSubscriptions from './api/subscriptions';

import app from './app';
import log from '../../common/log';

// eslint-disable-next-line import/no-mutable-exports
let server;

const { port } = url.parse(__BACKEND_URL__);
const serverPort = process.env.PORT || port || 8080;

server = http.createServer();
server.on('request', app);

addGraphQLSubscriptions(server);

server.listen(serverPort, () => {
  log.info(`API is now running on port ${serverPort}`);
});

server.on('close', () => {
  server = undefined;
});

if (module.hot) {
  module.hot.dispose(() => {
    try {
      if (server) {
        server.close();
      }
    } catch (error) {
      log(error.stack);
    }
  });
  module.hot.accept(['./app'], () => {
    server.removeAllListeners('request');
    server.on('request', app);
  });
  module.hot.accept(['./api/subscriptions'], () => {
    try {
      addGraphQLSubscriptions(server);
    } catch (error) {
      log(error.stack);
    }
  });

  module.hot.accept();
}

export default server;
