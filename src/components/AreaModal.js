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
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import modalStyle from '../utils/modalStyle';

const style = { ...modalStyle, height: 180 };

export default function AreaModal({ open, closeModal }) {
  const [currentLayer, setCurrentLayer] = useState();
  const [loading, setLoading] = useState(false);
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    cleanCurrentLayer();
    closeModal();
  };

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
        setLoading(true);
        setTimeout(() => {
          try {
            const geomArea = areaCalc(currentLayer.geom);
            if (!geomArea) {
              snackBarAlert('The layers do not overlap', 'error');
            } else {
              const updatedLayer = {
                ...currentLayer,
                geom: geomArea,
              };

              handleUpdateLayer(updatedLayer);
              setLoading(false);
              snackBarAlert(
                'Successfully calculated area for ' + currentLayer.name,
                'success'
              );
            }

            cleanCurrentLayer();
          } catch (error) {
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
          <Icon icon="gis:measure" color="#65C492" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Area
          </Typography>
        </div>
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
            marginTop: 30,
          }}
        >
          {loading ? (
            <CircularProgress size={30} style={{ marginRight: 10 }} />
          ) : (
            <Button
              variant="contained"
              style={{ marginRight: 10 }}
              onClick={calculateArea}
              color="success"
            >
              Calculate
            </Button>
          )}
          <Button variant="outlined" color="error" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
