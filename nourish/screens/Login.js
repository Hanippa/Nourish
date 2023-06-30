import {Text , View , Button, Image ,  KeyboardAvoidingView , ScrollView, TouchableOpacity} from 'react-native'
import React, { useEffect , useState } from 'react';
import { StyleSheet , Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useForm , Controller} from 'react-hook-form'
import Parse from "parse/react-native.js";

const Login = ({navigation}) => {
  const {control , handleSubmit , formState : {errors}} = useForm()
  const [loggingIn , setLoggingIn] = useState(false)

  const handleGoogle = () => {
    console.log('login with google');
  }
  const handleLogin = async (data) => {
    if (loggingIn) {
      return false;
    }
  
    setLoggingIn(true);
    const emailValue = data.email;
    const passwordValue = data.password;
  
    try {
      const loggedInUser = await Parse.User.logIn(emailValue, passwordValue);
      setLoggingIn(false);
      Alert.alert(
        'Success!',
        `User ${loggedInUser.get('name')} has successfully signed in!`,
      );
      const currentUser = await Parse.User.currentAsync();
      console.log(loggedInUser === currentUser);
      return true;
    } catch (error) {
      setLoggingIn(false);
      Alert.alert('Error!', error.message);
      return false;
    }
  };
  

return (
  <View >
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/login.png')}/>
    
    <Text style={[styles.text , styles.title]}>Welcome back{'\n'}<Text style={[styles.text , styles.subtitle]}>sign in to access your account</Text></Text>
      
    <CustomInput rules={{maxLength : {value: 30 , message: 'the email is too long 😰'} ,required:'email is required' , pattern: {message: 'Please enter a valid email address 🥺',value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/}}} name='email'control={control}  placeholder='email' icon='email-outline' style={{width:'100%'}}/>
    <CustomInput rules={{maxLength : {value: 24 , message: 'the password is too long 😰'} ,required:'password is required' , minLength : {value:6 , message: 'the minimum password length is 6 🤬'}}} name='password' control={control} placeholder='password' icon='lock-outline' style={{width:'100%'}}  password/>
      < TouchableOpacity onPress={() => {console.log('go-to-forgot-password-page')}}><Text>Forgot password?</Text></ TouchableOpacity>
      <CustomButton title='Continue with Google' style={{width:'100%', height:50 , borderRadius:20, backgroundColor:'white', borderWidth:1, borderColor:'#000', borderStyle:'solid'} } iconsize={25} iconcolor={'black'} textstyle={{color:'black', fontSize:20 , marginRight:20}} icon='google' />
      <CustomButton  title={!loggingIn ? 'Next' : 'Loading...'} style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={handleSubmit(handleLogin)}/>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}><Text style={styles.text}>New Member? Register now</Text></TouchableOpacity>
    </KeyboardAvoidingView>
    </ScrollView>
    </View>
)
}

const styles = StyleSheet.create({

    illustration:{
      width:152,
      height:172
    },
    container:{
      paddingTop:80,
      padding:30,
      gap:20,
      width:"100%",
      height:"100%",
      alignItems:"center",
      justifyContent:"space-around",     
    },
    text:{
      fontFamily:'Montserrat-regular'
    },
    title:{
      fontFamily:'Montserrat-bold',
      fontSize:30
    },
    subtitle:{
      fontSize:15,
      fontFamily:'Montserrat-regular'
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
  });
export default Login