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
    editStudent(
      student.id,
      values.firstName,
      values.lastName,
      values.birthDate
    );
  } else {
    addStudent(values.firstName, values.lastName, values.birthDate);
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
      title={`${settings.app.name} - Edit Journal`}
      meta={[
        {
          name: "description",
          title: "Edit Journal"
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
    console.log(
      "StudentEditViewWeb",
      "PageLayout",
      "studentObj",
      JSON.stringify(studentObj)
    );
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/students">
          Back
        </Link>
        <h2>
          {studentObj.firstName} {studentObj.lastName}
        </h2>
        {studentObj &&
          studentObj.diarys && (
            <StudentDiarys
              studentId={Number(match.params.id)}
              diarys={studentObj.diarys}
              subscribeToMore={subscribeToMore}
            />
          )}
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
