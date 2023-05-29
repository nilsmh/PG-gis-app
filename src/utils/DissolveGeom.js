import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';

// Dissolve layers
export default function dissolveLayers(layerA, layerB = null, debug = false) {
  // Set empty layer 1
  const flattenLayer1 = {
    type: 'FeatureCollection',
    features: [],
  };
  // Set empty layer 2
  const flattenLayer2 = {
    type: 'FeatureCollection',
    features: [],
  };

  // Loop through the first layer
  layerA.features.forEach((poly) => {
    // Check if polygon is a Multipolygon, need to flatten first
    if (poly.geometry.type === 'MultiPolygon') {
      // Flatten the geometry
      const flattenedGeom = flatten(poly.geometry);
      // Loop through each polygon and add to the first layer
      flattenedGeom.features.forEach((flattenedPoly) => {
        flattenLayer1.features.push(flattenedPoly);
      });
    } else {
      // If polygon is Polygon, add polygon to the first layer
      flattenLayer1.features.push(poly);
    }
  });

  // Loop through the second layer
  layerB.features.forEach((poly) => {
    // Check if polygon is a Multipolygon, need to flatten first
    if (poly.geometry.type === 'MultiPolygon') {
      // Flatten the geometry
      const flattenedGeom = flatten(poly.geometry);
      // Loop through each polygon and add to the second layer
      flattenedGeom.features.forEach((flattenedPoly) => {
        flattenLayer2.features.push(flattenedPoly);
      });
    } else {
      // If polygon is Polygon, add polygon to the second layer
      flattenLayer2?.features.push(poly);
    }
  });

  // Dissolve both layers
  const dissolvedLayerA = dissolve(flattenLayer1, { propertyName: 'type' });
  const dissolvedLayerB = dissolve(flattenLayer2, { propertyName: 'type' });

  // Return the dissolved layers
  return { dissolvedLayerA, dissolvedLayerB };
}
