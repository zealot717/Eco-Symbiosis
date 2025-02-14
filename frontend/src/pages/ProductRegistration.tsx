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
} from '@mui/material';
import { registerProduct } from '../services/api';

const validationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  quantity: Yup.number()
    .positive('Quantity must be positive')
    .required('Quantity is required'),
  price_per_unit: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
});

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register New Product
        </Typography>
        <Formik
          initialValues={{
            product_name: '',
            quantity: '',
            price_per_unit: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await registerProduct(values);
              navigate('/dashboard');
            } catch (err) {
              setError('Failed to register product');
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
                  name="product_name"
                  label="Product Name"
                  value={values.product_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.product_name && Boolean(errors.product_name)}
                  helperText={touched.product_name && errors.product_name}
                />
                <TextField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />
                <TextField
                  name="price_per_unit"
                  label="Price per Unit"
                  type="number"
                  value={values.price_per_unit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price_per_unit && Boolean(errors.price_per_unit)}
                  helperText={touched.price_per_unit && errors.price_per_unit}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Register Product
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ProductRegistration;