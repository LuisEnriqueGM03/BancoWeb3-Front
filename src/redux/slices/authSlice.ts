import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  username: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

const tokenFromStorage = localStorage.getItem('token');
const usernameFromStorage = localStorage.getItem('user');
const userIdFromStorage = localStorage.getItem('user_id');

const initialState: AuthState = {
  token: tokenFromStorage,
  username: usernameFromStorage,
  userId: userIdFromStorage,
  isAuthenticated: !!tokenFromStorage,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: string; userId: string }>) => {
      state.token = action.payload.token;
      state.username = action.payload.user;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', action.payload.user);
      localStorage.setItem('user_id', action.payload.userId);
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.userId = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
