import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Dialog from 'react-native-dialog';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';

import { GetQCDetailAPI, UpdateQCDetailAPI } from '../../../apis/piping/QCAPI';

import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';

const QCDrawingDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);
  // const [errorList, setErrorList] = useState([]);

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
  useEffect(
    () => {
      callAPI(getData);
    }, []
  );

  //-- Get Data
  const getData = async () => {
    const token = await Helper.getData('TOKEN');
    GetQCDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token)
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

  //-- Update Data
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

  const _onPressChangeStatus = (value, index, key) => {
    if (detailDrawingList[index][key] !== value) {
      setIndexUpdate(index);
      setKeyUpdate(key);
      onChangeData(value, index, key);
    }
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

  //-- Send Request
  const _onPressSubmitToServer = async () => {
    if (updateDrawingList.length) {
      callAPI(updateDrawingDetail);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };
  const updateDrawingDetail = async () => {
    const token = await Helper.getData('TOKEN');
    const listUpdate = Helper.handleListUpdate(updateDrawingList);
    const userLogin = await Helper.getData('USERNAME');
    setIsUploading(true);
    UpdateQCDetailAPI(projectCode, facilityCode, userLogin, code, listUpdate, token)
      .then(res => {
        if (res.Success) {
          Toast.show(res.Message.toString(), Toast.SHORT, ['RCTModalHostViewController']);
        } else {
          Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        }
        setUpdateDrawingList([]);
        setIsUploading(false);
      }).catch(() => {
        Toast.show('Please check that you are using the company network!', Toast.SHORT, ['RCTModalHostViewController']);
        setIsUploading(false);
      });
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
        role: Constant.IMAGE_ROLE_QC
      }
    );
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
    Helper.openDrawingPDF(navigation, link, 'PIP QC Drawing')
  };

  //-- Render Detail
  const RenderList = () => {
    {
      if (detailDrawingList == null) {
        return <ListLoadingData />
      } else if (!detailDrawingList.length) {
        return <ListEmptyData />
      }
    }
  };
  const renderItem = ({ index, item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            <Text>WeldNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldNo)}</Text>
            <Text> - WeldType: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldType)}</Text>
          </View>
        </View>
        {
          code == Constant.CODE_FITUP
            ?
            <>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>FittingDate:</Text>
                </View>
                <View style={styles.cellData}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.FittingDate)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonAccept}
                    onPress={() => _onPressChangeStatus(Constant.STATUS_ACCEPT, index, 'FitUpResult')}>
                    <Text style={styles.labelAccept}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>FitPercent:</Text>
                </View>
                <View style={styles.cellData}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.FitPercentage)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => _onPressChangeStatus(Constant.STATUS_REJECT, index, 'FitUpResult')}>
                    <Text style={styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>FitUpResult:</Text>
                </View>
                <View style={styles.cellData}>
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
                  <TouchableOpacity
                    style={styles.buttonClean}
                    onPress={() => _onPressChangeStatus(null, index, 'FitUpResult')}>
                    <Text style={styles.labelClean}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>Remark:</Text>
                </View>
                <View style={styles.cellNoAction}>
                  <TouchableOpacity
                    style={styles.containerAction}
                    onPress={() => _onPressShowRemark(item.QCFittupRemark, index, 'QCFittupRemark')}>
                    {
                      item.QCFittupRemark
                        ?
                        <>
                          <Text style={styles.textAction}>{Formater.formatEmptyData(item.QCFittupRemark)}</Text>
                          <FontAwesomeIcon style={styles.iconAction} name='pencil' size={20} color={BASE_COLOR} /></>
                        :
                        <Text style={styles.textEnter}>Enter remark ...</Text>
                    }
                  </TouchableOpacity>
                </View>
              </View>
            </>
            :
            (<>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>WelderIDs:</Text>
                </View>
                <View style={styles.cellNoAction}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WelderID)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>WeldingDate:</Text>
                </View>
                <View style={styles.cellData}>
                  <Text style={styles.textData}>{Formater.formatDateData(item.WeldingDate)}</Text>
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
                <View style={styles.cellTitle}>
                  <Text>WeldPercent:</Text>
                </View>
                <View style={styles.cellData}>
                  <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldPercentage)}</Text>
                </View>
                <View style={styles.cellAction}>
                  <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => _onPressChangeStatus(Constant.STATUS_REJECT, index, 'VisualResult')}>
                    <Text style={styles.labelReject}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.cellTitle}>
                  <Text>VisualStatus:</Text>
                </View>
                <View style={styles.cellData}>
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
                <View style={styles.cellTitle}>
                  <Text>Remark:</Text>
                </View>
                <View style={styles.cellNoAction}>
                  <TouchableOpacity onPress={() => _onPressShowRemark(item.QCVisualRemark, index, 'QCVisualRemark')}>
                    {
                      item.QCVisualRemark
                        ?
                        <Text style={styles.textData}>{Formater.formatEmptyData(item.QCVisualRemark)}</Text>
                        :
                        <Text style={styles.textEnter}>Enter remark ...</Text>
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getData)} />
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
              <RenderList />
          }
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManagePicture}>
              <Text style={styles.buttonTitle}>Chèn ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Gửi Request</Text>
            </TouchableOpacity>
          </View>
          <AwesomeAlert
            show={isUploading}
            showProgress={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
          />
          <Dialog.Container visible={isVisibleRemark}>
            <Dialog.Title>{'Enter remark:'}</Dialog.Title>
            <Dialog.Input
              value={remarkDisplay}
              onChangeText={(text) => setRemarkDisplay(text)}
              underlineColorAndroid={BASE_COLOR}
            />
            <Dialog.Button label='Cancle' onPress={() => { setIsVisibleRemark(false) }} />
            <Dialog.Button label='OK' onPress={_onChangeRemark} />
          </Dialog.Container>
        </View>
      }
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
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textEnter: {
    fontStyle: 'italic',
    color: BASE_COLOR,
  },
  cellTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  cellData: {
    flex: 1,
    justifyContent: 'center',
  },
  cellAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellNoAction: {
    flex: 2,
    justifyContent: 'center',
  },
  containerAction: {
    flexDirection: 'row',
  },
  textAction: {
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
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

export default QCDrawingDetailScreen;