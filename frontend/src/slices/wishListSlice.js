import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('wish')
  ? {wishItems : JSON.parse(localStorage.getItem('wish'))}
  : { wishItems: [] };

  
const wishSlice = createSlice({
  name: 'wish',
  initialState,
  reducers: {
    addToWish: (state, action) => {
      const item = action.payload;
      // Check if the item is already in the wishList
    const existWish = state.wishItems?.find((x) => x._id === item._id);
  
    if (!existWish) {
      // If not exists, add new item to wishItems
      state.wishItems?.push(item);
      // Save the wishList to localStorage
      localStorage.setItem('wish', JSON.stringify(state.wishItems));
    }
    },
    removeFromWish: (state, action) => {
      const itemId = action.payload;
      state.wishItems = state.wishItems?.filter(item => item._id !== itemId);
      state.wishItems.length === 0? localStorage.removeItem('wish') : localStorage.setItem('wish', JSON.stringify(state.wishItems));
    },
  },
});

export const { addToWish, removeFromWish } = wishSlice.actions;

export default wishSlice.reducer;

  