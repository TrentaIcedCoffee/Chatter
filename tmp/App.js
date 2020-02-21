import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { Provider, connect } from 'react-redux';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";

import thunk from 'redux-thunk';

import * as utils from './src/utils';
import reducer from './src/reducer';
import * as actions from './src/actions';

import { Err, Auth, Chat } from './src/components';

// dev
YellowBox.ignoreWarnings([
  'Setting a timer',
]);

// store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// socket
global.socket = utils.SocketIOClient(utils.endpoint + '?b64=1');
global.socket.on('connect', () => {
  console.log('connected');
  global.socket.on('err', data => console.log(data));
  global.socket.on('activeUsers', data => {
    store.dispatch(actions.setter({activeUsers: data.emails}));
  });
  global.socket.on('msg', data => {
    store.dispatch(actions.pushMsg(data));
  });
});

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(dispatch => {
  const prevEmail = socket.userEmail;
  const curEmail = user ? user.email : undefined;
  dispatch(actions.setter({ user: user }));
  global.socket.userEmail = curEmail;
  if (prevEmail && (!curEmail || prevEmail !== curEmail)) {
    global.socket.emit('rmUser', { email: prevEmail });
  }
  if (curEmail) {
    global.socket.userEmail = curEmail; // IM for future use
    global.socket.emit('addUser', { email: curEmail });
  }
}));

class App extends Component {
  render = () => {
    return (
      <Provider store={store}>
        <Err />
        <Auth />
        <Chat />
      </Provider>
    );
  }
}

export default App;
