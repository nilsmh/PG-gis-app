import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer } from '../redux/layers-slice';
import * as turf from '@turf/turf';
import clipCalc from '../utils/ClipCalc';
import snackBarAlert from '../utils/SnackBarAlert';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import modalStyle from '../utils/modalStyle';

// Modal styling
const style = { ...modalStyle, height: 300 };

export default function ClipModal({ open, closeModal }) {
  const [loading, setLoading] = useState(false); //Loading calculation state
  // List of selected layer to clip
  const [selectedLayers, setSelectedLayers] = useState([]);
  // Selected layers to clip and clipping layer
  const [currentLayer, setCurrentLayer] = useState({
    layersToClip: [{ name: '', geom: turf.featureCollection([]) }],
    clipLayer: turf.featureCollection([]),
  });
  //Fetch layers from redux store
  const layers = useSelector((state) => state.layers);
  //Dispatch function to dispatch to redux store
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    cleanCurrentLayer();
    closeModal();
  };

  //Add new layer to redux store
  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  // Set layers to clip
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Temp array with selected layers
    const selectedLayersArray = value.map((layerKey) => {
      return layers.find((layer) => layer.key === layerKey);
    });

    setCurrentLayer({
      ...currentLayer,
      layersToClip: selectedLayersArray.map((layer) => ({
        name: layer.name,
        geom: layer.geom,
      })),
    });

    setSelectedLayers(value);
  };

  // Set clipping layer
  const handleChangeClippingLayer = (event) => {
    // Check if layers are of type polygon or multipolygon
    if (
      event.target.value.geom.features[0].geometry.type !== 'Polygon' &&
      event.target.value.geom.features[0].geometry.type !== 'MultiPolygon'
    ) {
      snackBarAlert(
        'The layers have to be either a polygon or a multipolygon',
        'error'
      );
    } else {
      const updatedLayer = {
        ...currentLayer,
        clipLayer: event.target.value.geom,
      };
      setCurrentLayer(updatedLayer);
    }
  };

  // Clear modal input
  const cleanCurrentLayer = () => {
    setCurrentLayer({
      layersToClip: [{ name: '', geom: turf.featureCollection([]) }],
      clipLayer: turf.featureCollection([]),
    });
    setSelectedLayers([]);
  };

  // Validate the input and return an alert if something is wrong
  const validateInput = () => {
    if (!currentLayer.layersToClip[0].geom.features.length) {
      snackBarAlert(
        'Invalid input layer. Please select layers to clip.',
        'error'
      );
    }
    if (!currentLayer.clipLayer.features.length) {
      snackBarAlert(
        'Invalid clip layer. Please select a clipping layer.',
        'error'
      );
    }
  };

  // Add new clipped layers
  const addClipLayers = () => {
    // Check if all input values are set
    let check = Boolean(
      currentLayer.layersToClip[0].geom.features.length &&
        currentLayer.clipLayer.features.length
    );
    switch (check) {
      case true:
        setLoading(true);
        setTimeout(() => {
          // Try to calculate new clipped layes
          try {
            let nextKey = layers.slice(-1)[0].key + 1; //Get next available key
            // Loop through each layer to clip
            currentLayer.layersToClip.forEach((layer) => {
              // Clip function
              const clipLayer = clipCalc(
                layer,
                currentLayer.clipLayer,
                nextKey
              );
              // Check if returned clipped layer is true
              if (!clipLayer) {
                setLoading(false);

                snackBarAlert(
                  `${layer.name.split(
                    '.',
                    1
                  )} do not overlap with the clipping layer`,
                  'error'
                );
              } else {
                handleAddLayer(clipLayer); // Add new clipped layer
                setLoading(false);
                snackBarAlert(
                  'Successfully created ' + clipLayer.name.split('.', 1),
                  'success'
                );
              }
              nextKey++; // Increment to new unique key
            });
            handleCloseModal();
          } catch (error) {
            // Handle error
            console.log(error);
            setLoading(false);
          }
        }, 1000);
        break;
      case false:
        validateInput();
        break;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Icon icon="gis:split" color="#65C492" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Clip
          </Typography>
        </div>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 50 }}
        >
          <InputLabel id="demo-multiple-checkbox-label">
            Choose layers to clip
          </InputLabel>
          {/* Select layers to clip field */}
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedLayers}
            onChange={handleChange}
            input={<OutlinedInput label="Choose layers to clip" />}
            renderValue={(selected) =>
              selected
                .map((key) => layers.find((layer) => layer.key === key).name)
                .join(', ')
            }
          >
            {/* Loop through added layers */}
            {layers.map((layer) => (
              <MenuItem
                key={layer.key}
                value={layer.key}
                disabled={layer.geom === currentLayer.clipLayer} // Disable layers that are already selected
              >
                <Checkbox checked={selectedLayers.indexOf(layer.key) > -1} />
                <ListItemText primary={layer.name.split('.', 1)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 50, height: 100 }}
        >
          <InputLabel>Choose a clipping layer</InputLabel>
          {/* Select clipping layer */}
          <Select
            label="Choose a clipping layer"
            onChange={handleChangeClippingLayer}
          >
            {/* Loop through added layers */}
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem
                      disabled={
                        selectedLayers.includes(layer.key) ? true : false
                      }
                      // Disable layers that are already selected in the select layers to clip field
                      key={layer.key}
                      value={layer}
                    >
                      {layer.name.split('.', 1)}
                    </MenuItem>
                  );
                })
              : null}
          </Select>
        </FormControl>

        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: 10,
          }}
        >
          <div>
            {loading ? (
              // Loading component
              <CircularProgress size={30} style={{ marginRight: 10 }} />
            ) : (
              <Button
                variant="contained"
                style={{ marginRight: 10 }}
                onClick={addClipLayers}
                color="success"
              >
                Calculate
              </Button>
            )}
          </div>
          <Button variant="outlined" color="error" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
