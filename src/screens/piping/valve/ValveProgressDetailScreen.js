import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';

import { GetValveProgressDetailAPI, UpdateValveProgresslDetailAPI } from '../../../apis/valve/ValveAPI';

import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';

const ValveProgressDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, lineNo, sheet, code, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [detailList, setDetailList] = useState(null);
  const [updateList, setUpdateList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
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
    }, [navigation, isShowDescription]
  );
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  const callAPI = executedAPI => {
    setIsLoading(false);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  useEffect(
    () => {
      callAPI(getDetailList);
    }, []
  );

  //-- Get Data
  const getDetailList = () => {
    GetValveProgressDetailAPI(projectCode, facilityCode, lineNo, sheet)
      .then(res => {
        if (res.Success) {
          setDetailList(res.Data);
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

  //-- Submit Data
  const checkConstructionDetail = () => {
    let messages = [];
    // if (code == Constant.CODE_FITUP) {
    //   updateList.map(item => {
    //     const date = item['FittingDate'];
    //     const heat01 = item['Heat01'];
    //     const heat02 = item['Heat02'];
    //     const batchNo = item['AdhesiveBatchNo'];
    //     const ENVHum = item['ENVHumidity'];
    //     const ENVTemp = item['ENVTemp'];
    //     const ActualInsertionDepth = item['ActualInsertionDepth'];

    //     if ((date && heat01 && heat02 && batchNo && ENVHum && ENVTemp)
    //       || (!date && !heat01 && !heat02 && !batchNo && !ENVHum && !ENVTemp && !ActualInsertionDepth)
    //     ) {
    //       return item;
    //     }

    //     const keys = Object.keys(item);
    //     const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
    //     const objIndex = detailList.findIndex(obj => obj.RowIndex == item.RowIndex);
    //     const oldItem = detailList[objIndex];

    //     if ((column.indexOf('FittingDate') >= 0 && !date) || (column.indexOf('FittingDate') < 0 && !oldItem['FittingDate'])) {
    //       messages.push('Date');
    //     }
    //     if ((column.indexOf('Heat01') >= 0 && !heat01) || (column.indexOf('Heat01') < 0 && !oldItem['Heat01'])) {
    //       messages.push('HeatNo01');
    //     }
    //     if ((column.indexOf('Heat02') >= 0 && !heat02) || (column.indexOf('Heat02') < 0 && !oldItem['Heat02'])) {
    //       messages.push('Heat02');
    //     }
    //     if ((column.indexOf('AdhesiveBatchNo') >= 0 && !batchNo) || (column.indexOf('AdhesiveBatchNo') < 0 && !oldItem['AdhesiveBatchNo'])) {
    //       messages.push('BatchNo');
    //     }
    //     if ((column.indexOf('ENVHumidity') >= 0 && !ENVHum) || (column.indexOf('ENVHumidity') < 0 && !oldItem['ENVHumidity'])) {
    //       messages.push('ENVHum');
    //     }
    //     if ((column.indexOf('ENVTemp') >= 0 && !ENVTemp) || (column.indexOf('ENVTemp') < 0 && !oldItem['ENVTemp'])) {
    //       messages.push('ENVTemp');
    //     }
    //     if ((column.indexOf('ActualInsertionDepth') >= 0 && !ActualInsertionDepth) || (column.indexOf('ActualInsertionDepth') < 0 && !oldItem['ActualInsertionDepth'])) {
    //       messages.push('ActualInsertionDepth');
    //     }
    //     return item;
    //   });
    // }
    // else {
    //   updateList.map(item => {
    //     const startTime = item['CuringStartTime'];
    //     const endTime = item['CuringEndTime'];
    //     const bonderID = item['BonderID'];
    //     const CICO = item['CICO'];

    //     if ((startTime && endTime && bonderID && CICO)
    //       || (!startTime && !endTime && !bonderID && !CICO)) {
    //       return item;
    //     }

    //     const keys = Object.keys(item);
    //     const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
    //     const objIndex = detailList.findIndex(obj => obj.RowIndex == item.RowIndex);
    //     const oldItem = detailList[objIndex];

    //     if ((column.indexOf('CuringStartTime') >= 0 && !startTime) || (column.indexOf('CuringStartTime') < 0 && !oldItem['CuringStartTime'])) {
    //       messages.push('CuringStartTime');
    //     }
    //     if ((column.indexOf('CuringEndTime') >= 0 && !endTime) || (column.indexOf('CuringEndTime') < 0 && !oldItem['CuringEndTime'])) {
    //       messages.push('CuringEndTime');
    //     }
    //     if ((column.indexOf('BonderID') >= 0 && !bonderID) || (column.indexOf('BonderID') < 0 && !oldItem['BonderID'])) {
    //       messages.push('BonderID');
    //     }
    //     if ((column.indexOf('CICO') >= 0 && !CICO) || (column.indexOf('CICO') < 0 && !oldItem['CICO'])) {
    //       messages.push('CICO');
    //     }
    //     return item;
    //   });
    // }
    return messages;
  };
  const updateDetailList = async () => {
    const listUpdate = Helper.handleListUpdate(updateList);
    setIsUploading(true);
    UpdateValveProgresslDetailAPI(userLogin, listUpdate)
      .then(res => {
        if (res.Success) {
          setUpdateList([]);
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
  };
  const _onPressSubmitToServer = async () => {
    // let error = [];
    if (updateList.length) {
      // error = checkConstructionDetail();
      // if (error.length) {
      //   let uniqueError = [];
      //   uniqueError = [...new Set(error)];
      //   MessageAlert('ERROR', '\nPlesase enter: ' + uniqueError.join(', '));
      //   return;
      // }
      callAPI(updateDetailList);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  //-- Update Local Data
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const onChangeData = (data, localIndex = indexUpdate, localKey = keyUpdate) => {
    let array = [...detailList];
    array[localIndex][localKey] = data;
    setDetailList(array);

    array = [...updateList];
    const rowIndex = detailList[localIndex].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [localKey]: data });
    } else {
      array[objIndex][localKey] = detailList[localIndex][localKey];
    }
    setUpdateList(array);
  };

  //-- Date
  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());
  const _onPressSelectDate = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setDateDisplay(new Date(Moment(value).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setIsVisibleDate(true);
  };
  const _onChangeDate = selectedDate => {
    if (selectedDate != undefined) {
      const value = Formater.formatDateZero(selectedDate);
      onChangeData(value);
    }
    setIsVisibleDate(false);
  };

  //-- Text
  const [isVisibleText, setIsVisibleText] = useState(false);
  const [textDisplay, setTextDisplay] = useState('');
  const _onPressSelectText = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setTextDisplay(value.toString());
    } else {
      setTextDisplay('');
    }
    setIsVisibleText(true);
  };
  const _onChangeText = () => {
    const text = textDisplay.trim();
    setTextDisplay(text);
    onChangeData(text);
    setIsVisibleText(false);
  };

  //-- Render Header
  const headerData = {
    'Project': projectCode,
    'Facility': facilityCode,
    'LineNo': lineNo,
    'Sheet': sheet,
    'UserLogin': userLogin,
  };

  //-- Render Detail
  const RenderDetail = () => {
    {
      if (detailList == null) {
        return <ListLoadingData />
      } else if (!detailList.length) {
        return <ListEmptyData />
      }
    }
  };
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>TagName:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressSelectText(item.TagName, index, 'TagName')}>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.TagName)}</Text>
              <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>PIDTag:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressSelectText(item.PIDTag, index, 'PIDTag')}>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.PIDTag)}</Text>
              <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>InstallationDate:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressSelectDate(item.ValveInstallationDate, index, 'ValveInstallationDate')}>
              <Text style={styles.textData}>{Formater.formatDateData(item.ValveInstallationDate)}</Text>
              <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text style={styles.redText}>Remark:</Text>
          </View>
          <View style={styles.cellData}>
            <TouchableOpacity
              style={styles.itemActionIcon}
              onPress={() => _onPressSelectText(item.Remark, index, 'Remark')}>
              <Text style={styles.textData}>{Formater.formatEmptyData(item.Remark)}</Text>
              <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDetailList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} />
            }
            {
              detailList && detailList.length
                ?
                <>
                  <VirtualizedList
                    style={styles.table}
                    data={detailList}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                  />
                </>
                :
                <RenderDetail />
            }
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Submit to Server</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      <AwesomeAlert
        progressColor={BASE_COLOR}
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
      <DateTimePickerModal
        isVisible={isVisibleDate}
        headerTextIOS={'Update ' + keyUpdate + ':'}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />
      <Dialog.Container visible={isVisibleText}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={textDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setTextDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleText(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeText} />
      </Dialog.Container>
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
  boxError: {
    flexDirection: 'column',
    width: '100%',
    borderColor: 'red',
    borderWidth: 2,
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
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 20,
    height: 20,
  },
  itemDone: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  textDone: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  itemDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  textDisabled: {
    color: '#666666',
    fontStyle: 'italic',
  },

  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellData: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  cellPercent: {
    flex: 0.5,
  },
  itemActionIcon: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },

  textMeta: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  greenText: {
    color: 'green',
  },
  redText: {
    color: 'red',
  },
  textData: {
    // minWidth: 80,
    fontWeight: 'bold',
    color: 'green',
  },
  textBase: {
    // minWidth: 80,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },

  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },
  itemPercent: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginLeft: 4,
  },
  textPercent: {
    color: BASE_COLOR,
  },
  itemPercentDisable: {
    backgroundColor: '#cccccc',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginLeft: 4,
  },
  textPercentDisabled: {
    color: '#666666',
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
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    marginLeft: 4,
  },
  buttonDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
  },
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default ValveProgressDetailScreen;