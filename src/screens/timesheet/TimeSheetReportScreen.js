import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Networker from '../../utils/Networker';
import Helper from '../../utils/Helper';

import { GetTimeSheetReportAPI } from '../../apis/timesheet/TimeSheetAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../components/HelperUI';
import LoadingRefresh from '../../components/LoadingRefresh';
import Formater from '../../utils/Formater';

const TimeSheetReportScreen = ({ route, navigation }) => {

  const WORK_ORDER_TYPE = 'WorkOrder';
  const SHIFT_TYPE = 'Shift';
  const STATUS_TYPE = 'Status';

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [filterType, setFilterType] = useState(null);

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());

  const [reportList, setReportList] = useState(null);
  // const [reportWorkOrderList, setReportWorkOrderList] = useState(null);
  // const [reportShiftList, setReportShiftList] = useState(null);
  // const [reportStatusList, setReportStatusList] = useState(null);

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
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Date
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
      callAPI(() => { showReport(filterType, selectedDate) }, false);
    }
    setIsVisibleDate(false);
  };
  const _onCleareDate = () => {
    setIsVisibleDate(false);
  };

  //-- Load Action
  const _onPressLoadData = type => {
    setFilterType(type);
    callAPI(() => { showReport(type, dateDisplay) }, false);
  };
  const showReport = async (type, date) => {
    setIsSearching(true);
    const token = await Helper.getData('TOKEN');
    date = Formater.formatDateWithoutTimeSQL(date);
    GetTimeSheetReportAPI(projectCode, userLogin, date, token)
      .then(res => {
        if (res.Success) {
          if (type === WORK_ORDER_TYPE) {
            setReportList(res.Data.WorkOrder);
          }
          if (type === SHIFT_TYPE) {
            setReportList(res.Data.Shift);
          }
          if (type === STATUS_TYPE) {
            setReportList(res.Data.Status);
          }
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





  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        {
          filterType === WORK_ORDER_TYPE &&
          <>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatEmptyData(item.WorkOrder)} </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text>Workers:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatZeroDigits(item.TotalWorker)} </Text>
              </View>
              <View style={styles.cell}>
                <Text>MHRS:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatZeroDigits(item.TotalMHRS)} </Text>
              </View>
            </View>
          </>
        }
        {
          filterType === SHIFT_TYPE &&
          <>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatEmptyData(item.Shift)} </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text>Workers:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatZeroDigits(item.TotalWorker)} </Text>
              </View>
              <View style={styles.cell}>
                <Text>MHRS:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatZeroDigits(item.TotalMHRS)} </Text>
              </View>
            </View>
          </>
        }
        {
          filterType === STATUS_TYPE &&
          <>
            <View style={styles.rowLine}>
              <View style={styles.cell}>
                <Text>Completed: </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.textCompleted}>{Formater.formatZeroDigits(item.TotalCompleted)} </Text>
              </View>
            </View>
            <View style={{ backgroundColor: BASE_COLOR, height: 1, width: '100%', marginVertical: 8 }} />
            <View style={styles.rowLine}>
              <View style={styles.cell}>
                <Text>Pending: </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.textPending}>{Formater.formatZeroDigits(item.Remain)} </Text>
              </View>
            </View>
            <View style={{ backgroundColor: BASE_COLOR, height: 1, width: '100%', marginVertical: 8 }} />
            <View style={styles.rowLine}>
              <View style={styles.cell}>
                <Text>Total: </Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{Formater.formatZeroDigits(item.TotalWorker)} </Text>
              </View>
            </View>
          </>
        }
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (reportList == null) {
        return <ListSelectData title={'Select Type to view Report'} />
      } else if (!reportList.length) {
        return <ListEmptyData />
      } else {
        return <></>
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(() => { showReport(filterType, dateDisplay) }, true) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                <View style={styles.headerContainer}>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Project:</Text>
                    <Text style={styles.headerCellData}>{projectCode}</Text>
                    <Text style={styles.headerCellTitle}>Leader:</Text>
                    <Text style={styles.headerCellData}>{userLogin}</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCellTitle}>Date:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { _onPressSelectDate() }}>
                      <Text style={styles.buttonTitleDark}>{Formater.formatDateData(dateDisplay)}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerRow}>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={() => { _onPressLoadData(WORK_ORDER_TYPE) }}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Work Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={() => { _onPressLoadData(SHIFT_TYPE) }}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Shift</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={() => { _onPressLoadData(STATUS_TYPE) }}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Status</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                null
            }
            {
              !isSearching && reportList && reportList.length
                ?
                <>
                  {/* {
                    filterType &&
                    <View style={styles.box}>
                      <Text style={CoreStyle.textNote}>{Formater.formatEmptyData(filterType)}</Text>
                    </View>
                  } */}
                  <VirtualizedList
                    style={styles.table}
                    data={reportList}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                    ItemSeparatorComponent={
                      () => {
                        return (
                          <View style={{ backgroundColor: BASE_COLOR, height: 1, width: '100%' }} />
                        );
                      }
                    }
                  />
                </>
                :
                <RenderList />
            }
          </View>
      }
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={new Date(Moment(dateDisplay).format("YYYY-MM-DDT00:00:00"))}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={_onCleareDate}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 4,
  },
  headerCellTitle: {
    flex: 1,
  },
  headerCellData: {
    flex: 2,
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
  searchButton: {
    flex: 1,
    marginHorizontal: 2,
    borderColor: BASE_COLOR,
    height: '100%',
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
    borderRadius: 4,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 8,
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textCompleted: {
    fontWeight: 'bold',
    color: 'green',
  },
  textPending: {
    fontWeight: 'bold',
    color: 'red',
  },


  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default TimeSheetReportScreen;
