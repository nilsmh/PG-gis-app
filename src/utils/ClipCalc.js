import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import getGeomType from './getGeomType';
import pointsWithinPolygon from '@turf/points-within-polygon';
import lineSplit from '@turf/line-split';
import polygonToLine from '@turf/polygon-to-line';
import isLineSegmentWithinPolygon from './isLineSegmentWithinPolygon';

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
        newClipLayer.features.push(intersect(poly1, poly2));
      });
    });
  }
  // Check if geometry is a point
  if (type === 'Point') {
    // Returns the points within the clipping layer
    newClipLayer = pointsWithinPolygon(layerToClip, clipArea);
  }
  // Check if geometry is a linestring or a multilinestring
  if (type === 'LineString' || type === 'MultiLineString') {
    // Loop throught the layer to clip
    layerToClip.geom.features.forEach((line) => {
      // Loop throught the clipping layer
      clipArea.features.forEach((poly) => {
        //Split the lines where they intersect the polygon border lines
        //Transform Polygon layer to lines.
        let splitLines = lineSplit(line, polygonToLine(poly));

        //If line does not intersect with polygon border, it is either
        //completely inside or completely outside
        if (splitLines.features.length === 0) {
          if (isLineSegmentWithinPolygon(line, clipArea)) {
            newClipLayer.features.push(line);
          }
        }

        //For all lines that intersect the polygon area, keep the parts that are inside
        splitLines.features.forEach((lineSegment) => {
          if (isLineSegmentWithinPolygon(lineSegment, clipArea)) {
            newClipLayer.features.push(lineSegment);
          }
        });
      });
    });
  }

  //Remove null or undefined features:
  newClipLayer.features = newClipLayer.features.filter((f) => f != null);

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
