import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetDrawingDetailAPI from '../../apis/drawing/GetDrawingDetailAPI';
import UpdateDrawingDetailAPI from '../../apis/drawing/UpdateDrawingDetailAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader } = route.params;

  useEffect(
    () => {
      callAPI(getDrawingDetail);
    }, []
  );

  const callAPI = executedAPI => {
    setIsLoading(false);
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
    GetDrawingDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token)
      .then(res => {
        if (res.success) {
          setDetailDrawingList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsUploading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false);
      });
  };

  const updateDrawingDetail = async () => {
    let token = await Helper.getData('TOKEN');
    UpdateDrawingDetailAPI(projectCode, facilityCode, drawingNo, updateDrawingList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateDrawingList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(getDrawingDetail);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };

  const _onPressSubmitToServer = async () => {
    if (updateDrawingList.length) {
      setIsUploading(true);
      callAPI(updateDrawingDetail);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = () => {
    navigation.navigate(
      'DrawingImage',
      {
        projectCode: projectCode,
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        code: code
      }
    );
  };

  /**
   * Handle for action edit data in list
   */
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const [inputDisplay, setInputDisplay] = useState('');
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const _onPressShowPicker = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setDateDisplay(new Date(value));
    } else {
      setDateDisplay(new Date());
    }
    setShowPicker(true);
  };

  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      let array = [...detailDrawingList];
      array[indexUpdate][keyUpdate] = selectedDate;
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let rowIndex = detailDrawingList[indexUpdate].RowIndex;
      let weldNo = detailDrawingList[indexUpdate].WeldNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: selectedDate });
      } else {
        array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      }
      setUpdateDrawingList(array);
    }
    setShowPicker(false);
  };

  const _onPressShowDialog = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setInputDisplay(value.toString());
    } else {
      setInputDisplay('');
    }
    setShowDialog(true);
  };

  const _onPressSubmitInput = () => {
    let value = inputDisplay.replace(/,/g, '.');
    setInputDisplay(value);
    if (!checkFormatNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    if (value && (value < 0 || value > 100)) {
      Toast.show(keyUpdate + ' must be from 0 to 100.', Toast.SHORT);
      return;
    }
    setShowDialog(false);
    if (detailDrawingList[indexUpdate][keyUpdate] !== value) {
      let array = [...detailDrawingList];
      array[indexUpdate][keyUpdate] = value;
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let rowIndex = detailDrawingList[indexUpdate].RowIndex;
      let weldNo = detailDrawingList[indexUpdate].WeldNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: value });
      } else {
        array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      }
      setUpdateDrawingList(array);
    }
  };

  const checkFormatNumber = input => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(input) && input !== '';
  };

  const formatEmptyData = data => {
    return data != null ? data : '';
  };

  const formatDateData = data => {
    return data != null ? Moment(data).format("DD-MMM-YY") : '';
  };

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data</Text>
    </View>
  );

  const ListLoadingData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            <Text>WeldNo:</Text>
          </View>
          <View style={styles.cellDataLine}>
            <Text style={styles.textData}>{formatEmptyData(item.WeldNo)}</Text>
          </View>
          <View style={styles.cellTitleLine}>
            <Text>WeldType:</Text>
          </View>
          <View style={styles.cellDataLine}>
            <Text style={styles.textData}>{formatEmptyData(item.WeldType)}</Text>
          </View>
        </View>
        {code == 'FitUp'
          ?
          (<>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FittingDate:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowPicker(item.FittingDate, index, 'FittingDate')}>
                  <Text style={styles.textData} >{formatDateData(item.FittingDate)}</Text>
                  <AntDesignIcon style={styles.iconAction} name='calendar' size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FitPercentage:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowDialog(item.FitPercentage, index, 'FitPercentage')}>
                  <Text style={styles.textData} >{formatEmptyData(item.FitPercentage)}</Text>
                  <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </>)
          :
          (<>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WeldingDate:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowPicker(item.WeldingDate, index, 'WeldingDate')}>
                  <Text style={styles.textData} >{formatDateData(item.WeldingDate)}</Text>
                  <AntDesignIcon style={styles.iconAction} name='calendar' size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WeldPercentage:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowDialog(item.WeldPercentage, index, 'WeldPercentage')}>
                  <Text style={styles.textData} >{formatEmptyData(item.WeldPercentage)}</Text>
                  <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} />
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDrawingDetail)} />
        :
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>ProjectCode:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{projectCode.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>Facility:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{facilityCode.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>DrawingNo:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{drawingNo.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>Sheet:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{sheet.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>Rev:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{rev.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.infoTitle}>TeamLeader:</Text>
              <View style={styles.infoDataLine}>
                <Text style={styles.infoData}>{teamLeader.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          {
            detailDrawingList == null
              ?
              <ListLoadingData />
              :
              (detailDrawingList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={detailDrawingList}
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
                <ListEmptyData />)
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManagePicture}>
              <Text style={styles.buttonTitle}>Manage Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={showPicker}
            headerTextIOS={'Update ' + keyUpdate + ':'}
            date={dateDisplay}
            mode={'date'}
            onConfirm={_onChangeDate}
            onCancel={() => { setShowPicker(false) }}
          />
          <Dialog.Container visible={showDialog}>
            <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
            <Dialog.Input
              value={inputDisplay}
              placeholder={'Enter ' + keyUpdate}
              onChangeText={(text) => setInputDisplay(text)}
              underlineColorAndroid={BASE_COLOR}
              keyboardType={'numeric'}
            />
            <Dialog.Button label='Cancle' onPress={() => { setShowDialog(false) }} />
            <Dialog.Button label='OK' onPress={_onPressSubmitInput} />
          </Dialog.Container>
          <AwesomeAlert
            show={isUploading}
            showProgress={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
          />
        </View>
      }
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
  infoTitle: {
    flex: 3,
  },
  infoDataLine: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  infoData: {
    color: BASE_COLOR,
    flexShrink: 1,
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
  cellTitleLine: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTitle: {
    flex: 3,
    justifyContent: 'center',
  },
  cellData: {
    flex: 7,
    justifyContent: 'center',
  },
  textData: {
    minWidth: 85,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  itemAction: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
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
    fontSize: 16,
  },

  actionContainer: {
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