import './App.css';

import Sidebar from './components/Sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import MapView from './components/MapView';
import { SnackbarProvider } from 'notistack';

// Main application function
function App() {
  return (
    // Allow snackbar feedback when creating layer
    <SnackbarProvider maxSnack={3}>
      {/* Redux store provider to access global redux start everywhere */}
      <Provider store={store}>
        <div
          className="App"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Mapbox map component */}
          <MapView />
          {/* Sidebar component */}
          <Sidebar />
        </div>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
