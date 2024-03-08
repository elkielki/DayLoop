import React, {useState, useEffect, useContext, useRef} from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
//import SwipeableFlatList from 'react-native-swipeable-list';
//import { SwipeListView } from 'react-native-swipe-list-view';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListContext} from '../listContext.js';
import TimerInputModal from "./TimerInputModal";

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 

const List = () => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    const [editIdx, setEditIdx] = useState(null);
    
    let row = [];
    let prevOpenedRow;
    const closeRef = useRef();

    const deleteExercise = async ({item, index}) => {
        const updatedExerciseList = routineList[currentRoutineIdx].exercises.filter((exercise) => exercise.key !== index)
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

    const renderQuickActions = (idx, item) => {
        console.log("Quick Actions: " + item); 
        return (
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={() => setEditIdx(idx)}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteExercise(item, idx)}>
                <Icon name='trash-outline' color={ICON_COLOR} style={styles.endButton} />
            </TouchableOpacity>
          </View>
        )
    }

    const handleEditButton = (index) => {
        setEditIdx(index);
        row[index].close();
    }

    const renderRightActions = (idx, item) => {
        return (
            <View>
                <TouchableOpacity onPress={() => handleEditButton(idx)}>
                    <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteExercise(item, idx) }>
                    <Icon name='trash-outline' color={ICON_COLOR} style={styles.endButton} />
                </TouchableOpacity>
            </View>
        )
    };

    const cancelTitleChange = (cancelChange) => {
        if (cancelChange) {
            setEditIdx(null);
        }
    }

    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    }

    return (
        <View>
            {(routineList[currentRoutineIdx].exercises.length !== 0) ?     
                <FlatList
                    data={routineList[currentRoutineIdx].exercises}
                    key={(item, index) => ('list' + index.toString())}
                    renderItem={({item, index}) => 
                        <Swipeable 
                            ref={ref => (row[index] = ref)} 
                            renderRightActions={() => renderRightActions(index, item)} 
                            overshootRight={false}
                            onSwipeableOpen={() => closeRow(index)}
                        >
                            <ListElement item={item} index={index} editIdx={editIdx} handleCancel={cancelTitleChange} />    
                        </Swipeable> 
                    }   
                /> 
            :
                <Text>Click "Edit" to create your routine.</Text>
            }
        </View>
    )
}

/*
<SwipeListView
                    keyExtractor={(data, dataMap) => data.key}
                    data={routineList[currentRoutineIdx].exercises}
                    renderItem={({data, dataMap}) => <ListElement item={data.item} index={data.item.key} editIdx={editIdx} handleCancel={cancelTitleChange} />}
                    renderHiddenItem={({index, item}) => renderQuickActions(index, item)}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                
                    <SwipeableFlatList
                        keyExtractor={(item, index) => ('list' + index.toString())}
                        data={routineList[currentRoutineIdx].exercises}
                        renderItem={({item, index}) => <ListElement item={item} index={index} editIdx={editIdx} handleCancel={cancelTitleChange} />}
                        maxSwipeDistance={70}
                        renderQuickActions={({index, item}) => renderQuickActions(index, item)}
                        shouldBounceOnMount={true}
                    />
*/
export default List;

const ListElement = ({item, index, editIdx, handleCancel}) => {
    const [title, setTitle] = useState(item.title);
    const itemTimer = formatTime();
    const [time, setTime] = useState(itemTimer);

    const [openTimerModal, setOpenTimerModal] = useState(false);

    const editText = () => {
        const copy = [...routineList[currentRoutineIdx].exercises];
        let updatedElement = {...copy[index], title: title};
        copy[index] = updatedElement;
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

    const cancelTextChange = () => {
        setTitle(item.title);
        handleCancel(true);
    }

    const editTime = () => {
        setOpenTimerModal(true);
    }

    const cancelTimerInput = () => {
        setTime('00:00:00');
        setOpenTimerModal(false);
    }

    function formatTime() {
        const hr = Math.floor(item.timer / 3600)
        const min = Math.floor((item.timer - (hr * 3600)) / 60);
        const sec = item.timer - (hr * 3600) - (min * 60);;
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
        setTime(formatted);
        setOpenTimerModal(false);
    }

//title
    return (
            <View style={styles.exerciseView}>
                <TextInput 
                    value={title}
                    onChange={(text) => setTitle(text)}
                    editable={editIdx === index ? true : false}
                />
                <TouchableOpacity onPress={editTime} disabled={editIdx !== index}>
                    <Text>{time}</Text>
                </TouchableOpacity>
                <TimerInputModal 
                    submitInput={handleTimerInput}
                    cancelChange={cancelTimerInput}
                    openModal={openTimerModal}
                    setOpenModal={setOpenTimerModal} 
                />
                {(editIdx === index) &&
                    <View>
                        <Button onPress={editText} title='Confirm' />
                        <Button onPress={cancelTextChange} title='Cancel' />
                    </View>
                }
            </View>
    );
}

const styles = StyleSheet.create({
    endButton: {
        textAlign: 'right',
        color: ICON_COLOR,
        fontSize: hp('1%'),
    },
    quickActions: {
       // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    exerciseView: {
        backgroundColor: 'white',
      //  borderStyle: 'double',
        borderWidth: 2,
        borderColor: 'grey',
        padding: hp('1.5%'),
        marginHorizontal: wp('1%'),
        marginBottom: hp('0.5%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
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
})

/*

            {editState && 
                <TouchableOpacity onPress={() => deleteExercise(item, index)} disabled={!editState}>
                    <Icon name='trash-outline' color={ICON_COLOR} style={styles.endButton} />
                </TouchableOpacity>
            }

                {editState && 
                <TouchableOpacity disabled={!editState}>
                    <Icon name='menu-outline' color={ICON_COLOR} style={styles.sortButton} />
                </TouchableOpacity>
                }
                */