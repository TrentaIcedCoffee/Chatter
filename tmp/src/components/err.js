import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = state => ({
  err: state.err
});

class Err extends Component {
  render = () => {
    const { err } = this.props;
    return (
      <View>
        <Text>{err}</Text>
      </View>
    );
  };
}

export default connect(mapStateToProps, {})(Err);
