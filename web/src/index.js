import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import socketIOClient from "socket.io-client";
import * as serviceWorker from './serviceWorker';

import * as utils from './utils';
import * as reducers from './reducers';
import * as actions from './actions';

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  composeWithDevTools(
    applyMiddleware(
      thunk,
    ),
  ),
);

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch({
  type: 'SETTER',
  res: { user: user },
}));

const mspMsg = state => ({
  msg: state.rootReducer.msg,
});

class Msg extends React.Component {
  render = () => (
    <div>
      <h2>Msg</h2>
      <div>Msg: {this.props.msg}</div>
    </div>
  );
}

Msg = connect(mspMsg, {})(Msg);

const mspUser = state => ({
  user: state.rootReducer.user,
  loginUsername: state.rootReducer.loginUsername,
  loginPassword: state.rootReducer.loginPassword,
  registerUsername: state.rootReducer.registerUsername,
  registerPassword: state.rootReducer.registerPassword,
});

const mdpUser = dispatch => ({
  setter: (key, val) => dispatch(actions.setter(key, val)),
  register: (email, password) => dispatch(actions.register(email, password)),
  login: (email, password) => dispatch(actions.login(email, password)),
  logout: () => dispatch(actions.logout()),
});

class User extends React.Component {
  render = () => {
    const {
      user,
      loginUsername, loginPassword,
      registerUsername, registerPassword,
    } = this.props;
    const {
      setter, login, register, logout,
    } = this.props;
    return (
      <div>
        <h2>User</h2>
        <div>user: {user ? user.email : 'anonymous'}</div>
        <div>
          <h4>Login</h4>
          <input placeholder="loginUsername" value={loginUsername}
            onChange={e => setter('loginUsername', e.target.value)} />
          <input placeholder="loginPassword" value={loginPassword}
            onChange={e => setter('loginPassword', e.target.value)} />
          <button onClick={() => login(loginUsername, loginPassword)}>Login</button>
        </div>
        <div>
          <h4>Register</h4>
          <input placeholder="registerUsername" value={registerUsername}
            onChange={e => setter('registerUsername', e.target.value)} />
          <input placeholder="registerPassword" value={registerPassword}
            onChange={e => setter('registerPassword', e.target.value)} />
          <button onClick={() => register(registerUsername, registerPassword)}>Register</button>
        </div>
        <div>
          <h4>Logout</h4>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>
    );
  };
}

User = connect(mspUser, mdpUser)(User);

const mspChat = state => ({
  user: state.rootReducer.user,
  endpoint: state.rootReducer.endpoint,
  socket: state.rootReducer.socket,
  users: state.rootReducer.users,
});

const mdpChat = dispatch => ({
  setter: (key, val) => dispatch(actions.setter(key, val)),
});

class Chat extends React.Component {
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { user, socket, endpoint } = this.props;
    const { setter } = this.props;
    if (user && !socket) {
      const socket = socketIOClient(endpoint);
      socket.userEmail = user.email; // IM for future use
      socket.on('connect', () => {
        console.log('connect');
        setter('socket', socket);
        socket.emit('pushUser', { email: socket.userEmail });
        socket.on('users', data => {
          setter('users', data.users);
        });
        socket.on('disconnect', () => {
          console.log('disconnect');
          // TODO emit in here failed
          setter('socket', null);
          setter('users', []);
        });
      });
    }
    if (!user && socket) {
      socket.emit('popUser', { email: socket.userEmail }, () => {
        socket.disconnect();
      });
    }
  };

  allUsers = () => {
    const { users } = this.props;
    return (
      <div>
        <h4>Current Users</h4>
        {users.map(email =>
          <li key={email}>
            <button onClick={() => {}}>Chat</button>
            {email}
          </li>
        )}
      </div>
    );
  };

  render = () => {
    const { user } = this.props;
    return (
      <div>
        <h2>Chat</h2>
        {user && this.allUsers()}
      </div>
    );
  };
}

Chat = connect(mspChat, mdpChat)(Chat);

ReactDOM.render(
  <Provider store={store}>
    <Msg />
    <User />
    <Chat />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
