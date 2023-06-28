
import { StyleSheet, Text, View , TextInput} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const CustomInput = ({placeholder , icon , style , password}) => {
    return (
        <View style={styles.container}>
            <TextInput style={[styles.textinput, style]} placeholder={placeholder} secureTextEntry={password}/>
            <MaterialCommunityIcons name={icon} size={24} color="#00000033" style={styles.icon}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'100%'
    },
    textinput:{
        fontFamily:'Montserrat-regular',
        borderRadius:15,
        height:60,
        padding:10,
        paddingLeft:30,
        backgroundColor:'#c4c4c433'
    },
    icon:{
        position:"absolute",
        right:0,
        margin:15,
        marginTop:17
    }
})
export default CustomInput