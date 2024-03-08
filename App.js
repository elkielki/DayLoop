import React, {useState, useEffect, useCallback, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { NestableScrollContainer, DraggableFlatList } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {ListContext} from './listContext.js';
import List from './components/List.js';
import PlayScreen from './components/PlayScreen.js';
import AddExerciseForm from './components/AddExercise.js';
import RoutineMenu from './components/RoutineMenu.js';
import Toolbar from './components/Toolbar.js';
//import DurationPicker from 'react-duration-picker'
//import Input from './Input.js';
import DeleteRoutine from './components/DeleteRoutine.js';

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 

const App = () => {
  const initialRoutineListData = [
    {
      title: "Routine 1",
      exercises: [
        { title: "Stretch", timer: 600}, 
        { title: "Push ups", timer: 600 },
        { title: "Break", timer: 300 },
        { title: "Sit ups", timer: 600 },
        { title: "Push ups", timer: 600 },
        { title: "Break", timer: 300 },
        { title: "Sit ups", timer: 600 },
      ],
    },
    {
      title: "Routine 2", 
      exercises: [
        {  title: "Walk", timer: 600 },
        {  title: "Break", timer: 300 },
        {  title: "Sprint", timer: 600 },
        {  title: "Break", timer: 600 },
        {  title: "Walk", timer: 600 },
        {  title: "Break", timer: 300 },
        {  title: "Sprint", timer: 600 },
        {  title: "Break", timer: 600 },
        {  title: "Cooldown Stretch", timer: 600 },
      ],
    }
  ];

  // list of all routines - basically all the data
  const [routineList, setRoutineList] = useState(initialRoutineListData);
  // the current routine
  const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [createNewExercise, setCreateNewExercise] = useState(false);
  const [firstCircuit, setFirstCircuit] = useState('');
  useEffect(() => {
    const getData = async () => {
      const launchCheck = await AsyncStorage.getItem("hasLaunched");
      if (launchCheck == null) {
        await AsyncStorage.setItem("routineList", JSON.stringify(initialRoutineListData));
        await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(0));
        await AsyncStorage.setItem("hasLaunched", "true");
      } else {
        try {
          const storedRL = await AsyncStorage.getItem("routineList");
          setRoutineList(JSON.parse(storedRL));
          console.log("RoutineList: " + JSON.stringify(routineList));
        } catch (error) {
          console.log("An error has occurred");
        }
        try {
          const storedCurrRoutineIdx = await AsyncStorage.getItem("currentRoutineIdx");
          setCurrentRoutineIdx(JSON.parse(storedCurrRoutineIdx));
        } catch (error) {
          console.log("An error has occurred");
        }
      }
    }
    getData();
    if (routineList) {
      setIsLoading(false);   
    }
  }, [])
  
// FOR ADD EXERCISE FORM ___________________________________________
  
//__________________________________________________________________________________
// EXERCISE FUNCTIONS ____________________________________________________

  

 // const [editIdx, setEditIdx] = useState(null);

  /* value={editIdx === index ? titleInput : item.title}
            onChangeText={text => setTitleInput(text)}
            editable={editIdx === index} */
  // what is displayed for each exercise
  

  // what is displayed for each exercise
  const renderExercise1 = ({item, index, drag, isActive}) => {
    return (
      <View style={styles.exerciseView}>
        <View style={styles.exerciseBodyView}>
          {editState && 
            <TouchableOpacity onLongPress={drag} disabled={!editState}>
              <Icon name='menu-outline' color={ICON_COLOR} style={styles.sortButton} />
            </TouchableOpacity>
          }
          <Text>{item.title}</Text> 
          <Text>{formatTime(item.timer)}</Text>
        </View>
        {editState && 
          <TouchableOpacity onPress={() => deleteExercise(item, index)} disabled={!editState}>
            <Icon name='trash-outline' color={ICON_COLOR} style={styles.endButton} />
          </TouchableOpacity>
        }
      </View>
    );
  };  

  // occurs after dragging exercises in a routine; updates the index
  const updateRoutine = async (data) => {
    const updatedRoutine = {...routineList[currentRoutineIdx], exercises: data};
    const newRoutineList = [...routineList];
    newRoutineList[currentRoutineIdx] = updatedRoutine;
    console.log("The data: " + JSON.stringify(data));
    setRoutineList(newRoutineList)
    try {
      const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
    } catch (error) {
      console.log("An error has occurred");
    }
  };

  

  

// EXERCISE FUNCTIONS END _____________________________________________________________
// FOR TIMER INPUT _________________________________________________

  // for when the user inputs the timer for a new exercise
  const [editTimerInput, setEditTimerInput] = useState(false);

  // shows the timer scroll wheel/user input modal
  const [visible, setVisible] = useState(false);
  
  //const [timer, setTimer] = useState({hours: 0, minutes: 0, seconds: 0});
  const [titleInput, setTitleInput] = useState('aaa');
// _________________________________________________________________  
// TIMER INPUT FUNCTIONS ______________________________________________________________

  

/*  // Timer input modal - actions after the user clicks accept
  const onAccept = () => {
    let timeStr = '';
    if (selectedHour == 0) {
        timeStr = '0' + selectedHour + ':'; 
    }
    else {
        timeStr = selectedHour + ':';
    }
    if (selectedMinute == 0) {
        timeStr = timeStr + '0' + selectedMinute + ':';
    }
    else {
        timeStr = timeStr + selectedMinute + ':';
    }
    if (selectedSecond == 0) {
        timeStr = timeStr + '0' + selectedSecond;
    }
    else {
        timeStr = timeStr + selectedSecond;
    }
    setFormattedTime(timeStr);
    setTimerInput(true);
  };  */

  // Adding Exercise Form: Handling timer input
/*  const handleTimerPickerChange = (duration) => {
    const { hrs, min, sec } = duration;
    let timeStr = '';
    if (hrs == 0) {
        timeStr = '0' + hrs + ':'; 
    }
    else {
        timeStr = hrs + ':';
    }
    if (min == 0) {
        timeStr = timeStr + '0' + min + ':';
    }
    else {
        timeStr = timeStr + min + ':';
    }
    if (selectedSecond == 0) {
        timeStr = timeStr + '0' + selectedSecond;
    }
    else {
        timeStr = timeStr + sec;
    }
    setFormattedTime(timeStr);
    setTimer({hrs, min, sec});
  }  */

  const [openTimerModal, setOpenTimerModal] = useState(false);

  

  const handleEditState = (val) => {
    if (val) {
      setEditState(true);
    } else {
      setEditState(false);
      setCreateNewExercise(false);
      setNewExerciseInput('');
      setInvalidInput(false);
      setFormattedTime('');
   //   setTimerInput(false);
      setVisible(false);
      setSelectedHour(0);
      setSelectedMinute(0);
      setSelectedSecond(0);
    //  setTimer({hours: 0, minutes: 0, seconds: 0}); 
    }
  }

// TIMER INPUT END _____________________________________________________________________



/*  const createCopy = (data, idx) => {
    const updatedExerciseList = routineList[currentRoutineIdx].exercises.slice(0);
    updatedExerciseList.splice(idx, 0, data);
    const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
    const newRoutineList = [...routineList];
    newRoutineList[currentRoutineIdx] = updatedRoutine;
    setRoutineList(newRoutineList);
    console.log("Copy idx: " + JSON.stringify(idx));
    const updatedExerciseList = [
      ...routineList[currentRoutineIdx].exercises.slice(0, idx+1), 
      data,
      ...routineList[currentRoutineIdx].exercises.slice(idx+1)
    ]
    const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
    const newRoutineList = [...routineList];
    newRoutineList[currentRoutineIdx] = updatedRoutine;
    console.log("Copy: " + JSON.stringify(updatedExerciseList));
    setRoutineList(newRoutineList);  
  } */


    

    /*
    // Add timer logic and sound playback logic here
  const startTimer = () => {
    setIsActive(true);
    Timer.setInterval('countdown', () => {
      setCurrentTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // Timer reached zero, stop the timer and play the sound
          setIsActive(false);
          playSound();
          return 0;
        }
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    setIsActive(false);
    Timer.clearInterval('countdown');
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setCurrentTime(duration);
    Timer.clearInterval('countdown');
  };
  
  

  const playSound = () => {
    // Specify the path to your sound file
    const soundPath = 'path/to/your/sound.mp3';
  
    const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.error('Sound playback failed');
        }
      });
    });
  } 
  */

  const deleteRoutine = async () => {
    let updatedRoutineList = [...routineList];
    updatedRoutineList = updatedRoutineList.filter(routine => (routine !== routineList[currentRoutineIdx]));
    setRoutineList(updatedRoutineList);
    try {
      const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(updatedRoutineList));
    } catch (error) {
      console.log("An error has occurred");
    }
  }
  // have to remove safeareaview for android and just switch with marginTop 
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaView style={styles.safeAreaView} >
        {isLoading ? 
          <View style={styles.loadingView}>
            <Text>Loading!</Text>
          </View>
        :
          <ListContext.Provider value={{routineValue: [routineList, setRoutineList], idxValue: [currentRoutineIdx, setCurrentRoutineIdx]}}>
            {routineList.length == 0 ?
              <View style={styles.loadingView}>
                <Text>Click the button to create your first routine.</Text>
                <Button title="Create Routine" onPress={createFirstRoutine} />
              </View> 
              :
              (<View>
                <RoutineMenu />
                <Toolbar setOpenForm={setCreateNewExercise} openForm={createNewExercise} />
                <List />
                {createNewExercise && <AddExerciseForm />}
                <DeleteRoutine />
              </View>)} 
          </ListContext.Provider>
        }
      </SafeAreaView>  
    </GestureHandlerRootView>
  );
};

