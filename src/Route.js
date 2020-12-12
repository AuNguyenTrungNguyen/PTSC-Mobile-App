import React from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './screens/authentication/AuthScreen';
import LoginScreen from './screens/authentication/LoginScreen';

import HomeScreen from './screens/HomeScreen';
import ReportsScreen from './screens/ReportsScreen';

import CameraScreen from './screens/camera/CameraScreen';
import DrawingListScreen from './screens/drawing/DrawingListScreen';
import DrawingDetailScreen from './screens/drawing/DrawingDetailScreen';
import DrawingImageScreen from './screens/drawing/DrawingImageScreen';
import DrawingAddWelderScreen from './screens/drawing/DrawingAddWelderScreen';

import ConstructionListScreen from './screens/construction/ConstructionListScreen';

import HistogramListScreen from './screens/histogram/HistogramListScreen';
import HistogramViewScreen from './screens/histogram/HistogramViewScreen';

import DailyManpowerScreen from './screens/manpower/DailyManpowerScreen';

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
          options={
            {
              title: 'Select Project',
            }
          }
        />
        <Stack.Screen
          name='Reports'
          component={ReportsScreen}
          options={
            {
              title: 'Reports',
              headerBackTitle: 'Back',
            }
          }
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
          name='DrawingDetail'
          component={DrawingDetailScreen}
          options={
            {
              title: 'Drawing Detail',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingImage'
          component={DrawingImageScreen}
          options={
            {
              title: 'Drawing Pictures',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingWelder'
          component={DrawingAddWelderScreen}
          options={
            {
              title: 'Select Welders',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='ConstructionList'
          component={ConstructionListScreen}
          options={
            {
              title: 'Construction List',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='HistogramList'
          component={HistogramListScreen}
          options={
            {
              title: 'Histogram List',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='HistogramView'
          component={HistogramViewScreen}
          options={
            {
              title: 'Histogram Chart',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='DailyManpower'
          component={DailyManpowerScreen}
          options={
            {
              title: 'Daily Manpower',
              headerBackTitle: 'Back',
            }
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}