import difference from '@turf/difference';
import createLayer from './CreateLayer';
import booleanOverlap from '@turf/boolean-overlap';
import booleanDisjoint from '@turf/boolean-disjoint';
import dissolveLayers from './DissolveGeom';

const differenceCalc = (layerToCalc, nextKey) => {
  let newDifferenceLayer = {
    type: 'FeatureCollection',
    features: [],
  };
  const intersectionMap = new Map();

  const { dissolvedLayerA, dissolvedLayerB } = dissolveLayers(
    layerToCalc.layerA,
    layerToCalc.layerB
  );

  //find all segments that intersects and allocate in map
  dissolvedLayerA.features.forEach((feature1) => {
    intersectionMap.set(feature1, []);
    dissolvedLayerB?.features.forEach((feature2) => {
      //if overlapping we add to the list of intersecting geometries
      if (booleanOverlap(feature1, feature2)) {
        intersectionMap.get(feature1).push(feature2);
      }
    });
  });

  //We compute the difference between each segment of layer 1 and all the ones it intersects with
  Array.from(intersectionMap.entries()).forEach(
    ([feature, intersectingFeatures]) => {
      let diff = feature;
      //BoleanOverlap does not count geometries completely covered,
      //therefore a geometry completely covered will have length 0
      if (intersectingFeatures.length === 0) {
        //if geometry is disjoint from all geometries in dissolvedLayerB it is an outlier and needs to be included
        if (
          dissolvedLayerB?.features.every((feat) =>
            booleanDisjoint(feature, feat)
          )
        ) {
          newDifferenceLayer.features.push(feature);
        }
      } else {
        //Compute the differnce recursive for all intersecting geometries
        for (let i = 0; i < intersectingFeatures.length; i++) {
          const tempDiff = difference(diff, intersectingFeatures[i]);
          if (tempDiff) {
            diff = tempDiff;
          }
        }
        newDifferenceLayer.features.push(diff);
      }
    }
  );

  return createLayer(nextKey, layerToCalc.output, newDifferenceLayer);
  // return differenceList;

  // layerToCalc.layerA.features.forEach((poly1) => {
  //   layerToCalc.layerB.features.forEach((poly2) => {
  //     newDifferenceLayer.features.push(difference(poly1, poly2));
  //   });
  // });

  // newDifferenceLayer.features = newDifferenceLayer.features.filter(
  //   (f) => f != null
  // );
  // if (
  //   checkEqualGeometry(
  //     layerToCalc.layerA.features[0].geometry.coordinates[0],
  //     newDifferenceLayer.features[0].geometry.coordinates[0]
  //   )
  // ) {
  //   return false;
  // }
};

export default differenceCalc;
