import union from '@turf/union';
import createLayer from './CreateLayer';
import booleanOverlap from '@turf/boolean-overlap';
import dissolveLayers from './DissolveGeom';

const unionCalc = (layerToCalc, nextKey) => {
  let newUnionLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  const { dissolvedLayerA, dissolvedLayerB } = dissolveLayers(
    layerToCalc.layerA,
    layerToCalc.layerB
  );

  dissolvedLayerA.features.forEach((poly1) => {
    let poly1Used = false;
    dissolvedLayerB.features.forEach((poly2) => {
      if (booleanOverlap(poly1, poly2)) {
        //Overlap
        const unions = union(poly1, poly2);
        console.log(unions);
        if (
          unions !== null &&
          newUnionLayer.features.every((poly) => !booleanOverlap(unions, poly))
        ) {
          const unionLayer = {
            type: 'Feature',
            properties: { ...poly1.properties, ...poly2.properties },
            geometry: unions.geometry,
          };
          newUnionLayer.features.push(unionLayer);
          poly1Used = true;
        }
      }
    });

    if (
      !poly1Used &&
      newUnionLayer.features.every((poly) => !booleanOverlap(poly1, poly))
    ) {
      newUnionLayer.features.push(poly1);
    }
  });

  return createLayer(nextKey, layerToCalc.output, newUnionLayer);
};

export default unionCalc;
