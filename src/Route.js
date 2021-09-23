import React from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Constant from './utils/Constant';

import AuthScreen from './screens/authentication/AuthScreen';
import LoginScreen from './screens/authentication/LoginScreen';
import PDFViewScreen from './screens/pdf/PDFViewScreen';

import ManHoursImpactListScreen from './screens/general/manhoursimpact/ManHoursImpactListScreen';
import ManHoursImpactDetailScreen from './screens/general/manhoursimpact/ManHoursImpactDetailScreen';
import ManHoursImpactImageScreen from './screens/general/manhoursimpact/ManHoursImpactImageScreen';
import TimeSheetScreen from './screens/general/TimeSheetScreen';

import HomeScreen from './screens/piping/HomeScreen';
import ConstructionUpdateManageScreen from './screens/piping/ConstructionUpdateManageScreen';
import CameraScreen from './screens/piping/camera/CameraScreen';
import AllStatusCameraScreen from './screens/piping/camera/AllStatusCameraScreen';
import DrawingListScreen from './screens/piping/drawing/DrawingListScreen';
import DrawingSearchScreen from './screens/piping/drawing/DrawingSearchScreen';
import DrawingAllStatusScreen from './screens/piping/drawing/DrawingAllStatusScreen';
import DrawingDetailScreen from './screens/piping/drawing/DrawingDetailScreen';
import DrawingImageScreen from './screens/piping/drawing/DrawingImageScreen';
import DrawingAddWelderScreen from './screens/piping/drawing/DrawingAddWelderScreen';
import DrawingAddHeatNoScreen from './screens/piping/drawing/DrawingAddHeatNoScreen';
import SpoolMatrixScreen from './screens/piping/spool/SpoolMatrixScreen';
import SpoolCameraScreen from './screens/piping/spool/SpoolCameraScreen';
import HydrotestListScreen from './screens/piping/hydrotest/HydrotestListScreen';
import QCDrawingListScreen from './screens/piping/qc/QCDrawingListScreen';
import QCDrawingDetailScreen from './screens/piping/qc/QCDrawingDetailScreen';
import QCSpendListScreen from './screens/piping/qc/QCSpendListScreen';
import NDTManagerScreen from './screens/piping/ndt/NDTManagerScreen';
import NDTDetailScreen from './screens/piping/ndt/NDTDetailScreen';
import NDTIssueScreen from './screens/piping/ndt/NDTIssueScreen';
import ReportManagerScreen from './screens/piping/report/ReportManagerScreen';
import ReportConstructionListScreen from './screens/piping/report/ReportConstructionListScreen';
import ReportDisciplineListScreen from './screens/piping/report/ReportDisciplineListScreen';
import ReportHistogramListScreen from './screens/piping/report/ReportHistogramListScreen';
import ReportDailyManpowerListScreen from './screens/piping/report/ReportDailyManpowerListScreen';

import StructuralHomeScreenCONS from './screens/structural/home/HomeScreenCONS';
import StructuralHomeScreenQCDEPT from './screens/structural/home/HomeScreenQCDEPT';
import StructuralCameraScreen from './screens/structural/camera/CameraScreen';
import StructuralConstructionListScreen from './screens/structural/construction/ConstructionListScreen';
import StructuralConstructionDetailScreen from './screens/structural/construction/ConstructionDetailScreen';
import StructuralConstructionImageScreen from './screens/structural/construction/ConstructionImageScreen';
import StructuralAddWelderScreen from './screens/structural/construction/ConstructionAddWelderScreen';
import StructuralPieceMarkListScreen from './screens/structural/piecemark/PieceMarkListScreen';
import StructuralPieceMarkDetailScreen from './screens/structural/piecemark/PieceMarkDetailScreen';
import StructuralLamCheckSpendingListScreen from './screens/structural/lamcheck/LamCheckSpendingListScreen';
import StructuralLamCheckTodoListScreen from './screens/structural/lamcheck/LamCheckTodoListScreen';
import StructuralLamcheckImageScreen from './screens/structural/lamcheck/LamcheckImageScreen';
import StructuralDimCheckListScreen from './screens/structural/dimcheck/DimCheckListScreen';
import StructuralDimCheckDetailScreen from './screens/structural/dimcheck/DimCheckDetailScreen';
import StructuralDimCheckImageScreen from './screens/structural/dimcheck/DimCheckImageScreen';
import StructuralQAObservationOverviewListScreen from './screens/structural/observation/QAObservationOverviewListScreen';
import StructuralQAObservationListScreen from './screens/structural/observation/QAObservationListScreen';
import StructuralQAObservationDetailScreen from './screens/structural/observation/QAObservationDetailScreen';
import StructuralQAObservationImageScreen from './screens/structural/observation/QAObservationImageScreen';

const Stack = createStackNavigator();
const PipingStack = createStackNavigator();
const NDTStack = createStackNavigator();
const ReportStack = createStackNavigator();

let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
if (Appearance.getColorScheme() === 'dark') {
  optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
};

