export default function getGeomType(layer) {
  return layer.features[0].geometry.type;
}
