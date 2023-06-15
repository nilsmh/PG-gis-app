import React from 'react';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSelector } from 'react-redux';
import getGeomType from '../utils/getGeomType';

// Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function MapView() {
  //Declare states to set mapbox map and layers
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(10.5);
  const [lat, setLat] = useState(63.39);
  const [zoom, setZoom] = useState(10.5);
  //Fetch layers from redux store
  const layers = useSelector((state) => state.layers);

  // Determine whether layer should be visible or not
  const determineVisibility = (layer) =>
    layer.visibility ? 'visible' : 'none';

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    //Declare mapbox map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });
    // Load the layers on the map
    map.on('load', () => {
      layers.forEach((layer) => {
        const sourceId = `data-geojson-${layer.key}`;
        // Add source to map
        map.addSource(sourceId, {
          type: 'geojson',
          data: layer.geom,
        });
        // Get geom type
        const type = getGeomType(layer.geom);
        //Check if the layer is a point-layer and add the layer to the map
        if (type === 'Point') {
          //Add layer
          map.addLayer({
            id: layer.key.toString(),
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-radius': 5,
              'circle-color': layer.color,
              'circle-opacity': 0.8,
            },
          });
          // Set visibility
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
          //Check if the layer is a polygon- or multipolygon-layer and add the layer to the map
        } else if (type === 'Polygon' || type === 'MultiPolygon') {
          map.addLayer({
            id: layer.key.toString(),
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': layer.color,
              'fill-opacity': 0.8,
            },
          });
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
          //Check if the layer is a linestring- or multilinestring-layer and add the layer to the map
        } else if (type === 'LineString' || type === 'MultiLineString') {
          map.addLayer({
            id: layer.key.toString(),
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': layer.color,
              'line-width': 2,
            },
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
