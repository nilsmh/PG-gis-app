import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import getGeomType from './getGeomType';
import pointsWithinPolygon from '@turf/points-within-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import lineSplit from '@turf/line-split';
import polygonToLine from '@turf/polygon-to-line';
import booleanCrosses from '@turf/boolean-crosses';
import booleanContains from '@turf/boolean-contains';
import booleanDisjoint from '@turf/boolean-disjoint';

// Clip function
const clipFunction = (layerToClip, clipArea, nextKey) => {
  // Set empty layer
  let newClipLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  // Get the geometry type
  let type = getGeomType(layerToClip.geom);
  // Check if geometry is a polygon or a multipolygon
  if (type === 'Polygon' || type === 'MultiPolygon') {
    // Loop throught the layer to clip
    layerToClip.geom.features.forEach((poly1) => {
      // Loop throught the clipping layer
      clipArea.features.forEach((poly2) => {
        // Add the intersection between the two polygons to the new clipped layer
        const intersection = intersect(poly1, poly2);
        if (intersection !== null) {
          newClipLayer.features.push(intersection);
        }
      });
    });
  }
  // Check if geometry is a point
  if (type === 'Point') {
    // Loop throught the layer to clip
    layerToClip.geom.features.forEach((p) => {
      // Mark point as not added
      let pointAdded = false;
      // Loop throught the clipping layer
      clipArea.features.forEach((poly) => {
        // If point is within polygon segment and not yet added
        if (booleanPointInPolygon(p, poly) && !pointAdded) {
          newClipLayer.features.push(p); //Add the point to the layer
          pointAdded = true; // Mark point as added
        }
      });
    });
  }
  // Check if geometry is a linestring or a multilinestring
  if (type === 'LineString' || type === 'MultiLineString') {
    // Loop throught the layer to clip
    layerToClip.geom.features.forEach((line) => {
      // Loop throught the clipping layer
      clipArea.features.forEach((poly) => {
        // Check if line is completely outside of clipping polygon
        if (booleanDisjoint(line, poly)) {
          return;
        }
        // Check if line intersects the clipping polygon
        if (!booleanContains(poly, line) || booleanCrosses(poly, line)) {
          let splitLines = lineSplit(line, polygonToLine(poly)); // Split line to the polygon
          // Get the line segments that are inside of the clipping polygon
          const insideSegments = splitLines.features.filter((seg) =>
            booleanContains(poly, seg)
          );
          // Add the inside line segments to the list
          newClipLayer.features.push(...insideSegments);
        } else {
          // Line is completely inside the clipping polygon
          newClipLayer.features.push(line);
        }
      });
    });
  }

  //Remove null or undefined features:
  newClipLayer.features = newClipLayer.features.filter((f) => f != null);

  // New clipped layer is empty
  if (newClipLayer.features.length === 0) {
    return null;
  }
  // Returns a completed layer
  return createLayer(
    nextKey,
    layerToClip.name.split('.', 1) + '_clip',
    newClipLayer
  );
};
export default clipFunction;
