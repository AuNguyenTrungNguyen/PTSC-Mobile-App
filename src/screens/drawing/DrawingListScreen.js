import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Modal, Dimensions, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetFacilityListAPI from '../../apis/app/GetFacilityListAPI';
import GetDrawingListAPI from '../../apis/drawing/GetDrawingListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route, navigation }) => {

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { projectCode } = route.params;

  const [drawingListDefault, setDrawingListDefault] = useState([]);
  const [drawingList, setDrawingList] = useState([]);
  const [drawingNo, setDrawingNo] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const [newFacilityCode, setNewFacilityCode] = useState(FACILITY_CODE_DEFAULT);

  useEffect(
    () => {
      getDataFromAPI();
    }, []
  );

  const getDataFromAPI = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        setIsLoading(true);
        getData();
      }
    });
  };

  const getData = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      await Promise.all([GetFacilityListAPI(projectCode, token), GetDrawingListAPI(projectCode, token)
      ]).then(([facilityResult, drawingResult]) => {
        if (facilityResult.success && drawingResult.success) {
          setFacilityList(facilityResult.data);
          setDrawingList(drawingResult.data);
          setDrawingListDefault(drawingResult.data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      });
    } catch (error) {
      MessageAlert('ERROR', error.toString());
    }
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
    if (no === '') {
      searchDrawing(facilityCode);
    }
  };

  const _onChangeFacilityCode = (code) => {
    setNewFacilityCode(code);
  };

  const searchDrawing = (code) => {
    console.log('searchDrawing');
    if (isSearch === false) {
      setIsSearch(true);
    }
    let array = [...drawingListDefault];
    const newData = drawingListDefault.filter(item => {
      let conditionDrawingNo = true;
      if (drawingNo) {
        const itemData = item.DrawingNo.toUpperCase();
        const drawingData = drawingNo.toUpperCase();
        conditionDrawingNo = itemData.indexOf(drawingData) > -1;
      }

      let conditionFacilityCode = true;
      if (code !== FACILITY_CODE_DEFAULT) {
        const itemData = item.FacilityCode.toUpperCase();
        const codeData = code.toUpperCase();
        conditionFacilityCode = itemData === codeData;
      }
      return (conditionDrawingNo && conditionFacilityCode);
    });
    array = newData;
    console.log(array.length);
    setDrawingList(array);
  };

  const _onPressSearchDrawing = () => {
    searchDrawing(facilityCode);
  };

  const _onPressFilterDrawing = () => {
    if (facilityCode !== newFacilityCode) {
      setFacilityCode(newFacilityCode);
      searchDrawing(newFacilityCode);
    }
    setIsVisible(false);
  };

  const _onPressClearModel = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      setNewFacilityCode(FACILITY_CODE_DEFAULT);
      searchDrawing(FACILITY_CODE_DEFAULT);
    }
    setIsVisible(false);
  };

  const _onPressCancelModel = () => {
    setNewFacilityCode(facilityCode);
    setIsVisible(false);
  };

  const _onPressViewFitUp = (facilityCode, drawingNo, sheet, rev) => {
    Keyboard.dismiss();
    navigation.navigate(
      'DrawingDetail',
      {
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        sheet: sheet,
        rev: rev,
        code: 'FitUp'
      }
    );
  };

  const _onPressViewWeld = (facilityCode, drawingNo, sheet, rev) => {
    Keyboard.dismiss();
    navigation.navigate(
      'DrawingDetail',
      {
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        sheet: sheet,
        rev: rev,
        code: 'Weld'
      }
    );
  };

  const _onPressQRCodeFitUp = () => {
    Keyboard.dismiss();
    navigation.navigate('Camera', { code: 'FitUp' });
  };

  const _onPressQRCodeWeld = () => {
    Keyboard.dismiss();
    navigation.navigate('Camera', { code: 'Weld' });
  };

  /**
   * Drawing List
   **/
  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data</Text>
      {!isSearch ? <Text style={styles.noDataTitle}>ProjectCode: <Text style={styles.noDataText}>{projectCode}</Text></Text> : null}
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          <Text style={styles.cellData}>{item.DrawingNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Sheet:</Text>
          <Text style={styles.cellData}>{item.Sheet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Rev:</Text>
          <Text style={styles.cellData}>{item.Rev}</Text>
        </View>
        <View style={styles.rowAction}>
          <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewFitUp(item.FacilityCode, item.DrawingNo, item.Sheet, item.Rev) }}>
            <Text style={styles.textAction}>View Fit-Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewWeld(item.FacilityCode, item.DrawingNo, item.Sheet, item.Rev) }}>
            <Text style={styles.textAction}>View Weld</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={getDataFromAPI} />
        :
        (!isSearch && drawingList.length == 0
          ?
          <View style={styles.container}>
            <ListEmptyData />
          </View>
          :
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>ProjectCode:</Text>
                <Text style={styles.infoData}>{projectCode}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>FacilityCode:</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setIsVisible(true)}>
                  <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle}>DrawingNo:</Text>
                <TextInput
                  style={styles.searchInput}
                  value={drawingNo}
                  onChangeText={_onChangeDrawingNo}
                  underlineColorAndroid='transparent'
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.infoTitle} />
                <TouchableOpacity style={styles.searchButton} onPress={_onPressSearchDrawing}>
                  <Text style={styles.buttonTitle}>Search Drawing</Text>
                </TouchableOpacity>
              </View>
            </View>
            {drawingList.length
              ?
              <VirtualizedList
                style={styles.table}
                data={drawingList}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(index) => {
                  return index;
                }}
                renderItem={renderItem}
              />
              : <ListEmptyData />
            }
            <View style={styles.scanContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQRCodeFitUp}>
                <Text style={styles.buttonTitle}>Scan Fit-Up Drawing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonRight} onPress={_onPressQRCodeWeld}>
                <Text style={styles.buttonTitle}>Scan Weld Drawing</Text>
              </TouchableOpacity>
            </View>
          </View>)
      }

      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisible}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <View style={modals.title}>
                  <Text style={modals.text}>Choose Facility Code: <Text style={modals.code}>{newFacilityCode}</Text></Text>
                </View>
                <View style={modals.row}>
                  <Text style={modals.cellHeader}>CODE</Text>
                  <View style={modals.line} />
                  <Text style={modals.cellHeader}>NAME</Text>
                </View>
                <ScrollView>
                  {facilityList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeFacilityCode(item.code)}>
                        <Text style={modals.cell}>{item.code}</Text>
                        <View style={modals.line} />
                        <Text style={modals.cell}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={_onPressFilterDrawing}>
                  <Text style={styles.buttonTitle}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={_onPressClearModel}>
                  <Text style={styles.buttonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={_onPressCancelModel}>
                  <Text style={styles.buttonTitle}>Cancel</Text>
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
    padding: 16,
    flex: 1,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
    padding: 8,
    marginBottom: 4,
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
  searchInput: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
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
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  rowAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  cellAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginRight: 8,
  },
  textAction: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
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
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  scanContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginRight: 4,
  },
  buttonRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
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
  title: {
    marginBottom: 16,
  },
  text: {
    color: BASE_COLOR,
  },
  code: {
    color: BASE_COLOR,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    height: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cellHeader: {
    flex: 5,
    color: BASE_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  line: {
    height: 36,
    width: 1,
    backgroundColor: BASE_COLOR,
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
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
});

