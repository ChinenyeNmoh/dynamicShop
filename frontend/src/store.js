import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import userSliceReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: userSliceReducer,
  },
  /*This configures the middleware for the Redux store. It starts with the default middleware provided 
  by Redux Toolkit (getDefaultMiddleware) and then adds (concat) the middleware required by the apiSlice. */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;