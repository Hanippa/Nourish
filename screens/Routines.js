import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet, Share ,TouchableOpacity ,  KeyboardAvoidingView} from "react-native";
import {firestore , app} from "../firebase"
import { getAuth } from "firebase/auth";
import { collection , doc , setDoc } from "firebase/firestore";
import {
  Card,
  Colors,
  Modal,
  TextField,
  Button,
  Switch,
  Checkbox,
} from "react-native-ui-lib";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({

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
  removeButton: {
    position:'absolute',
    right:0
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
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
 button:{

  height:65,
  backgroundColor:'#FF5656'
},
uploadbutton:{
  marginBottom:10,
  height:65,
  backgroundColor:'#F48D79',

},
buttonText:{
  paddingTop:15,
  fontSize: 30,
  fontFamily:'Montserrat-regular'
}
});


let user = null;
const Routines = () => {
  useEffect(() => {
    const auth = getAuth(app)
    user = auth.currentUser;
    loadRoutines();
  }, []);

 
  const handleExportRoutine = () => {
    const routineText = `Title: ${selectedRoutine.title}\nProducts: ${selectedRoutine.products}\Notes: ${selectedRoutine.notes}\nDays: ${selectedRoutine.days.join(', ')}\nHours: ${selectedRoutine.hours.map(((hour, index) => {
                  const text = new Date(hour);
                  return formatTime(text)}))}`;
  
    Share.share({
      message: routineText,
    })
    .then(() => console.log('Routine exported successfully'))
    .catch((error) => console.log('Error exporting routine:', error));
  };
  
  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRoutineModalVisible, setIsRoutineModalVisible] = useState(false);
  const [newRoutine, setNewRoutine] = useState("");
  const [newProducts, setNewProducts] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [days, setDays] = useState([
    { label: "Sunday", active: true },
    { label: "Monday", active: true },
    { label: "Tuesday", active: true },
    { label: "Wednesday", active: true },
    { label: "Thursday", active: true },
    { label: "Friday", active: true },
    { label: "Saturday", active: true },
  ]);
  const [selectedHours, setSelectedHours] = useState([]);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState(new Date());


  
  const handleUploadRoutine = async () => {
    console.log('handle upload routine');
    const routineRef = doc(collection(firestore, 'routines'), selectedRoutine.id);
    await setDoc(routineRef, {
      id:selectedRoutine.id,
      title: selectedRoutine.title,
      products: selectedRoutine.products,
      notes: selectedRoutine.notes,
      days: selectedRoutine.days,
      hours: selectedRoutine.hours,
      likes: 0,
      by:user ? `${user.displayName}` : 'anonymous'
    });
  };


  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };




  const handleHourRemoval = (hour) => {
    console.log(hour);
    const updatedHours = selectedHours.filter((item) => item !== hour);
    setSelectedHours(updatedHours);
  };

  const handleHourSelection = (event , hour) => {

    hideTimePicker()

    // on cancel set date value to previous date
    if (event?.type === 'dismissed') {
        setDate(date);
        return;
    }
    setTimePickerValue(hour);
    setSelectedHours([...selectedHours ,hour]);
};

  const handleToggleDay = (index) => {
    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[index].active = !updatedDays[index].active;
      return updatedDays;
    });
  };
  const handleDeleteRoutine = async () => {
    try {
      // Get the existing routines from AsyncStorage
      const existingRoutines = await AsyncStorage.getItem("routines");
  
      // Parse the existing routines as JSON or initialize with an empty array if there are no existing routines
      const parsedRoutines = existingRoutines ? JSON.parse(existingRoutines) : [];
  
      // Filter out the selected routine from the parsed routines array
      const updatedRoutines = parsedRoutines.filter(
        (routine) => routine.id !== selectedRoutine.id
      );
  
      // Save the updated routines array back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines));
  
      console.log("Routine deleted successfully");
  
      // Update the state with the updated routines
      setRoutines(updatedRoutines);
  
      // Close the modal
      setIsRoutineModalVisible(false);
    } catch (error) {
      console.log("Error deleting routine:", error);
    }
  };

  const loadRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("routines");
      if (storedRoutines) {
        const parsedRoutines = JSON.parse(storedRoutines);
        setRoutines(parsedRoutines);
      }
    } catch (error) {
      console.log("Error loading routines:", error);
    }
  };

  
  const addRoutine = async () => {
    if (newRoutine.length < 3 || newProducts.length < 3 || newNotes <3){
      return;
    }
    const newRoutineObj = {
      id:`${newRoutine}${Math.random().toString(16).slice(2)}`,
      title: newRoutine,
      products: newProducts,
      notes: newNotes,
      active: true, // Set the initial active status to true
      days: days.filter((day) => day.active).map((day) => day.label),
      hours: selectedHours,
    };
  
    try {
      const existingRoutines = await AsyncStorage.getItem("routines");
      const parsedRoutines = existingRoutines ? JSON.parse(existingRoutines) : [];
      parsedRoutines.push(newRoutineObj);
      await AsyncStorage.setItem("routines", JSON.stringify(parsedRoutines));
  
      console.log("Routine added successfully");
  
      setRoutines(parsedRoutines);
      setNewRoutine("");
      setNewProducts("");
      setNewNotes("");
      setSelectedHours([]); // Clear selected hours after adding routine
      setIsModalVisible(false);
    } catch (error) {
      console.log("Error saving routine:", error);
    }
  };

  const toggleRoutineStatus = async (index) => {
    try {
      const existingRoutines = await AsyncStorage.getItem("routines");
      const parsedRoutines = existingRoutines
        ? JSON.parse(existingRoutines)
        : [];
      parsedRoutines[index].active = !parsedRoutines[index].active;
      await AsyncStorage.setItem("routines", JSON.stringify(parsedRoutines));

      console.log("Routine status toggled successfully");

      setRoutines(parsedRoutines);
    } catch (error) {
      console.log("Error toggling routine status:", error);
    }
  };

  const openRoutineModal = (index) => {
    setSelectedRoutine(routines[index]);
    setIsRoutineModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      <Text style={{fontFamily:'Montserrat-regular', fontSize:30 , width:'100%' , textAlign:'center', marginTop:20}}>personal routines 🌈</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {routines.map((routine, index) => (
            <Card
              key={index}
              style={styles.card}
              enableShadow={false}
            >
              <TouchableOpacity
                onPress={() => openRoutineModal(index)}
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
                    
                    color: routine.active ? "#000000" : "#808080",
                    fontFamily:'Montserrat-regular',
                  }}
                >
                   {routine.title}
                </Text>
                <Switch
                style={
                  {
                    position:'absolute',
                    right:0,
                    margin:20,
                    marginTop:15
                  }
                }
                width={50}
                height={28}
                thumbSize={23}
                  onColor="#FDA898"
                  offColor="#034c531a"
                  value={routine.active}
                  onValueChange={() => toggleRoutineStatus(index)}
                />
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
                    color: routine.active ? "#000000" : "#808080",
                    fontFamily:'Montserrat-regular',
                  }}
                >
                   {routine.notes}
                </Text>
               
              </View>
              

              <Text style={{fontSize:20,position:'absolute' , left:0 , bottom:0, margin:30}}>✨</Text>
                  </Card>
              
                 
              
 
              
              
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 90,
          backgroundColor: "#F38C79",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => loadRoutines()}
      > 
        <MaterialCommunityIcons name="refresh" size={24} color='white' />
      </TouchableOpacity>
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
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>








      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent
      >
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
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: 20,
              borderRadius:40,
              borderColor:'#034c530a',
              borderWidth:2
            }}
          >
            
                      <TouchableOpacity
            style={{ position: "absolute", top: 25, left: 10 }}
            onPress={() => setIsModalVisible(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={50}
              color='#00000050'
            />
          </TouchableOpacity>
          

            <TextField
            placeholderTextColor={'#00000050'}
              placeholder="Title"
              value={newRoutine}
              onChangeText={(text) => setNewRoutine(text)}
              centered
              containerStyle={{width:'80%', marginLeft:50,marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}
            />
            <TextField
            centered
            placeholderTextColor={'#00000050'}
              placeholder="Products"
              value={newProducts}
              onChangeText={(text) => setNewProducts(text)}
              containerStyle={{width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}
            />
            <TextField
            placeholderTextColor={'#00000050'}
            centered
              placeholder="Notes"
              value={newNotes}
              onChangeText={(text) => setNewNotes(text)}
              containerStyle={{width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}
            />
            <View >
              <View style={{flexDirection:'row'}}>
              <ScrollView style={{margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
              <View style={{ marginVertical: 10 , width:'100%' , height:'100%'}}>
                <View style={{ flexDirection: "column", alignItems: "center" , width:'100%'}}>
                  <TouchableOpacity
                    onPress={showTimePicker}
                    style={{ marginRight: 10 , width:'100%'}}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={30}
                      color='#F38C79'
                      style={{position:'absolute' , top:0 , left:15}}
                    />
                    <Text style={{fontSize:20,fontFamily:'Montserrat-regular' , alignSelf:'center' , marginTop:2 , marginLeft:35}}>hours</Text>
                  </TouchableOpacity>
                  {(
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {selectedHours.map((hour , index) => (
                                  <View style={styles.hourContainer} key={index}>
                                  <Text style={styles.hourText}>{`${formatTime(hour)}`}</Text>
                                  <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleHourRemoval(hour)}>
                                                        <MaterialCommunityIcons
                                                          name="close-circle-outline"
                                                          size={30}
                                                          color='#F38C79'
                                                        />
                                  </TouchableOpacity>
                                </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              </ScrollView>
              <ScrollView style={{ margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
              <View style={{justifyContent:'center', alignItems:'center'}}>
                {days.map((day, index) => (
                  <Checkbox
                    color="#F38C79"
                    key={index}
                    value={day.active}
                    onValueChange={() => handleToggleDay(index)}
                    label={day.label.substring(0 , 3)}
                    labelStyle={{width:60,fontSize:24 , fontFamily:'Montserrat-regular',}}
                    style={{margin:2}}
                  />
                ))}
              </View>
              </ScrollView>
              </View>

            </View>
            <Button
              style={styles.button}
              labelStyle={styles.buttonText}
              label="add routine"
              onPress={addRoutine}
              backgroundColor={"#F38C79"}
            />
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>




      {isTimePickerVisible && (
        <DateTimePicker
        value={timePickerValue}
        title={'Select time'}
         placeholder={'time'}
          mode="time"
          is24Hour={false}
          display="default"
          onChange = {(event, selectedDate) => handleHourSelection(event ,selectedDate)}
         
        />

      )}





      {selectedRoutine && (
        <Modal
          visible={isRoutineModalVisible}
          onRequestClose={() => setIsRoutineModalVisible(false)}
          animationType="slide"
          transparent
        >
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
                    backgroundColor: Colors.white,
                    borderRadius: 10,
                    padding: 20,
                    borderRadius:40,
                    borderColor:'#034c530a',
                    borderWidth:2
                  }}
                >
                            <TouchableOpacity
                  style={{ position: "absolute", top: 25, left: 10 }}
                  onPress={() => setIsRoutineModalVisible(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={50}
                    color='#00000050'
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ position: "absolute", top: 70, left: 10 }}
                  onPress={handleExportRoutine}
                >
                  <MaterialCommunityIcons
                    name="share-variant-outline"
                    size={40}
                    color='#00000050'
                  />
                </TouchableOpacity>
                <Text style={{ width:'80%', marginLeft:50, marginBottom: 20,padding:15 , borderRadius:50 , fontFamily:'Montserrat-regular' , fontSize:30 , textAlign:'center' }}>{selectedRoutine.title}</Text>
                <Text style={{ textAlign:'center' , fontFamily:'Montserrat-regular' , width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}>{selectedRoutine.notes}</Text>
                <Text style={{ textAlign:'center' , fontFamily:'Montserrat-regular' , width:'100%', marginBottom: 20, backgroundColor:'#F9F9F9' , padding:15 , borderRadius:50 }}>{selectedRoutine.products}</Text>
                  <View >
                    <View style={{flexDirection:'row'}}>
                    <ScrollView style={{margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
                    <View style={{ marginVertical: 10 , width:'100%' , height:'100%'}}>
                      <View style={{ flexDirection: "column", alignItems: "center" , width:'100%'}}>
                        {(
                          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {

                            selectedRoutine.hours.map((hour , index) => {
                                        const text = new Date(hour);
                                        return (<View style={styles.hourContainer} key={index}>
                                        <Text style={styles.hourText}>{`${formatTime(text)}`}</Text>
                                      </View>)
                            })}
                          </View>
                        )}
                      </View>
                    </View>
                    </ScrollView>
                    <ScrollView style={{ margin:10, height:150,width:'50%', borderRadius:30 , backgroundColor:'#F9F9F9'}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                    {
                      selectedRoutine.days.map((day, index) => (<Text key={index} style={{width:60,fontSize:24 , fontFamily:'Montserrat-regular',}}>{day.substring(0,3)}</Text>))
                    }
                    </View>
                    </ScrollView>
                    </View>
      
                  </View>
                  <Button label="publish 💞" style={styles.uploadbutton} labelStyle={styles.buttonText} onPress={handleUploadRoutine} />
                  <Button
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    label="delete routine"
                    onPress={() => handleDeleteRoutine(selectedRoutine)}
                    
                  />
                </View>
              </View>
              </KeyboardAvoidingView>
            </Modal>



      )}
    </View>
  );
};

export default Routines;
