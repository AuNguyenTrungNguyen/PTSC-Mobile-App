import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import UpdateOrderScreen from './components/UpdateOrderScreen';
import UploadBarcodeImageScreen from './components/UploadBarcodeImageScreen';
import DrawingListScreen from './components/Drawing/DrawingListScreen';
import UpdateProgressScreen from './components/Drawing/DetailDrawingScreen';

const Stack = createStackNavigator();
export default () => {

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
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
                            title: 'Upload Barcode Image',
                            headerBackTitle: 'Back',
                        }
                    } />
            </Stack.Navigator>
        </NavigationContainer>
    );
}