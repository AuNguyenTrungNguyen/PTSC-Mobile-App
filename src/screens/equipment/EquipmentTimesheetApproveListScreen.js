import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, Keyboard, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Networker from '../../utils//Networker';
import Constant from '../../utils/Constant';
import Formater from '../../utils/Formater';
import Helper from '../../utils/Helper';

import { CheckSupervisorPermissionAPI, GetMajorEquipmentTimesheetApproveListAPI, UpdateMajorEquipmentTimesheetApproveListAPI } from '../../apis/equipment/EquipmentAPI';

import { ListLoadingData, ListEmptyData } from '../../components/HelperUI';
import LoadingRefresh from '../../components/LoadingRefresh';
import SelectPopup from '../../components/SelectPopup';

const EquipmentTimesheetApproveListScreen = ({ route, navigation }) => {

  const { userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [dataList, setDataList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
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

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = executedAPI => {
    setIsSearching(true);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };
  useEffect(
    async () => {
      callAPI(getEquipmentPermission);
    }, []
  );

  //-- Permission
  const getEquipmentPermission = async () => {
    const userLogin = await Helper.getData('USERNAME');
    CheckSupervisorPermissionAPI(userLogin)
      .then(res => {
        if (res.Success && res.Data && res.Data.Permission) {
          callAPI(getDataList);
        } else {
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
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  //-- Search Action
  const _onPressSearchTimesheet = () => {
    Keyboard.dismiss();
    callAPI(getDataList);
  };
  const getDataList = async (filter = filterType) => {
    // const getDataList = async (filter = filterType, date = dateDisplay) => {
    // date = Formater.formatDateWithoutTimeSQL(date);
    GetMajorEquipmentTimesheetApproveListAPI(userLogin, filter)
      .then(res => {
        if (res.Success && res.Data) {
          setDataList(res.Data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };


  //-- FilterType
  const [isVisibleFilterType, setIsVisibleFilterType] = useState(false);
  const [filterType, setFilterType] = useState(Constant.STATUS_NOT_YET);
  const _onChangeFilterType = value => {
    if (value !== filterType) {
      setFilterType(value);
      callAPI(() => { getDataList(value) });
      // callAPI(() => { getDataList(value, dateDisplay) });
    }
    setIsVisibleFilterType(false);
  };

  //-- Date
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onPressSelectDate = () => {
    if (dateDisplay) {
      setDateDisplay(new Date(Moment(dateDisplay).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate) {
      setDateDisplay(selectedDate);
      callAPI(() => { getDataList(filterType, selectedDate) });
    }
    setIsVisibleDate(false);
  };
  const _onCancelDate = () => {
    setIsVisibleDate(false);
  };

  //-- Update Data
  const [updateList, setUpdateList] = useState([]);
  const onChangeData = (value, index, key) => {
    let array = [...dataList];
    array[index][key] = value;
    setDataList(array);

    array = [...updateList];
    const rowIndex = dataList[index].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [key]: value });
    } else {
      array[objIndex][key] = value;
    }
    setUpdateList(array);
  };
  const _onPressChangeStatus = (value, index, key) => {
    onChangeData(value, index, key);
  };

  //-- Update Action
  const _onPressSubmitToServer = async () => {
    if (updateList.length) {
      callAPI(updateDataList);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };
  const updateDataList = async () => {
    const list = Helper.handleListUpdate(updateList);
    UpdateMajorEquipmentTimesheetApproveListAPI(userLogin, list)
      .then(res => {
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          MessageAlert('Lỗi', res.Message.toString());
        }
        callAPI(getDataList);
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  };

  //-- Render List
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>OperatorID:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.OperatorID)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Operator Name:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.OperatorName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Doc. No:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.DocumentNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Equip. Code:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.EquipmentCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Plan Start:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.PlanStartDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Plan Finish:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.PlanFinishDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Actual Start:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.ActualStartDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Actual Finish:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatDateDataTime(item.ActualFinishDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>{'Kms Start:'}</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.Start_kms)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>{'Kms Finish:'}</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.Finish_kms)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>{'Hours Start:'}</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.Start_hours)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>{'Hours Finish:'}</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.Finish_hours)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Wasted Time (min):</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatTwoDigits(item.Wasted_minutes)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Wasted Cause:</Text>
          </View>
          <View style={styles.cellThree}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WastedCause)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTwo}>
            <Text>Result:</Text>
          </View>
          <View style={styles.cellThree}>
            {
              item.TimesheetResult == 'ACC'
                ?
                <Text style={styles.textAccept}>{Formater.formatEmptyData(item.TimesheetResult)}</Text>
                :
                item.TimesheetResult == 'REJ'
                  ?
                  <Text style={styles.textReject}>{Formater.formatEmptyData(item.TimesheetResult)}</Text>
                  :
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.TimesheetResult)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellThree}>
          </View>
          <View style={styles.cellThreeAction}>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => _onPressChangeStatus(Constant.STATUS_ACCEPT, index, 'TimesheetResult')}>
              <Text style={styles.labelAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellThree}>
          </View>
          <View style={styles.cellThreeAction}>
            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => _onPressChangeStatus(Constant.STATUS_REJECT, index, 'TimesheetResult')}>
              <Text style={styles.labelReject}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellThree}>
          </View>
        </View>
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDataList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  {/* <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Date:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { _onPressSelectDate() }}>
                      <Text style={styles.buttonTitleDark}>{Formater.formatDateData(dateDisplay)}</Text>
                    </TouchableOpacity>
                  </View> */}
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Filter Type:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleFilterType(true) }}>
                      <Text style={styles.buttonTitleDark}>{filterType}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchTimesheet}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Timesheet</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              dataList && dataList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={dataList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => data[index]}
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
        visible={isVisibleFilterType}
        data={[Constant.STATUS_NOT_YET, Constant.STATUS_ACCEPT, Constant.STATUS_REJECT]}
        onCancel={() => setIsVisibleFilterType(false)}
        onChangeItem={_onChangeFilterType} />
      {/* <DateTimePickerModal
        isVisible={isVisibleDate}
        date={new Date(Formater.formatDateDataTime(dateDisplay))}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={_onCancelDate} /> */}
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
    minHeight: 24,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
    // fontWeight: 'bold',
    // color: BASE_COLOR,
    // textAlign: 'center',
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    // textAlign: 'center',
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
  },
  selectInput: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    minHeight: 20,
  },
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
    color: BASE_COLOR,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 4,
  },
  headerCellTitle: {
    flex: 3,
  },
  headerCellData: {
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
  buttonAction: {
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
});

export default EquipmentTimesheetApproveListScreen;