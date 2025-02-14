import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  MenuItem,
} from '@mui/material';
import { signup } from '../services/api';

const validationSchema = Yup.object({
  industry_name: Yup.string().required('Industry name is required'),
  industry_type: Yup.string()
    .oneOf(['Manufacturing Unit', 'Recycling Plant', 'Landfill'])
    .required('Industry type is required'),
  contact_number: Yup.string().required('Contact number is required'),
  latitude: Yup.number().required('Latitude is required'),
  longitude: Yup.number().required('Longitude is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const industryTypes = ['Manufacturing Unit', 'Recycling Plant', 'Landfill'];

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register Your Industry
        </Typography>
        <Formik
          initialValues={{
            industry_name: '',
            industry_type: '',
            contact_number: '',
            latitude: '',
            longitude: '',
            password: '',
          }}
          validationSchema={validationSchema}
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
                  {industryTypes.map((type) => (
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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Register Industry
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Signup;