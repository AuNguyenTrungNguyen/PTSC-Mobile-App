import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetConstructionListAPI, GetCurrentConstructionInfoAPI } from '../../../apis/piping/GREConsAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import LoadingRefresh from '../../../components/LoadingRefresh';

const GREDrawingListScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

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
      callAPI(() => { searchDrawing(code, drawingNo, jointNo) }, false);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchDrawing('', drawingNo, jointNo) }, false);
    }
    setIsVisibleFacility(false);
  };

  //-- DrawingNo
  const [drawingNo, setDrawingNo] = useState('');
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };

  //-- JointNo
  const [jointNo, setJointNo] = useState('');
  const _onChangeJointNo = no => {
    setJointNo(no);
  };

  //-- Search Action
  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(() => { searchDrawing(facilityCode, drawingNo, jointNo) }, false);
  };
  const searchDrawing = (facilityCode, drawingNo, jointNo) => {
    setIsSearching(true);
    facilityCode = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    drawingNo = drawingNo ? drawingNo : '';
    jointNo = jointNo ? jointNo : '';
    GetConstructionListAPI(projectCode, facilityCode, drawingNo, jointNo)
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

  //-- Item Action
  const _onPressViewFitting = async (drawingNo, sheet, rev, link) => {
    Keyboard.dismiss();
    const userLogin = await Helper.getData('USERNAME');
    const code = Constant.CODE_FITUP;
    const title = 'Fitting Detail';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'GREDrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          userLogin: userLogin,
          title: title,
          link: link,
        }
      );
    } else {
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev)
        .then(res => {
          if (res.Success) {
            navigation.navigate('GREDrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.Data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              userLogin: userLogin,
              title: title,
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
  const _onPressViewCuring = async (drawingNo, sheet, rev, link) => {
    Keyboard.dismiss();
    const userLogin = await Helper.getData('USERNAME');
    const code = Constant.CODE_VISUAL;
    const title = 'Curing Detail';
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      navigation.navigate(
        'GREDrawingDetail',
        {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          sheet: sheet,
          rev: rev,
          code: code,
          userLogin: userLogin,
          title: 'Curing Detail',
          link: link,
        }
      );
    } else {
      GetCurrentConstructionInfoAPI(projectCode, drawingNo, sheet, rev)
        .then(res => {
          if (res.Success) {
            navigation.navigate('GREDrawingDetail', {
              projectCode: projectCode,
              facilityCode: res.Data,
              drawingNo: drawingNo,
              sheet: sheet,
              rev: rev,
              code: code,
              userLogin: userLogin,
              title: title,
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





  //-- Renderer
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'GRE Drawing')} style={styles.cellData}>
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
          </View>
        </View>
        <View style={styles.rowAction}>
          <View style={styles.cellTitle} />
          <View style={styles.cellData}>
            <View style={styles.cellValue} />
            <View style={styles.cellProgress}>
              <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewFitting(item.DrawingNo, item.Sheet, item.Rev, item.WebLink) }}>
                <Text style={styles.textAction}>View Fitting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cellAction} onPress={() => { _onPressViewCuring(item.DrawingNo, item.Sheet, item.Rev, item.WebLink) }}>
                <Text style={styles.textAction}>View Curing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (drawingList == null) {
        return <ListSelectData title={'Enter Facility, Drawing or Joint'} />
      } else if (!drawingList.length) {
        return <ListEmptyData />
      } else {
        return <></>
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(() => { searchDrawing(facilityCode, drawingNo, jointNo) }, true) }} />
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
                      {drawingNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>JointNo:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={jointNo}
                        onChangeText={_onChangeJointNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        jointNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeJointNo('')} style={styles.inputIcon} />
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
            {
              !isSearching && drawingList && drawingList.length
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
                <RenderList />
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

export default GREDrawingListScreen;