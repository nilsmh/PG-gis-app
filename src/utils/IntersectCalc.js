import intersect from '@turf/intersect';
import createLayer from './CreateLayer';

const intersectCalc = (layerToCalc, nextKey) => {
  let newIntersectLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  layerToCalc.layerA.features.forEach((poly1) => {
    layerToCalc.layerB.features.forEach((poly2) => {
      newIntersectLayer.features.push(intersect(poly1, poly2));
    });
  });

  newIntersectLayer.features = newIntersectLayer.features.filter(
    (f) => f != null
  );
  if (!newIntersectLayer.features[0]) {
    return false;
  }
  return createLayer(nextKey, layerToCalc.output, newIntersectLayer);
};

export default intersectCalc;
