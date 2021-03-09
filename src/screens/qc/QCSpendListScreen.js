import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../utils/Helper';
import GetSpendListAPI from '../../apis/qc/GetSpendListAPI';
import UpdateSpendListAPI from '../../apis/qc/UpdateSpendListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import TotalLocationModal from '../../components/drawing/TotalLocationModal';

const QCSpendListScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spendList, setSpendList] = useState([]);
  const [updateSpendList, setUpdateSpendList] = useState([]);

  const [isVisibleTotal, setIsVisibleTotal] = useState(false);
  const [totalList, setTotalList] = useState([]);

  const { projectCode, userLogin, code } = route.params;

  const [weldNo, setWeldNo] = useState('');
  const [drawingNo, setDrawingNo] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleTotal(true) }}>
            <Ionicons
              size={24}
              name={'md-list-circle-outline'} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
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

  useEffect(
    () => {
      callAPI(getSpendListData);
    }, []
  );

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

  const getSpendListData = async (weld = weldNo, drawing = drawingNo) => {
    let token = await Helper.getData('TOKEN');
    GetSpendListAPI(projectCode, weld, drawing, code, token)
      .then(res => {
        if (res.success) {
          setSpendList(res.data);
          setTotalList(res.total);
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

  const updateSpendData = async () => {
    let token = await Helper.getData('TOKEN');
    UpdateSpendListAPI(projectCode, code, userLogin, updateSpendList, token)
      .then(res => {
        if (res.success) {
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

  const _onChangeWeldNo = no => {
    setWeldNo(no);
    if (!no) {
      callAPI(() => { getSpendListData(no, drawingNo) });
    }
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
    if (!no) {
      callAPI(() => { getSpendListData(weldNo, no) });
    }
  };

  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(getSpendListData);
  };

  const _onPressSubmitToServer = async () => {
    if (updateSpendList.length) {
      callAPI(updateSpendData);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressChangeStatus = (value, index, key) => {
    let array = [...spendList];
    array[index][key] = value;
    setSpendList(array);

    array = [...updateSpendList];
    let rowIndex = spendList[index].RowIndex;
    let weldNo = spendList[index].WeldNo;
    let facilityCode = spendList[index].FacilityCode;
    let drawingNo = spendList[index].DrawingNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, FacilityCode: facilityCode, DrawingNo: drawingNo, ['ItemResult']: value });
    } else {
      array[objIndex]['ItemResult'] = spendList[index][key];
    }
    setUpdateSpendList(array);
  };

  const _onPressOpenDrawing = link => {
    navigation.navigate(
      'PDFView',
      {
        link: link,
        title: 'View Drawing Spend List',
      }
    );
  };

  const _onPressManagePicture = async (facilityCode, drawingNo) => {
    navigation.navigate(
      'DrawingImage',
      {
        projectCode: projectCode,
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        code: code == 'Visual' ? 'Weld' : code,
        teamLeader: userLogin
      }
    );
  };

  const formatEmptyData = data => {
    return data ? data : '';
  };

  const formatDateData = data => {
    return data ? Moment(data).format("DD-MMM-YY") : '';
  };



  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      {
        weldNo || drawingNo
          ?
          <Text style={styles.noDataTitle}>No have any data with</Text>
          :
          <Text style={styles.noDataTitle}>No have any data</Text>
      }
      {
        weldNo
          ?
          <Text style={styles.noDataTitle}>WeldNo: <Text style={styles.noDataText}>{weldNo}</Text></Text>
          :
          null
      }
      {
        drawingNo
          ?
          <Text style={styles.noDataTitle}>DrawingNo: <Text style={styles.noDataText}>{drawingNo}</Text></Text>
          :
          null
      }

    </View>
  );

  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>WeldNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{formatEmptyData(item.WeldNo)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>WeldType:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{formatEmptyData(item.WeldType)}</Text>
          </View>
          <View style={styles.cellImageAction}>
            {
              <TouchableOpacity onPress={() => { _onPressManagePicture(item.FacilityCode, item.DrawingNo) }}>
                <Ionicons size={24} name={'md-image-outline'} color={iconColor} />
              </TouchableOpacity>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>DrawingNo: </Text>
          </View>
          <View style={styles.cellDrawingAction}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => { _onPressOpenDrawing(item.WebLink) }}>
                  <Text style={styles.textDataOpen}>{formatEmptyData(item.DrawingNo)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{formatEmptyData(item.DrawingNo)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>Sheet:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{formatEmptyData(item.Sheet)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>Rev:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{formatEmptyData(item.Rev)}</Text>
          </View>
        </View>
        {code == 'FitUp'
          ?
          (<>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>HeatNo01:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatEmptyData(item.Heat01)}</Text>
              </View>
              <View style={styles.cellTitle}>
                <Text>HeatNo02:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatEmptyData(item.Heat02)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FittingDate:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatDateData(item.FittingDate)}</Text>
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonAccept}
                  onPress={() => _onPressChangeStatus('ACC', index, 'FitUpResult')}>
                  <Text style={styles.labelAccept}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Location:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatEmptyData(item.Location)}</Text>
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonReject}
                  onPress={() => _onPressChangeStatus('REJ', index, 'FitUpResult')}>
                  <Text style={styles.labelReject}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FitUpStatus:</Text>
              </View>
              <View style={styles.cellData}>
                {
                  item.FitUpResult
                    ?
                    item.FitUpResult == 'ACC'
                      ?
                      <Text style={styles.textAccept}>{item.FitUpResult}</Text>
                      :
                      <Text style={styles.textReject}>{item.FitUpResult}</Text>
                    :
                    <Text style={styles.textData}>{formatEmptyData(item.FitUpResult)}</Text>
                }
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonClean}
                  onPress={() => _onPressChangeStatus(null, index, 'FitUpResult')}>
                  <Text style={styles.labelClean}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>)
          :
          (<>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WelderIDs:</Text>
              </View>
              <View style={styles.cellWelder}>
                <Text style={styles.textData}>{formatEmptyData(item.WelderID)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WPSNo:</Text>
              </View>
              <View style={styles.cellWelder}>
                <Text style={styles.textData}>{formatEmptyData(item.WPSNo)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WeldingDate:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatDateData(item.WeldingDate)}</Text>
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonAccept}
                  onPress={() => _onPressChangeStatus('ACC', index, 'VisualResult')}>
                  <Text style={styles.labelAccept}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Location:</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.textData}>{formatEmptyData(item.Location)}</Text>
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonReject}
                  onPress={() => _onPressChangeStatus('REJ', index, 'VisualResult')}>
                  <Text style={styles.labelReject}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>VisualStatus:</Text>
              </View>
              <View style={styles.cellData}>
                {
                  item.VisualResult
                    ?
                    item.VisualResult == 'ACC'
                      ?
                      <Text style={styles.textAccept}>{item.VisualResult}</Text>
                      :
                      <Text style={styles.textReject}>{item.VisualResult}</Text>
                    :
                    <Text style={styles.textData}>{formatEmptyData(item.VisualResult)}</Text>
                }
              </View>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.buttonClean}
                  onPress={() => _onPressChangeStatus(null, index, 'VisualResult')}>
                  <Text style={styles.labelClean}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
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
                  <Text style={[styles.infoData]}>{projectCode.toUpperCase()}</Text>
                  <Text>   User: </Text>
                  <Text style={[styles.infoData]}>{userLogin.toUpperCase()}</Text>
                </View>
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction}>DrawingNo:</Text>
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
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction}>WeldNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={weldNo}
                      onChangeText={_onChangeWeldNo}
                      onSubmitEditing={_onPressSearchDrawing}
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
                    <Text style={styles.buttonTitle}>Search Drawing</Text>
                  </TouchableOpacity>
                </View>
              </View>)
              :
              null
          }
          {isSearching
            ?
            <ListSearchData />
            :
            spendList.length
              ?
              <VirtualizedList
                style={styles.table}
                data={spendList}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(index) => {
                  return index;
                }}
                renderItem={renderItem}
              />
              :
              <ListEmptyData />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonAction} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <TotalLocationModal
        visible={isVisibleTotal}
        data={totalList}
        onClose={() => setIsVisibleTotal(false)} />
    </SafeAreaView>
  );
}

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
    margin: 4,
    minHeight: 20,
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textDataOpen: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellWelder: {
    flex: 2,
    justifyContent: 'center',
  },
  cellData: {
    flex: 1,
    justifyContent: 'center',
  },
  cellDrawingAction: {
    flex: 3,
    justifyContent: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center'
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
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
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

export default QCSpendListScreen;