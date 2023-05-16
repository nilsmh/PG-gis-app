import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';

export default function dissolveLayers(layerA, layerB = null, debug = false) {
  const flattenLayer1 = {
    type: 'FeatureCollection',
    features: [],
  };

  const flattenLayer2 = layerB
    ? {
        type: 'FeatureCollection',
        features: [],
      }
    : null;

  layerA.features.forEach((poly) => {
    if (poly.geometry.type === 'MultiPolygon') {
      const flattenedLayer = flatten(poly.geometry);
      flattenedLayer.features.forEach((flattenedPoly) => {
        flattenLayer1.features.push(flattenedPoly);
      });
    } else {
      flattenLayer1.features.push(poly);
    }
  });

  if (layerB) {
    layerB.features.forEach((poly) => {
      if (poly.geometry.type === 'MultiPolygon') {
        const flattenedLayer = flatten(poly.geometry);
        flattenedLayer.features.forEach((flattenedPoly) => {
          flattenLayer2?.features.push(flattenedPoly);
        });
      } else {
        flattenLayer2?.features.push(poly);
      }
    });
  }
  const dissolvedLayerA = dissolve(flattenLayer1);
  const dissolvedLayerB = layerB ? dissolve(flattenLayer2) : null;

  return { dissolvedLayerA, dissolvedLayerB };
}
