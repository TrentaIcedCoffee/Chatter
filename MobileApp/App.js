/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {NativeRouter, Switch, Route, Redirect} from 'react-router-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import Main from './src/component/pages/Main';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
        {/* <NativeRouter>
          <Switch>
            <Route exact path="/" component={StartPage} />
            <Route exact path="/Lst" component={TrapLstPage} />
            <Route exact path="/Info" component={TrapInfoPage} />
            <Redirect to="/" />
          </Switch>
        </NativeRouter> */}
      </Provider>
    );
  }
}

export default App;
