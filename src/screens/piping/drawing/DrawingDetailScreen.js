import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
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

import { GetConstructionDetailAPI, UpdateConstructionDetailAPI } from '../../../apis/piping/ConstructionAPI';
import { GetLocationListAPI, GetSerialNoAndHeatNoListAPI, GetTeamListFilterAPI, GetWPSListAPI } from '../../../apis/app/AppAPI';

import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import HelpModal from '../../../components/drawing/HelpModal';
import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTwoColumns from '../../../components/SelectPopupTwoColumns';

const DrawingDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  useEffect(
    () => {
      if (route.params?.welderSelected) {
        _onChangeWelders(route.params?.welderSelected);
      }
      else {
        callAPI(getConstructionDetail);
      }
    }, [route.params?.welderSelected, route.params?.heatNoSelected, route.params?.index]
  );

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(
    () => {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setIsVisibleHelp(true) }}>
              <Ionicons
                size={24}
                name={'help-circle-outline'} color={iconColor} />
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
    }, [navigation, isShowDescription, isVisibleHelp]
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

  //-- Get Data
  const getConstructionDetail = async () => {
    const token = await Helper.getData('TOKEN');
    GetConstructionDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token)
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


  // Submit Data
  const checkConstructionDetail = () => {
    let messages = [];
    if (code == Constant.CODE_FITUP) {
      updateDrawingList.map(item => {
        const date = item['FittingDate'];
        const percent = item['FitPercentage'];
        const heat01 = item['Heat01'];
        const heat02 = item['Heat02'];
        const location = item['SiteLocation'];
        const team = item['FittingTeam'];

        if ((date && percent && heat01 && heat02 && location && team)
          || (!date && !percent && !heat01 && !heat02 && !location && !team)) {
          return item;
        }

        const keys = Object.keys(item);
        const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        const objIndex = detailDrawingList.findIndex(obj => obj.RowIndex == item.RowIndex);
        const oldItem = detailDrawingList[objIndex];
        if ((column.indexOf('FittingDate') >= 0 && !date) || (column.indexOf('FittingDate') < 0 && !oldItem['FittingDate'])) {
          messages.push('Date');
        }
        if ((column.indexOf('FitPercentage') >= 0 && !percent) || (column.indexOf('FitPercentage') < 0 && !oldItem['FitPercentage'])) {
          messages.push('Percent');
        }
        if ((column.indexOf('Heat01') >= 0 && !heat01) || (column.indexOf('Heat01') < 0 && !oldItem['Heat01'])) {
          messages.push('HeatNo01');
        }
        if ((column.indexOf('Heat02') >= 0 && !percent) || (column.indexOf('Heat02') < 0 && !oldItem['Heat02'])) {
          messages.push('Heat02');
        }
        if ((column.indexOf('SiteLocation') >= 0 && !location) || (column.indexOf('SiteLocation') < 0 && !oldItem['SiteLocation'])) {
          messages.push('Location');
        }
        if ((column.indexOf('FittingTeam') >= 0 && !team) || (column.indexOf('FittingTeam') < 0 && !oldItem['FittingTeam'])) {
          messages.push('Team');
        }
        return item;
      });
    }
    else {
      updateDrawingList.map(item => {
        const date = item['WeldingDate'];
        const percent = item['WeldPercentage'];
        const welderId = item['WelderID'];
        const wspNo = item['WPSNo'];
        const team = item['WelderTeam'];

        if ((date && percent && welderId && wspNo && team)
          || (!date && !percent && !welderId && !wspNo && !team)) {
          return item;
        }

        const keys = Object.keys(item);
        const column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        const objIndex = detailDrawingList.findIndex(obj => obj.RowIndex == item.RowIndex);
        const oldItem = detailDrawingList[objIndex];
        if ((column.indexOf('WeldingDate') >= 0 && !date) || (column.indexOf('WeldingDate') < 0 && !oldItem['WeldingDate'])) {
          messages.push('Date');
        }
        if ((column.indexOf('WeldPercentage') >= 0 && !percent) || (column.indexOf('WeldPercentage') < 0 && !oldItem['WeldPercentage'])) {
          messages.push('Percent');
        }
        if ((column.indexOf('WelderID') >= 0 && !welderId) || (column.indexOf('WelderID') < 0 && !oldItem['WelderID'])) {
          messages.push('WelderID');
        }
        if ((column.indexOf('WPSNo') >= 0 && !wspNo) || (column.indexOf('WPSNo') < 0 && !oldItem['WPSNo'])) {
          messages.push('WPSNo');
        }
        if ((column.indexOf('WelderTeam') >= 0 && !team) || (column.indexOf('WelderTeam') < 0 && !oldItem['WelderTeam'])) {
          messages.push('Team');
        }
        return item;
      });
    }
    return messages;
  };
  const updateConstructionDetail = async () => {
    const token = await Helper.getData('TOKEN');
    const listUpdate = Helper.handleListUpdate(updateDrawingList);
    const userLogin = await Helper.getData('USERNAME');
    setIsUploading(true);
    UpdateConstructionDetailAPI(projectCode, facilityCode, userLogin, code, listUpdate, token)
      .then(res => {
        if (res.success) {
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
    if (updateDrawingList.length) {
      const error = checkConstructionDetail();
      if (error.length) {
        const uniqueError = [...new Set(error)];
        MessageAlert('ERROR', '\nPlesase enter: ' + uniqueError.join(', '));
      } else {
        callAPI(updateConstructionDetail);
      }
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  //-- Manage Picture
  const _onPressManagePicture = () => {
    navigation.navigate(
      'DrawingImage',
      {
        userLogin: teamLeader,
        projectCode: projectCode,
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        sheet: sheet,
        jointNo: rev,
        code: code,
        role: Constant.IMAGE_ROLE_CONS
      }
    );
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

  const [isVisibleHelp, setIsVisibleHelp] = useState(false);
  const _onChangeCheckbox = (index, key, value) => {
    value = value ? 'TW' : null;
    onChangeData(value, index, key);
    // let array = [...detailDrawingList];
    // array[index][key] = value;
    // setDetailDrawingList(array);

    // array = [...updateDrawingList];
    // let rowIndex = detailDrawingList[index].RowIndex;
    // let weldNo = detailDrawingList[index].WeldNo;
    // let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    // if (objIndex < 0) {
    //   array.push(
    //     { RowIndex: rowIndex, WeldNo: weldNo, [key]: value });
    // } else {
    //   array[objIndex][key] = value;
    // }
    // setUpdateDrawingList(array);
  };

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
    const value = Formater.formatDateData(selectedDate);
    onChangeData(value);
    setIsVisibleDate(false);
  };

  const [isVisiblePercent, setIsVisiblePercent] = useState(false);
  const [percentDisplay, setPercentDisplay] = useState('');
  const _onPressSelectPercent = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setPercentDisplay(value.toString());
    } else {
      setPercentDisplay('');
    }
    setIsVisiblePercent(true);
  };
  const _onChangePercent = () => {
    let value = percentDisplay.replace(/,/g, '.');
    setPercentDisplay(value);
    if (!Helper.checkFormatNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    if (value && (value < 0 || value > 100)) {
      Toast.show(keyUpdate + ' must be from 0 to 100.', Toast.SHORT);
      return;
    }
    onChangeData(value);
    setIsVisiblePercent(false);
  };
  const _onPressChangePercent = (value, index, key) => {
    if (detailDrawingList[index][key] !== value) {
      setIndexUpdate(index);
      setKeyUpdate(key);
      onChangeData(value, index, key);
    }
  };

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
  const getLocationList = async () => {
    if (locationList == null) {
      const token = await Helper.getData('TOKEN');
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      GetLocationListAPI(projectCode, disciplineCode, token)
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
  const _onPressClearLocation = () => {
    _onChangeLocation(null);
    setIsVisibleLocation(false);
  };
  const _onChangeLocation = data => {
    onChangeData(data);
    setIsVisibleLocation(false);
  };

  const [isVisibleTeam, setIsVisibleTeam] = useState(false);
  const [teamList, setTeamList] = useState(null);
  const _onPressShowTeamPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleTeam(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getTeamList();
      }
    });
  };
  const getTeamList = async () => {
    if (teamList == null) {
      const token = await Helper.getData('TOKEN');
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      const filterType = code == Constant.CODE_FITUP ? Constant.CODE_FITUP : Constant.CODE_VISUAL;
      GetTeamListFilterAPI(projectCode, disciplineCode, filterType, token)
        .then(res => {
          if (res.Success) {
            setTeamList(res.Data);
            setIsLoading(false);
            setIsError(false);
          } else {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleTeam(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleTeam(false);
        });
    }
  };
  const _onPressClearTeam = () => {
    _onChangeTeam(null);
    setIsVisibleTeam(false);
  };
  const _onChangeTeam = data => {
    onChangeData(data);
    setIsVisibleTeam(false);
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
  const getWPSList = async () => {
    if (wpsList == null) {
      const token = await Helper.getData('TOKEN');
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      GetWPSListAPI(projectCode, disciplineCode, token)
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
    }
  };
  const _onPressClearWPS = () => {
    _onChangeWPSCode(null);
    setIsVisibleWPS(false);
  };
  const _onChangeWPSCode = data => {
    onChangeData(data);
    setIsVisibleWPS(false);
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
    onChangeData(welderSelected);
  };

  const _onPressClearNow = (index) => {
    const keyDate = code == Constant.CODE_FITUP ? 'FittingDate' : 'WeldingDate';
    const keyPercent = code == Constant.CODE_FITUP ? 'FitPercentage' : 'WeldPercentage';
    const valueClear = null;

    let array = [...detailDrawingList];
    array[index][keyDate] = valueClear;
    array[index][keyPercent] = valueClear;
    if (code == Constant.CODE_FITUP) {
      array[index]['Heat01'] = valueClear;
      array[index]['Heat02'] = valueClear;
      array[index]['SerialNo01'] = valueClear;
      array[index]['SerialNo02'] = valueClear;
      array[index]['SiteLocation'] = valueClear;
      array[index]['FittingTeam'] = valueClear;
    } else {
      array[index]['WelderID'] = valueClear;
      array[index]['WPSNo'] = valueClear;
      array[index]['WelderTeam'] = valueClear;
    }
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    const rowIndex = detailDrawingList[index].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (code == Constant.CODE_FITUP) {
        array.push({
          RowIndex: rowIndex,
          [keyDate]: valueClear,
          [keyPercent]: valueClear,
          ['Heat01']: valueClear,
          ['Heat02']: valueClear,
          ['SerialNo01']: valueClear,
          ['SerialNo02']: valueClear,
          ['SiteLocation']: valueClear,
          ['FittingTeam']: valueClear,
        });
      } else {
        array.push({
          RowIndex: rowIndex,
          [keyDate]: valueClear,
          [keyPercent]: valueClear,
          ['WelderID']: valueClear,
          ['WPSNo']: valueClear,
          ['WelderTeam']: valueClear,
        });
      }
    } else {
      array[objIndex][keyDate] = valueClear;
      array[objIndex][keyPercent] = valueClear;
      if (code == Constant.CODE_FITUP) {
        array[objIndex]['Heat01'] = valueClear;
        array[objIndex]['Heat02'] = valueClear;
        array[objIndex]['SerialNo01'] = valueClear;
        array[objIndex]['SerialNo02'] = valueClear;
        array[objIndex]['SiteLocation'] = valueClear;
        array[objIndex]['FittingTeam'] = valueClear;
      } else {
        array[objIndex]['WelderID'] = valueClear;
        array[objIndex]['WPSNo'] = valueClear;
        array[objIndex]['WelderTeam'] = valueClear;
      }
    }
    setUpdateDrawingList(array);
  };
  const _onPressDoneNow = (index) => {
    const keyDate = code == Constant.CODE_FITUP ? 'FittingDate' : 'WeldingDate';
    const keyPercent = code == Constant.CODE_FITUP ? 'FitPercentage' : 'WeldPercentage';
    const valueDate = Moment(new Date()).format("YYYY-MM-DD");
    const valuePercent = 100;

    let array = [...detailDrawingList];
    array[index][keyDate] = valueDate;
    array[index][keyPercent] = valuePercent;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    const rowIndex = detailDrawingList[index].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyDate]: valueDate, [keyPercent]: valuePercent });
    } else {
      array[objIndex][keyDate] = valueDate;
      array[objIndex][keyPercent] = valuePercent;
    }
    setUpdateDrawingList(array);
  };


  //-- Render Header
  const headerData = {
    'Project': projectCode,
    'Facility': facilityCode,
    'DrawingNo': { 'DrawingNo': drawingNo, 'Link': link },
    'Sheet': sheet,
    'Rev': rev,
    'UserLogin': teamLeader,
  };
  const headerAction = () => {
    Helper.openDrawingPDF(navigation, link, 'PIP CONS Drawing')
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
    const itemDate = code == Constant.CODE_FITUP ? item['FittingDate'] : item['WeldingDate'];
    const itemPercent = code == Constant.CODE_FITUP ? item['FitPercentage'] : item['WeldPercentage'];
    let isDisableItem = item['QCStatusMobile'] == Constant.STATUS_ACCEPT;
    if (code && code !== Constant.CODE_FITUP) {
      isDisableItem = isDisableItem || (item['FitUpResult'] != Constant.STATUS_ACCEPT);
    }
    const isEnableClear = itemDate || itemPercent;

    return (
      <View style={styles.box} pointerEvents={isDisableItem ? 'none' : 'auto'} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            {
              item['QCStatusMobile'] == Constant.STATUS_ACCEPT
                ?
                <Text style={styles.greenText}>
                  <Text>WeldNo: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.WeldNo)}</Text>
                  <Text> - WeldType: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.WeldType)}</Text>
                  {
                    item.WeldType == 'TW' && code == Constant.CODE_FITUP
                      ?
                      <>
                        <Text>   </Text>
                        <CheckBox
                          value={item.QCFittupRemark == 'TW'}
                          onValueChange={newValue => _onChangeCheckbox(index, 'QCFittupRemark', newValue)}
                          style={styles.checkBox}
                          boxType='square'
                          disabled={true}
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
                  <Text> - WeldType: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.WeldType)}</Text>
                  {
                    item.WeldType == 'TW' && code == Constant.CODE_FITUP
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
                    style={styles.itemAction}
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
                  <Text style={styles.redText}>FitPercent:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectPercent(item.FitPercentage, index, 'FitPercentage')}>
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
                  <Text>Class01:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textBase}>{Formater.formatEmptyData(item.Class1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>HeatNo01:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  {
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
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Class02:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textBase}>{Formater.formatEmptyData(item.Class2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>HeatNo02:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  {
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
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Location:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressShowLocationPopup(index, 'SiteLocation')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.SiteLocation)}</Text>
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
                  <Text style={styles.redText}>FittingTeam:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowTeamPopup(index, 'FittingTeam')}>
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
            </>
            :
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>WeldingDate:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectDate(item.WeldingDate, index, 'WeldingDate')}>
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
                  <Text style={styles.redText}>WeldPercent:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectPercent(item.WeldPercentage, index, 'WeldPercentage')}>
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
                  <Text style={styles.redText}>WelderIDs:</Text>
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
                  <Text style={styles.redText}>WPS:</Text>
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
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>WelderTeam:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowTeamPopup(index, 'WelderTeam')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderTeam)}</Text>
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
              <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManagePicture}>
                <Text style={styles.buttonTitle}>Chèn ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Gửi Request</Text>
              </TouchableOpacity>
            </View>
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
      <DateTimePickerModal
        isVisible={isVisibleDate}
        headerTextIOS={'Update ' + keyUpdate + ':'}
        date={dateDisplay}
        mode={'date'}
        onConfirm={_onChangeDate}
        onCancel={() => { setIsVisibleDate(false) }}
      />
      <Dialog.Container visible={isVisiblePercent}>
        <Dialog.Title>{'Update ' + keyUpdate + ':'}</Dialog.Title>
        <Dialog.Input
          value={percentDisplay}
          placeholder={'Enter ' + keyUpdate}
          onChangeText={(text) => setPercentDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
          keyboardType={'numeric'}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsVisiblePercent(false) }} />
        <Dialog.Button label='OK' onPress={_onChangePercent} />
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
      <SelectPopup
        visible={isVisibleLocation}
        data={locationList}
        onChangeItem={_onChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
        onClear={_onPressClearLocation}
      />
      <SelectPopup
        visible={isVisibleTeam}
        data={teamList}
        onChangeItem={_onChangeTeam}
        onCancel={() => setIsVisibleTeam(false)}
        onClear={_onPressClearTeam}
      />
      <SelectPopup
        visible={isVisibleWPS}
        data={wpsList}
        onChangeItem={_onChangeWPSCode}
        onCancel={() => setIsVisibleWPS(false)}
        onClear={_onPressClearWPS}
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
  redText: {
    color: 'red',
  },
  textData: {
    minWidth: 80,
    fontWeight: 'bold',
    color: 'green',
  },
  textBase: {
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

export default DrawingDetailScreen;