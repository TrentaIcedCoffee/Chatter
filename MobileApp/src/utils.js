import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
export {default as SocketIOClient} from 'socket.io-client';

const firebaseConfig = {
  apiKey: 'AIzaSyC0IrR4AvUJVRX_aUyucjhV66YzawPKYFk',
  authDomain: 'chat-3809f.firebaseapp.com',
  databaseURL: 'https://chat-3809f.firebaseio.com',
  projectId: 'chat-3809f',
  storageBucket: 'chat-3809f.appspot.com',
  messagingSenderId: '204136491965',
  appId: '1:204136491965:web:86dea458298aa68ca2c0d4',
};

export const firebase = app.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const endpoint = 'http://52.91.26.248:3000';
