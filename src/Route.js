import React from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppConfig from './utils/AppConfig';
import Constant from './utils/Constant';

import AuthScreen from './screens/authentication/AuthScreen';
import LoginScreen from './screens/authentication/LoginScreen';
// import PDFViewScreen from './screens/pdf/PDFViewScreen';
import PDFViewScreen from './screens/pdf/PDFViewScreenNew'; //-- Use for AWS

//-- Image
import ImageScreen from './screens/images/ImageScreen';

//-- General
import ManHoursImpactListScreen from './screens/general/manhoursimpact/ManHoursImpactListScreen';
import ManHoursImpactDetailScreen from './screens/general/manhoursimpact/ManHoursImpactDetailScreen';
import ManHoursImpactImageScreen from './screens/general/manhoursimpact/ManHoursImpactImageScreen';
import OpenPipeSupportDrawingScreen from './screens/general/opendrawing/OpenPipeSupportDrawingScreen';
import OpenIsometricDrawingScreen from './screens/general/opendrawing/OpenIsometricDrawingScreen';
import OpenStructuralDrawingScreen from './screens/general/opendrawing/OpenStructuralDrawingScreen';
import QCWelderCardListScreen from './screens/general/weldercard/QCWelderCardListScreen';
import QCWelderCardDetailScreen from './screens/general/weldercard/QCWelderCardDetailScreen';
import QCWelderCardAvatarSceen from './screens/general/weldercard/QCWelderCardAvatarSceen';
import QCWelderCardImageSceen from './screens/general/weldercard/QCWelderCardImageSceen';

//-- TimeSheet
import TimeSheetScreen from './screens/timesheet/TimeSheetScreen';
import TimeSheetOTScreen from './screens/timesheet/TimeSheetOTScreen';
import TimeSheetManageWorkerScreen from './screens/timesheet/TimeSheetManageWorkerScreen';
import TimeSheetReportScreen from './screens/timesheet/TimeSheetReportScreen';

//-- PIP
import PipingHomeCONSScreen from './screens/piping/HomeCONSScreen';
import PipingHomeQCScreen from './screens/piping/HomeQCScreen';
import PipingDimCuttingListScreen from './screens/piping/dim/DimCuttingListScreen';
import PipingDimCuttingDetailScreen from './screens/piping/dim/DimCuttingDetailScreen';
import PipingDimCuttingQCListScreen from './screens/piping/dim/DimCuttingQCListScreen';
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
import QCDrawingListScreen from './screens/piping/qc/QCDrawingListScreen';
import QCDrawingDetailScreen from './screens/piping/qc/QCDrawingDetailScreen';
import QCSpendListScreen from './screens/piping/qc/QCSpendListScreen';
import PipeSupportListScreen from './screens/piping/pipe/PipeSupportListScreen';
import PipeSupportDetailScreen from './screens/piping/pipe/PipeSupportDetailScreen';
import PipeSpoolListScreen from './screens/piping/spool/PipeSpoolListScreen';
import PipeSpoolDetailScreen from './screens/piping/spool/PipeSpoolDetailScreen';
import HydrotestPackageListScreen from './screens/piping/hydrotest/HydrotestPackageListScreen';
import HydrotestPackageDetailScreen from './screens/piping/hydrotest/HydrotestPackageDetailScreen';

//-- GRE
import GREDrawingListScreen from './screens/piping/gre/GREDrawingListScreen';
import GREDrawingDetailScreen from './screens/piping/gre/GREDrawingDetailScreen';
import GREQCPendingListScreen from './screens/piping/gre/GREQCPendingListScreen';

//-- Valve
import ValveProgressListScreen from './screens/piping/valve/ValveProgressListScreen';
import ValveProgressDetailScreen from './screens/piping/valve/ValveProgressDetailScreen';

//-- Flange Joint
import FlangeJointProgressListScreen from './screens/piping/flange/FlangeJointProgressListScreen';
import FlangeJointProgressDetailScreen from './screens/piping/flange/FlangeJointProgressDetailScreen';

