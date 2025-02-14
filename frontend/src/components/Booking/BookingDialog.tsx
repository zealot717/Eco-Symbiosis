import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Product } from '../../types';

interface Props {
  open: boolean;
  product: Product | null;
  quantity: string;
  onQuantityChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingDialog = ({ open, product, quantity, onQuantityChange, onClose, onConfirm }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Book Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          inputProps={{ 
            min: 1, 
            max: product?.quantity 
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;