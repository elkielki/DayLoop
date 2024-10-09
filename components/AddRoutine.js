import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListContext } from '../listContext.js';
import TimerInputModal from "./TimerInputModal.js";

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

// Creates the form the user can fill to create a new routine 
const AddRoutineForm = ({openForm}) => {
    // Getting and setting user's routine list and current routine index
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;
    
    // Title of new task
    const [newTaskInput, setNewTaskInput] = useState('');
    // Shows error message when inputted title or time for new task is invalid
    const [invalidInput, setInvalidInput] = useState(false);

    // Opens modal for timer input
    const [openTimerModal, setOpenTimerModal] = useState(false);
    // How the new task's timer will be displayed in the routine list
    const [formattedTime, setFormattedTime] = useState('00:00:00');
    // New task's timer 
    const [time, setTime] = useState({hours: 0, minutes: 0, seconds: 0});
    
    // Actions after user clicks "Create" to create new task 
    const addNewTask = async () => {
        if (newTaskInput.trim() != '') {
            // If valid title and time inputted for new task
            if (!((time.hours === 0) & (time.minutes === 0) & (time.seconds === 0))) {
                // Unique id for task
                const newId = Math.floor(Date.now() * Math.random());
                // Time inputted in seconds
                const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
                // Add task to routine and update routine list
                const updatedExerciseList = [...routineList[currentRoutineIdx].exercises,  { id: newId, title: newTaskInput, timer: totalSeconds }];
                const updatedRoutine = {...routineList[currentRoutineIdx], exercises: updatedExerciseList};
                const newRoutineList = [...routineList];
                newRoutineList[currentRoutineIdx] = updatedRoutine;
                setRoutineList(newRoutineList);
                // Reset form values
                setNewTaskInput('');
                setFormattedTime('00:00:00');
                setInvalidInput(false);
                openForm(false);
                setTime({hours: 0, minutes: 0, seconds: 0});
                // Update stored routine list
                try {
                    const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
                } catch (error) {
                    console.log("An error has occurred");
                }
            } // Return error message if invalid input 
            else {
                setInvalidInput(true);
            }
        } else {
            setInvalidInput(true);
        }
    }

    // Actions after timer input was submitted
    const handleTimerInput = (hrs, min, sec) => {
        // Formats time for display
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
        // Closes the timer input modal
        setOpenTimerModal(false);
    }

    // Closes the timer input modal when user clicks "Cancel"
    const cancelTimerInput = () => { 
        setOpenTimerModal(false);
    }

    // Closes the add routine form
    const closeForm = () => {
        openForm(false);
        // Resetting all the form values
        setNewTaskInput('');
        setTime({hours: 0, minutes: 0, seconds: 0});
        setFormattedTime('00:00:00');
    }

    return (
        <View style={styles.viewMain} >
            {/* Add routine form to edit title and timer input */}
            <View style={styles.viewInputBox}>
                <TextInput
                    onChangeText={(text) => setNewTaskInput(text)}
                    value={newTaskInput}
                    placeholder='New Task'
                    placeholderTextColor='#617182'
                    color={textColor}
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={() => setOpenTimerModal(true)} style={styles.buttonTimeInput}>
                    <Text style={styles.textTimeInput}>{formattedTime}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal to edit timer input */}
            <TimerInputModal  
                submitInput={handleTimerInput} 
                cancelChange={cancelTimerInput}
                openModal={openTimerModal}
                setOpenModal={setOpenTimerModal} 
            />

            {/* Error message for invalid input */}
            {invalidInput && <Text style={styles.textInvalid}>Please fill in all the blanks.</Text>} 
            
            {/* Cancel and create buttons for add routine form */}
            <View style={styles.viewButtonSet}>
                <TouchableOpacity onPress={closeForm} style={styles.buttonCancel}>
                    <Text style={styles.textCancel}>Cancel</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={addNewTask} style={styles.buttonCreate}>
                    <Text style={styles.textCreate}>Create</Text>    
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddRoutineForm;

const styles = StyleSheet.create({
    // View containing all the elements
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
    // View containing title input box and timer
    viewInputBox: {
        backgroundColor: bgColor,
        padding: hp('1.5%'),
        marginHorizontal: wp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // Input box for title for new routine
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
    // New routine's timer that user clicks to open timer input modal
    buttonTimeInput: {
        backgroundColor: '#485460', 
        borderRadius: 4,
        paddingTop: hp('0.6%'), 
        paddingHorizontal: wp('1.5%'),
    },
    // Text for buttonTimeInput
    textTimeInput: {
        verticalAlign: 'middle',
        color: textColor,
    },
    // Invalid text for when form is not properly filled in
    textInvalid: {
        textAlign: 'center',
        color: textColor,
        borderColor: textColor,
        paddingBottom: hp('0.5%'),
    },
    // View that contains the cancel and create buttons
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