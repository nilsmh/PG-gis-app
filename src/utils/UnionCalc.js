import union from '@turf/union';
import createLayer from './CreateLayer';
import checkEqualGeometry from './CheckEqualGeometry';

const unionCalc = (layerToCalc, nextKey) => {
  let newUnionLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  layerToCalc.layerA.features.forEach((poly1) => {
    layerToCalc.layerB.features.forEach((poly2) => {
      newUnionLayer.features.push(union(poly1, poly2));
    });
  });

  newUnionLayer.features = newUnionLayer.features.filter((f) => f != null);
  if (!newUnionLayer.features[0]) {
    return false;
  }

  if (
    checkEqualGeometry(
      layerToCalc.layerA.features[0].geometry.coordinates[0].concat(
        layerToCalc.layerB.features[0].geometry.coordinates[0]
      ),
      newUnionLayer.features[0].geometry.coordinates[0]
        .concat(newUnionLayer.features[0].geometry.coordinates[1])
        .flat()
    )
  ) {
    return false;
  }
  return createLayer(nextKey, layerToCalc.output, newUnionLayer);
};

export default unionCalc;
