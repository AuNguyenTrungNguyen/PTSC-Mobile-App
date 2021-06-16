import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import Helper from '../../../utils/Helper';
import MessageAlert from '../../../components/MessageAlert';

import { GetManpowerListAPI } from '../../../apis/report/ReportAPI';



const ReportDailyManpowerListScreen = ({ route }) => {

  const { projectCode, username } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [manPowerList, setManpowerList] = useState(null);

  const _onChangeDate = (selectedDate) => {
    setShowPicker(false);
    if (selectedDate != undefined) {
      setSelectedDate(selectedDate);
      callAPI(() => { getManPowerList(selectedDate) });
    }
  };

  const callAPI = executedAPI => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        MessageAlert('WARNING', 'Network not available!');
        setIsSearching(false);
        setIsError(true);
      } else {
        setIsSearching(true);
        executedAPI();
      }
    });
  };

  const getManPowerList = async date => {
    let token = await Helper.getData('TOKEN');
    GetManpowerListAPI(projectCode, username, Moment(date).format("YYYY-MM-DD"), token)
      .then(res => {
        if (res.success) {
          setManpowerList(res.data);
          setIsSearching(false);
          setIsError(false);

        } else {
          setIsSearching(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsSearching(false);
        setIsError(true);
      });
  };





  const formatDateData = date => {
    return date == null ? 'Select a date' : Moment(date).format("YYYY-MM-DD");
  };

  const formatDatePicker = date => {
    return date == null ? new Date() : date;
  };

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Select a date to view details</Text>
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data</Text>
    </View>
  );

  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListErrorData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>An error occured while executing your request</Text>
      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => { callAPI(() => getManPowerList(selectedDate)) }}>
        <Icon name='sync-circle-outline' size={36} color={BASE_COLOR} />
      </TouchableOpacity>
    </View>
  );

  const RenderManpowerList = () => {
    {
      if (isSearching) {
        return <ListSearchData />
      } else if (isError) {
        return <ListErrorData />
      } else if (manPowerList == null) {
        return <ListSelectData />
      } else if (!manPowerList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={manPowerList}
          getItemCount={(data) => data.length}
          getItem={(data, index) => {
            return data[index];
          }}
          keyExtractor={(item) => {
            return item.RowIndex;
          }}
          renderItem={renderItem}
        />
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>FacilityCode: </Text>
            <Text style={styles.textData}>{item.FacilityCode}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Discipline: </Text>
            <Text style={styles.textData}>{item.Discipline}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Title: </Text>
            <Text style={styles.textData}>{item.TitleType}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Manpower: </Text>
            <Text style={styles.textData}>{item.Manpower}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.rowInfo}>
            <Text style={styles.infoTitle}>Login User:</Text>
            <Text style={styles.infoData}>{username}</Text>
          </View>
          <TouchableOpacity
            style={styles.rowAction}
            onPress={() => { setShowPicker(true) }}>
            <Text style={styles.buttonTitle}>{formatDateData(selectedDate)}</Text>
          </TouchableOpacity>
        </View>
        <RenderManpowerList />
        <DateTimePickerModal
          isVisible={showPicker}
          date={formatDatePicker(selectedDate)}
          headerTextIOS={'Select a date'}
          mode={'date'}
          onConfirm={_onChangeDate}
          onCancel={() => { setShowPicker(false) }}
        />
      </View>
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
    flex: 1,
    padding: 12,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    padding: 4,
    paddingBottom: 0,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
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
  rowAction: {
    height: 36,
    width: '100%',
    backgroundColor: BASE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 4,
  },
  buttonTitle: {
    color: OPP_COLOR,
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
    fontSize: 16,
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
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textTitle: {
    flex: 1,
  },
  textData: {
    flex: 1.5,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
});

export default ReportDailyManpowerListScreen;