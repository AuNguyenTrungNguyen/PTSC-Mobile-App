import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

import Helper from '../../../utils/Helper';
import Formater from '../../../utils/Formater';
import Networker from '../../../utils/Networker';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetElectricalTerminateControlListAPI } from '../../../apis/eit/EITAPI';

import SelectPopup from '../../../components/SelectPopup';
import { ListSelectData, ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';

const ElectricalTerminationControlListScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [cableName, setCableName] = useState('');
  const [subSystem, setSubSystem] = useState('');
  const [cableList, setCableList] = useState(null);

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : BASE_COLOR;
  useLayoutEffect(() => {
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
    () => {
      callAPI(getFacilityList);
    }, []
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    callAPI(getCableList);
  }, [isFocused]
  );

  //-- Facility Code
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const [isVisibleFacility, setIsVisibleFacility] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const getFacilityList = async () => {
    const token = await Helper.getData('TOKEN');
    GetFacilityListAPI(projectCode, token)
      .then(res => {
        if (res.success) {
          setFacilityList(res.data);
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
  const _onChangeFacilityCode = code => {
    if (code !== facilityCode) {
      setFacilityCode(code);
    }
    setIsVisibleFacility(false);
  };
  const _onPressClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
    }
    setIsVisibleFacility(false);
  };

  //-- Search Action
  const _onPressSearchCable = () => {
    Keyboard.dismiss();
    callAPI(getCableList);
  };
  async function getCableList() {
    const facility = (facilityCode && facilityCode != FACILITY_CODE_DEFAULT) ? facilityCode : '';
    GetElectricalTerminateControlListAPI(projectCode, facility, cableName, subSystem)
      .then(res => {
        if (res.Success && res.Data) {
          setCableList(res.Data);
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
  const _onChangeName = name => {
    setCableName(name);
  };
  const _onChangeSubSystem = value => {
    setSubSystem(value);
  };

  //-- Detail
  const _onPressDetail = async item => {
    const userLogin = await Helper.getData('USERNAME');
    navigation.navigate(
      'ElectricalTerminationControlDetail',
      {
        projectCode: projectCode,
        rowIndex: item.RowIndex,
        facilityCode: item.FacilityCode,
        cableName: item.CableName,
        userLogin: userLogin,
        isGlandedFrom: item.IsGlandedFrom,
        isGlandedTo: item.IsGlandedTo,
      }
    );
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    const fromStatus = item.StatusFromTerminationDate ? 1 : 0;
    const toStatus = item.StatusToTerminationDate ? 1 : 0;
    const status = fromStatus + toStatus;
    const textStyle = status == 2 ? styles.textUpdated : status == 1 ? styles.textPending : styles.textData;
    const isGlandedFrom = item.IsGlandedFrom;
    const isGlandedTo = item.IsGlandedTo;
    const disabled = !isGlandedFrom && !isGlandedTo
    return (
      <TouchableOpacity
        style={!disabled ? styles.box : styles.disabledBox}
        onPress={() => _onPressDetail(item)}
        disabled={disabled}>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>Facility:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.FacilityCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>CableName:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.CableName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>SubSystem:</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatEmptyData(item.SubSystemNo)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'From\nGlanding Date:'}</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatDateData(item.StatusFromGlandingDate)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellOne}>
            <Text>{'To\nGlanding Date:'}</Text>
          </View>
          <View style={styles.cellTwo}>
            <Text style={textStyle}>{Formater.formatDateData(item.StatusToGlandingDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (!cableList) {
        return <ListSelectData title={'Please enter Cable Name'} />
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getCableList)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>ProjectCode:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectContainer} onPress={() => { setIsVisibleFacility(true) }}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>CableName:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={cableName}
                        onChangeText={_onChangeName}
                        underlineColorAndroid='transparent'
                      />
                      {
                        cableName == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeName('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>SubSystem:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={subSystem}
                        onChangeText={_onChangeSubSystem}
                        underlineColorAndroid='transparent'
                      />
                      {
                        subSystem == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeSubSystem('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchCable}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              cableList && cableList.length
                ?
                <VirtualizedList
                  style={styles.table}
                  data={cableList}
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
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onPressClearFacilityCode}
        onChangeItem={_onChangeFacilityCode}>
      </SelectPopup>
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
    height: 32,
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
  rowInfoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  infoTitleAction: {
    flex: 3,
  },
  selectContainer: {
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
  disabledBox: {
    backgroundColor: 'lightgray',
    flexDirection: 'column',
    borderColor: 'red',
    width: '100%',
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
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
  textUpdated: {
    fontWeight: 'bold',
    color: 'green',
  },
  textPending: {
    fontWeight: 'bold',
    color: 'orange',
  },

  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
    color: BASE_COLOR,
  },
});

export default ElectricalTerminationControlListScreen;