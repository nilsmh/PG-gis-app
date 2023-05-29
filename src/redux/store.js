import { configureStore } from '@reduxjs/toolkit';
import layersReducer from './layers-slice';

// Global Redux Store containing all the added layers
const store = configureStore({
  reducer: {
    layers: layersReducer,
  },
});

export default store;
