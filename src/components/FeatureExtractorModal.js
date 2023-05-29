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

// Modal styling
const style = { ...modalStyle, height: 300 };

// Feature Extractor Operations
const operations = ['=', '>', '<'];

export default function FeatureExtractor({ open, closeModal }) {
  const [loading, setLoading] = useState(false); //Loading calculation state
  const [currentLayer, setCurrentLayer] = useState();
  const [outputName, setOutputName] = useState('');
  // Name and properties of the selected layer
  const [featureExtractorOption, setFeatureExtractorOption] = useState({
    name: '',
    properties: [],
  });
  // State with property type, extract operation and extract value
  const [featureExtractValues, setFeatureExtractValue] = useState({
    property: '',
    operation: '',
    value: '',
  });
  // Fetch layers from redux store
  const layers = useSelector((state) => state.layers);
  // Dispatch function to dispatch to redux store
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    cleanCurrentLayer();
    closeModal();
  };

  // Get layer name and layer properties layer is selected
  useEffect(() => {
    if (currentLayer) {
      featureExtractorOption.name = currentLayer.name;
      let updatedProps = []; //Temp list with properties
      // Loop through each geometry to extract the properties
      currentLayer.geom.features.map((geom) => {
        let props = Object.keys(geom.properties);

        // Loop through each property and add to the temp list if not already included
        props.map((prop) => {
          if (!updatedProps.includes(prop)) {
            updatedProps.push(prop);
          }
        });
      });

      // Set properties to state
      setFeatureExtractorOption((prev) => ({
        ...prev,
        properties: updatedProps,
      }));
    }
  }, [currentLayer]);

  // Add new layer to redux store
  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  // Set selected layer
  const handleChangeCurrentLayer = (event) => {
    setCurrentLayer(event.target.value);
  };

  // Set output layer name
  const handleChangeOutputName = (event) => {
    setOutputName(event.target.value);
  };

  // Set extract property
  const handleChangeExtractProperty = (e) => {
    const updatedExtractProperty = {
      ...featureExtractValues,
      property: e.target.value,
    };
    setFeatureExtractValue(updatedExtractProperty);
  };

  // Set extract operation
  const handleChangeExtractOperation = (e) => {
    const updatedExtractOperation = {
      ...featureExtractValues,
      operation: e.target.value,
    };
    setFeatureExtractValue(updatedExtractOperation);
  };

  // Set extract value
  const handleChangeExtractValue = (e) => {
    const updatedExtractValue = {
      ...featureExtractValues,
      value: e.target.value,
    };
    setFeatureExtractValue(updatedExtractValue);
  };

  // Validate the input and return an alert if something is wrong
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

  // Clear modal input
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

  // Add new extracted layer
  const extractFeatures = () => {
    // Check if all input values are set
    const check = Boolean(
      featureExtractValues.property &&
        featureExtractValues.operation &&
        featureExtractValues.value
    );
    switch (check) {
      case true:
        setLoading(true);
        setTimeout(() => {
          // Try to extract feature layer
          try {
            const nextKey = layers.slice(-1)[0].key + 1; //Get next available key
            const featureExtractedLayer = featureExtractorCalc(
              currentLayer,
              outputName,
              featureExtractValues,
              nextKey
            ); // Feature Extractor function
            // Check if extracted layer is true
            if (!featureExtractedLayer) {
              setLoading(false);
              snackBarAlert(
                'There are no features matching your input',
                'error'
              );
            } else {
              handleAddLayer(featureExtractedLayer); // Add new extracted layer
              setLoading(false);
              snackBarAlert(
                'Successfully extracted features from  ' + currentLayer.name,
                'success'
              );
              handleCloseModal();
            }
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
            onChange={handleChangeCurrentLayer}
          >
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
          {/* Select property field */}
          <Select
            value={featureExtractValues.property}
            onChange={handleChangeExtractProperty}
            style={{ width: 200 }}
          >
            {/* Loop through and display each property */}
            {featureExtractorOption.properties.map((prop, index) => {
              return (
                <MenuItem key={index} value={prop}>
                  {prop}
                </MenuItem>
              );
            })}
          </Select>
          {/* Select operation field */}
          <Select
            value={featureExtractValues.operation}
            onChange={handleChangeExtractOperation}
            style={{
              width: 100,
            }}
          >
            {/* Loop through and display each operation */}
            {operations.map((opt, index) => {
              return (
                <MenuItem key={index} value={opt}>
                  {opt}
                </MenuItem>
              );
            })}
          </Select>
          {/* Select value field */}
          <TextField
            style={{ width: 200 }}
            value={featureExtractValues.value}
            onChange={handleChangeExtractValue}
            id="standard-basic"
          />
        </FormControl>
        <FormControl required fullWidth={true}>
          {/* Output name field */}
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
              // Loading component
              <CircularProgress size={30} style={{ marginRight: 10 }} />
            ) : (
              <Button
                variant="contained"
                style={{ marginRight: 10 }}
                onClick={extractFeatures}
                color="success"
              >
                Extract
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
