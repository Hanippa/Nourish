import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AppLoading from 'expo'
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import ConfirmEmail from './screens/ConfirmEmail';

SplashScreen.preventAutoHideAsync();


export default function App() {

  const [fontsLoaded] = useFonts({
    'Montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
  });


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
    return (
      <View  onLayout={onLayoutRootView}>
      <ConfirmEmail/>
      </View>
    );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
