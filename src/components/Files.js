import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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

export default function Files({ expanded }) {
  const [fileList, setFileList] = useState([]); // List with all the added files
  const [uploadedFileNames, setUploadedFileNames] = useState([]); // List with all the uploaded file names
  const [anchorEl, setAnchorEl] = useState(null);
  const [layerToEdit, setLayerToEdit] = useState(); // Layer to edit
  const [openEditName, setOpenEditName] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const inputRef = useRef(null);
  //Fetch layers from redux store
  const layers = useSelector((state) => state.layers);
  //Dispatch function to dispatch to redux store
  const dispatch = useDispatch();

  // Open popover
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Set layer to edit
  const handleClick = (event, layer) => {
    setLayerToEdit(layer);
    setAnchorEl(event.currentTarget);
  };

  // Close popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Close Color Picker
  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
    handleClose();
  };

  // Close edit name modal
  const handleCloseEditName = () => {
    setOpenEditName(false);
    handleClose();
  };

  //Add new layer to redux store
  const handleAddLayer = (newLayer) => {
    dispatch(addLayer(newLayer));
  };

  //Remove new layer from redux store
  const handleRemoveLayer = (layerKey) => {
    dispatch(removeLayer(layerKey));
  };

  // Update an existing layer in the redux store
  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  // Set upload file
  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // Set upload file
  const handleFileChange = (e) => {
    e.preventDefault();
    setUploadedFileNames([]); // Clear the uploaded file names list
    const selectedFiles = e.target.files; // Selected files
    // Loop through each selected file
    Array.from(selectedFiles).forEach((f) => {
      // Check if file is already uploaded
      if (layers.findIndex((l) => l.name === f.name) !== -1) {
        // Add file name to the uploaded file names list
        setUploadedFileNames((prevUploadedFileNames) => [
          ...prevUploadedFileNames,
          f.name,
        ]);
      } else {
        // Add file to the file list
        setFileList((prevFile) => [...prevFile, f]);
      }
    });
  };

  // Read the files
  const readFiles = () => {
    // Spread-operation to flatten the list of files if it exists
    const files = fileList ? [...fileList] : [];

    // Set the right key
    let key = 1;
    if (layers.length > 0) {
      key = layers.slice(-1)[0].key + 1;
    }

    // Loop through each file
    files.forEach((file) => {
      // Declear a file reader
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const fileContents = reader.result; // Fetch the result from the file reader
        // Extract the geometry from the file content
        const geojson = JSON.parse(fileContents);
        // Create a new layer from the file
        const newLayer = createLayer(key, file.name, geojson);
        // Add the new layer
        handleAddLayer(newLayer);
        key++;
      };
      reader.readAsText(file);
      setFileList([]); // Clear files list
    });
  };

  // Read the files whenever a file is upladed
  useEffect(() => {
    readFiles();
  }, [fileList]);

  // Shows an alert if file is already uploaded
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

  // Delete layer from map
  const deleteLayer = (layer) => {
    // Remove layer from redux store
    handleRemoveLayer(layer.key);
    // Remove the layer from the uploaded file names list
    setUploadedFileNames(
      uploadedFileNames.filter((l) => l.name === layer.name)
    );
    handleClose();
  };

  // Change the visibility of the layer
  const changeVisibility = (layer) => {
    const updatedLayer = {
      ...layer,
      visibility: !layer.visibility,
    };
    // Update the layer in the redux store
    handleUpdateLayer(updatedLayer);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%', margin: '10px 0px' }}>
        <Typography variant="subtitle3" gutterBottom>
          Layers
        </Typography>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '10px',
          width: '150px',
        }}
      >
        <div>
          <Typography variant="subtitle2">
            Upload your geojson files here:
          </Typography>
        </div>
        {/* Upload files */}
        <button onClick={handleUploadClick}>{'Click to select'}</button>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
      </div>
      {/* If any layers is added to the map */}
      {layers ? (
        <List
          sx={{
            width: '100%',
            maxHeight: expanded ? 205 : 545,
            overflow: 'scroll',
          }}
        >
          <Divider color="#65C492" />
          {/* Loop through all the added layers */}
          {layers.map((layer, index) => {
            return (
              <div>
                <ListItem key={index}>
                  {/* Visibility icon to change visibility */}
                  {layer.visibility ? (
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
                  ) : (
                    <VisibilityOffIcon
                      sx={{
                        marginRight: 2,
                        '&:hover': {
                          cursor: 'pointer',
                          color: 'gray',
                        },
                      }}
                      onClick={() => changeVisibility(layer)}
                    />
                  )}
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
                    primary={layer.name.split('.', 1)}
                  />
                  {/* Settings icon to change name, color or delete layer */}
                  <SettingsIcon
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        color: 'gray',
                      },
                    }}
                    onClick={(e) => handleClick(e, layer)}
                  />
                  {/* Popover with the settings options */}
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    elevation={0}
                  >
                    <div
                      style={{
                        borderRadius: '4px',
                        border: '2px solid #65C492',
                      }}
                    >
                      {/* Edit icon to change the name of the layer */}
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
                      {/* Color icon to change the color of the layer */}
                      <ColorLensIcon
                        sx={{
                          padding: '3px',
                          color: layerToEdit ? layerToEdit.color : '#ccc',
                          '&:hover': {
                            cursor: 'pointer',
                            color: layerToEdit
                              ? layerToEdit.color + '80'
                              : '#ccc',
                          },
                        }}
                        onClick={() => setOpenColorPicker(!openColorPicker)}
                      />
                      {/* Delete icon to delete the layer */}
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
                    </div>
                  </Popover>
                </ListItem>
                <Divider color="#65C492" />
              </div>
            );
          })}
        </List>
      ) : null}
      {/* Open Color Picker */}
      {openColorPicker && (
        <ColorPicker
          open={openColorPicker}
          handleClose={handleClose}
          handleCloseDialog={handleCloseColorPicker}
          layerToEdit={layerToEdit}
        />
      )}
      {/* Open name changer modal */}
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
