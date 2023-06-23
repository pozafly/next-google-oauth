import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.js';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      email: '',
      given_name: '',
      id: '',
      locale: '',
      name: '',
      picture: '',
      verified_email: false,
    },
    accessToken: undefined,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    removeUser: state => {
      state.user = {
        email: '',
        given_name: '',
        id: '',
        locale: '',
        name: '',
        picture: '',
        verified_email: false,
      };
    },
    removeAccessToken: state => {
      state.accessToken = undefined;
    },
  },
});

const tokenSelector = state => state.auth.accessToken;
export const isAuthSelector = createSelector(tokenSelector, token => !token);

export const { setUser, setAccessToken, removeUser, removeAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
