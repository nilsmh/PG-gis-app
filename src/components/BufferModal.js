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
import { useSnackbar } from 'notistack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 300,
  bgcolor: '#ADD8E6',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

export default function BufferModal({ open, closeModal }) {
  const { enqueueSnackbar } = useSnackbar();
  const [invalidDistance, setInvalidDistance] = useState(false);
  const [currentLayer, setCurrentLayer] = useState({
    layer: {
      name: '',
      geom: turf.featureCollection([]),
    },
    distance: 0,
    output: '',
  });
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const handleCloseModal = () => closeModal();

  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  const handleChangeCurrentLayer = (event) => {
    const updatedLayer = {
      ...currentLayer,
      layer: event.target.value.geom,
    };
    setCurrentLayer(updatedLayer);
  };

  const handleChangeDistance = (event) => {
    const regex = /^[0-9\b]+$/;
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

  const handleChangeOutputFile = (event) => {
    const updatedLayer = {
      ...currentLayer,
      output: event.target.value,
    };
    setCurrentLayer(updatedLayer);
  };

  const addBufferLayer = () => {
    let success = Boolean(
      currentLayer.layer.features.length &&
        !invalidDistance &&
        currentLayer.output
    );
    switch (success) {
      case true:
        const nextKey = layers.slice(-1)[0].key + 1;
        const bufferLayer = bufferCalc(currentLayer, nextKey);
        handleAddLayer(bufferLayer);
        enqueueSnackbar('Successfully created ' + currentLayer.output, {
          variant: 'success',
        });
        setCurrentLayer({
          layer: turf.featureCollection([]),
          distance: 0,
          output: '',
        });
        break;
      case false:
        if (!currentLayer.layer.features.length) {
          enqueueSnackbar('Invalid input layer. Please select a layer.', {
            variant: 'error',
          });
        }
        if (invalidDistance || !currentLayer.distance) {
          enqueueSnackbar('Invalid distance. Only numbers allow.', {
            variant: 'error',
          });
        }
        if (!currentLayer.output) {
          enqueueSnackbar(
            'Invalid output layer. Please give the output layer a name.',
            {
              variant: 'error',
            }
          );
        }
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Buffer
        </Typography>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 200 }}
        >
          <InputLabel>Choose a Layer</InputLabel>
          <Select label="Choose a Layer" onChange={handleChangeCurrentLayer}>
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem key={layer.key} value={layer}>
                      {layer.name.replace('.geojson', '')}
                    </MenuItem>
                  );
                })
              : null}
          </Select>
          <TextField
            error={invalidDistance}
            onChange={handleChangeDistance}
            style={{ marginTop: 10, width: '20%' }}
            id="standard-basic"
            label="Distance [m]"
            variant="standard"
          />
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
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            onClick={addBufferLayer}
          >
            Calculate
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
