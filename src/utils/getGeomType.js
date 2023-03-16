export default function getGeomType(geom) {
  return geom.features[0].geometry.type;
}
