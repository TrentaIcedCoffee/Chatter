import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
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

class Auth extends Component {
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
