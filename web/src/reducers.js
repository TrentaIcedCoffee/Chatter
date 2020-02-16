const init = {
  msg: '',
  user: null,
  registerUsername: '',
  registerPassword: '',
  loginUsername: '',
  loginPassword: '',
  socket: null,
  endpoint: 'http://18.233.9.194:3000',
  text: '',
  users: [],
};

export const rootReducer = (state = init, action) => {
  switch (action.type) {
    case 'SETTER':
      return { ...state, ...action.res };
    default:
      return state;
  }
};
