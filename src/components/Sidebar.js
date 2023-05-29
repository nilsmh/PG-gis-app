import { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Files from './Files';
import GPTools from './GPTools';

export default function Sidebar() {
  // State to determine whether the files section should be expanded or not
  const [expanded, setExpanded] = useState(true);

  // Set expand files section
  const handleChangeExpanded = () => {
    setExpanded(!expanded);
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '25vw',
        height: '100vh',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom color="#65C492">
        GIS-App
      </Typography>
      {/* Component with the different GP-tools */}
      <GPTools changeExpandedList={handleChangeExpanded} />
      {/* Component with all the files */}
      <Files expanded={expanded} />
    </div>
  );
}
