import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../utils/Helper';
import Constant from '../../utils/Constant';
import Formater from '../../utils/Formater';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import SelectPopup from '../../components/SelectPopup';

import { GetNDTDetailListAPI, UpdateNDTDetailListAPI } from '../../apis/ndt/NDTAPI';

const NDTDetailScreen = ({ route, navigation }) => {

  const { projectCode, code } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spoolNo, setSpoolNo] = useState('');
  const [actualType, setActualType] = useState(Constant.NDT_ACTUAL_ALL);

  const [NDTList, setNDTList] = useState([]);
  const [NDTUpdateList, setNDTUpdateList] = useState([]);

  const [isVisibleActual, setIsVisibleActual] = useState(false);

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
      callAPI(getNDTDetailList);
    }, []
  );

  const callAPI = executedAPI => {
    setIsSearching(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsSearching(false);
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const getNDTDetailList = async (spool = spoolNo, actual = actualType) => {
    let token = await Helper.getData('TOKEN');
    spool = spool === null ? Constant.NDT_EMPTY_VALUE : spool;
    actual = actual === Constant.NDT_ACTUAL_ALL ? Constant.NDT_EMPTY_VALUE : actual;
    GetNDTDetailListAPI(projectCode, spool, actual, code, token)
      .then(res => {
        if (res.success) {
          setNDTList(res.data);
          setIsSearching(false);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsSearching(false);
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setIsSearching(false);
        setIsLoading(false);
        setIsError(true);
      });
  };

  const updateNDTDetailList = async () => {
    let token = await Helper.getData('TOKEN');
    let userUpdate = await Helper.getData('USERNAME');
    UpdateNDTDetailListAPI(code, userUpdate, NDTUpdateList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setNDTUpdateList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(getNDTDetailList);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
      });
  };

  const _onChangeSpoolNo = no => {
    setSpoolNo(no);
  };

  const _onResetSpoolNo  = () => {
    setSpoolNo(Constant.NDT_EMPTY_VALUE);
    callAPI(() => getNDTDetailList(Constant.NDT_EMPTY_VALUE, actualType));
  };

  const _onChangeActualType = type => {
    setActualType(type);
    setIsVisibleActual(false);
    callAPI(() => getNDTDetailList(spoolNo, type));
  };

  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(getNDTDetailList);
  };

  const _onPressSubmitToServer = async () => {
    if (NDTUpdateList.length) {
      NDTUpdateList.map((item) => {
        let keys = Object.keys(item);
        let column = keys.filter(k => (k === Constant.NDT_KEY_RESULT));
        item[Constant.COLUMN_CHANGE] = column;
        return item;
      });
      callAPI(updateNDTDetailList);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressChangeStatus = (value, index, key) => {
    let array = [...NDTList];
    array[index][key] = value;
    setNDTList(array);

    array = [...NDTUpdateList];
    let rowIndex = NDTList[index].RowIndex;
    let spoolNo = NDTList[index].SpoolsNo;
    let weldNo = NDTList[index].WeldNo;
    let drawingNo = NDTList[index].DrawingNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, SpoolNo: spoolNo, WeldNo: weldNo, DrawingNo: drawingNo, [key]: value });
    } else {
      array[objIndex][key] = value;
    }
    setNDTUpdateList(array);
  };

  const _onPressResetStatus = (value, index, key) => {
    let array = [...NDTList];
    array[index][key] = value;
    setNDTList(array);

    array = [...NDTUpdateList];
    let rowIndex = NDTList[index].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex >= 0) {
      let object = array.find((obj => obj.RowIndex == rowIndex));
      delete object[key];
      array[objIndex] = object;
      setNDTUpdateList(array);
    }
  };

  const _onPressUpdateIssue = async (rowIndex, spoolNo, jointNo, drawingNo) => {
    let username = await Helper.getData('USERNAME');
    const title = code + ' Update Issue';
    navigation.navigate(
      'NDTIssue',
      {
        projectCode: projectCode,
        rowIndex: rowIndex,
        spoolNo: spoolNo,
        jointNo: jointNo,
        drawingNo: drawingNo,
        code: code,
        username: username,
        title: title
      }
    );
  };

  const getItemStatus = (item) => {
    switch (item.result) {
      case Constant.NDT_RESULT_ACC:
        return Constant.NDT_RESULT_ACC;
      case Constant.NDT_RESULT_REJ:
        return Constant.NDT_RESULT_REJ;
      default:
        return Constant.NDT_RESULT_EMPTY;
    }
  };



  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      {
        actualType != Constant.NDT_EMPTY_VALUE || spoolNo
          ?
          <Text style={styles.noDataTitle}>No have any data with</Text>
          :
          <Text style={styles.noDataTitle}>No have any data</Text>
      }
      {
        actualType != Constant.NDT_EMPTY_VALUE
          ?
          <Text style={styles.noDataTitle}>ActualType: <Text style={styles.noDataText}>{actualType}</Text></Text>
          :
          null
      }
      {
        spoolNo
          ?
          <Text style={styles.noDataTitle}>SpoolNo: <Text style={styles.noDataText}>{spoolNo}</Text></Text>
          :
          null
      }

    </View>
  );

  const StatusResult = ({ result }) => {
    switch (result) {
      case Constant.NDT_RESULT_ACC:
        return (<Text style={styles.textAccept}>{result}</Text>);
      case Constant.NDT_RESULT_REJ:
        return (<Text style={styles.textReject}>{result}</Text>);
      default:
        return (<Text style={styles.textData}>{Formater.formatEmptyData(result)}</Text>);
    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>SpoolNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.SpoolsNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>DrawingNo:</Text>
          </View>
          <View style={styles.cellData}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open NDT Drawing')}>
                  <Text style={styles.textDataLink}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>WeldNo:</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldNo)}</Text>
          </View>
          <View style={styles.cellTitle}>
            <Text>Result:</Text>
          </View>
          <View style={styles.cellTitle}>
            <StatusResult result={item.NDTResult} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => _onPressChangeStatus(Constant.NDT_RESULT_ACC, index, Constant.NDT_KEY_RESULT)}>
              <Text style={styles.labelAccept}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => _onPressChangeStatus(Constant.NDT_RESULT_REJ, index, Constant.NDT_KEY_RESULT)}>
              <Text style={styles.labelReject}>Reject</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonIssue}
              onPress={() => _onPressUpdateIssue(item.RowIndex, item.SpoolsNo, item.WeldNo, item.DrawingNo)}>
              <Text style={styles.labelIssue}>Issue</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cellAction}>
            <TouchableOpacity
              style={styles.buttonReset}
              onPress={() => _onPressResetStatus(getItemStatus(item), index, Constant.NDT_KEY_RESULT)}>
              <Text style={styles.labelReset}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getNDTDetailList)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              (<View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellTitle}>ProjectCode:</Text>
                  <Text style={styles.headerCellData}>{projectCode}</Text>
                </View>
                <View style={styles.headerActionRow}>
                  <Text style={styles.headerCellTitle}>SpoolNo:</Text>
                  <View style={styles.headerActionContainer}>
                    <TextInput
                      style={styles.headerActionInputText}
                      value={spoolNo}
                      onChangeText={_onChangeSpoolNo}
                      underlineColorAndroid='transparent'
                    />
                    {
                      spoolNo
                        ? <Icon name='times-circle' onPress={_onResetSpoolNo} style={styles.headerActionInputIcon} />
                        : null
                    }
                  </View>
                </View>
                <View style={styles.headerActionRow}>
                  <Text style={styles.headerCellTitle}>ActualType:</Text>
                  <TouchableOpacity
                    style={styles.headerActionContainer}
                    onPress={() => { setIsVisibleActual(true) }}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitleDark}>{actualType}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.headerActionRow}>
                  <Text style={styles.headerCellTitle} />
                  <TouchableOpacity
                    style={styles.headerSearchIcon}
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
              NDTList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={NDTList}
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
      <SelectPopup
        visible={isVisibleActual}
        data={[Constant.NDT_ACTUAL_ALL, Constant.NDT_ACTUAL_FIELD, Constant.NDT_ACTUAL_SHOP]}
        onCancel={() => setIsVisibleActual(false)}
        onChangeItem={_onChangeActualType}>
      </SelectPopup>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
    marginBottom: 4,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  headerCellTitle: {
    flex: 3,
  },
  headerCellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  headerActionContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionInputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  headerActionInputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  headerSearchIcon: {
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
    alignItems: 'center',
    margin: 4,
    minHeight: 24,
  },
  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellData: {
    flex: 3,
    justifyContent: 'center',
  },
  cellAction: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textDataLink: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
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
  textIssue: {
    fontWeight: 'bold',
    color: 'darkorange',
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
  buttonIssue: {
    width: 70,
    borderColor: 'darkorange',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelIssue: {
    color: 'darkorange',
  },
  buttonReset: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelReset: {
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

export default NDTDetailScreen;