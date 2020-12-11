import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, VirtualizedList, Modal, Dimensions, ScrollView, ActivityIndicator, Appearance } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import Helper from '../../utils/Helper';
import GetConstructionFacilityListAPI from '../../apis/construction/GetConstructionFacilityListAPI';
import GetConstructionDisciplineListAPI from '../../apis/construction/GetConstructionDisciplineListAPI';
import GetConstructionListAPI from '../../apis/construction/GetConstructionListAPI';
import MessageAlert from '../../components/MessageAlert';
import LoadingRefresh from '../../components/LoadingRefresh';

export default ({ route, navigation }) => {

  const CODE_FACILITY = 1;
  const CODE_DISCIPLINE = 2;
  const FACILITY_CODE_DEFAULT = 'All Facility Code';
  const DISCIPLINE_CODE_DEFAULT = 'All Discipline Code';
  const CONSTRUCTION_SEARCH = 1;
  const CONSTRUCTION_SPACE = 'SPACE';

  const { projectCode } = route.params;

  const [isShowDescription, setIsShowDescription] = useState({ show: true, name: 'arrow-up-circle-outline' });
  const iconColor = Appearance.getColorScheme() === 'dark' ? 'white' : 'black';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ paddingRight: 16 }} onPress={toggle}>
          <Ionicons size={24} name={isShowDescription.name} color={iconColor} />
        </TouchableOpacity>
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



  const [facilityList, setFacilityList] = useState([]);
  const [facilityCode, setFacilityCode] = useState(FACILITY_CODE_DEFAULT);
  const [isVisibleFacility, setVisibleFacility] = useState(false);

  const [discicplineList, setDiscicplineList] = useState([]);
  const [discicplineCode, setDisciplineCode] = useState(DISCIPLINE_CODE_DEFAULT);
  const [isVisibleDiscipline, setIsVisibleDiscipline] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [constructionList, setConstructionList] = useState(null);

  useEffect(
    () => {
      callAPI(getConstructionDataFilter);
    }, []
  );

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

  const getConstructionDataFilter = async () => {
    let token = await Helper.getData('TOKEN');
    try {
      await Promise.all([GetConstructionFacilityListAPI(projectCode, token), GetConstructionDisciplineListAPI(projectCode, token)])
        .then(([facilityResult, disciplineResult]) => {
          if (facilityResult.success && disciplineResult.success) {
            setFacilityList(facilityResult.data);
            setDiscicplineList(disciplineResult.data);
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

  const _onPressShowModel = (code) => {
    if (code == CODE_FACILITY) {
      setVisibleFacility(true);
    } else if (code == CODE_DISCIPLINE) {
      setIsVisibleDiscipline(true);
    }
  };

  const _onPressCancelModel = (code) => {
    if (code == CODE_FACILITY) {
      setVisibleFacility(false);
    } else if (code == CODE_DISCIPLINE) {
      setIsVisibleDiscipline(false);
    }
  };

  const _onPressClearModel = (code) => {
    if (code == CODE_FACILITY) {
      if (facilityCode !== FACILITY_CODE_DEFAULT) {
        setFacilityCode(FACILITY_CODE_DEFAULT);
        callAPI(searchConstruction, false);
        callAPI(() => { searchConstruction(FACILITY_CODE_DEFAULT, discicplineCode) }, false);
      }
      setVisibleFacility(false);
    } else if (code == CODE_DISCIPLINE) {
      if (discicplineCode !== DISCIPLINE_CODE_DEFAULT) {
        setDisciplineCode(DISCIPLINE_CODE_DEFAULT);
        callAPI(() => { searchConstruction(facilityCode, DISCIPLINE_CODE_DEFAULT) }, false);
      }
      setIsVisibleDiscipline(false);
    }
  };

  const _onChangeCode = (code, value) => {
    if (code == CODE_FACILITY) {
      if (value !== facilityCode) {
        setFacilityCode(value);
        callAPI(() => { searchConstruction(value, discicplineCode) }, false);
      }
      setVisibleFacility(false);
    } else if (code == CODE_DISCIPLINE) {
      if (value === '') {
        value = CONSTRUCTION_SPACE;
      }
      if (value !== discicplineCode) {
        setDisciplineCode(value);
        callAPI(() => { searchConstruction(facilityCode, value) }, false);
      }
      setIsVisibleDiscipline(false);
    }
  };

  const _onPressSearchConstruction = () => {
    callAPI(() => { searchConstruction(facilityCode, discicplineCode) }, false);
  };

  const searchConstruction = async (facilityCode, discicplineCode) => {
    let token = await Helper.getData('TOKEN');
    let mode = facilityCode !== FACILITY_CODE_DEFAULT || discicplineCode !== DISCIPLINE_CODE_DEFAULT ? CONSTRUCTION_SEARCH : 0;
    let facilityCodeSearch = (mode !== CONSTRUCTION_SEARCH || facilityCode == FACILITY_CODE_DEFAULT) ? '' : facilityCode;
    let discicplineCodeSearch = (mode !== CONSTRUCTION_SEARCH || discicplineCode == DISCIPLINE_CODE_DEFAULT) ? '' : discicplineCode;
    GetConstructionListAPI(projectCode, facilityCodeSearch, discicplineCodeSearch, mode, token)
      .then(res => {
        if (res.success) {
          setConstructionList(res.data);
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


  const ListSearchData = () => (
    <View style={styles.noDataContainer}>
      <ActivityIndicator size='large' color={BASE_COLOR} />
    </View>
  );

  const ListSelectData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Select FacilityCode and DisciplineCode</Text>
    </View>
  );

  const ListEmptyData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>No have any data</Text>
    </View>
  );

  const RenderConstructionList = () => {
    {
      if (isSearching) {
        return <ListSearchData />
      } else if (constructionList == null) {
        return <ListSelectData />
      } else if (!constructionList.length) {
        return <ListEmptyData />
      } else {
        return <VirtualizedList
          style={styles.table}
          data={constructionList}
          getItemCount={(data) => data.length}
          getItem={(data, index) => {
            return data[index];
          }}
          keyExtractor={(item) => {
            return item.RowIndex;
          }}
          renderItem={renderItem}
        />
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ConstructionID: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.ConstructionID)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ConstructionName: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.ConstructionName)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ActualProgress: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.ActualProgress)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>ActualMHRS: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.ActualMHRS)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>BaseBudgetMHRS: </Text>
            <Text style={styles.textData}>{formatEmptyData(item.BaseBudgetMHRS)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.textTitle}>RemainMHRS: </Text>
            {
              item.RemainMHRS < 0
                ?
                <Text style={[styles.textData, {color: 'red'}]}>{formatEmptyData(item.RemainMHRS)}</Text>
                :
                <Text style={[styles.textData, {color: 'green'}]}>{formatEmptyData(item.RemainMHRS)}</Text>
            }
          </View>
        </View>
      </View>
    );
  };

  const formatEmptyData = data => {
    return data != null ? data : '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        isLoading || isError
          ?
          <LoadingRefresh isLoading={isLoading} isError={isError} _onPressRefresh={() => callAPI(getConstructionDataFilter)} />
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
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>FacilityCode:</Text>
                    <TouchableOpacity style={styles.buttonSelect} onPress={() => _onPressShowModel(CODE_FACILITY)} >
                      <Text style={styles.buttonTitleDark}>{facilityCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle}>Discicpline:</Text>
                    <TouchableOpacity style={styles.buttonSelect} onPress={() => _onPressShowModel(CODE_DISCIPLINE)} >
                      <Text style={styles.buttonTitleDark}>{discicplineCode == CONSTRUCTION_SPACE ? '' : discicplineCode}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.infoTitle} />
                    <TouchableOpacity style={styles.searchButton} onPress={_onPressSearchConstruction} disabled={isSearching}>
                      <Text style={styles.buttonTitle}>Search Construction</Text>
                    </TouchableOpacity>
                  </View>
                </View>)
                :
                null
            }
            <RenderConstructionList />
          </View>
      }
      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisibleFacility}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <ScrollView>
                  {facilityList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeCode(CODE_FACILITY, item)}>
                        <Text style={modals.cell}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={() => _onPressClearModel(CODE_FACILITY)} >
                  <Text style={styles.buttonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={() => _onPressCancelModel(CODE_FACILITY)} >
                  <Text style={styles.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
      <Modal
        animationType='fade'
        transparent={true}
        visible={isVisibleDiscipline}>
        <View style={modals.dim}>
          <SafeAreaView>
            <View style={modals.container}>
              <View style={modals.list}>
                <ScrollView>
                  {discicplineList.map((item) => {
                    return (
                      <TouchableOpacity style={modals.row} onPress={() => _onChangeCode(CODE_DISCIPLINE, item)}>
                        <Text style={modals.cell}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={modals.action}>
                <TouchableOpacity style={modals.button} onPress={() => _onPressClearModel(CODE_DISCIPLINE)} >
                  <Text style={styles.buttonTitle}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modals.button} onPress={() => _onPressCancelModel(CODE_DISCIPLINE)} >
                  <Text style={styles.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OPP_COLOR,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: OPP_COLOR,
  },

  headerContainer: {
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
  buttonSelect: {
    flex: 7,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    height: '100%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
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
  buttonTitle: {
    color: OPP_COLOR,
  },
  buttonTitleDark: {
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
    paddingTop: 4,
    fontSize: 16,
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
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textTitle: {
    flex: 1,
  },
  textData: {
    flex: 1.5,
    fontWeight: 'bold',
    color: BASE_COLOR,
  },
});
const modals = StyleSheet.create({
  dim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: OPP_COLOR,
    width: windowWidth * 0.85,
    height: undefined,
    maxHeight: windowHeight * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    width: windowWidth * 0.85,
    height: undefined,
  },
  row: {
    flexDirection: 'row',
    height: 36,
    borderColor: BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 5,
    color: BASE_COLOR,
    paddingLeft: 4,
    paddingRight: 4,
  },
  action: {
    width: windowWidth * 0.85,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE_COLOR,
    padding: 4,
    marginRight: 8,
  },
});