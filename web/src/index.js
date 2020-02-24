import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as utils from './utils';
import reducer from './reducer';
import * as actions from './actions';
import App from './App';

// store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// socket
global.socket = utils.SocketIOClient(utils.endpoint + '?b64=1');
global.socket.on('connect', () => {
  console.log('connected');
  global.socket.on('err', data => console.log(data.err));
  global.socket.on('activeUsers', data => {
    store.dispatch(actions.setter({activeUsers: data.emails}));
  });
  global.socket.on('msg', data => {
    console.log(data);
    store.dispatch(actions.pushMsg(data));
  });
});

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(dispatch => {
  const prevEmail = global.socket.userEmail;
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

export default App;