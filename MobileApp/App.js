/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {YellowBox} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {userActions} from './src/store/actions';
import * as utils from './src/utils';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './src/component/pages/Main';
import Chat from './src/component/pages/Chat';
import Profile from './src/component/pages/Profile';

// Config
YellowBox.ignoreWarnings(['Setting a timer']);

// Socket Connect
global.socket = utils.SocketIOClient(utils.endpoint + '?b64=1');
global.socket.on('connect', () => {
  console.log('connected');
  global.socket.on('err', data => console.log('error from server', data.err));
  global.socket.on('activeUsers', data => {
    store.dispatch(userActions.setter({activeUsers: data.emails}));
  });
  global.socket.on('msg', data => {
    store.dispatch(userActions.pushMsg(data.pkg));
  });
});

// firebase auth
utils.auth.onAuthStateChanged(user =>
  store.dispatch(dispatch => {
    const prevEmail = socket.userEmail;
    const curEmail = user ? user.email : undefined;
    dispatch(userActions.setter({user: user}));
    global.socket.userEmail = curEmail;
    if (prevEmail && (!curEmail || prevEmail !== curEmail)) {
      global.socket.emit('rmUser', {email: prevEmail});
    }
    if (curEmail) {
      global.socket.userEmail = curEmail; // IM for future use
      global.socket.emit('addUser', {email: curEmail});
    }
  }),
);

// Navigator
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={Main} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
