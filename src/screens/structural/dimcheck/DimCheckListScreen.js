import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import { GetDimCheckListQRCodeAPI } from '../../../apis/structural/DimCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTwoColumns from '../../../components/SelectPopupTwoColumns';

const DimCheckListScreen = ({ route, navigation }) => {

  const { projectCode, sheet, rev, userLogin, paramDrawingNo, isSpending } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);
  const [jointNo, setJointNo] = useState('');
  const [oldJointNo, setOldJointNo] = useState(null);

  const [dimCheckList, setDimCheckList] = useState(null);

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
        <View style={{ flexDirection: 'row' }}>
          {
            !isSpending &&
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setIsVisibleType(true) }}>
              <Ionicons
                size={24}
                name={'md-ellipsis-vertical-circle'} color={iconColor} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleLocation(true) }}>
            <Ionicons
              size={24}
              name={'md-list-circle-outline'} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);

  const isFocused = useIsFocused();
  const callAPI = (executedAPI, loading = true) => {
    if (isFocused) {
      if (!loading === null) {
        if (loading) {
          setIsLoading(true);
        } else {
          setIsSearching(true);
        }
      }
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
          MessageAlert('WARNING', 'Network not available!');
        } else {
          executedAPI();
        }
      });
    }
  };
  useEffect(
    () => {
      if (paramDrawingNo) {
        setDrawingNo(paramDrawingNo);
        callAPI(() => { searchDimCheckList(paramDrawingNo, jointNo, type, location) }, false);
      } else {
        callAPI(() => { searchDimCheckList(drawingNo, jointNo, type, location) }, false);
      }
    }, [isFocused]
  );

  //-- Filter Type
  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.FILTER_ALL);
  const _onChangeType = value => {
    if (value !== type) {
      setType(value);
      callAPI(() => { searchDimCheckList(drawingNo, jointNo, value, location) });
    }
    setIsVisibleType(false);
  };

  //-- Location
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState('');
  const _onChangeLocation = data => {
    const value = data.Location ? data.Location : '';
    if (value !== location) {
      setLocation(value);
      callAPI(() => { searchDimCheckList(drawingNo, jointNo, type, value) });
    }
    setIsVisibleLocation(false);
  };
  const _onPressClearLocation = () => {
    if (location !== '') {
      setLocation('');
      callAPI(() => { searchDimCheckList(drawingNo, jointNo, type, '') });
    }
    setIsVisibleLocation(false);
  };

  //-- DrawingNo
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };
  const _onClearDrawingNo = () => {
    setDrawingNo('');
    setOldDrawingNo(null);
    callAPI(() => { searchDimCheckList('', jointNo, type, location) }, false);
  };

  //-- JointNo
  const _onChangeJointNo = no => {
    setJointNo(no);
  };
  const _onClearJointNo = () => {
    setJointNo('');
    setOldJointNo(null);
    callAPI(() => { searchDimCheckList(drawingNo, '', type, location) }, false);
  };

  //-- Search
  const _onPressSearchList = () => {
    let isSearch = false;
    if (drawingNo !== oldDrawingNo) {
      setOldDrawingNo(drawingNo);
      isSearch = true;
    }
    if (jointNo !== oldJointNo) {
      setOldJointNo(jointNo);
      isSearch = true;
    }
    if (isSearch) {
      callAPI(() => { searchDimCheckList(drawingNo, jointNo, type, location) }, false);
    }
  };
  const searchDimCheckList = async (drawingNo, jointNo, filterType, filterLocation) => {
    Keyboard.dismiss();
    const token = await Helper.getData('TOKEN');
    drawingNo = drawingNo != null ? drawingNo : '';
    jointNo = jointNo != null ? jointNo : '';
    GetDimCheckListQRCodeAPI(projectCode, drawingNo, jointNo, sheet, rev, filterType, isSpending, filterLocation, token)
      .then(res => {
        if (res.Success) {
          setDimCheckList(res.Data);
          setLocationList(res.Second);
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

  //-- Detail
  const _onPressViewDetail = item => {
    navigation.navigate(
      'DimCheckDetail',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        rowIndex: item.RowIndex,
        drawingNo: item.WeldMapDrawingNo,
        link: item.WebLink,
        jointNo: item.JointNo,
        pieceNo1: item.PieceNo1,
        result01: item.DIM_BeforeWeldResult_PM1,
        pieceNo2: item.PieceNo2,
        result02: item.DIM_BeforeWeldResult_PM2,
      }
    );
  };





  const getStatusRenderList = () => {
    return !isSearching && dimCheckList && dimCheckList.length;
  };

  const RenderList = () => {
    if (isSearching) {
      return <ListLoadingData />
    } else if (dimCheckList == null) {
      return <ListSelectData title={'Enter DrawingNo or JointNo'} />
    } else if (!dimCheckList.length) {
      return <ListEmptyData />
    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity onPress={() => { _onPressViewDetail(item) }}>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>DrawingNo:</Text>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Lam Check Drawing')} style={styles.cellData}>
                  <Text style={CoreStyle.textLinkWithLine}>{item.WeldMapDrawingNo}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.cellData}>{item.WeldMapDrawingNo}</Text>
            }
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>JointNo:</Text>
            <Text style={styles.cellData}>{item.JointNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PieceNo1:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceNo1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Result01:</Text>
            {
              item.DIM_BeforeWeldResult_PM1
                ?
                item.DIM_BeforeWeldResult_PM1 == Constant.STATUS_ACCEPT
                  ?
                  <Text style={[styles.cellData, styles.labelAccept]}>{item.DIM_BeforeWeldResult_PM1}</Text>
                  :
                  <Text style={[styles.cellData, styles.labelReject]}>{item.DIM_BeforeWeldResult_PM1}</Text>
                :
                <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_BeforeWeldResult_PM1)}</Text>
            }
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>PieceNo2:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.PieceNo2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Result02:</Text>
            {
              item.DIM_BeforeWeldResult_PM2
                ?
                item.DIM_BeforeWeldResult_PM2 == Constant.STATUS_ACCEPT
                  ?
                  <Text style={[styles.cellData, styles.labelAccept]}>{item.DIM_BeforeWeldResult_PM2}</Text>
                  :
                  <Text style={[styles.cellData, styles.labelReject]}>{item.DIM_BeforeWeldResult_PM2}</Text>
                :
                <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_BeforeWeldResult_PM2)}</Text>
            }
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>InspectName:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_BeforeWeldInspectName)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Team:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.FitUpRequestByTeamDescription)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Location:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.Location)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Date:</Text>
            <Text style={styles.cellData}>{Formater.formatDateData(item.DIMRequestDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Time:</Text>
            <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIMRemark)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchDimCheckList(drawingNo, jointNo, type, location) }) }} />
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
                        : <Icon name='times-circle' onPress={_onClearDrawingNo} style={styles.inputIcon} />
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
                        : <Icon name='times-circle' onPress={_onClearJointNo} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchList}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search List</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
          }
          {
            getStatusRenderList()
              ?
              <>
                <Text style={CoreStyle.textNote}>* Click an item to update status</Text>
                <VirtualizedList
                  style={styles.table}
                  data={dimCheckList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
              </>
              :
              <RenderList />
          }
        </View>
      }
      <SelectPopup
        visible={isVisibleType}
        data={[Constant.FILTER_ALL, Constant.FILTER_NOT_YET, Constant.FILTER_ALREADY]}
        onCancel={() => setIsVisibleType(false)}
        onChangeItem={_onChangeType}>
      </SelectPopup>
      <SelectPopupTwoColumns
        visible={isVisibleLocation}
        leftHeader={'Location'}
        rightHeader={'Total'}
        leftKey={'Location'}
        rightKey={'Total'}
        data={locationList}
        onChangeItem={_onChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
        onClear={_onPressClearLocation}
      />
    </SafeAreaView>
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
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonAccept: {
    width: 70,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelAccept: {
    color: 'green',
  },
  buttonReject: {
    width: 70,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReject: {
    color: 'red',
  },
  buttonImage: {
    width: 70,
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelImage: {
    color: 'darkblue',
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
  },
  buttonAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
});

export default DimCheckListScreen;