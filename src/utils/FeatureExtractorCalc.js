import createLayer from './CreateLayer';

const featureExtractorCalc = (
  layerToExtract,
  featureExtractValues,
  nextKey
) => {
  let newFeatureExtractedLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  const { property, operation, value } = featureExtractValues;
  if (operation === 'equals') {
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) => l.properties[property] === value
    );
  }

  if (!newFeatureExtractedLayer.features.length) {
    return false;
  }

  return createLayer(
    nextKey,
    layerToExtract.name + '_extracted',
    newFeatureExtractedLayer
  );
};

export default featureExtractorCalc;
