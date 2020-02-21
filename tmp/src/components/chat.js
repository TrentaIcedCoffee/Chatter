import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = state => ({
  user: state.user,
  activeUsers: state.activeUsers,
  msgs: state.msgs,
  text: state.text
});

const mapDispatchToProps = dispatch => ({
  setter: res => dispatch(actions.setter(res))
});

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
      global.socket.emit("msg", { email: global.socket.userEmail, text: text });
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
