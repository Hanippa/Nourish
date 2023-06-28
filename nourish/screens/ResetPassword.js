import {Text , View , Button, Image ,  KeyboardAvoidingView , ScrollView} from 'react-native'
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
 


const ResetPassword = (props) => {
return (
  <View>
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/forgot.png')}/>
    
    <Text style={[styles.text , styles.title]}>Reset password{'\n'}<Text style={[styles.text , styles.subtitle]}>create new password</Text></Text>
      
      <CustomInput placeholder='confirmation code' icon='dots-horizontal' style={{width:'100%'}}/>
      <CustomInput placeholder='new password' icon='lock-outline' style={{width:'100%'}} password/>
      <CustomButton  title='Next' style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={() => {console.log('button-press');}}/>
    </KeyboardAvoidingView>
    </ScrollView>
    </View>
)
}

const styles = StyleSheet.create({
    illustration:{
      width:152,
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
export default ResetPassword