import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BufferModal from './BufferModal';
import TwoLayerAnalysisModal from './TwoLayerAnalysisModal';
import ClipModal from './ClipModal';
import FeatureExtractor from './FeatureExtractorModal';
import AreaModal from './AreaModal';
import { Icon } from '@iconify/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const tools = [
  { tool: 'buffer', name: 'Buffer', icon: 'buffer' },
  { tool: 'intersect', name: 'Intersect', icon: 'intersection' },
  { tool: 'difference', name: 'Difference', icon: 'difference' },
  {
    tool: 'featureExtractor',
    name: 'Feature Extractor',
    icon: 'search-feature',
  },
  { tool: 'union', name: 'Union', icon: 'union' },
  { tool: 'clip', name: 'Clip', icon: 'split' },
  { tool: 'area', name: 'Area', icon: 'measure' },
];

export default function GPTools({ changeExpandedList }) {
  const [openModal, setOpenModal] = useState({
    buffer: false,
    intersect: false,
    difference: false,
    featureExtractor: false,
    union: false,
    clip: false,
    area: false,
  });
  const [GPTool, setGPtool] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  function toggleList() {
    changeExpandedList();
    setIsExpanded(!isExpanded);
  }

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
        setOpenModal({
          ...openModal,
          clip: true,
        });
        break;
      case tools[6].tool:
        setOpenModal({
          ...openModal,
          area: true,
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
        break;
      case tools[6].tool:
        setOpenModal({
          ...openModal,
          area: false,
        });
        break;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxHeight: '70vh',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
        }}
      >
        <Typography variant="subtitle3" gutterBottom>
          Geo-processing tools
        </Typography>
        {isExpanded ? (
          <ExpandMoreIcon onClick={toggleList} />
        ) : (
          <ExpandLessIcon onClick={toggleList} />
        )}
      </div>
      {isExpanded && (
        <List
          sx={{
            width: '100%',
            maxWidth: '20vw',
            marginBottom: 2,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-out',
            maxHeight: '0px', // initially set to 0
          }}
          ref={(el) => {
            // get the height of the list when it's expanded and set the max-height property
            if (el && isExpanded) {
              el.style.maxHeight = el.scrollHeight + 'px';
            }
          }}
        >
          <Divider color="#65C492" />
          {tools.map((tool) => {
            return (
              <div>
                <ListItem
                  button
                  value={tool.tool}
                  onClick={() => handleOpenModal(tool.tool)}
                >
                  <Icon icon={'gis:' + tool.icon} color="#65C492" />
                  <ListItemText
                    primary={tool.name}
                    sx={{ marginLeft: '5px' }}
                  />
                </ListItem>
                <Divider color="#65C492" />
              </div>
            );
          })}
        </List>
      )}
      <BufferModal
        open={openModal.buffer}
        closeModal={() => handleCloseModal('buffer')}
      />
      <TwoLayerAnalysisModal
        gpTool={GPTool}
        open={openModal[GPTool.toLocaleLowerCase()]}
        closeModal={() => handleCloseModal(GPTool.toLocaleLowerCase())}
      />
      <FeatureExtractor
        open={openModal.featureExtractor}
        closeModal={() => handleCloseModal('featureExtractor')}
      />
      <ClipModal
        open={openModal.clip}
        closeModal={() => handleCloseModal('clip')}
      />
      <AreaModal
        open={openModal.area}
        closeModal={() => handleCloseModal('area')}
      />
    </div>
  );
}
