import {StyleSheet} from 'react-native';

const ChatCSS = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#3F7FBF',
    flexDirection: 'row',
  },
  titleBox: {
    width: '83%',
    height: '100%',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 60,
    marginLeft: 15,
    letterSpacing: 1,
  },
  profileBtn: {
    width: '17%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtnIcon: {
    color: '#fff',
  },
});

export default ChatCSS;
