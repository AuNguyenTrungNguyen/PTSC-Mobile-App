import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Appearance, Dimensions, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Networker from '../../utils/Networker';
import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';

import { GetPIPNotifyNumberAPI } from '../../apis/app/AppAPI';

import LoadingRefresh from '../../components/LoadingRefresh';
import Header from '../../components/Header';

const HomeScreen = ({ route, navigation }) => {

  const { projectCode, disciplineCode } = route.params;
  const [notifyNumbers, setNotifyNumbers] = useState({ FitUp: 0, Visual: 0, DimCutting: 0 });

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

  //-- QC MANAGERMENT
  const _onPressManageQC = code => {
    Alert.alert(
      '',
      'Scan: Scan QR Code\n\nSearch: Search Request List\n\nSpend List: View Spending List',
      [
        { text: 'Scan', onPress: () => _onPressQRCodeQC(code) },
        { text: 'Search', onPress: _onPresSearchQC },
        { text: 'Spend List', onPress: () => { _onPressSpedingListQC(code) } },
        { text: 'Cancel', style: 'cancel' }
      ],
    );
  };
  const _onPressQRCodeQC = async code => {
    const teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: code,
        source: Constant.CAMERA_PIP_QC,
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };
  const _onPresSearchQC = async () => {
    navigation.navigate('QCDrawingList', {
      projectCode: projectCode
    });
  };
  const _onPressSpedingListQC = async code => {
    const userLogin = await Helper.getData('USERNAME');
    const title = 'QC Spend ' + code;
    navigation.navigate('QCSpendList', {
      projectCode: projectCode,
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

  //-- QA Observation
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

  //-- Open Drawing
  const _onPressOpenDrawing = async () => {
    navigation.navigate(Constant.ROUTE__COMMON, {
      screen: 'OpenDrawing',
      params: {
        projectCode: projectCode,
        title: 'Pipe Support'
      }
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
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNotifyNumbers)} />
          :
          <View style={styles.container}>
            <Header data={{ 'Project': projectCode, 'Module': disciplineCode }}></Header>
            <ScrollView style={styles.table}>
              {
                (notifyNumbers.DimCutting || notifyNumbers.FitUp)
                  ?
                  <View style={styles.line} />
                  :
                  null
              }
              <View style={styles.row}>
                <RenderItemBox title={'QC\nDim Cutting'} onPress={_onPressDimCuttingQCList} number={notifyNumbers.DimCutting} />
                <RenderItemBox title={'QC FitUp'} onPress={() => { _onPressManageQC(Constant.CODE_FITUP) }} number={notifyNumbers.FitUp} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'QC Visual'} onPress={() => { _onPressManageQC(Constant.CODE_VISUAL) }} number={notifyNumbers.Visual} />
                <RenderItemBox title={'View \nAll Status'} onPress={_onPressViewAllStatus} />
              </View>
              <View style={styles.row}>
                <RenderItemBox title={'QA\nObservation'} onPress={_onPressQAObservation} />
                <RenderItemBox title={'Pipe Support'} onPress={_onPressOpenDrawing} />
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