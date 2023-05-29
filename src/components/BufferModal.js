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
import bufferCalc from '../utils/BufferCalc';
import snackBarAlert from '../utils/SnackBarAlert';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import modalStyle from '../utils/modalStyle';

//Modal styling
const style = { ...modalStyle, height: 300 };

export default function BufferModal({ open, closeModal }) {
  const [loading, setLoading] = useState(false); //Loading calculation state
  const [invalidDistance, setInvalidDistance] = useState(false);
  // Selected layer, distance and output name
  const [currentLayer, setCurrentLayer] = useState({
    layer: turf.featureCollection([]),
    distance: 0,
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

  //Set selected layer
  const handleChangeCurrentLayer = (event) => {
    const updatedLayer = {
      ...currentLayer,
      layer: event.target.value.geom,
    };
    setCurrentLayer(updatedLayer);
  };

  //Set buffer distance
  const handleChangeDistance = (event) => {
    const regex = /^[0-9\b]+$/;
    //Chech that input value only consists of numbers
    if (regex.test(event.target.value)) {
      setInvalidDistance(false);
      const updatedLayer = {
        ...currentLayer,
        distance: event.target.value,
      };
      setCurrentLayer(updatedLayer);
    } else {
      setInvalidDistance(true);
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

  // Validate the input and return an alert if something is wrong
  const validateInput = () => {
    if (!currentLayer.layer.features.length) {
      snackBarAlert('Invalid input layer. Please select a layer.', 'error');
    }
    if (invalidDistance || !currentLayer.distance) {
      snackBarAlert('Invalid distance. Only numbers allow.', 'error');
    }
    if (!currentLayer.output) {
      snackBarAlert(
        'Invalid output layer. Please give the output layer a name.',
        'error'
      );
    }
  };

  // Clear modal input
  const cleanCurrentLayer = () => {
    setCurrentLayer({
      layer: turf.featureCollection([]),
      distance: 0,
      output: '',
    });
  };

  // Add new buffer layer
  const addBufferLayer = () => {
    // Check if all input values are set
    let check = Boolean(
      currentLayer.layer.features.length &&
        !invalidDistance &&
        currentLayer.output
    );
    switch (check) {
      case true:
        setLoading(true);
        setTimeout(() => {
          // Try to calculate buffer
          try {
            const nextKey = layers.slice(-1)[0].key + 1; //Get next available key
            const bufferLayer = bufferCalc(currentLayer, nextKey); //Buffer calculation function
            handleAddLayer(bufferLayer); //Add buffer layer
            setLoading(false);
            snackBarAlert(
              'Successfully created ' + currentLayer.output,
              'success'
            );
            handleCloseModal();
          } catch (error) {
            //Handle error
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
          <Icon icon="gis:buffer" color="#65C492" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Buffer
          </Typography>
        </div>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 200 }}
        >
          <InputLabel>Choose a Layer</InputLabel>
          <Select label="Choose a Layer" onChange={handleChangeCurrentLayer}>
            {/* Loop through added layers */}
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem key={layer.key} value={layer}>
                      {layer.name.split('.', 1)}
                    </MenuItem>
                  );
                })
              : null}
          </Select>
          {/* Distance input field */}
          <TextField
            error={invalidDistance}
            onChange={handleChangeDistance}
            style={{ marginTop: 10, width: '20%' }}
            id="standard-basic"
            label="Distance [m]"
            variant="standard"
          />
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
                onClick={addBufferLayer}
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
