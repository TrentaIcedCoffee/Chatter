const init = {
  err: '',
  user: null,
  registerUsername: '',
  registerPassword: '',
  loginUsername: '',
  loginPassword: '',
  text: '',
  msgs: [],
  activeUsers: [],
};

export const rootReducer = (state = init, action) => {
  switch (action.type) {
    case 'SETTER':
      return { ...state, ...action.res };
    case 'PUSH_MSG':
      return { ...state, msgs: [ ...state.msgs, action.res ] };
    default:
      return state;
  }
};
