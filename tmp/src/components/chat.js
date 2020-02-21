import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Footer, FooterTab } from 'native-base';
import Voice from 'react-native-voice';
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
    const pkg = { text };
    if (!user) {
      setter({ err: 'login first' });
    } else if (text.length === 0) {
      setter({ err: 'cannot send empty message' });
    }
    if (user && text.length > 0) {
      global.socket.emit('msg', { email: global.socket.userEmail, pkg: pkg });
    }
  };

  render = () => {
    const { activeUsers, msgs, text } = this.props;
    const { setter } = this.props;
    return (
      <Container>
        <Header>
          <Left/>
          <Body>
            <Title>Chatter</Title>
          </Body>
          <Right />
        </Header>
        <View>
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
                user: {msg.email}, text: {msg.pkg.text}
              </Text>
            ))}
          </View>
        </View>
        <Footer>
          <FooterTab>
            <Text>Footer</Text>
          </FooterTab>
        </Footer>
      </Container>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
