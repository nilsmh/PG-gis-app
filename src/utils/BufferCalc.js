import buffer from '@turf/buffer';
import createLayer from './CreateLayer';

// Buffer calculation
const bufferCalc = (layerToCalc, nextKey) => {
  // Create buffer layer
  let newBufferLayer = buffer(layerToCalc.layer, layerToCalc.distance, {
    units: 'meters',
  });
  // Check for null values
  newBufferLayer.features = newBufferLayer.features.filter((f) => f != null);
  // Returns a complete layer
  return createLayer(nextKey, layerToCalc.output, newBufferLayer);
};

export default bufferCalc;
