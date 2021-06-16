import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';
import GetFacilityListAPI from '../../../apis/app/GetFacilityListAPI';
import GetDrawingListAPI from '../../../apis/drawing/GetDrawingListAPI';
import GetFacilityCodeByDrawingAPI from '../../../apis/drawing/GetTopFacilityCodeAPI';
import GetDrawingCompletePercentAPI from '../../../apis/drawing/GetDrawingCompletePercentAPI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DrawingListScreen = ({ route, navigation }) => {

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { projectCode } = route.params;

  const [isSearching, setIsSearching] = useState(false);
  const [drawingList, setDrawingList] = useState([]);
  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);

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
      callAPI(getDrawingDetail);
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

  const getDrawingDetail = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      await Promise.all([GetFacilityListAPI(projectCode, token), GetDrawingListAPI(projectCode, '', '', token)])
        .then(([facilityResult, drawingResult]) => {
          if (facilityResult.success && drawingResult.success) {
            setFacilityList(facilityResult.data);
            setDrawingList(drawingResult.data);
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
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      MessageAlert('ERROR', error.toString());
    }
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
    if (no === '') {
      callAPI(() => { searchDrawing(facilityCode, '') }, false);
    }
  };

  const _onChangeFacilityCode = (code) => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchDrawing(code, drawingNo) }, false);
    }
    setIsVisible(false);
  };

  const searchDrawing = async (facilityCode, drawingNo) => {
    if (isSearch === false) {
      setIsSearch(true);
    }
    setIsSearching(true);
    setOldDrawingNo(drawingNo);
    let token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode != null && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo != null ? drawingNo : '';
    GetDrawingListAPI(projectCode, facilityCode, drawingNo, token)
      .then(res => {
        if (res.success) {
          let array = []
          array = res.data;
          setDrawingList(array);
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
    setIsVisible(false);
  };

  const _onPressCancelModel = () => {
    setIsVisible(false);
  };

  const _onPressShowModel = () => {
    if (facilityList.length) {
      setIsVisible(true);
    } else {
      Toast.show('No have Facility to filter', Toast.SHORT);
    }
  };

  const _onPressCompletePercent = async (drawingNo, sheet, rev) => {
    Keyboard.dismiss();
    let index = drawingList.findIndex((obj => obj.DrawingNo == drawingNo && obj.Sheet == sheet && obj.Rev == rev));
    let token = await Helper.getData('TOKEN');
    GetDrawingCompletePercentAPI(projectCode, drawingNo, sheet, rev, token)
      .then(res => {
        if (res.success) {
          let array = [...drawingList];
          array[index]['progess'] = res.data;
          setDrawingList(array);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT);
      });
  };

  const _onPressViewFitUp = async (drawingNo, sheet, rev, link) => {
    Keyboard.dismiss();
    let teamLeader = await Helper.getData('USERNAME');
    let code = 'FitUp';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'DrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          teamLeader: teamLeader,
          title: 'FitUp Detail',
          link: link,
        }
      );
    } else {
      let token = await Helper.getData('TOKEN');
      GetFacilityCodeByDrawingAPI(projectCode, drawingNo, sheet, rev, token)
        .then(res => {
          if (res.success) {
            navigation.navigate('DrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              teamLeader: teamLeader,
              title: 'FitUp Detail',
              link: link,
            });
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        }).catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  };

  const _onPressViewWeld = async (drawingNo, sheet, rev, link) => {
    Keyboard.dismiss();
    let teamLeader = await Helper.getData('USERNAME');
    let code = 'Weld';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'DrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          teamLeader: teamLeader,
          title: 'Weld Detail',
          link: link,
        }
      );
    } else {
      let token = await Helper.getData('TOKEN');
      GetFacilityCodeByDrawingAPI(projectCode, drawingNo, sheet, rev, token)
        .then(res => {
          if (res.success) {
            navigation.navigate('DrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              teamLeader: teamLeader,
              title: 'Weld Detail',
              link: link,
            });
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        }).catch(() => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  };

  const _onPressQRCodeFitUp = async () => {
    Keyboard.dismiss();
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'FitUp',
        source: 'Drawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };

  const _onPressQRCodeWeld = async () => {
    Keyboard.dismiss();
    let teamLeader = await Helper.getData('USERNAME');
    navigation.navigate(
      'Camera',
      {
        code: 'Weld',
        source: 'Drawing',
        projectCode: projectCode,
        teamLeader: teamLeader,
      }
    );
  };





  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data with </Text>
      <Text style={styles.noDataTitle}>ProjectCode <Text style={styles.noDataText}>{projectCode}</Text></Text>
    </View>
  );

  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptySearchData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have result with </Text>
      {drawingNo ? <Text style={styles.noDataTitle}>DrawingNo: <Text style={styles.noDataText}>{drawingNo}</Text></Text> : null}
      {facilityCode && facilityCode != FACILITY_CODE_DEFAULT ? <Text style={styles.noDataTitle}>FacilityCode: <Text style={styles.noDataText}>{facilityCode}</Text></Text> : null}
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Cons Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.DrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.DrawingNo}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Sheet:</Text>
          <Text style={styles.cellData}>{item.Sheet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Rev:</Text>
          <View style={styles.cellData}>
            <View style={styles.cellValue}>
              <Text style={styles.textValue}>{item.Rev}</Text>
            </View>
            <View style={styles.cellProgress}>
              {
                item.progess
                  ?
                  <>
                    <Text style={styles.cellAction}>{item.progess.FitUp}%</Text>
                    <Text style={styles.cellAction}>{item.progess.Weld}%</Text>
                  </>
                  :
                  <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressCompletePercent(item.DrawingNo, item.Sheet, item.Rev) }}>
                    <Text style={styles.textAction}>Complete Percent</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        </View>
        <View style={styles.rowAction}>
          <View style={styles.cellTitle} />
          <View style={styles.cellData}>
            <View style={styles.cellValue} />
            <View style={styles.cellProgress}>
              <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewFitUp(item.DrawingNo, item.Sheet, item.Rev, item.WebLink) }}>
                <Text style={styles.textAction}>View FitUp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewWeld(item.DrawingNo, item.Sheet, item.Rev, item.WebLink) }}>
                <Text style={styles.textAction}>View Weld</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDrawingDetail)} />
        :
        (!isSearch && drawingList.length == 0
          ?
          <View style={styles.container}>
            <ListEmptyData />
          </View>
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
                        onSubmitEditing={_onPressSearchDrawing}
                        underlineColorAndroid='transparent'
                      />
                      {drawingNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
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
                (drawingList.length
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
                  : <ListEmptySearchData />
                )
            }
            <View style={styles.scanContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQRCodeFitUp}>
                <Text style={styles.buttonTitle}>Scan FitUp Drawing</Text>
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
                  <Text style={modals.text}>Current Facility Code: <Text style={modals.code}>{facilityCode}</Text></Text>
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
    flexShrink: 1,
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
    minHeight: 36,
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
    padding: 4,
  },
  line: {
    height: '100%',
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
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
});

export default DrawingListScreen;