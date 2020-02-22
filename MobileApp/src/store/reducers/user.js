import {GiftedChat} from 'react-native-gifted-chat';

const initialState = {
  err: '',
  user: null,
  isLoginPage: true,
  input: {
    email: null,
    password: null,
  },
  msgs: [],
  activeUsers: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_OR_REGISTER':
      return {
        ...state,
        isLoginPage: action.payload,
      };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        input: {
          ...state.input,
          email: action.payload,
        },
      };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        input: {
          ...state.input,
          password: action.payload,
        },
      };
    case 'CLEAR_INPUT':
      return {
        ...state,
        input: {
          ...state.input,
          email: null,
          password: null,
        },
      };
    case 'CLEAR_HISTORY':
      return initialState;
    case 'SETTER':
      return {...state, ...action.res};
    case 'PUSH_MSG':
      var newMsgs = action.res.concat(state.msgs);
      return {...state, msgs: newMsgs};
    default:
      return state;
  }
};

export default userReducer;
