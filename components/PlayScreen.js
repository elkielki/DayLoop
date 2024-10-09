import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ListContext } from '../listContext.js';
import { Audio } from 'expo-av';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

/*  This is the screen that shows up when the user wants to play a routine.
    It shows the timer, play/pause icons, and the task title similar to a playlist
*/
const PlayScreen = ({handleClose}) => {
    // Getting and setting user's routine list and current routine index
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;
    // Current task in routine
    const [currentExercise, setCurrentExercise] = useState(routineList[currentRoutineIdx].exercises[0]);
    // Timer
    const { hrs, mins, secs } = getRemaining(remainingSecs);
    const formattedTime = getRemaining(remainingSecs);
    // Remaining seconds on timer for current task
    const [remainingSecs, setRemainingSecs] = useState(routineList[currentRoutineIdx].exercises[0].timer);
    // True when timer is running
    const [isActive, setIsActive] = useState(false);

    const [soundExercise, setSoundExercise] = useState();
    const [soundExerciseReplay, setSoundExerciseReplay] = useState(false);

    // Initializes bell sound
    useEffect(() => {
        async function initiateSound() {
            const { sound } = await Audio.Sound.createAsync(require('../assets/exerciseBell.mp3'));
            setSoundExercise(sound);
        }
        initiateSound();
    }, [])

    // Handles the timer
    useEffect(() => {
      let interval = null;
      if (isActive) {
        // Plays bell sound and moves onto next task when timer reaches 0
        if (remainingSecs == 0) {
            playSound();
            startNextExercise();
        } // Timer countdown
        else {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs - 1);
            }, 1000)
        }
      } // Stop the timer when paused
      else if (!isActive && remainingSecs !== 0) {
        clearInterval(interval)
      }
      return () => clearInterval(interval);
    }, [isActive, remainingSecs])

    // Plays bell sound and resets it for next use
    const playSound = async () => {
        if (!soundExerciseReplay) { 
            await soundExercise.playAsync();
            setSoundExerciseReplay(true);
        }
        else {
            await soundExercise.replayAsync();
        }
    }

    // Return time left on timer
    const getRemaining = (time) => {
      const hr = Math.floor(time / 3600)
      const min = Math.floor((time - (hr * 3600)) / 60);
      const sec = time - (hr * 3600) - (min * 60);
      const formattedTime = formatTimer({ hr, min, sec });
      return formattedTime; 
    }

    // Formats the remaining time into hours, minutes, and seconds
    const formatTimer = ({hr, min, sec}) => {
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

    // Pauses and plays timer
    const toggleTimer = () => {
      setIsActive(!isActive);
    };

    // Moves to the next task in the routine
    const startNextExercise = () => {
        let index = routineList[currentRoutineIdx].exercises.indexOf(routineList[currentRoutineIdx].exercises.find((exercise) => {
            return exercise === currentExercise;
        }))
        setCurrentExercise(current => routineList[currentRoutineIdx].exercises[index + 1])
        setRemainingSecs(routineList[currentRoutineIdx].exercises[index + 1].timer);
    }
 
    // Moves to the previous task in the routine
    const startPreviousExercise = () => {
        let index = routineList[currentRoutineIdx].exercises.indexOf(routineList[currentRoutineIdx].exercises.find((exercise) => {
            return exercise === currentExercise;
        }))
        // In case the current task is the first task
        if (index == 0) {
            return;
        }
        else {
            setCurrentExercise(current => routineList[currentRoutineIdx].exercises[index - 1])
            setRemainingSecs(routineList[currentRoutineIdx].exercises[index - 1].timer)
        }
    }

    return (
        <View style={styles.safeAreaView}>
            {/* Close button */}
            <TouchableOpacity onPress={() => handleClose(false)}>
                <Icon name='close-outline' color={textColor} size={hp('4%')} style={styles.endButton} />
            </TouchableOpacity>
            
            {/* Current task info */}
            <Text style={styles.routineTitle}>{routineList[currentRoutineIdx].title}</Text>
            <Text style={styles.currentExerciseTitle} >{currentExercise.title}</Text>
            <Text style={styles.currentTime} >{formattedTime}</Text>
            
            {/* Buttons */}
            <View style={styles.buttonView}>
                <TouchableOpacity onPress={startPreviousExercise}>
                    <Icon name='play-back-outline' color={textColor} size={hp('7%')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleTimer}>
                    {isActive ?
                        <Icon name='pause-outline' color={textColor} size={hp('7%')} />
                        :
                        <Icon name='play-outline' color={textColor} size={hp('7%')} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={startNextExercise}>
                    <Icon name='play-forward-outline' color={textColor} size={hp('7%')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // App screen
    safeAreaView: {
        backgroundColor: bgColor,
        width: wp('80%'),
        height: hp('60%'),
    },
    routineTitle: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('3%'), 
        color: textColor,
        paddingBottom: hp('3%'),
        paddingTop: hp('4%'),
    },
    // Name of task
    currentExerciseTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('6%'), 
        color: textColor,
        paddingBottom: hp('2.5%'),
    },
    // Timer 
    currentTime: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('7%'), 
        color: textColor,
        paddingBottom: hp('3%'),
    },
    // View containing previous, pause, and next buttons
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    // Close "x" button
    endButton: {
        paddingTop: hp('1%'),
        paddingRight: wp('2%'),
        textAlign: 'right',
        color: textColor,
    },
})

export default PlayScreen;