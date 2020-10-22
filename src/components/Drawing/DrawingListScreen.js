import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';

import Helper from '../../helper/Helper';
import GetDrawingListAPI from '../../apis/drawing/GetDrawingListAPI';
import MessageAlert from '../CustomViews/MessageAlert';
import LoadingRefresh from '../CustomViews/LoadingRefresh';

export default ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [drawingList, setDrawingList] = useState([]);
  const [drawingListDefault, setDrawingListDefault] = useState([]);
  const [drawingNo, setDrawingNo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const { projectCode } = route.params;

  useEffect(
    () => {
      getDataFromAPI();
      if (route.params?.qrCode) {
        setDrawingNo(route.params?.qrCode);
        _onPressSearchDrawing(oute.params?.qrCode);
      }
    }, [route.params?.qrCode]
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
    let username = await Helper.getData('USERNAME');
    let projectCode = await Helper.getData('PROJECT_CODE');
    let token = await Helper.getData('TOKEN');
    GetDrawingListAPI(username, projectCode, token)
      .then(res => {
        if (res.success) {
          setDrawingList(res.data);
          setDrawingListDefault(res.data);
          setIsLoading(false);
          setIsError(false);
        } else {
          MessageAlert('ERROR', res.Message);
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch((error) => {
        MessageAlert('ERROR', error.toString());
        setIsLoading(false);
        setIsError(true);
      });
  };

  const _onChangeDrawingNo = (text) => {
    setDrawingNo(text);
  };

  const _onPressSearchDrawing = (searchValue) => {
    Keyboard.dismiss();
    setIsSearch(true);
    if (searchValue) {
      var searchList = drawingListDefault.filter(item => item.DrawingNo.toLowerCase().includes(searchValue.toLowerCase()));
      setDrawingList(searchList);
    } else if (JSON.stringify(drawingList) != JSON.stringify(drawingListDefault)) {
      setDrawingList(drawingListDefault);
    }
  };

  const _onPressQRCode = async () => {
    Keyboard.dismiss();
    navigation.navigate('Camera');
  };

  const _onPressUploadDrawing = (drawingNo, disciplineCode, wOType) => {
    Keyboard.dismiss();
    navigation.navigate('UpdateProgress', { drawingNo: drawingNo, disciplineCode: disciplineCode, wOType: wOType, titleBar: drawingNo });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={getDataFromAPI} />
      {!isSearch && drawingList.length == 0
        ?
        (<View style={styles.container}>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>No have any data with</Text>
            <Text style={styles.noDataTitle}>ProjectCode: <Text style={styles.textAction}>{projectCode}</Text></Text>
          </View>
        </View>)
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                onChangeText={_onChangeDrawingNo}
                value={drawingNo}
                style={styles.searchInput}
                placeholder='Enter Drawing No...'
                placeholderTextColor={BASE_COLOR}
                underlineColorAndroid='transparent'
              />
              <TouchableOpacity style={styles.searchIconContainer} onPress={() => _onPressSearchDrawing(drawingNo)}>
                <Icon style={styles.searchIcon} name='search' size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchIconContainer} onPress={_onPressQRCode}>
                <Icon style={styles.searchIcon} name='qr-code' size={24} />
              </TouchableOpacity>
            </View>
          </View>
          {drawingList.length == 0
            ?
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataTitle}>No have any data with</Text>
              <Text style={styles.noDataTitle}>ProjectCode: <Text style={styles.textAction}>{projectCode}</Text></Text>
              <Text style={styles.noDataTitle}>DrawingNo: <Text style={styles.textAction}>{drawingNo}</Text></Text>
            </View>
            :
            <View style={styles.table}>
              <ScrollView horizontal={true}>
                <View>
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellNo]}>No</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellDrawingNo]}>DrawingNo</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellSheet]}>Sheet</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellRev]}>Rev</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellWONo]}>WONo</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellDisciplineCode]}>DisciplineCode</Text>
                    <Text style={[styles.cell, styles.cellHeader, styles.cellFacilityCode]}>FacilityCode</Text>
                  </View>
                  <ScrollView>
                    {drawingList.map((item, index) => {
                      return (
                        <View style={styles.row}>
                          <Text style={[styles.cell, styles.cellNo, styles.cellRight]}>{index + 1}</Text>
                          <TouchableOpacity
                            style={[styles.cell, styles.cellDrawingNo]}
                            activeOpacity={1}
                            onPress={() => _onPressUploadDrawing(item.DrawingNo, item.DisciplineCode, item.WOType)}>
                            <Text style={styles.textAction}>{item.DrawingNo}</Text>
                          </TouchableOpacity>
                          <Text style={[styles.cell, styles.cellSheet]}>{item.Sheet}</Text>
                          <Text style={[styles.cell, styles.cellRev]}>{item.Rev}</Text>
                          <Text style={[styles.cell, styles.cellWONo]}>{item.WONo}</Text>
                          <Text style={[styles.cell, styles.cellDisciplineCode]}>{item.DisciplineCode}</Text>
                          <Text style={[styles.cell, styles.cellFacilityCode]}>{item.FacilityCode}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          }
        </View>
      }
    </SafeAreaView >
  );
};

const BASE_COLOR = '#344955';
const BASE_CELL_HEIGHT = 48;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    height: 48,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: BASE_COLOR,
  },
  searchIconContainer: {
    height: 46,
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: BASE_COLOR,
    borderLeftWidth: 1,
  },
  searchIcon: {
    height: 24,
    width: 24,
    color: BASE_COLOR,
  },

  table: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    height: BASE_CELL_HEIGHT,
  },
  cell: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    lineHeight: BASE_CELL_HEIGHT,
    paddingLeft: 8,
    paddingRight: 8,
  },
  cellHeader: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    backgroundColor: 'azure',
  },
  cellNo: {
    width: 40,
  },
  cellDrawingNo: {
    width: 200,
    justifyContent: 'center',
  },
  cellSheet: {
    width: 60,
  },
  cellRev: {
    width: 40,
  },
  cellWONo: {
    width: 120,
  },
  cellDisciplineCode: {
    width: 120,
  },
  cellFacilityCode: {
    width: 100,
  },
  cellRight: {
    textAlign: 'right',
  },
  textAction: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  noDataTitle: {
    fontSize: 16,
    color: BASE_COLOR
  },
});
