import { StatusBar } from 'expo-status-bar';
import React, { useCallback , useState, useEffect } from 'react'
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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';



const Stack = createNativeStackNavigator();



const AuthenticationStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen options={{ headerShown: false }} name="Signup" component={Signup} />
      <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen options={{ headerShown: true }} name="Home" component={Home} />
    </Stack.Navigator>
  );
};




export default function App() {

  const [userSignedIn, setUserSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserSignedIn(!!user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);


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

  SplashScreen.preventAutoHideAsync(); 
  return (
    <NavigationContainer theme={MyTheme}>
      {userSignedIn ? <HomeStack /> : <AuthenticationStack />}
    </NavigationContainer>
  );
}