//-- STR
import StructuralHomeCONSScreen from './screens/structural/home/HomeScreenCONS';
import StructuralHomeQCScreen from './screens/structural/home/HomeScreenQC';
import StructuralCameraScreen from './screens/structural/camera/CameraScreen';
import StructuralConstructionListScreen from './screens/structural/construction/ConstructionListScreen';
import StructuralConstructionDetailScreen from './screens/structural/construction/ConstructionDetailScreen';
import StructuralConstructionMultiDetailScreen from './screens/structural/construction/ConstructionMultiDetailScreen';
import StructuralConstructionImageScreen from './screens/structural/construction/ConstructionImageScreen';
import StructuralConstructionQCStatusScreen from './screens/structural/construction/ConstructionQCStatusScreen';
import StructuralAddWelderScreen from './screens/structural/construction/ConstructionAddWelderScreen';
import ConstructionAddLotNoScreen from './screens/structural/construction/ConstructionAddLotNoScreen';
import ConstructionAddMachineNoScreen from './screens/structural/construction/ConstructionAddMachineNoScreen';
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
import QCHandBookScreen from './screens/structural/qc/QCHandBookScreen';

//-- EIT
import ElectricalHomeScreenCONS from './screens/electircal/home/HomeCONSScreen';
import ElectricalHomeScreenQC from './screens/electircal/home/HomeQCScreen';
import ElectricalCableControlListScreen from './screens/electircal/cablecontrol/ElectricalCableControlListScreen';
import ElectricalCableControlDetailScreen from './screens/electircal/cablecontrol/ElectricalCableControlDetailScreen';
import InstrumentCableControlListScreen from './screens/electircal/instrument_cable_control/InstrumentCableControlListScreen';
import InstrumentCableControlDetailScreen from './screens/electircal/instrument_cable_control/InstrumentCableControlDetailScreen';
import ElectricalGlandControlListScreen from './screens/electircal/electrical_gland_control/ElectricalGlandControlListScreen';
import ElectricalGlandControlDetailScreen from './screens/electircal/electrical_gland_control/ElectricalGlandControlDetailScreen';
import InstrumentGlandControlListScreen from './screens/electircal/instrument_gland_control/InstrumentGlandControlListScreen';
import InstrumentGlandControlDetailScreen from './screens/electircal/instrument_gland_control/InstrumentGlandControlDetailScreen';
import ElectricalTerminationControlListScreen from './screens/electircal/electrical_terminate_control/ElectricalTerminationControlListScreen';
import ElectricalTerminationControlDetailScreen from './screens/electircal/electrical_terminate_control/ElectricalTerminationControlDetailScreen';
import InstrumentTerminationControlListScreen from './screens/electircal/instrument_termination_control/InstrumentTerminationControlListScreen';
import InstrumentTerminationControlDetailScreen from './screens/electircal/instrument_termination_control/InstrumentTerminationControlDetailScreen';
import ElectricalCableDamageLogListScreen from './screens/electircal/cabledamagelog/ElectricalCableDamageLogListScreen';
import ElectricalCableDamageLogDetailScreen from './screens/electircal/cabledamagelog/ElectricalCableDamageLogDetailScreen';
import ElectricalCableDamageLogDataScreen from './screens/electircal/cabledamagelog/ElectricalCableDamageLogDataScreen';
import DrumNoListScreen from './screens/electircal/drumlibrary/DrumNoListScreen';
import CableControlReportScreen from './screens/electircal/cablereport/CableControlReportScreen';

//-- VIEW
import HomeViewerScreen from './screens/general/viewer/HomeViewerScreen';

//-- Observation
import QCObservationOverviewListScreen from './screens/observation/QAObservationOverviewListScreen';
import QCObservationListScreen from './screens/observation/QAObservationListScreen';
import QCObservationDetailScreen from './screens/observation/QAObservationDetailScreen';
import QCObservationImageScreen from './screens/observation/QAObservationImageScreen';

//-- Equipment
import EquipmentCameraScreen from './screens/equipment/EquipmentCameraScreen';
import DailyTaskPlanListScreen from './screens/equipment/DailyTaskPlanListScreen';
import EquipmentTimesheetApproveListScreen from './screens/equipment/EquipmentTimesheetApproveListScreen';
import WorkRequestListScreen from './screens/equipment/WorkRequestListScreen';
import MajorEquipmentGroupCodeScreen from './screens/equipment/MajorEquipmentGroupCodeScreen';
import MajorEquipmentEquipmentCodeScreen from './screens/equipment/MajorEquipmentEquipmentCodeScreen';
import EquipmentTimesheetDailyListScreen from './screens/equipment/EquipmentTimesheetDailyListScreen';
import CreateEquipmentTimesheetDailyScreen from './screens/equipment/CreateEquipmentTimesheetDailyScreen';
import MajorEquipmentUserListScreen from './screens/equipment/MajorEquipmentUserListScreen';
import EquipmentDataControlListScreen from './screens/equipment/EquipmentDataControlListScreen';
import EquipmentLiftingPlanListScreen from './screens/equipment/EquipmentLiftingPlanListScreen';
import EquipmentLiftingPlanDetailScreen from './screens/equipment/EquipmentLiftingPlanDetailScreen';

