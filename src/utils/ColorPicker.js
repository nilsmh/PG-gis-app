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
  // Set the color from the Sketch Picker
  const [sketchPickerColor, setSketchPickerColor] = useState(layerToEdit.color); // Default color is existing color of the layer
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

  // Update the layer with the new color
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
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className="sketchpicker">
            {/* Sketch Picker */}
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
