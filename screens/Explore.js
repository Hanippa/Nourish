import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const Explore = () => {
  const routines = [
    { id: '1', title: 'Morning Yoga Routine', author: 'John Doe' },
    { id: '2', title: 'Full Body Workout', author: 'Jane Smith' },
    { id: '3', title: 'Meditation for Beginners', author: 'David Johnson' },
    // Add more routines as needed
  ];

  const renderRoutineItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.routineItem}>
        <Text style={styles.routineTitle}>{item.title}</Text>
        <Text style={styles.routineAuthor}>by {item.author}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Routines</Text>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={renderRoutineItem}
        contentContainerStyle={styles.routinesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  routinesList: {
    paddingBottom: 20,
  },
  routineItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 2,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routineAuthor: {
    fontSize: 14,
    color: '#888888',
  },
});

export default Explore;