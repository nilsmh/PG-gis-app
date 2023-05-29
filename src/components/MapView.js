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
            filter: ['==', '$type', 'Point'],
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
            filter: ['==', '$type', 'Polygon'],
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
            filter: ['==', '$type', 'LineString'],
          });
          map.setLayoutProperty(
            layer.key.toString(),
            'visibility',
            determineVisibility(layer)
          );
        }
        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.on('mouseenter', layer.key.toString(), (e) => {
          // Change the cursor style as a UI indicator.
          if (e.features[0].properties.area) {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.lngLat.wrap();
            const description = e.features[0].properties.type;
            // const description =
            //   'Type dyr: ' +
            //   e.features[0].properties.type +
            //   '<br />' +
            //   'Areal: ' +
            //   e.features[0].properties.area.toFixed() / 1000000 +
            //   '\u33A2';
            // +
            // 'Antall observasjoner: ' +
            // e.features[0].properties.observasjoner;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup.setLngLat(coordinates).setHTML(description).addTo(map);
          }
        });

        map.on('mouseleave', layer.key.toString(), () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
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
