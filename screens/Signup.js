import {Text , View , Button, Image ,  KeyboardAvoidingView , ScrollView , TouchableOpacity} from 'react-native'
import React, { useEffect , useState } from 'react';
import { StyleSheet , Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useForm , Controller} from 'react-hook-form'
import { createUserWithEmailAndPassword , updateProfile } from "firebase/auth";
import { auth } from '../firebase';


const Signup = ({navigation}) => {



  const {control , handleSubmit} = useForm()

  const handleGoogle = () => {
    console.log('register with google');
  }


  const handleRegister = (data) => {
    console.log('handle register!');
    const name = data.name;
    const email = data.email;
    const password = data.password;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
  
        // Update the user's display name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log('Display name updated:', name);
          })
          .catch((error) => {
            console.log('Error updating display name:', error);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };


return (
  <View>
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/signup.png')}/>
    
    <Text style={[styles.text , styles.title]}>Get Started{'\n'}<Text style={[styles.text , styles.subtitle]}>by creating a free account</Text></Text>
     
      <CustomInput rules={{maxLength : {value: 12 , message: 'the name is too long 😰'} , required:'name is required' , minLength : {value: 3 , message: 'the minimum name length is 3 😊'}}} name='name' control={control} placeholder='name' icon='account-outline' style={{width:'100%'}}/>
      <CustomInput rules={{maxLength : {value: 30 , message: 'the email is too long 😰'} ,required:'email is required' , pattern: {message: 'Please enter a valid email address 🥺',value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/}}} name='email'control={control}  placeholder='email' icon='email-outline' style={{width:'100%'}}/>
      <CustomInput rules={{maxLength : {value: 24 , message: 'the password is too long 😰'} ,required:'password is required' , minLength : {value:6 , message: 'the minimum password length is 6 🤬'}}} name='password' control={control} placeholder='password' icon='lock-outline' style={{width:'100%'}}  password/>
      
      <CustomButton  title='Continue with Google' style={{width:'100%', height:50 , borderRadius:20, backgroundColor:'white', borderWidth:1, borderColor:'#000', borderStyle:'solid'} } iconsize={25} iconcolor={'black'} textstyle={{color:'black', fontSize:20 , marginRight:20}} icon='google' onPress={handleGoogle}/>
      <CustomButton  title={'Next'} style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={handleSubmit(handleRegister)}/>
      < TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.text}>Already a Member? Login now</Text></TouchableOpacity>
    </KeyboardAvoidingView>
    </ScrollView>
    </View>
)
}

const styles = StyleSheet.create({
    illustration:{
      width:117,
      height:182
    },
    container:{
      paddingTop:50,
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
export default Signup