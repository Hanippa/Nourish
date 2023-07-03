import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Routines = () => {
  const routines = [
    'Routine 1',
    'Routine 2',
    'Routine 3',
    'Routine 4',
    'Routine 5',
    'Routine 6',
    'Routine 7',
    'Routine 8',
    'Routine 9',
    'Routine 10',
    'Routine 11',
    'Routine 12',
    'Routine 13',
    'Routine 14',
    'Routine 15',
    'Routine 16',
    'Routine 17',
    'Routine 18',
    'Routine 19',
    'Routine 20',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.routinesContainer}>
          {routines.map((routine, index) => (
            <View key={index} style={styles.routineContainer}>
              <Text style={styles.routineText}>{routine}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  routinesContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  routineContainer: {
    width: 150,
    height: 150,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Routines;