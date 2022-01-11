import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Alert, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  GetTimeSheetAllWorkerListAPI,
  UpdateTimeSheetWorkerListAPI
} from '../../apis/timesheet/TimeSheetAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../components/HelperUI';
import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';
import Formater from '../../utils/Formater';
import Header from '../../components/Header';
import SelectPopup from '../../components/SelectPopup';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const TimeSheetManageWorkerScreen = ({ route, navigation }) => {

  const { userLogin, department, fullname } = route.params;

  const [workerId, setWorkerId] = useState('');
  const [workerName, setWorkerName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.FILTER_THEIR);
  const _onChangeType = data => {
    if (data != type) {
      setType(data);
      callAPI(() => { searchWorker(workerId, workerName, data) });
    }
    setIsVisibleType(false);
  };

  const [workerList, setWorkerList] = useState(null);
  const [workerUpdateList, setWorkerUpdateList] = useState([]);
  const [workerSelected, setWorkerSelected] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleType(true) }}>
            <Ionicons
              size={24}
              name={'md-ellipsis-vertical-circle'} color={iconColor} />
          </TouchableOpacity>
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

  const callAPI = (executedAPI, loading) => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
    }
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsSearching(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const _onChangeWorkerID = id => {
    setWorkerId(id);
  };

  const _onChangeWorkerName = name => {
    setWorkerName(name);
  };

  const _onPressSearchWorker = () => {
    Keyboard.dismiss();
    callAPI(() => { searchWorker(workerId, workerName, type) }, false);
  };

  const searchWorker = async (workerId, workerName, filterType) => {
    let token = await Helper.getData('TOKEN');
    GetTimeSheetAllWorkerListAPI(department, userLogin, workerId, workerName, filterType, token)
      .then(res => {
        if (res.success) {
          setWorkerList(res.data);
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

  const _onPressSelectWorker = (id, rowIndex) => {
    // UI
    if (workerSelected) {
      if (!workerSelected.includes(id)) {
        let workers = workerSelected + ', ' + id;
        setWorkerSelected(workers);
      }
    } else {
      setWorkerSelected(id);
    }

    // CODE
    if (!workerUpdateList.includes(rowIndex)) {
      let updated = [...workerUpdateList];
      updated.push(rowIndex);
      setWorkerUpdateList(updated);
    }
  };

  const _onPressUnselectWorker = (id, rowIndex) => {
    // UI
    if (workerSelected) {
      const removed = workerSelected.split(', ').filter(item => item !== id).join(', ');
      setWorkerSelected(removed);
    }

    // CODE
    if (workerUpdateList.includes(rowIndex)) {
      let removed = [...workerUpdateList].filter(item => item !== rowIndex);
      setWorkerUpdateList(removed);
    }
  };

  const _onPressAddWorker = () => {
    if (workerUpdateList.length) {
      Alert.alert(
        'WARNING',
        'Are you sure move workers selected to your group?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Next',
            onPress: updateTimeSheetWorkerList
          }
        ],
        { cancelable: false },
      );
    } else {
      navigation.navigate('TimeSheet');
    }
  };

  const updateTimeSheetWorkerList = async () => {
    let token = await Helper.getData('TOKEN');
    setIsUploading(true);
    UpdateTimeSheetWorkerListAPI(userLogin, fullname, workerUpdateList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          navigation.navigate('TimeSheet', { workerUpdated: new Date().getTime() });
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };





  const RenderWorkerList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (workerList == null) {
        return <ListSelectData title={'Enter WorkerID or WorkerName'} />
      } else if (!workerList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={workerList}
          getItemCount={data => data.length}
          getItem={(data, index) => {
            return data[index];
          }}
          keyExtractor={(item, index) => index}
          renderItem={renderItem}
        />
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      workerUpdateList && workerUpdateList.includes(item.RowIndex)
        ?
        <TouchableOpacity style={styles.boxSelected} onPress={() => { _onPressUnselectWorker(item.ID, item.RowIndex) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WorkerID: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.ID)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WorkerName: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.Fullname)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.box} onPress={() => { _onPressSelectWorker(item.ID, item.RowIndex) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>ID: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.ID)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WorkerName: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.Fullname)}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  const headerData = {
    'Department': department,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { searchWorker(workerId, workerName, type) }, true)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                <>
                  <Header data={headerData}></Header>
                  <View style={styles.headerContainer}>
                    <View style={styles.rowInfo}>
                      <Text style={styles.infoTitle}>WorkerID:</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputText}
                          value={workerId}
                          placeholder={'Enter WorkerID'}
                          onChangeText={_onChangeWorkerID}
                          underlineColorAndroid='transparent'
                        />
                        {workerId == ''
                          ? null
                          : <Icon name='times-circle'
                            onPress={() => _onChangeWorkerID('')}
                            style={styles.inputIcon} />
                        }
                      </View>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.infoTitle}>WorkerName:</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputText}
                          value={workerName}
                          placeholder={'Enter WorkerName'}
                          onChangeText={_onChangeWorkerName}
                          underlineColorAndroid='transparent'
                        />
                        {workerName == ''
                          ? null
                          : <Icon name='times-circle'
                            onPress={() => _onChangeWorkerName('')}
                            style={styles.inputIcon} />
                        }
                      </View>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.infoTitle} />
                      <TouchableOpacity
                        style={styles.searchButton}
                        onPress={_onPressSearchWorker}
                        disabled={isSearching}>
                        <Text style={styles.buttonTitle}>Search Worker</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
                :
                null
            }
            <View style={styles.rowInfoWorkers}>
              <Text style={styles.infoTitle}>Selected:</Text>
              <Text style={styles.infoData}>{workerSelected}</Text>
            </View>
            <RenderWorkerList />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddWorker}>
                <Text style={styles.buttonTitle}>Add Workers</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      <SelectPopup
        visible={isVisibleType}
        data={[Constant.FILTER_ALL, Constant.FILTER_MY, Constant.FILTER_THEIR]}
        onCancel={() => setIsVisibleType(false)}
        onChangeItem={_onChangeType}>
      </SelectPopup>
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView >
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const SELECT_COLOR = '#adb6bb';
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
  rowInfoWorkers: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    marginBottom: 4,
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
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
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
    paddingTop: 4,
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
  boxSelected: {
    flexDirection: 'column',
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: SELECT_COLOR,
  },
  row: {
    flex: 1,
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
    flex: 2,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  actionContainer: {
    marginTop: 8,
    height: 36,
    flexDirection: 'row',
  },
  buttonUpload: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
});

export default TimeSheetManageWorkerScreen;