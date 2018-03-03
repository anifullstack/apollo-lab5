import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const studentFormSchema = {
  firstName: [required],
  lastName: [required]
};

const validate = values => validateForm(values, studentFormSchema);

const StudentForm = ({ values, handleSubmit, submitting }) => {
  return (
    <Form name="student" onSubmit={handleSubmit}>
      <Field name="firstName" component={RenderField} type="text" label="FirstName" value={values.firstName} />
      <Field name="lastName" component={RenderField} type="text" label="LastName" value={values.lastName} />
      <Button color="primary" type="submit" disabled={submitting}>
        Save
      </Button>
    </Form>
  );
};

StudentForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  student: PropTypes.object
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
  enableReinitialize: true,
  displayName: 'StudentForm' // helps with React DevTools
});

export default StudentFormWithFormik(StudentForm);
