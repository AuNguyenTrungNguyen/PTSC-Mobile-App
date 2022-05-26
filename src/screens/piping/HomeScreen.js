import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';
import Header from '../../components/Header';
import { GetSpendNumbersAPI } from '../../apis/piping/QCAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const HomeScreen = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;
  const [spendNumbers, setSpendNumbers] = useState({ FitUp: 0, Visual: 0, DimCutting: 0 });

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
      callAPI(getSpendNumbers);
    }, [isFocused]
  );
  const callAPI = executedAPI => {
    if (isFocused) {
      setIsLoading(true);
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          setIsLoading(false);
          setIsError(true);
          MessageAlert('WARNING', 'Network not available!');
        } else {
          executedAPI();
        }
      });
    }
  };
  const getSpendNumbers = async () => {
    let token = await Helper.getData('TOKEN');
    GetSpendNumbersAPI(projectCode, token)
      .then(res => {
        if (res.Success && res.Data) {
          setSpendNumbers(res.Data);
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
        userLogin: userLogin,
      }
    );
  };

  //-- QC Dim Cutting
  const _onPressDimCuttingQCList = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'DimCuttingQCList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  //-- CONS FitUp
  const _onPressQRCodeFitUp = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: Constant.CODE_FITUP,
        source: Constant.CAMERA_PIP_CONS,
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  //-- CONS Weld
  const _onPressQRCodeWeld = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: Constant.CODE_WELD,
        source: Constant.CAMERA_PIP_CONS,
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  //-- QC FitUp
  const _onPressMamageQCFitUp = () => {
    Alert.alert(
      '',
      'Scan: Scan QR Code FitUp Drawing\n\nSpend List: Spend FitUp Request List',
      [
        { text: 'Scan', onPress: _onPressQRCodeFitUpQC },
        { text: 'Spend List', onPress: _onPressQCSpendFitUpList },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeFitUpQC = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: Constant.CODE_FITUP,
        source: Constant.CAMERA_PIP_QC,
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };
  const _onPressQCSpendFitUpList = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'QCSpendList',
      {
        code: Constant.CODE_FITUP,
        projectCode: projectCode,
        userLogin: userLogin,
        title: 'QC Spend FitUp'
      }
    );
  };

  //-- QC Visual
  const _onPressMamageQCVisual = () => {
    Alert.alert(
      '',
      'Scan: Scan QR Code Visual Drawing\n\nSpend List: Spend Visual Request List',
      [
        { text: 'Scan', onPress: _onPressQRCodeVisualQC },
        { text: 'Spend List', onPress: _onPressQCSpendVisualList },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeVisualQC = async () => {
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: Constant.CODE_VISUAL,
        source: Constant.CAMERA_PIP_QC,
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };
  const _onPressQCSpendVisualList = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'QCSpendList',
      {
        code: Constant.CODE_VISUAL,
        projectCode: projectCode,
        userLogin: userLogin,
        title: 'QC Spend Visual'
      }
    );
  };

  //-- All status
  const _onPressQRCodeAllStatus = () => {
    navigation.navigate(
      'AllStatusCamera',
      {
        projectCode: projectCode,
      }
    );
  };
  const _onPressSearchAllStatus = () => {
    navigation.navigate(
      'DrawingSearch',
      {
        projectCode: projectCode,
      }
    );
  };

  //-- TimeSheet
  const _onPressManageLTimeSheet = async () => {
    Alert.alert(
      '',
      'TimeSheet: Company TimeSheet\n\nTimeSheet OT: Company TimeSheet Overtime',
      [
        { text: 'TimeSheet', onPress: _onPressTimeSheet },
        { text: 'TimeSheet OT', onPress: _onPressTimeSheetYesterday },
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
        userLogin: userLogin,
      }
    });
  };

  //-- Buttom Action
  const _onPressConstructionUpdate = () => {
    navigation.navigate('ConstructionUpdateManage', { projectCode: projectCode });
  };
  const _onPressQCUpdate = () => {
    navigation.navigate('QCDrawingList', { projectCode: projectCode });
  };
  const _onPressNDTUpdate = () => {
    navigation.navigate('NDT', {
      screen: 'NDTManager',
      params: { projectCode: projectCode },
    });
  };
  const _onPressViewReports = () => {
    navigation.navigate('Report', {
      screen: 'ReportManager',
      params: { projectCode: projectCode },
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getSpendNumbers)} />
        :
        <View style={styles.container}>
          <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
          <ScrollView style={styles.table}>
            {
              (spendNumbers.DimCutting)
                ?
                <View style={styles.line} />
                :
                null
            }
            <View style={styles.row}>
              <RenderItemBox title={'Cons\nDim Cutting'} onPress={_onPressManageDimCutting} />
              <RenderItemBox title={'QC\nDim Cutting'} onPress={_onPressDimCuttingQCList} number={spendNumbers.DimCutting} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Cons Scan\nFitUp'} onPress={_onPressQRCodeFitUp} />
              <RenderItemBox title={'Cons Scan\nWeld'} onPress={_onPressQRCodeWeld} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC Scan\nFitUp'} onPress={_onPressMamageQCFitUp} number={spendNumbers.FitUp} />
              <RenderItemBox title={'QC Scan\nVisual'} onPress={_onPressMamageQCVisual} number={spendNumbers.Visual} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Scan \nAll Status'} onPress={_onPressQRCodeAllStatus} />
              <RenderItemBox title={'Search\nAll Status'} onPress={_onPressSearchAllStatus} iconName={'md-search'} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'TimeSheet\n'} onPress={_onPressManageLTimeSheet} />
              <RenderItemBox title={'Man-hours\nImpact'} onPress={_onPressManHoursImpact} />
            </View>
          </ScrollView>
          <View style={styles.action}>
            <TouchableOpacity style={styles.buttonContainer} onPress={_onPressViewReports}>
              <Text style={styles.buttonTitle}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainerPadding} onPress={_onPressConstructionUpdate}>
              <Text style={styles.buttonTitle}>Construction Update</Text>
            </TouchableOpacity>
            <View style={styles.containerMultiButtons}>
              <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQCUpdate}>
                <Text style={styles.buttonTitle}>QC Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonRight} onPress={_onPressNDTUpdate}>
                <Text style={styles.buttonTitle}>NDT Update</Text>
              </TouchableOpacity>
            </View>
          </View>
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

export default HomeScreen;