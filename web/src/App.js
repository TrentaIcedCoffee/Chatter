import React from 'react';

import { Err, Auth, Chat } from './components';

class App extends React.Component {
  render = () => {
    return (
      <div>
        <Err />
        <Auth />
        <Chat />
      </div>
    );
  }
}

export default App;
