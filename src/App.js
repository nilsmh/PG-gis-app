import './App.css';

import Sidebar from './components/Sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import MapView from './components/MapView';

function App() {
  return (
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
        {/* <div
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'flex-end',
            height: '100%',
            width: '100%',
          }}
        >
          
        </div> */}
      </div>
    </Provider>
  );
}

export default App;
