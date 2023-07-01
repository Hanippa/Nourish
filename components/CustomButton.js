import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomButton = ({ title, onPress, style ,textstyle, icon , iconcolor , iconsize , iconstyle}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textstyle]}>{title}</Text>
      <MaterialCommunityIcons name={icon} size={iconsize} color={iconcolor} style={iconstyle}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    
    flexDirection:'row',
    backgroundColor: '#4287f5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',


  },
  buttonText: {
    fontSize: 27,
    fontFamily:'Montserrat-regular'
  },

});

export default CustomButton;
