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
import Routines from './screens/Routines';
import Settings from './screens/Settings';
import Explore from './screens/Explore';

import { NavigationContainer , DefaultTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




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
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Settings') {
          iconName = 'cog-outline';
        }
        else if (route.name === 'Routines'){
          iconName = 'format-list-text';
        }
        else if (route.name === 'Explore'){
          iconName = 'compass-outline';
        }
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FEA897',
      tabBarInactiveTintColor: '#FEA89732',
    })}
  >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Routines" component={Routines} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
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





