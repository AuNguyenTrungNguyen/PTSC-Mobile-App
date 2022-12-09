import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Appearance } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetDIMAfterWeldListAPI } from '../../../apis/structural/DimCheckAPI';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DIMAfterWeldListScreen = ({ route, navigation }) => {

  const { projectCode, paramDrawingNo, isShowDetail, isPending, isReadOnly } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [pieceMarkList, setPieceMarkList] = useState(null);

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
      if (paramDrawingNo) {
        setDrawingNo(paramDrawingNo);
        callAPI(() => { searchPieceMark(paramDrawingNo, facilityCode, assemblyCode) }, false);
      }
    }, []
  );

  const isFocused = useIsFocused();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDrawing, setSelectedDrawing] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('');

  useEffect(
    () => {
      if (isFocused && isShowDetail && !isReadOnly) {
        if (selectedFacility && selectedDrawing && selectedAssembly) {
          callAPI(() => { updatePieceMark(selectedFacility, selectedDrawing, selectedAssembly) }, false);
        }
      }
    }, [isFocused]
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Facility Code
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const getFacilityList = async () => {
    const token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then(res => {
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
      });
  };
  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchPieceMark(code, drawingNo, assemblyCode) }, false);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
    }
    setIsVisibleFacility(false);
  };

  //-- DrawingNo
  const [drawingNo, setDrawingNo] = useState('');
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };

  //-- AssemblyCode
  const [assemblyCode, setAssemblyCode] = useState('');
  const _onChangeAssemblyCode = code => {
    setAssemblyCode(code);
  };

  //-- Search Action
  const _onPressSearch = () => {
    callAPI(() => { searchPieceMark(facilityCode, drawingNo, assemblyCode) }, false);
  };
  const searchPieceMark = async (facilityCode, drawingNo, assemblyCode) => {
    setIsSearching(true);
    Keyboard.dismiss();
    const token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode !== null && facilityCode !== FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo !== null ? drawingNo : '';
    assemblyCode = assemblyCode !== null ? assemblyCode : '';
    const filterType = !isPending ? '' : Constant.STATUS_NOT_YET;
    GetDIMAfterWeldListAPI(projectCode, facilityCode, drawingNo, assemblyCode, filterType, token)
      .then(res => {
        if (res.Success) {
          setPieceMarkList(res.Data);
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
  const updatePieceMark = async (facilityCode, drawingNo, assemblyCode) => {
    const token = await Helper.getData('TOKEN');
    const filterType = !isPending ? '' : Constant.STATUS_NOT_YET;
    GetDIMAfterWeldListAPI(projectCode, facilityCode, drawingNo, assemblyCode, filterType, token)
      .then(res => {
        if (res.Success) {
          if (res.Data && res.Data.length == 1) {
            const array = [...pieceMarkList]
            const index = pieceMarkList.findIndex(i => i.FacilityCode === selectedFacility && i.CuttingSheetDrawingNo === selectedDrawing && i.AssemblyCode === selectedAssembly);
            array[index]['Pending'] = res.Data[0]['Pending'];
            array[index]['ACC'] = res.Data[0]['ACC'];
            array[index]['REJ'] = res.Data[0]['REJ'];
            array[index]['Total'] = res.Data[0]['Total'];
            setPieceMarkList(array);
          }
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

  const _onPressViewDetail = async (item) => {
    const userLogin = await Helper.getData('USERNAME');
    setSelectedFacility(item.FacilityCode);
    setSelectedDrawing(item.CuttingSheetDrawingNo);
    setSelectedAssembly(item.AssemblyCode);
    navigation.navigate(
      isShowDetail ? 'DIMAfterWeldDetailQC' : 'DIMAfterWeldDetail',
      {
        projectCode: projectCode,
        facilityCode: item.FacilityCode,
        drawingNo: item.CuttingSheetDrawingNo,
        assemblyCode: item.AssemblyCode,
        userLogin: userLogin,
        isPending: isPending,
        isReadOnly: isReadOnly,
      }
    );
  };

  const RenderPieceMarkList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (pieceMarkList == null) {
        return <ListSelectData title={'Enter FacilityCode, DrawingNo or AssemblyCode'} />
      } else if (!pieceMarkList.length) {
        return <ListEmptyData />
      } else {
        return <></>;
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.box}
        onPress={() => _onPressViewDetail(item)}
      >
        {/* <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open PieceMark Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{itemDrawing}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{itemDrawing}</Text>
          }
        </View> */}
        <View style={styles.row}>
          <Text style={styles.cellTitle}>FacilityCode:</Text>
          <Text style={styles.cellData}>{item.FacilityCode}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          <Text style={styles.cellData}>{item.CuttingSheetDrawingNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Assembly:</Text>
          <Text style={styles.cellData}>{item.AssemblyCode}</Text>
        </View>
        {
          isShowDetail &&
          <View style={styles.row}>
            <View style={styles.cellStatus}>
              <Text style={styles.cellPending}>Pending: {item.Pending}</Text>
              <Text style={styles.cellACC}>ACC: {item.ACC}</Text>
              <Text style={styles.cellREJ}>REJ: {item.REJ}</Text>
              <Text style={styles.cellTotal}>Total: {item.Total}</Text>
            </View>

          </View>
        }

      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(() => { searchPieceMark(facilityCode, drawingNo) }, true) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                <View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>ProjectCode:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleFacility(true) }}>
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
                      {
                        drawingNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>Assembly:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={assemblyCode}
                        onChangeText={_onChangeAssemblyCode}
                        underlineColorAndroid='transparent'
                      />
                      {
                        assemblyCode == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeAssemblyCode('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearch}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                null
            }
            {!isSearching && pieceMarkList && pieceMarkList.length > 0 ?
              <>
                <Text style={CoreStyle.textNote}>* Click an item to view its detail</Text>
                <VirtualizedList
                  style={styles.table}
                  data={pieceMarkList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
              </>
              :
              <RenderPieceMarkList />
            }
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onPressClearFacilityCode}
        onChangeItem={_onChangeFacilityCode}>
      </SelectPopup>
    </SafeAreaView >
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
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
  },
  cellStatus: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cellPending: {
    fontWeight: 'bold',
    color: BASE_COLOR
  },
  cellACC: {
    fontWeight: 'bold',
    color: 'green'
  },
  cellREJ: {
    fontWeight: 'bold',
    color: 'red'
  },
  cellTotal: {
    fontWeight: 'bold',
    color: 'black'
  },
  cellValue: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
  },
  textValue: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellProgress: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cellAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 4,
    fontSize: 16,
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  // scanContainer: {
  //   marginTop: 12,
  //   height: 36,
  //   flexDirection: 'row',
  // },
  // buttonLeft: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: BASE_COLOR,
  //   marginRight: 4,
  // },
  // buttonRight: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: BASE_COLOR,
  //   marginLeft: 4,
  // },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default DIMAfterWeldListScreen;