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

import { GetLocationListAPI, GetTeamListAPI, GetWPSListAPI } from '../../../apis/app/AppAPI';
import { GetConstructionDetailAPI, UpdateConstructionDetailAPI } from '../../../apis/structural/ConstructionAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import { ENUM_QC_SCOPE } from '../../../utils/Enum';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import HelpModal from '../../../components/drawing/HelpModal';
import SelectPopup from '../../../components/SelectPopup';

const ConstructionDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, userLogin, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [constructionDetailList, setConstructionDetailList] = useState(null);
  const [constructionUpdateList, setConstructionUpdateList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  useEffect(
    () => {
      if (route.params?.welderSelected) {
        _onChangeWelders(route.params?.welderSelected);
      } else if (route.params?.pieceMarkNoSelected) {
        _onChangePieceMarkNo(route.params?.pieceMarkNoSelected);
      }
      else {
        callAPI(getConstructionDetail);
      }
    }, [route.params?.welderSelected, route.params?.pieceMarkNoSelected, route.params?.index]
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

  const getConstructionDetail = async () => {
    let token = await Helper.getData('TOKEN');
    GetConstructionDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token)
      .then(res => {
        if (res.success) {
          setConstructionDetailList(res.data);
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

  // Submit to Server
  const checkConstructionDetail = () => {
    let messages = [];
    if (code == Constant.CODE_FITUP) {
      constructionUpdateList.map(item => {
        let date = item['FitUpDate'];
        let percent = item['FitUpPercent'];
        let location = item['Location'];
        let team = item['FitUpRequestByTeam'];
        let time = item['DIMRemark'];

        if ((date && percent && location && team && time) || (!date && !percent && !location && !team && !time)) {
          return item;
        }

        let keys = Object.keys(item);
        let column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        let objIndex = constructionDetailList.findIndex(obj => obj.RowIndex == item.RowIndex);
        let oldItem = constructionDetailList[objIndex];
        if ((column.indexOf('FitUpDate') >= 0 && !date) || (column.indexOf('FitUpDate') < 0 && !oldItem['FitUpDate'])) {
          messages.push('Date');
        }
        if ((column.indexOf('FitUpPercent') >= 0 && !percent) || (column.indexOf('FitUpPercent') < 0 && !oldItem['FitUpPercent'])) {
          messages.push('Percent');
        }
        if ((column.indexOf('Location') >= 0 && !location) || (column.indexOf('Location') < 0 && !oldItem['Location'])) {
          messages.push('Location');
        }
        if ((column.indexOf('FitUpRequestByTeam') >= 0 && !team) || (column.indexOf('FitUpRequestByTeam') < 0 && !oldItem['FitUpRequestByTeam'])) {
          messages.push('Team');
        }
        if ((column.indexOf('DIMRemark') >= 0 && !time) || (column.indexOf('DIMRemark') < 0 && !oldItem['DIMRemark'])) {
          messages.push('Time');
        }
        return item;
      });
    }
    else {
      constructionUpdateList.map(item => {
        let date = item['ActualFabWeldDate'];
        let percent = item['ActualFabWeldPercent'];
        let welderId = item['WelderID'];
        let wspNo = item['WPSNo'];
        let team = item['VisualRequestByTeam'];
        let completeDate = item['WeldingCompletedDate'];
        let time = item['QCVisualRemark'];

        if ((date && percent && welderId && wspNo && team && completeDate && time)
          || (!date && !percent && !welderId && !wspNo && !team && !completeDate && !time)) {
          return item;
        }

        let keys = Object.keys(item);
        let column = keys.filter(i => (i !== 'RowIndex' && i !== 'Id'));
        let objIndex = constructionDetailList.findIndex(obj => obj.RowIndex == item.RowIndex);
        let oldItem = constructionDetailList[objIndex];
        if ((column.indexOf('ActualFabWeldDate') >= 0 && !date) || (column.indexOf('ActualFabWeldDate') < 0 && !oldItem['ActualFabWeldDate'])) {
          messages.push('Date');
        }
        if ((column.indexOf('ActualFabWeldPercent') >= 0 && !percent) || (column.indexOf('ActualFabWeldPercent') < 0 && !oldItem['ActualFabWeldPercent'])) {
          messages.push('Percent');
        }
        if ((column.indexOf('WelderID') >= 0 && !welderId) || (column.indexOf('WelderID') < 0 && !oldItem['WelderID'])) {
          messages.push('WelderID');
        }
        if ((column.indexOf('WPSNo') >= 0 && !wspNo) || (column.indexOf('WPSNo') < 0 && !oldItem['WPSNo'])) {
          messages.push('WPSNo');
        }
        if ((column.indexOf('VisualRequestByTeam') >= 0 && !team) || (column.indexOf('VisualRequestByTeam') < 0 && !oldItem['VisualRequestByTeam'])) {
          messages.push('Team');
        }
        if ((column.indexOf('WeldingCompletedDate') >= 0 && !completeDate) || (column.indexOf('WeldingCompletedDate') < 0 && !oldItem['WeldingCompletedDate'])) {
          messages.push('CompletedDate');
        }
        if ((column.indexOf('QCVisualRemark') >= 0 && !time) || (column.indexOf('QCVisualRemark') < 0 && !oldItem['QCVisualRemark'])) {
          messages.push('Time');
        }
        return item;
      });
    }
    return messages;
  };
  const updateConstructionDetail = async () => {
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(constructionUpdateList);
    setIsUploading(true);
    UpdateConstructionDetailAPI(projectCode, facilityCode, userLogin, code, listUpdate, token)
      .then(res => {
        if (res.success) {
          setConstructionUpdateList([]);
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
    if (constructionUpdateList.length) {
      let error = checkConstructionDetail();
      if (error.length) {
        let uniqueError = [...new Set(error)];
        MessageAlert('ERROR', '\nPlesase enter: ' + uniqueError.join(', '));
      } else {
        callAPI(updateConstructionDetail);
      }
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = () => {
    navigation.navigate(
      'ConstructionImage',
      {
        projectCode: projectCode,
        facilityCode: facilityCode,
        drawingNo: drawingNo,
        code: code,
        teamLeader: userLogin
      }
    );
  };

  const [isVisibleHelp, setIsVisibleHelp] = useState(false);

  const [isVisibleDate, setIsVisibleDate] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(new Date());

  const [isVisiblePercent, setIsVisiblePercent] = useState(false);
  const [percentDisplay, setPercentDisplay] = useState('');

  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState(null);

  const [isVisibleTeam, setIsVisibleTeam] = useState(false);
  const [teamList, setTeamList] = useState(null);

  const [isVisibleWPS, setIsVisibleWPS] = useState(false);
  const [wpsList, setWPSList] = useState(null);

  const [isVisibleCompleteDate, setIsVisibleCompleteDate] = useState(false);
  const [completeDateDisplay, setCompleteDateDisplay] = useState(new Date());

  const [isVisibleTime, setIsVisibleTime] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('');

  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');

  const _onChangeData = data => {
    let array = [...constructionDetailList];
    array[indexUpdate][keyUpdate] = data;
    setConstructionDetailList(array);

    array = [...constructionUpdateList];
    let rowIndex = constructionDetailList[indexUpdate].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyUpdate]: data });
    } else {
      array[objIndex][keyUpdate] = constructionDetailList[indexUpdate][keyUpdate];
    }
    setConstructionUpdateList(array);
  };

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
  const _onChangeDate = (selectedDate) => {
    if (selectedDate != undefined) {
      let array = [...constructionDetailList];
      array[indexUpdate][keyUpdate] = Moment(selectedDate).format("YYYY-MM-DD");
      setConstructionDetailList(array);

      array = [...constructionUpdateList];
      let rowIndex = constructionDetailList[indexUpdate].RowIndex;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, [keyUpdate]: Moment(selectedDate).format("YYYY-MM-DD") });
      } else {
        array[objIndex][keyUpdate] = constructionDetailList[indexUpdate][keyUpdate];
      }
      setConstructionUpdateList(array);
    }
    setIsVisibleDate(false);
  };

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
    if (!checkFormatNumber(value)) {
      Toast.show('Please enter ' + keyUpdate + ' must be a number.', Toast.SHORT);
      return;
    }
    value = parseFloat(value);
    if (value && (value < 0 || value > 100)) {
      Toast.show(keyUpdate + ' must be from 0 to 100.', Toast.SHORT);
      return;
    }
    setIsVisiblePercent(false);
    if (constructionDetailList[indexUpdate][keyUpdate] !== value) {
      let array = [...constructionDetailList];
      array[indexUpdate][keyUpdate] = value;
      setConstructionDetailList(array);

      array = [...constructionUpdateList];
      let rowIndex = constructionDetailList[indexUpdate].RowIndex;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, [keyUpdate]: value });
      } else {
        array[objIndex][keyUpdate] = constructionDetailList[indexUpdate][keyUpdate];
      }
      setConstructionUpdateList(array);
    }
  };

  const _onPressSelectPieceMarkNo = (item, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    navigation.navigate(
      'ConstructionAddPieceMarkNo',
      {
        projectCode: projectCode,
        facilityCode: facilityCode,
        index: index,
        data: { PieceMarkNo: item.PieceNo2, PieceDescription: item.PieceDescription2, HeatNo_TagNo: item.HeatNo_TagNo2},
      }
    );
  };
  const _onChangePieceMarkNo = data => {
    let array = [...constructionDetailList];
    array[indexUpdate]['PieceNo2'] = data.PieceMarkNo;
    array[indexUpdate]['PieceMarkNo02'] = data.PieceMarkNo;
    array[indexUpdate]['PieceDescription2'] = data.PieceDescription;
    array[indexUpdate]['HeatNo_TagNo2'] = data.HeatNo_TagNo;
    setConstructionDetailList(array);

    array = [...constructionUpdateList];
    let rowIndex = constructionDetailList[indexUpdate].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({
        RowIndex: rowIndex,
        'PieceNo2': data.PieceMarkNo,
        'PieceMarkNo02': data.PieceMarkNo,
        'PieceDescription2': data.PieceDescription,
        'HeatNo_TagNo2': data.HeatNo_TagNo,
      });
    } else {
      array[indexUpdate]['PieceNo2'] = data.PieceMarkNo;
      array[indexUpdate]['PieceMarkNo02'] = data.PieceMarkNo;
      array[indexUpdate]['PieceDescription2'] = data.PieceDescription;
      array[indexUpdate]['HeatNo_TagNo2'] = data.HeatNo_TagNo;
    }
    setConstructionUpdateList(array);
  };

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
      let token = await Helper.getData('TOKEN');
      let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
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
    _onChangeData(data);
    setIsVisibleLocation(false);
  };

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
      let token = await Helper.getData('TOKEN');
      let filterType = code == Constant.CODE_FITUP ? Constant.CODE_FITUP : Constant.CODE_VISUAL;
      GetTeamListAPI(projectCode, filterType, token)
        .then(res => {
          if (res.success) {
            setTeamList(res.data);
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
    _onChangeData(data);
    setIsVisibleTeam(false);
  };

  const _onPressOpenTime = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setTimeDisplay(value.toString());
    } else {
      setTimeDisplay('');
    }
    setIsVisibleTime(true);
  };
  const _onChangeTime = () => {
    let value = timeDisplay.trim();
    setTimeDisplay(value);
    if (!timeDisplay || !timeDisplay.trim()) {
      Toast.show('Please enter time!', Toast.SHORT, ['RCTModalHostViewController']);
      return;
    }
    if (constructionDetailList[indexUpdate][keyUpdate] !== value) {
      _onChangeData(value);
    }
    setIsVisibleTime(false);
  };

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
      let token = await Helper.getData('TOKEN');
      let disciplineCode = await Helper.getData('DISCIPLINE_CODE');
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
    _onChangeData(data);
    setIsVisibleWPS(false);
  };

  const _onPressSelectCompleteDate = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setCompleteDateDisplay(new Date(Moment(value).format("YYYY-MM-DDTHH:mm:00.000Z")));
    } else {
      setCompleteDateDisplay(new Date());
    }
    setIsVisibleCompleteDate(true);
  };
  const _onChangeCompleteDate = (selectedDate) => {
    if (selectedDate != undefined) {
      let array = [...constructionDetailList];
      array[indexUpdate][keyUpdate] = Moment(selectedDate).format("YYYY-MM-DD HH:mm:00");
      setConstructionDetailList(array);

      array = [...constructionUpdateList];
      let rowIndex = constructionDetailList[indexUpdate].RowIndex;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, [keyUpdate]: Moment(selectedDate).format("YYYY-MM-DD HH:mm:00") });
      } else {
        array[objIndex][keyUpdate] = constructionDetailList[indexUpdate][keyUpdate];
      }
      setConstructionUpdateList(array);
    }
    setIsVisibleCompleteDate(false);
  };

  const _onPressSelectWelder = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    navigation.navigate(
      'ConstructionAddWelder',
      {
        projectCode: projectCode,
        welders: value,
        index: index,
      }
    );
  };
  const _onChangeWelders = welderSelected => {
    _onChangeData(welderSelected);
  };

  const _onPressClearNow = index => {
    let keyDate = code == Constant.CODE_FITUP ? 'FitUpDate' : 'ActualFabWeldDate';
    let keyPercent = code == Constant.CODE_FITUP ? 'FitUpPercent' : 'ActualFabWeldPercent';
    let valueClear = null;

    let array = [...constructionDetailList];
    array[index][keyDate] = valueClear;
    array[index][keyPercent] = valueClear;
    if (code === Constant.CODE_FITUP) {
      array[index]['Location'] = valueClear;
      array[index]['FitUpRequestByTeam'] = valueClear;
      array[index]['DIMRemark'] = valueClear;
    } else {
      array[index]['WelderID'] = valueClear;
      array[index]['WPSNo'] = valueClear;
      array[index]['VisualRequestByTeam'] = valueClear;
      array[index]['WeldingCompletedDate'] = valueClear;
      array[index]['QCVisualRemark'] = valueClear;
    }
    setConstructionDetailList(array);

    array = [...constructionUpdateList];
    let rowIndex = constructionDetailList[index].RowIndex;
    let objIndex = array.findIndex(obj => obj.RowIndex === rowIndex);
    if (objIndex < 0) {
      if (code == Constant.CODE_FITUP) {
        array.push({
          RowIndex: rowIndex,
          [keyDate]: valueClear,
          [keyPercent]: valueClear,
          ['Location']: valueClear,
          ['FitUpRequestByTeam']: valueClear,
          ['DIMRemark']: valueClear,
        });
      } else {
        array.push({
          RowIndex: rowIndex,
          [keyDate]: valueClear,
          [keyPercent]: valueClear,
          ['WelderID']: valueClear,
          ['WPSNo']: valueClear,
          ['VisualRequestByTeam']: valueClear,
          ['WeldingCompletedDate']: valueClear,
          ['QCVisualRemark']: valueClear,
        });
      }
    } else {
      array[objIndex][keyDate] = valueClear;
      array[objIndex][keyPercent] = valueClear;
      if (code == Constant.CODE_FITUP) {
        array[objIndex]['Location'] = valueClear;
        array[objIndex]['FitUpRequestByTeam'] = valueClear;
        array[objIndex]['DIMRemark'] = valueClear;
      } else {
        array[objIndex]['WelderID'] = valueClear;
        array[objIndex]['WPSNo'] = valueClear;
        array[objIndex]['VisualRequestByTeam'] = valueClear;
        array[objIndex]['WeldingCompletedDate'] = valueClear;
        array[objIndex]['QCVisualRemark'] = valueClear;
      }
    }
    setConstructionUpdateList(array);
  };

  const _onPressDoneNow = index => {
    let keyDate = code == Constant.CODE_FITUP ? 'FitUpDate' : 'ActualFabWeldDate';
    let keyPercent = code == Constant.CODE_FITUP ? 'FitUpPercent' : 'ActualFabWeldPercent';
    let valueDate = Moment(new Date()).format("YYYY-MM-DD");
    let valuePercent = 100;

    let array = [...constructionDetailList];
    array[index][keyDate] = valueDate;
    array[index][keyPercent] = valuePercent;
    setConstructionDetailList(array);

    array = [...constructionUpdateList];
    let rowIndex = constructionDetailList[index].RowIndex;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyDate]: valueDate, [keyPercent]: valuePercent });
    } else {
      array[objIndex][keyDate] = constructionDetailList[index][keyDate];
      array[objIndex][keyPercent] = constructionDetailList[index][keyPercent];
    }
    setConstructionUpdateList(array);
  };

  const _onPressChangePercent = (value, index, key) => {
    if (constructionDetailList[index][key] !== value) {
      let array = [...constructionDetailList];
      array[index][key] = value;
      setConstructionDetailList(array);

      array = [...constructionUpdateList];
      let rowIndex = constructionDetailList[index].RowIndex;
      let weldNo = constructionDetailList[index].JointNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, ['FitUpPercent']: value });
      } else {
        array[objIndex]['FitUpPercent'] = constructionDetailList[index][key];
      }
      setConstructionUpdateList(array);
    }
  };

  const checkFormatNumber = input => {
    const regexNumber = /^\d+(\.\d+)?$/;
    return regexNumber.test(input) && input !== '';
  };





  const getStatusRenderList = () => {
    return constructionDetailList && constructionDetailList.length;
  };

  const RenderConstructionDetail = () => {
    {
      if (constructionDetailList == null) {
        return <ListLoadingData />
      } else if (!constructionDetailList.length) {
        return <ListEmptyData />
      }
    }
  };

  const RenderQCScope = ({ value }) => {
    let scope = 'New';
    if (value == ENUM_QC_SCOPE.QCWS)
      scope = 'QC Workshop';
    if (value == ENUM_QC_SCOPE.QCDEPT)
      scope = 'QC Department';
    return <Text style={styles.textData}>{scope}</Text>;
  };

  const renderItem = ({ index, item }) => {
    let itemDate = code == Constant.CODE_FITUP ? item['FitUpDate'] : item['ActualFabWeldDate'];
    let itemPercent = code == Constant.CODE_FITUP ? item['FitUpPercent'] : item['ActualFabWeldPercent'];
    let isDisableItem = item['QCStatusMobile'] == Constant.STATUS_ACCEPT;
    let isEnableClear = itemDate || itemPercent;
    if (code == Constant.CODE_FITUP) {
      isDisableItem = isDisableItem || (item['UTLAMPercent'] == 1 && item['LaminationTestResult'] != Constant.STATUS_ACCEPT);
    } else {
      isDisableItem = isDisableItem || item['FitUpResult'] != Constant.STATUS_ACCEPT;
    }

    return (
      <View style={styles.box} pointerEvents={isDisableItem ? 'none' : 'auto'} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            {
              isDisableItem
                ?
                <Text style={styles.greenText}>
                  <Text>JointNo: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.JointNo)}</Text>
                  <Text> - WeldType: </Text>
                  <Text style={[styles.textMeta, styles.greenText]}>{Formater.formatEmptyData(item.WeldType)}</Text>
                </Text>
                :
                <>
                  <Text>JointNo: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.JointNo)}</Text>
                  <Text> - WeldType: </Text>
                  <Text style={styles.textMeta}>{Formater.formatEmptyData(item.WeldType)}</Text>
                </>
            }
          </View>
          <>
            {
              !isDisableItem && isEnableClear
                ?
                <TouchableOpacity
                  style={styles.itemDone}
                  onPress={() => _onPressClearNow(index)}>
                  <Text style={styles.textDone}>Clear</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={styles.itemDisabled}
                  disabled={true}>
                  <Text style={styles.textDisabled}>Clear</Text>
                </TouchableOpacity>
            }
            {
              !isDisableItem
                ?
                <TouchableOpacity
                  style={styles.itemDone}
                  onPress={() => _onPressDoneNow(index)}>
                  <Text style={styles.textDone}>Done</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={styles.itemDisabled}
                  disabled={true}>
                  <Text style={styles.textDisabled}>Done</Text>
                </TouchableOpacity>
            }
          </>
        </View>
        {
          code == Constant.CODE_FITUP
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Date:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectDate(item.FitUpDate, index, 'FitUpDate')}>
                    <Text style={styles.textData}>{Formater.formatDateData(item.FitUpDate)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Percent:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectPercent(item.FitUpPercent, index, 'FitUpPercent')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpPercent)}</Text>
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
                    <View style={styles.cellPercent}>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>50%</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cellPercent}>
                      <TouchableOpacity
                        style={styles.itemPercent}
                        onPress={() => _onPressChangePercent(50, index, 'FitUpPercent')}>
                        <Text style={styles.textPercent}>50%</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Location:</Text>
                </View>
                <View style={styles.cellDataLine}>
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
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Team:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowTeamPopup(index, 'FitUpRequestByTeam')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpRequestByTeam)}</Text>
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
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Time:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressOpenTime(item.DIMRemark, index, 'DIMRemark')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.DIMRemark)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>PieceNo1:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceNo1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Description1:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceDescription1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>HeatNo1:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo_TagNo1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>PieceNo2:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressSelectPieceMarkNo(item, index, 'PieceNo2')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceNo2)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Description2:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceDescription2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>HeatNo2:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo_TagNo2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>QCScope:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <RenderQCScope value={item.QCScope} />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>LAMPercent:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.UTLAMPercent)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>LAMResult:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.LaminationTestResult)}</Text>
                </View>
              </View>
            </>
            :
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Date:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectDate(item.ActualFabWeldDate, index, 'ActualFabWeldDate')}>
                    <Text style={styles.textData}>{Formater.formatDateData(item.ActualFabWeldDate)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Percent:</Text>
                </View>
                <View style={styles.cellData}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectPercent(item.ActualFabWeldPercent, index, 'ActualFabWeldPercent')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.ActualFabWeldPercent)}</Text>
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
                    <View style={styles.cellPercent}>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>25%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>50%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>75%</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cellPercent}>
                      <TouchableOpacity
                        style={styles.itemPercent}
                        onPress={() => _onPressChangePercent(25, index, 'ActualFabWeldPercent')}>
                        <Text style={styles.textPercent}>25%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.itemPercent}
                        onPress={() => _onPressChangePercent(50, index, 'ActualFabWeldPercent')}>
                        <Text style={styles.textPercent}>50%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.itemPercent}
                        onPress={() => _onPressChangePercent(75, index, 'ActualFabWeldPercent')}>
                        <Text style={styles.textPercent}>75%</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>WelderID:</Text>
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
                  <Text style={styles.redText}>WPSNo:</Text>
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
                  <Text style={styles.redText}>Team:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemActionIcon}
                    onPress={() => _onPressShowTeamPopup(index, 'VisualRequestByTeam')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.VisualRequestByTeam)}</Text>
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
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>{'Completed\nDate'}:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressSelectCompleteDate(item.WeldingCompletedDate, index, 'WeldingCompletedDate')}>
                    <Text style={styles.textData}>{Formater.formatDateDataTime(item.WeldingCompletedDate)}</Text>
                    {
                      isDisableItem
                        ?
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={'#a3a3a3'} />
                        :
                        <AntDesignIcon style={styles.iconAction} name='calendar' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text style={styles.redText}>Time:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <TouchableOpacity
                    style={styles.itemAction}
                    onPress={() => _onPressOpenTime(item.QCVisualRemark, index, 'QCVisualRemark')}>
                    <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualRemark)}</Text>
                    {
                      isDisableItem
                        ?
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={'#a3a3a3'} />
                        :
                        <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>FitUpResult:</Text>
                </View>
                <View style={styles.cellDataLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpResult)}</Text>
                </View>
              </View>
            </>
        }
      </View>
    );
  };

  const headerData = {
    'Project': projectCode,
    'Facility': facilityCode,
    'DrawingNo': { 'DrawingNo': drawingNo, 'Link': link },
    'Sheet': sheet,
    'Rev': rev,
    'UserLogin': userLogin,
  };

  const headerAction = () => {
    Helper.openDrawingPDF(navigation, link, 'Open Cons Detail Drawing')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getConstructionDetail)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} action={headerAction}></Header>
          }
          {
            getStatusRenderList()
              ?
              <>
                {
                  code == Constant.CODE_FITUP
                    ?
                    <Text style={styles.textDataRequired}>Required LAMPercent and LAMResult accepted to submit FitUp request!</Text>
                    :
                    <Text style={styles.textDataRequired}>Required FitUpResult accepted to submit Visual request!</Text>
                }
                <VirtualizedList
                  style={styles.table}
                  data={constructionDetailList}
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
              <Text style={styles.buttonTitle}>Manage Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isVisibleDate}
            headerTextIOS={'Update ' + keyUpdate + ':'}
            date={dateDisplay}
            mode={'date'}
            onConfirm={_onChangeDate}
            onCancel={() => { setIsVisibleDate(false) }}
          />
          <DateTimePickerModal
            isVisible={isVisibleCompleteDate}
            headerTextIOS={'Update ' + keyUpdate + ':'}
            date={completeDateDisplay}
            mode={'datetime'}
            onConfirm={_onChangeCompleteDate}
            onCancel={() => { setIsVisibleCompleteDate(false) }}
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
        </View>
      }
      <AwesomeAlert
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      >
      </AwesomeAlert>
      <HelpModal
        visible={isVisibleHelp}
        code={code}
        onClose={() => setIsVisibleHelp(false)}
      >
      </HelpModal>
      <SelectPopup
        visible={isVisibleLocation}
        data={locationList}
        onChangeItem={_onChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
        onClear={_onPressClearLocation}
      >
      </SelectPopup>
      <SelectPopup
        visible={isVisibleTeam}
        data={teamList}
        onChangeItem={_onChangeTeam}
        onCancel={() => setIsVisibleTeam(false)}
        onClear={_onPressClearTeam}
      >
      </SelectPopup>
      <SelectPopup
        visible={isVisibleWPS}
        data={wpsList}
        onChangeItem={_onChangeWPSCode}
        onCancel={() => setIsVisibleWPS(false)}
        onClear={_onPressClearWPS}
      >
      </SelectPopup>
      <Dialog.Container visible={isVisibleTime}>
        <Dialog.Title>{'Enter Time'}</Dialog.Title>
        <Dialog.Input
          value={timeDisplay}
          onChangeText={(text) => setTimeDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsVisibleTime(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeTime} />
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
    color: BASE_COLOR,
  },
  textDataRequired: {
    fontWeight: 'bold',
    color: 'red',
    fontStyle: 'italic',
    marginBottom: 4,
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

export default ConstructionDetailScreen;