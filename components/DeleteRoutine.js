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

const DeleteRoutine = () => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    const [openModal, setOpenModal] = useState(false);
    const [lastRoutine, setLastRoutine] = useState(false);
    
    const handleOpenModal = () => {
        if (routineList.length() === 1) {
            setLastRoutine(true);
        } else {
            setOpenModal(true);
        }
    }

    const handleDelete = async () => {
        let updatedRoutineList = [...routineList];
        updatedRoutineList = updatedRoutineList.filter(routine => (routine !== routineList[currentRoutineIdx]));
        setRoutineList(updatedRoutineList);
        try {
          const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(updatedRoutineList));
        } catch (error) {
          console.log("An error has occurred");
        }
        setOpenModal(false);
    }

    const handleCancel = () => {
        setOpenModal(false);
    }

    return (
        <View>
            <Button title='Delete Routine' onPress={() => setOpenModal(true)} />
            <Modal isVisible={openModal}>
                <View>
                    <Text>{'Are you sure you want to delete ' + routineList[currentRoutineIdx].title + '?'}</Text>
                    <Button title='Confirm' onClick={handleDelete} />
                    <Button title='Cancel' onClick={handleCancel} />
                </View>
            </Modal>
            <Modal isVisible={lastRoutine}>
                <View>
                    <Text>You cannot delete your last routine. If you would like to delete this routine, please create a new one first.</Text>
                    <Button title="OK" onPress={() => setLastRoutine(false)} />
                </View>
            </Modal>
        </View>
        
    )
}

export default DeleteRoutine;