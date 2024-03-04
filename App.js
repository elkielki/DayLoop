import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Modal from "react-native-modal";
import PlayScreen from './PlayScreen';
import { NestableScrollContainer, DraggableFlatList } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//import DurationPicker from 'react-duration-picker'
import WheelPicker from 'react-native-wheely';
import SwipeableFlatList from 'react-native-swipeable-list';
import Input from './Input.js';

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
        { title: "Walk", timer: 600 },
        { title: "Break", timer: 300 },
        { title: "Sprint", timer: 600 },
        { title: "Break", timer: 600 },
        { title: "Walk", timer: 600 },
        { title: "Break", timer: 300 },
        { title: "Sprint", timer: 600 },
        { title: "Break", timer: 600 },
        { title: "Cooldown Stretch", timer: 600 },
      ],
    }
];

const [routineList, setRoutineList] = useState(initialRoutineListData);
const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);


  const [isLoading, setIsLoading] = useState(true);
  const [routineList, setRoutineList] = useState(initialRoutineListData);
  // the current routine
  const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);
  // to begin the timer for the routine
  const [startRoutine, setStartRoutine] = useState(false);

// ROUTINE MODAL STATES ____________________________________________________
  // for routine modal visibility
  const [routineMenuOpen, setRoutineMenuOpen] = useState(false);
  // for new routine title in routine form
  const [newRoutineInput, setNewRoutineInput] = useState('');
  const [invalidRoutineResponse, setInvalidRoutineResponse] = useState(false);
  const [openNewRoutineForm, setOpenNewRoutineForm] = useState(false);

// ___________________________________________________________________________________
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
  setIsLoading(false);
}, [])
  
// ROUTINE FUNCTIONS _______________________________________________________________
  const handleNewRoutine = async (val) => {
    if (val) {
      if (newRoutineInput.trim() != '') {
        const newRoutineList = [...routineList, {title: newRoutineInput, exercises: []}]
        setRoutineList(newRoutineList)
        setCurrentRoutineIdx(newRoutineList.length - 1);
        setRoutineMenuOpen(false);
        setInvalidRoutineResponse(false);
        setNewRoutineInput('');
        setOpenNewRoutineForm(false);
        try {
          const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
        } catch (error) {
          console.log("An error has occurred");
        }
        try {
          const storedCurrRoutineIdx = await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(currentRoutineIdx));
        } catch (error) {
          console.log("An error has occurred");
        }
      }
      else {
        setInvalidRoutineResponse(true);
      }
    }
    else {
      setRoutineMenuOpen(false);
      setInvalidRoutineResponse(false);
      setNewRoutineInput('');
      setOpenNewRoutineForm(false);
    }
  }

  
// ___________________________________________________________________________
// FOR ADD EXERCISE FORM ___________________________________________
  // to set the state for whether a routine can be edited or not
  const [editState, setEditState] = useState(false);
  // to show the new exercise form
  const [createNewExercise, setCreateNewExercise] = useState(false);
  // for a new exercise title input
  const [newExerciseInput, setNewExerciseInput] = useState('');
  // whether the user left the timer or exercise title blank
  const [invalidInput, setInvalidInput] = useState(false);
  const [titleInput, setTitleInput] = useState('aaa');
