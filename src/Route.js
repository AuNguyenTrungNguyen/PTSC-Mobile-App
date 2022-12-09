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
// import OpenDrawingScreen from './screens/general/opendrawing/OpenDrawingScreen';
import OpenPipeSupportDrawingScreen from './screens/general/opendrawing/OpenPipeSupportDrawingScreen';
import OpenIsometricDrawingScreen from './screens/general/opendrawing/OpenIsometricDrawingScreen';
import OpenStructuralDrawingScreen from './screens/general/opendrawing/OpenStructuralDrawingScreen';

import QCWelderCardListScreen from './screens/general/weldercard/QCWelderCardListScreen';
import QCWelderCardDetailScreen from './screens/general/weldercard/QCWelderCardDetailScreen';
import QCWelderCardImageSceen from './screens/general/weldercard/QCWelderCardImageSceen';

import TimeSheetScreen from './screens/timesheet/TimeSheetScreen';
import TimeSheetOTScreen from './screens/timesheet/TimeSheetOTScreen';
import TimeSheetManageWorkerScreen from './screens/timesheet/TimeSheetManageWorkerScreen';
import TimeSheetReportScreen from './screens/timesheet/TimeSheetReportScreen';

import HomeCONSScreen from './screens/piping/HomeCONSScreen';
import HomeQCScreen from './screens/piping/HomeQCScreen';
import HomeViewerScreen from './screens/piping/HomeViewerScreen';
import PipingDimCuttingListScreen from './screens/piping/dim/DimCuttingListScreen';
import PipingDimCuttingDetailScreen from './screens/piping/dim/DimCuttingDetailScreen';
import PipingDimCuttingQCListScreen from './screens/piping/dim/DimCuttingQCListScreen';
// import ConstructionUpdateManageScreen from './screens/piping/ConstructionUpdateManageScreen';
import CameraScreen from './screens/piping/camera/CameraScreen';
import AllStatusCameraScreen from './screens/piping/camera/AllStatusCameraScreen';
import DrawingListScreen from './screens/piping/drawing/DrawingListScreen';
import DrawingSearchScreen from './screens/piping/drawing/DrawingSearchScreen';
import DrawingAllStatusScreen from './screens/piping/drawing/DrawingAllStatusScreen';
import DrawingDetailScreen from './screens/piping/drawing/DrawingDetailScreen';
import DrawingImageScreen from './screens/piping/drawing/DrawingImageScreen';
import DrawingAddWelderScreen from './screens/piping/drawing/DrawingAddWelderScreen';
import DailyReportScreen from './screens/piping/drawing/DailyReportScreen';
import DailyReportDetailScreen from './screens/piping/drawing/DailyReportDetailScreen';
import DrawingQCStatusScreen from './screens/piping/drawing/DrawingQCStatusScreen';

// import SpoolMatrixScreen from './screens/piping/spool/SpoolMatrixScreen';
// import SpoolCameraScreen from './screens/piping/spool/SpoolCameraScreen';
// import HydrotestListScreen from './screens/piping/hydrotest/HydrotestListScreen';
import QCDrawingListScreen from './screens/piping/qc/QCDrawingListScreen';
import QCDrawingDetailScreen from './screens/piping/qc/QCDrawingDetailScreen';
import QCSpendListScreen from './screens/piping/qc/QCSpendListScreen';
// import NDTManagerScreen from './screens/piping/ndt/NDTManagerScreen';
// import NDTDetailScreen from './screens/piping/ndt/NDTDetailScreen';
// import NDTIssueScreen from './screens/piping/ndt/NDTIssueScreen';
// import ReportManagerScreen from './screens/piping/report/ReportManagerScreen';
// import ReportConstructionListScreen from './screens/piping/report/ReportConstructionListScreen';
// import ReportDisciplineListScreen from './screens/piping/report/ReportDisciplineListScreen';
// import ReportHistogramListScreen from './screens/piping/report/ReportHistogramListScreen';
// import ReportDailyManpowerListScreen from './screens/piping/report/ReportDailyManpowerListScreen';

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
import StructuralDIMAfterWeldListScreen from './screens/structural/dimcheck/DIMAfterWeldListScreen';
import StructuralDIMAfterWeldDetailScreen from './screens/structural/dimcheck/DIMAfterWeldDetailScreen';
import StructuralDIMAfterWeldDetailQCScreen from './screens/structural/dimcheck/DIMAfterWeldDetailQCScreen';

