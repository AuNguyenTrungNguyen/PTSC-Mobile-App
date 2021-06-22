import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance } from 'react-native';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';
import CheckBox from '@react-native-community/checkbox';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import GetDrawingDetailAPI from '../../../apis/drawing/GetDrawingDetailAPI';
import UpdateDrawingDetailAPI from '../../../apis/drawing/UpdateDrawingDetailAPI';
import { GetLocationListAPI, GetWPSListAPI, GetHeatNoListPopupAPI, GetFittingTeamAPI } from '../../../apis/drawing/ConstructionDrawingAPI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import HelpModal from '../../../components/drawing/HelpModal';
import PickupDataModal from '../../../components/drawing/PickupDataModal';
import PickupDataModalHeader from '../../../components/drawing/PickupDataModalHeader';

const DrawingDetailScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);
  const [errorList, setErrorList] = useState([]);

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader, link } = route.params;

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  useEffect(
    () => {
      if (route.params?.welderSelected) {
        _onChangeWelders(route.params?.welderSelected);
      } else if (route.params?.heatNoSelected) {
        _onChangeHeatNo(route.params?.heatNoSelected);
      }
      else {
        callAPI(getDataDetail);
      }
    }, [route.params?.welderSelected, route.params?.heatNoSelected, route.params?.index]
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

  const getDataDetail = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      await Promise.all([
        GetDrawingDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token),
        GetFittingTeamAPI(projectCode, teamLeader, token)
      ])
        .then(([drawingResult, fittingTeamResult]) => {
          if (drawingResult.success && fittingTeamResult.success) {
            setDetailDrawingList(drawingResult.data);
            setFittingTeamList(fittingTeamResult.data);
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
        });;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      MessageAlert('ERROR', error.toString());
    }
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
      if (!element.hasOwnProperty('Location')) {
        element['Location'] = data['Location'];
      }
      if (!element.hasOwnProperty('FittingTeam')) {
        element['FittingTeam'] = data['FittingTeam'];
      }
      if (!element.hasOwnProperty('QCFittupRemark')) {
        element['QCFittupRemark'] = data['QCFittupRemark'];
      }

      // Check CLEAR
      if (!element['ItemDate']
        && !element['ItemPercent']
        && !element['Heat01']
        && !element['Heat02']
        && !element['Location']
        && !element['FittingTeam']
        && (!element['QCFittupRemark'] || element['QCFittupRemark'] == Constant.EMPTY_VALUE_STRING)) {
        element['IsClear'] = true;
      }
    });
    callAPI(updateDrawingDetailFitUp);
  };

  const updateDrawingDetailFitUp = async () => {
    let token = await Helper.getData('TOKEN');
    let errorListData = [];
    let doneListData = [];

    doneListData = updateDrawingList.filter(i => (i.ItemDate && i.ItemPercent && i.Heat01 && i.Heat02 && i.Location && i.FittingTeam) || i.IsClear);
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

    doneListData = updateDrawingList.filter(i => (i.ItemDate && i.ItemPercent && i.WelderID && i.WPSNo) || i.IsClear);
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

  const _onChangeCheckbox = (index, key, value) => {
    value = value ? 'TW' : Constant.EMPTY_VALUE_STRING;
    let array = [...detailDrawingList];
    array[index][key] = value;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[index].RowIndex;
    let weldNo = detailDrawingList[index].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push(
        { RowIndex: rowIndex, WeldNo: weldNo, [key]: value });
    } else {
      array[objIndex][key] = value;
    }
    setUpdateDrawingList(array);
  };

  const [isVisibleHelp, setIsVisibleHelp] = useState(false);

  const [isVisibleHeatNoPopup, setIsVisibleHeatNoPopup] = useState(false);
  const [heatNoListPopup, setHeatNoListPopup] = useState(null);

  const _onPressShowHeatNoPopup = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleHeatNoPopup(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getHeatNoListPopup(value);
      }
    });
  };

  const _onPressClearHeatNoPopup = () => {
    _onChangeHeatNoPopup(null);
    setIsVisibleHeatNoPopup(false);
  };

  const getHeatNoListPopup = async value => {
    let token = await Helper.getData('TOKEN');
    GetHeatNoListPopupAPI(projectCode, value, token)
      .then(res => {
        if (res.success) {
          setHeatNoListPopup(res.data);
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleHeatNoPopup(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsVisibleHeatNoPopup(false);
      });
  };

  const _onChangeHeatNoPopup = (data) => {
    let array = [...detailDrawingList];
    array[indexUpdate][keyUpdate] = !data ? null : data.HeatNo_TagNo;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[indexUpdate].RowIndex;
    let weldNo = detailDrawingList[indexUpdate].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (keyUpdate == 'Heat01') {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: !data ? null : data.HeatNo_TagNo, ['SeriNo01']: !data ? null : data.SeriNo, ['ItemDescription01']: !data ? null : data.ItemDescription });
      } else {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: !data ? null : data.HeatNo_TagNo, ['SeriNo02']: !data ? null : data.SeriNo, ['ItemDescription02']: !data ? null : data.ItemDescription });
      }
    } else {
      array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      if (keyUpdate == 'Heat01') {
        array[objIndex]['SeriNo01'] = !data ? null : data.SeriNo;
        array[objIndex]['ItemDescription01'] = !data ? null : data.ItemDescription;
      } else {
        array[objIndex]['SeriNo02'] = !data ? null : data.SeriNo;
        array[objIndex]['ItemDescription02'] = !data ? null : data.ItemDescription;
      }
    }
    setUpdateDrawingList(array);
    setIsVisibleHeatNoPopup(false);
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
          setIsVisibleWPS(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsVisibleWPS(false);
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

  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState(null);

  const _onPressShowLocationPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleLocation(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getLocationList();
      }
    });
  };

  const _onPressClearLocationPopup = () => {
    _onChangeLocation(null);
    setIsVisibleLocation(false);
  };

  const getLocationList = async () => {
    if (locationList == null) {
      let token = await Helper.getData('TOKEN');
      GetLocationListAPI(projectCode, token)
        .then(res => {
          if (res.success) {
            setLocationList(res.data);
            setIsLoading(false);
            setIsError(false);
          } else {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleLocation(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleLocation(false);
        });
    }
  };

  const _onChangeLocation = (data) => {
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
    setIsVisibleLocation(false);
  };

  const [isVisibleFittingTeam, setIsVisibleFittingTeam] = useState(false);
  const [fittingTeamList, setFittingTeamList] = useState([]);

  const _onPressShowFittingTeamPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleFittingTeam(true);
  };

  const _onChangeFittingTeam = data => {
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
    setIsVisibleFittingTeam(false);
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
      'DrawingAddWelder',
      {
        projectCode: projectCode,
        welders: value,
        index: index,
      }
    );
  };

  const _onChangeWelders = welderSelected => {
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

  const _onPressSelectHeatNo = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    navigation.navigate(
      'DrawingAddHeatNo',
      {
        projectCode: projectCode,
        itemCode: value,
        index: index,
      }
    );
  };

  const _onChangeHeatNo = data => {
    let array = [...detailDrawingList];
    data = formatEmptyHeatNo(data);
    array[indexUpdate][keyUpdate] = !data ? null : data.HeatNo_TagNo;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[indexUpdate].RowIndex;
    let weldNo = detailDrawingList[indexUpdate].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (keyUpdate == 'Heat01') {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: !data ? null : data.HeatNo_TagNo, ['SeriNo01']: !data ? null : data.SeriNo, ['ItemDescription01']: !data ? null : data.ItemDescription });
      } else {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: !data ? null : data.HeatNo_TagNo, ['SeriNo02']: !data ? null : data.SeriNo, ['ItemDescription02']: !data ? null : data.ItemDescription });
      }
    } else {
      array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      if (keyUpdate == 'Heat01') {
        array[objIndex]['SeriNo01'] = !data ? null : data.SeriNo;
        array[objIndex]['ItemDescription01'] = !data ? null : data.ItemDescription;
      } else {
        array[objIndex]['SeriNo02'] = !data ? null : data.SeriNo;
        array[objIndex]['ItemDescription02'] = !data ? null : data.ItemDescription;
      }
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
      array[index]['SeriNo01'] = valueClear;
      array[index]['SeriNo02'] = valueClear;
      array[index]['ItemDescription01'] = valueClear;
      array[index]['ItemDescription02'] = valueClear;
      array[index]['Location'] = valueClear;
      array[index]['FittingTeam'] = valueClear;
      if (array[index]['ConType'] == 'TW') {
        array[index]['QCFittupRemark'] = Constant.EMPTY_VALUE_STRING;
      }
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
          ['Heat02']: valueClear,
          ['SeriNo01']: valueClear,
          ['SeriNo02']: valueClear,
          ['ItemDescription01']: valueClear,
          ['ItemDescription02']: valueClear,
          ['Location']: valueClear,
          ['FittingTeam']: valueClear,
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
        array[objIndex]['SeriNo01'] = detailDrawingList[index]['SeriNo01'];
        array[objIndex]['SeriNo02'] = detailDrawingList[index]['SeriNo02'];
        array[objIndex]['ItemDescription01'] = detailDrawingList[index]['ItemDescription01'];
        array[objIndex]['ItemDescription02'] = detailDrawingList[index]['ItemDescription02'];
        array[objIndex]['Location'] = detailDrawingList[index]['Location'];
        array[objIndex]['FittingTeam'] = detailDrawingList[index]['FittingTeam'];
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

  const formatEmptyWelder = data => {
    return data == 'CLEAR_WELDER_ID' ? null : data;
  };

  const formatEmptyHeatNo = data => {
    return data == 'CLEAR_HEAT_NO' ? null : data;
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

    const isCompleteText = projectCode === 'DNWHP' ? isDisableByProject : isDisableItem;
    isDisableItem = false;

    return (
      <View style={isUserError ? styles.boxError : styles.box} pointerEvents={isDisableItem ? 'none' : 'auto'}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            {
              isCompleteText
                ?
                <Text style={styles.greenText}>
                  <Text>WeldNo: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.WeldNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.ConType)}</Text>
                  {
                    item.ConType == 'TW' && code == 'FitUp'
                      ?
                      <>
                        <Text>   </Text>
                        <CheckBox
                          value={item.QCFittupRemark == 'TW'}
                          onValueChange={newValue => _onChangeCheckbox(index, 'QCFittupRemark', newValue)}
                          style={styles.checkBox}
                          boxType='square'
                          disabled={false}
                          onCheckColor={OPP_COLOR}
                          onFillColor={BASE_COLOR}
                          onTintColor={BASE_COLOR}
                          tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
                          animationDuration={0.2}
                          onAnimationType='flat'
                        />
                      </>
                      :
                      null
                  }
                </Text>
                :
                <>
                  <Text>WeldNo: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.WeldNo)}</Text>
                  <Text> - ConType: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.ConType)}</Text>
                  {
                    item.ConType == 'TW' && code == 'FitUp'
                      ?
                      <>
                        <Text>   </Text>
                        <CheckBox
                          value={item.QCFittupRemark == 'TW'}
                          onValueChange={newValue => _onChangeCheckbox(index, 'QCFittupRemark', newValue)}
                          style={styles.checkBox}
                          boxType='square'
                          disabled={false}
                          onCheckColor={OPP_COLOR}
                          onFillColor={BASE_COLOR}
                          onTintColor={BASE_COLOR}
                          tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
                          animationDuration={0.2}
                          onAnimationType='flat'
                        />
                      </>
                      :
                      null
                  }
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
                <Text>FitPercent:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowDialog(item.FitPercentage, index, 'FitPercentage')}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FitPercentage)}</Text>
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
                <Text style={styles.textData}>{Formater.formatEmptyData(item.ItemCode01)}</Text>
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
                  :
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectHeatNo(item.ItemCode01, index, 'Heat01')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat01)}</Text>
                    {
                      isDisableItem
                        ?
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>ItemCode02:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <Text style={styles.textData}>{Formater.formatEmptyData(item.ItemCode02)}</Text>
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
                  :
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectHeatNo(item.ItemCode02, index, 'Heat02')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat02)}</Text>
                    {
                      isDisableItem
                        ?
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                        :
                        <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Location:</Text>
              </View>
              <View style={styles.cellData}>
                <TouchableOpacity
                  style={styles.itemAction}
                  onPress={() => _onPressShowLocationPopup(index, 'Location')}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Location)}</Text>
                  {
                    isDisableItem
                      ?
                      <Ionicons style={styles.iconAction} name='md-location' size={20} color={'#a3a3a3'} />
                      :
                      <Ionicons style={styles.iconAction} name='md-location' size={20} color={BASE_COLOR} />
                  }
                </TouchableOpacity>
              </View>
              <View style={styles.cellPercent} />
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FittingTeam:</Text>
              </View>
              <View style={styles.cellDataLine}>
                <TouchableOpacity
                  style={styles.itemActionIcon}
                  onPress={() => _onPressShowFittingTeamPopup(index, 'FittingTeam')}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FittingTeam)}</Text>
                  {
                    isDisableItem
                      ?
                      <Ionicons style={styles.iconAction} name='md-people-outline' size={20} color={'#a3a3a3'} />
                      :
                      <Ionicons style={styles.iconAction} name='md-people-outline' size={20} color={BASE_COLOR} />
                  }
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
                  <Text style={styles.textData}>{Formater.formatDateData(item.WeldingDate)}</Text>
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
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldPercentage)}</Text>
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
                  style={styles.itemActionIcon}
                  onPress={() => _onPressSelectWelder(item.WelderID, index, 'WelderID')}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
                  {
                    isDisableItem
                      ?
                      <AntDesignIcon style={styles.iconAction} name='addusergroup' size={20} color={'#a3a3a3'} />
                      :
                      <AntDesignIcon style={styles.iconAction} name='addusergroup' size={20} color={BASE_COLOR} />
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
                  style={styles.itemActionIcon}
                  onPress={() => _onPressShowWPSPopup(index, 'WPSNo')}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WPSNo)}</Text>
                  {
                    isDisableItem
                      ?
                      <Ionicons style={styles.iconAction} name='md-list' size={20} color={'#a3a3a3'} />
                      :
                      <Ionicons style={styles.iconAction} name='md-list' size={20} color={BASE_COLOR} />
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDataDetail)} />
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
                    {
                      link
                        ?
                        <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, link, 'Open Cons Detail Drawing')}>
                          <Text style={CoreStyle.textLink}>{drawingNo.toUpperCase()}</Text>
                        </TouchableOpacity>
                        :
                        <Text style={styles.infoData}>{drawingNo.toUpperCase()}</Text>
                    }
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
      <PickupDataModalHeader
        visible={isVisibleHeatNoPopup}
        onClear={_onPressClearHeatNoPopup}
        onCancel={() => setIsVisibleHeatNoPopup(false)}
        loaded={heatNoListPopup != null}
        text01='HeatNo'
        text02='SeriNo'
      >
        {
          heatNoListPopup != null
            ?
            heatNoListPopup.length
              ?
              heatNoListPopup.map((item) => {
                return (
                  <TouchableOpacity style={modals.row} onPress={() => _onChangeHeatNoPopup(item)}>
                    <Text style={modals.cell}>{item.HeatNo_TagNo}</Text>
                    <View style={modals.line} />
                    <Text style={modals.cell}>{item.SeriNo}</Text>
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
      </PickupDataModalHeader>
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
      <PickupDataModal
        visible={isVisibleLocation}
        onClear={_onPressClearLocationPopup}
        onCancel={() => setIsVisibleLocation(false)}
        loaded={locationList != null}>
        {
          locationList != null
            ?
            locationList.length
              ?
              locationList.map((item) => {
                return (
                  <TouchableOpacity style={modals.row} onPress={() => _onChangeLocation(item)}>
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
        visible={isVisibleFittingTeam}
        onCancel={() => setIsVisibleFittingTeam(false)}
        loaded={true}>
        {
          fittingTeamList.length
            ?
            fittingTeamList.map((item) => {
              return (
                <TouchableOpacity style={modals.row} onPress={() => _onChangeFittingTeam(item)}>
                  <Text style={modals.cell}>{item}</Text>
                </TouchableOpacity>
              );
            })
            :
            <View>
              <Text style={modals.emptyText}>No have any data!</Text>
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
  },
  cellDataLine: {
    flex: 2.2,
    justifyContent: 'center',
  },
  itemActionIcon: {
    flexDirection: 'row',
    alignItems: 'center'
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
  line: {
    height: '100%',
    width: 1,
    backgroundColor: BASE_COLOR,
  },
});

export default DrawingDetailScreen;