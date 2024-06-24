import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { ListContext } from '../listContext.js';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

const RoutineMenu = () => {
  const {routineValue, idxValue} = useContext(ListContext);
  const [routineList, setRoutineList] = routineValue;
  const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

  // for routine modal visibility
  const [routineMenuOpen, setRoutineMenuOpen] = useState(false);
  // for new routine title in routine form
  const [newRoutineInput, setNewRoutineInput] = useState('');
  const [invalidRoutineResponse, setInvalidRoutineResponse] = useState(false);
  const [openNewRoutineForm, setOpenNewRoutineForm] = useState(false);
  
  const switchRoutines = async (idx) => {
      setCurrentRoutineIdx(idx);
      setRoutineMenuOpen(false);
      try {
        const storedCurrRoutineIdx = await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(currentRoutineIdx));
      } catch (error) {
        console.log("An error has occurred");
      }
  }

  const handleNewRoutine = async (val) => {
      if (val) {
        if (newRoutineInput.trim() !== '') {
          const newId = Math.floor(Date.now() * Math.random());
          const newRoutineList = [...routineList, {routineId: newId, title: newRoutineInput, exercises: []}]
          setRoutineList(newRoutineList)
          setCurrentRoutineIdx(newRoutineList.length - 1);
          setRoutineMenuOpen(false);
          setInvalidRoutineResponse(false);
          setNewRoutineInput('');
          setOpenNewRoutineForm(false);
          try {
            const storedRL = await AsyncStorage.setItem("routineList", JSON.stringify(newRoutineList));
          } catch (error) {
            console.log("An error has occurred");
          }
          try {
            const storedCurrRoutineIdx = await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(currentRoutineIdx));
          } catch (error) {
            console.log("An error has occurred");
          }
        }
        else {
          setInvalidRoutineResponse(true);
        }
      }
      else {
        setInvalidRoutineResponse(false);
        setNewRoutineInput('');
        setOpenNewRoutineForm(false);
      }
  }
  
  const ItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#F4F3F2', width: '90%', marginHorizontal: '5%' }}
      />
    )
  }

  const handleCloseModal = () => {
    setRoutineMenuOpen(false)
    setNewRoutineInput('');
    setOpenNewRoutineForm(false);
    setInvalidRoutineResponse(false);
  } 

  return (
      <View>
        <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
          <Text style={styles.textTitle}>{routineList[currentRoutineIdx].title}</Text> 
        </TouchableOpacity> 
        <Modal isVisible={routineMenuOpen} style={styles.modal} >
          <View style={styles.modalView}>
            <View style={styles.viewNoButton}>
              <TouchableOpacity onPress={handleCloseModal} 
                style={styles.modalIconClose}>
                <Icon name='close-outline' color={textColor} size={hp('4%')} />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Text style={styles.textListTitle}>Routines</Text>
                <FlatList
                  data={routineList}
                  key={(item, index) => ('list' + index.toString())}
                  ItemSeparatorComponent={ItemSeparator}
                  renderItem={({item, index}) => 
                    <TouchableOpacity onPress={() => switchRoutines(index)} >
                      <Text style={styles.textListItemTitle}>{item.title}</Text> 
                    </TouchableOpacity>
                  }   
                  style={styles.list}
                /> 
                {openNewRoutineForm && 
                  <View style={styles.viewForm}>
                    <ItemSeparator />
                    <View
                      style={{ height: 1, backgroundColor: {textColor}, width: '90%', marginBottom: hp('1%'), marginHorizontal: '5%' }}
                    />
                    <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                      placeholder='Routine Title'
                      placeholderTextColor='#617182'
                      color={textColor}
                      style={styles.textInput}
                    />
                    <View style={styles.viewButtonSet}>
                      <TouchableOpacity onPress={() => handleNewRoutine(false)} style={styles.buttonCancel}>
                        <Text style={styles.textCancel}>Cancel</Text>
                      </TouchableOpacity> 
                      <TouchableOpacity onPress={() => handleNewRoutine(true)} style={styles.buttonConfirm}>
                        <Text style={styles.textConfirm}>Confirm</Text>
                      </TouchableOpacity> 
                    </View>
                    {!invalidRoutineResponse && <Text style={styles.textCreateRoutineMessage}>*Routine names cannot be edited after creation.</Text>}
                    {invalidRoutineResponse && <Text style={styles.textCreateRoutineMessage}>The routine name is invalid. Please try again.</Text>}
                  </View>
                }
              </View>
            </View>
              <TouchableOpacity onPress={() => setOpenNewRoutineForm(true)} style={styles.buttonCreate}>
                <Text style={styles.textCreate}>Create</Text>
              </TouchableOpacity> 
          </View>
        </Modal>
      </View>
  )
}

export default RoutineMenu;

// justify is for primary axis, align is for cross axis

const styles = StyleSheet.create({
    textTitle: {                          // for title on the main screen
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('5%'), 
      color: textColor,
      paddingTop: hp('7%'),
      paddingBottom: hp('2%'),
    },
    modal: {                              // for centering the modal screen
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
      backgroundColor: bgColor,
      height: hp('60%'),
      width: wp('80%'),
      paddingTop: hp('1%'),
      justifyContent: 'space-between',  
      alignContent: 'center',
    },
    viewNoButton: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'space-between',
      marginHorizontal: wp('1%'),
      height: hp('40%'),
      flex: 1,
    },
    modalIconClose: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    textListTitle: {
      fontSize: hp('3.5%'), 
      color: textColor,
      paddingTop: hp('0.5%'),
      marginHorizontal: '5%',
      fontWeight: 'bold',
    },
    textListItemTitle: {
      fontSize: hp('2.5%'), 
      color: textColor,
      paddingVertical: hp('0.5%'),
      marginHorizontal: '5%',
    }, 
    list: {
      marginTop: hp('2%'),
    },
    viewForm: {
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#808e9b',
      borderRadius: 4,
      width: wp('70%'),
      paddingHorizontal: wp('2%'),
      marginHorizontal: '5%',
      marginBottom: hp('1%'),
    },
    textCreateRoutineMessage: {
      textAlign: 'left',
      color: textColor,
      borderColor: textColor,
      paddingVertical: hp('1%'),
      marginHorizontal: '5%',
    },
    viewButtonSet: {
      flexDirection: 'row', 
      backgroundColor: bgColor, 
      justifyContent: 'space-between', 
      width: wp('70%'), 
      marginHorizontal: '5%',
    },
    buttonCancel: {
      backgroundColor: '#485460', 
      height: '100%', 
      width: '50%', 
      paddingVertical: hp('0.5%'), 
    },
    textCancel: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('1.8%'), 
      color: textColor,
    },
    buttonConfirm: {
      backgroundColor: '#05c46b', 
      height: '100%', 
      width: '50%', 
      paddingVertical: hp('0.5%'), 
    },
    textConfirm: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('1.8%'), 
      color: textColor,
    },
    buttonCreate: {
      backgroundColor: '#575fcf',
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('1%'),
    }, 
    textCreate: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('2.5%'), 
      color: textColor,
    },
    menuText: {
      fontWeight: 'bold',
      fontSize: hp('2.5%'), 
    },
})