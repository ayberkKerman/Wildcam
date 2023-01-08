
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {Header,Camera,Register,Login} from '../../components';


const Stack = createStackNavigator();

const Start = () =>{


    return (      
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Giriş'>
                <Stack.Screen name="Giriş" component={Login}/>
                <Stack.Screen name="Kayıt Ol" component={Register}/>
                <Stack.Screen options={{headerShown: false}} name="Ana Sayfa"  component={Header}/>
                <Stack.Screen name="Kamera" component={Camera}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
    
}

export default Start;