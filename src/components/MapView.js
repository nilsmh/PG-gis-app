import React from 'react';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.446827);
  const [zoom, setZoom] = useState(12);
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const [pointLayers, setPointLayers] = useState(turf.featureCollection([]));
  const [lineLayers, setLineLayers] = useState(turf.featureCollection([]));
  const [polygonLayers, setPolygonLayers] = useState(
    turf.featureCollection([])
  );

  const determineVisibility = (layer) => {
    return layer.visibility ? 'visible' : 'none';
  };

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });
    map.on('load', () => {
      layers.forEach((layer) => {
        if (
          layer.geom.features[0].geometry.type === 'Polygon' ||
          layer.geom.features[0].geometry.type === 'MultiPolygon'
        ) {
          map.addLayer({
            id: layer.key.toString(),
            type: 'fill',
            source: {
              type: 'geojson',
              data: layer.geom,
            },
            paint: {
              'fill-color': layer.color,
              'fill-opacity': 0.8,
            },
          });
          map.setLayoutProperty(
            layer.key,
            'visibility',
            determineVisibility(layer)
          );
        }
        return () => {
          map.remove();
        };
      });
    });
  }, [layers, map]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
      }}
    >
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          position: 'absolute',
          width: '80vw',
          height: '100%',
        }}
      />
    </div>
  );
}