const Stack = createStackNavigator();

let optionNavigation = { headerStyle: { backgroundColor: 'aliceblue' } };
if (Appearance.getColorScheme() === 'dark') {
  optionNavigation = { headerStyle: { backgroundColor: 'grey' }, headerTintColor: 'white' };
};

const titleShow = AppConfig.TITLE;

//-- PIP Stacks
const PipingCONSStack = createStackNavigator();
const PipingCONSStackScreens = () => {
  return (
    <PipingCONSStack.Navigator screenOptions={optionNavigation}>
      <PipingCONSStack.Screen
        name={Constant.ROUTE__HOME}
        component={PipingHomeCONSScreen}
        options={
          {
            title: titleShow,
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
      <PipingCONSStack.Screen
        name='PipeSupportList'
        component={PipeSupportListScreen}
        options={
          {
            title: 'Pipe Support List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='PipeSupportDetail'
        component={PipeSupportDetailScreen}
        options={
          {
            title: 'Pipe Support Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='PipeSpoolList'
        component={PipeSpoolListScreen}
        options={
          {
            title: 'Pipe Spool List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='PipeSpoolDetail'
        component={PipeSpoolDetailScreen}
        options={
          {
            title: 'Pipe Spool Detail',
            headerBackTitle: 'Back',
          }
        }
      />

      {/* GRE */}
      <PipingCONSStack.Screen
        name='GREDrawingList'
        component={GREDrawingListScreen}
        options={
          {
            title: 'GRE Drawing List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='GREDrawingDetail'
        component={GREDrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />

      <PipingCONSStack.Screen
        name='HydrotestPackageList'
        component={HydrotestPackageListScreen}
        options={
          {
            title: 'Hydrotest Package List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='HydrotestPackageDetail'
        component={HydrotestPackageDetailScreen}
        options={
          {
            title: 'Hydrotest Package Detail',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingCONSStack.Screen
        name='ValveProgressList'
        component={ValveProgressListScreen}
        options={
          {
            title: 'Valve Progress List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='ValveProgressDetail'
        component={ValveProgressDetailScreen}
        options={
          {
            title: 'Valve Progress Detail',
            headerBackTitle: 'Back',
          }
        }
      />

      <PipingCONSStack.Screen
        name='FlangeJointProgressList'
        component={FlangeJointProgressListScreen}
        options={
          {
            title: 'Flange Joint Progress List',
            headerBackTitle: 'Back',
          }
        }
      />
      <PipingCONSStack.Screen
        name='FlangeJointProgressDetail'
        component={FlangeJointProgressDetailScreen}
        options={
          {
            title: 'Flange Joint Progress Detail',
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
        component={PipingHomeQCScreen}
        options={
          {
            title: titleShow,
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
      <PipingQCStack.Screen
        name='GREQCPendingList'
        component={GREQCPendingListScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
    </PipingQCStack.Navigator>
  );
};

//-- STR Stacks
const StructuralCONSStack = createStackNavigator();
const StructuralCONSStackScreens = () => {
  return (
    <StructuralCONSStack.Navigator screenOptions={optionNavigation}>
      <StructuralCONSStack.Screen
        name={Constant.ROUTE__HOME}
        component={StructuralHomeCONSScreen}
        options={
          {
            title: titleShow,
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
        name='ConstructionAddLotNo'
        component={ConstructionAddLotNoScreen}
        options={
          {
            title: 'Select Consumable LotNo',
            headerBackTitle: 'Back',
          }
        }
      />
      <StructuralCONSStack.Screen
        name='ConstructionAddMachineNo'
        component={ConstructionAddMachineNoScreen}
        options={
          {
            title: 'Select MachineNo',
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
        component={StructuralHomeQCScreen}
        options={
          {
            title: titleShow,
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


//-- EIT Stacks
const ElectricalCONSStack = createStackNavigator();
const ElectricalCONSStackScreens = () => {
  return (
    <ElectricalCONSStack.Navigator screenOptions={optionNavigation}>
      <ElectricalCONSStack.Screen
        name={Constant.ROUTE__HOME}
        component={ElectricalHomeScreenCONS}
        options={
          {
            title: titleShow,
          }
        }
      />
      {/* DrumNo Library */}
      <ElectricalCONSStack.Screen
        name={'DrumNoList'}
        component={DrumNoListScreen}
        options={
          {
            title: 'Drum List',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Cable Control */}
      <ElectricalCONSStack.Screen
        name={'ElectricalCableControlList'}
        component={ElectricalCableControlListScreen}
        options={
          {
            title: 'Electrical Cable Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'ElectricalCableControlDetail'}
        component={ElectricalCableControlDetailScreen}
        options={
          {
            title: 'Electrical Cable Control Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Instrument Control */}
      <ElectricalCONSStack.Screen
        name={'InstrumentCableControlList'}
        component={InstrumentCableControlListScreen}
        options={
          {
            title: 'Instrument Cable Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'InstrumentCableControlDetail'}
        component={InstrumentCableControlDetailScreen}
        options={
          {
            title: 'Instrument Cable Control Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Electrical Gland Control */}
      <ElectricalCONSStack.Screen
        name={'ElectricalGlandControlList'}
        component={ElectricalGlandControlListScreen}
        options={
          {
            title: 'Electrical Gland Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'ElectricalGlandControlDetail'}
        component={ElectricalGlandControlDetailScreen}
        options={
          {
            title: 'Electrical Gland Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Electrical Terminate Control */}
      <ElectricalCONSStack.Screen
        name={'ElectricalTerminationControlList'}
        component={ElectricalTerminationControlListScreen}
        options={
          {
            title: 'Electrical Termination Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'ElectricalTerminationControlDetail'}
        component={ElectricalTerminationControlDetailScreen}
        options={
          {
            title: 'Electrical Termination Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Instrument Gland Control */}
      <ElectricalCONSStack.Screen
        name={'InstrumentGlandControlList'}
        component={InstrumentGlandControlListScreen}
        options={
          {
            title: 'Instrument Gland Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'InstrumentGlandControlDetail'}
        component={InstrumentGlandControlDetailScreen}
        options={
          {
            title: 'Instrument Gland Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Instrument Termination Control */}
      <ElectricalCONSStack.Screen
        name={'InstrumentTerminationControlList'}
        component={InstrumentTerminationControlListScreen}
        options={
          {
            title: 'Instrument Termination Control',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'InstrumentTerminationControlDetail'}
        component={InstrumentTerminationControlDetailScreen}
        options={
          {
            title: 'Instrument Termination Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Report */}
      <ElectricalCONSStack.Screen
        name={'CableControlReport'}
        component={CableControlReportScreen}
        options={
          {
            title: 'Cable Control Report',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* Cable Damage */}
      <ElectricalCONSStack.Screen
        name={'ElectricalCableDamageLogList'}
        component={ElectricalCableDamageLogListScreen}
        options={
          {
            title: 'Cable Damage List',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'ElectricalCableDamageLogDetail'}
        component={ElectricalCableDamageLogDetailScreen}
        options={
          {
            title: 'Cable Damage Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <ElectricalCONSStack.Screen
        name={'ElectricalCableDamageLogData'}
        component={ElectricalCableDamageLogDataScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
    </ElectricalCONSStack.Navigator>
  );
};

const ElectricalQCStack = createStackNavigator();
const ElectricalQCStackScreens = () => {
  return (
    <ElectricalQCStack.Navigator screenOptions={optionNavigation}>
      <ElectricalQCStack.Screen
        name={Constant.ROUTE__HOME}
        component={ElectricalHomeScreenQC}
        options={
          {
            title: titleShow,
          }
        }
      />
    </ElectricalQCStack.Navigator>
  );
};


//-- VIEW Stacks
const ViewerStack = createStackNavigator();
const ViewerStackScreens = () => {
  return (
    <ViewerStack.Navigator screenOptions={optionNavigation}>
      <ViewerStack.Screen
        name={Constant.ROUTE__HOME}
        component={HomeViewerScreen}
        options={
          {
            title: titleShow,
          }
        }
      />

      <ViewerStack.Screen
        name={Constant.ROUTE__CAMERA}
        component={StructuralCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />

      <ViewerStack.Screen
        name='AllStatusCamera'
        component={AllStatusCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <ViewerStack.Screen
        name='DrawingSearch'
        component={DrawingSearchScreen}
        options={
          {
            title: 'Search Drawing',
            headerBackTitle: 'Back',
          }
        }
      />
      <ViewerStack.Screen
        name='DrawingAllStatus'
        component={DrawingAllStatusScreen}
        options={
          {
            title: 'Drawing Detail Status',
            headerBackTitle: 'Back',
          }
        }
      />

      <ViewerStack.Screen
        name='DrawingDetail'
        component={DrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <ViewerStack.Screen
        name='QCDrawingDetail'
        component={QCDrawingDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
      <ViewerStack.Screen
        name='DrawingImage'
        component={DrawingImageScreen}
        options={
          {
            title: 'Drawing Pictures',
            headerBackTitle: 'Back',
          }
        }
      />
    </ViewerStack.Navigator>
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
        name='QCWelderCardAvatar'
        component={QCWelderCardAvatarSceen}
        options={
          {
            title: 'Welder Avatar',
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
      <CommonStack.Screen
        name='Image'
        component={ImageScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackTitle: 'Back',
        })}
      />
    </CommonStack.Navigator>
  );
};

//-- Common Stacks
const EquipmentStack = createStackNavigator();
const EquipmentStackScreens = () => {
  return (
    <EquipmentStack.Navigator screenOptions={optionNavigation}>
      <EquipmentStack.Screen
        name='WorkRequestList'
        component={WorkRequestListScreen}
        options={
          {
            title: 'Work Request List',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='MajorEquipmentGroupCode'
        component={MajorEquipmentGroupCodeScreen}
        options={
          {
            title: 'Major Equipment Group Code',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='MajorEquipmentEquipmentCode'
        component={MajorEquipmentEquipmentCodeScreen}
        options={
          {
            title: 'Major Equipment Code',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentTimesheetDailyList'
        component={EquipmentTimesheetDailyListScreen}
        options={
          {
            title: 'Major Equipment Timesheet',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='CreateEquipmentTimesheetDaily'
        component={CreateEquipmentTimesheetDailyScreen}
        options={
          {
            title: 'Major Equipment Timesheet',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='MajorEquipmentUserList'
        component={MajorEquipmentUserListScreen}
        options={
          {
            title: 'Operator List',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentCamera'
        component={EquipmentCameraScreen}
        options={
          {
            title: 'QRCode Equipment',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='DailyTaskPlan'
        component={DailyTaskPlanListScreen}
        options={
          {
            title: 'Daily Task Plan',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentTimesheetApproveList'
        component={EquipmentTimesheetApproveListScreen}
        options={
          {
            title: 'Timesheet Approve List',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentDataControlList'
        component={EquipmentDataControlListScreen}
        options={
          {
            title: 'Equipment Status',
            headerBackTitle: 'Back',
          }
        }
      />
      {/* <EquipmentStack.Screen
        name='EquipmentList'
        component={EquipmentListScreen}
        options={
          {
            title: 'Equipment List',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentNameList'
        component={EquipmentNameListScreen}
        options={
          {
            title: 'Equipment List',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentCamera'
        component={EquipmentCameraScreen}
        options={
          {
            title: 'QRCode Scanner',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentDetail'
        component={EquipmentDetailScreen}
        options={
          {
            title: 'Equipment Detail',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentTimesheet'
        component={EquipmentTimesheetScreen}
        options={
          {
            title: 'Equipment TimeSheet',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentLiftingPlanList'
        component={EquipmentLiftingPlanListScreen}
        options={
          {
            title: 'Lifting Plan',
            headerBackTitle: 'Back',
          }
        }
      />
      <EquipmentStack.Screen
        name='EquipmentLiftingPlanDetail'
        component={EquipmentLiftingPlanDetailScreen}
        options={
          {
            title: 'Lifting Plan Detail',
            headerBackTitle: 'Back',
          }
        }
      /> */}
    </EquipmentStack.Navigator>
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
          name={Constant.ROUTE__STR_CONS}
          component={StructuralCONSStackScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Constant.ROUTE__STR_QC}
          component={StructuralQCStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__EIT_CONS}
          component={ElectricalCONSStackScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Constant.ROUTE__EIT_QC}
          component={ElectricalQCStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__VIEW_DRAWING}
          component={ViewerStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__COMMON}
          component={CommonStackScreens}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Constant.ROUTE__EQUIPMENT}
          component={EquipmentStackScreens}
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