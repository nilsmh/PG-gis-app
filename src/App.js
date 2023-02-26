import './App.css';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Sidebar from './components/Sidebar';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.446827);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    const attachMap = (setMap, mapContainer) => {
      if (!mapContainer.current) {
        return;
      }
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [lng, lat],
        zoom: zoom,
      });
      setMap(map);
    };

    !map && attachMap(setMap, mapContainer);
  }, [map]);

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          position: 'absolute',
          top: '0',
          bottom: '0',
          width: '80%',
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      />
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'flex-end',
          height: '100%',
          width: '100%',
        }}
      >
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
