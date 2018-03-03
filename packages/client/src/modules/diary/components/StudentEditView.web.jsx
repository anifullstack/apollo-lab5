import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";

import { PageLayout } from "../../common/components/web";
import StudentForm from "./StudentForm";
import StudentDiarys from "../containers/StudentDiarys";
import settings from "../../../../../../settings";

const onSubmit = (student, addStudent, editStudent) => values => {
  if (student) {
    editStudent(student.id, values.firstName, values.lastName);
  } else {
    addStudent(values.firstName, values.lastName);
  }
};

const StudentEditView = ({
  loading,
  student,
  match,
  location,
  subscribeToMore,
  addStudent,
  editStudent
}) => {
  let studentObj = student;
  // if new student was just added read it from router
  if (!studentObj && location.state) {
    studentObj = location.state.student;
  }

  const renderMetaData = () => (
    <Helmet
      firstName={`${settings.app.name} - Edit student`}
      meta={[
        {
          name: "description",
          lastName: "Edit student example page"
        }
      ]}
    />
  );

  if (loading && !studentObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/students">
          Back
        </Link>
        <h2>{student ? "Edit" : "Create"} Student</h2>
        <StudentForm
          onSubmit={onSubmit(studentObj, addStudent, editStudent)}
          student={student}
        />
        <br />
      </PageLayout>
    );
  }
};

StudentEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  student: PropTypes.object,
  addStudent: PropTypes.func.isRequired,
  editStudent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

export default StudentEditView;
