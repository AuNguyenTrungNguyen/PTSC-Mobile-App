import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetTimeSheetWorkOrderListAPI, GetTimeSheetWorkerListAPI, UpdateTimeSheetListlAPI } from '../../apis/general/GeneralAPI';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import Header from '../../components/Header';
import SelectPopupTimeSheet from '../../components/timesheet/SelectPopupTimeSheet';
import { ListEmptyData } from '../../components/HelperUI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const TimeSheetScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [workerList, setWorkerList] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [timeSheetUpdateList, setTimeSheetUpdateList] = useState([]);

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
      callAPI(getAllData);
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

  const callAPI = (executedAPI, isLoading = true) => {
    if (isLoading) {
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

  const _onPressSubmitToServer = async () => {
    if (timeSheetUpdateList.length) {
      callAPI(updateTimeSheetList, false);
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

  const _onPressApplyAll = () => {
    let array = [...workerList];
    let update = [];
    array.map(i => {
      i.WorkOrder = workOrder;
      i.Date = dateDisplay;
      i.MHR = hours;
      i.Overtime = overtime;

      update.push(i);
      return i;
    });
    setWorkerList(array);
    setTimeSheetUpdateList(update);
  };

  const _onPressApplySelected = () => {
    let array = [...workerList];
    let update = [];
    array.map(i => {
      if (i.Selected) {
        i.WorkOrder = workOrder;
        i.Date = dateDisplay;
        i.MHR = hours;
        i.Overtime = overtime;

        update.push(i);
      }
      return i;
    });
    setWorkerList(array);
    setTimeSheetUpdateList(update);
  };

  const getAllData = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      let arrayPromise = [
        GetTimeSheetWorkerListAPI(userLogin, token),
        GetTimeSheetWorkOrderListAPI(projectCode, userLogin, token),
      ];
      await Promise.all(arrayPromise)
        .then(([wokerResult, workOrderResult]) => {
          if (wokerResult.success && workOrderResult.success) {
            setWorkerList(wokerResult.data);
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
        });;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setIsUploading(false);
      MessageAlert('ERROR', error.toString());
    }
  };

  const updateTimeSheetList = async () => {
    let token = await Helper.getData('TOKEN');
    setIsUploading(true);
    timeSheetUpdateList.map(item => {
      item.ProjectCode = projectCode;
      item.Code = 'Mobile_Test';
      return item;
    });
    UpdateTimeSheetListlAPI(userLogin, timeSheetUpdateList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setTimeSheetUpdateList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const [isShowWorkOrder, setIsShowWorkOrder] = useState(false);
  const [workOrder, setWorkOrder] = useState();
  const _onChangeWorkOrder = data => {
    setWorkOrder(data)
    setIsShowWorkOrder(false);
  };

  const [isShowPicker, setIsShowPicker] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onChangeDate = selectedDate => {
    if (selectedDate != undefined) {
      setDateDisplay(selectedDate);
    }
    setIsShowPicker(false);
  };

  const [isShowHours, setIsShowHours] = useState(false);
  const [hours, setHours] = useState(8);
  const [hoursDisplay, setHoursDisplay] = useState('8');
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

  const [isShowOvertime, setIsShowOvertime] = useState(false);
  const [overtime, setOvertime] = useState(0);
  const [overtimeDisplay, setOvertimeDisplay] = useState('0');
  const _onChangeOvertime = () => {
    let value = overtimeDisplay.replace(/,/g, '.');
    setOvertimeDisplay(value);
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter overtime must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    setOvertime(value);
    setIsShowOvertime(false);
  };





  const renderItem = ({ index, item }) => {
    return (
      <View
        style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellData}>{item.ID} - {item.Fullname}</Text>
          <View style={styles.cellCheckbox}>
            <CheckBox
              value={item.Selected}
              onValueChange={newValue => item.Selected = newValue}
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
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitleWorkOrder}>WorkOrder: </Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.WorkOrder)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>MHR:</Text>
          <Text style={styles.cellTime}>{item.MHR}</Text>
          <Text style={styles.cellTitle}>Overtime:</Text>
          <Text style={styles.cellOverTime}>{item.Overtime}</Text>
        </View>
      </View>
    );
  };

  const headerData = {
    'TeamLeader': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchLamCheckTodoList(drawingNo, jointNo) }) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData}></Header>
          }
          <View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>Date:</Text>
              <TouchableOpacity style={styles.headerActionContainer} onPress={() => setIsShowPicker(true)}>
                <Text style={styles.textAction}>{Formater.formatDateData(dateDisplay)}</Text>
                <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>WorkOrder:</Text>
              <TouchableOpacity style={styles.headerActionContainer} onPress={() => setIsShowWorkOrder(true)}>
                <Text style={styles.textAction}>{Formater.formatEmptyData(workOrder)}</Text>
                <Ionicons style={styles.iconAction} name='md-list-outline' size={20} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>Hours:</Text>
              <TouchableOpacity style={styles.headerActionContainer} onPress={() => { setHoursDisplay(hours.toString()); setIsShowHours(true); }}>
                <Text style={styles.textAction}>{hours}</Text>
                <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>Overtime:</Text>
              <TouchableOpacity style={styles.headerActionContainer} onPress={() => { setOvertimeDisplay(overtime.toString()); setIsShowOvertime(true); }}>
                <Text style={styles.textAction}>{overtime}</Text>
                <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerActionRow}>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={_onPressApplyAll}>
              <Text style={styles.buttonTitle}>Apply All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={_onPressApplySelected}>
              <Text style={styles.buttonTitle}>Apply Selected</Text>
            </TouchableOpacity>
          </View>
          {
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
      <DateTimePickerModal
        isVisible={isShowPicker}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsShowPicker(false) }}
      />
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
        <Dialog.Button label='OK' onPress={_onChangeHours} />
      </Dialog.Container>
      <Dialog.Container visible={isShowOvertime}>
        <Dialog.Title>{'Enter overtime:'}</Dialog.Title>
        <Dialog.Input
          value={overtimeDisplay}
          onChangeText={(text) => setOvertimeDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsShowOvertime(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeOvertime} />
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
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  headerCellTitle: {
    flex: 3,
  },
  headerActionContainer: {
    flexDirection: 'row',
    flex: 7,
  },
  headerActionButton: {
    flex: 1,
    height: '100%',
    padding: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
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
  cellTitleWorkOrder: {
    height: '100%'
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellTime: {
    flex: 3,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellOverTime: {
    flex: 3,
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

export default TimeSheetScreen;