import React from 'react';
import buffer from '@turf/buffer';
import createLayer from './CreateLayer';

const bufferCalc = (layerToCalc, nextKey) => {
  let newBufferLayer = buffer(layerToCalc.layer, layerToCalc.distance, {
    units: 'meters',
  });
  newBufferLayer.features = newBufferLayer.features.filter((f) => f != null);
  return createLayer(nextKey, layerToCalc.output, newBufferLayer);
};

export default bufferCalc;
