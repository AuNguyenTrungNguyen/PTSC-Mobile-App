import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
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

import { GetBatchNoListAPI, GetBonderListAPI, GetConstructionDetailAPI, UpdateConstructionDetailAPI } from '../../../apis/piping/GREConsAPI';
import { GetSerialNoAndHeatNoListAPI, GetSerialNoAndHeatNoPipeSupportListAPI } from '../../../apis/app/AppAPI';

import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTwoColumns from '../../../components/SelectPopupTwoColumns';

const GREDrawingDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, userLogin, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);

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
      callAPI(getConstructionDetail);
      callAPI(getBatchNoList);
      callAPI(getBonderList);
    }, []
  );

  const [isReadOnly, setIsReadOnly] = useState(false);
  useEffect(
    async () => {
      var readOnly = await Helper.getData("ROLE_CODE");
      setIsReadOnly(readOnly === Constant.ROUTE__PIP_VIEWER);
    }, []
  );

  //-- Get Data
  const getBatchNoList = () => {
    GetBatchNoListAPI(projectCode)
      .then(res => {
        if (res.Success) {
          setBatchNoList(res.Data);
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
  const getBonderList = () => {
    GetBonderListAPI(projectCode)
      .then(res => {
        if (res.Success) {
          setBonderList(res.Data);
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
  const getConstructionDetail = () => {
    GetConstructionDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code)
      .then(res => {
        if (res.Success) {
          setDetailDrawingList(res.Data);
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
    if (code == Constant.CODE_FITUP) {
      updateDrawingList.map(item => {
        const date = item['FittingDate'];
        const heat01 = item['Heat01'];
        const heat02 = item['Heat02'];
        const batchNo = item['AdhesiveBatchNo'];
        const ENVHum = item['ENVHumidity'];
        const ENVTemp = item['ENVTemp'];
        const ActualInsertionDepth = item['ActualInsertionDepth'];

        if ((date && heat01 && heat02 && batchNo && ENVHum && ENVTemp)
          || (!date && !heat01 && !heat02 && !batchNo && !ENVHum && !ENVTemp && !ActualInsertionDepth)
        ) {
          return item;
        }

        const keys = Object.keys(item);
        const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        const objIndex = detailDrawingList.findIndex(obj => obj.RowIndex == item.RowIndex);
        const oldItem = detailDrawingList[objIndex];

        if ((column.indexOf('FittingDate') >= 0 && !date) || (column.indexOf('FittingDate') < 0 && !oldItem['FittingDate'])) {
          messages.push('Date');
        }
        if ((column.indexOf('Heat01') >= 0 && !heat01) || (column.indexOf('Heat01') < 0 && !oldItem['Heat01'])) {
          messages.push('HeatNo01');
        }
        if ((column.indexOf('Heat02') >= 0 && !heat02) || (column.indexOf('Heat02') < 0 && !oldItem['Heat02'])) {
          messages.push('Heat02');
        }
        if ((column.indexOf('AdhesiveBatchNo') >= 0 && !batchNo) || (column.indexOf('AdhesiveBatchNo') < 0 && !oldItem['AdhesiveBatchNo'])) {
          messages.push('BatchNo');
        }
        if ((column.indexOf('ENVHumidity') >= 0 && !ENVHum) || (column.indexOf('ENVHumidity') < 0 && !oldItem['ENVHumidity'])) {
          messages.push('ENVHum');
        }
        if ((column.indexOf('ENVTemp') >= 0 && !ENVTemp) || (column.indexOf('ENVTemp') < 0 && !oldItem['ENVTemp'])) {
          messages.push('ENVTemp');
        }
        if ((column.indexOf('ActualInsertionDepth') >= 0 && !ActualInsertionDepth) || (column.indexOf('ActualInsertionDepth') < 0 && !oldItem['ActualInsertionDepth'])) {
          messages.push('ActualInsertionDepth');
        }
        return item;
      });
    }
    else {
      updateDrawingList.map(item => {
        const startTime = item['CuringStartTime'];
        const endTime = item['CuringEndTime'];
        const bonderID = item['BonderID'];
        const CICO = item['CICO'];

        if ((startTime && endTime && bonderID && CICO)
          || (!startTime && !endTime && !bonderID && !CICO)) {
          return item;
        }

        const keys = Object.keys(item);
        const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        const objIndex = detailDrawingList.findIndex(obj => obj.RowIndex == item.RowIndex);
        const oldItem = detailDrawingList[objIndex];

        if ((column.indexOf('CuringStartTime') >= 0 && !startTime) || (column.indexOf('CuringStartTime') < 0 && !oldItem['CuringStartTime'])) {
          messages.push('CuringStartTime');
        }
        if ((column.indexOf('CuringEndTime') >= 0 && !endTime) || (column.indexOf('CuringEndTime') < 0 && !oldItem['CuringEndTime'])) {
          messages.push('CuringEndTime');
        }
        if ((column.indexOf('BonderID') >= 0 && !bonderID) || (column.indexOf('BonderID') < 0 && !oldItem['BonderID'])) {
          messages.push('BonderID');
        }
        if ((column.indexOf('CICO') >= 0 && !CICO) || (column.indexOf('CICO') < 0 && !oldItem['CICO'])) {
          messages.push('CICO');
        }
        return item;
      });
    }
    return messages;
  };
  const updateConstructionDetail = async () => {
    const listUpdate = Helper.handleListUpdate(updateDrawingList);
    const userLogin = await Helper.getData('USERNAME');
    setIsUploading(true);
    UpdateConstructionDetailAPI(projectCode, facilityCode, userLogin, code, listUpdate)
      .then(res => {
        if (res.Success) {
          setUpdateDrawingList([]);
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
    let error = [];
    if (updateDrawingList.length) {
      error = checkConstructionDetail();
      if (error.length) {
        let uniqueError = [];
        uniqueError = [...new Set(error)];
        MessageAlert('ERROR', '\nPlesase enter: ' + uniqueError.join(', '));
        return;
      }
      callAPI(updateConstructionDetail);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  //-- Update Local Data
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const onChangeData = (data, localIndex = indexUpdate, localKey = keyUpdate) => {
    let array = [...detailDrawingList];
    array[localIndex][localKey] = data;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    const rowIndex = detailDrawingList[localIndex].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [localKey]: data });
    } else {
      array[objIndex][localKey] = detailDrawingList[localIndex][localKey];
    }
    setUpdateDrawingList(array);
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
      const value = Formater.formatDateData(selectedDate);
      onChangeData(value);
    }
    setIsVisibleDate(false);
  };

  //-- Datetime
  const [isVisibleDatetime, setIsVisibleDatetime] = useState(false);
  const [datetimeDisplay, setDatetimeDisplay] = useState(new Date());
  const _onPressSelectDatetime = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    var time = Formater.formatDateDataTime(value);
    if (time) {
      setDatetimeDisplay(new Date(time));
    }
    else {
      setDatetimeDisplay(new Date());
    }
    setIsVisibleDatetime(true);
  };
  const _onChangeDatetime = selectedDate => {
    if (selectedDate != undefined) {
      const value = Formater.formatDateDataTime(selectedDate);
      onChangeData(value);
    }
    setIsVisibleDatetime(false);
  };

  //-- Number
  const [isVisibleNumber, setIsVisibleNumber] = useState(false);
  const [numberDisplay, setNumberDisplay] = useState('');
  const _onPressSelectNumber = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setNumberDisplay(value.toString());
    } else {
      setNumberDisplay('');
    }
    setIsVisibleNumber(true);
  };
  const _onChangeNumber = () => {
    let value = numberDisplay.replace(/,/g, '.');
    setNumberDisplay(value);
    if (!Helper.checkFormatNegativeNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    onChangeData(value);
    setIsVisibleNumber(false);
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

  //-- HeatNo
  const [isVisibleHeatNo, setIsVisibleHeatNo] = useState(false);
  const [heatNoList, setHeatNoList] = useState(null);
  const _onPressShowHeatNoPopup = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleHeatNo(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getHeatNoList(value);
      }
    });
  };
  const getHeatNoList = async value => {
    const token = await Helper.getData('TOKEN');
    GetSerialNoAndHeatNoListAPI(projectCode, value, token)
      .then(res => {
        if (res.Success) {
          setHeatNoList(res.Data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleHeatNo(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsVisibleHeatNo(false);
      });
  };
  const _onPressShowHeatNoPipeSupportPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleHeatNo(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getHeatNoPipeSupportList();
      }
    });
  };
  const getHeatNoPipeSupportList = async () => {
    const token = await Helper.getData('TOKEN');
    GetSerialNoAndHeatNoPipeSupportListAPI(projectCode, token)
      .then(res => {
        if (res.Success) {
          setHeatNoList(res.Data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleHeatNo(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsVisibleHeatNo(false);
      });
  };
  const _onPressClearHeatNo = () => {
    _onChangeHeatNo(null);
    setIsVisibleHeatNo(false);
  };
  const _onChangeHeatNo = data => {
    let heatNoData = null;
    let seriNoData = null;
    if (data) {
      heatNoData = data.HeatNo_TagNo;
      seriNoData = data.SeriNo;
    }

    let array = [...detailDrawingList];
    let arrayUpdate = [...updateDrawingList];

    const rowIndex = array[indexUpdate].RowIndex;
    const objIndex = arrayUpdate.findIndex((obj => obj.RowIndex == rowIndex));

    let keyHeatNo = '';
    let keySerialNo = '';
    if (keyUpdate === 'Heat01') {
      keyHeatNo = 'Heat01';
      keySerialNo = 'SerialNo01';
    } else {
      keyHeatNo = 'Heat02';
      keySerialNo = 'SerialNo02';
    }

    array[indexUpdate][keyHeatNo] = heatNoData;
    array[indexUpdate][keySerialNo] = seriNoData;
    if (objIndex < 0) {
      arrayUpdate.push({ RowIndex: rowIndex, [keyHeatNo]: heatNoData, [keySerialNo]: seriNoData });
    } else {
      arrayUpdate[objIndex][keyHeatNo] = array[indexUpdate][keyHeatNo];
      arrayUpdate[objIndex][keySerialNo] = array[indexUpdate][keySerialNo];
    }
    setDetailDrawingList(array);
    setUpdateDrawingList(arrayUpdate);
    setIsVisibleHeatNo(false);
  };

  //-- BatchNo
  const [isVisibleBatchNo, setIsVisibleBatchNo] = useState(false);
  const [batchNoList, setBatchNoList] = useState(null);
  const _onPressShowBatchNoPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleBatchNo(true);
  };
  const _onPressClearBatchNo = () => {
    onChangeBatchNo(null);
    setIsVisibleBatchNo(false);
  };
  const onChangeBatchNo = data => {
    onChangeData(data);
    setIsVisibleBatchNo(false);
  };

  //-- BonderID
  const [isVisibleBonder, setIsVisibleBonder] = useState(false);
  const [bonderList, setBonderList] = useState(null);
  const _onPressShowBonderPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleBonder(true);
  };
  const _onPressClearBonder = () => {
    onChangeBonder(null);
    setIsVisibleBonder(false);
  };
  const onChangeBonder = data => {
    let id = null;
    if (data) {
      id = data.BonderID;
    }
    onChangeData(id);
    setIsVisibleBonder(false);
  };

  //-- CICO
  const [isVisibleCICO, setIsVisibleCICO] = useState(false);
  const _onPressShowCICOPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleCICO(true);
  };
  const _onPressClearCICO = () => {
    onChangeCICO(null);
    setIsVisibleCICO(false);
  };
  const onChangeCICO = data => {
    onChangeData(data);
    setIsVisibleCICO(false);
  };

  //-- Clear
  const _onPressClearNow = (index) => {
    const valueClear = null;

    let array = [...detailDrawingList];

    if (code == Constant.CODE_FITUP) {
      array[index]['FittingDate'] = valueClear;
      array[index]['Heat01'] = valueClear;
      array[index]['Heat02'] = valueClear;
      array[index]['SerialNo01'] = valueClear;
      array[index]['SerialNo02'] = valueClear;
      array[index]['AdhesiveBatchNo'] = valueClear;
      array[index]['ENVHumidity'] = valueClear;
      array[index]['ENVTemp'] = valueClear;
    } else {
      // array[index]['CuringDate'] = valueClear;
      array[index]['CuringStartTime'] = valueClear;
      array[index]['CuringEndTime'] = valueClear;
      array[index]['BonderID'] = valueClear;
      array[index]['CICO'] = valueClear;
    }
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    const rowIndex = detailDrawingList[index].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (code == Constant.CODE_FITUP) {
        array.push({
          RowIndex: rowIndex,
          ['FittingDate']: valueClear,
          ['Heat01']: valueClear,
          ['Heat02']: valueClear,
          ['SerialNo01']: valueClear,
          ['SerialNo02']: valueClear,
          ['AdhesiveBatchNo']: valueClear,
          ['ENVHumidity']: valueClear,
          ['ENVTemp']: valueClear,
        });
      } else {
        array.push({
          RowIndex: rowIndex,
          // ['CuringDate']: valueClear,
          ['CuringStartTime']: valueClear,
          ['CuringEndTime']: valueClear,
          ['BonderID']: valueClear,
          ['CICO']: valueClear,
        });
      }
    } else {
      if (code == Constant.CODE_FITUP) {
        array[objIndex]['FittingDate'] = valueClear;
        array[objIndex]['Heat01'] = valueClear;
        array[objIndex]['Heat02'] = valueClear;
        array[objIndex]['SerialNo01'] = valueClear;
        array[objIndex]['SerialNo02'] = valueClear;
        array[objIndex]['AdhesiveBatchNo'] = valueClear;
        array[objIndex]['ENVHumidity'] = valueClear;
        array[objIndex]['ENVTemp'] = valueClear;
      } else {
        // array[objIndex]['CuringDate'] = valueClear;
        array[objIndex]['CuringStartTime'] = valueClear;
        array[objIndex]['CuringEndTime'] = valueClear;
        array[objIndex]['BonderID'] = valueClear;
        array[objIndex]['CICO'] = valueClear;
      }
    }
    setUpdateDrawingList(array);
  };

  // //-- Done
  // const _onPressDoneNow = (index) => {
  //   const keyDate = code == Constant.CODE_FITUP ? 'FittingDate' : 'CuringDate';
  //   const valueDate = Moment(new Date()).format("YYYY-MM-DD");

  //   let array = [...detailDrawingList];
  //   array[index][keyDate] = valueDate;
  //   setDetailDrawingList(array);

  //   array = [...updateDrawingList];
  //   const rowIndex = detailDrawingList[index].RowIndex;
  //   const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
  //   if (objIndex < 0) {
  //     array.push({ RowIndex: rowIndex, [keyDate]: valueDate });
  //   } else {
  //     array[objIndex][keyDate] = valueDate;
  //   }
  //   setUpdateDrawingList(array);
  // };


  //-- Render Header
  const headerData = {
    'Project': projectCode,
    'Facility': facilityCode,
    'DrawingNo': { 'DrawingNo': drawingNo, 'Link': link },
    'Sheet': sheet,
    'Rev': rev,
    'UserLogin': userLogin,
  };
  const headerAction = () => {
    Helper.openDrawingPDF(navigation, link, 'GRE Drawing')
  };


  //-- Render Detail
  const RenderConstructionDetail = () => {
    {
      if (detailDrawingList == null) {
        return <ListLoadingData />
      } else if (!detailDrawingList.length) {
        return <ListEmptyData />
      }
    }
  };
  const renderItem = ({ index, item }) => {
    const fitUpClear = item['FittingDate'];
    const visualClear = item['CuringStartTime'] || item['CuringEndTime'];

    let isDisableItem = item['QCStatusMobile'] === Constant.STATUS_ACCEPT;

    //-- If request FitUp and Visual = ACC, lock UI
    if (code === Constant.CODE_FITUP && item['VisualResult'] === Constant.STATUS_ACCEPT) {
      isDisableItem = true;
    }

    //-- If Visual = ACC, lock UI. 
    //-- If Visual <> ACC, FitUp <> ACC also lock UI. 
    if (code && code === Constant.CODE_VISUAL) {
      isDisableItem = isDisableItem || (item['FitUpResult'] !== Constant.STATUS_ACCEPT);
    }

    isDisableItem = isReadOnly ? true : isDisableItem;

    const isEnableClear = code === Constant.CODE_FITUP ? fitUpClear : visualClear;
    const isPipeSupport = item['JointNo'].startsWith('S') && item['ConType'] === 'SP';

    return (
      <View style={styles.box} pointerEvents={isDisableItem ? 'none' : 'auto'} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            {
              item['QCStatusMobile'] == Constant.STATUS_ACCEPT
                ?
                <Text style={styles.greenText}>
                  <Text>JointNo: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.JointNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.ConType)}</Text>
                </Text>
                :
                <>
                  <Text>JointNo: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.JointNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.ConType)}</Text>
                </>
            }
          </View>
          <>
            {
              !isDisableItem && isEnableClear
                ?
                (<TouchableOpacity
                  style={styles.itemDone}
                  onPress={() => _onPressClearNow(index)}>
                  <Text style={styles.textDone}>Clear</Text>
                </TouchableOpacity>)
                :
                (<TouchableOpacity
                  style={styles.itemDisabled}
                  disabled={true}>
                  <Text style={styles.textDisabled}>Clear</Text>
                </TouchableOpacity>)
            }
            {/* {
              isDisableItem
                ?
                (<TouchableOpacity
                  style={styles.itemDisabled}
                  disabled={true}>
                  <Text style={styles.textDisabled}>Done</Text>
                </TouchableOpacity>)
                :
                (<TouchableOpacity
                  style={styles.itemDone}
                  onPress={() => _onPressDoneNow(index)}>
                  <Text style={styles.textDone}>Done</Text>
                </TouchableOpacity>)
            } */}
          </>
        </View>
        {
          code == Constant.CODE_FITUP
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>FittingDate:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectDate(item.FittingDate, index, 'FittingDate')}>
                    <Text style={styles.textData}>{Formater.formatDateData(item.FittingDate)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Class01:</Text>
                </View>
                <View style={styles.cellData}>
                  {
                    isPipeSupport
                      ?
                      <Text style={styles.textBase}>{'PS'}</Text>
                      :
                      <Text style={styles.textBase}>{Formater.formatEmptyData(item.Class1)}</Text>
                  }
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>HeatNo01:</Text>
                </View>
                <View style={styles.cellData}>
                  {
                    isPipeSupport
                      ?
                      <TouchableOpacity
                        style={styles.itemActionIcon}
                        onPress={() => _onPressShowHeatNoPipeSupportPopup(index, 'Heat01')}>
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat01)}</Text>
                        {
                          isDisableItem
                            ?
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                            :
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                        }
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        style={styles.itemActionIcon}
                        onPress={() => _onPressShowHeatNoPopup(item.ItemCode01, index, 'Heat01')}>
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat01)}</Text>
                        {
                          isDisableItem
                            ?
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                            :
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                        }
                      </TouchableOpacity>
                  }
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Class02:</Text>
                </View>
                <View style={styles.cellData}>
                  {
                    isPipeSupport
                      ?
                      <Text style={styles.textBase}>{'PS'}</Text>
                      :
                      <Text style={styles.textBase}>{Formater.formatEmptyData(item.Class2)}</Text>
                  }
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>HeatNo02:</Text>
                </View>
                <View style={styles.cellData}>
                  {
                    isPipeSupport
                      ?
                      <TouchableOpacity
                        style={styles.itemActionIcon}
                        onPress={() => _onPressShowHeatNoPipeSupportPopup(index, 'Heat02')}>
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat02)}</Text>
                        {
                          isDisableItem
                            ?
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                            :
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                        }
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        style={styles.itemActionIcon}
                        onPress={() => _onPressShowHeatNoPopup(item.ItemCode02, index, 'Heat02')}>
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat02)}</Text>
                        {
                          isDisableItem
                            ?
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                            :
                            <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                        }
                      </TouchableOpacity>
                  }
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>BatchNo:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => { _onPressShowBatchNoPopup(index, 'AdhesiveBatchNo') }}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.AdhesiveBatchNo)}</Text>
                    {
                      isDisableItem
                        ?
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>ENVHum(%):</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectText(item.ENVHumidity, index, 'ENVHumidity')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.ENVHumidity)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>{'ENVTemp(\u00b0C)'}:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectNumber(item.ENVTemp, index, 'ENVTemp')}>
                    <Text style={styles.textData}>{Formater.formatTwoDigits(item.ENVTemp)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>{'Insertion\nDepth'}:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectNumber(item.ActualInsertionDepth, index, 'ActualInsertionDepth')}>
                    <Text style={styles.textData}>{Formater.formatTwoDigits(item.ActualInsertionDepth)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
            </>
            :
            <>
              {/* <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>CuringDate:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectDate(item.CuringDate, index, 'CuringDate')}>
                    <Text style={styles.textData}>{Formater.formatDateData(item.CuringDate)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View> */}
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>CuringStartTime:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectDatetime(item.CuringStartTime, index, 'CuringStartTime')}>
                    <Text style={styles.textData}>{Formater.formatDateDataTime(item.CuringStartTime)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>CuringEndTime:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectDatetime(item.CuringEndTime, index, 'CuringEndTime')}>
                    <Text style={styles.textData}>{Formater.formatDateDataTime(item.CuringEndTime)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='clockcircleo' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>BonderID:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowBonderPopup(index, 'BonderID')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.BonderID)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='addusergroup' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='addusergroup' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>CICO:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowCICOPopup(index, 'CICO')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.CICO)}</Text>
                    {
                      isDisableItem
                        ?
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.cellPercent} />
              </View>
            </>
        }
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getConstructionDetail)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show &&
              <Header data={headerData} action={headerAction} />
            }
            {
              detailDrawingList && detailDrawingList.length
                ?
                <>
                  <VirtualizedList
                    style={styles.table}
                    data={detailDrawingList}
                    getItemCount={data => data.length}
                    getItem={(data, index) => {
                      return data[index];
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={renderItem}
                  />
                </>
                :
                <RenderConstructionDetail />
            }
            <View style={styles.actionContainer}>
              {
                isReadOnly
                  ?
                  <TouchableOpacity style={styles.buttonDisabled} activeOpacity={1}>
                    <Text style={styles.buttonTitle}>Gửi Request</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.button} onPress={_onPressSubmitToServer}>
                    <Text style={styles.buttonTitle}>Gửi Request</Text>
                  </TouchableOpacity>
              }
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
      <DateTimePickerModal
        isVisible={isVisibleDatetime}
        headerTextIOS={'Update ' + keyUpdate + ':'}
        date={datetimeDisplay}
        mode={'datetime'}
        onConfirm={_onChangeDatetime}
        onCancel={() => { setIsVisibleDatetime(false) }}
      />
      <Dialog.Container visible={isVisibleNumber}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={numberDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setNumberDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleNumber(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeNumber} />
      </Dialog.Container>
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
      <SelectPopupTwoColumns
        visible={isVisibleHeatNo}
        leftHeader={'HeatNo'}
        rightHeader={'SeriNo'}
        leftKey={'HeatNo_TagNo'}
        rightKey={'SeriNo'}
        data={heatNoList}
        onChangeItem={_onChangeHeatNo}
        onCancel={() => setIsVisibleHeatNo(false)}
        onClear={_onPressClearHeatNo}
      />
      <SelectPopupTwoColumns
        visible={isVisibleBonder}
        leftHeader={'ID'}
        rightHeader={'Name'}
        leftKey={'BonderID'}
        rightKey={'BonderName'}
        data={bonderList}
        onChangeItem={onChangeBonder}
        onCancel={() => setIsVisibleBonder(false)}
        onClear={_onPressClearBonder}
      />
      <SelectPopup
        visible={isVisibleBatchNo}
        data={batchNoList}
        onChangeItem={onChangeBatchNo}
        onCancel={() => setIsVisibleBatchNo(false)}
        onClear={_onPressClearBatchNo}
      />

      <SelectPopup
        visible={isVisibleCICO}
        data={['CI', 'CO']}
        onChangeItem={onChangeCICO}
        onCancel={() => setIsVisibleCICO(false)}
        onClear={_onPressClearCICO} />
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
    flex: 1,
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

export default GREDrawingDetailScreen;