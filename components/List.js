import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListContext } from '../listContext.js';
import TimerInputModal from "./TimerInputModal";

const List = () => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    const [editIdx, setEditIdx] = useState(null);
    
    let row = [];
    let prevOpenedRow;

    // i have no idea why it is flipped but it is
    const deleteExercise = async (item, index) => {
        console.log("item: " + JSON.stringify(routineList[currentRoutineIdx].exercises[index]));
        const updatedExerciseList = [...routineList[currentRoutineIdx].exercises];
        updatedExerciseList.splice(index, 1);
        const newRoutineList = [...routineList];
        newRoutineList[currentRoutineIdx].exercises = updatedExerciseList;    
        setRoutineList(newRoutineList);
        console.log("NEW ROUTINE LIST: " + JSON.stringify(newRoutineList));
        try {
          const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
        } catch (error) {
          console.log("An error has occurred");
        } 
    }

    const handleEditButton = (index) => {
        setEditIdx(index);
        row[index].close();
    }

    const renderRightActions = (idx, item) => {
        return (
            <View style={styles.viewSwipeButtonSet}>
                <TouchableOpacity onPress={() => handleEditButton(idx)}>
                    <Icon name='create-outline' color='#F4F3F2' size={hp('3%')} style={styles.iconSwipeEdit} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteExercise(item, idx) }>
                    <Icon name='trash-outline' color='#F4F3F2' size={hp('3%')} style={styles.iconSwipeDelete} />
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
        <View style={styles.viewList}>
            <FlatList
                data={routineList[currentRoutineIdx].exercises}
                keyExtractor = {item => item.id}
                renderItem={({index, item}) => 
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
        </View>
    )
}

export default List;

const ListElement = ({item, index, editIdx, handleCancel}) => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

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
        handleCancel(true);
    }

    const cancelTextChange = () => {
        setTitle(item.title);
        handleCancel(true);
    }

    const editTime = () => {
        setOpenTimerModal(true);
    }

    const cancelTimerInput = () => {
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

    return (
        <View style={styles.viewListElement} >
            <View style={styles.viewListElementNotEdit}>
                <TextInput 
                    value={title}
                    onChangeText={setTitle}
                    editable={editIdx === index ? true : false}
                    style={editIdx === index ?  styles.textListItemTitle : styles.textListItemTitleDisabled}
                />
                <TouchableOpacity onPress={editTime} disabled={editIdx !== index}>
                    <Text style={styles.textListItem}>{time}</Text>
                </TouchableOpacity>
                <TimerInputModal 
                    submitInput={handleTimerInput}
                    cancelChange={cancelTimerInput}
                    openModal={openTimerModal}
                    setOpenModal={setOpenTimerModal} 
                />
            </View>
            {(editIdx === index) &&
                <View style={styles.viewButtonSet}>
                    <TouchableOpacity onPress={cancelTextChange} style={styles.buttonCancel}>
                        <Text style={styles.textCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={editText} style={styles.buttonConfirm}>
                        <Text style={styles.textConfirm}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}
const textColor = '#F4F3F2';
const bgColor = '#1e272e';

const styles = StyleSheet.create({
    viewList: {
        backgroundColor: bgColor, 
        flex: 1, 
        paddingTop: hp('1%'),
        marginHorizontal: wp('2%'),
    },
    viewSwipeButtonSet: {
        flexDirection: 'row', 
        backgroundColor: bgColor, 
        marginBottom: hp('1%'), 
        marginRight: wp('1%'), 
    },
    iconSwipeEdit: {
        paddingLeft: wp('3%'), 
        paddingRight: wp('2%'), 
        height: '100%', 
        backgroundColor: '#575fcf', 
        paddingTop: '4%', 
        alignItems: 'center', 
        justifyContent: 'center', 
    }, 
    iconSwipeDelete: {
        paddingHorizontal: wp('2%'), 
        height: '100%', 
        backgroundColor: '#f53b57',
        paddingTop: '4%',
    },
    viewListElement: {
        backgroundColor: bgColor,
        borderWidth: 2.5,
        borderColor: textColor,
        marginBottom: hp('1%'),
    },
    viewListElementNotEdit: {
        padding: hp('1.5%'),
        marginHorizontal: wp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textListItem: {
        fontSize: hp('2%'),
        color: textColor,
    },
    textListItemTitle: {
        fontSize: hp('2%'),
        color: textColor,
        width: '70%'
    },
    textListItemTitleDisabled: {
        color: textColor,
        fontSize: hp('2%'),
        width: '70%',
        flexWrap: 'wrap',
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
        paddingVertical: hp('0.5%'), 
    },
    textCancel: {
        textAlign: 'center', 
        color: textColor, 
        fontWeight: 'bold', 
        fontSize: hp('2%')
    },
    buttonConfirm: {
        backgroundColor: '#05c46b', 
        height: '100%',
        width: '50%', 
        paddingVertical: hp('0.5%'), 
    },
    textConfirm: {
        textAlign: 'center', 
        color: textColor, 
        fontWeight: 'bold', 
        fontSize: hp('2%')
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    exerciseBodyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})
