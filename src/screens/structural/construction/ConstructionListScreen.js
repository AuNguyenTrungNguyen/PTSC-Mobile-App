import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, ActivityIndicator, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetConstructionListSubContractorAPI, GetCurrentConstructionInfoAPI } from '../../../apis/structural/ConstructionAPI';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ConstructionListScreen = ({ route, navigation }) => {

  const { projectCode, subContractor, userLogin, code } = route.params;

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [constructionList, setConstructionList] = useState(null);
  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);

  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
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
      callAPI(getFacilityList);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
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

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
    if (no === '') {
      callAPI(() => { searchConstruction(facilityCode, '') }, false);
    }
  };

  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchConstruction(code, drawingNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  const searchConstruction = async (facilityCode, drawingNo) => {
    Keyboard.dismiss();
    facilityCode = (facilityCode != null && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo != null ? drawingNo : '';
    GetConstructionListSubContractorAPI(projectCode, facilityCode, drawingNo)
      .then(res => {
        if (res.success) {
          setConstructionList(res.data);
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
    if (drawingNo !== oldDrawingNo) {
      setOldDrawingNo(drawingNo);
      callAPI(() => { searchConstruction(facilityCode, drawingNo) }, false);
    }
  };

  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchConstruction('', drawingNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  const _onPressViewDetail = async (drawingNo, sheet, rev, link, code) => {
    Keyboard.dismiss();
    const title = code + ' Detail';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'ConstructionDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          userLogin: userLogin,
          link: link,
          title: title,
        }
      );
    } else {
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev)
        .then(res => {
          if (res.success) {
            navigation.navigate('ConstructionDetail', {
              projectCode: projectCode,
              facilityCode: res.data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              userLogin: userLogin,
              link: res.link,
              title: title,
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

  const _onPressViewMultiDetail = async (drawingNo, sheet, rev, link, code) => {
    Keyboard.dismiss();
    const title = code + ' Detail';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'ConstructionMultiDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          userLogin: userLogin,
          link: link,
          title: title,
        }
      );
    } else {
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev)
        .then(res => {
          if (res.success) {
            navigation.navigate('ConstructionMultiDetail', {
              projectCode: projectCode,
              facilityCode: res.data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              userLogin: userLogin,
              link: res.link,
              title: title,
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

  const RenderConstructionList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (constructionList == null) {
        return <ListSelectData title={'Enter DrawingNo or FacilityCode'} />
      } else if (!constructionList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={constructionList}
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
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Construction Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.WeldMapDrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.WeldMapDrawingNo}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Sheet:</Text>
          <Text style={styles.cellData}>{item.WMSheet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Rev:</Text>
          <View style={styles.cellData}>
            <View style={styles.cellValue}>
              <Text style={styles.textValue}>{item.WMRev}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rowAction}>
          <View style={styles.cellTitle} />
          <View style={styles.cellData}>
            <View style={styles.cellValue} />
            {
              code == Constant.CODE_FITUP
                ?
                <View style={styles.cellProgress}>
                  <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewDetail(item.WeldMapDrawingNo, item.WMSheet, item.WMRev, item.WebLink, Constant.CODE_FITUP) }}>
                    <Text style={styles.textAction}>View FitUp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewMultiDetail(item.WeldMapDrawingNo, item.WMSheet, item.WMRev, item.WebLink, Constant.CODE_FITUP) }}>
                    <Text style={styles.textAction}>Multi FitUp</Text>
                  </TouchableOpacity>
                </View>
                :
                <View style={styles.cellProgress}>
                  <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewDetail(item.WeldMapDrawingNo, item.WMSheet, item.WMRev, item.WebLink, Constant.CODE_WELD) }}>
                    <Text style={styles.textAction}>View Weld</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewMultiDetail(item.WeldMapDrawingNo, item.WMSheet, item.WMRev, item.WebLink, Constant.CODE_WELD) }}>
                    <Text style={styles.textAction}>Multi Weld</Text>
                  </TouchableOpacity>
                </View>
            }
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError}
          _onPressRefresh={() => { callAPI(() => { searchConstruction(facilityCode, drawingNo) }, true) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              <View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <Text style={styles.infoData}>{projectCode}  -  {subContractor}</Text>
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
              </View>
              :
              null
          }
          <RenderConstructionList />
          {/* <View style={styles.scanContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressQRCodeFitUp}>
              <Text style={styles.buttonTitle}>Scan FitUp Drawing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressQRCodeWeld}>
              <Text style={styles.buttonTitle}>Scan Weld Drawing</Text>
            </TouchableOpacity>
          </View> */}
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

export default ConstructionListScreen;