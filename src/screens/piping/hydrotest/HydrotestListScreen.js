import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Dialog from 'react-native-dialog';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetHydrotestPlanListAPI, UpdateHydrotestPlanListAPI } from '../../../apis/hydrotest/HydroTestAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const HydrotestListScreen = ({ route, navigation }) => {

  const [testPackNo, setTestPackNo] = useState('');
  const [oldTestPackNo, setOldTestPackNo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { projectCode } = route.params;

  const [hydrotestList, setHydrotestList] = useState(null);
  const [updateHydrotestList, setUpdateHydrotestList] = useState([]);

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

  const _onChangeTestPackNo = (no) => {
    setTestPackNo(no);
  };

  const searchHydrotest = async testPackNo => {
    setIsSearching(true);
    setOldTestPackNo(testPackNo);
    let token = await Helper.getData('TOKEN');
    GetHydrotestPlanListAPI(projectCode, testPackNo, token)
      .then(res => {
        if (res.success) {
          setHydrotestList(res.data);
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

  const _onPressSearchHydrotest = () => {
    if (oldTestPackNo !== testPackNo) {
      Keyboard.dismiss();
      callAPI(() => { searchHydrotest(testPackNo) }, false);
    }
  };

  const updateHydroTest = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let userUpdate = await Helper.getData('USERNAME');
    let listUpdate = Helper.handleListUpdate(updateHydrotestList);
    UpdateHydrotestPlanListAPI(userUpdate, listUpdate, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateHydrotestList([]);
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
    if (updateHydrotestList.length) {
      callAPI(updateHydroTest, false);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };





  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      {
        testPackNo
          ?
          <>
            <Text style={styles.noDataTitle}>TestPackNo:</Text>
            <Text style={styles.noDataText}>{testPackNo}</Text>
          </>
          :
          null
      }
    </View>
  );

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Enter TestPackNo to search!</Text>
    </View>
  );

  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>TestPackageNo:</Text>
          <Text style={styles.cellData}>{item.TestPackageNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>WeldSumSubmittedDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.WeldSumSubmittedDate, index, 'WeldSumSubmittedDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.WeldSumSubmittedDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>WeldSumApprovedDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.WeldSumApprovedDate, index, 'WeldSumApprovedDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.WeldSumApprovedDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>LineCheckedDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.LineCheckedDate, index, 'LineCheckedDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.LineCheckedDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>QCInspectorLineCheck:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCInspectorLineCheck, index, 'QCInspectorLineCheck')}>
              {
                item.QCInspectorLineCheck
                  ?
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCInspectorLineCheck)}</Text>
                  :
                  <Text style={styles.textEnter}>Enter value ...</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>FlushingPlanDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.FlushingPlanDate, index, 'FlushingPlanDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.FlushingPlanDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>FlushingCheckBy:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.FlushingCheckBy, index, 'FlushingCheckBy')}>
              {
                item.FlushingCheckBy
                  ?
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FlushingCheckBy)}</Text>
                  :
                  <Text style={styles.textEnter}>Enter value ...</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>HydrotestDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.HydrotestDate, index, 'HydrotestDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.HydrotestDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>QCHydrotestBy:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCHydrotestBy, index, 'QCHydrotestBy')}>
              {
                item.QCHydrotestBy
                  ?
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCHydrotestBy)}</Text>
                  :
                  <Text style={styles.textEnter}>Enter value ...</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>AirDryingDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.AirDryingDate, index, 'AirDryingDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.AirDryingDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>ReinstatementDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.ReinstatementDate, index, 'ReinstatementDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.ReinstatementDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>QCReinstatementCheckBy:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCReinstatementCheckBy, index, 'QCReinstatementCheckBy')}>
              {
                item.QCReinstatementCheckBy
                  ?
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCReinstatementCheckBy)}</Text>
                  :
                  <Text style={styles.textEnter}>Enter value ...</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>TPSubmitToClientDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.TPSubmitToClientDate, index, 'TPSubmitToClientDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.TPSubmitToClientDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>TPClientApprovalDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.TPClientApprovalDate, index, 'TPClientApprovalDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.TPClientApprovalDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>TPHandoverDate:</Text>
          <View style={styles.cellAction}>
            <TouchableOpacity style={styles.itemAction} onPress={() => _onPressShowPicker(item.TPHandoverDate, index, 'TPHandoverDate')}>
              <Text style={styles.textAction} >{Formater.formatDateData(item.TPHandoverDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>Remark:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.Remark, index, 'Remark')}>
              {
                item.Remark
                  ?
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Remark)}</Text>
                  :
                  <Text style={styles.textEnter}>Enter value ...</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };



  /**
   * Update Data
   */
  const [isShowPicker, setIsShowPicker] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const [remarkDisplay, setRemarkDisplay] = useState('');
  const [isShowDialogRemark, setIsShowDialogRemark] = useState(false);
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const _onPressShowPicker = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setDateDisplay(new Date(Moment(value).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsShowPicker(true);
  };

  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      let array = [...hydrotestList];
      array[indexUpdate][keyUpdate] = Moment(selectedDate).format("YYYY-MM-DD");
      setHydrotestList(array);

      array = [...updateHydrotestList];
      let id = hydrotestList[indexUpdate].Id;
      let objIndex = array.findIndex((obj => obj.Id == id));
      if (objIndex < 0) {
        array.push({ Id: id, [keyUpdate]: Moment(selectedDate).format("YYYY-MM-DD") });
      } else {
        array[objIndex][keyUpdate] = hydrotestList[indexUpdate][keyUpdate];
      }
      setUpdateHydrotestList(array);
    }
    setIsShowPicker(false);
  };

  const _onPressShowDialogRemark = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setRemarkDisplay(value.toString());
    } else {
      setRemarkDisplay('');
    }
    setIsShowDialogRemark(true);
  };

  const _onPressSubmitRemark = () => {
    let value = remarkDisplay;
    if (!value) {
      value = null;
    }
    if (hydrotestList[indexUpdate][keyUpdate] != value) {
      let array = [...hydrotestList];
      array[indexUpdate][keyUpdate] = value;
      setHydrotestList(array);

      array = [...updateHydrotestList];
      let id = hydrotestList[indexUpdate].Id;
      let objIndex = array.findIndex((obj => obj.Id == id));
      if (objIndex < 0) {
        array.push({ Id: id, [keyUpdate]: value });
      } else {
        array[objIndex][keyUpdate] = hydrotestList[indexUpdate][keyUpdate];
      }
      setUpdateHydrotestList(array);
    }
    setIsShowDialogRemark(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { searchHydrotest(testPackNo) }, true)} />
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
                  <Text style={styles.infoTitle}>TestPackNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={testPackNo}
                      onChangeText={_onChangeTestPackNo}
                      underlineColorAndroid='transparent'
                    />
                    {testPackNo == ''
                      ? null
                      : <FontAwesome5Icon name='times-circle' onPress={() => _onChangeTestPackNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchHydrotest}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search Test Pack</Text>
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
              (hydrotestList == null)
                ?

                <ListSelectData />
                :

                (!hydrotestList.length)
                  ?
                  <ListEmptyData />
                  :
                  <VirtualizedList
                    style={styles.table}
                    data={hydrotestList}
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
            {
              hydrotestList != null && hydrotestList.length
                ?
                <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
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

      <DateTimePickerModal
        isVisible={isShowPicker}
        headerTextIOS={keyUpdate + ':'}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsShowPicker(false) }}
      />
      <Dialog.Container visible={isShowDialogRemark}>
        <Dialog.Title>{keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={remarkDisplay}
          onChangeText={(text) => setRemarkDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsShowDialogRemark(false) }} />
        <Dialog.Button label='OK' onPress={_onPressSubmitRemark} />
      </Dialog.Container>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
  },
  cellAction: {
    flex: 1,
  },
  itemAction: {
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
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textEnter: {
    fontStyle: 'italic',
    color: BASE_COLOR,
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
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
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
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
  },
  buttonTitleDisabled: {
    color: '#666666',
  },
});

export default HydrotestListScreen;