import { useState } from 'react';
import { Formik, Form } from 'formik';
import { TextField, Button, Box, Alert } from '@mui/material';
import { productValidationSchema } from '../../utils/validation';

interface Props {
  onSubmit: (values: { product_name: string; quantity: number; price_per_unit: number }) => Promise<void>;
}

const ProductForm = ({ onSubmit }: Props) => {
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={{
        product_name: '',
        quantity: '',
        price_per_unit: '',
      }}
      validationSchema={productValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit({
            ...values,
            quantity: Number(values.quantity),
            price_per_unit: Number(values.price_per_unit),
          });
          resetForm();
          setError('');
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
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Register Product
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;