import { apolloUploadExpress } from 'apollo-upload-server';
import { constructUploadOptions } from 'apollo-fetch-upload';
import express from 'express';
import Upload from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Upload: new Upload() }),
  middleware: app => {
    app.use('/graphql', apolloUploadExpress({ uploadDir: './public' }));
    app.use('/public', express.static('public'));
  },
  createFetchOptions: constructUploadOptions
});
