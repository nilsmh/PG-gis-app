import difference from '@turf/difference';
import createLayer from './CreateLayer';
import checkEqualGeometry from './CheckEqualGeometry';

const differenceCalc = (layerToCalc, nextKey) => {
  let newDifferenceLayer = {
    type: 'FeatureCollection',
    features: [],
  };

  layerToCalc.layerA.features.forEach((poly1) => {
    layerToCalc.layerB.features.forEach((poly2) => {
      newDifferenceLayer.features.push(difference(poly1, poly2));
    });
  });

  newDifferenceLayer.features = newDifferenceLayer.features.filter(
    (f) => f != null
  );
  if (
    checkEqualGeometry(
      layerToCalc.layerA.features[0].geometry.coordinates[0],
      newDifferenceLayer.features[0].geometry.coordinates[0]
    )
  ) {
    return false;
  }

  return createLayer(nextKey, layerToCalc.output, newDifferenceLayer);
};

export default differenceCalc;

// import difference from '@turf/difference';

// const differenceFunction = (currentLayer, nextKey) => {
//   let geojson1 = currentLayer.layerA;
//   let geojson2 = currentLayer.layerB;
//   let output = currentLayer.output;
//   console.log(geojson1);
//   console.log(geojson2);
//   console.log(output);
//   if (!(geojson1 && geojson2)) {
//     return 'Two geometries are required';
//   } else if (
//     geojson1.features[0].geometry.type !== 'Polygon' &&
//     geojson1.features[0].geometry.type !== 'MultiPolygon'
//   ) {
//     return 'The geometries must be of type Polygon or MultiPolygon.';
//   } else if (geojson1 === geojson2) {
//     return 'The geometries cannot be identical';
//   }

//   let newFeatures = [];

//   geojson1.features.forEach((f1, i) => {
//     let f1_temp = JSON.parse(JSON.stringify(f1));
//     geojson2.features.forEach((f2) => {
//       f1_temp = difference(f1_temp, f2);
//     });

//     newFeatures.push(f1_temp);
//   });

//   newFeatures.forEach((f, i) => {
//     geojson1.features[i] = f;
//   });

//   //Remove all null or unidentified features
//   geojson1.features = geojson1.features.filter((f) => f != null);

//   if (!geojson1.features[0]) {
//     return 'There is no geometry left after performing the difference operation. Try swapping the order';
//   }
//   return createLayer(nextKey, output, geojson1);
// };

// export default differenceFunction;
