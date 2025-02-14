import { Card, CardContent, Typography, Button } from '@mui/material';
import { Product, SearchResult } from '../../types';

interface Props {
  product: Product | SearchResult;
  onBook?: (productId: number) => void;
}

const ProductCard = ({ product, onBook }: Props) => {
  const isSearchResult = 'distance_km' in product;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{product.product_name}</Typography>
        <Typography>Quantity: {product.quantity}</Typography>
        <Typography>Price per unit: ${product.price_per_unit}</Typography>
        {isSearchResult && (
          <Typography>
            Distance: {(product as SearchResult).distance_km.toFixed(2)} km
          </Typography>
        )}
        {onBook && (
          <Button
            variant="contained"
            onClick={() => onBook(product.product_id)}
            sx={{ mt: 2 }}
          >
            Book Product
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;