import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import Header from '../../components/Header';
import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';
import { GetNotifyNumberAPI } from '../../apis/app/AppAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const HomeScreen = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;
  const [spendNumbers, setSpendNumbers] = useState({ QCFitUp: 0, QCWeld: 0, LamCheckTodo: 0 });

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

  const getNotifyNumber = async () => {
    let token = await Helper.getData('TOKEN');
    GetNotifyNumberAPI(projectCode, token)
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
    navigation.replace('Login');
  };

  // PIECE MARK
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
      'Camera',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
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

  // LAM CHECK SPENDING
  const _onPressMamageLamCheckSpending = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Lam Check Spending\n\nSearch: Search Lam Check Spending',
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
      'Camera',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
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

  // LAM CHECK TODO
  const _onPressMamageLamCheckTodo = async () => {
    Alert.alert(
      '',
      'Scan: Scan QRCode Lam Check Todo\n\nSearch: Search Lam Check Todo',
      [
        { text: 'Scan', onPress: _onPressQRCodeLamCheckTodo },
        { text: 'Search', onPress: _onPressSearchLamCheckTodo },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeLamCheckTodo = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
      }
    );
  };
  const _onPressSearchLamCheckTodo = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'LamCheckTodoList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  //FIT && WELD
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
      'Camera',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
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

  //QC
  // const _onPressQRCodeFitUpQC = async () => {
  //   // let teamLeader = await Helper.getData('USERNAME');
  //   // navigation.navigate(
  //   //   'Camera',
  //   //   {
  //   //     code: 'FitUp',
  //   //     source: 'QCDrawing',
  //   //     projectCode: projectCode,
  //   //     teamLeader: teamLeader,
  //   //   }
  //   // );
  // };

  // const _onPressQRCodeVisualQC = async () => {
  //   // let teamLeader = await Helper.getData('USERNAME');
  //   // navigation.navigate(
  //   //   'Camera',
  //   //   {
  //   //     code: 'Visual',
  //   //     source: 'QCDrawing',
  //   //     projectCode: projectCode,
  //   //     teamLeader: teamLeader,
  //   //   }
  //   // );
  // };

  // const _onPressQCSpendFitUpList = async () => {
  //   // let userLogin = await Helper.getData('USERNAME');
  //   // navigation.navigate(
  //   //   'QCSpendList',
  //   //   {
  //   //     code: 'FitUp',
  //   //     projectCode: projectCode,
  //   //     userLogin: userLogin,
  //   //     title: 'QC Spend FitUp'
  //   //   }
  //   // );
  // };

  // const _onPressQCSpendVisualList = async () => {
  //   // let userLogin = await Helper.getData('USERNAME');
  //   // navigation.navigate(
  //   //   'QCSpendList',
  //   //   {
  //   //     code: 'Visual',
  //   //     projectCode: projectCode,
  //   //     userLogin: userLogin,
  //   //     title: 'QC Spend Weld'
  //   //   }
  //   // );
  // };

  // const _onPressQRCodeAllStatus = () => {
  //   // navigation.navigate(
  //   //   'AllStatusCamera',
  //   //   {
  //   //     projectCode: projectCode,
  //   //   }
  //   // );
  // };

  // const _onPressSearchAllStatus = () => {
  //   // navigation.navigate(
  //   //   'DrawingSearch',
  //   //   {
  //   //     projectCode: projectCode,
  //   //   }
  //   // );
  // };

  const _onPressMamageQCFitUp = () => {
    // Alert.alert(
    //   '',
    //   'Scan: Scan QR Code FitUp Drawing\n\nSpend List: Spend FitUp Request List',
    //   [
    //     { text: 'Scan', onPress: _onPressQRCodeFitUpQC },
    //     { text: 'Spend List', onPress: _onPressQCSpendFitUpList },
    //     { text: 'Cancel', style: 'cancel' }
    //   ],
    // );
  };
  const _onPressMamageQCWeld = () => {
    // Alert.alert(
    //   '',
    //   'Scan: Scan QR Code Weld Drawing\n\nSpend List: Spend Weld Request List',
    //   [
    //     { text: 'Scan', onPress: _onPressQRCodeVisualQC },
    //     { text: 'Spend List', onPress: _onPressQCSpendVisualList },
    //     { text: 'Cancel', style: 'cancel' }
    //   ],
    // );
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
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNotifyNumber)} />
        :
        <View style={styles.container}>
          <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
          <ScrollView style={styles.table}>
            <View style={styles.row}>
              <RenderItemBox title='Piece Mark Cut' onPress={_onPressMamagePieceMarkCut} />
              <RenderItemBox title='Piece Mark Paint' onPress={_onPressMamagePieceMarkPaint} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title='Lam Check Spending' onPress={_onPressMamageLamCheckSpending} />
              <RenderItemBox title='Cons FitUp' onPress={_onPressMamageFitUp} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title='Cons Weld' onPress={_onPressMamageWeld} />
              <RenderItemBox title='Manpower' />
            </View>
            {/* <View style={styles.row}>
              <RenderItemBox title='Scan All Status' onPress={_onPressQRCodeAllStatus} />
              <RenderItemBox title='Search All Status' onPress={_onPressSearchAllStatus} />
            </View> */}
            <View style={styles.row}>
              <RenderItemBox title='Lam Check Todo' onPress={_onPressMamageLamCheckTodo} number={spendNumbers.LamcheckTodo} />
              <RenderItemBox title='QC Scan FitUp' onPress={_onPressMamageQCFitUp} number={spendNumbers.QCFitUp} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title='QC Scan Weld' onPress={_onPressMamageQCWeld} number={spendNumbers.QCWeld} />
              <RenderItemBox title='Man-hours Impact' onPress={_onPressManHoursImpact} />
              {/* <RenderItemBox title='TimeSheet' onPress={_onPressTimeSheet} /> */}
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
    padding: Dimensions.get('window').height > 700 ? 12 : 4,
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