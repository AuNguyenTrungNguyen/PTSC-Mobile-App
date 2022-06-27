import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';

import Networker from '../../../utils/Networker';
import Constant from '../../../utils/Constant';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI, GetInspectorListAPI } from '../../../apis/app/AppAPI';
import { GetSpendListAPI, UpdateSpendListAPI } from '../../../apis/piping/QCAPI';

import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import TotalLocationModal from '../../../components/drawing/TotalLocationModal';
import SelectPopup from '../../../components/SelectPopup';

const QCSpendListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin, code } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spendList, setSpendList] = useState([]);
  const [updateSpendList, setUpdateSpendList] = useState([]);

  const [drawingNo, setDrawingNo] = useState('');
  const [weldNo, setWeldNo] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {
            code === Constant.CODE_VISUAL
              ?
              <TouchableOpacity
                style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { setIsVisibleNDTFilter(true) }}>
                <Ionicons
                  size={24}
                  name={'md-ellipsis-vertical-circle'} color={iconColor} />
              </TouchableOpacity>
              :
              null
          }
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleLocation(true) }}>
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

  const callAPI = executedAPI => {
    setIsSearching(true);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true), setIsSearching(false) });
  };
  useEffect(
    async () => {
      callAPI(getFacilityList);
      callAPI(getInspectorList);
      callAPI(getSpendListData);
      const inspector = await Helper.getData('QC_INSPECTOR');
      setGlobalInspector(inspector);
    }, []
  );

  //-- Search Action
  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(getSpendListData);
  };
  const getSpendListData = async (facility = facilityCode, drawing = drawingNo, weld = weldNo, locate = location, filter = NDTFilter) => {
    const token = await Helper.getData('TOKEN');

    facility = (!facility || facility === FACILITY_CODE_DEFAULT) ? '' : facility;

    if (filter === NDT_FILTER_100) {
      filter = Constant.PIECE_MARK_CHECKED;
    } else if (filter === NDT_FILTER_OTHERS) {
      filter = Constant.PIECE_MARK_UNCHECKED;
    }

    GetSpendListAPI(projectCode, facility, drawing, weld, locate, code, filter, token)
      .then(res => {
        if (res.Success && res.Data) {
          setSpendList(res.Data);
          setLocationList(res.Second);
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
  const getFacilityList = async () => {
    const token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setFacilityList(res.data);
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
  const getInspectorList = async () => {
    const token = await Helper.getData('TOKEN');
    const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
    GetInspectorListAPI(projectCode, disciplineCode, 'Piping & Welding Inspector', token)
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

  //-- Update Action
  const _onPressSubmitToServer = async () => {
    if (updateSpendList.length) {
      callAPI(updateSpendData);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };
  const updateSpendData = async () => {
    const token = await Helper.getData('TOKEN');
    const listUpdate = Helper.handleListUpdate(updateSpendList);
    UpdateSpendListAPI(projectCode, userLogin, code, listUpdate, token)
      .then(res => {
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
          setUpdateSpendList([]);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        callAPI(getSpendListData);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
      });
  };

  //-- Manage Picture
  const _onPressManagePicture = async item => {
    navigation.navigate(
      'DrawingImage',
      {
        userLogin: userLogin,
        projectCode: projectCode,
        facilityCode: item.FacilityCode,
        drawingNo: item.DrawingNo,
        sheet: item.Sheet,
        jointNo: weldNo,
        rowIndex: item.RowIndex,
        code: code,
        role: Constant.IMAGE_ROLE_QC
      }
    );
  };

  //-- DrawingNo & WeldNo
  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };
  const _onChangeWeldNo = no => {
    setWeldNo(no);
  };

  //-- FacilityCode filter
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { getSpendListData(code) });
    }
    setIsVisibleFacility(false);
  };
  const _onClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { getSpendListData('') });
    }
    setIsVisibleFacility(false);
  };

  //-- Location filter
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState('');
  const _onPressChangeLocation = loc => {
    if (loc != location) {
      setLocation(loc);
      callAPI(() => { getSpendListData(facilityCode, drawingNo, weldNo, loc) });
    }
    setIsVisibleLocation(false);
  };
  const _onPressClearLocation = () => {
    _onPressChangeLocation('');
  };

  //-- NDTPercent filter
  const NDT_FILTER_100 = '100%';
  const NDT_FILTER_OTHERS = 'Others';
  const [isVisibleNDTFilter, setIsVisibleNDTFilter] = useState(false);
  const [NDTFilter, setNDTFilter] = useState('');
  const _onChangeNDTFilter = filter => {
    if (filter !== NDTFilter) {
      setNDTFilter(filter);
      callAPI(() => { getSpendListData(facilityCode, drawingNo, weldNo, location, filter) });
    }
    setIsVisibleNDTFilter(false);
  };
  const _onClearNDTFilter = () => {
    if (NDTFilter !== '') {
      setNDTFilter('');
      callAPI(() => { getSpendListData(facilityCode, drawingNo, weldNo, location, '') });
    }
    setIsVisibleNDTFilter(false);
  };

  //-- Update Data
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

  const _onPressChangeStatus = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    const inspectorKey = code === Constant.CODE_FITUP ? 'QCFittupInspector' : 'QCVisualInspector';
    onChangeData(value, index, key, inspectorKey);
  };

  const _onChangeCheckbox = (index, key, value) => {
    value = value ? 'x' : null;
    onChangeData(value, index, key);
  };

  const [isVisibleInspector, setIsVisibleInspector] = useState(false);
  const [inspectorList, setInspectorList] = useState([]);
  const _onPressShowInspector = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleInspector(true);
  };
  const _onChangeInspector = data => {
    onChangeData(data);
    setIsVisibleInspector(false);
  };
  const _onClearInspector = () => {
    onChangeData(null);
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
      await Helper.storeData('QC_INSPECTOR', data);
    }
    setIsVisibleGlobalInspector(false);
  };

  const [isVisibleRemark, setIsVisibleRemark] = useState(false);
  const [remarkDisplay, setRemarkDisplay] = useState('');
  const _onPressShowRemark = (value, index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    if (value) {
      setRemarkDisplay(value.toString());
    } else {
      setRemarkDisplay('');
    }
    setIsVisibleRemark(true);
  };
  const _onChangeRemark = () => {
    let value = remarkDisplay;
    if (!value) {
      value = null;
    }
    setRemarkDisplay(value);
    onChangeData(value);
    setIsVisibleRemark(false);
  };

  //-- Render List
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            <Text>WeldNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldNo)}</Text>
            <Text> - ConType: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.ConType)}</Text>
          </View>
          <View style={styles.cellImageAction}>
            <TouchableOpacity onPress={() => { _onPressManagePicture(item) }}>
              <Ionicons size={24} name={'md-image-outline'} color={iconColor} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>DrawingNo: </Text>
          </View>
          <View style={styles.cellThree}>
            {
              item.WebLink
                ?
                <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'View Drawing Spend List')}>
                  <Text style={CoreStyle.textLinkWithLine}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
                </TouchableOpacity>
                :
                <Text style={styles.textData}>{Formater.formatEmptyData(item.DrawingNo)}</Text>
            }
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Sheet:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Sheet)}</Text>
          </View>
          <View style={styles.cellOne}>
            <Text>Rev:</Text>
          </View>
          <View style={styles.cellOne}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.Rev)}</Text>
          </View>
        </View>
        {
          code == Constant.CODE_FITUP
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>HeatNo01:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat01)}</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text>HeatNo02:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat02)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Inspector:</Text>
                </View>
                <View style={styles.cellThreeAction}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCFittupInspector)}</Text>
                  <TouchableOpacity onPress={() => _onPressShowInspector(index, 'QCFittupInspector')}>
                    <Ionicons name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>FittingDate:</Text>
                </View>
                <View style={styles.cellTwo}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.FittingDate)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonAccept}
                    onPress={() => _onPressChangeStatus('ACC', index, 'FitUpResult')}>
                    <Text style={styles.labelAccept}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Location:</Text>
                </View>
                <View style={styles.cellTwo}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SiteLocation)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity onPress={() => _onPressShowRemark(item.QCFittupRemark, index, 'QCFittupRemark')}>
                    <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => _onPressChangeStatus('REJ', index, 'FitUpResult')}>
                    <Text style={styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>FitUpStatus:</Text>
                </View>
                <View style={styles.cellTwo}>
                  {
                    item.FitUpResult
                      ?
                      item.FitUpResult == 'ACC'
                        ?
                        <Text style={styles.textAccept}>{item.FitUpResult}</Text>
                        :
                        <Text style={styles.textReject}>{item.FitUpResult}</Text>
                      :
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.FitUpResult)}</Text>
                  }
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonClean}
                    onPress={() => _onPressChangeStatus(null, index, 'FitUpResult')}>
                    <Text style={styles.labelClean}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
            :
            <>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>WeldDate:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.WeldingDate)}</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text>Location:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SiteLocation)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Inspector:</Text>
                </View>
                <View style={styles.cellThreeAction}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualInspector)}</Text>
                  <TouchableOpacity onPress={() => _onPressShowInspector(index, 'QCVisualInspector')}>
                    <Ionicons name='md-list' size={20} color={BASE_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>WPSNo:</Text>
                </View>
                <View style={styles.cellTwo}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WPSNo)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonAccept}
                    onPress={() => _onPressChangeStatus('ACC', index, 'VisualResult')}>
                    <Text style={styles.labelAccept}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>WelderID:</Text>
                </View>
                <View style={styles.cellTwo}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity onPress={() => _onPressShowRemark(item.QCVisualRemark, index, 'QCVisualRemark')}>
                    <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => _onPressChangeStatus('REJ', index, 'VisualResult')}>
                    <Text style={styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>VisualStatus:</Text>
                </View>
                <View style={styles.cellTwo}>
                  {
                    item.VisualResult
                      ?
                      item.VisualResult == 'ACC'
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
                <View style={styles.cellOne}>
                  <Text>NDTPercent:</Text>
                </View>
                <View style={styles.cellTitleLine}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.NDTPercent)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>UT:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.UT && item.UT !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'UT', newValue)}
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
                <View style={styles.cellOne}>
                  <Text>RT:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.RT && item.RT !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'RT', newValue)}
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
                <View style={styles.cellOne}>
                  <Text>MT:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.MT && item.MT !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'MT', newValue)}
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
                <View style={styles.cellOne}>
                  <Text>PT:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.PT && item.PT !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'PT', newValue)}
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
                <View style={styles.cellOne}>
                  <Text>PMI:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.PMI && item.PMI !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'PMI', newValue)}
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
                <View style={styles.cellOne}>
                  <Text>PAUT:</Text>
                </View>
                <View style={styles.cellOne}>
                  <CheckBox
                    value={item.PAUT && item.PAUT !== null}
                    onValueChange={newValue => _onChangeCheckbox(index, 'PAUT', newValue)}
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
            </>
        }
      </View>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else {
        return <ListEmptyData />
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getSpendListData)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
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
                    <Text style={styles.infoTitleAction}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleFacility(true) }}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>DrawingNo:</Text>
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
                      {
                        weldNo == ''
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
                </View>)
                :
                null
            }
            {
              spendList && spendList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={spendList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => {
                    return data[index];
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.buttonAction} onPress={_onPressSubmitToServer}>
                <Text style={styles.buttonTitle}>Submit to Server</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onClearFacilityCode}
        onChangeItem={_onChangeFacilityCode} />
      <SelectPopup
        visible={isVisibleNDTFilter}
        data={[NDT_FILTER_100, NDT_FILTER_OTHERS]}
        onCancel={() => setIsVisibleNDTFilter(false)}
        onClear={_onClearNDTFilter}
        onChangeItem={_onChangeNDTFilter} />
      <SelectPopup
        visible={isVisibleInspector}
        data={inspectorList}
        onChangeItem={_onChangeInspector}
        onClear={_onClearInspector}
        onCancel={() => setIsVisibleInspector(false)} />
      <SelectPopup
        visible={isVisibleGlobalInspector}
        data={inspectorList}
        onChangeItem={_onChangeGlobalInspector}
        onCancel={() => setIsVisibleGlobalInspector(false)} />
      <TotalLocationModal
        visible={isVisibleLocation}
        data={locationList}
        onClose={() => setIsVisibleLocation(false)}
        onPressChangeLocation={_onPressChangeLocation}
        onPressClearLocation={_onPressClearLocation}
        site={true}
      />
      <Dialog.Container visible={isVisibleRemark}>
        <Dialog.Title>{'Enter remark:'}</Dialog.Title>
        <Dialog.Input
          value={remarkDisplay}
          onChangeText={(text) => setRemarkDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleRemark(false) }} />
        <Dialog.Button label='OK' onPress={_onChangeRemark} />
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
  infoData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    textAlign: 'center',
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
  selectInput: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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


  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    backgroundColor: OPP_COLOR,
  },
  noDataTitle: {
    paddingTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default QCSpendListScreen;