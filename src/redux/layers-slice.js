import { createSlice } from '@reduxjs/toolkit';

const layersSlice = createSlice({
  name: 'layers',
  initialState: [],
  reducers: {
    addLayer: (state, action) => {
      state.push(action.payload);
    },
    removeLayer: (state, action) => {
      return state.filter((layer) => layer.key !== action.payload);
    },
    updateLayer: (state, action) => {
      const layerIndex = state.findIndex(
        (layer) => layer.key === action.payload.key
      );
      if (layerIndex !== -1) {
        state[layerIndex] = action.payload;
      }
    },
    getLayers: (state) => {
      return state;
    },
  },
});

export const { addLayer, removeLayer, updateLayer, getLayers } =
  layersSlice.actions;

export default layersSlice.reducer;
