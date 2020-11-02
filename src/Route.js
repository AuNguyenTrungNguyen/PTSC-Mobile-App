import React from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './screens/authentication/AuthScreen';
import LoginScreen from './screens/authentication/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/camera/CameraScreen';
import UpdateOrderScreen from './screens/order/UpdateOrderScreen';
import UploadBarcodeImageScreen from './screens/order/UploadBarcodeImageScreen';
import DrawingListScreen from './screens/drawing/DrawingListScreen';
import UpdateProgressScreen from './screens/drawing/DetailDrawingScreen';

const Stack = createStackNavigator();
export default () => {

    let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
    if (Appearance.getColorScheme() === 'dark') {
        optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
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
                    options={{ headerShown: false }}
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