import createLayer from './CreateLayer';

const featureExtractorCalc = (
  layerToExtract,
  outputName,
  featureExtractValues,
  nextKey
) => {
  let newFeatureExtractedLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  const { property, operation, value } = featureExtractValues;
  if (operation === '=') {
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) =>
        l.properties[property] ===
        (property === 'area' || property === 'mapSlopePe'
          ? parseFloat(value)
          : value)
    );
  } else if ((operation === '>' && property === 'area') || 'mapSlopePe') {
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) => l.properties[property] > parseFloat(value)
    );
  } else if ((operation === '<' && property === 'area') || 'mapSlopePe') {
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) => l.properties[property] < parseFloat(value)
    );
  }

  if (!newFeatureExtractedLayer.features.length) {
    return false;
  }

  return createLayer(nextKey, outputName, newFeatureExtractedLayer);
};

export default featureExtractorCalc;
