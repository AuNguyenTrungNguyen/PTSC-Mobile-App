import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import { GetNotifyNumberScopeAPI } from '../../../apis/app/AppAPI';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Naming from '../../../utils/Naming';
import Header from '../../../components/Header';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const HomeScreenQC = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;
  const [spendNumbers, setSpendNumbers] = useState({ QCFitUp: 0, QCWeld: 0, LamCheckTodo: 0, DimCheckSpending: 0 });

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
    let token = await Helper.getData('TOKEN');
    GetNotifyNumberScopeAPI(projectCode, token)
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

  // LAM Check Todo
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
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        destination: Naming.NAME_STR_LAM_CHECK_TODO
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

  // DIM Check
  const _onPressDimCheck = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'DimCheckList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };

  // QA Observation
  const _onPressQAObservation = async () => {
    Alert.alert(
      '',
      'Overview: All Observation in Project\n\List: List Observation\n\Create: Create Observation',
      [
        { text: 'Overview', onPress: _onPressOverviewListObservation },
        { text: 'List', onPress: _onPressListObservation },
        { text: 'Create', onPress: _onPressCreateObservation },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressOverviewListObservation = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'QAObservationOverviewList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };
  const _onPressListObservation = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'QAObservationList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    );
  };
  const _onPressCreateObservation = async () => {
    let userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'QAObservationDetail',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        owner: userLogin
      },
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
            {
              (spendNumbers.LamcheckTodo || spendNumbers.DimCheckSpending)
                ?
                <View style={styles.line} />
                :
                null
            }
            <View style={styles.row}>
              <RenderItemBox title={'Lam Check\nTodo'} onPress={_onPressMamageLamCheckTodo} number={spendNumbers.LamcheckTodo} />
              <RenderItemBox title={'QC DIM\n'} onPress={_onPressDimCheck} number={spendNumbers.DimCheckSpending} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC FitUp\n'} />
              <RenderItemBox title={'QC Weld\n'} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QA\nObservation'} onPress={_onPressQAObservation} />
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

export default HomeScreenQC;