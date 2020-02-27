import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import SpeechRecognition from './speechRecognition';

const mapStateToProps = state => ({
  user: state.user,
  activeUsers: state.activeUsers,
  msgs: state.msgs,
  text: state.text
});

const mapDispatchToProps = dispatch => ({
  setter: res => dispatch(actions.setter(res))
});

class Chat extends React.Component {
  sendText = () => {
    const { user, text } = this.props;
    const { setter } = this.props;
    const pkg = [{ text }];
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
      <div>
        <h2>Chat</h2>
        <div>
          <h4>Current Users</h4>
          {activeUsers.map(email => (
            <li key={email}>{email}</li>
          ))}
        </div>
        <div>
          <h4>Message Box</h4>
          <button onClick={() => this.sendText()}>Send</button>
          <div>
            <textarea
              rows="4"
              cols="50"
              value={text}
              onChange={e => setter({ text: e.target.value })}
            ></textarea>
          </div>
          <button onClick={() => setter({ msgs: [] })}>Clear</button>
          <div>
            {msgs.map((msg, idx) => (
              <li key={idx}>
                user: {msg.email}, text: {msg.pkg[0].text}
              </li>
            ))}
            <SpeechRecognition />
          </div>
        </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
