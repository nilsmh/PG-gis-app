import { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Sidebar() {
  const [layers, setLayers] = useState([
    { name: 'veg', color: 'red' },
    { name: 'vann', color: 'blue' },
    { name: 'hus', color: 'green' },
  ]);

  //   const layers = ['veg', 'vann', 'hus'];
  return (
    <div
      style={{
        backgroundColor: '#ADD8E6',
        display: 'flex',
        width: '20%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>
        GIS-app
      </Typography>

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

      <Typography sx={{ marginTop: 2 }} variant="subtitle2" gutterBottom>
        Layers
      </Typography>

      {layers ? (
        <List
          sx={{
            width: '100%',
            bgcolor: '#ADD8E6',
            marginTop: -1,
          }}
        >
          <Divider />
          {layers.map((layer) => {
            return (
              <ListItem divider>
                {/* <ListItemIcon
                  sx={{
                    width: 3,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                > */}
                <VisibilityIcon
                  sx={{
                    marginRight: 2,
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                />

                {/* </ListItemIcon> */}
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: layer.color,
                    marginRight: 1,
                  }}
                />
                <ListItemText primary={layer.name} />
                <SettingsIcon
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'gray',
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      ) : null}
    </div>
  );
}
