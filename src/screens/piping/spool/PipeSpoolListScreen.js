import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Appearance, TextInput, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Networker from '../../../utils/Networker';
import Formater from '../../../utils/Formater';
import Helper from '../../../utils/Helper';
import CoreStyle from '../../../utils/CoreStyle';

import { GetFacilityListAPI } from '../../../apis/app/AppAPI';
import { GetPipeSpoolListAPI } from '../../../apis/piping/ConstructionAPI';

import { ListSelectData, ListLoadingData, ListEmptyData } from '../../../components/HelperUI';
import LoadingRefresh from '../../../components/LoadingRefresh';
import SelectPopup from '../../../components/SelectPopup';

const PipeSpoolListScreen = ({ route, navigation }) => {

  const { projectCode } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [spoolNo, setSpoolNo] = useState('');
  const [spoolList, setSpoolList] = useState(null);

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

  //-- Search Action
  const _onPressSearchSpool = () => {
    Keyboard.dismiss();
    callAPI(getSpoolData);
  };
  async function getSpoolData({ facility = facilityCode } = {}) {
    facility = (!facility || facility === FACILITY_CODE_DEFAULT) ? '' : facility;
    GetPipeSpoolListAPI(projectCode, facility, spoolNo)
      .then(res => {
        if (res.Success && res.Data) {
          setSpoolList(res.Data);
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

  //-- SpoolNo filter
  const _onChangeSpoolNo = no => {
    setSpoolNo(no);
  };

  //-- FacilityCode filter
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
  const _onChangeFacilityCode = data => {
    if (data !== facilityCode) {
      setFacilityCode(data);
    }
    setIsVisibleFacility(false);
  };
  const _onClearFacilityCode = () => {
    if (facilityCode !== FACILITY_CODE_DEFAULT) {
      setFacilityCode(FACILITY_CODE_DEFAULT);
    }
    setIsVisibleFacility(false);
  };

  //-- Detail
  const _onPressDetail = async (item) => {
    navigation.navigate(
      'PipeSpoolDetail',
      {
        projectCode: projectCode,
        facilityCode: item.FacilityCode,
        spoolNo: item.SpoolsNo,
      }
    );
  };

  //-- Render List
  const renderItem = ({ _, item }) => {
    return (
      <TouchableOpacity style={styles.box} onPress={() => _onPressDetail(item)}>
        <View style={styles.row}>
          <View style={styles.cellThree}>
            <Text>Facility: </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.FacilityCode)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellThree}>
            <Text>Spool:   </Text>
            <Text style={styles.textData}>{Formater.formatEmptyData(item.SpoolsNo)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const RenderList = () => {
    {
      if (isSearching) {
        return <ListLoadingData />
      } else if (!spoolList) {
        return <ListSelectData title={'Please select Facility / SpoolNo'} />
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
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getSpoolData)} />
          :
          <View style={styles.container}>
            {
              isShowDescription.show
                ?
                (<View style={styles.headerContainer}>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>Project:</Text>
                    <Text style={styles.infoData}>{projectCode}</Text>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.selectInput} onPress={() => setIsVisibleFacility(true)}>
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction}>SpoolNo:</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inputText}
                        value={spoolNo}
                        onChangeText={_onChangeSpoolNo}
                        underlineColorAndroid='transparent'
                      />
                      {
                        spoolNo == ''
                          ? null
                          : <Icon name='times-circle' onPress={() => _onChangeSpoolNo('')} style={styles.inputIcon} />
                      }
                    </View>
                  </View>
                  <View style={styles.rowInfoAction}>
                    <Text style={styles.infoTitleAction} />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={_onPressSearchSpool}
                      disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Spool</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            {
              spoolList && spoolList.length
                ?
                <>
                  <Text style={CoreStyle.textNote}>* Click an item to update detail</Text>
                  <VirtualizedList
                    style={styles.table}
                    data={spoolList}
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
          </View>
      }
      <SelectPopup
        visible={isVisibleFacility}
        data={facilityList}
        onCancel={() => setIsVisibleFacility(false)}
        onClear={_onClearFacilityCode}
        onChangeItem={_onChangeFacilityCode} />
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
    flex: 7,
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
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
  checkBox: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    width: 24,
    height: 24,
  },
  cellTitleLine: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellOne: {
    flex: 1,
    justifyContent: 'center',
  },
  cellThreeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTwo: {
    flex: 2,
    justifyContent: 'center',
  },
  cellThree: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cellImageAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textData: {
    fontWeight: 'bold',
    color: BASE_COLOR,
    flexWrap: 'wrap',
    flexShrink: 1,
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

export default PipeSpoolListScreen;