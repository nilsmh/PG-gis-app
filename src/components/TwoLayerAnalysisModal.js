import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer } from '../redux/layers-slice';
import * as turf from '@turf/turf';
import differenceCalc from '../utils/DifferenceCalc';
import snackBarAlert from '../utils/SnackBarAlert';
import intersectCalc from '../utils/IntersectCalc';
import unionCalc from '../utils/UnionCalc';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import modalStyle from '../utils/modalStyle';

// Modal styling
const style = { ...modalStyle, height: 300 };

export default function GPAnalysisModal({ gpTool, open, closeModal }) {
  const [loading, setLoading] = useState(false); //Loading calculation state
  //Selected layers and output name
  const [currentLayer, setCurrentLayer] = useState({
    layerA: turf.featureCollection([]),
    layerB: turf.featureCollection([]),
    output: '',
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
  //Set first selected layer
  const handleChangeLayerA = (event) => {
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
        layerA: event.target.value.geom,
      };
      setCurrentLayer(updatedLayer);
    }
  };
  //Set second selected layer
  const handleChangeLayerB = (event) => {
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
        layerB: event.target.value.geom,
      };
      setCurrentLayer(updatedLayer);
    }
  };
  // Set output layer name
  const handleChangeOutputFile = (event) => {
    const updatedLayer = {
      ...currentLayer,
      output: event.target.value,
    };
    setCurrentLayer(updatedLayer);
  };

  // Clear modal input
  const cleanCurrentLayer = () => {
    setCurrentLayer({
      layerA: turf.featureCollection([]),
      layerB: turf.featureCollection([]),
      output: '',
    });
  };

  // Validate the input and return an alert if something is wrong
  const validateInput = () => {
    if (!currentLayer.layerA.features.length) {
      snackBarAlert('Invalid input layer A. Please select a layer.', 'error');
    }
    if (!currentLayer.layerB.features.length) {
      snackBarAlert('Invalid input layer B. Please select a layer.', 'error');
    }
    if (!currentLayer.output) {
      snackBarAlert(
        'Invalid output layer. Please give the output layer a name.',
        'error'
      );
    }
  };

  // Determine with GP calculation function to use (Intersect, Difference, Union)
  const determineCalcFunction = (layers, key) => {
    switch (gpTool) {
      case 'Intersect':
        // Returns intersected layer
        return intersectCalc(layers, key);
      case 'Difference':
        // Returns difference layer
        return differenceCalc(layers, key);
      case 'Union':
        // Returns union layer
        return unionCalc(layers, key);
    }
  };

  // Add new layer
  const addCalculatedLayer = () => {
    // Check if all input values are set
    let success = Boolean(
      currentLayer.layerA.features.length &&
        currentLayer.layerB.features.length &&
        currentLayer.output
    );
    switch (success) {
      case true:
        setLoading(true);
        setTimeout(() => {
          // Try to calculate new layer
          try {
            const nextKey = layers.slice(-1)[0].key + 1; //Get next available key
            // Determine with gp calculation to do and returned the calculated layer
            const processedLayer = determineCalcFunction(currentLayer, nextKey);
            // Check if returned calculated layer is true
            if (!processedLayer) {
              setLoading(false);
              snackBarAlert('The layers do not overlap', 'error');
            } else {
              handleAddLayer(processedLayer); // Add new calculated layer
              setLoading(false);
              snackBarAlert(
                'Successfully created ' + currentLayer.output,
                'success'
              );
            }
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
          {/* Determine with GP-tool icon to use */}
          {gpTool === 'Intersect' ? (
            <Icon icon="gis:intersection" color="#65C492" />
          ) : gpTool === 'Difference' ? (
            <Icon icon="gis:difference" color="#65C492" />
          ) : gpTool === 'Union' ? (
            <Icon icon="gis:union" color="#65C492" />
          ) : null}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {gpTool}
          </Typography>
        </div>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 50 }}
        >
          <InputLabel>Choose a Layer A</InputLabel>
          <Select label="Choose a Layer A" onChange={handleChangeLayerA}>
            {/* Loop through added layers */}
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem
                      // Disable layers that are already selected
                      disabled={
                        layer.geom === currentLayer.layerB ? true : false
                      }
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
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 30, height: 120 }}
        >
          <InputLabel>Choose a Layer B</InputLabel>
          <Select label="Choose a Layer B" onChange={handleChangeLayerB}>
            {/* Loop through added layers */}
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem
                      // Disable layers that are already selected
                      disabled={
                        layer.geom === currentLayer.layerA ? true : false
                      }
                      key={layer.key}
                      value={layer}
                    >
                      {layer.name.split('.', 1)}
                    </MenuItem>
                  );
                })
              : null}
          </Select>
          {/* Output name field */}
          <TextField
            style={{ marginTop: 10 }}
            value={currentLayer.output}
            onChange={handleChangeOutputFile}
            id="standard-basic"
            label="Outfile name"
            variant="standard"
          />
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
                onClick={addCalculatedLayer}
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
