import { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Files from './Files';
import GPTools from './GPTools';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const handleChangeExpanded = () => {
    setExpanded(!expanded);
  };
  return (
    <div
      style={{
        backgroundColor: '#65C492',
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
      <GPTools changeExpandedList={handleChangeExpanded} />
      <Files expanded={expanded} />
    </div>
  );
}
