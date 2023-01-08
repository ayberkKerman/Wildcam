/* eslint-disable prettier/prettier */
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {Header,Camera,Register,Login} from '../../components';
import {View, Text,Input,Button,TouchableOpacity,StyleSheet} from 'react-native';
const Tab = createBottomTabNavigator();


const Home = ({route}) =>{
    
    return (      
        
            <View>
                <Text>
                    Home
                </Text>
            </View>
        
    );
    
}


export default Home;
