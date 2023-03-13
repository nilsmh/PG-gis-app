import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BufferModal from './BufferModal';
import IntersectModal from './IntersectModal';

export default function GPTools() {
  const [openModal, setOpenModal] = useState({
    buffer: false,
    intersect: false,
    difference: false,
    featureExtractor: false,
  });

  const handleOpenModal = (modalType) => {
    // console.log(event.target.value);
    switch (modalType) {
      case 'buffer':
        setOpenModal({
          ...openModal,
          buffer: true,
        });
        break;
      case 'intersect':
        setOpenModal({
          ...openModal,
          intersect: true,
        });
        break;
    }
  };

  const handleCloseModal = (modalType) => {
    switch (modalType) {
      case 'buffer':
        setOpenModal({
          ...openModal,
          buffer: false,
        });
        break;
      case 'intersect':
        setOpenModal({
          ...openModal,
          intersect: false,
        });
        break;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '70vh',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Geo-processing tools
      </Typography>

      <List
        sx={{
          width: '100%',
          bgcolor: '#ADD8E6',
          marginTop: -1,
        }}
      >
        <Divider />
        <ListItem
          button
          value="buffer"
          onClick={() => handleOpenModal('buffer')}
        >
          <ListItemText primary="Buffer" />
        </ListItem>
        <Divider />
        <ListItem
          button
          divider
          value="intersect"
          onClick={() => handleOpenModal('intersect')}
        >
          <ListItemText primary="Intersection" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Difference" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Feature Extractor" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Area" />
        </ListItem>
        <Divider />
      </List>
      <BufferModal
        open={openModal.buffer}
        closeModal={() => handleCloseModal('buffer')}
      />
      <IntersectModal
        open={openModal.intersect}
        closeModal={() => handleCloseModal('intersect')}
      />
    </div>
  );
}
