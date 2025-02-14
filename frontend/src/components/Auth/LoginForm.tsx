import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Alert } from '@mui/material';
import { login } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const validationSchema = Yup.object({
  industry_id: Yup.number().required('Industry ID is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={{ industry_id: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await login(Number(values.industry_id), values.password);
          authLogin(response, response.industry);
          navigate('/dashboard');
        } catch (err) {
          setError('Invalid credentials');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              name="industry_id"
              label="Industry ID"
              value={values.industry_id}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.industry_id && Boolean(errors.industry_id)}
              helperText={touched.industry_id && errors.industry_id}
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Login
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;