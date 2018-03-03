import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../../settings';

export default class StudentList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    students: PropTypes.object,
    deleteStudent: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  handleDeleteStudent = id => {
    const { deleteStudent } = this.props;
    deleteStudent(id);
  };

  renderLoadMore = (students, loadMoreRows) => {
    if (students.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Students list`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - List of all students example page`
        }
      ]}
    />
  );

  render() {
    const { loading, students, loadMoreRows } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      const columns = [
        {
          title: 'FirstName',
          dataIndex: 'firstName',
          key: 'firstName',
          render: (text, record) => (
            <Link className="student-link" to={`/student/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Last Name',
          dataIndex: 'lastName',
          key: 'lastName',
          render: (text, record) => (
            <Link className="student-link" to={`/student/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.handleDeleteStudent(record.id)}
            >
              Delete
            </Button>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Students</h2>
          <Link to="/student/0">
            <Button color="primary">Add</Button>
          </Link>
          <h1 />
          <Table dataSource={students.edges.map(({ node }) => node)} columns={columns} />
          <div>
            <small>
              ({students.edges.length} / {students.totalCount})
            </small>
          </div>
          {this.renderLoadMore(students, loadMoreRows)}
        </PageLayout>
      );
    }
  }
}
