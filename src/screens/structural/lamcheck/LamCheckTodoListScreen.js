import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetLamCheckTodoListAPI, UpdateLamCheckTodoListAPI } from '../../../apis/structural/LamCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const LamCheckTodoListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);
  const [jointNo, setJointNo] = useState('');
  const [oldJointNo, setOldJointNo] = useState(null);

  const [lamCheckTodoList, setLamCheckTodoList] = useState(null);
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
      _onPressSearchTodoList();
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
      callAPI(updateLamCheckTodoList, null);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = () => {
    // navigation.navigate(
    //   'DrawingImage',
    //   {
    //     projectCode: projectCode,
    //     facilityCode: facilityCode,
    //     drawingNo: drawingNo,
    //     code: code,
    //     userLogin: userLogin
    //   }
    // );
  };

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };

  const _onChangeJointNo = no => {
    setJointNo(no);
  };

  const _onPressSearchTodoList = () => {
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
      callAPI(() => { searchLamCheckTodoList(drawingNo, jointNo) }, false);
    }
  };

  const searchLamCheckTodoList = async (drawingNo, jointNo) => {
    Keyboard.dismiss();
    let token = await Helper.getData('TOKEN');
    drawingNo = drawingNo != null ? drawingNo : '';
    jointNo = jointNo != null ? jointNo : '';
    GetLamCheckTodoListAPI(projectCode, drawingNo, jointNo, token)
      .then(res => {
        if (res.success) {
          setLamCheckTodoList(res.data);
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

  const updateLamCheckTodoList = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(lamCheckUpdateList);
    UpdateLamCheckTodoListAPI(listUpdate, userLogin, token)
      .then(res => {
        if (res.success) {
          setLamCheckUpdateList([]);
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
        callAPI(() => { searchLamCheckTodoList(drawingNo, jointNo) }, false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const _onPressChangeValue = (data, index, key) => {
    let array = [...lamCheckTodoList];
    array[index][key] = data;
    setLamCheckTodoList(array);

    array = [...lamCheckUpdateList];
    let rowIndex = lamCheckTodoList[index].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [key]: data });
    } else {
      array[objIndex][key] = data;
    }
    setLamCheckUpdateList(array);
  };





  const getStatusRenderList = () => {
    return !isSearching && lamCheckTodoList && lamCheckTodoList.length;
  };

  const RenderList = () => {
    if (isSearching) {
      return <ListLoadingData />
    } else if (lamCheckTodoList == null) {
      return <ListSelectData title={'Enter DrawingNo or JointNo'} />
    } else if (!lamCheckTodoList.length) {
      return <ListEmptyData />
    }
  };

  const renderItem = ({ index, item }) => {
    let keyUpdate = 'LaminationTestResult';
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
          <Text style={styles.cellTitle}>PieceNo1:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceNo1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Description1:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceDescription1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>PieceNo2:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceNo2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Description2:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceDescription2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Result:</Text>
          {
            item.LaminationTestResult
              ?
              item.LaminationTestResult == 'ACC'
                ?
                <Text style={[styles.cellData, styles.labelAccept]}>{item.LaminationTestResult}</Text>
                :
                <Text style={[styles.cellData, styles.labelReject]}>{item.LaminationTestResult}</Text>
              :
              <Text style={styles.cellData}>{Formater.formatEmptyData(item.LaminationTestResult)}</Text>
          }
        </View>
        <View style={styles.row}>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => _onPressChangeValue(Constant.STATUS_ACCEPT, index, keyUpdate)}>
              <Text style={styles.labelAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => _onPressChangeValue(Constant.STATUS_REJECT, index, keyUpdate)}>
              <Text style={styles.labelReject}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonImage}>
              <Text style={styles.labelImage}>Picture</Text>
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchLamCheckTodoList(drawingNo, jointNo) }) }} />
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
                    onPress={_onPressSearchTodoList}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search TodoList</Text>
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
                data={lamCheckTodoList}
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
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManagePicture}>
              <Text style={styles.buttonTitle}>Manage Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
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
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonAccept: {
    width: 70,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelAccept: {
    color: 'green',
  },
  buttonReject: {
    width: 70,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReject: {
    color: 'red',
  },
  buttonImage: {
    width: 70,
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelImage: {
    color: 'darkblue',
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
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
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default LamCheckTodoListScreen;