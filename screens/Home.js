import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView , TouchableOpacity , Image } from 'react-native';
import { Card, Colors, Typography } from 'react-native-ui-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth} from "firebase/auth";
import { app } from '../firebase';
import { collection , query , getDocs  } from 'firebase/firestore';
import { firestore } from '../firebase'; 
import { MaterialCommunityIcons } from "@expo/vector-icons";



let user = null;
const Home = ({navigation}) => {
  const [activeRoutines, setActiveRoutines] = useState([]);
  const [todayActiveRoutines , setTodayActiveRoutines] = useState([]);
  const [recommendedRoutine, setRecommendedRoutine] = useState(null);

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  const fetchRandomRoutine = async () => {
    const routinesCollectionRef = collection(firestore, 'routines');
    const routinesQuery = query(routinesCollectionRef);
    const snapshot = await getDocs(routinesQuery);
    const routinesData = snapshot.docs.map((doc) => doc.data());
    const randomIndex = Math.floor(Math.random() * routinesData.length);
    const randomRoutine = routinesData[randomIndex];
    setRecommendedRoutine(randomRoutine);
    console.log(recommendedRoutine);
  };

  useEffect(() => {
    const auth = getAuth(app)
user = auth.currentUser;

    // Load active routines from AsyncStorage when the component mounts
    fetchRandomRoutine();
    loadActiveRoutines();
    loadTodayActiveRoutines();
  }, []);



  const loadTodayActiveRoutines = async () => {
    try {
      // Retrieve all routines from AsyncStorage
      const storedRoutines = await AsyncStorage.getItem('routines');
      if (storedRoutines) {
        // Parse the retrieved routines as JSON
        const parsedRoutines = JSON.parse(storedRoutines);
        const currentDate = new Date();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDay = daysOfWeek[currentDate.getDay()];
        
        // Filter the routines to get only the active ones for today
        const filteredRoutines = parsedRoutines.filter(
          (routine) => routine.days.includes(currentDay) && routine.active
        );
  
        setTodayActiveRoutines(filteredRoutines);
      }
    } catch (error) {
      console.log('Error loading active routines:', error);
    }
  };

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
    
    
    <View  style={ { flex: 1, backgroundColor: "white", position: "relative" }} >
      
            <Text style={{fontFamily:'Montserrat-regular', fontSize:27 , width:'100%' , textAlign:'center', marginTop:80}}>hi {user ? `${user.displayName}` : 'love'}, take care 🤗 </Text>
   

    <Image style={{width:50, height: 36,position:'absolute' ,top:320 , left:20 , zIndex:0}} source={require('../assets/illustrations/bird-2.png')}/>
    <Image style={{  position:'absolute' , bottom:230 , right:20 , zIndex:0}} source={require('../assets/illustrations/bird-1.png')}/>





<ScrollView>
      <Card
      style={styles.card}
      enableShadow={false}
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
           today schedule 🎀
        </Text>

        </View>

          <Card style={styles.subcard} enableShadow={false}>
          <ScrollView>
          <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10

        }}
      >
 


 {todayActiveRoutines.length > 0 ? (
  todayActiveRoutines.map((routine , index) => (
    <View key={index} style={{width:'100%' , justifyContent:'center', alignItems:'center'}}>
      
      {routine.hours && Array.isArray(routine.hours) && routine.hours.length > 0 ? (
        routine.hours
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map((hour, index) => (
            <View key={index} style={{width:'80%',  borderBottomColor:'#F38C79', borderBottomWidth:1 , flexDirection:'row'}}>
            <Text  style={{fontFamily:'Montserrat-regular', fontSize :24, textAlign:'center' , padding:5}}>{formatTime(new Date(hour))}</Text>
            <Text style={{fontFamily:'Montserrat-regular', fontSize :24 , padding:5 }}>{routine.title}</Text>
            </View>
          ))
      ) : (
        <Text>No hours available</Text>
      )}
    </View>
  ))
) : (
  <Text style={{fontFamily:'Montserrat-regular', fontSize :17, textAlign:'center' , padding:5}}>no active routines for today 😒</Text>
)}
       
      </View>
      </ScrollView>
    


          </Card>
    </Card>





<Card
      style={styles.card}
      enableShadow={false}
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
           active routines 🪷
        </Text>

        </View>

          <Card style={styles.subcard} enableShadow={false}>
            <ScrollView>
          <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
 


 {activeRoutines.length > 0 ? (
          activeRoutines.map((routine, index) => (
            <Text key={index} style={{fontFamily:'Montserrat-regular', fontSize :30 , borderBottomColor:'#F38C79', borderBottomWidth:1 , width:'80%' , textAlign:'center' , padding:5}}>
              {routine.title}
            </Text>
          ))
        ) : (
          <Text style={{fontFamily:'Montserrat-regular', fontSize :17, textAlign:'center' , padding:5}}>no active routines found 🤔</Text>
        )}
       
      </View>
      </ScrollView>
    


          </Card>
    </Card>







    
<Card
      style={[styles.card , {height:160}]}
      enableShadow={false}
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
           recommended 🦩 
        </Text>

        </View>

          <Card style={[styles.subcard , {height:100}]} enableShadow={false}>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
 

 {recommendedRoutine ? (
            <View style={{width:'100%' , alignItems:'center'}}>
            
            <Text style={{fontFamily:'Montserrat-regular', fontSize :30, width:'80%' , textAlign:'center' , padding:5}}>
              {recommendedRoutine.title}
            </Text>
                        <Text style={{fontFamily:'Montserrat-regular', fontSize :16, width:'80%' , textAlign:'center' , padding:5}}>
              by {recommendedRoutine.by}
            </Text>
            </View>
        ) : (
          <Text style={{fontFamily:'Montserrat-regular', fontSize :17, textAlign:'center' , padding:5}}>no recommendationg yet 😢</Text>
        )}   
       
      </View>
      </TouchableOpacity>


          </Card>
    </Card>


    </ScrollView>




      
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
        onPress={() => {
          loadActiveRoutines();
          loadTodayActiveRoutines();
        }}
      > 
        <MaterialCommunityIcons name="refresh" size={24} color='white' />
      </TouchableOpacity>


    </View>
    
  );
};

const styles = StyleSheet.create({
  card : {
    flexDirection:'column',
    width:'90%',
    height:200,
    margin:20,
    borderRadius:40,
    borderColor:'#F38C7920',
    borderWidth:2
  },
  subcard:{
    backgroundColor:'#F9F9F9',
    width:'100%',
    height:140 ,
    borderRadius:40
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
