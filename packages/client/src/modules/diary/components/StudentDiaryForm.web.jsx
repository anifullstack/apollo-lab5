import React from "react";
import PropTypes from "prop-types";
import { withFormik } from "formik";
import Field from "../../../utils/FieldAdapter";
import {
  Form,
  RenderField,
  Row,
  Col,
  Label,
  Button
} from "../../common/components/web";
import { required, validateForm } from "../../../../../common/validation";

const diaryFormSchema = {
  subject: [required],
  activity: [required],
  note: [required]
};

const validate = values => validateForm(values, diaryFormSchema);

const StudentDiaryForm = ({ values, handleSubmit, diary }) => {
  console.log("StudentDiaryFormWeb", "StudentDiaryForm", "diary", diary);
  return (
    <Form name="diary" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>{diary.id === null ? "Add diary" : "Edit diary"}</Label>
        </Col>
        <Col xs={8}>
          <Field
            name="subject"
            component={RenderField}
            type="text"
            value={values.subject}
          />
          <Field
            name="activity"
            component={RenderField}
            type="text"
            value={values.activity}
          />
          <Field
            name="note"
            component={RenderField}
            type="text"
            value={values.note}
          />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

StudentDiaryForm.propTypes = {
  handleSubmit: PropTypes.func,
  diary: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  note: PropTypes.string,
  changeContent: PropTypes.func
};

const StudentDiaryFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    subject: props.diary && props.diary.subject,
    activity: props.diary && props.diary.activity,
    note: props.diary && props.diary.note
  }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ subject: "", activity: "", note: "" });
  },
  validate: values => validate(values),
  displayName: "DiaryForm", // helps with React DevTools,
  enableReinitialize: true
});

export default StudentDiaryFormWithFormik(StudentDiaryForm);
