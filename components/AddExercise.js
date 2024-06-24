import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListContext } from '../listContext.js';
import TimerInputModal from "./TimerInputModal";

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

const AddExerciseForm = ({openForm}) => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;
    
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
            if (!((time.hours === 0) & (time.minutes === 0) & (time.seconds === 0))) {
                const newId = Math.floor(Date.now() * Math.random());
                const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
                const updatedExerciseList = [...routineList[currentRoutineIdx].exercises,  { id: newId, title: newExerciseInput, timer: totalSeconds }];
                const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
                const newRoutineList = [...routineList];
                newRoutineList[currentRoutineIdx] = updatedRoutine;
                setRoutineList(newRoutineList);
                setNewExerciseInput('');
                setFormattedTime('00:00:00');
                setInvalidInput(false);
                openForm(false);
                setTime({hours: 0, minutes: 0, seconds: 0});
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
        setOpenTimerModal(false);
    }

    const closeForm = () => {
        openForm(false);
        setNewExerciseInput('');
        setTime({hours: 0, minutes: 0, seconds: 0});
        setFormattedTime('00:00:00');
    }

    return (
        <View style={styles.viewMain} >
            <View style={styles.viewInputBox}>
                <TextInput
                    onChangeText={(text) => setNewExerciseInput(text)}
                    value={newExerciseInput}
                    placeholder='New Task'
                    placeholderTextColor='#617182'
                    color={textColor}
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={() => setOpenTimerModal(true)} style={styles.buttonTimeInput}>
                    <Text style={styles.textTimeInput}>{formattedTime}</Text>
                </TouchableOpacity>
            </View>
            <TimerInputModal  
                submitInput={handleTimerInput} 
                cancelChange={cancelTimerInput}
                openModal={openTimerModal}
                setOpenModal={setOpenTimerModal} 
            />
            {invalidInput && <Text style={styles.textInvalid}>Please fill in all the blanks.</Text>} 
            <View style={styles.viewButtonSet}>
                <TouchableOpacity onPress={closeForm} style={styles.buttonCancel}>
                    <Text style={styles.textCancel}>Cancel</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={addNewExercise} style={styles.buttonCreate}>
                    <Text style={styles.textCreate}>Create</Text>    
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

export default AddExerciseForm;

const styles = StyleSheet.create({
    viewMain: {
        backgroundColor: bgColor,
        borderWidth: 3,
        borderColor: textColor,
        marginHorizontal: wp('1%'),
        marginBottom: hp('1.5%'),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    viewInputBox: {
        backgroundColor: bgColor,
        padding: hp('1.5%'),
        marginHorizontal: wp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        backgroundColor: bgColor,
        borderRadius: 4, 
        borderColor: textColor, 
        borderWidth: 1,
        color: textColor, 
        width: wp('70%'), 
        paddingTop: 2, 
        paddingLeft: 7,
    },
    buttonTimeInput: {
        backgroundColor: '#485460', 
        borderRadius: 4,
        paddingTop: hp('0.6%'), 
        paddingHorizontal: wp('1.5%'),
    },
    textTimeInput: {
        verticalAlign: 'middle',
        color: textColor,
    },
    textInvalid: {
        textAlign: 'center',
        color: textColor,
        borderColor: textColor,
        paddingBottom: hp('0.5%'),
    },
    viewButtonSet: {
        flexDirection: 'row', 
        backgroundColor: '#808e9b', 
        justifyContent: 'space-between', 
        width: '100%',  
    },
    buttonCancel: {
        backgroundColor: '#485460', 
        height: '100%', 
        width: '50%', 
        paddingVertical: hp('1%'), 
    },
    textCancel: {
        textAlign: 'center', 
        fontWeight: 'bold',
        color: textColor,
    },
    buttonCreate: {
        backgroundColor: '#575fcf', 
        height: '100%',
        width: '50%', 
        paddingVertical: hp('1%'), 
    },
    textCreate: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: textColor,
    },
})