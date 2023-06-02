import union from '@turf/union';
import createLayer from './CreateLayer';
import booleanOverlap from '@turf/boolean-overlap';
import booleanIntersects from '@turf/boolean-intersects';
import dissolve from '@turf/dissolve';
import dissolveLayers from './DissolveGeom';

// Union calculation
const unionCalc = (layerToCalc, nextKey) => {
  // Set empty layer
  let newUnionLayer = {
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
    // Declare this polygon as unused
    let poly1Used = false;
    // Loop through the second layer
    dissolvedLayerB.features.forEach((poly2) => {
      // Check if the two polygons intesect
      if (booleanIntersects(poly1, poly2)) {
        //Union between the two polygons
        const unions = union(poly1, poly2);
        // Check if the unions is not null
        if (unions !== null) {
          // Check if property type is undefined. Add the right property
          // let properties;
          // if (poly1.properties.type === 'undefined') {
          //   console.log(poly1.properties.type);
          //   properties = poly2.properties;
          // } else if (poly2.properties.type === 'undefined') {
          //   properties = poly1.properties;
          // } else {
          //   properties = { ...poly1.properties, ...poly2.properties };
          // }
          // Create an union geom
          const unionLayer = {
            type: 'Feature',
            properties: { ...poly1.properties, ...poly2.properties },
            geometry: unions.geometry,
          };
          // Add the new union geom to the union layer
          newUnionLayer.features.push(unionLayer);
          // Set polygon 1 to used
          poly1Used = true;
        }
      } else if (!poly1Used) {
        // Check if polygon is not used (no intersection between polygon 1 and polygon 2)
        // Push both polygons directly to the union layer
        newUnionLayer.features.push(poly1);
        newUnionLayer.features.push(poly2);
        // Set polygon 1 to used
        poly1Used = true;
      } else {
        newUnionLayer.features.push(poly2);
      }
    });

    // Dissolve the final union layer to remove duplicated
    const unionLayer = dissolve(newUnionLayer);
  });
  // Return a complete layer
  return createLayer(nextKey, layerToCalc.output, newUnionLayer);
};

export default unionCalc;
