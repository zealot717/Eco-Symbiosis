import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (industry_id: number, password: string) => {
  const formData = new FormData();
  formData.append('username', industry_id.toString());
  formData.append('password', password);
  const response = await api.post('/login', formData);
  return response.data;
};

export const signup = async (industryData: any) => {
  const response = await api.post('/signup', industryData);
  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const searchProducts = async (name: string, quantity: number) => {
  const response = await api.get('/search_products', {
    params: { product_name: name, required_quantity: quantity },
  });
  return response.data;
};

export const bookProduct = async (productId: number, quantity: number) => {
  const response = await api.post('/book_product', {
    product_id: productId,
    quantity_requested: quantity,
  });
  return response.data;
};

export const registerProduct = async (productData: any) => {
  const response = await api.post('/register_product', productData);
  return response.data;
};