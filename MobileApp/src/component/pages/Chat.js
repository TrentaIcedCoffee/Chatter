import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styles from './Chat.css';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {GiftedChat} from 'react-native-gifted-chat';

import {connect} from 'react-redux';
import {userActions} from '../../store/actions';
import * as utils from '../../utils';

// ??: Do I need socket.on()?
// ??: Will server broadcast msg send by client => YES
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

    this.handleProfileBtn = this.handleProfileBtn.bind(this);
    this.sendText = this.sendText.bind(this);
  }

  handleProfileBtn() {}

  //   TODO: Change emit msg
  sendText(text) {
    console.log(this.props.user.uid);
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
      <View style={styles.container}>
        <View style={styles.navBar}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>Now You Shall Talk!</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={this.handleProfileBtn}>
            <FontAwesomeIcon
              icon={faUserCircle}
              style={styles.profileBtnIcon}
              size={40}
            />
          </TouchableOpacity>
        </View>
        {this.props.user ? (
          <GiftedChat
            messages={this.props.msgs}
            onSend={msg => this.sendText(msg)}
            user={{email: this.props.user.email}}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
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
