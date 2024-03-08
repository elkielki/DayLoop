import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, Button, SafeAreaView, StyleSheet, Image } from 'react-native';
import { TimerPickerModal } from "react-native-timer-picker";
import MenuDrawer from 'react-native-side-drawer'
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ListContext} from '../listContext.js';

const ICON_COLOR = 'black'; 
const TEXT_COLOR = 'black';

const PlayScreen = ({handleClose}) => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    const [currentExercise, setCurrentExercise] = useState(routineList[currentRoutineIdx].exercises[0]);
    const [remainingSecs, setRemainingSecs] = useState(routineList[currentRoutineIdx].exercises[0].timer);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      let interval = null;
      if (isActive) {
        if (remainingSecs == 0) {
            startNextExercise();
        } else {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs - 1);
            }, 1000)
        }
      } else if (!isActive && remainingSecs !== 0) {
        clearInterval(interval)
      }
      return () => clearInterval(interval);
    }, [isActive, remainingSecs])

    const getRemaining = (time) => {
      const hr = Math.floor(time / 3600)
      const min = Math.floor((time - (hr * 3600)) / 60);
      const sec = time - (hr * 3600) - (min * 60);
      const formattedTime = formatTimer({ hr, min, sec });
      return formattedTime; 
    }

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

    const { hrs, mins, secs } = getRemaining(remainingSecs);
    const formattedTime = getRemaining(remainingSecs);

    const toggleTimer = () => {
      setIsActive(!isActive);
      /* if (isActive) {
        pauseTimer();
      } else {
        startTimer();
      }  */
    };

    const startNextExercise = () => {
        let index = routineList[currentRoutineIdx].exercises.indexOf(routineList[currentRoutineIdx].exercises.find((exercise) => {
            return exercise === currentExercise;
        }))
        if (index == (routineList[currentRoutineIdx].exercises.length - 1)) {
            return;
        }
        else {
            setCurrentExercise(current => routineList[currentRoutineIdx].exercises[index + 1])
            setRemainingSecs(routineList[currentRoutineIdx].exercises[index + 1].timer);
        }
    }
 
    const startPreviousExercise = () => {
        let index = routineList[currentRoutineIdx].exercises.indexOf(routineList[currentRoutineIdx].exercises.find((exercise) => {
            return exercise === currentExercise;
        }))
        if (index == 0) {
            return;
        }
        else {
            setCurrentExercise(current => routineList[currentRoutineIdx].exercises[index - 1])
            setRemainingSecs(routineList[currentRoutineIdx].exercises[index - 1].timer)
        }
    }

// have to set currentexercise and find a way to loop it when the timer ends
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <TouchableOpacity onPress={() => handleClose(false)}>
                <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
            </TouchableOpacity>
            <Text style={styles.routineTitle}>{routineList[currentRoutineIdx].title}</Text>
            <Text style={styles.currentExerciseTitle} >{currentExercise.title}</Text>
            <Text style={styles.currentTime} >{formattedTime}</Text>
            <View style={styles.buttonView}>
                <TouchableOpacity onPress={startPreviousExercise}>
                    <Icon name='play-back-outline' color={ICON_COLOR} size={50} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleTimer}>
                    {isActive ?
                        <Icon name='pause-outline' color={ICON_COLOR} size={50} />
                        :
                        <Icon name='play-outline' color={ICON_COLOR} size={50} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={startNextExercise}>
                    <Icon name='play-forward-outline' color={ICON_COLOR} size={50} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
    //    flex: 1,
        backgroundColor: 'white',
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
        color: TEXT_COLOR,
        paddingBottom: hp('3%'),
        paddingTop: hp('8%'),
    },
    currentExerciseTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('6%'), 
        color: TEXT_COLOR,
        paddingBottom: hp('2.5%'),
    },
    currentTime: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('7%'), 
        color: TEXT_COLOR,
        paddingBottom: hp('3%'),
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    endButton: {
        paddingTop: hp('1%'),
        paddingRight: wp('2%'),
        textAlign: 'right',
        color: ICON_COLOR,
    //    fontSize: 15,
    },
})

export default PlayScreen;