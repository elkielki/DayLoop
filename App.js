import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListContext } from './listContext.js';
import List from './components/List.js';
import AddExerciseForm from './components/AddExercise.js';
import RoutineMenu from './components/RoutineMenu.js';
import Toolbar from './components/Toolbar.js';
import mobileAds, { BannerAd, BannerAdSize, TestIds, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography, MaxAdContentRating } from 'react-native-google-mobile-ads';

const App = () => {
  /* AD STUFF */  
  useEffect(() => {
    let isMobileAdsStartCalled = false;

    async function startGoogleMobileAdsSDK() {
      if (isMobileAdsStartCalled) return;
      isMobileAdsStartCalled = true;
      // Initialize the Google Mobile Ads SDK.
      mobileAds()
        .setRequestConfiguration({
          // Update all future requests suitable for parental guidance
          maxAdContentRating: MaxAdContentRating.G,
          // Indicates that you want your content treated as child-directed for purposes of COPPA.
          tagForChildDirectedTreatment: true,
          // Indicates that you want the ad request to be handled in a
          // manner suitable for users under the age of consent.
          tagForUnderAgeOfConsent: true,
          // An array of test device IDs to allow.
          testDeviceIdentifiers: ['EMULATOR'],
        })
        await mobileAds().initialize()
    }

    const checkConsent = async () => {
      // Request an update for the consent information.
      AdsConsent.requestInfoUpdate().then(() => {
        AdsConsent.loadAndShowConsentFormIfRequired().then(adsConsentInfo => {
          // Consent has been gathered.
          if (adsConsentInfo.canRequestAds) {
            startGoogleMobileAdsSDK()
          }
        })
      })
    
      // checks if consent was given for ads
      const {canRequestAds} = await AdsConsent.getConsentInfo()
      if (canRequestAds) {
        const {
          storeAndAccessInformationOnDevice,
        } = await AdsConsent.getUserChoices();
        
        if (storeAndAccessInformationOnDevice === false) {
          /**
           * The user declined consent for purpose 1,
           * the Google Mobile Ads SDK won't serve ads.
           */
        }
        startGoogleMobileAdsSDK()
      }    
    }
    
    checkConsent();
  }, []);


/*  END OF AD STUFF */

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

  // list of all routines - basically all the data
  const [routineList, setRoutineList] = useState(initialRoutineListData);
  // the current routine
  const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [createNewExercise, setCreateNewExercise] = useState(false);

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
    //      console.log("RoutineList: " + JSON.stringify(routineList));
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

  const handleNewExerciseButton = (value) => {
    setCreateNewExercise(value);
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
              <Toolbar setOpenForm={handleNewExerciseButton} openForm={createNewExercise} />
              <List />
              {createNewExercise && <AddExerciseForm openForm={setCreateNewExercise} />} 
            </View> 
            <BannerAd
              unitId='ca-app-pub-5596202903526662/8265395371'
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{ 
                requestNonPersonalizedAdsOnly: true,
                keywords: ['exercise', 'mental', 'health', 'journal', 'schedule', 'plan']
              }}
            />
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
  viewApp: {
    height: hp('100%'),
    width: wp('100%'),
    flex: 1,
    backgroundColor: bgColor,
  },
  loadingView: {
    display: 'flex',
    flex: 1,
    paddingVertical: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAppScreen: {
    flex: 1, 
    width: wp('100%'), 
    height: hp('100%')
  },

});
