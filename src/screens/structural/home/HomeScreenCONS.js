import React, { useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Naming from '../../../utils/Naming';
import Header from '../../../components/Header';

const HomeScreenCONS = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;

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
  const _onPressMamagePieceMarkCut = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Piece Mark Cut\n\nSearch: Search Piece Mark Cut',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodePieceMark(Constant.CODE_CUT) } },
        { text: 'Search', onPress: () => { _onPressSearchPieceMark(Constant.CODE_CUT) } },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressMamagePieceMarkPaint = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Piece Mark Paint\n\nSearch: Search Piece Mark Paint',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodePieceMark(Constant.CODE_PAINT) } },
        { text: 'Search', onPress: () => { _onPressSearchPieceMark(Constant.CODE_PAINT) } },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
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

  // LAM Check Request
  const _onPressMamageLamCheckSpending = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Lam Check Request\n\nSearch: Search Lam Check Request',
      [
        { text: 'Scan', onPress: _onPressQRCodeLamCheckSpending },
        { text: 'Search', onPress: _onPressSearchLamCheckSpending },
        { text: 'Cancel', style: 'cancel' }
      ],
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

  // FitUp & Weld
  const _onPressMamageFitUp = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Construction FitUp\n\nSearch: Search Construction FitUp',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodeConstruction(Constant.CODE_FITUP) } },
        { text: 'Search', onPress: _onPressSearchConstruction },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressMamageWeld = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Construction Weld\n\nSearch: Search Construction Weld',
      [
        { text: 'Scan', onPress: () => { _onPressQRCodeConstruction(Constant.CODE_WELD) } },
        { text: 'Search', onPress: _onPressSearchConstruction },
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
        userLogin: userLogin,
        code: code,
        destination: Naming.NAME_STR_CONSTRUCTION
      }
    );
  };
  const _onPressSearchConstruction = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'ConstructionList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  // ManHours Impact
  const _onPressManHoursImpact = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'ManHoursImpact',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  // TimeSheet
  const _onPressTimeSheet = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'TimeSheet',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  // ACTION
  const _onPressViewReports = () => {
    // navigation.navigate('Report', {
    //   screen: 'ReportManager',
    //   params: { projectCode: projectCode },
    // });
  };
  const _onPressConstructionUpdate = () => {
    // navigation.navigate('ConstructionUpdateManage', { projectCode: projectCode });
  };
  const _onPressQCUpdate = () => {
    // navigation.navigate('QCDrawingList', { projectCode: projectCode });
  };
  const _onPressNDTUpdate = () => {
    // navigation.navigate('NDT', {
    //   screen: 'NDTManager',
    //   params: { projectCode: projectCode },
    // });
  };





  const RenderItemBox = props => {
    return (
      <View style={styles.cell}>
        {
          !props.disable &&
          <>
            <TouchableOpacity style={styles.itemContainer} onPress={props.onPress} activeOpacity={1}>
              <Text numberOfLines={2} style={styles.itemTitle}>{props.title}</Text>
              <Ionicons name='qr-code-outline' size={Dimensions.get('window').height > 700 ? 48 : 36} color={BASE_COLOR} style={styles.itemIcon} />
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
      <View style={styles.container}>
        <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
        <ScrollView style={styles.table}>
          <View style={styles.row}>
            <RenderItemBox title={'QC Check\nStatus'} />
            <RenderItemBox title={'Piece Mark\nCut'} onPress={_onPressMamagePieceMarkCut} />
          </View>
          <View style={styles.row}>
            <RenderItemBox title={'Piece Mark\nPaint'} onPress={_onPressMamagePieceMarkPaint} />
            <RenderItemBox title={'Lam Check\nRequest'} onPress={_onPressMamageLamCheckSpending} />
          </View>
          <View style={styles.row}>
            <RenderItemBox title={'Construciton\nFitUp'} onPress={_onPressMamageFitUp} />
            <RenderItemBox title={'Construciton\nWeld'} onPress={_onPressMamageWeld} />
          </View>
          <View style={styles.row}>
            <RenderItemBox title={'TimeSheet\n'} onPress={_onPressTimeSheet} />
            <RenderItemBox title={'Man-hours\nImpact'} onPress={_onPressManHoursImpact} />
          </View>
          <View style={styles.row}>
            <RenderItemBox title={'Manpower\n'} />
            <RenderItemBox disable={true} />
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
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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

export default HomeScreenCONS;