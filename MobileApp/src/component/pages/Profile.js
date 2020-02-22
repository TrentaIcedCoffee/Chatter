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

class Profile extends Component {
  constructor() {
    super();

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
              Active Users ({this.props.activeUsers.length}):
            </Text>
            {this.props.activeUsers.length > 0
              ? this.props.activeUsers.map(item => (
                  <Text key={item} style={styles.activeUsers}>
                    {item}
                  </Text>
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
