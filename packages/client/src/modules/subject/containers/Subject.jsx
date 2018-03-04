/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import SubjectView from '../components/SubjectView';

class Subject extends React.Component {
  render() {
    return <SubjectView {...this.props} />;
  }
}

const SubjectWithApollo = compose()(Subject);

export default SubjectWithApollo;
