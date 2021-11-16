import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import Dialog from 'react-native-dialog';

import Helper from '../../../utils/Helper';
import Constant from '../../../utils/Constant';
import Formater from '../../../utils/Formater';
import CoreStyle from '../../../utils/CoreStyle';
import { GetConstructionQCStatusListAPI } from '../../../apis/structural/ConstructionAPI';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import TotalLocationModal from '../../../components/drawing/TotalLocationModal';
import SelectPopup from '../../../components/SelectPopup';

const ConstructionQCStatusScreen = ({ route, navigation }) => {

  const { projectCode, code, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [weldNo, setWeldNo] = useState('');
  const [location, setLocation] = useState('');

  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.STATUS_NOT_YET);

  const [isVisibleTotal, setIsVisibleTotal] = useState(false);
  const [totalList, setTotalList] = useState([]);

  const [QCStatusList, setQCStatusList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleType(true) }}>
            <Ionicons
              size={24}
              name={'md-ellipsis-vertical-circle'} color={iconColor} />
          </TouchableOpacity>
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
    () => {
      callAPI(() => { getQCStatusList(drawingNo, weldNo, weldNo, type) }, false);
    }, []
  );

  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
    }
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

  const getQCStatusList = async (drawing = drawingNo, weld = weldNo, locate = location, filterType = type) => {
    let token = await Helper.getData('TOKEN');
    GetConstructionQCStatusListAPI(projectCode, drawing, weld, locate, filterType, code, token)
      .then(res => {
        console.log(res);
        if (res.success) {
          console.log(res);
          setQCStatusList(res.data);
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

  const _onChangeWeldNo = no => {
    setWeldNo(no);
    if (!no) {
      callAPI(() => { getQCStatusList(drawingNo, no, weldNo, type) }, false);
    }
  };

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
    if (!no) {
      callAPI(() => { getQCStatusList(no, weldNo, weldNo, type) }, false);
    }
  };

  const _onPressSearchDrawing = () => {
    Keyboard.dismiss();
    callAPI(() => { getQCStatusList(drawingNo, weldNo, weldNo, type) }, false);
  };

  const _onPressManagePicture = item => {

    navigation.navigate(
      Constant.ROUTE__STR_QCDEPT,
      {
        screen: 'QCImage',
        params: {
          rowIndex: item.RowIndex,
          projectCode: projectCode,
          drawingNo: item.WeldMapDrawingNo,
          sheet: item.WMSheet,
          jointNo: item.JointNo,
          code: code,
          userLogin: userLogin
        }
      });
  };



  // LOCATION
  const _onPressChangeLocation = loc => {
    if (loc != location) {
      setLocation(loc);
      callAPI(() => { getQCStatusList(drawingNo, weldNo, loc, type) }, false);

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
      callAPI(() => { getQCStatusList(drawingNo, weldNo, weldNo, data) }, false);
    }
    setIsVisibleType(false);
  };


  // REMARK
  const [remarkDisplay, setRemarkDisplay] = useState('');
  const [isShowDialogRemark, setIsShowDialogRemark] = useState(false);
  const _onPressShowDialogRemark = (value) => {
    if (value) {
      value = value ? value : null;
      setRemarkDisplay(value);
    } else {
      setRemarkDisplay('');
    }
    setIsShowDialogRemark(true);
  };





  const renderItem = ({ index, item }) => {
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
            <TouchableOpacity onPress={() => { _onPressManagePicture(item) }}>
              <Ionicons size={24} name={'md-image-outline'} color={iconColor} />
            </TouchableOpacity>
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
                  <Text>FittingDate:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.FitUpDate)}</Text>
                </View>
                <View style={styles.cellAction}>
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
                  <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCFittupRemark)}>
                    <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellOneUnit}>
                  <Text>Status:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
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
                <View style={styles.cellAction}>
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
                  <Text style={styles.textData}>{Formater.formatTwoDigits(item.UTLAMPercent)}</Text>
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
                  <Text>WeldDate:</Text>
                </View>
                <View style={styles.cellTwoUnit}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.ActualFabWeldDate)}</Text>
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
                  <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCVisualRemark)}>
                    <Ionicons size={24} name={'md-document-text-outline'} color={BASE_COLOR} style={{ marginRight: 4 }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row} pointerEvents='none'>
                <View style={styles.cellOneUnit}>
                  <Text>MT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.MT}
                    style={styles.checkBox}
                    boxType='square'
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
                    style={styles.checkBox}
                    boxType='square'
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
                    style={styles.checkBox}
                    boxType='square'
                    onCheckColor={OPP_COLOR}
                    onFillColor={BASE_COLOR}
                    onTintColor={BASE_COLOR}
                    tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
                    animationDuration={0.2}
                    onAnimationType='flat'
                  />
                </View>
              </View>
              <View style={styles.row} pointerEvents='none'>
                <View style={styles.cellOneUnit}>
                  <Text>UT:</Text>
                </View>
                <View style={styles.cellOneUnit}>
                  <CheckBox
                    value={!!item.UT}
                    style={styles.checkBox}
                    boxType='square'
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
                    style={styles.checkBox}
                    boxType='square'
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
        <LoadingRefresh isLoading={isLoading} isError={isError}
          _onPressRefresh={() => { callAPI(() => { getQCStatusList(drawingNo, weldNo, location, type) }, true) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              (<View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text>Project: </Text>
                  <Text style={styles.infoData}>{projectCode.toUpperCase()}</Text>
                  <Text> User: </Text>
                  <Text style={styles.infoData}>{userLogin}</Text>
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
                    <Text style={styles.buttonTitle}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>)
              :
              null
          }
          {isSearching
            ?
            <ListLoadingData />
            :
            QCStatusList.length
              ?
              <VirtualizedList
                style={styles.table}
                data={QCStatusList}
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
        data={[Constant.STATUS_NOT_YET, Constant.STATUS_ACCEPT, Constant.STATUS_REJECT]}
        onCancel={() => setIsVisibleType(false)}
        onChangeItem={_onChangeType}>
      </SelectPopup>
      <Dialog.Container visible={isShowDialogRemark}>
        <Dialog.Title>{'Remark:'}</Dialog.Title>
        <Dialog.Input
          disabled={true}
          editable={false}
          selectTextOnFocus={false}
          multiline={true}
          numberOfLines={7}
          value={remarkDisplay}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancle' onPress={() => { setIsShowDialogRemark(false) }} />
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
    flex: 2,
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

export default ConstructionQCStatusScreen;