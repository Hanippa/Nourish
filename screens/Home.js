import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Colors, Typography } from 'react-native-ui-lib';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerColumn}>
        <Card style={styles.containerRow}>
          <Text style={styles.containerText}>Container 1</Text>
        </Card>
        <Card style={styles.containerRow}>
          <Text style={styles.containerText}>Container 2</Text>
        </Card>
        <Card style={styles.containerRow}>
          <Text style={styles.containerText}>Container 3</Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  containerColumn: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  containerRow: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  containerText: {
    ...Typography.text70,
    fontWeight: 'bold',
    color: Colors.dark10,
  },
});

export default Home;
