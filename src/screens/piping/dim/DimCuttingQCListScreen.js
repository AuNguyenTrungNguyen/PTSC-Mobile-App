import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetDimCuttingQCListAPI, UpdateDimCuttingQCListAPI } from '../../../apis/piping/DimAPI';

import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import TotalLocationModal from '../../../components/drawing/TotalLocationModal';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DimCuttingQCListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spendList, setSpendList] = useState([]);
  const [updateSpendList, setUpdateSpendList] = useState([]);

  const [drawingNo, setDrawingNo] = useState('');
  const [weldNo, setWeldNo] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
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
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  const callAPI = executedAPI => {
    setIsSearching(true);
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
  };
  useEffect(
    () => {
      callAPI(getSpendListData);
    }, []
  );

  //-- Search Action
  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(getSpendListData);
  };
  const getSpendListData = async (drawing = drawingNo, weld = weldNo, loc = location) => {
    const token = await Helper.getData('TOKEN');
    GetDimCuttingQCListAPI(projectCode, drawing, weld, loc, token)
      .then(res => {
        if (res.Success && res.Data) {
          setSpendList(res.Data);
          setLocationList(res.Second);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  //-- Update Action
  const _onPressSubmitToServer = async () => {
    if (updateSpendList.length) {
      callAPI(updateSpendData);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };
  const updateSpendData = async () => {
    const token = await Helper.getData('TOKEN');
    const listUpdate = Helper.handleListUpdate(updateSpendList);
    UpdateDimCuttingQCListAPI(projectCode, userLogin, listUpdate, token)
      .then(res => {
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateSpendList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(getSpendListData);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
      });
  };

  //-- DrawingNo & WeldNo
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };
  const _onChangeWeldNo = no => {
    setWeldNo(no);
  };

  //-- Update Data
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const onChangeData = (data, localIndex = indexUpdate, localKey = keyUpdate) => {
    let array = [...spendList];
    array[localIndex][localKey] = data;
    setSpendList(array);

    array = [...updateSpendList];
    const rowIndex = spendList[localIndex].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [localKey]: data });
    } else {
      array[objIndex][localKey] = spendList[localIndex][localKey];
    }
    setUpdateSpendList(array);
  };

  const _onPressChangeStatus = (value, index, key) => {
    if (spendList[index][key] !== value) {
      setIndexUpdate(index);
      setKeyUpdate(key);
      onChangeData(value, index, key);
    }
  };

  //-- Location
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState('');
  const _onPressChangeLocation = loc => {
    _onChangeLocation(loc);
  };
  const _onPressClearLocation = () => {
    _onChangeLocation('');
  };
  const _onChangeLocation = loc => {
    if (loc != location) {
      setLocation(loc);
      callAPI(() => { getSpendListData(drawingNo, weldNo, loc) });
    }
    setIsVisibleLocation(false);
  };



  //-- Render List
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>CPName:</Text>
          </View>
          <View style={styles.cellTitleLine}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Dim Cutting Drawing')} style={styles.textData}>
                  <Text style={CoreStyle.textLinkWithLine}>{Formater.formatEmptyData(item.CuttingPlanName)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.CuttingPlanName)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>CPPiece:</Text>
          </View>
          <View style={styles.cellTitleLine}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.CuttingPlanPiece)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>CPSheet:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.CPSheet)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>CPRev:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.CPRev)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>SerialNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.SerialNo)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>HeatNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>Length:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.LENGTH_MM)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>Location:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Location)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>Team:</Text>
          </View>
          <View style={styles.cellTitleLine}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.DIM_ForCuttingRequestByTeam)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>CutDate:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatDateData(item.DIM_ForCuttingDate)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>Status:</Text>
          </View>
          <View style={styles.cellData}>
            {
              item.DIM_ForCuttingResult
                ?
                item.DIM_ForCuttingResult == 'ACC'
                  ?
                  <Text style={styles.textAccept}>{item.DIM_ForCuttingResult}</Text>
                  :
                  <Text style={styles.textReject}>{item.DIM_ForCuttingResult}</Text>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.DIM_ForCuttingResult)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => _onPressChangeStatus('ACC', index, 'DIM_ForCuttingResult')}>
              <Text style={styles.labelAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => _onPressChangeStatus('REJ', index, 'DIM_ForCuttingResult')}>
              <Text style={styles.labelReject}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonClean}
              onPress={() => _onPressChangeStatus(null, index, 'DIM_ForCuttingResult')}>
              <Text style={styles.labelClean}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (!spendList.length) {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getSpendListData)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text>Project: </Text>
                    <Text style={[styles.infoData]}>{projectCode}</Text>
                    <Text>   User: </Text>
                    <Text style={[styles.infoData]}>{userLogin}</Text>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>CPName:</Text>
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
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>CPPiece:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={weldNo}
                        onChangeText={_onChangeWeldNo}
                        underlineColorAndroid='transparent'
                      />
                      {weldNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeWeldNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchDrawing}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Dim Cutting</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              spendList && spendList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={spendList}
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
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonAction} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Submit to Server</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      <TotalLocationModal
        visible={isVisibleLocation}
        data={locationList}
        onClose={() => setIsVisibleLocation(false)}
        onPressChangeLocation={_onPressChangeLocation}
        onPressClearLocation={_onPressClearLocation}
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
    minHeight: 24,
    marginBottom: 4,
  },
  infoData: {
    flex: 2,
    fontWeight: 'bold',
    color: BASE_COLOR,
    textAlign: 'center',
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
    minHeight: 20,
  },
  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTitleLine: {
    flex: 3.5,
    justifyContent: 'center',
  },
  cellData: {
    flex: 1.25,
    justifyContent: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  cellAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAccept: {
    width: 70,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReject: {
    color: 'red',
  },
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
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
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default DimCuttingQCListScreen;