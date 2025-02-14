import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { industryValidationSchema } from '../../utils/validation';
import { TextField, Button, Box, Alert, MenuItem } from '@mui/material';
import { INDUSTRY_TYPES } from '../../utils/constants';
import { signup } from '../../services/api';

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={{
        industry_name: '',
        industry_type: '',
        contact_number: '',
        latitude: '',
        longitude: '',
        password: '',
      }}
      validationSchema={industryValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await signup(values);
          navigate('/login');
        } catch (err) {
          setError('Failed to register industry');
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
              name="industry_name"
              label="Industry Name"
              value={values.industry_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.industry_name && Boolean(errors.industry_name)}
              helperText={touched.industry_name && errors.industry_name}
            />
            <TextField
              select
              name="industry_type"
              label="Industry Type"
              value={values.industry_type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.industry_type && Boolean(errors.industry_type)}
              helperText={touched.industry_type && errors.industry_type}
            >
              {INDUSTRY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="contact_number"
              label="Contact Number"
              value={values.contact_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contact_number && Boolean(errors.contact_number)}
              helperText={touched.contact_number && errors.contact_number}
            />
            <TextField
              name="latitude"
              label="Latitude"
              type="number"
              value={values.latitude}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.latitude && Boolean(errors.latitude)}
              helperText={touched.latitude && errors.latitude}
            />
            <TextField
              name="longitude"
              label="Longitude"
              type="number"
              value={values.longitude}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.longitude && Boolean(errors.longitude)}
              helperText={touched.longitude && errors.longitude}
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
              Sign Up
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;