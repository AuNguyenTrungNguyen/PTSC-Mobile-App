import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Keyboard, VirtualizedList, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetDimCuttingListAPI } from '../../../apis/piping/DimAPI';

import { ListLoadingData, ListSelectData, ListEmptyData } from '../../../components/HelperUI';
import SelectPopup from '../../../components/SelectPopup';
import MessageAlert from '../../../components/MessageAlert';
import LoadingRefresh from '../../../components/LoadingRefresh';

const DimCuttingListScreen = ({ route, navigation }) => {

  const { projectCode, userLogin } = route.params;

  const FACILITY_CODE_DEFAULT = 'All Facility Code';

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [dimCuttingList, setDimCuttingList] = useState(null);
  const [CPName, setCPName] = useState('');
  const [oldCPName, setOldCPName] = useState(null);

  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);

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

  //-- Get Data
  const callAPI = (executedAPI, loading = true) => {
    if (loading) {
      setIsLoading(true);
    }
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
      callAPI(getFacilityList);
    }, []
  );

  //-- FacilityCode
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
  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
      callAPI(() => { searchDimCutting(code, CPName) }, false);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
      callAPI(() => { searchConstruction('', CPName) }, false);
    }
    setIsVisibleFacility(false);
  };

  //-- CPName
  const _onChangeCPName = no => {
    setCPName(no);
  };
  const searchDimCutting = async (facilityCode, CPName) => {
    setIsSearching(true);
    const token = await Helper.getData('TOKEN');
    facilityCode = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    CPName = CPName ? CPName : '';
    GetDimCuttingListAPI(projectCode, facilityCode, CPName, token)
      .then(res => {
        if (res.Success) {
          setDimCuttingList(res.Data);
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
  const _onPressSearchDimCutting = () => {
    if (oldCPName !== CPName) {
      Keyboard.dismiss();
      setOldCPName(CPName);
      callAPI(() => { searchDimCutting(facilityCode, CPName) }, false);
    }
  };

  //-- Item Action
  const _onPressViewDetail = item => {
    Keyboard.dismiss();
    navigation.navigate(
      'DimCuttingDetail',
      {
        projectCode: projectCode,
        userLogin: userLogin,
        CPName: item.CuttingPlanName,
        CPSheet: item.CPSheet,
        CPRev: item.CPRev,
        link: item.WebLink,
      }
    );
  };


  //-- Render List
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => _onPressViewDetail(item)}>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>CPName:</Text>
          {
            item.WebLink
              ?
              <TouchableOpacity onPress={() => Helper.openDrawingPDF(navigation, item.WebLink, 'Dim Cutting Drawing')} style={styles.cellData}>
                <Text style={CoreStyle.textLinkWithLine}>{item.CuttingPlanName}</Text>
              </TouchableOpacity>
              :
              <Text style={styles.cellData}>{item.CuttingPlanName}</Text>
          }
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>CPSheet:</Text>
          <Text style={styles.cellData}>{item.CPSheet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellTitle}>CPRev:</Text>
          <Text style={styles.cellData}>{item.CPRev}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (dimCuttingList == null) {
        return <ListSelectData title={'Enter FacilityCode or CPName'} />
      } else if (!dimCuttingList.length) {
        return <ListEmptyData />
      } else {
        return (
          <>
            <Text style={CoreStyle.textNote}>* Click an item to view detail</Text>
            <VirtualizedList
              style={styles.table}
              data={dimCuttingList}
              getItemCount={data => data.length}
              getItem={(data, index) => {
                return data[index];
              }}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
            />
          </>
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError}
            _onPressRefresh={() => { callAPI(() => { searchDimCutting(facilityCode, CPName) }, true) }} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                <View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>ProjectCode:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => { setIsVisibleFacility(true) }}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>CPName:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={CPName}
                        onChangeText={_onChangeCPName}
                        underlineColorAndroid='transparent'
                      />
                      {CPName == ''
                        ? null
                        : <Icon name='times-circle' onPress={() => _onChangeCPName('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchDimCutting}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Dim Cutting</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                null
            }
            <RenderList />
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onPressClearFacilityCode}
        onChangeItem={_onChangeFacilityCode}>
      </SelectPopup>
    </SafeAreaView >
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
  selectInput: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
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
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cellTitle: {
    flex: 3,
  },
  cellData: {
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
  },
  cellValue: {
    flex: 1,
    fontWeight: 'bold',
    color: BASE_COLOR,
    justifyContent: 'center',
  },
  cellProgress: {
    flex: 5,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cellAction: {
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAction: {
    color: BASE_COLOR,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },

  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default DimCuttingListScreen;