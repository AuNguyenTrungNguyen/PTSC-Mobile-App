import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Networker from '../../utils/Networker';
import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';

import { GetPIPNotifyNumberAPI } from '../../apis/app/AppAPI';
import { GetEquipmentNotifyNumberAPI } from '../../apis/equipment/EquipmentAPI';

import LoadingRefresh from '../../components/LoadingRefresh';
import Header from '../../components/Header';
import SelectActions from '../../components/SelectActions';

const HomeCONSScreen = ({ route, navigation }) => {

  const { projectCode, subContractor, disciplineCode } = route.params;
  const [notifyNumbers, setNotifyNumbers] = useState({ FitUp: 0, Visual: 0, DimCutting: 0 });
  const [notifyEquipmentNumbers, setNotifyEquipmentNumbers] = useState({ Pending: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const isFocused = useIsFocused();

  let colorIcon = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={_onPressLogout} style={{ paddingRight: 16 }}>
          <Ionicons name='log-out-outline' size={24} color={colorIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(
    () => {
      callAPI(getNotifyNumbers);
      callAPI(getEquipmentNotifyNumbers);
    }, [isFocused]
  );
  const callAPI = executedAPI => {
    if (isFocused) {
      setIsLoading(true);
      Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
    }
  };
  const getNotifyNumbers = async () => {
    const token = await Helper.getData('TOKEN');
    GetPIPNotifyNumberAPI(projectCode, token)
      .then(res => {
        if (res.Success && res.Data) {
          setNotifyNumbers(res.Data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };
  const getEquipmentNotifyNumbers = async () => {
    const userLogin = await Helper.getData('USERNAME');
    GetEquipmentNotifyNumberAPI(userLogin)
      .then(res => {
        if (res.Success && res.Data) {
          setNotifyEquipmentNumbers(res.Data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  //-- Logout
  const _onPressLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ],
      { cancelable: false }
    );
  };
  const logout = () => {
    Helper.clearData();
    navigation.replace(Constant.ROUTE__LOGIN);
  };

  //-- CONS Dim Cutting
  const _onPressManageDimCutting = () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Dim Cuttting\n\nSearch: Search Dim Cutting List',
      [
        { text: 'Scan', onPress: _onPressQRCodeDimCutting },
        { text: 'Search', onPress: _onPressSearchDimCutting },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeDimCutting = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        source: Constant.CAMERA_PIP_CONS_DIM,
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    );
  };
  const _onPressSearchDimCutting = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'DimCuttingList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    );
  };

  //-- CONS MANAGERMENT
  // const [isVisibleConsFitUp, setIsVisibleConsFitUp] = useState(false);
  // const [isVisibleConsWeld, setIsVisibleConsWeld] = useState(false);
  const _onPressManageCons = code => {
    Alert.alert(
      '',
      'Scan: Scan QR Code\n\nSearch: Search Request List\n\nQC Status: View Request List QC',
      [
        { text: 'Scan', onPress: () => _onPressQRCodeCons(code) },
        { text: 'Search', onPress: _onPresSearchCons },
        { text: 'QC Status', onPress: () => { _onPressQCStatusCons(code) } },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeCons = async code => {
    const teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: code,
        source: Constant.CAMERA_PIP_CONS,
        projectCode: projectCode,
        subContractor: subContractor,
        teamLeader: teamLeader,
      }
    );
  };
  const _onPresSearchCons = async () => {
    navigation.navigate('DrawingList', {
      projectCode: projectCode,
      subContractor: subContractor,
    });
  };
  const _onPressQCStatusCons = async code => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'QC Status ' + code;
    navigation.navigate('QCStatus', {
      projectCode: projectCode,
      subContractor: subContractor,
      userLogin: userLogin,
      code: code,
      title: title,
    });
  };

  //-- All Status
  const _onPressViewAllStatus = () => {
    Alert.alert(
      '',
      'Scan: Scan QR Code\n\nSearch: Search List',
      [
        { text: 'Scan', onPress: _onPressQRCodeAllStatus },
        { text: 'Search', onPress: _onPressSearchAllStatus },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeAllStatus = () => {
    navigation.navigate(
      'AllStatusCamera',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };
  const _onPressSearchAllStatus = () => {
    navigation.navigate(
      'DrawingSearch',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- TimeSheet
  const _onPressManageTimeSheet = async () => {
    Alert.alert(
      '',
      'TimeSheet: Company TimeSheet\n\nTimeSheet OT: Company TimeSheet Overtime\n\nTimeSheet Report: TimeSheet Report Overtime',
      [
        { text: 'TimeSheet', onPress: _onPressTimeSheet },
        { text: 'TimeSheet OT', onPress: _onPressTimeSheetYesterday },
        { text: 'TimeSheet Report', onPress: _onPressTimeSheetReport },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressTimeSheet = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheet',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    });
  };
  const _onPressTimeSheetYesterday = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheetOT',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    });
  };
  const _onPressTimeSheetReport = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheetReport',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    });
  };

  //-- Man-hour Impact
  const _onPressManHoursImpact = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'ManHoursImpact',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
      }
    });
  };

  //-- Daily Report
  const _onPressDailyReport = async () => {
    navigation.navigate(
      'DailyReport',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- Open Pipe Support Drawing
  const _onPressOpenPipeSupportDrawing = async () => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'OpenPipeSupportDrawing',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        title: 'Pipe Support'
      }
    });
  };

  //-- Open Isometric Drawing
  const _onPressOpenIsometricDrawing = async () => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'OpenIsometricDrawing',
      params: {
        projectCode: projectCode,
        subContractor: subContractor,
        title: 'Isometric'
      }
    });
  };

  //-- Pipe Support
  const _onPressPipeSupport = async () => {
    navigation.navigate(
      'PipeSupportList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- Pipe Spool
  const _onPressPipeSpool = async () => {
    navigation.navigate(
      'PipeSpoolList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- Equipment
  const _onPressManageEquipment = async () => {
    Alert.alert(
      '',
      'Daily Task: Create Timesheet Daily Task\n\nApprove Timesheet: Approve Timesheet Daily Task\n\nEquipment Status: Check Equipment Cert and Inspection',
      [
        { text: 'Daily Task', onPress: _onPressEquipmentDaily },
        { text: 'Approve Timesheet', onPress: _onPressEquipmentApprove },
        { text: 'Equipment Status', onPress: _onPressEquipmentStatus },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressEquipmentDaily = () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentCamera',
      params: {
        source: '',
      }
    });
  };
  const _onPressEquipmentApprove = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentTimesheetApproveList',
      params: {
        userLogin: userLogin,
      }
    });
  };
  const _onPressEquipmentStatus = () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentCamera',
      params: {
        source: Constant.CAMERA_EQUIPMENT_STATUS,
      }
    });
  };

  //-- CONS GRE MANAGERMENT
  const _onPressManageConsGRE = code => {
    Alert.alert(
      '',
      'Scan: Scan QR Code Fitting\n\nScan: Scan QR Code Curing\n\nSearch: Search GRE Drawing List',
      [
        { text: 'Scan Fitting', onPress: () => _onPressQRCodeConsGRE(Constant.CODE_FITUP) },
        { text: 'Scan Curing', onPress: () => _onPressQRCodeConsGRE(Constant.CODE_VISUAL) },
        { text: 'Search', onPress: _onPresSearchConsGRE },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeConsGRE = async code => {
    // const teamLeader = await Helper.getData('USERNAME');
    // navigation.navigate(
    //   'Camera',
    //   {
    //     code: code,
    //     source: Constant.CAMERA_PIP_CONS,
    //     projectCode: projectCode,
    //     subContractor: subContractor,
    //     teamLeader: teamLeader,
    //   }
    // );
  };
  const _onPresSearchConsGRE = async () => {
    navigation.navigate('GREDrawingList', {
      projectCode: projectCode,
      subContractor: subContractor
    });
  };

  //-- Hydrotest Package
  const _onPressHydrotestPackage = async () => {
    navigation.navigate(
      'HydrotestPackageList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- Valve Progress 
  const _onPressValveProgress = async () => {
    navigation.navigate(
      'ValveProgressList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };

  //-- Flange Joint Progress 
  const _onPressFlangeJointProgress = async () => {
    navigation.navigate(
      'FlangeJointProgressList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
      }
    );
  };



  const RenderItemBox = props => {
    let iconName = 'qr-code-outline';
    if (props.iconName) {
      iconName = props.iconName;
    }
    return (
      <View style={styles.cell}>
        {
          !props.disable &&
          <>
            <TouchableOpacity style={styles.itemContainer} onPress={props.onPress} activeOpacity={1}>
              <Text numberOfLines={2} style={styles.itemTitle}>{props.title}</Text>
              {
                props.iconType === 'Material'
                  ?
                  <MaterialIcons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                  :
                  (
                    props.iconType === 'MaterialCommunity'
                      ?
                      <MaterialCommunityIcons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                      :
                      <Ionicons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
                  )
              }
            </TouchableOpacity>
            {
              props.number
                ?
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{props.number < 100 ? props.number : '99+'}</Text>
                </View>
                :
                null
            }
          </>
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNotifyNumbers)} />
          :
          <View style={styles.container}>
            {/* <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header> */}
            <Header data={{ 'Project': projectCode + '  -  ' + subContractor, 'Module': disciplineCode }}></Header>
            <ScrollView style={styles.table}>
              {
                (
                  notifyNumbers.FitUp)
                  ?
                  <View style={styles.line} />
                  :
                  null
              }
              <View style={styles.row}>
                <RenderItemBox title={'Cons\nDim Cutting'} onPress={_onPressManageDimCutting} />
                <RenderItemBox title={'Cons FitUp'} onPress={() => { _onPressManageCons(Constant.CODE_FITUP) }} number={notifyNumbers.FitUp} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Cons Weld'} onPress={() => { _onPressManageCons(Constant.CODE_WELD) }} number={notifyNumbers.Visual} />
                <RenderItemBox title={'View \nAll Status'} onPress={_onPressViewAllStatus} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'TimeSheet\n'} onPress={_onPressManageTimeSheet} />
                <RenderItemBox title={'Man-hours\nImpact'} onPress={_onPressManHoursImpact} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Daily Report'} onPress={_onPressDailyReport} iconName={'ios-stats-chart-sharp'} />
                <RenderItemBox title={'Pipe Support\nDrawing'} onPress={_onPressOpenPipeSupportDrawing} iconName={'md-document-text'} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Isometric'} onPress={_onPressOpenIsometricDrawing} iconName={'md-document-text'} />
                <RenderItemBox title={'Pipe Support\nControl'} onPress={_onPressPipeSupport} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Pipe Spool\nControl'} onPress={_onPressPipeSpool} />
                <RenderItemBox title={'Equipment Control'} onPress={_onPressManageEquipment} iconName={'construct-outline'} number={notifyEquipmentNumbers.Pending} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Cons Manage\nGRE'} onPress={_onPressManageConsGRE} />
                <RenderItemBox title={'Hydrotest\nPackage'} onPress={_onPressHydrotestPackage} iconName={'ios-cube-sharp'} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'Valve\nProgress'} onPress={_onPressValveProgress} iconName='pipe-valve' iconType='MaterialCommunity' />
                <RenderItemBox title={'Flange Joint\nProgress'} onPress={_onPressFlangeJointProgress} iconName='circle-double' iconType='MaterialCommunity' />
              </View>
            </ScrollView>
          </View>
      }
      {/* <SelectActions
        title={'CONS FitUp'}
        data={[
          {
            icon: 'qr-code-outline',
            text: 'Scan QRCode',
            callback: () => { _onPressQRCodeCons(Constant.CODE_FITUP) }
          },
          {
            icon: 'md-search',
            text: 'Search List',
            callback: () => { _onPresSearchCons() }
          },
          {
            icon: 'ios-time-outline',
            text: 'QC Status List',
            callback: () => { _onPressQCStatusCons(Constant.CODE_FITUP) }
          },
        ]}
        visible={isVisibleConsFitUp}
        onCancel={() => { setIsVisibleConsFitUp(false) }}
      />
      <SelectActions
        title={'CONS Weld'}
        data={[
          {
            icon: 'qr-code-outline',
            text: 'Scan QRCode',
            callback: () => { _onPressQRCodeCons(Constant.CODE_WELD) }
          },
          {
            icon: 'md-search',
            text: 'Search List',
            callback: () => { _onPresSearchCons() }
          },
          {
            icon: 'ios-time-outline',
            text: 'QC Status List',
            callback: () => { _onPressQCStatusCons(Constant.CODE_WELD) }
          },
        ]}
        visible={isVisibleConsWeld}
        onCancel={() => { setIsVisibleConsWeld(false) }}
      /> */}
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 12,
    padding: 4,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 4,
  },
  headerTitle: {
    flex: 3,
  },
  headerDataContainer: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
  },
  headerData: {
    color: BASE_COLOR,
    fontWeight: 'bold',
  },

  table: {
    flexGrow: 1,
  },
  line: {
    height: 18,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    width: '90%',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: Dimensions.get('window').height > 700 ? 8 : 4,
  },
  itemTitle: {
    textAlign: 'center',
    color: BASE_COLOR,
    fontSize: Dimensions.get('window').height > 700 ? 16 : 14,
    marginVertical: Dimensions.get('window').height > 700 ? 16 : 12,
    minHeight: 40,
  },
  itemIcon: {
    color: BASE_COLOR,
    marginBottom: Dimensions.get('window').height > 700 ? 8 : 4,
    height: Dimensions.get('window').height > 700 ? 48 : 36,
    width: Dimensions.get('window').height > 700 ? 48 : 36,
  },
  badgeContainer: {
    width: 36,
    height: 36,
    padding: 2,
    borderRadius: 36 / 2,
    backgroundColor: '#FF8C00',
    position: 'absolute',
    top: -36 / 2,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: OPP_COLOR,
    fontWeight: 'bold'
  },
  action: {
    marginTop: 12,
  },
  buttonContainer: {
    height: Dimensions.get('window').height > 700 ? 40 : 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonContainerPadding: {
    height: Dimensions.get('window').height > 700 ? 40 : 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginTop: 12,
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: Dimensions.get('window').height > 700 ? 16 : 14,
  },
  containerMultiButtons: {
    height: Dimensions.get('window').height > 700 ? 40 : 36,
    marginTop: 12,
    flexDirection: 'row',
  },
  buttonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginRight: 4,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
  },
});

export default HomeCONSScreen;