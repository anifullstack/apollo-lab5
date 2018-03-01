import ApolloClient from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { addTypenameToDocument } from 'apollo-utilities';
import { LoggingLink } from 'apollo-logger';
import { Router, Switch } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { JSDOM } from 'jsdom';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { combineReducers, createStore } from 'redux';
import { graphql, print, getOperationAST } from 'graphql';

import { Provider } from 'react-redux';

import rootSchema from '../../../server/src/api/rootSchema.graphql';
import serverModules from '../../../server/src/modules';
import settings from '../../../../settings';

const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

// React imports MUST come after `global.document =` in order for enzyme `unmount` to work
const React = require('react');
const ReactEnzymeAdapter = require('enzyme-adapter-react-16');
const { ApolloProvider } = require('react-apollo');
const Enzyme = require('enzyme');
const clientModules = require('../modules').default;

const mount = Enzyme.mount;

Enzyme.configure({ adapter: new ReactEnzymeAdapter() });

process.on('uncaughtException', ex => {
  console.error('Uncaught error', ex.stack);
});

class MockLink extends ApolloLink {
  constructor(schema) {
    super();
    this.schema = schema;
    this.handlers = {};
    this.subscriptions = {};
    this.subscriptionQueries = {};
    this.subId = 1;
  }

  request(request) {
    const self = this;
    const { schema } = self;
    const operationAST = getOperationAST(request.query, request.operationName);
    if (!!operationAST && operationAST.operation === 'subscription') {
      return new Observable(observer => {
        try {
          const subId = self.subId++;
          const queryStr = print(request.query);
          const key = JSON.stringify({
            query: queryStr,
            variables: request.variables
          });
          self.handlers[subId] = {
            handler: observer,
            key: key,
            query: queryStr,
            variables: request.variables
          };
          self.subscriptions[key] = self.subscriptions[key] || [];
          self.subscriptions[key].push(subId);
          self.subscriptionQueries[queryStr] = self.subscriptionQueries[queryStr] || [];
          self.subscriptionQueries[queryStr].push(subId);

          return () => {
            try {
              const { key, query } = self.handlers[subId];
              self.subscriptions[key].splice(self.subscriptions[key].indexOf(subId), 1);
              if (!self.subscriptions[key].length) {
                delete self.subscriptions[key];
              }
              self.subscriptionQueries[query].splice(self.subscriptionQueries[query].indexOf(subId), 1);
              if (!self.subscriptionQueries[query].length) {
                delete self.subscriptionQueries[query];
              }
              delete self.handlers[subId];
            } catch (e) {
              console.error(e);
            }
          };
        } catch (e) {
          console.error(e);
        }
      });
    } else {
      return new Observable(observer => {
        graphql(schema, print(request.query), {}, {}, request.variables, request.operationName)
          .then(data => {
            if (!observer.closed) {
              observer.next(data);
              observer.complete();
            }
          })
          .catch(error => {
            if (!observer.closed) {
              observer.error(error);
            }
          });
      });
    }
  }

  _getSubscriptions(query, variables) {
    const self = this;
    if (!query) {
      return self.subscriptionQueries;
    }
    const queryStr = print(addTypenameToDocument(query));
    const key = JSON.stringify({
      query: queryStr,
      variables: variables || {}
    });
    const subscriptions = (!variables ? self.subscriptionQueries[queryStr] : self.subscriptions[key]) || [];

    return subscriptions.map(subId => {
      const res = {
        next(value) {
          return self.handlers[subId].handler.next(value);
        },
        error(errorValue) {
          return self.handlers[subId].handler.error(errorValue);
        }
      };
      res.variables = self.handlers[subId].variables;
      return res;
    });
  }
}

export default class Renderer {
  constructor(graphqlMocks, reduxState) {
    const schema = makeExecutableSchema({
      typeDefs: [rootSchema, ...serverModules.schemas]
    });
    addMockFunctionsToSchema({ schema, mocks: graphqlMocks });

    const cache = new InMemoryCache();
    let link = new MockLink(schema);
    const isLocalhost = /localhost/.test(__BACKEND_URL__);
    let linkSchema = isLocalhost ? new SchemaLink({ schema: { ...serverModules.schemas } }) : {};

    const linkState = withClientState({ ...clientModules.resolvers, cache });

    const client = new ApolloClient({
      link: ApolloLink.from(
        (settings.app.logging.apolloLogging ? [new LoggingLink()] : []).concat([linkState, link, ...linkSchema])
      ),
      cache
    });

    const store = createStore(
      combineReducers({
        ...clientModules.reducers
      }),
      reduxState
    );

    const history = createHistory();

    this.client = client;
    this.store = store;
    this.history = history;
    this.mockLink = link;
    // this.networkInterface = mockNetworkInterface;
  }

  withApollo(component) {
    const { store, client } = this;

    return clientModules.getWrappedRoot(
      <Provider store={store}>
        <ApolloProvider client={client}>{component}</ApolloProvider>
      </Provider>
    );
  }

  getSubscriptions(query, variables) {
    return this.mockLink._getSubscriptions(query, variables);
  }

  mount() {
    return mount(
      this.withApollo(
        clientModules.getWrappedRoot(
          <Router history={this.history}>
            <Switch>{clientModules.routes}</Switch>
          </Router>
        )
      )
    );
  }
}
