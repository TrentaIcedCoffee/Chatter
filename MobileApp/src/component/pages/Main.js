import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './Main.css';

import {connect} from 'react-redux';
import {userActions} from '../../store/actions';

class Main extends Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.navigation.navigate('Chat');
    }
  }

  componentDidUpdate() {
    if (this.props.user) {
      this.props.navigation.navigate('Chat');
    }
  }

  handleLogin() {
    var {email, password} = this.props.input;
    this.props.login(email, password);
  }

  handleRegister() {
    var {email, password} = this.props.input;
    this.props.register(email, password);
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
          <SafeAreaView style={styles.container}>
            <View>
              <Text style={styles.title}>NO Rubbish Talk!</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              onChangeText={email => this.props.updateEmail(email)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={password => this.props.updatePassword(password)}
              secureTextEntry
            />

            {this.props.isLoginPage ? (
              <View style={styles.userBtnContainer}>
                <TouchableOpacity
                  style={styles.userBtnLogin}
                  onPress={this.handleLogin}>
                  <Text style={styles.userBtnText}>Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.userBtnContainer}>
                <TouchableOpacity
                  style={styles.userBtnLogin}
                  onPress={this.handleRegister}>
                  <Text style={styles.userBtnText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.registerContainer}>
              {this.props.isLoginPage ? (
                <>
                  <Text style={styles.leadingText}>
                    Doesn't have an account yet?
                  </Text>
                  <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => this.props.loginOrRegister('register')}>
                    <Text style={styles.registerText}>REGISTER</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.leadingText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => this.props.loginOrRegister('login')}>
                    <Text style={styles.registerText}>LOGIN</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    input: state.user.input,
    isLoginPage: state.user.isLoginPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePassword: userActions.updatePassword,
    updateEmail: userActions.updateEmail,
    login: userActions.login,
    register: userActions.register,
    loginOrRegister: userActions.loginOrRegister,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Main);
