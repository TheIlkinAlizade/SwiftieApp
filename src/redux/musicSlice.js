import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  musicItems: [],
  cartItems: [],
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setMusicItems: (state, action) => {
      state.musicItems = action.payload;
      state.loading = false;
    },
    addMusicItem: (state, action) => {
      state.musicItems.push(action.payload);
    },
    updateMusicItem: (state, action) => {
      const index = state.musicItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.musicItems[index] = action.payload;
      }
    },
    deleteMusicItem: (state, action) => {
      state.musicItems = state.musicItems.filter(item => item.id !== action.payload);
    },

    // 🛒 Cart-related actions
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    }
  }
});

export const {
  setLoading,
  setError,
  setMusicItems,
  addMusicItem,
  updateMusicItem,
  deleteMusicItem,
  setCartItems,
  addToCart,
  removeFromCart,
  clearCart
} = musicSlice.actions;

export default musicSlice.reducer;
