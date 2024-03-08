import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Modal from "react-native-modal";
import SwipeableFlatList from 'react-native-swipeable-list';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPicker from 'react-native-wheely';
import {ListContext} from '../listContext.js';

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 
// hrIdx, setHrIdx, minIdx, setMinIdx, secIdx, setSecIdx,
const TimerInputModal = ({ submitInput, cancelChange, openModal, setOpenModal}) => {

    const hours = Array.from(Array(24).keys());
    const minutes = Array.from(Array(60).keys());
    const seconds = Array.from(Array(60).keys());
    // the inputted time
    const [selectedHrIdx, setHrIdx] = useState(0);
    const [selectedMinIdx, setMinIdx] = useState(0);
    const [selectedSecIdx, setSecIdx] = useState(0);

    return (
        <Modal isVisible={openModal}  backdropOpacity={0.8} backdropColor='black' style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
            </TouchableOpacity>
            <View style={styles.timerWheel}>
                <WheelPicker
                    selectedIndex={selectedHrIdx}
                    options={hours}
                    onChange={(idx) => setHrIdx(idx)}
                />
                <Text>hrs</Text>
                <WheelPicker
                    selectedIndex={selectedMinIdx}
                    options={minutes}
                    onChange={(idx) => setMinIdx(idx)}
                />
                <Text>mins</Text>
                <WheelPicker
                    selectedIndex={selectedSecIdx}
                    options={seconds}
                    onChange={(idx) => setSecIdx(idx)}
                />
                <Text>secs</Text>
                <Button onPress={() => submitInput(hours[selectedHrIdx], minutes[selectedMinIdx], seconds[selectedSecIdx])} title="Confirm" />
                <Button onPress={cancelChange} title="Cancel" />
            </View>
        </Modal>
    )
}

export default TimerInputModal;

const styles = StyleSheet.create({
    endButton: {
        textAlign: 'right',
        color: ICON_COLOR,
        fontSize: hp('1%'),
    },
    timerInputLabel: {
    },
    timerWheel: {
        display: 'flex',
        flexDirection: 'row',
    }
})
