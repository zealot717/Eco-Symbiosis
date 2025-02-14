import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { Product } from '../../types';

interface Props {
  open: boolean;
  product: Product;
  quantity: number;
  onClose: () => void;
}

const BookingConfirmation = ({ open, product, quantity, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Booking Confirmed</DialogTitle>
      <DialogContent>
        <Typography>
          Successfully booked {quantity} units of {product.product_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Total Cost: ${(quantity * product.price_per_unit).toFixed(2)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingConfirmation;