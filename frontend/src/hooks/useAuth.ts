import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setIndustry, setToken, logout } from '../store/authSlice';
import { Industry, AuthResponse } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { industry, token, loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = (authResponse: AuthResponse, industryData: Industry) => {
    dispatch(setToken(authResponse.access_token));
    dispatch(setIndustry(industryData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    industry,
    token,
    loading,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout,
  };
};