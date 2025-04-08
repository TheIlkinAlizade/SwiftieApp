import { configureStore } from '@reduxjs/toolkit';
import musicReducer from './musicSlice';

// Set up the Redux store
const store = configureStore({
  reducer: {
    music: musicReducer
  }
});

export default store;
