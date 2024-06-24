import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListContext} from '../listContext.js';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

const DeleteRoutine = () => {
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    const [openModal, setOpenModal] = useState(false);
    const [lastRoutine, setLastRoutine] = useState(false);
    
    const handleOpenModal = () => {
        if (routineList.length === 1) {
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
            <TouchableOpacity onPress={handleOpenModal}>
                <Icon name='trash-bin-outline' color={textColor} size={hp('4.5%')} />
            </TouchableOpacity>
            <Modal isVisible={openModal} backdropOpacity={0.8}  style={styles.modalDelete}>
                <View style={styles.modalViewDelete}>
                    <Text style={styles.textDelete}>{'Are you sure you want to delete ' + routineList[currentRoutineIdx].title + '?'}</Text>
                    <View style={styles.modalViewButtonSet}>
                        <TouchableOpacity onPress={() => setOpenModal(false)} style={styles.buttonCancel}>
                            <Text style={{textAlign: 'center', color: '#F4F3F2', fontWeight: 'bold', fontSize: hp('2%')}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.buttonConfirm}>
                            <Text style={{textAlign: 'center', color: '#F4F3F2', fontWeight: 'bold', fontSize: hp('2%')}}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={lastRoutine} style={styles.modalDelete}>
                <View style={styles.modalViewDelete}>
                    <View style={styles.viewModalText}>
                        <Text style={styles.textDeleteTitle}>Oh no!</Text>
                        <Text style={styles.textDelete}>This is your last routine! Please create a new routine first before deleting this one.</Text>
                    </View>
                    <TouchableOpacity onPress={() => setLastRoutine(false)} style={styles.buttonClose}>
                        <Text style={styles.textClose}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
        
    )
}

export default DeleteRoutine;

const styles = StyleSheet.create({
    modalDelete: {
        display: 'flex', 
        alignItems: 'center'
    },
    modalViewDelete: {
        backgroundColor: bgColor, 
        height: hp('30%'), 
        width: wp('80%'), 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    viewModalText: {

    },
    textDeleteTitle: {
        fontSize: hp('3%'),
        color: textColor,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: hp('4%'),
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('1%'),
    },
    textDelete: {
        fontSize: hp('2.5%'),
        color: textColor,
        textAlign: 'center',
        paddingHorizontal: wp('5%')
    },
    modalViewButtonSet: {
        flexDirection: 'row', 
        backgroundColor: '#808e9b', 
        justifyContent: 'space-between', 
        width: '100%', 
    },
    buttonConfirm: {
        backgroundColor: '#f53b57', 
        height: '100%', 
        width: '50%', 
        paddingVertical: hp('1%'), 
    },
    buttonCancel: {
        backgroundColor: '#485460',
        height: '100%', 
        width: '50%', 
        paddingVertical: hp('1%'), 
    },
    textClose: {
        fontSize: hp('2.5%'),
        color: textColor,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonClose: {
        backgroundColor: '#485460',
        paddingVertical: hp('1%'), 
        width: '100%',
        height: hp('5%'),
    },
})