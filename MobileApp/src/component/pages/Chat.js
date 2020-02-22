import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from './Chat.css';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {GiftedChat} from 'react-native-gifted-chat';

import {connect} from 'react-redux';
import {userActions} from '../../store/actions';
import * as utils from '../../utils';

class Chat extends Component {
  constructor() {
    super();

    this.handleProfileBtn = this.handleProfileBtn.bind(this);
    this.sendText = this.sendText.bind(this);
  }

  handleProfileBtn() {
    this.props.navigation.navigate('Profile');
  }

  //   TODO: Change emit msg
  sendText(pkg) {
    const user = this.props.user;
    const {setter} = this.props;
    if (!user) {
      setter({err: 'login first'});
    } else if (pkg.length === 0) {
      setter({err: 'cannot send empty message'});
    }
    if (user && pkg.length > 0) {
      global.socket.emit('msg', {email: global.socket.userEmail, pkg: pkg});
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
            user={{_id: this.props.user.email, name: this.props.user.email}}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state.user.msgs);
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
