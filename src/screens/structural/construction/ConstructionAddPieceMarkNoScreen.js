import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';


import { GetPieceMarkNoListAPI } from '../../../apis/app/AppAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ConstructionAddPieceMarkNoScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, index, isMultiple, data } = route.params;

  const [pieceMarkNo, setPieceMarkNo] = useState('');
  const [pieceMarkNoEntered, setPieceMarkNoEntered] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pieceMarkNoList, setPieceMarkNoList] = useState(null);

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

  const _onPressSearchPieceMarkNo = () => {
    Keyboard.dismiss();
    callAPI(() => { searchPieceMarkNo(pieceMarkNo) }, false);
  };
  const searchPieceMarkNo = async no => {
    let token = await Helper.getData('TOKEN');
    GetPieceMarkNoListAPI(projectCode, facilityCode, no, token)
      .then(res => {
        if (res.success) {
          setPieceMarkNoList(res.data);
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

  const _onChangePieceMarkNo = no => {
    setPieceMarkNo(no);
  };
  const _onPressSelectPieceMarkNo = no => {
    let route = isMultiple ? 'ConstructionMultiDetail' : 'ConstructionDetail';
    navigation.navigate(route, { pieceMarkNoSelected: no, index: index });
  };

  const _onChangePieceMarkNoEntered = no => {
    setPieceMarkNoEntered(no);
  };
  const _onPressEnterPieceMarkNo = () => {
    let data = { PieceMarkNo: pieceMarkNoEntered, PieceDescription: '', HeatNo_TagNo: '' };
    let route = isMultiple ? 'ConstructionMultiDetail' : 'ConstructionDetail';
    navigation.navigate(route, { pieceMarkNoSelected: data, index: index });
  };

  const RenderPieceMarkNoList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (pieceMarkNoList == null) {
        return <ListSelectData title={'Enter PieceMarkNo'} />
      } else if (!pieceMarkNoList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={pieceMarkNoList}
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
      <TouchableOpacity style={styles.box} onPress={() => { _onPressSelectPieceMarkNo(item) }}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>PieceMarkNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceMarkNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>Description: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceDescription)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>HeatNo_TagNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo_TagNo)}</Text>
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { searchPieceMarkNo(pieceMarkNo) }, true)} />
          :
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>PieceMarkNo:</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputText}
                    value={pieceMarkNo}
                    placeholder={'Enter PieceMarkNo'}
                    onChangeText={_onChangePieceMarkNo}
                    underlineColorAndroid='transparent'
                  />
                  {pieceMarkNo == ''
                    ? null
                    : <Icon name='times-circle'
                      onPress={() => _onChangePieceMarkNo('')}
                      style={styles.inputIcon} />
                  }
                </View>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle} />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={_onPressSearchPieceMarkNo}
                  disabled={isSearching}>
                  <Text style={styles.buttonTitle}>Search Piece Mark</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowInfoPieceMark}>
                <Text style={styles.infoTitle}>Selected:</Text>
                <Text style={styles.infoData}>{data.PieceMarkNo}{'\n'}{data.PieceDescription}{'\n'}{data.HeatNo_TagNo}</Text>
              </View>
            </View>
            <RenderPieceMarkNoList />
            <View style={styles.actionContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputText}
                  value={pieceMarkNoEntered}
                  placeholder={'Enter PieceMarkNo without find'}
                  onChangeText={_onChangePieceMarkNoEntered}
                  underlineColorAndroid='transparent'
                />
                {pieceMarkNoEntered == ''
                  ? null
                  : <Icon name='times-circle'
                    onPress={() => _onChangePieceMarkNoEntered('')}
                    style={styles.inputIcon} />
                }
              </View>
              <TouchableOpacity style={styles.buttonUpload} onPress={_onPressEnterPieceMarkNo}>
                <Text style={styles.buttonTitle}>Add PieceMark</Text>
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
  rowInfoPieceMark: {
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
    flexShrink: 1,
    marginTop: 8,
    height: 36,
    flexDirection: 'row',
  },
  buttonUpload: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
});

export default ConstructionAddPieceMarkNoScreen;