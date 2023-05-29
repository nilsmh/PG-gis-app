import createLayer from './CreateLayer';

// Feature Extractor
const featureExtractorCalc = (
  layerToExtract,
  outputName,
  featureExtractValues,
  nextKey
) => {
  // Set empty layer
  let newFeatureExtractedLayer = {
    type: 'FeatureCollection',
    features: [],
  };
  // Deconstruct feature extract values into property, operation and value
  const { property, operation, value } = featureExtractValues;
  // Check which operation to perform
  if (operation === '=') {
    // Filter all geometries that contains the right property value
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) =>
        l.properties[property] ===
        (property === 'area' ? parseFloat(value) : value) // Check if property equals 'area' to parse into a float
    );
  } else if (operation === '>') {
    // Filter all geometries that contains the right property value
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) => l.properties[property] > parseFloat(value)
    );
  } else if (operation === '<') {
    // Filter all geometries that contains the right property value
    newFeatureExtractedLayer.features = layerToExtract.geom.features.filter(
      (l) => l.properties[property] < parseFloat(value)
    );
  }

  // Check if new extracted layers is not empty
  if (!newFeatureExtractedLayer.features.length) {
    return false;
  }

  // Return a complete layer
  return createLayer(nextKey, outputName, newFeatureExtractedLayer);
};

export default featureExtractorCalc;
