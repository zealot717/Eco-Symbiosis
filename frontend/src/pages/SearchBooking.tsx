import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { searchProducts, bookProduct } from '../services/api';
import { SearchResult } from '../types';
import ProductCard from '../components/Products/ProductCard';

const SearchBooking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(null);
  const [bookingQuantity, setBookingQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await searchProducts(searchTerm, Number(quantity));
      setResults(data);
      setError('');
    } catch (err) {
      setError('Failed to search products');
      setResults([]);
    }
  };

  const handleBook = async () => {
    if (!selectedProduct) return;

    try {
      await bookProduct(selectedProduct.product_id, Number(bookingQuantity));
      setSelectedProduct(null);
      setBookingQuantity('');
      // Refresh search results
      handleSearch();
    } catch (err) {
      setError('Failed to book product');
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Search Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <TextField
            label="Required Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {results.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
              <ProductCard
                product={product}
                onBook={() => setSelectedProduct(product)}
              />
            </Grid>
          ))}
        </Grid>

        <Dialog open={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)}>
          <DialogTitle>Book Product</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              value={bookingQuantity}
              onChange={(e) => setBookingQuantity(e.target.value)}
              inputProps={{ min: 1, max: selectedProduct?.quantity }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProduct(null)}>Cancel</Button>
            <Button onClick={handleBook} variant="contained">
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SearchBooking;