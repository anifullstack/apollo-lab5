import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import moment from "moment";
import { PageLayout, Table, Button } from "../../common/components/web";
import settings from "../../../../../../settings";

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
          name: "description",
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
      console.log(
        "Client",
        "StudentListWeb",
        "students",
        JSON.stringify(students)
      );

      const columns = [
        {
          title: "FirstName",
          dataIndex: "firstName",
          key: "firstName",
          render: (text, record) => (
            <Link className="student-link" to={`/journal/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          key: "lastName",
          render: (text, record) => (
            <Link className="student-link" to={`/journal/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: "Birth Date",
          dataIndex: "birthDate",
          key: "birthDate",
          render: (text, record) => (
            <Link className="student-link" to={`/journal/${record.id}`}>
              {moment(parseInt(text)).format("MMM Do, YYYY")}
            </Link>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Student Journals</h2>

          <h1 />
          <Table
            dataSource={students.edges.map(({ node }) => node)}
            columns={columns}
          />
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
