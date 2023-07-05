import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import {
  Card,
  Colors,
  Typography,
  Modal,
  TextField,
  Button,
  Switch,
  Checkbox,
} from "react-native-ui-lib";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  hourContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    marginRight: 8,
  },
  hourText: {
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#F38C79",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});



const Routines = () => {

  
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
  const [newFrequency, setNewFrequency] = useState("");
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




  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };


  useEffect(() => {
    loadRoutines();
  }, []);

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
        (routine) => routine.title !== selectedRoutine.title
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
    const newRoutineObj = {
      title: newRoutine,
      products: newProducts,
      frequency: newFrequency,
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
      setNewFrequency("");
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
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", position: "relative" }}>
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
              style={{ width: 150, height: 150, margin: 10, padding: 20 }}
            >
              <TouchableOpacity
                onPress={() => openRoutineModal(index)}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: routine.active ? "#000000" : "#808080",
                  }}
                >
                  {routine.title}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Switch
                  onColor="#F38C79"
                  value={routine.active}
                  onValueChange={() => toggleRoutineStatus(index)}
                />
              </View>
            </Card>
          ))}
        </View>
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.black70,
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={() => setIsModalVisible(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={Colors.grey10}
            />
          </TouchableOpacity>
          <View
            style={{
              width: "80%",
              backgroundColor: Colors.white,
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text style={[Typography.text20, { marginBottom: 20 }]}>
              Add Routine
            </Text>
            <TextField
              placeholder="Title"
              value={newRoutine}
              onChangeText={(text) => setNewRoutine(text)}
              containerStyle={{ marginBottom: 20 }}
            />
            <TextField
              placeholder="Products"
              value={newProducts}
              onChangeText={(text) => setNewProducts(text)}
              containerStyle={{ marginBottom: 20 }}
            />
            <TextField
              placeholder="Frequency"
              value={newFrequency}
              onChangeText={(text) => setNewFrequency(text)}
              containerStyle={{ marginBottom: 20 }}
            />
            <View>
              <Text>Days:</Text>
              <View>
                {days.map((day, index) => (
                  <Checkbox
                    color="#F38C79"
                    key={index}
                    value={day.active}
                    onValueChange={() => handleToggleDay(index)}
                    label={day.label}
                    style={{margin:2}}
                  />
                ))}
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
                >
                  Add Hours
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={showTimePicker}
                    style={{ marginRight: 10 }}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                  {selectedHours.length === 0 ? (
                    <Text>No hours selected</Text>
                  ) : (
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {selectedHours.map((hour , index) => (
                                  <View style={styles.hourContainer} key={index}>
                                  <Text style={styles.hourText}>{`${formatTime(hour)}`}</Text>
                                  <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleHourRemoval(hour)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                  </TouchableOpacity>
                                </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
            <Button
              label="Add"
              onPress={addRoutine}
              backgroundColor={"#F38C79"}
            />
          </View>
        </View>
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.black70,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => setIsRoutineModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={Colors.grey10}
              />
            </TouchableOpacity>
            <View
              style={{
                width: "80%",
                backgroundColor: Colors.white,
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Text style={[Typography.text50, { marginBottom: 20 }]}>
                Routine Details
              </Text>
              <Text>Title: {selectedRoutine.title}</Text>
              <Text>Products: {selectedRoutine.products}</Text>
              <Text>Frequency: {selectedRoutine.frequency}</Text>
              <Text>
                {selectedRoutine.days && (
                  <Text>Days: {selectedRoutine.days.join(", ")}</Text>
                )}
              </Text>
              {selectedRoutine.hours && (
                <Text>Hours: {selectedRoutine.hours.map(((hour, index) => {
                  const text = Date.parse('04 Dec 1995 00:12:00 GMT');
                  return <Text key={index}>{text}</Text>}))}</Text>
              )}
              <Button
                label="Delete"
                onPress={() => handleDeleteRoutine(selectedRoutine)}
                backgroundColor={"#F38C79"}
              />
            </View>
          </View>
        </Modal>





      )}
    </View>
  );
};

export default Routines;
