import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface IndustryState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: IndustryState = {
  products: [],
  loading: false,
  error: null,
};

const industrySlice = createSlice({
  name: 'industry',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.product_id === action.payload.product_id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, addProduct, updateProduct, setLoading, setError } = industrySlice.actions;
export default industrySlice.reducer;