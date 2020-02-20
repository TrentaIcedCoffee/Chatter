import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Provider, connect } from 'react-redux';

import * as utils from './src/utils';
import * as reducers from './src/reducers';
import * as actions from './src/actions';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";

import thunk from 'redux-thunk';

const store = createStore(
  combineReducers({
    ...reducers
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

import SocketIOClient from 'socket.io-client'

const socket = SocketIOClient(utils.endpoint + '?b64=1');
// TODO failed to connect & no warning
socket.on('connect', () => {
  console.log('connected');
  socket.on('activeUsers', data => {
    store.dispatch(actions.setter({activeUsers: data.emails}));
  });
  socket.on('msg', data => {
    store.dispatch(actions.pushMsg(data));
  });
});

const authStateChanged = user => dispatch => {
  if (user) {
    dispatch(actions.setter({user: user}));
    socket.userEmail = user.email; // IM for future use
    socket.emit('addUser', {email: socket.userEmail});
  } else {
    dispatch(actions.setter({user: user}));
    socket.emit('rmUser', {email: socket.userEmail});
  }
};

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(authStateChanged(user)));

class Err extends Component {
  render = () => {
    const { err } = this.props;
    return (
      <View>
        <Text>{err}</Text>
      </View>
    );
  };
}

const mspErr = state => ({
  err: state.rootReducer.err
});

Err = connect(mspErr, {})(Err);

class User extends Component {
  render = () => {
    const {
      user, loginUsername, loginPassword, registerUsername, registerPassword
    } = this.props;
    const { setter, login, register, logout } = this.props;
    return (
      <View>
        <Text>User</Text>
        <Text>user: {user ? user.email : "anonymous"}</Text>
        <View>
          <Text>Login</Text>
          <TextInput
            onChangeText={text => setter({ loginUsername: text })}
            placeholder={"loginUsername"}
            value={loginUsername}
          />
          <TextInput
            onChangeText={text => setter({ loginPassword: text })}
            placeholder={"loginPassword"}
            value={loginPassword}
          />
          <Button
           title="Login"
           onPress={() => login(loginUsername, loginPassword)}
         />
        </View>
        <View>
          <Text>Register</Text>
          <TextInput
            onChangeText={text => setter({ registerUsername: text })}
            placeholder={"registerUsername"}
            value={registerUsername}
          />
          <TextInput
            onChangeText={text => setter({ registerPassword: text })}
            placeholder={"registerPassword"}
            value={registerPassword}
          />
          <Button
           title="Register"
           onPress={() => register(registerUsername, registerPassword)}
         />
         <View>
           <Button title="Logout" onPress={() => logout()}/>
         </View>
        </View>
      </View>
    );
  };
}

const mspUser = state => ({
  user: state.rootReducer.user,
  loginUsername: state.rootReducer.loginUsername,
  loginPassword: state.rootReducer.loginPassword,
  registerUsername: state.rootReducer.registerUsername,
  registerPassword: state.rootReducer.registerPassword
});

const mdpUser = dispatch => ({
  setter: res => dispatch(actions.setter(res)),
  register: (email, password) => dispatch(actions.register(email, password)),
  login: (email, password) => dispatch(actions.login(email, password)),
  logout: () => dispatch(actions.logout())
});

User = connect(mspUser, mdpUser)(User);

class Chat extends Component {
  sendText = () => {
    const { user, text } = this.props;
    const { setter } = this.props;
    if (!user) {
      setter({ err: "login first" });
    } else if (text.length === 0) {
      setter({ err: "cannot send empty message" });
    }
    if (user && text.length > 0) {
      socket.emit("msg", { email: socket.userEmail, text: text });
    }
  };

  render = () => {
    const { activeUsers, msgs, text } = this.props;
    const { setter } = this.props;
    return (
      <View>
        <Text>Chat</Text>
        <View>
          <Text>Current Users</Text>
          {activeUsers.map(email => (
            <Text key={email}>{email}</Text>
          ))}
        </View>
        <View>
          <Text>Message Box</Text>
          <Button title="Send" onPress={() => this.sendText()} />
          <TextInput
            onChangeText={text => setter({ text: text })}
            placeholder={"Message"}
            value={text}
          />
          <Button title="Clear" onPress={() => setter({ msgs: [] })} />
        </View>
        <View>
          {msgs.map((msg, idx) => (
            <Text key={idx}>
              user: {msg.email}, text: {msg.text}
            </Text>
          ))}
        </View>
      </View>
    );
  };
}

const mspChat = state => ({
  user: state.rootReducer.user,
  activeUsers: state.rootReducer.activeUsers,
  msgs: state.rootReducer.msgs,
  text: state.rootReducer.text
});

const mdpChat = dispatch => ({
  setter: res => dispatch(actions.setter(res))
});

Chat = connect(mspChat, mdpChat)(Chat);

class App extends Component {
  render = () => {
    const { err } = this.props;
    return (
      <Provider store={store}>
        <Err />
        <User />
        <Chat />
      </Provider>
    );
  }
}

export default App;
