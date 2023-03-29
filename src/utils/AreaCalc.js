import * as turf from '@turf/turf';

const areaCalc = (layer) => {
  let updatedLayerWithArea = {
    type: 'FeatureCollection',
    features: [],
  };

  layer.features.map((geom) => {
    let polygon = turf.polygon(geom.geometry.coordinates);
    let area = turf.area(polygon);
    let properties = Object.assign({}, geom.properties, { area: area });

    updatedLayerWithArea.features.push({
      type: 'Feature',
      geometry: geom.geometry,
      properties: properties,
    });
  });

  return updatedLayerWithArea;
};
export default areaCalc;
