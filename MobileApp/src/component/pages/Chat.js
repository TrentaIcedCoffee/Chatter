import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import styles from './Chat.css';
import {GiftedChat} from 'react-native-gifted-chat';

import {connect} from 'react-redux';
import {userActions} from '../../store/actions';
import * as utils from '../../utils';

// ??: Do I need socket.on()?
// !!: Cannot connect to socket
const socket = utils.socketIOClient(utils.endpoint);
socket.on('connect', () => {
  console.log('connected');
  socket.on('activeUsers', data => {
    store.dispatch(userActions.setter({activeUsers: data.activeUsers}));
  });
  socket.on('msg', data => {
    store.dispatch(userActions.pushMsg(data));
  });
});

class Chat extends Component {
  constructor() {
    super();
    this.sendText = this.sendText.bind(this);
  }

  //   TODO: Change emit msg
  sendText(text) {
    console.log("it's", text);
    const user = this.props.user;
    const {setter} = this.props;
    if (!user) {
      setter({err: 'login first'});
    } else if (text.length === 0) {
      setter({err: 'cannot send empty message'});
    }
    if (user && text.length > 0) {
      socket.emit('msg', {user: socket.userEmail, text: text});
    }
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.msgs}
        onSend={msg => this.sendText(msg)}
        user={this.props.user}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    msgs: state.user.msgs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pushMsg: userActions.pushMsg,
    setter: userActions.setter,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Chat);
