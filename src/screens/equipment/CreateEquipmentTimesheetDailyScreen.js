import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Dialog from "react-native-dialog";
import Toast from 'react-native-simple-toast';

import { CreateMajorEquipmentTimesheetDailyAPI, UpdateMajorEquipmentTimesheetDailyAPI, DeleteMajorEquipmentTimesheetDailyAPI } from '../../apis/equipment/EquipmentAPI';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import Header from '../../components/Header';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const CreateEquipmentTimesheetDailyScreen = ({ route, navigation }) => {

  const { taskID, rowIndex, item, projectCode, facilityCode, documentNo, equipmentCode, userLogin, planStart, planFinish, constructionSupervisor, constructionSupervisorID } = route.params;

  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [timesheetDetail, setTimesheetDetail] = useState({
    TaskID: taskID,
    OperatorID: userLogin,
    SuppervisorID: constructionSupervisorID,
    ProjectCode: projectCode,
    FacilityCode: facilityCode,
    DocumentNo: documentNo,
    EquipmentCode: equipmentCode,
    PlanStartDate: planStart,
    PlanFinishDate: planFinish,
  });

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {
            rowIndex &&
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={_onPressDelete}>
              <Ionicons
                size={24}
                name={'trash-outline'} color={iconColor} />
            </TouchableOpacity>
          }
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
  }, [navigation, isShowDescription, isUpdate]);

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };

  useEffect(
    () => {
      if (rowIndex) {
        setTimesheetDetail(item);
        setIsUpdate(true);
      }
    }, []
  );

  const createTimesheetDetail = async () => {
    setIsUploading(true);
    CreateMajorEquipmentTimesheetDailyAPI(userLogin, timesheetDetail)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
          navigation.goBack();
        } else {
          MessageAlert('Lỗi', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };
  const updateTimesheetDetail = async () => {
    setIsUploading(true);
    UpdateMajorEquipmentTimesheetDailyAPI(userLogin, timesheetDetail, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
          navigation.goBack();
        } else {
          MessageAlert('Lỗi', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };
  const deleteTimesheetDetail = async () => {
    DeleteMajorEquipmentTimesheetDailyAPI(timesheetDetail)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          navigation.goBack();
        } else {
          MessageAlert('Lỗi', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };
  const _onPressSubmitToServer = async () => {
    if (columnChange.length == 0) {
      Toast.show('Without any data changes!', Toast.SHORT);
      return;
    }
    if (isUpdate) {
      callAPI(updateTimesheetDetail, false);
    }
    else {
      callAPI(createTimesheetDetail, false);
    }
  };
  const _onPressDelete = () => {
    Alert.alert(
      'Delete',
      'Are you sure want to delete?',
      [
        { text: 'Cancel' },
        { text: 'Delete', onPress: deleteTimesheetDetail, style: 'destructive' }
      ],
      { cancelable: false }
    );
  };

  //-- Update data
  const [keyUpdate, setKeyUpdate] = useState('');

  //-- Date
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onSelectDate = key => {
    setKeyUpdate(key);
    var date = timesheetDetail[key];
    if (!date) {
      date = new Date();
    }
    setDateDisplay(new Date(date));
    setIsVisibleDate(true);
  };
  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      timesheetDetail[keyUpdate] = Formater.formatDateDataTime(selectedDate);

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setIsVisibleDate(false);
  };

  //-- Number
  const [isVisibleNumber, setIsVisibleNumber] = useState(false);
  const [numberDisplay, setNumberDisplay] = useState('');
  const _onPressSelectNumber = (key) => {
    setKeyUpdate(key);
    var value = timesheetDetail[key];
    if (value) {
      value = value.toString();
    } else {
      value = '';
    }
    setNumberDisplay(value);
    setIsVisibleNumber(true);
  };
  const _onChangeNumber = () => {
    let value = numberDisplay.replace(/,/g, '.');
    setNumberDisplay(value);
    if (!Helper.checkFormatNegativeNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    timesheetDetail[keyUpdate] = value;

    //-- Save change
    if (!columnChange.includes(keyUpdate)) {
      columnChange.push(keyUpdate);
    }
    setIsVisibleNumber(false);
  };

  //-- Text
  const [isVisibleText, setIsVisibleText] = useState(false);
  const [textDisplay, setTextDisplay] = useState('');
  const _onPressSelectText = (key) => {
    setKeyUpdate(key);
    var value = timesheetDetail[key];
    if (value) {
      value = value.toString();
    } else {
      value = '';
    }
    setTextDisplay(value);
    setIsVisibleText(true);
  };
  const _onChangeText = () => {
    const text = textDisplay.trim();
    setTextDisplay(text);

    timesheetDetail[keyUpdate] = text;

    //-- Save change
    if (!columnChange.includes(keyUpdate)) {
      columnChange.push(keyUpdate);
    }
    setIsVisibleText(false);
  };

  //-- Operator
  const _onSelectOperator = key => {
    setKeyUpdate(key);
    navigation.navigate(
      'MajorEquipmentUserList',
      {
        callBack: (data) => {
          if (data) {
            setTimesheetDetail((prevObject) => ({
              ...prevObject,
              OperatorID: data,
            }));
            if (!columnChange.includes(key)) {
              columnChange.push(key);
            }
          }
        }
      }
    );
  };

  //-- Render
  const RenderDetail = () => {
    const isOperatorID = columnChange.includes('OperatorID');
    const isPlanStartDate = columnChange.includes('PlanStartDate');
    const isPlanFinishDate = columnChange.includes('PlanFinishDate');
    const isActualStartDate = columnChange.includes('ActualStartDate');
    const isActualFinishDate = columnChange.includes('ActualFinishDate');
    const isStartKms = columnChange.includes('Start_kms');
    const isFinishKms = columnChange.includes('Finish_kms');
    const isStartHours = columnChange.includes('Start_hours');
    const isFinishHours = columnChange.includes('Finish_hours');
    const isWastedMinutes = columnChange.includes('Wasted_minutes');
    const isWastedCause = columnChange.includes('WastedCause');
    return (
      <ScrollView style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Operator:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}
                  // onPress={() => _onSelectOperator('OperatorID')}
                  >
                    <Text style={isOperatorID ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(timesheetDetail.OperatorID)}</Text>
                    {/* <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isOperatorID ? EDITING_COLOR : BASE_COLOR} /> */}
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Plan Start:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}
                  // onPress={() => _onSelectDate('PlanStartDate')}
                  >
                    <Text style={isPlanStartDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.PlanStartDate)}</Text>
                    {/* <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isPlanStartDate ? EDITING_COLOR : BASE_COLOR} /> */}
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Plan Finish:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}
                  // onPress={() => _onSelectDate('PlanFinishDate')}
                  >
                    <Text style={isPlanFinishDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.PlanFinishDate)}</Text>
                    {/* <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isPlanFinishDate ? EDITING_COLOR : BASE_COLOR} /> */}
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Actual Start</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('ActualStartDate')}>
                    <Text style={isActualStartDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.ActualStartDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isActualStartDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Actual Finish:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('ActualFinishDate')}>
                    <Text style={isActualFinishDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.ActualFinishDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isActualFinishDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text>{'Kms Start:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectNumber('Start_kms')}>
                    <Text style={isStartKms ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(timesheetDetail.Start_kms)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isStartKms ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text>{'Kms Finish:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectNumber('Finish_kms')}>
                    <Text style={isFinishKms ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(timesheetDetail.Finish_kms)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFinishKms ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text>{'Hours Start:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectNumber('Start_hours')}>
                    <Text style={isStartHours ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(timesheetDetail.Start_hours)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isStartHours ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text>{'Hours Finish:'}</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectNumber('Finish_hours')}>
                    <Text style={isFinishHours ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(timesheetDetail.Finish_hours)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isFinishHours ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Wasted Time (min):</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectNumber('Wasted_minutes')}>
                    <Text style={isWastedMinutes ? styles.textGreen : styles.textAction}>{Formater.formatTwoDigits(timesheetDetail.Wasted_minutes)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isWastedMinutes ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Wasted Cause:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressSelectText('WastedCause')}>
                    <Text style={isWastedCause ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(timesheetDetail.WastedCause)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isWastedCause ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              {
                isUploading
                  ?
                  <TouchableOpacity style={styles.button}>
                    <ActivityIndicator size='large' color={'white'} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                    <Text style={styles.buttonTitle}>Submit to Server</Text>
                  </TouchableOpacity>
              }
            </View>
          </>
        }
      </ScrollView>
    );
  };

  const headerData = {
    'Cons\nSupervisor': constructionSupervisor,
    'Project': projectCode,
    'Facility': facilityCode,
    'Doc. No': documentNo,
    'Equip. Code': equipmentCode,
    // 'Suppervisor': userLogin,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            <RenderDetail />
          </View>
      }
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={dateDisplay}
        mode={'datetime'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />
      <Dialog.Container visible={isVisibleNumber}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={numberDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setNumberDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleNumber(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeNumber} />
      </Dialog.Container>
      <Dialog.Container visible={isVisibleText}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={textDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setTextDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleText(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeText} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const EDITING_COLOR = 'green';
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

  table: {
    flexGrow: 1,
  },
  box: {
    width: '100%',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 4,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    alignItems: 'flex-end'
  },
  containerAction: {
    flexDirection: 'row',
  },
  textAction: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textGreen: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'green',
  },
  textBlue: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontWeight: 'bold',
    color: 'blue',
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
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default CreateEquipmentTimesheetDailyScreen;