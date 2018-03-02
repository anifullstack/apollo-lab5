/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import DiaryView from '../components/DiaryView';

class Diary extends React.Component {
  render() {
    return <DiaryView {...this.props} />;
  }
}

const DiaryWithApollo = compose()(Diary);

export default DiaryWithApollo;
