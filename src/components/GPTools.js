import { useState, useRef, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function GPTools() {
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
        <ListItem button>
          <ListItemText primary="Buffer" />
        </ListItem>
        <Divider />
        <ListItem button divider>
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
    </div>
  );
}
