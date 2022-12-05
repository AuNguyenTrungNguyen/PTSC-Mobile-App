import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils/Networker';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetWelderListAPI } from '../../../apis/qa/QAAPI';

import LoadingRefresh from '../../../components/LoadingRefresh';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';

const QCWelderCardListScreen = ({ _, navigation }) => {

  const [welderId, setWelderId] = useState('');
  const [welderName, setWelderName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [welderList, setWelderList] = useState(null);

  const callAPI = (executedAPI, loading) => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };

  const _onChangeWelderID = id => {
    setWelderId(id);
  };
  const _onChangeWelderName = name => {
    setWelderName(name);
  };
  const _onPressSearchWelder = () => {
    Keyboard.dismiss();
    callAPI(() => { searchWelder(welderId, welderName) }, false);
  };
  const searchWelder = async (welderId, welderName) => {
    welderId = welderId ? welderId : '';
    welderName = welderName ? welderName : '';
    GetWelderListAPI(welderId, welderName)
      .then(res => {
        if (res.Success) {
          setWelderList(res.Data);
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


  const _onPressViewDetail = async item => {
    const projectCode = await Helper.getData('PROJECT_CODE');
    navigation.navigate(
      'QCWelderCardDetail',
      {
        projectCode: projectCode,
        welderId: item.WelderID,
        welderName: item.WelderName,
        DOB: item.DOB,
        companyID: item.CompanyID,
        nationalID: item.NationalID,
      }
    );
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => { _onPressViewDetail(item) }}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>WelderID: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
            {/* {
              item.WelderActive === 1
                ?
                <Text style={styles.textActive}>ACTIVE</Text>
                :
                <Text style={styles.textInactive}>INACTIVE</Text>
            } */}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>WelderName: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>DOB: </Text>
            <Text style={styles.textData}>{Formater.formatDateData(item.DOB)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
        return <>
          <Text style={CoreStyle.textNote}>* Click a welder to view detail</Text>
          <VirtualizedList
            style={styles.table}
            data={welderList}
            getItemCount={data => data.length}
            getItem={(data, index) => {
              return data[index];
            }}
            keyExtractor={(item, index) => index}
            renderItem={renderItem}
          />
        </>
      }
    }
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
            </View>
            <RenderWelderList />
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
  textActive: {
    flex: 1,
    color: 'green',
    fontWeight: 'bold',
  },
  textInactive: {
    flex: 1,
    color: 'grey',
    fontWeight: 'bold',
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

export default QCWelderCardListScreen;