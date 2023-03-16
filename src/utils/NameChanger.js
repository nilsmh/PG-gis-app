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
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.layers);
  const selectedLayer = layers.find((layer) => layer.key === layerToEdit.key);

  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  const handleChangeLayerName = (event) => {
    setNewLayerName(event.target.value);
  };

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
