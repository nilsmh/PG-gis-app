import { configureStore } from '@reduxjs/toolkit';
import layersReducer from './layers-slice';

const store = configureStore({
  reducer: {
    layers: layersReducer,
  },
});

export default store;
