import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListContext } from '../listContext.js';
import PlayScreen from './PlayScreen.js';
import DeleteRoutine from './DeleteRoutine.js';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

// This toolbar includes the play and delete routine buttons and appears above the list elements. 
const Toolbar = ({setOpenForm, openForm}) => {
    // Gets routine list info
    const {routineValue, idxValue} = useContext(ListContext);
    const [routineList, setRoutineList] = routineValue;
    const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

    // Opens modal to start routine
    const [startRoutine, setStartRoutine] = useState(false);

    return (
        <View style={styles.viewMain}>
            <DeleteRoutine />
            <View style={styles.viewRightButtons}>
                <TouchableOpacity onPress={() => setStartRoutine(true)} style={styles.buttonPlay}>
                    <Icon name='play-outline' color={textColor} size={hp('4.5%')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpenForm(!openForm)} style={styles.closeAddButton} >
                    {openForm ? 
                        <Icon name='close-circle-outline' color={textColor} size={hp('4.5%')} style={styles.closeAddButton} />
                        :
                        <Icon name='add-circle-outline' color={textColor} size={hp('4.5%')} style={styles.closeAddButton} />
                    }
                </TouchableOpacity>
            </View>
            {/* Opens modal to "play" the routine */}
            <Modal isVisible={startRoutine} backdropOpacity={0.8} style={{alignItems: 'center'}}>
              <PlayScreen handleClose={setStartRoutine}/>
            </Modal>
        </View>
    )
}

export default Toolbar;

const styles = StyleSheet.create({
    viewMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('2%'),
    },
    // View containing play and add buttons
    viewRightButtons: {
        flexDirection: 'row'
    },
    buttonPlay: {
        marginRight: wp('1%'),
    },
    // Button to create new routine
    closeAddButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
})