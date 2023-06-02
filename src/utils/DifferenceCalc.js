import difference from '@turf/difference';
import createLayer from './CreateLayer';
import booleanDisjoint from '@turf/boolean-disjoint';
import booleanIntersects from '@turf/boolean-intersects';
import dissolveLayers from './DissolveGeom';

// Difference calculation
const differenceCalc = (layerToCalc, nextKey) => {
  // Set empty layer
  let newDifferenceLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  // Set empty Map for intersected polygons
  const intersectionMap = new Map();

  // Dissolve the layers
  const { dissolvedLayerA, dissolvedLayerB } = dissolveLayers(
    layerToCalc.layerA,
    layerToCalc.layerB
  );

  // Loop through the first layer
  dissolvedLayerA.features.forEach((poly1) => {
    // Allocate each polygon in the Map
    intersectionMap.set(poly1, []);
    // Loop through the second layer
    dissolvedLayerB.features.forEach((poly2) => {
      // Check if the polygons intersect
      if (booleanIntersects(poly1, poly2)) {
        // Add polygon 2 to the intersection Map to the list of intersection geometries with polygon 1
        intersectionMap.get(poly1).push(poly2);
      }
    });
  });

  // Calculate the difference between each polygon in layer 1 and all the corresponding intersection polygons
  Array.from(intersectionMap.entries()).forEach(
    ([polygon, intersectingFeatures]) => {
      let diff = polygon;
      // If the polygons are completely covered, booleanOverlap does not count it,
      // the polygon will have length 0
      if (intersectingFeatures.length === 0) {
        // Need to check if the geometry is disjoint from all polygons in dissolvedLayerB,
        // then it is an outlier and needs to be included
        if (
          dissolvedLayerB.features.every((poly) =>
            booleanDisjoint(polygon, poly)
          )
        ) {
          newDifferenceLayer.features.push(polygon);
        }
      } else {
        // Calculate the difference recursivly for all intersection polygons
        for (let i = 0; i < intersectingFeatures.length; i++) {
          // Different between the polygon and all the correspoding intersection polygons
          const tempDiff = difference(diff, intersectingFeatures[i]);
          if (tempDiff) {
            diff = tempDiff;
          }
        }
        newDifferenceLayer.features.push(diff);
      }
    }
  );

  // Return a complete layer
  return createLayer(nextKey, layerToCalc.output, newDifferenceLayer);
};

export default differenceCalc;
