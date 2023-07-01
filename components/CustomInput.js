
import { StyleSheet, Text, View , TextInput} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {useForm , Controller} from 'react-hook-form'
const CustomInput = ({placeholder , icon , style , password , name, control , rules={}}) => {
    return (
        <View style={styles.container}>
            <Controller
            rules={rules}
            control={control}
            name={name}
            render={ ({field: {value , onChange, onBlur} , fieldState : {error}}) => (
                <View>
                    {error && <Text style={{textAlign:'left' , color:'red' , position:'absolute' , marginTop:-20, marginLeft:10}}>{error.message || 'error'}</Text>}
                <TextInput onBlur={onBlur} onChangeText={onChange} value={value} style={[styles.textinput,{borderColor : error ? 'red' : '#c4c4c433'}, style]} placeholder={placeholder} secureTextEntry={password}/>
                </View>
                )
            }
            />
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
        backgroundColor:'#c4c4c433',
        borderColor:'#c4c4c433',
        borderWidth:2
    },
    icon:{
        position:"absolute",
        right:0,
        margin:15,
        marginTop:17
    }
})
export default CustomInput