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

import { GetLocationListAPI, GetFittingTeamListAPI, GetWPSListAPI } from '../../../apis/app/AppAPI';
import { GetConstructionDetailAPI, UpdateConstructionDetailAPI, SendDimToQCAPI } from '../../../apis/structural/ConstructionAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
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
      }
      else {
        callAPI(getConstructionDetail);
      }
    }, [route.params?.welderSelected, route.params?.index]
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

  const updateConstructionDetail = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(constructionUpdateList);
    UpdateConstructionDetailAPI(listUpdate, token)
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
      callAPI(updateConstructionDetail);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = () => {
    navigation.navigate(
      Constant.PIPING,
      {
        screen: 'DrawingImage',
        params: {
          projectCode: projectCode,
          facilityCode: facilityCode,
          drawingNo: drawingNo,
          code: code,
          teamLeader: userLogin
        }
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

  const [isVisibleFittingTeam, setIsVisibleFittingTeam] = useState(false);
  const [fittingTeamList, setFittingTeamList] = useState(null);

  const [isVisibleWPS, setIsVisibleWPS] = useState(false);
  const [wpsList, setWPSList] = useState(null);

  const [isVisibleTimeDimQC, setIsVisibleTimeDimQC] = useState(false);
  const [modelSendDimToQC, setModelSendDimToQC] = useState({
    RowIndex: 0,
    ProjectCode: projectCode,
    DIMRemark: '',
    PieceNo1: '',
    PieceNo2: ''
  });
  const _onChangeTimeDimQC = async () => {
    let token = await Helper.getData('TOKEN');
    if (!modelSendDimToQC.DIMRemark || !modelSendDimToQC.DIMRemark.trim()) {
      Toast.show('Please enter time!', Toast.SHORT, ['RCTModalHostViewController']);
      return;
    }
    modelSendDimToQC.DIMRemark = modelSendDimToQC.DIMRemark.trim();
    SendDimToQCAPI(modelSendDimToQC, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
      });
    setIsVisibleTimeDimQC(false);
  };
  const _onPressOpenTimeDimQC = item => {
    modelSendDimToQC.RowIndex = item.RowIndex;
    modelSendDimToQC.PieceNo1 = item.PieceNo1;
    modelSendDimToQC.PieceNo2 = item.PieceNo2;
    setIsVisibleTimeDimQC(true);
  };

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
  }

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
        array.push({ RowIndex: rowIndex, ['FitUpPercent']: value });
      } else {
        array[objIndex]['FitUpPercent'] = constructionDetailList[indexUpdate][keyUpdate];
      }
      setConstructionUpdateList(array);
    }
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

  const _onPressShowFittingTeamPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleFittingTeam(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        getFittingTeamList();
      }
    });
  };
  const getFittingTeamList = async () => {
    if (fittingTeamList == null) {
      let token = await Helper.getData('TOKEN');
      GetFittingTeamListAPI(projectCode, code, token)
        .then(res => {
          if (res.success) {
            setFittingTeamList(res.data);
            setIsLoading(false);
            setIsError(false);
          } else {
            setIsLoading(false);
            setIsError(true);
            setIsVisibleFittingTeam(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsError(true);
          setIsVisibleFittingTeam(false);
        });
    }
  };
  const _onPressClearFittingTeam = () => {
    _onChangeFittingTeam(null);
    setIsVisibleFittingTeam(false);
  };
  const _onChangeFittingTeam = data => {
    _onChangeData(data);
    setIsVisibleFittingTeam(false);
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
    } else {
      array[index]['WelderID'] = valueClear;
      array[index]['WPSNo'] = valueClear;
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
        });
      } else {
        array.push({
          RowIndex: rowIndex,
          [keyDate]: valueClear,
          [keyPercent]: valueClear,
          ['WelderID']: valueClear,
          ['WPSNo']: valueClear
        });
      }
    } else {
      array[objIndex][keyDate] = constructionDetailList[index][keyDate];
      array[objIndex][keyPercent] = constructionDetailList[index][keyPercent];
      if (code == Constant.CODE_FITUP) {
        array[objIndex]['Location'] = constructionDetailList[index]['Location'];
        array[objIndex]['FitUpRequestByTeam'] = constructionDetailList[index]['FitUpRequestByTeam'];
      } else {
        array[objIndex]['WelderID'] = constructionDetailList[index]['WelderID'];
        array[objIndex]['WPSNo'] = constructionDetailList[index]['WPSNo'];
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
  const renderItem = ({ index, item }) => {
    let itemDate = code == Constant.CODE_FITUP ? item['FitUpDate'] : item['ActualFabWeldDate'];
    let itemPercent = code == Constant.CODE_FITUP ? item['FitUpPercent'] : item['ActualFabWeldPercent'];

    let isDateValid = itemDate != null && Moment(itemDate).format("DD-MMM-YY") !== Moment(new Date()).format("DD-MMM-YY");
    let isPercentValid = itemPercent != null && itemPercent == 100;

    let isDisableItem = isDateValid && isPercentValid;
    let isEnableClear = itemDate || itemPercent;

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
                  <Text>FitUpDate:</Text>
                </View>
                <View style={styles.cellData}>
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
                {
                  isDisableItem
                    ?
                    <View style={styles.cellPercentRight}>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>Send DIM</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cellPercentRight}>
                      <TouchableOpacity
                        style={styles.itemPercent}
                        onPress={() => _onPressOpenTimeDimQC(item)}>
                        <Text style={styles.textPercent}>Send DIM</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>FitUpPercent:</Text>
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
                    <View style={styles.cellPercentRight}>
                      <TouchableOpacity style={styles.itemPercentDisable}>
                        <Text style={styles.textPercentDisabled}>50%</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cellPercentRight}>
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
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceNo2)}</Text>
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
                    onPress={() => _onPressShowFittingTeamPopup(index, 'FitUpRequestByTeam')}>
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
            </>
            :
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>WeldDate:</Text>
                </View>
                <View style={styles.cellData}>
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
                <View style={styles.cellPercent} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>WeldPercent:</Text>
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
                  <Text>WPSNo:</Text>
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
      />
      <HelpModal
        visible={isVisibleHelp}
        code={code}
        onClose={() => setIsVisibleHelp(false)} />
      <SelectPopup
        visible={isVisibleLocation}
        data={locationList}
        onChangeItem={_onChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
        onClear={_onPressClearLocation}
      >
      </SelectPopup>
      <SelectPopup
        visible={isVisibleFittingTeam}
        data={fittingTeamList}
        onChangeItem={_onChangeFittingTeam}
        onCancel={() => setIsVisibleFittingTeam(false)}
        onClear={_onPressClearFittingTeam}
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
      <Dialog.Container visible={isVisibleTimeDimQC}>
        <Dialog.Title>{'Enter Time'}</Dialog.Title>
        <Dialog.Input
          value={modelSendDimToQC.DIMRemark}
          onChangeText={(text) => {
            var model = { ...modelSendDimToQC };
            model.DIMRemark = text;
            setModelSendDimToQC(model);
          }}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => {
          setIsVisibleTimeDimQC(false);
          modelSendDimToQC.DIMRemark = '';
        }} />
        <Dialog.Button label='Send to QC' onPress={_onChangeTimeDimQC} />
      </Dialog.Container>
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

export default ConstructionDetailScreen;