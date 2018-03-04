import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Subject"
    meta={[
      {
        name: 'description',
        content: 'Subject page'
      }
    ]}
  />
);

const SubjectView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Subject!</p>
      </div>
    </PageLayout>
  );
};

export default SubjectView;
