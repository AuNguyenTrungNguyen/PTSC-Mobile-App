import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';


import { GetWelderListSubContractorAPI } from '../../../apis/app/AppAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const AddWelderScreen = ({ route, navigation }) => {

  const { projectCode, welders, index, isMultiple } = route.params;

  const [welderId, setWelderId] = useState('');
  const [welderName, setWelderName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [welderSelected, setWelderSelected] = useState(welders);
  const [welderList, setWelderList] = useState(null);

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

  const _onChangeWelderID = (id) => {
    setWelderId(id);
  };

  const _onChangeWelderName = (name) => {
    setWelderName(name);
  };

  const _onPressSearchWelder = () => {
    Keyboard.dismiss();
    callAPI(() => { searchWelder(welderId, welderName) }, false);
  };

  const searchWelder = async (welderId, welderName) => {
    GetWelderListSubContractorAPI(projectCode, welderId, welderName)
      .then(res => {
        if (res.success) {
          setWelderList(res.data);
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

  const _onPressSelectWelder = (id) => {
    if (welderSelected) {
      if (!welderSelected.includes(id)) {
        let welders = welderSelected + '/' + id;
        setWelderSelected(welders);
      }
    } else {
      setWelderSelected(id);
    }
  };

  const _onPressUnselectWelder = (id) => {
    if (welderSelected) {
      const removed = welderSelected.split('/').filter(item => item !== id).join('/');
      setWelderSelected(removed);
    }
  };

  const _onPressAddWelder = () => {
    let route = isMultiple ? 'ConstructionMultiDetail' : 'ConstructionDetail';
    navigation.navigate(route, { welderSelected: welderSelected, index: index });
  };

  const RenderWelderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (welderList == null) {
        return <ListSelectData title={'Enter WelderID or WelderName'} />
      } else if (!welderList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={welderList}
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
      welderSelected && welderSelected.includes(item.WelderID)
        ?
        <TouchableOpacity style={styles.boxSelected} onPress={() => { _onPressUnselectWelder(item.WelderID) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WelderID: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WelderName: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderName)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.box} onPress={() => { _onPressSelectWelder(item.WelderID) }}>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WelderID: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.textTitle}>WelderName: </Text>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderName)}</Text>
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { searchWelder(welderId, welderName) }, true)} />
          :
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>WelderID:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={welderId}
                    placeholder={'Enter WelderID'}
                    onChangeText={_onChangeWelderID}
                    underlineColorAndroid='transparent'
                  />
                  {welderId == ''
                    ? null
                    : <Icon name='times-circle'
                      onPress={() => _onChangeWelderID('')}
                      style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>WelderName:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={welderName}
                    placeholder={'Enter WelderName'}
                    onChangeText={_onChangeWelderName}
                    underlineColorAndroid='transparent'
                  />
                  {welderName == ''
                    ? null
                    : <Icon name='times-circle'
                      onPress={() => _onChangeWelderName('')}
                      style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle} />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={_onPressSearchWelder}
                  disabled={isSearching}>
                  <Text style={styles.buttonTitle}>Search Welder</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowInfoWelders}>
                <Text style={styles.infoTitle}>Welders:</Text>
                <Text style={styles.infoData}>{welderSelected}</Text>
              </View>
            </View>
            <RenderWelderList />
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonUpload} onPress={_onPressAddWelder}>
                <Text style={styles.buttonTitle}>Add Welders</Text>
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
  rowInfoWelders: {
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

export default AddWelderScreen;