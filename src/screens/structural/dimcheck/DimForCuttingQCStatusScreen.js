import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

import { GetDimForCuttingListAPI } from '../../../apis/structural/DimCheckAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import CoreStyle from '../../../utils/CoreStyle';
import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const DimForCuttingQCStatusScreen = ({ route, navigation }) => {

  const { projectCode, subContractor, userLogin } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [drawingNo, setDrawingNo] = useState('');
  const [oldDrawingNo, setOldDrawingNo] = useState(null);
  const [pieceMarkNo, setPieceMarkNo] = useState('');
  const [oldPieceMarkNo, setOldPieceMarkNo] = useState(null);

  const [isVisibleType, setIsVisibleType] = useState(false);
  const [type, setType] = useState(Constant.STATUS_NOT_YET);

  const [dimForCuttingQCStatusList, setDimForCuttingQCStatusList] = useState(null);

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
            onPress={toggle}>
            <Ionicons
              size={24}
              name={isShowDescription.name} color={iconColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isShowDescription]);

  useEffect(
    () => {
      callAPI(() => { searchDimForCuttingQCStatusList(drawingNo, pieceMarkNo, type) }, false);
    }, []
  );

  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };

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

  const _onChangeDrawingNo = no => {
    setDrawingNo(no);
  };

  const _onChangePieceMarkNo = no => {
    setPieceMarkNo(no);
  };

  const _onChangeType = status => {
    if (status != type) {
      setType(status);
      callAPI(() => { searchDimForCuttingQCStatusList(drawingNo, pieceMarkNo, status) }, false);
    }
    setIsVisibleType(false);
  };

  const _onPressSearchDimForCuttingQCStatusList = () => {
    let isSearch = false;
    if (drawingNo !== oldDrawingNo) {
      setOldDrawingNo(drawingNo);
      isSearch = true;
    }
    if (pieceMarkNo !== oldPieceMarkNo) {
      setOldPieceMarkNo(pieceMarkNo);
      isSearch = true;
    }
    if (isSearch) {
      callAPI(() => { searchDimForCuttingQCStatusList(drawingNo, pieceMarkNo, type) }, false);
    }
  };

  const searchDimForCuttingQCStatusList = async (drawingNo, pieceMarkNo, type) => {
    Keyboard.dismiss();
    drawingNo = drawingNo != null ? drawingNo : '';
    pieceMarkNo = pieceMarkNo != null ? pieceMarkNo : '';
    GetDimForCuttingListAPI(projectCode, drawingNo, pieceMarkNo, type, false)
      .then(res => {
        if (res.success) {
          setDimForCuttingQCStatusList(res.data);
          setIsLoading(false);
          setIsError(false);
          setIsSearching(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsSearching(false);
        }
      }).catch(() => {
        setIsLoading(false);
        setIsError(true);
        setIsSearching(false);
      });
  };

  const _onPressManagePicture = async (item) => {
    const dataCode = await Helper.getData('DATACODE');
    navigation.navigate(
      'DimForCuttingImage',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        dataCode: dataCode,
        rowIndex: item.RowIndex,
        drawingNo: item.CuttingPlanDrawingNo,
        pieceMarkNo: item.PieceMarkNo,
        imageCode: 'DimForCutting'
      }
    );
  };



  const getStatusRenderList = () => {
    return !isSearching && dimForCuttingQCStatusList && dimForCuttingQCStatusList.length;
  };

  const RenderList = () => {
    if (isSearching) {
      return <ListLoadingData />
    } else if (dimForCuttingQCStatusList == null) {
      return <ListSelectData title={'Enter DrawingNo or PieceMarkNo'} />
    } else if (!dimForCuttingQCStatusList.length) {
      return <ListEmptyData />
    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => { _onPressManagePicture(item) }}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>DrawingNo:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Open Lam Check Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.CuttingPlanDrawingNo}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.CuttingPlanDrawingNo}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>PieceMarkNo:</Text>
          <Text style={styles.cellData}>{item.PieceMarkNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>RequestDate:</Text>
          <Text style={styles.cellData}>{Formater.formatDateData(item.DIM_ForCuttingRequestDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>RequestBy:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_ForCuttingRequestByTeam)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>QCDate:</Text>
          <Text style={styles.cellData}>{Formater.formatDateData(item.DIM_ForCuttingDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>QCBy:</Text>
          <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_ForCuttingInspectName)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>Result:</Text>
          {
            item.DIM_ForCuttingResult
              ?
              item.DIM_ForCuttingResult == 'ACC'
                ?
                <Text style={[styles.cellData, styles.labelAccept]}>{item.DIM_ForCuttingResult}</Text>
                :
                <Text style={[styles.cellData, styles.labelReject]}>{item.DIM_ForCuttingResult}</Text>
              :
              <Text style={styles.cellData}>{Formater.formatEmptyData(item.DIM_ForCuttingResult)}</Text>
          }
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => { callAPI(() => { searchDimForCuttingQCStatusList(drawingNo, pieceMarkNo, type) }, true) }} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show
              ?
              <View style={styles.headerContainer}>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>ProjectCode:</Text>
                  <Text style={styles.infoData}>{projectCode}  -  {subContractor}</Text>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>DrawingNo:</Text>
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
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle}>PieceMarkNo:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inputText}
                      value={pieceMarkNo}
                      onChangeText={_onChangePieceMarkNo}
                      underlineColorAndroid='transparent'
                    />
                    {
                      pieceMarkNo == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangePieceMarkNo('')} style={styles.inputIcon} />
                    }
                  </View>
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.infoTitle} />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={_onPressSearchDimForCuttingQCStatusList}
                    disabled={isSearching}>
                    <Text style={styles.buttonTitle}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              null
          }
          {
            getStatusRenderList()
              ?
              <>
                <Text style={CoreStyle.textNote}>* Click an item to view image</Text>
                <VirtualizedList
                  style={styles.table}
                  data={dimForCuttingQCStatusList}
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
          <SelectPopup
            visible={isVisibleType}
            data={[Constant.STATUS_NOT_YET, Constant.STATUS_ACCEPT, Constant.STATUS_REJECT]}
            onCancel={() => setIsVisibleType(false)}
            onChangeItem={_onChangeType}>
          </SelectPopup>
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
    height: 36,
    marginBottom: 4,
  },
  infoTitle: {
    flex: 3,
  },
  infoData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
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
    padding: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    marginBottom: 4,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  cellAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonImage: {
    width: 70,
    borderColor: 'darkblue',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelImage: {
    color: 'darkblue',
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

export default DimForCuttingQCStatusScreen;