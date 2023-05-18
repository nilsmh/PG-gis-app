import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';
import * as turf from '@turf/turf';

export default function dissolveLayers(layerA, layerB = null, debug = false) {
  const flattenLayer1 = {
    type: 'FeatureCollection',
    features: [],
  };

  const flattenLayer2 = {
    type: 'FeatureCollection',
    features: [],
  };

  layerA.features.forEach((poly) => {
    if (poly.geometry.type === 'MultiPolygon') {
      const flattenedGeom = flatten(poly.geometry);
      flattenedGeom.features.forEach((flattenedPoly) => {
        flattenLayer1.features.push(flattenedPoly);
      });
    } else {
      flattenLayer1.features.push(poly);
    }
  });

  layerB.features.forEach((poly) => {
    if (poly.geometry.type === 'MultiPolygon') {
      const flattenedGeom = flatten(poly.geometry);
      flattenedGeom.features.forEach((flattenedPoly) => {
        flattenLayer2.features.push(flattenedPoly);
      });
    } else {
      flattenLayer2?.features.push(poly);
    }
  });

  const dissolvedLayerA = dissolve(flattenLayer1, { propertyName: 'type' });
  const dissolvedLayerB = dissolve(flattenLayer2, { propertyName: 'type' });

  return { dissolvedLayerA, dissolvedLayerB };
}
