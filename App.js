import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Login from './screens/Login';
import Signup from './screens/Signup';

import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import ConfirmEmail from './screens/ConfirmEmail';
import Home from './screens/Home';

import { NavigationContainer , DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';







const Stack = createNativeStackNavigator();




export default function App() {


  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    },
  };
  

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

  Parse.setAsyncStorage(AsyncStorage);
  
  Parse.initialize('5iSrL1QAKMBfroFmcDAosgHP7p1rMJa3jo0kIm03','d7r7oZKtovG5cv2TIZHv8hO7HCZctdhOJi5pjUIa');
  Parse.serverURL = 'https://parseapi.back4app.com/';
  SplashScreen.preventAutoHideAsync();
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{headerShown:false}} name="Signup" component={Signup} />
        <Stack.Screen options={{headerShown:false}} name="Login" component={Login} />
        <Stack.Screen options={{headerShown:true}} name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}