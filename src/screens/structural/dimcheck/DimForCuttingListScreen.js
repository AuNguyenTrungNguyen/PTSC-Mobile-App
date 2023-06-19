import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  GetDimForCuttingListAPI,
  UpdateDimForCuttingListAPI
} from '../../../apis/structural/DimCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const DimForCuttingListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin, isSpending } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);
  const [pieceMarkNo, setJointNo] = useState('');
  const [oldJointNo, setOldJointNo] = useState(null);

  const [dimForCuttingList, setDimForCuttingList] = useState(null);
  const [dimForCuttingUpdateList, setDimForCuttingUpdateList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;

  // Filter Type
  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.FILTER_ALL);
  const _onChangeType = data => {
    if (data != type) {
      setType(data);
      callAPI(() => { searchDimForCuttingList(drawingNo, pieceMarkNo, data) });
    }
    setIsVisibleType(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {/* {
            !isSpending &&
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setIsVisibleType(true) }}>
              <Ionicons
                size={24}
                name={'md-ellipsis-vertical-circle'} color={iconColor} />
            </TouchableOpacity>
          } */}
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
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
      _onPressSearchList();
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
    if (dimForCuttingUpdateList.length) {
      callAPI(updateDimForCuttingList, null);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };

  const _onChangeJointNo = no => {
    setJointNo(no);
  };

  const _onPressSearchList = () => {
    let isSearch = false;
    if (drawingNo !== oldDrawingNo) {
      setOldDrawingNo(drawingNo);
      isSearch = true;
    }
    if (pieceMarkNo !== oldJointNo) {
      setOldJointNo(pieceMarkNo);
      isSearch = true;
    }
    if (isSearch) {
      callAPI(() => { searchDimForCuttingList(drawingNo, pieceMarkNo, type) }, false);
    }
  };

  const searchDimForCuttingList = async (drawingNo, pieceMarkNo, filterType) => {
    Keyboard.dismiss();
    drawingNo = drawingNo != null ? drawingNo : '';
    pieceMarkNo = pieceMarkNo != null ? pieceMarkNo : '';
    GetDimForCuttingListAPI(projectCode, drawingNo, pieceMarkNo, filterType, isSpending)
      .then(res => {
        if (res.success) {
          setDimForCuttingList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
          setIsUploading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
          setIsUploading(false);
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
        setIsUploading(false);
      });
  };

  const updateDimForCuttingList = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(dimForCuttingUpdateList);
    UpdateDimForCuttingListAPI(userLogin, listUpdate, token)
      .then(res => {
        setIsUploading(false);
        if (res.success) {
          setDimForCuttingUpdateList([]);
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(() => { searchDimForCuttingList(drawingNo, pieceMarkNo, type) }, false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const _onPressChangeValue = (data, index, key) => {
    let array = [...dimForCuttingList];
    array[index][key] = data;
    setDimForCuttingList(array);

    array = [...dimForCuttingUpdateList];
    let rowIndex = dimForCuttingList[index].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [key]: data });
    } else {
      array[objIndex][key] = data;
    }
    setDimForCuttingUpdateList(array);
  };

  const _onPressManagePicture = async (item) => {
    const dataCode = await Helper.getData('DATACODE');
    navigation.navigate(
      'DimCheckImage',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        dataCode: dataCode,
        rowIndex: item.RowIndex,
        drawingNo: item.CuttingPlanDrawingNo,
        pieceMarkNo: item.PieceMarkNo,
        imageCode: 'DimForCutting'
      }
    );
  };





  const getStatusRenderList = () => {
    return !isSearching && dimForCuttingList && dimForCuttingList.length;
  };

  const RenderList = () => {
    if (isSearching) {
      return <ListLoadingData />
    } else if (dimForCuttingList == null) {
      return <ListSelectData title={'Enter DrawingNo or PieceMarkNo'} />
    } else if (!dimForCuttingList.length) {
      return <ListEmptyData />
    }
  };

  const renderItem = ({ index, item }) => {
    let keyUpdateResult = 'DIM_ForCuttingResult';
    return (
      <View
        style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.CuttingPlanDrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.CuttingPlanDrawingNo}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>PieceMarkNo:</Text>
          <Text style={styles.cellData}>{item.PieceMarkNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>RequestDate:</Text>
          <Text style={styles.cellData}>{Formater.formatDateData(item.DIM_ForCuttingRequestDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>RequestBy:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_ForCuttingRequestByTeam)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Result:</Text>
          {
            item.DIM_ForCuttingResult
              ?
              item.DIM_ForCuttingResult == 'ACC'
                ?
                <Text style={[styles.cellData, styles.labelAccept]}>{item.DIM_ForCuttingResult}</Text>
                :
                <Text style={[styles.cellData, styles.labelReject]}>{item.DIM_ForCuttingResult}</Text>
              :
              <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_ForCuttingResult)}</Text>
          }
        </View>
        <View style={styles.row}>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => _onPressChangeValue(Constant.STATUS_ACCEPT, index, keyUpdateResult)}>
              <Text style={styles.labelAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => _onPressChangeValue(Constant.STATUS_REJECT, index, keyUpdateResult)}>
              <Text style={styles.labelReject}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonImage}
              onPress={() => { _onPressManagePicture(item) }}>
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchDimForCuttingList(drawingNo, pieceMarkNo, type) }) }} />
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
                  <Text style={styles.infoTitle}>PieceMarkNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={pieceMarkNo}
                      onChangeText={_onChangeJointNo}
                      underlineColorAndroid='transparent'
                    />
                    {
                      pieceMarkNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeJointNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchList}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search List</Text>
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
                data={dimForCuttingList}
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
        visible={isVisibleType}
        data={[Constant.FILTER_ALL, Constant.FILTER_NOT_YET, Constant.FILTER_ALREADY]}
        onCancel={() => setIsVisibleType(false)}
        onChangeItem={_onChangeType}>
      </SelectPopup>
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
  cellDataAction: {
    flex: 7,
    justifyContent: 'center',
  },
  itemAction: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },
  textData: {
    minWidth: 80,
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
  buttonAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default DimForCuttingListScreen;