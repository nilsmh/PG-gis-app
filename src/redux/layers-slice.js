import { createSlice } from '@reduxjs/toolkit';

// Redux slice for adding, removing and updating layers
const layersSlice = createSlice({
  name: 'layers',
  initialState: [], // Set initial state (Array)
  // Reducers
  reducers: {
    // Add layer to redux store
    addLayer: (state, action) => {
      state.push(action.payload);
    },
    // Remove layer from redux store
    removeLayer: (state, action) => {
      return state.filter((layer) => layer.key !== action.payload);
    },
    // Update layer
    updateLayer: (state, action) => {
      const layerIndex = state.findIndex(
        (layer) => layer.key === action.payload.key
      );
      if (layerIndex !== -1) {
        state[layerIndex] = action.payload;
      }
    },
  },
});

// Export redux actions
export const { addLayer, removeLayer, updateLayer } = layersSlice.actions;
// Export redux reducers
export default layersSlice.reducer;
