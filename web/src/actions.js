import * as utils from './utils';

export const setter = res => ({
  type: 'SETTER',
  res: { ...res },
});

export const register = (email, password) => dispatch => {
  if (!(typeof(email) === 'string' && email.length > 0 &&
        typeof(password) === 'string' && password.length > 0)) {
    dispatch(setter('msg', `email: ${email}, password: ${password} misformat`));
    return;
  }
  utils.auth.createUserWithEmailAndPassword(email, password)
    .catch(err => {
      dispatch(setter('msg', err.message));
    });
};

export const login = (email, password) => dispatch => {
  if (!(typeof(email) === 'string' && email.length > 0 &&
        typeof(password) === 'string' && password.length > 0)) {
    dispatch(setter('msg', `email: ${email}, password: ${password} misformat`));
    return;
  }
  utils.auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      dispatch(setter('msg', err.message));
    });
};

export const logout = () => dispatch => {
  utils.auth.signOut()
    .catch(err => dispatch(setter('msg', err.message)));
};

export const pushMsg = msg => ({
  type: 'PUSH_MSG',
  res: msg,
});
