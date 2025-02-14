import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import { Product } from '../../types';

interface Props {
  products: Product[];
}

const ProducerMode = ({ products }: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Your Registered Products</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/register-product')}
        >
          Register New Product
        </Button>
      </Box>
      <ProductList products={products} />
    </Box>
  );
};

export default ProducerMode;