import StructuralDimForCuttingListScreen from './screens/structural/dimcheck/DimForCuttingListScreen';
import StructuralLamCheckTodoListScreen from './screens/structural/lamcheck/LamCheckTodoListScreen';
import StructuralLamcheckImageScreen from './screens/structural/lamcheck/LamcheckImageScreen';
import StructuralDimCheckListScreen from './screens/structural/dimcheck/DimCheckListScreen';
import StructuralDimCheckDetailScreen from './screens/structural/dimcheck/DimCheckDetailScreen';
import StructuralDimCheckImageScreen from './screens/structural/dimcheck/DimCheckImageScreen';
import StructuralQCSpendListScreen from './screens/structural/qc/QCSpendListScreen';
import StructuralQCImageScreen from './screens/structural/qc/QCImageScreen';
import QCObservationOverviewListScreen from './screens/observation/QAObservationOverviewListScreen';
import QCObservationListScreen from './screens/observation/QAObservationListScreen';
import QCObservationDetailScreen from './screens/observation/QAObservationDetailScreen';
import QCObservationImageScreen from './screens/observation/QAObservationImageScreen';
import QCHandBookScreen from './screens/structural/qc/QCHandBookScreen';

const Stack = createStackNavigator();

let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
if (Appearance.getColorScheme() === 'dark') {
  optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
};

