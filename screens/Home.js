import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Colors, Typography } from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [activeRoutines, setActiveRoutines] = useState([]);

  useEffect(() => {
    // Load active routines from AsyncStorage when the component mounts
    loadActiveRoutines();
  }, []);

  useEffect(() => {
    // Update active routines whenever the activeRoutines state changes
    loadActiveRoutines();
  }, [activeRoutines]);

  const loadActiveRoutines = async () => {
    try {
      // Retrieve all routines from AsyncStorage
      const storedRoutines = await AsyncStorage.getItem('routines');
      if (storedRoutines) {
        // Parse the retrieved routines as JSON
        const parsedRoutines = JSON.parse(storedRoutines);
        // Filter the routines to get only the active ones
        const activeRoutines = parsedRoutines.filter((routine) => routine.active);
        setActiveRoutines(activeRoutines);
      }
    } catch (error) {
      console.log('Error loading active routines:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.containerColumn}>
        <Card style={styles.containerRow}>
          <Text style={styles.caption}>Active Routines</Text>
          {activeRoutines.length > 0 ? (
            activeRoutines.map((routine, index) => (
              <Text key={index} style={styles.containerText}>
                {routine.title}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>No active routines found</Text>
          )}
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
  emptyText: {
    ...Typography.text70,
    color: Colors.dark30,
    fontStyle: 'italic',
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
