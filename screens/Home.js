import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  StyleSheet, Text, View } from 'react-native';
const Home = () => {
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              React Native on Back4App - Home
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
  
  export default Home