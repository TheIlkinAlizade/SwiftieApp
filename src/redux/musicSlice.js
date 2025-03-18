import { createSlice } from '@reduxjs/toolkit';

// Initial state for the music items
const initialState = {
  musicItems: [],
  loading: false,
  error: null,
};

// Create musicSlice to manage the state
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
    }
  }
});

// Export actions
export const { setLoading, setError, setMusicItems, addMusicItem, updateMusicItem, deleteMusicItem } = musicSlice.actions;

// Export reducer
export default musicSlice.reducer;
