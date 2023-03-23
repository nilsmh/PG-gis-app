import React from 'react';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import getGeomType from '../utils/getGeomType';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function MapView() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(10.421906);
  const [lat, setLat] = useState(63.446827);
  const [zoom, setZoom] = useState(12);
  const layers = useSelector((state) => state.layers);

  const determineVisibility = (layer) =>
    layer.visibility ? 'visible' : 'none';

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
        const sourceId = `data-geojson-${layer.key}`;
        map.addSource(sourceId, {
          type: 'geojson',
          data: layer.geom,
        });
        const type = getGeomType(layer.geom);
        if (type === 'Point') {
          map.addLayer({
            id: layer.key.toString(),
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-radius': 5,
              'circle-color': layer.color,
              'circle-opacity': 0.8,
            },
            filter: ['==', '$type', 'Point'],
          });
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
        } else if (type === 'Polygon' || type === 'MultiPolygon') {
          map.addLayer({
            id: layer.key.toString(),
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': layer.color,
              'fill-opacity': 0.8,
            },
            filter: ['==', '$type', 'Polygon'],
          });
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
        } else if (type === 'LineString' || type === 'MultiLineString') {
          map.addLayer({
            id: layer.key.toString(),
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': layer.color,
              'line-width': 2,
            },
            filter: ['==', '$type', 'LineString'],
          });
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
        }
      });
      return () => {
        map.remove();
      };
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