const PipingStackScreens = () => {
  return (
    <PipingStack.Navigator screenOptions={optionNavigation}>
      <PipingStack.Screen
        name='Home'
        component={HomeScreen}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />

      <PipingStack.Screen
        name='ConstructionUpdateManage'
        component={ConstructionUpdateManageScreen}
        options={
          {
            title: 'Construction Update',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingStack.Screen
        name='DrawingList'
        component={DrawingListScreen}
        options={
          {
            title: 'Drawing List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='Camera'
        component={CameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='AllStatusCamera'
        component={AllStatusCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DrawingSearch'
        component={DrawingSearchScreen}
        options={
          {
            title: 'Search Drawing',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DrawingAllStatus'
        component={DrawingAllStatusScreen}
        options={
          {
            title: 'Drawing Detail Status',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DrawingDetail'
        component={DrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingStack.Screen
        name='DrawingImage'
        component={DrawingImageScreen}
        options={
          {
            title: 'Drawing Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DrawingAddWelder'
        component={DrawingAddWelderScreen}
        options={
          {
            title: 'Select Welders',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DrawingAddHeatNo'
        component={DrawingAddHeatNoScreen}
        options={
          {
            title: 'Select HeatNo',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingStack.Screen
        name='SpoolMatrix'
        component={SpoolMatrixScreen}
        options={
          {
            title: 'Spool Matrix',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingStack.Screen
        name='HydrotestList'
        component={HydrotestListScreen}
        options={
          {
            title: 'Hydrotest List',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingStack.Screen
        name='SpoolCamera'
        component={SpoolCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingStack.Screen
        name='QCDrawingList'
        component={QCDrawingListScreen}
        options={
          {
            title: 'QC Drawing List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='QCDrawingDetail'
        component={QCDrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingStack.Screen
        name='QCSpendList'
        component={QCSpendListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />

      <PipingStack.Screen
        name='NDT'
        component={NDTStackScreens}
        options={{ headerShown: false }}
      />

      <PipingStack.Screen
        name='Report'
        component={ReportStackScreens}
        options={{ headerShown: false }}
      />
    </PipingStack.Navigator>
  );
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
};

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
};

const StructuralCONSStack = createStackNavigator();
const StructuralCONSStackScreens = () => {
  return (
    <StructuralCONSStack.Navigator screenOptions={optionNavigation}>
      <StructuralCONSStack.Screen
        name={Constant.ROUTE__HOME}
        component={StructuralHomeScreenCONS}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />
      <StructuralCONSStack.Screen
        name={Constant.ROUTE__CAMERA}
        component={StructuralCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='PieceMarkList'
        component={StructuralPieceMarkListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralCONSStack.Screen
        name='PieceMarkDetail'
        component={StructuralPieceMarkDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralCONSStack.Screen
        name='LamCheckSpendingList'
        component={StructuralLamCheckSpendingListScreen}
        options={
          {
            title: 'Lam Check Request',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='LamCheckImage'
        component={StructuralLamcheckImageScreen}
        options={
          {
            title: 'Lam Check Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ConstructionList'
        component={StructuralConstructionListScreen}
        options={
          {
            title: 'Construction List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ConstructionDetail'
        component={StructuralConstructionDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralCONSStack.Screen
        name='ConstructionImage'
        component={StructuralConstructionImageScreen}
        options={
          {
            title: 'Construction Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ConstructionAddWelder'
        component={StructuralAddWelderScreen}
        options={
          {
            title: 'Select Welders',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ManHoursImpact'
        component={ManHoursImpactListScreen}
        options={
          {
            title: 'Man-hours Impact',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ManHoursImpactDetail'
        component={ManHoursImpactDetailScreen}
        options={
          {
            title: 'Create Impact',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ManHoursImpactImage'
        component={ManHoursImpactImageScreen}
        options={
          {
            title: 'Man-hours Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='TimeSheet'
        component={TimeSheetScreen}
        options={
          {
            title: 'Company TimeSheet',
            headerBackTitle: 'Back',
          }
        }
      />
    </StructuralCONSStack.Navigator>
  );
};

const StructuralQCDEPTStack = createStackNavigator();
const StructuralQCDEPTStackScreens = () => {
  return (
    <StructuralQCDEPTStack.Navigator screenOptions={optionNavigation}>
      <StructuralQCDEPTStack.Screen
        name={Constant.ROUTE__HOME}
        component={StructuralHomeScreenQCDEPT}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name={Constant.ROUTE__CAMERA}
        component={StructuralCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='LamCheckTodoList'
        component={StructuralLamCheckTodoListScreen}
        options={
          {
            title: 'Lam Check Todo',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='LamCheckImage'
        component={StructuralLamcheckImageScreen}
        options={
          {
            title: 'Lam Check Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='DimCheckList'
        component={StructuralDimCheckListScreen}
        options={
          {
            title: 'Dim Check List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='DimCheckDetail'
        component={StructuralDimCheckDetailScreen}
        options={
          {
            title: 'Dim Check Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='DimCheckImage'
        component={StructuralDimCheckImageScreen}
        options={
          {
            title: 'Dim Check Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='QAObservationOverviewList'
        component={StructuralQAObservationOverviewListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='QAObservationList'
        component={StructuralQAObservationListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='QAObservationDetail'
        component={StructuralQAObservationDetailScreen}
        options={
          {
            title: 'Observation Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCDEPTStack.Screen
        name='QAObservationImage'
        component={StructuralQAObservationImageScreen}
        options={
          {
            title: 'Observation Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
    </StructuralQCDEPTStack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Constant.ROUTE__AUTH}
        screenOptions={optionNavigation}>

        <Stack.Screen
          name={Constant.ROUTE__AUTH}
          component={AuthScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__LOGIN}
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__PIPING}
          component={PipingStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__STR_CONS}
          component={StructuralCONSStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__STR_QCDEPT}
          component={StructuralQCDEPTStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__STR_QCWS}
          component={StructuralQCDEPTStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__PDF}
          component={PDFViewScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerBackTitle: 'Back',
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};