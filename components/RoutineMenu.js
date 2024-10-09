import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { ListContext } from '../listContext.js';

const textColor = '#F4F3F2';
const bgColor = '#1e272e';

// This menu displays the user's list of routines as well as a buttons to create and delete routines.
const RoutineMenu = () => {

  // Get routine list info
  const {routineValue, idxValue} = useContext(ListContext);
  const [routineList, setRoutineList] = routineValue;
  const [currentRoutineIdx, setCurrentRoutineIdx] = idxValue;

  // For routine modal visibility
  const [routineMenuOpen, setRoutineMenuOpen] = useState(false);
  // For new routine title in routine form
  const [newRoutineInput, setNewRoutineInput] = useState('');
  const [invalidRoutineResponse, setInvalidRoutineResponse] = useState(false);
  const [openNewRoutineForm, setOpenNewRoutineForm] = useState(false);
  
  /* Parameters: idx - the index of the routine the user wants to switch to
     Switches the current routine 
  */
  const switchRoutines = async (idx) => {
      setCurrentRoutineIdx(idx);
      setRoutineMenuOpen(false);
      try {
        const storedCurrRoutineIdx = await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(currentRoutineIdx));
      } catch (error) {
        console.log("An error has occurred");
      }
  }

  /* Parameters: val - user-inputted title for new routine
     Creates a new routine and updates routine list
  */
  const handleNewRoutine = async (val) => {
      if (val) {
        // Checking for valid input
        if (newRoutineInput.trim() !== '') {
          // Creating unique id for new routine
          const newId = Math.floor(Date.now() * Math.random());
          // Adding routine to routine list
          const newRoutineList = [...routineList, {routineId: newId, title: newRoutineInput, exercises: []}]
          // Updating routine list and index of current routine
          setRoutineList(newRoutineList)
          setCurrentRoutineIdx(newRoutineList.length - 1);
          // Resetting some variables
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

  // Creates a line - purely decorative
  const ItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#F4F3F2', width: '90%', marginHorizontal: '5%' }}
      />
    )
  }

  // Closes the routine menu
  const handleCloseModal = () => {
    setRoutineMenuOpen(false)
    setNewRoutineInput('');
    setOpenNewRoutineForm(false);
    setInvalidRoutineResponse(false);
  } 

  return (
      <View>
        {/* Title of current routine - if clicked, shows the list of routines */}
        <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
          <Text style={styles.textTitle}>{routineList[currentRoutineIdx].title}</Text> 
        </TouchableOpacity> 

        {/* Routine List */}
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

                {/* Creating a new routine */}
                {openNewRoutineForm && 
                  <View style={styles.viewForm}>
                    <ItemSeparator />
                    {/* Input box to add title of new routine */}
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
                    {/* Cancel and confirm buttons */}
                    <View style={styles.viewButtonSet}>
                      <TouchableOpacity onPress={() => handleNewRoutine(false)} style={styles.buttonCancel}>
                        <Text style={styles.textCancel}>Cancel</Text>
                      </TouchableOpacity> 
                      <TouchableOpacity onPress={() => handleNewRoutine(true)} style={styles.buttonConfirm}>
                        <Text style={styles.textConfirm}>Confirm</Text>
                      </TouchableOpacity> 
                    </View>
                    {/*Invalid error messages */}
                    {!invalidRoutineResponse && <Text style={styles.textCreateRoutineMessage}>*Routine names cannot be edited after creation.</Text>}
                    {invalidRoutineResponse && <Text style={styles.textCreateRoutineMessage}>The routine name is invalid. Please try again.</Text>}
                  </View>
                }
              </View>
            </View>
            
            {/* Button to open form to create new routine */}
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
    // Title of the current routine (the clickable text that opens the modal)
    textTitle: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('5%'), 
      color: textColor,
      paddingTop: hp('7%'),
      paddingBottom: hp('2%'),
    },
    // For modal itself, not the content inside
    modal: {                             
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // View for all modal content
    modalView: {
      backgroundColor: bgColor,
      height: hp('60%'),
      width: wp('80%'),
      paddingTop: hp('1%'),
      justifyContent: 'space-between',  
      alignContent: 'center',
    },
    // View containing all modal content except the create new routine button
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
    // Title of the routine list - currently "Routines"
    textListTitle: {
      fontSize: hp('3.5%'), 
      color: textColor,
      paddingTop: hp('0.5%'),
      marginHorizontal: '5%',
      fontWeight: 'bold',
    },
    // Title of routine element that is shown in the list 
    textListItemTitle: {
      fontSize: hp('2.5%'), 
      color: textColor,
      paddingVertical: hp('0.5%'),
      marginHorizontal: '5%',
    }, 
    // List showing routine titles
    list: {
      marginTop: hp('2%'),
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
    // View containing cancel and confirm buttons
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