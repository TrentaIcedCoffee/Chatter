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
  }

  handleLogin() {
    var {email, password} = this.props.input;
    this.props.login(email, password);
    // this.props.history.push('/Lst');
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
            <View style={styles.userBtnContainer}>
              <TouchableOpacity
                style={styles.userBtnLogin}
                onPress={this.handleLogin}>
                <Text style={styles.userBtnText}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
              <Text style={styles.leadingText}>
                Doesn't have an account yet?
              </Text>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => this.props.logout()}>
                <Text style={styles.registerText}>REGISTER</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  return {
    input: state.user.input,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePassword: userActions.updatePassword,
    updateEmail: userActions.updateEmail,
    login: userActions.login,
    logout: userActions.logout,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Main);
