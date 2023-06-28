import {Text , View , Button, Image ,  KeyboardAvoidingView , ScrollView} from 'react-native'
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
 


const Signup = (props) => {
return (
  <View>
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/signup.png')}/>
    
    <Text style={[styles.text , styles.title]}>Get Started{'\n'}<Text style={[styles.text , styles.subtitle]}>by creating a free account</Text></Text>
     
      <CustomInput placeholder='name' icon='account-outline' style={{width:'100%'}}/>
      <CustomInput placeholder='email' icon='email-outline' style={{width:'100%'}}/>
      <CustomInput placeholder='password' icon='lock-outline' style={{width:'100%'}}  password/>
      <Text>Forgot password?</Text>
      <CustomButton  title='Continue with Google' style={{width:'100%', height:50 , borderRadius:20, backgroundColor:'white', borderWidth:1, borderColor:'#000', borderStyle:'solid'} } iconsize={25} iconcolor={'black'} textstyle={{color:'black', fontSize:20 , marginRight:20}} icon='google' onPress={() => {console.log('button-press');}}/>
      <CustomButton  title='Next' style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={() => {console.log('button-press');}}/>
      <Text style={styles.text}>Already a Member? Login now</Text>
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
      padding:30,
      gap:20,
      width:"100%",
      height:"100%",
      alignItems:"center",
      justifyContent:"space-around"
      
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