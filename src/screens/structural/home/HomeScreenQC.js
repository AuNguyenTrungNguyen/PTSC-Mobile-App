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
  const [spendNumbers, setSpendNumbers] = useState({ FitUp: 0, Visual: 0, LamCheck: 0, DimCheck: 0 });

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

  // DIM For Cutting
  const _onPressManageDimForCutting = async () => {
    Alert.alert(
      '',
      'Spend List: Spend Dim For Cutting List\n\nSearch: Search Dim For Cutting List',
      [
        { text: 'Spend List', onPress: _onPressSpendListDimForCutting },
        { text: 'Search', onPress: _onPressSearchDimForCutting },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressSpendListDimForCutting = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'QC DIM Cutting Spend';
    navigation.navigate(
      'DimForCuttingList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        title: title,
        isSpending: true,
      }
    );
  };
  const _onPressSearchDimForCutting = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'QC DIM Cutting List';
    navigation.navigate(
      'DimForCuttingList',
      {
        projectCode: projectCode,
        title: title,
        userLogin: userLogin,
      }
    );
  };

  // LAM Check Todo
  const _onPressManageLamCheckTodo = async () => {
    Alert.alert(
      '',
      'Spend List: Spend Lam Check Todo List\n\nScan: Scan QRCode Lam Check Todo\n\nSearch: Search Lam Check Todo',
      [
        { text: 'Spend List', onPress: _onPressSpendListLamCheckTodo },
        { text: 'Scan', onPress: _onPressQRCodeLamCheckTodo },
        { text: 'Search', onPress: _onPressSearchLamCheckTodo },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressSpendListLamCheckTodo = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'Lam Check Todo Spend';
    navigation.navigate(
      'LamCheckTodoList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        title: title,
        isSpending: true,
      }
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
    const userLogin = await Helper.getData('USERNAME');
    const title = 'Lam Check Todo';
    navigation.navigate(
      'LamCheckTodoList',
      {
        projectCode: projectCode,
        title: title,
        userLogin: userLogin,
      }
    );
  };

  // QC
  const _onPressManageQCFitUp = async () => {
    Alert.alert(
      '',
      'Spend List: Spend FitUp Request List\n\nScan: Scan QR Code FitUp Request\n\nSearch: Search FitUp Request List',
      [
        { text: 'Spend List', onPress: () => { _onPressSpendList(Constant.CODE_FITUP) } },
        { text: 'Scan', onPress: () => { _onPressQRCodeQC(Constant.CODE_FITUP) } },
        { text: 'Search', onPress: () => { _onPressSearchList(Constant.CODE_FITUP) } },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressManageQCVisual = async () => {
    Alert.alert(
      '',
      'Spend List: Spend Visual Request List\n\nScan: Scan QR Code Visual Request\n\nSearch: Search Visual Request List',
      [
        { text: 'Spend List', onPress: () => { _onPressSpendList(Constant.CODE_VISUAL) } },
        { text: 'Scan', onPress: () => { _onPressQRCodeQC(Constant.CODE_VISUAL) } },
        { text: 'Search', onPress: () => { _onPressSearchList(Constant.CODE_VISUAL) } },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressSpendList = async code => {
    const userLogin = await Helper.getData('USERNAME');
    let title = 'QC Spend ' + code;
    navigation.navigate(
      'QCSpendList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
        title: title,
        isSpending: true,
      }
    );
  };
  const _onPressQRCodeQC = async code => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
        destination: Naming.NAME_STR_QC
      }
    );
  };
  const _onPressSearchList = async code => {
    const userLogin = await Helper.getData('USERNAME');
    let title = 'QC ' + code;
    navigation.navigate(
      'QCSpendList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        code: code,
        title: title,
      }
    );
  };

  // DIM Check
  const _onPressManageDimCheck = async () => {
    Alert.alert(
      '',
      'Spend List: Spend Dim Check List\n\nScan: Scan QRCode Dim Check\n\nSearch: Search Dim Check',
      [
        { text: 'Spend List', onPress: _onPressSpendListDimCheck },
        { text: 'Scan', onPress: _onPressQRCodeDimCheck },
        { text: 'Search', onPress: _onPressSearchDimCheck },
        { text: 'Cancel', style: 'cancel' }
      ],
      {
        cancelable: true,
      }
    );
  };
  const _onPressSpendListDimCheck = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'Dim Check Spend';
    navigation.navigate(
      'DimCheckList',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        title: title,
        isSpending: true,
      }
    );
  };
  const _onPressQRCodeDimCheck = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      Constant.ROUTE__CAMERA,
      {
        projectCode: projectCode,
        userLogin: userLogin,
        destination: Naming.NAME_STR_DIM_CHECK
      }
    );
  };
  const _onPressSearchDimCheck = async () => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'Dim Check';
    navigation.navigate(
      'DimCheckList',
      {
        projectCode: projectCode,
        title: title,
        userLogin: userLogin,
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
        // { text: 'QC Status', onPress: _onPressQCStatusDIMAfterWeld },
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
        destination: Naming.NAME_STR_DIM_AFTER_WELD_QC
      }
    );
  };
  const _onPressSearchDIMAfterWeld = async () => {
    navigation.navigate(
      'DIMAfterWeldListQC',
      {
        projectCode: projectCode,
        isQC: true,
      }
    );
  };
  const _onPressQCStatusDIMAfterWeld = async () => {

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
      {
        cancelable: true,
      }
    );
  };
  const _onPressOverviewListObservation = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'QAObservationOverviewList',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };
  const _onPressListObservation = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'QAObservationList',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
      }
    });
  };
  const _onPressCreateObservation = async () => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'QAObservationDetail',
      params: {
        projectCode: projectCode,
        userLogin: userLogin,
        owner: userLogin
      }
    });
  };

  // QC Hand Book
  const _onPressQCHandBook = () => {
    navigation.navigate(
      'QCHandBook'
    );
  };

  //-- Open QC Welder Card
  const _onPressOpenQCWelderCard = async () => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'QCWelderCardList',
    });
  };



  const RenderItemBox = props => {
    let iconName = 'qr-code-outline';
    if (props.iconName) {
      iconName = props.iconName;
    }
    return (
      <>
        <View style={styles.line} />
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
        </View></>
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
              (spendNumbers.LamCheck || spendNumbers.DimForCutting)
                ?
                <View style={styles.line} />
                :
                null
            }
            <View style={styles.row}>
              <RenderItemBox title={'QC DIM\n Cutting'} onPress={_onPressManageDimForCutting} number={spendNumbers.DimForCutting} />
              <RenderItemBox title={'Lam Check\nTodo'} onPress={_onPressManageLamCheckTodo} number={spendNumbers.LamCheck} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC DIM\n Weld'} onPress={_onPressManageDimCheck} number={spendNumbers.DimCheck} />
              <RenderItemBox title={'QC FitUp\n'} onPress={_onPressManageQCFitUp} number={spendNumbers.FitUp} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QC Visual\n'} onPress={_onPressManageQCVisual} number={spendNumbers.Visual} />
              <RenderItemBox title={'DIM After\nWeld'} onPress={_onPressManageDIMAfterWeld} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'QA\nObservation'} onPress={_onPressQAObservation} />
              <RenderItemBox title={'QC\nHand Book'} onPress={_onPressQCHandBook} iconName={'md-book-outline'} />
            </View>
            <View style={styles.row}>
              <RenderItemBox title={'Welder Card'} onPress={_onPressOpenQCWelderCard} iconName={'md-card-outline'} />
              <RenderItemBox disable={true} />
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

export default HomeScreenQC;