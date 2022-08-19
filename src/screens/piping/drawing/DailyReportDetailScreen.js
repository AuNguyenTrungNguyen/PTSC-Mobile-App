import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Keyboard, VirtualizedList, Appearance, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

// import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
// import { GetConstructionListAPI, GetCurrentConstructionInfoAPI, GetDrawingCompletePercentAPI } from '../../../apis/piping/ConstructionAPI';
import { GetTeamReportDetailAPI } from '../../../apis/piping/ConstructionAPI';

import { ListEmptyData } from '../../../components/HelperUI';
// import SelectPopup from '../../../components/SelectPopup';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Formater from '../../../utils/Formater';

const DailyReportDetailScreen = ({ route, navigation }) => {

  const { projectCode, team, date } = route.params;
  const JOINT = 'JOINT';
  const SUM = 'SUM';

  // const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // const [isSearching, setIsSearching] = useState(false);

  const [type, setType] = useState(JOINT);

  const [drawingList, setDrawingList] = useState([]);
  const [sumList, setSumList] = useState([]);
  // const [drawingNo, setDrawingNo] = useState('');
  // const [oldDrawingNo, setOldDrawingNo] = useState(null);
  // const [weldNo, setWeldNo] = useState('');
  // const [oldWeldNo, setOldWeldNo] = useState(null);

  // const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  // const [facilityList, setFacilityList] = useState([]);
  // const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);

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
      callAPI(getReportDetail);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  //-- Get Report
  const getReportDetail = async () => {
    const token = await Helper.getData('TOKEN');
    GetTeamReportDetailAPI(projectCode, team, date, token)
      .then(res => {
        if (res.Success) {
          setDrawingList(res.Data);
          setSumList(res.Second);
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

  //-- Facility Code
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
      callAPI(() => { searchDrawing(code, drawingNo, weldNo) }, false);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchDrawing('', drawingNo, weldNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  //-- DrawingNo & WeldNo
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };
  const _onChangeWeldNo = no => {
    setWeldNo(no);
  };

  //-- Search Action
  const _onPressSearchDrawing = () => {
    if (oldDrawingNo !== drawingNo || oldWeldNo !== weldNo) {
      Keyboard.dismiss();
      setOldDrawingNo(drawingNo);
      setOldWeldNo(weldNo);
      callAPI(() => { searchDrawing(facilityCode, drawingNo, weldNo) }, false);
    }
  };
  const searchDrawing = async (facilityCode, drawingNo, weldNo) => {
    setIsSearching(true);
    const token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo ? drawingNo : '';
    weldNo = weldNo ? weldNo : '';
    GetConstructionListAPI(projectCode, facilityCode, drawingNo, weldNo, token)
      .then(res => {
        if (res.Success) {
          setDrawingList(res.Data);
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

  const _onPressChangeType = value => {
    if (value === JOINT) {

    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {/* {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'PIP CONS Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.DrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.DrawingNo}</Text>
          } */}
          <Text style={styles.cellData}>{item.DrawingNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>WeldNo:</Text>
          <Text style={styles.cellData}>{item.WeldNo}</Text>
        </View>
      </View>
    );
  };
  const renderItemSum = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {/* {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'PIP CONS Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.DrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.DrawingNo}</Text>
          } */}
          <Text style={styles.cellData}>{item.DrawingNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DiaIn:</Text>
          <Text style={styles.cellData}>{Formater.formatZeroDigits(item.DiaIn)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(getReportDetail, true) }} />
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
                    <Text style={styles.infoTitle}>Team:</Text>
                    <Text style={styles.infoData}>{team}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>Date:</Text>
                    <Text style={styles.infoData}>{Formater.formatDateWithoutTimeSQL(date)}</Text>
                  </View>
                  <View style={styles.rowHeaderAction}>
                    <TouchableOpacity
                      style={styles.rowHeaderButton}
                      onPress={() => { setType(JOINT) }}>
                      <Text style={styles.buttonTitle}>Joint</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rowHeaderButton}
                      onPress={() => { setType(SUM) }}>
                      <Text style={styles.buttonTitle}>Dia-Inch</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.rowInfo}>
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
                      {drawingNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>WeldNo:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={weldNo}
                        onChangeText={_onChangeWeldNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        weldNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeWeldNo('')} style={styles.inputIcon} />
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
                  </View> */}
                </View>
                :
                null
            }
            {
              (drawingList && drawingList.length) || (sumList && sumList.length)
                ?
                (
                  type === JOINT
                    ?
                    <VirtualizedList
                      style={styles.table}
                      data={drawingList}
                      getItemCount={data => data.length}
                      getItem={(data, index) => {
                        return data[index];
                      }}
                      keyExtractor={(item, index) => index}
                      renderItem={renderItem}
                    />
                    :
                    <VirtualizedList
                      style={styles.table}
                      data={sumList}
                      getItemCount={data => data.length}
                      getItem={(data, index) => {
                        return data[index];
                      }}
                      keyExtractor={(item, index) => index}
                      renderItem={renderItemSum}
                    />
                )
                :
                <ListEmptyData />
            }
          </View>
      }
      {/* <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onPressClearFacilityCode}
        onChangeItem={_onChangeFacilityCode}>
      </SelectPopup> */}
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
    marginBottom: 4,
  },
  rowHeaderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    height: 36,
  },
  rowHeaderButton: {
    flex: 1,
    marginHorizontal: 2,
    borderColor: BASE_COLOR,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
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
    flex: 5,
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

export default DailyReportDetailScreen;