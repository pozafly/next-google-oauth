import { combineReducers } from '@reduxjs/toolkit';
import auth from '@/store/slices/authSlice.js';

const reducer = combineReducers({
  auth,
});

export default reducer;
