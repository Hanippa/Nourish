import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity , KeyboardAvoidingView ,ScrollView} from 'react-native';
import { collection, query, getDocs , updateDoc , getDoc , doc  } from 'firebase/firestore';
import { Modal , Button , Card } from 'react-native-ui-lib';
import { firestore } from '../firebase'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons  } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';

const Explore = () => {


  useEffect(() => {
    fetchRoutines();
  }, []);


  useEffect(() => {
    
    loadLikedRoutines();
    console.log('like effect' , likedRoutines)
  }, [likedRoutines])

  const [routines, setRoutines] = useState([]);
  const [likedRoutines, setLikedRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const saveLikedRoutines = async (routineId) => {
    try {
      const updatedLikedRoutines = [...likedRoutines , routineId]; // Use the updated state value
      console.log('updated like routines ->',(updatedLikedRoutines));
      await AsyncStorage.setItem('likedRoutines', JSON.stringify(updatedLikedRoutines));
    } catch (error) {
      console.log('Error saving liked routines:', error);
    }
  };
  const saveLikedRoutinesremove = async (routineId) => {
    try {
      const updatedLikedRoutines = likedRoutines.filter((id) => {id !== routineId}); // Use the updated state value
      console.log('updated like routines ->',(updatedLikedRoutines));
      await AsyncStorage.setItem('likedRoutines', JSON.stringify(updatedLikedRoutines));
    } catch (error) {
      console.log('Error saving liked routines:', error);
    }
  };



  const animationRef = React.createRef();


  const isRoutineLiked = (routineId) => {

    return likedRoutines.includes(routineId);
  };


  const handleLikeRoutine = async (routineId) => {
    // Check if the routine is already liked

    if (likedRoutines.includes(routineId)) {
      // Routine is already liked, remove it from the liked routines
      const updatedLikedRoutines = likedRoutines.filter((id) => id !== routineId);
      setLikedRoutines(updatedLikedRoutines);
    
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
          console.log('Routine like removed successfully');
          saveLikedRoutinesremove(routineId);
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
          
          saveLikedRoutines(routineId);
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
        console.log('existing routines' , existingRoutines)
        const parsedRoutines = existingRoutines ? JSON.parse(existingRoutines) : [];
        parsedRoutines.push({...routine , hours:routine.hours.map(hour => hour.toDate())});
        await AsyncStorage.setItem('routines', JSON.stringify(parsedRoutines));
        setIsRoutineSaved(true);
        console.log('Routine saved successfully');
      } catch (error) {
        console.log('Error saving routine:', error);
      }
    };

    return (
      <Modal visible={isVisible} onRequestClose={onClose} animationType="slide" transparent>
              <KeyboardAvoidingView style={{height:600, marginTop:100}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
      
                <View
                  style={{
                    width: "80%",
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 20,
                    borderRadius:40,
                    borderColor:'#034c530a',
                    borderWidth:2
                  }}
                >
                            <TouchableOpacity
                  style={{ position: "absolute", top: 25, left: 10 }}
                  onPress={() => onClose(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={50}
                    color='#00000050'
                  />
                </TouchableOpacity>
                <Text style={{ width:'80%', marginLeft:50, marginBottom: 20,padding:15 , borderRadius:50 , fontFamily:'Montserrat-regular' , fontSize:30 , textAlign:'center' }}>{routine.title}</Text>
                <Text style={{ textAlign:'center' , fontFamily:'Montserrat-regular' , width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}>{routine.notes}</Text>
                <Text style={{ textAlign:'center' , fontFamily:'Montserrat-regular' , width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}>{routine.products}</Text>
                  <View >
                    <View style={{flexDirection:'row'}}>
                    <ScrollView style={{margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
                    <View style={{ marginVertical: 10 , width:'100%' , height:'100%'}}>
                      <View style={{ flexDirection: "column", alignItems: "center" , width:'100%'}}>
                        {(
                          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {
                            ([...routine.hours]).map((hour , index) => {
                              const text =  typeof(hour) === 'string' ? new Date(hour) : new Date(hour.toDate())
                              return (<View style={styles.hourContainer} key={index}>
                              <Text style={styles.hourText}>{`${formatTime(text)}`}</Text>
                            </View>)
                  })
}
                          </View>
                        )}
                      </View>
                    </View>
                    </ScrollView>
                    <ScrollView style={{ margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                    {
                      routine.days.map((day, index) => (<Text key={index} style={{width:60,fontSize:24 , fontFamily:'Montserrat-regular',}}>{day.substring(0,3)}</Text>))
                    }
                    </View>
                    </ScrollView>
                    </View>
      
                  </View>
                  <Button label="save routine" style={styles.uploadbutton} labelStyle={styles.buttonText} onPress={handleSaveRoutine} />
                </View>
              </View>
              </KeyboardAvoidingView>
            </Modal>

    );
  };
  
  

  const handleRoutinePress = (routine) => {
    setSelectedRoutine(routine);
    setIsModalVisible(true);
  };

  


  const loadLikedRoutines = async () => {
    try {
      const storedLikedRoutines = await AsyncStorage.getItem('likedRoutines');
      console.log('stored =>',storedLikedRoutines)
      if (storedLikedRoutines) {
        const parsedLikedRoutines = JSON.parse(storedLikedRoutines);
        console.log('parsed liked routines' ,parsedLikedRoutines);
        setLikedRoutines(parsedLikedRoutines);
      }
    } catch (error) {
      console.log('Error loading liked routines:', error);
    }
  };















  const renderRoutineItem = ({ item , index }) => {
    return (
      <View>
      <Card
      key={index}
      style={styles.card}
      enableShadow={false}
    >
      <TouchableOpacity
       onPress={() => handleRoutinePress(item)}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection:'column'
        }}
      >
        <View style={
          {flex:1,
          flexDirection:'row',
          height:'20%',
          width:'100%',
          justifyContent:'center'
        }
        }>
        <Text
          style={{
            fontSize: 25,
            margin:10,
            
            color:"#000000",
            fontFamily:'Montserrat-regular',
          }}
        >
           {item.title}
        </Text>

        </View>
      

          <Card key={index} style={styles.subcard} enableShadow={false}>
          <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
 
 <Text
          style={{
            fontSize: 16,
            margin:10,
            textAlign:'center' ,
            color:"#000000",
            fontFamily:'Montserrat-regular',
          }}
        >
           {item.notes}
        </Text>

        
       
      </View>
      <Text
          style={{
            fontSize: 12,
            margin:10,
            textAlign:'center' ,
            color:"#00000070",
            fontFamily:'Montserrat-regular',
          }}
        >
           by {item.by}
        </Text>
      
      

      <TouchableOpacity style={styles.likeButton} onPress={() => handleLikeRoutine(item.id)}>
      <Animatable.View ref={animationRef} style={styles.likeButtonAnimate}>
      <MaterialCommunityIcons
          name={isRoutineLiked(item.id) ? 'heart' : 'heart-outline'}
          size={34}
          color={isRoutineLiked(item.id) ? '#ff000070' : 'black'}
        />
         <Text style={styles.likeCount}>{item.likes}</Text>
    </Animatable.View>
       
      </TouchableOpacity>


      <Text style={{fontSize:20,position:'absolute' , left:0 , bottom:0, margin:30}}>✨</Text>
          </Card>
      </TouchableOpacity>
    </Card>
    </View>);
  };

















  return (
    <View style={[styles.container , { flex: 1, backgroundColor: "white", position: "relative" }]}>
       <Text style={{fontFamily:'Montserrat-regular', fontSize:30 , width:'100%' , textAlign:'center', marginTop:50 , marginBottom:30}}>community 💕</Text>
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
  uploadbutton:{
    marginBottom:10,
    height:65,
    backgroundColor:'#F48D79',
  
  },
  buttonText:{
    paddingTop:15,
    fontSize: 30,
    fontFamily:'Montserrat-regular'
  },
  hourContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: 8,
    width:'90%',
    margin:5
  },
  hourText: {
    fontFamily:'Montserrat-regular',
    fontSize:16
  },
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
  },
  card : {
    flexDirection:'column',
    width:'90%',
    height:200,
    margin:20,
    borderRadius:40,
    borderColor:'#034c530a',
    borderWidth:2
  },
  subcard:{
    backgroundColor:'#F9F9F9',
    width:'100%',
    height:140 ,
    borderRadius:40
 },
 likeButton:{
  position:'absolute',
  right:20,
  bottom:0,
  justifyContent:'center',
  alignContent:'center',
  width:60
 },
 likeButtonAnimate:{
  flexDirection:'row-reverse',
  justifyContent:'center',
  alignItems:'center',
  gap:5,
  padding:10
 },
 likeCount:{
  fontFamily:'Montserrat-regular',
  fontSize:30
 }
});

export default Explore;
