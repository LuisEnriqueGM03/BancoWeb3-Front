import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const { isAuthenticated, token, username } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return {
    isAuthenticated,
    token,
    username,
    logoutUser,
  };
};
