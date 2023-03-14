import difference from '@turf/difference';
import createLayer from './CreateLayer';
import checkEqualGeometry from './CheckEqualGeometry';

const differenceCalc = (layerToCalc, nextKey) => {
  let newDifferenceLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  layerToCalc.layerA.features.forEach((poly1) => {
    layerToCalc.layerB.features.forEach((poly2) => {
      newDifferenceLayer.features.push(difference(poly1, poly2));
    });
  });

  newDifferenceLayer.features = newDifferenceLayer.features.filter(
    (f) => f != null
  );
  if (
    checkEqualGeometry(
      layerToCalc.layerA.features[0].geometry.coordinates[0],
      newDifferenceLayer.features[0].geometry.coordinates[0]
    )
  ) {
    return false;
  }

  return createLayer(nextKey, layerToCalc.output, newDifferenceLayer);
};

export default differenceCalc;
