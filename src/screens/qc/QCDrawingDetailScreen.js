import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, ActivityIndicator, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Dialog from 'react-native-dialog';

import Helper from '../../utils/Helper';
import Formater from '../../utils/Formater';
import CoreStyle from '../../utils/CoreStyle';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';
import { GetQCDrawingDetailAPI, UpdateQCDrawingDetailAPI, GetQCInspectorListAPI } from '../../apis/qc/QCDrawingAPI';
import PickupDataModal from '../../components/drawing/PickupDataModal';

const QCDrawingDetailScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detailDrawingList, setDetailDrawingList] = useState(null);
  const [updateDrawingList, setUpdateDrawingList] = useState([]);

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, teamLeader, link } = route.params;

  const [errorList, setErrorList] = useState([]);
  // INSPECTOR
  const [isVisibleInspector, setIsVisibleInspector] = useState(false);
  const [inspectorList, setInspectorList] = useState([]);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  useEffect(
    () => {
      callAPI(getDataDetail);
    }, []
  );

  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
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
        GetQCDrawingDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, token),
        GetQCInspectorListAPI(projectCode, teamLeader, token)
      ])
        .then(([drawingResult, inspectorResult]) => {
          if (drawingResult.success && inspectorResult.success) {
            setDetailDrawingList(drawingResult.data);
            setInspectorList(inspectorResult.data);
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

  const updateDrawingDetail = async () => {
    updateDrawingList.map((item) => {
      let keys = Object.keys(item);
      let column = keys.filter(k => (k !== 'RowIndex' && k !== 'WeldNo'));
      item['ColumnChange'] = column;
      return item;
    });

    let doneListData = [];
    if (code == 'FitUp') {
      doneListData = detailDrawingList.filter(i => i.QCFittupInspector);
    } else {
      doneListData = detailDrawingList.filter(i => i.QCVisualInspector);
    }
    const doneIds = doneListData.map(i => i.RowIndex);
    const errorListData = updateDrawingList.filter(i => doneIds.indexOf(i.RowIndex) === -1);

    if (errorListData.length) {
      const errorIds = errorListData.map(i => i.RowIndex);
      setErrorList(errorIds);
    } else {
      setErrorList([]);
      setIsUploading(true);
      let token = await Helper.getData('TOKEN');
      UpdateQCDrawingDetailAPI(projectCode, facilityCode, drawingNo, code, updateDrawingList, token)
        .then(res => {
          if (res.success) {
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
    }
  };

  const _onPressSubmitToServer = async () => {
    if (updateDrawingList.length) {
      callAPI(updateDrawingDetail);
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
        code: code == 'Visual' ? 'Weld' : code,
        teamLeader: teamLeader
      }
    );
  };

  const _onPressChangeStatus = (value, index, key) => {
    let array = [...detailDrawingList];
    array[index][key] = value;
    setDetailDrawingList(array);

    array = [...updateDrawingList];
    let rowIndex = detailDrawingList[index].RowIndex;
    let weldNo = detailDrawingList[index].WeldNo;
    let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, WeldNo: weldNo, [key]: value });
    } else {
      array[objIndex][key] = detailDrawingList[index][key];
    }
    setUpdateDrawingList(array);
  };

  const _onPressShowInspectorPopup = (index, key) => {
    setIndexUpdate(index);
    setKeyUpdate(key);
    setIsVisibleInspector(true);
  };

  const _onChangeSpectorPopup = data => {
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
    setIsVisibleInspector(false);
  };

  // REMARK
  const [remarkDisplay, setRemarkDisplay] = useState('');
  const [isShowDialogRemark, setIsShowDialogRemark] = useState(false);
  const [indexUpdate, setIndexUpdate] = useState(-1);
  const [keyUpdate, setKeyUpdate] = useState('');

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
    setRemarkDisplay(value);
    setIsShowDialogRemark(false);
    if (detailDrawingList[indexUpdate][keyUpdate] != value) {
      let array = [...detailDrawingList];
      array[indexUpdate][keyUpdate] = value;
      setDetailDrawingList(array);

      array = [...updateDrawingList];
      let rowIndex = detailDrawingList[indexUpdate].RowIndex;
      let weldNo = detailDrawingList[indexUpdate].WeldNo;
      let objIndex = array.findIndex((obj => obj.RowIndex == rowIndex));
      if (objIndex < 0) {
        array.push({ RowIndex: rowIndex, WeldNo: weldNo, [keyUpdate]: value });
      } else {
        array[objIndex][keyUpdate] = detailDrawingList[indexUpdate][keyUpdate];
      }
      setUpdateDrawingList(array);
    }
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
    const isUserError = errorList.indexOf(item.RowIndex) > -1;
    return (
      <View style={isUserError ? styles.boxError : styles.box}>
        <View style={styles.row}>
          <View style={styles.cellTitleLine}>
            <Text>WeldNo: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldNo)}</Text>
            <Text> - WeldType: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.WeldType)}</Text>
          </View>
        </View>
        {code == 'FitUp'
          ?
          (<>
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
                  onPress={() => _onPressChangeStatus('ACC', index, 'FitUpResult')}>
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
                  onPress={() => _onPressChangeStatus('REJ', index, 'FitUpResult')}>
                  <Text style={styles.labelReject}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>FitUpStatus:</Text>
              </View>
              <View style={styles.cellData}>
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
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Inspector:</Text>
              </View>
              <View style={styles.cellNoAction}>
                <TouchableOpacity
                  style={styles.itemIconAction}
                  onPress={() => _onPressShowInspectorPopup(index, 'QCFittupInspector')}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(item.QCFittupInspector)}</Text>
                  <Ionicons style={styles.iconAction} name='md-people-outline' size={20} color={BASE_COLOR} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Remark:</Text>
              </View>
              <View style={styles.cellNoAction}>
                <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCFittupRemark, index, 'QCFittupRemark')}>
                  {
                    item.QCFittupRemark
                      ?
                      <Text style={styles.textData}>{Formater.formatEmptyData(item.QCFittupRemark)}</Text>
                      :
                      <Text style={styles.textEnter}>Enter remark ...</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </>)
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
                  onPress={() => _onPressChangeStatus('ACC', index, 'VisualResult')}>
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
                  onPress={() => _onPressChangeStatus('REJ', index, 'VisualResult')}>
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
              <View style={styles.cellTitle}>
                <Text>Inspector:</Text>
              </View>
              <View style={styles.cellNoAction}>
                <TouchableOpacity
                  style={styles.itemIconAction}
                  onPress={() => _onPressShowInspectorPopup(index, 'QCVisualInspector')}>
                  <Text style={styles.textAction}>{Formater.formatEmptyData(item.QCVisualInspector)}</Text>
                  <Ionicons style={styles.iconAction} name='md-people-outline' size={20} color={BASE_COLOR} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cellTitle}>
                <Text>Remark:</Text>
              </View>
              <View style={styles.cellNoAction}>
                <TouchableOpacity onPress={() => _onPressShowDialogRemark(item.QCVisualRemark, index, 'QCVisualRemark')}>
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
                        <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, link, 'Open QC Detail Drawing')}>
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
                  <Text style={styles.infoTitle}>LoginUser:</Text>
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
          <AwesomeAlert
            show={isUploading}
            showProgress={true}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
          />
          <Dialog.Container visible={isShowDialogRemark}>
            <Dialog.Title>{'Enter remark:'}</Dialog.Title>
            <Dialog.Input
              value={remarkDisplay}
              onChangeText={(text) => setRemarkDisplay(text)}
              underlineColorAndroid={BASE_COLOR}
            />
            <Dialog.Button label='Cancle' onPress={() => { setIsShowDialogRemark(false) }} />
            <Dialog.Button label='OK' onPress={_onPressSubmitRemark} />
          </Dialog.Container>
          <PickupDataModal
            visible={isVisibleInspector}
            onCancel={() => setIsVisibleInspector(false)}
            loaded={true}>
            {
              inspectorList.length
                ?
                inspectorList.map((item) => {
                  return (
                    <TouchableOpacity style={modals.row} onPress={() => _onChangeSpectorPopup(item)}>
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
        </View>
      }
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
  itemIconAction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconAction: {
    marginLeft: 4,
    width: 20,
    height: 20,
  },
  textAction: {
    minWidth: 80,
    fontWeight: 'bold',
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

export default QCDrawingDetailScreen;