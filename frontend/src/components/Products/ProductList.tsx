import { Grid } from '@mui/material';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface Props {
  products: Product[];
  onBook?: (productId: number) => void;
}

const ProductList = ({ products, onBook }: Props) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.product_id}>
          <ProductCard 
            product={product}
            onBook={onBook ? () => onBook(product.product_id) : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;