import { SketchPicker, BlockPicker } from 'react-color';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateLayer } from '../redux/layers-slice';

export default function ColorPicker({ open, handleCloseDialog, layerToEdit }) {
  const [sketchPickerColor, setSketchPickerColor] = useState(layerToEdit.color);
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.layers);
  const selectedLayer = layers.find((layer) => layer.key === layerToEdit.key);

  // Update an existing layer in the store
  const handleUpdateLayer = (updatedLayer) => {
    dispatch(updateLayer(updatedLayer));
  };

  const updateLayerColor = () => {
    const color = sketchPickerColor;
    const updatedLayer = {
      ...selectedLayer,
      color: color,
    };
    handleUpdateLayer(updatedLayer);
    handleCloseDialog();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Change the color of the layer</DialogTitle>
      <DialogContent>
        <div
          className="App"
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <div className="sketchpicker">
            <SketchPicker
              onChange={(color) => {
                setSketchPickerColor(color.hex);
              }}
              color={sketchPickerColor}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={updateLayerColor}>Save</Button>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
