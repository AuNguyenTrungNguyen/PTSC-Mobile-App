import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../helper/Helper';
import GetDrawingDetailAPI from '../../apis/drawing/GetDrawingDetailAPI';
import UpdateDrawingDetailAPI from '../../apis/drawing/UpdateDrawingDetailAPI';
import MessageAlert from '../CustomViews/MessageAlert';
import LoadingRefresh from '../CustomViews/LoadingRefresh';

export default ({ route }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState([]);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);
  const { drawingNo, disciplineCode, wOType } = route.params;

  useEffect(
    () => {
      callAPI(getDrawingDetail);
    }, []
  );

  const callAPI = executedAPI => {
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
    let projectCode = await Helper.getData('PROJECT_CODE');
    let token = await Helper.getData('TOKEN');
    GetDrawingDetailAPI(projectCode, drawingNo, token)
      .then(res => {
        if (res.success) {
          setDetailDrawingList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsUploading(false)
        } else {
          MessageAlert('ERROR', res.Message);
          setIsLoading(false);
          setIsError(true);
          setIsUploading(false)
        }
      })
      .catch((error) => {
        MessageAlert('ERROR', error.toString());
        setIsLoading(false);
        setIsError(true);
        setIsUploading(false)
      });
  };

  const updateDrawingDetail = async () => {
    let projectCode = await Helper.getData('PROJECT_CODE');
    let token = await Helper.getData('TOKEN');
    UpdateDrawingDetailAPI(projectCode, drawingNo, updateDrawingList, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message, Toast.SHORT);
          setUpdateDrawingList([]);
        } else {
          MessageAlert('ERROR', res.Message);
        }
        callAPI(getDrawingDetail);
      }).catch(error => {
        MessageAlert('ERROR', error.toString());
        setIsUploading(false);
      });
  };

  const _onPressUploadDrawing = async () => {
    if (updateDrawingList.length) {
      setIsUploading(true);
      callAPI(updateDrawingDetail);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
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
      let key = detailDrawingList[indexUpdate].RowIndex;
      let objIndex = array.findIndex((obj => obj.RowIndex == key));
      if (objIndex < 0) {
        array.push({ RowIndex: key, [keyUpdate]: selectedDate });
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
      Toast.show(keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    setShowDialog(false);
    if (detailDrawingList[indexUpdate][keyUpdate] != value) {
      let array = [...detailDrawingList];
      array[indexUpdate][keyUpdate] = value;
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let key = detailDrawingList[indexUpdate].RowIndex;
      let objIndex = array.findIndex((obj => obj.RowIndex == key));
      if (objIndex < 0) {
        array.push({ RowIndex: key, [keyUpdate]: value });
      } else {
        array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      }
      setUpdateDrawingList(array);
    }
  };

  const checkFormatNumber = input => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(input) || input === '';
  };

  const formatEmptyData = data => {
    return data != null ? data : '';
  };

  const formatDateData = data => {
    return data != null ? Moment(data).format("DD-MMM-YY") : '';
  };

  const WOType = [1, 2, 3, 4, 5];
  const RenderNotLoadData = () => {
    return (
      disciplineCode == 'Piping' && WOType.includes(wOType)
        ?
        null
        :
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Text style={{ fontSize: 16, marginTop: 16 }}>DrawingNo: {drawingNo}</Text>
          <Text style={{ fontSize: 16, marginTop: 16 }}>DisciplineCode: {disciplineCode}</Text>
          <Text style={{ fontSize: 16, marginTop: 16 }}>WOType: {wOType}</Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDrawingDetail)} />
      <RenderNotLoadData />
      <View style={styles.container}>
        {detailDrawingList.length == 0
          ?
          <View style={[styles.noDataContainer]}>
            <Text style={styles.noDataTitle}>No have any data!</Text>
          </View>
          :
          <View style={styles.table}>
            <ScrollView horizontal={true}>
              <View>
                <View style={styles.row}>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellSpoolsNo]}>SpoolsNo</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellWeldNo]}>WeldNo</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellActualType]}>ActualType</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellCuttingDate]}>CuttingDate</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellCutPercentage]}>CutPercentage</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellFittingDate]}>FittingDate</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellFitPercentage]}>FitPercentage</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellWeldingDate]}>WeldingDate</Text>
                  <Text style={[styles.cell, styles.cellHeader, styles.cellWeldPercentage]}>WeldPercentage</Text>
                </View>
                <ScrollView>
                  {detailDrawingList.map((item, index) => {
                    return (
                      <View style={styles.row}>
                        <Text style={[styles.cell, styles.cellSpoolsNo]}>{formatEmptyData(item.SpoolsNo)}</Text>
                        <Text style={[styles.cell, styles.cellWeldNo]}>{formatEmptyData(item.WeldNo)}</Text>
                        <Text style={[styles.cell, styles.cellActualType]}>{formatEmptyData(item.ActualType)}</Text>

                        <TouchableOpacity style={[styles.cell, styles.cellCuttingDate, styles.cellRight]} onPress={() => _onPressShowPicker(item.CuttingDate, index, 'CuttingDate')}>
                          <Text style={styles.text}>{formatDateData(item.CuttingDate)}</Text>
                          <AntDesignIcon name='calendar' size={16} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cell, styles.cellCutPercentage, styles.cellRight]} onPress={() => _onPressShowDialog(item.CutPercentage, index, 'CutPercentage')}>
                          <Text style={styles.text}>{formatEmptyData(item.CutPercentage)}</Text>
                          <FontAwesomeIcon name='pencil' size={16} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cell, styles.cellFittingDate, styles.cellRight]} onPress={() => _onPressShowPicker(item.FittingDate, index, 'FittingDate')}>
                          <Text style={styles.text}>{formatDateData(item.FittingDate)}</Text>
                          <AntDesignIcon name='calendar' size={16} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cell, styles.cellFitPercentage, styles.cellRight]} onPress={() => _onPressShowDialog(item.FitPercentage, index, 'FitPercentage')}>
                          <Text style={styles.text}>{formatEmptyData(item.FitPercentage)}</Text>
                          <FontAwesomeIcon name='pencil' size={16} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cell, styles.cellWeldingDate, styles.cellRight]} onPress={() => _onPressShowPicker(item.WeldingDate, index, 'WeldingDate')}>
                          <Text style={styles.text}>{formatDateData(item.WeldingDate)}</Text>
                          <AntDesignIcon name='calendar' size={16} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.cell, styles.cellWeldPercentage, styles.cellRight]} onPress={() => _onPressShowDialog(item.WeldPercentage, index, 'WeldPercentage')}>
                          <Text style={styles.text}>{formatEmptyData(item.WeldPercentage)}</Text>
                          <FontAwesomeIcon name='pencil' size={16} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.buttonContainer} onPress={_onPressUploadDrawing}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
        }
        <DateTimePickerModal
          isVisible={showPicker}
          headerTextIOS={'Update ' + keyUpdate + ' :'}
          date={dateDisplay}
          mode={'date'}
          onConfirm={_onChangeDate}
          onCancel={() => { setShowPicker(false) }}
        />
        <Dialog.Container visible={showDialog}>
          <Dialog.Title>{'Update ' + keyUpdate + ' :'}</Dialog.Title>
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
    </SafeAreaView>
  );
}

const BASE_COLOR = '#344955';
const BASE_CELL_HEIGHT = 40;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },

  table: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    height: BASE_CELL_HEIGHT,
  },
  cell: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    lineHeight: BASE_CELL_HEIGHT,
    paddingLeft: 8,
    paddingRight: 8,
  },
  cellHeader: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    backgroundColor: 'azure',
  },
  cellSpoolsNo: {
    width: 225,
  },
  cellWeldNo: {
    width: 80,
  },
  cellActualType: {
    width: 100,
  },
  cellCuttingDate: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellCutPercentage: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellFittingDate: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellFitPercentage: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellWeldingDate: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellWeldPercentage: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cellCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellRight: {
    justifyContent: 'flex-end',
  },
  text: {
    marginRight: 8,
  },

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  noDataTitle: {
    fontSize: 16,
    color: BASE_COLOR,
  },
  buttonContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginTop: 16,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
  },
});