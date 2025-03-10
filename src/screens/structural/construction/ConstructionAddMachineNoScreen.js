import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import { GetWeldingMachineListAPI } from '../../../apis/app/AppAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import Formater from '../../../utils/Formater';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ConstructionAddMachineNoScreen = ({ route, navigation }) => {

  const { projectCode, currentMachineNo, index, currentRoute } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [machineNo, setMachineNo] = useState('');
  const [machineNoSelected, setMachineNoSelected] = useState(currentMachineNo);
  const [machineNoList, setMachineNoList] = useState(null);

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

  const _onChangeMachineNo = (no) => {
    setMachineNo(no);
  };

  const _onPressSearchMachineNo = () => {
    Keyboard.dismiss();
    callAPI(() => { searchMachineNo(machineNo) }, false);
  };

  const searchMachineNo = async machineNo => {
    GetWeldingMachineListAPI(projectCode, machineNo)
      .then(res => {
        if (res.Success) {
          setMachineNoList(res.Data);
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

  const _onPressSelectMachineNo = (id) => {
    if (machineNoSelected) {
      if (!machineNoSelected.includes(id)) {
        let selected = machineNoSelected + '/' + id;
        setMachineNoSelected(selected);
      }
    } else {
      setMachineNoSelected(id);
    }
  };

  const _onPressUnselectMachineNo = (id) => {
    if (machineNoSelected) {
      const removed = machineNoSelected.split('/').filter(item => item !== id).join('/');
      setMachineNoSelected(removed);
    }
  };

  const _onPressAddMachineNo = () => {
    let route = currentRoute;
    navigation.navigate(route, { machineNoSelected: machineNoSelected, index: Math.random() });
  };

  const RenderMachineNoList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (machineNoList == null) {
        return <ListSelectData title={'Enter MachineNo to search'} />
      } else if (!machineNoList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={machineNoList}
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
      machineNoSelected && machineNoSelected.includes(item.WeldingMachineNo)
        ?
        <TouchableOpacity style={styles.boxSelected} onPress={() => { _onPressUnselectMachineNo(item.WeldingMachineNo) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>MachineNo: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingMachineNo)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>Description: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingMachineDescription)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.box} onPress={() => { _onPressSelectMachineNo(item.WeldingMachineNo) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>MachineNo: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingMachineNo)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>Description: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingMachineDescription)}</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { searchMachineNo(machineNo) }, true)} />
          :
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>MachineNo:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={machineNo}
                    placeholder={'Enter MachineNo'}
                    onChangeText={_onChangeMachineNo}
                    underlineColorAndroid='transparent'
                  />
                  {machineNo == ''
                    ? null
                    : <Icon name='times-circle'
                      onPress={() => _onChangeMachineNo('')}
                      style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle} />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={_onPressSearchMachineNo}
                  disabled={isSearching}>
                  <Text style={styles.buttonTitle}>Search MachineNo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowInfoSelected}>
                <Text style={styles.infoTitle}>Selected:</Text>
                <Text style={styles.infoData}>{machineNoSelected}</Text>
              </View>
            </View>
            <RenderMachineNoList />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddMachineNo}>
                <Text style={styles.buttonTitle}>Add MachineNo</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
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
  rowInfoSelected: {
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

export default ConstructionAddMachineNoScreen;