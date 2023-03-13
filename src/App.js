import './App.css';

import Sidebar from './components/Sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import MapView from './components/MapView';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <div
          className="App"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <MapView />
          <Sidebar />
        </div>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
