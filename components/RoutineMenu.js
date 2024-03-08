import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Button, SafeAreaView } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import {ListContext} from '../listContext.js';
import { Swipeable } from 'react-native-gesture-handler';

const TEXT_COLOR = 'black';
const ICON_COLOR = 'black'; 

// <RoutineMenu data={routineList} routineIdx={currentRoutineIdx}
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
        let routineCheck = routineList.filter(routine => routine.title.trim() === newRoutineInput.trim()).length();
        if (newRoutineInput.trim() != '' || (routineCheck !== 1)) {
          const newRoutineList = [...routineList, {title: newRoutineInput, exercises: []}]
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
       // setRoutineMenuOpen(false);
        setInvalidRoutineResponse(false);
        setNewRoutineInput('');
        setOpenNewRoutineForm(false);
      }
  }
  
  const ItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "gray", width: '90%' }}
      />
    )
  }

  return (
      <View style={styles.menuView}>
        <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
          <Text style={styles.titleText}>{routineList.length === 0 ? 'Home' : routineList[currentRoutineIdx].title}</Text> 
        </TouchableOpacity> 
        <Modal isVisible={routineMenuOpen} style={styles.modal} >
          <View style={styles.menuModal}>
            <TouchableOpacity onPress={() => setRoutineMenuOpen(false)} 
              style={{}}>
              <Icon name='close-outline' color={ICON_COLOR} size={30} style={{}} />
            </TouchableOpacity>
            <View>
              <FlatList
                data={routineList}
                key={(item, index) => ('list' + index.toString())}
                renderItem={({item, index}) => 
                  <TouchableOpacity onPress={() => switchRoutines(index)}>
                    <Text>{item.title}</Text> 
                  </TouchableOpacity>
                }   
                ItemSeparatorComponent={ItemSeparator}
              /> 
              {openNewRoutineForm && 
                <View>
                  <TextInput
                    onChangeText={setNewRoutineInput}
                    value={newRoutineInput}
                  />
                  {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                  <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                  <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                </View>
              }
              <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
            </View>
          </View>
        </Modal>
      </View>
  )
}

export default RoutineMenu;

const styles = StyleSheet.create({
    endButton: {
      textAlign: 'right',
      color: ICON_COLOR,
      fontSize: hp('1%'),
    },
    titleText: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: hp('4.5%'), 
      color: TEXT_COLOR,
      paddingTop: hp('5%'),
      paddingBottom: hp('2%'),
    },
    menuModal: {
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: hp('50%'),
      width: wp('80%'),

    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuText: {
      fontWeight: 'bold',
      fontSize: hp('2.5%'), 
    },
    menuItem: {
      borderTopColor: 'grey',
      borderTopWidth: 1,
      borderBottomColor: 'grey',
      borderBottomWidth: 1,
      width: '90%',
      paddingVertical: hp('1%'),
      paddingHorizontal: wp('1%')
    },
    createButton: {

    }
})
/* 
              {routineList.map((routine, index) => (
                <View key={"routine" + index} style={styles.menuItem} > 
                  <TouchableOpacity onPress={() => switchRoutines(index)}>
                    <Text>{routine.title}</Text> 
                  </TouchableOpacity>
                </View>
              ))}


              <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
                <Text style={styles.titleText}>{routineList[currentRoutineIdx].title}</Text> 
              </TouchableOpacity> 
              <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {routineList.map((routine, index) => (
                  <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                      <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                  </View>
                ))}
                {openNewRoutineForm && 
                  <View>
                    <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                  </View>
                }
              </Modal>
              <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                  <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {routineList.map((routine, index) => (
                  <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                      <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                  </View>
                ))}
                {openNewRoutineForm && 
                  <View>
                    <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                  </View>
                }
              </Modal>

<Modal isVisible={routineMenuOpen} >
              <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                  <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
              </TouchableOpacity>
              {routineList.map((routine, index) => (
                  <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                        <Text style={styles.menuText}>{routine.title}</Text> 
                    </TouchableOpacity>
                  </View>
              ))}
              {openNewRoutineForm && 
                  <View>
                  <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                  />
                  {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                  <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                  <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                  </View>
              }
              <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" style={styles.endButton} />
          </Modal>
*/