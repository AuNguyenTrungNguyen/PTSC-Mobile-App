import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Appearance } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  GetDIMAfterWeldDetailAPI,
  UpdateDIMAfterWeldDetailAPI
} from '../../../apis/structural/DimCheckAPI';
import { GetTeamListFilterSubContractorAPI } from '../../../apis/app/AppAPI';

import Networker from '../../../utils/Networker';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Constant from '../../../utils/Constant';
import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import SelectPopup from '../../../components/SelectPopup';

const DIMAfterWeldDetailScreen = ({ route, navigation }) => {

  const { projectCode, facilityCode, drawingNo, assemblyCode, userLogin, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [currentList, setCurrentList] = useState(null);
  const [pieceMarkDetailList, setPieceMarkDetailList] = useState(null);
  const [pieceMarkUpdateList, setPieceMarkUpdateList] = useState([]);

  const [filterPieceMarkNo, setFilterPieceMarkNo] = useState('');
  const [filterType, setFilterType] = useState(Constant.PIECE_MARK_ALL);
  const [isVisibleFilterType, setIsVisibleFilterType] = useState(false);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  const toggle = () => {
    setIsShowDescription(prevState => {
      return {
        show: !prevState.show,
        name: prevState.name === 'arrow-up-circle-outline' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'
      }
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
          onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isShowDescription]);

  const callAPI = (executedAPI, isSearch = true) => {
    setIsSearching(isSearch);
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };

  useEffect(
    () => {
      getAllData();
    }, []
  );

  const getAllData = async () => {
    callAPI(() => { getTeamList() });
    callAPI(() => { getPieceMarkDetail() });
  };

  const getTeamList = async () => {
    const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
    GetTeamListFilterSubContractorAPI(projectCode, disciplineCode, Constant.CODE_VISUAL)
      .then(res => {
        if (res.Success) {
          setTeamList(res.Data);
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
  const getPieceMarkDetail = async (no = filterPieceMarkNo, type = filterType, reset = false) => {
    GetDIMAfterWeldDetailAPI(projectCode, facilityCode, drawingNo, assemblyCode)
      .then(res => {
        if (res.Success) {
          setCurrentList(res.Data);
          setPieceMarkDetailList(res.Data);
          if (reset) {
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

  const searchPieceMarkDetail = (no, type, isReset = false) => {
    callAPI(() => { getPieceMarkDetail(no, type, isReset) });
  };

  const updatePieceMarkDetail = async () => {
    setIsUploading(true);
    const listUpdate = Helper.handleListUpdate(pieceMarkUpdateList);
    UpdateDIMAfterWeldDetailAPI(team, listUpdate)
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
      callAPI(updatePieceMarkDetail, false);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  const _onChangeFilterPieceMarkNo = no => {
    setFilterPieceMarkNo(no);
  };
  const _onClearFilterPieceMarkNo = () => {
    setFilterPieceMarkNo('');
    setPieceMarkDetailList(currentList);
  };
  // const _onChangeFilterType = type => {
  //   if (type !== filterType) {
  //     setFilterType(type);
  //     searchPieceMarkDetail(filterPieceMarkNo, type, false);
  //   }
  //   setIsVisibleFilterType(false);
  // };
  const _onPressSearchPieceMarkNo = () => {
    if (currentList && currentList.length > 0) {
      const filterd = currentList.filter(item => item && item.PieceMarkNo.includes(filterPieceMarkNo));
      setPieceMarkDetailList(filterd);
    }
  };
  const _onPressResetList = () => {
    searchPieceMarkDetail(filterPieceMarkNo, filterType, true);
  };


  const [isVisibleTeam, setIsVisibleTeam] = useState(false);
  const [team, setTeam] = useState(null);
  const [teamList, setTeamList] = useState([]);
  const _onPressClearTeam = () => {
    setTeam(null);
    setIsVisibleTeam(false);
  };
  const _onChangeTeam = data => {
    setTeam(data);
    setIsVisibleTeam(false);
  };


  //-- ACTION LIST
  const _onChangeCheckbox = (index, rowIndex, data) => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = 'DIM_AfterWeldRequestDate';
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

    array = [...currentList];
    objIndex = array.findIndex(obj => obj.RowIndex === rowIndex);
    if (objIndex >= 0) {
      array[objIndex][keyUpate] = data;
    }
    setCurrentList(array);
  };

  const _onPressCheckAllList = () => {
    const keyUpate = 'DIM_AfterWeldRequestDate';
    let resultUpdate = [];
    let resultItem = pieceMarkDetailList.map(item => {
      // if (!item[keyUpate]) {
      //   item[keyUpate] = new Date();
      //   resultUpdate.push({ RowIndex: item.RowIndex, [keyUpate]: new Date() });
      // }
      if (item.DIM_AfterWeldRequestStatus < 2) {
        item[keyUpate] = new Date();
        resultUpdate.push({ RowIndex: item.RowIndex, [keyUpate]: new Date() });
      }
      return item;
    });
    setPieceMarkDetailList(resultItem);
    setPieceMarkUpdateList(resultUpdate);

    const updated = currentList.map((item) => {
      item.DIM_AfterWeldRequestDate = new Date();
      return item;
    });
    setCurrentList(updated);
  };





  const renderItem = ({ index, item }) => {
    let value = item.DIM_AfterWeldRequestDate;
    const isChecked = !!value;
    const isDisabled = item.DIM_AfterWeldResult && item.DIM_AfterWeldResult === Constant.STATUS_ACCEPT;
    return (
      <View style={styles.box} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellTitle}>
            <Text>PieceMark:</Text>
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
              disabled={isDisabled}
              onCheckColor={OPP_COLOR}
              onFillColor={isDisabled ? DISABLE_COLOR : BASE_COLOR}
              onTintColor={isDisabled ? DISABLE_COLOR : BASE_COLOR}
              tintColors={{ true: isDisabled ? DISABLE_COLOR : BASE_COLOR, false: '#aaaaaa' }}
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
    // 'Facility': facilityCode,
    'DrawingNo': { 'DrawingNo': drawingNo, 'Link': link },
    'Assembly': assemblyCode,
    'UserLogin': userLogin,
  };

  const headerAction = () => {
    Helper.openDrawingPDF(navigation, link, 'Open Cons Detail Drawing')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => getAllData()} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <>
              <Header data={headerData} action={headerAction}></Header>
            </>
          }
          <View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Team:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{team}</Text>
                <FontAwesomeIcon onPress={() => { setIsVisibleTeam(true) }}
                  style={styles.dataIcon} name='pencil' size={24} color={BASE_COLOR} />
              </View>
            </View>
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
                    ? <Icon name='times-circle' onPress={_onClearFilterPieceMarkNo} style={styles.headerActionInputIcon} />
                    : null
                }
              </View>
            </View>
            {/* <View style={styles.headerActionRow}>
              <Text style={styles.headerCellTitle}>Type:</Text>
              <TouchableOpacity
                style={styles.headerActionContainer}
                onPress={() => { setIsVisibleFilterType(true) }}>
                <Text style={styles.buttonTitleDark}>{filterType}</Text>
              </TouchableOpacity>
            </View> */}
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
          {
            (pieceMarkDetailList == null || isSearching)
              ?
              <ListLoadingData />
              :
              (!pieceMarkDetailList.length)
                ?
                <ListEmptyData />
                :
                <VirtualizedList
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
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={_onPressSubmitToServer}>
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
        visible={isVisibleTeam}
        data={teamList}
        onChangeItem={_onChangeTeam}
        onCancel={() => setIsVisibleTeam(false)}
        onClear={_onPressClearTeam}
      />
      {/* <SelectPopup
        visible={isVisibleFilterType}
        data={[Constant.PIECE_MARK_ALL, Constant.PIECE_MARK_CHECKED, Constant.PIECE_MARK_UNCHECKED]}
        onCancel={() => setIsVisibleFilterType(false)}
        onChangeItem={_onChangeFilterType}>
      </SelectPopup> */}
    </SafeAreaView>
  );
}

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const DISABLE_COLOR = '#aaaaaa';
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

  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 8,
  },
  dataTitle: {
    flex: 3,
  },
  dataItem: {
    flex: 7,
    flexShrink: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataText: {
    flexShrink: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  dataIcon: {
    marginLeft: 4,
    width: 24,
    height: 24,
  },
  dataRow: {
    flexDirection: 'row',
    margin: 4,
    minHeight: 24,
    marginBottom: 8
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
  textNote: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 4,
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
  buttonContainer: {
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

export default DIMAfterWeldDetailScreen;