import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import styles from './Profile.css';

import {connect} from 'react-redux';
import {userActions} from '../../store/actions';
import * as utils from '../../utils';

// ??: Do I need socket?
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

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      activeUsers: [
        'aaa',
        'bbb',
        'ccc',
        'ddd',
        'eee',
        'fff',
        'ggg',
        'hhh',
        'iii',
        'jjj',
        'kkk',
        'lll',
        'mmm',
        'nnn',
      ],
    };

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleBackBtn() {
    this.props.navigation.goBack();
  }

  handleLogout() {
    this.props.logout();
    this.props.navigation.popToTop();
  }

  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={this.handleBackBtn}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={styles.backBtnIcon}
                size={25}
              />
            </TouchableOpacity>
            {this.props.user ? (
              <>
                <View style={styles.profileImg}></View>
                <Text style={styles.profileText}>{this.props.user.email}</Text>

                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={this.handleLogout}>
                  <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <View style={styles.infoBoxContainer}>
            <Text style={styles.infoBoxTitle}>
              Active Users ({this.state.activeUsers.length}):
            </Text>
            {this.state.activeUsers.length > 0
              ? this.state.activeUsers.map(item => (
                  <Text style={styles.activeUsers}>{item}</Text>
                ))
              : null}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    activeUsers: state.user.activeUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: userActions.logout,
  };
};

export default connect(mapStateToProps, mapDispatchToProps())(Profile);
