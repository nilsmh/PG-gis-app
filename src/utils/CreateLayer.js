import randomColor from 'randomcolor';

const createLayer = (key, name, geojson) => {
  const color = randomColor();
  return {
    key: key,
    name: name,
    geom: geojson,
    color: color,
    visibility: true,
  };
};

export default createLayer;
