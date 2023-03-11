import { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Files from './Files';
import GPTools from './GPTools';

export default function Sidebar() {
  return (
    <div
      style={{
        backgroundColor: '#ADD8E6',
        display: 'flex',
        width: '25vw',
        height: '100vh',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>
        GIS-app
      </Typography>
      <GPTools />
      <Files />
    </div>
  );
}
