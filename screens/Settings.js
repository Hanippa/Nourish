import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Switch , Button , Colors , Image } from 'react-native-ui-lib';
import { app } from '../firebase';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);


  const handleSignOut = () => {
    const auth = getAuth(app);
    auth.signOut()
      .then(() => {
        // User signed out successfully
        console.log('User signed out');
      })
      .catch((error) => {
        // Handle errors during sign-out
        console.error('Sign-out failed:', error);
      });
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prevValue) => !prevValue);
  };

  const toggleDarkMode = () => {
    setDarkModeEnabled((prevValue) => !prevValue);
  };

  return (
    <View style={styles.container}>

      <View style={styles.option}>
        <Text style={styles.optionText}>enable notifications</Text>
        <Switch
        
        onColor='#F38C79'
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>


      <Button onPress={handleSignOut} label={'Sign out'} style={styles.button} labelStyle={styles.buttonText} />
      <Image style={styles.illustration} source={require('../assets/illustrations/settings.png')}/>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomColor:'#A7ACB0',
    borderBottomWidth:1,
    paddingTop:50,
    paddingBottom:50,
    marginBottom:60
  },
  optionText: {
    fontSize: 18,
    fontFamily:'Montserrat-regular'
  },
  button:{

    height:65,
    backgroundColor:'#FF5656'
  },
  buttonText:{
    paddingTop:15,
    fontSize: 35,
    fontFamily:'Montserrat-regular'
  },
  illustration:{
    alignSelf:'center',
    position:'absolute',
    width:355,
    height:320,
    bottom:0
  }
});

export default Settings;
