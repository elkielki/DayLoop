import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import WheelPicker from 'react-native-wheely';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

// This modal contains wheels for hours, minutes, and seconds, so the user may select the time limit for a new task.
const TimerInputModal = ({ submitInput, cancelChange, openModal }) => {

    // Time selection shown on wheel
    const hours = Array.from(Array(24).keys());
    const minutes = Array.from(Array(60).keys());
    const seconds = Array.from(Array(60).keys());

    // Inputted time
    const [selectedHrIdx, setHrIdx] = useState(0);
    const [selectedMinIdx, setMinIdx] = useState(0);
    const [selectedSecIdx, setSecIdx] = useState(0);

    return (
        <Modal isVisible={openModal}  backdropOpacity={0.8} backdropColor='black' style={styles.modal}>
            <View style={styles.viewMain}>
                {/* Time Selection */}
                <Text style={styles.textSetTimer}>Set Timer</Text>
                <View style={styles.viewTimer}>
                    <WheelPicker
                        selectedIndex={selectedHrIdx}
                        options={hours}
                        onChange={(idx) => setHrIdx(idx)}
                        selectedIndicatorStyle={{backgroundColor: '#485460'}}
                        itemTextStyle={{color: textColor}}
                    />
                    <Text style={styles.textTimeLabel}>hrs</Text>
                    <WheelPicker
                        selectedIndex={selectedMinIdx}
                        options={minutes}
                        onChange={(idx) => setMinIdx(idx)}
                        selectedIndicatorStyle={{backgroundColor: '#485460'}}
                        itemTextStyle={{color: textColor}}
                    />
                    <Text style={styles.textTimeLabel}>mins</Text>
                    <WheelPicker
                        selectedIndex={selectedSecIdx}
                        options={seconds}
                        onChange={(idx) => setSecIdx(idx)}
                        selectedIndicatorStyle={{backgroundColor: '#485460'}}
                        itemTextStyle={{color: textColor}}
                    />
                    <Text style={styles.textTimeLabel}>secs</Text>
                </View>

                {/* Cancel & Submit Buttons */}
                <View style={styles.viewButtonSet}>
                    <TouchableOpacity onPress={cancelChange} style={styles.buttonCancel}>
                        <Text style={styles.textCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => submitInput(hours[selectedHrIdx], minutes[selectedMinIdx], seconds[selectedSecIdx])} style={styles.buttonConfirm}>
                        <Text style={styles.textConfirm}>Confirm</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )
}

export default TimerInputModal;

const styles = StyleSheet.create({
    // Modal container including backdrop
    modal: {
        display: 'flex', 
        alignItems: 'center', 
    },
    viewMain: {
        flexDirection: 'column', 
        backgroundColor: bgColor,  
        width: wp('85%'), 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textSetTimer: {
        fontSize: hp('3%'), 
        paddingTop: hp('3%'),
        fontWeight: 'bold',
        color: textColor,
    },
    // View that contains the time selection in the timer input modal
    viewTimer: {
        backgroundColor: bgColor,
        flexDirection: 'row',
        height: hp('40%'),
        width: wp('80%'),
        paddingBottom: hp('1%'),
        paddingHorizontal: wp('1%'),
        justifyContent: 'center',  
        alignItems: 'center',
    },
    textTimeLabel: {
        color: textColor,
        paddingHorizontal: wp('1.5%')
    },
    // View containing cancel and confirm buttons
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
    buttonConfirm: {
        backgroundColor: '#05c46b', 
        height: '100%', 
        width: '50%', 
        paddingVertical: hp('1%'), 
    },
    textCancel: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: textColor,
    },
    textConfirm: {
        textAlign: 'center', 
        fontWeight: 'bold',
        color: textColor,
    },
})
