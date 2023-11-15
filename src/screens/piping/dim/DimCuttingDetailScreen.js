import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, TextInput, Appearance } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import Dialog from "react-native-dialog";

import {
  GetDimCuttingDetailSubContractorAPI,
  GetDimCuttingDetailAPI,
  UpdateDimCuttingDetailAPI
} from '../../../apis/piping/DimAPI';

import { GetLocationListSubContractorAPI, GetTeamListFilterSubContractorAPI, GetSerialNoAndHeatNoListAPI } from '../../../apis/app/AppAPI';

import Networker from '../../../utils/Networker';
import Constant from '../../../utils/Constant';
import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';

import { ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import Header from '../../../components/Header';
import SelectPopup from '../../../components/SelectPopup';
import SelectPopupTwoColumns from '../../../components/SelectPopupTwoColumns';

const DimCuttingDetailScreen = ({ route, navigation }) => {

  const { projectCode, subContractor, CPName, CPSheet, CPRev, userLogin, link } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isLocalChanged, setIsLocalChanged] = useState(false);
  const [dimCuttingBaseList, setDimCuttingBaseList] = useState([]);
  const [dimCuttingDetailList, setDimCuttingDetailList] = useState(null);
  const [dimCuttingUpdateList, setDimCuttingUpdateList] = useState([]);
  const [dimCuttingSerialList, setDimCuttingSerialList] = useState([]);

  const [filterKey, setFilterKey] = useState('ALL');
  const [isVisibleHelp, setIsVisibleHelp] = useState(false);

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
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => { setIsVisibleHelp(true) }}>
            <Ionicons
              size={24}
              name={'help-circle-outline'} color={iconColor} />
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
  }, [navigation, isShowDescription, isVisibleHelp]);


  //-- Get Data
  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
    Networker.callAPI(executedAPI(), () => { setIsLoading(false), setIsError(true) });
  };
  const getAllData = async () => {
    try {
      const token = await Helper.getData('TOKEN');
      const disciplineCode = await Helper.getData('DISCIPLINE_CODE');
      const arrayPromise = [
        GetDimCuttingDetailSubContractorAPI(projectCode, subContractor, CPName, CPSheet, CPRev, token),
        GetLocationListSubContractorAPI(projectCode, disciplineCode),
        GetTeamListFilterSubContractorAPI(projectCode, disciplineCode, Constant.CODE_FITUP),
      ];
      await Promise.all(arrayPromise)
        .then(([dimDetailResult, locationResult, teamResult]) => {
          if (dimDetailResult.Success && locationResult.success && teamResult.Success) {
            setDimCuttingBaseList(dimDetailResult.Data.List);
            setDimCuttingDetailList(dimDetailResult.Data.List);
            const keyUpateSerial = 'SerialNo';
            const keyUpdateHeatNo = 'HeatNo';
            if (!dimDetailResult.Data.ListSerial) {
              dimDetailResult.Data.ListSerial = [];
            }
            let array = [...dimDetailResult.Data.ListSerial];
            array.push({ CPItem: 'ALL', [keyUpateSerial]: '', [keyUpdateHeatNo]: '' });
            setDimCuttingSerialList(array);

            setTeam(dimDetailResult.Data.Team);
            setLocation(dimDetailResult.Data.Location);

            setLocationList(locationResult.data);
            setTeamList(teamResult.Data);

            if (dimDetailResult.Data.ItemCode) {
              GetSerialNoAndHeatNoListAPI(projectCode, dimDetailResult.Data.ItemCode, token)
                .then(res => {
                  if (res.Success) {
                    setSerialList(res.Data);
                    setIsLoading(false);
                    setIsError(false);
                  } else {
                    throw null
                  }
                })
                .catch(() => {
                  throw null
                });
            }
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
    } catch {
      setIsLoading(false);
      setIsError(true);
    }
  };
  useEffect(
    () => {
      callAPI(getAllData);
    }, [navigation]
  );

  //-- Submit Data
  const updateDimCuttingDetail = async () => {
    setIsUploading(true);
    const token = await Helper.getData('TOKEN');
    const listUpdate = Helper.handleListUpdate(dimCuttingUpdateList);
    UpdateDimCuttingDetailAPI(projectCode, CPName, CPSheet, CPRev, userLogin, listUpdate, dimCuttingSerialList, location, team, token)
      .then(res => {
        if (res.Success) {
          setDimCuttingUpdateList([]);
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
    if (dimCuttingUpdateList.length || isLocalChanged) {
      callAPI(updateDimCuttingDetail, false);
    } else {
      Toast.show('No any data changes!', Toast.SHORT);
    }
  };

  //-- Filter Action
  const _onFilterCPItem = value => {
    if (filterKey === value) {
      return;
    }
    setFilterKey(value);
    if (value === 'ALL') {
      setDimCuttingDetailList(dimCuttingBaseList);
    } else {
      const array = dimCuttingBaseList.filter(i => i.CPItem === value);
      setDimCuttingDetailList(array);
    }
    const arrayData = dimCuttingSerialList.filter(i => i.CPItem === value);
    const serials = arrayData.map(i => i.SerialNo);
    setSerialNo(serials);
    const heats = arrayData.map(i => i.HeatNo);
    setHeatNo(heats);
  };
  const [isAllCONS, setIsAllCONS] = useState(false);
  const [isAllQC, setIsAllQC] = useState(false);
  const _onChangeCheckboxFilter = data => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = 'DateCuttingForCON';
    let array = [...dimCuttingDetailList];
    let arrayUpdate = [...dimCuttingUpdateList];
    array.map(i => {
      if (i.DIM_ForCuttingRequestStatus !== 2) {
        i[keyUpate] = data;

        const objIndex = arrayUpdate.findIndex(obj => obj.RowIndex == i.RowIndex);
        if (objIndex < 0) {
          arrayUpdate.push({ RowIndex: i.RowIndex, [keyUpate]: data });
        } else {
          arrayUpdate[objIndex][keyUpate] = data;
        }
      }
      return i;
    });
    setDimCuttingDetailList(array);
    setDimCuttingUpdateList(arrayUpdate);
    setIsAllCONS(!!data);
  };
  const _onChangeCheckboxQCFilter = data => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = 'DIM_ForCuttingDate';
    let array = [...dimCuttingDetailList];
    let arrayUpdate = [...dimCuttingUpdateList];
    array.map(i => {
      if (i.DIM_ForCuttingRequestStatus !== 2) {
        i[keyUpate] = data;

        const objIndex = arrayUpdate.findIndex(obj => obj.RowIndex == i.RowIndex);
        if (objIndex < 0) {
          arrayUpdate.push({ RowIndex: i.RowIndex, [keyUpate]: data });
        } else {
          arrayUpdate[objIndex][keyUpate] = data;
        }
      }
      return i;
    });
    setDimCuttingDetailList(array);
    setDimCuttingUpdateList(arrayUpdate);
    setIsAllQC(!!data);
  };

  //-- Data Action
  const [isShowNote, setIsShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [noteDisplay, setNoteDisplay] = useState(null);
  const _onChangeNote = () => {
    // setNoteDisplay(noteDisplay);
    // setNote(noteDisplay);
    // setIsShowNote(false);
  };
  const _onClearNote = () => {
    // setNoteDisplay('');
    // setNote('');
    // setIsShowNote(false);
  };

  const [isVisibleSerial, setIsVisibleSerial] = useState(false);
  const [serialList, setSerialList] = useState([]);
  const [serialNo, setSerialNo] = useState('');
  const [heatNo, setHeatNo] = useState('');
  const _onChangeSerial = data => {
    setIsLocalChanged(true);
    const keyUpateSerial = 'SerialNo';
    const keyUpdateHeatNo = 'HeatNo';
    if (filterKey === 'ALL') {
      let arrayALL = [];
      arrayALL.push({ CPItem: 'ALL', [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      arrayALL.push({ CPItem: 'P.01', [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      arrayALL.push({ CPItem: 'P.02', [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      arrayALL.push({ CPItem: 'P.03', [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      arrayALL.push({ CPItem: 'P.04', [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      setDimCuttingSerialList(arrayALL);
    } else {
      let array = [...dimCuttingSerialList];
      const objIndex = array.findIndex(obj => obj.CPItem === filterKey);
      if (objIndex < 0) {
        array.push({ CPItem: filterKey, [keyUpateSerial]: data.SeriNo, [keyUpdateHeatNo]: data.HeatNo_TagNo });
      } else {
        array[objIndex][keyUpateSerial] = data.SeriNo;
        array[objIndex][keyUpdateHeatNo] = data.HeatNo_TagNo;
      }
      setDimCuttingSerialList(array);
    }
    setSerialNo(data.SeriNo);
    setHeatNo(data.HeatNo_TagNo);
    setIsVisibleSerial(false);
  };

  const [isVisibleLocation, setIsVisibleLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const _onPressClearLocation = () => {
    setIsLocalChanged(true);
    setLocation(null);
    setIsVisibleLocation(false);
  };
  const _onChangeLocation = data => {
    setIsLocalChanged(true);
    setLocation(data);
    setIsVisibleLocation(false);
  };

  const [isVisibleTeam, setIsVisibleTeam] = useState(false);
  const [team, setTeam] = useState(null);
  const [teamList, setTeamList] = useState([]);
  const _onPressClearTeam = () => {
    setIsLocalChanged(true);
    setTeam(null);
    setIsVisibleTeam(false);
  };
  const _onChangeTeam = data => {
    setIsLocalChanged(true);
    setTeam(data);
    setIsVisibleTeam(false);
  };

  //-- Item Action
  const _onChangeCheckbox = (index, rowIndex, data) => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = 'DateCuttingForCON';
    let array = [...dimCuttingDetailList];
    array[index][keyUpate] = data;
    setDimCuttingDetailList(array);

    array = [...dimCuttingUpdateList];
    let objIndex = array.findIndex(obj => obj.RowIndex == rowIndex);
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyUpate]: data });
    } else {
      array[objIndex][keyUpate] = data;
    }
    setDimCuttingUpdateList(array);
  };
  const _onChangeCheckboxQC = (index, rowIndex, data) => {
    if (data) {
      data = new Date();
    } else {
      data = null;
    }
    const keyUpate = 'DIM_ForCuttingDate';
    let array = [...dimCuttingDetailList];
    array[index][keyUpate] = data;
    setDimCuttingDetailList(array);

    array = [...dimCuttingUpdateList];
    let objIndex = array.findIndex(obj => obj.RowIndex == rowIndex);
    if (objIndex < 0) {
      array.push({ RowIndex: rowIndex, [keyUpate]: data });
    } else {
      array[objIndex][keyUpate] = data;
    }
    setDimCuttingUpdateList(array);
  };



  //-- Render Filter
  const RenderFilterItem = ({ data }) => {
    return (
      filterKey === data
        ?
        <TouchableOpacity style={styles.filterItemSelected} onPress={() => _onFilterCPItem(data)}>
          <Text style={styles.filterTextSelected}>{data}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.filterItem} onPress={() => _onFilterCPItem(data)}>
          <Text style={styles.filterText}>{data}</Text>
        </TouchableOpacity>
    );
  };

  //-- Render Header
  const headerData = {
    'ProjectCode': projectCode + '  ' + '-' + '  ' + subContractor,
    'CPName': { 'CPName': CPName, 'Link': link },
    'CPSheet': CPSheet,
    'CPRev': CPRev,
  };
  const headerAction = () => {
    Helper.openDrawingPDF(navigation, link, 'Dim Cutting Drawing')
  };

  //-- Render Detail
  const renderItem = ({ index, item }) => {
    let value = item.DateCuttingForCON;
    let valueQC = item.DIM_ForCuttingDate;
    const isChecked = !!value;
    const isCheckedQC = !!valueQC;
    const resultStyle = item.DIM_ForCuttingRequestStatus === 2
      ? styles.textAccept
      : item.DIM_ForCuttingRequestStatus === 1
        ? styles.textReject
        : styles.textData;
    return (
      <View style={styles.box} key={item.RowIndex}>
        <View style={styles.row}>
          <View style={styles.cellData}>
            <Text style={resultStyle}>{Formater.formatEmptyData(item.CuttingPlanPiece)}</Text>
          </View>
          <View style={styles.cellCheckbox}>
            <CheckBox
              value={isChecked}
              onValueChange={newValue => _onChangeCheckbox(index, item.RowIndex, newValue)}
              style={styles.checkBox}
              boxType='square'
              disabled={item.DIM_ForCuttingRequestStatus === 2}
              onCheckColor={OPP_COLOR}
              onFillColor={BASE_COLOR}
              onTintColor={BASE_COLOR}
              tintColors={{ true: BASE_COLOR, false: '#aaaaaa' }}
              animationDuration={0.2}
              onAnimationType='flat'
            />
          </View>
          <View style={styles.cellCheckbox}>
            <CheckBox
              value={isCheckedQC}
              onValueChange={newValue => _onChangeCheckboxQC(index, item.RowIndex, newValue)}
              style={styles.checkBox}
              boxType='square'
              disabled={item.DIM_ForCuttingRequestStatus === 2}
              onCheckColor={OPP_COLOR}
              onFillColor={QC_COLOR}
              tintColor={QC_COLOR}
              onTintColor={QC_COLOR}
              tintColors={{ true: QC_COLOR, false: QC_COLOR }}
              animationDuration={0.2}
              onAnimationType='flat'
            />
          </View>
        </View>
      </View>
    );
  };
  const RenderList = () => {
    {
      if (dimCuttingDetailList == null) {
        return <ListLoadingData />
      } else if (!dimCuttingDetailList.length) {
        return <ListEmptyData />
      }
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading || isError
        ?
        <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getAllData)} />
        :
        <View style={styles.container}>
          {
            isShowDescription.show &&
            <>
              <Header data={headerData} action={headerAction}></Header>
            </>
          }
          <>
            {/* <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Location:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{note}</Text>
                <FontAwesomeIcon onPress={() => { setIsShowNote(true); }}
                  style={styles.dataIcon} name='pencil' size={24} color={BASE_COLOR} />
              </View>
            </View> */}
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Team:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{team}</Text>
                <FontAwesomeIcon onPress={() => { setIsVisibleTeam(true) }}
                  style={styles.dataIcon} name='pencil' size={24} color={BASE_COLOR} />
              </View>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Location:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{location}</Text>
                <FontAwesomeIcon onPress={() => { setIsVisibleLocation(true) }}
                  style={styles.dataIcon} name='pencil' size={24} color={BASE_COLOR} />
              </View>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Serial:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{serialNo}</Text>
                <FontAwesomeIcon onPress={() => { setIsVisibleSerial(true) }}
                  style={styles.dataIcon} name='pencil' size={24} color={BASE_COLOR} />
              </View>
              <Text style={styles.dataTitle}>Heat:</Text>
              <View style={styles.dataItem}>
                <Text style={styles.dataText}>{heatNo}</Text>
              </View>
            </View>
          </>
          <View style={styles.filterContainer}>
            <RenderFilterItem data={'ALL'} />
            <RenderFilterItem data={'P.01'} />
            <RenderFilterItem data={'P.02'} />
            <RenderFilterItem data={'P.03'} />
            <RenderFilterItem data={'P.04'} />
          </View>
          <View style={styles.dataRow}>
            <View style={styles.cellData}>
            </View>
            <View style={styles.cellCheckbox}>
              <CheckBox
                value={isAllCONS}
                onValueChange={newValue => _onChangeCheckboxFilter(newValue)}
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
            <View style={styles.cellCheckbox}>
              <CheckBox
                value={isAllQC}
                onValueChange={newValue => _onChangeCheckboxQCFilter(newValue)}
                style={styles.checkBox}
                boxType='square'
                disabled={false}
                onCheckColor={OPP_COLOR}
                onFillColor={QC_COLOR}
                tintColor={QC_COLOR}
                onTintColor={QC_COLOR}
                tintColors={{ true: QC_COLOR, false: QC_COLOR }}
                animationDuration={0.2}
                onAnimationType='flat'
              />
            </View>
          </View>
          {
            dimCuttingDetailList && dimCuttingDetailList.length
              ?
              <>
                <VirtualizedList
                  style={styles.table}
                  data={dimCuttingDetailList}
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
            <TouchableOpacity style={styles.buttonContainer} onPress={_onPressSubmitToServer}>
              <Text style={styles.buttonTitle}>Submit to Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <Dialog.Container visible={isVisibleHelp}>
        <Dialog.Description style={{ color: BASE_COLOR }}>
          Checkbox this color for PIECE MARK.
        </Dialog.Description>
        <Dialog.Description style={{ color: QC_COLOR }}>
          Checkbox this color for send DIM CUTTING to QC.
        </Dialog.Description>
        <Dialog.Button label='Cancel' onPress={() => { setIsVisibleHelp(false) }} />
      </Dialog.Container>
      <SelectPopupTwoColumns
        visible={isVisibleSerial}
        leftHeader={'SeriNo'}
        rightHeader={'HeatNo'}
        leftKey={'SeriNo'}
        rightKey={'HeatNo_TagNo'}
        data={serialList}
        onChangeItem={_onChangeSerial}
        onCancel={() => setIsVisibleSerial(false)}
      />
      <SelectPopup
        visible={isVisibleTeam}
        data={teamList}
        onChangeItem={_onChangeTeam}
        onCancel={() => setIsVisibleTeam(false)}
        onClear={_onPressClearTeam}
      />
      <SelectPopup
        visible={isVisibleLocation}
        data={locationList}
        onChangeItem={_onChangeLocation}
        onCancel={() => setIsVisibleLocation(false)}
        onClear={_onPressClearLocation}
      />
      {/* <Dialog.Container visible={isShowNote}>
        <Dialog.Title>{'Enter note:'}</Dialog.Title>
        <Dialog.Input
          value={noteDisplay}
          onChangeText={(text) => setNoteDisplay(text)}
          underlineColorAndroid={BASE_COLOR}
        />
        <Dialog.Button label='Cancel' onPress={() => { setIsShowNote(false) }} />
        <Dialog.Button label='Clear' onPress={_onClearNote} />
        <Dialog.Button label='OK' onPress={_onChangeNote} />
      </Dialog.Container> */}
      <AwesomeAlert
        progressColor={BASE_COLOR}
        show={isUploading}
        showProgress={true}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const QC_COLOR = 'red';
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
    width: 24,
    height: 24,
  },
  dataRow: {
    flexDirection: 'row',
    margin: 4,
    minHeight: 24,
    marginBottom: 8
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 28,
    marginBottom: 8,
  },
  filterItemSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterTextSelected: {
    fontWeight: 'bold',
    color: 'green',
  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterText: {
    fontWeight: 'bold',
    color: BASE_COLOR,
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
  textAccept: {
    fontWeight: 'bold',
    color: 'green',
  },
  textReject: {
    fontWeight: 'bold',
    color: 'red',
  },

  actionContainer: {
    marginTop: 12,
    height: 36,
    flexDirection: 'row',
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
});

export default DimCuttingDetailScreen;