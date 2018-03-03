import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, FormButton } from '../../common/components/native';
import { required, validateForm } from '../../../../../common/validation';

const studentFormSchema = {
  firstName: [required],
  lastName: [required]
};

const validate = values => validateForm(values, studentFormSchema);

const StudentForm = ({ values, handleSubmit }) => {
  return (
    <FormView>
      <Field name="firstName" component={RenderField} type="text" label="FirstName" value={values.firstName} />
      <Field name="lastName" component={RenderField} type="text" label="LastName" value={values.lastName} />
      <FormButton onPress={handleSubmit}>Save</FormButton>
    </FormView>
  );
};

StudentForm.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldTouched: PropTypes.func,
  setFieldValue: PropTypes.func,
  valid: PropTypes.bool,
  values: PropTypes.object
};

const StudentFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    firstName: props.student && props.student.firstName,
    lastName: props.student && props.student.lastName
  }),
  validate: values => validate(values),
  handleSubmit(values, { props: { onSubmit } }) {
    onSubmit(values);
  },
  displayName: 'StudentForm' // helps with React DevTools
});

export default StudentFormWithFormik(StudentForm);
