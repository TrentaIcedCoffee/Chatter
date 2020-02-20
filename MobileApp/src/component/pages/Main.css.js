import {StyleSheet} from 'react-native';

const MainCSS = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F7FBF',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo-Bold',
    fontWeight: 'bold',
    marginVertical: 30,
    color: '#fff',
    letterSpacing: 2,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 3,
  },
  userBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  userBtnLogin: {
    backgroundColor: '#727F8C',
    padding: 15,
    width: '100%',
    borderRadius: 3,
  },
  userBtnText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  registerBtn: {
    marginLeft: 10,
  },
  registerText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default MainCSS;
