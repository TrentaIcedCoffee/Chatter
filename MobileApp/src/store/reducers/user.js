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
    case 'STATUS__ERROR':
      return {...state, error: action.payload};
    default:
      return state;
  }
};

export default userReducer;