//__________________________________________________________________________________
// EXERCISE FUNCTIONS ____________________________________________________

  const editText = (text, idx) => {
    const copy = [...routineList[currentRoutineIdx].exercises];
    let updatedElement = {...copy[idx], title: text};
    copy[idx] = updatedElement;
    let updatedRoutineList = [...routineList];
    let updatedRoutine = {...updatedRoutineList[currentRoutineIdx], exercises: copy};
    updatedRoutineList[currentRoutineIdx] = updatedRoutine;
    setRoutineList(updatedRoutineList);
    try {
      AsyncStorage.setItem("routineList", JSON.stringify(updatedRoutineList));
    } catch (error) {
      console.log("An error has occurred");
    }
  }

  const renderQuickActions = (idx) => {
    return (
      <View style={styles.quickActions}>
        <TouchableOpacity onPress={() => setEditIdx(idx)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const [editIdx, setEditIdx] = useState(null);

  /* value={editIdx === index ? titleInput : item.title}
            onChangeText={text => setTitleInput(text)}
            editable={editIdx === index} */
  // what is displayed for each exercise
  const renderExercise = ({item, index}) => {
    return (
      <View style={styles.exerciseView}>
        <View style={styles.exerciseBodyView}>
          {editState && 
            <TouchableOpacity disabled={!editState}>
              <Icon name='menu-outline' color={ICON_COLOR} style={styles.sortButton} />
            </TouchableOpacity>
          }
          <Input
            itemTitle={item.title}

          /> 
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

  const deleteExercise = async (data) => {
    const updatedExerciseList = routineList[currentRoutineIdx].exercises.filter(function(exercise) {
      return exercise !== data
    })
    const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
    const newRoutineList = [...routineList];
    newRoutineList[currentRoutineIdx] = updatedRoutine;
    setRoutineList(newRoutineList);
    try {
      const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
    } catch (error) {
      console.log("An error has occurred");
    }
  }

  // formats the time for the exercise display
  const formatTime = (time) => {
    const hr = Math.floor(time / 3600)
    const min = Math.floor((time - (hr * 3600)) / 60);
    const sec = time - (hr * 3600) - (min * 60);;
    let timeStr = '';
    if (hr < 10) {
      timeStr = '0' + hr + ':'; 
    }
    else {
        timeStr = hr + ':';
    }
    if (min < 10) {
        timeStr = timeStr + '0' + min + ':';
    }
    else {
        timeStr = timeStr + min + ':';
    }
    if (sec < 10) {
        timeStr = timeStr + '0' + sec;
    }
    else {
        timeStr = timeStr + sec;
    }
    return timeStr;
  }

// EXERCISE FUNCTIONS END _____________________________________________________________
// FOR TIMER INPUT _________________________________________________

  // for when the user inputs the timer for a new exercise
  const [editTimerInput, setEditTimerInput] = useState(false);
  const [timerInput, setTimerInput] = useState(false);
  // shows the timer scroll wheel/user input modal
  const [visible, setVisible] = useState(false);
  const [selectedHrIdx, setSelectedHrIdx] = useState(0);
  const [selectedSecIdx, setSelectedSecIdx] = useState(0);
  const [selectedMinIdx, setSelectedMinIdx] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedSecond, setSelectedSecond] = useState(0);
  // the formatting for the time that is displayed for each exercise
  const [formattedTime, setFormattedTime] = useState("");
  //const [timer, setTimer] = useState({hours: 0, minutes: 0, seconds: 0});

// _________________________________________________________________  
// TIMER INPUT FUNCTIONS ______________________________________________________________
  
  // actions after user clicks "Create" to create a new exercise 
  const addNewExercise = async () => {
    if (newExerciseInput.trim() != '') {
      if ((formattedTime != '') || (formattedTime != '00:00:00')) {
        console.log("entered here");
        const totalSeconds = hours[selectedHrIdx] * 3600 + minutes[selectedMinIdx] * 60 + seconds[selectedSecIdx];
        const updatedExerciseList = [...routineList[currentRoutineIdx].exercises,  { title: newExerciseInput, timer: totalSeconds }];
        const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
        const newRoutineList = [...routineList];
        newRoutineList[currentRoutineIdx] = updatedRoutine;
        setRoutineList(newRoutineList);
        setInvalidInput(false);
        setCreateNewExercise(false);
        try {
          const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
        } catch (error) {
          console.log("An error has occurred");
        }
      } else {
        setInvalidInput(true);
      }
    } else {
      setInvalidInput(true);
    }
  }

  const hours = Array.from(Array(24).keys());
  const minutes = Array.from(Array(60).keys());
  const seconds = Array.from(Array(60).keys());

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

  const handleTimerInput = () => {
    let formatted = '';
    if (hours[selectedHrIdx] < 10) {
      formatted = '0' + hours[selectedHrIdx] + ':';
    } else {
      formatted = hours[selectedHrIdx] + ':';
    }
    if (minutes[selectedMinIdx] < 10) {
      formatted = formatted + '0' + minutes[selectedMinIdx] + ':';
    } else {
      formatted = formatted + minutes[selectedMinIdx] + ':';
    }
    if (seconds[selectedSecIdx] < 10) {
      formatted = formatted + '0' + seconds[selectedSecIdx];
    } else {
      formatted = formatted + seconds[selectedSecIdx];
    }
    setFormattedTime(formatted);
    setTimerInput(true);
    setOpenTimerModal(false);
  }

  const handleEditState = (val) => {
    if (val) {
      setEditState(true);
    } else {
      setEditState(false);
      setCreateNewExercise(false);
      setNewExerciseInput('');
      setInvalidInput(false);
      setFormattedTime('');
      setTimerInput(false);
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

  const newExerciseComponent = () => {
    return (
      <View>
        <View style={styles.newExerciseView}>
          {editState && 
            <TouchableOpacity onPress={() => setCreateNewExercise(!createNewExercise)} style={styles.closeAddButton} >
              {createNewExercise ? 
                <Icon name='close-circle-outline' color={ICON_COLOR} size={30} style={styles.closeAddButton} />
                :
                <Icon name='add-circle-outline' color={ICON_COLOR} size={30} style={styles.closeAddButton} />
              }
            </TouchableOpacity>
          }
        </View>
        {createNewExercise && 
          <View>
            <View style={styles.newExerciseSubView}>
              <TextInput
                onChangeText={setNewExerciseInput}
                value={newExerciseInput}
                placeholder='New Task'
                style={styles.textInput}
              />
              <TouchableOpacity onPress={() => setOpenTimerModal(true)} style={styles.timerInputLabel}>
                <Text>{timerInput ? formattedTime : "00:00:00"}</Text>
              </TouchableOpacity>
            </View>
            <Modal isVisible={openTimerModal}  backdropOpacity={0.8} backdropColor='black' style={{alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setOpenTimerModal(false)}>
                <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
              </TouchableOpacity>
              <View style={styles.timerWheel}>
                <WheelPicker
                  selectedIndex={selectedHrIdx}
                  options={hours}
                  onChange={(idx) => setSelectedHrIdx(idx)}
                />
                <Text>hrs</Text>
                <WheelPicker
                  selectedIndex={selectedMinIdx}
                  options={minutes}
                  onChange={(index) => setSelectedMinIdx(index)}
                />
                <Text>mins</Text>
                <WheelPicker
                  selectedIndex={selectedSecIdx}
                  options={seconds}
                  onChange={(idx) => setSelectedSecIdx(idx)}
                />
                <Text>secs</Text>
                <Button onPress={handleTimerInput} title="Confirm" />
              </View>
            </Modal>
            {invalidInput && <Text>Please fill in all the blanks.</Text>}
            <Button onPress={addNewExercise} title="Create" />
          </View>
        }
      </View>
      )
    }

  // have to remove safeareaview for android and just switch with marginTop 
  return (
    <GestureHandlerRootView  >
      <SafeAreaView style={styles.safeAreaView} >
      {isLoading ? 
          <View>
            <Text>Loading!</Text>
          </View>
          :
          routineList.length == 0 ?
            <View>
              <Text>Home</Text>
              <Text>No circuits! Create one above. </Text>
            </View> 
            :
            (<View>


          <View style={styles.scrollContainer}>
            <View style={styles.toolbar}>
                {(routineList[currentRoutineIdx].exercises.length !== 0) &&
                  <TouchableOpacity onPress={() => setStartRoutine(true)} style={styles.toolbarButtons}>
                    <Icon name='play-outline' color={ICON_COLOR} size={30} />
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => handleEditState(!editState)}>
                  <Text>{!editState ? 'Edit' : 'Done'}</Text>
                </TouchableOpacity>
              </View>
                
              <View>
                  {(routineList[currentRoutineIdx].exercises.length !== 0) ?     
                    <View>
                        <SwipeableFlatList
                          keyExtractor={(item, index) => ('list' + index.toString())}
                          data={routineList[currentRoutineIdx].exercises}
                          renderItem={renderExercise}
                          maxSwipeDistance={70}
                          renderQuickActions={(item, index) => renderQuickActions(index)}
                          shouldBounceOnMount={true}
                        />
                    </View>
                    :
                    <Text>Click "Edit" to create your routine.</Text>
                  }

              </View>
              <Modal isVisible={startRoutine} backdropOpacity={0.8} backdropColor='black' style={{alignItems: 'center'}}>
                <PlayScreen routine={routineList[currentRoutineIdx]} handleClose={setStartRoutine}/>
              </Modal>
          </View>
        </View>)} 
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
    backgroundColor: 'grey'
  },
  exerciseView: {
    backgroundColor: 'white',
  //  borderStyle: 'double',
    borderWidth: 2,
    borderColor: 'grey',
    padding: hp('1.5%'),
    marginHorizontal: wp('1%'),
    marginBottom: hp('0.5%')
  /*  height: '26%',
    width: '95%',
    fontSize: 5,
    padding: 0,
    marginHorizontal: 10,  */
  },
  exerciseBodyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: hp('4.5%'), 
    color: TEXT_COLOR,
    paddingTop: hp('5%'),
    paddingBottom: hp('2%'),
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
 //   paddingBottom: hp('5%')
  },
  toolbarButtons: {
    borderRadius: 2,
    backgroundColor: 'grey',
  },
  endButton: {
    textAlign: 'right',
    color: ICON_COLOR,
    fontSize: hp('1%'),
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    width: wp('65%'),
  //  marginHorizontal: wp('4%'),
    paddingHorizontal: wp('3%'),
    alignSelf: 'center',
  },
  timerWheel: {
    display: 'flex',
    flexDirection: 'row',
  },
  newExerciseView: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'grey',
    paddingVertical: hp('0.5%'),
    marginHorizontal: wp('1%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  newExerciseSubView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('2%'),
  },
  timerInputLabel: {
  },
  closeAddButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sortButton: {
    textAlign: 'left',
    color: ICON_COLOR,
    fontSize: hp('3%'),
  },
  quickActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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