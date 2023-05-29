import randomColor from 'randomcolor';

// Creates a layer with the right properties and structure
const createLayer = (key, name, geojson) => {
  // Add a random color
  const color = randomColor();
  // Return a layer with the right properties and structure
  return {
    key: key,
    name: name,
    geom: geojson,
    color: color,
    visibility: true,
  };
};

export default createLayer;
