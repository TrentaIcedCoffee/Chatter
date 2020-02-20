import {StyleSheet} from 'react-native';

const ProfileCSS = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 10,
    height: 25,
    width: 25,
    overflow: 'hidden',
  },
  backBtnIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    overflow: 'hidden',
  },

  profileContainer: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F7FBF',
  },
  profileImg: {
    height: 150,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 75,
    marginBottom: 15,
  },
  profileText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 15,
  },
  logoutBtn: {
    width: 60,
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 15,
  },
  logoutBtnText: {
    fontSize: 14,
    color: '#000',
    opacity: 0.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBoxContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    padding: 15,
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activeUsers: {
    fontSize: 14,
    marginLeft: 15,
    marginBottom: 15,
  },
});

export default ProfileCSS;
