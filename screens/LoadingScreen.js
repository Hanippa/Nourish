import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
        <Image style={{height:220 , width:170}} source={require('../assets/illustrations/loading.png')}/>
        <Text style={{ color:'white' ,fontFamily:'Montserrat-regular', fontSize:50 , width:'100%' , textAlign:'center'}}>nourish</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FEA897'
  },
});

export default LoadingScreen;