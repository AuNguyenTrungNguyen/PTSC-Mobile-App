import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../utils/Helper';
import GetFacilityListAPI from '../../apis/app/GetFacilityListAPI';
import GetDrawingListAPI from '../../apis/drawing/GetDrawingListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

const DrawingSearchScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [drawingList, setDrawingList] = useState(null);

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

  useEffect(
    () => {
      callAPI(getFacilityList);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const getFacilityList = async () => {
    let token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then((res) => {
        if (res.success) {
          setFacilityList(res.data);
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
      });;
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
  };

  const _onChangeFacilityCode = (code) => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchDrawing(code, drawingNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  const searchDrawing = async (facilityCode, drawingNo) => {
    setIsSearching(true);
    setOldDrawingNo(drawingNo);
    let token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode != null && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo != null ? drawingNo : '';
    GetDrawingListAPI(projectCode, facilityCode, drawingNo, token)
      .then(res => {
        if (res.success) {
          setDrawingList(res.data);
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

  const _onPressSearchDrawing = () => {
    if (oldDrawingNo !== drawingNo) {
      Keyboard.dismiss();
      callAPI(() => { searchDrawing(facilityCode, drawingNo) }, false);
    }
  };

  const _onPressClearModel = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchDrawing('', drawingNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  const _onPressCancelModel = () => {
    setIsVisibleFacility(false);
  };

  const _onPressShowModel = () => {
    if (facilityList.length) {
      setIsVisibleFacility(true);
    } else {
      Toast.show('No have Facility to filter', Toast.SHORT);
    }
  };



  /**
   * Drawing List
   **/
  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      {
        (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) || drawingNo
          ?
          <Text style={styles.noDataTitle}>No have any data with</Text>
          :
          <Text style={styles.noDataTitle}>No have any data</Text>
      }
      {
        facilityCode && facilityCode != FACILITY_CODE_DEFAULT
          ?
          <>
            <Text style={styles.noDataTitle}>FacilityCode:</Text>
            <Text style={styles.noDataText}>{facilityCode}</Text>
          </>
          :
          null
      }
      {
        drawingNo
          ?
          <>
            <Text style={styles.noDataTitle}>DrawingNo:</Text>
            <Text style={styles.noDataText}>{drawingNo}</Text>
          </>
          :
          null
      }
    </View>
  );

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Enter FacilityCode or DrawingNo to search!</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} activeOpacity={0.5} onPress={() => {
        navigation.navigate('DrawingAllStatus', {
          projectCode: projectCode,
          facilityCode: facilityCode !== FACILITY_CODE_DEFAULT ? facilityCode : null,
          drawingNo: item.DrawingNo,
          sheet: item.Sheet,
          rev: item.Rev
        });
      }}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.DrawingNo)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Sheet:</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.Sheet)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Rev:</Text>
          <Text style={styles.cellData}>{formatEmptyData(item.Rev)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const formatEmptyData = data => {
    return data != null ? data : '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getFacilityList)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              (<View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <Text style={styles.infoData}>{projectCode}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>FacilityCode:</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={_onPressShowModel}>
                    <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>DrawingNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={drawingNo}
                      onChangeText={_onChangeDrawingNo}
                      underlineColorAndroid='transparent'
                    />
                    {drawingNo == ''
                      ? null
                      : <FontAwesome5Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchDrawing}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search Drawing</Text>
                  </TouchableOpacity>
                </View>
              </View>)
              :
              null
          }
          {
            isSearching
              ?
              <ListSearchData />
              :
              (drawingList == null)
                ?
                <ListSelectData />
                :
                (!drawingList.length)
                  ?
                  <ListEmptyData />
                  :
                  <>
                    <Text style={styles.textNote}>* Click an item to view detail</Text>
                    <VirtualizedList
                      style={styles.table}
                      data={drawingList}
                      getItemCount={(data) => data.length}
                      getItem={(data, index) => {
                        return data[index];
                      }}
                      keyExtractor={(item) => {
                        return item.Id;;
                      }}
                      renderItem={renderItem}
                    />
                  </>
          }
        </View>
      }
      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisibleFacility}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <ScrollView>
                  {facilityList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeFacilityCode(item.code)}>
                        <Text style={modals.cell}>{item.code}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={_onPressClearModel}>
                  <Text style={modals.buttonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={_onPressCancelModel}>
                  <Text style={modals.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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

  textNote: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 4,
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
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 3,
    justifyContent: 'center',
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
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

  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    minHeight: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  action: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default DrawingSearchScreen;