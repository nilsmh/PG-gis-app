import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import Popover from '@mui/material/Popover';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useSelector, useDispatch } from 'react-redux';
import { addLayer, removeLayer, updateLayer } from '../redux/layers-slice';
import createLayer from '../utils/CreateLayer';
import ColorPicker from '../utils/ColorPicker';
import NameChanger from '../utils/NameChanger';

export default function Files() {
  const [fileList, setFileList] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [layerToEdit, setLayerToEdit] = useState();
  const [openEditName, setOpenEditName] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const inputRef = useRef(null);
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event, layer) => {
    setLayerToEdit(layer);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
    handleClose();
  };

  const handleCloseEditName = () => {
    setOpenEditName(false);
    handleClose();
  };

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
    readFiles();
  }, [fileList]);

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

  const deleteLayer = (layer) => {
    handleRemoveLayer(layer.key);
    setUploadedFileNames(
      uploadedFileNames.filter((l) => l.name === layer.name)
    );
    handleClose();
  };

  const changeVisibility = (layer) => {
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
            maxHeight: 220,
            overflow: 'auto',
          }}
        >
          <Divider />
          {layers.map((layer, index) => {
            return (
              <ListItem sx={{ maxWidth: 235 }} divider key={index}>
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
                    maxWidth: 10,
                    height: 10,
                    backgroundColor: layer.color,
                    marginRight: 1,
                  }}
                />
                <ListItemText
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  primary={layer.name}
                />
                <SettingsIcon
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                  onClick={(e) => handleClick(e, layer)}
                />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <EditIcon
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        color: 'gray',
                      },
                      padding: '3px',
                    }}
                    onClick={() => setOpenEditName(!openEditName)}
                  />
                  <ColorLensIcon
                    sx={{
                      padding: '3px',
                      color: layerToEdit ? layerToEdit.color : '#ccc',
                      '&:hover': {
                        cursor: 'pointer',
                        color: layerToEdit ? layerToEdit.color + '80' : '#ccc',
                      },
                    }}
                    onClick={() => setOpenColorPicker(!openColorPicker)}
                  />
                  <DeleteForeverIcon
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        color: 'gray',
                      },
                      padding: '3px',
                    }}
                    onClick={() => deleteLayer(layerToEdit)}
                  />
                </Popover>
              </ListItem>
            );
          })}
        </List>
      ) : null}
      {openColorPicker && (
        <ColorPicker
          open={openColorPicker}
          handleClose={handleClose}
          handleCloseDialog={handleCloseColorPicker}
          layerToEdit={layerToEdit}
        />
      )}
      {openEditName && (
        <NameChanger
          open={openEditName}
          handleCloseDialog={handleCloseEditName}
          layerToEdit={layerToEdit}
        />
      )}
    </div>
  );
}