//-- PIP Stacks
const PipingCONSStack = createStackNavigator();
const PipingCONSStackScreens = () => {
  return (
    <PipingCONSStack.Navigator screenOptions={optionNavigation}>
      <PipingCONSStack.Screen
        name={Constant.ROUTE__HOME}
        component={HomeCONSScreen}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />
      <PipingCONSStack.Screen
        name='Camera'
        component={CameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingCONSStack.Screen
        name='DimCuttingList'
        component={PipingDimCuttingListScreen}
        options={
          {
            title: 'Dim Cutting List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DimCuttingDetail'
        component={PipingDimCuttingDetailScreen}
        options={
          {
            title: 'Dim Cutting Detail',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingCONSStack.Screen
        name='DrawingList'
        component={DrawingListScreen}
        options={
          {
            title: 'Drawing List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DrawingDetail'
        component={DrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingCONSStack.Screen
        name='DrawingImage'
        component={DrawingImageScreen}
        options={
          {
            title: 'Drawing Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DrawingAddWelder'
        component={DrawingAddWelderScreen}
        options={
          {
            title: 'Select Welders',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='QCStatus'
        component={DrawingQCStatusScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />

      <PipingCONSStack.Screen
        name='AllStatusCamera'
        component={AllStatusCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DrawingSearch'
        component={DrawingSearchScreen}
        options={
          {
            title: 'Search Drawing',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DrawingAllStatus'
        component={DrawingAllStatusScreen}
        options={
          {
            title: 'Drawing Detail Status',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingCONSStack.Screen
        name='DailyReport'
        component={DailyReportScreen}
        options={
          {
            title: 'Daily Report',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='DailyReportDetail'
        component={DailyReportDetailScreen}
        options={
          {
            title: 'Daily Report Detail',
            headerBackTitle: 'Back',
          }
        }
      />
    </PipingCONSStack.Navigator>
  );
};

const PipingQCStack = createStackNavigator();
const PipingQCStackScreens = () => {
  return (
    <PipingQCStack.Navigator screenOptions={optionNavigation}>
      <PipingQCStack.Screen
        name={Constant.ROUTE__HOME}
        component={HomeQCScreen}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />

      <PipingQCStack.Screen
        name='Camera'
        component={CameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingQCStack.Screen
        name='DimCuttingQCList'
        component={PipingDimCuttingQCListScreen}
        options={
          {
            title: 'QC Dim Cutting List',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingQCStack.Screen
        name='QCDrawingList'
        component={QCDrawingListScreen}
        options={
          {
            title: 'QC Drawing List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingQCStack.Screen
        name='QCDrawingDetail'
        component={QCDrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingQCStack.Screen
        name='DrawingImage'
        component={DrawingImageScreen}
        options={
          {
            title: 'Drawing Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingQCStack.Screen
        name='QCSpendList'
        component={QCSpendListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />

      <PipingQCStack.Screen
        name='AllStatusCamera'
        component={AllStatusCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingQCStack.Screen
        name='DrawingSearch'
        component={DrawingSearchScreen}
        options={
          {
            title: 'Search Drawing',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingQCStack.Screen
        name='DrawingAllStatus'
        component={DrawingAllStatusScreen}
        options={
          {
            title: 'Drawing Detail Status',
            headerBackTitle: 'Back',
          }
        }
      />
    </PipingQCStack.Navigator>
  );
};

const PipingViewerStack = createStackNavigator();
const PipingViewerStackScreens = () => {
  return (
    <PipingViewerStack.Navigator screenOptions={optionNavigation}>
      <PipingViewerStack.Screen
        name={Constant.ROUTE__HOME}
        component={HomeViewerScreen}
        options={
          {
            title: 'PTSC M&C',
          }
        }
      />

      <PipingViewerStack.Screen
        name='Camera'
        component={CameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingViewerStack.Screen
        name='AllStatusCamera'
        component={AllStatusCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingViewerStack.Screen
        name='DrawingSearch'
        component={DrawingSearchScreen}
        options={
          {
            title: 'Search Drawing',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingViewerStack.Screen
        name='DrawingAllStatus'
        component={DrawingAllStatusScreen}
        options={
          {
            title: 'Drawing Detail Status',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingViewerStack.Screen
        name='DrawingDetail'
        component={DrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingViewerStack.Screen
        name='QCDrawingDetail'
        component={QCDrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <PipingViewerStack.Screen
        name='DrawingImage'
        component={DrawingImageScreen}
        options={
          {
            title: 'Drawing Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
    </PipingViewerStack.Navigator>
  );
};


//-- STR Stacks
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
      {/* DIM After Weld */}
      <StructuralCONSStack.Screen
        name='DIMAfterWeldList'
        component={StructuralDIMAfterWeldListScreen}
        options={
          {
            title: 'DIM After Weld List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='DIMAfterWeldDetail'
        component={StructuralDIMAfterWeldDetailScreen}
        options={
          {
            title: 'DIM After Weld Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='DIMAfterWeldDetailQC'
        component={StructuralDIMAfterWeldDetailQCScreen}
        options={
          {
            title: 'QC DIM After Weld Status',
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
        name='QCHandBook'
        component={QCHandBookScreen}
        options={
          {
            title: 'QC Hand Book',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* DIM After Weld */}
      <StructuralQCStack.Screen
        name='DIMAfterWeldListQC'
        component={StructuralDIMAfterWeldListScreen}
        options={
          {
            title: 'QC DIM After Weld List',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralQCStack.Screen
        name='DIMAfterWeldDetailQC'
        component={StructuralDIMAfterWeldDetailQCScreen}
        options={
          {
            title: 'QC DIM After Weld Detail',
            headerBackTitle: 'Back',
          }
        }
      />
    </StructuralQCStack.Navigator>
  );
};

//-- Common Stacks
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
        name='TimeSheetReport'
        component={TimeSheetReportScreen}
        options={
          {
            title: 'TimeSheet Reports',
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
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
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
      <CommonStack.Screen
        name='OpenPipeSupportDrawing'
        component={OpenPipeSupportDrawingScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <CommonStack.Screen
        name='OpenIsometricDrawing'
        component={OpenIsometricDrawingScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <CommonStack.Screen
        name='OpenStructuralDrawing'
        component={OpenStructuralDrawingScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <CommonStack.Screen
        name='QAObservationOverviewList'
        component={QCObservationOverviewListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='QAObservationList'
        component={QCObservationListScreen}
        options={
          {
            title: 'Observation List',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='QAObservationDetail'
        component={QCObservationDetailScreen}
        options={
          {
            title: 'Observation Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='QAObservationImage'
        component={QCObservationImageScreen}
        options={
          {
            title: 'Observation Pictures',
            headerBackTitle: 'Back',
          }
        }
      />

      <CommonStack.Screen
        name='QCWelderCardList'
        component={QCWelderCardListScreen}
        options={
          {
            title: 'Welder List',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='QCWelderCardDetail'
        component={QCWelderCardDetailScreen}
        options={
          {
            title: 'Welder Card',
            headerBackTitle: 'Back',
          }
        }
      />
      <CommonStack.Screen
        name='QCWelderCardImage'
        component={QCWelderCardImageSceen}
        options={
          {
            title: 'Welder Image',
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
          name={Constant.ROUTE__PIP_CONS}
          component={PipingCONSStackScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Constant.ROUTE__PIP_QC}
          component={PipingQCStackScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Constant.ROUTE__PIP_VIEWER}
          component={PipingViewerStackScreens}
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