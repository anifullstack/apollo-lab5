import React from "react";
import PropTypes from "prop-types";
import { withFormik } from "formik";
import Field from "../../../utils/FieldAdapter";
import {
  FormView,
  RenderField,
  FormButton
} from "../../common/components/native";
import { required, validateForm } from "../../../../../common/validation";

const diaryFormSchema = {
  subject: [required],
  activity: [required],
  note: [required]
};

const validate = values => validateForm(values, diaryFormSchema);

const StudentDiaryForm = ({ values, handleSubmit, diary }) => {
  let operation = "Add";
  if (diary && diary.id !== null) {
    operation = "Edit";
  }

  return (
    <FormView>
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
      <FormButton onPress={handleSubmit}>{operation}</FormButton>
    </FormView>
  );
};

StudentDiaryForm.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  diary: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object
};

const StudentDiaryFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    subject: props.diary && props.diary.subject,
    activity: props.diary && props.diary.activity,
    note: props.diary && props.diary.note
  }),
  validate: values => validate(values),
  handleSubmit: async (values, { resetForm, props: { onSubmit } }) => {
    await onSubmit(values);
    resetForm({ subject: "", activity: "", note: "" });
  },
  displayName: "DiaryForm", // helps with React DevTools
  enableReinitialize: true
});

export default StudentDiaryFormWithFormik(StudentDiaryForm);
