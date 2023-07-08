import {Text , View , Image ,  KeyboardAvoidingView , ScrollView} from 'react-native'
import { StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useForm } from 'react-hook-form'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
 


const ForgotPassword = (props) => {
  const {control , handleSubmit , formState : {errors}} = useForm()

  const handleReset = async function (data) {
    sendPasswordResetEmail(auth, data.email)
    .then(() => {
      console.log('Password reset email sent to:', data.email);
    })
    .catch((error) => {
      console.log('Error sending password reset email:', error);
    });
  };

return (
  <View>
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
  <KeyboardAvoidingView style={styles.container}>

    <Image style={styles.illustration} source={require('../assets/illustrations/forgot.png')}/>
    
    <Text style={[styles.text , styles.title]}>Forgot password{'\n'}<Text style={[styles.text , styles.subtitle]}>reset your password</Text></Text>
      
    <CustomInput rules={{maxLength : {value: 30 , message: 'the email is too long 😰'} ,required:'email is required' , pattern: {message: 'Please enter a valid email address 🥺',value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/}}} name='email'control={control}  placeholder='email' icon='email-outline' style={{width:'100%'}}/>
      <CustomButton  title='Next' style={{width:'100%', height:60, backgroundColor:'#F38C79' , borderRadius:20} } iconstyle={{marginTop:4}} iconcolor={'white'} textstyle={{color:'white'}}  icon='chevron-right' iconsize={34} onPress={handleSubmit(handleReset)}/>
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
export default ForgotPassword