import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

// import { GetTestPackageDetailAPI, UpdateTestPackageDetailAPI } from '../../apis/piping/ConstructionAPI';
import { CreateMajorEquipmentTimesheetDailyAPI } from '../../apis/equipment/EquipmentAPI';

import Formater from '../../utils/Formater';
import Networker from '../../utils/Networker';

import Header from '../../components/Header';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const CreateEquipmentTimesheetDailyScreen = ({ route, navigation }) => {

  const { documentNo, equipmentCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [columnChange, setColumnChange] = useState([]);
  const [timesheetDetail, setTimesheetDetail] = useState({
    OperatorID: null,
    DocumentNo: documentNo,
    EquipmentCode: equipmentCode,
  });

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

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsUploading(false) });
  };


  const createTimesheetDetail = async () => {
    setIsUploading(true);
    CreateMajorEquipmentTimesheetDailyAPI(userLogin, timesheetDetail)
      .then(res => {
        setIsUploading(false);
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setColumnChange([]);
        } else {
          MessageAlert('Lỗi', res.Message.toString());
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
    callAPI(createTimesheetDetail, false);
  };

  //-- Update data
  const [keyUpdate, setKeyUpdate] = useState('');
  const _onSelectDate = key => {
    setKeyUpdate(key);
    var date = timesheetDetail[key];
    if (!date) {
      date = new Date();
    }
    setDateDisplay(date);
    setIsVisibleDate(true);

  };

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      timesheetDetail[keyUpdate] = selectedDate;

      //-- Save change
      if (!columnChange.includes(keyUpdate)) {
        columnChange.push(keyUpdate);
      }
    }
    setIsVisibleDate(false);
  };

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
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box} pointerEvents={isUploading ? 'none' : 'auto'}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Operator:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectOperator('OperatorID')}>
                    <Text style={isOperatorID ? styles.textGreen : styles.textAction}>{Formater.formatEmptyData(timesheetDetail.OperatorID)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={isOperatorID ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Plan Start:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('PlanStartDate')}>
                    <Text style={isPlanStartDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.PlanStartDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isPlanStartDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>Plan Finish:</Text>
                <View style={styles.cellData}>
                  <TouchableOpacity style={styles.containerAction} onPress={() => _onSelectDate('PlanFinishDate')}>
                    <Text style={isPlanFinishDate ? styles.textGreen : styles.textAction}>{Formater.formatDateDataTime(timesheetDetail.PlanFinishDate)}</Text>
                    <FontAwesomeIcon style={styles.iconAction} name='calendar' size={20} color={isPlanFinishDate ? EDITING_COLOR : BASE_COLOR} />
                  </TouchableOpacity>
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
      </View>
    );
  };

  const headerData = {
    'DocumentNo': documentNo,
    'Equip. Code': equipmentCode,
    'Suppervisor': userLogin,
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