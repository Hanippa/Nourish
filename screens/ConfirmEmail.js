import {Text , View , Button, Image ,  KeyboardAvoidingView , ScrollView , TouchableOpacity} from 'react-native'
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
 


const ConfirmEmail = (props) => {


  const handleResendConfimation = () => {
    console.log('resend confimation code');
  }
  const handleConfirm = () => {
    console.log('confirm code');
  }


return (
  <View>
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/holding.png')}/>
    
    <Text style={[styles.text , styles.title]}>Confirm Email{'\n'}<Text style={[styles.text , styles.subtitle]}>verify your email address</Text></Text>
      
    <CustomInput rules={{maxLength : {value: 30 , message: 'the email is too long 😰'} ,required:'email is required' , pattern: {message: 'Please enter a valid email address 🥺',value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/}}} name='email'control={control}  placeholder='email' icon='email-outline' style={{width:'100%'}}/>
    <TouchableOpacity onPress={handleResendConfimation}><Text>Resend confirmation code</Text></TouchableOpacity>
      <CustomButton  title='Next' style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={handleConfirm}/>
    </KeyboardAvoidingView>
    </ScrollView>
    </View>
)
}

const styles = StyleSheet.create({
    illustration:{
      width:198,
      height:204
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
      fontSize:30,
      textAlign:'center'
    },
    subtitle:{
      fontSize:15,
      fontFamily:'Montserrat-regular',
      textAlign:'center'
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
export default ConfirmEmail