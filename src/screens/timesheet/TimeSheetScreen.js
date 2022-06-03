import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  GetTimeSheetTeamLeaderInfoAPI,
  GetTimeSheetWorkOrderListAPI,
  GetTimeSheetWorkerListAPI,
  UpdateTimeSheetListAPI
} from '../../apis/timesheet/TimeSheetAPI';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import SelectPopupTimeSheet from '../../components/timesheet/SelectPopupTimeSheet';
import { ListEmptyData } from '../../components/HelperUI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const TimeSheetScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const SPENDING_TEXT = 'Chưa gán công';
  const UPDATED_TEXT = 'Đã gán công';
  const TEMP_COLOR_SPENDING = 1;
  const TEMP_COLOR_UPDATED = 2;

  const currentDate = new Date();
  const [filter, setFilter] = useState(SPENDING_TEXT);

  const [department, setDepartment] = useState('');
  const [fullname, setFullname] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [workOrderList, setWorkOrderList] = useState([]);
  const [workerList, setWorkerList] = useState([]);
  const [workerUpdatedList, setWorkerUpdatedList] = useState([]);

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setFilter(SPENDING_TEXT) }}>
            <Ionicons
              size={24}
              name={'md-ellipse-outline'} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setFilter(UPDATED_TEXT) }}>
            <Ionicons
              size={24}
              name={'md-checkmark-circle-outline'} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  useEffect(
    () => {
      if (filter === SPENDING_TEXT) {
        _onPressClearAll();
      } else {
        _onPressClearAllUpdated();
      }
    }, [filter]
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
  useEffect(
    () => {
      callAPI(getTeamLeaderInfo);
    }, [navigation]
  );

  const [isRefreshWorkOrder, setIsRefreshWorkOrder] = useState(null);
  useEffect(
    () => {
      if (isRefreshWorkOrder) {
        callAPI(getTimeSheetWorkOrderList, false);
      }
    }, [isRefreshWorkOrder]
  );

  //-- Manage Workers
  const _onPressManageWorker = () => {
    navigation.navigate(
      'TimeSheetManagerWorker',
      {
        userLogin: userLogin,
        department: department,
        fullname: fullname
      }
    );
  };

  //-- Get Data
  const getTeamLeaderInfo = async () => {
    const token = await Helper.getData('TOKEN');
    GetTimeSheetTeamLeaderInfoAPI(userLogin, token)
      .then(res => {
        if (res.success) {
          if (Object.keys(res.data).length) {
            setDepartment(res.data[0].DepartmentCode);
            setFullname(res.data[0].Fullname);
            callAPI(getAllData);
          }
          else {
            Alert.alert(
              'ERROR',
              'You do not have permission to access this module!',
              [
                {
                  text: 'Back',
                  onPress: () => {
                    navigation.goBack();
                  },
                  style: 'cancel'
                },
              ],
              { cancelable: false },
            );
          }
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };
  const getTimeSheetWorkOrderList = async () => {
    const token = await Helper.getData('TOKEN');
    GetTimeSheetWorkOrderListAPI(projectCode, userLogin, token)
      .then(res => {
        if (res.success) {
          setWorkOrderList(res.data);
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
  const getAllData = async () => {
    const token = await Helper.getData('TOKEN');
    try {
      let arrayPromise = [
        GetTimeSheetWorkerListAPI(projectCode, userLogin, token),
        GetTimeSheetWorkOrderListAPI(projectCode, userLogin, token),
      ];
      await Promise.all(arrayPromise)
        .then(([workerResult, workOrderResult]) => {
          if (workerResult.success && workOrderResult.success) {

            let data = [];
            let dataUpdated = [];
            if (workerResult.data) {
              workerResult.data.map(i => {
                i.SUBMITED = true;
                return i;
              });
              data = workerResult.data.filter(i => i.UPDATED == false);
              dataUpdated = workerResult.data.filter(i => i.UPDATED == true);
            }
            setWorkerList(data);
            setWorkerUpdatedList(dataUpdated);

            setWorkOrderList(workOrderResult.data);
            setIsLoading(false);
            setIsError(false);
            setIsUploading(false);

          } else {
            setIsLoading(false);
            setIsError(true);
            setIsUploading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false);
        });
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setIsUploading(false);
      MessageAlert('ERROR', error.toString());
    }
  };

  //-- Send Data
  const _onPressSubmitToServer = async () => {
    let checkList = [];
    if (workerUpdatedList) {
      checkList = workerUpdatedList.filter(i => i.SUBMITED == false);
    }
    if (checkList.length) {
      callAPI(updateTimeSheetList, false);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };
  const updateTimeSheetList = async () => {
    const token = await Helper.getData('TOKEN');
    const resultList = workerUpdatedList.filter(i => i.SUBMITED == false);
    setIsUploading(true);
    UpdateTimeSheetListAPI(projectCode, department, userLogin, Formater.formatDateSQL(currentDate), resultList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          let baseArray = [...workerUpdatedList];
          workerUpdatedList.map(i => {
            i.SUBMITED = true;
            i.ColorWorkOrder = null;
            i.ColorShift = null;
            i.ColorHours = null;
            i.ColorNote = null;
            return i;
          });
          setWorkerUpdatedList(baseArray);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
        setIsRefreshWorkOrder(new Date());
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  //-- Action
  const _onPressClearAll = () => {
    if (workerList) {
      let array = [...workerList];
      array.map(i => {
        i.SELECTED = false;
        return i;
      });
      setWorkerList(array);
    }
  };
  const _onPressCheckAll = () => {
    if (workerList) {
      let array = [...workerList];
      array.map(i => {
        i.SELECTED = true;
        return i;
      });
      setWorkerList(array);
    }
  };
  const _onChangeCheckbox = (value, index) => {
    let array = [...workerList];
    if (array) {
      var item = array[index];
      item.SELECTED = value
    }
    setWorkerList(array);
  };


  const _onPressClearAllUpdated = () => {
    if (workerUpdatedList) {
      let array = [...workerUpdatedList];
      array.map(i => {
        i.SELECTED = false;
        return i;
      });
      setWorkerUpdatedList(array);
    }
  };
  const _onPressCheckAllUpdated = () => {
    if (workerUpdatedList) {
      let array = [...workerUpdatedList];
      array.map(i => {
        i.SELECTED = true;
        return i;
      });
      setWorkerUpdatedList(array);
    }
  };
  const _onChangeCheckboxUpdated = (value, index) => {
    let array = [...workerUpdatedList];
    if (array) {
      var item = array[index];
      item.SELECTED = value
    }
    setWorkerUpdatedList(array);
  };


  const _onPressTransfer = () => {
    if (!workerList.length) {
      return;
    }

    let transferList = workerList.filter(i => i.MHR || i.Overtime);
    if (transferList) {
      let addlist = [];
      transferList.forEach(item => {
        addlist.push(item);
      });
      const data = workerUpdatedList.concat(addlist);
      setWorkerUpdatedList(data);

      const list = workerList.filter(ar => !addlist.find(rm => (rm.RowIndex === ar.RowIndex)));
      setWorkerList(list);
    }
  };

  //-- Header Action
  const [isShowWorkOrder, setIsShowWorkOrder] = useState(false);
  const [workOrder, setWorkOrder] = useState('');
  const _onChangeWorkOrder = data => {
    setWorkOrder(data);
    // _onChangWorkOrderShotcut(data);
    setIsShowWorkOrder(false);
  };


  const [isShowHours, setIsShowHours] = useState(false);
  const [hours, setHours] = useState('');
  const [hoursDisplay, setHoursDisplay] = useState('');
  const _onChangeHours = () => {
    let value = hoursDisplay.replace(/,/g, '.');
    setHoursDisplay(value);
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter hours must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    setHours(value);
    setIsShowHours(false);
  };
  const _onClearHours = () => {
    setHoursDisplay('');
    setHours('');
    setIsShowHours(false);
  };


  const _onChangWorkOrderShotcut = (value = workOrder) => {
    const isSpending = filter === SPENDING_TEXT;

    let data = isSpending ? [...workerList] : [...workerUpdatedList];
    if (!data.length) {
      return;
    }
    let array = [...data];
    array.map(i => {
      if (i.SELECTED) {
        i.WorkOrder = value;
        i.ColorWorkOrder = isSpending ? TEMP_COLOR_SPENDING : TEMP_COLOR_UPDATED;
        i.SUBMITED = false;
      }
      return i;
    });

    isSpending ? setWorkerList(array) : setWorkerUpdatedList(array);
  };
  const _onChangShiftShotcut = value => {
    const isSpending = filter === SPENDING_TEXT;

    let data = isSpending ? [...workerList] : [...workerUpdatedList];
    if (!data.length) {
      return;
    }
    let array = [...data];
    array.map(i => {
      if (i.SELECTED) {
        i.Shift = value;
        i.ColorShift = isSpending ? TEMP_COLOR_SPENDING : TEMP_COLOR_UPDATED;
        i.SUBMITED = false;
      }
      return i;
    });

    isSpending ? setWorkerList(array) : setWorkerUpdatedList(array);
  };
  const _onChangHoursShotcut = value => {
    const isSpending = filter === SPENDING_TEXT;

    let data = isSpending ? [...workerList] : [...workerUpdatedList];
    if (!data.length) {
      return;
    }
    let array = [...data];
    array.map(i => {
      if (i.SELECTED) {
        i.MHR = value;
        i.ColorHours = isSpending ? TEMP_COLOR_SPENDING : TEMP_COLOR_UPDATED;
        i.SUBMITED = false;
      }
      return i;
    });

    isSpending ? setWorkerList(array) : setWorkerUpdatedList(array);
  };
  const _onChangNoteShotcut = (value = note) => {
    const isSpending = filter === SPENDING_TEXT;

    let data = isSpending ? [...workerList] : [...workerUpdatedList];
    if (!data.length) {
      return;
    }
    let array = [...data];
    array.map(i => {
      if (i.SELECTED) {
        i.Note = value;
        i.ColorNote = isSpending ? TEMP_COLOR_SPENDING : TEMP_COLOR_UPDATED;
        i.SUBMITED = false;
      }
      return i;
    });

    isSpending ? setWorkerList(array) : setWorkerUpdatedList(array);
  };

  const [isShowNote, setIsShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [noteDisplay, setNoteDisplay] = useState(null);
  const _onChangeNote = () => {
    setNoteDisplay(noteDisplay);
    setNote(noteDisplay);
    // _onChangNoteShotcut(noteDisplay);
    setIsShowNote(false);
  };
  const _onClearNote = () => {
    setNoteDisplay('');
    setNote('');
    setIsShowNote(false);
  };





  const renderItem = ({ index, item }) => {
    return (
      <View
        style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellData}>{item.ID} - {item.Fullname}</Text>
          <View style={styles.cellCheckbox}>
            {
              filter === SPENDING_TEXT
                ?
                <CheckBox
                  value={!!item.SELECTED}
                  onValueChange={value => _onChangeCheckbox(value, index)}
                  style={styles.checkBox}
                  boxType='square'
                  disabled={false}
                  onCheckColor={OPP_COLOR}
                  onFillColor={BASE_COLOR}
                  onTintColor={BASE_COLOR}
                  tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
                  animationDuration={0.2}
                  onAnimationType='flat'
                />
                :
                <CheckBox
                  value={!!item.SELECTED}
                  onValueChange={value => _onChangeCheckboxUpdated(value, index)}
                  style={styles.checkBox}
                  boxType='square'
                  disabled={false}
                  onCheckColor={OPP_COLOR}
                  onFillColor={BASE_COLOR}
                  onTintColor={BASE_COLOR}
                  tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
                  animationDuration={0.2}
                  onAnimationType='flat'
                />
            }
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>LSX: </Text>
          {
            item.ColorWorkOrder
              ?
              item.ColorWorkOrder == TEMP_COLOR_SPENDING
                ?
                <Text style={styles.cellDataGreen}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
                :
                <Text style={styles.cellDataRed}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
              :
              <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Ca: </Text>
          {
            item.ColorShift
              ?
              item.ColorShift == TEMP_COLOR_SPENDING
                ?
                <Text style={styles.cellDataGreen}>{Formater.formatEmptyData(item.Shift)}</Text>
                :
                <Text style={styles.cellDataRed}>{Formater.formatEmptyData(item.Shift)}</Text>
              :
              <Text style={styles.cellData}>{Formater.formatEmptyData(item.Shift)}</Text>
          }
          <Text style={styles.cellTitle}>Giờ công: </Text>
          {
            item.ColorHours
              ?
              item.ColorHours == TEMP_COLOR_SPENDING
                ?
                <Text style={styles.cellDataGreen}>{item.MHR}</Text>
                :
                <Text style={styles.cellDataRed}>{item.MHR}</Text>
              :
              <Text style={styles.cellData}>{item.MHR}</Text>
          }
        </View>
        {
          item.Note
            ?
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Ghi chú: </Text>
              {
                item.ColorNote
                  ?
                  item.ColorNote == TEMP_COLOR_SPENDING
                    ?
                    <Text style={styles.cellDataGreen}>{Formater.formatEmptyData(item.Note)}</Text>
                    :
                    <Text style={styles.cellDataRed}>{Formater.formatEmptyData(item.Note)}</Text>
                  :
                  <Text style={styles.cellData}>{Formater.formatEmptyData(item.Note)}</Text>
              }
            </View>
            :
            null
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getTeamLeaderInfo)} />
        :
        <View style={styles.container}>
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.headerCellTitle}>Ngày:</Text>
              <View style={styles.headerCellData}>
                <Text style={styles.headerText}>{Formater.formatDateData(currentDate)}</Text>
                {
                  filter === SPENDING_TEXT
                    ?
                    <Text style={styles.textFilterSpending}>{filter}</Text>
                    :
                    <Text style={styles.textFilterUpdated}>{filter}</Text>
                }
              </View>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.headerCellTitle}>LSX:</Text>
              <View style={styles.headerCellAction}>
                <Text style={styles.headerText}>{workOrder}</Text>
                <Ionicons onPress={() => { setIsShowWorkOrder(true); }}
                  style={styles.headerIcon} name='md-list-outline' size={20} color={BASE_COLOR} />
                <FontAwesome5 onPress={() => { _onChangWorkOrderShotcut() }}
                  style={styles.headerIcon} name='clipboard-check' size={20} color={'green'} />
              </View>
            </View>
            <View style={styles.headerRow}>
              <View style={styles.headerCellShotcut}>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangShiftShotcut('HC')}>
                  <Text style={styles.headerShotcutText}>{'HC'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangShiftShotcut('Ca1')}>
                  <Text style={styles.headerShotcutText}>{'Ca1'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangShiftShotcut('Ca2')}>
                  <Text style={styles.headerShotcutText}>{'Ca2'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangShiftShotcut('Ca3')}>
                  <Text style={styles.headerShotcutText}>{'Ca3'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangShiftShotcut('Ca Lỡ')}>
                  <Text style={styles.headerShotcutText}>{'Ca Lỡ'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerRow}>
              <View style={styles.headerCellShotcut}>
                {/* <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangHoursShotcut('2')}>
                  <Text style={styles.headerShotcutText}>{'2'}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangHoursShotcut('4')}>
                  <Text style={styles.headerShotcutText}>{'4'}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangHoursShotcut('6')}>
                  <Text style={styles.headerShotcutText}>{'6'}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => _onChangHoursShotcut('8')}>
                  <Text style={styles.headerShotcutText}>{'8'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerShotcutItem} onPress={() => setIsShowHours(true)}>
                  <Text style={styles.headerShotcutText}>{hours}...</Text>
                </TouchableOpacity>
                <FontAwesome5 onPress={() => { _onChangHoursShotcut(hours) }}
                  style={styles.headerIcon} name='clipboard-check' size={20} color={'green'} />
              </View>
            </View>
            <View style={styles.headerRowMultiLine}>
              <Text style={styles.headerCellTitle}>Ghi chú:</Text>
              <View style={styles.headerCellAction}>
                <Text style={styles.headerText}>{note}</Text>
                <FontAwesomeIcon onPress={() => { setIsShowNote(true); }}
                  style={styles.headerIcon} name='pencil' size={20} color={BASE_COLOR} />
                <FontAwesome5 onPress={() => { _onChangNoteShotcut() }}
                  style={styles.headerIcon} name='clipboard-check' size={20} color={'green'} />
              </View>
            </View>
          </View>
          <View style={styles.headerRowAction}>
            {
              filter === SPENDING_TEXT
                ?
                <>
                  {/* <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressApplySelected}>
                    <Text style={styles.buttonTitle}>Gán công</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressCheckAll}>
                    <Text style={styles.buttonTitle}>Chọn tất cả</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressClearAll}>
                    <Text style={styles.buttonTitle}>Bỏ chọn</Text>
                  </TouchableOpacity>
                </>
                :
                <>
                  {/* <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressApplySelectedUpdated}>
                    <Text style={styles.buttonTitle}>Gán công</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressCheckAllUpdated}>
                    <Text style={styles.buttonTitle}>Chọn tất cả</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={_onPressClearAllUpdated}>
                    <Text style={styles.buttonTitle}>Bỏ chọn</Text>
                  </TouchableOpacity>
                </>
            }
          </View>
          {
            filter === SPENDING_TEXT
              ?
              workerList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={workerList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <ListEmptyData />
              :
              workerUpdatedList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={workerUpdatedList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <ListEmptyData />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManageWorker}>
              <Text style={styles.buttonTitle}>QL Công nhân</Text>
            </TouchableOpacity>
            {
              filter === SPENDING_TEXT
                ?
                <TouchableOpacity style={styles.buttonRight} onPress={_onPressTransfer}>
                  <Text style={styles.buttonTitle}>Chuyển</Text>
                </TouchableOpacity>
                : <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
                  <Text style={styles.buttonTitle}>Gửi Server</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
      }
      <SelectPopupTimeSheet
        visible={isShowWorkOrder}
        data={workOrderList}
        onChangeItem={_onChangeWorkOrder}
        onCancel={() => setIsShowWorkOrder(false)}
      />
      <Dialog.Container visible={isShowHours}>
        <Dialog.Title>{'Enter hours:'}</Dialog.Title>
        <Dialog.Input
          value={hoursDisplay}
          onChangeText={(text) => setHoursDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsShowHours(false) }} />
        <Dialog.Button label='Clear' onPress={_onClearHours} />
        <Dialog.Button label='OK' onPress={_onChangeHours} />
      </Dialog.Container>
      <Dialog.Container visible={isShowNote}>
        <Dialog.Title>{'Enter note:'}</Dialog.Title>
        <Dialog.Input
          value={noteDisplay}
          onChangeText={(text) => setNoteDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsShowNote(false) }} />
        <Dialog.Button label='Clear' onPress={_onClearNote} />
        <Dialog.Button label='OK' onPress={_onChangeNote} />
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  headerRowMultiLine: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  headerCellTitle: {
    flex: 2,
  },
  headerCellData: {
    flex: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCellAction: {
    flex: 7,
    flexDirection: 'row',
  },
  headerText: {
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  headerIcon: {
    marginLeft: 16,
    width: 24,
    height: 20,
  },
  headerCellShotcut: {
    height: '80%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerShotcutItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  headerShotcutText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  headerRowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  headerButton: {
    flex: 1,
    height: '100%',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  textFilterSpending: {
    fontWeight: 'bold',
    color: 'red',
  },
  textFilterUpdated: {
    fontWeight: 'bold',
    color: 'green',
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
    alignItems: 'flex-end',
    minHeight: 16,
    marginBottom: 4,
  },
  cellTitle: {
    height: '100%'
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellDataGreen: {
    flex: 7,
    fontWeight: 'bold',
    color: 'green',
  },
  cellDataRed: {
    flex: 7,
    fontWeight: 'bold',
    color: 'red',
  },
  cellCheckbox: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
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

export default TimeSheetScreen;