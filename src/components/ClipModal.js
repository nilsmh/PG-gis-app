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

const style = { ...modalStyle, height: 300 };

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export default function ClipModal({ open, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [currentLayer, setCurrentLayer] = useState({
    layersToClip: [{ name: '', geom: turf.featureCollection([]) }],
    clipLayer: turf.featureCollection([]),
  });
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    cleanCurrentLayer();
    closeModal();
  };

  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

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

  const handleChangeClippingLayer = (event) => {
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
      console.log(updatedLayer);
    }
  };

  const cleanCurrentLayer = () => {
    setCurrentLayer({
      layersToClip: [{ name: '', geom: turf.featureCollection([]) }],
      clipLayer: turf.featureCollection([]),
    });
    setSelectedLayers([]);
  };

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

  const addClipLayers = () => {
    let success = Boolean(
      currentLayer.layersToClip[0].geom.features.length &&
        currentLayer.clipLayer.features.length
    );
    switch (success) {
      case true:
        setLoading(true);
        setTimeout(() => {
          try {
            let nextKey = layers.slice(-1)[0].key + 1;
            currentLayer.layersToClip.forEach((layer) => {
              const clipLayer = clipCalc(
                layer,
                currentLayer.clipLayer,
                nextKey
              );
              if (!clipLayer) {
                setLoading(false);
                snackBarAlert(
                  `${layer.name.replace(
                    '.geojson',
                    ''
                  )} do not overlap with the clipping layer`,
                  'error'
                );
              } else {
                handleAddLayer(clipLayer);
                setLoading(false);
                snackBarAlert(
                  'Successfully created ' + currentLayer.output,
                  'success'
                );
              }
              nextKey++;
            });

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
            // MenuProps={MenuProps}
          >
            {layers.map((layer) => (
              <MenuItem
                key={layer.key}
                value={layer.key}
                disabled={layer.geom === currentLayer.clipLayer}
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
          <Select
            label="Choose a clipping layer"
            onChange={handleChangeClippingLayer}
          >
            {layers
              ? layers.map((layer) => {
                  return (
                    <MenuItem
                      disabled={
                        selectedLayers.includes(layer.key) ? true : false
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
