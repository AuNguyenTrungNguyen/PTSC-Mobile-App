import React from 'react';
import { Appearance } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './components/AuthScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import UpdateOrderScreen from './components/UpdateOrderScreen';
import UploadBarcodeImageScreen from './components/UploadBarcodeImageScreen';
import DrawingListScreen from './components/Drawing/DrawingListScreen';
import UpdateProgressScreen from './components/Drawing/DetailDrawingScreen';

const Stack = createStackNavigator();
export default () => {

    let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
    let optionNoHeader = { headerShown: false };
    if (Appearance.getColorScheme() === 'dark') {
        optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
        optionNoHeader = { headerStyle: { backgroundColor: 'grey', height: getStatusBarHeight() } };
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Auth'
                screenOptions={optionNavigation}>
                <Stack.Screen
                    name='Auth'
                    component={AuthScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={optionNoHeader}
                />
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                />
                <Stack.Screen
                    name='DrawingList'
                    component={DrawingListScreen}
                    options={
                        {
                            title: 'Drawing List',
                            headerBackTitle: 'Back',
                        }
                    }
                />
                <Stack.Screen
                    name='UpdateProgress'
                    component={UpdateProgressScreen}
                    options={({ route }) => (
                        {
                            title: route.params?.titleBar,
                            headerBackTitle: 'Back',
                        }
                    )}
                />
                <Stack.Screen
                    name='Camera'
                    component={CameraScreen}
                    options={
                        {
                            title: 'QRCode Scanner',
                            headerBackTitle: 'Back',
                        }
                    }
                />
                <Stack.Screen
                    name='Update'
                    component={UpdateOrderScreen}
                    options={
                        {
                            title: 'Tracking WO',
                            headerBackTitle: 'Back',
                        }
                    }
                />
                <Stack.Screen
                    name='Upload'
                    component={UploadBarcodeImageScreen}
                    options={
                        {
                            title: 'Upload Barcode Image',
                            headerBackTitle: 'Back',
                        }
                    }
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}