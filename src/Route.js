import React, { useEffect } from 'react';
import { Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import UpdateOrderScreen from './components/UpdateOrderScreen';
import UploadBarcodeImageScreen from './components/UploadBarcodeImageScreen';

const Stack = createStackNavigator();
export default () => {

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <Root>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Update'>
                    <Stack.Screen
                        name='Login'
                        component={LoginScreen}
                        options={{ headerShown: false }} />
                    <Stack.Screen
                        name='Home'
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='Camera'
                        component={CameraScreen}
                        options={
                            {
                                title: 'Barcode Scanner',
                                headerBackTitle: 'Back',
                            }
                        } />
                    <Stack.Screen
                        name='Update'
                        component={UpdateOrderScreen}
                        options={
                            {
                                title: 'Tracking WO',
                                headerBackTitle: 'Back',
                            }
                        } />
                    <Stack.Screen
                        name='Upload'
                        component={UploadBarcodeImageScreen}
                        options={
                            {
                                title: 'Upload Barcode image',
                                headerBackTitle: 'Back',
                            }
                        } />
                </Stack.Navigator>
            </NavigationContainer>
        </Root>
    );
}