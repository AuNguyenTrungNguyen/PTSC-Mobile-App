import React from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './screens/authentication/AuthScreen';
import LoginScreen from './screens/authentication/LoginScreen';

import HomeScreen from './screens/HomeScreen';
import ConstructionUpdateManageScreen from './screens/ConstructionUpdateManageScreen';

import CameraScreen from './screens/camera/CameraScreen';
import AllStatusCameraScreen from './screens/camera/AllStatusCameraScreen';

import DrawingListScreen from './screens/drawing/DrawingListScreen';
import DrawingSearchScreen from './screens/drawing/DrawingSearchScreen';
import DrawingAllStatusScreen from './screens/drawing/DrawingAllStatusScreen';
import DrawingDetailScreen from './screens/drawing/DrawingDetailScreen';
import DrawingImageScreen from './screens/drawing/DrawingImageScreen';
import DrawingAddWelderScreen from './screens/drawing/DrawingAddWelderScreen';
import DrawingAddHeatNoScreen from './screens/drawing/DrawingAddHeatNoScreen';

import SpoolMatrixScreen from './screens/spool/SpoolMatrixScreen';
import SpoolCameraScreen from './screens/spool/SpoolCameraScreen';

import QCDrawingListScreen from './screens/qc/QCDrawingListScreen';
import QCDrawingDetailScreen from './screens/qc/QCDrawingDetailScreen';
import QCSpendListScreen from './screens/qc/QCSpendListScreen';

import PDFViewScreen from './screens/pdf/PDFViewScreen';

//NDT
import NDTManagerScreen from './screens/ndt/NDTManagerScreen';
import NDTDetailScreen from './screens/ndt/NDTDetailScreen';
import NDTIssueScreen from './screens/ndt/NDTIssueScreen';

//Report
import ReportManagerScreen from './screens/report/ReportManagerScreen';
import ReportConstructionListScreen from './screens/report/ReportConstructionListScreen';
import ReportDisciplineListScreen from './screens/report/ReportDisciplineListScreen';
import ReportHistogramListScreen from './screens/report/ReportHistogramListScreen';
import ReportDailyManpowerListScreen from './screens/report/ReportDailyManpowerListScreen';

const Stack = createStackNavigator();
const NDTStack = createStackNavigator();
const ReportStack = createStackNavigator();

let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
if (Appearance.getColorScheme() === 'dark') {
  optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
};

const NDTStackScreens = () => {
  return (
    <NDTStack.Navigator screenOptions={optionNavigation}>
      <NDTStack.Screen
        name='NDTManager'
        component={NDTManagerScreen}
        options={
          {
            title: 'NDT Update',
            headerBackTitle: 'Back',
          }
        }
      />
      <NDTStack.Screen
        name='NDTDetail'
        component={NDTDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <NDTStack.Screen
        name='NDTIssue'
        component={NDTIssueScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
    </NDTStack.Navigator>
  );
}

const ReportStackScreens = () => {
  return (
    <ReportStack.Navigator screenOptions={optionNavigation}>
      <ReportStack.Screen
          name='ReportManager'
          component={ReportManagerScreen}
          options={
            {
              title: 'Reports',
              headerBackTitle: 'Back',
            }
          }
        />
      <ReportStack.Screen
          name='ReportConstruction'
          component={ReportConstructionListScreen}
          options={
            {
              title: 'Construction List',
              headerBackTitle: 'Back',
            }
          }
        />
        <ReportStack.Screen
          name='ReportDiscipline'
          component={ReportDisciplineListScreen}
          options={
            {
              title: 'Discipline List',
              headerBackTitle: 'Back',
            }
          }
        />
        <ReportStack.Screen
          name='ReportHistogram'
          component={ReportHistogramListScreen}
          options={
            {
              title: 'Histogram List',
              headerBackTitle: 'Back',
            }
          }
        />
        <ReportStack.Screen
          name='ReportDailyManpower'
          component={ReportDailyManpowerListScreen}
          options={
            {
              title: 'Daily Manpower List',
              headerBackTitle: 'Back',
            }
          }
        />
    </ReportStack.Navigator>
  );
}

export default () => {
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
              title: 'PTSC M&C',
            }
          }
        />

        <Stack.Screen
          name='ConstructionUpdateManage'
          component={ConstructionUpdateManageScreen}
          options={
            {
              title: 'Construction Update',
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
          name='AllStatusCamera'
          component={AllStatusCameraScreen}
          options={
            {
              title: 'QRCode Scanner',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingSearch'
          component={DrawingSearchScreen}
          options={
            {
              title: 'Search Drawing',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingAllStatus'
          component={DrawingAllStatusScreen}
          options={
            {
              title: 'Drawing Detail Status',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingDetail'
          component={DrawingDetailScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitle: 'Back',
          })}
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
          name='DrawingAddWelder'
          component={DrawingAddWelderScreen}
          options={
            {
              title: 'Select Welders',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='DrawingAddHeatNo'
          component={DrawingAddHeatNoScreen}
          options={
            {
              title: 'Select HeatNo',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='SpoolMatrix'
          component={SpoolMatrixScreen}
          options={
            {
              title: 'Spool Matrix',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='SpoolCamera'
          component={SpoolCameraScreen}
          options={
            {
              title: 'QRCode Scanner',
              headerBackTitle: 'Back',
            }
          }
        />

        <Stack.Screen
          name='QCDrawingList'
          component={QCDrawingListScreen}
          options={
            {
              title: 'QC Drawing List',
              headerBackTitle: 'Back',
            }
          }
        />
        <Stack.Screen
          name='QCDrawingDetail'
          component={QCDrawingDetailScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitle: 'Back',
          })}
        />
        <Stack.Screen
          name='QCSpendList'
          component={QCSpendListScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitle: 'Back',
          })}
        />

        <Stack.Screen
          name='PDFView'
          component={PDFViewScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitle: 'Back',
          })}
        />

        <Stack.Screen
          name='NDT'
          component={NDTStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='Report'
          component={ReportStackScreens}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}