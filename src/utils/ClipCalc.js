import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import getGeomType from './getGeomType';
import pointsWithinPolygon from '@turf/points-within-polygon';
import lineSplit from '@turf/line-split';
import polygonToLine from '@turf/polygon-to-line';
import isLineSegmentWithinPolygon from './isLineSegmentWithinPolygon';

const clipFunction = (layerToClip, clipArea, nextKey) => {
  if (layerToClip.length === 0 || !clipArea) {
    return 'Select layers to proceed';
  }

  let newClipLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  let type = getGeomType(layerToClip.geom);
  if (type === 'Polygon' || type === 'MultiPolygon') {
    layerToClip.geom.features.forEach((poly1) => {
      clipArea.features.forEach((poly2) => {
        newClipLayer.features.push(intersect(poly1, poly2));
      });
    });
  }
  if (type === 'Point') {
    newClipLayer = pointsWithinPolygon(layerToClip, clipArea);
  }
  if (type === 'LineString' || type === 'MultiLineString') {
    layerToClip.geom.features.forEach((line) => {
      clipArea.features.forEach((poly) => {
        //Transform Polygon layer to lines.
        //Split the lines where they intersect the polygon border lines
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

  return createLayer(
    nextKey,
    layerToClip.name.split('.', 1) + '_clip',
    newClipLayer
  );
};
export default clipFunction;
