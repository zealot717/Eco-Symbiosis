import * as Yup from 'yup';
import { INDUSTRY_TYPES } from './constants';

export const productValidationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  quantity: Yup.number()
    .positive('Quantity must be positive')
    .required('Quantity is required'),
  price_per_unit: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
});

export const industryValidationSchema = Yup.object({
  industry_name: Yup.string().required('Industry name is required'),
  industry_type: Yup.string()
    .oneOf(INDUSTRY_TYPES)
    .required('Industry type is required'),
  contact_number: Yup.string().required('Contact number is required'),
  latitude: Yup.number().required('Latitude is required'),
  longitude: Yup.number().required('Longitude is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});