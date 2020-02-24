import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = state => ({
  user: state.user,
  loginUsername: state.loginUsername,
  loginPassword: state.loginPassword,
  registerUsername: state.registerUsername,
  registerPassword: state.registerPassword
});

const mapDispatchToProps = dispatch => ({
  setter: res => dispatch(actions.setter(res)),
  register: (email, password) => dispatch(actions.register(email, password)),
  login: (email, password) => dispatch(actions.login(email, password)),
  logout: () => dispatch(actions.logout())
});

class Auth extends React.Component {
  render = () => {
    const {
      user, loginUsername, loginPassword, registerUsername, registerPassword
    } = this.props;
    const { setter, login, register, logout } = this.props;
    return (
      <div>
        <h2>user: {user ? user.email : 'anonymous'}</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
