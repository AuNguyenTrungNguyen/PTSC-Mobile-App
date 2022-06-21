import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils//Networker';
import Constant from '../../../utils/Constant';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetQCStatusListAPI } from '../../../apis/piping/ConstructionAPI';

import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTwoColumns from '../../../components/SelectPopupTwoColumns';

const DrawingQCStatusScreen = ({ route, navigation }) => {

  const { projectCode, userLogin, code } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [dataList, setDataList] = useState([]);

  const [drawingNo, setDrawingNo] = useState('');
  const [weldNo, setWeldNo] = useState('');

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleFilterType(true) }}>
            <Ionicons
              size={24}
              name={'md-ellipsis-vertical-circle'} color={iconColor} />
          </TouchableOpacity>
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
      callAPI(getDataList);
    }, []
  );

  //-- Search Action
  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(getDataList);
  };
  const getDataList = async (facility = facilityCode, drawing = drawingNo, weld = weldNo, filter = filterType, locate = location) => {
    const token = await Helper.getData('TOKEN');
    facility = (!facility || facility === FACILITY_CODE_DEFAULT) ? '' : facility;

    GetQCStatusListAPI(projectCode, code, facility, drawing, weld, filter, locate, token)
      .then(res => {
        if (res.Success && res.Data) {
          setDataList(res.Data);
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
        jointNo: item.WeldNo,
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

  //-- FacilityCode
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const _onChangeFacilityCode = value => {
    if (value !== facilityCode) {
      setFacilityCode(value);
      callAPI(() => { getDataList(value) });
    }
    setIsVisibleFacility(false);
  };
  const _onClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { getDataList('') });
    }
    setIsVisibleFacility(false);
  };

  //-- FilterType
  const [isVisibleFilterType, setIsVisibleFilterType] = useState(false);
  const [filterType, setFilterType] = useState(Constant.STATUS_NOT_YET);
  const _onChangeFilterType = value => {
    if (value !== filterType) {
      setFilterType(value);
      callAPI(() => { getDataList(facilityCode, drawingNo, weldNo, value, location) });
    }
    setIsVisibleFilterType(false);
  };

  //-- Location
  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState('');
  const _onPressChangeLocation = data => {
    const value = data.Location ? data.Location : '';
    if (value != location) {
      setLocation(value);
      callAPI(() => { getDataList(facilityCode, drawingNo, weldNo, filterType, value) });
    }
    setIsVisibleLocation(false);
  };



  //-- Render List
  const renderItem = ({ index, item }) => {
    const isShowInspector = (code === Constant.CODE_FITUP && item.FitUpResult)
      || (code === Constant.CODE_WELD && item.VisualResult);

    const isShowAccDate = (code === Constant.CODE_FITUP && item.FitUpResult === Constant.STATUS_ACCEPT)
      || (code === Constant.CODE_WELD && item.VisualResult === Constant.STATUS_ACCEPT);

    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            <Text>WeldNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldNo)}</Text>
            <Text> - ConType: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.ConType)}</Text>
          </View>
          {/* <View style={styles.cellImageAction}>
            <TouchableOpacity onPress={() => { _onPressManagePicture(item) }}>
              <Ionicons size={24} name={'md-image-outline'} color={iconColor} />
            </TouchableOpacity>
          </View> */}
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
                  <Text>FittingDate:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.FittingDate)}</Text>
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
                  <Text>FittingTeam:</Text>
                </View>
                <View style={styles.cellThree}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FittingTeam)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Class01:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Class1)}</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text>Class02:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Class2)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Serial01:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SerialNo01)}</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text>Serial02:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.SerialNo02)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>Heat01:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat01)}</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text>Heat02:</Text>
                </View>
                <View style={styles.cellOne}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.Heat02)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>FitUpStatus:</Text>
                </View>
                <View style={styles.cellOne}>
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
                {
                  isShowAccDate
                    ?
                    <>
                      <View style={styles.cellOne}>
                        <Text>AcceptDate:</Text>
                      </View>
                      <View style={styles.cellOne}>
                        <Text style={styles.textAccept}>{Formater.formatDateData(item.QCFittupAccDate)}</Text>
                      </View>
                    </>
                    :
                    <View style={styles.cellTwo} />
                }
              </View>
              {
                isShowInspector
                  ?
                  <View style={styles.row}>
                    <View style={styles.cellOne}>
                      <Text>Inspector:</Text>
                    </View>
                    <View style={styles.cellThree}>
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.QCFittupInspector)}</Text>
                    </View>
                  </View>
                  :
                  null
              }
              {
                item.QCFittupRemark
                  ?
                  <View style={styles.row}>
                    <View style={styles.cellOne}>
                      <Text>Remark:</Text>
                    </View>
                    <View style={styles.cellThree}>
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.QCFittupRemark)}</Text>
                    </View>
                  </View>
                  :
                  null
              }
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
                  <Text>WelderTeam:</Text>
                </View>
                <View style={styles.cellThree}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderTeam)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>WPSNo:</Text>
                </View>
                <View style={styles.cellThree}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WPSNo)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>WelderID:</Text>
                </View>
                <View style={styles.cellThree}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOne}>
                  <Text>VisualStatus:</Text>
                </View>
                <View style={styles.cellOne}>
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
                {
                  isShowAccDate
                    ?
                    <>
                      <View style={styles.cellOne}>
                        <Text>AcceptDate:</Text>
                      </View>
                      <View style={styles.cellOne}>
                        <Text style={styles.textAccept}>{Formater.formatDateData(item.QCVisualAccDate)}</Text>
                      </View>
                    </>
                    :
                    <View style={styles.cellTwo} />
                }
              </View>
              {
                isShowInspector
                  ?
                  <View style={styles.row}>
                    <View style={styles.cellOne}>
                      <Text>Inspector:</Text>
                    </View>
                    <View style={styles.cellThree}>
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualInspector)}</Text>
                    </View>
                  </View>
                  :
                  null
              }
              {
                item.QCVisualRemark
                  ?
                  <View style={styles.row}>
                    <View style={styles.cellOne}>
                      <Text>Remark:</Text>
                    </View>
                    <View style={styles.cellThree}>
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualRemark)}</Text>
                    </View>
                  </View>
                  :
                  null
              }
              {/* <View style={styles.row}>
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
              </View> */}
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getDataList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text>Project: </Text>
                    <Text style={[styles.infoData]}>{projectCode}</Text>
                    <Text>User: </Text>
                    <Text style={[styles.infoData]}>{userLogin}</Text>
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
              dataList && dataList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={dataList}
                  getItemCount={data => data.length}
                  getItem={(data, index) => data[index]}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
                :
                <RenderList />
            }
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onClearFacilityCode}
        onChangeItem={_onChangeFacilityCode} />
      <SelectPopup
        visible={isVisibleFilterType}
        data={[Constant.STATUS_NOT_YET, Constant.STATUS_ACCEPT, Constant.STATUS_REJECT]}
        onCancel={() => setIsVisibleFilterType(false)}
        onChangeItem={_onChangeFilterType} />
      <SelectPopupTwoColumns
        visible={isVisibleLocation}
        data={locationList}
        leftHeader={'Location'}
        rightHeader={'Total'}
        leftKey={'Location'}
        rightKey={'Total'}
        onChangeItem={_onPressChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
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
  infoData: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    textAlign: 'center',
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
  // checkBox: {
  //   fontWeight: 'bold',
  //   color: BASE_COLOR,
  //   width: 24,
  //   height: 24,
  // },
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
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

export default DrawingQCStatusScreen;