export default App;



/*


              




                      {routineList[currentRoutineIdx].exercises.map((item, idx) => (
                      ))}
{editState && 
                              <TouchableOpacity disabled={!editState}>
                                <Icon name='menu-outline' color={ICON_COLOR} style={styles.sortButton} />
                              </TouchableOpacity>
                            }
<DraggableFlatList
                          data={routineList[currentRoutineIdx].exercises}
                          renderItem={renderExercise}
                          keyExtractor={(item, index) => ('list' + index.toString())}
                          onDragEnd={({data}) => updateRoutine(data)}
                          ListFooterComponent={newExerciseComponent}
                        /> 

<View key={'list' + idx} style={styles.exerciseView}>
                          <View style={styles.exerciseBodyView}>
                            <TextInput
                              value={editState ? titleInput : item.title}
                              onChangeText={text => setTitleInput(text)}
                              editable={editState} 
                            /> 
                            <Button title='Submit' onPress={() => editText}  />
                            <Text>{formatTime(item.timer)}</Text>
                          </View>
                          <Button title='Edit' onPress={() => setEditState(true)} />
                          {editState && 
                            <TouchableOpacity onPress={() => deleteExercise(item, idx)} disabled={!editState}>
                              <Icon name='trash-outline' color={ICON_COLOR} style={styles.endButton} />
                            </TouchableOpacity>
                          }
                        </View>

                      <DurationPicker
                        onChange={handleTimerPickerChange}
                        initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
                        maxHours={23}
                      />






    borderRadius: 10,
    marginTop: 10,
*/
const styles = StyleSheet.create({
  safeAreaView: {
    height: hp('100%'),
    width: wp('100%'),
  //  flex: 1,
    backgroundColor: 'white'
  },
  loadingView: {
    display: 'flex',
    flex: 1,
    paddingVertical: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButton: {
    textAlign: 'left',
    color: ICON_COLOR,
    fontSize: hp('3%'),
  },
  
  draggableList: {
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 100//hp('80%')
  }

});



/*
<MultiColumnModalPicker
                        visible={visible}
                        actionButtons="bottom"
                        column1={hours}
                        column2={minutes}
                        column3={seconds}
                        onValueChange1={(value) => handleHrChange(value)}
                        onValueChange2={(value) => handleMinChange(value)}
                        onValueChange3={(value) => handleSecChange(value)}
                        selectedValue1={selectedHour}
                        selectedValue2={selectedMinute}
                        selectedValue3={selectedSecond}
                        onClose={()=> setVisible(false)}
                        onAccept={onAccept}
                        // Custom styles
                        hPadding={20}
                        bgColor="#097CF6"
                        selectionHighlightColor="#0024FF"
                        cancelButtonBgColor="#2E7DD1"
                        cancelButtonTextStyle={{ color: "#F0F0F0" }}
                      />


*/