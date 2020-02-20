/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {NativeRouter, Switch, Route, Redirect} from 'react-router-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {userActions} from './src/store/actions';
import * as utils from './src/utils';

import Main from './src/component/pages/Main';
import Chat from './src/component/pages/Chat';

const socket = utils.socketIOClient(utils.endpoint);
socket.on('connect', () => {
  console.log('connected');
  socket.on('activeUsers', data => {
    store.dispatch(userActions.setter({activeUsers: data.activeUsers}));
  });
  socket.on('msg', data => {
    store.dispatch(userActions.pushMsg(data));
  });
});

const authStateChanged = user => dispatch => {
  if (user) {
    dispatch(userActions.setter({user: user}));
    socket.userEmail = user.email; // IM for future use
    socket.emit('addUser', {user: socket.userEmail});
  } else {
    dispatch(userActions.setter({user: user}));
    socket.emit('rmUser', {user: socket.userEmail});
  }
};

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(authStateChanged(user)));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
        {/* <Chat /> */}
        {/* <NativeRouter>
          <Switch>
            <Route exact path="/" component={StartPage} />
            <Route exact path="/Lst" component={TrapLstPage} />
            <Route exact path="/Info" component={TrapInfoPage} />
            <Redirect to="/" />
          </Switch>
        </NativeRouter> */}
      </Provider>
    );
  }
}

export default App;
