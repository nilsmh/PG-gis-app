import React, { useState, useEffect } from 'react';
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
import snackBarAlert from '../utils/SnackBarAlert';
import featureExtractorCalc from '../utils/FeatureExtractorCalc';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import modalStyle from '../utils/modalStyle';

const style = { ...modalStyle, height: 300 };

const operations = ['=', '>', '<'];

export default function FeatureExtractor({ open, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [currentLayer, setCurrentLayer] = useState();
  const [outputName, setOutputName] = useState('');
  const [featureExtractorOption, setFeatureExtractorOption] = useState({
    name: '',
    properties: [],
  });
  const [featureExtractValues, setFeatureExtractValue] = useState({
    property: '',
    operation: '',
    value: '',
  });
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    cleanCurrentLayer();
    closeModal();
  };

  useEffect(() => {
    if (currentLayer) {
      featureExtractorOption.name = currentLayer.name;
      let updatedProps = [];
      currentLayer.geom.features.map((geom) => {
        let props = Object.keys(geom.properties);

        props.map((prop) => {
          if (
            // !featureExtractorOption.properties.includes(prop) &&
            !updatedProps.includes(prop)
          ) {
            updatedProps.push(prop);
          }
        });
      });

      setFeatureExtractorOption((prev) => ({
        ...prev,
        properties: updatedProps,
      }));
      console.log(featureExtractorOption);
    }
  }, [currentLayer]);

  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  const handleChangeLayerToEdit = (event) => {
    setCurrentLayer(event.target.value);
  };

  const handleChangeOutputName = (event) => {
    setOutputName(event.target.value);
  };

  const handleChangeExtractProperty = (e) => {
    const updatedExtractProperty = {
      ...featureExtractValues,
      property: e.target.value,
    };
    setFeatureExtractValue(updatedExtractProperty);
  };

  const handleChangeExtractOperation = (e) => {
    const updatedExtractOperation = {
      ...featureExtractValues,
      operation: e.target.value,
    };
    setFeatureExtractValue(updatedExtractOperation);
  };

  const handleChangeExtractValue = (e) => {
    const updatedExtractValue = {
      ...featureExtractValues,
      value: e.target.value,
    };
    setFeatureExtractValue(updatedExtractValue);
  };

  const cleanCurrentLayer = () => {
    setCurrentLayer();
    setOutputName('');
    setFeatureExtractorOption({
      name: '',
      properties: [],
    });
    setFeatureExtractValue({
      property: '',
      operation: '',
      value: '',
    });
  };

  const extractFeatures = () => {
    const success = Boolean(
      featureExtractValues.property &&
        featureExtractValues.operation &&
        featureExtractValues.value
    );

    switch (success) {
      case true:
        setLoading(true);
        setTimeout(() => {
          try {
            const nextKey = layers.slice(-1)[0].key + 1;
            const featureExtractedLayer = featureExtractorCalc(
              currentLayer,
              outputName,
              featureExtractValues,
              nextKey
            );
            if (!featureExtractedLayer) {
              setLoading(false);

              snackBarAlert(
                'There are no features matching your input',
                'error'
              );
            } else {
              handleAddLayer(featureExtractedLayer);
              setLoading(false);

              snackBarAlert(
                'Successfully extracted features from  ' + currentLayer.name,
                'success'
              );
              cleanCurrentLayer();
              handleCloseModal();
            }
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

  const validateInput = () => {
    if (!currentLayer) {
      snackBarAlert('Invalid input layer. Please select a layer.', 'error');
    }
    if (!outputName) {
      snackBarAlert('Invalid output name. Please type a output name.', 'error');
    }
    if (!featureExtractValues.property) {
      snackBarAlert(
        'Invalid property input. Please select a property.',
        'error'
      );
    }
    if (!featureExtractValues.operation) {
      snackBarAlert(
        'Invalid operation input. Please select a operation.',
        'error'
      );
    }
    if (!featureExtractValues.value) {
      snackBarAlert('Invalid value input. Please write a value.', 'error');
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
          <Icon icon="gis:search-feature" color="#65C492" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Feature Extractor
          </Typography>
        </div>
        <FormControl
          required
          fullWidth={true}
          style={{ marginTop: 20, height: 50 }}
        >
          <InputLabel>Choose a layer</InputLabel>
          <Select
            value={currentLayer}
            label="Choose a Layer A"
            onChange={handleChangeLayerToEdit}
          >
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
        <FormControl
          required
          fullWidth={true}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            marginTop: 20,
            height: 56,
          }}
        >
          <Select
            value={featureExtractValues.property}
            onChange={handleChangeExtractProperty}
            style={{ width: 200 }}
          >
            {featureExtractorOption.properties.map((prop, index) => {
              return (
                <MenuItem key={index} value={prop}>
                  {prop}
                </MenuItem>
              );
            })}
          </Select>
          <Select
            value={featureExtractValues.operation}
            onChange={handleChangeExtractOperation}
            style={{
              width: 100,
            }}
          >
            {operations.map((opt, index) => {
              return (
                <MenuItem key={index} value={opt}>
                  {opt}
                </MenuItem>
              );
            })}
          </Select>
          <TextField
            style={{ width: 200 }}
            value={featureExtractValues.value}
            onChange={handleChangeExtractValue}
            id="standard-basic"
          />
        </FormControl>
        <FormControl required fullWidth={true}>
          <TextField
            style={{ marginTop: 10 }}
            value={outputName}
            onChange={handleChangeOutputName}
            id="standard-basic"
            label="Outfile name"
          />
        </FormControl>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: 20,
          }}
        >
          <div>
            {loading ? (
              <CircularProgress size={30} style={{ marginRight: 10 }} />
            ) : (
              <Button
                variant="contained"
                style={{ marginRight: 10 }}
                onClick={extractFeatures}
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
