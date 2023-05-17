import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import { GetSTRNotifyNumberAPI } from '../../../apis/app/AppAPI';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Naming from '../../../utils/Naming';
import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const HomeScreenCONS = ({ route, navigation }) => {

  const { projectCode, subContractor, disciplineCode } = route.params;
  const [spendNumbers, setSpendNumbers] = useState({ FitUp: 0, Visual: 0, LamCheck: 0, DimCheck: 0, DimAfterWeld: 0 });

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
      callAPI(getNotifyNumber);
    }, [isFocused]
  );

  const callAPI = executedAPI => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };
  const getNotifyNumber = async () => {
    GetSTRNotifyNumberAPI(projectCode)
      .then(res => {
        if (res.success) {
          setSpendNumbers(res.data);
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

  // PieceMark
  const _onPressManagePieceMarkCut = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Piece Mark Cut\n\nSearch: Search Piece Mark Cut\n\nQC Status: QC Status Dim For Cutting Request',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodePieceMark(Constant.CODE_CUT) } },
        { text: 'Search', onPress: () => { _onPressSearchPieceMark(Constant.CODE_CUT) } },
        { text: 'QC Status', onPress: _onPressQCStatusDimForCutting },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  // const _onPressManagePieceMarkPaint = async () => {
  //   Alert.alert(
  //     '',
  //     'Scan: Scan QRCode Piece Mark Paint\n\nSearch: Search Piece Mark Paint',
  //     [
  //       { text: 'Scan', onPress: () => { _onPressQRCodePieceMark(Constant.CODE_PAINT) } },
  //       { text: 'Search', onPress: () => { _onPressSearchPieceMark(Constant.CODE_PAINT) } },
  //       { text: 'Cancel', style: 'cancel' }
  //     ],
  //   );
  // };
  const _onPressQRCodePieceMark = async code => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
        destination: Naming.NAME_STR_PIECE_MARK
      }
    );
  };
  const _onPressSearchPieceMark = async code => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'Piece Mark ' + code;
    navigation.navigate(
      'PieceMarkList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
        title: title,
      }
    );
  };
  const _onPressQCStatusDimForCutting = async () => {
    navigation.navigate(
      'DimForCutting',
      {
        projectCode: projectCode,
      }
    );
  };

  // LAM Check Request
  const _onPressManageLamCheckSpending = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Lam Check Request\n\nSearch: Search Lam Check Request\n\nQC Status: QC Status Lam Check Request',
      [
        { text: 'Scan', onPress: _onPressQRCodeLamCheckSpending },
        { text: 'Search', onPress: _onPressSearchLamCheckSpending },
        { text: 'QC Status', onPress: _onPressQCStatusLamCheckSpending },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressQRCodeLamCheckSpending = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        destination: Naming.NAME_STR_LAM_CHECK_REQUEST
      }
    );
  };
  const _onPressSearchLamCheckSpending = async () => {
    navigation.navigate(
      'LamCheckSpendingList',
      {
        projectCode: projectCode,
      }
    );
  };
  const _onPressQCStatusLamCheckSpending = async () => {
    navigation.navigate(
      'LamCheckQCStatus',
      {
        projectCode: projectCode,
      }
    );
  };

  // FitUp & Weld
  const _onPressManageFitUp = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Construction FitUp\n\nSearch: Search Construction FitUp\n\nQC Status: QC Status Construction FitUp',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodeConstruction(Constant.CODE_FITUP) } },
        { text: 'Search', onPress: () => { _onPressSearchConstruction(Constant.CODE_FITUP) } },
        { text: 'QC Status', onPress: () => { _onPressSpendingConstruction(Constant.CODE_FITUP) } },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressManageWeld = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Construction Weld\n\nSearch: Search Construction Weld\n\nQC Status: QC Status Construction Weld',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodeConstruction(Constant.CODE_WELD) } },
        { text: 'Search', onPress: () => { _onPressSearchConstruction(Constant.CODE_WELD) } },
        { text: 'QC Status', onPress: () => { _onPressSpendingConstruction(Constant.CODE_VISUAL) } },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeConstruction = async code => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
        code: code,
        destination: Naming.NAME_STR_CONSTRUCTION
      }
    );
  };
  const _onPressSearchConstruction = async code => {
    let userLogin = await Helper.getData('USERNAME');
    let title = 'Construction ' + code;
    navigation.navigate(
      'ConstructionList',
      {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
        code: code,
        title: title,
      }
    );
  };
  const _onPressSpendingConstruction = async code => {
    const userLogin = await Helper.getData('USERNAME');
    let title = 'QC Status ' + code;
    navigation.navigate(
      'ConstructionQCStatus',
      {
        projectCode: projectCode,
        subContractor: subContractor,
        userLogin: userLogin,
        code: code,
        title: title,
      }
    );
  };

  //-- DIM After Weld
  const _onPressManageDIMAfterWeld = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode DIM After Weld\n\nSearch: Search DIM After Weld\n\nQC Status: QC Status DIM After Weld Request',
      [
        { text: 'Scan', onPress: _onPressQRCodeDIMAfterWeld },
        { text: 'Search', onPress: _onPressSearchDIMAfterWeld },
        { text: 'QC Status', onPress: _onPressQCStatusDIMAfterWeld },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressQRCodeDIMAfterWeld = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        destination: Naming.NAME_STR_DIM_AFTER_WELD
      }
    );
  };
  const _onPressSearchDIMAfterWeld = async () => {
    navigation.navigate(
      'DIMAfterWeldList',
      {
        projectCode: projectCode,
        isShowDetail: false,
        isPending: false,
      }
    );
  };
  const _onPressQCStatusDIMAfterWeld = async () => {
    navigation.navigate(
      'DIMAfterWeldList',
      {
        projectCode: projectCode,
        isShowDetail: true,
        isPending: false,
        isReadOnly: true,
      }
    );
  };

  // ManHours Impact
  const _onPressManHoursImpact = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'ManHoursImpact',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
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
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheet',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };
  const _onPressTimeSheetYesterday = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'TimeSheetOT',
      params: {
        projectCode: projectCode,
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
        userLogin: userLogin,
      }
    });
  };

  //-- Open Structural Drawing
  const _onPressOpenStructuralDrawing = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Structure Drawing\n\nSearch: Search Structure Drawing',
      [
        { text: 'Scan', onPress: _onPressQRCodeStructuralDrawing },
        { text: 'Search', onPress: _onPressSearchStructuralDrawing },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressQRCodeStructuralDrawing = async () => {
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        destination: Naming.NAME_STR_OPEN_DRAWING
      }
    );
  };
  const _onPressSearchStructuralDrawing = async () => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'OpenStructuralDrawing',
      params: {
        projectCode: projectCode,
        title: 'Structure'
      }
    });
  };

  //-- Equipment
  const _onPressManageEquipment = async () => {
    Alert.alert(
      '',
      'Scan: Scan QR Code\n\nSearch: Search Equipment List',
      [
        { text: 'Scan', onPress: _onPressQRCodeEquipment },
        { text: 'Search', onPress: _onPresSearchEquipment },
        // { text: 'Lifting Plan', onPress: _onPresLiftingPlan },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
    return

  };
  const _onPressQRCodeEquipment = async () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentCamera',
    });
  };
  const _onPresSearchEquipment = async () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentList',
    });
  };
  const _onPresLiftingPlan = async () => {
    navigation.navigate(Constant.ROUTE__EQUIPMENT, {
      screen: 'EquipmentNameList',
    });
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
              <Ionicons name={iconName} size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
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
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNotifyNumber)} />
        :
        <View style={styles.container}>
          <Header data={{ 'Project': projectCode + '  -  ' + subContractor, 'Module': disciplineCode }}></Header>
          <ScrollView style={styles.table}>
            {
              (spendNumbers.LamCheck || spendNumbers.DimCheck)
                ?
                <View style={styles.line} />
                :
                null
            }
            <View style={styles.row}>
              <RenderItemBox title={'QC Check\nStatus'} />
              <RenderItemBox title={'Piece Mark\nCut'} onPress={_onPressManagePieceMarkCut} number={spendNumbers.DimForCutting} />
            </View>
            <View style={styles.row}>
              {/* <RenderItemBox title={'Piece Mark\nPaint'} onPress={_onPressManagePieceMarkPaint} /> */}
              <RenderItemBox title={'Lam Check\nRequest'} onPress={_onPressManageLamCheckSpending} number={spendNumbers.LamCheck} />
              <RenderItemBox title={'Construction\nFitUp'} onPress={_onPressManageFitUp} number={spendNumbers.FitUp} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Construction\nWeld'} onPress={_onPressManageWeld} number={spendNumbers.Visual} />
              <RenderItemBox title={'DIM\nAfter Weld'} onPress={_onPressManageDIMAfterWeld} number={spendNumbers.DimAfterWeld} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'TimeSheet\n'} onPress={_onPressManageTimeSheet} />
              <RenderItemBox title={'Man-hours\nImpact'} onPress={_onPressManHoursImpact} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Structure\nDrawing'} onPress={_onPressOpenStructuralDrawing} iconName={'md-document-text'} />
              <RenderItemBox title={'Equipment Control'} onPress={_onPressManageEquipment} />
            </View>
          </ScrollView>
        </View>
      }
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
});

export default HomeScreenCONS;