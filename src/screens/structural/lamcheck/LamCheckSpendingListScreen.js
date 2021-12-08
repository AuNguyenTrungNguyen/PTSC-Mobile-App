import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';
import Dialog from "react-native-dialog";

import { GetTeamListAPI } from '../../../apis/app/AppAPI';
import { GetLamCheckSpendingListQRCodeAPI, UpdateLamCheckSpendingListAPI } from '../../../apis/structural/LamCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const LamCheckSpendingListScreen = ({ route, navigation }) => {

  const { projectCode, paramDrawingNo, sheet, rev } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);
  const [jointNo, setJointNo] = useState('');
  const [oldJointNo, setOldJointNo] = useState(null);

  // const [isQR, setIsQR] = useState(true);

  const [lamCheckSpendingList, setLamCheckSpendingList] = useState(null);
  const [lamCheckUpdateList, setLamCheckUpdateList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);

  useEffect(
    () => {
      if (paramDrawingNo) {
        setDrawingNo(paramDrawingNo);
        setIsSearching(true);
        callAPI(() => { searchSpendingList(paramDrawingNo, jointNo) }, false);
      }
    }, []
  );

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = (executedAPI, loading = true) => {
    if (!loading === null) {
      if (loading) {
        setIsLoading(true);
      } else {
        setIsSearching(true);
      }
    }
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const _onPressSubmitToServer = async () => {
    if (lamCheckUpdateList.length) {
      callAPI(updateSpendingList, null);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
    // setIsQR(false);
  };

  const _onChangeJointNo = no => {
    setJointNo(no);
  };

  const _onPressSearchRequest = () => {
    let isSearch = false;
    if (drawingNo !== oldDrawingNo) {
      setOldDrawingNo(drawingNo);
      isSearch = true;
    }
    if (jointNo !== oldJointNo) {
      setOldJointNo(jointNo);
      isSearch = true;
    }
    if (isSearch) {
      callAPI(() => { searchSpendingList(drawingNo, jointNo) }, false);
    }
  };

  const searchSpendingList = async (drawingNo, jointNo) => {
    Keyboard.dismiss();
    let token = await Helper.getData('TOKEN');
    drawingNo = drawingNo != null ? drawingNo : '';
    jointNo = jointNo != null ? jointNo : '';
    // sheet = (sheet != null && isQR) ? sheet : '';
    // rev = (rev != null && isQR) ? rev : '';
    let sheetParam = !sheet ? '' : sheet;
    let revParam = !rev ? '' : rev;
    GetLamCheckSpendingListQRCodeAPI(projectCode, drawingNo, jointNo, sheetParam, revParam, token)
      .then(res => {
        if (res.success) {
          setLamCheckSpendingList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  const updateSpendingList = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let listSending = Helper.handleListUpdate(lamCheckUpdateList);
    UpdateLamCheckSpendingListAPI(listSending, token)
      .then(res => {
        if (res.success) {
          setLamCheckUpdateList([]);
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
        callAPI(() => { searchSpendingList(drawingNo, jointNo) }, false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');

  const [isVisibleFittingTeam, setIsVisibleFittingTeam] = useState(false);
  const [fittingTeamList, setFittingTeamList] = useState(null);
  const _onPressShowFittingTeamPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleFittingTeam(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getFittingTeamList();
      }
    });
  };
  const getFittingTeamList = async () => {
    if (fittingTeamList == null) {
      let token = await Helper.getData('TOKEN');
      GetTeamListAPI(projectCode, Constant.CODE_FITUP, token)
        .then(res => {
          if (res.success) {
            setFittingTeamList(res.data);
            setIsLoading(false);
            setIsError(false);
          } else {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleFittingTeam(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleFittingTeam(false);
        });
    }
  };
  const _onChangeFittingTeam = data => {
    _onChangeData(data);
    setIsVisibleFittingTeam(false);
  };

  const [isVisibleRemark, setIsVisibleRemark] = useState(false);
  const [remark, setRemark] = useState('');
  const _onPressOpenRemark = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setRemark(value.toString());
    } else {
      setRemark('');
    }
    setIsVisibleRemark(true);
  };
  const _onSubmitRemark = () => {
    let value = remark.trim();
    setRemark(value);
    if (lamCheckSpendingList[indexUpdate][keyUpdate] !== value) {
      _onChangeData(value);
    }
    setIsVisibleRemark(false);
  };

  const _onChangeData = data => {
    let array = [...lamCheckSpendingList];
    array[indexUpdate][keyUpdate] = data;
    setLamCheckSpendingList(array);

    array = [...lamCheckUpdateList];
    let rowIndex = lamCheckSpendingList[indexUpdate].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyUpdate]: data });
    } else {
      array[objIndex][keyUpdate] = lamCheckSpendingList[indexUpdate][keyUpdate];
    }
    setLamCheckUpdateList(array);
  };





  const getStatusRenderList = () => {
    return !isSearching && lamCheckSpendingList && lamCheckSpendingList.length;
  };

  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (lamCheckSpendingList == null) {
        return <ListSelectData title={'Enter DrawingNo or JointNo'} />
      } else if (!lamCheckSpendingList.length) {
        return <ListEmptyData />
      }
    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <View
        style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Lam Check Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.WeldMapDrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.WeldMapDrawingNo}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>JointNo:</Text>
          <Text style={styles.cellData}>{item.JointNo}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>FittingTeam:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressShowFittingTeamPopup(index, 'LaminationTestRequestByTeam')}>
              <Text style={styles.textAction}>{Formater.formatEmptyData(item.LaminationTestRequestByTeam)}</Text>
              <Ionicons style={styles.iconAction} name='md-people-outline' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>Remark:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressOpenRemark(item.LamRemark, index, 'LamRemark')}>
              <Text style={styles.textAction}>{Formater.formatEmptyData(item.LamRemark)}</Text>
              <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchSpendingList(drawingNo, jointNo) }) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              <View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <Text style={styles.infoData}>{projectCode}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>DrawingNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={drawingNo}
                      onChangeText={_onChangeDrawingNo}
                      underlineColorAndroid='transparent'
                    />
                    {
                      drawingNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>JointNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={jointNo}
                      onChangeText={_onChangeJointNo}
                      underlineColorAndroid='transparent'
                    />
                    {
                      jointNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeJointNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchRequest}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
          }
          {
            getStatusRenderList()
              ?
              <VirtualizedList
                style={styles.table}
                data={lamCheckSpendingList}
                getItemCount={data => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(item, index) => index}
                renderItem={renderItem}
              />
              :
              <RenderList />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonAction} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <SelectPopup
        visible={isVisibleFittingTeam}
        data={fittingTeamList}
        onChangeItem={_onChangeFittingTeam}
        onCancel={() => setIsVisibleFittingTeam(false)} />
      <Dialog.Container visible={isVisibleRemark}>
        <Dialog.Title>{'Enter Remark'}</Dialog.Title>
        <Dialog.Input
          value={remark}
          onChangeText={(text) => setRemark(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsVisibleRemark(false) }} />
        <Dialog.Button label='OK' onPress={_onSubmitRemark} />
      </Dialog.Container>
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
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
    padding: 12,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    marginBottom: 8,
    padding: 4,
    paddingBottom: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
  },
  inputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  searchButton: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 2,
  },

  table: {
    flexGrow: 1,
  },
  box: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
  },
  itemActionIcon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textAction: {
    minWidth: 80,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default LamCheckSpendingListScreen;