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

import TimeSheetScreen from './screens/timesheet/TimeSheetScreen';
import TimeSheetOTScreen from './screens/timesheet/TimeSheetOTScreen';
import TimeSheetManageWorkerScreen from './screens/timesheet/TimeSheetManageWorkerScreen';

import HomeScreen from './screens/piping/HomeScreen';
import PipingDimCuttingListScreen from './screens/piping/dim/DimCuttingListScreen';
import PipingDimCuttingDetailScreen from './screens/piping/dim/DimCuttingDetailScreen';
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
import StructuralHomeScreenQC from './screens/structural/home/HomeScreenQC';
import StructuralCameraScreen from './screens/structural/camera/CameraScreen';
import StructuralConstructionListScreen from './screens/structural/construction/ConstructionListScreen';
import StructuralConstructionDetailScreen from './screens/structural/construction/ConstructionDetailScreen';
import StructuralConstructionMultiDetailScreen from './screens/structural/construction/ConstructionMultiDetailScreen';
import StructuralConstructionImageScreen from './screens/structural/construction/ConstructionImageScreen';
import StructuralConstructionQCStatusScreen from './screens/structural/construction/ConstructionQCStatusScreen';
import StructuralAddWelderScreen from './screens/structural/construction/ConstructionAddWelderScreen';
import StructuralAddPieceMarkNoScreen from './screens/structural/construction/ConstructionAddPieceMarkNoScreen';
import StructuralPieceMarkListScreen from './screens/structural/piecemark/PieceMarkListScreen';
import StructuralPieceMarkDetailScreen from './screens/structural/piecemark/PieceMarkDetailScreen';
import StructuralDimForCuttingQCStatusScreen from './screens/structural/dimcheck/DimForCuttingQCStatusScreen';
import StructuralLamCheckSpendingListScreen from './screens/structural/lamcheck/LamCheckSpendingListScreen';
import StructuralLamCheckQCStatusScreen from './screens/structural/lamcheck/LamCheckQCStatusScreen';

import StructuralDimForCuttingListScreen from './screens/structural/dimcheck/DimForCuttingListScreen';
import StructuralLamCheckTodoListScreen from './screens/structural/lamcheck/LamCheckTodoListScreen';
import StructuralLamcheckImageScreen from './screens/structural/lamcheck/LamcheckImageScreen';
import StructuralDimCheckListScreen from './screens/structural/dimcheck/DimCheckListScreen';
import StructuralDimCheckDetailScreen from './screens/structural/dimcheck/DimCheckDetailScreen';
import StructuralDimCheckImageScreen from './screens/structural/dimcheck/DimCheckImageScreen';
import StructuralQCSpendListScreen from './screens/structural/qc/QCSpendListScreen';
import StructuralQCImageScreen from './screens/structural/qc/QCImageScreen';
import StructuralQAObservationOverviewListScreen from './screens/structural/observation/QAObservationOverviewListScreen';
import StructuralQAObservationListScreen from './screens/structural/observation/QAObservationListScreen';
import StructuralQAObservationDetailScreen from './screens/structural/observation/QAObservationDetailScreen';
import StructuralQAObservationImageScreen from './screens/structural/observation/QAObservationImageScreen';
import QCHandBookScreen from './screens/structural/qc/QCHandBookScreen';

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
        name='DimCuttingList'
        component={PipingDimCuttingListScreen}
        options={
          {
            title: 'Dim Cutting List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingStack.Screen
        name='DimCuttingDetail'
        component={PipingDimCuttingDetailScreen}
        options={
          {
            title: 'Dim Cutting Detail',
            headerBackTitle: 'Back',
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
        name='DimForCutting'
        component={StructuralDimForCuttingQCStatusScreen}
        options={
          {
            title: 'Dim For Cutting',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='DimForCuttingImage'
        component={StructuralDimCheckImageScreen}
        options={
          {
            title: 'Dim Check Pictures',
            headerBackTitle: 'Back',
          }
        }
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
        name='LamCheckQCStatus'
        component={StructuralLamCheckQCStatusScreen}
        options={
          {
            title: 'Lam Check QC Status',
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
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
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
        name='ConstructionMultiDetail'
        component={StructuralConstructionMultiDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralCONSStack.Screen
        name='ConstructionQCStatus'
        component={StructuralConstructionQCStatusScreen}
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
        name='ConstructionAddPieceMarkNo'
        component={StructuralAddPieceMarkNoScreen}
        options={
          {
            title: 'Select Piece Mark No',
            headerBackTitle: 'Back',
          }
        }
      />
    </StructuralCONSStack.Navigator>
  );
};

const StructuralQCStack = createStackNavigator();
const StructuralQCStackScreens = () => {
  return (
    <StructuralQCStack.Navigator screenOptions={optionNavigation}>
      <StructuralQCStack.Screen
        name={Constant.ROUTE__HOME}
        component={StructuralHomeScreenQC}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />
      <StructuralQCStack.Screen
        name={Constant.ROUTE__CAMERA}
        component={StructuralCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='DimForCuttingList'
        component={StructuralDimForCuttingListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralQCStack.Screen
        name='LamCheckTodoList'
        component={StructuralLamCheckTodoListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralQCStack.Screen
        name='LamCheckImage'
        component={StructuralLamcheckImageScreen}
        options={
          {
            title: 'Lam Check Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='DimCheckList'
        component={StructuralDimCheckListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralQCStack.Screen
        name='DimCheckDetail'
        component={StructuralDimCheckDetailScreen}
        options={
          {
            title: 'Dim Check Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='DimCheckImage'
        component={StructuralDimCheckImageScreen}
        options={
          {
            title: 'Dim Check Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QCSpendList'
        component={StructuralQCSpendListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <StructuralQCStack.Screen
        name='QCImage'
        component={StructuralQCImageScreen}
        options={
          {
            title: 'QC Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QAObservationOverviewList'
        component={StructuralQAObservationOverviewListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QAObservationList'
        component={StructuralQAObservationListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QAObservationDetail'
        component={StructuralQAObservationDetailScreen}
        options={
          {
            title: 'Observation Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QAObservationImage'
        component={StructuralQAObservationImageScreen}
        options={
          {
            title: 'Observation Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='QCHandBook'
        component={QCHandBookScreen}
        options={
          {
            title: 'QC Hand Book',
            headerBackTitle: 'Back',
          }
        }
      />
    </StructuralQCStack.Navigator>
  );
};

const CommonStack = createStackNavigator();
const CommonStackScreens = () => {
  return (
    <CommonStack.Navigator screenOptions={optionNavigation}>
      <CommonStack.Screen
        name='TimeSheet'
        component={TimeSheetScreen}
        options={
          {
            title: 'Chấm công',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='TimeSheetOT'
        component={TimeSheetOTScreen}
        options={
          {
            title: 'Chấm tăng ca',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='TimeSheetManagerWorker'
        component={TimeSheetManageWorkerScreen}
        options={
          {
            title: 'Manage Workers',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='ManHoursImpact'
        component={ManHoursImpactListScreen}
        options={
          {
            title: 'Man-hours Impact',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='ManHoursImpactDetail'
        component={ManHoursImpactDetailScreen}
        options={
          {
            title: 'Create Man-hours',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='ManHoursImpactImage'
        component={ManHoursImpactImageScreen}
        options={
          {
            title: 'Man-hours Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
    </CommonStack.Navigator>
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
          component={StructuralQCStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__STR_QCWS}
          component={StructuralQCStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__COMMON}
          component={CommonStackScreens}
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