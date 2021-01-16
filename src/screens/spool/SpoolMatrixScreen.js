import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

import Helper from '../../utils/Helper';
import GetFacilityListAPI from '../../apis/app/GetFacilityListAPI';
import GetSpoolMatrixListAPI from '../../apis/spool/GetSpoolMatrixListAPI';
import UpdateSpoolDetailAPI from '../../apis/spool/UpdateSpoolDetailAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const SpoolMatrix = ({ route, navigation }) => {

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const [isVisible, setIsVisible] = useState(false);
  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { projectCode } = route.params;

  const [spoolList, setSpoolList] = useState(null);
  const [updateSpoolList, setUpdateSpoolList] = useState([]);
  const [errorList, setErrorList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isShowDescription]);

  useEffect(
    () => {
      if (route.params?.drawingNo) {
        _onSpoolScanned(route.params?.drawingNo);
      } else {
        callAPI(getFacilityList);
      }
    }, [route.params?.drawingNo]
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
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

  const getFacilityList = async () => {
    let token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then((res) => {
        if (res.success) {
          setFacilityList(res.data);
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
      });;
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
  };

  const _onChangeFacilityCode = (code) => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchDrawing(code, drawingNo) }, false);
    }
    setIsVisible(false);
  };

  const searchDrawing = async (facilityCode, drawingNo) => {
    setIsSearching(true);
    setOldDrawingNo(drawingNo);
    let token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode != null && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo != null ? drawingNo : '';
    GetSpoolMatrixListAPI(projectCode, facilityCode, drawingNo, token)
      .then(res => {
        if (res.success) {
          setSpoolList(res.data);
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

  const _onPressSearchDrawing = () => {
    if (oldDrawingNo !== drawingNo) {
      Keyboard.dismiss();
      callAPI(() => { searchDrawing(facilityCode, drawingNo) }, false);
    }
  };

  const _onPressClearModel = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchDrawing('', drawingNo) }, false);
    }
    setIsVisible(false);
  };

  const _onPressCancelModel = () => {
    setIsVisible(false);
  };

  const _onPressShowModel = () => {
    if (updateSpoolList && updateSpoolList.length) {
      const errorIds = updateSpoolList.map(i => i.Id);
      setErrorList(errorIds);
      Alert.alert(
        'WARNING',
        'There is data that has not been updated.\nPlease Submit to Server before implementing this action!',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
        ],
        { cancelable: false },
      );
      return;
    }
    if (facilityList.length) {
      setIsVisible(true);
    } else {
      Toast.show('No have Facility to filter', Toast.SHORT);
    }
  };

  const _onPressQRCodeSpool = () => {
    if (updateSpoolList && updateSpoolList.length) {
      const errorIds = updateSpoolList.map(i => i.Id);
      setErrorList(errorIds);
      Alert.alert(
        'WARNING',
        'There is data that has not been updated.\nPlease Submit to Server before implementing this action!',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
        ],
        { cancelable: false },
      );
      return;
    }
    Keyboard.dismiss();
    navigation.navigate('SpoolCamera');
  };

  const updateSpoolListDetail = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    UpdateSpoolDetailAPI(projectCode, updateSpoolList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateSpoolList([]);
          setErrorList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const _onPressSubmitToServer = async () => {
    if (updateSpoolList.length) {
      callAPI(updateSpoolListDetail, false);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onSpoolScanned = drawingNo => {
    setDrawingNo(drawingNo);
    if (oldDrawingNo !== drawingNo) {
      Keyboard.dismiss();
      callAPI(() => { searchDrawing(facilityCode, drawingNo) }, false);
    }
  };

  const confirmUpdate = () => {
    const errorIds = updateSpoolList.map(i => i.Id);
    setErrorList(errorIds);
    Alert.alert(
      'WARNING',
      'There is data that has not been updated.\nPlease Submit to Server before implementing this action!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
      ],
      { cancelable: false },
    );
  };

  /**
   * Drawing List
   **/
  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      {
        (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) || drawingNo
          ?
          <Text style={styles.noDataTitle}>No have any data with</Text>
          :
          <Text style={styles.noDataTitle}>No have any data</Text>
      }
      {
        facilityCode && facilityCode != FACILITY_CODE_DEFAULT
          ?
          <>
            <Text style={styles.noDataTitle}>FacilityCode:</Text>
            <Text style={styles.noDataText}>{facilityCode}</Text>
          </>
          :
          null
      }
      {
        drawingNo
          ?
          <>
            <Text style={styles.noDataTitle}>DrawingNo:</Text>
            <Text style={styles.noDataText}>{drawingNo}</Text>
          </>
          :
          null
      }

    </View>
  );

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Enter FacilityCode or DrawingNo to search!</Text>
    </View>
  );

  const renderItem = ({ index, item }) => {
    let isEditing = errorList.indexOf(item.Id) > -1;
    return (
      <View style={isEditing ? styles.boxError : styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>SpoolNo:</Text>
          <Text style={styles.cellData}>{item.SpoolNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>WS_WeldedStatus</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.WS_WeldedStatus)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Field_FitUpStatus</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.Field_FitUpStatus)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Field_WeldedStatus</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.Field_WeldedStatus)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>SpoolRigUpToSite</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.SpoolRigUpToSite, index)}>
              <Text style={styles.textAction} >{formatDateData(item.SpoolRigUpToSite)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const formatEmptyData = data => {
    return data != null ? data : '';
  };

  const formatDateData = data => {
    return data != null ? Moment(data).format("DD-MMM-YY") : '';
  };

  /**
   * Update Data
   */

  const [isShowPicker, setIsShowPicker] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);

  const _onPressShowPicker = (value, index) => {
    setIndexUpdate(index);
    if (value) {
      setDateDisplay(new Date(Moment(value).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsShowPicker(true);
  };

  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {

      let array = [...spoolList];
      array[indexUpdate]['SpoolRigUpToSite'] = Moment(selectedDate).format("YYYY-MM-DD");
      setSpoolList(array);

      array = [...updateSpoolList];
      let id = spoolList[indexUpdate].Id;
      let objIndex = array.findIndex((obj => obj.Id == id));
      if (objIndex < 0) {
        array.push({ Id: id, ['SpoolRigUpToSite']: Moment(selectedDate).format("YYYY-MM-DD") });
      } else {
        array[objIndex]['SpoolRigUpToSite'] = spoolList[indexUpdate]['SpoolRigUpToSite'];
      }
      setUpdateSpoolList(array);
    }
    setIsShowPicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getFacilityList)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              (<View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <Text style={styles.infoData}>{projectCode}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>FacilityCode:</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={_onPressShowModel}>
                    <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>DrawingNo:</Text>
                  {
                    updateSpoolList && updateSpoolList.length
                      ?
                      <TouchableOpacity style={styles.inputContainer} onPress={confirmUpdate} activeOpacity={1}>
                        {
                          Platform.OS === 'android'
                            ?
                            <TextInput
                              editable={false}
                              style={styles.inputText}
                              value={drawingNo}
                              underlineColorAndroid='transparent'
                            />
                            :
                            <View style={styles.inputText}>
                              <Text style={styles.buttonTitleDark} numberOfLines={1}>{drawingNo}</Text>
                            </View>
                        }
                        {drawingNo == ''
                          ? null
                          : <FontAwesome5Icon name='times-circle' style={styles.inputIcon} />
                        }
                      </TouchableOpacity>
                      :
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputText}
                          value={drawingNo}
                          onChangeText={_onChangeDrawingNo}
                          underlineColorAndroid='transparent'
                        />
                        {drawingNo == ''
                          ? null
                          : <FontAwesome5Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                        }
                      </View>
                  }
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchDrawing}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search Drawing</Text>
                  </TouchableOpacity>
                </View>
              </View>)
              :
              null
          }
          {
            isSearching
              ?
              <ListSearchData />
              :
              (spoolList == null)
                ?

                <ListSelectData />
                :

                (!spoolList.length)
                  ?
                  <ListEmptyData />
                  :
                  <VirtualizedList
                    style={styles.table}
                    data={spoolList}
                    getItemCount={(data) => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item) => {
                      return item.Id;;
                    }}
                    renderItem={renderItem}
                  />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQRCodeSpool}>
              <Text style={styles.buttonTitle}>Scan Spool</Text>
            </TouchableOpacity>
            {
              spoolList != null && spoolList.length
                ?
                <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
                  <Text style={styles.buttonTitle}>Submit to Server</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
                  <Text style={styles.buttonTitleDisabled}>Submit to Server</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
      }

      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisible}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <ScrollView>
                  {facilityList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeFacilityCode(item.code)}>
                        <Text style={modals.cell}>{item.code}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={_onPressClearModel}>
                  <Text style={styles.buttonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={_onPressCancelModel}>
                  <Text style={styles.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isShowPicker}
        headerTextIOS={'Update SpoolRigUpToSite :'}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsShowPicker(false) }}
      />
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        transparent={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView >
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
  selectInput: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
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
    justifyContent: 'center'
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
  boxError: {
    flexDirection: 'column',
    width: '100%',
    borderColor: 'red',
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
    flex: 5,
    justifyContent: 'center',
  },
  cellData: {
    flex: 6,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
  },
  cellAction: {
    flex: 6,
  },
  itemAction: {
    flexDirection: 'row',
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

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: OPP_COLOR,
  },
  noDataTitle: {
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  buttonTitleDark: {
    color: BASE_COLOR,
  },
  buttonDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
  },
  buttonTitleDisabled: {
    color: '#666666',
  },
});
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    minHeight: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  action: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
});

export default SpoolMatrix;