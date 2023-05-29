import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { updateLayer } from '../redux/layers-slice';

export default function NameChanger({ open, handleCloseDialog, layerToEdit }) {
  const [newLayerName, setNewLayerName] = useState('');
  //Fetch layers from redux store
  const layers = useSelector((state) => state.layers);
  //Dispatch function to dispatch to redux store
  const dispatch = useDispatch();
  // Find the right layer to edit
  const selectedLayer = layers.find((layer) => layer.key === layerToEdit.key);

  // Update the layer in the redux store
  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  // Set the new name for the layer
  const handleChangeLayerName = (event) => {
    setNewLayerName(event.target.value);
  };

  // Update the layer with the new name
  const updateLayerName = () => {
    const name = newLayerName;
    const updatedLayer = {
      ...selectedLayer,
      name: name,
    };
    handleUpdateLayer(updatedLayer);
    handleCloseDialog();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Change the name of the layer</DialogTitle>
      <DialogContent>
        {/* New name field */}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="name"
          fullWidth
          variant="standard"
          onChange={handleChangeLayerName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={updateLayerName}>Save</Button>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
