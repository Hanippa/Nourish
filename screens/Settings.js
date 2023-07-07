import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Switch , Button , Colors } from 'react-native-ui-lib';
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
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch
        
        onColor='#F38C79'
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch onColor='#F38C79' value={darkModeEnabled} onValueChange={toggleDarkMode} />
      </View>
      <Button onPress={handleSignOut} label={'Sign out'} size={Button.sizes.medium} backgroundColor={Colors.red30}/>
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
  },
  optionText: {
    fontSize: 18,
  },
});

export default Settings;
