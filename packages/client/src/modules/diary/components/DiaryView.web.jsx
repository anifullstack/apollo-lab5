import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Diary"
    meta={[
      {
        name: 'description',
        content: 'Diary page'
      }
    ]}
  />
);

const DiaryView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Diary!</p>
      </div>
    </PageLayout>
  );
};

export default DiaryView;
