import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth'))
  : { userInfo: null };

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
        // Update the state with the new user credentials
      state.userInfo = action.payload;
      // Save the user to localStorage
      localStorage.setItem('auth', JSON.stringify(state)); 
    },
    deleteCredentials: (state) => {
       // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      state.auth = null;
      localStorage.clear();
      
    }
  }
});

export const { setCredentials, deleteCredentials } = userSlice.actions;
export default userSlice.reducer;
