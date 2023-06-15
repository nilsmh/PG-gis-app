import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import booleanOverlap from '@turf/boolean-overlap';
import booleanIntersects from '@turf/boolean-intersects';
import dissolveLayers from './DissolveGeom';

// Intersect calculation
const intersectCalc = (layerToCalc, nextKey) => {
  // Set empty layer
  let newIntersectLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  // Dissolve the layers
  const { dissolvedLayerA, dissolvedLayerB } = dissolveLayers(
    layerToCalc.layerA,
    layerToCalc.layerB
  );

  // Loop through the first layer
  dissolvedLayerA.features.forEach((poly1) => {
    // Loop through the second layer
    dissolvedLayerB.features.forEach((poly2) => {
      // Check if the two polygons intesect
      if (booleanIntersects(poly1, poly2)) {
        // Intersection between the two polygons
        const intersection = intersect(poly1, poly2);
        // Check if intersection is not null and if the intersection area does not overlap between any already added geometries
        if (
          intersection !== null &&
          newIntersectLayer.features.every(
            (poly) => !booleanOverlap(intersection, poly)
          )
        ) {
          // Create an intersection geom
          const intersectionGeom = {
            type: 'Feature',
            properties: { ...poly1.properties, ...poly2.properties },
            geometry: intersection.geometry,
          };
          // Add the new intersection geom to the intersection layer
          newIntersectLayer.features.push(intersectionGeom);
        }
      }
      // }
    });
  });

  if (!newIntersectLayer.features[0]) {
    return false;
  }

  // Returns a completed layer
  return createLayer(nextKey, layerToCalc.output, newIntersectLayer);
};

export default intersectCalc;
