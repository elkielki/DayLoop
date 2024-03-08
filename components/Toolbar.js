import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListContext} from '../listContext.js';
import PlayScreen from './PlayScreen.js';

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 

const Toolbar = ({setOpenForm, openForm}) => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    // open the modal to start routine
    const [startRoutine, setStartRoutine] = useState(false);

    return (
        <View style={styles.toolbar}>
            {(routineList[currentRoutineIdx].exercises.length !== 0) &&
                <TouchableOpacity onPress={() => setStartRoutine(true)} style={styles.toolbarButtons}>
                    <Icon name='play-outline' color={ICON_COLOR} size={30} />
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => setOpenForm(!openForm)} style={styles.closeAddButton} >
                {openForm ? 
                    <Icon name='close-circle-outline' color={ICON_COLOR} size={30} style={styles.closeAddButton} />
                    :
                    <Icon name='add-circle-outline' color={ICON_COLOR} size={30} style={styles.closeAddButton} />
                }
            </TouchableOpacity>
            <Modal isVisible={startRoutine} backdropOpacity={0.8} backdropColor='black' style={{alignItems: 'center'}}>
              <PlayScreen handleClose={setStartRoutine}/>
            </Modal>
        </View>
    )
}

export default Toolbar;

const styles = StyleSheet.create({
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
    closeAddButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
})


/*

            <TouchableOpacity onPress={() => handleEditState(!editState)}>
                <Text>{!editState ? 'Edit' : 'Done'}</Text>
            </TouchableOpacity>

*/