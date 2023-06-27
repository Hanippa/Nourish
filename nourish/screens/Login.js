import {Text , View , Button , Image} from 'react-native'
import SvgXml from 'react-native-svg';
// import loginsvg from '../assets/illustraions/Login-illustration.svg'
const Login = (props) => {
return (
    <View>
        {/* <SvgXml xml={loginsvg} width="200" height="200" /> */}
    <Button onPress={() => console.log('button pressed')} title='log'/>
    </View>
    
)
}
export default Login