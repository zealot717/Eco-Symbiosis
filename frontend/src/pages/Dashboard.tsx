import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid } from '@mui/material';
import { getDashboardData } from '../services/api';
import ProductCard from '../components/Products/ProductCard';
import ModeToggle from '../components/Dashboard/ModeToggle';
import { Product } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'producer' | 'consumer'>('producer');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setProducts(data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModeChange = (newMode: 'producer' | 'consumer') => {
    setMode(newMode);
    if (newMode === 'producer') {
      navigate('/register-product');
    } else {
      navigate('/search');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <ModeToggle mode={mode} onChange={handleModeChange} />
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;