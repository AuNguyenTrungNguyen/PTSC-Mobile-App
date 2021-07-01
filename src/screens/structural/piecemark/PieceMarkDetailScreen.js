import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Keyboard, Appearance } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import AwesomeAlert from 'react-native-awesome-alerts';

import { GetPieceMarkDetailAPI, UpdatePieceMarkDetailAPI } from '../../../apis/structural/PieceMarkAPI';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import SelectPopup from '../../../components/SelectPopup';

const PieceMarkDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, sheet, rev, code, userLogin, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pieceMarkDetailList, setPieceMarkDetailList] = useState(null);
  const [pieceMarkUpdateList, setPieceMarkUpdateList] = useState([]);

  const [filterPieceMarkNoOld, setFilterPieceMarkNoOld] = useState(null);
  const [filterPieceMarkNo, setFilterPieceMarkNo] = useState('');
  const [filterType, setFilterType] = useState(Constant.PIECE_MARK_ALL);
  const [isVisibleFilterType, setIsVisibleFilterType] = useState(false);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });

  useEffect(
    () => {
      callAPI(getPieceMarkDetail);
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

  const callAPI = (executedAPI, loading = true) => {
    if (!loading === null) {
      if (loading) {
        setIsLoading(true);
      } else {
        setIsSearching(true);
      }
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

  const getPieceMarkDetail = async (no = filterPieceMarkNo, type = filterType, reset = false) => {
    let token = await Helper.getData('TOKEN');
    GetPieceMarkDetailAPI(projectCode, facilityCode, drawingNo, sheet, rev, code, no, type, token)
      .then(res => {
        if (res.success) {
          setPieceMarkDetailList(res.data);
          if(reset) {
            setPieceMarkUpdateList([]);
          }
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

  const searchPieceMarkDetail = (no, type, isSearch, isReset = false) => {
    callAPI(() => { getPieceMarkDetail(no, type, isReset) }, isSearch);
  };

  const updatePieceMarkDetail = async () => {
    setIsUploading(true);
    let token = await Helper.getData('TOKEN');
    let listUpdate = Helper.handleListUpdate(pieceMarkUpdateList);
    UpdatePieceMarkDetailAPI(listUpdate, token)
      .then(res => {
        if (res.success) {
          setPieceMarkUpdateList([]);
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
    if (pieceMarkUpdateList.length) {
      callAPI(updatePieceMarkDetail, null);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onPressManagePicture = () => {
    // navigation.navigate(
    //   'DrawingImage',
    //   {
    //     projectCode: projectCode,
    //     facilityCode: facilityCode,
    //     drawingNo: drawingNo,
    //     code: code,
    //     userLogin: userLogin
    //   }
    // );
  };

  const _onChangeCheckbox = (index, rowIndex, data) => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = code == Constant.CODE_CUT ? 'ActualFabCutDate' : 'SecondCoat';
    let array = [...pieceMarkDetailList];
    array[index][keyUpate] = data;
    setPieceMarkDetailList(array);

    array = [...pieceMarkUpdateList];
    let objIndex = array.findIndex(obj => obj.RowIndex == rowIndex);
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyUpate]: data });
    } else {
      array[objIndex][keyUpate] = pieceMarkDetailList[index][keyUpate];
    }
    setPieceMarkUpdateList(array);
  };

  const _onChangeFilterPieceMarkNo = no => {
    setFilterPieceMarkNo(no);
  };

  const _onResetFilterPieceMarkNo = () => {
    setFilterPieceMarkNo('');
    setFilterPieceMarkNoOld(null);
    searchPieceMarkDetail('', filterType, false);
  };

  const _onChangeFilterType = type => {
    if (type !== filterType) {
      setFilterType(type);
      searchPieceMarkDetail(filterPieceMarkNo, type, false);
    }
    setIsVisibleFilterType(false);
  };

  const _onPressSearchPieceMarkNo = () => {
    if (filterPieceMarkNoOld !== filterPieceMarkNo) {
      setFilterPieceMarkNoOld(filterPieceMarkNo);
      searchPieceMarkDetail(filterPieceMarkNo, filterType, false);
    }
  };

  const _onPressResetList = () => {
    searchPieceMarkDetail(filterPieceMarkNo, filterType, false, true);
  };

  const _onPressCheckAllList = () => {
    const keyUpate = code == Constant.CODE_CUT ? 'ActualFabCutDate' : 'SecondCoat';
    let resultUpdate = [];
    let resultItem = pieceMarkDetailList.map(item => {
      if (!item[keyUpate]){
        item[keyUpate] = new Date();
        resultUpdate.push({ RowIndex: item.RowIndex, [keyUpate]: new Date() });
      }
      return item;
    });
    setPieceMarkDetailList(resultItem);
    setPieceMarkUpdateList(resultUpdate);
  };

  const RenderPieceMarkDetail = () => {
    {
      if (pieceMarkDetailList == null || isSearching) {
        return <ListLoadingData />
      } else if (!pieceMarkDetailList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={pieceMarkDetailList}
          getItemCount={data => data.length}
          getItem={(data, index) => {
            return data[index];
          }}
          keyExtractor={(item, index) => index}
          renderItem={renderItem}
        />
      }
    }
  };

  const renderItem = ({ index, item }) => {
    const value = code == Constant.CODE_CUT ? item.ActualFabCutDate : item.SecondCoat;
    const isChecked = !!value;
    return (
      <View style={styles.box} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>PieceMarkNo:</Text>
          </View>
          <View style={styles.cellData}>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.PieceMarkNo)}</Text>
          </View>
          <View style={styles.cellCheckbox}>
            <CheckBox
              value={isChecked}
              onValueChange={newValue => _onChangeCheckbox(index, item.RowIndex, newValue)}
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
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getPieceMarkDetail)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <Header data={headerData} action={headerAction}></Header>
          }
          <View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>PieceMarkNo:</Text>
              <View style={styles.headerActionContainer}>
                <TextInput
                  style={styles.headerActionInputText}
                  value={filterPieceMarkNo}
                  onChangeText={_onChangeFilterPieceMarkNo}
                  underlineColorAndroid='transparent'
                />
                {
                  filterPieceMarkNo
                    ? <Icon name='times-circle' onPress={_onResetFilterPieceMarkNo} style={styles.headerActionInputIcon} />
                    : null
                }
              </View>
            </View>
            <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>Type:</Text>
              <TouchableOpacity
                style={styles.headerActionContainer}
                onPress={() => { setIsVisibleFilterType(true) }}>
                <Text style={styles.buttonTitleDark}>{filterType}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerActionRow}>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={_onPressSearchPieceMarkNo}>
                <Text style={styles.buttonTitle}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={_onPressResetList}>
                <Text style={styles.buttonTitle}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={_onPressCheckAllList}>
                <Text style={styles.buttonTitle}>Check All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <RenderPieceMarkDetail />
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={_onPressManagePicture}>
              <Text style={styles.buttonTitle}>Manage Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
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
      <SelectPopup
        visible={isVisibleFilterType}
        data={[Constant.PIECE_MARK_ALL, Constant.PIECE_MARK_CHECKED, Constant.PIECE_MARK_UNCHECKED]}
        onCancel={() => setIsVisibleFilterType(false)}
        onChangeItem={_onChangeFilterType}>
      </SelectPopup>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
    marginBottom: 4,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  headerCellTitle: {
    flex: 3,
  },
  headerCellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  headerActionContainer: {
    flexDirection: 'row',
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionInputText: {
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  headerActionInputIcon: {
    marginLeft: 4,
    fontSize: 20,
    color: BASE_COLOR,
  },
  headerActionButton: {
    flex: 1,
    height: '100%',
    padding: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
  },

  table: {
    flexGrow: 1,
  },
  box: {
    flexDirection: 'column',
    width: '100%',
    borderColor: BASE_COLOR,
    borderBottomWidth: 1,
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
    minHeight: 24,
  },
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
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
    flex: 2,
    justifyContent: 'center',
  },
  cellCheckbox: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
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

export default PieceMarkDetailScreen;