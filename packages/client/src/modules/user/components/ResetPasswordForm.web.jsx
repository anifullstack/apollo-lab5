import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { required, minLength, validateForm, match } from '../../../../../common/validation';

const contactFormSchema = {
  password: [required, minLength(5)],
  passwordConfirmation: [match('password'), required, minLength(5)]
};

const validate = values => validateForm(values, contactFormSchema);

const ResetPasswordForm = ({ values, handleSubmit, error }) => {
  return (
    <Form name="resetPassword" onSubmit={handleSubmit}>
      <Field name="password" component={RenderField} type="password" label="Password" value={values.password} />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label="Password Confirmation"
        value={values.passwordConfirmation}
      />
      {error && <Alert color="error">{error}</Alert>}
      <Button color="primary" type="submit">
        Reset Password
      </Button>
    </Form>
  );
};

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string
};

const ResetPasswordFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ password: '', passwordConfirmation: '' }),
  async handleSubmit(values, { setErrors, resetForm, props: { onSubmit } }) {
    await onSubmit(values)
      .then(() => resetForm())
      .catch(e => setErrors(e));
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default ResetPasswordFormWithFormik(ResetPasswordForm);
