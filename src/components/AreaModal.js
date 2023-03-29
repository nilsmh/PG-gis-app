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
import { updateLayer } from '../redux/layers-slice';
import areaCalc from '../utils/AreaCalc';
import snackBarAlert from '../utils/SnackBarAlert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 180,
  bgcolor: '#ADD8E6',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

export default function AreaModal({ open, closeModal }) {
  const [currentLayer, setCurrentLayer] = useState();
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const handleCloseModal = () => closeModal();

  // Update an existing layer in the store
  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  const handleChangeLayer = (event) => {
    if (
      event.target.value.geom.features[0].geometry.type !== 'Polygon' &&
      event.target.value.geom.features[0].geometry.type !== 'MultiPolygon'
    ) {
      snackBarAlert(
        'The layers have to be either a polygon or a multipolygon',
        'error'
      );
    } else {
      setCurrentLayer(event.target.value);
    }
  };

  const cleanCurrentLayer = () => {
    setCurrentLayer();
  };

  const validateInput = () => {
    if (!currentLayer.geom.features.length) {
      snackBarAlert('Invalid input layer. Please select a layer.', 'error');
    }
  };

  const calculateArea = () => {
    let success = Boolean(currentLayer.geom.features.length);

    switch (success) {
      case true:
        const geomArea = areaCalc(currentLayer.geom);
        if (!geomArea) {
          snackBarAlert('The layers do not overlap', 'error');
        } else {
          const updatedLayer = {
            ...currentLayer,
            geom: geomArea,
          };
          console.log(updatedLayer);
          handleUpdateLayer(updatedLayer);
          snackBarAlert(
            'Successfully calculated area for ' + currentLayer.name,
            'success'
          );
        }

        cleanCurrentLayer();
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Calculate Area
        </Typography>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 50 }}
        >
          <InputLabel>Choose a Layer</InputLabel>
          <Select label="Choose a Layer" onChange={handleChangeLayer}>
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem key={layer.key} value={layer}>
                      {layer.name}
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
            marginTop: 30,
          }}
        >
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            onClick={calculateArea}
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
