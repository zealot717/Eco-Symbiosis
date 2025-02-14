import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Industry } from '../types';

interface AuthState {
  industry: Industry | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  industry: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIndustry: (state, action: PayloadAction<Industry>) => {
      state.industry = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.industry = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setIndustry, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
