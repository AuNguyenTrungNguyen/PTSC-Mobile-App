import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Formater from '../../../utils/Formater';
import CoreStyle from '../../../utils/CoreStyle';
import { GetInspectorListAPI } from '../../../apis/app/AppAPI';
import { GetQCSpendListQRCodeAPI, UpdateQCSpendListAPI } from '../../../apis/structural/QCAPI';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import TotalLocationModal from '../../../components/drawing/TotalLocationModal';
import SelectPopup from '../../../components/SelectPopup';

const QCSpendListScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spendList, setSpendList] = useState([]);
  const [updateSpendList, setUpdateSpendList] = useState([]);

  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.FILTER_ALL);

  const [isVisibleTotal, setIsVisibleTotal] = useState(false);
  const [totalList, setTotalList] = useState([]);

  const { projectCode, subContractor, sheet, rev, code, userLogin, paramDrawingNo, isSpending } = route.params;

  const [weldNo, setWeldNo] = useState('');
  const [drawingNo, setDrawingNo] = useState('');
  const [location, setLocation] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {
            !isSpending &&
            <TouchableOpacity
              style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setIsVisibleType(true) }}>
              <Ionicons
                size={24}
                name={'md-ellipsis-vertical-circle'} color={iconColor} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleTotal(true) }}>
            <Ionicons
              size={24}
              name={'md-list-circle-outline'} color={iconColor} />
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
  }, [navigation, isShowDescription]);
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

  useEffect(
    async () => {
      callAPI(getInspectorList);
      const inspector = await Helper.getData('QC_INSPECTOR_STR');
      setGlobalInspector(inspector);

      if (paramDrawingNo) {
        setDrawingNo(paramDrawingNo);
        callAPI(() => { getSpendListData(paramDrawingNo, weldNo, location, type) });
      } else {
        callAPI(getSpendListData);
      }
    }, []
  );

  const callAPI = executedAPI => {
    setIsSearching(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
        MessageAlert('WARNING', 'Network not available!');
      } else {
        executedAPI();
      }
    });
  };

  const getSpendListData = async (drawing = drawingNo, weld = weldNo, locate = location, filterType = type) => {
    GetQCSpendListQRCodeAPI(projectCode, drawing, sheet, rev, weld, locate, filterType, code, isSpending)
      .then(res => {
        if (res.success) {
          setSpendList(res.data);
          setTotalList(res.total);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  const updateSpendListData = async () => {
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(updateSpendList);
    UpdateQCSpendListAPI(userLogin, listUpdate, code, token)
      .then(res => {
        if (res.success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateSpendList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(() => { getSpendListData(drawingNo, weldNo, location, type) });
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
      });
  };

  const _onChangeWeldNo = no => {
    setWeldNo(no);
    if (!no) {
      callAPI(() => { getSpendListData(drawingNo, no, location, type) });
    }
  };

  const _onChangeDrawingNo = (no) => {
    setDrawingNo(no);
    if (!no) {
      callAPI(() => { getSpendListData(no, weldNo, location, type, false) });
    }
  };

  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(() => { getSpendListData(drawingNo, weldNo, location, type) });
  };

  const _onPressSubmitToServer = async () => {
    if (updateSpendList.length) {
      callAPI(updateSpendListData);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = item => {
    navigation.navigate(
      'QCImage',
      {
        rowIndex: item.RowIndex,
        projectCode: projectCode,
        drawingNo: item.WeldMapDrawingNo,
        sheet: item.WMSheet,
        jointNo: item.JointNo,
        code: code,
        userLogin: userLogin
      }
    );
  };

  // LOCATION
  const _onPressChangeLocation = loc => {
    if (loc != location) {
      setLocation(loc);
      callAPI(() => { getSpendListData(drawingNo, weldNo, loc, type) });
    }
    setIsVisibleTotal(false);
  };
  const _onPressClearLocation = () => {
    _onPressChangeLocation('');
  };

  // TYPE
  const _onChangeType = data => {
    if (data != type) {
      setType(data);
      callAPI(() => { getSpendListData(drawingNo, weldNo, location, data) });
    }
    setIsVisibleType(false);
  };

  // INSPECTOR
  const [inspectorList, setInspectorList] = useState([]);
  const getInspectorList = async () => {
    const token = await Helper.getData('TOKEN');
    const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
    GetInspectorListAPI(projectCode, disciplineCode, 'QC Structure', token)
      .then(res => {
        if (res.Success) {
          setInspectorList(res.Data);
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
  const [isVisibleInspector, setIsVisibleInspector] = useState(false);
  const _onPressShowInspector = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleInspector(true);
  };
  const _onChangeInspector = data => {
    onChangeData(data);
    setIsVisibleInspector(false);
  };
  const [isVisibleGlobalInspector, setIsVisibleGlobalInspector] = useState(false);
  const [globalInspector, setGlobalInspector] = useState('');
  const _onPressShowGlobalInspector = () => {
    setIsVisibleGlobalInspector(true);
  };
  const _onChangeGlobalInspector = async data => {
    setGlobalInspector(data);
    if (globalInspector !== data) {
      await Helper.storeData('QC_INSPECTOR_STR', data);
    }
    setIsVisibleGlobalInspector(false);
  };

  //-- CheckBox
  const _onChangeCheckbox = (value, index, key) => {
    value = value ? 'x' : null;
    setIndexUpdate(index);
    setKeyUpdate(key);
    const inspectorKey = code === Constant.CODE_FITUP ? 'FitUpInspectName' : 'VisualInspectName';
    onChangeData(value, index, key, inspectorKey);
  };

  //-- Status
  const _onPressChangeStatus = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    const inspectorKey = code === Constant.CODE_FITUP ? 'FitUpInspectName' : 'VisualInspectName';
    onChangeData(value, index, key, inspectorKey);
  };

  //-- Remark
  const [remarkDisplay, setRemarkDisplay] = useState('');
  const [isShowDialogRemark, setIsShowDialogRemark] = useState(false);
  const _onPressShowDialogRemark = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setRemarkDisplay(value.toString());
    } else {
      setRemarkDisplay('');
    }
    setIsShowDialogRemark(true);
  };
  const _onPressSubmitRemark = () => {
    let value = remarkDisplay;
    if (!value) {
      value = null;
    }
    const inspectorKey = code === Constant.CODE_FITUP ? 'FitUpInspectName' : 'VisualInspectName';
    onChangeData(value, indexUpdate, keyUpdate, inspectorKey);
    setRemarkDisplay(value);
    setIsShowDialogRemark(false);
  };

  //-- CHANGE
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');
  const onChangeData = (data, localIndex = indexUpdate, localKey = keyUpdate, inspectorKey) => {
    let array = [...spendList];
    array[localIndex][localKey] = data;
    if (inspectorKey) {
      array[localIndex][inspectorKey] = globalInspector;
    }
    setSpendList(array);

    array = [...updateSpendList];
    const rowIndex = spendList[localIndex].RowIndex;
    const objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      if (inspectorKey) {
        array.push({ RowIndex: rowIndex, [localKey]: data, [inspectorKey]: globalInspector });
      } else {
        array.push({ RowIndex: rowIndex, [localKey]: data });
      }
    } else {
      array[objIndex][localKey] = data;
      if (inspectorKey) {
        array[objIndex][inspectorKey] = globalInspector;
      }
    }
    setUpdateSpendList(array);
  };




  const renderItem = ({ index, item }) => {
    const isDisable = item.DIMStatus != Constant.STATUS_ACCEPT;
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellInlineThreeUnit}>
            <Text>WeldNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.JointNo)}</Text>
            <Text> - WeldType: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldType)}</Text>
          </View>
          <View style={styles.cellImageAction}>
            {
              isDisable
                ?
                <View >
                  <Ionicons size={24} name={'md-image-outline'} color={'#a3a3a3'} />
                </View>
                :
                <TouchableOpacity onPress={() => { _onPressManagePicture(item) }}>
                  <Ionicons size={24} name={'md-image-outline'} color={iconColor} />
                </TouchableOpacity>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOneUnit}>
            <Text>DrawingNo:</Text>
          </View>
          <View style={styles.cellThreeUnit}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'View Drawing Spend List')}>
                  <Text style={CoreStyle.textLinkWithLine}>{Formater.formatEmptyData(item.WeldMapDrawingNo)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldMapDrawingNo)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOneUnit}>
            <Text>Sheet:</Text>
          </View>
          <View style={styles.cellOneUnit}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WMSheet)}</Text>
          </View>
          <View style={styles.cellOneUnit}>
            <Text>Rev:</Text>
          </View>
          <View style={styles.cellOneUnit}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WMRev)}</Text>
          </View>
        </View>
        {
          code == Constant.CODE_FITUP
            ?
            (<>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>PieceNo1:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceNo1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>SerialNo1:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SerialNo1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Des1:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceDescription1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>HeatNo1:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo_TagNo1)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>PieceNo2:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceNo2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>SerialNo2:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SerialNo2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Des2:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceDescription2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>HeatNo2:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.HeatNo_TagNo2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>FitUpTeam:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpRequestByTeam)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Inspector:</Text>
                </View>
                <View style={styles.cellThreeUnitAction}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpInspectName)}</Text>
                  <TouchableOpacity onPress={() => _onPressShowInspector(index, 'FitUpInspectName')}>
                    <Ionicons name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>FittingDate:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.FitUpDate)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Time:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.DIMRemark)}</Text>
                </View>
                <View style={styles.cellAction}>
                  {
                    isDisable
                      ?
                      <View style={styles.buttonDisable}>
                        <Text style={styles.labelDisable}>Accept</Text>
                      </View>
                      :
                      <TouchableOpacity
                        style={styles.buttonAccept}
                        onPress={() => _onPressChangeStatus(Constant.STATUS_ACCEPT, index, 'FitUpResult')}>
                        <Text style={styles.labelAccept}>Accept</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Location:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textDataMargin}>{Formater.formatEmptyData(item.Location)}</Text>
                </View>
                <View style={styles.cellAction}>

                  {
                    isDisable
                      ?
                      <>
                        <View>
                          <Ionicons size={24} name={'md-document-text-outline'} color={'#a3a3a3'} style={{ marginRight: 4 }} />
                        </View>
                        <View style={styles.buttonDisable}>
                          <Text style={styles.labelDisable}>Reject</Text>
                        </View>
                      </>
                      :
                      <>
                        <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCFittupRemark, index, 'QCFittupRemark')}>
                          <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.buttonReject}
                          onPress={() => _onPressChangeStatus(Constant.STATUS_REJECT, index, 'FitUpResult')}>
                          <Text style={styles.labelReject}>Reject</Text>
                        </TouchableOpacity>
                      </>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>DIMStatus:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  {
                    item.DIMStatus
                      ?
                      item.DIMStatus == Constant.STATUS_ACCEPT
                        ?
                        <Text style={styles.textAccept}>{item.DIMStatus}</Text>
                        :
                        <Text style={styles.textReject}>{item.DIMStatus}</Text>
                      :
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.DIMStatus)}</Text>
                  }
                </View>
                <View style={styles.cellAction}>
                  {
                    isDisable
                      ?
                      <View style={styles.buttonDisable}>
                        <Text style={styles.labelDisable}>Clear</Text>
                      </View>
                      :
                      <TouchableOpacity
                        style={styles.buttonClean}
                        onPress={() => _onPressChangeStatus(null, index, 'FitUpResult')}>
                        <Text style={styles.labelClean}>Clear</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>FitUpStatus:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  {
                    item.FitUpResult
                      ?
                      item.FitUpResult == Constant.STATUS_ACCEPT
                        ?
                        <Text style={styles.textAccept}>{item.FitUpResult}</Text>
                        :
                        <Text style={styles.textReject}>{item.FitUpResult}</Text>
                      :
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpResult)}</Text>
                  }
                </View>
              </View>
            </>)
            :
            (<>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>ThkWeld:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.ThicknessWeld)}</Text>
                </View>
                <View style={styles.cellOneUnit} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>%UT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <Text style={styles.textData}>{Formater.formatTwoDigits(item.UTPercent)}</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <Text>%MT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <Text style={styles.textData}>{Formater.formatTwoDigits(item.MTPercent)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>WelderIDs:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
                </View>
                <View style={styles.cellOneUnit} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>WPSNo:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WPSNo)}</Text>
                </View>
                <View style={styles.cellOneUnit} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>{'Consumable\nLotNo'}:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingConsumableLotNo)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>{'MachineNo'}:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldingMachineNo)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>VisualTeam:</Text>
                </View>
                <View style={styles.cellThreeUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.VisualRequestByTeam)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Inspector:</Text>
                </View>
                <View style={styles.cellThreeUnitAction}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.VisualInspectName)}</Text>
                  <TouchableOpacity onPress={() => _onPressShowInspector(index, 'VisualInspectName')}>
                    <Ionicons name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>{'Visual\nRequest\nDate'}:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.ActualFabWeldDate)}</Text>
                </View>
                <View style={styles.cellOneUnit} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>{'Welding\nCompleted\nDate'}:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatDateDataTime(item.WeldingCompletedDate)}</Text>
                </View>
                <View style={styles.cellOneUnit} />
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>{'QC\nCheckTime'}:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualRemark)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonAccept}
                    onPress={() => _onPressChangeStatus(Constant.STATUS_ACCEPT, index, 'VisualResult')}>
                    <Text style={styles.labelAccept}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Location:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textDataMargin}>{Formater.formatEmptyData(item.Location)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCVisualRemark, index, 'QCVisualRemark')}>
                    <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => _onPressChangeStatus(Constant.STATUS_REJECT, index, 'VisualResult')}>
                    <Text style={styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Status:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  {
                    item.VisualResult
                      ?
                      item.VisualResult == Constant.STATUS_ACCEPT
                        ?
                        <Text style={styles.textAccept}>{item.VisualResult}</Text>
                        :
                        <Text style={styles.textReject}>{item.VisualResult}</Text>
                      :
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.VisualResult)}</Text>
                  }
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonClean}
                    onPress={() => _onPressChangeStatus(null, index, 'VisualResult')}>
                    <Text style={styles.labelClean}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>MT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.MT}
                    onValueChange={newValue => _onChangeCheckbox(newValue, index, 'MT')}
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
                </View>
                <View style={styles.cellOneUnit}>
                  <Text>RT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.RT}
                    onValueChange={newValue => _onChangeCheckbox(newValue, index, 'RT')}
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
                </View>
                <View style={styles.cellOneUnit}>
                  <Text>PAUT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.PAUT}
                    onValueChange={newValue => _onChangeCheckbox(newValue, index, 'PAUT')}
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
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>UT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.UT}
                    onValueChange={newValue => _onChangeCheckbox(newValue, index, 'UT')}
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
                </View>
                <View style={styles.cellOneUnit}>
                  <Text>PT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.PT}
                    onValueChange={newValue => _onChangeCheckbox(newValue, index, 'PT')}
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
                </View>
                <View style={styles.cellOneUnit} />
                <View style={styles.cellOneUnit} />
              </View>
            </>)
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(() => { getSpendListData(drawingNo, weldNo, location, type) })} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              <View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text>Project:   </Text>
                  {/* <Text style={styles.infoData}>{projectCode}</Text> */}
                  <Text style={styles.infoData}>{projectCode}  -  {subContractor}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text>User:   </Text>
                  <Text style={styles.infoData}>{userLogin}</Text>
                  <Text>   Inspector:   </Text>
                  <View style={styles.cellThreeAction}>
                    <Text style={styles.textData}>{globalInspector}</Text>
                    <TouchableOpacity onPress={() => _onPressShowGlobalInspector()}>
                      <Ionicons name='md-list' size={20} color={BASE_COLOR} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction}>DrawingNo:</Text>
                  {
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={drawingNo}
                        onChangeText={_onChangeDrawingNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        drawingNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeDrawingNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  }
                </View>
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction}>WeldNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={weldNo}
                      onChangeText={_onChangeWeldNo}
                      underlineColorAndroid='transparent'
                    />
                    {weldNo == ''
                      ? null
                      : <Icon name='times-circle' onPress={() => _onChangeWeldNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfoAction}>
                  <Text style={styles.infoTitleAction} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchDrawing}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search Drawing</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
          }
          {isSearching
            ?
            <ListLoadingData />
            :
            spendList.length
              ?
              <VirtualizedList
                style={styles.table}
                data={spendList}
                getItemCount={(data) => data.length}
                getItem={(data, index) => {
                  return data[index];
                }}
                keyExtractor={(data, index) => {
                  return data['RowIndex'];
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
      <TotalLocationModal
        visible={isVisibleTotal}
        data={totalList}
        onClose={() => setIsVisibleTotal(false)}
        onPressChangeLocation={_onPressChangeLocation}
        onPressClearLocation={_onPressClearLocation}
      />
      <SelectPopup
        visible={isVisibleType}
        data={[Constant.FILTER_ALL, Constant.FILTER_NOT_YET, Constant.FILTER_ALREADY]}
        onCancel={() => setIsVisibleType(false)}
        onChangeItem={_onChangeType}>
      </SelectPopup>
      <Dialog.Container visible={isShowDialogRemark}>
        <Dialog.Title>{'Enter remark REJECT:'}</Dialog.Title>
        <Dialog.Input
          multiline={true}
          numberOfLines={7}
          value={remarkDisplay}
          onChangeText={(text) => setRemarkDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsShowDialogRemark(false) }} />
        <Dialog.Button label='OK' onPress={_onPressSubmitRemark} />
      </Dialog.Container>
      <SelectPopup
        visible={isVisibleInspector}
        data={inspectorList}
        onChangeItem={_onChangeInspector}
        onCancel={() => setIsVisibleInspector(false)} />
      <SelectPopup
        visible={isVisibleGlobalInspector}
        data={inspectorList}
        onChangeItem={_onChangeGlobalInspector}
        onCancel={() => setIsVisibleGlobalInspector(false)} />
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
  infoData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellThreeAction: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  inputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  searchButton: {
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
    margin: 4,
    minHeight: 20,
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
  },
  cellInlineThreeUnit: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellOneUnit: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTwoUnit: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThreeUnit: {
    flex: 3,
    justifyContent: 'center',
  },
  cellThreeUnitAction: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textDataMargin: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    marginRight: 12
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  buttonClean: {
    width: 70,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelClean: {
    color: BASE_COLOR,
  },
  buttonDisable: {
    width: 70,
    borderColor: '#a3a3a3',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelDisable: {
    color: '#a3a3a3',
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
});

export default QCSpendListScreen;