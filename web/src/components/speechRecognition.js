import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';

const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};


const Dictaphone = ({
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const sendVoiceText = transcript => {
    if (global.socket.connected && transcript.length > 0) {
      global.socket.emit('msg', { email: global.socket.userEmail, pkg: [{ text: transcript }] });
    }
    resetTranscript();
  };

  return (
    <div>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={() => sendVoiceText(transcript)}>
        Send
      </button>
      <span>{transcript}</span>
    </div>
  );
};

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(Dictaphone);