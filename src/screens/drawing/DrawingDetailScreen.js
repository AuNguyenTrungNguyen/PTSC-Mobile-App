import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance, Dimensions, Modal, ScrollView } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import Helper from '../../utils/Helper';
import GetDrawingDetailAPI from '../../apis/drawing/GetDrawingDetailAPI';
import UpdateDrawingDetailAPI from '../../apis/drawing/UpdateDrawingDetailAPI';
import GetHeatNoListAPI from '../../apis/drawing/GetHeatNoListAPI';
import GetWPSListAPI from '../../apis/drawing/GetWPSListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import HelpModal from '../../components/drawing/HelpModal';
import PickupDataModal from '../../components/drawing/PickupDataModal';

export default ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);
  const [errorList, setErrorList] = useState([]);

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader } = route.params;

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  useEffect(
    () => {
      if (route.params?.welderSelected) {
        _onChangeWelders(route.params?.welderSelected);
      } else {
        callAPI(getDrawingDetail);
      }
    }, [route.params?.welderSelected]
  );

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleHelp(true) }}>
            <Ionicons
              size={24}
              name={'help-circle-outline'} color={iconColor} />
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
  }, [navigation, isShowDescription, isVisibleHelp]);

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

  const handleDataUpdateFitup = () => {
    updateDrawingList.forEach(element => {
      const data = detailDrawingList.find(i => i.RowIndex === element['RowIndex'] && i.WeldNo === element['WeldNo']);
      if (!element.hasOwnProperty('ItemDate')) {
        element['ItemDate'] = data['FittingDate'];
      }
      if (!element.hasOwnProperty('ItemPercent')) {
        element['ItemPercent'] = data['FitPercentage'];
      }
      if (!element.hasOwnProperty('Heat01')) {
        element['Heat01'] = data['Heat01'];
      }
      if (!element.hasOwnProperty('Heat02')) {
        element['Heat02'] = data['Heat02'];
      }
      // Check CLEAR
      if (!element['ItemDate'] && !element['ItemPercent'] && !element['Heat01'] && !element['Heat02']) {
        element['IsClear'] = true;
      }
    });
    callAPI(updateDrawingDetailFitUp);
  };

  const updateDrawingDetailFitUp = async () => {
    let token = await Helper.getData('TOKEN');
    let errorListData = [];
    let doneListData = [];

    doneListData = updateDrawingList.filter(i => (i.ItemDate && i.ItemPercent) || i.IsClear);
    const doneIds = doneListData.map(i => i.RowIndex);
    errorListData = updateDrawingList.filter(i => doneIds.indexOf(i.RowIndex) === -1);

    if (errorListData.length) {
      const errorIds = errorListData.map(i => i.RowIndex);
      setErrorList(errorIds);
    } else {
      setErrorList([]);
    }
    if (doneListData.length) {
      setIsUploading(true);
      UpdateDrawingDetailAPI(projectCode, facilityCode, drawingNo, teamLeader, code, doneListData, token)
        .then(res => {
          if (res.success) {
            Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          } else {
            Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
          }
          if (errorListData.length) {
            setUpdateDrawingList(errorListData);
          } else {
            setUpdateDrawingList([]);
          }
          setIsUploading(false);
        }).catch(() => {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
          setIsUploading(false);
        });
    }
  };

  const handleDataUpdateWeld = () => {
    updateDrawingList.forEach(element => {
      const data = detailDrawingList.find(i => i.RowIndex === element['RowIndex'] && i.WeldNo === element['WeldNo']);
      if (!element.hasOwnProperty('ItemDate')) {
        element['ItemDate'] = data['WeldingDate'];
      }
      if (!element.hasOwnProperty('ItemPercent')) {
        element['ItemPercent'] = data['WeldPercentage'];
      }
      if (!element.hasOwnProperty('WelderID')) {
        element['WelderID'] = data['WelderID'];
      }
      if (!element.hasOwnProperty('WPSNo')) {
        element['WPSNo'] = data['WPSNo'];
      }
      // Check CLEAR
      if (!element['ItemDate'] && !element['ItemPercent'] && !element['WelderID'] && !element['WPSNo']) {
        element['IsClear'] = true;
      }
    });
    callAPI(updateDrawingDetailWeld);
  };

  const updateDrawingDetailWeld = async () => {
    let token = await Helper.getData('TOKEN');
    let errorListData = [];
    let doneListData = [];

    doneListData = updateDrawingList.filter(i => (i.ItemDate && i.ItemPercent && i.WelderID) || i.IsClear);
    const doneIds = doneListData.map(i => i.RowIndex);
    errorListData = updateDrawingList.filter(i => doneIds.indexOf(i.RowIndex) === -1);

    if (errorListData.length) {
      const errorIds = errorListData.map(i => i.RowIndex);
      setErrorList(errorIds);
      Toast.show('Have error data!', Toast.SHORT, ['RCTModalHostViewController']);
    } else {
      setErrorList([]);
    }
    if (doneListData.length) {
      setIsUploading(true);
      UpdateDrawingDetailAPI(projectCode, facilityCode, drawingNo, teamLeader, code, doneListData, token)
        .then(res => {
          if (res.success) {
            Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          } else {
            Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
          }
          if (errorListData.length) {
            setUpdateDrawingList(errorListData);
          } else {
            setUpdateDrawingList([]);
          }
          setIsUploading(false);
        }).catch(() => {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
          setIsUploading(false);
        });
    }
  };

  const _onPressSubmitToServer = async () => {
    if (updateDrawingList.length) {
      if (code == 'FitUp') {
        handleDataUpdateFitup();
      }
      else {
        handleDataUpdateWeld();
      }
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
        code: code,
        teamLeader: teamLeader
      }
    );
  };

  const [isVisibleHelp, setIsVisibleHelp] = useState(false);

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

  const _onPressClearHeatNoPopup = () => {
    _onChangeHeatNoCode(null);
    setIsVisibleHeatNo(false);
  };

  const getHeatNoList = async value => {
    let token = await Helper.getData('TOKEN');
    GetHeatNoListAPI(projectCode, value, token)
      .then(res => {
        if (res.success) {
          setHeatNoList(res.data);
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

  const _onChangeHeatNoCode = (data) => {
    let array = [...detailDrawingList];
    array[indexUpdate][keyUpdate] = data;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[indexUpdate].RowIndex;
    let weldNo = detailDrawingList[indexUpdate].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: data });
    } else {
      array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
    }
    setUpdateDrawingList(array);
    setIsVisibleHeatNo(false);
  };

  const [isVisibleWPS, setIsVisibleWPS] = useState(false);
  const [wpsList, setWPSList] = useState(null);

  const _onPressShowWPSPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleWPS(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getWPSList();
      }
    });
  };

  const _onPressClearWPSPopup = () => {
    _onChangeWPSCode(null);
    setIsVisibleWPS(false);
  };

  const getWPSList = async () => {
    let token = await Helper.getData('TOKEN');
    GetWPSListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setWPSList(res.data);
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

  const _onChangeWPSCode = (data) => {
    let array = [...detailDrawingList];
    array[indexUpdate][keyUpdate] = data;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[indexUpdate].RowIndex;
    let weldNo = detailDrawingList[indexUpdate].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: data });
    } else {
      array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
    }
    setUpdateDrawingList(array);
    setIsVisibleWPS(false);
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
      setDateDisplay(new Date(Moment(value).format("YYYY-MM-DDT00:00:00")));
    } else {
      setDateDisplay(new Date());
    }
    setShowPicker(true);
  };

  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      let array = [...detailDrawingList];
      array[indexUpdate][keyUpdate] = Moment(selectedDate).format("YYYY-MM-DD");
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let rowIndex = detailDrawingList[indexUpdate].RowIndex;
      let weldNo = detailDrawingList[indexUpdate].WeldNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, ['ItemDate']: Moment(selectedDate).format("YYYY-MM-DD") });
      } else {
        array[objIndex]['ItemDate'] = detailDrawingList[indexUpdate][keyUpdate];
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
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, ['ItemPercent']: value });
      } else {
        array[objIndex]['ItemPercent'] = detailDrawingList[indexUpdate][keyUpdate];
      }
      setUpdateDrawingList(array);
    }
  };

  const _onPressSelectWelder = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    navigation.navigate(
      'DrawingWelder',
      {
        projectCode: projectCode,
        welders: value,
      }
    );
  };

  const _onChangeWelders = (welderSelected) => {
    let array = [...detailDrawingList];
    welderSelected = formatEmptyWelder(welderSelected);
    array[indexUpdate][keyUpdate] = welderSelected;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[indexUpdate].RowIndex;
    let weldNo = detailDrawingList[indexUpdate].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: welderSelected });
    } else {
      array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
    }
    setUpdateDrawingList(array);
  };

  const _onPressClearNow = (index) => {
    let keyDate = code == 'FitUp' ? 'FittingDate' : 'WeldingDate';
    let keyPercent = code == 'FitUp' ? 'FitPercentage' : 'WeldPercentage';
    let valueClear = null;

    let array = [...detailDrawingList];
    array[index][keyDate] = valueClear;
    array[index][keyPercent] = valueClear;
    if (code == 'FitUp') {
      array[index]['Heat01'] = valueClear;
      array[index]['Heat02'] = valueClear;
    } else {
      array[index]['WelderID'] = valueClear;
      array[index]['WPSNo'] = valueClear;
    }
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[index].RowIndex;
    let weldNo = detailDrawingList[index].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (code == 'FitUp') {
        array.push({
          RowIndex: rowIndex,
          WeldNo: weldNo,
          ['ItemDate']: valueClear,
          ['ItemPercent']: valueClear,
          ['Heat01']: valueClear,
          ['Heat02']: valueClear
        });
      } else {
        array.push({
          RowIndex: rowIndex,
          WeldNo: weldNo,
          ['ItemDate']: valueClear,
          ['ItemPercent']: valueClear,
          ['WelderID']: valueClear,
          ['WPSNo']: valueClear
        });
      }
    } else {
      array[objIndex]['ItemDate'] = detailDrawingList[index][keyDate];
      array[objIndex]['ItemPercent'] = detailDrawingList[index][keyPercent];
      if (code == 'FitUp') {
        array[objIndex]['Heat01'] = detailDrawingList[index]['Heat01'];
        array[objIndex]['Heat02'] = detailDrawingList[index]['Heat02'];
      } else {
        array[objIndex]['WelderID'] = detailDrawingList[index]['WelderID'];
        array[objIndex]['WPSNo'] = detailDrawingList[index]['WPSNo'];
      }
    }
    setUpdateDrawingList(array);
  };

  const _onPressDoneNow = (index) => {
    let keyDate = code == 'FitUp' ? 'FittingDate' : 'WeldingDate';
    let keyPercent = code == 'FitUp' ? 'FitPercentage' : 'WeldPercentage';
    let valueDate = Moment(new Date()).format("YYYY-MM-DD");
    let valuePercent = 100;

    let array = [...detailDrawingList];
    array[index][keyDate] = valueDate;
    array[index][keyPercent] = valuePercent;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[index].RowIndex;
    let weldNo = detailDrawingList[index].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, ['ItemDate']: valueDate, ['ItemPercent']: valuePercent });
    } else {
      array[objIndex]['ItemDate'] = detailDrawingList[index][keyDate];
      array[objIndex]['ItemPercent'] = detailDrawingList[index][keyPercent];
    }
    setUpdateDrawingList(array);
  };

  const _onPressChangePercent = (value, index, key) => {
    if (detailDrawingList[index][key] !== value) {
      let array = [...detailDrawingList];
      array[index][key] = value;
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let rowIndex = detailDrawingList[index].RowIndex;
      let weldNo = detailDrawingList[index].WeldNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, ['ItemPercent']: value });
      } else {
        array[objIndex]['ItemPercent'] = detailDrawingList[index][key];
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

  const formatEmptyWelder = data => {
    return data == 'WELDER_ID_NULL' ? null : data;
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
    let itemDate = code == 'FitUp' ? item['FittingDate'] : item['WeldingDate'];
    let itemPercent = code == 'FitUp' ? item['FitPercentage'] : item['WeldPercentage'];

    let isDateValid = itemDate != null && Moment(itemDate).format("DD-MMM-YY") !== Moment(new Date()).format("DD-MMM-YY");
    let isPercentValid = itemPercent != null && itemPercent == 100;
    let isUpdateValid = updateDrawingList.findIndex((obj => obj.RowIndex == item.RowIndex)) < 0;

    let isDisableItem = isDateValid && isPercentValid && isUpdateValid;
    let checkHasData = code == 'FitUp' ? (itemDate || itemPercent) : (itemDate || itemPercent || item['WelderID']);
    let isUserError = errorList.indexOf(item.RowIndex) > -1;

    let isDisableByProject = false;
    if (itemDate) {
      let nowString = Moment(new Date()).format("YYYY-MM-DD");
      let now = Moment(nowString, "YYYY-MM-DD");
      let dateString = Moment(itemDate, "YYYY-MM-DD");
      let date = Moment(dateString, "YYYY-MM-DD");
      isDisableByProject = Moment.duration(now.diff(date)).asDays() > 1 ? true : false;
    }
    isDisableByProject = isUpdateValid && isDisableByProject;
    isDisableItem = projectCode === 'DNWHP' ? isDisableByProject : isDisableItem;

    return (
      <View style={isUserError ? styles.boxError : styles.box} pointerEvents={isDisableItem ? 'none' : 'auto'}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            {
              isDisableItem
                ?
                <Text style={styles.greenText}>
                  <Text>WeldNo: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{formatEmptyData(item.WeldNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{formatEmptyData(item.ConType)}</Text>
                </Text>
                :
                <>
                  <Text>WeldNo: </Text>
                  <Text style={styles.textMeta}>{formatEmptyData(item.WeldNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={styles.textMeta}>{formatEmptyData(item.ConType)}</Text>
                </>
            }
          </View>
          <>
            {
              !isDisableItem && checkHasData
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
            {
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
            }
          </>
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
                <Text>FitPercent:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowDialog(item.FitPercentage, index, 'FitPercentage')}>
                  <Text style={styles.textData} >{formatEmptyData(item.FitPercentage)}</Text>
                  {
                    isDisableItem
                      ?
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                      :
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  }
                </TouchableOpacity>
              </View>
              {
                isDisableItem
                  ?
                  (<View style={styles.cellPercentRight}>
                    <TouchableOpacity style={styles.itemPercentDisable}>
                      <Text style={styles.textPercentDisabled}>50%</Text>
                    </TouchableOpacity>
                  </View>)
                  :
                  (<View style={styles.cellPercentRight}>
                    <TouchableOpacity
                      style={styles.itemPercent}
                      onPress={() => _onPressChangePercent(50, index, 'FitPercentage')}>
                      <Text style={styles.textPercent}>50%</Text>
                    </TouchableOpacity>
                  </View>)
              }
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>ItemCode01:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <Text style={styles.textData} >{formatEmptyData(item.ItemCode01)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>HeatNo01:</Text>
              </View>
              <View style={styles.cellDataLine}>
                {item.ItemCode01
                  ?
                  <TouchableOpacity
                    style={styles.itemActionWelder}
                    onPress={() => _onPressShowHeatNoPopup(item.ItemCode01, index, 'Heat01')}>
                    <Text style={styles.textDataWelder}>{formatEmptyData(item.Heat01)}</Text>
                    {
                      isDisableItem || !item.ItemCode01
                        ?
                        <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                  :
                  null}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>ItemCode02:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <Text style={styles.textData} >{formatEmptyData(item.ItemCode02)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>HeatNo02:</Text>
              </View>
              <View style={styles.cellDataLine}>
                {item.ItemCode02
                  ?
                  <TouchableOpacity
                    style={styles.itemActionWelder}
                    onPress={() => _onPressShowHeatNoPopup(item.ItemCode02, index, 'Heat02')}>
                    <Text style={styles.textDataWelder}>{formatEmptyData(item.Heat02)}</Text>
                    {
                      isDisableItem || !item.ItemCode02
                        ?
                        <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                  :
                  null}
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
                <Text>WeldPercent:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowDialog(item.WeldPercentage, index, 'WeldPercentage')}>
                  <Text style={styles.textData} >{formatEmptyData(item.WeldPercentage)}</Text>
                  {
                    isDisableItem
                      ?
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                      :
                      <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                  }
                </TouchableOpacity>
              </View>
              {
                isDisableItem
                  ?
                  (<View style={styles.cellPercent}>
                    <TouchableOpacity style={styles.itemPercentDisable}>
                      <Text style={styles.textPercentDisabled}>25%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemPercentDisable}>
                      <Text style={styles.textPercentDisabled}>50%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemPercentDisable}>
                      <Text style={styles.textPercentDisabled}>75%</Text>
                    </TouchableOpacity>
                  </View>)
                  :
                  (<View style={styles.cellPercent}>
                    <TouchableOpacity
                      style={styles.itemPercent}
                      onPress={() => _onPressChangePercent(25, index, 'WeldPercentage')}>
                      <Text style={styles.textPercent}>25%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.itemPercent}
                      onPress={() => _onPressChangePercent(50, index, 'WeldPercentage')}>
                      <Text style={styles.textPercent}>50%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.itemPercent}
                      onPress={() => _onPressChangePercent(75, index, 'WeldPercentage')}>
                      <Text style={styles.textPercent}>75%</Text>
                    </TouchableOpacity>
                  </View>)
              }
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WelderIDs:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <TouchableOpacity
                  style={styles.itemActionWelder}
                  onPress={() => _onPressSelectWelder(item.WelderID, index, 'WelderID')}>
                  <Text style={styles.textDataWelder} >{item.WelderID}</Text>
                  {
                    isDisableItem
                      ?
                      <AntDesignIcon style={styles.iconActionWelder} name='addusergroup' size={20} color={'#a3a3a3'} />
                      :
                      <AntDesignIcon style={styles.iconActionWelder} name='addusergroup' size={20} color={BASE_COLOR} />
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>WPS:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <TouchableOpacity
                  style={styles.itemActionWelder}
                  onPress={() => _onPressShowWPSPopup(index, 'WPSNo')}>
                  <Text style={styles.textDataWelder} >{item.WPSNo}</Text>
                  {
                    isDisableItem
                      ?
                      <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={'#a3a3a3'} />
                      :
                      <Ionicons style={styles.iconActionWelder} name='md-list' size={20} color={BASE_COLOR} />
                  }
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
          {
            isShowDescription.show
              ?
              (<View style={styles.headerContainer}>
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
              </View>)
              :
              null
          }
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
        </View>
      }
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
      <HelpModal
        visible={isVisibleHelp}
        code={code}
        onClose={() => setIsVisibleHelp(false)} />
      <PickupDataModal
        visible={isVisibleHeatNo}
        onClear={_onPressClearHeatNoPopup}
        onCancel={() => setIsVisibleHeatNo(false)}
        loaded={heatNoList != null}>
        {
          heatNoList != null
            ?
            heatNoList.length
              ?
              heatNoList.map((item) => {
                return (
                  <TouchableOpacity style={modals.row} onPress={() => _onChangeHeatNoCode(item)}>
                    <Text style={modals.cell}>{item}</Text>
                  </TouchableOpacity>
                );
              })
              :
              <View>
                <Text style={modals.emptyText}>No have any data!</Text>
              </View>
            :
            <View>
              <ActivityIndicator size='large' color={BASE_COLOR} />
            </View>
        }
      </PickupDataModal>
      <PickupDataModal
        visible={isVisibleWPS}
        onClear={_onPressClearWPSPopup}
        onCancel={() => setIsVisibleWPS(false)}
        loaded={wpsList != null}>
        {
          wpsList != null
            ?
            wpsList.length
              ?
              wpsList.map((item) => {
                return (
                  <TouchableOpacity style={modals.row} onPress={() => _onChangeWPSCode(item)}>
                    <Text style={modals.cell}>{item}</Text>
                  </TouchableOpacity>
                );
              })
              :
              <View>
                <Text style={modals.emptyText}>No have any data!</Text>
              </View>
            :
            <View>
              <ActivityIndicator size='large' color={BASE_COLOR} />
            </View>
        }
      </PickupDataModal>
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
  boxError: {
    flexDirection: 'column',
    width: '100%',
    borderColor: 'red',
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
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
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
  },
  cellDataLine: {
    flex: 2.2,
    justifyContent: 'center',
  },
  itemActionWelder: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textDataWelder: {
    minWidth: 80,
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  iconActionWelder: {
    marginHorizontal: 4,
    width: 20,
    height: 20,
  },
  cellPercent: {
    flex: 1.2,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  cellPercentRight: {
    flex: 1.2,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  textMeta: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  greenText: {
    color: 'green',
  },
  textData: {
    minWidth: 80,
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

const modals = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    color: BASE_COLOR,
    paddingHorizontal: 4,
  },
  emptyText: {
    flex: 1,
    color: BASE_COLOR,
    textAlign: 'center',
    fontSize: 15,
  },
});