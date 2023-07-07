import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, getDocs , updateDoc , getDoc , doc , addDoc , get } from 'firebase/firestore';
import { Modal , Button } from 'react-native-ui-lib';
import { firestore } from '../firebase'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons , Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';


const Explore = () => {
  useEffect(() => {

    loadLikedRoutines();

    fetchRoutines();
  }, []);


  const animationRef = React.createRef();
  const animateLike = () => {
    animationRef.current.animate('flipInX');
  };

  // const handleLikeRoutine = async (routineId) => {

    
  //   // Check if the routine is already liked
  //   if (likedRoutines.includes(routineId)) {
  //     // Routine is already liked, remove it from the liked routines
  //     const updatedLikedRoutines = likedRoutines.filter((id) => id !== routineId);
  //     setLikedRoutines(updatedLikedRoutines);
  //   } else {
  //     // Routine is not liked, add it to the liked routines
  //     const updatedLikedRoutines = [...likedRoutines, routineId];
  //     setLikedRoutines(updatedLikedRoutines);
  //   }

  //   // Save the updated liked routines to AsyncStorage
  //   saveLikedRoutines();
  // };
  // const isRoutineLiked = (routineId) => {
  //   return likedRoutines.includes(routineId);
  // };

  const isRoutineLiked = (routineId) => {

    return likedRoutines.includes(routineId);
  };


  const handleLikeRoutine = async (routineId) => {
    // Check if the routine is already liked
    if (likedRoutines.includes(routineId)) {
      // Routine is already liked, remove it from the liked routines
      const updatedLikedRoutines = likedRoutines.filter((id) => id !== routineId);
      setLikedRoutines(updatedLikedRoutines);
      saveLikedRoutines()
      try {
        const routineRef = doc(firestore, 'routines', routineId);
    
        // Get the routine document
        const routineSnapshot = await getDoc(routineRef);
    
        // Check if the routine document exists
        if (routineSnapshot.exists()) {
          const routineData = routineSnapshot.data();
          const currentLikes = routineData.likes || 0;
    
          // Increment the likes count and update the document
          await updateDoc(routineRef, { likes: currentLikes > 0 ? currentLikes - 1 : 0});
    
          setRoutines((prevRoutines) =>
            prevRoutines.map((routine) =>
              routine.id === routineId ? { ...routine, likes: routine.likes > 0 ? routine.likes - 1 : 0} : routine
            )
          );
          console.log('Routine liked successfully');
        } else {
          console.log('Routine document not found');
        }
      } catch (error) {
        console.log('Error liking routine:', error);
      }

      
    } else {
      // Routine is not liked, add it to the liked routines
      const updatedLikedRoutines = [...likedRoutines, routineId];
      setLikedRoutines(updatedLikedRoutines);
      saveLikedRoutines()

      try {
        const routineRef = doc(firestore, 'routines', routineId);
    
        // Get the routine document
        const routineSnapshot = await getDoc(routineRef);
    
        // Check if the routine document exists
        if (routineSnapshot.exists()) {
          const routineData = routineSnapshot.data();
          const currentLikes = routineData.likes || 0;
    
          // Increment the likes count and update the document
          await updateDoc(routineRef, { likes: currentLikes + 1 });
    
          setRoutines((prevRoutines) =>
            prevRoutines.map((routine) =>
              routine.id === routineId ? { ...routine, likes: routine.likes + 1 } : routine
            )
          );
    
          console.log('Routine liked successfully');
        } else {
          console.log('Routine document not found');
        }
      } catch (error) {
        console.log('Error liking routine:', error);
      }
    }
 
  };

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const fetchRoutines = async () => {
    const routinesCollectionRef = collection(firestore, 'routines');
    const routinesQuery = query(routinesCollectionRef);
    const snapshot = await getDocs(routinesQuery);
    const routinesData = snapshot.docs.map((doc) => doc.data());
    setRoutines(routinesData);
  };


  const RoutineDetailsModal = ({ routine, isVisible, onClose }) => {
    const [isRoutineSaved, setIsRoutineSaved] = useState(false);
  
    const handleSaveRoutine = async () => {
      try {
        const existingRoutines = await AsyncStorage.getItem('routines');
        const parsedRoutines = existingRoutines ? JSON.parse(existingRoutines) : [];
        parsedRoutines.push({...routine , hours:routine.hours.map(hour => hour.toDate())});
        await AsyncStorage.setItem('routines', JSON.stringify(parsedRoutines));
        setIsRoutineSaved(true);
        console.log('Routine saved successfully');
      } catch (error) {
        console.log('Error saving routine:', error);
      }
    };
    const routinehours = routine.hours.map(hour => {
      const date = new Date(hour)
      return formatTime(date)
    })
    return (
      <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
        <Ionicons name="close" size={24} color="black" />
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{routine.title}</Text>
          <Text style={styles.modalAuthor}>by {routine.by}</Text>
          <Text style={styles.modalText}>{routine.products}</Text>
          <Text style={styles.modalText}>{routine.notes}</Text>
          <Text style={styles.modalText}>Days: {routine.days.join(', ')}</Text>
          <Text style={styles.modalText}>Hours: {routinehours.join(', ')}</Text>
          {!isRoutineSaved ? (
            <TouchableOpacity style={styles.button} onPress={handleSaveRoutine}>
              <Text style={styles.buttonText}>Save Routine</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.savedText}>Routine saved!</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  
  
  const [routines, setRoutines] = useState([]);
  const [likedRoutines, setLikedRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);


  const handleRoutinePress = (routine) => {
    console.log(typeof(routine) , '=> ' , routine)
    setSelectedRoutine(routine);
    setIsModalVisible(true);
  };

  


  const loadLikedRoutines = async () => {
    try {
      const storedLikedRoutines = await AsyncStorage.getItem('likedRoutines');
      if (storedLikedRoutines) {
        const parsedLikedRoutines = JSON.parse(storedLikedRoutines);
        setLikedRoutines(parsedLikedRoutines);
      }
    } catch (error) {
      console.log('Error loading liked routines:', error);
    }
  };

  const saveLikedRoutines = async () => {
    try {
      await AsyncStorage.setItem('likedRoutines', JSON.stringify(likedRoutines));
    } catch (error) {
      console.log('Error saving liked routines:', error);
    }
  };

  const renderRoutineItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.routineItem} onPress={() => handleRoutinePress(item)}>
      <Text style={styles.routineTitle}>{item.title}</Text>
      <Text style={styles.routineAuthor}>by {item.by}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={() => handleLikeRoutine(item.id)}>
      <Animatable.View ref={animationRef}>
      <MaterialCommunityIcons
          name={isRoutineLiked(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color={isRoutineLiked(item.id) ? 'red' : 'black'}
        />
    </Animatable.View>
        <Text style={styles.likeCount}>{item.likes}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Routines</Text>
      <FlatList
        data={routines}
        renderItem={renderRoutineItem}
        contentContainerStyle={styles.routinesList}
      />
            <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#F38C79",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => fetchRoutines()}
      > 
        <MaterialCommunityIcons name="refresh" size={24} color='white' />
      </TouchableOpacity>

{selectedRoutine && (
        <RoutineDetailsModal
          routine={selectedRoutine}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalAuthor: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  }
});

export default Explore;
