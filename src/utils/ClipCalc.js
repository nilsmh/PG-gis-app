import intersect from '@turf/intersect';
import createLayer from './CreateLayer';
import getGeomType from './getGeomType';

const clipCalc = (layerToClip, clipArea, nextKey) => {
  let type = getGeomType(layerToClip.geom);

  let newClipLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  if (type === 'Polygon' || type === 'MultiPolygon') {
    layerToClip.geom.features.forEach((poly1) => {
      clipArea.features.forEach((poly2) => {
        newClipLayer.features.push(intersect(poly1, poly2));
      });
    });
  }
  if (!newClipLayer.features[0]) {
    return false;
  }

  return createLayer(nextKey, layerToClip.name + '_clipped', newClipLayer);
};

export default clipCalc;
