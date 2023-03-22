import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Dialog from "react-native-dialog";
import Toast from 'react-native-simple-toast';

import { GetEquipmentLiftingPlanDetailAPI, GetEquipmentWastageReasonListAPI, UpdateEquipmentBookingDetailAPI } from '../../apis/equipment/EquipmentAPI';

import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';
import Helper from '../../utils/Helper';

import Header from '../../components/Header';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import SelectPopup from '../../components/SelectPopup';

const EquipmentLiftingPlanDetailScreen = ({ route, navigation }) => {

  const { id, name, category, project, department, item } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [bookingDetail, setBookingDetail] = useState({});
  const [wastageReasonList, setWastageReasonList] = useState([]);

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
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  useEffect(
    () => {
      // callAPI(getData);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };

  //-- Get
  const getData = async () => {
    await Promise.all(
      [
        GetEquipmentLiftingPlanDetailAPI(id),
        GetEquipmentWastageReasonListAPI()
      ]
    )
      .then(([bookingResult, wastageResult]) => {
        if (bookingResult.Success && wastageResult.Success) {
          setBookingDetail(bookingResult.Data);
          setWastageReasonList(wastageResult.Data);
          setIsLoading(false);
          setIsError(false);
          setIsUploading(false)
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false)
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false)
      });
  };

  //-- Update
  const updateSpoolDetail = async () => {
    setIsUploading(true);
    UpdateEquipmentBookingDetailAPI(bookingDetail, columnChange)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
        } else {
          MessageAlert('ERROR', res.Message.toString());
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  }
  const _onPressSubmitToServer = async () => {
    if (columnChange.length == 0) {
      Toast.show('Without any data changes!', Toast.SHORT);
      return;
    }
    callAPI(updateSpoolDetail, false);
  };

  //-- KEY
  const [keyUpdate, setKeyUpdate] = useState('');

  //-- Dates
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onPressDate = key => {
    setKeyUpdate(key);
    var date = Formater.formatDateDataTime(bookingDetail[key]);
    if (date) {
      setDateDisplay(new Date(date));
    }
    else {
      setDateDisplay(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate != undefined) {
      bookingDetail[keyUpdate] = Formater.formatDateDataTime(selectedDate);

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setIsVisibleDate(false);
  };

  //-- Wastage Reason
  const [isVisibleWastageReason, setVisibleWastageReason] = useState(false);
  const [wastageReason, setWastageReason] = useState('');
  const _onPressWastageReason = key => {
    setKeyUpdate(key);
    setWastageReason(bookingDetail[key]);
    setVisibleWastageReason(true);
  };
  const _onChangeWastageReason = reason => {
    if (reason !== wastageReason) {
      bookingDetail[keyUpdate] = reason;

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setVisibleWastageReason(false);
  };

  //-- Wastage Minute
  const [isVisibleWastageMinute, setVisibleWastageMinute] = useState(false);
  const [wastageMinute, setWastageMinute] = useState('');
  const _onPressWastageMinute = key => {
    setKeyUpdate(key);
    if (bookingDetail[key]) {
      setWastageMinute(bookingDetail[key].toString());
    }
    setVisibleWastageMinute(true);
  };
  const _onChangeWastageMinute = () => {
    // let value = wastageMinute.replace(/,/g, '.');
    if (!Helper.checkFormatInteger(wastageMinute)) {
      Toast.show('Please enter minute(s).', Toast.SHORT);
      return;
    }
    const value = parseInt(wastageMinute);
    if (value && (value < 0)) {
      Toast.show(keyUpdate + ' must be greater than 0.', Toast.SHORT);
      return;
    }

    //-- Save change
    if (!columnChange.includes(keyUpdate)) {
      columnChange.push(keyUpdate);
    }
    bookingDetail[keyUpdate] = value;
    setVisibleWastageMinute(false);
  };

  //-- Render
  const RenderDetail = () => {
    const isStartDate = columnChange.includes('StartDate_Actual');
    const isEndDate = columnChange.includes('EndDate_Actual');
    const isWasteReason = columnChange.includes('WasteReason');
    const isWastageTime_Minute = columnChange.includes('WastageTime_Minute');
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>StartDate:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatDateDataTime(item.StartDate)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>EndDate:</Text>
                <View style={styles.cellData}>
                  <View style={styles.containerAction}>
                    <Text style={styles.textBlue}>{Formater.formatDateDataTime(item.EndDate)}</Text>
                  </View>
                </View>
              </View>
              {/* <View style={styles.row}>
                <Text style={styles.cellTitle}>StartDate_Actual:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDate('StartDate_Actual')}>
                    <Text style={isStartDate_Actual ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(bookingDetail.StartDate_Actual)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isStartDate_Actual ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>EndDate_Actual:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressDate('EndDate_Actual')}>
                    <Text style={isEndDate_Actual ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(bookingDetail.EndDate_Actual)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isEndDate_Actual ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'WasteTime (min.)'}:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressWastageMinute('WastageTime_Minute')}>
                    <Text style={isWastageTime_Minute ? styles.textGreen : styles.textAction}>{Formater.formatZeroDigits(bookingDetail.WastageTime_Minute)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isWastageTime_Minute ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'WasteReason'}:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onPressWastageReason('WasteReason')}>
                    <Text style={isWasteReason ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(bookingDetail.WasteReason)}</Text>
                    <Ionicons style={styles.iconAction} name='md-list' size={20} color={isWasteReason ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View> */}
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
      </View >
    );
  };

  const headerData = {
    'Name': item.EquipmentName,
    'Category': item.EquipmentCategory,
    'Department': item.DepartmentCode,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getData) }} />
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
      <SelectPopup
        visible={isVisibleWastageReason}
        data={wastageReasonList}
        onChangeItem={_onChangeWastageReason}
        onCancel={() => setVisibleWastageReason(false)}
      />
      <Dialog.Container visible={isVisibleWastageMinute}>
        <Dialog.Title>{'Update Wastage Minute:'}</Dialog.Title>
        <Dialog.Input
          value={wastageMinute}
          onChangeText={(text) => setWastageMinute(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setVisibleWastageMinute(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeWastageMinute} />
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

export default EquipmentLiftingPlanDetailScreen;