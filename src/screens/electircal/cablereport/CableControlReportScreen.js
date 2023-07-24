import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Appearance, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { GetEITCableControlReportAPI } from '../../../apis/eit/EITAPI';

import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import Header from '../../../components/Header';
import LoadingRefresh from '../../../components/LoadingRefresh';

const CableControlReportScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [cableDetail, setCableDetail] = useState({});

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
      callAPI(getCableReport);
    }, []
  );

  const callAPI = (executedAPI) => {
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
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
      let date = new Date(selectedDate);
      date.setSeconds(date.getSeconds() - (date.getTimezoneOffset() * 60));
      setDateDisplay(date);
      callAPI(() => { getCableReport(date, user) }, false);
    }
    setIsVisibleDate(false);
  };
  const _onCloseDate = () => {
    setIsVisibleDate(false);
  };

  //-- Get
  const getCableReport = (selectedDate, selectedUser) => {
    let temp = new Date();
    if (selectedDate) {
      temp = new Date(selectedDate);
    }
    temp.setSeconds(temp.getSeconds() - (temp.getTimezoneOffset() * 60));
    const date = Moment(temp).format('YYYY-MM-DD');
    const user = selectedUser ? selectedUser : '';
    GetEITCableControlReportAPI(projectCode, user, date)
      .then(res => {
        if (res.Success && res.Data) {
          setCableDetail(res.Data);
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

  //-- Render
  const RenderDetail = () => {
    return (
      <View style={styles.table}>
        {
          <>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>Daily </Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.Current)}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.DailyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.DailyLenght)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>{'Weekly (from '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.WeekStart)}</Text>
                  <Text>{' to '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.WeekEnd)}</Text>
                  <Text>{')'}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.WeeklyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.WeeklyLength)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>
                  <Text>{'Monthly (from '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.MonthStart)}</Text>
                  <Text>{' to '}</Text>
                  <Text style={styles.textBold}>{Formater.formatDateData(cableDetail.MonthEnd)}</Text>
                  <Text>{')'}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cellTitle}>{'Num of\nCables'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textBlue}>{Formater.formatZeroDigits(cableDetail.MonthlyCount)}</Text>
                </View>
                <Text style={styles.cellTitle}>{'Total\nLength'}:</Text>
                <View style={styles.cellData}>
                  <Text style={styles.textGreen}>{Formater.formatTwoDigits(cableDetail.MonthlyLength)}</Text>
                </View>
              </View>
            </View>
          </>
        }
      </View >
    );
  };

  const headerData = {
    'ProjectCode': projectCode,
    // 'UserLogin': userLogin,
  };

  const [user, setUser] = useState('');
  const _onChangeUser = text => {
    setUser(text);
  };
  const _onSearch = () => {
    callAPI(() => { getCableReport(dateDisplay, user) }, false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(getCableReport) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <>
                <Header data={headerData} />
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction}>CableName:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={user}
                      onChangeText={_onChangeUser}
                      underlineColorAndroid='transparent'
                    />
                    {
                      user == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeUser('')} style={styles.inputIcon} />
                    }
                    <Icon name='search' onPress={() => _onSearch('')} style={styles.inputIcon} />
                  </View>
                </View>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellTitle}>Date:</Text>
                  <TouchableOpacity style={styles.headerCellSelect} onPress={() => { _onPressSelectDate() }}>
                    <Text style={styles.buttonTitleDark}>{Formater.formatDateData(dateDisplay)}</Text>
                  </TouchableOpacity>
                </View></>
            }
            <RenderDetail />
          </View>
      }
      <DateTimePickerModal
        isVisible={isVisibleDate}
        date={new Date(Moment(dateDisplay).format("YYYY-MM-DDT00:00:00"))}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={_onCloseDate}
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
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
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
  cellTitle: {
    flex: 1,
  },
  cellData: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  textBold: {
    fontWeight: 'bold',
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginBottom: 4,
  },
  headerCellTitle: {
    flex: 3,
  },
  headerCellSelect: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default CableControlReportScreen;