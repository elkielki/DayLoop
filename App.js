import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListContext } from './listContext.js';
import List from './components/List.js';
import AddTaskForm from './components/AddTask.js';
import RoutineMenu from './components/RoutineMenu.js';
import Toolbar from './components/Toolbar.js';

const App = () => {
  
  // Example routine data
  const initialRoutineListData = [
    {
      routineId: '1433704743870', 
      title: "Routine 1",
      exercises: [
        { id: '605997549887', title: "Stretch", timer: 600}, 
        { id: '1075053131264', title: "Push ups", timer: 600 },
        { id: '1554651914786', title: "Break", timer: 300 },
        { id: '136863341813', title: "Sit ups", timer: 600 },
        { id: '958556290930', title: "Push ups", timer: 600 },
        { id: '1390505220267', title: "Break", timer: 300 },
        { id: '50538861062', title: "Sit ups", timer: 600 },
      ],
    },
    {
      routineId: '1176670278845',
      title: "Routine 2", 
      exercises: [
        {  id: '824424796008', title: "Meditate", timer: 600 },
        {  id: '296850440129', title: "Take a shower", timer: 900 },
        {  id: '908248117118', title: "Brush teeth", timer: 180 },
        {  id: '1286573761744', title: "Make breakfast", timer: 600 },
        {  id: '471290510918', title: "Eat", timer: 900 },
        {  id: '803720080376', title: "Study", timer: 1800 },
        {  id: '1232519517246', title: "Break", timer: 300 },
        {  id: '750086264390', title: "Study", timer: 1800 },
        {  id: '1012514496902', title: "Stretch", timer: 600 },
      ],
    }
  ];

  // List of all the routines
  const [routineList, setRoutineList] = useState(initialRoutineListData);
  // The routine displayed on the screen
  const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);
  // For loading screen
  const [isLoading, setIsLoading] = useState(true);
  // Displays new routine form when true
  const [createNewRoutine, setCreateNewRoutine] = useState(false);

  // Gets user's routine list data at launch
  useEffect(() => {
    const getData = async () => {
      const launchCheck = await AsyncStorage.getItem("hasLaunched");
      if (launchCheck == null) {
        await AsyncStorage.setItem("routineList", JSON.stringify(initialRoutineListData));
        await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(0));
        await AsyncStorage.setItem("hasLaunched", "true");
      } else {
        try {
          const storedRL = await AsyncStorage.getItem("routineList");
          setRoutineList(JSON.parse(storedRL));
        } catch (error) {
          console.log("An error has occurred");
        }
        try {
          const storedCurrRoutineIdx = await AsyncStorage.getItem("currentRoutineIdx");
          setCurrentRoutineIdx(JSON.parse(storedCurrRoutineIdx));
        } catch (error) {
          console.log("An error has occurred");
        }
      }
    }
    getData();
    if (routineList) {
      setIsLoading(false);   
    }
  }, [])

  // Trigger add routine form to open
  const handleNewRoutineButton = (value) => {
    setCreateNewRoutine(value);
  }

  return (
    <View style={styles.viewApp}>
      <GestureHandlerRootView style={{flex: 1}}>
        {isLoading ? 
          <View style={styles.loadingView}>
            <Text>Loading!</Text>
          </View>
        :
          <ListContext.Provider value={{routineValue: [routineList, setRoutineList], idxValue: [currentRoutineIdx, setCurrentRoutineIdx]}}>
            <View style={styles.viewAppScreen}>
              <RoutineMenu />
              <Toolbar setOpenForm={handleNewRoutineButton} openForm={createNewRoutine} />
              <List />
              {createNewRoutine && <AddTaskForm openForm={setCreateNewRoutine} />} 
            </View> 
          </ListContext.Provider>
        }
      </GestureHandlerRootView>
    </View> 
  );
};

export default App;

const  textColor = '#F4F3F2';
const bgColor = '#1e272e';

const styles = StyleSheet.create({
  // View containing whole app screen
  viewApp: {
    height: hp('100%'),
    width: wp('100%'),
    flex: 1,
    backgroundColor: bgColor,
  },
  // Loading screen
  loadingView: {
    display: 'flex',
    flex: 1,
    paddingVertical: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // View containing the list and all content
  viewAppScreen: {
    flex: 1, 
    width: wp('100%'), 
    height: hp('100%')
  },
});
