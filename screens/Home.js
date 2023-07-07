import React, { useEffect, useId, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Colors, Typography } from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { app } from '../firebase';



let user = null;
const Home = () => {
  const [activeRoutines, setActiveRoutines] = useState([]);
  const [todayActiveRoutines , setTodayActiveRoutines] = useState([]);

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  useEffect(() => {
    const auth = getAuth(app)
user = auth.currentUser;

    // Load active routines from AsyncStorage when the component mounts
    loadActiveRoutines();
    loadTodayActiveRoutines();
  }, []);

  useEffect(() => {
    // Update active routines whenever the activeRoutines state changes
    loadActiveRoutines();
  }, [activeRoutines]);

  // useEffect(() => {
  //   // Update active routines whenever the activeRoutines state changes
  //   loadTodayActiveRoutines();
  // }, [todayActiveRoutines]);



  const loadTodayActiveRoutines = async () => {
    try {
        const storedRoutines = await AsyncStorage.getItem('routines');
        const parsedRoutines = JSON.parse(storedRoutines);
        const currentDate = new Date();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDay = daysOfWeek[currentDate.getDay()];
        
        const filteredRoutines = parsedRoutines.filter(
          (routine) => {
            console.log('routine ->' ,routine);
            return routine.days.includes(currentDay) && routine.active}
        );

        setTodayActiveRoutines(filteredRoutines);
    } catch (error) {
      console.log('Error loading active routines:', error);
    }}

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
        <View style={styles.container}>
      <Text style={styles.title}>Active Routines for Today</Text>
      {todayActiveRoutines.length > 0 ? (
        todayActiveRoutines.map((routine) => (
          <View style={styles.routineContainer} key={routine.title}>
            <Text style={styles.routineTitle}>{routine.title}</Text>
            {routine.hours.map((hour , index) => {
              time = new Date(hour)
              return (
                <Text key={index}>{formatTime(time) }</Text>
              )
            })}
          </View>
        ))
      ) : (
        <Text style={styles.noRoutinesText}>No active routines for today.</Text>
      )}
    </View>
        </Card>
        <Card style={styles.containerRow}>
          <Text style={styles.containerText}>{user ? ` user : ${user.displayName}` : 'no user'} </Text>
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
