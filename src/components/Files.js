import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import randomColor from 'randomcolor';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer, removeLayer, updateLayer } from '../redux/layers-slice';
import createLayer from '../utils/CreateLayer';

export default function Files() {
  const [fileList, setFileList] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const inputRef = useRef(null);
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();

  // Add a new layer to the store
  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  // Remove a layer from the store
  const handleRemoveLayer = (layerKey) => {
    dispatch(removeLayer(layerKey));
  };

  // Update an existing layer in the store
  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setUploadedFileNames([]);
    const selectedFiles = e.target.files;
    Array.from(selectedFiles).forEach((f) => {
      if (layers.findIndex((l) => l.name === f.name) !== -1) {
        setUploadedFileNames((prevUploadedFileNames) => [
          ...prevUploadedFileNames,
          f.name,
        ]);
      } else {
        setFileList((prevFile) => [...prevFile, f]);
      }
    });
  };

  const readFiles = () => {
    const files = fileList ? [...fileList] : [];

    console.log(files);
    let key = 1;
    if (layers.length > 0) {
      key = layers.slice(-1)[0].key + 1;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const fileContents = reader.result;
        const geojson = JSON.parse(fileContents);
        const newLayer = createLayer(key, file.name, geojson);
        handleAddLayer(newLayer);
        key++;
      };
      reader.readAsText(file);
      setFileList([]);
    });
  };

  useEffect(() => {
    if (uploadedFileNames.length === 1) {
      alert(
        `You have already uploaded this file: ${uploadedFileNames.join(', ')}`
      );
    }
    if (uploadedFileNames.length > 1) {
      alert(
        `You have already uploaded these files: ${uploadedFileNames.join(', ')}`
      );
    }
  }, [uploadedFileNames]);

  useEffect(() => {
    readFiles();
  }, [fileList]);

  const deleteLayer = (key, name) => {
    handleRemoveLayer(key, name);
    setUploadedFileNames(
      uploadedFileNames.filter((layer) => layer.name === name)
    );
  };

  const changeVisibility = (layer) => {
    console.log(layer);
    const updatedLayer = {
      ...layer,
      visibility: !layer.visibility,
    };
    handleUpdateLayer(updatedLayer);
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%' }}>
        <Typography
          sx={{ margin: '10px 0px' }}
          variant="subtitle2"
          gutterBottom
        >
          Layers
        </Typography>
        <Divider />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '10px',
          width: '150px',
        }}
      >
        <div style={{ padding: '10px 0px' }}>
          <Typography variant="subtitle3">
            Upload your geojson files here:
          </Typography>
        </div>

        <button onClick={handleUploadClick}>{'Click to select'}</button>

        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
      </div>

      {layers ? (
        <List
          sx={{
            width: '100%',
            bgcolor: '#ADD8E6',
          }}
        >
          <Divider />
          {layers.map((layer, index) => {
            return (
              <ListItem divider key={index}>
                <VisibilityIcon
                  sx={{
                    marginRight: 2,
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                  onClick={() => changeVisibility(layer)}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: layer.color,
                    marginRight: 1,
                  }}
                />
                <ListItemText primary={layer.name.replace('.geojson', '')} />
                <SettingsIcon
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                  onClick={() => deleteLayer(layer.key, layer.name)}
                />
              </ListItem>
            );
          })}
        </List>
      ) : null}
    </div>
  );
}
