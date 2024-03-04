import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import Modal from "react-native-modal";
import PlayScreen from './PlayScreen';
import { NestableScrollContainer, DraggableFlatList } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//import DurationPicker from 'react-duration-picker'
import WheelPicker from 'react-native-wheely';
import SwipeableFlatList from 'react-native-swipeable-list';

const Input = ({itemTitle, editState}) => {

    const [title, setTitle] = useState(itemTitle);

    return (
        <View>
            <TextInput 
                value={title}
                onChange={(text) => setTitle(text)}
                editable={editState}
            />
        </View>
        
    )
}

export default Input;