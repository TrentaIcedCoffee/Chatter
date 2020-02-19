const initialState = {
  isLogin: false,
  userInfo: {
    email: null,
    password: null,
  },
  token: null,
  error: 'none',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          email: action.payload,
        },
      };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
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
