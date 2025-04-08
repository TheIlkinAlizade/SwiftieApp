import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  musicItems: [],
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
    }
  }
});


export const { setLoading, setError, setMusicItems, addMusicItem, updateMusicItem, deleteMusicItem } = musicSlice.actions;


export default musicSlice.reducer;
