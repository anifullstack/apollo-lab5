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
//import { Typeahead } from "react-bootstrap-typeahead";
import { required, validateForm } from "../../../../../common/validation";

const diaryFormSchema = {
  subject: [required],
  activity: [required],
  note: [required]
};

const options = [
  { name: "Math" },
  { name: "Practical Life" },
  { name: "Language" }
];

const validate = values => validateForm(values, diaryFormSchema);

const StudentDiaryForm = ({ values, handleSubmit, diary }) => {
  console.log("StudentDiaryFormWeb", "StudentDiaryForm", "diary", diary);
  return (
    <Form name="diary" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>
            {diary && diary.id !== null ? "Edit diary" : "Add diary"}
          </Label>
        </Col>
        <Col xs={8}>
          <Field
            name="activityDate"
            component={RenderField}
            type="text"
            label="activityDate"
            value={values.subject}
          />
          <Field
            name="subject"
            component={RenderField}
            type="text"
            label="Subject"
            value={values.subject}
          />
          <Field
            name="activity"
            component={RenderField}
            type="text"
            label="Activity"
            value={values.activity}
          />
          <Field
            name="note"
            component={RenderField}
            type="text"
            label="Note"
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
    activityDate: props.diary && props.diary.activityDate,
    note: props.diary && props.diary.note
  }),
  async handleSubmit(values, { resetForm, props: { onSubmit } }) {
    await onSubmit(values);
    resetForm({ subject: "", activity: "", activityDate: "", note: "" });
  },
  validate: values => validate(values),
  displayName: "DiaryForm", // helps with React DevTools,
  enableReinitialize: true
});

export default StudentDiaryFormWithFormik(StudentDiaryForm);
