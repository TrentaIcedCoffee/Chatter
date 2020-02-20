import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import * as serviceWorker from "./serviceWorker";

import * as utils from "./utils";
import * as reducers from "./reducers";
import * as actions from "./actions";

const store = createStore(
  combineReducers({
    ...reducers
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

const socket = utils.socketIOClient(utils.endpoint);
socket.on("connect", () => {
  console.log("connected");
  socket.on("activeUsers", data => {
    store.dispatch(actions.setter({ activeUsers: data.emails }));
  });
  socket.on("msg", data => {
    store.dispatch(actions.pushMsg(data));
  });
});

const authStateChanged = user => dispatch => {
  if (user) {
    dispatch(actions.setter({ user: user }));
    socket.userEmail = user.email; // IM for future use
    socket.emit("addUser", { email: socket.userEmail });
  } else {
    dispatch(actions.setter({ user: user }));
    socket.emit("rmUser", { email: socket.userEmail });
  }
};

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(authStateChanged(user)));

const mspErr = state => ({
  err: state.rootReducer.err
});

class Err extends React.Component {
  render = () => (
    <div>
      <h2>Err</h2>
      <div>Err: {this.props.err}</div>
    </div>
  );
}

Err = connect(mspErr, {})(Err);

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

class User extends React.Component {
  render = () => {
    const {
      user,
      loginUsername,
      loginPassword,
      registerUsername,
      registerPassword
    } = this.props;
    const { setter, login, register, logout } = this.props;
    return (
      <div>
        <h2>User</h2>
        <div>user: {user ? user.email : "anonymous"}</div>
        <div>
          <h4>Login</h4>
          <input
            placeholder="loginUsername"
            value={loginUsername}
            onChange={e => setter({ loginUsername: e.target.value })}
          />
          <input
            placeholder="loginPassword"
            value={loginPassword}
            onChange={e => setter({ loginPassword: e.target.value })}
          />
          <button onClick={() => login(loginUsername, loginPassword)}>
            Login
          </button>
        </div>
        <div>
          <h4>Register</h4>
          <input
            placeholder="registerUsername"
            value={registerUsername}
            onChange={e => setter({ registerUsername: e.target.value })}
          />
          <input
            placeholder="registerPassword"
            value={registerPassword}
            onChange={e => setter({ registerPassword: e.target.value })}
          />
          <button onClick={() => register(registerUsername, registerPassword)}>
            Register
          </button>
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
  activeUsers: state.rootReducer.activeUsers,
  msgs: state.rootReducer.msgs,
  text: state.rootReducer.text
});

const mdpChat = dispatch => ({
  setter: res => dispatch(actions.setter(res))
});

class Chat extends React.Component {
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
      <div>
        <h2>Chat</h2>
        <div>
          <h4>Current Users</h4>
          {activeUsers.map(email => (
            <li key={email}>{email}</li>
          ))}
        </div>
        <div>
          <h4>Message Box</h4>
          <button onClick={() => this.sendText()}>Send</button>
          <div>
            <textarea
              rows="4"
              cols="50"
              value={text}
              onChange={e => setter({ text: e.target.value })}
            ></textarea>
          </div>
          <button onClick={() => setter({ msgs: [] })}>Clear</button>
          <div>
            {msgs.map((msg, idx) => (
              <li key={idx}>
                user: {msg.user}, text: {msg.text}
              </li>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

Chat = connect(mspChat, mdpChat)(Chat);

class App extends React.Component {

  componentWillUnmount = () => {
    if (socket.connected) {
      socket.emit("rmUser", { email: socket.userEmail });
    }
  }

  render = () => {
    return (
      <div>
        <Err />
        <User />
        <Chat />
      </div>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
