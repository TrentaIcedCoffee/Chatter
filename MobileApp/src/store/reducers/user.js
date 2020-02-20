const initialState = {
  err: '',
  user: null,
  input: {
    email: null,
    password: null,
  },
  msgs: [],
  activeUsers: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case 'SETTER':
      return {...state, ...action.res};
    case 'PUSH_MSG':
      return {...state, msgs: [...state.msgs, action.res]};
    default:
      return state;
  }
};

export default userReducer;
