import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Modal from "react-native-modal";
import SwipeableFlatList from 'react-native-swipeable-list';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPicker from 'react-native-wheely';
import {ListContext} from '../listContext.js';
import TimerInputModal from "./TimerInputModal";

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 

const AddExerciseForm = () => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    // to set the state for whether a routine can be edited or not
    const [editState, setEditState] = useState(false);  // maybe not needed anymore
    
    // for a new exercise title input
    const [newExerciseInput, setNewExerciseInput] = useState('');

    // whether the user left the timer or exercise title blank
    const [invalidInput, setInvalidInput] = useState(false);

    const [openTimerModal, setOpenTimerModal] = useState(false);
    // the formatting for the time that is displayed for each exercise
    const [formattedTime, setFormattedTime] = useState('00:00:00');
    const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
    
    // actions after user clicks "Create" to create a new exercise 
    const addNewExercise = async () => {
        if (newExerciseInput.trim() != '') {
            if ((formattedTime != '00:00:00') || (formattedTime != null)) {
                console.log("entered here");
                const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
                const updatedExerciseList = [...routineList[currentRoutineIdx].exercises,  { title: newExerciseInput, timer: totalSeconds }];
                const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
                const newRoutineList = [...routineList];
                newRoutineList[currentRoutineIdx] = updatedRoutine;
                setRoutineList(newRoutineList);
                setNewExerciseInput('');
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

    const handleTimerInput = (hrs, min, sec) => {
        let formatted = '';
        if (hrs < 10) {
          formatted = '0' + hrs + ':';
        } else {
          formatted = hrs + ':';
        }
        if (min < 10) {
          formatted = formatted + '0' + min + ':';
        } else {
          formatted = formatted + min + ':';
        }
        if (sec < 10) {
          formatted = formatted + '0' + sec;
        } else {
          formatted = formatted + sec;
        }
        setFormattedTime(formatted);
        setTime({hours: hrs, minutes: min, seconds: sec});
        setOpenTimerModal(false);
    }

    const cancelTimerInput = () => {
        setFormattedTime('00:00:00'); 
        setOpenTimerModal(false);
    }

    return (
        <View style={styles.newExerciseView} >
            <View style={styles.newExerciseSubView}>
                <TextInput
                    onChangeText={(text) => setNewExerciseInput(text)}
                    value={newExerciseInput}
                    placeholder='New Task'
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={() => setOpenTimerModal(true)} style={styles.timerInputLabel}>
                    <Text>{formattedTime}</Text>
                </TouchableOpacity>
            </View>
            <TimerInputModal  
                submitInput={handleTimerInput} 
                cancelChange={cancelTimerInput}
                openModal={openTimerModal}
                setOpenModal={setOpenTimerModal} 
            />
            {invalidInput && <Text>Please fill in all the blanks.</Text>}
            <Button onPress={addNewExercise} title="Create" />
        </View>
    )
}
/* hrIdx={setSelectedHrIdx} 
minIdx={setSelectedMinIdx} 
secIdx={setSelectedSecIdx} */
export default AddExerciseForm;

const styles = StyleSheet.create({
    endButton: {
        textAlign: 'right',
        color: ICON_COLOR,
        fontSize: hp('1%'),
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
        backgroundColor: 'white',
        padding: hp('1.5%'),
        marginHorizontal: wp('1%'),
      //  marginBottom: hp('0.5%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
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
})