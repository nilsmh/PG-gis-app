import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import booleanOverlap from '@turf/boolean-overlap';
import booleanIntersects from '@turf/boolean-intersects';
import dissolveLayers from './DissolveGeom';

const intersectCalc = (layerToCalc, nextKey) => {
  let newIntersectLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  const { dissolvedLayerA, dissolvedLayerB } = dissolveLayers(
    layerToCalc.layerA,
    layerToCalc.layerB
  );

  dissolvedLayerA.features.forEach((poly1) => {
    dissolvedLayerB.features.forEach((poly2) => {
      if (booleanIntersects(poly1, poly2)) {
        if (
          poly1.geometry.type === 'Polygon' &&
          poly2.geometry.type === 'Polygon'
        ) {
          const intersection = intersect(poly1, poly2);
          if (
            intersection !== null &&
            newIntersectLayer.features.every(
              (poly) => !booleanOverlap(intersection, poly)
            )
          ) {
            const intersectionLayer = {
              type: 'Feature',
              properties: { ...poly1.properties, ...poly2.properties },
              geometry: intersection.geometry,
            };
            newIntersectLayer.features.push(intersectionLayer);
          }
        }
      }
    });
  });

  if (!newIntersectLayer.features[0]) {
    return false;
  }

  return createLayer(nextKey, layerToCalc.output, newIntersectLayer);
};

export default intersectCalc;
