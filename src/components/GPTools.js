import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BufferModal from './BufferModal';
import GPAnalysisModal from './GPAnalysisModal';

const tools = [
  { tool: 'buffer', name: 'Buffer' },
  { tool: 'intersect', name: 'Intersect' },
  { tool: 'difference', name: 'Difference' },
  { tool: 'featureExtractor', name: 'Feature Extractor' },
  { tool: 'union', name: 'Union' },
  { tool: 'clip', name: 'Clip' },
];

export default function GPTools() {
  const [openModal, setOpenModal] = useState({
    buffer: false,
    intersect: false,
    difference: false,
    featureExtractor: false,
    union: false,
    clip: false,
  });
  const [GPTool, setGPtool] = useState('');

  const handleOpenModal = (modalType) => {
    switch (modalType) {
      case tools[0].tool:
        setOpenModal({
          ...openModal,
          buffer: true,
        });
        break;
      case tools[1].tool:
        setGPtool(tools[1].name);
        setOpenModal({
          ...openModal,
          intersect: true,
        });
        break;
      case tools[2].tool:
        setGPtool(tools[2].name);
        setOpenModal({
          ...openModal,
          difference: true,
        });

        break;
      case tools[3].tool:
        setOpenModal({
          ...openModal,
          featureExtractor: true,
        });
        break;
      case tools[4].tool:
        setGPtool(tools[4].name);
        setOpenModal({
          ...openModal,
          union: true,
        });
        break;
      case tools[5].tool:
        setGPtool(tools[5].name);
        setOpenModal({
          ...openModal,
          clip: true,
        });
        break;
    }
  };

  const handleCloseModal = (modalType) => {
    switch (modalType) {
      case tools[0].tool:
        setOpenModal({
          ...openModal,
          buffer: false,
        });
        break;
      case tools[1].tool:
        setOpenModal({
          ...openModal,
          intersect: false,
        });
        setGPtool('');
        break;
      case tools[2].tool:
        setOpenModal({
          ...openModal,
          difference: false,
        });
        setGPtool('');
        break;
      case tools[3].tool:
        setOpenModal({
          ...openModal,
          featureExtractor: false,
        });
        setGPtool('');
        break;
      case tools[4].tool:
        setOpenModal({
          ...openModal,
          union: false,
        });
        setGPtool('');
        break;
      case tools[5].tool:
        setOpenModal({
          ...openModal,
          clip: false,
        });
        setGPtool('');
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
          marginBottom: 2,
        }}
      >
        <Divider />
        {tools.map((tool) => {
          return (
            <ListItem
              button
              divider
              value={tool.tool}
              onClick={() => handleOpenModal(tool.tool)}
            >
              <ListItemText primary={tool.name} />
            </ListItem>
          );
        })}
      </List>
      <BufferModal
        open={openModal.buffer}
        closeModal={() => handleCloseModal('buffer')}
      />
      <GPAnalysisModal
        gpTool={GPTool}
        open={openModal[GPTool.toLocaleLowerCase()]}
        closeModal={() => handleCloseModal(GPTool.toLocaleLowerCase())}
      />
    </div>
  );
}
